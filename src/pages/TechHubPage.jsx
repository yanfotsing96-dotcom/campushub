import { Cpu, Terminal, Building } from 'lucide-react';
import TechExcellenceHub from '../components/tech/TechExcellenceHub';
import { useCampusHub } from '../hooks/useCampusHub';

export default function TechHubPage() {
  const { selectedUniversity } = useCampusHub();

  return (
    <div className="page-content py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Hero Banner with National Tech Scope */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white p-6 md:p-8 shadow-2xl border border-indigo-800/40">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <Cpu size={14} className="text-amber-400" />
              <span>🇨🇲 Pôle National d'Excellence · Informatique & Génie Logiciel</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
              Cœur Technologique & Programmation Universitaire
            </h1>
            <p className="text-sm md:text-base text-slate-300 leading-relaxed">
              Le hub centralisé pour les étudiants en informatique du Cameroun ({selectedUniversity.name}, Polytechnique, Douala, Dschang, Buea) : Playground C/Python/SQL en direct, algorithmes fondamentaux, systèmes d'exploitation POSIX et annales nationales corrigées.
            </p>
          </div>

          {/* Quick Metrics Badges */}
          <div className="grid grid-cols-2 gap-3 min-w-[240px]">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/10 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center flex-shrink-0">
                <Terminal size={20} />
              </div>
              <div>
                <div className="text-lg font-black text-white">4 Langages</div>
                <div className="text-[11px] text-slate-300 font-medium">C, Py, JS, SQL</div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/10 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center flex-shrink-0">
                <Building size={20} />
              </div>
              <div>
                <div className="text-lg font-black text-white">{selectedUniversity.code}</div>
                <div className="text-[11px] text-slate-300 font-medium">{selectedUniversity.city}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Ambient background glow */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 -top-12 w-48 h-48 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      </div>

      {/* Main Tech Hub Container */}
      <TechExcellenceHub />
    </div>
  );
}
