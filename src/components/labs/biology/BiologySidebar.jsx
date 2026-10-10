import { useState } from 'react';
import {
  Search,
  GraduationCap,
  X,
  Dna,
} from 'lucide-react';
import { BIOLOGY_NAVIGATION_SECTIONS } from './biologyData';


export default function BiologySidebar({
  activeModuleId,
  onSelectModule,
  isCollapsed,
  isMobileOpen,
  onCloseMobile,
}) {
  const [searchFilter, setSearchFilter] = useState('');

  const handleSelect = (id) => {
    onSelectModule(id);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      <aside
        className={`relative z-20 flex-shrink-0 transition-all duration-300 bg-slate-900/95 md:bg-slate-900/70 border-r border-slate-800/80 backdrop-blur-2xl flex flex-col justify-between ${
          isCollapsed ? 'md:w-20' : 'md:w-72'
        } ${
          isMobileOpen
            ? 'fixed inset-y-0 left-0 z-50 w-72 shadow-2xl block'
            : 'hidden md:flex'
        }`}
      >
        {/* Header Mobile pour fermer */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-slate-800">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
            Navigation Biologie
          </span>
          <button
            type="button"
            onClick={onCloseMobile}
            className="p-1 rounded-lg bg-slate-800 text-slate-300"
          >
            <X size={16} />
          </button>
        </div>

        {/* Barre de recherche dans la sidebar si non rétractée */}
        {!isCollapsed && (
          <div className="p-3.5 border-b border-slate-800/80">
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Filtrer les laboratoires..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/60"
              />
            </div>
          </div>
        )}

        {/* Liste des sections de navigation */}
        <div className="p-3 space-y-5 overflow-y-auto flex-1 text-left">
          {BIOLOGY_NAVIGATION_SECTIONS.map((section) => {
            const visibleItems = section.items.filter(
              (item) =>
                !searchFilter ||
                item.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
                item.description.toLowerCase().includes(searchFilter.toLowerCase())
            );

            if (visibleItems.length === 0) return null;

            return (
              <div key={section.group} className="space-y-1.5">
                {!isCollapsed && (
                  <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                    {section.group}
                  </div>
                )}

                <div className="space-y-1">
                  {visibleItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeModuleId === item.id;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleSelect(item.id)}
                        className={`w-full group rounded-xl p-2.5 transition-all text-left flex items-center gap-3 relative ${
                          isActive
                            ? 'bg-gradient-to-r from-emerald-600/90 to-teal-600/90 text-white shadow-lg shadow-emerald-950/40 font-semibold'
                            : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 hover:border-emerald-500/30'
                        }`}
                        title={isCollapsed ? `${item.name} (${item.badge})` : undefined}
                      >
                        {isActive && (
                          <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-white rounded-r-full" />
                        )}

                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : 'bg-slate-950 border border-slate-800 text-slate-400 group-hover:text-emerald-400 group-hover:border-emerald-500/40'
                          }`}
                        >
                          <Icon size={16} />
                        </div>

                        {!isCollapsed && (
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-xs truncate font-medium">
                                {item.name}
                              </span>
                              <span
                                className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold uppercase shrink-0 ${
                                  isActive ? 'bg-white/20 text-white' : item.badgeColor
                                }`}
                              >
                                {item.badge}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-400 truncate mt-0.5 opacity-80">
                              {item.shortName}
                            </p>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer de la Sidebar */}
        <div className="p-3 border-t border-slate-800/80 text-left">
          {!isCollapsed ? (
            <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-emerald-400">
                <GraduationCap size={15} />
                <span>BiologyLab Hub</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Conforme aux maquettes pédagogiques de Biologie Cellulaire, Biochimie, Génétique & Écologie.
              </p>
            </div>
          ) : (
            <div className="flex justify-center text-emerald-400 py-1" title="CampusHub Biologie">
              <Dna size={20} />
            </div>
          )}
        </div>
      </aside>

      {/* Overlay mobile */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
        />
      )}
    </>
  );
}
