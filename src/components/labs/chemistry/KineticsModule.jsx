import { useState, useMemo, useCallback } from 'react';
import {
  Activity,
  Zap,
} from 'lucide-react';
import { KINETIC_PRESETS } from './chemistryData';

export default function KineticsModule() {
  const [selectedPresetId, setSelectedPresetId] = useState(KINETIC_PRESETS[0].id);

  const activePreset = useMemo(() => {
    return KINETIC_PRESETS.find((p) => p.id === selectedPresetId) || KINETIC_PRESETS[0];
  }, [selectedPresetId]);

  // Ordre de réaction (0, 1 ou 2)
  const [order, setOrder] = useState(activePreset.order);
  const [initialA0, setInitialA0] = useState(activePreset.defaultA0); // mol/L
  const [temperatureK, setTemperatureK] = useState(298.15); // Kelvin
  const [hasCatalyst, setHasCatalyst] = useState(false);
  const [currentTimeSec, setCurrentTimeSec] = useState(15); // Temps t actuel d'analyse

  // Synchronisation lors du choix de preset
  const handleSelectPreset = (preset) => {
    setSelectedPresetId(preset.id);
    setOrder(preset.order);
    setInitialA0(preset.defaultA0);
  };

  const R = 8.314; // J/(mol·K)
  const effectiveEa = hasCatalyst ? activePreset.catalystEa : activePreset.ea; // kJ/mol

  // Calcul de la constante de vitesse k via Arrhenius corrigé
  const kRate = useMemo(() => {
    // k = A * exp(-Ea / (R * T))
    // Facteur pré-exponentiel calibré selon l'ordre
    const A = order === 0 ? 1e12 : order === 1 ? 5e11 : 2e9;
    const ea_J = effectiveEa * 1000;
    const computed = A * Math.exp(-ea_J / (R * temperatureK));

    // Normalisation pour affichage et échelle de TP réaliste (en secondes)
    const normalized = Math.max(0.001, Math.min(2.5, computed * 1e-1));
    return Number(normalized.toFixed(4));
  }, [effectiveEa, temperatureK, order]);

  // Calcul de la demi-vie t_1/2
  const halfLifeAnalysis = useMemo(() => {
    let tHalf = 0;
    if (order === 0) {
      tHalf = initialA0 / (2 * kRate);
    } else if (order === 1) {
      tHalf = Math.log(2) / kRate;
    } else if (order === 2) {
      tHalf = 1 / (kRate * initialA0);
    }
    return Math.max(0.1, Number(tHalf.toFixed(2)));
  }, [order, initialA0, kRate]);

  // Fonction de calcul de [A](t)
  const getConcentrationAtTime = useCallback(
    (t) => {
      if (order === 0) {
        return Math.max(0, initialA0 - kRate * t);
      } else if (order === 1) {
        return initialA0 * Math.exp(-kRate * t);
      } else if (order === 2) {
        return initialA0 / (1 + kRate * initialA0 * t);
      }
      return 0;
    },
    [order, initialA0, kRate]
  );

  const currentConcentration = Number(getConcentrationAtTime(currentTimeSec).toFixed(4));

  // Vitesse instantanée v = -d[A]/dt = k * [A]^n
  const instantaneousRate = useMemo(() => {
    const conc = currentConcentration;
    if (order === 0) return conc > 0 ? kRate : 0;
    if (order === 1) return kRate * conc;
    if (order === 2) return kRate * Math.pow(conc, 2);
    return 0;
  }, [order, kRate, currentConcentration]);

  // Génération de 50 points de courbe sur un intervalle [0, maxTime]
  const maxTime = Math.max(60, Number((halfLifeAnalysis * 3.5).toFixed(0)));
  const curvePoints = useMemo(() => {
    const points = [];
    const steps = 50;
    const dt = maxTime / steps;
    for (let i = 0; i <= steps; i++) {
      const t = i * dt;
      const conc = getConcentrationAtTime(t);
      points.push({ t, conc });
    }
    return points;
  }, [maxTime, getConcentrationAtTime]);

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
            <Activity size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-violet-500/20 text-violet-300 border border-violet-500/30 font-mono">
                L3 · MASTER AVANCÉ
              </span>
              <span className="text-xs text-slate-400">Cinétique Formelle, Lois de Vitesse & Arrhenius</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Cinétique Chimique & Vitesses de Réaction
            </h2>
          </div>
        </div>

        {/* Sélecteur d'Ordre de Réaction */}
        <div className="flex items-center p-1 rounded-xl bg-slate-950 border border-slate-800">
          {[0, 1, 2].map((ord) => (
            <button
              key={ord}
              type="button"
              onClick={() => setOrder(ord)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all ${
                order === ord
                  ? 'bg-violet-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Ordre {ord}
            </button>
          ))}
        </div>
      </div>

      {/* Sélecteur de Réaction Modèle */}
      <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <label className="text-xs font-medium text-slate-400">
            Réactions Modèles de Cinétique Expérimentale :
          </label>

          {/* Toggle Catalyseur */}
          <button
            type="button"
            onClick={() => setHasCatalyst(!hasCatalyst)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all ${
              hasCatalyst
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-md shadow-emerald-900/20'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Zap size={14} className={hasCatalyst ? 'text-emerald-400' : 'text-slate-500'} />
            <span>{hasCatalyst ? 'Catalyseur Actif (-Ea)' : 'Ajouter un Catalyseur'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {KINETIC_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleSelectPreset(preset)}
              className={`p-3 rounded-xl border text-left transition-all ${
                selectedPresetId === preset.id
                  ? 'bg-violet-950/60 border-violet-500 text-white'
                  : 'bg-slate-950/50 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-violet-400">
                  Ordre {preset.order}
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  Ea = {preset.ea} kJ/mol
                </span>
              </div>
              <div className="text-xs font-bold truncate mt-1">{preset.name}</div>
              <div className="text-[11px] font-mono text-slate-400 truncate mt-0.5">
                {preset.equation}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Paramètres & Sliders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-5">
          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 backdrop-blur-xl space-y-4">
            <h3 className="text-sm font-semibold text-slate-200 border-b border-slate-800 pb-2">
              Paramètres Opératoires
            </h3>

            {/* Concentration Initiale [A]0 */}
            <div className="space-y-1.5 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-medium">Concentration Initiale [A]₀ :</span>
                <span className="font-mono text-violet-400 font-bold text-sm">
                  {initialA0.toFixed(2)} mol/L
                </span>
              </div>
              <input
                type="range"
                min="0.1"
                max="2.0"
                step="0.05"
                value={initialA0}
                onChange={(e) => setInitialA0(parseFloat(e.target.value))}
                className="w-full accent-violet-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
            </div>

            {/* Température T (Effet Arrhenius) */}
            <div className="space-y-1.5 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-medium">Température (Arrhenius) :</span>
                <span className="font-mono text-cyan-400 font-bold text-sm">
                  {temperatureK.toFixed(0)} K ({(temperatureK - 273.15).toFixed(0)} °C)
                </span>
              </div>
              <input
                type="range"
                min="273"
                max="373"
                step="1"
                value={temperatureK}
                onChange={(e) => setTemperatureK(parseFloat(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
            </div>

            {/* Curseur de Temps t */}
            <div className="space-y-1.5 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-medium">Instant d'analyse (t) :</span>
                <span className="font-mono text-emerald-400 font-bold text-sm">
                  {currentTimeSec} s
                </span>
              </div>
              <input
                type="range"
                min="0"
                max={maxTime}
                step="1"
                value={currentTimeSec}
                onChange={(e) => setCurrentTimeSec(parseFloat(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
            </div>
          </div>

          {/* Formules de l'ordre actif */}
          <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 text-xs space-y-2.5 font-mono">
            <div className="text-violet-300 font-bold font-sans">
              Équations Intégrées · Ordre {order}
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">
              {order === 0 && 'Loi intégrée : [A]t = [A]₀ − k·t'}
              {order === 1 && 'Loi intégrée : [A]t = [A]₀ · exp(−k·t)'}
              {order === 2 && 'Loi intégrée : 1/[A]t = 1/[A]₀ + k·t'}
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">
              {order === 0 && 'Temps de demi-vie : t½ = [A]₀ / (2k)'}
              {order === 1 && 'Temps de demi-vie : t½ = ln(2) / k (Indépendant de [A]₀)'}
              {order === 2 && 'Temps de demi-vie : t½ = 1 / (k·[A]₀)'}
            </div>
          </div>
        </div>

        {/* Tracé Courbe [A](t) & Statistiques Cinétiques */}
        <div className="lg:col-span-7 space-y-5">
          {/* Métriques Clés */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400">Constante k</span>
              <div className="text-xl font-bold font-mono text-cyan-300 mt-1">
                {kRate}
              </div>
              <span className="text-[10px] text-slate-500 font-mono">{activePreset.unitK}</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400">Demi-vie t½</span>
              <div className="text-xl font-bold font-mono text-violet-300 mt-1">
                {halfLifeAnalysis} s
              </div>
              <span className="text-[10px] text-slate-500">50% dégradé</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400">Vitesse v(t)</span>
              <div className="text-xl font-bold font-mono text-emerald-300 mt-1">
                {instantaneousRate.toExponential(2)}
              </div>
              <span className="text-[10px] text-slate-500 font-mono">mol/(L·s)</span>
            </div>
          </div>

          {/* Graphique SVG Interactif [A] = f(t) */}
          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 backdrop-blur-xl space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-200">
                Évolution de la Concentration : [A] = f(t)
              </span>
              <span className="font-mono text-violet-400">
                [A]({currentTimeSec}s) = <strong>{currentConcentration} mol/L</strong>
              </span>
            </div>

            <div className="relative h-56 w-full bg-slate-950 rounded-xl border border-slate-800 p-3">
              {/* Tracé SVG de la courbe */}
              <svg viewBox="0 0 500 200" className="w-full h-full">
                {/* Lignes de grille */}
                <line x1="40" y1="20" x2="40" y2="170" stroke="#334155" strokeWidth="1.5" />
                <line x1="40" y1="170" x2="480" y2="170" stroke="#334155" strokeWidth="1.5" />

                {/* Axe labels */}
                <text x="10" y="25" fill="#94a3b8" fontSize="10" fontFamily="monospace">[A] (M)</text>
                <text x="450" y="190" fill="#94a3b8" fontSize="10" fontFamily="monospace">t (s)</text>

                {(() => {
                  const pts = curvePoints.map((p) => {
                    const x = 40 + (p.t / maxTime) * 440;
                    const y = 170 - (p.conc / Math.max(0.1, initialA0)) * 140;
                    return `${x},${Math.max(20, Math.min(170, y))}`;
                  });

                  // Position instantanée actuelle
                  const currX = 40 + (currentTimeSec / maxTime) * 440;
                  const currY = 170 - (currentConcentration / Math.max(0.1, initialA0)) * 140;

                  return (
                    <>
                      <polyline
                        fill="none"
                        stroke="#8b5cf6"
                        strokeWidth="3"
                        points={pts.join(' ')}
                      />
                      {/* Ligne pointillée repère temps actuel */}
                      <line
                        x1={currX}
                        y1="20"
                        x2={currX}
                        y2="170"
                        stroke="#10b981"
                        strokeWidth="1.5"
                        strokeDasharray="3 3"
                      />
                      {/* Curseur point */}
                      <circle
                        cx={currX}
                        cy={Math.max(20, Math.min(170, currY))}
                        r="6"
                        fill="#10b981"
                        stroke="#ffffff"
                        strokeWidth="2"
                      />
                    </>
                  );
                })()}
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
