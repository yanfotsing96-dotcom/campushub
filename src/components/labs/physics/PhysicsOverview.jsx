import { useState, useMemo } from 'react';
import {
  Compass,
  Activity,
  Atom,
  Zap,
  Flame,
  Layers,
  ArrowRight,
  Sparkles,
  BookOpen,
  FileCheck2,
  GraduationCap,
  Trophy,
  FileText,
} from 'lucide-react';
import { PHYSICS_MODULES } from './physicsData';

export default function PhysicsOverview({ onSelectModule }) {
  const [filterSection, setFilterSection] = useState('all'); // 'all' | 'fondamentaux' | 'avance'

  const iconMap = {
    Compass: Compass,
    Activity: Activity,
    Atom: Atom,
    Zap: Zap,
    Flame: Flame,
    Layers: Layers,
  };

  const filteredModules = useMemo(() => {
    if (filterSection === 'all') return PHYSICS_MODULES;
    return PHYSICS_MODULES.filter((m) => m.sectionId === filterSection);
  }, [filterSection]);

  return (
    <div className="space-y-8 text-left">
      {/* SaaS Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 shadow-2xl p-6 sm:p-8 backdrop-blur-xl">
        {/* Lueur d'arrière-plan violet / indigo */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-violet-600/15 via-indigo-600/15 to-transparent blur-3xl pointer-events-none rounded-full" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-indigo-500/10 blur-2xl pointer-events-none rounded-full" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-mono font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Sparkles size={12} className="text-indigo-400" />
              <span>CampusHub · PhysicsLab Hub v3.0</span>
            </span>

            <span className="text-slate-400">·</span>
            <span className="text-slate-400 font-mono">Faculté des Sciences & Écoles d'Ingénieurs</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
            Laboratoires Virtuels de Physique :{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-300 bg-clip-text text-transparent">
              de la Mécanique Newtonienne à la Théorie Quantique
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300/90 leading-relaxed">
            Plateforme interactive certifiée MINESUP pour les étudiants de L1 à Master 2. Expérimentez en direct sur les paramètres fondamentaux, visualisez les équations maîtresses en temps réel, entraînez-vous aux examens et téléchargez vos comptes-rendus de TP au format PDF A4 officiel.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-800/80">
            <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-slate-400 text-[11px] block">Laboratoires Actifs</span>
              <span className="text-xl font-bold font-mono text-white">6 Modules</span>
              <span className="text-[10px] text-slate-500 block">L1 à Master 2</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-slate-400 text-[11px] block">Moteur de Calcul</span>
              <span className="text-xl font-bold font-mono text-indigo-400">Float-64 SI</span>
              <span className="text-[10px] text-slate-500 block">Précision analytique</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-slate-400 text-[11px] block">Graphismes Virtuels</span>
              <span className="text-xl font-bold font-mono text-violet-400">SVG Temps Réel</span>
              <span className="text-[10px] text-slate-500 block">Oscillo, P-V, Maxwell</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-slate-400 text-[11px] block">Rapport Académique</span>
              <span className="text-xl font-bold font-mono text-emerald-400">PDF A4 Natif</span>
              <span className="text-[10px] text-slate-500 block">jsPDF + html2canvas</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bannière d'accès direct au Mode Examen & Auto-Évaluation */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-violet-950/50 via-slate-900 to-indigo-950/40 border border-violet-500/30 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-violet-600/30">
            <GraduationCap size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-violet-500/20 text-violet-300 border border-violet-500/30">
                NOUVEAU · Mode Examen
              </span>
              <span className="text-xs text-slate-400">Banque d'Annales & QCM Universitaires</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white mt-0.5">
              Centre d'Auto-Évaluation & Problèmes Types d'Examen (L1 à M2)
            </h3>
            <p className="text-xs text-slate-300/80 mt-1 max-w-2xl">
              Mesurez votre maîtrise des lois fondamentales avec correction instantanée, score global, calculs pas à pas et explications théoriques détaillées.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onSelectModule('exam_trainer')}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-violet-600/25 transition-all flex items-center justify-center gap-2 shrink-0 self-start md:self-auto"
        >
          <Trophy size={15} />
          <span>Lancer l'Auto-Évaluation (10 QCM)</span>
          <ArrowRight size={14} />
        </button>
      </div>

      {/* Barre de filtrage par cycle d'études */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <BookOpen size={18} className="text-indigo-400" />
            <span>Modules de Manipulation Virtuelle</span>
          </h2>
          <p className="text-xs text-slate-400">
            Sélectionnez un banc d'essai pour calibrer vos grandeurs physiques et explorer les comportements.
          </p>
        </div>

        {/* Boutons de filtrage */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-900 border border-slate-800 self-start sm:self-auto text-xs">
          <button
            type="button"
            onClick={() => setFilterSection('all')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
              filterSection === 'all'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Tous les Niveaux (6)
          </button>
          <button
            type="button"
            onClick={() => setFilterSection('fondamentaux')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
              filterSection === 'fondamentaux'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            L1 - L2 Fondamentaux (3)
          </button>
          <button
            type="button"
            onClick={() => setFilterSection('avance')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
              filterSection === 'avance'
                ? 'bg-violet-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            L3 - Master Avancé (3)
          </button>
        </div>
      </div>

      {/* Grille des 6 Bancs d'Essais Virtuels */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModules.map((module) => {
          const IconComponent = iconMap[module.iconName] || Activity;

          return (
            <div
              key={module.id}
              className={`p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all duration-300 shadow-xl backdrop-blur-xl flex flex-col justify-between group relative overflow-hidden`}
            >
              <div className="space-y-4 relative z-10">
                {/* En-tête de la carte */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <IconComponent size={20} />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                        {module.code}
                      </span>
                      <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                        {module.title}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Badge niveau */}
                <div className="inline-block">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-slate-800 text-slate-300 border border-slate-700">
                    {module.levelLabel}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                  {module.description}
                </p>

                {/* Formule fondamentale maîtresse */}
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 font-mono space-y-1">
                  <div className="text-[10px] text-indigo-400 font-bold uppercase">Loi Maîtresse :</div>
                  <div className="text-xs font-bold text-white tracking-wide truncate">
                    {module.formula}
                  </div>
                  <div className="text-[10px] text-slate-500 truncate">{module.keyLaw}</div>
                </div>

                {/* Tags du module */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {module.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-lg text-[10px] bg-slate-800/60 text-slate-300 border border-slate-700/50"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bouton d'action direct de lancement */}
              <div className="pt-3 border-t border-slate-800/80 relative z-10">
                <button
                  type="button"
                  onClick={() => onSelectModule(module.id)}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-950 hover:bg-gradient-to-r hover:from-indigo-600 hover:to-violet-600 text-slate-200 hover:text-white text-xs font-bold border border-slate-800 hover:border-transparent transition-all flex items-center justify-center gap-2 group/btn shadow-md"
                >
                  <span>Lancer la Simulation</span>
                  <ArrowRight
                    size={14}
                    className="transform group-hover/btn:translate-x-1 transition-transform"
                  />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Guide Rapide des Protocoles de TP */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-white font-bold text-sm">
          <FileCheck2 size={18} className="text-violet-400" />
          <span>Charte des Travaux Pratiques Virtuels de Physique</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-400">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1.5">
            <div className="text-white font-semibold flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-indigo-600/20 text-indigo-400 flex items-center justify-center text-[11px] font-bold">1</span>
              <span>Paramétrage Libre & Sliders</span>
            </div>
            <p>
              Modifiez à volonté les grandeurs physiques fondamentales (masse, vitesse, RLC, indices n, températures, barrière) pour observer instantanément l'impact sur les lois théoriques.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1.5">
            <div className="text-white font-semibold flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-violet-600/20 text-violet-400 flex items-center justify-center text-[11px] font-bold">2</span>
              <span>Visualisation Dynamique SVG</span>
            </div>
            <p>
              Les graphismes s'ajustent en temps réel : trajectoires balistiques, résonance de Bode, réfraction de Snell-Descartes, ondes OPPM Maxwell, cycles de Carnot/Otto et puits quantique.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1.5">
            <div className="text-white font-semibold flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-emerald-600/20 text-emerald-400 flex items-center justify-center text-[11px] font-bold">3</span>
              <span>Export PDF A4 & Mode Examen</span>
            </div>
            <p>
              Générez à tout moment votre compte-rendu de TP complet au format PDF A4 net (scale 2, KaTeX) et testez vos connaissances sur la banque d'examens universitaires.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
