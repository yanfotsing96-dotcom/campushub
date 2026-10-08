import { useMemo } from 'react';
import { Building } from 'lucide-react';
import DynamicPoleTechBlock from '../components/tech/DynamicPoleTechBlock';
import ContextualLabContainer from '../components/labs/ContextualLabContainer';
import { useCampusHub } from '../hooks/useCampusHub';
import { useAuth } from '../hooks/useAuth';
import { useAcademicFilter } from '../hooks/useAcademicFilter';
import { getDepartmentPole } from '../components/tech/data/departmentPoleConfig';

export default function TechHubPage() {
  const { selectedUniversity } = useCampusHub();
  const { user } = useAuth();
  const { activeFiliere, activeNiveau } = useAcademicFilter();

  const userFiliere = activeFiliere || user?.filiere || 'Informatique';

  const pole = useMemo(() => {
    return getDepartmentPole(userFiliere);
  }, [userFiliere]);

  const PoleIcon = pole.icon;

  return (
    <div className="page-content py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Hero Banner with Dynamic Department Scope */}
      <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-r ${pole.heroGradient} text-white p-6 md:p-8 shadow-2xl border ${pole.borderGlow} transition-all duration-300`}>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-white/10 text-white border border-white/15">
              <PoleIcon size={14} className="text-amber-400" />
              <span>🇨🇲 Pôle National d'Excellence · {pole.badge}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
              {pole.title}
            </h1>
            <p className="text-sm md:text-base text-slate-200 leading-relaxed font-medium">
              {pole.description}
            </p>
            <p className="text-xs text-slate-300 leading-relaxed">
              Hub académique pour la filière <strong>{userFiliere}</strong> ({activeNiveau}) au sein du réseau universitaire camerounais ({selectedUniversity.name}, Polytechnique, Douala, Dschang, Buea, UY1).
            </p>
          </div>

          {/* Quick Metrics Badges */}
          <div className="grid grid-cols-2 gap-3 min-w-[240px]">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/10 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/15 text-white flex items-center justify-center flex-shrink-0">
                <PoleIcon size={20} />
              </div>
              <div className="text-left">
                <div className="text-lg font-black text-white">{pole.badge}</div>
                <div className="text-[11px] text-slate-300 font-medium">{activeNiveau}</div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/10 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center flex-shrink-0">
                <Building size={20} />
              </div>
              <div className="text-left">
                <div className="text-lg font-black text-white">{selectedUniversity.code}</div>
                <div className="text-[11px] text-slate-300 font-medium">{selectedUniversity.city}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Ambient background glow */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-white/5 blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 -top-12 w-48 h-48 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
      </div>

      {/* 1. Dynamic Department Pole Block with all specialized tools */}
      <DynamicPoleTechBlock showSimulator={false} />

      {/* 2. Specialized Laboratory / Playground Adapted to Faculty */}
      <div className="pt-2">
        <ContextualLabContainer />
      </div>
    </div>
  );
}
