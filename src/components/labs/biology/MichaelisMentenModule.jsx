import { useState, useMemo } from 'react';
import {
  Activity,
  RotateCcw,
  Sparkles,
  Thermometer,
  Clock,
  FlaskConical,
  FileText,
  Sliders,
  TrendingUp,
  Percent,
  GraduationCap,
} from 'lucide-react';
import { BIOLOGY_MODULES } from './biologyData';
import BiologyTPExportModal from './BiologyTPExportModal';

export default function MichaelisMentenModule({ onNavigateToExam }) {
  const moduleData = BIOLOGY_MODULES.find((m) => m.id === 'enzymology');

  // Paramètres personnalisables en champs libres
  const [substrateConcentration, setSubstrateConcentration] = useState(10); // mM ([S])
  const [vmax, setVmax] = useState(100); // µmol/(min·mg)
  const [km, setKm] = useState(2.5); // mM
  const [temperature, setTemperature] = useState(37); // °C
  const [cultureTime, setCultureTime] = useState(10); // min (temps de réaction)
  const [initialPopulation, setInitialPopulation] = useState(50); // nM (concentration en enzyme [E]0)
  const [inhibitorType, setInhibitorType] = useState('none'); // 'none' | 'competitive' | 'non_competitive'
  const [inhibitorConc, setInhibitorConc] = useState(2.0); // mM ([I])
  const [ki, setKi] = useState(1.5); // mM (Ki)

  const [activeGraph, setActiveGraph] = useState('michaelis'); // 'michaelis' | 'lineweaver'
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Calculs cinétiques avec correction de température et inhibiteur
  const kinetics = useMemo(() => {
    // Facteur d'activité selon la température (Arrhenius jusqu'à 42°C, dénaturation rapide au-delà de 45°C)
    const tempActivity =
      temperature < 40
        ? Math.pow(1.8, (temperature - 37) / 10)
        : Math.max(0.05, 1.2 - Math.pow((temperature - 40) / 7, 2));

    // Effet de la concentration d'enzyme sur la vitesse apparente
    const enzymeFactor = initialPopulation / 50;

    // Calcul des paramètres apparents selon l'inhibition
    let apparentKm = km;
    let apparentVmax = vmax * tempActivity * enzymeFactor;

    if (inhibitorType === 'competitive' && inhibitorConc > 0) {
      apparentKm = km * (1 + inhibitorConc / ki);
    } else if (inhibitorType === 'non_competitive' && inhibitorConc > 0) {
      apparentVmax = (vmax * tempActivity * enzymeFactor) / (1 + inhibitorConc / ki);
    }

    // Vitesse initiale v0 pour la concentration [S] choisie
    const v0 = (apparentVmax * substrateConcentration) / (apparentKm + substrateConcentration);

    // Saturation du site actif (%)
    const saturation = (substrateConcentration / (apparentKm + substrateConcentration)) * 100;

    // Produit formé cumulé en nmol sur le temps de réaction
    const productFormed = v0 * cultureTime;

    // Génération de points de courbe pour [S] allant de 0 à 30 mM
    const michaelisCurvePoints = [];
    const lineweaverPoints = [];

    for (let s = 0.5; s <= 30; s += 0.5) {
      const v = (apparentVmax * s) / (apparentKm + s);
      michaelisCurvePoints.push({ s, v });
      if (s >= 1) {
        lineweaverPoints.push({ invS: 1 / s, invV: 1 / v });
      }
    }

    // Points de comparaison témoin sans inhibiteur
    const controlCurvePoints = [];
    const controlVmax = vmax * tempActivity * enzymeFactor;
    for (let s = 0.5; s <= 30; s += 0.5) {
      const vCtrl = (controlVmax * s) / (km + s);
      controlCurvePoints.push({ s, v: vCtrl });
    }

    return {
      apparentKm,
      apparentVmax,
      v0,
      saturation,
      productFormed,
      michaelisCurvePoints,
      controlCurvePoints,
      lineweaverPoints,
      tempActivity,
    };
  }, [
    substrateConcentration,
    vmax,
    km,
    temperature,
    cultureTime,
    initialPopulation,
    inhibitorType,
    inhibitorConc,
    ki,
  ]);

  const currentParams = {
    substrateConcentration,
    vmax,
    km,
    temperature,
    cultureTime,
    initialPopulation,
    inhibitorType,
    inhibitorConc,
    ki,
  };

  const experimentalResults = {
    'Vitesse Initiale (v0)': {
      value: kinetics.v0.toFixed(2),
      unit: 'µmol/(min·mg)',
      comment: `Pour [S] = ${substrateConcentration} mM`,
    },
    'Km Apparent': {
      value: kinetics.apparentKm.toFixed(2),
      unit: 'mM',
      comment: inhibitorType === 'competitive' ? 'Augmentation due à l\'inhibiteur compétitif' : 'Constante intrinsèque',
    },
    'Vmax Apparent': {
      value: kinetics.apparentVmax.toFixed(2),
      unit: 'µmol/(min·mg)',
      comment: inhibitorType === 'non_competitive' ? 'Diminution par fixation allostérique' : 'Vmax optimale corrigée',
    },
    'Taux de Saturation': {
      value: kinetics.saturation.toFixed(1),
      unit: '%',
      comment: kinetics.saturation > 80 ? 'Régime d\'ordre 0 (sites saturés)' : 'Régime d\'ordre 1 (proportionnel)',
    },
    'Produit Formé Estimé': {
      value: kinetics.productFormed.toFixed(1),
      unit: 'µmol',
      comment: `Après ${cultureTime} minutes de cinétique`,
    },
  };

  const handleReset = () => {
    setSubstrateConcentration(10);
    setVmax(100);
    setKm(2.5);
    setTemperature(37);
    setCultureTime(10);
    setInitialPopulation(50);
    setInhibitorType('none');
    setInhibitorConc(2.0);
    setKi(1.5);
  };

  const applyPreset = (preset) => {
    if (preset.substrateConcentration !== undefined) setSubstrateConcentration(preset.substrateConcentration);
    if (preset.vmax !== undefined) setVmax(preset.vmax);
    if (preset.km !== undefined) setKm(preset.km);
    if (preset.temperature !== undefined) setTemperature(preset.temperature);
    if (preset.inhibitorType !== undefined) setInhibitorType(preset.inhibitorType);
    if (preset.inhibitorConc !== undefined) setInhibitorConc(preset.inhibitorConc);
    if (preset.ki !== undefined) setKi(preset.ki);
  };

  return (
    <div className="space-y-6 text-left">
      {/* En-tête du module */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono">
              {moduleData?.code || 'BIO102'} · FONDAMENTAUX (L1-L2)
            </span>
            <span className="text-xs text-slate-400 font-mono">Banc d'Essai d'Enzymologie</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <Activity className="text-indigo-400" size={24} />
            <span>Cinétique Enzymatique de Michaelis-Menten & Lineweaver-Burk</span>
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Modélisation de la vitesse initiale v₀ = (Vmax · [S]) / (Km + [S]), linéarisation en double inverse, effet de la température et discrimination des inhibiteurs compétitifs/non-compétitifs.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          <button
            type="button"
            onClick={handleReset}
            className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors cursor-pointer"
            title="Réinitialiser les paramètres"
          >
            <RotateCcw size={16} />
          </button>

          <button
            type="button"
            onClick={() => onNavigateToExam && onNavigateToExam('Cinétique Enzymatique')}
            className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-indigo-400 hover:text-indigo-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
            title="S'entraîner aux examens et TD d'enzymologie"
          >
            <GraduationCap size={15} />
            <span>Mode Examen & TD</span>
          </button>

          <button
            type="button"
            onClick={() => setIsExportOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-900/30 cursor-pointer"
          >
            <FileText size={15} />
            <span>Exporter Rapport TP (PDF A4)</span>
          </button>
        </div>
      </div>

      {/* Presets rapides */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-mono font-bold text-slate-400 flex items-center gap-1.5 mr-1">
          <Sparkles size={14} className="text-indigo-400" />
          <span>Protocoles Types :</span>
        </span>
        {moduleData?.presets?.map((p, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => applyPreset(p)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/40 text-[11px] text-slate-300 transition-colors font-medium"
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* Grille principale : Paramètres à gauche, Graphique interactif à droite */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* PARAMÈTRES ENZYMATIQUES (Champs Libres) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sliders size={16} className="text-indigo-400" />
                <span>Paramètres de Réaction Bio-catalytique</span>
              </h3>
              <span className="text-[10px] font-mono text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-500/30">
                Champs Libres
              </span>
            </div>

            {/* 1. Concentration en Substrat [S] */}
            <div className="space-y-1 text-xs">
              <div className="flex justify-between font-bold text-slate-300">
                <label className="flex items-center gap-1.5">
                  <FlaskConical size={13} className="text-slate-400" />
                  <span>Concentration en Substrat ([S]) :</span>
                </label>
                <span className="font-mono text-indigo-400">{substrateConcentration} mM</span>
              </div>
              <input
                type="number"
                min="0.1"
                max="50"
                step="0.5"
                value={substrateConcentration}
                onChange={(e) => setSubstrateConcentration(Math.max(0.1, Number(e.target.value) || 0.1))}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:border-indigo-500/60 focus:outline-none"
              />
              <input
                type="range"
                min="0.5"
                max="30"
                step="0.5"
                value={substrateConcentration}
                onChange={(e) => setSubstrateConcentration(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>

            {/* 2. Constantes Vmax et Km */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <label className="block text-slate-300 font-bold">Vmax Initiale :</label>
                <input
                  type="number"
                  min="10"
                  max="300"
                  step="5"
                  value={vmax}
                  onChange={(e) => setVmax(Math.max(5, Number(e.target.value) || 10))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:border-indigo-500/60 focus:outline-none"
                />
                <span className="text-[10px] text-slate-500">µmol/(min·mg)</span>
              </div>

              <div className="space-y-1">
                <label className="block text-slate-300 font-bold">Constante Km :</label>
                <input
                  type="number"
                  min="0.1"
                  max="15"
                  step="0.1"
                  value={km}
                  onChange={(e) => setKm(Math.max(0.1, Number(e.target.value) || 0.1))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:border-indigo-500/60 focus:outline-none"
                />
                <span className="text-[10px] text-slate-500">mM (Affinité)</span>
              </div>
            </div>

            {/* 3. Température (°C) */}
            <div className="space-y-1 text-xs">
              <div className="flex justify-between font-bold text-slate-300">
                <label className="flex items-center gap-1.5">
                  <Thermometer size={13} className="text-slate-400" />
                  <span>Température Réactionnelle (T) :</span>
                </label>
                <span className="font-mono text-indigo-400">{temperature} °C</span>
              </div>
              <input
                type="number"
                min="10"
                max="60"
                step="1"
                value={temperature}
                onChange={(e) => setTemperature(Number(e.target.value) || 37)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:border-indigo-500/60 focus:outline-none"
              />
              <span className="text-[10px] text-slate-500">
                {temperature > 45 ? '⚠️ Zone de dénaturation thermique de la structure tertiaire.' : 'Zone physiologique optimale.'}
              </span>
            </div>

            {/* 4. Temps d'incubation & Population enzymatique */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <label className="flex items-center gap-1 text-slate-300 font-bold">
                  <Clock size={12} className="text-slate-400" />
                  <span>Durée (min) :</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={cultureTime}
                  onChange={(e) => setCultureTime(Math.max(1, Number(e.target.value) || 1))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="flex items-center gap-1 text-slate-300 font-bold">
                  <Percent size={12} className="text-slate-400" />
                  <span>[Enzyme] [E]₀ :</span>
                </label>
                <input
                  type="number"
                  min="5"
                  max="200"
                  value={initialPopulation}
                  onChange={(e) => setInitialPopulation(Math.max(1, Number(e.target.value) || 1))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs"
                />
              </div>
            </div>

            {/* 5. Inhibiteurs enzymatiques */}
            <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
              <label className="block text-slate-300 font-bold">Type d'Inhibiteur Chimique :</label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'none', label: 'Aucun' },
                  { id: 'competitive', label: 'Compétitif' },
                  { id: 'non_competitive', label: 'Non-Compétitif' },
                ].map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setInhibitorType(type.id)}
                    className={`py-1.5 px-2 rounded-xl text-[11px] font-bold border transition-colors ${
                      inhibitorType === type.id
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>

              {inhibitorType !== 'none' && (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <label className="text-[10px] text-slate-400 block font-mono">Dose [I] (mM) :</label>
                    <input
                      type="number"
                      step="0.5"
                      min="0.1"
                      value={inhibitorConc}
                      onChange={(e) => setInhibitorConc(Number(e.target.value))}
                      className="w-full p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block font-mono">Constante Ki (mM) :</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      value={ki}
                      onChange={(e) => setKi(Number(e.target.value))}
                      className="w-full p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono text-xs"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* VISUALISATION DES COURBES & LINÉARISATION */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-md space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <TrendingUp size={16} className="text-indigo-400" />
                  <span>Tracé Cinétique & Linéarisation Mathématique</span>
                </h3>
                <span className="text-xs text-slate-400">
                  {activeGraph === 'michaelis'
                    ? 'Courbe hyperbolique v₀ = f([S])'
                    : 'Représentation en double inverse 1/v = f(1/[S])'}
                </span>
              </div>

              {/* Bouton bascule de graphe */}
              <div className="inline-flex p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setActiveGraph('michaelis')}
                  className={`px-3 py-1 rounded-lg transition-colors ${
                    activeGraph === 'michaelis'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Michaelis-Menten
                </button>
                <button
                  type="button"
                  onClick={() => setActiveGraph('lineweaver')}
                  className={`px-3 py-1 rounded-lg transition-colors ${
                    activeGraph === 'lineweaver'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Lineweaver-Burk
                </button>
              </div>
            </div>

            {/* Graphe SVG Dynamique */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              {activeGraph === 'michaelis' ? (
                <svg viewBox="0 0 400 220" className="w-full h-56">
                  {/* Axes */}
                  <line x1="45" y1="185" x2="380" y2="185" stroke="#475569" strokeWidth="1.5" />
                  <line x1="45" y1="20" x2="45" y2="185" stroke="#475569" strokeWidth="1.5" />

                  {/* Graduations et labels */}
                  <text x="375" y="200" fill="#94a3b8" fontSize="9" textAnchor="end" fontFamily="monospace">
                    [S] (mM)
                  </text>
                  <text x="15" y="30" fill="#94a3b8" fontSize="9" textAnchor="start" fontFamily="monospace">
                    v₀ (µmol/min)
                  </text>

                  {/* Ligne pointillée Vmax */}
                  {(() => {
                    const yMax = 185 - (kinetics.apparentVmax / 150) * 150;
                    return (
                      <>
                        <line x1="45" y1={yMax} x2="380" y2={yMax} stroke="#64748b" strokeDasharray="3 3" />
                        <text x="50" y={yMax - 5} fill="#64748b" fontSize="8" fontFamily="monospace">
                          Vmax = {kinetics.apparentVmax.toFixed(0)}
                        </text>
                      </>
                    );
                  })()}

                  {/* Courbe témoin si inhibiteur actif */}
                  {inhibitorType !== 'none' && (
                    <path
                      d={
                        'M 45 185 ' +
                        kinetics.controlCurvePoints
                          .map((pt) => {
                            const x = 45 + (pt.s / 30) * 330;
                            const y = 185 - (pt.v / 150) * 150;
                            return `L ${x.toFixed(1)} ${y.toFixed(1)}`;
                          })
                          .join(' ')
                      }
                      fill="none"
                      stroke="#475569"
                      strokeWidth="1.5"
                      strokeDasharray="4 2"
                    />
                  )}

                  {/* Courbe active */}
                  <path
                    d={
                      'M 45 185 ' +
                      kinetics.michaelisCurvePoints
                        .map((pt) => {
                          const x = 45 + (pt.s / 30) * 330;
                          const y = 185 - (pt.v / 150) * 150;
                          return `L ${x.toFixed(1)} ${y.toFixed(1)}`;
                        })
                        .join(' ')
                    }
                    fill="none"
                    stroke="#818cf8"
                    strokeWidth="2.5"
                  />

                  {/* Point de fonctionnement actuel pour [S] choisi */}
                  {(() => {
                    const curX = 45 + (substrateConcentration / 30) * 330;
                    const curY = 185 - (kinetics.v0 / 150) * 150;
                    return (
                      <g>
                        <circle cx={curX} cy={curY} r="5" fill="#a855f7" stroke="#ffffff" strokeWidth="1.5" />
                        <line x1={curX} y1={curY} x2={curX} y2="185" stroke="#a855f7" strokeDasharray="2 2" />
                        <line x1="45" y1={curY} x2={curX} y2={curY} stroke="#a855f7" strokeDasharray="2 2" />
                        <text x={curX} y={curY - 10} fill="#f1f5f9" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                          v₀={kinetics.v0.toFixed(1)}
                        </text>
                      </g>
                    );
                  })()}
                </svg>
              ) : (
                <svg viewBox="0 0 400 220" className="w-full h-56">
                  {/* Lineweaver-Burk Double Inverse */}
                  <line x1="120" y1="185" x2="380" y2="185" stroke="#475569" strokeWidth="1.5" />
                  <line x1="120" y1="20" x2="120" y2="185" stroke="#475569" strokeWidth="1.5" />

                  <text x="375" y="200" fill="#94a3b8" fontSize="9" textAnchor="end" fontFamily="monospace">
                    1/[S] (mM⁻¹)
                  </text>
                  <text x="125" y="30" fill="#94a3b8" fontSize="9" textAnchor="start" fontFamily="monospace">
                    1/v₀ (min·mg/µmol)
                  </text>

                  {/* Droite de régression 1/v = (Km/Vmax)*(1/S) + 1/Vmax */}
                  {(() => {
                    const invVmax = 1 / kinetics.apparentVmax;
                    const slope = kinetics.apparentKm / kinetics.apparentVmax;
                    const yAtZero = 185 - invVmax * 8000;
                    const yAtMaxS = 185 - (invVmax + slope * 1.5) * 8000;

                    return (
                      <g>
                        <line x1="120" y1={yAtZero} x2="360" y2={yAtMaxS} stroke="#818cf8" strokeWidth="2.5" />
                        {/* Intersection avec axe des abscisses (-1/Km) */}
                        <line x1="60" y1="185" x2="120" y2={yAtZero} stroke="#a855f7" strokeDasharray="3 3" />
                        <text x="60" y="198" fill="#a855f7" fontSize="8" fontFamily="monospace">
                          -1/Km
                        </text>
                        <text x="100" y={yAtZero - 5} fill="#818cf8" fontSize="8" fontFamily="monospace" textAnchor="end">
                          1/Vmax
                        </text>
                      </g>
                    );
                  })()}
                </svg>
              )}
            </div>

            {/* Cartouches de résultats numériques */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 block">Vitesse Initiale (v₀)</span>
                <span className="text-lg font-black font-mono text-indigo-400">
                  {kinetics.v0.toFixed(2)}
                </span>
                <span className="text-[9px] text-slate-500 block">µmol/(min·mg)</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 block">Km Apparent</span>
                <span className="text-lg font-black font-mono text-purple-400">
                  {kinetics.apparentKm.toFixed(2)}
                </span>
                <span className="text-[9px] text-slate-500 block">mM (Affinité)</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 block">Vmax Apparente</span>
                <span className="text-lg font-black font-mono text-pink-400">
                  {kinetics.apparentVmax.toFixed(1)}
                </span>
                <span className="text-[9px] text-slate-500 block">µmol/min</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 block">Saturation Enzyme</span>
                <span className="text-lg font-black font-mono text-emerald-400">
                  {kinetics.saturation.toFixed(1)} %
                </span>
                <span className="text-[9px] text-slate-500 block">Sites [ES] occupés</span>
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
