import { lazy, Suspense } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Star,
  Trophy,
  ShieldCheck,
  Award,
  Zap,
} from 'lucide-react';
import RouteLoadingSkeleton from '../components/common/RouteLoadingSkeleton';

const DocumentRatingComments = lazy(() => import('../components/evaluation/DocumentRatingComments'));
const GamificationBadges = lazy(() => import('../components/evaluation/GamificationBadges'));
const QualityAndPlagiarismControl = lazy(() => import('../components/evaluation/QualityAndPlagiarismControl'));

const TABS = [
  {
    id: 'ratings',
    label: '1. Notation & Avis',
    shortLabel: 'Notes & Avis',
    icon: Star,
    description: 'Évaluation par étoiles et retours d\'étudiants',
  },
  {
    id: 'gamification',
    label: '2. Points & Badges',
    shortLabel: 'Gamification',
    icon: Trophy,
    description: 'Badges de mérite & classement des majors',
  },
  {
    id: 'quality',
    label: '3. Contrôle & Anti-Plagiat',
    shortLabel: 'Anti-Plagiat',
    icon: ShieldCheck,
    description: 'Détection de similarité & signalement',
  },
];

export default function EvaluationPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTabParam = searchParams.get('tab');
  const activeTab = TABS.some((t) => t.id === currentTabParam) ? currentTabParam : 'ratings';

  const handleTabChange = (tabId) => {
    setSearchParams({ tab: tabId });
  };

  return (
    <div className="page-content py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Vercel/Stripe-inspired Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 text-white p-6 md:p-8 shadow-xl border border-amber-900/40">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <Award size={14} />
              <span>Module 07 · Évaluation & Gamification</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
              CampusHub Mérite Académique & Contrôle Qualité
            </h1>
            <p className="text-sm md:text-base text-slate-300 leading-relaxed">
              Valorisez l'excellence à l'Université de Yaoundé I : évaluation collégiale des cours par étoiles, système de points et badges de certification pour les meilleurs contributeurs, et audit anti-plagiat pour garantir l'intégrité scientifique.
            </p>
          </div>

          {/* Quick Metrics Badges */}
          <div className="grid grid-cols-2 gap-3 min-w-[240px]">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/10 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center flex-shrink-0">
                <Star size={20} fill="currentColor" />
              </div>
              <div>
                <div className="text-lg font-black text-white">4.8 / 5</div>
                <div className="text-[11px] text-slate-300 font-medium">Satisfaction moyenne</div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/10 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center flex-shrink-0">
                <Zap size={20} />
              </div>
              <div>
                <div className="text-lg font-black text-white">3 450 XP</div>
                <div className="text-[11px] text-slate-300 font-medium">Niveau 8 · Émérite</div>
              </div>
            </div>
          </div>
        </div>

        {/* Ambient background blur elements */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 -top-12 w-48 h-48 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
      </div>

      {/* Tabs Navigation Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-1.5 shadow-sm">
        <div className="grid grid-cols-3 gap-1.5">
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
                    ? 'bg-amber-600 text-white shadow-md'
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
          {activeTab === 'ratings' && <DocumentRatingComments />}
          {activeTab === 'gamification' && <GamificationBadges />}
          {activeTab === 'quality' && <QualityAndPlagiarismControl />}
        </Suspense>
      </main>
    </div>
  );
}
