import {
  FlaskConical,
  Atom,
  Dna,
  Binary,
  Cpu,
  Sparkles,
  BookOpen,
  FileCode,
  Shield,
  Layers,
  Database,
  Terminal,
  Activity,
  Calculator,
  Compass,
  FileCheck2,
} from 'lucide-react';

/**
 * Dictionnaire de Configuration / Mapping des Pôles Académiques
 * Associe chaque filière à ses métadonnées, outils, descriptions et couleurs
 */
export const DEPARTMENT_POLES_CONFIG = {
  CHIMIE: {
    id: 'CHIMIE',
    code: 'CHIM',
    badge: 'CHIM',
    title: 'Chimie & Procédés',
    shortTitle: 'Pôle Chimie & Procédés',
    category: 'Laboratoire Expérimental & Procédés',
    description: 'Laboratoire de chimie, chimie organique/inorganique et supports de TP.',
    detailedSummary: 'Banque d\'expérimentation pour les étudiants de chimie et génie des procédés : protocoles de sécurité, fiches techniques de réactions organiques et modèles de compte-rendu de laboratoire.',
    accentColor: 'teal',
    heroGradient: 'from-teal-950 via-emerald-950 to-slate-900',
    borderGlow: 'border-teal-500/30',
    badgeClass: 'bg-teal-50 dark:bg-teal-950/70 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800',
    tagBg: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
    primaryButton: 'bg-teal-600 hover:bg-teal-700 text-white',
    icon: FlaskConical,
    tools: [
      {
        id: 'chim-1',
        title: 'Protocoles de labo',
        subtitle: 'Synthèse organique & cinétique',
        description: 'Guides opératoires normalisés pour la préparation des solutions, réactions d\'estérification, dosages acidobasiques et précipitation.',
        tag: 'Manipulations',
        icon: FlaskConical,
        actionLabel: 'Consulter protocoles',
        sampleContent: 'Protocole TP : Dosage potentiométrique d\'une solution de sulfate de fer(II) par le permanganate de potassium en milieu acide (H2SO4 1M).',
      },
      {
        id: 'chim-2',
        title: 'Sécurité chimique',
        subtitle: 'FDS & Pictogrammes SGH',
        description: 'Guide officiel des fiches de données de sécurité (FDS), règles de manipulation sous hotte, EPI obligatoires et gestion des effluents.',
        tag: 'Normes & Sécurité',
        icon: Shield,
        actionLabel: 'Guide des risques',
        sampleContent: 'Règles de sécurité : Port impératif de lunettes à coques latérales et blouse 100% coton. Manipulation des acides concentrés (HCl, HNO3) strictement sous hotte ventilée.',
      },
      {
        id: 'chim-3',
        title: 'Rapports & Comptes-rendus',
        subtitle: 'Cahiers de laboratoire & Calculs',
        description: 'Modèles LaTeX et traitement des incertitudes de pesée, titrages pH-métriques, spectres IR et chromatographie sur couche mince (CCM).',
        tag: 'Comptes-rendus',
        icon: FileCode,
        actionLabel: 'Modèles de rapports',
        sampleContent: 'Calcul du rendement : Rendement η = (m_expérimentale / m_théorique) * 100. Erreur relative sur la concentration : ΔC/C = ΔV_titrant/V_titrant + Δm/m.',
      },
      {
        id: 'chim-4',
        title: 'Tableau Périodique & Outils',
        subtitle: 'Constantes & Masse molaire',
        description: 'Calculateur stœchiométrique instantané, masses molaires des éléments, constantes d\'acidité (pKa) et potentiels standards redox.',
        tag: 'Calculateur',
        icon: Calculator,
        actionLabel: 'Ouvrir calculateur',
        sampleContent: 'Constantes utiles : Nombre d\'Avogadro N_A = 6.022 × 10^23 mol^-1. Constante des gaz parfaits R = 8.314 J·K^-1·mol^-1.',
      },
    ],
    quickStats: [
      { label: 'Modules de TP', value: '28 Fiches' },
      { label: 'Réactifs SGH', value: '180 FDS' },
    ],
  },

  PHYSIQUE: {
    id: 'PHYSIQUE',
    code: 'PHY',
    badge: 'PHY',
    title: 'Physique, Électronique & Énergie',
    shortTitle: 'Pôle Physique & Électronique',
    category: 'Sciences Physiques & Électronique',
    description: 'Laboratoire de physique, électromagnétisme et traitement du signal.',
    detailedSummary: 'Hub scientifique pour la modélisation des lois physiques : bancs de mesures électriques, oscilloscopes virtuels, schémas électroniques et annales nationales de TP.',
    accentColor: 'amber',
    heroGradient: 'from-amber-950 via-slate-950 to-orange-950',
    borderGlow: 'border-amber-500/30',
    badgeClass: 'bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    tagBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    primaryButton: 'bg-amber-600 hover:bg-amber-700 text-white',
    icon: Atom,
    tools: [
      {
        id: 'phy-1',
        title: 'Formulaires & Lois',
        subtitle: 'Électromagnétisme & Optique',
        description: 'Mémento complet des équations de Maxwell, loi d\'Ohm généralisée, mécanique du point, optique géométrique et thermodynamique statistique.',
        tag: 'Formulaires',
        icon: BookOpen,
        actionLabel: 'Ouvrir mémento',
        sampleContent: 'Équations de Maxwell : div(E) = ρ/ε0 ; rot(E) = -∂B/∂t ; div(B) = 0 ; rot(B) = μ0·j + μ0·ε0·∂E/∂t.',
      },
      {
        id: 'phy-2',
        title: 'Schémas de circuits',
        subtitle: 'RLC & Semi-conducteurs',
        description: 'Simulations et schémas types des filtres passe-bas/passe-haut, amplificateurs opérationnels (AOP), régimes transitoires et transistors bipolaires.',
        tag: 'Électronique',
        icon: Activity,
        actionLabel: 'Schémas types',
        sampleContent: 'Circuit RLC série : Équation différentielle d²u/dt² + (R/L)·du/dt + (1/LC)·u = 0. Pulsation propre ω0 = 1/√(LC), facteur de qualité Q = (1/R)·√(L/C).',
      },
      {
        id: 'phy-3',
        title: 'Annales de TP & Mesures',
        subtitle: 'Oscilloscope & Incertitudes',
        description: 'Recueil des travaux pratiques d\'examen : mesures de f.e.m, réglages d\'oscilloscope numérique, résonance acoustique et pendule de torsion.',
        tag: 'Annales TP',
        icon: FileCheck2,
        actionLabel: 'Consulter annales',
        sampleContent: 'Calcul d\'incertitude de type A et B : Incertitude-type u(x) = s/√(n). Incertitude élargie U = k × u(x) avec k = 2 pour un niveau de confiance de 95%.',
      },
      {
        id: 'phy-4',
        title: 'Énergie & Calculs',
        subtitle: 'Thermodynamique & Ondes',
        description: 'Calculateur des cycles thermiques (Carnot, Otto, Diesel), propagation d\'ondes planes et conversion d\'unités d\'énergie (Joule, eV, kWh).',
        tag: 'Calculateur',
        icon: Calculator,
        actionLabel: 'Outils de calcul',
        sampleContent: 'Premier principe de la thermodynamique : ΔU = W + Q. Rendement maximal de Carnot : η_max = 1 - (T_froid / T_chaud).',
      },
    ],
    quickStats: [
      { label: 'Circuits modèles', value: '45 Schémas' },
      { label: 'Formules clés', value: '120 Lois' },
    ],
  },

  BIOLOGIE: {
    id: 'BIOLOGIE',
    code: 'BIO',
    badge: 'BIO',
    title: 'Biologie & Sciences de la Terre',
    shortTitle: 'Pôle Biosciences & Géosciences',
    category: 'Sciences de la Vie & Environnement',
    description: 'Génétique, microbiologie, écologie et géosciences.',
    detailedSummary: 'Plateforme documentaire et d\'atlas pour les étudiants en biosciences : planches anatomiques, clés de détermination taxonomique et protocoles d\'analyse génétique.',
    accentColor: 'emerald',
    heroGradient: 'from-emerald-950 via-slate-950 to-teal-950',
    borderGlow: 'border-emerald-500/30',
    badgeClass: 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    tagBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    primaryButton: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    icon: Dna,
    tools: [
      {
        id: 'bio-1',
        title: 'Atlas cellulaire',
        subtitle: 'Histologie & Cytologie',
        description: 'Banque d\'images de microscopie optique haute résolution : coupes transversales de tiges, mitose végétale, frottis sanguins et tissus épithéliaux.',
        tag: 'Atlas Visuel',
        icon: Layers,
        actionLabel: 'Consulter atlas',
        sampleContent: 'Identification cytologique : Observation au grossissement ×400 des phases de la mitose chez Allium cepa (racine d\'oignon) : prophase, métaphase, anaphase, télophase.',
      },
      {
        id: 'bio-2',
        title: 'Protocoles biologiques',
        subtitle: 'Extraction ADN & Cultures',
        description: 'Guides de préparation des milieux de culture (PCA, Sabouraud), coloration de Gram, extraction d\'acides nucléiques et PCR analytique.',
        tag: 'Laboratoire',
        icon: Dna,
        actionLabel: 'Fiches protocoles',
        sampleContent: 'Coloration de Gram : 1. Violet de gentiane (1 min) ; 2. Lugol (1 min) ; 3. Décoloration à l\'alcool 95° (15-30 s) ; 4. Contre-coloration à la fuchsine (1 min).',
      },
      {
        id: 'bio-3',
        title: 'Taxonomie & Clés',
        subtitle: 'Botanique & Zoologie camerounaise',
        description: 'Clés dichotomiques pour l\'identification des familles végétales du bassin du Congo, entomologie agricole et classification phylogénétique.',
        tag: 'Systématique',
        icon: BookOpen,
        actionLabel: 'Clés taxonomiques',
        sampleContent: 'Classification APG IV : Caractères diagnostiques des Fabaceae (fleurs papilionacées, 10 étamines, fruit en gousse) et Poaceae (tige creuse à nœuds, feuilles rubanées).',
      },
      {
        id: 'bio-4',
        title: 'Géosciences & Écologie',
        subtitle: 'Stratigraphie & Écosystèmes',
        description: 'Notices de géologie régionale (socle cristallin camerounais, volcanisme de la ligne du Cameroun) et indices écologiques (Shannon, Simpson).',
        tag: 'Environnement',
        icon: Compass,
        actionLabel: 'Outils écologie',
        sampleContent: 'Indice de diversité de Shannon H\' = -Σ (pi × ln(pi)). Équitabilité de Pielou J = H\' / ln(S). Profil lithologique du craton du Congo au Sud-Cameroun.',
      },
    ],
    quickStats: [
      { label: 'Planches atlas', value: '64 Clichés' },
      { label: 'Espèces indexées', value: '350 Fiches' },
    ],
  },

  MATHEMATIQUES: {
    id: 'MATHEMATIQUES',
    code: 'MATH',
    badge: 'MATH',
    title: 'Mathématiques & Applications',
    shortTitle: 'Pôle Mathématiques & Calcul',
    category: 'Modélisation & Analyse Quantitative',
    description: 'Analyse, algèbre linéaire, probabilités et calcul scientifique.',
    detailedSummary: 'Pôle d\'excellence pour les étudiants de mathématiques pures et appliquées : démonstrations rigoureuses, fiches d\'exercices classées par niveau et scripts de calcul numérique.',
    accentColor: 'purple',
    heroGradient: 'from-purple-950 via-slate-950 to-indigo-950',
    borderGlow: 'border-purple-500/30',
    badgeClass: 'bg-purple-50 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
    tagBg: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    primaryButton: 'bg-purple-600 hover:bg-purple-700 text-white',
    icon: Binary,
    tools: [
      {
        id: 'math-1',
        title: 'Recueils d\'exercices',
        subtitle: 'Analyse & Algèbre bilinéaire',
        description: 'Séries d\'exercices corrigés pas à pas : intégrales généralisées, séries de Fourier, diagonalisation, formes quadratiques et espaces de Hilbert.',
        tag: 'Exercices',
        icon: BookOpen,
        actionLabel: 'Séries d\'exercices',
        sampleContent: 'Exercice type L2 : Démontrer que toute matrice symétrique réelle est diagonalisable dans une base orthonormée (Théorème spectral). Calculer les valeurs propres de A.',
      },
      {
        id: 'math-2',
        title: 'Démonstrations clés',
        subtitle: 'Théorèmes fondamentaux',
        description: 'Compilations des lemmes et théorèmes d\'amphi : théorème de Cauchy-Lipschitz, convergence dominée de Lebesgue, théorème de Bolzano-Weierstrass.',
        tag: 'Démonstrations',
        icon: FileCode,
        actionLabel: 'Fiches théorèmes',
        sampleContent: 'Théorème de convergence dominée : Soit (f_n) une suite de fonctions intégrables convergeant p.p. vers f. S\'il existe g intégrable telle que |f_n| ≤ g, alors ∫f = lim ∫f_n.',
      },
      {
        id: 'math-3',
        title: 'Scripts de calcul',
        subtitle: 'Python NumPy, SciPy & Octave',
        description: 'Algorithmes numériques prêts à l\'emploi : méthode de Newton-Raphson, factorisation LU/Cholesky, résolution RK4 d\'EDO et interpolation de Lagrange.',
        tag: 'Algorithmique',
        icon: Terminal,
        actionLabel: 'Scripts Python',
        sampleContent: 'import numpy as np\n# Décomposition LU\ndef lu_decompose(A):\n    n = len(A)\n    L, U = np.eye(n), np.zeros((n, n))\n    # calcul des facteurs...',
      },
      {
        id: 'math-4',
        title: 'Probabilités & Stats',
        subtitle: 'Lois & Tests d\'hypothèses',
        description: 'Formulaires des lois discrètes et continues (Gaussienne, Poisson, Student), théorème central limite et tests statistiques du Chi-deux.',
        tag: 'Probabilités',
        icon: Calculator,
        actionLabel: 'Aide-mémoire proba',
        sampleContent: 'Théorème Central Limite (TCL) : Soit X_1,...,X_n i.i.d. d\'espérance μ et variance σ². Alors √n(X̄_n - μ)/σ converge en loi vers N(0, 1) quand n → ∞.',
      },
    ],
    quickStats: [
      { label: 'Théorèmes révisés', value: '95 Fiches' },
      { label: 'Scripts numériques', value: '40 Algorithmes' },
    ],
  },

  INFORMATIQUE: {
    id: 'INFORMATIQUE',
    code: 'TECH',
    badge: 'TECH',
    title: 'Pôle d\'Excellence Informatique & Génie Logiciel',
    shortTitle: 'Pôle Informatique & Code',
    category: 'Cœur Technologique & Programmation',
    description: 'Algorithmique, structures de données, développement web/mobile et cybersécurité.',
    detailedSummary: 'Hub centralisé pour les étudiants en informatique du Cameroun : Playground C/Python/SQL en direct, algorithmes fondamentaux, systèmes d\'exploitation POSIX et architectures logicielles.',
    accentColor: 'indigo',
    heroGradient: 'from-slate-950 via-indigo-950 to-slate-900',
    borderGlow: 'border-indigo-500/30',
    badgeClass: 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
    tagBg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    primaryButton: 'bg-indigo-600 hover:bg-indigo-700 text-white',
    icon: Cpu,
    tools: [
      {
        id: 'tech-1',
        title: 'Playground C/Python',
        subtitle: 'Compilateur GCC & Runtime POSIX',
        description: 'Environnement d\'exécution interactif dans le navigateur avec simulateur GCC -Wall, exécution Python 3 et validation automatique des cas de tests.',
        tag: 'Compilateur',
        icon: Terminal,
        actionLabel: 'Lancer le compilateur',
        sampleContent: '#include <stdio.h>\n#include <stdlib.h>\nint main(void) {\n    printf("CampusHub UY1: Runtime C opérationnel\\n");\n    return 0;\n}',
      },
      {
        id: 'tech-2',
        title: 'Bases de données',
        subtitle: 'Requêtes SQL relationnelles',
        description: 'Banc de tests pour requêtes SQL normalisées (3NF), modélisation Entité-Association, jointures complexes et procédures stockées PostgreSQL.',
        tag: 'SQL & Données',
        icon: Database,
        actionLabel: 'Exécuter requêtes',
        sampleContent: 'SELECT etudiants.matricule, etudiants.nom, AVG(notes.valeur) as moyenne\nFROM etudiants JOIN notes ON etudiants.id = notes.etudiant_id\nGROUP BY etudiants.id HAVING moyenne >= 14.0;',
      },
      {
        id: 'tech-3',
        title: 'Dépôt de projets & Algo',
        subtitle: 'Structures de données & Graphes',
        description: 'Code source et implémentations commentées : Arbres AVL, parcours BFS/DFS, algorithme de Dijkstra, tables de hachage et programmation dynamique.',
        tag: 'Dépôt & Projets',
        icon: FileCode,
        actionLabel: 'Explorer les dépôts',
        sampleContent: '// Arbre Binaire AVL : Rotation Gauche\nNode* leftRotate(Node *x) {\n    Node *y = x->right;\n    x->right = y->left;\n    y->left = x;\n    updateHeight(x); updateHeight(y);\n    return y;\n}',
      },
      {
        id: 'tech-4',
        title: 'Architecture & Systèmes',
        subtitle: 'UNIX POSIX & Réseaux',
        description: 'Mémento des appels système (fork, exec, pipe, shmget), modèles OSI/TCP-IP, analyse de trames Wireshark et principes de cybersécurité.',
        tag: 'Systèmes & Réseaux',
        icon: Shield,
        actionLabel: 'Mémento systèmes',
        sampleContent: 'Appel système POSIX fork() : pid_t pid = fork(); if (pid == 0) { /* Processus Fils */ } else if (pid > 0) { /* Processus Parent */ wait(NULL); }',
      },
    ],
    quickStats: [
      { label: 'Langages supportés', value: 'C, Py, JS, SQL' },
      { label: 'Défis d\'algorithmique', value: '45 Problèmes' },
    ],
  },

  DEFAULT: {
    id: 'DEFAULT',
    code: 'SCI',
    badge: 'SCI',
    title: 'Pôle Scientifique Général',
    shortTitle: 'Pôle Scientifique Général',
    category: 'Socle Pluridisciplinaire & Méthodologie',
    description: 'Ressources transversales et fondamentaux scientifiques.',
    detailedSummary: 'Espace partagé pour l\'ensemble des étudiants des filières scientifiques : méthodologie de travail universitaire, calculs d\'incertitudes, outils documentaires et annales générales.',
    accentColor: 'slate',
    heroGradient: 'from-slate-950 via-slate-900 to-indigo-950',
    borderGlow: 'border-slate-500/30',
    badgeClass: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
    tagBg: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
    primaryButton: 'bg-indigo-600 hover:bg-indigo-700 text-white',
    icon: Sparkles,
    tools: [
      {
        id: 'sci-1',
        title: 'Ressources transversales',
        subtitle: 'Méthodologie & Rédaction',
        description: 'Guides d\'organisation du temps d\'étude, prise de notes efficace en amphi, rédaction de rapports scientifiques et recherche bibliographique.',
        tag: 'Méthodologie',
        icon: BookOpen,
        actionLabel: 'Guides méthodologiques',
        sampleContent: 'Méthode de révision espacée : R1 (J+1), R2 (J+3), R3 (J+7), R4 (J+15), R5 (J+30). Structuration d\'un rapport IMRAD : Introduction, Méthodes, Résultats et Discussion.',
      },
      {
        id: 'sci-2',
        title: 'Fondamentaux scientifiques',
        subtitle: 'Mathématiques & Unités SI',
        description: 'Formulaires des outils mathématiques de base pour toutes filières : dérivation, intégration, trigonométrie et analyse dimensionnelle SI.',
        tag: 'Bases Scientifiques',
        icon: Calculator,
        actionLabel: 'Formulaires de base',
        sampleContent: 'Unités fondamentales SI : mètre (m), kilogramme (kg), seconde (s), ampère (A), kelvin (K), mole (mol), candela (cd). Analyse dimensionnelle [F] = M·L·T^-2.',
      },
      {
        id: 'sci-3',
        title: 'Annales & Polycopiés',
        subtitle: 'Archives d\'examens semestriels',
        description: 'Recueil des épreuves communes et annales corrigées des facultés des sciences du Cameroun (Semestres 1 à 6).',
        tag: 'Annales',
        icon: FileCheck2,
        actionLabel: 'Accéder aux annales',
        sampleContent: 'Conseils pour les examens MINESUP : Bien soigner la présentation, numéroter clairement les questions et vérifier l\'homogénéité des formules littérales.',
      },
      {
        id: 'sci-4',
        title: 'Outils & Carnet d\'Étude',
        subtitle: 'Prise de notes & Calculateur',
        description: 'Accès rapide au carnet privé chiffré, convertisseur d\'unités et planificateur de révisions académiques.',
        tag: 'Outils',
        icon: Sparkles,
        actionLabel: 'Ouvrir les outils',
        sampleContent: 'Ressources CampusHub synchronisées : Toutes vos fiches et favoris sont automatiquement conservés dans votre espace étudiant.',
      },
    ],
    quickStats: [
      { label: 'Supports transversaux', value: '80 Fiches' },
      { label: 'Annales générales', value: '150 Épreuves' },
    ],
  },
};

/**
 * Fonction de détection sécurisée de la filière active (insensible à la casse et par mots-clés)
 * @param {string} filiereStr - Nom ou libellé de la filière
 * @returns {object} Configuration complète du Pôle correspondant
 */
export function getDepartmentPole(filiereStr) {
  if (!filiereStr || typeof filiereStr !== 'string') {
    return DEPARTMENT_POLES_CONFIG.DEFAULT;
  }

  // Normalisation : suppression des accents, mise en minuscules et trim
  const normalized = filiereStr
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();

  // 1. Chimie & Procédés
  if (
    normalized.includes('chim') ||
    normalized.includes('chem') ||
    normalized.includes('proced') ||
    normalized.includes('materiau')
  ) {
    return DEPARTMENT_POLES_CONFIG.CHIMIE;
  }

  // 2. Physique & Électronique
  if (
    normalized.includes('phys') ||
    normalized.includes('electr') ||
    normalized.includes('energ') ||
    normalized.includes('optiq') ||
    normalized.includes('mecanic')
  ) {
    return DEPARTMENT_POLES_CONFIG.PHYSIQUE;
  }

  // 3. Biologie & Sciences de la Terre
  if (
    normalized.includes('bio') ||
    normalized.includes('terre') ||
    normalized.includes('geol') ||
    normalized.includes('vie') ||
    normalized.includes('svt') ||
    normalized.includes('ecol')
  ) {
    return DEPARTMENT_POLES_CONFIG.BIOLOGIE;
  }

  // 4. Mathématiques & Applications
  if (
    normalized.includes('math') ||
    normalized.includes('algeb') ||
    normalized.includes('statist') ||
    normalized.includes('proba')
  ) {
    return DEPARTMENT_POLES_CONFIG.MATHEMATIQUES;
  }

  // 5. Informatique & Génie Logiciel
  if (
    normalized.includes('info') ||
    normalized.includes('logiciel') ||
    normalized.includes('software') ||
    normalized.includes('code') ||
    normalized.includes('reseau') ||
    normalized.includes('cyber') ||
    normalized.includes('data') ||
    normalized.includes('ia') ||
    normalized.includes('system')
  ) {
    return DEPARTMENT_POLES_CONFIG.INFORMATIQUE;
  }

  // Fallback par défaut
  return DEPARTMENT_POLES_CONFIG.DEFAULT;
}
