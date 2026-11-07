import React, { useEffect, useState } from 'react';
import { BookOpen, ChevronRight, Database, Play, RotateCcw, Settings, Sparkles, UserCheck } from 'lucide-react';
import { CAMPAIGN_CHAPTERS } from '../../content/campaignCatalog';
import { useGameStore } from '../../engine/useGameStore';

const PROLOGUE_SUBTITLES = [
  { verse: 'Apocalipsis 12:7-8', text: 'Después hubo una gran batalla en el cielo: Miguel y sus ángeles luchaban contra el dragón.', note: 'Prólogo visionario' },
  { verse: 'Apocalipsis 12:9', text: 'Y fue lanzado fuera el gran dragón, la serpiente antigua, que se llama diablo y Satanás.', note: 'La caída del adversario' },
  { verse: 'Génesis 1:1 / Juan 1:1', text: 'En el principio creó Dios los cielos y la tierra. Tú eres El Testigo: recorrerás las edades para presenciar la Promesa.', note: 'Transición al Edén' }
];

export const MainMenuAndPrologue: React.FC = () => {
  const { phase, setPhase, persistenceMode, startNewCampaign, loadSavedGame } = useGameStore();
  const [step, setStep] = useState(0);
  const [hasSave, setHasSave] = useState(false);

  useEffect(() => { setHasSave(Boolean(localStorage.getItem('el_testigo_cronicas_save_v1'))); }, [phase]);

  if (phase === 'PROLOGUE_CINEMATIC') {
    const current = PROLOGUE_SUBTITLES[step];
    return (
      <div className="fixed inset-0 z-20 flex flex-col justify-between bg-gradient-to-b from-black/70 via-transparent to-black/90 p-8 text-stone-100">
        <div className="flex items-center justify-between">
          <span className="rounded-full border border-amber-500/40 bg-stone-950/80 px-4 py-2 text-xs uppercase tracking-widest text-amber-200"><Sparkles className="mr-2 inline h-4 w-4 text-amber-400" />{current.note}</span>
          <button className="rounded-lg border border-stone-700 bg-stone-900/70 px-4 py-2 text-xs uppercase" onClick={() => setPhase('MAIN_MENU')}>Omitir prólogo</button>
        </div>
        <div className="mx-auto max-w-3xl space-y-6 text-center">
          <span className="inline-block rounded border border-amber-400/50 bg-amber-500/20 px-3 py-1 text-xs tracking-widest text-amber-300">{current.verse}</span>
          <p className="text-xl leading-relaxed text-stone-100 md:text-2xl">«{current.text}»</p>
          <button className="rounded-lg bg-amber-500 px-7 py-3 font-bold uppercase tracking-wider text-stone-950" onClick={() => step < PROLOGUE_SUBTITLES.length - 1 ? setStep((value) => value + 1) : setPhase('MAIN_MENU')}>
            {step < PROLOGUE_SUBTITLES.length - 1 ? 'Continuar visión' : 'Iniciar crónicas'} <ChevronRight className="inline h-4 w-4" />
          </button>
        </div>
        <div />
      </div>
    );
  }

  if (phase !== 'MAIN_MENU') return null;

  return (
    <div className="fixed inset-0 z-20 overflow-y-auto bg-gradient-to-r from-stone-950/95 via-stone-950/85 to-transparent p-6 text-stone-100 md:p-12">
      <header className="border-b border-stone-800 pb-5"><p className="text-xs uppercase tracking-[0.35em] text-amber-400">Producción interactiva bíblica 3D</p><h1 className="mt-1 text-3xl font-bold tracking-wider text-amber-300 md:text-5xl">EL TESTIGO: CRÓNICAS DE LA PROMESA</h1></header>
      <main className="mx-auto grid max-w-6xl gap-8 py-10 lg:grid-cols-5">
        <section className="space-y-3 lg:col-span-2">
          {hasSave && <button className="menu-button bg-amber-500 text-stone-950" onClick={() => loadSavedGame()}><RotateCcw className="h-5 w-5" /> Continuar partida</button>}
          <button className="menu-button" onClick={() => startNewCampaign()}><Play className="h-5 w-5 text-amber-400" /> Nueva campaña: Edén</button>
          <button className="menu-button" onClick={() => setPhase('PROLOGUE_CINEMATIC')}><BookOpen className="h-5 w-5 text-amber-400" /> Ver prólogo</button>
          <div className="mt-6 rounded-lg border border-stone-800 bg-stone-900/80 p-4 text-sm text-stone-400"><Database className="mr-2 inline h-4 w-4 text-emerald-400" /> Persistencia: {persistenceMode === 'CLOUD_FIRESTORE' ? 'Firebase' : 'local'}</div>
        </section>
        <section className="space-y-5 rounded-2xl border border-stone-800 bg-stone-950/85 p-6 lg:col-span-3">
          <p className="text-xs uppercase tracking-widest text-amber-400">Capítulo disponible</p><h2 className="text-2xl font-semibold text-amber-200">{CAMPAIGN_CHAPTERS[0]?.title}</h2>
          <p className="leading-relaxed text-stone-300">Explora el Jardín del Edén, conoce a sus primeros habitantes y registra el testimonio de la Promesa.</p>
          <div className="grid gap-3 text-sm text-stone-400 sm:grid-cols-2"><div><UserCheck className="mr-2 inline h-4 w-4 text-amber-400" /> Personaje personalizable</div><div><Settings className="mr-2 inline h-4 w-4 text-amber-400" /> Gráficos configurables</div></div>
        </section>
      </main>
    </div>
  );
};
