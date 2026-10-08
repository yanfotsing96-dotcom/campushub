import {
  FlaskConical,
  Scale,
  Droplets,
  Flame,
  Activity,
  Zap,
  ArrowRight,
  Sparkles,
  BookOpen,
  Atom,
  GraduationCap,
  FileText,
  SlidersHorizontal,
} from 'lucide-react';

export default function ChemistryDashboard({ onSelectModule }) {
  const modulesList = [
    {
      id: 'molarity',
      level: 'L1 · L2 Fondamentaux',
      levelBadgeClass: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
      title: 'Solutions, Molarité & Dilutions',
      description:
        'Calculateur précis de masse pour préparation en fiole jaugée (m = C·V·M), loi de dilution mère-fille (C₁V₁ = C₂V₂), et décomposition massique centésimale de formules brutes.',
      formula: 'm = C · V · M',
      icon: FlaskConical,
      glowColor: 'hover:border-indigo-500/60 hover:shadow-indigo-500/10',
      iconBg: 'bg-indigo-600/20 text-indigo-400 border-indigo-500/30',
      stats: '10 solutés étalons · Fiole dynamique',
    },
    {
      id: 'equations',
      level: 'L1 · L2 Fondamentaux',
      levelBadgeClass: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
      title: 'Équilibreur d\'Équations & Stœchiométrie',
      description:
        'Solveur stœchiométrique interactif. Génération en direct du tableau d\'avancement (t=0, t, t_final), détection automatique du réactif limitant et bilan molaire quantitatif.',
      formula: 'n_f = n_0 − ν · x_max',
      icon: Scale,
      glowColor: 'hover:border-violet-500/60 hover:shadow-violet-500/10',
      iconBg: 'bg-violet-600/20 text-violet-400 border-violet-500/30',
      stats: '6 réactions modèles · Avancement x',
    },
    {
      id: 'ph_simulator',
      level: 'L1 · L2 Fondamentaux',
      levelBadgeClass: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
      title: 'Simulateur de pH & Solutions Acide-Base',
      description:
        'Échelle chromatique continue pH 0 à 14 avec indicateur universel. Calculs rigoureux des acides/bases forts, acides faibles et solutions tampons (Henderson-Hasselbalch).',
      formula: 'pH = pKa + log([A⁻]/[HA])',
      icon: Droplets,
      glowColor: 'hover:border-cyan-500/60 hover:shadow-cyan-500/10',
      iconBg: 'bg-cyan-600/20 text-cyan-400 border-cyan-500/30',
      stats: 'Spectre 0-14 · Bécher virtuel réaliste',
    },
    {
      id: 'thermodynamics',
      level: 'L3 · Master Avancé',
      levelBadgeClass: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
      title: 'Thermodynamique Chimique & Gibbs',
      description:
        'Étude approfondie de l\'enthalpie standard ΔH°, de l\'entropie ΔS° et de l\'énergie libre de Gibbs ΔG°(T). Température d\'inversion, constante d\'équilibre K_eq et courbe dynamique.',
      formula: 'ΔG°(T) = ΔH° − T · ΔS°',
      icon: Flame,
      glowColor: 'hover:border-rose-500/60 hover:shadow-rose-500/10',
      iconBg: 'bg-rose-600/20 text-rose-400 border-rose-500/30',
      stats: 'Critère de spontanéité · Courbe T',
    },
    {
      id: 'kinetics',
      level: 'L3 · Master Avancé',
      levelBadgeClass: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
      title: 'Cinétique Chimique & Lois de Vitesse',
      description:
        'Intégration numérique des réactions d\'ordre 0, 1 et 2. Calcul du temps de demi-vie t½, effet de la température via la loi d\'Arrhenius et simulation de catalyseur abaisseur d\'Ea.',
      formula: 'v = k · [A]ⁿ | t½ = ln(2)/k',
      icon: Activity,
      glowColor: 'hover:border-emerald-500/60 hover:shadow-emerald-500/10',
      iconBg: 'bg-emerald-600/20 text-emerald-400 border-emerald-500/30',
      stats: 'Courbe [A](t) interactive · Demi-vie',
    },
    {
      id: 'electrochemistry',
      level: 'L3 · Master Avancé',
      levelBadgeClass: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
      title: 'Électrochimie & Piles Galvaniques',
      description:
        'Modélisation interactive d\'une pile Daniell complète (anode, cathode, pont salin, voltmètre SVG animé). Potentiels redox standard IUPAC, équation de Nernst et ΔG° = -nFE°.',
      formula: 'E = E° − (0.0592/n) · log₁₀(Q)',
      icon: Zap,
      glowColor: 'hover:border-amber-500/60 hover:shadow-amber-500/10',
      iconBg: 'bg-amber-600/20 text-amber-400 border-amber-500/30',
      stats: 'Schéma SVG animé · Table IUPAC',
    },
  ];

  return (
    <div className="space-y-8 text-left">
      {/* Hero Banner Style SaaS Moderne */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-950 border border-indigo-500/30 p-6 md:p-8 shadow-2xl backdrop-blur-xl">
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-violet-500/20 text-violet-300 border border-violet-500/30 font-mono">
              <Sparkles size={14} className="text-violet-400" />
              <span>CampusHub · Pôle Sciences Chimiques</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight">
              Playground de Chimie Virtuel & Numérique
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed font-medium">
              Plateforme modulaire de simulation physico-chimique taillée pour les étudiants de{' '}
              <strong className="text-white">Licence 1 à Master 2</strong>. Expérimentez des calculs en temps réel,
              équilibrez des réactions, analysez des cinétiques et modélisez des piles électrochimiques sans danger.
            </p>
          </div>

          {/* Métriques d'accès rapide */}
          <div className="grid grid-cols-2 gap-3 min-w-[260px]">
            <div className="bg-slate-950/70 backdrop-blur-md rounded-2xl p-3.5 border border-slate-800 text-left">
              <div className="text-2xl font-black text-indigo-400 font-mono">6</div>
              <div className="text-xs font-semibold text-white mt-0.5">Laboratoires Intégrés</div>
              <div className="text-[10px] text-slate-400">L1-L2 & L3-Master</div>
            </div>

            <div className="bg-slate-950/70 backdrop-blur-md rounded-2xl p-3.5 border border-slate-800 text-left">
              <div className="text-2xl font-black text-emerald-400 font-mono">100%</div>
              <div className="text-xs font-semibold text-white mt-0.5">Interactif & Temps Réel</div>
              <div className="text-[10px] text-slate-400">Standard IUPAC / NIST</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bannière Interactive : Mode Entraînement / Concours & Outils Pratiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Carte Entraînement Examen */}
        <div
          onClick={() => onSelectModule('exam_trainer')}
          className="group cursor-pointer rounded-2xl bg-gradient-to-br from-violet-950/40 via-slate-900 to-indigo-950/40 border border-violet-500/40 hover:border-violet-400 p-5 backdrop-blur-xl shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-violet-900/20 flex flex-col justify-between"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Mode Quiz & Examen
              </span>
              <div className="w-8 h-8 rounded-lg bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-300 group-hover:scale-110 transition-transform">
                <GraduationCap size={16} />
              </div>
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-violet-200 transition-colors">
              Problèmes Types d'Examen
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Auto-évaluation interactive avec calcul de concentrations inconnues, réactifs limitants, pH tampons et Nernst. Corrigés pas à pas détaillés.
            </p>
          </div>

          <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-violet-300 group-hover:text-violet-200">
            <span>Démarrer l'entraînement</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Carte Export Compte-Rendu TP */}
        <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 p-5 backdrop-blur-xl flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Génération Automatisée
              </span>
              <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300">
                <FileText size={16} />
              </div>
            </div>
            <h3 className="text-base font-bold text-white">
              Export Compte-Rendu TP
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Consultez et téléchargez un rapport de TP structuré et mis en page depuis chaque module (Molarité, Équilibreur, pH, Électrochimie).
            </p>
          </div>
          <div className="pt-3 mt-3 border-t border-slate-800/80 text-[11px] text-slate-400 font-mono">
            Rendu visuel clair & export PDF / Texte
          </div>
        </div>

        {/* Carte Valeurs Custom TD/TP */}
        <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 p-5 backdrop-blur-xl flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Flexibilité Pédagogique
              </span>
              <div className="w-8 h-8 rounded-lg bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-300">
                <SlidersHorizontal size={16} />
              </div>
            </div>
            <h3 className="text-base font-bold text-white">
              Données Personnalisées & TD
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Saisissez vos propres constantes (pKa sur-mesure, couples redox custom, stœchiométries personnalisées) pour résoudre vos énoncés de travaux dirigés.
            </p>
          </div>
          <div className="pt-3 mt-3 border-t border-slate-800/80 text-[11px] text-slate-400 font-mono">
            Toggles "Mode Custom" intégrés
          </div>
        </div>
      </div>

      {/* Grille des Modules de Chimie (Style Cartes SaaS Haut de Gamme) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Atom size={20} className="text-violet-400" />
            <span>Laboratoires & Calculateurs Disponibles</span>
          </h2>
          <span className="text-xs text-slate-400 font-mono">
            Sélectionnez un module pour démarrer l'expérience
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {modulesList.map((mod) => {
            const Icon = mod.icon;
            return (
              <div
                key={mod.id}
                onClick={() => onSelectModule(mod.id)}
                className={`group cursor-pointer rounded-2xl bg-slate-900/80 border border-slate-800/80 p-5 backdrop-blur-xl shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl flex flex-col justify-between ${mod.glowColor}`}
              >
                <div className="space-y-3">
                  {/* Header de carte avec badge de niveau */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border font-mono ${mod.levelBadgeClass}`}
                    >
                      {mod.level}
                    </span>
                    <div
                      className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-transform group-hover:scale-110 ${mod.iconBg}`}
                    >
                      <Icon size={20} />
                    </div>
                  </div>

                  {/* Titre & Description */}
                  <h3 className="text-base font-bold text-white group-hover:text-violet-300 transition-colors">
                    {mod.title}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                    {mod.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-800/80 space-y-3">
                  {/* Formule clef */}
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[11px] text-slate-500">Formule :</span>
                    <span className="px-2 py-0.5 rounded bg-slate-950 text-violet-300 font-semibold border border-slate-800">
                      {mod.formula}
                    </span>
                  </div>

                  {/* Bouton d'accès rapide */}
                  <div className="flex items-center justify-between pt-1 text-xs">
                    <span className="text-[11px] text-slate-400">{mod.stats}</span>
                    <span className="inline-flex items-center gap-1 font-bold text-violet-400 group-hover:text-violet-300 group-hover:translate-x-1 transition-all">
                      <span>Lancer</span>
                      <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tableau Récapitulatif des Constantes Fondamentales de Chimie */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <BookOpen size={18} className="text-violet-400" />
            <h3 className="text-sm font-bold text-white">
              Aide-Mémoire : Constantes Fondamentales de la Chimie Physique
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">Standard UICPA / NIST</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs font-mono">
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
            <div className="text-slate-400 text-[10px] font-sans">Gaz Parfaits (R)</div>
            <div className="text-sm font-bold text-cyan-300 mt-1">8.314 J/(mol·K)</div>
            <div className="text-[10px] text-slate-500 mt-0.5">PV = nRT</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
            <div className="text-slate-400 text-[10px] font-sans">Constante de Faraday (F)</div>
            <div className="text-sm font-bold text-violet-300 mt-1">96 485 C/mol</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Charge d'1 mole d'e⁻</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
            <div className="text-slate-400 text-[10px] font-sans">Produit Ionique Eau (Ke)</div>
            <div className="text-sm font-bold text-emerald-300 mt-1">1.0 × 10⁻¹⁴</div>
            <div className="text-[10px] text-slate-500 mt-0.5">à 298.15 K (25 °C)</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
            <div className="text-slate-400 text-[10px] font-sans">Nombre d'Avogadro (NA)</div>
            <div className="text-sm font-bold text-amber-300 mt-1">6.022 × 10²³</div>
            <div className="text-[10px] text-slate-500 mt-0.5">mol⁻¹</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
            <div className="text-slate-400 text-[10px] font-sans">Volume Molaire Gaz (Vm)</div>
            <div className="text-sm font-bold text-rose-300 mt-1">22.414 L/mol</div>
            <div className="text-[10px] text-slate-500 mt-0.5">à 0 °C, 1 atm (CNTP)</div>
          </div>
        </div>
      </div>
    </div>
  );
}
