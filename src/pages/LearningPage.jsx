import { lazy, Suspense } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Layers,
  Terminal,
  Sparkles,
  Languages,
  GraduationCap,
  FlaskConical,
} from 'lucide-react';
import RouteLoadingSkeleton from '../components/common/RouteLoadingSkeleton';

const FlashcardReview = lazy(() => import('../components/learning/FlashcardReview'));
const ContextualLabContainer = lazy(() => import('../components/labs/ContextualLabContainer'));
const AILearningAssistant = lazy(() => import('../components/learning/AILearningAssistant'));
const TechnicalTranslator = lazy(() => import('../components/learning/TechnicalTranslator'));

const TABS = [
  {
    id: 'playground',
    label: '1. Laboratoires & Playgrounds',
    shortLabel: 'Laboratoire & Code',
    icon: Terminal,
    description: 'Bacs à sable C/Python, simulateurs physique, chimie, biologie & maths',
  },
  {
    id: 'flashcards',
    label: '2. Flashcards Interactives',
    shortLabel: 'Flashcards',
    icon: Layers,
    description: 'Répétition espacée & mémorisation rapide',
  },
  {
    id: 'ai',
    label: '3. IA Résumés & Quiz',
    shortLabel: 'IA Tuteur & Quiz',
    icon: Sparkles,
    description: 'Synthèse automatique & QCM d\'auto-évaluation',
  },
  {
    id: 'translator',
    label: '4. Dictionnaire Bilingue',
    shortLabel: 'Traducteur Tech',
    icon: Languages,
    description: 'Lexique technique bilingue EN ↔ FR',
  },
];

export default function LearningPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTabParam = searchParams.get('tab');
  const activeTab = TABS.some((t) => t.id === currentTabParam) ? currentTabParam : 'playground';

  const handleTabChange = (tabId) => {
    setSearchParams({ tab: tabId });
  };

  return (
    <div className="page-content py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-left">
      {/* Page Hero Header (Thème Beige & Chocolat Doux MINESUP) */}
      <div className="relative overflow-hidden rounded-3xl bg-[#EFECE6] border border-[#E3DEC9] p-6 md:p-8 shadow-xs">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#5C4033]/10 text-[#5C4033] border border-[#5C4033]/25">
              <GraduationCap size={14} />
              <span>CampusHub · Laboratoires Virtuels & Espace d'Études</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-[#2C2218]">
              Laboratoires Pratiques & Outils d'Apprentissage
            </h1>
            <p className="text-sm md:text-base text-[#6E5D4F] leading-relaxed">
              Consortium universitaire camerounais : bacs à sable de programmation (C, Python, SQL), simulateurs scientifiques (Physique, Chimie, Biologie, Mathématiques), révision par flashcards et tuteur intelligent.
            </p>
          </div>

          {/* Quick Metrics Badges */}
          <div className="grid grid-cols-2 gap-3 min-w-[240px]">
            <div className="bg-[#F7F5F0] rounded-2xl p-3.5 border border-[#E3DEC9] flex items-center gap-3 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-[#5C4033]/15 text-[#5C4033] flex items-center justify-center shrink-0">
                <FlaskConical size={20} />
              </div>
              <div>
                <div className="text-lg font-black text-[#2C2218]">26 Labs</div>
                <div className="text-[11px] text-[#6E5D4F] font-medium">L01 à L26 MINESUP</div>
              </div>
            </div>

            <div className="bg-[#F7F5F0] rounded-2xl p-3.5 border border-[#E3DEC9] flex items-center gap-3 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-800 flex items-center justify-center shrink-0">
                <Terminal size={20} />
              </div>
              <div>
                <div className="text-lg font-black text-[#2C2218]">Interactif</div>
                <div className="text-[11px] text-[#6E5D4F] font-medium">Bacs à sable live</div>
              </div>
            </div>
          </div>
        </div>

        {/* Subtle decorative background circles */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-[#E3DEC9]/40 blur-3xl pointer-events-none" />
      </div>

      {/* Navigation Tabs Bar */}
      <div className="bg-[#EFECE6] border border-[#E3DEC9] rounded-2xl p-1.5 shadow-xs">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabChange(tab.id)}
                className={`flex flex-col md:flex-row items-center justify-center gap-2 p-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#2C2218] text-[#FAF5F0] shadow-xs'
                    : 'text-[#6E5D4F] hover:bg-[#F7F5F0] hover:text-[#2C2218]'
                }`}
              >
                <Icon size={16} className={isActive ? 'text-[#FAF5F0]' : 'text-[#6E5D4F]'} />
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
          {activeTab === 'playground' && <ContextualLabContainer />}
          {activeTab === 'flashcards' && <FlashcardReview />}
          {activeTab === 'ai' && <AILearningAssistant />}
          {activeTab === 'translator' && <TechnicalTranslator />}
        </Suspense>
      </main>
    </div>
  );
}
