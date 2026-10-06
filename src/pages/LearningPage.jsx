import { lazy, Suspense } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Layers,
  Terminal,
  Sparkles,
  Languages,
  GraduationCap,
  Cpu,
  BrainCircuit,
} from 'lucide-react';
import RouteLoadingSkeleton from '../components/common/RouteLoadingSkeleton';

const FlashcardReview = lazy(() => import('../components/learning/FlashcardReview'));
const CodePlayground = lazy(() => import('../components/learning/CodePlayground'));
const AILearningAssistant = lazy(() => import('../components/learning/AILearningAssistant'));
const TechnicalTranslator = lazy(() => import('../components/learning/TechnicalTranslator'));

const TABS = [
  {
    id: 'flashcards',
    label: '1. Flashcards Interactives',
    shortLabel: 'Flashcards',
    icon: Layers,
    description: 'Répétition espacée & mémorisation rapide',
    color: 'indigo',
  },
  {
    id: 'playground',
    label: '2. Playground Code C / Py',
    shortLabel: 'Playground C / Py',
    icon: Terminal,
    description: 'Éditeur & console d\'exécution en direct',
    color: 'emerald',
  },
  {
    id: 'ai',
    label: '3. IA Résumés & Quiz',
    shortLabel: 'IA Résumés & Quiz',
    icon: Sparkles,
    description: 'Synthèse automatique & QCM d\'auto-évaluation',
    color: 'purple',
  },
  {
    id: 'translator',
    label: '4. Outils Linguistiques',
    shortLabel: 'Traducteur Tech',
    icon: Languages,
    description: 'Dictionnaire technique bilingue EN ↔ FR',
    color: 'blue',
  },
];

export default function LearningPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTabParam = searchParams.get('tab');
  const activeTab = TABS.some((t) => t.id === currentTabParam) ? currentTabParam : 'flashcards';

  const handleTabChange = (tabId) => {
    setSearchParams({ tab: tabId });
  };

  return (
    <div className="page-content py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Page Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 md:p-8 shadow-xl border border-indigo-900/40">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <GraduationCap size={14} />
              <span>Module 05 · Outils d'Apprentissage Avancés</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
              CampusHub Laboratoire & Espace d'Études
            </h1>
            <p className="text-sm md:text-base text-slate-300 leading-relaxed">
              Outils interactifs dédiés aux étudiants de l'Université de Yaoundé I : révision active par flashcards, bac à sable pour code C et Python, tuteur IA pour synthèses et quiz, et lexique technique bilingue.
            </p>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 gap-3 min-w-[240px]">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/10 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center flex-shrink-0">
                <BrainCircuit size={20} />
              </div>
              <div>
                <div className="text-lg font-black text-white">4 Modules</div>
                <div className="text-[11px] text-slate-300 font-medium">Outils intégrés</div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/10 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center flex-shrink-0">
                <Cpu size={20} />
              </div>
              <div>
                <div className="text-lg font-black text-white">C & Py</div>
                <div className="text-[11px] text-slate-300 font-medium">TPs & Syntaxes</div>
              </div>
            </div>
          </div>
        </div>

        {/* Subtle decorative background circles */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 -top-12 w-48 h-48 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />
      </div>

      {/* Flagship Tech Hub Bridge Banner */}
      <div className="p-4 rounded-3xl bg-gradient-to-r from-indigo-500/15 via-purple-500/15 to-emerald-500/15 border border-indigo-200 dark:border-indigo-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 shadow-md">
            <Cpu size={20} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>Étudiants en Informatique & Génie Logiciel</span>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-indigo-600 text-white">
                Cœur Tech National
              </span>
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Accédez au laboratoire complet avec Playground C/Python/SQL, annales d'examens nationales et mémentos POSIX.
            </p>
          </div>
        </div>

        <a
          href="/tech-hub"
          className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors whitespace-nowrap self-start sm:self-auto flex items-center gap-1.5"
        >
          <Terminal size={13} />
          <span>Explorer le Pôle Tech</span>
        </a>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-1.5 shadow-sm">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabChange(tab.id)}
                className={`flex flex-col md:flex-row items-center justify-center gap-2 p-3 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon size={16} className={isActive ? 'text-white' : 'text-slate-400'} />
                <span className="hidden md:inline">{tab.label}</span>
                <span className="md:hidden">{tab.shortLabel}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Tab Panel with Suspense and RouteLoadingSkeleton */}
      <main className="transition-opacity duration-200">
        <Suspense fallback={<RouteLoadingSkeleton variant="simple" />}>
          {activeTab === 'flashcards' && <FlashcardReview />}
          {activeTab === 'playground' && <CodePlayground />}
          {activeTab === 'ai' && <AILearningAssistant />}
          {activeTab === 'translator' && <TechnicalTranslator />}
        </Suspense>
      </main>
    </div>
  );
}
