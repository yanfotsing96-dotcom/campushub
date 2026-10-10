import { useState, useMemo } from 'react';
import {
  Activity,
  RotateCcw,
  Download,
  Sparkles,
  Zap,
  SlidersHorizontal,
  GraduationCap,
  FileText,
} from 'lucide-react';
import { PHYSICS_MODULES } from './physicsData';

export default function RlcModule({ onExport, onNavigateToExam }) {
  const moduleData = PHYSICS_MODULES.find((m) => m.id === 'rlc');

  // Paramètres réglables en direct (Champs libres)
  const [resistance, setResistance] = useState(30); // Ω
  const [inductanceMh, setInductanceMh] = useState(150); // mH (0.15 H)
  const [capacitanceUf, setCapacitanceUf] = useState(10); // µF
  const [frequency, setFrequency] = useState(130); // Hz
  const [vPeak, setVPeak] = useState(12); // Volts
  const [displayMode, setDisplayMode] = useState('bode'); // 'bode' | 'oscilloscope'

  // Conversions SI
  const inductanceH = inductanceMh * 1e-3;
  const capacitanceF = capacitanceUf * 1e-6;

  // Calculs fondamentaux
  const omega0 = useMemo(() => {
    return 1 / Math.sqrt(inductanceH * capacitanceF);
  }, [inductanceH, capacitanceF]);

  const f0 = useMemo(() => {
    return omega0 / (2 * Math.PI);
  }, [omega0]);

  const qFactor = useMemo(() => {
    if (resistance <= 0) return 999;
    return (1 / resistance) * Math.sqrt(inductanceH / capacitanceF);
  }, [resistance, inductanceH, capacitanceF]);

  const bandwidth = useMemo(() => {
    if (qFactor <= 0) return 0;
    return f0 / qFactor;
  }, [f0, qFactor]);

  // Régime d'oscillation libre
  const dampingRatio = useMemo(() => {
    return (resistance / 2) * Math.sqrt(capacitanceF / inductanceH);
  }, [resistance, capacitanceF, inductanceH]);

  const regimeLabel = useMemo(() => {
    if (qFactor > 0.5) return 'Oscillatoire Pseudo-périodique (Q > 0.5)';
    if (Math.abs(qFactor - 0.5) < 0.05) return 'Régime Critique (Q ≈ 0.5)';
    return 'Apériodique Fortement Amorti (Q < 0.5)';
  }, [qFactor]);

  // Réponse forcée à la fréquence imposée
  const omega = 2 * Math.PI * frequency;
  const zReactance = omega * inductanceH - 1 / (omega * capacitanceF);
  const impedance = Math.sqrt(resistance * resistance + zReactance * zReactance);
  const iPeak = vPeak / impedance; // Ampères crête
  const iEff = iPeak / Math.SQRT2; // Ampères RMS
  const phaseRad = Math.atan2(zReactance, resistance);
  const phaseDeg = (phaseRad * 180) / Math.PI;

  // Génération de la courbe de résonance SVG (I vs f)
  const resonanceCurveSvg = useMemo(() => {
    const fMin = Math.max(1, f0 * 0.2);
    const fMax = f0 * 2.0;
    const steps = 60;
    const path = [];

    // Valeur max d'intensité à la résonance pure
    const iMaxResonance = vPeak / resistance;

    for (let i = 0; i <= steps; i++) {
      const f = fMin + (i / steps) * (fMax - fMin);
      const w = 2 * Math.PI * f;
      const xReact = w * inductanceH - 1 / (w * capacitanceF);
      const zMag = Math.sqrt(resistance * resistance + xReact * xReact);
      const curI = vPeak / zMag;

      const svgX = 50 + (i / steps) * 500;
      const svgY = 250 - (curI / (iMaxResonance * 1.15)) * 200;
      path.push(`${i === 0 ? 'M' : 'L'} ${svgX.toFixed(1)} ${svgY.toFixed(1)}`);
    }

    return {
      path: path.join(' '),
      fMin,
      fMax,
      iMaxResonance,
    };
  }, [f0, vPeak, resistance, inductanceH, capacitanceF]);

  // Tracé des sinusoïdes u(t) et i(t) pour l'oscilloscope virtuel
  const oscilloscopePaths = useMemo(() => {
    const pointsCount = 100;
    const periodsToShow = 2.5;
    const period = 1 / frequency;
    const tMax = periodsToShow * period;

    const pathU = [];
    const pathI = [];

    const normI = iPeak > 0 ? (vPeak * 0.8) / iPeak : 1; // normalisation d'affichage visuel

    for (let i = 0; i <= pointsCount; i++) {
      const t = (i / pointsCount) * tMax;
      const uVal = vPeak * Math.sin(2 * Math.PI * frequency * t);
      const iVal = normI * iPeak * Math.sin(2 * Math.PI * frequency * t - phaseRad);

      const svgX = 50 + (i / pointsCount) * 500;
      const svgYu = 150 - (uVal / (vPeak * 1.25)) * 95;
      const svgYi = 150 - (iVal / (vPeak * 1.25)) * 95;

      pathU.push(`${i === 0 ? 'M' : 'L'} ${svgX.toFixed(1)} ${svgYu.toFixed(1)}`);
      pathI.push(`${i === 0 ? 'M' : 'L'} ${svgX.toFixed(1)} ${svgYi.toFixed(1)}`);
    }

    return {
      pathU: pathU.join(' '),
      pathI: pathI.join(' '),
    };
  }, [frequency, vPeak, iPeak, phaseRad]);

  const handleExportClick = () => {
    onExport({
      moduleData,
      currentParams: {
        'Résistance (R)': `${resistance} Ω`,
        'Inductance (L)': `${inductanceMh} mH (${inductanceH} H)`,
        'Capacité (C)': `${capacitanceUf} µF (${capacitanceF} F)`,
        'Fréquence générateur (f)': `${frequency} Hz`,
        'Tension crête d\'entrée (V_peak)': `${vPeak} V`,
      },
      computedResults: {
        'Fréquence de résonance propre (f0)': { val: f0.toFixed(2), unit: 'Hz', comment: 'Pulsation ω0 = 1/√(LC)' },
        'Facteur de qualité (Q)': { val: qFactor.toFixed(2), unit: '', comment: qFactor > 5 ? 'Résonance très aiguë' : 'Résonance amortie' },
        'Bande passante à -3dB (Δf)': { val: bandwidth.toFixed(2), unit: 'Hz', comment: 'Δf = f0 / Q' },
        'Impédance totale |Z|': { val: impedance.toFixed(2), unit: 'Ω', comment: Math.abs(frequency - f0) < 2 ? 'Impédance minimale (= R)' : 'Désaccord capacitif/inductif' },
        'Courant crête résultant (I_max)': { val: (iPeak * 1000).toFixed(1), unit: 'mA', comment: `${(iEff * 1000).toFixed(1)} mA efficace` },
        'Déphasage u(t)/i(t) (φ)': { val: phaseDeg.toFixed(1), unit: '°', comment: phaseDeg > 0 ? 'Inductif (tension en avance)' : 'Capacitif (courant en avance)' },
        'Régime d\'amortissement': { val: regimeLabel, unit: '', comment: `Facteur d'amortissement ξ = ${dampingRatio.toFixed(3)}` },
      },
    });
  };

  const handlePresetSelect = (preset) => {
    setResistance(preset.resistance);
    setInductanceMh(preset.inductance * 1000);
    setCapacitanceUf(preset.capacitance);
    setFrequency(preset.frequency);
    setVPeak(preset.vPeak);
  };

  const handleReset = () => {
    setResistance(30);
    setInductanceMh(150);
    setCapacitanceUf(10);
    setFrequency(130);
    setVPeak(12);
  };

  return (
    <div className="space-y-6 text-left">
      {/* En-tête */}
      <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-violet-600/20 text-violet-400 border border-violet-500/30 flex items-center justify-center shrink-0">
            <Activity size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-violet-500/10 text-violet-400 border border-violet-500/20">
                PHY102 · L1-L2
              </span>
              <span className="text-xs text-slate-400">Fondamentaux</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white mt-0.5">
              Circuits RLC Série & Résonance Harmonique
            </h2>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onNavigateToExam && (
            <button
              type="button"
              onClick={() => onNavigateToExam('rlc')}
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
        {/* Colonne Gauche : Paramètres R, L, C, f, V */}
        <div className="lg:col-span-5 space-y-5">
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <SlidersHorizontal size={16} className="text-violet-400" />
                <span>Composants Passifs & Générateur</span>
              </h3>
              <span className="text-[11px] text-slate-400 font-mono">Loi d'Ohm complexe</span>
            </div>

            {/* Presets rapides */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Configurations Types de TP :
              </label>
              <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
                {moduleData.presets.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => handlePresetSelect(preset)}
                    className="py-1.5 px-2 rounded-xl text-center font-medium text-slate-300 hover:text-white hover:bg-slate-900 transition-all truncate"
                    title={preset.name}
                  >
                    {preset.name.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Résistance R */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-medium">Résistance R (Ω) :</span>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min="1"
                    max="500"
                    step="1"
                    value={resistance}
                    onChange={(e) => setResistance(Math.max(1, Number(e.target.value)))}
                    className="w-20 px-2 py-0.5 rounded-lg bg-slate-950 border border-slate-700 text-violet-300 font-mono text-right text-xs focus:outline-none focus:border-violet-500"
                  />
                  <span className="text-slate-400 font-mono">Ω</span>
                </div>
              </div>
              <input
                type="range"
                min="2"
                max="300"
                step="1"
                value={resistance}
                onChange={(e) => setResistance(Number(e.target.value))}
                className="w-full accent-violet-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
            </div>

            {/* Inductance L */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-medium">Inductance L (mH) :</span>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min="10"
                    max="2000"
                    step="10"
                    value={inductanceMh}
                    onChange={(e) => setInductanceMh(Math.max(10, Number(e.target.value)))}
                    className="w-20 px-2 py-0.5 rounded-lg bg-slate-950 border border-slate-700 text-violet-300 font-mono text-right text-xs focus:outline-none focus:border-violet-500"
                  />
                  <span className="text-slate-400 font-mono">mH</span>
                </div>
              </div>
              <input
                type="range"
                min="10"
                max="500"
                step="5"
                value={inductanceMh}
                onChange={(e) => setInductanceMh(Number(e.target.value))}
                className="w-full accent-violet-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
            </div>

            {/* Capacité C */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-medium">Capacité C (µF) :</span>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min="0.1"
                    max="100"
                    step="0.5"
                    value={capacitanceUf}
                    onChange={(e) => setCapacitanceUf(Math.max(0.1, Number(e.target.value)))}
                    className="w-20 px-2 py-0.5 rounded-lg bg-slate-950 border border-slate-700 text-violet-300 font-mono text-right text-xs focus:outline-none focus:border-violet-500"
                  />
                  <span className="text-slate-400 font-mono">µF</span>
                </div>
              </div>
              <input
                type="range"
                min="0.5"
                max="50"
                step="0.5"
                value={capacitanceUf}
                onChange={(e) => setCapacitanceUf(Number(e.target.value))}
                className="w-full accent-violet-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
            </div>

            {/* Fréquence d'excitation f */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-medium">Fréquence imposée f (Hz) :</span>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min="1"
                    max="5000"
                    step="1"
                    value={frequency}
                    onChange={(e) => setFrequency(Math.max(1, Number(e.target.value)))}
                    className="w-20 px-2 py-0.5 rounded-lg bg-slate-950 border border-slate-700 text-violet-300 font-mono text-right text-xs focus:outline-none focus:border-violet-500"
                  />
                  <span className="text-slate-400 font-mono">Hz</span>
                </div>
              </div>
              <input
                type="range"
                min="10"
                max={Math.max(500, Math.round(f0 * 2.5))}
                step="1"
                value={frequency}
                onChange={(e) => setFrequency(Number(e.target.value))}
                className="w-full accent-violet-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
            </div>

            {/* Raccourci vers f0 */}
            <button
              type="button"
              onClick={() => setFrequency(Math.round(f0))}
              className="w-full py-1.5 rounded-xl bg-violet-600/10 hover:bg-violet-600/20 text-violet-300 text-xs font-semibold border border-violet-500/20 transition-colors flex items-center justify-center gap-1.5"
            >
              <Zap size={13} />
              <span>Accorder le générateur à f₀ ({f0.toFixed(1)} Hz)</span>
            </button>
          </div>
        </div>

        {/* Colonne Droite : Visualisation (Bode / Oscilloscope) & KPIs */}
        <div className="lg:col-span-7 space-y-5">
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Activity size={16} className="text-violet-400" />
                  <span>
                    {displayMode === 'bode'
                      ? 'Courbe de Résonance en Intensité I(f)'
                      : 'Oscilloscope Bicanal u(t) & i(t)'}
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  {displayMode === 'bode'
                    ? 'Réponse fréquentielle du circuit avec repères de bande passante.'
                    : `Déphasage mesuré φ = ${phaseDeg.toFixed(1)}° (${phaseDeg > 0 ? 'Inductif' : 'Capacitif'}).`}
                </p>
              </div>

              {/* Commutateur de mode graphique */}
              <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                <button
                  type="button"
                  onClick={() => setDisplayMode('bode')}
                  className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                    displayMode === 'bode'
                      ? 'bg-violet-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Courbe I(f)
                </button>
                <button
                  type="button"
                  onClick={() => setDisplayMode('oscilloscope')}
                  className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                    displayMode === 'oscilloscope'
                      ? 'bg-violet-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Oscilloscope
                </button>
              </div>
            </div>

            {/* Canvas SVG */}
            <div className="relative w-full h-64 sm:h-72 rounded-2xl bg-slate-950 border border-slate-800/90 overflow-hidden flex items-center justify-center">
              {displayMode === 'bode' ? (
                <svg viewBox="0 0 600 300" className="w-full h-full select-none">
                  {/* Axes cartésiens */}
                  <line x1="50" y1="250" x2="570" y2="250" stroke="#334155" strokeWidth="1.5" />
                  <line x1="50" y1="30" x2="50" y2="250" stroke="#334155" strokeWidth="1.5" />

                  {/* Graduations X */}
                  <text x="50" y="270" fill="#64748b" fontSize="10" fontFamily="monospace">
                    {resonanceCurveSvg.fMin.toFixed(0)} Hz
                  </text>
                  <text x="310" y="270" fill="#a855f7" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                    f₀ = {f0.toFixed(1)} Hz
                  </text>
                  <text x="560" y="270" fill="#64748b" fontSize="10" fontFamily="monospace" textAnchor="end">
                    {resonanceCurveSvg.fMax.toFixed(0)} Hz
                  </text>

                  {/* Graduations Y */}
                  <text x="42" y="45" fill="#64748b" fontSize="10" fontFamily="monospace" textAnchor="end">
                    {(resonanceCurveSvg.iMaxResonance * 1000).toFixed(0)} mA
                  </text>
                  <text x="42" y="250" fill="#64748b" fontSize="10" fontFamily="monospace" textAnchor="end">
                    0 mA
                  </text>

                  {/* Ligne verticale de résonance f0 */}
                  {f0 >= resonanceCurveSvg.fMin && f0 <= resonanceCurveSvg.fMax && (
                    <line
                      x1={50 + ((f0 - resonanceCurveSvg.fMin) / (resonanceCurveSvg.fMax - resonanceCurveSvg.fMin)) * 500}
                      y1="40"
                      x2={50 + ((f0 - resonanceCurveSvg.fMin) / (resonanceCurveSvg.fMax - resonanceCurveSvg.fMin)) * 500}
                      y2="250"
                      stroke="#8b5cf6"
                      strokeWidth="1.5"
                      strokeDasharray="3 3"
                    />
                  )}

                  {/* Courbe de résonance */}
                  <path
                    d={resonanceCurveSvg.path}
                    fill="none"
                    stroke="#a855f7"
                    strokeWidth="2.5"
                  />

                  {/* Curseur de la fréquence imposée actuelle */}
                  {frequency >= resonanceCurveSvg.fMin && frequency <= resonanceCurveSvg.fMax && (
                    <g>
                      <circle
                        cx={50 + ((frequency - resonanceCurveSvg.fMin) / (resonanceCurveSvg.fMax - resonanceCurveSvg.fMin)) * 500}
                        cy={250 - (iPeak / (resonanceCurveSvg.iMaxResonance * 1.15)) * 200}
                        r="6"
                        fill="#38bdf8"
                      />
                      <line
                        x1={50 + ((frequency - resonanceCurveSvg.fMin) / (resonanceCurveSvg.fMax - resonanceCurveSvg.fMin)) * 500}
                        y1="250"
                        x2={50 + ((frequency - resonanceCurveSvg.fMin) / (resonanceCurveSvg.fMax - resonanceCurveSvg.fMin)) * 500}
                        y2={250 - (iPeak / (resonanceCurveSvg.iMaxResonance * 1.15)) * 200}
                        stroke="#38bdf8"
                        strokeWidth="1.5"
                        strokeDasharray="2 2"
                      />
                    </g>
                  )}
                </svg>
              ) : (
                <svg viewBox="0 0 600 300" className="w-full h-full select-none">
                  {/* Grille d'oscilloscope */}
                  {[60, 120, 180, 240].map((y) => (
                    <line key={y} x1="50" y1={y} x2="550" y2={y} stroke="#1e293b" strokeWidth="1" strokeDasharray="2 4" />
                  ))}
                  <line x1="50" y1="150" x2="550" y2="150" stroke="#334155" strokeWidth="1.5" />

                  {/* Trace Voie 1 : u(t) (Violet) */}
                  <path d={oscilloscopePaths.pathU} fill="none" stroke="#a855f7" strokeWidth="2.5" />

                  {/* Trace Voie 2 : i(t) (Cyan) */}
                  <path d={oscilloscopePaths.pathI} fill="none" stroke="#06b6d4" strokeWidth="2" strokeDasharray="3 1" />
                </svg>
              )}

              {/* Légende overlay */}
              <div className="absolute top-3 right-3 p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] font-mono text-slate-300 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-violet-400 inline-block" />
                  <span>u(t) = {vPeak} V (crête)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block" />
                  <span>i(t) = {(iPeak * 1000).toFixed(1)} mA</span>
                </div>
              </div>
            </div>
          </div>

          {/* Grille de KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[11px] block">Fréquence f₀</span>
              <div className="text-xl font-bold font-mono text-violet-400">{f0.toFixed(1)} Hz</div>
              <span className="text-[10px] text-slate-500 font-mono block">1 / (2π√(LC))</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[11px] block">Facteur Q</span>
              <div className="text-xl font-bold font-mono text-indigo-400">{qFactor.toFixed(2)}</div>
              <span className="text-[10px] text-slate-500 font-mono block">(1/R)·√(L/C)</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[11px] block">Impédance |Z|</span>
              <div className="text-xl font-bold font-mono text-cyan-400">{impedance.toFixed(1)} Ω</div>
              <span className="text-[10px] text-slate-500 font-mono block">À f = {frequency} Hz</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[11px] block">Bande Δf</span>
              <div className="text-xl font-bold font-mono text-emerald-400">{bandwidth.toFixed(1)} Hz</div>
              <span className="text-[10px] text-slate-500 font-mono block">f₀ / Q (-3 dB)</span>
            </div>
          </div>

          {/* Note TP */}
          <div className="p-4 rounded-2xl bg-violet-950/20 border border-violet-500/20 text-violet-200/90 text-xs leading-relaxed space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-violet-300">
              <Sparkles size={14} />
              <span>Interprétation Physique de Résonance :</span>
            </div>
            <p>
              À la fréquence de résonance exacte f = f₀, la réactance totale s'annule rigoureusement : L·ω₀ - 1 / (C·ω₀) = 0. Le circuit se comporte comme une résistance pure (|Z| = R), le courant atteint sa valeur maximale et est parfaitement en phase avec la tension (φ = 0°).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
