/**
 * CampusHub - Données et Constantes Fondamentales de Chimie
 * Standard NIST, UICPA (IUPAC) & Valeurs Thermo/Cinétique/Redox
 */

export const ATOMIC_WEIGHTS = {
  H: 1.008,
  He: 4.003,
  Li: 6.941,
  Be: 9.012,
  B: 10.811,
  C: 12.011,
  N: 14.007,
  O: 15.999,
  F: 18.998,
  Ne: 20.180,
  Na: 22.990,
  Mg: 24.305,
  Al: 26.982,
  Si: 28.085,
  P: 30.974,
  S: 32.065,
  Cl: 35.453,
  Ar: 39.948,
  K: 39.098,
  Ca: 40.078,
  Sc: 44.956,
  Ti: 47.867,
  V: 50.942,
  Cr: 51.996,
  Mn: 54.938,
  Fe: 55.845,
  Co: 58.933,
  Ni: 58.693,
  Cu: 63.546,
  Zn: 65.380,
  Ga: 69.723,
  Ge: 72.630,
  As: 74.922,
  Se: 78.960,
  Br: 79.904,
  Kr: 83.798,
  Rb: 85.468,
  Sr: 87.620,
  Y: 88.906,
  Zr: 91.224,
  Ag: 107.868,
  Cd: 112.411,
  Sn: 118.710,
  Sb: 121.760,
  I: 126.904,
  Ba: 137.327,
  Pt: 195.084,
  Au: 196.967,
  Hg: 200.592,
  Pb: 207.200,
  Bi: 208.980,
  U: 238.029,
};

// Solutés courants pour le laboratoire de préparation
export const COMMON_SOLUTES = [
  { id: 'nacl', name: 'Chlorure de Sodium', formula: 'NaCl', molarMass: 58.44, color: '#38bdf8', category: 'Sel minéral' },
  { id: 'cuso4', name: 'Sulfate de Cuivre (II) pentahydraté', formula: 'CuSO4·5H2O', molarMass: 249.68, color: '#0284c7', category: 'Sel hydraté' },
  { id: 'glucose', name: 'D-Glucose', formula: 'C6H12O6', molarMass: 180.16, color: '#f59e0b', category: 'Glucide' },
  { id: 'naoh', name: 'Hydroxyde de Sodium', formula: 'NaOH', molarMass: 40.00, color: '#a855f7', category: 'Base forte' },
  { id: 'kmno4', name: 'Permanganate de Potassium', formula: 'KMnO4', molarMass: 158.03, color: '#9333ea', category: 'Oxydant fort' },
  { id: 'hcl', name: 'Acide Chlorhydrique', formula: 'HCl', molarMass: 36.46, color: '#ef4444', category: 'Acide fort' },
  { id: 'h2so4', name: 'Acide Sulfurique', formula: 'H2SO4', molarMass: 98.08, color: '#f97316', category: 'Diacide fort' },
  { id: 'c2h5oh', name: 'Éthanol', formula: 'C2H5OH', molarMass: 46.07, color: '#10b981', category: 'Solvant polaire' },
  { id: 'trishcl', name: 'Tris-HCl (Tampon Biologique)', formula: 'C4H11NO3·HCl', molarMass: 157.60, color: '#6366f1', category: 'Tampon bio' },
  { id: 'c12h22o11', name: 'Saccharose', formula: 'C12H22O11', molarMass: 342.30, color: '#eab308', category: 'Glucide' },
];

// Presets d'équations chimiques avec coefficients équilibrés et description pédagogique
export const PRESET_EQUATIONS = [
  {
    id: 'ch4_combustion',
    name: 'Combustion complète du méthane',
    type: 'Combustion',
    reactants: [
      { formula: 'CH4', name: 'Méthane', coeff: 1, state: 'g' },
      { formula: 'O2', name: 'Dioxygène', coeff: 2, state: 'g' },
    ],
    products: [
      { formula: 'CO2', name: 'Dioxyde de carbone', coeff: 1, state: 'g' },
      { formula: 'H2O', name: 'Eau', coeff: 2, state: 'g' },
    ],
    deltaH: -890.3,
  },
  {
    id: 'h2_synthesis',
    name: 'Synthèse de l\'eau liquide',
    type: 'Synthèse exothermique',
    reactants: [
      { formula: 'H2', name: 'Dihydrogène', coeff: 2, state: 'g' },
      { formula: 'O2', name: 'Dioxygène', coeff: 1, state: 'g' },
    ],
    products: [
      { formula: 'H2O', name: 'Eau', coeff: 2, state: 'l' },
    ],
    deltaH: -571.6,
  },
  {
    id: 'c3h8_combustion',
    name: 'Combustion du propane',
    type: 'Combustion hydrocarbure',
    reactants: [
      { formula: 'C3H8', name: 'Propane', coeff: 1, state: 'g' },
      { formula: 'O2', name: 'Dioxygène', coeff: 5, state: 'g' },
    ],
    products: [
      { formula: 'CO2', name: 'Dioxyde de carbone', coeff: 3, state: 'g' },
      { formula: 'H2O', name: 'Eau', coeff: 4, state: 'g' },
    ],
    deltaH: -2220.0,
  },
  {
    id: 'ammonia_haber',
    name: 'Synthèse de l\'ammoniac (Haber-Bosch)',
    type: 'Équilibre catalysé',
    reactants: [
      { formula: 'N2', name: 'Diazote', coeff: 1, state: 'g' },
      { formula: 'H2', name: 'Dihydrogène', coeff: 3, state: 'g' },
    ],
    products: [
      { formula: 'NH3', name: 'Ammoniac', coeff: 2, state: 'g' },
    ],
    deltaH: -92.4,
  },
  {
    id: 'al_hcl',
    name: 'Attaque acide de l\'aluminium',
    type: 'Oxydoréduction & dégagement gazeux',
    reactants: [
      { formula: 'Al', name: 'Aluminium', coeff: 2, state: 's' },
      { formula: 'HCl', name: 'Acide chlorhydrique', coeff: 6, state: 'aq' },
    ],
    products: [
      { formula: 'AlCl3', name: 'Chlorure d\'aluminium', coeff: 2, state: 'aq' },
      { formula: 'H2', name: 'Dihydrogène', coeff: 3, state: 'g' },
    ],
    deltaH: -1004.0,
  },
  {
    id: 'fe_o2',
    name: 'Oxydation du fer (Formation de la rouille)',
    type: 'Corrosion',
    reactants: [
      { formula: 'Fe', name: 'Fer métal', coeff: 4, state: 's' },
      { formula: 'O2', name: 'Dioxygène', coeff: 3, state: 'g' },
    ],
    products: [
      { formula: 'Fe2O3', name: 'Oxyde de fer (III)', coeff: 2, state: 's' },
    ],
    deltaH: -1648.4,
  },
];

// Couples et systèmes Acido-Basiques
export const ACID_BASE_SYSTEMS = [
  {
    id: 'hcl',
    name: 'Acide chlorhydrique (HCl)',
    type: 'strong_acid',
    pKa: -6.3,
    formulaAcid: 'HCl',
    formulaBase: 'Cl⁻',
    description: 'Acide fort, dissociation totale en H3O+ et Cl-.',
  },
  {
    id: 'acetic',
    name: 'Acide acétique / Acétate',
    type: 'weak_acid',
    pKa: 4.76,
    formulaAcid: 'CH3COOH',
    formulaBase: 'CH3COO⁻',
    description: 'Acide carboxylique classique des fermentations et solutions tampons.',
  },
  {
    id: 'formic',
    name: 'Acide formique / Formiate',
    type: 'weak_acid',
    pKa: 3.75,
    formulaAcid: 'HCOOH',
    formulaBase: 'HCOO⁻',
    description: 'Acide méthanoïque simple, modérément dissocié.',
  },
  {
    id: 'carbonic',
    name: 'Système Bicarbonate / Dioxyde de carbone',
    type: 'buffer',
    pKa: 6.35,
    formulaAcid: 'H2CO3 (aq)',
    formulaBase: 'HCO3⁻',
    description: 'Tampon physiologique majeur du sang et des eaux naturelles.',
  },
  {
    id: 'phosphate',
    name: 'Tampon Phosphate Dihydrogène',
    type: 'buffer',
    pKa: 7.20,
    formulaAcid: 'H2PO4⁻',
    formulaBase: 'HPO4²⁻',
    description: 'Tampon intracellulaire standard (PBS en biologie moléculaire).',
  },
  {
    id: 'ammonium',
    name: 'Ammonium / Ammoniac',
    type: 'weak_base',
    pKa: 9.25,
    formulaAcid: 'NH4⁺',
    formulaBase: 'NH3',
    description: 'Base faible courante, équilibre avec l\'ion ammonium.',
  },
  {
    id: 'naoh',
    name: 'Soude caustique (NaOH)',
    type: 'strong_base',
    pKa: 14.8,
    formulaAcid: 'H2O',
    formulaBase: 'OH⁻',
    description: 'Base forte, libération quantitative d\'ions hydroxydes.',
  },
];

// Réactions pour l'étude Thermodynamique (ΔH, ΔS, ΔG)
export const THERMODYNAMIC_REACTIONS = [
  {
    id: 'haber',
    name: 'Synthèse de l\'ammoniac (Haber-Bosch)',
    equation: 'N₂(g) + 3 H₂(g) ⇌ 2 NH₃(g)',
    deltaH: -92.4, // kJ/mol
    deltaS: -198.2, // J/(mol·K)
    context: 'Exothermique avec diminution d\'entropie. Spontanée uniquement à basse/moyenne température (compromis cinétique requis à 450°C avec catalyseur au fer).',
    category: 'Industriel',
  },
  {
    id: 'caco3',
    name: 'Décomposition thermique du calcaire (Calcination)',
    equation: 'CaCO₃(s) ⇌ CaO(s) + CO₂(g)',
    deltaH: 178.3, // kJ/mol
    deltaS: 160.5, // J/(mol·K)
    context: 'Endothermique avec augmentation forte d\'entropie due au dégagement gazeux. Devient spontanée à haute température (> 837 °C).',
    category: 'Cimenterie & Minéral',
  },
  {
    id: 'water_vap',
    name: 'Vaporisation de l\'eau liquide',
    equation: 'H₂O(l) ⇌ H₂O(g)',
    deltaH: 44.01, // kJ/mol à 298K
    deltaS: 118.8, // J/(mol·K)
    context: 'Changement d\'état liquide-vapeur. Équilibre d\'ébullition spontané au-dessus de 100 °C (373.15 K) sous 1 atm.',
    category: 'Transition de phase',
  },
  {
    id: 'combustion_methane',
    name: 'Combustion du méthane',
    equation: 'CH₄(g) + 2 O₂(g) → CO₂(g) + 2 H₂O(g)',
    deltaH: -802.3, // kJ/mol
    deltaS: -5.2, // J/(mol·K)
    context: 'Très exothermique avec entropie presque neutre. Largement spontanée à toute température pratique.',
    category: 'Énergétique',
  },
  {
    id: 'no_synthesis',
    name: 'Synthèse du monoxyde d\'azote',
    equation: 'N₂(g) + O₂(g) ⇌ 2 NO(g)',
    deltaH: 180.5, // kJ/mol
    deltaS: 24.8, // J/(mol·K)
    context: 'Endothermique avec légère augmentation d\'entropie. Spontanée seulement à très haute température (éclairs ou moteurs thermiques).',
    category: 'Atmosphérique',
  },
];

// Presets de Cinétique Chimique
export const KINETIC_PRESETS = [
  {
    id: 'decomp_h2o2',
    name: 'Dissémination du Peroxyde d\'Hydrogène (Ordre 1)',
    equation: '2 H₂O₂(aq) → 2 H₂O(l) + O₂(g)',
    order: 1,
    defaultA0: 0.8, // mol/L
    defaultK: 0.035, // s^-1
    unitK: 's⁻¹',
    ea: 75.3, // kJ/mol
    catalystEa: 56.5, // kJ/mol (avec ions Fe3+ ou catalase)
    description: 'Cinétique d\'ordre 1 classique. Demi-vie constante t½ = ln(2)/k indépendante de la concentration initiale.',
  },
  {
    id: 'ester_hydrolysis',
    name: 'Saponification de l\'Acétate d\'Éthyle (Ordre 2)',
    equation: 'CH₃COOC₂H₅ + OH⁻ → CH₃COO⁻ + C₂H₅OH',
    order: 2,
    defaultA0: 0.5, // mol/L
    defaultK: 0.11, // L/(mol·s)
    unitK: 'L·mol⁻¹·s⁻¹',
    ea: 47.8, // kJ/mol
    catalystEa: 35.0,
    description: 'Cinétique d\'ordre 2 globale. La demi-vie augmente inversement à la concentration initiale : t½ = 1 / (k·[A]₀).',
  },
  {
    id: 'nh3_tungsten',
    name: 'Décomposition du N₂O ou NH₃ sur surface saturée (Ordre 0)',
    equation: '2 NH₃(g) → N₂(g) + 3 H₂(g) (sur catalyseur W)',
    order: 0,
    defaultA0: 1.0, // mol/L
    defaultK: 0.04, // mol/(L·s)
    unitK: 'mol·L⁻¹·s⁻¹',
    ea: 163.0, // kJ/mol
    catalystEa: 110.0,
    description: 'Cinétique d\'ordre 0 par saturation des sites actifs du catalyseur solide. Vitesse constante indépendante de [A].',
  },
];

// Couples d'oxydoréduction standards (IUPAC à 25 °C, 1 atm, pH = 0)
export const REDOX_COUPLES = [
  { id: 'f2_f', name: 'Fluor / Fluorure', formula: 'F₂ / F⁻', e0: 2.87, n: 2, ox: 'F₂', red: '2 F⁻', cat: 'Oxydant surpuissant' },
  { id: 'au_au', name: 'Or (III) / Or', formula: 'Au³⁺ / Au', e0: 1.50, n: 3, ox: 'Au³⁺', red: 'Au', cat: 'Métal noble' },
  { id: 'cl2_cl', name: 'Chlore / Chlorure', formula: 'Cl₂ / 2Cl⁻', e0: 1.36, n: 2, ox: 'Cl₂', red: '2 Cl⁻', cat: 'Halogène' },
  { id: 'o2_h2o', name: 'Oxygène / Eau', formula: 'O₂ + 4H⁺ / 2H₂O', e0: 1.23, n: 4, ox: 'O₂', red: 'H₂O', cat: 'Respiration/Combustion' },
  { id: 'ag_ag', name: 'Argent / Argent métal', formula: 'Ag⁺ / Ag', e0: 0.80, n: 1, ox: 'Ag⁺', red: 'Ag', cat: 'Métal précieux' },
  { id: 'fe3_fe2', name: 'Fer (III) / Fer (II)', formula: 'Fe³⁺ / Fe²⁺', e0: 0.77, n: 1, ox: 'Fe³⁺', red: 'Fe²⁺', cat: 'Transition' },
  { id: 'i2_i', name: 'Iode / Iodure', formula: 'I₂ / 2I⁻', e0: 0.54, n: 2, ox: 'I₂', red: '2 I⁻', cat: 'Halogène doux' },
  { id: 'cu_cu', name: 'Cuivre (II) / Cuivre', formula: 'Cu²⁺ / Cu', e0: 0.34, n: 2, ox: 'Cu²⁺', red: 'Cu', cat: 'Transition classique' },
  { id: 'h_h2', name: 'Électrode Normale à Hydrogène (ENH)', formula: '2H⁺ / H₂', e0: 0.00, n: 2, ox: '2 H⁺', red: 'H₂', cat: 'Référence Universelle' },
  { id: 'pb_pb', name: 'Plomb (II) / Plomb', formula: 'Pb²⁺ / Pb', e0: -0.13, n: 2, ox: 'Pb²⁺', red: 'Pb', cat: 'Métal lourd' },
  { id: 'sn_sn', name: 'Étain (II) / Étain', formula: 'Sn²⁺ / Sn', e0: -0.14, n: 2, ox: 'Sn²⁺', red: 'Sn', cat: 'Métal pauvre' },
  { id: 'ni_ni', name: 'Nickel (II) / Nickel', formula: 'Ni²⁺ / Ni', e0: -0.26, n: 2, ox: 'Ni²⁺', red: 'Ni', cat: 'Transition' },
  { id: 'fe_fe', name: 'Fer (II) / Fer', formula: 'Fe²⁺ / Fe', e0: -0.44, n: 2, ox: 'Fe²⁺', red: 'Fe', cat: 'Transition' },
  { id: 'zn_zn', name: 'Zinc (II) / Zinc', formula: 'Zn²⁺ / Zn', e0: -0.76, n: 2, ox: 'Zn²⁺', red: 'Zn', cat: 'Anode classique (Daniell)' },
  { id: 'al_al', name: 'Aluminium (III) / Aluminium', formula: 'Al³⁺ / Al', e0: -1.66, n: 3, ox: 'Al³⁺', red: 'Al', cat: 'Réducteur fort' },
  { id: 'mg_mg', name: 'Magnésium (II) / Magnésium', formula: 'Mg²⁺ / Mg', e0: -2.37, n: 2, ox: 'Mg²⁺', red: 'Mg', cat: 'Alcalino-terreux' },
  { id: 'na_na', name: 'Sodium (I) / Sodium', formula: 'Na⁺ / Na', e0: -2.71, n: 1, ox: 'Na⁺', red: 'Na', cat: 'Alcalin réactif' },
  { id: 'li_li', name: 'Lithium (I) / Lithium', formula: 'Li⁺ / Li', e0: -3.04, n: 1, ox: 'Li⁺', red: 'Li', cat: 'Batterie Li-ion' },
];

/**
 * Analyseur de formule brute moléculaire (ex: C6H12O6, Ca(OH)2, Fe2(SO4)3)
 * Retourne la masse molaire et la composition élémentaire
 */
export function parseChemicalFormula(formulaStr) {
  if (!formulaStr || typeof formulaStr !== 'string') return null;
  const clean = formulaStr.trim().replace(/\s+/g, '');
  if (!clean) return null;

  // Gère les hydrates comme CuSO4·5H2O ou CuSO4.5H2O
  if (clean.includes('·') || (clean.includes('.') && /[A-Z]/.test(clean.split('.')[1] || ''))) {
    const parts = clean.split(/[·.]/);
    const mainPart = parts[0];
    const hydratePart = parts[1] || '';
    const hydrateMatch = hydratePart.match(/^(\d*)(.*)$/);
    const hydrateCoeff = hydrateMatch && hydrateMatch[1] ? parseInt(hydrateMatch[1], 10) : 1;
    const hydrateSub = hydrateMatch ? hydrateMatch[2] : hydratePart;

    const mainRes = parseSimpleFormula(mainPart);
    const subRes = parseSimpleFormula(hydrateSub);
    if (!mainRes || !subRes) return null;

    const mergedCounts = { ...mainRes.counts };
    Object.entries(subRes.counts).forEach(([elem, count]) => {
      mergedCounts[elem] = (mergedCounts[elem] || 0) + count * hydrateCoeff;
    });

    let totalMolarMass = 0;
    const composition = [];
    Object.entries(mergedCounts).forEach(([elem, count]) => {
      const weight = ATOMIC_WEIGHTS[elem] || 0;
      totalMolarMass += weight * count;
    });

    Object.entries(mergedCounts).forEach(([elem, count]) => {
      const weight = ATOMIC_WEIGHTS[elem] || 0;
      const partMass = weight * count;
      composition.push({
        element: elem,
        count,
        mass: partMass,
        percent: totalMolarMass > 0 ? (partMass / totalMolarMass) * 100 : 0,
      });
    });

    return {
      formula: formulaStr,
      molarMass: Number(totalMolarMass.toFixed(3)),
      counts: mergedCounts,
      composition: composition.sort((a, b) => b.mass - a.mass),
    };
  }

  return parseSimpleFormula(clean);
}

function parseSimpleFormula(str) {
  // Parsing avec gestion des parenthèses imbriquées
  const stack = [{}];
  let i = 0;

  while (i < str.length) {
    const ch = str[i];

    if (ch === '(' || ch === '[') {
      stack.push({});
      i++;
    } else if (ch === ')' || ch === ']') {
      i++;
      let multStr = '';
      while (i < str.length && /\d/.test(str[i])) {
        multStr += str[i];
        i++;
      }
      const mult = multStr ? parseInt(multStr, 10) : 1;
      const popped = stack.pop() || {};
      const current = stack[stack.length - 1];
      Object.entries(popped).forEach(([elem, count]) => {
        current[elem] = (current[elem] || 0) + count * mult;
      });
    } else if (/[A-Z]/.test(ch)) {
      let elem = ch;
      i++;
      if (i < str.length && /[a-z]/.test(str[i])) {
        elem += str[i];
        i++;
      }
      let countStr = '';
      while (i < str.length && /\d/.test(str[i])) {
        countStr += str[i];
        i++;
      }
      const count = countStr ? parseInt(countStr, 10) : 1;
      const current = stack[stack.length - 1];
      current[elem] = (current[elem] || 0) + count;
    } else {
      // Caractère non reconnu ou chiffre orphelin
      i++;
    }
  }

  const counts = stack[0] || {};
  let totalMolarMass = 0;
  const composition = [];

  const elements = Object.keys(counts);
  if (elements.length === 0) return null;

  for (const elem of elements) {
    const atomicMass = ATOMIC_WEIGHTS[elem];
    if (atomicMass === undefined) {
      // Élément inconnu dans notre table
      return null;
    }
    totalMolarMass += atomicMass * counts[elem];
  }

  elements.forEach((elem) => {
    const atomicMass = ATOMIC_WEIGHTS[elem];
    const partMass = atomicMass * counts[elem];
    composition.push({
      element: elem,
      count: counts[elem],
      mass: partMass,
      percent: totalMolarMass > 0 ? (partMass / totalMolarMass) * 100 : 0,
    });
  });

  return {
    formula: str,
    molarMass: Number(totalMolarMass.toFixed(3)),
    counts,
    composition: composition.sort((a, b) => b.mass - a.mass),
  };
}
