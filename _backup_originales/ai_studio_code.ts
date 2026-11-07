export type AdaptationFidelity = 'CANONICAL' | 'HISTORICAL_CONTEXT' | 'DRAMATIC_ADAPTATION';

export type GraphicsQuality = 'LOW' | 'MEDIUM' | 'HIGH' | 'ULTRA';

export type CameraMode = 'THIRD_PERSON' | 'FIRST_PERSON';

export type GamePhase =
  | 'PROLOGUE_CINEMATIC'
  | 'TITLE_SCREEN'
  | 'MAIN_MENU'
  | 'PLAYING'
  | 'CINEMATIC_CUTSCENE'
  | 'PAUSED';

export interface ScriptureReference {
  book: string;
  chapter: number;
  verses: string;
  summaryText: string;
  adaptationType: AdaptationFidelity;
  adaptationNote: string;
}

export interface CharacterCustomization {
  name: string;
  skinTone: string;
  tunicPrimaryColor: string;
  mantleSecondaryColor: string;
  beardStyle: 'NONE' | 'SHORT' | 'FULL_PROPHETIC';
  hairColor: string;
}

export interface Vector3Tuple {
  x: number;
  y: number;
  z: number;
}

export interface MissionObjective {
  id: string;
  title: string;
  description: string;
  type: 'REACH_LOCATION' | 'TALK_TO_NPC' | 'INSPECT_OBJECT' | 'MAKE_DECISION';
  targetId: string;
  targetPosition: Vector3Tuple;
  radius: number;
  completed: boolean;
  scriptureRef: ScriptureReference;
}

export interface DialogueChoice {
  id: string;
  text: string;
  nextNodeId: string | null;
  consequenceTag?: string;
  unlocksObjectiveId?: string;
  grantCodexEntryId?: string;
}

export interface DialogueNode {
  id: string;
  speakerName: string;
  speakerRole: string;
  text: string;
  scriptureRef: ScriptureReference;
  cameraFocusOffset?: Vector3Tuple;
  choices: DialogueChoice[];
}

export interface NPCDefinition {
  id: string;
  name: string;
  role: string;
  position: Vector3Tuple;
  rotationY: number;
  appearance: {
    skinTone: string;
    tunicColor: string;
    mantleColor: string;
    hairColor: string;
    hasBeard: boolean;
    isCelestial?: boolean;
    scale?: number;
    externalModelUrl?: string; // Preparado para reemplazo directo con .glb AAA
  };
  initialDialogueId: string;
}

export interface InteractiveObjectDefinition {
  id: string;
  name: string;
  subtitle: string;
  position: Vector3Tuple;
  interactionRadius: number;
  type: 'TREE_OF_KNOWLEDGE' | 'TREE_OF_LIFE' | 'RIVER_ALTAR' | 'SCROLL_RELIC';
  dialogueNodeId: string;
  scriptureRef: ScriptureReference;
}

export interface MissionDefinition {
  id: string;
  chapterId: string;
  title: string;
  subtitle: string;
  biblicalBook: string;
  introCinematicText: string[];
  scriptureRef: ScriptureReference;
  objectives: MissionObjective[];
  rewardCodexTitle: string;
}

export interface ChapterDefinition {
  id: string;
  order: number;
  testament: 'OLD_TESTAMENT' | 'NEW_TESTAMENT';
  bookName: string;
  title: string;
  eraDescription: string;
  unlockedByDefault: boolean;
  isPlayableInBuild: boolean;
  spawnPosition: Vector3Tuple;
  missions: MissionDefinition[];
  npcs: NPCDefinition[];
  interactiveObjects: InteractiveObjectDefinition[];
  dialogues: Record<string, DialogueNode>;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'RELIC' | 'SCROLL' | 'TOOL';
  description: string;
  biblicalReference: string;
  acquiredAt: number;
}

export interface PlayerSaveData {
  userId: string;
  profileName: string;
  character: CharacterCustomization;
  currentChapterId: string;
  currentMissionId: string;
  completedChapterIds: string[];
  completedMissionIds: string[];
  completedObjectiveIds: string[];
  decisionFlags: Record<string, string>;
  checkpointPosition: Vector3Tuple;
  inventory: InventoryItem[];
  unlockedCodexIds: string[];
  graphicsQuality: GraphicsQuality;
  updatedAt: number;
}