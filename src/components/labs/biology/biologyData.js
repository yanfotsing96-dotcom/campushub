/**
 * CampusHub - BiologyLab Hub Academic Dataset
 * Filière Sciences de la Vie & Biologie : L1 à Master 2
 * Données pédagogiques, constantes biochimiques et paramètres expérimentaux
 */

import {
  LayoutDashboard,
  Layers,
  Activity,
  Sparkles,
  Dna,
  ShieldAlert,
  Compass,
  GraduationCap,
} from 'lucide-react';

export const BIOLOGY_CONSTANTS = {
  R: 8.314, // J/(mol·K) Constante des gaz parfaits
  T_STD: 310.15, // 37°C en Kelvin
  AVOGADRO: 6.02214076e23,
  WATER_KW: 1e-14,
  STD_BODY_TEMP: 37, // °C
};

export const ACADEMIC_SECTIONS = {
  fondamentaux: {
    id: 'fondamentaux',
    label: 'Fondamentaux (L1 - L2)',
    shortLabel: 'L1-L2',
    description: 'Bases cellulaires, cinétique biochimique enzymatique et dynamique de croissance microbienne.',
    badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  },
  avance: {
    id: 'avance',
    label: 'Avancé (L3 - Master)',
    shortLabel: 'L3-Master',
    description: 'Biologie moléculaire génomique, immunologie humorale et modélisation systémique écologique.',
    badgeClass: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
  },
};

export const BIOLOGY_MODULES = [
  // --- FONDAMENTAUX (L1 - L2) ---
  {
    id: 'cell_mitosis',
    sectionId: 'fondamentaux',
    code: 'BIO101',
    levelLabel: 'L1-L2 · Fondamentaux',
    title: 'Biologie Cellulaire & Mitose',
    shortTitle: 'Cellule & Mitose',
    formula: 'IM = \\frac{N_{\\text{mitose}}}{N_{\\text{total}}} \\times 100',
    expandedFormula: 'T_{\\text{phase}} = \\frac{N_{\\text{phase}}}{N_{\\text{mitose}}} \\times T_{\\text{mitotique}}',
    keyLaw: 'Points de Contrôle du Cycle Cellulaire (G1/S, G2/M, Fuseau Métaphasique)',
    description:
      'Dynamique du cycle cellulaire eucaryote (Interphase G1, S, G2 et Mitose M). Observation microscopique virtuelle, dénombrement par phase (Prophase, Métaphase, Anaphase, Télophase) et calcul de l\'index mitotique sous conditions de stress thermique ou chimique.',
    iconName: 'Layers',
    accentColor: 'emerald',
    borderColor: 'hover:border-emerald-500/40',
    tags: ['Cycle Cellulaire', 'Mitose', 'Cytodiérèse', 'Microscopie', 'Index Mitotique'],
    learningOutcomes: [
      'Identification morphologique des 4 phases de la mitose sous microscope optique',
      'Calcul quantitatif de l\'index mitotique pour évaluer la prolifération tissulaire',
      'Effet de la colchicine (inhibiteur du fuseau) et de la température sur la dynamique mitotique',
    ],
    defaultParams: {
      initialPopulation: 1000, // cellules observées
      cultureTime: 24, // heures
      temperature: 37, // °C
      colchicineDose: 0, // µg/mL (0 = témoin)
    },
    presets: [
      { name: 'Prolifération Eucaryote Standard (37°C)', initialPopulation: 1000, cultureTime: 24, temperature: 37, colchicineDose: 0 },
      { name: 'Inhibition Métaphasique (Colchicine 5 µg/mL)', initialPopulation: 1200, cultureTime: 24, temperature: 37, colchicineDose: 5 },
      { name: 'Choc Thermique Froid (20°C)', initialPopulation: 800, cultureTime: 24, temperature: 20, colchicineDose: 0 },
      { name: 'Lignée Cancéreuse Hyperproliférative', initialPopulation: 2500, cultureTime: 18, temperature: 37.5, colchicineDose: 0 },
    ],
  },
  {
    id: 'enzymology',
    sectionId: 'fondamentaux',
    code: 'BIO102',
    levelLabel: 'L1-L2 · Fondamentaux',
    title: 'Cinétique Enzymatique de Michaelis-Menten',
    shortTitle: 'Cinétique Enzymatique',
    formula: 'v = \\frac{V_{\\max} \\cdot [S]}{K_m + [S]}',
    expandedFormula: '\\frac{1}{v} = \\frac{K_m}{V_{\\max}} \\cdot \\frac{1}{[S]} + \\frac{1}{V_{\\max}}',
    keyLaw: 'Modèle de Michaelis-Menten & Représentation Linéaire de Lineweaver-Burk',
    description:
      'Étude quantitative de la catalyse enzymatique homogène. Analyse de la vitesse initiale v0 en fonction de la concentration en substrat [S], détermination graphique de Vmax et de la constante de Michaelis Km, et impact des inhibiteurs réversibles compétitifs et non-compétitifs.',
    iconName: 'Activity',
    accentColor: 'indigo',
    borderColor: 'hover:border-indigo-500/40',
    tags: ['Enzymologie', 'Vmax & Km', 'Lineweaver-Burk', 'Inhibiteurs', 'Biochimie'],
    learningOutcomes: [
      'Tracé de la courbe hyperbolique v0 = f([S]) et extraction graphique de Km et Vmax',
      'Linéarisation en double inverse (Lineweaver-Burk) et calcul des pentes et ordonnées à l\'origine',
      'Discrimination cinétique entre inhibition compétitive (Km augmente) et non-compétitive (Vmax diminue)',
    ],
    defaultParams: {
      substrateConcentration: 10, // mM
      vmax: 100, // µmol/(min·mg)
      km: 2.5, // mM
      temperature: 37, // °C
      inhibitorType: 'none', // 'none' | 'competitive' | 'non_competitive'
      inhibitorConc: 0, // mM
      ki: 1.5, // mM
    },
    presets: [
      { name: 'Enzyme Standard Témoin ([S]=10 mM, Km=2.5)', substrateConcentration: 10, vmax: 100, km: 2.5, temperature: 37, inhibitorType: 'none', inhibitorConc: 0, ki: 1.5 },
      { name: 'Inhibition Compétitive Forte ([I]=3 mM)', substrateConcentration: 10, vmax: 100, km: 2.5, temperature: 37, inhibitorType: 'competitive', inhibitorConc: 3, ki: 1.5 },
      { name: 'Inhibition Non-Compétitive (Allostérique)', substrateConcentration: 10, vmax: 100, km: 2.5, temperature: 37, inhibitorType: 'non_competitive', inhibitorConc: 2, ki: 1.5 },
      { name: 'Hypothermie Réactionnelle (25°C)', substrateConcentration: 10, vmax: 100, km: 2.5, temperature: 25, inhibitorType: 'none', inhibitorConc: 0, ki: 1.5 },
    ],
  },
  {
    id: 'bacterial_growth',
    sectionId: 'fondamentaux',
    code: 'BIO201',
    levelLabel: 'L1-L2 · Fondamentaux',
    title: 'Croissance Bactérienne & Dynamique Microbienne',
    shortTitle: 'Croissance Bactérienne',
    formula: 'N(t) = N_0 \\cdot 2^{t / G} = N_0 \\cdot e^{\\mu t}',
    expandedFormula: 'G = \\frac{\\ln(2)}{\\mu}, \\quad \\mu = \\mu_{\\max} \\frac{S}{K_s + S}',
    keyLaw: 'Modèle de Monod & Phases de Croissance en Culture Batch Fermée',
    description:
      'Cinétique de multiplication des micro-organismes en milieu liquide clos. Analyse séquentielle des 4 phases : latence, exponentielle, stationnaire et mortalité. Calcul instantané du taux de croissance népérien µ, du temps de génération G et de la Densité Optique (DO 600 nm).',
    iconName: 'Sparkles',
    accentColor: 'emerald',
    borderColor: 'hover:border-emerald-500/40',
    tags: ['Microbiologie', 'Culture Batch', 'Temps de Génération', 'DO 600nm', 'Cinétique Monod'],
    learningOutcomes: [
      'Caractérisation des quatre phases de croissance en bioréacteur fermé',
      'Calcul expérimental du temps de génération G et du taux de croissance spécifique µ',
      'Relation entre la densité cellulaire viable (CFU/mL) et la turbidimétrie spectrophotométrique',
    ],
    defaultParams: {
      initialPopulation: 10000, // UFC / mL (N0)
      cultureTime: 16, // heures
      temperature: 37, // °C
      substrateConcentration: 5.0, // g/L de substrat carboné (glucose)
      lagDuration: 2.0, // heures de phase de latence
    },
    presets: [
      { name: 'Escherichia coli en Bouillon LB (37°C)', initialPopulation: 10000, cultureTime: 16, temperature: 37, substrateConcentration: 5.0, lagDuration: 1.5 },
      { name: 'Culture à Basse Température (22°C)', initialPopulation: 10000, cultureTime: 24, temperature: 22, substrateConcentration: 5.0, lagDuration: 3.5 },
      { name: 'Milieu Carencé en Carbone (Glucose 0.5 g/L)', initialPopulation: 10000, cultureTime: 16, temperature: 37, substrateConcentration: 0.5, lagDuration: 2.0 },
      { name: 'Inoculum Massif (Phase Exponentielle Immédiate)', initialPopulation: 100000, cultureTime: 12, temperature: 37, substrateConcentration: 8.0, lagDuration: 0.5 },
    ],
  },

  // --- AVANCÉ (L3 - MASTER) ---
  {
    id: 'molecular_genetics',
    sectionId: 'avance',
    code: 'BIO301',
    levelLabel: 'L3-Master · Avancé',
    title: 'Génétique Moléculaire & Transcription/Traduction',
    shortTitle: 'Génétique Moléculaire',
    formula: '\\text{ADN (3\'\\rightarrow 5\')} \\xrightarrow{\\text{ARN Pol II}} \\text{ARNm (5\'\\rightarrow 3\')} \\xrightarrow{\\text{Ribosome}} \\text{Polypeptide}',
    expandedFormula: '\\text{Code Génétique Triplet Degénéré} : 64 \\text{ codons } \\rightarrow 20 \\text{ Acides Aminés}',
    keyLaw: 'Dogme Central de la Biologie Moléculaire & Synthèse Protéique Eucaryote/Procaryote',
    description:
      'Simulateur d\'expression génique in silico. Transcription enzymatique du brin d\'ADN non-codant matrice en ARN messager complémentaire, maturation des extrémités et traduction ribosomique en chaîne peptidique. Évaluation de l\'effet des mutations (silencieuse, faux-sens, non-sens, décalage du cadre de lecture).',
    iconName: 'Dna',
    accentColor: 'violet',
    borderColor: 'hover:border-violet-500/40',
    tags: ['Transcription', 'Traduction', 'Codons', 'Mutagénèse', 'Bio-informatique'],
    learningOutcomes: [
      'Application des règles d\'appariement antiparallèle de Watson-Crick (A-U, T-A, C-G, G-C)',
      'Identification du codon initiateur AUG et des trois codons STOP (UAA, UAG, UGA)',
      'Analyse de l\'impact phénotypique des mutations génétiques sur la séquence primaire de la protéine',
    ],
    defaultParams: {
      initialPopulation: 1, // copie d'allèle
      cultureTime: 1, // cycle
      temperature: 37, // °C
      substrateConcentration: 1.0, // concentration d'ARN polymérase
      dnaSequence: 'TACAAAGCTCCCGAAACT', // Séquence matrice 3' -> 5'
    },
    presets: [
      { name: 'Gène Témoin avec Codon Initiateur (Met-Phe-Arg-Gly-Leu-Stop)', dnaSequence: 'TACAAAGCTCCCGAAACT', temperature: 37, cultureTime: 1, initialPopulation: 1, substrateConcentration: 1 },
      { name: 'Mutation Non-Sens Prématurée (Codon STOP UAG)', dnaSequence: 'TACATCACCCTCGAAACT', temperature: 37, cultureTime: 1, initialPopulation: 1, substrateConcentration: 1 },
      { name: 'Hémoglobine Humaine Brin Beta (Drépanocytose HbS)', dnaSequence: 'TACGTGCTCACTCTCCTA', temperature: 37, cultureTime: 1, initialPopulation: 1, substrateConcentration: 1 },
      { name: 'Séquence Longue Poly-Alanine', dnaSequence: 'TACCGAACGACGACGACT', temperature: 37, cultureTime: 1, initialPopulation: 1, substrateConcentration: 1 },
    ],
  },
  {
    id: 'immunology',
    sectionId: 'avance',
    code: 'BIO401',
    levelLabel: 'L3-Master · Avancé',
    title: 'Immunologie & Réponse Anticorps (ELISA)',
    shortTitle: 'Immunologie & ELISA',
    formula: 'K_a = \\frac{[\\text{Ag-Ab}]}{[\\text{Ag}]_{\\text{libre}} \\cdot [\\text{Ab}]_{\\text{libre}}}',
    expandedFormula: 'A_{450} = A_{\\min} + \\frac{A_{\\max} - A_{\\min}}{1 + (\\text{EC}_{50} / [\\text{Ab}])^h}',
    keyLaw: 'Commutation Isotypique (IgM \\rightarrow IgG) & Équilibre de Masse Immuno-Enzymatique',
    description:
      'Dynamique de la réponse immunitaire humorale adaptative. Comparaison quantitative de la réponse primaire (dominance IgM, latence longue) et secondaire (titre élevé en IgG à haute affinité, mémoire immunitaire). Module virtuel de titrage ELISA indirect avec courbe standard d\'absorbance optique à 450 nm.',
    iconName: 'ShieldAlert',
    accentColor: 'indigo',
    borderColor: 'hover:border-indigo-500/40',
    tags: ['Immunologie', 'Anticorps IgM/IgG', 'Test ELISA', 'Mémoire Immunitaire', 'Affinité'],
    learningOutcomes: [
      'Différenciation de la cinétique des immunoglobulines IgM versus IgG lors d\'un rappel vaccinal',
      'Interprétation d\'une gamme étalon de spectrophotométrie ELISA et équation de Hill à 4 paramètres',
      'Calcul du titre sérique protecteur et de l\'affinité Ka du paratope envers l\'épitope',
    ],
    defaultParams: {
      initialPopulation: 100, // Titre d'anticorps initial (UI/mL)
      cultureTime: 30, // Jours après contact
      temperature: 37, // °C
      substrateConcentration: 50, // ng/mL d'antigène administré
      boosterDay: 14, // Jour de rappel antigénique
    },
    presets: [
      { name: 'Primo-Vaccination & Rappel à J14', initialPopulation: 50, cultureTime: 30, temperature: 37, substrateConcentration: 50, boosterDay: 14 },
      { name: 'Primo-Infection Seule (Sans Rappel)', initialPopulation: 50, cultureTime: 30, temperature: 37, substrateConcentration: 50, boosterDay: 0 },
      { name: 'Immunodépression (Faible commutation IgG)', initialPopulation: 10, cultureTime: 30, temperature: 37, substrateConcentration: 20, boosterDay: 14 },
      { name: 'Hyper-Réactivité Mémoire (Rappel Précoce J7)', initialPopulation: 200, cultureTime: 25, temperature: 37, substrateConcentration: 100, boosterDay: 7 },
    ],
  },
  {
    id: 'ecology_lotka_volterra',
    sectionId: 'avance',
    code: 'BIO501',
    levelLabel: 'L3-Master · Avancé',
    title: 'Écologie & Modèle Proie-Prédateur (Lotka-Volterra)',
    shortTitle: 'Modèle Proie-Prédateur',
    formula: '\\frac{dx}{dt} = \\alpha x - \\beta x y, \\quad \\frac{dy}{dt} = \\delta x y - \\gamma y',
    expandedFormula: 'x^* = \\frac{\\gamma}{\\delta}, \\quad y^* = \\frac{\\alpha}{\\beta} \\quad (\\text{Point d\'équilibre fixe})',
    keyLaw: 'Système Différentiel Non Linéaire & Trajectoires Fermées dans l\'Espace des Phases',
    description:
      'Dynamique des populations et écologie théorique. Résolution numérique du système différentiel couplé lièvre (proie) / lynx (prédateur). Visualisation synchronisée des courbes temporelles d\'abondance et des cycles fermés périodiques dans l\'espace des phases (x, y).',
    iconName: 'Compass',
    accentColor: 'emerald',
    borderColor: 'hover:border-emerald-500/40',
    tags: ['Écologie', 'Lotka-Volterra', 'Dynamique des Populations', 'Espace des Phases', 'Bio-maths'],
    learningOutcomes: [
      'Résolution par intégration numérique d\'Euler pas à pas du modèle de prédation',
      'Caractérisation du déphasage temporel classique d\'un quart de période entre proies et prédateurs',
      'Identification du point d\'équilibre écologique stationnaire stable',
    ],
    defaultParams: {
      initialPopulation: 100, // Nombre de proies initiales (x0)
      cultureTime: 60, // Temps de simulation (semaines ou mois)
      temperature: 20, // °C environnemental
      substrateConcentration: 25, // Nombre de prédateurs initiaux (y0)
      alpha: 0.1, // Taux de natalité des proies (1/temps)
      beta: 0.005, // Efficacité de prédation
      delta: 0.00004, // Efficacité de conversion trophique
      gamma: 0.04, // Mortalité naturelle des prédateurs
    },
    presets: [
      { name: 'Cycle Classique Lièvres & Lynx (Oscillation)', initialPopulation: 100, cultureTime: 80, temperature: 18, substrateConcentration: 25, alpha: 0.1, beta: 0.005, delta: 0.00004, gamma: 0.04 },
      { name: 'Équilibre Stationnaire Parfait', initialPopulation: 1000, cultureTime: 60, temperature: 20, substrateConcentration: 20, alpha: 0.1, beta: 0.005, delta: 0.00004, gamma: 0.04 },
      { name: 'Prolifération Invasive de Proies', initialPopulation: 250, cultureTime: 60, temperature: 22, substrateConcentration: 5, alpha: 0.15, beta: 0.003, delta: 0.00002, gamma: 0.05 },
      { name: 'Surpêche / Effondrement des Prédateurs', initialPopulation: 50, cultureTime: 60, temperature: 15, substrateConcentration: 45, alpha: 0.08, beta: 0.006, delta: 0.00003, gamma: 0.08 },
    ],
  },
];

export const GENETIC_CODE_MAPPING = {
  AUG: { aa: 'Met', name: 'Méthionine (Start)', type: 'hydrophobic' },
  UUU: { aa: 'Phe', name: 'Phénylalanine', type: 'hydrophobic' },
  UUC: { aa: 'Phe', name: 'Phénylalanine', type: 'hydrophobic' },
  UUA: { aa: 'Leu', name: 'Leucine', type: 'hydrophobic' },
  UUG: { aa: 'Leu', name: 'Leucine', type: 'hydrophobic' },
  CUU: { aa: 'Leu', name: 'Leucine', type: 'hydrophobic' },
  CUC: { aa: 'Leu', name: 'Leucine', type: 'hydrophobic' },
  CUA: { aa: 'Leu', name: 'Leucine', type: 'hydrophobic' },
  CUG: { aa: 'Leu', name: 'Leucine', type: 'hydrophobic' },
  AUU: { aa: 'Ile', name: 'Isoleucine', type: 'hydrophobic' },
  AUC: { aa: 'Ile', name: 'Isoleucine', type: 'hydrophobic' },
  AUA: { aa: 'Ile', name: 'Isoleucine', type: 'hydrophobic' },
  GUU: { aa: 'Val', name: 'Valine', type: 'hydrophobic' },
  GUC: { aa: 'Val', name: 'Valine', type: 'hydrophobic' },
  GUA: { aa: 'Val', name: 'Valine', type: 'hydrophobic' },
  GUG: { aa: 'Val', name: 'Valine', type: 'hydrophobic' },
  UCU: { aa: 'Ser', name: 'Sérine', type: 'polar' },
  UCC: { aa: 'Ser', name: 'Sérine', type: 'polar' },
  UCA: { aa: 'Ser', name: 'Sérine', type: 'polar' },
  UCG: { aa: 'Ser', name: 'Sérine', type: 'polar' },
  CCU: { aa: 'Pro', name: 'Proline', type: 'special' },
  CCC: { aa: 'Pro', name: 'Proline', type: 'special' },
  CCA: { aa: 'Pro', name: 'Proline', type: 'special' },
  CCG: { aa: 'Pro', name: 'Proline', type: 'special' },
  ACU: { aa: 'Thr', name: 'Thréonine', type: 'polar' },
  ACC: { aa: 'Thr', name: 'Thréonine', type: 'polar' },
  ACA: { aa: 'Thr', name: 'Thréonine', type: 'polar' },
  ACG: { aa: 'Thr', name: 'Thréonine', type: 'polar' },
  GCU: { aa: 'Ala', name: 'Alanine', type: 'hydrophobic' },
  GCC: { aa: 'Ala', name: 'Alanine', type: 'hydrophobic' },
  GCA: { aa: 'Ala', name: 'Alanine', type: 'hydrophobic' },
  GCG: { aa: 'Ala', name: 'Alanine', type: 'hydrophobic' },
  UAU: { aa: 'Tyr', name: 'Tyrosine', type: 'polar' },
  UAC: { aa: 'Tyr', name: 'Tyrosine', type: 'polar' },
  UAA: { aa: 'STOP', name: 'Codon Stop (Ocre)', type: 'stop' },
  UAG: { aa: 'STOP', name: 'Codon Stop (Ambre)', type: 'stop' },
  CAU: { aa: 'His', name: 'Histidine', type: 'basic' },
  CAC: { aa: 'His', name: 'Histidine', type: 'basic' },
  CAA: { aa: 'Gln', name: 'Glutamine', type: 'polar' },
  CAG: { aa: 'Gln', name: 'Glutamine', type: 'polar' },
  AAU: { aa: 'Asn', name: 'Asparagine', type: 'polar' },
  AAC: { aa: 'Asn', name: 'Asparagine', type: 'polar' },
  AAA: { aa: 'Lys', name: 'Lysine', type: 'basic' },
  AAG: { aa: 'Lys', name: 'Lysine', type: 'basic' },
  GAU: { aa: 'Asp', name: 'Aspartate', type: 'acidic' },
  GAC: { aa: 'Asp', name: 'Aspartate', type: 'acidic' },
  GAA: { aa: 'Glu', name: 'Glutamate', type: 'acidic' },
  GAG: { aa: 'Glu', name: 'Glutamate', type: 'acidic' },
  UGU: { aa: 'Cys', name: 'Cystéine', type: 'polar' },
  UGC: { aa: 'Cys', name: 'Cystéine', type: 'polar' },
  UGA: { aa: 'STOP', name: 'Codon Stop (Opale)', type: 'stop' },
  UGG: { aa: 'Trp', name: 'Tryptophane', type: 'hydrophobic' },
  CGU: { aa: 'Arg', name: 'Arginine', type: 'basic' },
  CGC: { aa: 'Arg', name: 'Arginine', type: 'basic' },
  CGA: { aa: 'Arg', name: 'Arginine', type: 'basic' },
  CGG: { aa: 'Arg', name: 'Arginine', type: 'basic' },
  AGU: { aa: 'Ser', name: 'Sérine', type: 'polar' },
  AGC: { aa: 'Ser', name: 'Sérine', type: 'polar' },
  AGA: { aa: 'Arg', name: 'Arginine', type: 'basic' },
  AGG: { aa: 'Arg', name: 'Arginine', type: 'basic' },
  GGU: { aa: 'Gly', name: 'Glycine', type: 'special' },
  GGC: { aa: 'Gly', name: 'Glycine', type: 'special' },
  GGA: { aa: 'Gly', name: 'Glycine', type: 'special' },
  GGG: { aa: 'Gly', name: 'Glycine', type: 'special' },
};

export const BIOLOGY_NAVIGATION_SECTIONS = [
  {
    group: "Vue d'ensemble",
    items: [
      {
        id: 'dashboard',
        name: 'Tableau de Bord',
        shortName: 'Dashboard',
        icon: LayoutDashboard,
        badge: 'Hub',
        badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
        description: 'Synthèse des 6 laboratoires et sélection rapide',
      },
    ],
  },
  {
    group: 'Fondamentaux (L1-L2)',
    items: [
      {
        id: 'cell_mitosis',
        name: 'Biologie Cellulaire & Mitose',
        shortName: 'Cellule & Mitose',
        icon: Layers,
        badge: 'L1-L2',
        badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
        description: 'Cycle cellulaire, index mitotique & inhibition colchicine',
      },
      {
        id: 'enzymology',
        name: 'Cinétique Enzymatique',
        shortName: 'Michaelis-Menten',
        icon: Activity,
        badge: 'L1-L2',
        badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
        description: 'v = (Vmax·[S])/(Km+[S]) & Lineweaver-Burk',
      },
      {
        id: 'bacterial_growth',
        name: 'Croissance Bactérienne',
        shortName: 'Microbiologie',
        icon: Sparkles,
        badge: 'L1-L2',
        badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
        description: 'Temps de doublement G, cinétique Monod & DO 600nm',
      },
    ],
  },
  {
    group: 'Avancé (L3-Master)',
    items: [
      {
        id: 'molecular_genetics',
        name: 'Génétique Moléculaire',
        shortName: 'Transcription ADN',
        icon: Dna,
        badge: 'L3-M2',
        badgeColor: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
        description: 'Transcription ARNm, décodage codons & mutations in silico',
      },
      {
        id: 'immunology',
        name: 'Immunologie & ELISA',
        shortName: 'Réponse Anticorps',
        icon: ShieldAlert,
        badge: 'L3-M2',
        badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
        description: 'Cinétique IgM vs IgG, effet booster & spectrophotométrie',
      },
      {
        id: 'ecology_lotka_volterra',
        name: 'Écologie & Proie-Prédateur',
        shortName: 'Lotka-Volterra',
        icon: Compass,
        badge: 'L3-M2',
        badgeColor: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
        description: 'Système différentiel couplé lièvre/lynx & espace des phases',
      },
    ],
  },
  {
    group: 'Évaluation & Concours',
    items: [
      {
        id: 'exam_trainer',
        name: 'Mode Quiz & Examens',
        shortName: 'Quiz & Examens',
        icon: GraduationCap,
        badge: 'Interactif',
        badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
        description: 'Problèmes types L1 à Master, validation immédiate & corrigés détaillés',
      },
    ],
  },
];

