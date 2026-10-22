import { useState, useMemo } from 'react';
import PhysicsSidebar from './physics/PhysicsSidebar';
import PhysicsOverview from './physics/PhysicsOverview';
import MechanicsModule from './physics/MechanicsModule';
import RlcModule from './physics/RlcModule';
import OpticsModule from './physics/OpticsModule';
import ElectromagnetismModule from './physics/ElectromagnetismModule';
import ThermodynamicsModule from './physics/ThermodynamicsModule';
import QuantumModule from './physics/QuantumModule';
import PhysicsExamTrainerModule from './physics/PhysicsExamTrainerModule';
import TPExportModal from './physics/TPExportModal';
import { PHYSICS_MODULES } from './physics/physicsData';
import Lab02PhysicsView from './Lab02PhysicsView';
import PhysicsLabWorkspace from './l02/PhysicsLabWorkspace';
import { School, Sparkles, Atom, LayoutDashboard } from 'lucide-react';

/**
 * Composant Central "PhysicsLab Hub" pour la filière Physique de CampusHub (Lab L02)
 *
 * Combine :
 * - Le Répertoire Officiel des 14 Filières MINESUP de UY1 à UEb (Page 2 et 3) avec numéros de dossier
 * - Le Workspace 3 Panneaux (Consignes MINESUP, Simulateurs RLC & Optique, Correcteur IA)
 * - Les 6 Bancs d'Essais Virtuels & Entraîneur d'Examen
 * - Le Thème Beige & Chocolat MINESUP (#F7F5F0, #EFECE6, #E3DEC9, #5C4033) avec accent Cyan/Technique (#0284C7)
 */
export default function PhysicsLab() {
  const [mainTab, setMainTab] = useState('workspace'); // 'workspace' | 'filieres' | 'simulators'
  const [activeModuleId, setActiveModuleId] = useState('overview');
  const [examCategory, setExamCategory] = useState('all');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportPayload, setExportPayload] = useState(null);

  // Détermine les données du module actif
  const currentModuleData = useMemo(() => {
    if (activeModuleId === 'overview' || activeModuleId === 'exam_trainer') {
      return PHYSICS_MODULES[0]; // module par défaut pour export global si besoin
    }
    return PHYSICS_MODULES.find((m) => m.id === activeModuleId) || PHYSICS_MODULES[0];
  }, [activeModuleId]);

  // Gestionnaire de navigation vers le Mode Examen avec pré-filtrage optionnel de la discipline
  const handleNavigateToExam = (categoryKey = 'all') => {
    setExamCategory(categoryKey);
    setActiveModuleId('exam_trainer');
  };

  // Gestionnaire d'exportation déclenché depuis un sous-module avec ses paramètres actuels
  const handleExportFromModule = ({ moduleData, currentParams, computedResults }) => {
    setExportPayload({
      moduleData,
      currentParams,
      computedResults,
    });
    setIsExportModalOpen(true);
  };

  // Déclencheur global depuis la barre latérale
  const handleOpenGlobalExport = () => {
    if (exportPayload) {
      setIsExportModalOpen(true);
    } else {
      setExportPayload({
        moduleData: currentModuleData,
        currentParams: currentModuleData.defaultParams,
        computedResults: {
          'Statut de simulation': {
            val: 'Paramètres étalons enregistrés',
            unit: '',
            comment: 'Prêt pour manipulation',
          },
        },
      });
      setIsExportModalOpen(true);
    }
  };

  return (
    <div className="w-full space-y-6 text-left">
      {/* En-tête de Sélection de Mode (Thème Beige & Chocolat MINESUP) */}
      <div className="p-3.5 sm:p-4 rounded-3xl bg-[#EFECE6] border border-[#E3DEC9] flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="inline-flex p-1 rounded-2xl bg-[#F7F5F0] border border-[#E3DEC9] text-xs font-bold">
          <button
            type="button"
            onClick={() => setMainTab('workspace')}
            className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              mainTab === 'workspace'
                ? 'bg-[#0284C7] text-white shadow-xs'
                : 'text-[#6E5D4F] hover:text-[#2C2218]'
            }`}
          >
            <LayoutDashboard size={14} />
            <span>Workspace 3 Panneaux</span>
          </button>
          <button
            type="button"
            onClick={() => setMainTab('filieres')}
            className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              mainTab === 'filieres'
                ? 'bg-[#5C4033] text-white shadow-xs'
                : 'text-[#6E5D4F] hover:text-[#2C2218]'
            }`}
          >
            <School size={14} />
            <span>Filières Officielles UY1 à UEb (14)</span>
          </button>
          <button
            type="button"
            onClick={() => setMainTab('simulators')}
            className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              mainTab === 'simulators'
                ? 'bg-[#5C4033] text-white shadow-xs'
                : 'text-[#6E5D4F] hover:text-[#2C2218]'
            }`}
          >
            <Atom size={14} />
            <span>Bancs Avancés (6 Modules)</span>
          </button>
        </div>

        <div className="text-xs text-[#0284C7] font-bold flex items-center gap-1.5">
          <Sparkles size={13} className="text-[#0284C7]" />
          <span>Lab L02 · Physique MINESUP</span>
        </div>
      </div>

      {/* Vue 0 : Espace de Travail en 3 Panneaux Lab L02 */}
      {mainTab === 'workspace' && <PhysicsLabWorkspace />}

      {/* Vue 1 : Répertoire Officiel des 14 Filières */}
      {mainTab === 'filieres' && (
        <Lab02PhysicsView onNavigateToSimulator={() => setMainTab('workspace')} />
      )}

      {/* Vue 2 : Bancs de Simulation & Entraîneur */}
      {mainTab === 'simulators' && (
        <div className="w-full min-h-[600px] flex flex-col lg:flex-row gap-6 items-start">
          {/* Barre Latérale SaaS avec Sélecteur par Niveaux & Accès Examen */}
          <PhysicsSidebar
            activeModuleId={activeModuleId}
            onSelectModule={(id) => setActiveModuleId(id)}
            onOpenGlobalExport={handleOpenGlobalExport}
          />

          {/* Espace Central de Simulation & Visualisation */}
          <main className="flex-1 w-full min-w-0 transition-all duration-300">
            {activeModuleId === 'overview' && (
              <PhysicsOverview onSelectModule={(id) => setActiveModuleId(id)} />
            )}

            {activeModuleId === 'exam_trainer' && (
              <PhysicsExamTrainerModule
                key={examCategory}
                initialCategory={examCategory}
                onNavigateToModule={(modId) => setActiveModuleId(modId)}
              />
            )}

            {activeModuleId === 'mechanics' && (
              <MechanicsModule
                onExport={handleExportFromModule}
                onNavigateToExam={handleNavigateToExam}
              />
            )}

            {activeModuleId === 'rlc' && (
              <RlcModule
                onExport={handleExportFromModule}
                onNavigateToExam={handleNavigateToExam}
              />
            )}

            {activeModuleId === 'optics' && (
              <OpticsModule
                onExport={handleExportFromModule}
                onNavigateToExam={handleNavigateToExam}
              />
            )}

            {activeModuleId === 'electromagnetism' && (
              <ElectromagnetismModule
                onExport={handleExportFromModule}
                onNavigateToExam={handleNavigateToExam}
              />
            )}

            {activeModuleId === 'thermodynamics' && (
              <ThermodynamicsModule
                onExport={handleExportFromModule}
                onNavigateToExam={handleNavigateToExam}
              />
            )}

            {activeModuleId === 'quantum' && (
              <QuantumModule
                onExport={handleExportFromModule}
                onNavigateToExam={handleNavigateToExam}
              />
            )}
          </main>
        </div>
      )}

      {/* Modal d'Exportation de Rapport de TP Natif PDF A4 */}
      {isExportModalOpen && exportPayload && (
        <TPExportModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          moduleData={exportPayload.moduleData}
          currentParams={exportPayload.currentParams}
          computedResults={exportPayload.computedResults}
        />
      )}
    </div>
  );
}
