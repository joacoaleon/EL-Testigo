import { useEffect, useMemo, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { MainMenuAndPrologue } from './components/ui/MainMenuAndPrologue';
import { CelestialPrologueScene } from './components/scenes/CelestialPrologueScene';
import { EdenEnvironment } from './components/scenes/EdenEnvironment';
import { PlayerController } from './components/camera/PlayerController';
import { CAMPAIGN_CHAPTERS } from './content/campaignCatalog';
import { useGameStore } from './engine/useGameStore';

export default function App() {
  const {
    phase, setPhase, initEngine, activeDialogue, closeDialogue, selectDialogueChoice,
    nearbyInteractable, currentChapterId, currentMissionId, objectives,
    activeNotification, dismissNotification, missionCompletedModal, closeMissionCompleteModal
  } = useGameStore();
  const [webglAvailable, setWebglAvailable] = useState<boolean | null>(null);
  useEffect(() => { void initEngine(); }, [initEngine]);
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('webgl2') || canvas.getContext('webgl');
      setWebglAvailable(Boolean(context));
    } catch {
      setWebglAvailable(false);
    }
  }, []);
  const showWorld = (phase === 'PLAYING' || phase === 'PROLOGUE_CINEMATIC') && webglAvailable === true;
  const chapter = useMemo(() => CAMPAIGN_CHAPTERS.find((item) => item.id === currentChapterId), [currentChapterId]);
  const mission = chapter?.missions.find((item) => item.id === currentMissionId) ?? chapter?.missions[0];
  const activeObjective = objectives.find((objective) => !objective.completed);
  const completedCount = objectives.filter((objective) => objective.completed).length;

  return <div className="h-screen w-screen overflow-hidden bg-black">
    {showWorld && <Canvas shadows camera={{ position: [0, 3, 10], fov: 60 }}>{phase === 'PROLOGUE_CINEMATIC' ? <CelestialPrologueScene /> : <><EdenEnvironment /><PlayerController /></>}</Canvas>}
    {webglAvailable === false && phase === 'PLAYING' && <div className="fixed inset-0 z-10 flex items-center justify-center bg-stone-950 p-8 text-center text-stone-100"><div className="max-w-lg rounded-2xl border border-amber-500/40 bg-stone-900 p-8"><h2 className="mb-3 text-2xl font-bold text-amber-300">Modo 3D no disponible</h2><p className="mb-6 text-stone-300">El navegador no pudo activar WebGL. Podés revisar la aceleración gráfica de Chrome o continuar viendo el menú y la historia en modo compatible.</p><button className="rounded bg-amber-500 px-4 py-2 font-semibold text-stone-950" onClick={() => setPhase('MAIN_MENU')}>Volver al menú</button></div></div>}
    <MainMenuAndPrologue />
    {phase === 'PLAYING' && mission && <aside className="fixed left-5 top-5 z-20 w-[min(92vw,22rem)] rounded-xl border border-amber-500/30 bg-stone-950/90 p-4 text-stone-100 shadow-xl backdrop-blur-md">
      <div className="mb-2 flex items-center justify-between"><span className="text-[10px] uppercase tracking-[0.25em] text-amber-400">Crónica de aprendizaje</span><span className="text-xs text-stone-400">{completedCount}/{objectives.length}</span></div>
      <h2 className="text-lg font-bold text-amber-200">{mission.title}</h2>
      <p className="mt-1 text-xs text-stone-400">{mission.biblicalBook}</p>
      {activeObjective ? <div className="mt-4 border-t border-stone-800 pt-3"><p className="text-sm font-semibold text-stone-100">Próximo testimonio</p><p className="mt-1 text-sm text-stone-300">{activeObjective.title}</p><p className="mt-1 text-xs leading-relaxed text-stone-400">{activeObjective.description}</p><p className="mt-2 text-xs text-amber-300">Lectura: {activeObjective.scriptureRef.book} {activeObjective.scriptureRef.chapter}:{activeObjective.scriptureRef.verses}</p></div> : <p className="mt-4 text-sm text-emerald-300">Todos los objetivos de esta misión fueron registrados.</p>}
    </aside>}
    {phase === 'PLAYING' && nearbyInteractable && !activeDialogue && <div className="fixed bottom-8 left-1/2 z-10 -translate-x-1/2 rounded-lg bg-black/75 px-5 py-3 text-sm text-white">Presioná <b>E</b> para interactuar con {nearbyInteractable.name}</div>}
    {activeDialogue && <div className="fixed bottom-6 left-1/2 z-30 w-[min(92%,48rem)] -translate-x-1/2 rounded-xl border border-amber-500/40 bg-stone-950/95 p-5 text-stone-100 shadow-2xl backdrop-blur-md"><div className="mb-3 flex items-start justify-between gap-4"><div><p className="text-sm font-bold text-amber-300">{activeDialogue.speakerName}</p><p className="text-xs uppercase tracking-wider text-stone-500">{activeDialogue.speakerRole}</p></div><span className="rounded border border-amber-500/40 px-2 py-1 text-[10px] uppercase text-amber-300">{activeDialogue.scriptureRef.adaptationType === 'CANONICAL' ? 'Texto bíblico' : 'Adaptación dramática'}</span></div><p className="mb-4 leading-relaxed text-stone-200">{activeDialogue.text}</p><div className="mb-4 rounded-lg border-l-2 border-amber-500 bg-amber-500/10 p-3"><p className="text-xs font-semibold text-amber-300">Para aprender</p><p className="mt-1 text-xs leading-relaxed text-stone-300">{activeDialogue.scriptureRef.summaryText}</p><p className="mt-2 text-xs text-amber-200">{activeDialogue.scriptureRef.book} {activeDialogue.scriptureRef.chapter}:{activeDialogue.scriptureRef.verses}</p><p className="mt-1 text-[11px] text-stone-500">{activeDialogue.scriptureRef.adaptationNote}</p></div><div className="flex flex-wrap gap-2">{activeDialogue.choices.map((choice) => <button key={choice.id} className="rounded-lg border border-amber-500/50 bg-amber-500/15 px-4 py-2 text-left text-sm text-amber-100 transition hover:bg-amber-500/30" onClick={() => selectDialogueChoice(choice.id)}>{choice.text}</button>)}{activeDialogue.choices.length === 0 && <button className="rounded bg-amber-500 px-4 py-2 font-semibold text-stone-950" onClick={closeDialogue}>Cerrar diálogo</button>}</div></div>}
    {activeNotification && <div className="fixed right-5 top-5 z-40 w-[min(90vw,24rem)] rounded-xl border border-emerald-500/40 bg-stone-950/95 p-4 text-stone-100 shadow-xl"><p className="font-bold text-emerald-300">{activeNotification.title}</p><p className="mt-1 text-sm text-stone-300">{activeNotification.subtitle}</p>{activeNotification.scripture && <p className="mt-2 text-xs text-amber-300">{activeNotification.scripture}</p>}<button className="mt-3 text-xs text-stone-400 underline" onClick={dismissNotification}>Continuar</button></div>}
    {missionCompletedModal && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6"><div className="max-w-md rounded-2xl border border-amber-500/50 bg-stone-950 p-7 text-center text-stone-100"><p className="text-xs uppercase tracking-widest text-amber-400">Testimonio registrado</p><h2 className="mt-2 text-2xl font-bold text-amber-200">Misión completada</h2><p className="mt-3 text-sm leading-relaxed text-stone-300">Terminaste esta etapa y desbloqueaste una nueva entrada del códice bíblico.</p><button className="mt-6 rounded bg-amber-500 px-5 py-2 font-semibold text-stone-950" onClick={closeMissionCompleteModal}>Continuar</button></div></div>}
  </div>;
}
