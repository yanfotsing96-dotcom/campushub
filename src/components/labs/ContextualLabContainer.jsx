import { useMemo } from 'react';
import { useAcademicFilter } from '../../hooks/useAcademicFilter';
import ComputerScienceLab from './ComputerScienceLab';
import PhysicsLab from './PhysicsLab';
import ChemistryLab from './ChemistryLab';
import BiologyLab from './BiologyLab';
import MathematicsLab from './MathematicsLab';
import { Lock, GraduationCap } from 'lucide-react';

/**
 * Conteneur Contextuel de Laboratoire & Playground
 * Adapte automatiquement et rigoureusement le module technique central selon la filière :
 * - Informatique : Playground interactif C / Python / SQL avec compilateur
 * - Physique : Formulaires de calculs, circuit RLC, Snell-Descartes et protocoles de TP
 * - Chimie : Tableau périodique interactif Mendeleïev, calculateur de molarité et pH
 * - Biologie : Transcription/Traduction ADN, échiquier de Punnett et atlas cellulaire
 * - Mathématiques : Algèbre matricielle, dérivation et intégration de Simpson
 */
export default function ContextualLabContainer({ className = '' }) {
  const { activeFiliere, activeNiveau, department } = useAcademicFilter();

  // Détermine quel composant spécialisé monter
  const LabComponent = useMemo(() => {
    switch (activeFiliere) {
      case 'Physique':
        return PhysicsLab;
      case 'Chimie':
        return ChemistryLab;
      case 'Biologie':
        return BiologyLab;
      case 'Mathématiques':
        return MathematicsLab;
      case 'Informatique':
      case 'IA-Data':
      case 'Cyber-Reseaux':
      default:
        return ComputerScienceLab;
    }
  }, [activeFiliere]);

  return (
    <div className={`space-y-5 ${className}`}>
      {/* En-tête de Certification Contextuelle */}
      <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <Lock size={12} className="text-indigo-400" />
              <span>Laboratoire Contextuel Dédié · MINESUP</span>
            </span>

            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/10 text-white font-mono">
              {department.code} · {activeNiveau}
            </span>
          </div>

          <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
            <span>Espace Laboratoire Pratique : {department.label}</span>
          </h2>

          <p className="text-xs text-slate-400">
            Module technique taillé sur-mesure pour votre promotion. Accès automatique et sans interférence aux outils de votre filière.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto text-xs font-mono">
          <span className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 flex items-center gap-1.5">
            <GraduationCap size={14} className="text-indigo-400" />
            <span>Filière : {activeFiliere}</span>
          </span>
        </div>
      </div>

      {/* Rendu Dynamique du Laboratoire Spécialisé */}
      <div className="animate-in fade-in duration-200">
        <LabComponent />
      </div>
    </div>
  );
}
