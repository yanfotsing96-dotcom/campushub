import { useState, useMemo } from 'react';
import {
  Compass,
  RotateCcw,
  Sparkles,
  Thermometer,
  Clock,
  Users,
  FileText,
  Activity,
  GraduationCap,
} from 'lucide-react';
import { BIOLOGY_MODULES } from './biologyData';
import BiologyTPExportModal from './BiologyTPExportModal';

export default function LotkaVolterraModule({ onNavigateToExam }) {
  const moduleData = BIOLOGY_MODULES.find((m) => m.id === 'ecology_lotka_volterra');

  // Paramètres personnalisables en champs libres
  const [initialPopulation, setInitialPopulation] = useState(100); // Proies initiales x0
  const [substrateConcentration, setSubstrateConcentration] = useState(25); // Prédateurs initiaux y0
  const [cultureTime, setCultureTime] = useState(60); // Période simulée (mois ou générations)
  const [temperature, setTemperature] = useState(20); // °C environnemental
  const [alpha, setAlpha] = useState(0.1); // Natalité proies
  const [beta, setBeta] = useState(0.005); // Efficacité prédation
  const [delta, setDelta] = useState(0.00004); // Conversion trophique
  const [gamma, setGamma] = useState(0.04); // Mortalité prédateurs

  const [activeView, setActiveView] = useState('timeseries'); // 'timeseries' | 'phase_plane'
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Intégration numérique du modèle différentiel de Lotka-Volterra
  const simulation = useMemo(() => {
    // Effet de la température sur le métabolisme écologique
    const tempFactor = Math.max(0.6, 1 + (temperature - 20) * 0.02);
    const adjAlpha = alpha * tempFactor;
    const adjGamma = gamma * tempFactor;

    const dt = 0.2; // pas de temps numérique fin
    const steps = Math.round(cultureTime / dt);

    const timePoints = [];
    let x = Math.max(1, initialPopulation);
    let y = Math.max(1, substrateConcentration);

    let maxX = x;
    let maxY = y;

    for (let i = 0; i <= steps; i++) {
      const t = i * dt;

      if (i % 2 === 0) {
        timePoints.push({
          t: Math.round(t * 10) / 10,
          prey: Math.max(0, Math.round(x)),
          predator: Math.max(0, Math.round(y)),
        });
      }

      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;

      // dx/dt = alpha*x - beta*x*y
      // dy/dt = delta*x*y - gamma*y
      const dxdt = adjAlpha * x - beta * x * y;
      const dydt = delta * x * y - adjGamma * y;

      x = Math.max(0, x + dxdt * dt);
      y = Math.max(0, y + dydt * dt);
    }

    // Points d'équilibre théoriques stationnaires (x* = gamma/delta, y* = alpha/beta)
    const eqPrey = Math.round(adjGamma / delta);
    const eqPredator = Math.round(adjAlpha / beta);

    const lastPoint = timePoints[timePoints.length - 1] || { prey: x, predator: y };

    return {
      timePoints,
      maxX: Math.max(150, maxX * 1.1),
      maxY: Math.max(50, maxY * 1.1),
      eqPrey,
      eqPredator,
      lastPrey: lastPoint.prey,
      lastPredator: lastPoint.predator,
    };
  }, [
    initialPopulation,
    substrateConcentration,
    cultureTime,
    temperature,
    alpha,
    beta,
    delta,
    gamma,
  ]);

  const currentParams = {
    initialPopulation,
    substrateConcentration,
    cultureTime,
    temperature,
    alpha,
    beta,
    delta,
    gamma,
  };

  const experimentalResults = {
    'Population de Proies Finale': {
      value: simulation.lastPrey,
      unit: 'individus',
      comment: `Équilibre stationnaire théorique x* = ${simulation.eqPrey}`,
    },
    'Population de Prédateurs Finale': {
      value: simulation.lastPredator,
      unit: 'individus',
      comment: `Équilibre stationnaire théorique y* = ${simulation.eqPredator}`,
    },
    'Taux de Prédation (β)': {
      value: beta,
      unit: 'ind⁻¹·t⁻¹',
      comment: 'Intensité de capture proie-prédateur',
    },
    'Efficacité Trophique (δ)': {
      value: delta,
      unit: '',
      comment: 'Conversion de biomasse proie en prédateur',
    },
  };

  const handleReset = () => {
    setInitialPopulation(100);
    setSubstrateConcentration(25);
    setCultureTime(60);
    setTemperature(20);
    setAlpha(0.1);
    setBeta(0.005);
    setDelta(0.00004);
    setGamma(0.04);
  };

  const applyPreset = (preset) => {
    if (preset.initialPopulation) setInitialPopulation(preset.initialPopulation);
    if (preset.substrateConcentration) setSubstrateConcentration(preset.substrateConcentration);
    if (preset.cultureTime) setCultureTime(preset.cultureTime);
    if (preset.temperature) setTemperature(preset.temperature);
    if (preset.alpha) setAlpha(preset.alpha);
    if (preset.beta) setBeta(preset.beta);
    if (preset.delta) setDelta(preset.delta);
    if (preset.gamma) setGamma(preset.gamma);
  };

  return (
    <div className="space-y-6 text-left">
      {/* En-tête du module */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-violet-500/20 text-violet-300 border border-violet-500/30 font-mono">
              {moduleData?.code || 'BIO501'} · AVANCÉ (L3-MASTER)
            </span>
            <span className="text-xs text-slate-400 font-mono">Écologie Théorique & Bio-Maths</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <Compass className="text-emerald-400" size={24} />
            <span>Modèle Proie-Prédateur : Équations de Lotka-Volterra</span>
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Oscillations couplées proies/prédateurs, portrait de phase orbital (dx/dt = αx - βxy, dy/dt = δxy - γy), et résilience des écosystèmes.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          <button
            type="button"
            onClick={handleReset}
            className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors cursor-pointer"
            title="Réinitialiser"
          >
            <RotateCcw size={16} />
          </button>

          <button
            type="button"
            onClick={() => onNavigateToExam && onNavigateToExam('Écologie & Modèle Proie-Prédateur')}
            className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-emerald-400 hover:text-emerald-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
            title="S'entraîner aux examens et TD d'écologie"
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

      {/* Presets d'écosystèmes */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-mono font-bold text-slate-400 flex items-center gap-1.5 mr-1">
          <Sparkles size={14} className="text-emerald-400" />
          <span>Biomes & Écosystèmes :</span>
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

      {/* Grille principale : Paramètres à gauche, Graphe à droite */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* PARAMÈTRES ÉCOLOGIQUES */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Users size={16} className="text-emerald-400" />
                <span>Populations & Coefficients Écologiques</span>
              </h3>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                Champs Libres
              </span>
            </div>

            {/* 1. Proies initiales x0 & Prédateurs initiaux y0 */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <label className="block text-slate-300 font-bold">Proies Initiales (x₀) :</label>
                <input
                  type="number"
                  min="10"
                  max="1000"
                  step="10"
                  value={initialPopulation}
                  onChange={(e) => setInitialPopulation(Math.max(5, Number(e.target.value) || 10))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 font-mono text-xs focus:border-emerald-500/60 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-slate-300 font-bold">Prédateurs (y₀) :</label>
                <input
                  type="number"
                  min="2"
                  max="200"
                  step="2"
                  value={substrateConcentration}
                  onChange={(e) => setSubstrateConcentration(Math.max(1, Number(e.target.value) || 2))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-pink-400 font-mono text-xs focus:border-emerald-500/60 focus:outline-none"
                />
              </div>
            </div>

            {/* 2. Temps de suivi (générations) */}
            <div className="space-y-1 text-xs">
              <div className="flex justify-between font-bold text-slate-300">
                <label className="flex items-center gap-1.5">
                  <Clock size={13} className="text-slate-400" />
                  <span>Horizon Temporel Écologique (t) :</span>
                </label>
                <span className="font-mono text-emerald-400">{cultureTime} générations</span>
              </div>
              <input
                type="number"
                min="10"
                max="150"
                step="5"
                value={cultureTime}
                onChange={(e) => setCultureTime(Math.max(5, Number(e.target.value) || 10))}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:border-emerald-500/60 focus:outline-none"
              />
            </div>

            {/* 3. Température ambiante */}
            <div className="space-y-1 text-xs">
              <div className="flex justify-between font-bold text-slate-300">
                <label className="flex items-center gap-1.5">
                  <Thermometer size={13} className="text-slate-400" />
                  <span>Température du Biome (T) :</span>
                </label>
                <span className="font-mono text-emerald-400">{temperature} °C</span>
              </div>
              <input
                type="number"
                min="0"
                max="40"
                step="1"
                value={temperature}
                onChange={(e) => setTemperature(Number(e.target.value) || 20)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:border-emerald-500/60 focus:outline-none"
              />
            </div>

            {/* 4. Coefficients différentiels alpha, beta, gamma */}
            <div className="grid grid-cols-2 gap-3 text-xs pt-1 border-t border-slate-800">
              <div className="space-y-1">
                <label className="text-[11px] text-slate-400 font-mono block">α (Natalité Proie) :</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={alpha}
                  onChange={(e) => setAlpha(Number(e.target.value))}
                  className="w-full p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-slate-400 font-mono block">β (Prédation) :</label>
                <input
                  type="number"
                  step="0.001"
                  min="0.001"
                  value={beta}
                  onChange={(e) => setBeta(Number(e.target.value))}
                  className="w-full p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono text-xs"
                />
              </div>
            </div>
          </div>
        </div>

        {/* VISUALISATION : COURBES TEMPORELLES OU PORTRAIT DE PHASE */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-md space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Activity size={16} className="text-emerald-400" />
                  <span>Dynamique de Prédation Lotka-Volterra</span>
                </h3>
                <span className="text-xs text-slate-400">
                  {activeView === 'timeseries'
                    ? 'Série temporelle : Proies (Vert) vs Prédateurs (Rose)'
                    : 'Portrait de phase (x, y) : Orbite fermée dans l\'espace d\'état'}
                </span>
              </div>

              {/* Bouton de bascule de vue */}
              <div className="inline-flex p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setActiveView('timeseries')}
                  className={`px-3 py-1 rounded-lg transition-colors ${
                    activeView === 'timeseries'
                      ? 'bg-emerald-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Série Temporelle
                </button>
                <button
                  type="button"
                  onClick={() => setActiveView('phase_plane')}
                  className={`px-3 py-1 rounded-lg transition-colors ${
                    activeView === 'phase_plane'
                      ? 'bg-emerald-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Portrait de Phase
                </button>
              </div>
            </div>

            {/* Tracé SVG Dynamique */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              {activeView === 'timeseries' ? (
                <svg viewBox="0 0 400 220" className="w-full h-56">
                  {/* Axes */}
                  <line x1="45" y1="185" x2="380" y2="185" stroke="#475569" strokeWidth="1.5" />
                  <line x1="45" y1="20" x2="45" y2="185" stroke="#475569" strokeWidth="1.5" />

                  <text x="375" y="200" fill="#94a3b8" fontSize="9" textAnchor="end" fontFamily="monospace">
                    Temps (générations)
                  </text>
                  <text x="15" y="30" fill="#94a3b8" fontSize="9" textAnchor="start" fontFamily="monospace">
                    Population
                  </text>

                  {/* Courbe Proies (Vert) */}
                  <path
                    d={
                      'M 45 185 ' +
                      simulation.timePoints
                        .map((pt) => {
                          const x = 45 + (pt.t / cultureTime) * 330;
                          const y = 185 - (pt.prey / simulation.maxX) * 155;
                          return `L ${x.toFixed(1)} ${y.toFixed(1)}`;
                        })
                        .join(' ')
                    }
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2"
                  />

                  {/* Courbe Prédateurs (Rose) */}
                  <path
                    d={
                      'M 45 185 ' +
                      simulation.timePoints
                        .map((pt) => {
                          const x = 45 + (pt.t / cultureTime) * 330;
                          const y = 185 - (pt.predator / simulation.maxY) * 155;
                          return `L ${x.toFixed(1)} ${y.toFixed(1)}`;
                        })
                        .join(' ')
                    }
                    fill="none"
                    stroke="#f43f5e"
                    strokeWidth="2"
                  />
                </svg>
              ) : (
                <svg viewBox="0 0 400 220" className="w-full h-56">
                  {/* Portrait de phase (x = proies, y = prédateurs) */}
                  <line x1="45" y1="185" x2="380" y2="185" stroke="#475569" strokeWidth="1.5" />
                  <line x1="45" y1="20" x2="45" y2="185" stroke="#475569" strokeWidth="1.5" />

                  <text x="375" y="200" fill="#94a3b8" fontSize="9" textAnchor="end" fontFamily="monospace">
                    Proies x
                  </text>
                  <text x="15" y="30" fill="#94a3b8" fontSize="9" textAnchor="start" fontFamily="monospace">
                    Prédateurs y
                  </text>

                  {/* Orbite de phase */}
                  <path
                    d={
                      'M ' +
                      simulation.timePoints
                        .map((pt) => {
                          const px = 45 + (pt.prey / simulation.maxX) * 330;
                          const py = 185 - (pt.predator / simulation.maxY) * 155;
                          return `${px.toFixed(1)} ${py.toFixed(1)}`;
                        })
                        .join(' L ')
                    }
                    fill="none"
                    stroke="#a855f7"
                    strokeWidth="2"
                  />

                  {/* Point stationnaire fixe (x*, y*) */}
                  {(() => {
                    const eqX = 45 + (simulation.eqPrey / simulation.maxX) * 330;
                    const eqY = 185 - (simulation.eqPredator / simulation.maxY) * 155;
                    return (
                      <circle cx={eqX} cy={eqY} r="4" fill="#fbbf24" title="Équilibre stationnaire" />
                    );
                  })()}
                </svg>
              )}
            </div>

            {/* Cartouches de grandeurs physiques */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 block">Proies Finales</span>
                <span className="text-lg font-black font-mono text-emerald-400">
                  {simulation.lastPrey}
                </span>
                <span className="text-[9px] text-slate-500 block">Lièvres</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 block">Prédateurs Finaux</span>
                <span className="text-lg font-black font-mono text-rose-400">
                  {simulation.lastPredator}
                </span>
                <span className="text-[9px] text-slate-500 block">Lynx</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 block">Équilibre x* (Proies)</span>
                <span className="text-lg font-black font-mono text-amber-400">
                  {simulation.eqPrey}
                </span>
                <span className="text-[9px] text-slate-500 block">γ / δ</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 block">Équilibre y* (Préd.)</span>
                <span className="text-lg font-black font-mono text-indigo-400">
                  {simulation.eqPredator}
                </span>
                <span className="text-[9px] text-slate-500 block">α / β</span>
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
