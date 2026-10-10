import { useState, useMemo } from 'react';
import {
  Layers,
  RotateCcw,
  Sparkles,
  SlidersHorizontal,
  GraduationCap,
  FileText,
} from 'lucide-react';
import { PHYSICS_MODULES, PHYSICAL_CONSTANTS } from './physicsData';

export default function QuantumModule({ onExport, onNavigateToExam }) {
  const moduleData = PHYSICS_MODULES.find((m) => m.id === 'quantum');

  // Paramètres réglables (Champs libres)
  const [modelType, setModelType] = useState('box'); // 'box' | 'tunnel'
  const [wellWidthNm, setWellWidthNm] = useState(1.2); // nm
  const [quantumLevel, setQuantumLevel] = useState(2); // n = 1..5
  const [particle, setParticle] = useState('electron'); // 'electron' | 'proton'
  const [energyEv, setEnergyEv] = useState(2.0); // eV (pour effet tunnel)
  const [barrierHeightEv, setBarrierHeightEv] = useState(4.5); // V0 en eV

  const h = PHYSICAL_CONSTANTS.h;
  const hbar = PHYSICAL_CONSTANTS.hbar;
  const eCharge = PHYSICAL_CONSTANTS.e;
  const c = PHYSICAL_CONSTANTS.c;
  const mParticle = particle === 'electron' ? PHYSICAL_CONSTANTS.me : PHYSICAL_CONSTANTS.mp;

  // Conversion largeur en mètres
  const widthMeters = wellWidthNm * 1e-9;

  // Calcul pour le Puits Infini 1D
  // E_n = (n² * h²) / (8 * m * L²)
  const energyLevelJoules = useMemo(() => {
    return (Math.pow(quantumLevel, 2) * Math.pow(h, 2)) / (8 * mParticle * Math.pow(widthMeters, 2));
  }, [quantumLevel, h, mParticle, widthMeters]);

  const energyLevelEv = energyLevelJoules / eCharge;

  // Énergie fondamentale (n=1)
  const groundEnergyEv = useMemo(() => {
    const e1J = (1 * Math.pow(h, 2)) / (8 * mParticle * Math.pow(widthMeters, 2));
    return e1J / eCharge;
  }, [h, mParticle, widthMeters, eCharge]);

  // Émission d'un photon lors d'une transition n -> 1
  const photonEmission = useMemo(() => {
    if (quantumLevel <= 1) return null;
    const deltaE = energyLevelJoules - (groundEnergyEv * eCharge);
    const lambdaMeters = (h * c) / deltaE;
    return {
      deltaEv: energyLevelEv - groundEnergyEv,
      lambdaNm: lambdaMeters * 1e9,
    };
  }, [quantumLevel, energyLevelJoules, groundEnergyEv, energyLevelEv, h, c, eCharge]);

  // Calcul pour l'Effet Tunnel à travers la barrière de potentiel
  // T ≈ exp(-2 * kappa * a) où kappa = sqrt(2m(V0 - E)) / hbar
  const tunnelingCoeff = useMemo(() => {
    if (energyEv >= barrierHeightEv) {
      return 1.0; // Au-dessus de la barrière (régime classique)
    }
    const deltaJoules = (barrierHeightEv - energyEv) * eCharge;
    const kappa = Math.sqrt(2 * mParticle * deltaJoules) / hbar;
    const exponent = 2 * kappa * widthMeters;
    if (exponent > 80) return 0; // Pratiquement nul
    return Math.exp(-exponent);
  }, [energyEv, barrierHeightEv, eCharge, mParticle, hbar, widthMeters]);

  // Longueur d'onde de de Broglie
  const deBroglieNm = useMemo(() => {
    const curEJoules = modelType === 'box' ? energyLevelJoules : energyEv * eCharge;
    const pMomentum = Math.sqrt(2 * mParticle * curEJoules);
    return ((h / pMomentum) * 1e9);
  }, [modelType, energyLevelJoules, energyEv, eCharge, mParticle, h]);

  // Tracé SVG de la fonction d'onde psi(x) et densité |psi(x)|²
  const quantumWaveSvg = useMemo(() => {
    const pointsCount = 80;
    const pathPsi = [];
    const pathProb = [];

    const xStart = 120;
    const xEnd = 480;
    const widthSvg = xEnd - xStart;

    if (modelType === 'box') {
      // psi_n(x) = sqrt(2/L) * sin(n * pi * x / L)
      for (let i = 0; i <= pointsCount; i++) {
        const frac = i / pointsCount;
        const xSvg = xStart + frac * widthSvg;
        const angle = quantumLevel * Math.PI * frac;
        const psiVal = Math.sin(angle);
        const probVal = psiVal * psiVal;

        const ySvgPsi = 150 - psiVal * 65;
        const ySvgProb = 260 - probVal * 95;

        pathPsi.push(`${i === 0 ? 'M' : 'L'} ${xSvg.toFixed(1)} ${ySvgPsi.toFixed(1)}`);
        pathProb.push(`${i === 0 ? 'M' : 'L'} ${xSvg.toFixed(1)} ${ySvgProb.toFixed(1)}`);
      }
    } else {
      // Effet tunnel : Onde incidente -> Décroissance exponentielle -> Onde transmise atténuée
      const bLeft = 240;
      const bRight = 360;

      for (let i = 0; i <= pointsCount; i++) {
        const frac = i / pointsCount;
        const xSvg = 50 + frac * 500;
        let psiVal;

        if (xSvg < bLeft) {
          // Onde incidente + réfléchie
          const phase = (xSvg - 50) * 0.12;
          psiVal = Math.sin(phase) * 55;
        } else if (xSvg >= bLeft && xSvg <= bRight) {
          // Atténuation exponentielle
          const decayFrac = (xSvg - bLeft) / (bRight - bLeft);
          const atten = Math.exp(-decayFrac * 2.8);
          psiVal = Math.sin((bLeft - 50) * 0.12) * 55 * atten;
        } else {
          // Onde transmise atténuée
          const tAmp = Math.max(0.05, Math.sqrt(tunnelingCoeff));
          const phase = (xSvg - bRight) * 0.12 + (bLeft - 50) * 0.12;
          psiVal = Math.sin(phase) * 55 * tAmp;
        }

        const ySvg = 150 - psiVal;
        pathPsi.push(`${i === 0 ? 'M' : 'L'} ${xSvg.toFixed(1)} ${ySvg.toFixed(1)}`);
      }
    }

    return {
      xStart,
      xEnd,
      pathPsi: pathPsi.join(' '),
      pathProb: pathProb.join(' '),
    };
  }, [modelType, quantumLevel, tunnelingCoeff]);

  const handleExportClick = () => {
    onExport({
      moduleData,
      currentParams: {
        'Modèle quantique': modelType === 'box' ? 'Puits de Potentiel Infini 1D' : 'Effet Tunnel à travers Barrière',
        'Largeur spatiale (L)': `${wellWidthNm} nm (${(widthMeters * 1e10).toFixed(1)} Å)`,
        'Particule confinée': particle === 'electron' ? 'Électron (me = 9.11×10⁻³¹ kg)' : 'Proton (mp = 1.67×10⁻²⁷ kg)',
        ...(modelType === 'box'
          ? { 'Nombre quantique principal (n)': `${quantumLevel}` }
          : {
              'Énergie particule incidente (E)': `${energyEv} eV`,
              'Hauteur de barrière (V₀)': `${barrierHeightEv} eV`,
            }),
      },
      computedResults: {
        ...(modelType === 'box'
          ? {
              'Énergie du niveau propre (E_n)': {
                val: energyLevelEv < 1000 ? energyLevelEv.toFixed(3) : energyLevelEv.toExponential(3),
                unit: 'eV',
                comment: `Soit ${(energyLevelJoules).toExponential(3)} Joules`,
              },
              'Énergie fondamentale de repos (E₁)': {
                val: groundEnergyEv.toFixed(3),
                unit: 'eV',
                comment: 'Principe d\'incertitude d\'Heisenberg Δx·Δp ≥ ℏ/2',
              },
              'Transition quantique n → 1': {
                val: photonEmission ? `${photonEmission.deltaEv.toFixed(2)} eV (λ = ${photonEmission.lambdaNm.toFixed(1)} nm)` : 'État fondamental',
                unit: '',
                comment: 'Émission de photon',
              },
            }
          : {
              'Probabilité de Transmission T': {
                val: tunnelingCoeff < 1e-4 ? tunnelingCoeff.toExponential(3) : `${(tunnelingCoeff * 100).toFixed(2)}%`,
                unit: '',
                comment: 'Coefficient d\'effet tunnel WKB exp(-2κa)',
              },
              'Réflectance quantique R': {
                val: `${((1 - tunnelingCoeff) * 100).toFixed(2)}%`,
                unit: '',
                comment: 'R = 1 - T',
              },
            }),
        'Longueur d\'onde de de Broglie (λ_dB)': {
          val: deBroglieNm.toFixed(3),
          unit: 'nm',
          comment: 'λ = h / p',
        },
      },
    });
  };

  const handlePresetSelect = (preset) => {
    setModelType(preset.wellType);
    setWellWidthNm(preset.wellWidthNm);
    setQuantumLevel(preset.quantumLevel);
    setEnergyEv(preset.energyEv);
    setBarrierHeightEv(preset.barrierHeightEv);
    setParticle(preset.particle);
  };

  const handleReset = () => {
    setModelType('box');
    setWellWidthNm(1.2);
    setQuantumLevel(2);
    setParticle('electron');
    setEnergyEv(2.0);
    setBarrierHeightEv(4.5);
  };

  return (
    <div className="space-y-6 text-left">
      {/* En-tête */}
      <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-violet-600/20 text-violet-400 border border-violet-500/30 flex items-center justify-center shrink-0">
            <Layers size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-violet-500/10 text-violet-400 border border-violet-500/20">
                PHY401 · M1-M2
              </span>
              <span className="text-xs text-slate-400">Avancé</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white mt-0.5">
              Physique Quantique : Puits de Potentiel & Effet Tunnel
            </h2>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onNavigateToExam && (
            <button
              type="button"
              onClick={() => onNavigateToExam('quantum')}
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
        {/* Colonne Gauche : Paramètres du système quantique */}
        <div className="lg:col-span-5 space-y-5">
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <SlidersHorizontal size={16} className="text-violet-400" />
                <span>Paramètres Quantiques & Confinement</span>
              </h3>
              <span className="text-[11px] text-slate-400 font-mono">Équation de Schrödinger</span>
            </div>

            {/* Sélecteur de modèle */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Phénomène Quantique :
              </label>
              <div className="grid grid-cols-2 gap-1.5 p-1 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
                <button
                  type="button"
                  onClick={() => setModelType('box')}
                  className={`py-1.5 px-2 rounded-xl text-center font-medium transition-all ${
                    modelType === 'box'
                      ? 'bg-violet-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  Puits Infini 1D
                </button>
                <button
                  type="button"
                  onClick={() => setModelType('tunnel')}
                  className={`py-1.5 px-2 rounded-xl text-center font-medium transition-all ${
                    modelType === 'tunnel'
                      ? 'bg-violet-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  Effet Tunnel (Barrière)
                </button>
              </div>
            </div>

            {/* Presets rapides */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Expériences Modèles :
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

            {/* Choix particule */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Particule en jeu :
              </label>
              <div className="grid grid-cols-2 gap-1.5 p-1 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
                <button
                  type="button"
                  onClick={() => setParticle('electron')}
                  className={`py-1.5 px-2 rounded-xl text-center font-medium transition-all ${
                    particle === 'electron'
                      ? 'bg-violet-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  Électron (mₑ)
                </button>
                <button
                  type="button"
                  onClick={() => setParticle('proton')}
                  className={`py-1.5 px-2 rounded-xl text-center font-medium transition-all ${
                    particle === 'proton'
                      ? 'bg-violet-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  Proton (m_p)
                </button>
              </div>
            </div>

            {/* Largeur spatiale L */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-medium">Largeur de confinement L (nm) :</span>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min="0.1"
                    max="10.0"
                    step="0.1"
                    value={wellWidthNm}
                    onChange={(e) => setWellWidthNm(Math.max(0.1, Number(e.target.value)))}
                    className="w-20 px-2 py-0.5 rounded-lg bg-slate-950 border border-slate-700 text-violet-300 font-mono text-right text-xs focus:outline-none focus:border-violet-500"
                  />
                  <span className="text-slate-400 font-mono">nm</span>
                </div>
              </div>
              <input
                type="range"
                min="0.2"
                max="5.0"
                step="0.05"
                value={wellWidthNm}
                onChange={(e) => setWellWidthNm(Number(e.target.value))}
                className="w-full accent-violet-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
            </div>

            {/* Paramètres selon le modèle */}
            {modelType === 'box' ? (
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-300 font-medium">Niveau quantique principal n :</span>
                  <span className="text-violet-400 font-mono font-bold">n = {quantumLevel}</span>
                </div>
                <div className="grid grid-cols-5 gap-1.5 p-1 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
                  {[1, 2, 3, 4, 5].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setQuantumLevel(lvl)}
                      className={`py-1.5 rounded-xl font-mono font-bold transition-all ${
                        quantumLevel === lvl
                          ? 'bg-violet-600 text-white shadow-md'
                          : 'text-slate-400 hover:text-white hover:bg-slate-900'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-300 font-medium">Énergie particule E (eV) :</span>
                    <span className="text-violet-400 font-mono">{energyEv} eV</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="6.0"
                    step="0.1"
                    value={energyEv}
                    onChange={(e) => setEnergyEv(Number(e.target.value))}
                    className="w-full accent-violet-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-300 font-medium">Hauteur barrière V₀ (eV) :</span>
                    <span className="text-violet-400 font-mono">{barrierHeightEv} eV</span>
                  </div>
                  <input
                    type="range"
                    min="1.0"
                    max="8.0"
                    step="0.1"
                    value={barrierHeightEv}
                    onChange={(e) => setBarrierHeightEv(Number(e.target.value))}
                    className="w-full accent-violet-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Colonne Droite : Visualisation Fonction d'Onde & Densité de Probabilité */}
        <div className="lg:col-span-7 space-y-5">
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Layers size={16} className="text-violet-400" />
                  <span>
                    {modelType === 'box'
                      ? 'Fonction d\'Onde ψₙ(x) & Densité de Probabilité |ψₙ(x)|²'
                      : 'Atténuation Évanescente de l\'Onde par Effet Tunnel'}
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  {modelType === 'box'
                    ? `Quantification spatiale : ${quantumLevel} lobes d'amplitude, ${quantumLevel - 1} nœud(s).`
                    : `Transmission quantique T = ${tunnelingCoeff < 1e-4 ? tunnelingCoeff.toExponential(2) : (tunnelingCoeff * 100).toFixed(2) + '%'}.`}
                </p>
              </div>

              <div className="text-xs font-mono px-3 py-1 rounded-xl bg-slate-950 border border-slate-800 text-violet-300">
                λ_dB = {deBroglieNm.toFixed(2)} nm
              </div>
            </div>

            {/* Représentation SVG */}
            <div className="relative w-full h-72 rounded-2xl bg-slate-950 border border-slate-800/90 overflow-hidden flex items-center justify-center">
              <svg viewBox="0 0 600 300" className="w-full h-full select-none">
                {modelType === 'box' ? (
                  <>
                    {/* Parois de potentiel infini à gauche et à droite */}
                    <rect x="0" y="20" width="120" height="260" fill="#0f172a" />
                    <line x1="120" y1="20" x2="120" y2="280" stroke="#ef4444" strokeWidth="2.5" />
                    <text x="60" y="155" fill="#f87171" fontSize="10" fontFamily="monospace" textAnchor="middle">
                      V(x) = +∞
                    </text>

                    <rect x="480" y="20" width="120" height="260" fill="#0f172a" />
                    <line x1="480" y1="20" x2="480" y2="280" stroke="#ef4444" strokeWidth="2.5" />
                    <text x="540" y="155" fill="#f87171" fontSize="10" fontFamily="monospace" textAnchor="middle">
                      V(x) = +∞
                    </text>

                    {/* Axe central zéro */}
                    <line x1="120" y1="150" x2="480" y2="150" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />

                    {/* Trace de psi_n(x) */}
                    <path
                      d={quantumWaveSvg.pathPsi}
                      fill="none"
                      stroke="#c084fc"
                      strokeWidth="2.5"
                    />

                    {/* Annotations */}
                    <text x="125" y="275" fill="#64748b" fontSize="10" fontFamily="monospace">x = 0</text>
                    <text x="445" y="275" fill="#64748b" fontSize="10" fontFamily="monospace">x = L ({wellWidthNm} nm)</text>
                  </>
                ) : (
                  <>
                    {/* Barrière de potentiel finie */}
                    <rect x="240" y="50" width="120" height="200" fill="#1e1b4b" fillOpacity="0.6" stroke="#8b5cf6" strokeWidth="1.5" strokeDasharray="4 2" />
                    <text x="300" y="40" fill="#c084fc" fontSize="11" fontFamily="sans-serif" textAnchor="middle" fontWeight="bold">
                      Barrière V₀ = {barrierHeightEv} eV
                    </text>

                    {/* Ligne d'énergie de la particule E */}
                    <line x1="50" y1="150" x2="550" y2="150" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />

                    {/* Onde avec transition exponentielle */}
                    <path
                      d={quantumWaveSvg.pathPsi}
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="2.5"
                    />

                    <text x="120" y="230" fill="#94a3b8" fontSize="10" fontFamily="sans-serif">
                      Onde Incidente
                    </text>
                    <text x="430" y="230" fill="#94a3b8" fontSize="10" fontFamily="sans-serif">
                      Onde Transmise Atténuée
                    </text>
                  </>
                )}
              </svg>

              {/* Ticker d'information */}
              <div className="absolute top-3 right-3 p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] font-mono text-slate-300 space-y-0.5">
                <div>E_{'{'}{quantumLevel}{'}'} = <span className="text-violet-400 font-bold">{energyLevelEv.toFixed(3)} eV</span></div>
                <div>E_fondam = {groundEnergyEv.toFixed(3)} eV</div>
                <div>Particule = {particle}</div>
              </div>
            </div>
          </div>

          {/* Grille de KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[11px] block">Énergie Propre E_n</span>
              <div className="text-xl font-bold font-mono text-violet-400">
                {energyLevelEv < 1000 ? energyLevelEv.toFixed(2) : energyLevelEv.toExponential(2)} eV
              </div>
              <span className="text-[10px] text-slate-500 font-mono block">Niveau n = {quantumLevel}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[11px] block">Longueur de de Broglie</span>
              <div className="text-xl font-bold font-mono text-indigo-400">
                {deBroglieNm.toFixed(2)} nm
              </div>
              <span className="text-[10px] text-slate-500 font-mono block">λ = h / p</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[11px] block">
                {modelType === 'box' ? 'Photon Émis n→1' : 'Transmission Tunnel'}
              </span>
              <div className="text-xl font-bold font-mono text-cyan-400">
                {modelType === 'box'
                  ? photonEmission ? `${photonEmission.lambdaNm.toFixed(0)} nm` : '—'
                  : tunnelingCoeff < 1e-4 ? tunnelingCoeff.toExponential(1) : `${(tunnelingCoeff * 100).toFixed(1)}%`}
              </div>
              <span className="text-[10px] text-slate-500 font-mono block">
                {modelType === 'box' ? 'Raie spectrale' : 'Probabilité T'}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[11px] block">Énergie du Fondamental</span>
              <div className="text-xl font-bold font-mono text-emerald-400">
                {groundEnergyEv.toFixed(2)} eV
              </div>
              <span className="text-[10px] text-slate-500 font-mono block">Niveau n = 1 (zéro absolu)</span>
            </div>
          </div>

          {/* Synthèse Pédagogique */}
          <div className="p-4 rounded-2xl bg-violet-950/20 border border-violet-500/20 text-violet-200/90 text-xs leading-relaxed space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-violet-300">
              <Sparkles size={14} />
              <span>Postulat de la Mécanique Quantique & Confinement :</span>
            </div>
            <p>
              Contrairement à la physique classique où une particule au repos peut posséder une énergie nulle, le principe d'indétermination d'Heisenberg impose à toute particule confinée sur une dimension $L$ une énergie résiduelle incompressible $E_1 = h^2 / (8mL^2) &gt; 0$ dite « énergie de point zéro ».
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
