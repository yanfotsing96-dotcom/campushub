import { useState, useMemo } from 'react';
import PhysicsSidebar from './physics/PhysicsSidebar';
import PhysicsOverview from './physics/PhysicsOverview';
import MechanicsModule from './physics/MechanicsModule';
import RlcModule from './physics/RlcModule';
import OpticsModule from './physics/OpticsModule';
import ElectromagnetismModule from './physics/ElectromagnetismModule';
import ThermodynamicsModule from './physics/ThermodynamicsModule';
import QuantumModule from './physics/QuantumModule';
import TPExportModal from './physics/TPExportModal';
import { PHYSICS_MODULES } from './physics/physicsData';

/**
 * Composant Central "PhysicsLab Hub" pour la filière Physique de CampusHub (L1 à Master 2)
 *
 * Architecture SaaS haut de gamme (style Vercel / Stripe / virtual labs) :
 * - Navigation Latérale (Sidebar) structurée par cycles (L1-L2 Fondamentaux vs L3-Master Avancé + Overview)
 * - Tableau de bord d'accueil interactif avec formules clés, KPIs et lancement rapide
 * - 6 bancs d'essais virtuels avec ajustement de paramètres physiques personnalisés en direct
 * - Graphiques SVG temps réel (trajectoires, résonance, optique, ondes Maxwell, diagramme Clapeyron, puits quantique)
 * - Exportation de compte-rendu de TP propre en Markdown (API Blob UTF-8) prêt pour insertion académique
 */
export default function PhysicsLab() {
  const [activeModuleId, setActiveModuleId] = useState('overview');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportPayload, setExportPayload] = useState(null);

  // Détermine les données du module actif
  const currentModuleData = useMemo(() => {
    if (activeModuleId === 'overview') {
      return PHYSICS_MODULES[0]; // module par défaut pour export global si besoin
    }
    return PHYSICS_MODULES.find((m) => m.id === activeModuleId) || PHYSICS_MODULES[0];
  }, [activeModuleId]);

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
          'Statut de simulation': { val: 'Paramètres étalons enregistrés', unit: '', comment: 'Prêt pour manipulation' },
        },
      });
      setIsExportModalOpen(true);
    }
  };

  return (
    <div className="w-full text-slate-100 min-h-[600px] flex flex-col lg:flex-row gap-6 items-start">
      {/* Barre Latérale SaaS avec Sélecteur par Niveaux (L1-L2 / L3-Master) */}
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

        {activeModuleId === 'mechanics' && (
          <MechanicsModule onExport={handleExportFromModule} />
        )}

        {activeModuleId === 'rlc' && (
          <RlcModule onExport={handleExportFromModule} />
        )}

        {activeModuleId === 'optics' && (
          <OpticsModule onExport={handleExportFromModule} />
        )}

        {activeModuleId === 'electromagnetism' && (
          <ElectromagnetismModule onExport={handleExportFromModule} />
        )}

        {activeModuleId === 'thermodynamics' && (
          <ThermodynamicsModule onExport={handleExportFromModule} />
        )}

        {activeModuleId === 'quantum' && (
          <QuantumModule onExport={handleExportFromModule} />
        )}
      </main>

      {/* Modal d'Exportation de Rapport de TP Propre (API Blob UTF-8) */}
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
