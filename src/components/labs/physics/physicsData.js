/**
 * CampusHub - PhysicsLab Hub Academic Dataset & Physics Constants
 * Filière Physique : L1 à Master 2
 * Données, équations fondamentales, modules et constantes physiques internationales
 */

export const PHYSICAL_CONSTANTS = {
  c: 299792458, // Vitesse de la lumière dans le vide (m/s)
  h: 6.62607015e-34, // Constante de Planck (J·s)
  hbar: 1.054571817e-34, // Constante de Planck réduite (J·s)
  e: 1.602176634e-19, // Charge élémentaire (C)
  me: 9.1093837e-31, // Masse de l'électron au repos (kg)
  mp: 1.67262192e-27, // Masse du proton (kg)
  eps0: 8.8541878128e-12, // Permittivité du vide (F/m)
  mu0: 1.25663706212e-6, // Perméabilité du vide (H/m = 4π * 10^-7)
  g_earth: 9.80665, // Gravité terrestre standard (m/s²)
  R_gas: 8.314462618, // Constante universelle des gaz parfaits (J/(mol·K))
  kB: 1.380649e-23, // Constante de Boltzmann (J/K)
};

export const ACADEMIC_SECTIONS = {
  fondamentaux: {
    id: 'fondamentaux',
    label: 'Fondamentaux (L1 - L2)',
    shortLabel: 'L1-L2',
    description: 'Bases axiomatiques de la mécanique classique, électronique harmonique et optique ondulatoire.',
    badgeClass: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  },
  avance: {
    id: 'avance',
    label: 'Avancé (L3 - Master)',
    shortLabel: 'L3-M2',
    description: 'Physique statistique, électrodynamique classique et mécanique quantique ondulatoire.',
    badgeClass: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
  },
};

export const PHYSICS_MODULES = [
  // --- FONDAMENTAUX (L1 - L2) ---
  {
    id: 'mechanics',
    sectionId: 'fondamentaux',
    code: 'PHY101',
    levelLabel: 'L1 · Fondamentaux',
    title: 'Mécanique du Point & Balistique',
    shortTitle: 'Mécanique du Point',
    formula: 'F = m · a',
    expandedFormula: 'm · d²r/dt² = ∑ F_ext = P + F_frott',
    keyLaw: '2nde Loi de Newton & Conservation de l\'Énergie Mécanique',
    description:
      'Étude de la trajectoire parabolique d\'un projectile sous gravité planétaire avec ou sans résistance de l\'air. Calcul instantané de la portée, flèche maximale, temps de vol et bilan cinétique.',
    iconName: 'Compass',
    accentColor: 'indigo',
    borderColor: 'hover:border-indigo-500/40',
    tags: ['Balistique', 'Cinématique', 'Énergie Mécanique', 'Champs de Pesanteur'],
    learningOutcomes: [
      'Résolution analytique des équations différentielles du mouvement',
      'Détermination de l\'angle optimal de tir selon la dénivellation initiale',
      'Théorème de l\'énergie mécanique et transfert cinétique/potentiel',
    ],
    defaultParams: {
      mass: 1.5, // kg
      v0: 25, // m/s
      angle: 45, // degrés
      h0: 0, // mètres
      gravity: 9.81, // m/s²
      airFriction: 0, // kg/s
    },
    presets: [
      { name: 'Tir Standard (Terre)', mass: 1.0, v0: 30, angle: 45, h0: 0, gravity: 9.81, airFriction: 0 },
      { name: 'Expérience Lunaire', mass: 1.0, v0: 30, angle: 45, h0: 0, gravity: 1.62, airFriction: 0 },
      { name: 'Tir Martien avec Falaise', mass: 2.0, v0: 35, angle: 40, h0: 15, gravity: 3.71, airFriction: 0 },
      { name: 'Amortissement Aérodynamique', mass: 0.5, v0: 40, angle: 50, h0: 0, gravity: 9.81, airFriction: 0.08 },
    ],
  },
  {
    id: 'rlc',
    sectionId: 'fondamentaux',
    code: 'PHY102',
    levelLabel: 'L1-L2 · Fondamentaux',
    title: 'Circuits RLC & Résonance',
    shortTitle: 'Circuits RLC',
    formula: 'f₀ = 1 / (2π√(LC))',
    expandedFormula: 'L · d²q/dt² + R · dq/dt + q/C = e(t)',
    keyLaw: 'Lois de Kirchhoff & Oscillateur Harmonique Amorti',
    description:
      'Oscillateur électrique du 2nd ordre sous excitation sinusoïdale. Analyse du régime pseudo-périodique, pulsation propre, facteur de surtension Q et courbe de résonance en amplitude.',
    iconName: 'Activity',
    accentColor: 'violet',
    borderColor: 'hover:border-violet-500/40',
    tags: ['Électrocinétique', 'Facteur Q', 'Bande Passante', 'Bode'],
    learningOutcomes: [
      'Établissement du régime forcé et calcul de l\'impédance complexe',
      'Visualisation du phénomène de résonance d\'intensité et de surtension',
      'Mesure du déphasage tension/courant via l\'ellipse de Lissajous',
    ],
    defaultParams: {
      resistance: 40, // Ohms
      inductance: 0.1, // Henry
      capacitance: 10, // µF
      frequency: 159, // Hz (proche de f0)
      vPeak: 10, // Volts
    },
    presets: [
      { name: 'Résonance Aiguë (Fort Q)', resistance: 10, inductance: 0.25, capacitance: 5, frequency: 142.3, vPeak: 10 },
      { name: 'Régime Critique', resistance: 200, inductance: 0.1, capacitance: 10, frequency: 159.1, vPeak: 12 },
      { name: 'Filtre Passe-Bande Audio', resistance: 68, inductance: 0.05, capacitance: 22, frequency: 151.7, vPeak: 5 },
    ],
  },
  {
    id: 'optics',
    sectionId: 'fondamentaux',
    code: 'PHY201',
    levelLabel: 'L2 · Fondamentaux',
    title: 'Optique Géométrique & Réfraction',
    shortTitle: 'Optique Géométrique',
    formula: 'n₁ · sin(θ₁) = n₂ · sin(θ₂)',
    expandedFormula: 'θ_c = arcsin(n₂ / n₁),  R_Fresnel = |(n₁ cosθ₁ - n₂ cosθ₂) / (n₁ cosθ₁ + n₂ cosθ₂)|²',
    keyLaw: 'Lois de Snell-Descartes & Principe de Fermat',
    description:
      'Propagation dioptrique de la lumière, angle critique de réflexion totale interne et déviation spectrale selon la longueur d\'onde incidente (dispersion chromatique).',
    iconName: 'Atom',
    accentColor: 'indigo',
    borderColor: 'hover:border-indigo-500/40',
    tags: ['Réfraction', 'Réflexion Totale', 'Fibre Optique', 'Fresnel'],
    learningOutcomes: [
      'Validation de la conservation de l\'impulsion tangentielle du photon',
      'Condition d\'existence de l\'angle limite de réfraction',
      'Application industrielle aux fibres optiques et prismes dispersifs',
    ],
    defaultParams: {
      n1: 1.0, // Air
      n2: 1.5, // Verre Crown
      theta1: 30, // Degrés
      wavelength: 589, // nm (Raie jaune du Sodium)
    },
    presets: [
      { name: 'Air → Verre Crown', n1: 1.0, n2: 1.5, theta1: 30, wavelength: 589 },
      { name: 'Eau → Air (Angle Limite)', n1: 1.33, n2: 1.0, theta1: 48.7, wavelength: 532 },
      { name: 'Fibre Cœur Verre → Gaine', n1: 1.62, n2: 1.48, theta1: 72, wavelength: 650 },
      { name: 'Diamant → Air', n1: 2.42, n2: 1.0, theta1: 22, wavelength: 450 },
    ],
  },

  // --- AVANCÉ (L3 - MASTER) ---
  {
    id: 'electromagnetism',
    sectionId: 'avance',
    code: 'PHY301',
    levelLabel: 'L3 · Avancé',
    title: 'Électromagnétisme & Ondes de Maxwell',
    shortTitle: 'Électromagnétisme',
    formula: '∇ × E = -∂B/∂t',
    expandedFormula: '∇ · E = ρ/ε,   ∇ · B = 0,   ∇ × B = μ₀(J + ε₀ ∂E/∂t)',
    keyLaw: 'Équations de Maxwell & Propagation d\'Onde Transverse',
    description:
      'Propagation d\'une onde électromagnétique plane progressive monochromatique (OPPM). Calcul du vecteur de Poynting, de l\'impédance d\'onde, de l\'effet de peau et de la vitesse de phase.',
    iconName: 'Zap',
    accentColor: 'violet',
    borderColor: 'hover:border-violet-500/40',
    tags: ['Maxwell', 'Vecteur de Poynting', 'Effet de Peau', 'Impédance d\'Onde'],
    learningOutcomes: [
      'Structure spatio-temporelle du trièdre orthogonal (E, B, k)',
      'Bilan d\'énergie électromagnétique et théorème de Poynting',
      'Atténuation dans un milieu conducteur ohmique',
    ],
    defaultParams: {
      frequencyMhz: 100, // 100 MHz
      er: 1.0, // Permittivité relative (vide)
      ur: 1.0, // Perméabilité relative (vide)
      sigma: 0.0, // Conductivité (S/m)
      e0Amplitude: 120, // V/m
    },
    presets: [
      { name: 'Onde dans le Vide / Air', frequencyMhz: 100, er: 1.0, ur: 1.0, sigma: 0, e0Amplitude: 100 },
      { name: 'Diélectrique Téflon (HF)', frequencyMhz: 2400, er: 2.1, ur: 1.0, sigma: 0.0001, e0Amplitude: 80 },
      { name: 'Eau Déminéralisée (RF)', frequencyMhz: 433, er: 81.0, ur: 1.0, sigma: 0.005, e0Amplitude: 50 },
      { name: 'Cuivre & Effet de Peau', frequencyMhz: 1, er: 1.0, ur: 1.0, sigma: 5.8e7, e0Amplitude: 20 },
    ],
  },
  {
    id: 'thermodynamics',
    sectionId: 'avance',
    code: 'PHY302',
    levelLabel: 'L3-M1 · Avancé',
    title: 'Thermodynamique & Cycles Moteurs',
    shortTitle: 'Cycles Thermodynamiques',
    formula: 'η_Carnot = 1 - (T_F / T_C)',
    expandedFormula: 'W_net = ∮ P dV = Q_C + Q_F,   ΔS_univers ≥ 0',
    keyLaw: 'Second Principe de la Thermodynamique & Théorème de Carnot',
    description:
      'Simulation thermodynamique des cycles de Carnot, Beau de Rochas (Otto) et Stirling. Tracé du diagramme de Clapeyron (P-V), bilan du travail net fourni et création d\'entropie.',
    iconName: 'Flame',
    accentColor: 'indigo',
    borderColor: 'hover:border-indigo-500/40',
    tags: ['Cycle de Carnot', 'Moteur Otto', 'Diagramme P-V', 'Second Principe'],
    learningOutcomes: [
      'Calcul du rendement maximal théorique entre deux thermostats',
      'Optimisation du taux de compression adiabatique d\'un moteur thermique',
      'Intégration numérique du travail sur chemin fermé',
    ],
    defaultParams: {
      cycleType: 'carnot', // 'carnot' | 'otto' | 'stirling'
      tempHot: 650, // Kelvin
      tempCold: 295, // Kelvin
      compressionRatio: 9.5, // V1 / V2
      gamma: 1.4, // Cp / Cv (Air)
      moles: 0.05, // mol
      pInitialBar: 1.0, // bar
    },
    presets: [
      { name: 'Cycle de Carnot Idéal', cycleType: 'carnot', tempHot: 700, tempCold: 300, compressionRatio: 8, gamma: 1.4, moles: 0.05, pInitialBar: 1.0 },
      { name: 'Moteur Essence (Otto)', cycleType: 'otto', tempHot: 1200, tempCold: 320, compressionRatio: 10.5, gamma: 1.4, moles: 0.05, pInitialBar: 1.0 },
      { name: 'Moteur Stirling Écologique', cycleType: 'stirling', tempHot: 580, tempCold: 290, compressionRatio: 4.5, gamma: 1.4, moles: 0.05, pInitialBar: 1.0 },
    ],
  },
  {
    id: 'quantum',
    sectionId: 'avance',
    code: 'PHY401',
    levelLabel: 'M1-M2 · Avancé',
    title: 'Physique Quantique : Puits & Tunnel',
    shortTitle: 'Physique Quantique',
    formula: 'iℏ ∂ψ/∂t = Ĥ ψ',
    expandedFormula: 'E_n = (n² h²) / (8 m L²),   T_tunnel ≈ exp(-2 ∫ √(2m(V(x)-E))/ℏ dx)',
    keyLaw: 'Équation de Schrödinger & Quantification de l\'Énergie',
    description:
      'États stationnaires de particules confinées dans un puits de potentiel infini 1D et probabilité de transmission par effet tunnel à travers une barrière finie.',
    iconName: 'Layers',
    accentColor: 'violet',
    borderColor: 'hover:border-violet-500/40',
    tags: ['Schrödinger', 'Effet Tunnel', 'Densité de Probabilité', 'Confinement'],
    learningOutcomes: [
      'Normalisation et orthogonalité des fonctions d\'onde spatiales',
      'Origine de la quantification par conditions aux limites de Dirichlet',
      'Évaluation du coefficient de transmission exponentiel dans l\'approximation WKB',
    ],
    defaultParams: {
      wellType: 'box', // 'box' | 'tunnel'
      wellWidthNm: 1.0, // nm
      quantumLevel: 2, // n = 1, 2, 3, 4, 5
      energyEv: 1.5, // eV pour tunnel
      barrierHeightEv: 4.0, // V0 en eV pour tunnel
      particle: 'electron', // 'electron' | 'proton'
    },
    presets: [
      { name: 'Électron en Boîte Nanométrique (n=1)', wellType: 'box', wellWidthNm: 1.0, quantumLevel: 1, energyEv: 0.376, barrierHeightEv: 4.0, particle: 'electron' },
      { name: 'État Excité du Puits (n=3)', wellType: 'box', wellWidthNm: 0.8, quantumLevel: 3, energyEv: 5.2, barrierHeightEv: 8.0, particle: 'electron' },
      { name: 'Microscopie à Effet Tunnel (STM)', wellType: 'tunnel', wellWidthNm: 0.5, quantumLevel: 1, energyEv: 2.2, barrierHeightEv: 3.5, particle: 'electron' },
      { name: 'Barrière Infranchissable Proton', wellType: 'tunnel', wellWidthNm: 1.0, quantumLevel: 1, energyEv: 1.0, barrierHeightEv: 2.5, particle: 'proton' },
    ],
  },
];

/**
 * Convertit une longueur d'onde visible en code couleur CSS approximatif
 */
export function wavelengthToRGB(wavelength) {
  let r;
  let g;
  let b;
  const wl = Number(wavelength);

  if (wl >= 380 && wl < 440) {
    r = -(wl - 440) / (440 - 380);
    g = 0.0;
    b = 1.0;
  } else if (wl >= 440 && wl < 490) {
    r = 0.0;
    g = (wl - 440) / (490 - 440);
    b = 1.0;
  } else if (wl >= 490 && wl < 510) {
    r = 0.0;
    g = 1.0;
    b = -(wl - 510) / (510 - 490);
  } else if (wl >= 510 && wl < 580) {
    r = (wl - 510) / (580 - 510);
    g = 1.0;
    b = 0.0;
  } else if (wl >= 580 && wl < 645) {
    r = 1.0;
    g = -(wl - 645) / (645 - 580);
    b = 0.0;
  } else if (wl >= 645 && wl <= 780) {
    r = 1.0;
    g = 0.0;
    b = 0.0;
  } else {
    return 'rgb(147, 51, 234)'; // Violet fallback
  }

  // Facteur d'atténuation aux bords du spectre visible
  let factor = 1.0;
  if (wl >= 380 && wl < 420) {
    factor = 0.3 + (0.7 * (wl - 380)) / (420 - 380);
  } else if (wl >= 700 && wl <= 780) {
    factor = 0.3 + (0.7 * (780 - wl)) / (780 - 700);
  }

  const red = Math.round(255 * Math.pow(r * factor, 0.8));
  const green = Math.round(255 * Math.pow(g * factor, 0.8));
  const blue = Math.round(255 * Math.pow(b * factor, 0.8));

  return `rgb(${red}, ${green}, ${blue})`;
}
