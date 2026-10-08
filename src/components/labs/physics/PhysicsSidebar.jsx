import { useState } from 'react';
import {
  LayoutDashboard,
  Compass,
  Activity,
  Atom,
  Zap,
  Flame,
  Layers,
  ChevronRight,
  GraduationCap,
  Sparkles,
  FileText,
  Menu,
  X,
} from 'lucide-react';
import { PHYSICS_MODULES } from './physicsData';

export default function PhysicsSidebar({
  activeModuleId,
  onSelectModule,
  onOpenGlobalExport,
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const iconMap = {
    Compass: Compass,
    Activity: Activity,
    Atom: Atom,
    Zap: Zap,
    Flame: Flame,
    Layers: Layers,
  };

  const fondamentauxModules = PHYSICS_MODULES.filter((m) => m.sectionId === 'fondamentaux');
  const avanceModules = PHYSICS_MODULES.filter((m) => m.sectionId === 'avance');

  const handleSelect = (id) => {
    onSelectModule(id);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Bouton de déclenchement mobile */}
      <div className="lg:hidden flex items-center justify-between p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-left mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
            <Atom size={16} />
          </div>
          <div>
            <div className="text-xs font-bold text-white">Laboratoires de Physique</div>
            <div className="text-[10px] text-slate-400 font-mono">
              {activeModuleId === 'overview'
                ? 'Tableau de bord (Overview)'
                : PHYSICS_MODULES.find((m) => m.id === activeModuleId)?.shortTitle || 'Module'}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-xl bg-slate-950 text-slate-300 hover:text-white border border-slate-800"
          aria-label="Ouvrir le menu des modules"
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Conteneur Sidebar Desktop & Drawer Mobile */}
      <aside
        className={`${
          mobileOpen ? 'block' : 'hidden'
        } lg:block w-full lg:w-72 shrink-0 space-y-5 text-left`}
      >
        <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-4 shadow-xl backdrop-blur-xl space-y-5">
          {/* En-tête de la barre latérale */}
          <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30">
                <Atom size={18} />
              </div>
              <div>
                <h3 className="text-sm font-black text-white tracking-tight">PhysicsLab Hub</h3>
                <span className="text-[10px] text-indigo-400 font-mono">UY1 / Polytech · MINESUP</span>
              </div>
            </div>
          </div>

          {/* Onglet Principal : Tableau de bord (Overview) */}
          <div>
            <button
              type="button"
              onClick={() => handleSelect('overview')}
              className={`w-full p-2.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-between gap-2.5 ${
                activeModuleId === 'overview'
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80 border border-transparent hover:border-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <LayoutDashboard size={16} className={activeModuleId === 'overview' ? 'text-white' : 'text-indigo-400'} />
                <span>Tableau de Bord (Overview)</span>
              </div>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${activeModuleId === 'overview' ? 'bg-white/20' : 'bg-slate-800 text-slate-400'}`}>
                6 TP
              </span>
            </button>
          </div>

          {/* Section 1 : Fondamentaux (L1 - L2) */}
          <div className="space-y-2">
            <div className="px-2 pt-2 flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                <GraduationCap size={13} />
                <span>Fondamentaux (L1 - L2)</span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono">3 modules</span>
            </div>

            <div className="space-y-1">
              {fondamentauxModules.map((m) => {
                const IconComp = iconMap[m.iconName] || Activity;
                const isActive = activeModuleId === m.id;

                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => handleSelect(m.id)}
                    className={`w-full p-2.5 rounded-2xl text-xs transition-all flex items-center justify-between group ${
                      isActive
                        ? 'bg-indigo-600/20 text-white border border-indigo-500/40 shadow-sm font-bold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60 font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 border transition-all ${
                          isActive
                            ? 'bg-indigo-600 text-white border-indigo-400'
                            : 'bg-slate-950 text-slate-400 border-slate-800 group-hover:text-indigo-300'
                        }`}
                      >
                        <IconComp size={14} />
                      </div>
                      <div className="truncate">
                        <div className="truncate">{m.shortTitle}</div>
                        <div className="text-[10px] text-slate-500 font-mono truncate">{m.formula}</div>
                      </div>
                    </div>

                    <ChevronRight
                      size={14}
                      className={`shrink-0 transition-transform ${
                        isActive ? 'text-indigo-400 translate-x-0.5' : 'text-slate-600 group-hover:text-slate-400'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2 : Avancé (L3 - Master) */}
          <div className="space-y-2">
            <div className="px-2 pt-2 flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-violet-400 flex items-center gap-1.5">
                <Sparkles size={13} />
                <span>Avancé (L3 - Master)</span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono">3 modules</span>
            </div>

            <div className="space-y-1">
              {avanceModules.map((m) => {
                const IconComp = iconMap[m.iconName] || Zap;
                const isActive = activeModuleId === m.id;

                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => handleSelect(m.id)}
                    className={`w-full p-2.5 rounded-2xl text-xs transition-all flex items-center justify-between group ${
                      isActive
                        ? 'bg-violet-600/20 text-white border border-violet-500/40 shadow-sm font-bold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60 font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 border transition-all ${
                          isActive
                            ? 'bg-violet-600 text-white border-violet-400'
                            : 'bg-slate-950 text-slate-400 border-slate-800 group-hover:text-violet-300'
                        }`}
                      >
                        <IconComp size={14} />
                      </div>
                      <div className="truncate">
                        <div className="truncate">{m.shortTitle}</div>
                        <div className="text-[10px] text-slate-500 font-mono truncate">{m.formula}</div>
                      </div>
                    </div>

                    <ChevronRight
                      size={14}
                      className={`shrink-0 transition-transform ${
                        isActive ? 'text-violet-400 translate-x-0.5' : 'text-slate-600 group-hover:text-slate-400'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bouton d'exportation directe en bas de la sidebar */}
          <div className="pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onOpenGlobalExport}
              className="w-full py-2.5 px-3 rounded-2xl bg-slate-950 hover:bg-slate-800/90 text-slate-300 hover:text-white text-xs font-semibold border border-slate-800 hover:border-violet-500/30 transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <FileText size={14} className="text-violet-400" />
              <span>Export Rapport de TP (.md)</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
