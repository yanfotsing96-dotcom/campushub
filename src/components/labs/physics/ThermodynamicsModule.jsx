import { useState, useMemo } from 'react';
import {
  Flame,
  RotateCcw,
  Download,
  Sparkles,
  SlidersHorizontal,
} from 'lucide-react';
import { PHYSICS_MODULES, PHYSICAL_CONSTANTS } from './physicsData';

export default function ThermodynamicsModule({ onExport }) {
  const moduleData = PHYSICS_MODULES.find((m) => m.id === 'thermodynamics');

  // Paramètres réglables (Champs libres)
  const [cycleType, setCycleType] = useState('carnot'); // 'carnot' | 'otto' | 'stirling'
  const [tempHot, setTempHot] = useState(750); // Kelvin
  const [tempCold, setTempCold] = useState(300); // Kelvin
  const [compressionRatio, setCompressionRatio] = useState(8.5); // r = V1 / V2
  const [gamma, setGamma] = useState(1.4); // Cp / Cv
  const [moles, setMoles] = useState(0.08); // mol
  const [vMinLiters, setVMinLiters] = useState(0.5); // L (volume à compression max)

  const R = PHYSICAL_CONSTANTS.R_gas;

  // Calculs thermodynamiques
  // Carnot : 2 isothermes (TH, TC) + 2 adiabatiques réversibles (isentropiques)
  const carnotEfficiency = 1 - tempCold / tempHot;

  // Otto : 2 isochores + 2 adiabatiques (rendement = 1 - r^(1-gamma))
  const ottoEfficiency = 1 - Math.pow(compressionRatio, 1 - gamma);

  // Rendement effectif du cycle sélectionné
  const actualEfficiency = useMemo(() => {
    if (cycleType === 'carnot') return carnotEfficiency;
    if (cycleType === 'otto') return Math.min(carnotEfficiency, ottoEfficiency);
    // Stirling idéal (isothermes + isochores régénérées) : égal à Carnot
    return carnotEfficiency * 0.88; // Rendement pratique avec efficacité d'échangeur
  }, [cycleType, carnotEfficiency, ottoEfficiency]);

  // Volume min et max en m³
  const vMinM3 = vMinLiters * 1e-3;
  const vMaxM3 = vMinM3 * compressionRatio;

  // Calcul des 4 points d'état (P en bar, V en litres) selon le cycle
  const cycleStates = useMemo(() => {
    // État 1 : Basse pression, basse température, grand volume (V_max, T_cold)
    const p1Pa = (moles * R * tempCold) / vMaxM3;
    const p1Bar = p1Pa / 1e5;

    let p2Bar, p3Bar, p4Bar;
    let v1L = vMaxM3 * 1000;
    let v2L = vMinM3 * 1000;
    let v3L, v4L;

    if (cycleType === 'otto') {
      // 1 -> 2 : Compression adiabatique : T2 = T1 * r^(gamma-1)
      const t2 = tempCold * Math.pow(compressionRatio, gamma - 1);
      const p2Pa = (moles * R * t2) / vMinM3;
      p2Bar = p2Pa / 1e5;
      v3L = v2L; // combustion isochore
      // 2 -> 3 : Échauffement isochore jusqu'à T_hot
      const p3Pa = (moles * R * tempHot) / vMinM3;
      p3Bar = p3Pa / 1e5;
      // 3 -> 4 : Détente adiabatique jusqu'à V_max : T4 = T3 / r^(gamma-1)
      const t4 = tempHot / Math.pow(compressionRatio, gamma - 1);
      const p4Pa = (moles * R * t4) / vMaxM3;
      p4Bar = p4Pa / 1e5;
      v4L = v1L;
    } else {
      // Carnot / Stirling approximation
      // Point 2 : comprimé à T_hot
      const p2Pa = (moles * R * tempHot) / vMinM3;
      p2Bar = p2Pa / 1e5;
      // Point 3 : détendu à T_hot
      const v3M3 = vMinM3 * (compressionRatio * 0.55);
      v3L = v3M3 * 1000;
      const p3Pa = (moles * R * tempHot) / v3M3;
      p3Bar = p3Pa / 1e5;
      // Point 4 : détendu à T_cold
      v4L = v1L;
      p4Bar = p1Bar * 1.6;
    }

    return {
      p1: Math.max(0.5, p1Bar),
      p2: Math.max(1.0, p2Bar),
      p3: Math.max(1.5, p3Bar),
      p4: Math.max(0.8, p4Bar),
      v1: v1L,
      v2: v2L,
      v3: v3L,
      v4: v4L,
    };
  }, [moles, R, tempCold, tempHot, vMaxM3, vMinM3, compressionRatio, gamma, cycleType]);

  // Énergie thermique reçue Q_hot et travail net W_net (Joules)
  const thermalEnergy = useMemo(() => {
    // Estimation d'ordre de grandeur réaliste pour la masse de fluide
    const cv = R / (gamma - 1);
    const qHot = moles * cv * (tempHot - tempCold) * 1.5;
    const wNet = qHot * actualEfficiency;
    const qCold = qHot - wNet;

    return {
      qHot,
      wNet,
      qCold,
    };
  }, [moles, R, gamma, tempHot, tempCold, actualEfficiency]);

  // SVG Clapeyron P-V path
  const clapeyronSvg = useMemo(() => {
    const maxV = cycleStates.v1 * 1.25;
    const maxP = cycleStates.p3 * 1.25;

    const toSvgX = (v) => 60 + (v / maxV) * 480;
    const toSvgY = (p) => 250 - (p / maxP) * 200;

    const pt1 = { x: toSvgX(cycleStates.v1), y: toSvgY(cycleStates.p1) };
    const pt2 = { x: toSvgX(cycleStates.v2), y: toSvgY(cycleStates.p2) };
    const pt3 = { x: toSvgX(cycleStates.v3), y: toSvgY(cycleStates.p3) };
    const pt4 = { x: toSvgX(cycleStates.v4), y: toSvgY(cycleStates.p4) };

    const closedPath = `M ${pt1.x.toFixed(1)} ${pt1.y.toFixed(1)} L ${pt2.x.toFixed(1)} ${pt2.y.toFixed(1)} L ${pt3.x.toFixed(1)} ${pt3.y.toFixed(1)} L ${pt4.x.toFixed(1)} ${pt4.y.toFixed(1)} Z`;

    return {
      maxV,
      maxP,
      pt1,
      pt2,
      pt3,
      pt4,
      closedPath,
    };
  }, [cycleStates]);

  const handleExportClick = () => {
    onExport({
      moduleData,
      currentParams: {
        'Type de cycle': cycleType.toUpperCase(),
        'Température source chaude (T_C)': `${tempHot} K (${tempHot - 273}°C)`,
        'Température source froide (T_F)': `${tempCold} K (${tempCold - 273}°C)`,
        'Taux de compression (r = V1/V2)': `${compressionRatio}`,
        'Coefficient adiabatique (γ)': `${gamma}`,
        'Quantité de matière (n)': `${moles} mol`,
      },
      computedResults: {
        'Rendement théorique maximal de Carnot (η_Carnot)': {
          val: `${(carnotEfficiency * 100).toFixed(1)}%`,
          unit: '',
          comment: '1 - (T_F / T_C)',
        },
        'Rendement thermique effectif du cycle (η)': {
          val: `${(actualEfficiency * 100).toFixed(1)}%`,
          unit: '',
          comment: `W_net / Q_C (${cycleType})`,
        },
        'Travail mécanique net fourni (W_net)': {
          val: thermalEnergy.wNet.toFixed(1),
          unit: 'J / cycle',
          comment: 'Aire intégrée du cycle dans le plan P-V',
        },
        'Chaleur reçue de la source chaude (Q_C)': {
          val: thermalEnergy.qHot.toFixed(1),
          unit: 'J / cycle',
          comment: 'Transfert thermique moteur',
        },
        'Chaleur cédée à la source froide (Q_F)': {
          val: thermalEnergy.qCold.toFixed(1),
          unit: 'J / cycle',
          comment: 'Pertes inévitables au condenseur/échappement',
        },
        'Pression maximale atteinte (P_max)': {
          val: cycleStates.p3.toFixed(2),
          unit: 'bar',
          comment: 'Au point d\'allumage / combustion',
        },
      },
    });
  };

  const handlePresetSelect = (preset) => {
    setCycleType(preset.cycleType);
    setTempHot(preset.tempHot);
    setTempCold(preset.tempCold);
    setCompressionRatio(preset.compressionRatio);
    setGamma(preset.gamma);
    setMoles(preset.moles);
  };

  const handleReset = () => {
    setCycleType('carnot');
    setTempHot(750);
    setTempCold(300);
    setCompressionRatio(8.5);
    setGamma(1.4);
    setMoles(0.08);
  };

  return (
    <div className="space-y-6 text-left">
      {/* En-tête */}
      <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shrink-0">
            <Flame size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                PHY302 · L3-M1
              </span>
              <span className="text-xs text-slate-400">Avancé</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white mt-0.5">
              Thermodynamique & Cycles Moteurs Thermiques
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
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
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-1.5"
          >
            <Download size={14} />
            <span>Générer Rapport TP (.md)</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Colonne Gauche : Paramètres du cycle et thermostats */}
        <div className="lg:col-span-5 space-y-5">
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <SlidersHorizontal size={16} className="text-indigo-400" />
                <span>Sources Thermiques & Gaz</span>
              </h3>
              <span className="text-[11px] text-slate-400 font-mono">Thermostats & Compression</span>
            </div>

            {/* Choix du cycle */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Architecture de Cycle Moteur :
              </label>
              <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
                {[
                  { id: 'carnot', label: 'Carnot Idéal' },
                  { id: 'otto', label: 'Beau de Rochas' },
                  { id: 'stirling', label: 'Stirling' },
                ].map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCycleType(c.id)}
                    className={`py-1.5 px-2 rounded-xl text-center font-medium transition-all ${
                      cycleType === c.id
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Presets rapides */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Configurations Types :
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

            {/* Température Source Chaude T_hot */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-medium">Température Source Chaude T_C (K) :</span>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min="350"
                    max="2200"
                    step="10"
                    value={tempHot}
                    onChange={(e) => setTempHot(Math.max(tempCold + 20, Number(e.target.value)))}
                    className="w-20 px-2 py-0.5 rounded-lg bg-slate-950 border border-slate-700 text-indigo-300 font-mono text-right text-xs focus:outline-none focus:border-indigo-500"
                  />
                  <span className="text-slate-400 font-mono">K</span>
                </div>
              </div>
              <input
                type="range"
                min="400"
                max="1800"
                step="10"
                value={tempHot}
                onChange={(e) => setTempHot(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
            </div>

            {/* Température Source Froide T_cold */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-medium">Température Source Froide T_F (K) :</span>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min="150"
                    max="500"
                    step="5"
                    value={tempCold}
                    onChange={(e) => setTempCold(Math.min(tempHot - 20, Number(e.target.value)))}
                    className="w-20 px-2 py-0.5 rounded-lg bg-slate-950 border border-slate-700 text-indigo-300 font-mono text-right text-xs focus:outline-none focus:border-indigo-500"
                  />
                  <span className="text-slate-400 font-mono">K</span>
                </div>
              </div>
              <input
                type="range"
                min="200"
                max="450"
                step="5"
                value={tempCold}
                onChange={(e) => setTempCold(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
            </div>

            {/* Taux de compression r */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-medium">Taux de compression volumétrique r :</span>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min="3"
                    max="22"
                    step="0.5"
                    value={compressionRatio}
                    onChange={(e) => setCompressionRatio(Math.max(3, Number(e.target.value)))}
                    className="w-20 px-2 py-0.5 rounded-lg bg-slate-950 border border-slate-700 text-indigo-300 font-mono text-right text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
              <input
                type="range"
                min="3"
                max="18"
                step="0.5"
                value={compressionRatio}
                onChange={(e) => setCompressionRatio(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
            </div>

            {/* Volume minimal de la chambre V_min */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-medium">Volume minimal de chambre V_min (L) :</span>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min="0.1"
                    max="5.0"
                    step="0.1"
                    value={vMinLiters}
                    onChange={(e) => setVMinLiters(Math.max(0.1, Number(e.target.value)))}
                    className="w-20 px-2 py-0.5 rounded-lg bg-slate-950 border border-slate-700 text-indigo-300 font-mono text-right text-xs focus:outline-none focus:border-indigo-500"
                  />
                  <span className="text-slate-400 font-mono">L</span>
                </div>
              </div>
              <input
                type="range"
                min="0.1"
                max="2.5"
                step="0.1"
                value={vMinLiters}
                onChange={(e) => setVMinLiters(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Colonne Droite : Diagramme Clapeyron P-V & KPIs */}
        <div className="lg:col-span-7 space-y-5">
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Flame size={16} className="text-indigo-400" />
                  <span>Diagramme Indicateur de Clapeyron (P - V)</span>
                </h3>
                <p className="text-xs text-slate-400">
                  L'aire intérieure fermée représente le travail mécanique net W_net = ∮ P dV.
                </p>
              </div>

              <div className="text-xs font-mono px-3 py-1 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 font-bold">
                η = {(actualEfficiency * 100).toFixed(1)}%
              </div>
            </div>

            {/* Graphique SVG P-V */}
            <div className="relative w-full h-72 rounded-2xl bg-slate-950 border border-slate-800/90 overflow-hidden flex items-center justify-center">
              <svg viewBox="0 0 600 300" className="w-full h-full select-none">
                <defs>
                  <linearGradient id="pvFill" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.1" />
                  </linearGradient>
                </defs>

                {/* Axes P et V */}
                <line x1="60" y1="250" x2="560" y2="250" stroke="#334155" strokeWidth="1.5" />
                <line x1="60" y1="30" x2="60" y2="250" stroke="#334155" strokeWidth="1.5" />

                {/* Étiquettes d'axes */}
                <text x="560" y="270" fill="#94a3b8" fontSize="10" fontFamily="monospace" textAnchor="end">
                  Volume V (Litres)
                </text>
                <text x="50" y="35" fill="#94a3b8" fontSize="10" fontFamily="monospace" textAnchor="end">
                  P (bar)
                </text>

                {/* Surface fermée du travail utile */}
                <path d={clapeyronSvg.closedPath} fill="url(#pvFill)" stroke="#818cf8" strokeWidth="2.5" />

                {/* Sommets 1, 2, 3, 4 */}
                {[
                  { pt: clapeyronSvg.pt1, label: '1 (Admission)', p: cycleStates.p1 },
                  { pt: clapeyronSvg.pt2, label: '2 (Comprimé)', p: cycleStates.p2 },
                  { pt: clapeyronSvg.pt3, label: '3 (Allumage)', p: cycleStates.p3 },
                  { pt: clapeyronSvg.pt4, label: '4 (Détendu)', p: cycleStates.p4 },
                ].map((s, idx) => (
                  <g key={idx}>
                    <circle cx={s.pt.x} cy={s.pt.y} r="5" fill="#38bdf8" />
                    <text
                      x={s.pt.x + (idx === 1 ? -12 : 8)}
                      y={s.pt.y - 8}
                      fill="#e2e8f0"
                      fontSize="9"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {s.label} ({s.p.toFixed(1)} b)
                    </text>
                  </g>
                ))}
              </svg>

              {/* Ticker d'information */}
              <div className="absolute top-3 right-3 p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] font-mono text-slate-300 space-y-0.5">
                <div>W_net = <span className="text-emerald-400 font-bold">{thermalEnergy.wNet.toFixed(1)} J</span></div>
                <div>Q_chaud = {thermalEnergy.qHot.toFixed(1)} J</div>
                <div>Taux r = {compressionRatio}:1</div>
              </div>
            </div>
          </div>

          {/* Grille de KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[11px] block">Rendement Carnot</span>
              <div className="text-xl font-bold font-mono text-indigo-400">
                {(carnotEfficiency * 100).toFixed(1)}%
              </div>
              <span className="text-[10px] text-slate-500 font-mono block">1 - (T_F / T_C)</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[11px] block">Rendement Cycle</span>
              <div className="text-xl font-bold font-mono text-emerald-400">
                {(actualEfficiency * 100).toFixed(1)}%
              </div>
              <span className="text-[10px] text-slate-500 font-mono block">W_net / Q_C</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[11px] block">Travail Net W</span>
              <div className="text-xl font-bold font-mono text-cyan-400">
                {thermalEnergy.wNet.toFixed(1)} J
              </div>
              <span className="text-[10px] text-slate-500 font-mono block">Par cycle</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[11px] block">Pression Max</span>
              <div className="text-xl font-bold font-mono text-violet-400">
                {cycleStates.p3.toFixed(1)} bar
              </div>
              <span className="text-[10px] text-slate-500 font-mono block">Point 3</span>
            </div>
          </div>

          {/* Synthèse Pédagogique */}
          <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/20 text-indigo-200/90 text-xs leading-relaxed space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-indigo-300">
              <Sparkles size={14} />
              <span>Théorème Fondamental de Carnot (Second Principe) :</span>
            </div>
            <p>
              Aucun moteur thermique fonctionnant entre deux thermostats aux températures T_C et T_F ne peut excéder le rendement de Carnot η_Carnot = 1 - T_F / T_C. Pour maximiser l'efficacité énergétique, les ingénieurs cherchent à élever au maximum la température de combustion T_C tout en maintenant la détente la plus complète possible.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
