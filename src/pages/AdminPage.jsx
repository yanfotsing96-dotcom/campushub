import { lazy, Suspense } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  ShieldCheck,
  Users,
  Flag,
  BarChart2,
  Lock,
} from 'lucide-react';
import RouteLoadingSkeleton from '../components/common/RouteLoadingSkeleton';

const UserModerationManager = lazy(() => import('../components/admin/UserModerationManager'));
const ContentReportsQueue = lazy(() => import('../components/admin/ContentReportsQueue'));
const AnalyticsDashboard = lazy(() => import('../components/admin/AnalyticsDashboard'));

const TABS = [
  {
    id: 'users',
    label: '1. Gestion des Utilisateurs',
    shortLabel: 'Utilisateurs',
    icon: Users,
    description: 'Comptes, rôles et modération des accès',
  },
  {
    id: 'reports',
    label: '2. File des Signalements',
    shortLabel: 'Signalements',
    icon: Flag,
    description: 'Modération des contenus et documents',
  },
  {
    id: 'analytics',
    label: '3. Suivi Analytique',
    shortLabel: 'Analytique & Stats',
    icon: BarChart2,
    description: 'KPIs d\'engagement et métriques campus UY1',
  },
];

export default function AdminPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTabParam = searchParams.get('tab');
  const activeTab = TABS.some((t) => t.id === currentTabParam) ? currentTabParam : 'users';

  const handleTabChange = (tabId) => {
    setSearchParams({ tab: tabId });
  };

  return (
    <div className="page-content py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      {/* SaaS Admin Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white p-6 md:p-8 shadow-2xl border border-indigo-900/40">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <ShieldCheck size={14} />
              <span>Module 09 · Administration & Modération Globale</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
              CampusHub Console d'Administration & Supervision
            </h1>
            <p className="text-sm md:text-base text-slate-300 leading-relaxed">
              Supervision de l'écosystème académique de l'Université de Yaoundé I : gestion des rôles étudiants et délégués, traitement des signalements de contenu et monitoring en temps réel des statistiques du campus.
            </p>
          </div>

          {/* Admin Credentials Badge */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex items-center gap-3.5 min-w-[260px]">
            <div className="w-11 h-11 rounded-2xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center flex-shrink-0">
              <Lock size={20} />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                Session Administrateur
              </div>
              <div className="text-sm font-bold text-white">
                Faculté des Sciences · UY1
              </div>
              <div className="text-[10px] text-slate-300 flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Droits de modération actifs</span>
              </div>
            </div>
          </div>
        </div>

        {/* Ambient background blur elements */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 -top-12 w-48 h-48 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />
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
          {activeTab === 'users' && <UserModerationManager />}
          {activeTab === 'reports' && <ContentReportsQueue />}
          {activeTab === 'analytics' && <AnalyticsDashboard />}
        </Suspense>
      </main>
    </div>
  );
}
