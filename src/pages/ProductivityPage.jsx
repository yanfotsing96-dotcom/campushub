import { useSearchParams } from 'react-router-dom';
import {
  Clock,
  PenTool,
  CalendarCheck,
  WifiOff,
  Zap,
  Target,
  Flame,
} from 'lucide-react';
import PomodoroTimer from '../components/productivity/PomodoroTimer';
import WhiteboardCollaboratif from '../components/productivity/WhiteboardCollaboratif';
import RevisionCalendar from '../components/productivity/RevisionCalendar';
import OfflineModeManager from '../components/productivity/OfflineModeManager';

const TABS = [
  {
    id: 'pomodoro',
    label: '1. Minuteur Pomodoro',
    shortLabel: 'Pomodoro',
    icon: Clock,
    description: 'Sessions synchronisées en groupe & pauses',
  },
  {
    id: 'whiteboard',
    label: '2. Tableau Blanc',
    shortLabel: 'Tableau Blanc',
    icon: PenTool,
    description: 'Schémas d\'architecture & algorithmes',
  },
  {
    id: 'calendar',
    label: '3. Calendrier iCal',
    shortLabel: 'Planning iCal',
    icon: CalendarCheck,
    description: 'Échéances d\'examens & export .ics',
  },
  {
    id: 'offline',
    label: '4. Mode Hors-ligne',
    shortLabel: 'Mode Hors-ligne',
    icon: WifiOff,
    description: 'Cache local & résilience réseau campus',
  },
];

export default function ProductivityPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTabParam = searchParams.get('tab');
  const activeTab = TABS.some((t) => t.id === currentTabParam) ? currentTabParam : 'pomodoro';

  const handleTabChange = (tabId) => {
    setSearchParams({ tab: tabId });
  };

  return (
    <div className="page-content py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Vercel/Stripe-inspired Modern Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white p-6 md:p-8 shadow-xl border border-emerald-900/40">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <Zap size={14} />
              <span>Module 06 · Productivité & Organisation</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
              CampusHub Centre d'Efficacité & Organisation
            </h1>
            <p className="text-sm md:text-base text-slate-300 leading-relaxed">
              Maximisez votre concentration pour les examens de l'Université de Yaoundé I : minuteur synchronisé de groupe, tableau blanc pour vos architectures de données, planning d'échéances exportable iCal, et consultation hors-ligne sur le campus.
            </p>
          </div>

          {/* Quick Metrics Badges */}
          <div className="grid grid-cols-2 gap-3 min-w-[240px]">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/10 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center flex-shrink-0">
                <Target size={20} />
              </div>
              <div>
                <div className="text-lg font-black text-white">4 Outils</div>
                <div className="text-[11px] text-slate-300 font-medium">Productivité active</div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/10 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center flex-shrink-0">
                <Flame size={20} />
              </div>
              <div>
                <div className="text-lg font-black text-white">Focus UY1</div>
                <div className="text-[11px] text-slate-300 font-medium">Groupes synchrones</div>
              </div>
            </div>
          </div>
        </div>

        {/* Ambient background blur elements */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute left-1/4 -top-12 w-48 h-48 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
      </div>

      {/* Modern Tabs Navigation Bar */}
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
                    ? 'bg-emerald-600 text-white shadow-md'
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

      {/* Active Tab Panel */}
      <main className="transition-opacity duration-200">
        {activeTab === 'pomodoro' && <PomodoroTimer />}
        {activeTab === 'whiteboard' && <WhiteboardCollaboratif />}
        {activeTab === 'calendar' && <RevisionCalendar />}
        {activeTab === 'offline' && <OfflineModeManager />}
      </main>
    </div>
  );
}
