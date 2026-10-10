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

/**
 * Composant Central "PhysicsLab Hub" pour la filière Physique de CampusHub (L1 à Master 2)
 *
 * Architecture SaaS haut de gamme :
 * - Navigation Latérale (Sidebar) structurée par cycles (L1-L2 Fondamentaux vs L3-Master Avancé + Overview + Mode Examen)
 * - Tableau de bord d'accueil interactif avec formules clés, KPIs et lancement rapide
 * - 6 bancs d'essais virtuels avec ajustement dynamique des paramètres physiques (curseurs + champs libres)
 * - Graphismes vectoriels SVG temps réel (trajectoires balistiques, Bode RLC, réfraction, ondes Maxwell, cycles P-V, puits quantique)
 * - Mode Examen & Auto-Évaluation intégré : QCM universitaires, correction instantanée, score global et pas à pas détaillé
 * - Module d'Exportation PDF Natif A4 (jsPDF + html2canvas, scale: 2) avec formules KaTeX et métadonnées certifiées
 */
export default function PhysicsLab() {
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
      // Préremplit avec le module courant
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
    <div className="w-full text-slate-100 min-h-[600px] flex flex-col lg:flex-row gap-6 items-start">
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
