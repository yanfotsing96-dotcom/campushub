import { useState, useMemo } from 'react';
import {
  Atom,
  RotateCcw,
  Download,
  Sparkles,
  SlidersHorizontal,
} from 'lucide-react';
import { PHYSICS_MODULES, PHYSICAL_CONSTANTS, wavelengthToRGB } from './physicsData';

export default function OpticsModule({ onExport }) {
  const moduleData = PHYSICS_MODULES.find((m) => m.id === 'optics');

  // Paramètres réglables (Champs libres)
  const [n1, setN1] = useState(1.0); // Milieu 1 (ex: Air)
  const [n2, setN2] = useState(1.5); // Milieu 2 (ex: Verre)
  const [theta1, setTheta1] = useState(35); // Degrés
  const [wavelength, setWavelength] = useState(589); // nm (Raie Jaune Sodium)

  // Vitesse de la lumière
  const c = PHYSICAL_CONSTANTS.c;
  const v1 = c / n1;
  const v2 = c / n2;

  // Calculs de Snell-Descartes : n1 * sin(theta1) = n2 * sin(theta2)
  const theta1Rad = (theta1 * Math.PI) / 180;
  const sinTheta1 = Math.sin(theta1Rad);
  const sinTheta2 = (n1 * sinTheta1) / n2;

  // Condition de réflexion totale
  const isTotalReflection = sinTheta2 > 1.0;
  const theta2Rad = isTotalReflection ? null : Math.asin(sinTheta2);
  const theta2Deg = theta2Rad !== null ? (theta2Rad * 180) / Math.PI : null;

  // Angle critique limite θ_c (si n1 > n2)
  const criticalAngleDeg = n1 > n2 ? (Math.asin(n2 / n1) * 180) / Math.PI : null;

  // Déviation angulaire D = |θ1 - θ2|
  const deviationDeg = theta2Deg !== null ? Math.abs(theta1 - theta2Deg) : null;

  // Coefficients de réflexion de Fresnel (moyenne non-polarisée)
  const fresnelCoeffs = useMemo(() => {
    if (isTotalReflection) return { R: 1.0, T: 0.0 };
    if (theta1 === 0) {
      const r0 = Math.pow((n1 - n2) / (n1 + n2), 2);
      return { R: r0, T: 1 - r0 };
    }
    const cos1 = Math.cos(theta1Rad);
    const cos2 = Math.cos(theta2Rad);

    const rs = Math.pow((n1 * cos1 - n2 * cos2) / (n1 * cos1 + n2 * cos2), 2);
    const rp = Math.pow((n1 * cos2 - n2 * cos1) / (n1 * cos2 + n2 * cos1), 2);
    const R = (rs + rp) / 2;
    return { R, T: 1 - R };
  }, [n1, n2, theta1, theta1Rad, theta2Rad, isTotalReflection]);

  // Couleur CSS dynamique du faisceau selon λ
  const beamColor = wavelengthToRGB(wavelength);

  // Coordonnées du tracé de rayons dans le SVG (viewBox 0 0 600 320)
  // Interface horizontale à Y = 160. Point d'impact au centre (300, 160).
  const rayCoordinates = useMemo(() => {
    const cx = 300;
    const cy = 160;
    const rayLength = 130;

    // Rayon incident (vient du haut-gauche)
    // Angle par rapport à la normale verticale (x = 300, y <= 160)
    const incStartX = cx - rayLength * Math.sin(theta1Rad);
    const incStartY = cy - rayLength * Math.cos(theta1Rad);

    // Rayon réfléchi (part vers le haut-droite avec le même angle theta1)
    const refEndX = cx + rayLength * Math.sin(theta1Rad);
    const refEndY = cy - rayLength * Math.cos(theta1Rad);

    // Rayon réfracté (part vers le bas-droite avec l'angle theta2)
    let refrEndX = null;
    let refrEndY = null;
    if (!isTotalReflection && theta2Rad !== null) {
      refrEndX = cx + rayLength * Math.sin(theta2Rad);
      refrEndY = cy + rayLength * Math.cos(theta2Rad);
    }

    return {
      cx,
      cy,
      incStartX,
      incStartY,
      refEndX,
      refEndY,
      refrEndX,
      refrEndY,
    };
  }, [theta1Rad, theta2Rad, isTotalReflection]);

  const handleExportClick = () => {
    onExport({
      moduleData,
      currentParams: {
        'Indice milieu 1 (n1)': `${n1}`,
        'Indice milieu 2 (n2)': `${n2}`,
        'Angle d\'incidence (θ1)': `${theta1}°`,
        'Longueur d\'onde incidente (λ)': `${wavelength} nm`,
      },
      computedResults: {
        'Angle de réfraction (θ2)': {
          val: isTotalReflection ? 'RÉFLEXION TOTALE' : `${theta2Deg.toFixed(2)}°`,
          unit: isTotalReflection ? '' : 'degrés',
          comment: isTotalReflection ? 'Onde évanescente sans rayon transmis' : 'Loi de Descartes n1·sin(θ1) = n2·sin(θ2)',
        },
        'Angle critique limite (θ_c)': {
          val: criticalAngleDeg !== null ? criticalAngleDeg.toFixed(2) : 'N/A (n1 ≤ n2)',
          unit: criticalAngleDeg !== null ? '°' : '',
          comment: n1 > n2 ? 'Seuil au-delà duquel la réflexion est totale' : 'Réfraction possible jusqu\'à 90°',
        },
        'Déviation angulaire D': {
          val: deviationDeg !== null ? `${deviationDeg.toFixed(2)}°` : 'N/A',
          unit: '°',
          comment: '|θ1 - θ2|',
        },
        'Réflectance énergétique R': {
          val: `${(fresnelCoeffs.R * 100).toFixed(1)}%`,
          unit: '',
          comment: 'Coefficients de Fresnel',
        },
        'Transmittance énergétique T': {
          val: `${(fresnelCoeffs.T * 100).toFixed(1)}%`,
          unit: '',
          comment: 'T = 1 - R',
        },
        'Vitesse dans milieu 1 (v1)': {
          val: (v1 / 1e6).toFixed(1),
          unit: '10⁶ m/s',
          comment: `v1 = c / ${n1}`,
        },
        'Vitesse dans milieu 2 (v2)': {
          val: (v2 / 1e6).toFixed(1),
          unit: '10⁶ m/s',
          comment: `v2 = c / ${n2}`,
        },
      },
    });
  };

  const handlePresetSelect = (preset) => {
    setN1(preset.n1);
    setN2(preset.n2);
    setTheta1(preset.theta1);
    setWavelength(preset.wavelength);
  };

  const handleReset = () => {
    setN1(1.0);
    setN2(1.5);
    setTheta1(35);
    setWavelength(589);
  };

  return (
    <div className="space-y-6 text-left">
      {/* En-tête */}
      <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shrink-0">
            <Atom size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                PHY201 · L2
              </span>
              <span className="text-xs text-slate-400">Fondamentaux</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white mt-0.5">
              Optique Géométrique & Réfraction Dioptrique
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
        {/* Colonne Gauche : Paramètres n1, n2, theta1, lambda */}
        <div className="lg:col-span-5 space-y-5">
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <SlidersHorizontal size={16} className="text-indigo-400" />
                <span>Propriétés des Milieux & Faisceau</span>
              </h3>
              <span className="text-[11px] text-slate-400 font-mono">Loi de Descartes</span>
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

            {/* Indice n1 */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-medium">Indice milieu 1 (n₁) :</span>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min="1.0"
                    max="3.0"
                    step="0.01"
                    value={n1}
                    onChange={(e) => setN1(Math.max(1.0, Number(e.target.value)))}
                    className="w-20 px-2 py-0.5 rounded-lg bg-slate-950 border border-slate-700 text-indigo-300 font-mono text-right text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
              <input
                type="range"
                min="1.0"
                max="2.5"
                step="0.01"
                value={n1}
                onChange={(e) => setN1(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
            </div>

            {/* Indice n2 */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-medium">Indice milieu 2 (n₂) :</span>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min="1.0"
                    max="3.0"
                    step="0.01"
                    value={n2}
                    onChange={(e) => setN2(Math.max(1.0, Number(e.target.value)))}
                    className="w-20 px-2 py-0.5 rounded-lg bg-slate-950 border border-slate-700 text-indigo-300 font-mono text-right text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
              <input
                type="range"
                min="1.0"
                max="2.5"
                step="0.01"
                value={n2}
                onChange={(e) => setN2(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
            </div>

            {/* Angle d'incidence theta1 */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-medium">Angle d'incidence θ₁ (°) :</span>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min="0"
                    max="89"
                    step="0.5"
                    value={theta1}
                    onChange={(e) => setTheta1(Math.min(89, Math.max(0, Number(e.target.value))))}
                    className="w-20 px-2 py-0.5 rounded-lg bg-slate-950 border border-slate-700 text-indigo-300 font-mono text-right text-xs focus:outline-none focus:border-indigo-500"
                  />
                  <span className="text-slate-400 font-mono">°</span>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="89"
                step="0.5"
                value={theta1}
                onChange={(e) => setTheta1(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
            </div>

            {/* Longueur d'onde spectrale lambda */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-medium flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full border border-white/20 inline-block shadow-sm"
                    style={{ backgroundColor: beamColor }}
                  />
                  <span>Longueur d'onde λ (nm) :</span>
                </span>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min="380"
                    max="750"
                    step="1"
                    value={wavelength}
                    onChange={(e) => setWavelength(Math.min(750, Math.max(380, Number(e.target.value))))}
                    className="w-20 px-2 py-0.5 rounded-lg bg-slate-950 border border-slate-700 text-indigo-300 font-mono text-right text-xs focus:outline-none focus:border-indigo-500"
                  />
                  <span className="text-slate-400 font-mono">nm</span>
                </div>
              </div>
              <input
                type="range"
                min="380"
                max="750"
                step="1"
                value={wavelength}
                onChange={(e) => setWavelength(Number(e.target.value))}
                className="w-full cursor-pointer h-2 rounded-lg"
                style={{
                  background: 'linear-gradient(to right, #7e22ce, #3b82f6, #10b981, #eab308, #f97316, #ef4444)',
                }}
              />
            </div>
          </div>
        </div>

        {/* Colonne Droite : Banc d'Optique SVG & KPIs */}
        <div className="lg:col-span-7 space-y-5">
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Atom size={16} className="text-indigo-400" />
                  <span>Banc d'Optique Géométrique Virtuel</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Représentation des rayons lumineux à la traversée du dioptre plan.
                </p>
              </div>

              {isTotalReflection ? (
                <span className="px-3 py-1 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold">
                  Réflexion Totale Interne
                </span>
              ) : (
                <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
                  Réfraction Active
                </span>
              )}
            </div>

            {/* Schéma Optique SVG */}
            <div className="relative w-full h-72 rounded-2xl bg-slate-950 border border-slate-800/90 overflow-hidden flex items-center justify-center">
              <svg viewBox="0 0 600 320" className="w-full h-full select-none">
                {/* Zone Milieu 1 (Haut) */}
                <rect x="0" y="0" width="600" height="160" fill="#0f172a" fillOpacity="0.4" />
                <text x="20" y="30" fill="#94a3b8" fontSize="11" fontFamily="sans-serif" fontWeight="bold">
                  Milieu 1 : n₁ = {n1.toFixed(2)}
                </text>
                <text x="20" y="48" fill="#64748b" fontSize="10" fontFamily="monospace">
                  v₁ = {(v1 / 1e6).toFixed(1)} × 10⁶ m/s
                </text>

                {/* Zone Milieu 2 (Bas) */}
                <rect x="0" y="160" width="600" height="160" fill="#1e1b4b" fillOpacity="0.4" />
                <text x="20" y="190" fill="#a5b4fc" fontSize="11" fontFamily="sans-serif" fontWeight="bold">
                  Milieu 2 : n₂ = {n2.toFixed(2)}
                </text>
                <text x="20" y="208" fill="#64748b" fontSize="10" fontFamily="monospace">
                  v₂ = {(v2 / 1e6).toFixed(1)} × 10⁶ m/s
                </text>

                {/* Dioptre Plan (Ligne horizontale à Y = 160) */}
                <line x1="0" y1="160" x2="600" y2="160" stroke="#475569" strokeWidth="2" />

                {/* Normale au dioptre (Ligne verticale pointillée à X = 300) */}
                <line x1="300" y1="20" x2="300" y2="300" stroke="#64748b" strokeWidth="1.5" strokeDasharray="4 4" />
                <text x="306" y="35" fill="#64748b" fontSize="10" fontFamily="sans-serif">
                  Normale
                </text>

                {/* Rayon Incident */}
                <line
                  x1={rayCoordinates.incStartX}
                  y1={rayCoordinates.incStartY}
                  x2={rayCoordinates.cx}
                  y2={rayCoordinates.cy}
                  stroke={beamColor}
                  strokeWidth="3.5"
                  className="filter drop-shadow-md"
                />

                {/* Rayon Réfléchi */}
                <line
                  x1={rayCoordinates.cx}
                  y1={rayCoordinates.cy}
                  x2={rayCoordinates.refEndX}
                  y2={rayCoordinates.refEndY}
                  stroke={beamColor}
                  strokeWidth={isTotalReflection ? 3.5 : 2}
                  strokeOpacity={isTotalReflection ? 1.0 : fresnelCoeffs.R * 0.9 + 0.15}
                  strokeDasharray={isTotalReflection ? 'none' : '3 1'}
                />

                {/* Rayon Réfracté (si pas réflexion totale) */}
                {!isTotalReflection && rayCoordinates.refrEndX !== null && (
                  <line
                    x1={rayCoordinates.cx}
                    y1={rayCoordinates.cy}
                    x2={rayCoordinates.refrEndX}
                    y2={rayCoordinates.refrEndY}
                    stroke={beamColor}
                    strokeWidth="3"
                    strokeOpacity={fresnelCoeffs.T * 0.9 + 0.1}
                  />
                )}

                {/* Point d'impact */}
                <circle cx="300" cy="160" r="5" fill="#ffffff" />

                {/* Annotations d'angles */}
                <text x="270" y="110" fill="#e2e8f0" fontSize="11" fontFamily="monospace" fontWeight="bold">
                  θ₁ = {theta1}°
                </text>
                {!isTotalReflection && theta2Deg !== null && (
                  <text x="325" y="220" fill="#a5b4fc" fontSize="11" fontFamily="monospace" fontWeight="bold">
                    θ₂ = {theta2Deg.toFixed(1)}°
                  </text>
                )}
              </svg>

              {/* Ticker d'information */}
              <div className="absolute top-3 right-3 p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] font-mono text-slate-300 space-y-0.5">
                <div>λ = <span className="text-amber-400 font-bold">{wavelength} nm</span></div>
                <div>Réflectance R = {(fresnelCoeffs.R * 100).toFixed(1)}%</div>
                <div>Transmittance T = {(fresnelCoeffs.T * 100).toFixed(1)}%</div>
              </div>
            </div>
          </div>

          {/* Grille de KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[11px] block">Angle Réfracté θ₂</span>
              <div className="text-xl font-bold font-mono text-indigo-400">
                {isTotalReflection ? 'Aucun' : `${theta2Deg.toFixed(2)}°`}
              </div>
              <span className="text-[10px] text-slate-500 font-mono block">
                {isTotalReflection ? 'Réflexion 100%' : 'Dans milieu 2'}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[11px] block">Angle Limite θ_c</span>
              <div className="text-xl font-bold font-mono text-violet-400">
                {criticalAngleDeg !== null ? `${criticalAngleDeg.toFixed(2)}°` : 'N/A'}
              </div>
              <span className="text-[10px] text-slate-500 font-mono block">
                {n1 > n2 ? 'Condition n₁ > n₂' : 'Pas d\'angle limite'}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[11px] block">Déviation D</span>
              <div className="text-xl font-bold font-mono text-cyan-400">
                {deviationDeg !== null ? `${deviationDeg.toFixed(2)}°` : '—'}
              </div>
              <span className="text-[10px] text-slate-500 font-mono block">|θ₁ - θ₂|</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[11px] block">Rapport des Vitesses</span>
              <div className="text-xl font-bold font-mono text-emerald-400">
                {(n2 / n1).toFixed(2)}
              </div>
              <span className="text-[10px] text-slate-500 font-mono block">v₁ / v₂ = n₂ / n₁</span>
            </div>
          </div>

          {/* Synthèse Pédagogique */}
          <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/20 text-indigo-200/90 text-xs leading-relaxed space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-indigo-300">
              <Sparkles size={14} />
              <span>Application Technologique : Fibre Optique & Endoscopie :</span>
            </div>
            <p>
              Lorsque la lumière se propage d'un milieu plus réfringent vers un milieu moins réfringent (n₁ &gt; n₂), dès que l'angle d'incidence excède θ_c = arcsin(n₂ / n₁), aucun rayon ne traverse : 100% du flux lumineux est confiné dans le cœur de la fibre sans perte par réfraction.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
