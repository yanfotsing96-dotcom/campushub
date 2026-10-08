import { useState, useMemo } from 'react';
import {
  GraduationCap,
  Sparkles,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Trophy,
  Filter,
  ArrowRight,
  BookOpen,
  ChevronRight,
  Calculator,
  Lightbulb,
} from 'lucide-react';

/**
 * Banque de Problèmes Types d'Examens Nationaux et TD Universitaires (L1 à Master)
 */
const EXAM_PROBLEMS = [
  {
    id: 'prob-molarity-1',
    level: 'L1 · L2',
    levelBadge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    category: 'Solutions & Molarité',
    title: 'Préparation d\'une Solution Étalon de Sulfate de Cuivre',
    statement:
      'Un étudiant de L1 doit préparer un volume V = 250 mL d\'une solution aqueuse de sulfate de cuivre pentahydraté (CuSO₄·5H₂O, M = 249.68 g/mol) à une concentration C = 0.150 mol/L. Quelle masse m (en grammes) de solide pur doit-il peser avec précision sur la balance d\'analyse ?',
    unit: 'g',
    targetAnswer: 9.363,
    tolerance: 0.05,
    hint: 'Rappel : m = C × V × M avec V exprimé en Litres (L).',
    stepByStep: [
      {
        step: '1. Conversion des unités',
        detail: 'Volume V = 250 mL = 250 × 10⁻³ L = 0.250 L.',
      },
      {
        step: '2. Calcul de la quantité de matière requise',
        detail: 'n = C × V = 0.150 mol/L × 0.250 L = 0.0375 mol.',
      },
      {
        step: '3. Calcul de la masse correspondante',
        detail: 'm = n × M = 0.0375 mol × 249.68 g/mol = 9.363 g.',
      },
      {
        step: 'Conclusion & Pratique de Laboratoire',
        detail: 'L\'étudiant pèse 9.36 g dans une coupelle, dissout dans ~100 mL d\'eau distillée puis ajuste au trait de jauge d\'une fiole de 250 mL.',
      },
    ],
  },
  {
    id: 'prob-dilution-1',
    level: 'L1 · L2',
    levelBadge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    category: 'Solutions & Molarité',
    title: 'Dilution d\'une Solution Mère d\'Acide Chlorhydrique',
    statement:
      'On dispose d\'une solution mère de HCl à C₁ = 2.00 mol/L. On souhaite préparer V₂ = 500 mL d\'une solution fille à C₂ = 0.080 mol/L. Quel volume V₁ de solution mère (en mL) faut-il prélever à la pipette jaugée ?',
    unit: 'mL',
    targetAnswer: 20.0,
    tolerance: 0.2,
    hint: 'Conservation de la matière lors d\'une dilution : C₁ × V₁ = C₂ × V₂.',
    stepByStep: [
      {
        step: '1. Formulation de la loi de dilution',
        detail: 'C₁ · V₁ = C₂ · V₂  ⟹  V₁ = (C₂ · V₂) / C₁',
      },
      {
        step: '2. Application numérique directe',
        detail: 'V₁ = (0.080 mol/L × 500 mL) / 2.00 mol/L = 40.0 / 2.00 = 20.0 mL.',
      },
      {
        step: '3. Volume d\'eau distillée à ajouter',
        detail: 'V_eau ≈ V₂ - V₁ = 500 mL - 20 mL = 480 mL.',
      },
    ],
  },
  {
    id: 'prob-stoich-1',
    level: 'L1 · L2',
    levelBadge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    category: 'Stœchiométrie & Avancement',
    title: 'Combustion Complète du Propane & Dioxyde Produit',
    statement:
      'On réalise la combustion complète de n(C₃H₈) = 2.50 mol de propane dans un récipient clos contenant n(O₂) = 10.00 mol de dioxygène selon : C₃H₈(g) + 5 O₂(g) ➔ 3 CO₂(g) + 4 H₂O(g). Quelle quantité finale de CO₂ (en moles) est obtenue à l\'état final ?',
    unit: 'mol',
    targetAnswer: 6.0,
    tolerance: 0.1,
    hint: 'Identifiez d\'abord le réactif limitant en comparant n(C₃H₈)/1 et n(O₂)/5.',
    stepByStep: [
      {
        step: '1. Recherche de l\'avancement maximal x_max pour chaque réactif',
        detail: 'Pour C₃H₈ : x_max₁ = 2.50 / 1 = 2.50 mol. Pour O₂ : x_max₂ = 10.00 / 5 = 2.00 mol.',
      },
      {
        step: '2. Identification du réactif limitant',
        detail: 'Le dioxygène O₂ impose l\'avancement maximal car 2.00 mol < 2.50 mol. Donc O₂ est limitant et x_max = 2.00 mol.',
      },
      {
        step: '3. Bilan final pour le produit CO₂',
        detail: 'n_f(CO₂) = 3 × x_max = 3 × 2.00 mol = 6.00 mol.',
      },
    ],
  },
  {
    id: 'prob-ph-buffer',
    level: 'L1 · L2',
    levelBadge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    category: 'pH & Tampons',
    title: 'pH d\'une Solution Tampon Acétate / Acide Acétique',
    statement:
      'Une solution tampon est préparée en mélangeant 0.120 mol d\'acide acétique CH₃COOH (pKa = 4.76) et 0.180 mol d\'acétate de sodium CH₃COONa dans 1 L d\'eau. Calculez la valeur théorique du pH de cette solution tampon à 25 °C.',
    unit: 'pH',
    targetAnswer: 4.936,
    tolerance: 0.05,
    hint: 'Équation de Henderson-Hasselbalch : pH = pKa + log₁₀([A⁻] / [HA]).',
    stepByStep: [
      {
        step: '1. Équation de Henderson-Hasselbalch',
        detail: 'pH = pKa + log₁₀([CH₃COO⁻] / [CH₃COOH])',
      },
      {
        step: '2. Calcul du ratio Base/Acide',
        detail: 'Ratio = 0.180 / 0.120 = 1.50. log₁₀(1.50) ≈ +0.176.',
      },
      {
        step: '3. Calcul final du pH',
        detail: 'pH = 4.76 + 0.176 = 4.936 (soit environ 4.94).',
      },
      {
        step: 'Remarque pédagogique',
        detail: 'La solution est légèrement au-dessus du pKa car la base conjuguée est en excès molaire modéré.',
      },
    ],
  },
  {
    id: 'prob-thermo-gibbs',
    level: 'L3 · Master',
    levelBadge: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
    category: 'Thermodynamique Chimique',
    title: 'Température d\'Inversion de la Calcination du Calcaire',
    statement:
      'La décomposition thermique du calcaire CaCO₃(s) ⇌ CaO(s) + CO₂(g) présente une enthalpie standard ΔH° = +178.3 kJ/mol et une entropie standard ΔS° = +160.5 J/(mol·K). Calculez la température d\'inversion T_inv (en Kelvin) à partir de laquelle la réaction devient thermodynamiquement spontanée (ΔG° < 0 sous 1 bar).',
    unit: 'K',
    targetAnswer: 1110.9,
    tolerance: 2.0,
    hint: 'À l\'équilibre limite : ΔG° = 0  ⟹  T_inv = ΔH° / ΔS° (attention aux unités J vs kJ !).',
    stepByStep: [
      {
        step: '1. Condition de spontanéité de Gibbs',
        detail: 'ΔG°(T) = ΔH° - T · ΔS°. La réaction devient spontanée quand ΔG° < 0, soit T > ΔH° / ΔS° car ΔS° > 0.',
      },
      {
        step: '2. Homogénéisation des unités énergétiques',
        detail: 'ΔH° = 178.3 kJ/mol = 178 300 J/mol. ΔS° = 160.5 J/(mol·K).',
      },
      {
        step: '3. Calcul de T_inv',
        detail: 'T_inv = 178 300 / 160.5 = 1110.9 K (soit environ 837.8 °C).',
      },
    ],
  },
  {
    id: 'prob-kinetics-half',
    level: 'L3 · Master',
    levelBadge: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
    category: 'Cinétique Chimique',
    title: 'Constante de Vitesse à Partir du Temps de Demi-Vie',
    statement:
      'La décomposition d\'un principe actif pharmaceutique suit une cinétique d\'ordre 1. À 25 °C, son temps de demi-vie est mesuré à t½ = 28.5 minutes. Déterminez la constante de vitesse k (en min⁻¹) de cette réaction.',
    unit: 'min⁻¹',
    targetAnswer: 0.0243,
    tolerance: 0.001,
    hint: 'Pour une cinétique d\'ordre 1 : t½ = ln(2) / k  ⟹  k = ln(2) / t½.',
    stepByStep: [
      {
        step: '1. Loi de demi-vie pour l\'ordre 1',
        detail: 'Pour l\'ordre 1, [A]t = [A]₀ · e^(-kt). Quand [A] = [A]₀ / 2, e^(-k·t½) = 1/2 ⟹ k · t½ = ln(2).',
      },
      {
        step: '2. Résolution analytique',
        detail: 'k = ln(2) / t½ = 0.69315 / 28.5 min.',
      },
      {
        step: '3. Résultat numérique',
        detail: 'k = 0.02432 min⁻¹ (soit ~ 4.05 × 10⁻⁴ s⁻¹).',
      },
    ],
  },
  {
    id: 'prob-nernst-cell',
    level: 'L3 · Master',
    levelBadge: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
    category: 'Électrochimie & Nernst',
    title: 'Force Électromotrice d\'une Pile Daniell Hors Équilibre',
    statement:
      'On considère la pile Daniell : Zn(s) | Zn²⁺(0.010 mol/L) || Cu²⁺(1.000 mol/L) | Cu(s) à 25 °C (T = 298.15 K). Les potentiels standards sont E°(Cu²⁺/Cu) = +0.340 V et E°(Zn²⁺/Zn) = -0.760 V. Calculez la force électromotrice réelle E de la pile (en Volts) à l\'aide de l\'équation de Nernst.',
    unit: 'V',
    targetAnswer: 1.159,
    tolerance: 0.01,
    hint: 'E = E°cell - (0.0592 / 2) × log₁₀([Zn²⁺] / [Cu²⁺]), avec E°cell = 0.340 - (-0.760) = 1.100 V.',
    stepByStep: [
      {
        step: '1. Calcul de la f.é.m. standard E°cell',
        detail: 'E°cell = E°(cathode) - E°(anode) = +0.340 V - (-0.760 V) = +1.100 V. Le nombre d\'électrons échangés est n = 2.',
      },
      {
        step: '2. Quotient réactionnel Q',
        detail: 'Q = [Zn²⁺] / [Cu²⁺] = 0.010 / 1.000 = 10⁻².',
      },
      {
        step: '3. Application de l\'équation de Nernst à 298 K',
        detail: 'E = 1.100 - (0.0592 / 2) · log₁₀(10⁻²) = 1.100 - 0.0296 · (-2) = 1.100 + 0.0592 = 1.1592 V.',
      },
      {
        step: 'Remarque physique',
        detail: 'La f.é.m. est supérieure à la valeur standard (+1.10 V) car la faible concentration en zinc déplace l\'équilibre vers la droite (principe de Le Chatelier).',
      },
    ],
  },
];

export default function ChemistryExamTrainerModule() {
  const [selectedLevelFilter, setSelectedLevelFilter] = useState('ALL'); // 'ALL' | 'L1-L2' | 'L3-Master'
  const [activeProblemIndex, setActiveProblemIndex] = useState(0);
  const [userAnswerInput, setUserAnswerInput] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState(null); // { isCorrect: bool, diff: number } | null

  // Suivi de score de session
  const [scoreStats, setScoreStats] = useState({
    answeredCount: 0,
    correctCount: 0,
    history: {},
  });

  // Filtrage des problèmes
  const filteredProblems = useMemo(() => {
    if (selectedLevelFilter === 'L1-L2') {
      return EXAM_PROBLEMS.filter((p) => p.level.includes('L1'));
    }
    if (selectedLevelFilter === 'L3-Master') {
      return EXAM_PROBLEMS.filter((p) => p.level.includes('L3') || p.level.includes('Master'));
    }
    return EXAM_PROBLEMS;
  }, [selectedLevelFilter]);

  const currentProblem = filteredProblems[activeProblemIndex] || filteredProblems[0];

  // Gestion du changement de problème
  const handleSelectProblem = (index) => {
    setActiveProblemIndex(index);
    setUserAnswerInput('');
    setShowHint(false);
    setShowSolution(false);
    setEvaluationResult(null);
  };

  // Validation de la réponse de l'étudiant
  const handleValidateAnswer = (e) => {
    e?.preventDefault();
    if (!userAnswerInput.trim()) return;

    const parsedUserAnswer = parseFloat(userAnswerInput.replace(',', '.'));
    if (isNaN(parsedUserAnswer)) return;

    const target = currentProblem.targetAnswer;
    const tol = currentProblem.tolerance;
    const diff = Math.abs(parsedUserAnswer - target);
    const isCorrect = diff <= tol;

    setEvaluationResult({
      isCorrect,
      diff: Number(diff.toFixed(4)),
      submitted: parsedUserAnswer,
    });
    setShowSolution(true);

    // Mise à jour des stats de l'étudiant si pas déjà répondu à cette question
    if (!scoreStats.history[currentProblem.id]) {
      setScoreStats((prev) => ({
        answeredCount: prev.answeredCount + 1,
        correctCount: prev.correctCount + (isCorrect ? 1 : 0),
        history: {
          ...prev.history,
          [currentProblem.id]: isCorrect ? 'correct' : 'incorrect',
        },
      }));
    }
  };

  const successRate =
    scoreStats.answeredCount > 0
      ? Math.round((scoreStats.correctCount / scoreStats.answeredCount) * 100)
      : 0;

  return (
    <div className="space-y-6 text-left">
      {/* Header Principal */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-500 border border-violet-500/30 flex items-center justify-center text-white shadow-lg shadow-violet-900/30">
            <GraduationCap size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-violet-500/20 text-violet-300 border border-violet-500/30 font-mono">
                MODE ENTRAÎNEMENT & CONCOURS
              </span>
              <span className="text-xs text-slate-400">UE Chimie L1 à Master 2</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Problèmes Types d'Examen & Auto-Évaluation
            </h2>
          </div>
        </div>

        {/* Compteur de Score & Progression */}
        <div className="flex items-center gap-3 p-2 rounded-2xl bg-slate-950/80 border border-slate-800 font-mono text-xs">
          <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-900 border border-slate-800">
            <Trophy size={15} className="text-amber-400" />
            <span className="text-slate-400">Réussite :</span>
            <strong className="text-white">{scoreStats.correctCount} / {scoreStats.answeredCount}</strong>
            <span className="text-emerald-400 font-bold">({successRate}%)</span>
          </div>

          <button
            type="button"
            onClick={() => {
              setScoreStats({ answeredCount: 0, correctCount: 0, history: {} });
              setEvaluationResult(null);
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Réinitialiser les scores"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>

      {/* Barre de Filtre par Niveau Académique */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-900/50 border border-slate-800">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Filter size={14} className="text-violet-400" />
          <span className="font-medium">Niveau académique cible :</span>
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setSelectedLevelFilter('ALL');
              setActiveProblemIndex(0);
            }}
            className={`px-3 py-1 rounded-lg transition-all ${
              selectedLevelFilter === 'ALL'
                ? 'bg-violet-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Tous ({EXAM_PROBLEMS.length})
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectedLevelFilter('L1-L2');
              setActiveProblemIndex(0);
            }}
            className={`px-3 py-1 rounded-lg transition-all ${
              selectedLevelFilter === 'L1-L2'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            L1 · L2 Fondamentaux
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectedLevelFilter('L3-Master');
              setActiveProblemIndex(0);
            }}
            className={`px-3 py-1 rounded-lg transition-all ${
              selectedLevelFilter === 'L3-Master'
                ? 'bg-violet-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            L3 · Master Avancé
          </button>
        </div>
      </div>

      {/* Corps Principal : Liste des Problèmes + Panneau d'Exécution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Colonne Gauche : Liste des Problèmes */}
        <div className="lg:col-span-4 space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1 font-mono">
            Série d'Exercices Disponibles
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {filteredProblems.map((prob, idx) => {
              const isSelected = idx === activeProblemIndex;
              const status = scoreStats.history[prob.id];

              return (
                <button
                  key={prob.id}
                  type="button"
                  onClick={() => handleSelectProblem(idx)}
                  className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-gradient-to-r from-violet-950/70 to-slate-900 border-violet-500 shadow-lg shadow-violet-900/20 text-white'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`px-2 py-0.2 rounded text-[9px] font-mono font-bold uppercase border ${prob.levelBadge}`}
                      >
                        {prob.level}
                      </span>
                      <span className="text-[10px] text-slate-400 truncate">
                        {prob.category}
                      </span>
                    </div>
                    <div className="text-xs font-bold truncate text-slate-100">
                      {prob.title}
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-1.5">
                    {status === 'correct' && (
                      <CheckCircle2 size={16} className="text-emerald-400" />
                    )}
                    {status === 'incorrect' && (
                      <XCircle size={16} className="text-rose-400" />
                    )}
                    <ChevronRight size={14} className="text-slate-500" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Colonne Droite : Énoncé, Zone de Réponse & Correction Pas à Pas */}
        <div className="lg:col-span-8 space-y-5">
          {/* Carte de l'Énoncé du Problème */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800/90 shadow-2xl backdrop-blur-xl space-y-5">
            {/* Header Problème */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase font-mono border ${currentProblem.levelBadge}`}
                  >
                    {currentProblem.level}
                  </span>
                  <span className="text-xs font-semibold text-violet-300">
                    {currentProblem.category}
                  </span>
                </div>
                <h3 className="text-lg font-extrabold text-white tracking-tight mt-1">
                  {currentProblem.title}
                </h3>
              </div>

              <div className="text-xs text-slate-400 font-mono">
                Exercice {activeProblemIndex + 1} / {filteredProblems.length}
              </div>
            </div>

            {/* Énoncé Textuel */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 text-sm text-slate-200 leading-relaxed font-normal">
              {currentProblem.statement}
            </div>

            {/* Zone Indice Toggleable */}
            <div className="flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() => setShowHint(!showHint)}
                className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 font-medium transition-colors"
              >
                <Lightbulb size={14} className={showHint ? 'text-amber-400' : 'text-indigo-400'} />
                <span>{showHint ? 'Masquer l\'indice méthodologique' : 'Afficher un indice'}</span>
              </button>
            </div>

            {showHint && (
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 flex items-start gap-2.5 animate-in fade-in duration-150">
                <HelpCircle size={16} className="text-amber-400 shrink-0 mt-0.5" />
                <span>{currentProblem.hint}</span>
              </div>
            )}

            {/* Formulaire de Saisie & Validation */}
            <form onSubmit={handleValidateAnswer} className="space-y-3 pt-2">
              <label className="block text-xs font-semibold text-slate-300">
                Votre Réponse Numérique Calculée :
              </label>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={userAnswerInput}
                    onChange={(e) => setUserAnswerInput(e.target.value)}
                    placeholder={`Ex: ${currentProblem.targetAnswer}`}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-base focus:border-violet-500 focus:outline-none placeholder-slate-600"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400 font-bold">
                    {currentProblem.unit}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={!userAnswerInput.trim()}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-violet-900/30"
                >
                  <Calculator size={15} />
                  <span>Valider ma réponse</span>
                </button>
              </div>
            </form>

            {/* Verdict Instantané & Badge de Correction */}
            {evaluationResult && (
              <div
                className={`p-4 rounded-2xl border text-xs space-y-2 animate-in fade-in duration-200 ${
                  evaluationResult.isCorrect
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    {evaluationResult.isCorrect ? (
                      <>
                        <CheckCircle2 size={18} className="text-emerald-400" />
                        <span>Félicitations ! Réponse exacte ou dans la tolérance admise.</span>
                      </>
                    ) : (
                      <>
                        <XCircle size={18} className="text-rose-400" />
                        <span>Réponse incorrecte ou écart trop important.</span>
                      </>
                    )}
                  </div>

                  <span className="font-mono font-bold">
                    Valeur cible attendue : {currentProblem.targetAnswer} {currentProblem.unit}
                  </span>
                </div>

                <p className="text-[11px] text-slate-300">
                  Votre valeur : <strong className="font-mono">{evaluationResult.submitted} {currentProblem.unit}</strong>{' '}
                  (Écart : <span className="font-mono">{evaluationResult.diff}</span>, tolérance acceptée : ±{currentProblem.tolerance}).
                </p>
              </div>
            )}
          </div>

          {/* Correction Détaillée Pas à Pas */}
          {showSolution && (
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4 animate-in fade-in duration-300">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-violet-300 font-bold text-sm">
                  <BookOpen size={16} />
                  <span>Résolution & Correction Pédagogique Détaillée</span>
                </div>
                <span className="text-xs font-mono text-slate-400">Standard Académique CampusHub</span>
              </div>

              <div className="space-y-3">
                {currentProblem.stepByStep.map((s, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1"
                  >
                    <div className="text-xs font-bold text-indigo-400 font-mono">
                      {s.step}
                    </div>
                    <div className="text-xs text-slate-300 leading-relaxed font-sans">
                      {s.detail}
                    </div>
                  </div>
                ))}
              </div>

              {/* Bouton pour passer à l'exercice suivant */}
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    const nextIdx = (activeProblemIndex + 1) % filteredProblems.length;
                    handleSelectProblem(nextIdx);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-2 transition-all border border-slate-700"
                >
                  <span>Problème Suivant</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
