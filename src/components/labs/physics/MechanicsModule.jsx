import { useState, useMemo, useEffect, useRef } from 'react';
import {
  Compass,
  RotateCcw,
  Play,
  Pause,
  Download,
  Sparkles,
  Activity,
  Gauge,
} from 'lucide-react';
import { PHYSICS_MODULES } from './physicsData';

export default function MechanicsModule({ onExport }) {
  const moduleData = PHYSICS_MODULES.find((m) => m.id === 'mechanics');

  // Paramètres personnalisables en direct
  const [mass, setMass] = useState(1.5); // kg
  const [v0, setV0] = useState(28); // m/s
  const [angle, setAngle] = useState(45); // degrés
  const [h0, setH0] = useState(0); // mètres
  const [gravity, setGravity] = useState(9.81); // m/s²
  const [selectedPlanet, setSelectedPlanet] = useState('earth');

  // État de l'animation
  const [isPlaying, setIsPlaying] = useState(false);
  const [simTime, setSimTime] = useState(0); // secondes
  const animFrameRef = useRef(null);
  const lastTimeRef = useRef(null);

  // Sélecteur de gravité planétaire rapide
  const handlePlanetSelect = (planet, gVal) => {
    setSelectedPlanet(planet);
    setGravity(gVal);
    setSimTime(0);
  };

  // Calculs physiques analytiques
  const alphaRad = (angle * Math.PI) / 180;
  const vx0 = v0 * Math.cos(alphaRad);
  const vy0 = v0 * Math.sin(alphaRad);

  // Temps de vol jusqu'à y = 0
  // y(t) = h0 + vy0*t - 0.5*g*t² = 0 => 0.5*g*t² - vy0*t - h0 = 0
  // Δ = vy0² + 2*g*h0
  const flightTime = useMemo(() => {
    const delta = vy0 * vy0 + 2 * gravity * h0;
    if (delta < 0) return 0;
    return (vy0 + Math.sqrt(delta)) / gravity;
  }, [vy0, gravity, h0]);

  // Portée maximale X_max
  const rangeX = useMemo(() => {
    return vx0 * flightTime;
  }, [vx0, flightTime]);

  // Flèche maximale (apogée) H_max
  const apexHeight = useMemo(() => {
    const tApex = vy0 / gravity;
    if (tApex < 0) return h0;
    return h0 + (vy0 * vy0) / (2 * gravity);
  }, [h0, vy0, gravity]);

  // Vitesse à l'impact
  const vImpact = useMemo(() => {
    return Math.sqrt(v0 * v0 + 2 * gravity * h0);
  }, [v0, gravity, h0]);

  // Énergies
  const kineticEnergyInit = 0.5 * mass * v0 * v0;
  const potentialEnergyInit = mass * gravity * h0;
  const totalMechanicalEnergy = kineticEnergyInit + potentialEnergyInit;

  // Position instantanée pour l'animation
  const currentT = Math.min(simTime, flightTime);
  const currentX = vx0 * currentT;
  const currentY = Math.max(0, h0 + vy0 * currentT - 0.5 * gravity * currentT * currentT);
  const currentVx = vx0;
  const currentVy = vy0 - gravity * currentT;
  const currentSpeed = Math.sqrt(currentVx * currentVx + currentVy * currentVy);

  // Boucle d'animation
  useEffect(() => {
    if (!isPlaying) {
      lastTimeRef.current = null;
      return;
    }

    const animate = (timestamp) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const dt = (timestamp - lastTimeRef.current) / 1000;
      lastTimeRef.current = timestamp;

      setSimTime((prev) => {
        const next = prev + dt;
        if (next >= flightTime) {
          setIsPlaying(false);
          return flightTime;
        }
        return next;
      });

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [isPlaying, flightTime]);

  // Génération des points SVG de la trajectoire
  const svgTrajectoryPath = useMemo(() => {
    if (rangeX <= 0) return '';
    const pointsCount = 60;
    const path = [];
    const maxPlotX = Math.max(rangeX * 1.15, 10);
    const maxPlotY = Math.max(apexHeight * 1.25, 10);

    for (let i = 0; i <= pointsCount; i++) {
      const t = (i / pointsCount) * flightTime;
      const x = vx0 * t;
      const y = Math.max(0, h0 + vy0 * t - 0.5 * gravity * t * t);

      // Coordonnées normalisées dans le viewBox SVG 0 0 600 300
      const svgX = 50 + (x / maxPlotX) * 500;
      const svgY = 260 - (y / maxPlotY) * 220;
      path.push(`${i === 0 ? 'M' : 'L'} ${svgX.toFixed(1)} ${svgY.toFixed(1)}`);
    }

    return path.join(' ');
  }, [rangeX, flightTime, vx0, h0, vy0, gravity, apexHeight]);

  // Échelles SVG
  const maxPlotX = Math.max(rangeX * 1.15, 10);
  const maxPlotY = Math.max(apexHeight * 1.25, 10);
  const curSvgX = 50 + (currentX / maxPlotX) * 500;
  const curSvgY = 260 - (currentY / maxPlotY) * 220;

  // Préparation du bilan d'exportation pour le rapport TP
  const handleExportClick = () => {
    onExport({
      moduleData,
      currentParams: {
        'Masse (m)': `${mass} kg`,
        'Vitesse initiale (v0)': `${v0} m/s`,
        'Angle de tir (α)': `${angle}°`,
        'Hauteur initiale (h0)': `${h0} m`,
        'Gravité (g)': `${gravity} m/s² (${selectedPlanet})`,
      },
      computedResults: {
        'Portée maximale (X_max)': { val: rangeX.toFixed(2), unit: 'm', comment: 'Distance horizontale totale parcourue' },
        'Flèche maximale (H_max)': { val: apexHeight.toFixed(2), unit: 'm', comment: 'Altitude maximale atteinte au sommet' },
        'Temps de vol (t_vol)': { val: flightTime.toFixed(2), unit: 's', comment: 'Durée jusqu\'à impact au sol' },
        'Vitesse à l\'impact (v_imp)': { val: vImpact.toFixed(2), unit: 'm/s', comment: 'Vitesse scalaire lors du contact' },
        'Énergie Mécanique Totale (Em)': { val: totalMechanicalEnergy.toFixed(2), unit: 'J', comment: 'Conservée tout au long du vol' },
      },
    });
  };

  const handleReset = () => {
    setMass(1.5);
    setV0(28);
    setAngle(45);
    setH0(0);
    setGravity(9.81);
    setSelectedPlanet('earth');
    setSimTime(0);
    setIsPlaying(false);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Barre d'en-tête du module */}
      <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shrink-0">
            <Compass size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                PHY101 · L1
              </span>
              <span className="text-xs text-slate-400">Fondamentaux</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white mt-0.5">
              Mécanique du Point & Balistique Planétaire
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
        {/* Colonne Gauche : Panneau de Contrôle & Réglage Temps Réel (Champs Libres) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Gauge size={16} className="text-indigo-400" />
                <span>Paramètres Expérimentaux</span>
              </h3>
              <span className="text-[11px] text-slate-400 font-mono">Modulation live</span>
            </div>

            {/* Presets planétaires */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Environnement Gravitationnel (g) :
              </label>
              <div className="grid grid-cols-4 gap-1.5 p-1 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
                {[
                  { id: 'earth', label: 'Terre', g: 9.81 },
                  { id: 'moon', label: 'Lune', g: 1.62 },
                  { id: 'mars', label: 'Mars', g: 3.71 },
                  { id: 'jupiter', label: 'Jupiter', g: 24.79 },
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handlePlanetSelect(p.id, p.g)}
                    className={`py-1.5 px-2 rounded-xl text-center font-medium transition-all ${
                      selectedPlanet === p.id
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900'
                    }`}
                  >
                    <div>{p.label}</div>
                    <div className="text-[10px] opacity-75 font-mono">{p.g} m/s²</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Vitesse initiale v0 */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-medium">Vitesse initiale v₀ (m/s) :</span>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min="1"
                    max="150"
                    step="0.5"
                    value={v0}
                    onChange={(e) => setV0(Math.max(1, Number(e.target.value)))}
                    className="w-20 px-2 py-0.5 rounded-lg bg-slate-950 border border-slate-700 text-indigo-300 font-mono text-right text-xs focus:outline-none focus:border-indigo-500"
                  />
                  <span className="text-slate-400 font-mono">m/s</span>
                </div>
              </div>
              <input
                type="range"
                min="5"
                max="80"
                step="1"
                value={v0}
                onChange={(e) => setV0(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
            </div>

            {/* Angle de tir alpha */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-medium">Angle d'inclinaison α (°) :</span>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min="5"
                    max="85"
                    step="1"
                    value={angle}
                    onChange={(e) => setAngle(Math.min(85, Math.max(5, Number(e.target.value))))}
                    className="w-20 px-2 py-0.5 rounded-lg bg-slate-950 border border-slate-700 text-indigo-300 font-mono text-right text-xs focus:outline-none focus:border-indigo-500"
                  />
                  <span className="text-slate-400 font-mono">°</span>
                </div>
              </div>
              <input
                type="range"
                min="5"
                max="85"
                step="1"
                value={angle}
                onChange={(e) => setAngle(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
            </div>

            {/* Hauteur initiale h0 */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-medium">Hauteur du promontoire h₀ (m) :</span>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    value={h0}
                    onChange={(e) => setH0(Math.max(0, Number(e.target.value)))}
                    className="w-20 px-2 py-0.5 rounded-lg bg-slate-950 border border-slate-700 text-indigo-300 font-mono text-right text-xs focus:outline-none focus:border-indigo-500"
                  />
                  <span className="text-slate-400 font-mono">m</span>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="1"
                value={h0}
                onChange={(e) => setH0(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
            </div>

            {/* Masse du projectile */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-medium">Masse du projectile m (kg) :</span>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min="0.1"
                    max="50"
                    step="0.1"
                    value={mass}
                    onChange={(e) => setMass(Math.max(0.1, Number(e.target.value)))}
                    className="w-20 px-2 py-0.5 rounded-lg bg-slate-950 border border-slate-700 text-indigo-300 font-mono text-right text-xs focus:outline-none focus:border-indigo-500"
                  />
                  <span className="text-slate-400 font-mono">kg</span>
                </div>
              </div>
              <input
                type="range"
                min="0.1"
                max="10"
                step="0.1"
                value={mass}
                onChange={(e) => setMass(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
            </div>

            {/* Équation différentielle active */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 text-[11px] text-slate-400 font-mono space-y-1">
              <div className="text-indigo-400 font-bold">Modèle théorique :</div>
              <div>x(t) = v₀·cos(α)·t</div>
              <div>y(t) = h₀ + v₀·sin(α)·t − ½·g·t²</div>
            </div>
          </div>
        </div>

        {/* Colonne Droite : Visualisation Dynamique & Grandeurs Mesurées */}
        <div className="lg:col-span-7 space-y-5">
          {/* Canvas SVG de Trajectoire Balistique */}
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Activity size={16} className="text-indigo-400" />
                  <span>Trajectoire en Temps Réel & Vecteurs</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Représentation continue de la parabole de tir sous champ gravitationnel unifié.
                </p>
              </div>

              {/* Contrôles de lecture */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    isPlaying
                      ? 'bg-amber-600/20 text-amber-300 border border-amber-500/30'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md'
                  }`}
                >
                  {isPlaying ? <Pause size={13} /> : <Play size={13} />}
                  <span>{isPlaying ? 'Pause' : 'Animer'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsPlaying(false);
                    setSimTime(0);
                  }}
                  className="p-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white"
                  title="Retour au départ"
                >
                  <RotateCcw size={14} />
                </button>
              </div>
            </div>

            {/* Scène SVG */}
            <div className="relative w-full h-64 sm:h-72 rounded-2xl bg-slate-950 border border-slate-800/90 overflow-hidden flex items-center justify-center">
              <svg viewBox="0 0 600 300" className="w-full h-full select-none">
                <defs>
                  <linearGradient id="trajGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="50%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                  <radialGradient id="ballGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#c084fc" />
                    <stop offset="100%" stopColor="#6366f1" />
                  </radialGradient>
                </defs>

                {/* Grille cartésienne */}
                <line x1="50" y1="260" x2="570" y2="260" stroke="#334155" strokeWidth="1.5" />
                <line x1="50" y1="30" x2="50" y2="260" stroke="#334155" strokeWidth="1.5" />

                {/* Graduations X */}
                <text x="50" y="278" fill="#64748b" fontSize="10" fontFamily="monospace">0 m</text>
                <text x="300" y="278" fill="#64748b" fontSize="10" fontFamily="monospace" textAnchor="middle">
                  {(maxPlotX / 2).toFixed(0)} m
                </text>
                <text x="560" y="278" fill="#64748b" fontSize="10" fontFamily="monospace" textAnchor="end">
                  {maxPlotX.toFixed(0)} m
                </text>

                {/* Graduations Y */}
                <text x="40" y="45" fill="#64748b" fontSize="10" fontFamily="monospace" textAnchor="end">
                  {maxPlotY.toFixed(0)} m
                </text>
                <text x="40" y="150" fill="#64748b" fontSize="10" fontFamily="monospace" textAnchor="end">
                  {(maxPlotY / 2).toFixed(0)} m
                </text>

                {/* Courbe parabolique */}
                <path
                  d={svgTrajectoryPath}
                  fill="none"
                  stroke="url(#trajGrad)"
                  strokeWidth="2.5"
                  strokeDasharray="4 2"
                  className="opacity-90"
                />

                {/* Sommet / Flèche */}
                {apexHeight > h0 && (
                  <g>
                    <circle
                      cx={50 + ((vx0 * (vy0 / gravity)) / maxPlotX) * 500}
                      cy={260 - (apexHeight / maxPlotY) * 220}
                      r="4"
                      fill="#38bdf8"
                    />
                    <text
                      x={50 + ((vx0 * (vy0 / gravity)) / maxPlotX) * 500}
                      y={245 - (apexHeight / maxPlotY) * 220}
                      fill="#38bdf8"
                      fontSize="9"
                      fontFamily="monospace"
                      textAnchor="middle"
                    >
                      Apogée {apexHeight.toFixed(1)}m
                    </text>
                  </g>
                )}

                {/* Point d'impact */}
                <circle
                  cx={50 + (rangeX / maxPlotX) * 500}
                  cy="260"
                  r="5"
                  fill="#f43f5e"
                />
                <text
                  x={50 + (rangeX / maxPlotX) * 500}
                  y="250"
                  fill="#f43f5e"
                  fontSize="9"
                  fontFamily="monospace"
                  textAnchor="middle"
                >
                  Impact {rangeX.toFixed(1)}m
                </text>

                {/* Projectile en cours d'animation */}
                <circle
                  cx={curSvgX}
                  cy={curSvgY}
                  r="7"
                  fill="url(#ballGlow)"
                  className="filter drop-shadow-md"
                />
                {/* Anneau de rayonnement */}
                <circle
                  cx={curSvgX}
                  cy={curSvgY}
                  r="11"
                  fill="none"
                  stroke="#a855f7"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                  className="animate-spin"
                />
              </svg>

              {/* Ticker de télémétrie en direct */}
              <div className="absolute top-3 right-3 p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] font-mono text-slate-300 space-y-0.5">
                <div>t = <span className="text-indigo-400 font-bold">{currentT.toFixed(2)} s</span></div>
                <div>v(t) = <span className="text-violet-400 font-bold">{currentSpeed.toFixed(1)} m/s</span></div>
                <div>x = {currentX.toFixed(1)} m · y = {currentY.toFixed(1)} m</div>
              </div>
            </div>
          </div>

          {/* Grille de KPIs des grandeurs physiques calculées */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[11px] block">Portée X_max</span>
              <div className="text-xl font-bold font-mono text-indigo-400">{rangeX.toFixed(2)} m</div>
              <span className="text-[10px] text-slate-500 font-mono block">Distance au sol</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[11px] block">Flèche H_max</span>
              <div className="text-xl font-bold font-mono text-violet-400">{apexHeight.toFixed(2)} m</div>
              <span className="text-[10px] text-slate-500 font-mono block">Altitude d'apogée</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[11px] block">Temps de vol</span>
              <div className="text-xl font-bold font-mono text-cyan-400">{flightTime.toFixed(2)} s</div>
              <span className="text-[10px] text-slate-500 font-mono block">Durée balistique</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[11px] block">Énergie Totale Em</span>
              <div className="text-xl font-bold font-mono text-emerald-400">{totalMechanicalEnergy.toFixed(1)} J</div>
              <span className="text-[10px] text-slate-500 font-mono block">Ec(0) + Ep(0)</span>
            </div>
          </div>

          {/* Synthèse Pédagogique */}
          <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/20 text-indigo-200/90 text-xs leading-relaxed space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-indigo-300">
              <Sparkles size={14} />
              <span>Principe Physique Fondamental :</span>
            </div>
            <p>
              Pour une dénivellation initiale nulle (h₀ = 0), la portée maximale théorique est atteinte sous un angle parfait de α = 45°. Lorsque le tir est initié depuis un surplomb (h₀ &gt; 0), l'angle d'éjection optimal décroît (α_opt &lt; 45°) selon la relation sin(α_opt) = (1 + 2·g·h₀ / v₀²)⁻¹/².
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
