import { useState, useMemo } from 'react';
import {
  GraduationCap,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ArrowRight,
  BookOpen,
  ChevronRight,
  Lightbulb,
  Sparkles,
  FlaskConical,
  Activity,
  Layers,
  Dna,
  ShieldAlert,
  Compass,
  GitBranch,
  Flame,
} from 'lucide-react';

/**
 * Banque de Problèmes Types d'Examens Nationaux et TD Universitaires en Biologie
 * De la Licence 1 au Master 2 (Sciences de la Vie, Biochimie, Microbiologie, Génétique, Écologie)
 */
const BIOLOGY_EXAM_PROBLEMS = [
  {
    id: 'prob-mitosis-1',
    level: 'L1-L2 · Licence',
    levelBadge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    category: 'Biologie Cellulaire & Mitose',
    moduleId: 'cell_mitosis',
    icon: Layers,
    title: "Calcul de l'Index Mitotique et Durée de la Métaphase",
    statement:
      "Dans un méristème apical racinaire d'Allium cepa, un étudiant dénombre N_total = 1250 cellules au microscope optique. Parmi elles, 175 cellules présentent des figures de mitose active, dont 63 cellules bloquées en plaque équatoriale (métaphase). La durée globale du cycle cellulaire est déterminée à Tc = 20.0 heures. Calculez l'Index Mitotique (IM en %) de ce tissu végétal.",
    unit: '%',
    targetAnswer: 14.0,
    tolerance: 0.2,
    hint: 'Formule fondamentale : IM = (N_mitose / N_total) × 100.',
    stepByStep: [
      {
        step: '1. Identification des grandeurs expérimentales',
        detail: 'Cellules totales examinées : N_total = 1250. Cellules en division mitotique (M) : N_mitose = 175.',
      },
      {
        step: "2. Calcul de l'Index Mitotique (IM)",
        detail: 'IM = (175 / 1250) × 100 = 0.14 × 100 = 14.0 %.',
      },
      {
        step: '3. Durée estimée de la phase métaphasique',
        detail: 'T_méta = (63 / 1250) × 20.0 h = 1.008 h ≈ 60.5 minutes (soit environ 36% du temps mitotique total).',
      },
      {
        step: 'Conclusion & Interprétation Cytologique',
        detail: "Un index mitotique de 14% atteste d'une zone méristématique en intense division active.",
      },
    ],
  },
  {
    id: 'prob-enzymo-1',
    level: 'L1-L2 · Licence',
    levelBadge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    category: 'Cinétique Enzymatique',
    moduleId: 'enzymology',
    icon: Activity,
    title: 'Extraction Graphique de Vmax et Km par Lineweaver-Burk',
    statement:
      "L'analyse cinétique d'une invertase donne une droite de régression de Lineweaver-Burk (1/v₀ en fonction de 1/[S]) d'équation : 1/v₀ = 0.050 · (1/[S]) + 0.010, avec v₀ exprimée en µmol/(min·mg) et [S] en mM. Déterminez la vitesse maximale Vmax (en µmol/(min·mg)) de cette réaction bio-catalytique.",
    unit: 'µmol/(min·mg)',
    targetAnswer: 100.0,
    tolerance: 1.0,
    hint: "En double inverse : 1/v₀ = (Km/Vmax)·(1/[S]) + 1/Vmax. L'ordonnée à l'origine vaut 1/Vmax.",
    stepByStep: [
      {
        step: "1. Analyse de l'ordonnée à l'origine",
        detail: 'Ordonnée à l\'origine b = 1 / Vmax = 0.010 (min·mg/µmol).',
      },
      {
        step: '2. Déduction de la vitesse maximale Vmax',
        detail: 'Vmax = 1 / 0.010 = 100.0 µmol/(min·mg).',
      },
      {
        step: '3. Déduction de la constante de Michaelis Km',
        detail: 'Pente a = Km / Vmax = 0.050 ⟹ Km = 0.050 × 100.0 = 5.0 mM (affinité modérée pour le saccharose).',
      },
      {
        step: 'Conclusion',
        detail: "À saturation ([S] >> 5 mM), l'enzyme opère à son régime limite de 100 µmol/(min·mg).",
      },
    ],
  },
  {
    id: 'prob-enzymo-ki',
    level: 'L3-Master · Avancé',
    levelBadge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    category: 'Cinétique Enzymatique',
    moduleId: 'enzymology',
    icon: Activity,
    title: "Constante d'Inhibition Compétitive Ki",
    statement:
      "Une enzyme possède un Km natif de 2.0 mM. En présence d'un inhibiteur compétitif à la concentration [I] = 3.0 mM, la constante apparente mesurée passe à Km_app = 8.0 mM sans altération de la Vmax. Calculez la constante de dissociation de l'inhibiteur Ki (en mM).",
    unit: 'mM',
    targetAnswer: 1.0,
    tolerance: 0.05,
    hint: "Pour une inhibition compétitive : Km_app = Km · (1 + [I] / Ki) ⟹ [I] / Ki = (Km_app / Km) - 1.",
    stepByStep: [
      {
        step: '1. Facteur d\'augmentation du Km',
        detail: 'alpha = 1 + [I]/Ki = Km_app / Km = 8.0 / 2.0 = 4.0.',
      },
      {
        step: '2. Résolution pour Ki',
        detail: '[I]/Ki = 4.0 - 1 = 3.0 ⟹ Ki = [I] / 3.0 = 3.0 mM / 3.0 = 1.0 mM.',
      },
      {
        step: '3. Signification biologique',
        detail: "L'inhibiteur a une affinité deux fois supérieure pour le site actif libre que le substrat naturel (Ki = 1.0 mM vs Km = 2.0 mM).",
      },
    ],
  },
  {
    id: 'prob-growth-1',
    level: 'L1-L2 · Licence',
    levelBadge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    category: 'Croissance Bactérienne',
    moduleId: 'bacterial_growth',
    icon: Sparkles,
    title: "Temps de Génération et Taux de Croissance d'Escherichia coli",
    statement:
      'Un bouillon nutritif est ensemencé avec un inoculum initial N₀ = 2.0 × 10⁴ UFC/mL. Au bout de t = 3.0 heures de phase exponentielle non freinée, la population atteint N(t) = 1.6 × 10⁵ UFC/mL. Calculez le temps de génération G (temps de doublement, en minutes).',
    unit: 'min',
    targetAnswer: 60.0,
    tolerance: 1.0,
    hint: 'Nombre de divisions n = log₂(N / N₀). Puis G = (t en min) / n.',
    stepByStep: [
      {
        step: "1. Facteur d'amplification cellulaire",
        detail: 'N(t) / N₀ = (1.6 × 10⁵) / (2.0 × 10⁴) = 8.0 = 2³.',
      },
      {
        step: '2. Nombre de générations (n)',
        detail: 'n = log₂(8.0) = 3 divisions successives en 3.0 heures.',
      },
      {
        step: '3. Calcul du temps de génération (G)',
        detail: 'G = t / n = 3.0 heures / 3 = 1.0 heure = 60.0 minutes.',
      },
      {
        step: '4. Taux spécifique de croissance népérien (µ)',
        detail: 'µ = ln(2) / G = 0.693 / 1.0 h = 0.693 h⁻¹.',
      },
    ],
  },
  {
    id: 'prob-growth-dilution',
    level: 'L1-L2 · Licence',
    levelBadge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    category: 'Croissance Bactérienne',
    moduleId: 'bacterial_growth',
    icon: Sparkles,
    title: 'Dénombrement par Dilutions en Série et Titre Bactérien Initial',
    statement:
      'Après une cascade de dilutions sérielles au 1/10e jusqu\'au facteur 10⁻⁵, on étale un volume de 0.1 mL de suspension sur gélose nutritive. Après incubation 24h, on dénombre 145 colonies bactériennes viables (UFC). Déterminez la concentration bactérienne initiale N₀ dans la culture mère en millions d\'UFC/mL (10⁶ UFC/mL).',
    unit: '10⁶ UFC/mL',
    targetAnswer: 145.0,
    tolerance: 2.0,
    hint: 'N₀ = (Nombre de colonies) / (Volume étalé en mL × Facteur de dilution). 145 / (0.1 × 10⁻⁵) = 1.45 × 10⁸ UFC/mL = 145 millions.',
    stepByStep: [
      {
        step: '1. Facteur d\'étalement',
        detail: 'Volume étalé V = 0.1 mL. Dilution globale = 10⁻⁵. Volume corrigé = 0.1 × 10⁻⁵ = 10⁻⁶ mL.',
      },
      {
        step: '2. Calcul de la concentration mère N₀',
        detail: 'N₀ = 145 colonies / 10⁻⁶ mL = 145 × 10⁶ UFC/mL = 1.45 × 10⁸ UFC/mL.',
      },
      {
        step: '3. Conversion d\'unité',
        detail: 'Exprimé en millions d\'UFC/mL : 145.0 × 10⁶ UFC/mL.',
      },
    ],
  },
  {
    id: 'prob-genetics-tm',
    level: 'L3-Master · Avancé',
    levelBadge: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
    category: 'Génétique Moléculaire',
    moduleId: 'molecular_genetics',
    icon: Dna,
    title: "Température de Fusion (Tm) d'une Amorce Oligonucléotidique",
    statement:
      "Pour une PCR quantitative, on conçoit une amorce sens de 20 nucléotides : 5'-ATGCGATCGGCTAGCTACGA-3'. Elle contient 11 bases (G + C) et 9 bases (A + T). Selon la formule empirique de Wallace (Tm = 2(wA + xT) + 4(yG + zC)), quelle est la température théorique de fusion Tm (en °C) de cette amorce ?",
    unit: '°C',
    targetAnswer: 62.0,
    tolerance: 1.0,
    hint: 'Règle de Wallace : Tm = 2 × (nombre de A+T) + 4 × (nombre de G+C).',
    stepByStep: [
      {
        step: '1. Dénombrement des bases',
        detail: 'Total = 20 nt. Bases A + T = 9. Bases G + C = 11.',
      },
      {
        step: '2. Application numérique de la loi de Wallace',
        detail: 'Tm = 2 × (9) + 4 × (11) = 18 + 44 = 62.0 °C.',
      },
      {
        step: '3. Teneur en GC (%GC)',
        detail: '%GC = (11 / 20) × 100 = 55.0 % (idéal pour une hybridation spécifique sans dimère).',
      },
      {
        step: "4. Température d'hybridation PCR recommandée (Ta)",
        detail: "Ta ≈ Tm - 5°C = 57.0 °C lors des cycles d'amplification.",
      },
    ],
  },
  {
    id: 'prob-genetics-hw',
    level: 'L2-L3 · Génétique des Populations',
    levelBadge: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
    category: 'Génétique Moléculaire',
    moduleId: 'molecular_genetics',
    icon: Dna,
    title: 'Équilibre de Hardy-Weinberg et Fréquence des Porteurs Sains',
    statement:
      "Dans une population humaine panmictique à l'équilibre de Hardy-Weinberg, la prévalence d'une maladie autosomique récessive est de 1 naissance sur 2500 (q² = 0.0004). Quelle est la fréquence des hétérozygotes porteurs sains (2pq) exprimée en pourcentage (%) ?",
    unit: '%',
    targetAnswer: 3.92,
    tolerance: 0.1,
    hint: 'q = sqrt(1/2500) = 0.02. p = 1 - q = 0.98. Fréquence 2pq = 2 × 0.98 × 0.02 = 0.0392 = 3.92%.',
    stepByStep: [
      {
        step: '1. Fréquence de l\'allèle morbide récessif (q)',
        detail: 'q² = 1 / 2500 = 0.0004 ⟹ q = 0.02 (2% des allèles dans le pool génétique).',
      },
      {
        step: '2. Fréquence de l\'allèle sauvage dominant (p)',
        detail: 'p = 1 - q = 1 - 0.02 = 0.98 (98%).',
      },
      {
        step: '3. Fréquence des hétérozygotes porteurs sains (2pq)',
        detail: '2pq = 2 × 0.98 × 0.02 = 0.0392, soit 3.92% (environ 1 personne sur 25).',
      },
    ],
  },
  {
    id: 'prob-immuno-1',
    level: 'L3-Master · Avancé',
    levelBadge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    category: 'Immunologie & ELISA',
    moduleId: 'immunology',
    icon: ShieldAlert,
    title: 'Titrage Immunologique ELISA & Concentration en IgG Sériques',
    statement:
      "Dans un test immuno-enzymatique indirect (ELISA), la gamme étalon d'IgG fournit une relation linéaire d'absorbance à 450 nm : A₄₅₀ = 0.0020 · [IgG] + 0.050, où [IgG] est en µg/mL. Le sérum d'un patient prélevé après injection de rappel donne une absorbance A₄₅₀ = 1.450. Calculez la concentration en anticorps IgG (en µg/mL) dans cet échantillon.",
    unit: 'µg/mL',
    targetAnswer: 700.0,
    tolerance: 5.0,
    hint: '[IgG] = (A₄₅₀ - 0.050) / 0.0020.',
    stepByStep: [
      {
        step: "1. Isolation de la concentration d'IgG",
        detail: 'A₄₅₀ - A_blanc = pente × [IgG] ⟹ [IgG] = (1.450 - 0.050) / 0.0020',
      },
      {
        step: '2. Calcul numérique',
        detail: '[IgG] = 1.400 / 0.0020 = 700.0 µg/mL (titre protecteur élevé).',
      },
      {
        step: '3. Interprétation sérologique',
        detail: 'Une telle valeur reflète une mémoire immunitaire mature avec hypermutation somatique et commutation isotypique IgM ➔ IgG efficace.',
      },
    ],
  },
  {
    id: 'prob-ecology-1',
    level: 'L3-Master · Avancé',
    levelBadge: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
    category: 'Écologie & Modèle Proie-Prédateur',
    moduleId: 'ecology_lotka_volterra',
    icon: Compass,
    title: "Point d'Équilibre Stationnaire de Lotka-Volterra",
    statement:
      "Dans un écosystème boréal fermé, la dynamique couplée proies (lièvres x) et prédateurs (lynx y) obéit au système différentiel : dx/dt = 0.40·x - 0.002·x·y et dy/dt = 0.00005·x·y - 0.025·y. Déterminez le niveau d'équilibre stationnaire de la population de proies x* (en nombre d'individus).",
    unit: 'proies',
    targetAnswer: 500.0,
    tolerance: 1.0,
    hint: 'Pour dy/dt = 0 avec y ≠ 0 : δ·x* - γ = 0 ⟹ x* = γ / δ.',
    stepByStep: [
      {
        step: '1. Identification des paramètres Lotka-Volterra',
        detail: 'Taux de natalité proies α = 0.40, prédation β = 0.002, conversion trophique δ = 0.00005, mortalité prédateurs γ = 0.025.',
      },
      {
        step: "2. Condition d'annulation de la dérivée des prédateurs",
        detail: 'dy/dt = y · (δ·x - γ) = 0 ⟹ x* = γ / δ.',
      },
      {
        step: '3. Application numérique',
        detail: "x* = 0.025 / 0.00005 = 500 proies (point fixe stationnaire de l'orbite fermée).",
      },
      {
        step: '4. Équilibre correspondant pour les prédateurs',
        detail: 'y* = α / β = 0.40 / 0.002 = 200 lynx.',
      },
    ],
  },
  {
    id: 'prob-phylogeny-jukes',
    level: 'L3-Master · Bioinformatique & Évolution',
    levelBadge: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
    category: 'Écologie & Modèle Proie-Prédateur',
    moduleId: 'ecology_lotka_volterra',
    icon: GitBranch,
    title: "Distance Évolutive et Horloge Moléculaire (Jukes-Cantor)",
    statement:
      "L'alignement de deux gènes homologues de 500 paires de bases entre deux espèces de mammifères révèle 50 substitutions nucléotidiques (proportion de différences p = 0.10). Sachant que le taux de substitution neutre est de r = 1.0 × 10⁻⁸ substitutions par site et par an, et que la distance corrigée de Jukes-Cantor vaut d = -(3/4)·ln(1 - 4p/3) = 0.107, déterminez le temps de divergence estimé T en millions d'années (Ma) depuis l'ancêtre commun (T = d / (2r)).",
    unit: 'Ma',
    targetAnswer: 5.35,
    tolerance: 0.1,
    hint: 'T = d / (2 × r) = 0.107 / (2 × 1.0 × 10⁻⁸) = 5.35 × 10⁶ ans = 5.35 millions d\'années.',
    stepByStep: [
      {
        step: '1. Correction des substitutions multiples de Jukes-Cantor',
        detail: 'p = 50 / 500 = 0.10. d = -(3/4) × ln(1 - 4(0.10)/3) = -(0.75) × ln(0.8667) ≈ 0.107 substitutions par site.',
      },
      {
        step: '2. Application de l\'horloge moléculaire',
        detail: 'Deux lignées ont divergé depuis l\'ancêtre commun, d\'où le facteur 2 : d = 2 · r · T.',
      },
      {
        step: '3. Calcul du temps de divergence',
        detail: 'T = 0.107 / (2 × 10⁻⁸) = 5 350 000 ans = 5.35 Ma.',
      },
    ],
  },
];

export default function BiologyExamTrainerModule({ onSelectModule, initialCategory = 'all' }) {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || 'all');
  const [prevInitialCategory, setPrevInitialCategory] = useState(initialCategory);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [hasEvaluated, setHasEvaluated] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showStepByStep, setShowStepByStep] = useState(false);

  // Scores et progression
  const [score, setScore] = useState(0);
  const [totalAttempted, setTotalAttempted] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  // Synchronisation lors d'un changement de catégorie parente sans effet secondaire
  if (initialCategory !== prevInitialCategory) {
    setPrevInitialCategory(initialCategory);
    setSelectedCategory(initialCategory || 'all');
    setCurrentProblemIndex(0);
    setUserAnswer('');
    setHasEvaluated(false);
    setShowStepByStep(false);
  }

  // Filtrage des problèmes selon la catégorie
  const filteredProblems = useMemo(() => {
    if (selectedCategory === 'all') return BIOLOGY_EXAM_PROBLEMS;
    return BIOLOGY_EXAM_PROBLEMS.filter(
      (p) => p.category === selectedCategory || p.moduleId === selectedCategory
    );
  }, [selectedCategory]);

  const activeProblem = filteredProblems[currentProblemIndex] || filteredProblems[0] || BIOLOGY_EXAM_PROBLEMS[0];

  const handleVerifyAnswer = () => {
    if (!userAnswer.trim()) return;

    const parsed = parseFloat(userAnswer.replace(',', '.'));
    if (isNaN(parsed)) return;

    const target = activeProblem.targetAnswer;
    const tol = activeProblem.tolerance || 0.05;
    const diff = Math.abs(parsed - target);
    const correct = diff <= tol;

    setIsCorrect(correct);
    setHasEvaluated(true);
    setShowStepByStep(true);
    setTotalAttempted((prev) => prev + 1);

    if (correct) {
      setScore((prev) => prev + 10);
      setStreak((prev) => {
        const next = prev + 1;
        if (next > bestStreak) setBestStreak(next);
        return next;
      });
    } else {
      setStreak(0);
    }
  };

  const handleNextProblem = () => {
    setUserAnswer('');
    setHasEvaluated(false);
    setIsCorrect(false);
    setShowHint(false);
    setShowStepByStep(false);
    setCurrentProblemIndex((prev) => (prev + 1) % filteredProblems.length);
  };

  const handleRandomProblem = () => {
    setUserAnswer('');
    setHasEvaluated(false);
    setIsCorrect(false);
    setShowHint(false);
    setShowStepByStep(false);
    const nextIdx = Math.floor(Math.random() * filteredProblems.length);
    setCurrentProblemIndex(nextIdx);
  };

  const handleResetScores = () => {
    setScore(0);
    setTotalAttempted(0);
    setStreak(0);
    setUserAnswer('');
    setHasEvaluated(false);
    setShowStepByStep(false);
  };

  const categories = [
    { id: 'all', label: 'Tous les Domaines' },
    { id: 'Biologie Cellulaire & Mitose', label: 'Biologie Cellulaire' },
    { id: 'Cinétique Enzymatique', label: 'Enzymologie' },
    { id: 'Croissance Bactérienne', label: 'Microbiologie' },
    { id: 'Génétique Moléculaire', label: 'Génétique' },
    { id: 'Immunologie & ELISA', label: 'Immunologie' },
    { id: 'Écologie & Modèle Proie-Prédateur', label: 'Écologie & Évolution' },
  ];

  const accuracyPct = totalAttempted > 0 ? Math.round(((score / 10) / totalAttempted) * 100) : 0;

  return (
    <div className="space-y-6 text-left">
      {/* En-tête SaaS du Mode Examen */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
              CAMPUSHUB · MODE EXAMEN & AUTO-ÉVALUATION
            </span>
            <span className="text-xs text-slate-400 font-mono">Licence 1 ➔ Master 2</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <GraduationCap className="text-emerald-400" size={26} />
            <span>Problèmes Types d'Examens & Entraînement Pédagogique</span>
          </h2>

          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Résolvez les cas pratiques universitaires, évaluez vos compétences de calcul analytique et consultez les corrigés étape par étape conformes aux attendus académiques.
          </p>
        </div>

        {/* Tableau de bord des Scores */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-center min-w-[76px]">
            <span className="text-[10px] text-slate-400 block font-mono">Score</span>
            <span className="text-lg font-black font-mono text-emerald-400">{score} pts</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-center min-w-[76px]">
            <span className="text-[10px] text-slate-400 block font-mono flex items-center justify-center gap-1">
              <Flame size={11} className="text-amber-400" />
              <span>Série</span>
            </span>
            <span className="text-lg font-black font-mono text-violet-400">{streak}</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-center min-w-[76px]">
            <span className="text-[10px] text-slate-400 block font-mono">Précision</span>
            <span className="text-lg font-black font-mono text-indigo-300">{accuracyPct}%</span>
          </div>

          <button
            type="button"
            onClick={handleResetScores}
            className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
            title="Réinitialiser les scores"
          >
            <RotateCcw size={15} />
          </button>
        </div>
      </div>

      {/* Barre de sélection des Domaines de Biologie */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => {
              setSelectedCategory(cat.id);
              setCurrentProblemIndex(0);
              setUserAnswer('');
              setHasEvaluated(false);
              setShowStepByStep(false);
            }}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-medium transition-all ${
              selectedCategory === cat.id
                ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-950/30'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* CARTE CENTRALE DU PROBLÈME ACTIF */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-md space-y-6">
        {/* En-tête du problème */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <BookOpen size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase border ${activeProblem.levelBadge}`}>
                  {activeProblem.level}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {activeProblem.category}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mt-0.5">{activeProblem.title}</h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-500">
              Question {currentProblemIndex + 1} / {filteredProblems.length}
            </span>

            {/* Raccourci vers le laboratoire interactif */}
            {onSelectModule && activeProblem.moduleId && (
              <button
                type="button"
                onClick={() => onSelectModule(activeProblem.moduleId)}
                className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-[11px] text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Ouvrir le banc d'essai correspondant pour tester"
              >
                <FlaskConical size={13} />
                <span>Tester au Laboratoire</span>
              </button>
            )}
          </div>
        </div>

        {/* Énoncé du problème universitaire */}
        <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
          <span className="text-[10px] uppercase font-bold text-slate-500 font-mono block">
            Énoncé Officiel de l'Examen :
          </span>
          <p className="text-sm text-slate-200 leading-relaxed font-sans">
            {activeProblem.statement}
          </p>
        </div>

        {/* Zone de Saisie de la Réponse */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800/90 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-300">
              Saisissez votre résultat numérique calculé :
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleVerifyAnswer()}
                placeholder="Ex: 14.0"
                disabled={hasEvaluated}
                className="w-48 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-sm focus:border-emerald-500/60 focus:outline-none"
              />
              <span className="text-sm font-mono font-bold text-emerald-400">
                {activeProblem.unit}
              </span>
            </div>
            <span className="text-[10px] text-slate-500">
              Tolérance acceptée : ±{activeProblem.tolerance} {activeProblem.unit}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Bouton Indice */}
            <button
              type="button"
              onClick={() => setShowHint(!showHint)}
              className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Lightbulb size={14} className="text-amber-400" />
              <span>{showHint ? 'Masquer Indice' : "Besoin d'un Indice ?"}</span>
            </button>

            {/* Bouton de Validation */}
            {!hasEvaluated ? (
              <button
                type="button"
                onClick={handleVerifyAnswer}
                disabled={!userAnswer.trim()}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-lg shadow-emerald-950/40 cursor-pointer"
              >
                <span>Vérifier la Réponse</span>
                <ChevronRight size={15} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNextProblem}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-lg shadow-emerald-950/40 cursor-pointer"
              >
                <span>Problème Suivant</span>
                <ArrowRight size={15} />
              </button>
            )}
          </div>
        </div>

        {/* Indice Théorique (si ouvert) */}
        {showHint && (
          <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2.5 animate-in fade-in">
            <Lightbulb size={16} className="text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold">Indice Pédagogique :</strong>
              <p className="mt-0.5 text-amber-200/90 leading-relaxed">{activeProblem.hint}</p>
            </div>
          </div>
        )}

        {/* Résultat de l'Évaluation et Correction Pédagogique */}
        {hasEvaluated && (
          <div className="space-y-4 animate-in fade-in">
            {/* Bannière de succès ou d'erreur */}
            <div
              className={`p-4 rounded-2xl border flex items-center justify-between ${
                isCorrect
                  ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                  : 'bg-rose-950/30 border-rose-500/40 text-rose-300'
              }`}
            >
              <div className="flex items-center gap-3">
                {isCorrect ? (
                  <CheckCircle2 size={24} className="text-emerald-400" />
                ) : (
                  <XCircle size={24} className="text-rose-400" />
                )}
                <div>
                  <h4 className="text-sm font-black">
                    {isCorrect ? 'Excellente réponse ! (+10 points)' : 'Réponse incorrecte'}
                  </h4>
                  <p className="text-xs opacity-90">
                    Valeur attendue : <strong>{activeProblem.targetAnswer} {activeProblem.unit}</strong>
                  </p>
                </div>
              </div>

              <span className="text-xs font-mono font-bold bg-slate-950/60 px-3 py-1 rounded-xl border border-slate-800">
                {isCorrect ? '✨ Validé' : 'À revoir'}
              </span>
            </div>

            {/* Corrigé Détaillé Étape par Étape */}
            {showStepByStep && (
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-2">
                    <Sparkles size={14} className="text-emerald-400" />
                    <span>Corrigé Universitaire Officiel & Démonstration :</span>
                  </h4>
                </div>

                <div className="space-y-2.5 text-xs">
                  {activeProblem.stepByStep.map((s, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800/80 space-y-1">
                      <span className="font-bold text-emerald-300 block">{s.step}</span>
                      <p className="text-slate-300 leading-relaxed font-sans">{s.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Boutons de navigation inférieure */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800 text-xs">
          <button
            type="button"
            onClick={handleRandomProblem}
            className="px-3.5 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            Tirer un Problème Aléatoire
          </button>

          <button
            type="button"
            onClick={handleNextProblem}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Passer à la Question Suivante</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
