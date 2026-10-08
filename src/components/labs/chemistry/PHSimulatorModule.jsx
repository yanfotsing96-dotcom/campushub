import { useState, useMemo } from 'react';
import {
  Activity,
  Droplets,
  FileText,
  Sliders,
} from 'lucide-react';
import { ACID_BASE_SYSTEMS } from './chemistryData';
import TPReportModal from './TPReportModal';

export default function PHSimulatorModule() {
  const [solutionType, setSolutionType] = useState('buffer'); // 'strong_acid' | 'weak_acid' | 'strong_base' | 'buffer'
  const [concentration, setConcentration] = useState(0.05); // mol/L
  const [selectedSystem, setSelectedSystem] = useState(ACID_BASE_SYSTEMS[1]); // Acetic acid / acetate
  const [ratioBaseToAcid, setRatioBaseToAcid] = useState(1.0); // [A-] / [HA] pour tampon
  const [pKaValue, setPKaValue] = useState(4.76);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Mode Couple Personnalisé / Valeur Custom
  const [isCustomCouple, setIsCustomCouple] = useState(false);
  const [customAcidName, setCustomAcidName] = useState('Acide benzoïque (C6H5COOH)');
  const [customBaseName, setCustomBaseName] = useState('Ion benzoate (C6H5COO⁻)');

  // Synchronise pKa quand le système change
  const handleSystemChange = (sys) => {
    setSelectedSystem(sys);
    setPKaValue(sys.pKa);
    setIsCustomCouple(false);
    if (sys.type === 'strong_acid') setSolutionType('strong_acid');
    else if (sys.type === 'strong_base') setSolutionType('strong_base');
    else if (sys.type === 'buffer') setSolutionType('buffer');
    else setSolutionType('weak_acid');
  };

  // Calcul rigoureux du pH selon la classe de solution à 25 °C
  const phAnalysis = useMemo(() => {
    let ph = 7.0;
    const c = Math.max(1e-7, concentration);

    if (solutionType === 'strong_acid') {
      // Acide fort : pH = -log10(C)
      ph = -Math.log10(c);
    } else if (solutionType === 'strong_base') {
      // Base forte : pH = 14 + log10(C)
      ph = 14 + Math.log10(c);
    } else if (solutionType === 'weak_acid') {
      // Acide faible : formule approchée pH = 1/2 (pKa - log10(C))
      ph = 0.5 * (pKaValue - Math.log10(c));
    } else if (solutionType === 'buffer') {
      // Équation de Henderson-Hasselbalch : pH = pKa + log10([A-] / [HA])
      const ratio = Math.max(0.001, ratioBaseToAcid);
      ph = pKaValue + Math.log10(ratio);
    }

    // Contrainte thermodynamique de l'eau pure : 0 <= pH <= 14
    ph = Math.max(0.0, Math.min(14.0, ph));

    // Concentrations en ions oxonium [H3O+] et hydroxyde [OH-]
    const h3o = Math.pow(10, -ph);
    const oh = Math.pow(10, -(14.0 - ph));

    // Nature de la solution
    let nature = 'Neutre';
    let natureColor = 'text-emerald-400';
    if (ph < 6.8) {
      nature = ph < 3.0 ? 'Fortement Acide' : 'Modérément Acide';
      natureColor = ph < 3.0 ? 'text-rose-400' : 'text-amber-400';
    } else if (ph > 7.2) {
      nature = ph > 11.0 ? 'Fortement Basique' : 'Modérément Basique';
      natureColor = ph > 11.0 ? 'text-violet-400' : 'text-indigo-400';
    }

    return {
      ph: Number(ph.toFixed(2)),
      h3oFormatted: h3o.toExponential(2),
      ohFormatted: oh.toExponential(2),
      nature,
      natureColor,
    };
  }, [solutionType, concentration, pKaValue, ratioBaseToAcid]);

  const activeSystemName = isCustomCouple
    ? `${customAcidName} / ${customBaseName}`
    : selectedSystem.name;

  const appliedFormula = useMemo(() => {
    if (solutionType === 'strong_acid') return 'pH = -log₁₀(C)';
    if (solutionType === 'strong_base') return 'pH = 14 + log₁₀(C)';
    if (solutionType === 'weak_acid') return 'pH = ½ · (pKa - log₁₀(C))';
    return 'pH = pKa + log₁₀([A⁻] / [HA])  (Henderson-Hasselbalch)';
  }, [solutionType]);

  const generatedReport = useMemo(() => {
    const typeLabel =
      solutionType === 'buffer'
        ? 'Solution Tampon (Tampon d\'Henderson)'
        : solutionType === 'weak_acid'
        ? 'Solution d\'Acide Faible'
        : solutionType === 'strong_acid'
        ? 'Solution d\'Acide Fort'
        : 'Solution de Base Forte';

    const predominDiag =
      phAnalysis.ph < pKaValue
        ? 'Forme acide protonée [HA] prédominante (pH < pKa)'
        : phAnalysis.ph > pKaValue
        ? 'Forme basique déprotonée [A⁻] prédominante (pH > pKa)'
        : 'Équimolarité exacte : [HA] = [A⁻] (pH = pKa)';

    return `# COMPTE-RENDU DE TP : ÉQUILIBRES ACIDO-BASIQUES & pH
**Plateforme Académique CampusHub · Pôle Chimie (L1-L2)**
**Unité d'Enseignement :** CHM101 / CHM201 · Équilibres en Solution Aqueuse
**Date du rapport :** ${new Date().toLocaleDateString('fr-FR')}

---

## 1. Caractéristiques de la Solution Étudiée
- Type de solution : **${typeLabel}**
- Système Acide/Base : **${activeSystemName}** ${isCustomCouple ? '(Couple Personnalisé / Valeur Custom)' : ''}
- Constante d'acidité ($pK_a$) : **${pKaValue}**
- Concentration analytique ($C$) : **${concentration} mol/L**
${solutionType === 'buffer' ? `- Rapport molaire $[A^-]/[HA]$ : **${ratioBaseToAcid}**\n- Forme acide : **${isCustomCouple ? customAcidName : selectedSystem.formulaAcid}**\n- Forme basique : **${isCustomCouple ? customBaseName : selectedSystem.formulaBase}**` : ''}

## 2. Résultats Théoriques & Expérimentaux
- **pH théorique calculé :** **${phAnalysis.ph}** (${phAnalysis.nature})
- Formule fondamentale appliquée : **${appliedFormula}**
- Concentration en ions oxonium $[H_3O^+]$ : **${phAnalysis.h3oFormatted} mol/L**
- Concentration en ions hydroxyde $[OH^-]$ : **${phAnalysis.ohFormatted} mol/L**
- Constante d'autoprotolyse vérifiée : $K_e = [H_3O^+][OH^-] = 1.0 \\times 10^{-14}$ (à 25 °C)

## 3. Diagramme de Prédominance des Espèces
- Diagnostic d'état : **${predominDiag}**
- Zone tampon optimale : $pH \\in [pK_a - 1 ; pK_a + 1]$, soit ici $[${(pKaValue - 1).toFixed(2)} ; ${(pKaValue + 1).toFixed(2)}]$.

## 4. Recommandations de Laboratoire
- Toujours étalonner l'électrode combinée de pH-mètre à l'aide de deux solutions tampons certifiées (pH 4.00 et pH 7.00 ou 10.00).
- Rincer soigneusement l'électrode à l'eau distillée et sécher délicatement par tamponnement sans frotter la membrane de verre.
`;
  }, [
    solutionType,
    activeSystemName,
    isCustomCouple,
    pKaValue,
    concentration,
    ratioBaseToAcid,
    customAcidName,
    customBaseName,
    selectedSystem,
    phAnalysis,
    appliedFormula,
  ]);

  // Détermination de la couleur chromatique du liquide selon l'indicateur universel
  const getPHColor = (ph) => {
    if (ph <= 2) return '#ef4444'; // rouge vif
    if (ph <= 4) return '#f97316'; // orange
    if (ph <= 6) return '#eab308'; // jaune
    if (ph <= 7.5) return '#10b981'; // vert neutre
    if (ph <= 9) return '#06b6d4'; // cyan
    if (ph <= 11) return '#3b82f6'; // bleu
    return '#8b5cf6'; // violet profond
  };

  const currentColor = getPHColor(phAnalysis.ph);

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
            <Droplets size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono">
                L1 · L2 FONDAMENTAL
              </span>
              <span className="text-xs text-slate-400">Équilibres en Solution Aqueuse (Ke = 10⁻¹⁴)</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Simulateur de pH & Solutions Acide-Base
            </h2>
          </div>
        </div>

        {/* Sélection du Type de Système & Bouton Export TP */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center p-1 rounded-xl bg-slate-950 border border-slate-800">
            <button
              type="button"
              onClick={() => setSolutionType('buffer')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                solutionType === 'buffer'
                  ? 'bg-violet-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Tampon (Henderson)
            </button>
            <button
              type="button"
              onClick={() => setSolutionType('weak_acid')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                solutionType === 'weak_acid'
                  ? 'bg-violet-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Acide Faible
            </button>
            <button
              type="button"
              onClick={() => setSolutionType('strong_acid')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                solutionType === 'strong_acid'
                  ? 'bg-violet-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Acide Fort
            </button>
            <button
              type="button"
              onClick={() => setSolutionType('strong_base')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                solutionType === 'strong_base'
                  ? 'bg-violet-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Base Forte
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsReportModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 border border-violet-500/40 text-xs font-bold flex items-center gap-2 transition-all shadow-lg shadow-violet-950/30 hover:shadow-violet-900/40"
            title="Générer le rapport complet au format Markdown"
          >
            <FileText size={15} className="text-violet-400" />
            <span>Compte-Rendu TP (.md)</span>
          </button>
        </div>
      </div>

      {/* Échelle Chromatique Interactive de pH (0 à 14) */}
      <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 backdrop-blur-xl space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Échelle de pH & Spectre de l'Indicateur Universel
          </span>
          <span className="text-xs font-mono text-slate-400">T = 298.15 K (25 °C)</span>
        </div>

        {/* Barre de Gradient pH */}
        <div className="relative pt-6 pb-2">
          {/* Curseur Dynamique de pH */}
          <div
            className="absolute top-0 transform -translate-x-1/2 flex flex-col items-center transition-all duration-200"
            style={{ left: `${(phAnalysis.ph / 14) * 100}%` }}
          >
            <span
              className="px-2 py-0.5 rounded-md text-xs font-mono font-extrabold text-white shadow-lg"
              style={{ backgroundColor: currentColor }}
            >
              pH {phAnalysis.ph}
            </span>
            <div
              className="w-0 h-0 border-x-4 border-x-transparent border-t-6"
              style={{ borderTopColor: currentColor }}
            />
          </div>

          {/* Dégradé Continu pH 0 à 14 */}
          <div className="h-4 rounded-full w-full bg-gradient-to-r from-red-500 via-orange-400 via-yellow-400 via-emerald-500 via-cyan-400 via-blue-500 to-purple-600 shadow-inner" />

          {/* Repères Numériques 0 à 14 */}
          <div className="flex justify-between text-[11px] font-mono text-slate-400 mt-2">
            <span>0 (Acide)</span>
            <span>3</span>
            <span>5</span>
            <span className="text-emerald-400 font-bold">7 (Neutre)</span>
            <span>9</span>
            <span>11</span>
            <span>14 (Basique)</span>
          </div>
        </div>
      </div>

      {/* Colonnes Paramètres & Bécher Virtuel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Contrôles & Presets */}
        <div className="lg:col-span-7 space-y-5">
          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 backdrop-blur-xl space-y-5">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-2">
              <Activity size={16} className="text-violet-400" />
              <span>Paramètres de la Solution</span>
            </h3>

            {/* Presets rapides */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2">
                Systèmes Acide-Base Prédéfinis
              </label>
              <div className="grid grid-cols-2 gap-2">
                {ACID_BASE_SYSTEMS.slice(0, 4).map((sys) => (
                  <button
                    key={sys.id}
                    type="button"
                    onClick={() => handleSystemChange(sys)}
                    className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                      !isCustomCouple && selectedSystem.id === sys.id
                        ? 'bg-violet-950/60 border-violet-500 text-white'
                        : 'bg-slate-950/50 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-bold">{sys.name}</div>
                    <div className="text-[10px] text-violet-300 font-mono mt-0.5">pKa = {sys.pKa}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Mode Valeur Custom / Couple Sur-Mesure */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-200">
                  <input
                    type="checkbox"
                    checked={isCustomCouple}
                    onChange={(e) => setIsCustomCouple(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-700 text-violet-600 focus:ring-violet-500 bg-slate-900 cursor-pointer"
                  />
                  <span>Mode Couple Sur-Mesure / Constantes Custom (TD & TP)</span>
                </label>
                {isCustomCouple && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-violet-500/20 text-violet-300 border border-violet-500/30">
                    Custom Actif
                  </span>
                )}
              </div>

              {isCustomCouple && (
                <div className="pt-2 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 animate-in fade-in duration-150">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Forme Acide (HA)</label>
                    <input
                      type="text"
                      value={customAcidName}
                      onChange={(e) => setCustomAcidName(e.target.value)}
                      placeholder="Ex: C6H5COOH"
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:border-violet-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Forme Basique (A⁻)</label>
                    <input
                      type="text"
                      value={customBaseName}
                      onChange={(e) => setCustomBaseName(e.target.value)}
                      placeholder="Ex: C6H5COO⁻"
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:border-violet-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Constante pKa libre</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="14"
                      value={pKaValue}
                      onChange={(e) => setPKaValue(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-violet-500 text-xs font-mono text-white text-right focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Pour les Tampons : Ratio Base / Acide */}
            {solutionType === 'buffer' && (
              <div className="space-y-2 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-300 font-medium">
                    Rapport de Concentration [A⁻] / [HA] :
                  </span>
                  <span className="font-mono text-cyan-400 font-bold text-sm">
                    {ratioBaseToAcid.toFixed(2)}
                  </span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="10.0"
                  step="0.05"
                  value={ratioBaseToAcid}
                  onChange={(e) => setRatioBaseToAcid(parseFloat(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500">
                  <span>0.1 (Excès d'acide HA)</span>
                  <span>1.0 (Demi-équivalence : pH = pKa)</span>
                  <span>10.0 (Excès de base A⁻)</span>
                </div>
              </div>
            )}

            {/* Slider de Concentration Initiale C */}
            <div className="space-y-2 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-medium">Concentration Analytique (C) :</span>
                <span className="font-mono text-violet-400 font-bold text-sm">
                  {concentration.toFixed(3)} mol/L
                </span>
              </div>
              <input
                type="range"
                min="0.001"
                max="1.0"
                step="0.005"
                value={concentration}
                onChange={(e) => setConcentration(parseFloat(e.target.value))}
                className="w-full accent-violet-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
            </div>

            {/* Diagramme de Prédominance */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-2">
              <div className="flex justify-between font-medium text-slate-300">
                <span>Diagramme de Prédominance des Espèces :</span>
                <span className="font-mono text-violet-300">pKa = {pKaValue}</span>
              </div>
              <div className="relative h-6 bg-slate-900 rounded-lg border border-slate-800 flex items-center px-3 font-mono text-[11px]">
                <div className="w-1/2 text-left text-rose-300">Forme Acide [HA] prédomine</div>
                <div className="w-1/2 text-right text-cyan-300">Forme Basique [A⁻] prédomine</div>
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-white shadow-md"
                  style={{ left: '50%' }}
                />
              </div>
              <div className="text-[11px] text-slate-400">
                État actuel :{' '}
                <strong className="text-white">
                  {phAnalysis.ph < pKaValue
                    ? 'La forme acide protonée [HA] est majoritaire.'
                    : phAnalysis.ph > pKaValue
                    ? 'La forme basique déprotonée [A⁻] est majoritaire.'
                    : 'Égalité exacte : [HA] = [A⁻] (pH = pKa).'}
                </strong>
              </div>
            </div>
          </div>
        </div>

        {/* Bécher Virtuel & Mesures Ioniques */}
        <div className="lg:col-span-5 space-y-5">
          {/* Carte Principale du pH */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-xl flex flex-col items-center text-center">
            <span className="text-xs uppercase font-bold tracking-wider text-slate-400">
              pH Mesuré à l'Électrode Combinée
            </span>
            <div
              className="text-5xl font-black font-mono tracking-tight my-2 drop-shadow-md"
              style={{ color: currentColor }}
            >
              {phAnalysis.ph}
            </div>
            <div className={`text-xs font-bold uppercase tracking-wider ${phAnalysis.natureColor}`}>
              {phAnalysis.nature}
            </div>

            {/* Bécher SVG Stylisé */}
            <div className="relative w-40 h-48 my-4">
              <svg viewBox="0 0 100 120" className="w-full h-full">
                <defs>
                  <linearGradient id="beakerGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={currentColor} stopOpacity="0.4" />
                    <stop offset="100%" stopColor={currentColor} stopOpacity="0.85" />
                  </linearGradient>
                </defs>

                {/* Contour du bécher en verre */}
                <path
                  d="M 15 15 L 20 110 C 20 115 25 118 35 118 L 65 118 C 75 118 80 115 80 110 L 85 15"
                  fill="none"
                  stroke="#64748b"
                  strokeWidth="2.5"
                />
                {/* Bec verseur */}
                <path d="M 15 15 L 10 12" stroke="#64748b" strokeWidth="2.5" />

                {/* Liquide */}
                <path
                  d="M 22 45 C 35 43 65 47 78 45 L 80 110 C 80 115 75 117 65 117 L 35 117 C 25 117 20 115 20 110 Z"
                  fill="url(#beakerGrad)"
                />

                {/* Graduations */}
                <line x1="22" y1="60" x2="30" y2="60" stroke="#ffffff" strokeWidth="1" opacity="0.6" />
                <line x1="22" y1="80" x2="32" y2="80" stroke="#ffffff" strokeWidth="1.2" opacity="0.7" />
                <line x1="22" y1="100" x2="30" y2="100" stroke="#ffffff" strokeWidth="1" opacity="0.6" />

                {/* Sonde pH-mètre immergée */}
                <rect x="46" y="5" width="8" height="75" rx="2" fill="#334155" stroke="#94a3b8" strokeWidth="1" />
                <circle cx="50" cy="80" r="4" fill="#38bdf8" opacity="0.9" />
              </svg>
            </div>

            {/* Concentrations ioniques en notation scientifique */}
            <div className="w-full grid grid-cols-2 gap-3 pt-3 border-t border-slate-800 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="text-slate-400 text-[10px] font-sans">[H₃O⁺] Oxonium</div>
                <div className="text-rose-400 font-bold mt-0.5">{phAnalysis.h3oFormatted} M</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="text-slate-400 text-[10px] font-sans">[OH⁻] Hydroxyde</div>
                <div className="text-cyan-400 font-bold mt-0.5">{phAnalysis.ohFormatted} M</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal d'Exportation de Compte-Rendu de TP */}
      <TPReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        title="Compte-Rendu de Travaux Pratiques : pH & Équilibres Acido-Basiques"
        moduleName="Simulateur de pH & Solutions Tampons"
        academicLevel="Licence 1 · Licence 2"
        reportContent={generatedReport}
      />
    </div>
  );
}
