import { useSearchParams } from 'react-router-dom';
import {
  Briefcase,
  Compass,
  BookMarked,
  Layers,
  Car,
  Laptop,
} from 'lucide-react';
import LogisticsAndOpportunities from '../components/services/LogisticsAndOpportunities';
import CampusLifeAndCarpooling from '../components/services/CampusLifeAndCarpooling';
import BibliographyGenerator from '../components/services/BibliographyGenerator';

const TABS = [
  {
    id: 'logistics',
    label: '1. Logistique & Stages',
    shortLabel: 'Logistique & Stages',
    icon: Laptop,
    description: 'Prêt/vente de matériel & annonces de stages',
  },
  {
    id: 'campuslife',
    label: '2. Vie Pratique & Covoiturage',
    shortLabel: 'Covoiturage & Campus',
    icon: Compass,
    description: 'Covoiturage Ngoa-Ekellé, bons plans & mur de motivation',
  },
  {
    id: 'bibliography',
    label: '3. Références & Bibliographie',
    shortLabel: 'Générateur iCal / Citations',
    icon: BookMarked,
    description: 'Générateur automatique APA, IEEE, MLA & BibTeX',
  },
];

export default function ServicesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTabParam = searchParams.get('tab');
  const activeTab = TABS.some((t) => t.id === currentTabParam) ? currentTabParam : 'logistics';

  const handleTabChange = (tabId) => {
    setSearchParams({ tab: tabId });
  };

  return (
    <div className="page-content py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Vercel/Stripe Modern Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-6 md:p-8 shadow-xl border border-blue-900/40">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/30">
              <Briefcase size={14} />
              <span>Module 08 · Services Annexes & Campus</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
              CampusHub Vie Étudiante, Mobilité & Références
            </h1>
            <p className="text-sm md:text-base text-slate-300 leading-relaxed">
              Tout pour simplifier votre quotidien à l'Université de Yaoundé I : petites annonces de matériel et livres, opportunités de stages à Yaoundé, covoiturage vers Ngoa-Ekellé, bons plans campus et générateur automatique de bibliographie pour mémoires.
            </p>
          </div>

          {/* Quick Metrics Badges */}
          <div className="grid grid-cols-2 gap-3 min-w-[240px]">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/10 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center flex-shrink-0">
                <Car size={20} />
              </div>
              <div>
                <div className="text-lg font-black text-white">Ngoa-Ekellé</div>
                <div className="text-[11px] text-slate-300 font-medium">Covoiturage actif</div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/10 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center flex-shrink-0">
                <Layers size={20} />
              </div>
              <div>
                <div className="text-lg font-black text-white">IEEE & APA</div>
                <div className="text-[11px] text-slate-300 font-medium">Citations conformes</div>
              </div>
            </div>
          </div>
        </div>

        {/* Ambient background blur elements */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
        <div className="absolute left-1/4 -top-12 w-48 h-48 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
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
                    ? 'bg-blue-600 text-white shadow-md'
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
        {activeTab === 'logistics' && <LogisticsAndOpportunities />}
        {activeTab === 'campuslife' && <CampusLifeAndCarpooling />}
        {activeTab === 'bibliography' && <BibliographyGenerator />}
      </main>
    </div>
  );
}
