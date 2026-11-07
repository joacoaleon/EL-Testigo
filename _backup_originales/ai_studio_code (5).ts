import { create } from 'zustand';
import {
  CameraMode,
  CharacterCustomization,
  DialogueNode,
  GamePhase,
  GraphicsQuality,
  InventoryItem,
  MissionObjective,
  PlayerSaveData,
  Vector3Tuple
} from '../types/game.types';
import { CAMPAIGN_CHAPTERS } from '../content/campaignCatalog';
import { PersistenceService } from '../database/persistenceService';
import { soundEngine } from './soundEngine';

interface NearbyInteractable {
  id: string;
  name: string;
  roleOrSubtitle: string;
  type: 'NPC' | 'OBJECT';
  dialogueId: string;
}

interface GameState {
  phase: GamePhase;
  cameraMode: CameraMode;
  graphicsQuality: GraphicsQuality;
  persistenceMode: 'CLOUD_FIRESTORE' | 'LOCAL_STORAGE';
  lastSaveStatus: string;

  character: CharacterCustomization;
  playerPosition: Vector3Tuple;
  playerRotationY: number;
  isMoving: boolean;
  isRunning: boolean;
  isAttackingOrAction: boolean;

  currentChapterId: string;
  currentMissionId: string;
  objectives: MissionObjective[];
  completedChapterIds: string[];
  completedMissionIds: string[];
  decisionFlags: Record<string, string>;
  inventory: InventoryItem[];
  unlockedCodexIds: string[];

  nearbyInteractable: NearbyInteractable | null;
  activeDialogue: DialogueNode | null;
  activeNotification: { title: string; subtitle: string; scripture?: string } | null;
  missionCompletedModal: boolean;

  // Acciones del motor
  initEngine: () => Promise<void>;
  setPhase: (phase: GamePhase) => void;
  toggleCameraMode: () => void;
  setGraphicsQuality: (q: GraphicsQuality) => void;
  updateCharacterCustomization: (partial: Partial<CharacterCustomization>) => void;
  updatePlayerTransform: (pos: Vector3Tuple, rotY: number, moving: boolean, running: boolean) => void;
  triggerActionAnimation: () => void;
  setNearbyInteractable: (item: NearbyInteractable | null) => void;
  interactWithCurrentTarget: () => void;
  selectDialogueChoice: (choiceId: string) => void;
  closeDialogue: () => void;
  saveGameManualOrAuto: (reason?: string) => Promise<void>;
  loadSavedGame: () => Promise<boolean>;
  startNewCampaign: () => Promise<void>;
  dismissNotification: () => void;
  closeMissionCompleteModal: () => void;
}

const DEFAULT_CHARACTER: CharacterCustomization = {
  name: 'El Testigo',
  skinTone: '#c98e60',
  tunicPrimaryColor: '#2b3a4a',
  mantleSecondaryColor: '#8c6d3b',
  beardStyle: 'SHORT',
  hairColor: '#1f1610'
};

export const useGameStore = create<GameState>((set, get) => ({
  phase: 'PROLOGUE_CINEMATIC',
  cameraMode: 'THIRD_PERSON',
  graphicsQuality: 'HIGH',
  persistenceMode: 'LOCAL_STORAGE',
  lastSaveStatus: 'Sin guardar aún',

  character: DEFAULT_CHARACTER,
  playerPosition: { x: 0, y: 0, z: 22 },
  playerRotationY: Math.PI,
  isMoving: false,
  isRunning: false,
  isAttackingOrAction: false,

  currentChapterId: 'chapter_1_eden',
  currentMissionId: 'mission_eden_1',
  objectives: JSON.parse(JSON.stringify(CAMPAIGN_CHAPTERS[0].missions[0].objectives)),
  completedChapterIds: [],
  completedMissionIds: [],
  decisionFlags: {},
  inventory: [
    {
      id: 'item_witness_scroll',
      name: 'Rollo de las Crónicas',
      category: 'SCROLL',
      description: 'Pergamino donde El Testigo registra los acontecimientos fieles de las Escrituras.',
      biblicalReference: 'Lucas 1:1-4 / Apocalipsis 1:19',
      acquiredAt: Date.now()
    }
  ],
  unlockedCodexIds: [],

  nearbyInteractable: null,
  activeDialogue: null,
  activeNotification: null,
  missionCompletedModal: false,

  initEngine: async () => {
    const session = await PersistenceService.initializeSession();
    set({ persistenceMode: session.mode });
  },

  setPhase: (phase) => set({ phase }),

  toggleCameraMode: () =>
    set((s) => ({
      cameraMode: s.cameraMode === 'THIRD_PERSON' ? 'FIRST_PERSON' : 'THIRD_PERSON'
    })),

  setGraphicsQuality: (graphicsQuality) => set({ graphicsQuality }),

  updateCharacterCustomization: (partial) =>
    set((s) => ({ character: { ...s.character, ...partial } })),

  updatePlayerTransform: (pos, rotY, moving, running) =>
    set({
      playerPosition: pos,
      playerRotationY: rotY,
      isMoving: moving,
      isRunning: running
    }),

  triggerActionAnimation: () => {
    set({ isAttackingOrAction: true });
    setTimeout(() => set({ isAttackingOrAction: false }), 600);
  },

  setNearbyInteractable: (nearbyInteractable) => set({ nearbyInteractable }),

  interactWithCurrentTarget: () => {
    const state = get();
    if (!state.nearbyInteractable || state.activeDialogue) return;

    const chapter = CAMPAIGN_CHAPTERS.find((c) => c.id === state.currentChapterId);
    if (!chapter) return;

    const dlg = chapter.dialogues[state.nearbyInteractable.dialogueId];
    if (!dlg) return;

    soundEngine.playInteractionChime();
    set({ activeDialogue: dlg });

    // Verificar si esta interacción completa el objetivo activo en orden o por ID
    const targetId = state.nearbyInteractable.id;
    const updatedObjectives = state.objectives.map((obj) => {
      if (!obj.completed && obj.targetId === targetId) {
        soundEngine.playObjectiveComplete();
        set({
          activeNotification: {
            title: `Objetivo Completado: ${obj.title}`,
            subtitle: obj.scriptureRef.summaryText,
            scripture: `${obj.scriptureRef.book} ${obj.scriptureRef.chapter}:${obj.scriptureRef.verses}`
          }
        });
        return { ...obj, completed: true };
      }
      return obj;
    });

    set({ objectives: updatedObjectives });
    get().saveGameManualOrAuto('Punto de control automático');
  },

  selectDialogueChoice: (choiceId) => {
    const state = get();
    if (!state.activeDialogue) return;

    const choice = state.activeDialogue.choices.find((c) => c.id === choiceId);
    if (!choice) return;

    soundEngine.playInteractionChime();

    const newFlags = { ...state.decisionFlags };
    if (choice.consequenceTag) {
      newFlags[choice.consequenceTag] = 'true';
    }

    const newCodex = [...state.unlockedCodexIds];
    const newInventory = [...state.inventory];

    if (choice.grantCodexEntryId && !newCodex.includes(choice.grantCodexEntryId)) {
      newCodex.push(choice.grantCodexEntryId);
      if (choice.grantCodexEntryId === 'codex_protoevangelium') {
        newInventory.push({
          id: 'item_protoevangelium_seal',
          name: 'Testimonio de Génesis 3:15',
          category: 'RELIC',
          description: 'Registro de la primera promesa mesiánica proclamada en el Edén.',
          biblicalReference: 'Génesis 3:15',
          acquiredAt: Date.now()
        });
      }
    }

    const chapter = CAMPAIGN_CHAPTERS.find((c) => c.id === state.currentChapterId);
    const nextNode = choice.nextNodeId && chapter ? chapter.dialogues[choice.nextNodeId] : null;

    // Verificar si todos los objetivos de la misión están completos al cerrar el diálogo final
    const allCompleted = state.objectives.every((o) => o.completed);
    const completedMissions = [...state.completedMissionIds];
    let showModal = state.missionCompletedModal;

    if (allCompleted && !nextNode && !completedMissions.includes(state.currentMissionId)) {
      completedMissions.push(state.currentMissionId);
      showModal = true;
      soundEngine.playObjectiveComplete();
    }

    set({
      decisionFlags: newFlags,
      unlockedCodexIds: newCodex,
      inventory: newInventory,
      activeDialogue: nextNode,
      completedMissionIds: completedMissions,
      missionCompletedModal: showModal
    });

    if (!nextNode) {
      get().saveGameManualOrAuto('Progreso de diálogo guardado');
    }
  },

  closeDialogue: () => set({ activeDialogue: null }),

  saveGameManualOrAuto: async (reason = 'Guardado manual') => {
    const s = get();
    const savePayload: PlayerSaveData = {
      userId: 'player',
      profileName: s.character.name,
      character: s.character,
      currentChapterId: s.currentChapterId,
      currentMissionId: s.currentMissionId,
      completedChapterIds: s.completedChapterIds,
      completedMissionIds: s.completedMissionIds,
      completedObjectiveIds: s.objectives.filter((o) => o.completed).map((o) => o.id),
      decisionFlags: s.decisionFlags,
      checkpointPosition: s.playerPosition,
      inventory: s.inventory,
      unlockedCodexIds: s.unlockedCodexIds,
      graphicsQuality: s.graphicsQuality,
      updatedAt: Date.now()
    };

    const res = await PersistenceService.saveProgress(savePayload);
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    set({ lastSaveStatus: `${reason} (${res.source}) - ${timeStr}` });
  },

  loadSavedGame: async () => {
    const saved = await PersistenceService.loadProgress();
    if (!saved) return false;

    const chapter = CAMPAIGN_CHAPTERS.find((c) => c.id === saved.currentChapterId) || CAMPAIGN_CHAPTERS[0];
    const mission = chapter.missions[0];
    const restoredObjectives = mission.objectives.map((obj) => ({
      ...obj,
      completed: saved.completedObjectiveIds.includes(obj.id)
    }));

    set({
      character: saved.character || DEFAULT_CHARACTER,
      currentChapterId: saved.currentChapterId,
      currentMissionId: saved.currentMissionId,
      completedChapterIds: saved.completedChapterIds || [],
      completedMissionIds: saved.completedMissionIds || [],
      objectives: restoredObjectives,
      decisionFlags: saved.decisionFlags || {},
      playerPosition: saved.checkpointPosition || chapter.spawnPosition,
      inventory: saved.inventory || [],
      unlockedCodexIds: saved.unlockedCodexIds || [],
      graphicsQuality: saved.graphicsQuality || 'HIGH',
      phase: 'PLAYING',
      lastSaveStatus: 'Partida recuperada correctamente'
    });
    return true;
  },

  startNewCampaign: async () => {
    PersistenceService.clearLocalSave();
    const firstChapter = CAMPAIGN_CHAPTERS[0];
    set({
      currentChapterId: firstChapter.id,
      currentMissionId: firstChapter.missions[0].id,
      objectives: JSON.parse(JSON.stringify(firstChapter.missions[0].objectives)),
      completedChapterIds: [],
      completedMissionIds: [],
      decisionFlags: {},
      playerPosition: { ...firstChapter.spawnPosition },
      activeDialogue: null,
      missionCompletedModal: false,
      phase: 'PLAYING'
    });
    await get().saveGameManualOrAuto('Inicio de Campaña');
  },

  dismissNotification: () => set({ activeNotification: null }),
  closeMissionCompleteModal: () => set({ missionCompletedModal: false })
}));