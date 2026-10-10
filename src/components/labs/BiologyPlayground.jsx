import { useState, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Dna,
  RotateCcw,
  Maximize2,
  Minimize2,
} from 'lucide-react';

import BiologySidebar from './biology/BiologySidebar';
import { BIOLOGY_NAVIGATION_SECTIONS } from './biology/biologyData';
import BiologyDashboard from './biology/BiologyDashboard';
import CellMitosisModule from './biology/CellMitosisModule';
import MichaelisMentenModule from './biology/MichaelisMentenModule';
import BacterialGrowthModule from './biology/BacterialGrowthModule';
import MolecularGeneticsModule from './biology/MolecularGeneticsModule';
import ImmunologyModule from './biology/ImmunologyModule';
import LotkaVolterraModule from './biology/LotkaVolterraModule';
import BiologyExamTrainerModule from './biology/BiologyExamTrainerModule';

/**
 * Composant Principal : BiologyPlayground
 * Hub Central de Biologie & Sciences de la Vie pour CampusHub (L1 à Master 2).
 */
export default function BiologyPlayground() {
  const [activeModule, setActiveModule] = useState('dashboard');
  const [examCategory, setExamCategory] = useState('all');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  // Détermination des informations du module actif
  const currentNav = useMemo(() => {
    for (const group of BIOLOGY_NAVIGATION_SECTIONS) {
      const found = group.items.find((it) => it.id === activeModule);
      if (found) return found;
    }
    return BIOLOGY_NAVIGATION_SECTIONS[0].items[0];
  }, [activeModule]);

  const handleSelectModule = (moduleId) => {
    setActiveModule(moduleId);
    setIsMobileMenuOpen(false);
  };

  const handleNavigateToExam = (category = 'all') => {
    setExamCategory(category);
    setActiveModule('exam_trainer');
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
      {/* Halos d'ambiance émeraude / violet (glassmorphism) */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* BARRE SUPÉRIEURE DU HUB (Top Bar) */}
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
            className="hidden md:flex p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:border-emerald-500/50 transition-all cursor-pointer"
            title={isSidebarCollapsed ? 'Déplier la barre de navigation' : 'Rétracter la barre de navigation'}
          >
            {isSidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>

          {/* Branding interne du BiologyLab Hub */}
          <div className="flex items-center gap-2.5 text-left">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-600/30">
              <Dna size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold text-white tracking-tight">
                  BiologyLab Hub
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                  Licence ➔ Master
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                CampusHub · Simulateur Universitaire des Sciences de la Vie
              </p>
            </div>
          </div>
        </div>

        {/* Outils d'en-tête (Module actif, reset, plein écran) */}
        <div className="flex items-center gap-2">
          {/* Badge du module actif */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-400">Laboratoire :</span>
            <strong className="text-emerald-300">{currentNav.name}</strong>
          </div>

          {/* Bouton Réinitialiser l'état */}
          <button
            type="button"
            onClick={handleResetCurrentModule}
            className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors cursor-pointer"
            title="Réinitialiser les paramètres du laboratoire"
          >
            <RotateCcw size={15} />
          </button>

          {/* Bouton Bascule Plein Écran */}
          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors cursor-pointer"
            title={isFullscreen ? 'Quitter le mode plein écran' : 'Passer en plein écran'}
          >
            {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </button>
        </div>
      </header>

      {/* CORPS PRINCIPAL : SIDEBAR + PANNEAU DE CONTENU */}
      <div className="relative flex flex-col md:flex-row min-h-[700px]">
        {/* SIDEBAR RESPONSIVE */}
        <BiologySidebar
          activeModuleId={activeModule}
          onSelectModule={handleSelectModule}
          isCollapsed={isSidebarCollapsed}
          isMobileOpen={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        {/* PANNEAU DE CONTENU DYNAMIQUE */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-full">
          <div key={`${activeModule}-${resetKey}`} className="animate-in fade-in duration-200">
            {activeModule === 'dashboard' && (
              <BiologyDashboard
                onSelectModule={handleSelectModule}
                onNavigateToExam={handleNavigateToExam}
              />
            )}

            {activeModule === 'cell_mitosis' && (
              <CellMitosisModule onNavigateToExam={handleNavigateToExam} />
            )}

            {activeModule === 'enzymology' && (
              <MichaelisMentenModule onNavigateToExam={handleNavigateToExam} />
            )}

            {activeModule === 'bacterial_growth' && (
              <BacterialGrowthModule onNavigateToExam={handleNavigateToExam} />
            )}

            {activeModule === 'molecular_genetics' && (
              <MolecularGeneticsModule onNavigateToExam={handleNavigateToExam} />
            )}

            {activeModule === 'immunology' && (
              <ImmunologyModule onNavigateToExam={handleNavigateToExam} />
            )}

            {activeModule === 'ecology_lotka_volterra' && (
              <LotkaVolterraModule onNavigateToExam={handleNavigateToExam} />
            )}

            {activeModule === 'exam_trainer' && (
              <BiologyExamTrainerModule
                onSelectModule={handleSelectModule}
                initialCategory={examCategory}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
