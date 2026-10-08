import { useState, useMemo } from 'react';
import {
  LayoutDashboard,
  FlaskConical,
  Scale,
  Droplets,
  Flame,
  Activity,
  Zap,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Atom,
  Search,
  RotateCcw,
  Maximize2,
  Minimize2,
  GraduationCap,
} from 'lucide-react';

// Importation des sous-modules spécialisés de chimie
import ChemistryDashboard from './chemistry/ChemistryDashboard';
import MolarityModule from './chemistry/MolarityModule';
import EquationBalancerModule from './chemistry/EquationBalancerModule';
import PHSimulatorModule from './chemistry/PHSimulatorModule';
import ThermodynamicsModule from './chemistry/ThermodynamicsModule';
import KineticsModule from './chemistry/KineticsModule';
import ElectrochemistryModule from './chemistry/ElectrochemistryModule';

/**
 * Navigation items groupés par niveau académique
 */
const NAVIGATION_SECTIONS = [
  {
    group: 'Vue d\'ensemble',
    items: [
      {
        id: 'dashboard',
        name: 'Tableau de Bord',
        shortName: 'Dashboard',
        icon: LayoutDashboard,
        badge: 'Hub',
        badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
        description: 'Synthèse des 6 laboratoires et accès rapides',
      },
    ],
  },
  {
    group: 'Modules L1-L2 (Fondamentaux)',
    items: [
      {
        id: 'molarity',
        name: 'Solutions & Molarité',
        shortName: 'Molarité',
        icon: FlaskConical,
        badge: 'L1-L2',
        badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
        description: 'Pesées m = C·V·M, loi de dilution & masses molaires',
      },
      {
        id: 'equations',
        name: 'Équilibreur d\'Équations',
        shortName: 'Stœchiométrie',
        icon: Scale,
        badge: 'L1-L2',
        badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
        description: 'Tableau d\'avancement, réactif limitant & conservation',
      },
      {
        id: 'ph_simulator',
        name: 'Simulateur de pH',
        shortName: 'pH & Tampons',
        icon: Droplets,
        badge: 'L1-L2',
        badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
        description: 'Spectre acido-basique 0-14 & Henderson-Hasselbalch',
      },
    ],
  },
  {
    group: 'Modules L3-Master (Avancé)',
    items: [
      {
        id: 'thermodynamics',
        name: 'Thermodynamique Chimique',
        shortName: 'Thermo (ΔG)',
        icon: Flame,
        badge: 'L3-M2',
        badgeColor: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
        description: 'Enthalpie ΔH°, Entropie ΔS°, Gibbs ΔG° & Ellingham',
      },
      {
        id: 'kinetics',
        name: 'Cinétique Chimique',
        shortName: 'Cinétique',
        icon: Activity,
        badge: 'L3-M2',
        badgeColor: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
        description: 'Ordres 0, 1, 2, temps de demi-vie & Arrhenius',
      },
      {
        id: 'electrochemistry',
        name: 'Électrochimie & Piles',
        shortName: 'Redox & Piles',
        icon: Zap,
        badge: 'L3-M2',
        badgeColor: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
        description: 'Piles Daniell, potentiels standards IUPAC & Nernst',
      },
    ],
  },
];

/**
 * Composant Principal : ChemistryPlayground
 * Hub modulaire de simulation physico-chimique pour étudiants de L1 à Master 2.
 */
export default function ChemistryPlayground() {
  // Gestion d'état de l'onglet actif
  const [activeModule, setActiveModule] = useState('dashboard');
  
  // Gestion d'état de la sidebar rétractable (Desktop)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  // Gestion d'état du menu mobile
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Recherche rapide de module ou filtre
  const [searchFilter, setSearchFilter] = useState('');

  // Plein écran virtuel pour le conteneur du playground
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Clé pour forcer le rafraîchissement d'un module si l'étudiant souhaite réinitialiser ses calculs
  const [resetKey, setResetKey] = useState(0);

  // Trouver l'item actif
  const currentNav = useMemo(() => {
    for (const group of NAVIGATION_SECTIONS) {
      const found = group.items.find((it) => it.id === activeModule);
      if (found) return found;
    }
    return NAVIGATION_SECTIONS[0].items[0];
  }, [activeModule]);

  const handleSelectModule = (moduleId) => {
    setActiveModule(moduleId);
    setIsMobileMenuOpen(false);
  };

  const handleResetCurrentModule = () => {
    setResetKey((prev) => prev + 1);
  };

  return (
    <div
      className={`relative w-full rounded-3xl bg-slate-950 text-slate-100 border border-slate-800/80 shadow-2xl transition-all duration-300 overflow-hidden font-sans ${
        isFullscreen ? 'fixed inset-2 z-50 rounded-2xl overflow-y-auto' : ''
      }`}
    >
      {/* Halo lumineux d'ambiance violet / indigo (glassmorphism) */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* BARRE SUPÉRIEURE DU PLAYGROUND (Top Bar) */}
      <header className="relative z-20 flex items-center justify-between px-4 sm:px-6 py-3.5 bg-slate-900/90 border-b border-slate-800/80 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          {/* Bouton Toggle Mobile */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
            title="Menu des laboratoires"
          >
            {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          {/* Bouton Rétracter Sidebar (Desktop) */}
          <button
            type="button"
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="hidden md:flex p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:border-violet-500/50 transition-all"
            title={isSidebarCollapsed ? 'Déplier la barre de navigation' : 'Rétracter la barre de navigation'}
          >
            {isSidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>

          {/* Branding interne du Playground */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-violet-600/30">
              <Atom size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold text-white tracking-tight">
                  Playground de Chimie
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-violet-500/20 text-violet-300 border border-violet-500/30 font-mono">
                  L1 ➔ Master 2
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                CampusHub · Simulateur Universitaire de Travaux Pratiques
              </p>
            </div>
          </div>
        </div>

        {/* Outils d'en-tête (Module actif, reset, plein écran) */}
        <div className="flex items-center gap-2">
          {/* Badge du module actuel */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-400">Laboratoire :</span>
            <strong className="text-violet-300">{currentNav.name}</strong>
          </div>

          {/* Bouton Réinitialiser l'état */}
          <button
            type="button"
            onClick={handleResetCurrentModule}
            className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
            title="Réinitialiser les paramètres du laboratoire"
          >
            <RotateCcw size={15} />
          </button>

          {/* Bouton Bascule Plein Écran */}
          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
            title={isFullscreen ? 'Quitter le mode plein écran' : 'Passer en plein écran'}
          >
            {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </button>
        </div>
      </header>

      {/* CORPS PRINCIPAL : SIDEBAR + PANNEAU DE CONTENU */}
      <div className="relative flex flex-col md:flex-row min-h-[700px]">
        {/* SIDEBAR INTERNE AU PLAYGROUND */}
        <aside
          className={`relative z-20 flex-shrink-0 transition-all duration-300 bg-slate-900/95 md:bg-slate-900/60 border-r border-slate-800/80 backdrop-blur-2xl flex flex-col justify-between ${
            isSidebarCollapsed ? 'md:w-20' : 'md:w-72'
          } ${
            isMobileMenuOpen
              ? 'fixed inset-y-0 left-0 z-50 w-72 shadow-2xl block'
              : 'hidden md:flex'
          }`}
        >
          {/* Header Mobile pour fermer */}
          <div className="md:hidden flex items-center justify-between p-4 border-b border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Navigation Chimie
            </span>
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-1 rounded-lg bg-slate-800 text-slate-300"
            >
              <X size={16} />
            </button>
          </div>

          {/* Recherche rapide dans la sidebar (affichée si dépliée) */}
          {!isSidebarCollapsed && (
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
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/60"
                />
              </div>
            </div>
          )}

          {/* Liste de navigation scrollable */}
          <div className="p-3 space-y-5 overflow-y-auto flex-1">
            {NAVIGATION_SECTIONS.map((section) => {
              // Filtrer selon la recherche
              const visibleItems = section.items.filter(
                (item) =>
                  !searchFilter ||
                  item.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
                  item.description.toLowerCase().includes(searchFilter.toLowerCase())
              );

              if (visibleItems.length === 0) return null;

              return (
                <div key={section.group} className="space-y-1.5 text-left">
                  {/* Titre du groupe */}
                  {!isSidebarCollapsed && (
                    <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                      {section.group}
                    </div>
                  )}

                  {/* Boutons d'items */}
                  <div className="space-y-1">
                    {visibleItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeModule === item.id;

                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleSelectModule(item.id)}
                          className={`w-full group rounded-xl p-2.5 transition-all text-left flex items-center gap-3 relative ${
                            isActive
                              ? 'bg-gradient-to-r from-violet-600/90 to-indigo-600/90 text-white shadow-lg shadow-violet-900/30 font-semibold'
                              : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 hover:border-indigo-500/30'
                          }`}
                          title={isSidebarCollapsed ? `${item.name} (${item.badge})` : undefined}
                        >
                          {/* Barre d'accentuation active sur le côté gauche */}
                          {isActive && (
                            <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-white rounded-r-full" />
                          )}

                          {/* Icône de l'outil */}
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
                              isActive
                                ? 'bg-white/20 text-white'
                                : 'bg-slate-950 border border-slate-800 text-slate-400 group-hover:text-violet-400 group-hover:border-violet-500/40'
                            }`}
                          >
                            <Icon size={16} />
                          </div>

                          {/* Libellé et description si non rétracté */}
                          {!isSidebarCollapsed && (
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1">
                                <span className="text-xs truncate font-medium">
                                  {item.name}
                                </span>
                                <span
                                  className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold uppercase shrink-0 ${
                                    isActive
                                      ? 'bg-white/20 text-white'
                                      : item.badgeColor
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
            {!isSidebarCollapsed ? (
              <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-violet-300">
                  <GraduationCap size={15} />
                  <span>CampusHub Chimie</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Environnement de simulation interactif conforme aux UE de Chimie Générale, Minérale & Physique.
                </p>
              </div>
            ) : (
              <div className="flex justify-center text-violet-400 py-1" title="CampusHub Sciences">
                <Atom size={20} />
              </div>
            )}
          </div>
        </aside>

        {/* OVERLAY SOMBRE LORSQUE LA SIDEBAR MOBILE EST OUVERTE */}
        {isMobileMenuOpen && (
          <div
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          />
        )}

        {/* PANNEAU DE CONTENU CENTRAL DYNAMIQUE */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-full">
          {/* Rendu conditionnel des sous-modules avec clé de réinitialisation */}
          <div key={`${activeModule}-${resetKey}`} className="animate-in fade-in duration-200">
            {activeModule === 'dashboard' && (
              <ChemistryDashboard onSelectModule={handleSelectModule} />
            )}

            {activeModule === 'molarity' && <MolarityModule />}

            {activeModule === 'equations' && <EquationBalancerModule />}

            {activeModule === 'ph_simulator' && <PHSimulatorModule />}

            {activeModule === 'thermodynamics' && <ThermodynamicsModule />}

            {activeModule === 'kinetics' && <KineticsModule />}

            {activeModule === 'electrochemistry' && <ElectrochemistryModule />}
          </div>
        </main>
      </div>
    </div>
  );
}
