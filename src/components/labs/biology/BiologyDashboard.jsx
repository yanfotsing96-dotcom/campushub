import { useState, useMemo } from 'react';
import {
  Layers,
  Activity,
  Sparkles,
  Dna,
  ShieldAlert,
  Compass,
  ArrowRight,
  BookOpen,
  FlaskConical,
  GraduationCap,
  Trophy,
} from 'lucide-react';
import { BIOLOGY_MODULES } from './biologyData';

export default function BiologyDashboard({ onSelectModule, onNavigateToExam }) {
  const [filterSection, setFilterSection] = useState('all'); // 'all' | 'fondamentaux' | 'avance'

  const iconMap = {
    Layers,
    Activity,
    Sparkles,
    Dna,
    ShieldAlert,
    Compass,
  };

  const filteredModules = useMemo(() => {
    if (filterSection === 'all') return BIOLOGY_MODULES;
    return BIOLOGY_MODULES.filter((m) => m.sectionId === filterSection);
  }, [filterSection]);

  return (
    <div className="space-y-8 text-left">
      {/* SaaS Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 shadow-2xl p-6 sm:p-8 backdrop-blur-xl">
        {/* Lueur d'ambiance violette / indigo */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-violet-600/10 via-indigo-600/10 to-transparent blur-3xl pointer-events-none rounded-full" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-emerald-500/10 blur-2xl pointer-events-none rounded-full" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-mono font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Sparkles size={12} className="text-indigo-400" />
              <span>CampusHub · BiologyLab Hub</span>
            </span>

            <span className="text-slate-400">·</span>
            <span className="text-slate-400 font-mono">Faculté des Sciences & Pôle Sciences de la Vie</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
            Laboratoires Virtuels de Biologie :{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
              de la Dynamique Cellulaire aux Écosystèmes Systémiques
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300/90 leading-relaxed">
            Plateforme interactive certifiée pour les étudiants de la Licence (L1-L3) au Master (M1-M2). Simulez les paramètres biochimiques, explorez les formules maîtresses en direct et exportez vos comptes-rendus de TP formattés sans artefact de code.
          </p>

          {/* Métriques d'ingénierie pédagogique */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-800/80">
            <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-slate-400 text-[11px] block">Laboratoires Actifs</span>
              <span className="text-xl font-bold font-mono text-white">6 Modules</span>
              <span className="text-[10px] text-slate-500 block">L1 à Master 2</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-slate-400 text-[11px] block">Moteur Numérique</span>
              <span className="text-xl font-bold font-mono text-emerald-400">Cinétique SI</span>
              <span className="text-[10px] text-slate-500 block">Euler & Michaelis</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-slate-400 text-[11px] block">Graphismes Virtuels</span>
              <span className="text-xl font-bold font-mono text-violet-400">SVG Dynamique</span>
              <span className="text-[10px] text-slate-500 block">Mitose, ELISA, Phase</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-slate-400 text-[11px] block">Rapport de TP</span>
              <span className="text-xl font-bold font-mono text-emerald-400">PDF Natif A4</span>
              <span className="text-[10px] text-slate-500 block">scale: 2 Haute Résolution</span>
            </div>
          </div>
        </div>
      </div>

      {/* BANNIÈRE PROBLÈMES D'EXAMENS & AUTO-ÉVALUATION */}
      <div className="relative overflow-hidden p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-indigo-950/60 border border-emerald-500/30 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-950/40">
            <Trophy size={24} />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                NOUVEAU · ENTRAÎNEMENT ACADÉMIQUE
              </span>
              <span className="text-xs text-slate-400 font-mono">L1 ➔ Master 2</span>
            </div>
            <h3 className="text-base font-bold text-white">
              Mode Quiz & Problèmes Types d'Examen Universitaires
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
              Entraînez-vous sur des cas réels (index mitotique, cinétique de Lineweaver-Burk, doublement bactérien, température de fusion PCR, équilibre Lotka-Volterra) avec validation immédiate et corrigé pas à pas.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onSelectModule('exam_trainer')}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-lg shadow-emerald-950/40 whitespace-nowrap self-start md:self-auto group"
        >
          <GraduationCap size={16} />
          <span>Accéder au Mode Examen</span>
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Barre de filtrage par niveau académique */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <BookOpen size={18} className="text-emerald-400" />
            <span>Modules Pratiques de Manipulation Virtuelle</span>
          </h2>
          <p className="text-xs text-slate-400">
            Sélectionnez un banc d'essai pour calibrer vos paramètres et lancer l'expérience.
          </p>
        </div>

        <div className="inline-flex p-1 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-bold self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setFilterSection('all')}
            className={`px-3.5 py-1.5 rounded-xl transition-all ${
              filterSection === 'all'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Tous ({BIOLOGY_MODULES.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterSection('fondamentaux')}
            className={`px-3.5 py-1.5 rounded-xl transition-all ${
              filterSection === 'fondamentaux'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Fondamentaux (L1-L2)
          </button>
          <button
            type="button"
            onClick={() => setFilterSection('avance')}
            className={`px-3.5 py-1.5 rounded-xl transition-all ${
              filterSection === 'avance'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Avancé (L3-Master)
          </button>
        </div>
      </div>

      {/* Grille des Cartes Interactives des 6 Laboratoires */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModules.map((module) => {
          const Icon = iconMap[module.iconName] || FlaskConical;
          const isAdvanced = module.sectionId === 'avance';

          return (
            <div
              key={module.id}
              onClick={() => onSelectModule(module.id)}
              className="group relative rounded-3xl bg-slate-900/80 border border-slate-800/90 hover:border-emerald-500/50 p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-950/40 backdrop-blur-md cursor-pointer text-left"
            >
              {/* Lueur subtile au survol */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-colors pointer-events-none" />

              <div className="space-y-4">
                {/* En-tête de la carte */}
                <div className="flex items-center justify-between">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 ${
                      isAdvanced
                        ? 'bg-violet-600/20 text-violet-400 border border-violet-500/30'
                        : 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
                    }`}
                  >
                    <Icon size={22} />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-400">
                      {module.code}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                        isAdvanced
                          ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {module.levelLabel}
                    </span>
                  </div>
                </div>

                {/* Titre et description */}
                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {module.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                    {module.description}
                  </p>
                </div>

                {/* Formule Maîtresse Clé */}
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-500 font-mono block">
                    Formule Fondamentale :
                  </span>
                  <div className="text-xs font-mono font-bold text-emerald-400 truncate">
                    {module.formula}
                  </div>
                  <span className="text-[10px] text-slate-400 truncate block">
                    {module.keyLaw}
                  </span>
                </div>

                {/* Tags du module */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {module.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="text-[10px] px-2 py-0.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Boutons d'accès : Laboratoire & Entraînement Examen */}
              <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold gap-2">
                <span className="text-emerald-400 group-hover:text-emerald-300 flex items-center gap-1.5 transition-colors">
                  <span>Lancer Banc d'Essai</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </span>

                {onNavigateToExam && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigateToExam(module.id);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-[11px] font-mono text-emerald-400 hover:text-emerald-300 border border-slate-800 flex items-center gap-1 transition-colors cursor-pointer"
                    title={`Tester les problèmes d'examen pour ${module.title}`}
                  >
                    <GraduationCap size={12} />
                    <span>Quiz Examen</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
