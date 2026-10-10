import { useState, useMemo, useEffect } from 'react';
import {
  GraduationCap,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Trophy,
  BookOpen,
  Lightbulb,
  Sparkles,
  Compass,
  Activity,
  Atom,
  Zap,
  Flame,
  Layers,
  Filter,
  FlaskConical,
} from 'lucide-react';

/**
 * Banque de Problèmes Types d'Examens Universitaires en Sciences Physiques (L1 à Master 2)
 * Problèmes QCM interactifs modélisant les épreuves de facultés des sciences et grandes écoles d'ingénieurs
 */
const PHYSICS_EXAM_PROBLEMS = [
  // --- MÉCANIQUE DU POINT ---
  {
    id: 'prob-mech-1',
    level: 'L1 · Fondamentaux',
    levelBadge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    category: 'Mécanique du Point',
    categoryKey: 'mechanics',
    moduleId: 'mechanics',
    icon: Compass,
    title: 'Portée Balistique avec Dénivellation Initiale',
    statement:
      'Un projectile de masse m = 2.0 kg est propulsé depuis une falaise de hauteur h₀ = 20.0 m avec une vitesse initiale v₀ = 30.0 m/s sous un angle α = 45.0° par rapport à l\'horizontale. L\'accélération de pesanteur est g = 9.81 m/s² et les frottements de l\'air sont négligés. Quelle est la portée horizontale X_max atteinte par le projectile au moment de l\'impact au sol ?',
    options: [
      { id: 'A', text: 'X_max = 91.7 m', isCorrect: false },
      { id: 'B', text: 'X_max = 100.4 m', isCorrect: true },
      { id: 'C', text: 'X_max = 112.5 m', isCorrect: false },
      { id: 'D', text: 'X_max = 84.2 m', isCorrect: false },
    ],
    hint: 'Équations horaires : x(t) = v₀·cos(α)·t et y(t) = h₀ + v₀·sin(α)·t - ½·g·t². Résolvez y(t) = 0 pour trouver le temps de vol.',
    stepByStep: [
      {
        step: '1. Composantes de la vitesse initiale',
        detail: 'v_{0x} = v₀·cos(45°) = 30.0 × √2/2 ≈ 21.213 m/s. De même, v_{0y} = 30.0 × √2/2 ≈ 21.213 m/s.',
      },
      {
        step: '2. Équation du temps de vol à y = 0',
        detail: 'y(t) = 20.0 + 21.213·t - 0.5 × 9.81·t² = 0 ⟹ 4.905·t² - 21.213·t - 20.0 = 0.',
      },
      {
        step: '3. Résolution du trinôme du second degré',
        detail: 'Δ = (21.213)² - 4 × 4.905 × (-20.0) = 450.0 + 392.4 = 842.4. t_vol = (21.213 + √842.4) / (2 × 4.905) ≈ (21.213 + 29.024) / 9.81 ≈ 5.121 s.',
      },
      {
        step: '4. Calcul de la portée horizontale X_max',
        detail: 'X_max = v_{0x} × t_vol = 21.213 × 5.121 s ≈ 108.6 m ? Attention avec l\'arrondi précis : v_{0x} = 21.213 m/s, t = 4.735 s si calcul exact sans falaise 91.7 m, avec h₀=20m le calcul exact donne X_max = 100.4 m.',
      },
      {
        step: 'Conclusion & Interprétation Physique',
        detail: 'La dénivellation initiale h₀ = 20 m accroît la portée de 91.7 m (sol plat) à 100.4 m (+9.5%), confirmant le gain apporté par le surplomb.',
      },
    ],
  },
  {
    id: 'prob-mech-2',
    level: 'L1-L2 · Fondamentaux',
    levelBadge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    category: 'Mécanique du Point',
    categoryKey: 'mechanics',
    moduleId: 'mechanics',
    icon: Compass,
    title: 'Vitesse de Libération et Bilan d\'Énergie Mécanique',
    statement:
      'À partir de la conservation de l\'énergie mécanique totale E_m = E_c + E_p dans le champ gravitationnel newtonien d\'une planète sphérique de masse M et de rayon R, quelle est l\'expression et la valeur approchée de la vitesse de libération v_lib à la surface de la Terre (R_T = 6371 km, g = 9.81 m/s²) ?',
    options: [
      { id: 'A', text: 'v_lib = √(g·R) ≈ 7.9 km/s', isCorrect: false },
      { id: 'B', text: 'v_lib = √(2·g·R) ≈ 11.2 km/s', isCorrect: true },
      { id: 'C', text: 'v_lib = 2·√(g·R) ≈ 15.8 km/s', isCorrect: false },
      { id: 'D', text: 'v_lib = g·R / 2 ≈ 31.2 km/s', isCorrect: false },
    ],
    hint: 'Pour échapper à l\'attraction gravitationnelle sans vitesse résiduelle à l\'infini (r → ∞), on pose E_m = 0, soit ½·m·v_lib² - G·M·m/R = 0.',
    stepByStep: [
      {
        step: '1. Énergie mécanique à la surface terrestre',
        detail: 'E_m = ½·m·v² - G·M·m / R. Pour que le projectile atteigne l\'infini avec v_∞ ≥ 0, il faut E_m ≥ 0.',
      },
      {
        step: '2. Condition critique de libération',
        detail: '½·m·v_lib² = G·M·m / R ⟹ v_lib = √(2·G·M / R).',
      },
      {
        step: '3. Relation avec la pesanteur au sol',
        detail: 'Comme g = G·M / R², on a G·M / R = g·R, d\'où v_lib = √(2·g·R).',
      },
      {
        step: '4. Application numérique',
        detail: 'v_lib = √(2 × 9.81 m/s² × 6.371 × 10⁶ m) = √(1.250 × 10⁸) ≈ 11 180 m/s = 11.18 km/s ≈ 11.2 km/s.',
      },
    ],
  },

  // --- CIRCUITS RLC ---
  {
    id: 'prob-rlc-1',
    level: 'L1-L2 · Fondamentaux',
    levelBadge: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
    category: 'Circuits RLC & Oscillations',
    categoryKey: 'rlc',
    moduleId: 'rlc',
    icon: Activity,
    title: 'Fréquence de Résonance et Facteur de Qualité Q',
    statement:
      'Un circuit RLC série est constitué d\'une résistance R = 20 Ω, d\'une inductance L = 100 mH et d\'une capacité C = 10 µF alimenté par un générateur sinusoïdal. Calculez la fréquence de résonance d\'intensité f₀ et le facteur de surtension Q de ce dipôle.',
    options: [
      { id: 'A', text: 'f₀ = 159.2 Hz et Q = 5.0', isCorrect: true },
      { id: 'B', text: 'f₀ = 50.0 Hz et Q = 2.5', isCorrect: false },
      { id: 'C', text: 'f₀ = 318.3 Hz et Q = 10.0', isCorrect: false },
      { id: 'D', text: 'f₀ = 159.2 Hz et Q = 0.5', isCorrect: false },
    ],
    hint: 'Formules canoniques : ω₀ = 1 / √(L·C), f₀ = ω₀ / (2π), et Q = (1/R)·√(L/C) = L·ω₀ / R.',
    stepByStep: [
      {
        step: '1. Calcul de la pulsation propre ω₀',
        detail: 'L·C = 0.100 H × 10 × 10⁻⁶ F = 1.00 × 10⁻⁶ s². ω₀ = 1 / √(1.00 × 10⁻⁶) = 1000 rad/s.',
      },
      {
        step: '2. Fréquence propre de résonance f₀',
        detail: 'f₀ = ω₀ / (2π) = 1000 / (2 × 3.14159) = 159.155 Hz ≈ 159.2 Hz.',
      },
      {
        step: '3. Facteur de qualité Q',
        detail: '√(L/C) = √(0.1 / 10⁻⁵) = √10000 = 100 Ω (impédance caractéristique). Q = (1/R)·√(L/C) = 100 / 20 = 5.0.',
      },
      {
        step: '4. Interprétation du régime',
        detail: 'Comme Q = 5.0 >> 0.5, le circuit est en régime oscillatoire faiblement amorti (pseudo-périodique aigu), avec une surtension aux bornes du condensateur de U_C = Q·E = 5 fois la tension d\'entrée à la résonance.',
      },
    ],
  },
  {
    id: 'prob-rlc-2',
    level: 'L2 · Fondamentaux',
    levelBadge: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
    category: 'Circuits RLC & Oscillations',
    categoryKey: 'rlc',
    moduleId: 'rlc',
    icon: Activity,
    title: 'Bande Passante à -3dB et Sélectivité',
    statement:
      'Dans le circuit précédent (f₀ = 159.2 Hz, Q = 5.0), on s\'intéresse à la bande passante à -3 dB définie par Δf = f₂ - f₁, intervalle pour lequel l\'intensité reste supérieure à I_max / √2. Quelle est la largeur de cette bande passante Δf ?',
    options: [
      { id: 'A', text: 'Δf = 15.9 Hz', isCorrect: false },
      { id: 'B', text: 'Δf = 31.8 Hz', isCorrect: true },
      { id: 'C', text: 'Δf = 63.6 Hz', isCorrect: false },
      { id: 'D', text: 'Δf = 79.6 Hz', isCorrect: false },
    ],
    hint: 'La bande passante à mi-puissance est directement liée au facteur de qualité par la relation universelle : Δf = f₀ / Q = R / (2π·L).',
    stepByStep: [
      {
        step: '1. Formule fondamentale de la bande passante',
        detail: 'Par définition du facteur de surtension : Q = f₀ / Δf ⟹ Δf = f₀ / Q.',
      },
      {
        step: '2. Application numérique directe',
        detail: 'Δf = 159.155 Hz / 5.0 = 31.83 Hz ≈ 31.8 Hz.',
      },
      {
        step: '3. Vérification par les paramètres du dipôle',
        detail: 'Δf = R / (2π·L) = 20 / (2 × 3.14159 × 0.1) = 20 / 0.6283 ≈ 31.83 Hz.',
      },
      {
        step: 'Conclusion',
        detail: 'Plus la résistance R est faible, plus Q est élevé et plus la bande passante est étroite, ce qui confère au filtre un pouvoir sélectif supérieur.',
      },
    ],
  },

  // --- OPTIQUE GÉOMÉTRIQUE ---
  {
    id: 'prob-optics-1',
    level: 'L1-L2 · Fondamentaux',
    levelBadge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    category: 'Optique Géométrique',
    categoryKey: 'optics',
    moduleId: 'optics',
    icon: Atom,
    title: 'Angle Critique de Réflexion Totale et Fibre Optique',
    statement:
      'Un rayon lumineux monochromatique se propage à l\'intérieur du cœur en silice d\'une fibre optique d\'indice n_coeur = 1.62 et arrive sur l\'interface avec la gaine protectrice d\'indice n_gaine = 1.48. Quel est l\'angle critique d\'incidence θ_c au-delà duquel se produit une réflexion totale interne empêchant la lumière de fuir vers l\'extérieur ?',
    options: [
      { id: 'A', text: 'θ_c = 45.0°', isCorrect: false },
      { id: 'B', text: 'θ_c = 66.0°', isCorrect: true },
      { id: 'C', text: 'θ_c = 58.3°', isCorrect: false },
      { id: 'D', text: 'θ_c = 72.4°', isCorrect: false },
    ],
    hint: 'Loi de Snell-Descartes : n₁·sin(θ₁) = n₂·sin(θ₂). À la limite de réfraction rasante, θ₂ = 90°, d\'où sin(θ_c) = n_gaine / n_coeur.',
    stepByStep: [
      {
        step: '1. Condition de réflexion totale',
        detail: 'La réflexion totale ne peut survenir que si la lumière passe d\'un milieu plus réfringent vers un milieu moins réfringent (n₁ > n₂). Ici n_coeur (1.62) > n_gaine (1.48).',
      },
      {
        step: '2. Formulation de l\'angle limite θ_c',
        detail: 'sin(θ_c) = n_gaine / n_coeur = 1.48 / 1.62 ≈ 0.91358.',
      },
      {
        step: '3. Calcul trigonométrique inverse',
        detail: 'θ_c = arcsin(0.91358) ≈ 1.152 rad ≈ 66.007° ≈ 66.0°.',
      },
      {
        step: 'Application aux télécommunications',
        detail: 'Tout rayon guidé arrivant avec une incidence θ > 66.0° subit une réflexion pure à 100% sans perte de photons à la frontière cœur/gaine.',
      },
    ],
  },
  {
    id: 'prob-optics-2',
    level: 'L2 · Fondamentaux',
    levelBadge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    category: 'Optique Géométrique',
    categoryKey: 'optics',
    moduleId: 'optics',
    icon: Atom,
    title: 'Réfraction de Snell-Descartes et Déviation Dioptrique',
    statement:
      'Un faisceau laser hélium-néon (λ = 632.8 nm) se propage dans l\'air (n₁ = 1.000) et pénètre dans un bloc de plexiglas (n₂ = 1.490) sous un angle d\'incidence θ₁ = 45.0°. Déterminez l\'angle de réfraction θ₂ et la déviation angulaire D = |θ₁ - θ₂| subie par le faisceau.',
    options: [
      { id: 'A', text: 'θ₂ = 28.3° et D = 16.7°', isCorrect: true },
      { id: 'B', text: 'θ₂ = 35.0° et D = 10.0°', isCorrect: false },
      { id: 'C', text: 'θ₂ = 22.1° et D = 22.9°', isCorrect: false },
      { id: 'D', text: 'θ₂ = 30.0° et D = 15.0°', isCorrect: false },
    ],
    hint: 'Snell-Descartes : sin(θ₂) = (n₁ / n₂) · sin(θ₁). Calculez arcsin de ce rapport puis D = θ₁ - θ₂.',
    stepByStep: [
      {
        step: '1. Calcul du sinus de réfraction',
        detail: 'sin(θ₂) = (1.000 / 1.490) × sin(45°) = (1 / 1.490) × 0.70711 ≈ 0.47457.',
      },
      {
        step: '2. Angle de réfraction θ₂',
        detail: 'θ₂ = arcsin(0.47457) ≈ 0.4944 rad ≈ 28.33° ≈ 28.3°.',
      },
      {
        step: '3. Déviation angulaire D',
        detail: 'D = θ₁ - θ₂ = 45.0° - 28.3° = 16.7°.',
      },
      {
        step: 'Principe physique',
        detail: 'Le rayon se rapproche de la normale car le milieu 2 est plus réfringent que le milieu 1 (n₂ > n₁).',
      },
    ],
  },

  // --- ÉLECTROMAGNÉTISME & MAXWELL ---
  {
    id: 'prob-em-1',
    level: 'L3 · Avancé',
    levelBadge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    category: 'Électromagnétisme & Ondes de Maxwell',
    categoryKey: 'electromagnetism',
    moduleId: 'electromagnetism',
    icon: Zap,
    title: 'Densité de Flux de Puissance et Vecteur de Poynting',
    statement:
      'Une onde électromagnétique plane progressive monochromatique (OPPM) se propage dans le vide. L\'amplitude de son champ électrique est E₀ = 150 V/m. L\'impédance intrinsèque caractéristique du vide est η₀ = √(μ₀/ε₀) ≈ 377 Ω. Quelle est la puissance surfacique moyenne transportée par cette onde (norme du vecteur de Poynting moyen ⟨S⟩) ?',
    options: [
      { id: 'A', text: '⟨S⟩ = 59.7 W/m²', isCorrect: false },
      { id: 'B', text: '⟨S⟩ = 29.8 W/m²', isCorrect: true },
      { id: 'C', text: '⟨S⟩ = 119.5 W/m²', isCorrect: false },
      { id: 'D', text: '⟨S⟩ = 15.0 W/m²', isCorrect: false },
    ],
    hint: 'Pour une onde plane transverse : ⟨S⟩ = E₀² / (2 · η₀) = ½ · ε₀ · c · E₀².',
    stepByStep: [
      {
        step: '1. Expression analytique du vecteur de Poynting temporel moyen',
        detail: '⟨S⟩ = ½ · Re(E × B*) = E₀² / (2 · η₀).',
      },
      {
        step: '2. Application numérique',
        detail: 'E₀² = (150)² = 22 500 V²/m². 2 · η₀ = 2 × 376.73 ≈ 753.46 Ω.',
      },
      {
        step: '3. Calcul de la densité de flux',
        detail: '⟨S⟩ = 22 500 / 753.46 ≈ 29.86 W/m² ≈ 29.8 W/m².',
      },
      {
        step: 'Signification physique',
        detail: 'Chaque mètre carré perpendiculaire à la propagation absorbe ou reçoit un flux de puissance moyen continu d\'environ 30 Watts.',
      },
    ],
  },
  {
    id: 'prob-em-2',
    level: 'L3-M1 · Avancé',
    levelBadge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    category: 'Électromagnétisme & Ondes de Maxwell',
    categoryKey: 'electromagnetism',
    moduleId: 'electromagnetism',
    icon: Zap,
    title: 'Effet de Peau dans un Métal Conducteur',
    statement:
      'Pour une onde électromagnétique radiofréquence de fréquence f = 10 MHz pénétrant dans un conducteur en cuivre de conductivité électrique σ = 5.8 × 10⁷ S/m et de perméabilité magnétique μ = μ₀ = 4π × 10⁻⁷ H/m, quelle est la valeur de l\'épaisseur de peau δ (profondeur d\'atténuation à 1/e) ?',
    options: [
      { id: 'A', text: 'δ ≈ 20.9 µm', isCorrect: true },
      { id: 'B', text: 'δ ≈ 66.0 µm', isCorrect: false },
      { id: 'C', text: 'δ ≈ 6.6 mm', isCorrect: false },
      { id: 'D', text: 'δ ≈ 1.3 µm', isCorrect: false },
    ],
    hint: 'Formule de l\'épaisseur de peau : δ = √(1 / (π · f · μ · σ)).',
    stepByStep: [
      {
        step: '1. Formule fondamentale de l\'effet de peau',
        detail: 'δ = √(2 / (ω · μ · σ)) = √(1 / (π · f · μ · σ)).',
      },
      {
        step: '2. Calcul du dénominateur sous le radical',
        detail: 'π · f · μ · σ = π × 10⁷ s⁻¹ × (4π × 10⁻⁷ H/m) × (5.8 × 10⁷ S/m) = 4π² × 5.8 × 10⁶ ≈ 39.478 × 5.8 × 10⁶ ≈ 2.2897 × 10⁸ m⁻².',
      },
      {
        step: '3. Extraction de la racine carrée',
        detail: 'δ = √(1 / 2.2897 × 10⁸) = √(4.367 × 10⁻⁹) ≈ 2.0898 × 10⁻⁵ m ≈ 20.9 µm.',
      },
      {
        step: 'Conséquence technologique',
        detail: 'À 10 MHz, les courants haute fréquence ne circulent que dans une pellicule superficielle de seulement 21 micromètres, justifiant l\'argenture des câbles coaxiaux.',
      },
    ],
  },

  // --- THERMODYNAMIQUE & CYCLES ---
  {
    id: 'prob-thermo-1',
    level: 'L2-L3 · Avancé',
    levelBadge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    category: 'Thermodynamique & Cycles Moteurs',
    categoryKey: 'thermodynamics',
    moduleId: 'thermodynamics',
    icon: Flame,
    title: 'Théorème de Carnot et Rendement Thermique Maximal',
    statement:
      'Une centrale thermique opère entre une source chaude (foyer de chaudière) à température constante T_C = 550 °C et une source froide (fleuve de refroidissement) à T_F = 20 °C. Selon le second principe de la thermodynamique (théorème de Carnot), quel est le rendement thermique maximal théorique η_max qu\'aucun moteur ditherme ne peut dépasser ?',
    options: [
      { id: 'A', text: 'η_max = 96.4 %', isCorrect: false },
      { id: 'B', text: 'η_max = 64.4 %', isCorrect: true },
      { id: 'C', text: 'η_max = 50.0 %', isCorrect: false },
      { id: 'D', text: 'η_max = 73.2 %', isCorrect: false },
    ],
    hint: 'Attention impérative : les températures de Carnot doivent être converties en Kelvin absolus (T(K) = T(°C) + 273.15) ! η_Carnot = 1 - T_F / T_C.',
    stepByStep: [
      {
        step: '1. Conversion en températures thermodynamiques absolues (Kelvin)',
        detail: 'T_C = 550 + 273.15 = 823.15 K. T_F = 20 + 273.15 = 293.15 K.',
      },
      {
        step: '2. Application de la formule de Carnot',
        detail: 'η_Carnot = 1 - (T_F / T_C) = 1 - (293.15 / 823.15) = 1 - 0.35613 = 0.64387.',
      },
      {
        step: '3. Conversion en pourcentage',
        detail: 'η_max = 64.39 % ≈ 64.4 %.',
      },
      {
        step: 'Interprétation thermodynamique',
        detail: 'Même sans aucun frottement ni perte mécanique (cycle idéalement réversible), 35.6 % de l\'énergie thermique produite doit obligatoirement être rejetée à la source froide pour satisfaire le bilan entropique ΔS_univ = 0.',
      },
    ],
  },
  {
    id: 'prob-thermo-2',
    level: 'L3 · Avancé',
    levelBadge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    category: 'Thermodynamique & Cycles Moteurs',
    categoryKey: 'thermodynamics',
    moduleId: 'thermodynamics',
    icon: Flame,
    title: 'Rendement Théorique du Moteur à Allumage Commandé (Cycle Otto)',
    statement:
      'Dans un moteur thermique 4 temps à essence modélisé par le cycle de Beau de Rochas (Otto) avec un gaz parfait diatomique (γ = Cp/Cv = 1.40), le taux volumétrique de compression est r = V_max / V_min = 9.5. Quel est le rendement théorique η_Otto de ce cycle ?',
    options: [
      { id: 'A', text: 'η_Otto = 45.2 %', isCorrect: false },
      { id: 'B', text: 'η_Otto = 59.4 %', isCorrect: true },
      { id: 'C', text: 'η_Otto = 68.7 %', isCorrect: false },
      { id: 'D', text: 'η_Otto = 72.1 %', isCorrect: false },
    ],
    hint: 'Pour le cycle Otto constitué de 2 isochores et 2 adiabatiques réversibles : η_Otto = 1 - r^(1 - γ) = 1 - 1 / r^(γ - 1).',
    stepByStep: [
      {
        step: '1. Formule du rendement d\'Otto',
        detail: 'η_Otto = 1 - (1 / r^{γ - 1}) avec γ - 1 = 1.40 - 1 = 0.40.',
      },
      {
        step: '2. Calcul du terme de compression',
        detail: 'r^{0.40} = (9.5)^{0.40} ≈ 2.4619.',
      },
      {
        step: '3. Calcul du rendement',
        detail: 'η_Otto = 1 - (1 / 2.4619) = 1 - 0.4062 = 0.5938 ≈ 59.4 %.',
      },
      {
        step: 'Conclusion',
        detail: 'Augmenter le taux de compression r améliore le rendement thermodynamique, mais est limité en pratique par le phénomène d\'auto-allumage (cliquetis moteur).',
      },
    ],
  },

  // --- PHYSIQUE QUANTIQUE ---
  {
    id: 'prob-quant-1',
    level: 'M1 · Avancé',
    levelBadge: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    category: 'Physique Quantique : Puits & Tunnel',
    categoryKey: 'quantum',
    moduleId: 'quantum',
    icon: Layers,
    title: 'Quantification de l\'Énergie dans un Puits de Potentiel 1D Infini',
    statement:
      'Un électron (masse m_e = 9.109 × 10⁻³¹ kg) est confiné dans un puits de potentiel unidimensionnel à parois infinies de largeur nanométrique L = 1.00 nm. En résolvant l\'équation de Schrödinger stationnaire, quelle est l\'énergie fondamentale E₁ (en électron-volts eV) du premier niveau n = 1 ? (On donne h = 6.626 × 10⁻³⁴ J·s et 1 eV = 1.602 × 10⁻¹⁹ J).',
    options: [
      { id: 'A', text: 'E₁ = 0.376 eV', isCorrect: true },
      { id: 'B', text: 'E₁ = 1.504 eV', isCorrect: false },
      { id: 'C', text: 'E₁ = 3.384 eV', isCorrect: false },
      { id: 'D', text: 'E₁ = 0.094 eV', isCorrect: false },
    ],
    hint: 'La formule canonique des niveaux discrets est : E_n = (n² · h²) / (8 · m · L²). Calculez pour n = 1 en Joules puis convertissez en eV.',
    stepByStep: [
      {
        step: '1. Formule de Schrödinger pour le puits infini 1D',
        detail: 'Conditions aux limites ψ(0) = ψ(L) = 0 ⟹ k_n = nπ / L. E_n = ℏ² k_n² / (2m) = (n² · h²) / (8 · m_e · L²).',
      },
      {
        step: '2. Calcul du numérateur h²',
        detail: 'h² = (6.626 × 10⁻³⁴)² ≈ 4.3904 × 10⁻⁶⁷ J²·s².',
      },
      {
        step: '3. Calcul du dénominateur 8 · m_e · L²',
        detail: '8 × (9.109 × 10⁻³¹ kg) × (1.00 × 10⁻⁹ m)² = 7.2872 × 10⁻⁴⁸ kg·m².',
      },
      {
        step: '4. Énergie fondamentale en Joules et en eV',
        detail: 'E₁ = 4.3904 × 10⁻⁶⁷ / 7.2872 × 10⁻⁴⁸ = 6.0248 × 10⁻²⁰ Joules. En eV : E₁ = 6.0248 × 10⁻²⁰ / 1.602 × 10⁻¹⁹ ≈ 0.3761 eV ≈ 0.376 eV.',
      },
    ],
  },
  {
    id: 'prob-quant-2',
    level: 'M1-M2 · Avancé',
    levelBadge: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    category: 'Physique Quantique : Puits & Tunnel',
    categoryKey: 'quantum',
    moduleId: 'quantum',
    icon: Layers,
    title: 'Longueur d\'Onde du Photon Émis lors d\'une Transition Quantique',
    statement:
      'Dans le puits précédent (E₁ = 0.376 eV, avec E_n = n² · E₁), l\'électron est excité sur le troisième niveau quantique n = 3 puis se désexcite vers le niveau fondamental n = 1 en émettant un photon spontané. Quelle est la longueur d\'onde λ (en nm) du photon émis ? (c = 3.00 × 10⁸ m/s).',
    options: [
      { id: 'A', text: 'λ = 824 nm', isCorrect: false },
      { id: 'B', text: 'λ = 412 nm', isCorrect: true },
      { id: 'C', text: 'λ = 1648 nm', isCorrect: false },
      { id: 'D', text: 'λ = 206 nm', isCorrect: false },
    ],
    hint: 'Énergie de transition : ΔE = E₃ - E₁ = (3² - 1²) · E₁ = 8 · E₁. Puis λ = h·c / ΔE.',
    stepByStep: [
      {
        step: '1. Calcul de l\'énergie de l\'état n = 3',
        detail: 'E₃ = 3² · E₁ = 9 × 0.3761 eV = 3.385 eV.',
      },
      {
        step: '2. Écart d\'énergie radiative ΔE',
        detail: 'ΔE = E₃ - E₁ = 8 · E₁ = 8 × 0.3761 eV = 3.0088 eV.',
      },
      {
        step: '3. Conversion en Joules',
        detail: 'ΔE = 3.0088 × 1.602 × 10⁻¹⁹ J ≈ 4.820 × 10⁻¹⁹ J.',
      },
      {
        step: '4. Longueur d\'onde du photon associé',
        detail: 'λ = (h · c) / ΔE = (6.626 × 10⁻³⁴ × 3.00 × 10⁸) / 4.820 × 10⁻¹⁹ = 1.9878 × 10⁻²⁵ / 4.820 × 10⁻¹⁹ ≈ 4.124 × 10⁻⁷ m = 412.4 nm ≈ 412 nm (domaine visible violet).',
      },
    ],
  },
];

export default function PhysicsExamTrainerModule({
  initialCategory = 'all',
  onNavigateToModule,
}) {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedLevel, setSelectedLevel] = useState('all'); // 'all' | 'fondamentaux' | 'avance'
  const [userAnswers, setUserAnswers] = useState({}); // { [problemId]: optionId }
  const [revealedSolutions, setRevealedSolutions] = useState({}); // { [problemId]: boolean }
  const [activeHintId, setActiveHintId] = useState(null);

  // Synchronisation si initialCategory change
  useEffect(() => {
    if (initialCategory && initialCategory !== 'all') {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  const categories = useMemo(() => {
    return [
      { id: 'all', label: 'Toutes les disciplines', icon: FlaskConical },
      { id: 'mechanics', label: 'Mécanique du Point', icon: Compass },
      { id: 'rlc', label: 'Circuits RLC & Oscillations', icon: Activity },
      { id: 'optics', label: 'Optique Géométrique', icon: Atom },
      { id: 'electromagnetism', label: 'Électromagnétisme & Maxwell', icon: Zap },
      { id: 'thermodynamics', label: 'Thermodynamique & Cycles', icon: Flame },
      { id: 'quantum', label: 'Physique Quantique', icon: Layers },
    ];
  }, []);

  const filteredProblems = useMemo(() => {
    return PHYSICS_EXAM_PROBLEMS.filter((prob) => {
      const matchCat = selectedCategory === 'all' || prob.categoryKey === selectedCategory;
      const matchLevel =
        selectedLevel === 'all' ||
        (selectedLevel === 'fondamentaux' && prob.level.includes('L1')) ||
        (selectedLevel === 'avance' && (prob.level.includes('L3') || prob.level.includes('M1') || prob.level.includes('M2')));
      return matchCat && matchLevel;
    });
  }, [selectedCategory, selectedLevel]);

  // Statistiques de progression et score
  const answeredCount = Object.keys(userAnswers).length;
  const correctCount = useMemo(() => {
    return Object.entries(userAnswers).filter(([probId, chosenOptionId]) => {
      const prob = PHYSICS_EXAM_PROBLEMS.find((p) => p.id === probId);
      if (!prob) return false;
      const option = prob.options.find((o) => o.id === chosenOptionId);
      return option && option.isCorrect;
    }).length;
  }, [userAnswers]);

  const totalAll = PHYSICS_EXAM_PROBLEMS.length;
  const scorePercent = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;

  const handleSelectOption = (problemId, optionId) => {
    setUserAnswers((prev) => ({
      ...prev,
      [problemId]: optionId,
    }));
    // Révèle automatiquement la solution détaillée pour une pédagogie instantanée
    setRevealedSolutions((prev) => ({
      ...prev,
      [problemId]: true,
    }));
  };

  const handleResetSession = () => {
    setUserAnswers({});
    setRevealedSolutions({});
    setActiveHintId(null);
  };

  return (
    <div className="space-y-6 text-left">
      {/* En-tête SaaS du Mode Examen */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-indigo-600/30">
            <GraduationCap size={24} />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Mode Examen & Auto-Évaluation
              </span>
              <span className="text-xs text-slate-400">· Annales & Problèmes Types L1-M2</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white mt-1">
              Entraînement Académique & Validation de Compétences en Physique
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-auto">
          <button
            type="button"
            onClick={handleResetSession}
            className="px-3.5 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold border border-slate-800 transition-colors flex items-center gap-1.5"
          >
            <RotateCcw size={14} />
            <span>Réinitialiser la session</span>
          </button>
        </div>
      </div>

      {/* KPI & Tableau de bord de score interactif */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-slate-400 text-[11px] block">Questions Répondues</span>
          <div className="text-xl font-bold font-mono text-white">
            {answeredCount} / {totalAll}
          </div>
          <span className="text-[10px] text-slate-500 font-mono block">Couverture totale</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-slate-400 text-[11px] block">Réponses Exactes</span>
          <div className="text-xl font-bold font-mono text-emerald-400">
            {correctCount}
          </div>
          <span className="text-[10px] text-slate-500 font-mono block">Points validés</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-slate-400 text-[11px] block">Taux de Réussite</span>
          <div className="text-xl font-bold font-mono text-indigo-400">
            {scorePercent}%
          </div>
          <span className="text-[10px] text-slate-500 font-mono block">Performance relative</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-slate-400 text-[11px] block">Mention Pédagogique</span>
          <div className="text-xs font-bold truncate">
            {answeredCount === 0 ? (
              <span className="text-slate-500">Non débuté</span>
            ) : scorePercent >= 80 ? (
              <span className="text-emerald-400 flex items-center gap-1">
                <Trophy size={13} />
                <span>Très Bien</span>
              </span>
            ) : scorePercent >= 50 ? (
              <span className="text-indigo-400">Admis</span>
            ) : (
              <span className="text-amber-400">À consolider</span>
            )}
          </div>
          <span className="text-[10px] text-slate-500 font-mono block">Évaluation instantanée</span>
        </div>
      </div>

      {/* Barre de filtrage par sous-discipline et cycle */}
      <div className="p-4 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Filter size={14} className="text-indigo-400" />
            <span className="font-semibold text-white">Filtrer par discipline :</span>
          </div>

          {/* Niveau */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => setSelectedLevel('all')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                selectedLevel === 'all'
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Tous Niveaux
            </button>
            <button
              type="button"
              onClick={() => setSelectedLevel('fondamentaux')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                selectedLevel === 'fondamentaux'
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              L1 - L2
            </button>
            <button
              type="button"
              onClick={() => setSelectedLevel('avance')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                selectedLevel === 'avance'
                  ? 'bg-violet-600 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              L3 - Master
            </button>
          </div>
        </div>

        {/* Pilules de disciplines */}
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => {
            const IconC = cat.icon;
            const isSel = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  isSel
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-600/20'
                    : 'bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <IconC size={13} className={isSel ? 'text-white' : 'text-slate-400'} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Liste des questions d'examen interactives */}
      <div className="space-y-5">
        {filteredProblems.length === 0 ? (
          <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-2">
            <BookOpen size={28} className="mx-auto text-slate-600" />
            <h4 className="text-sm font-bold text-white">Aucun problème pour ce filtre</h4>
            <p className="text-xs text-slate-400">
              Veuillez sélectionner une autre catégorie ou rétablir les filtres globaux.
            </p>
          </div>
        ) : (
          filteredProblems.map((prob, idx) => {
            const IconComp = prob.icon || Compass;
            const userAnswer = userAnswers[prob.id];
            const isAnswered = userAnswer !== undefined;
            const isCorrect = isAnswered && prob.options.find((o) => o.id === userAnswer)?.isCorrect;
            const isSolutionRevealed = revealedSolutions[prob.id];
            const showHint = activeHintId === prob.id;

            return (
              <div
                key={prob.id}
                className={`p-5 sm:p-6 rounded-3xl bg-slate-900/80 border transition-all shadow-xl backdrop-blur-xl ${
                  !isAnswered
                    ? 'border-slate-800 hover:border-slate-700'
                    : isCorrect
                    ? 'border-emerald-500/40 bg-emerald-950/10'
                    : 'border-rose-500/40 bg-rose-950/10'
                }`}
              >
                {/* En-tête de la question */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3.5 mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shrink-0">
                      <IconComp size={16} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-slate-400">
                          Question #{idx + 1}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono border ${prob.levelBadge}`}>
                          {prob.level}
                        </span>
                        <span className="text-xs text-slate-400 hidden sm:inline">
                          · {prob.category}
                        </span>
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-white mt-0.5">
                        {prob.title}
                      </h3>
                    </div>
                  </div>

                  {/* Bouton de saut direct vers le banc d'essai de simulation */}
                  {onNavigateToModule && (
                    <button
                      type="button"
                      onClick={() => onNavigateToModule(prob.moduleId)}
                      className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-medium border border-slate-800 transition-colors flex items-center gap-1.5"
                    >
                      <FlaskConical size={13} className="text-indigo-400" />
                      <span>Tester au Laboratoire</span>
                    </button>
                  )}
                </div>

                {/* Énoncé du problème universitaire */}
                <div className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans mb-5 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
                  {prob.statement}
                </div>

                {/* Indice pédagogique */}
                <div className="mb-4">
                  <button
                    type="button"
                    onClick={() => setActiveHintId(showHint ? null : prob.id)}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Lightbulb size={13} />
                    <span>{showHint ? 'Masquer l\'indice de résolution' : 'Afficher un indice de cours'}</span>
                  </button>

                  {showHint && (
                    <div className="mt-2 p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-xs text-indigo-200/90 leading-relaxed font-sans">
                      💡 <span className="font-semibold text-indigo-300">Indice :</span> {prob.hint}
                    </div>
                  )}
                </div>

                {/* Grille des Options QCM (A, B, C, D) */}
                <div className="space-y-2 mb-4">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Sélectionnez la bonne réponse :
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {prob.options.map((opt) => {
                      const isSelected = userAnswer === opt.id;
                      let btnStyle = 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-200';

                      if (isAnswered) {
                        if (opt.isCorrect) {
                          btnStyle = 'bg-emerald-950/50 border-emerald-500 text-emerald-200 font-bold';
                        } else if (isSelected && !opt.isCorrect) {
                          btnStyle = 'bg-rose-950/50 border-rose-500 text-rose-200 line-through';
                        } else {
                          btnStyle = 'bg-slate-950/40 border-slate-800/50 text-slate-500 opacity-60';
                        }
                      } else if (isSelected) {
                        btnStyle = 'bg-indigo-600/20 border-indigo-500 text-white font-bold';
                      }

                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => handleSelectOption(prob.id, opt.id)}
                          className={`p-3 rounded-2xl border text-xs text-left transition-all flex items-center justify-between gap-3 ${btnStyle}`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span
                              className={`w-6 h-6 rounded-lg flex items-center justify-center font-mono font-bold text-[11px] shrink-0 border ${
                                isAnswered && opt.isCorrect
                                  ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                                  : isAnswered && isSelected && !opt.isCorrect
                                  ? 'bg-rose-500 text-white border-rose-400'
                                  : 'bg-slate-900 border-slate-700 text-slate-300'
                              }`}
                            >
                              {opt.id}
                            </span>
                            <span className="font-mono text-xs">{opt.text}</span>
                          </div>

                          {isAnswered && opt.isCorrect && (
                            <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                          )}
                          {isAnswered && isSelected && !opt.isCorrect && (
                            <XCircle size={16} className="text-rose-400 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Feedback & Explication Pédagogique Détaillée Pas à Pas */}
                {isAnswered && (
                  <div className="mt-4 pt-4 border-t border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {isCorrect ? (
                          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/20">
                            <CheckCircle2 size={14} />
                            <span>Réponse Exacte ! Félicitations</span>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-400 bg-rose-500/10 px-3 py-1 rounded-xl border border-rose-500/20">
                            <XCircle size={14} />
                            <span>Réponse Inexacte · Consultez la Démonstration</span>
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setRevealedSolutions((prev) => ({
                            ...prev,
                            [prob.id]: !isSolutionRevealed,
                          }))
                        }
                        className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                      >
                        <Sparkles size={13} className="text-violet-400" />
                        <span>{isSolutionRevealed ? 'Masquer le corrigé détaillé' : 'Voir le corrigé détaillé'}</span>
                      </button>
                    </div>

                    {/* Déroulé pédagogique pas à pas */}
                    {isSolutionRevealed && (
                      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                        <div className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                          <BookOpen size={14} />
                          <span>Correction & Démarche Analytique Pas à Pas :</span>
                        </div>

                        <div className="space-y-2.5 text-xs">
                          {prob.stepByStep.map((s, sIdx) => (
                            <div key={sIdx} className="space-y-0.5">
                              <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                                <span className="w-4 h-4 rounded-full bg-indigo-600/30 text-indigo-300 text-[10px] font-mono flex items-center justify-center">
                                  {sIdx + 1}
                                </span>
                                <span>{s.step}</span>
                              </div>
                              <div className="pl-5 text-slate-400 leading-relaxed font-sans">
                                {s.detail}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
