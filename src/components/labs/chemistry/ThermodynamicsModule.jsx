import { useState, useMemo } from 'react';
import { Flame, FileText } from 'lucide-react';
import { THERMODYNAMIC_REACTIONS } from './chemistryData';
import TPReportModal from './TPReportModal';

export default function ThermodynamicsModule() {
  const [selectedReactionId, setSelectedReactionId] = useState(THERMODYNAMIC_REACTIONS[0].id);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const activeReaction = useMemo(() => {
    return (
      THERMODYNAMIC_REACTIONS.find((r) => r.id === selectedReactionId) ||
      THERMODYNAMIC_REACTIONS[0]
    );
  }, [selectedReactionId]);

  // Variables thermodynamiques modifiables
  const [temperatureK, setTemperatureK] = useState(298.15); // Kelvin (25 °C)
  const [deltaH, setDeltaH] = useState(activeReaction.deltaH); // kJ/mol
  const [deltaS, setDeltaS] = useState(activeReaction.deltaS); // J/(mol·K)

  // Met à jour les valeurs lors du changement de preset
  const handleSelectReaction = (reaction) => {
    setSelectedReactionId(reaction.id);
    setDeltaH(reaction.deltaH);
    setDeltaS(reaction.deltaS);
  };

  const R = 8.314; // Constante des gaz parfaits en J/(mol·K)

  // Calculs fondamentaux de Gibbs
  const thermoAnalysis = useMemo(() => {
    // DeltaG = DeltaH - T * DeltaS
    // Attention aux unités : DeltaH en kJ/mol -> convertir en J/mol ou DeltaS en kJ/(mol·K)
    const deltaH_J = deltaH * 1000; // J/mol
    const deltaG_J = deltaH_J - temperatureK * deltaS; // J/mol
    const deltaG_kJ = deltaG_J / 1000; // kJ/mol

    // Spontanéité
    const isSpontaneous = deltaG_kJ < 0;
    const isEquilibrium = Math.abs(deltaG_kJ) < 0.1;

    // Température d'inversion T_inv = DeltaH / DeltaS (si même signe)
    let tInversion = null;
    if ((deltaH > 0 && deltaS > 0) || (deltaH < 0 && deltaS < 0)) {
      tInversion = deltaH_J / deltaS; // en Kelvin
    }

    // Constante d'équilibre K_eq = exp(-DeltaG° / (R * T))
    const exponent = -deltaG_J / (R * temperatureK);
    let kEqFormatted;
    if (exponent > 100) {
      kEqFormatted = '> 10⁴⁰ (Totale)';
    } else if (exponent < -100) {
      kEqFormatted = '< 10⁻⁴⁰ (Négligeable)';
    } else {
      const kVal = Math.exp(exponent);
      kEqFormatted = kVal >= 1000 || kVal <= 0.001 ? kVal.toExponential(2) : kVal.toFixed(3);
    }

    // Détermination du quadrant thermodynamique
    let quadrantDescription;
    if (deltaH < 0 && deltaS > 0) {
      quadrantDescription = 'Exothermique & Entropie favorable : Spontanée à TOUTES températures (ΔG < 0 toujours).';
    } else if (deltaH > 0 && deltaS < 0) {
      quadrantDescription = 'Endothermique & Entropie défavorable : JAMAIS spontanée à aucune température (ΔG > 0 toujours).';
    } else if (deltaH < 0 && deltaS < 0) {
      quadrantDescription = 'Exothermique & Entropie défavorable : Spontanée UNIQUEMENT à basse température (T < T_inv).';
    } else {
      quadrantDescription = 'Endothermique & Entropie favorable : Spontanée UNIQUEMENT à haute température (T > T_inv).';
    }

    return {
      deltaG_kJ: Number(deltaG_kJ.toFixed(2)),
      isSpontaneous,
      isEquilibrium,
      tInversion: tInversion ? Number(tInversion.toFixed(1)) : null,
      kEqFormatted,
      quadrantDescription,
    };
  }, [deltaH, deltaS, temperatureK]);

  // Génération des points pour le graphe DeltaG(T) entre 100 K et 1200 K
  const graphPoints = useMemo(() => {
    const points = [];
    const minT = 100;
    const maxT = 1200;
    const step = 20;

    for (let t = minT; t <= maxT; t += step) {
      const g = deltaH - t * (deltaS / 1000); // kJ/mol
      points.push({ t, g });
    }
    return points;
  }, [deltaH, deltaS]);

  // Génération du compte-rendu de TP Markdown
  const generatedReport = useMemo(() => {
    return `# COMPTE-RENDU DE TP : THERMODYNAMIQUE CHIMIQUE & FONCTION DE GIBBS
**Plateforme Académique CampusHub · Pôle Sciences Chimiques (L3-Master)**
**Date de manipulation :** ${new Date().toLocaleDateString('fr-FR')}

---

## 1. Réaction Chimique Étudiée
- **Intitulé :** **${activeReaction.name}**
- **Équation stœchiométrique :** \`${activeReaction.formula}\`
- **Application industrielle / naturelle :** ${activeReaction.context}

## 2. Données Thermodynamiques Fondamentales
- Enthalpie standard de réaction ($\\Delta H^\\circ$) : **${deltaH} kJ/mol** (${deltaH > 0 ? 'Endothermique' : 'Exothermique'})
- Entropie standard de réaction ($\\Delta S^\\circ$) : **${deltaS} J/(mol·K)**
- Température de travail ($T$) : **${temperatureK} K** (${(temperatureK - 273.15).toFixed(1)} °C)

## 3. Énergie Libre de Gibbs & Spontanéité
- **Formulation :** $\\Delta G^\\circ(T) = \\Delta H^\\circ - T \\cdot \\Delta S^\\circ$
- **Calcul :** $\\Delta G^\\circ(${temperatureK}\\text{ K}) = ${deltaH} - ${temperatureK} \\times (${deltaS} / 1000) = \\mathbf{${thermoAnalysis.deltaG_kJ}\\text{ kJ/mol}}$
- **Diagnostic de spontanéité :** ${thermoAnalysis.isSpontaneous ? '✅ Spontanée sous 1 bar ($\\Delta G^\\circ < 0$)' : '❌ Non spontanée sous 1 bar ($\\Delta G^\\circ > 0$)'}
- **Constante d'équilibre thermodynamique ($K_{\\text{eq}}$) :** **${thermoAnalysis.kEqFormatted}**
${thermoAnalysis.tInversion ? `- **Température d'inversion ($T_{\\text{inv}} = \\Delta H^\\circ / \\Delta S^\\circ$) :** **${thermoAnalysis.tInversion} K** (${(thermoAnalysis.tInversion - 273.15).toFixed(1)} °C)` : ''}

## 4. Analyse du Quadrant Thermodynamique
${thermoAnalysis.quadrantDescription}
`;
  }, [activeReaction, deltaH, deltaS, temperatureK, thermoAnalysis]);

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
            <Flame size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-violet-500/20 text-violet-300 border border-violet-500/30 font-mono">
                L3 · MASTER AVANCÉ
              </span>
              <span className="text-xs text-slate-400">UE Thermo Chimique Approfondie & Équilibres</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Thermodynamique Chimique & Énergie Libre de Gibbs
            </h2>
          </div>
        </div>

        {/* Formule clef de Gibbs & Bouton Export TP */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block px-4 py-2 rounded-xl bg-slate-950 border border-violet-500/30 text-xs font-mono text-violet-300 shadow-inner">
            ΔG°(T) = ΔH° − T · ΔS°
          </div>

          <button
            type="button"
            onClick={() => setIsReportModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 border border-violet-500/40 text-xs font-bold flex items-center gap-2 transition-all shadow-lg shadow-violet-950/30 hover:shadow-violet-900/40"
            title="Consulter le compte-rendu de laboratoire"
          >
            <FileText size={15} className="text-violet-400" />
            <span>Compte-Rendu TP</span>
          </button>
        </div>
      </div>

      {/* Sélecteur de Réactions Thermodynamiques Réelles */}
      <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 backdrop-blur-xl">
        <label className="block text-xs font-medium text-slate-400 mb-2">
          Réactions Modèles de la Thermodynamique Chimique :
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {THERMODYNAMIC_REACTIONS.map((reac) => {
            const isSelected = selectedReactionId === reac.id;
            return (
              <button
                key={reac.id}
                type="button"
                onClick={() => handleSelectReaction(reac)}
                className={`p-3 rounded-xl border text-left transition-all relative ${
                  isSelected
                    ? 'bg-violet-950/60 border-violet-500 text-white shadow-lg shadow-violet-900/20'
                    : 'bg-slate-950/50 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="text-[10px] uppercase font-bold text-violet-400">{reac.category}</div>
                <div className="text-xs font-bold truncate mt-0.5">{reac.name}</div>
                <div className="text-[11px] font-mono text-slate-400 truncate mt-1">{reac.equation}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Paramètres & Sliders Interactifs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 space-y-5">
          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 backdrop-blur-xl space-y-5">
            <h3 className="text-sm font-semibold text-slate-200 border-b border-slate-800 pb-2">
              Paramètres d'État Thermodynamiques
            </h3>

            {/* Température T */}
            <div className="space-y-1.5 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-medium">Température Absolue (T) :</span>
                <span className="font-mono text-cyan-400 font-bold text-sm">
                  {temperatureK.toFixed(1)} K{' '}
                  <span className="text-slate-500 text-xs">({(temperatureK - 273.15).toFixed(1)} °C)</span>
                </span>
              </div>
              <input
                type="range"
                min="100"
                max="1200"
                step="5"
                value={temperatureK}
                onChange={(e) => setTemperatureK(parseFloat(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>100 K (-173 °C)</span>
                <span>298.15 K (Ambiante)</span>
                <span>1200 K (927 °C)</span>
              </div>
            </div>

            {/* Enthalpie ΔH° */}
            <div className="space-y-1.5 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-medium">
                  Enthalpie Standard (ΔH°) :
                </span>
                <span
                  className={`font-mono font-bold text-sm ${
                    deltaH < 0 ? 'text-rose-400' : 'text-emerald-400'
                  }`}
                >
                  {deltaH > 0 ? `+${deltaH}` : deltaH} kJ/mol{' '}
                  <span className="text-xs font-normal text-slate-400">
                    ({deltaH < 0 ? 'Exothermique' : 'Endothermique'})
                  </span>
                </span>
              </div>
              <input
                type="range"
                min="-600"
                max="600"
                step="1"
                value={deltaH}
                onChange={(e) => setDeltaH(parseFloat(e.target.value))}
                className="w-full accent-rose-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
            </div>

            {/* Entropie ΔS° */}
            <div className="space-y-1.5 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-medium">
                  Entropie Standard (ΔS°) :
                </span>
                <span
                  className={`font-mono font-bold text-sm ${
                    deltaS > 0 ? 'text-indigo-300' : 'text-amber-400'
                  }`}
                >
                  {deltaS > 0 ? `+${deltaS}` : deltaS} J/(mol·K){' '}
                  <span className="text-xs font-normal text-slate-400">
                    ({deltaS > 0 ? 'Désordre favorisé' : 'Ordre imposé'})
                  </span>
                </span>
              </div>
              <input
                type="range"
                min="-300"
                max="300"
                step="1"
                value={deltaS}
                onChange={(e) => setDeltaS(parseFloat(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Colonne Diagnostic & Résultats Gibbs */}
        <div className="lg:col-span-6 space-y-5">
          {/* Carte Majeure Énergie Libre de Gibbs */}
          <div
            className={`p-6 rounded-2xl border shadow-2xl backdrop-blur-xl relative overflow-hidden transition-all ${
              thermoAnalysis.isSpontaneous
                ? 'bg-gradient-to-br from-emerald-950/60 to-slate-900 border-emerald-500/40'
                : 'bg-gradient-to-br from-rose-950/60 to-slate-900 border-rose-500/40'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-bold tracking-wider text-slate-300">
                Énergie Libre de Gibbs ΔG°(T)
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                  thermoAnalysis.isSpontaneous
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                }`}
              >
                {thermoAnalysis.isSpontaneous ? 'Spontanée (Exergonique)' : 'Non Spontanée (Endergonique)'}
              </span>
            </div>

            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-white font-mono tracking-tight">
                {thermoAnalysis.deltaG_kJ > 0
                  ? `+${thermoAnalysis.deltaG_kJ}`
                  : thermoAnalysis.deltaG_kJ}
              </span>
              <span className="text-xl font-bold text-slate-400 font-mono">kJ/mol</span>
            </div>

            <p className="mt-3 text-xs text-slate-300 leading-relaxed">
              {thermoAnalysis.quadrantDescription}
            </p>

            {/* Constante d'équilibre et T_inv */}
            <div className="mt-5 pt-4 border-t border-slate-800 grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="text-slate-400 text-[10px] font-sans">Constante d'équilibre K_eq</div>
                <div className="text-indigo-300 font-bold mt-0.5">
                  {thermoAnalysis.kEqFormatted}
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="text-slate-400 text-[10px] font-sans">Température d'inversion T_inv</div>
                <div className="text-cyan-300 font-bold mt-0.5">
                  {thermoAnalysis.tInversion
                    ? `${thermoAnalysis.tInversion} K (${(thermoAnalysis.tInversion - 273.15).toFixed(0)} °C)`
                    : 'Aucune inversion'}
                </div>
              </div>
            </div>
          </div>

          {/* Mini-Tracé Dynamique ΔG vs T */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs space-y-3">
            <div className="flex justify-between items-center text-slate-300">
              <span className="font-semibold">Courbe d'Évolution ΔG° en fonction de T</span>
              <span className="text-[10px] font-mono text-slate-500">Pente = -ΔS°</span>
            </div>

            <div className="relative h-28 w-full bg-slate-950 rounded-xl border border-slate-800 p-2 flex items-center justify-center overflow-hidden">
              {/* Ligne du zéro ΔG = 0 */}
              <div className="absolute left-0 right-0 top-1/2 border-t border-dashed border-slate-700 pointer-events-none" />
              <span className="absolute left-2 top-1/2 -translate-y-4 text-[9px] font-mono text-slate-500">
                ΔG = 0
              </span>

              {/* Tracé SVG de la droite */}
              <svg viewBox="0 0 400 100" className="w-full h-full">
                {(() => {
                  // normaliser les points
                  const minG = -300;
                  const maxG = 300;
                  const pts = graphPoints.map((p) => {
                    const x = ((p.t - 100) / (1200 - 100)) * 400;
                    const y = 100 - ((p.g - minG) / (maxG - minG)) * 100;
                    return `${x},${Math.max(0, Math.min(100, y))}`;
                  });

                  // Position de la température actuelle
                  const currentX = ((temperatureK - 100) / (1200 - 100)) * 400;
                  const currentY =
                    100 - ((thermoAnalysis.deltaG_kJ - minG) / (maxG - minG)) * 100;

                  return (
                    <>
                      <polyline
                        fill="none"
                        stroke="#8b5cf6"
                        strokeWidth="2.5"
                        points={pts.join(' ')}
                      />
                      <circle
                        cx={currentX}
                        cy={Math.max(0, Math.min(100, currentY))}
                        r="5"
                        fill="#38bdf8"
                        stroke="#ffffff"
                        strokeWidth="1.5"
                      />
                    </>
                  );
                })()}
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Modal d'Exportation de Compte-Rendu de TP */}
      <TPReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        title="Compte-Rendu de Travaux Pratiques : Thermodynamique & Gibbs"
        moduleName="Thermodynamique Chimique & Équilibres"
        academicLevel="Licence 3 · Master 1"
        reportContent={generatedReport}
      />
    </div>
  );
}
