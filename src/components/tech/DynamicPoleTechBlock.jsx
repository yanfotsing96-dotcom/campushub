import { useState, useMemo } from 'react';
import {
  ExternalLink,
  Copy,
  Check,
  Sparkles,
  ArrowRight,
  Info,
  X,
  GraduationCap,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { getDepartmentPole } from './data/departmentPoleConfig';

/**
 * Composant Dynamique du Bloc "Pôle & Tech" (Cœur Tech & Métiers)
 * S'adapte en temps réel selon la filière de l'utilisateur connecté (`user.filiere`)
 */
export default function DynamicPoleTechBlock({
  onSelectTool,
  showSimulator = true,
  className = '',
}) {
  const { user } = useAuth();

  // Filière active de l'utilisateur
  const userFiliere = user?.filiere || user?.filiereId || user?.department || 'Informatique';

  // Possibilité de simulation directe dans l'UI pour vérifier chaque filière
  const [simulatedFiliere, setSimulatedFiliere] = useState(null);
  const activeFiliere = simulatedFiliere || userFiliere;

  // Calcul du pôle correspondant via le dictionnaire de configuration
  const pole = useMemo(() => {
    return getDepartmentPole(activeFiliere);
  }, [activeFiliere]);

  const PoleIcon = pole.icon;

  // État du modal / tiroir de consultation d'outil
  const [selectedTool, setSelectedTool] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleCopySnippet = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`space-y-5 ${className}`}>
      {/* 1. Header Banner Dynamique Adaptatif */}
      <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-r ${pole.heroGradient} text-white p-6 md:p-8 shadow-xl border ${pole.borderGlow} transition-all duration-300`}>
        <div className="relative z-10 space-y-4">
          {/* Badge & Statut de Filière */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${pole.tagBg}`}>
                <PoleIcon size={14} className="flex-shrink-0" />
                <span>Pôle National d'Excellence · {pole.badge}</span>
              </span>

              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/10 text-slate-200 border border-white/10 flex items-center gap-1">
                <GraduationCap size={12} className="text-slate-300" />
                <span>Filière active : {activeFiliere}</span>
              </span>
            </div>

            {/* Quick Metrics */}
            <div className="hidden sm:flex items-center gap-2 text-xs">
              {pole.quickStats?.map((stat, i) => (
                <div key={i} className="px-3 py-1 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-slate-200">
                  <span className="text-white font-bold">{stat.value}</span>
                  <span className="text-slate-300 ml-1.5">({stat.label})</span>
                </div>
              ))}
            </div>
          </div>

          {/* Titre & Description spécifique du Pôle */}
          <div className="max-w-3xl space-y-2">
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-tight">
              {pole.title}
            </h2>
            <p className="text-sm md:text-base text-slate-200 leading-relaxed font-medium">
              {pole.description}
            </p>
            <p className="text-xs text-slate-300/80 leading-relaxed">
              {pole.detailedSummary}
            </p>
          </div>

          {/* Simulateur interactif de bascule de filière */}
          {showSimulator && (
            <div className="pt-2 border-t border-white/10 flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-[11px] text-slate-300 font-semibold mr-1 flex items-center gap-1">
                <Sparkles size={12} className="text-amber-400" />
                <span>Tester une filière :</span>
              </span>

              {[
                { label: 'Chimie', val: 'Chimie' },
                { label: 'Physique', val: 'Physique' },
                { label: 'Biologie', val: 'Biologie' },
                { label: 'Mathématiques', val: 'Mathématiques' },
                { label: 'Informatique', val: 'Informatique' },
                { label: 'Général (Fallback)', val: 'Sciences Générales' },
              ].map((f) => {
                const isSelected = activeFiliere.toLowerCase().includes(f.val.toLowerCase().slice(0, 4));
                return (
                  <button
                    key={f.val}
                    type="button"
                    onClick={() => setSimulatedFiliere(f.val)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                      isSelected
                        ? 'bg-white text-slate-900 shadow-md font-black'
                        : 'bg-white/10 hover:bg-white/20 text-white/90 border border-white/10'
                    }`}
                  >
                    {f.label}
                  </button>
                );
              })}

              {simulatedFiliere && (
                <button
                  type="button"
                  onClick={() => setSimulatedFiliere(null)}
                  className="px-2 py-1 rounded-lg text-[10px] text-rose-300 hover:text-white bg-rose-500/20 hover:bg-rose-500/40 font-bold ml-1 transition-colors"
                  title="Revenir à ma filière de session"
                >
                  Réinitialiser
                </button>
              )}
            </div>
          )}
        </div>

        {/* Halo décoratif d'ambiance */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-white/5 blur-3xl pointer-events-none" />
      </div>

      {/* 2. Grille des 4 Outils / Ressources Spécifiques à la Filière */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {pole.tools.map((tool) => {
          const ToolIcon = tool.icon || PoleIcon;
          return (
            <div
              key={tool.id}
              className="group p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-indigo-400 dark:hover:border-indigo-600 transition-all duration-200 flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Icon & Tag */}
                <div className="flex items-center justify-between">
                  <div className={`w-10 h-10 rounded-xl ${pole.badgeClass} flex items-center justify-center font-bold shadow-2xs group-hover:scale-105 transition-transform`}>
                    <ToolIcon size={20} />
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700/60">
                    {tool.tag}
                  </span>
                </div>

                {/* Title & Subtitle */}
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                    {tool.subtitle}
                  </p>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                  {tool.description}
                </p>
              </div>

              {/* Action Button */}
              <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800/80">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedTool(tool);
                    if (onSelectTool) onSelectTool(tool);
                  }}
                  className="w-full py-1.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 text-xs font-bold transition-colors flex items-center justify-between"
                >
                  <span>{tool.actionLabel}</span>
                  <ArrowRight size={13} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Modal / Tiroir d'Inspection Rapide de la Ressource ou de l'Outil */}
      {selectedTool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl ${pole.badgeClass} flex items-center justify-center`}>
                  <PoleIcon size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    {selectedTool.title}
                  </h3>
                  <span className="text-xs text-slate-500">
                    {selectedTool.subtitle} · Pôle {pole.badge}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedTool(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {selectedTool.description}
            </p>

            {/* Extrait ou formulaire associé */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                <span className="flex items-center gap-1">
                  <Info size={12} className="text-indigo-600" />
                  <span>Extrait de référence académique :</span>
                </span>
                <button
                  type="button"
                  onClick={() => handleCopySnippet(selectedTool.sampleContent)}
                  className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-semibold"
                >
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                  <span>{copied ? 'Copié !' : 'Copier'}</span>
                </button>
              </div>

              <pre className="p-3.5 rounded-xl bg-slate-900 text-slate-100 text-xs font-mono overflow-x-auto whitespace-pre-wrap border border-slate-800 leading-relaxed">
                {selectedTool.sampleContent}
              </pre>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedTool(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Fermer
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedTool(null);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold ${pole.primaryButton} shadow-xs transition-colors flex items-center gap-1.5`}
              >
                <span>Accéder au module complet</span>
                <ExternalLink size={13} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
