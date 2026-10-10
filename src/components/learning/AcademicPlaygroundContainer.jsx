import { useState, useMemo } from 'react';
import {
  Code2,
  FlaskConical,
  Atom,
  Dna,
  Binary,
  BookOpen,
  Lock,
} from 'lucide-react';
import CodePlayground from '../learning/CodePlayground';
import ChemistryLab from '../labs/ChemistryLab';
import PhysicsLab from '../labs/PhysicsLab';
import BiologyLab from '../labs/BiologyLab';
import MathematicsLab from '../labs/MathematicsLab';
import FalshOverview from '../falsh/FalshOverview';
import MethodologyAssistantModule from '../falsh/modules/MethodologyAssistantModule';
import FiguresOfStyleModule from '../falsh/modules/FiguresOfStyleModule';
import BibliographyGeneratorModule from '../falsh/modules/BibliographyGeneratorModule';
import HumanitiesResourcesModule from '../falsh/modules/HumanitiesResourcesModule';
import { academicAccessService } from '../../services/academicAccessService';

const PLAYGROUND_ICONS = {
  code: Code2,
  chemistry: FlaskConical,
  physics: Atom,
  biology: Dna,
  mathematics: Binary,
  falsh: BookOpen,
};

/**
 * AcademicPlaygroundContainer
 * Monte le bon playground selon la filière :
 * - Informatique : CodePlayground (C, Python, SQL, HTML/JS)
 * - Chimie : ChemistryLab
 * - Physique : PhysicsLab
 * - Biologie : BiologyLab
 * - Mathématiques : MathematicsLab
 * - Lettres / FALSH : Atelier méthodologique littéraire interactif
 */
export default function AcademicPlaygroundContainer({ filiere, niveau, className = '' }) {
  const config = useMemo(() => {
    return academicAccessService.getPlaygroundConfig(filiere);
  }, [filiere]);

  const [falshActiveTab, setFalshActiveTab] = useState('overview'); // overview, methodology, figures, bibliography, resources

  const renderPlayground = () => {
    switch (config.type) {
      case 'code':
        return <CodePlayground />;
      case 'chemistry':
        return <ChemistryLab />;
      case 'physics':
        return <PhysicsLab />;
      case 'biology':
        return <BiologyLab />;
      case 'mathematics':
        return <MathematicsLab />;
      case 'falsh':
      default:
        return (
          <div className="space-y-6">
            {/* Sous-navigation de l'atelier FALSH */}
            <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-2 flex flex-wrap gap-1.5 shadow-lg">
              {[
                { id: 'overview', label: 'Vue d\'ensemble & Outils' },
                { id: 'methodology', label: 'Assistant Dissertation' },
                { id: 'figures', label: 'Figures de Style' },
                { id: 'bibliography', label: 'Normes Bibliographiques' },
                { id: 'resources', label: 'Fiches & Partage' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFalshActiveTab(tab.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    falshActiveTab === tab.id
                      ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {falshActiveTab === 'overview' && <FalshOverview onSelectModule={(mod) => setFalshActiveTab(mod)} />}
            {falshActiveTab === 'methodology' && <MethodologyAssistantModule />}
            {falshActiveTab === 'figures' && <FiguresOfStyleModule />}
            {falshActiveTab === 'bibliography' && <BibliographyGeneratorModule />}
            {falshActiveTab === 'resources' && <HumanitiesResourcesModule />}
          </div>
        );
    }
  };

  const IconComponent = PLAYGROUND_ICONS[config.type] || BookOpen;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header informatif du Playground */}
      <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <Lock size={12} className="text-indigo-400" />
              <span>Environnement Dédié · {config.badge}</span>
            </span>

            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/10 text-white font-mono">
              Filière : {filiere} · {niveau}
            </span>
          </div>

          <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
            <IconComponent size={20} className="text-indigo-400" />
            <span>{config.title}</span>
          </h2>

          <p className="text-xs text-slate-400 max-w-3xl">
            {config.description}
          </p>
        </div>
      </div>

      {/* Rendu effectif */}
      <div className="animate-in fade-in duration-200">
        {renderPlayground()}
      </div>
    </div>
  );
}
