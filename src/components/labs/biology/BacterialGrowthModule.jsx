import { useState, useMemo } from 'react';
import {
  Sparkles,
  RotateCcw,
  Thermometer,
  Clock,
  Users,
  FlaskConical,
  FileText,
  Activity,
  GraduationCap,
} from 'lucide-react';
import { BIOLOGY_MODULES } from './biologyData';
import BiologyTPExportModal from './BiologyTPExportModal';

export default function BacterialGrowthModule({ onNavigateToExam }) {
  const moduleData = BIOLOGY_MODULES.find((m) => m.id === 'bacterial_growth');

  // Paramètres personnalisables en champs libres
  const [initialPopulation, setInitialPopulation] = useState(10000); // UFC/mL (N0)
  const [cultureTime, setCultureTime] = useState(16); // heures (t)
  const [temperature, setTemperature] = useState(37); // °C
  const [substrateConcentration, setSubstrateConcentration] = useState(5.0); // g/L de glucose ([S])
  const [lagDuration, setLagDuration] = useState(1.5); // heures de latence
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Simulation numérique de la cinétique de Monod et des 4 phases de culture fermée
  const growth = useMemo(() => {
    // Facteur d'activité selon température (optimum à 37°C pour E. coli)
    const tempFactor = Math.max(0.1, 1 - Math.pow(Math.abs(temperature - 37) / 16, 2));

    // Cinétique de Monod : µ = µmax * S / (Ks + S)
    const muMax = 0.85 * tempFactor; // h⁻¹
    const ks = 0.2; // g/L
    const mu = muMax * (substrateConcentration / (ks + substrateConcentration));

    // Temps de génération G (temps de doublement) en minutes : G = ln(2) / µ * 60
    const doublingTimeMin = mu > 0.01 ? Math.round((Math.LN2 / mu) * 60) : 999;
    const doublingTimeHours = mu > 0.01 ? Math.LN2 / mu : 99;

    // Capacité de charge maximale du milieu (plateau stationnaire)
    const carryingCapacity = Math.min(2e9, initialPopulation * 200000 * (substrateConcentration / 3));

    // Génération de points de courbe pour t allant de 0 à 24 heures
    const points = [];
    const maxTimeSim = Math.max(24, cultureTime + 4);

    for (let t = 0; t <= maxTimeSim; t += 0.5) {
      let pop;

      if (t < lagDuration) {
        // 1. Phase de latence (adaptation enzymatique, biomasse constante)
        pop = initialPopulation;
      } else if (t < lagDuration + 12) {
        // 2. Phase exponentielle : transition sigmoïde vers le plateau
        const dt = t - lagDuration;
        pop = carryingCapacity / (1 + ((carryingCapacity - initialPopulation) / initialPopulation) * Math.exp(-mu * dt));
      } else if (t < lagDuration + 18) {
        // 3. Phase stationnaire : équilibre naissances/morts par épuisement du substrat
        pop = carryingCapacity;
      } else {
        // 4. Phase de mortalité/déclin : accumulation de toxines
        const tDecline = t - (lagDuration + 18);
        pop = Math.max(100, carryingCapacity * Math.exp(-0.08 * tDecline));
      }

      // DO600 estimée (Loi de Beer-Lambert appliquée aux suspensions cellulaires)
      const od600 = Math.min(3.5, 0.02 + (pop / 1e9) * 1.8);
      points.push({ t, pop, od600 });
    }

    // Population et DO au temps de culture choisi par l'utilisateur
    const currentPoint = points.find((p) => p.t >= cultureTime) || points[points.length - 1];
    const currentPop = currentPoint ? currentPoint.pop : initialPopulation;
    const currentOD = currentPoint ? currentPoint.od600 : 0.05;

    // Nombre de générations accomplies n = log2(N / N0)
    const generations = currentPop > initialPopulation ? Math.log2(currentPop / initialPopulation) : 0;

    // Détermination de la phase actuelle
    let activePhaseName = 'Phase de Latence';
    let phaseBadge = 'bg-slate-800 text-slate-300';
    if (cultureTime > lagDuration && cultureTime < lagDuration + 10) {
      activePhaseName = 'Phase Exponentielle (Log)';
      phaseBadge = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
    } else if (cultureTime >= lagDuration + 10 && cultureTime < lagDuration + 18) {
      activePhaseName = 'Phase Stationnaire';
      phaseBadge = 'bg-amber-500/20 text-amber-300 border-amber-500/30';
    } else if (cultureTime >= lagDuration + 18) {
      activePhaseName = 'Phase de Déclin / Mortalité';
      phaseBadge = 'bg-rose-500/20 text-rose-300 border-rose-500/30';
    }

    return {
      mu,
      doublingTimeMin,
      doublingTimeHours,
      carryingCapacity,
      currentPop,
      currentOD,
      generations,
      activePhaseName,
      phaseBadge,
      points,
    };
  }, [initialPopulation, cultureTime, temperature, substrateConcentration, lagDuration]);

  const currentParams = {
    initialPopulation,
    cultureTime,
    temperature,
    substrateConcentration,
    lagDuration,
  };

  const experimentalResults = {
    'Population Viable N(t)': {
      value: growth.currentPop.toExponential(2),
      unit: 'UFC / mL',
      comment: `Après ${cultureTime} heures d'incubation`,
    },
    'Taux Spécifique de Croissance (µ)': {
      value: growth.mu.toFixed(3),
      unit: 'h⁻¹',
      comment: `Modèle de Monod (µmax = ${(0.85).toFixed(2)})`,
    },
    'Temps de Génération (G)': {
      value: growth.doublingTimeMin,
      unit: 'minutes',
      comment: `G = ln(2) / µ (${growth.doublingTimeHours.toFixed(2)} h)`,
    },
    'Absorbance Spectrophotométrique DO₆₀₀': {
      value: growth.currentOD.toFixed(3),
      unit: 'UA',
      comment: 'Densité optique mesurée à 600 nm',
    },
    'Nombre de Générations (n)': {
      value: growth.generations.toFixed(1),
      unit: 'divisions',
      comment: `n = log₂(N / N₀)`,
    },
  };

  const handleReset = () => {
    setInitialPopulation(10000);
    setCultureTime(16);
    setTemperature(37);
    setSubstrateConcentration(5.0);
    setLagDuration(1.5);
  };

  const applyPreset = (preset) => {
    if (preset.initialPopulation) setInitialPopulation(preset.initialPopulation);
    if (preset.cultureTime) setCultureTime(preset.cultureTime);
    if (preset.temperature) setTemperature(preset.temperature);
    if (preset.substrateConcentration !== undefined) setSubstrateConcentration(preset.substrateConcentration);
    if (preset.lagDuration !== undefined) setLagDuration(preset.lagDuration);
  };

  return (
    <div className="space-y-6 text-left">
      {/* En-tête du module */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
              {moduleData?.code || 'BIO201'} · FONDAMENTAUX (L1-L2)
            </span>
            <span className="text-xs text-slate-400 font-mono">Banc d'Essai de Microbiologie</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <Sparkles className="text-emerald-400" size={24} />
            <span>Croissance Bactérienne & Modèle de Monod</span>
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Suivi spectrophotométrique de la biomasse (DO 600 nm), détermination du temps de génération G = ln(2)/µ, identification des 4 phases de culture fermée et influence de la thermie.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          <button
            type="button"
            onClick={handleReset}
            className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
            title="Réinitialiser les paramètres"
          >
            <RotateCcw size={16} />
          </button>

          <button
            type="button"
            onClick={() => onNavigateToExam && onNavigateToExam('Croissance Bactérienne')}
            className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-emerald-400 hover:text-emerald-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
            title="S'entraîner aux examens et TD de microbiologie"
          >
            <GraduationCap size={15} />
            <span>Mode Examen & TD</span>
          </button>

          <button
            type="button"
            onClick={() => setIsExportOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-lg shadow-emerald-900/30 cursor-pointer"
          >
            <FileText size={15} />
            <span>Exporter Rapport TP (PDF A4)</span>
          </button>
        </div>
      </div>

      {/* Presets rapides */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-mono font-bold text-slate-400 flex items-center gap-1.5 mr-1">
          <Sparkles size={14} className="text-emerald-400" />
          <span>Milieux de Culture :</span>
        </span>
        {moduleData?.presets?.map((p, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => applyPreset(p)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/40 text-[11px] text-slate-300 transition-colors font-medium"
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* Grille principale : Paramètres à gauche, Courbe & DO à droite */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* PARAMÈTRES DE CULTURE BACTÉRIENNE */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FlaskConical size={16} className="text-emerald-400" />
                <span>Paramètres de l'Inoculum & Bioréacteur</span>
              </h3>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                Champs Libres
              </span>
            </div>

            {/* 1. Population initiale N0 */}
            <div className="space-y-1 text-xs">
              <div className="flex justify-between font-bold text-slate-300">
                <label className="flex items-center gap-1.5">
                  <Users size={13} className="text-slate-400" />
                  <span>Inoculum Initial (N₀) :</span>
                </label>
                <span className="font-mono text-emerald-400">{initialPopulation.toLocaleString()} CFU/mL</span>
              </div>
              <input
                type="number"
                min="1000"
                max="5000000"
                step="5000"
                value={initialPopulation}
                onChange={(e) => setInitialPopulation(Math.max(100, Number(e.target.value) || 100))}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:border-emerald-500/60 focus:outline-none"
              />
            </div>

            {/* 2. Temps de culture (heures) */}
            <div className="space-y-1 text-xs">
              <div className="flex justify-between font-bold text-slate-300">
                <label className="flex items-center gap-1.5">
                  <Clock size={13} className="text-slate-400" />
                  <span>Temps de Culture (t) :</span>
                </label>
                <span className="font-mono text-emerald-400">{cultureTime} heures</span>
              </div>
              <input
                type="number"
                min="1"
                max="36"
                step="0.5"
                value={cultureTime}
                onChange={(e) => setCultureTime(Math.max(0.5, Number(e.target.value) || 1))}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:border-emerald-500/60 focus:outline-none"
              />
              <input
                type="range"
                min="1"
                max="24"
                step="0.5"
                value={cultureTime}
                onChange={(e) => setCultureTime(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            {/* 3. Température (°C) */}
            <div className="space-y-1 text-xs">
              <div className="flex justify-between font-bold text-slate-300">
                <label className="flex items-center gap-1.5">
                  <Thermometer size={13} className="text-slate-400" />
                  <span>Température d'Incubation (T) :</span>
                </label>
                <span className="font-mono text-emerald-400">{temperature} °C</span>
              </div>
              <input
                type="number"
                min="15"
                max="45"
                step="1"
                value={temperature}
                onChange={(e) => setTemperature(Number(e.target.value) || 37)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:border-emerald-500/60 focus:outline-none"
              />
            </div>

            {/* 4. Substrat Carboné [S] */}
            <div className="space-y-1 text-xs">
              <div className="flex justify-between font-bold text-slate-300">
                <label className="flex items-center gap-1.5">
                  <FlaskConical size={13} className="text-slate-400" />
                  <span>Substrat Carboné / Glucose ([S]) :</span>
                </label>
                <span className="font-mono text-emerald-400">{substrateConcentration} g/L</span>
              </div>
              <input
                type="number"
                min="0.1"
                max="20"
                step="0.5"
                value={substrateConcentration}
                onChange={(e) => setSubstrateConcentration(Math.max(0.1, Number(e.target.value) || 0.1))}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:border-emerald-500/60 focus:outline-none"
              />
            </div>

            {/* 5. Durée de phase de latence */}
            <div className="space-y-1 text-xs pt-2 border-t border-slate-800">
              <div className="flex justify-between font-bold text-slate-300">
                <label className="text-slate-400">Latence d'Acclimatation (t_lag) :</label>
                <span className="font-mono text-slate-300">{lagDuration} h</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="5"
                step="0.5"
                value={lagDuration}
                onChange={(e) => setLagDuration(Number(e.target.value))}
                className="w-full accent-slate-400 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* VISUALISATION DE LA COURBE DE CROISSANCE SIGMOÏDE */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-md space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Activity size={16} className="text-emerald-400" />
                  <span>Cinétique de Croissance en Bioréacteur</span>
                </h3>
                <span className="text-xs text-slate-400">
                  Courbe en semi-logarithmique de log₁₀(N) en fonction du temps (heures)
                </span>
              </div>

              <span className={`px-2.5 py-1 rounded-xl text-xs font-bold border font-mono ${growth.phaseBadge}`}>
                {growth.activePhaseName}
              </span>
            </div>

            {/* Courbe SVG Dynamique */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <svg viewBox="0 0 400 220" className="w-full h-56">
                {/* Axes */}
                <line x1="45" y1="185" x2="380" y2="185" stroke="#475569" strokeWidth="1.5" />
                <line x1="45" y1="20" x2="45" y2="185" stroke="#475569" strokeWidth="1.5" />

                <text x="375" y="200" fill="#94a3b8" fontSize="9" textAnchor="end" fontFamily="monospace">
                  Temps t (h)
                </text>
                <text x="15" y="30" fill="#94a3b8" fontSize="9" textAnchor="start" fontFamily="monospace">
                  log₁₀(N)
                </text>

                {/* Grille horizontale (ordres de grandeur log) */}
                {[4, 6, 8, 10].map((logVal) => {
                  const y = 185 - ((logVal - 3) / 7.5) * 155;
                  return (
                    <g key={logVal}>
                      <line x1="45" y1={y} x2="380" y2={y} stroke="#1e293b" strokeDasharray="2 2" />
                      <text x="38" y={y + 3} fill="#64748b" fontSize="8" textAnchor="end" fontFamily="monospace">
                        10^{logVal}
                      </text>
                    </g>
                  );
                })}

                {/* Tracé de la courbe bactérienne */}
                <path
                  d={
                    'M 45 185 ' +
                    growth.points
                      .map((pt) => {
                        const x = 45 + (pt.t / 28) * 330;
                        const logVal = Math.log10(Math.max(100, pt.pop));
                        const y = 185 - ((logVal - 3) / 7.5) * 155;
                        return `L ${x.toFixed(1)} ${y.toFixed(1)}`;
                      })
                      .join(' ')
                  }
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2.5"
                />

                {/* Ligne repère au temps actuel */}
                {(() => {
                  const curX = 45 + (cultureTime / 28) * 330;
                  const logVal = Math.log10(Math.max(100, growth.currentPop));
                  const curY = 185 - ((logVal - 3) / 7.5) * 155;
                  return (
                    <g>
                      <line x1={curX} y1="20" x2={curX} y2="185" stroke="#a855f7" strokeDasharray="3 3" />
                      <circle cx={curX} cy={curY} r="5" fill="#a855f7" stroke="#ffffff" strokeWidth="1.5" />
                      <text x={curX} y="32" fill="#d8b4fe" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                        t = {cultureTime}h
                      </text>
                    </g>
                  );
                })()}
              </svg>
            </div>

            {/* Cartouches de grandeurs physiques */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 block">Biomasse N(t)</span>
                <span className="text-base font-black font-mono text-emerald-400">
                  {growth.currentPop.toExponential(2)}
                </span>
                <span className="text-[9px] text-slate-500 block">UFC/mL</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 block">Temps Doubl. G</span>
                <span className="text-base font-black font-mono text-indigo-400">
                  {growth.doublingTimeMin} min
                </span>
                <span className="text-[9px] text-slate-500 block">G = ln(2)/µ</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 block">Taux Croissance µ</span>
                <span className="text-base font-black font-mono text-purple-400">
                  {growth.mu.toFixed(3)} h⁻¹
                </span>
                <span className="text-[9px] text-slate-500 block">Pente Log</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 block">Densité Optique DO₆₀₀</span>
                <span className="text-base font-black font-mono text-pink-400">
                  {growth.currentOD.toFixed(3)}
                </span>
                <span className="text-[9px] text-slate-500 block">Spectrophotomètre</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal d'exportation du TP */}
      <BiologyTPExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        moduleData={moduleData}
        currentParams={currentParams}
        experimentalResults={experimentalResults}
      />
    </div>
  );
}
