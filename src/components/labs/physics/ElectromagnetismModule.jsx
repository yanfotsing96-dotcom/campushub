import { useState, useMemo } from 'react';
import {
  Zap,
  RotateCcw,
  Sparkles,
  SlidersHorizontal,
  GraduationCap,
  FileText,
} from 'lucide-react';
import { PHYSICS_MODULES, PHYSICAL_CONSTANTS } from './physicsData';

export default function ElectromagnetismModule({ onExport, onNavigateToExam }) {
  const moduleData = PHYSICS_MODULES.find((m) => m.id === 'electromagnetism');

  // Paramètres réglables (Champs libres)
  const [frequencyMhz, setFrequencyMhz] = useState(150); // MHz
  const [er, setEr] = useState(1.0); // Permittivité relative (ex: Vide = 1.0)
  const [ur, setUr] = useState(1.0); // Perméabilité relative (ex: Vide = 1.0)
  const [sigma, setSigma] = useState(0.0); // Conductivité (S/m)
  const [e0Amplitude, setE0Amplitude] = useState(100); // V/m

  const c = PHYSICAL_CONSTANTS.c;
  const mu0 = PHYSICAL_CONSTANTS.mu0;
  const eta0 = 376.730313; // Impédance du vide (Ω)

  // Conversions & Grandeurs fondamentales
  const fHz = frequencyMhz * 1e6;
  const mu = ur * mu0;

  // Indice de réfraction et vitesse de phase
  const nMedium = Math.sqrt(er * ur);
  const vPhase = c / nMedium; // m/s
  const wavelengthMedium = vPhase / fHz; // mètres

  // Impédance d'onde intrinsèque η
  const waveImpedance = eta0 * Math.sqrt(ur / er); // Ohms

  // Amplitude champ magnétique B0
  const b0Tesla = e0Amplitude / vPhase; // Tesla

  // Densité de flux de puissance (Vecteur de Poynting moyen <S>)
  const poyntingAvg = (e0Amplitude * e0Amplitude) / (2 * waveImpedance); // W/m²

  // Épaisseur de peau (Skin depth) si conducteur
  const skinDepth = useMemo(() => {
    if (sigma <= 1e-9) return null; // Milieu diélectrique isolant
    return Math.sqrt(1 / (Math.PI * fHz * mu * sigma)); // mètres
  }, [fHz, mu, sigma]);

  // Tracé 3D Isométrique SVG de l'onde plane OPPM (E le long de Y, B le long de Z)
  const waveSvgPaths = useMemo(() => {
    const pointsCount = 40;
    const pathE = [];
    const pathB = [];
    const arrowsE = [];
    const arrowsB = [];

    // Axe de propagation incliné : de (60, 200) vers (540, 100)
    const xStart = 60, yStart = 200;
    const xEnd = 540, yEnd = 100;
    const dx = xEnd - xStart;
    const dy = yEnd - yStart;

    const spatialPeriods = 2.0;

    for (let i = 0; i <= pointsCount; i++) {
      const frac = i / pointsCount;
      const baseNodeX = xStart + frac * dx;
      const baseNodeY = yStart + frac * dy;

      const phaseAngle = frac * spatialPeriods * 2 * Math.PI;

      // Champ E (vertical, axe Y)
      const eDisp = Math.sin(phaseAngle) * 55;
      const eNodeX = baseNodeX;
      const eNodeY = baseNodeY - eDisp;

      // Champ B (horizontal projeté, axe Z à 45°)
      const bDisp = Math.sin(phaseAngle) * 40;
      const bNodeX = baseNodeX + bDisp * 0.7;
      const bNodeY = baseNodeY + bDisp * 0.4;

      pathE.push(`${i === 0 ? 'M' : 'L'} ${eNodeX.toFixed(1)} ${eNodeY.toFixed(1)}`);
      pathB.push(`${i === 0 ? 'M' : 'L'} ${bNodeX.toFixed(1)} ${bNodeY.toFixed(1)}`);

      if (i % 4 === 0 && Math.abs(Math.sin(phaseAngle)) > 0.15) {
        arrowsE.push({ x1: baseNodeX, y1: baseNodeY, x2: eNodeX, y2: eNodeY });
        arrowsB.push({ x1: baseNodeX, y1: baseNodeY, x2: bNodeX, y2: bNodeY });
      }
    }

    return {
      pathE: pathE.join(' '),
      pathB: pathB.join(' '),
      arrowsE,
      arrowsB,
      xStart,
      yStart,
      xEnd,
      yEnd,
    };
  }, []);

  const handleExportClick = () => {
    onExport({
      moduleData,
      currentParams: {
        'Fréquence de l\'onde (f)': `${frequencyMhz} MHz (${(fHz / 1e9).toFixed(3)} GHz)`,
        'Permittivité relative (ε_r)': `${er}`,
        'Perméabilité relative (μ_r)': `${ur}`,
        'Conductivité ohmique (σ)': `${sigma} S/m`,
        'Amplitude champ électrique (E₀)': `${e0Amplitude} V/m`,
      },
      computedResults: {
        'Vitesse de phase (v_φ)': {
          val: (vPhase / 1e6).toFixed(2),
          unit: '10⁶ m/s',
          comment: `v = c / √(ε_r·μ_r) (soit ${(vPhase / c).toFixed(3)}·c)`,
        },
        'Longueur d\'onde dans le milieu (λ)': {
          val: wavelengthMedium >= 1 ? `${wavelengthMedium.toFixed(3)} m` : `${(wavelengthMedium * 100).toFixed(2)} cm`,
          unit: '',
          comment: 'λ = v_φ / f',
        },
        'Impédance d\'onde intrinsèque (η)': {
          val: waveImpedance.toFixed(2),
          unit: 'Ω',
          comment: 'Rapport d\'amplitude E₀ / H₀',
        },
        'Induction magnétique crête (B₀)': {
          val: (b0Tesla * 1e9).toFixed(2),
          unit: 'nT',
          comment: 'B₀ = E₀ / v_φ',
        },
        'Densité de flux moyen Poynting <S>': {
          val: poyntingAvg.toFixed(2),
          unit: 'W/m²',
          comment: '<S> = E₀² / (2η)',
        },
        'Épaisseur de peau (Skin depth δ)': {
          val: skinDepth !== null ? (skinDepth < 0.001 ? `${(skinDepth * 1e6).toFixed(1)} µm` : `${(skinDepth * 1000).toFixed(2)} mm`) : 'Infinie (Diélectrique)',
          unit: '',
          comment: 'Profondeur de pénétration à 1/e',
        },
      },
    });
  };

  const handlePresetSelect = (preset) => {
    setFrequencyMhz(preset.frequencyMhz);
    setEr(preset.er);
    setUr(preset.ur);
    setSigma(preset.sigma);
    setE0Amplitude(preset.e0Amplitude);
  };

  const handleReset = () => {
    setFrequencyMhz(150);
    setEr(1.0);
    setUr(1.0);
    setSigma(0.0);
    setE0Amplitude(100);
  };

  return (
    <div className="space-y-6 text-left">
      {/* En-tête */}
      <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-violet-600/20 text-violet-400 border border-violet-500/30 flex items-center justify-center shrink-0">
            <Zap size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-violet-500/10 text-violet-400 border border-violet-500/20">
                PHY301 · L3
              </span>
              <span className="text-xs text-slate-400">Avancé</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white mt-0.5">
              Électromagnétisme & Ondes de Maxwell
            </h2>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onNavigateToExam && (
            <button
              type="button"
              onClick={() => onNavigateToExam('electromagnetism')}
              className="px-3 py-2 rounded-xl bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 border border-violet-500/30 hover:border-violet-500/50 transition-all text-xs font-semibold flex items-center gap-1.5"
            >
              <GraduationCap size={14} />
              <span className="hidden sm:inline">Tester en Mode Examen</span>
              <span className="sm:hidden">Mode Examen</span>
            </button>
          )}
          <button
            type="button"
            onClick={handleReset}
            className="px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 text-xs font-medium border border-slate-800 transition-colors flex items-center gap-1.5"
          >
            <RotateCcw size={14} />
            <span>Réinitialiser</span>
          </button>
          <button
            type="button"
            onClick={handleExportClick}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-violet-600/20 transition-all flex items-center gap-1.5"
          >
            <FileText size={14} />
            <span>Exporter Rapport TP (PDF A4)</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Colonne Gauche : Paramètres de l'onde et du milieu */}
        <div className="lg:col-span-5 space-y-5">
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <SlidersHorizontal size={16} className="text-violet-400" />
                <span>Paramètres de l'Onde & Milieu</span>
              </h3>
              <span className="text-[11px] text-slate-400 font-mono">OPPM Transverse</span>
            </div>

            {/* Presets rapides */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Milieux de Propagation Modèles :
              </label>
              <div className="grid grid-cols-2 gap-1.5 p-1 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
                {moduleData.presets.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => handlePresetSelect(preset)}
                    className="py-1.5 px-2 rounded-xl text-left font-medium text-slate-300 hover:text-white hover:bg-slate-900 transition-all truncate"
                    title={preset.name}
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Fréquence */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-medium">Fréquence f (MHz) :</span>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min="1"
                    max="10000"
                    step="10"
                    value={frequencyMhz}
                    onChange={(e) => setFrequencyMhz(Math.max(1, Number(e.target.value)))}
                    className="w-20 px-2 py-0.5 rounded-lg bg-slate-950 border border-slate-700 text-violet-300 font-mono text-right text-xs focus:outline-none focus:border-violet-500"
                  />
                  <span className="text-slate-400 font-mono">MHz</span>
                </div>
              </div>
              <input
                type="range"
                min="10"
                max="3000"
                step="10"
                value={frequencyMhz}
                onChange={(e) => setFrequencyMhz(Number(e.target.value))}
                className="w-full accent-violet-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
            </div>

            {/* Permittivité relative er */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-medium">Permittivité relative ε_r :</span>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min="1.0"
                    max="100"
                    step="0.1"
                    value={er}
                    onChange={(e) => setEr(Math.max(1.0, Number(e.target.value)))}
                    className="w-20 px-2 py-0.5 rounded-lg bg-slate-950 border border-slate-700 text-violet-300 font-mono text-right text-xs focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>
              <input
                type="range"
                min="1"
                max="85"
                step="0.5"
                value={er}
                onChange={(e) => setEr(Number(e.target.value))}
                className="w-full accent-violet-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
            </div>

            {/* Amplitude E0 */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-medium">Amplitude champ électrique E₀ :</span>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    step="5"
                    value={e0Amplitude}
                    onChange={(e) => setE0Amplitude(Math.max(1, Number(e.target.value)))}
                    className="w-20 px-2 py-0.5 rounded-lg bg-slate-950 border border-slate-700 text-violet-300 font-mono text-right text-xs focus:outline-none focus:border-violet-500"
                  />
                  <span className="text-slate-400 font-mono">V/m</span>
                </div>
              </div>
              <input
                type="range"
                min="10"
                max="300"
                step="5"
                value={e0Amplitude}
                onChange={(e) => setE0Amplitude(Number(e.target.value))}
                className="w-full accent-violet-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
            </div>

            {/* Équations de Maxwell affichées */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 font-mono space-y-1">
              <div className="text-violet-400 font-bold">Équations de Maxwell associées :</div>
              <div>∇ · E = ρ / ε₀ · ε_r (Gauss)</div>
              <div>∇ · B = 0 (Flux magnétique nul)</div>
              <div>∇ × E = −∂B/∂t (Faraday)</div>
              <div>∇ × B = μ₀·μ_r·(J + ε₀·ε_r·∂E/∂t) (Ampère-Maxwell)</div>
            </div>
          </div>
        </div>

        {/* Colonne Droite : Visualisation 3D Isométrique du Trièdre d'Onde & KPIs */}
        <div className="lg:col-span-7 space-y-5">
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Zap size={16} className="text-violet-400" />
                  <span>Structure Spatio-Temporelle du Trièdre (E, B, k)</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Champ électrique E vertical (violet) et champ magnétique B transversal (cyan).
                </p>
              </div>

              <div className="text-xs font-mono px-3 py-1 rounded-xl bg-slate-950 border border-slate-800 text-violet-300">
                &lang;S&rang; = {poyntingAvg.toFixed(1)} W/m²
              </div>
            </div>

            {/* Représentation SVG 3D isométrique */}
            <div className="relative w-full h-72 rounded-2xl bg-slate-950 border border-slate-800/90 overflow-hidden flex items-center justify-center">
              <svg viewBox="0 0 600 300" className="w-full h-full select-none">
                {/* Axe de propagation k */}
                <line
                  x1={waveSvgPaths.xStart}
                  y1={waveSvgPaths.yStart}
                  x2={waveSvgPaths.xEnd}
                  y2={waveSvgPaths.yEnd}
                  stroke="#475569"
                  strokeWidth="2"
                />
                <polygon
                  points={`${waveSvgPaths.xEnd + 8},${waveSvgPaths.yEnd - 2} ${waveSvgPaths.xEnd - 4},${waveSvgPaths.yEnd - 8} ${waveSvgPaths.xEnd - 4},${waveSvgPaths.yEnd + 4}`}
                  fill="#94a3b8"
                />
                <text
                  x={waveSvgPaths.xEnd + 15}
                  y={waveSvgPaths.yEnd}
                  fill="#94a3b8"
                  fontSize="11"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  k (Vecteur d'onde)
                </text>

                {/* Flèches de vecteurs du champ E */}
                {waveSvgPaths.arrowsE.map((arrow, idx) => (
                  <line
                    key={`e-${idx}`}
                    x1={arrow.x1}
                    y1={arrow.y1}
                    x2={arrow.x2}
                    y2={arrow.y2}
                    stroke="#a855f7"
                    strokeWidth="1.5"
                    strokeOpacity="0.7"
                  />
                ))}

                {/* Flèches de vecteurs du champ B */}
                {waveSvgPaths.arrowsB.map((arrow, idx) => (
                  <line
                    key={`b-${idx}`}
                    x1={arrow.x1}
                    y1={arrow.y1}
                    x2={arrow.x2}
                    y2={arrow.y2}
                    stroke="#06b6d4"
                    strokeWidth="1.5"
                    strokeOpacity="0.7"
                  />
                ))}

                {/* Courbe du champ E (Violet) */}
                <path
                  d={waveSvgPaths.pathE}
                  fill="none"
                  stroke="#c084fc"
                  strokeWidth="2.5"
                  className="filter drop-shadow-sm"
                />

                {/* Courbe du champ B (Cyan) */}
                <path
                  d={waveSvgPaths.pathB}
                  fill="none"
                  stroke="#22d3ee"
                  strokeWidth="2.5"
                  className="filter drop-shadow-sm"
                />

                {/* Annotations */}
                <text x="70" y="130" fill="#c084fc" fontSize="12" fontFamily="sans-serif" fontWeight="bold">
                  Champ Électrique E (V/m)
                </text>
                <text x="140" y="240" fill="#22d3ee" fontSize="12" fontFamily="sans-serif" fontWeight="bold">
                  Champ Magnétique B (Tesla)
                </text>
              </svg>

              {/* Ticker d'information */}
              <div className="absolute top-3 right-3 p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] font-mono text-slate-300 space-y-0.5">
                <div>v_φ = <span className="text-violet-400 font-bold">{(vPhase / 1e6).toFixed(1)} × 10⁶ m/s</span></div>
                <div>λ = <span className="text-cyan-400 font-bold">{wavelengthMedium.toFixed(2)} m</span></div>
                <div>B₀ = {(b0Tesla * 1e9).toFixed(1)} nT</div>
              </div>
            </div>
          </div>

          {/* Grille de KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[11px] block">Vitesse v_φ</span>
              <div className="text-xl font-bold font-mono text-violet-400">
                {(vPhase / 1e6).toFixed(1)} M m/s
              </div>
              <span className="text-[10px] text-slate-500 font-mono block">c / √(ε_r·μ_r)</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[11px] block">Impédance η</span>
              <div className="text-xl font-bold font-mono text-indigo-400">
                {waveImpedance.toFixed(1)} Ω
              </div>
              <span className="text-[10px] text-slate-500 font-mono block">√(μ/ε)</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[11px] block">Flux Poynting &lang;S&rang;</span>
              <div className="text-xl font-bold font-mono text-cyan-400">
                {poyntingAvg.toFixed(1)} W/m²
              </div>
              <span className="text-[10px] text-slate-500 font-mono block">E₀² / (2η)</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[11px] block">Indice n</span>
              <div className="text-xl font-bold font-mono text-emerald-400">
                {nMedium.toFixed(2)}
              </div>
              <span className="text-[10px] text-slate-500 font-mono block">c / v_φ</span>
            </div>
          </div>

          {/* Synthèse Pédagogique */}
          <div className="p-4 rounded-2xl bg-violet-950/20 border border-violet-500/20 text-violet-200/90 text-xs leading-relaxed space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-violet-300">
              <Sparkles size={14} />
              <span>Théorème de Poynting & Transport de Puissance :</span>
            </div>
            <p>
              Dans le vide, l'onde transporte de l'énergie avec une impédance caractéristique η₀ = √(μ₀ / ε₀) ≈ 377 Ω. Le trièdre formé par le champ électrique E, le champ magnétique B et le vecteur de Poynting S = E × H est direct et orthogonal en tout point.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
