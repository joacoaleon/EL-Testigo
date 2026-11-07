import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  BookOpen,
  Play,
  RotateCcw,
  Settings,
  Database,
  ShieldCheck,
  UserCheck,
  ChevronRight,
  Lock
} from 'lucide-react';
import { useGameStore } from '../engine/useGameStore';
import { CAMPAIGN_CHAPTERS } from '../content/campaignCatalog';
import { soundEngine } from '../engine/soundEngine';
import { GraphicsQuality } from '../types/game.types';

const PROLOGUE_SUBTITLES = [
  {
    verse: 'Apocalipsis 12:7-8',
    text: '«Después hubo una gran batalla en el cielo: Miguel y sus ángeles luchaban contra el dragón; y luchaban el dragón y sus ángeles; pero no prevalecieron...»',
    note: 'Prólogo Visionario — Visión profética de Juan en Patmos'
  },
  {
    verse: 'Apocalipsis 12:9',
    text: '«Y fue lanzado fuera el gran dragón, la serpiente antigua, que se llama diablo y Satanás, el cual engaña al mundo entero; fue arrojado a la tierra...»',
    note: 'Conexión Teológica — La serpiente antigua vista en Apocalipsis remite al principio en Edén'
  },
  {
    verse: 'Génesis 1:1 / Juan 1:1',
    text: '«En el principio creó Dios los cielos y la tierra...» Tú eres EL TESTIGO: recorrerás las edades para presenciar la Promesa de Redención.',
    note: 'Transición al Capítulo I — El Jardín del Edén'
  }
];

export const MainMenuAndPrologue: React.FC = () => {
  const {
    phase,
    setPhase,
    character,
    updateCharacterCustomization,
    graphicsQuality,
    setGraphicsQuality,
    persistenceMode,
    startNewCampaign,
    loadSavedGame
  } = useGameStore();

  const [step, setStep] = useState(0);
  const [activeTab, setActiveTab] = useState<'CAMPAIGN' | 'CHARACTER' | 'CHAPTERS' | 'SETTINGS'>('CAMPAIGN');
  const [hasSave, setHasSave] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem('el_testigo_cronicas_save_v1');
    setHasSave(Boolean(raw));
  }, [phase]);

  if (phase === 'PROLOGUE_CINEMATIC') {
    const currentSub = PROLOGUE_SUBTITLES[step];
    return (
      <div className="fixed inset-0 z-20 flex flex-col justify-between p-8 md:p-14 pointer-events-none bg-gradient-to-b from-black/70 via-transparent to-black/90">
        {/* Encabezado de distinción bíblica */}
        <div className="flex items-center justify-between pointer-events-auto">
          <div className="flex items-center gap-3 bg-stone-950/80 border border-amber-500/40 px-4 py-2 rounded-full backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-xs uppercase tracking-widest text-amber-200 font-semibold">
              Secuencia de Apertura Cinematográfica • {currentSub.note}
            </span>
          </div>
          <button
            onClick={() => setPhase('MAIN_MENU')}
            className="px-4 py-2 text-xs uppercase tracking-widest text-stone-300 hover:text-white bg-stone-900/70 hover:bg-stone-800 border border-stone-700 rounded-lg transition"
          >
            Omitir Prólogo →
          </button>
        </div>

        {/* Narrativa central e inferior */}
        <div className="max-w-3xl mx-auto text-center space-y-6 pointer-events-auto">
          <div className="inline-block px-3 py-1 rounded bg-amber-500/20 border border-amber-400/50 text-amber-300 text-xs font-mono tracking-widest uppercase">
            {currentSub.verse}
          </div>
          <p className="text-xl md:text-2xl font-serif text-stone-100 leading-relaxed drop-shadow-md">
            {currentSub.text}
          </p>
          <div className="flex items-center justify-center gap-4 pt-2">
            {step < PROLOGUE_SUBTITLES.length - 1 ? (
              <button
                onClick={() => {
                  soundEngine.playPrologueThunder();
                  setStep((s) => s + 1);
                }}
                className="flex items-center gap-2 px-7 py-3 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold uppercase tracking-wider text-sm rounded-lg shadow-lg shadow-amber-600/30 transition"
              >
                Continuar Visión <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => {
                  soundEngine.playObjectiveComplete();
                  setPhase('MAIN_MENU');
                }}
                className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-stone-950 font-bold uppercase tracking-widest text-sm rounded-lg shadow-xl shadow-amber-500/30 transition"
              >
                Revelar Título e Iniciar Crónicas
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (phase !== 'MAIN_MENU') return null;

  return (
    <div className="fixed inset-0 z-20 flex flex-col justify-between bg-gradient-to-r from-stone-950/95 via-stone-950/80 to-transparent p-6 md:p-12 text-stone-100 overflow-y-auto">
      {/* Encabezado del Estudio y Estado de Base de Datos */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-800/80 pb-5">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-amber-400 font-semibold">
            Producción Interactiva Bíblica 3D • Génesis a Apocalipsis
          </p>
          <h1 className="text-3xl md:text-5xl font-serif font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-600 mt-1">
            EL TESTIGO: CRÓNICAS DE LA PROMESA
          </h1>
        </div>

        <div className="flex items-center gap-2 bg-stone-900/90 border border-stone-700 px-3.5 py-2 rounded-lg text-xs">
          <Database className="w-4 h-4 text-emerald-400" />
          <span className="text-stone-400">Persistencia:</span>
          <span className="font-semibold text-emerald-300">
            {persistenceMode === 'CLOUD_FIRESTORE' ? 'Firebase Cloud Firestore' : 'Modo Local Activo'}
          </span>
        </div>
      </div>

      {/* Cuerpo del Menú Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-auto py-6">
        {/* Navegación Izquierda */}
        <div className="lg:col-span-4 space-y-3">
          {hasSave && (
            <button
              onClick={() => loadSavedGame()}
              className="w-full flex items-center justify-between px-6 py-4 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 text-stone-950 font-bold uppercase tracking-wider shadow-lg shadow-amber-600/20 hover:brightness-110 transition"
            >
              <span className="flex items-center gap-3">
                <RotateCcw className="w-5 h-5" /> Continuar Crónica Guardada
              </span>
              <ChevronRight className="w-5 h-5" />
            </button>
          )}

          <button
            onClick={() => startNewCampaign()}
            className="w-full flex items-center justify-between px-6 py-4 rounded-xl bg-stone-900/90 hover:bg-stone-800 border border-amber-500/50 text-amber-200 font-bold uppercase tracking-wider transition"
          >
            <span className="flex items-center gap-3">
              <Play className="w-5 h-5 text-amber-400" /> Nueva Campaña (Capítulo I: Edén)
            </span>
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="pt-4 space-y-2">
            {[
              { id: 'CAMPAIGN', label: 'Sinopsis y Enfoque Bíblico', icon: BookOpen },
              { id: 'CHARACTER', label: 'Personalizar a El Testigo', icon: UserCheck },
              { id: 'CHAPTERS', label: 'Mapa de Libros Bíblicos', icon: ShieldCheck },
              { id: 'SETTINGS', label: 'Gráficos y Base de Datos', icon: Settings }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as typeof activeTab)}
                  className={`w-full flex items-center gap-3 px-5 py-3 rounded-lg text-sm font-medium transition ${
                    activeTab === item.id
                      ? 'bg-amber-500/20 border border-amber-400/60 text-amber-200'
                      : 'bg-stone-900/60 hover:bg-stone-800/70 border border-stone-800 text-stone-400'
                  }`}
                >
                  <Icon className="w-4 h-4 text-amber-400" />
                  {item.label}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => {
              setStep(0);
              setPhase('PROLOGUE_CINEMATIC');
            }}
            className="w-full mt-4 px-4 py-2.5 text-xs uppercase tracking-widest text-stone-400 hover:text-amber-300 border border-stone-800 rounded-lg transition"
          >
            Reproducir Prólogo de Apocalipsis 12
          </button>
        </div>

        {/* Panel Dinámico Derecho */}
        <div className="lg:col-span-8 bg-stone-950/85 border border-stone-800 rounded-2xl p-6 md:p-8 backdrop-blur-xl">
          {activeTab === 'CAMPAIGN' && (
            <div className="space-y-4">
              <span className="text-xs font-mono uppercase tracking-widest text-amber-400">
                Arquitectura Narrativa y Fidelidad Escritural
              </span>
              <h2 className