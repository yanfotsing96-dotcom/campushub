import { useState, useMemo } from 'react';
import {
  FlaskConical,
  Scale,
  Pipette,
  Layers,
  Sparkles,
  Info,
  ArrowRight,
  BookOpen,
  FileText,
} from 'lucide-react';
import { COMMON_SOLUTES, parseChemicalFormula } from './chemistryData';
import TPReportModal from './TPReportModal';

export default function MolarityModule() {
  const [subTab, setSubTab] = useState('preparation'); // 'preparation' | 'dilution' | 'formula'
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // --- 1. Mode Préparation de Solution : m = C * V * M ---
  const [selectedSolute, setSelectedSolute] = useState(COMMON_SOLUTES[0]);
  const [targetConcentration, setTargetConcentration] = useState(0.25); // mol/L
  const [targetVolumeMl, setTargetVolumeMl] = useState(250); // mL
  const [customMolarMass, setCustomMolarMass] = useState(58.44); // g/mol
  const [customSoluteName, setCustomSoluteName] = useState('Soluté Spécifique TD');
  const [customSoluteFormula, setCustomSoluteFormula] = useState('C-Custom');
  const [useCustomMass, setUseCustomMass] = useState(false);

  const effectiveMolarMass = useCustomMass ? customMolarMass : selectedSolute.molarMass;
  const effectiveFormula = useCustomMass ? customSoluteFormula : selectedSolute.formula;
  const effectiveName = useCustomMass ? customSoluteName : selectedSolute.name;

  // Calculs stœchiométriques de préparation
  const targetVolumeL = targetVolumeMl / 1000;
  const molesRequired = targetConcentration * targetVolumeL;
  const massRequiredG = molesRequired * effectiveMolarMass;
  const massConcentrationGL = targetConcentration * effectiveMolarMass;

  // --- 2. Mode Dilution : C1 * V1 = C2 * V2 ---
  const [c1, setC1] = useState(1.0); // mol/L (Mère)
  const [v2, setV2] = useState(100); // mL (Fille voulue)
  const [c2, setC2] = useState(0.1); // mol/L (Fille voulue)

  const dilutionCalculations = useMemo(() => {
    if (c1 <= 0 || c2 <= 0 || v2 <= 0) {
      return { v1: 0, vWater: 0, factor: 0, isValid: false, error: 'Valeurs strictement positives requises.' };
    }
    if (c2 >= c1) {
      return {
        v1: 0,
        vWater: 0,
        factor: (c1 / c2).toFixed(2),
        isValid: false,
        error: 'La solution fille (C2) doit être moins concentrée que la solution mère (C1) pour une dilution.',
      };
    }
    const v1Calculated = (c2 * v2) / c1; // mL
    const vWater = Math.max(0, v2 - v1Calculated); // mL
    const factor = c1 / c2;

    return {
      v1: Number(v1Calculated.toFixed(2)),
      vWater: Number(vWater.toFixed(2)),
      factor: Number(factor.toFixed(2)),
      isValid: true,
      error: null,
    };
  }, [c1, c2, v2]);

  // --- 3. Mode Analyseur de Formule Moléculaire ---
  const [formulaInput, setFormulaInput] = useState('CuSO4·5H2O');
  const parsedFormulaResult = useMemo(() => {
    return parseChemicalFormula(formulaInput);
  }, [formulaInput]);

  // Génération dynamique du compte-rendu en Markdown structuré propre (compatible marked + KaTeX)
  const generatedReport = useMemo(() => {
    const fmtFr = (val, dec = 2) => Number(val).toFixed(dec).replace('.', ',');
    const fmtLatex = (val, dec = 2) => Number(val).toFixed(dec).replace('.', '{,}');

    if (subTab === 'dilution') {
      return `# Compte-Rendu de TP : Dilution d'une solution mère

## 1. Principe et Relation Fondamentale
Lors d'une dilution, la quantité de matière de soluté $n = C \\times V$ se conserve intégralement entre la solution mère et la solution fille :

$$n_1 = n_2 \\iff C_1 \\times V_1 = C_2 \\times V_2$$

## 2. Données Expérimentales

| Paramètre | Symbole | Valeur | Unité |
| :--- | :---: | :---: | :--- |
| Concentration de la solution mère | $C_1$ | **${fmtFr(c1, 3)}** | $\\text{mol/L}$ |
| Concentration ciblée de la solution fille | $C_2$ | **${fmtFr(c2, 3)}** | $\\text{mol/L}$ |
| Volume souhaité de solution fille | $V_2$ | **${v2}** | $\\text{mL}$ ($${fmtLatex(v2 / 1000, 3)}\\ \\text{L}$) |

- Concentration mère ($C_1$) : **${fmtFr(c1, 3)} mol/L**
- Concentration fille ($C_2$) : **${fmtFr(c2, 3)} mol/L**
- Volume jaugé final ($V_2$) : **${v2} mL** (**${fmtFr(v2 / 1000, 3)} L**)

## 3. Calculs et Résultats Finaux

$$V_1 = \\frac{C_2 \\times V_2}{C_1} = \\frac{${fmtLatex(c2, 3)} \\times ${v2}}{${fmtLatex(c1, 3)}} = ${fmtLatex(dilutionCalculations.v1, 2)}\\ \\text{mL}$$

> **Synthèse des résultats finaux :**
> - **Volume de solution mère à prélever ($V_1$) :** **${fmtFr(dilutionCalculations.v1, 2)} mL**
> - **Facteur de dilution ($F = C_1 / C_2$) :** **${fmtFr(dilutionCalculations.factor, 2)}**
> - **Volume d'eau distillée à compléter :** **${fmtFr(dilutionCalculations.vWater, 2)} mL**

## 4. Protocole de Laboratoire Normalisé
- Prélever exactement **${fmtFr(dilutionCalculations.v1, 2)} mL** de solution mère à l'aide d'une pipette jaugée munie d'une propipette.
- Introduire le prélèvement dans une fiole jaugée propre de **${v2} mL**.
- Remplir à l'eau distillée aux deux tiers et homogénéiser par rotation douce.
- Ajuster au trait de jauge (ménisque tangent), boucher et retourner plusieurs fois.
`;
    }

    if (subTab === 'formula') {
      const compRows = parsedFormulaResult?.composition
        ? parsedFormulaResult.composition
            .map(
              (c) =>
                `| **${c.element}** | $${c.count}$ | **${fmtFr(c.mass, 3)} g/mol** | **${fmtFr(c.percent, 2)} %** |`
            )
            .join('\n')
        : '| — | — | — | — |';

      const compList = parsedFormulaResult?.composition
        ? parsedFormulaResult.composition
            .map(
              (c) =>
                `- Élément **${c.element}** ($${c.count}$ atome(s)) : contribution **${fmtFr(c.mass, 3)} g/mol**, fraction massique **${fmtFr(c.percent, 2)} %**`
            )
            .join('\n')
        : '- Formule non analysée';

      return `# Compte-Rendu de TP : Analyse Centésimale et Masse Molaire

## 1. Formule Brute Étudiée
- Formule chimique analysée : **${parsedFormulaResult?.formula || formulaInput}**
- Masse molaire moléculaire ($M$) : **${parsedFormulaResult?.molarMass ? fmtFr(parsedFormulaResult.molarMass, 2) : '—'} g/mol**

## 2. Composition Élémentaire et Fractions Massiques

| Élément | Nombre d'atomes | Masse contribuée | Fraction massique |
| :--- | :---: | :---: | :---: |
${compRows}

${compList}

## 3. Résultat Final

$$M(\\text{${parsedFormulaResult?.formula || formulaInput}}) = \\sum_i n_i \\times M_i = ${parsedFormulaResult?.molarMass ? fmtLatex(parsedFormulaResult.molarMass, 2) : '0'}\\ \\text{g/mol}$$

> **Résultat clé :**
> - **Masse molaire totale ($M$) :** **${parsedFormulaResult?.molarMass ? fmtFr(parsedFormulaResult.molarMass, 2) : '—'} g/mol**
`;
    }

    // Par défaut : Sous-onglet Préparation d'une solution étalon
    return `# Préparation d'une solution étalon ${effectiveFormula}

## 1. Objectif du Travail Pratique
Préparation par dissolution quantitative d'une solution aqueuse étalon de **${effectiveName}** (**${effectiveFormula}**) à concentration molaire précise dans une fiole jaugée de laboratoire.

## 2. Données Expérimentales et Spécifications

| Paramètre | Symbole | Valeur | Unité |
| :--- | :---: | :---: | :--- |
| Soluté étudié | — | **${effectiveFormula}** (${effectiveName}) | ${useCustomMass ? 'Valeur personnalisée' : 'Étalon analytique'} |
| Masse molaire | $M$ | **${fmtFr(effectiveMolarMass, 2)}** | $\\text{g/mol}$ |
| Concentration molaire cible | $C$ | **${fmtFr(targetConcentration, 3)}** | $\\text{mol/L}$ |
| Volume de la fiole jaugée | $V$ | **${targetVolumeMl}** | $\\text{mL}$ ($${fmtLatex(targetVolumeL, 3)}\\ \\text{L}$) |

- Soluté utilisé : **${effectiveFormula}** (${effectiveName})
- Masse molaire ($M$) : **${fmtFr(effectiveMolarMass, 2)} g/mol** ${useCustomMass ? '(Valeur personnalisée)' : '(Table étalon IUPAC)'}
- Concentration molaire cible ($C$) : **${fmtFr(targetConcentration, 3)} mol/L** (**${fmtFr(targetConcentration * 1000, 1)} mmol/L**)
- Volume jaugé prescrit ($V$) : **${targetVolumeMl} mL** (**${fmtFr(targetVolumeL, 3)} L**)

## 3. Formules Théoriques et Calculs
- **Quantité de matière requise** (relation fondamentale $n = C \\times V$) :

$$n = C \\times V = ${fmtLatex(targetConcentration, 3)}\\ \\text{mol/L} \\times ${fmtLatex(targetVolumeL, 3)}\\ \\text{L} = ${fmtLatex(molesRequired, 4)}\\ \\text{mol}$$

- **Masse théorique de soluté à peser** ($m = n \\times M = C \\times V \\times M$) :

$$m = C \\times V \\times M = ${fmtLatex(massRequiredG, 4)}\\ \\text{g}$$

- **Concentration massique résultante** ($C_m = C \\times M$) :

$$C_m = C \\times M = ${fmtLatex(targetConcentration, 3)} \\times ${fmtLatex(effectiveMolarMass, 2)} = ${fmtLatex(massConcentrationGL, 2)}\\ \\text{g/L}$$

## 4. Résultats Finaux

> **Synthèse des résultats clés :**
> - **Masse exacte de ${effectiveFormula} à peser ($m$) :** **${fmtFr(massRequiredG, 4)} g**
> - **Quantité de matière dissoute ($n$) :** **${fmtFr(molesRequired, 4)} mol** (**${fmtFr(molesRequired * 1000, 2)} mmol**)
> - **Concentration massique ($C_m$) :** **${fmtFr(massConcentrationGL, 2)} g/L**

## 5. Protocole Opératoire Normalisé
- Tarer une coupelle de pesée sèche sur une balance analytique de précision ($0{,}1\\ \\text{mg}$) et peser exactement **${fmtFr(massRequiredG, 4)} g** de **${effectiveFormula}** pur.
- Introduire le solide dans une fiole jaugée de **${targetVolumeMl} mL** à l'aide d'un entonnoir à solide, puis rincer soigneusement la coupelle et l'entonnoir à l'eau distillée.
- Remplir la fiole aux deux tiers avec de l'eau distillée (~**${(targetVolumeMl * 0.6).toFixed(0)} mL**) et agiter par rotation jusqu'à dissolution complète.
- Ajuster le niveau au trait de jauge à la goutte près (bas du ménisque tangent au trait), boucher et homogénéiser par retournements successifs.
`;
  }, [
    subTab,
    c1,
    c2,
    v2,
    dilutionCalculations,
    formulaInput,
    parsedFormulaResult,
    effectiveFormula,
    effectiveName,
    effectiveMolarMass,
    useCustomMass,
    targetConcentration,
    targetVolumeMl,
    targetVolumeL,
    molesRequired,
    massRequiredG,
    massConcentrationGL,
  ]);

  return (
    <div className="space-y-6 text-left">
      {/* Header du module avec sous-onglets stylés */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
            <FlaskConical size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono">
                L1 · L2 FONDAMENTAL
              </span>
              <span className="text-xs text-slate-400">Unité UE CHM101 / CHM201</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">Solutions, Molarité & Dilutions</h2>
          </div>
        </div>

        {/* Boutons de sous-navigation & Export de TP */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center p-1 rounded-xl bg-slate-950/80 border border-slate-800">
            <button
              type="button"
              onClick={() => setSubTab('preparation')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                subTab === 'preparation'
                  ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Scale size={14} />
              <span>Pesée & Préparation</span>
            </button>
            <button
              type="button"
              onClick={() => setSubTab('dilution')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                subTab === 'dilution'
                  ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Pipette size={14} />
              <span>Loi de Dilution</span>
            </button>
            <button
              type="button"
              onClick={() => setSubTab('formula')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                subTab === 'formula'
                  ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Layers size={14} />
              <span>Masse Molaire Brute</span>
            </button>
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

      {/* SOUS-VUE 1 : PESÉE & PRÉPARATION DE SOLUTION */}
      {subTab === 'preparation' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Colonne Paramètres & Contrôles */}
          <div className="lg:col-span-7 space-y-5">
            <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-xl shadow-xl space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                  <Scale size={16} className="text-violet-400" />
                  <span>Paramètres du Soluté & Fiole Jaugée</span>
                </h3>
                <span className="text-xs text-slate-400 font-mono">Formule : m = C × V × M</span>
              </div>

              {/* Sélecteur de Soluté Prédéfini */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-2">
                  Sélectionner un composé chimique étalon
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {COMMON_SOLUTES.map((sol) => {
                    const isSelected = !useCustomMass && selectedSolute.id === sol.id;
                    return (
                      <button
                        key={sol.id}
                        type="button"
                        onClick={() => {
                          setSelectedSolute(sol);
                          setUseCustomMass(false);
                        }}
                        className={`p-2.5 rounded-xl border text-left transition-all relative overflow-hidden ${
                          isSelected
                            ? 'bg-violet-950/60 border-violet-500 shadow-md shadow-violet-900/20 text-white'
                            : 'bg-slate-950/50 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900/50'
                        }`}
                      >
                        <div className="text-xs font-bold truncate">{sol.formula}</div>
                        <div className="text-[10px] text-slate-400 truncate">{sol.name}</div>
                        <div className="text-[10px] font-mono text-violet-300 mt-1">{sol.molarMass} g/mol</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Option Mode Soluté Sur-Mesure / Valeur Custom */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-slate-200">
                    <input
                      type="checkbox"
                      checked={useCustomMass}
                      onChange={(e) => setUseCustomMass(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-700 text-violet-600 focus:ring-violet-500 bg-slate-900 cursor-pointer"
                    />
                    <span>Mode Soluté Sur-Mesure / Valeur Custom (TD & TP)</span>
                  </label>

                  {useCustomMass && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-violet-500/20 text-violet-300 border border-violet-500/30">
                      Actif
                    </span>
                  )}
                </div>

                {useCustomMass && (
                  <div className="pt-2 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-3 animate-in fade-in duration-150">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Formule brute</label>
                      <input
                        type="text"
                        value={customSoluteFormula}
                        onChange={(e) => setCustomSoluteFormula(e.target.value)}
                        placeholder="Ex: K2Cr2O7"
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-white focus:border-violet-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Nom du composé</label>
                      <input
                        type="text"
                        value={customSoluteName}
                        onChange={(e) => setCustomSoluteName(e.target.value)}
                        placeholder="Ex: Dichromate"
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:border-violet-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Masse molaire (g/mol)</label>
                      <input
                        type="number"
                        step="0.01"
                        min="1"
                        value={customMolarMass}
                        onChange={(e) => setCustomMolarMass(parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-violet-500 text-xs font-mono text-right text-white focus:outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Sliders & Inputs : Concentration & Volume */}
              <div className="space-y-4 pt-2">
                <div>
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="text-slate-300 font-medium">Concentration Molaire Souhaitée (C) :</span>
                    <span className="font-mono text-violet-400 font-bold text-sm">
                      {targetConcentration.toFixed(3)} mol/L{' '}
                      <span className="text-slate-400 text-xs">({(targetConcentration * 1000).toFixed(1)} mmol/L)</span>
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.005"
                    max="2.5"
                    step="0.005"
                    value={targetConcentration}
                    onChange={(e) => setTargetConcentration(parseFloat(e.target.value))}
                    className="w-full accent-violet-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="text-slate-300 font-medium">Volume de la Fiole Jaugée (V) :</span>
                    <span className="font-mono text-cyan-400 font-bold text-sm">
                      {targetVolumeMl} mL{' '}
                      <span className="text-slate-400 text-xs">({(targetVolumeMl / 1000).toFixed(3)} L)</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {[50, 100, 250, 500, 1000].map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setTargetVolumeMl(v)}
                        className={`flex-1 py-1 rounded-lg text-xs font-mono transition-all border ${
                          targetVolumeMl === v
                            ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 font-bold'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {v} mL
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Protocole de Préparation Étape par Étape */}
            <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 text-xs space-y-3">
              <div className="flex items-center gap-2 text-indigo-300 font-semibold text-sm">
                <BookOpen size={16} />
                <span>Protocole Opératoire Normalisé de TP</span>
              </div>
              <ol className="space-y-2 text-slate-300 list-decimal list-inside leading-relaxed">
                <li>
                  Tarer la coupelle de pesée et peser précisément{' '}
                  <strong className="text-violet-300 font-mono">{massRequiredG.toFixed(4)} g</strong> de{' '}
                  <span className="text-white font-medium">{useCustomMass ? 'soluté pur' : selectedSolute.formula}</span> sur balance de précision.
                </li>
                <li>
                  Transvaser quantitativement dans un bécher en rinçant la coupelle avec de l'eau distillée.
                </li>
                <li>
                  Dissoudre le solide sous agitation avec environ{' '}
                  <span className="font-mono text-cyan-300">{(targetVolumeMl * 0.4).toFixed(0)} mL</span> d'eau distillée.
                </li>
                <li>
                  Verser dans la fiole jaugée de <strong className="text-cyan-300">{targetVolumeMl} mL</strong> à l'aide d'un entonnoir rincé.
                </li>
                <li>
                  Compléter à l'eau distillée jusqu'au trait de jauge (ménisque tangent), boucher et retourner 3 fois pour homogénéiser.
                </li>
              </ol>
            </div>
          </div>

          {/* Colonne Visualisation Dynamique & Résultats */}
          <div className="lg:col-span-5 space-y-5">
            {/* Carte Résultat Principal de la Pesée */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-violet-950/60 to-slate-900 border border-violet-500/30 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-32 h-32 bg-violet-600/10 rounded-full blur-2xl pointer-events-none" />

              <span className="text-xs uppercase font-bold tracking-wider text-violet-400 flex items-center gap-1.5">
                <Sparkles size={14} />
                <span>Masse Précise à Prélever</span>
              </span>

              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-white tracking-tight font-mono">
                  {massRequiredG.toFixed(4)}
                </span>
                <span className="text-xl font-bold text-violet-400 font-mono">g</span>
              </div>

              <div className="mt-4 pt-4 border-t border-violet-500/20 grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-950/60 p-2.5 rounded-xl border border-violet-500/20">
                  <div className="text-slate-400">Quantité de matière (n)</div>
                  <div className="text-sm font-bold font-mono text-violet-200 mt-0.5">
                    {molesRequired >= 0.001 ? `${molesRequired.toFixed(4)} mol` : `${(molesRequired * 1000).toFixed(2)} mmol`}
                  </div>
                </div>

                <div className="bg-slate-950/60 p-2.5 rounded-xl border border-violet-500/20">
                  <div className="text-slate-400">Concentration Massique (Cm)</div>
                  <div className="text-sm font-bold font-mono text-cyan-300 mt-0.5">
                    {massConcentrationGL.toFixed(2)} g/L
                  </div>
                </div>
              </div>
            </div>

            {/* Représentation Visuelle Stylisée de la Fiole Jaugée */}
            <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col items-center justify-center text-center">
              <div className="text-xs text-slate-400 mb-3 font-medium">Représentation Virtuelle de la Solution</div>
              
              {/* Schéma SVG Fiole Jaugée Interactif */}
              <div className="relative w-44 h-56 flex items-center justify-center">
                <svg viewBox="0 0 120 150" className="w-full h-full drop-shadow-xl">
                  {/* Contour de la fiole jaugée en verre */}
                  <defs>
                    <linearGradient id="glassGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
                      <stop offset="50%" stopColor="#ffffff" stopOpacity="0.05" />
                      <stop offset="100%" stopColor="#ffffff" stopOpacity="0.3" />
                    </linearGradient>
                    <linearGradient id="liquidGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop
                        offset="0%"
                        stopColor={selectedSolute.color || '#8b5cf6'}
                        stopOpacity={Math.min(0.9, 0.3 + targetConcentration * 0.3)}
                      />
                      <stop
                        offset="100%"
                        stopColor="#3b82f6"
                        stopOpacity={Math.min(0.95, 0.4 + targetConcentration * 0.3)}
                      />
                    </linearGradient>
                  </defs>

                  {/* Fiole Col Long */}
                  <rect x="52" y="10" width="16" height="60" rx="3" fill="url(#glassGrad)" stroke="#475569" strokeWidth="1.5" />
                  
                  {/* Corps conique/bulbe */}
                  <path
                    d="M 52 70 C 40 85 20 100 20 125 C 20 142 35 145 60 145 C 85 145 100 142 100 125 C 100 100 80 85 68 70 Z"
                    fill="url(#glassGrad)"
                    stroke="#475569"
                    strokeWidth="1.5"
                  />

                  {/* Liquide coloré à l'intérieur */}
                  <path
                    d="M 53 60 C 53 60 67 60 67 60 C 67 70 80 85 98 123 C 98 140 83 143 60 143 C 37 143 22 140 22 123 C 40 85 53 70 53 60 Z"
                    fill="url(#liquidGrad)"
                  />

                  {/* Trait de Jauge gravé */}
                  <line x1="50" y1="50" x2="70" y2="50" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="2 1" />
                  <text x="74" y="52" fill="#f43f5e" fontSize="6" fontWeight="bold">Trait de jauge</text>

                  {/* Bulles interactives douces */}
                  <circle cx="56" cy="115" r="2.5" fill="#ffffff" opacity="0.5" />
                  <circle cx="68" cy="128" r="3" fill="#ffffff" opacity="0.4" />
                  <circle cx="60" cy="95" r="2" fill="#ffffff" opacity="0.6" />
                </svg>
              </div>

              <div className="mt-2 text-xs font-mono text-slate-300">
                Fiole de <strong className="text-cyan-400">{targetVolumeMl} mL</strong> ·{' '}
                <span className="text-violet-300 font-semibold">{useCustomMass ? 'Soluté spécial' : selectedSolute.formula}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SOUS-VUE 2 : LOI DE DILUTION (C1 * V1 = C2 * V2) */}
      {subTab === 'dilution' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-5">
            <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-xl space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                  <Pipette size={16} className="text-violet-400" />
                  <span>Calculateur de Dilution Mère ➔ Fille</span>
                </h3>
                <span className="text-xs text-slate-400 font-mono">Principe : C₁ · V₁ = C₂ · V₂</span>
              </div>

              {/* Paramètres Solution Mère C1 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-400">
                    Concentration Mère (C₁) [mol/L]
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    min="0.01"
                    value={c1}
                    onChange={(e) => setC1(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-sm focus:border-violet-500 focus:outline-none"
                  />
                  <div className="text-[10px] text-slate-500">Solution concentrée de départ</div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-400">
                    Concentration Fille Ciblée (C₂) [mol/L]
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.001"
                    value={c2}
                    onChange={(e) => setC2(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-sm focus:border-violet-500 focus:outline-none"
                  />
                  <div className="text-[10px] text-slate-500">Concentration finale après dilution</div>
                </div>
              </div>

              {/* Volume Fille V2 */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-medium">Volume Fille Souhaité (V₂) :</span>
                  <span className="text-cyan-400 font-mono font-bold text-sm">{v2} mL</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="1000"
                  step="10"
                  value={v2}
                  onChange={(e) => setV2(parseFloat(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                />
              </div>

              {/* Message d'erreur éventuel */}
              {!dilutionCalculations.isValid && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <Info size={16} className="text-rose-400 shrink-0" />
                  <span>{dilutionCalculations.error}</span>
                </div>
              )}
            </div>

            {/* Schéma de Protocole Dilution */}
            {dilutionCalculations.isValid && (
              <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 text-xs space-y-3">
                <div className="flex items-center gap-2 text-violet-300 font-semibold text-sm">
                  <Pipette size={16} />
                  <span>Protocole de Pipetage & Dilution</span>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 font-mono">
                  <div className="text-center sm:text-left">
                    <div className="text-slate-400 text-[11px]">Prélever à la pipette jaugée :</div>
                    <div className="text-base font-bold text-violet-400">
                      {dilutionCalculations.v1} mL <span className="text-xs text-slate-400 font-normal">de sol. mère</span>
                    </div>
                  </div>
                  <ArrowRight size={18} className="text-slate-600 hidden sm:block" />
                  <div className="text-center sm:text-left">
                    <div className="text-slate-400 text-[11px]">Ajouter environ :</div>
                    <div className="text-base font-bold text-cyan-400">
                      {dilutionCalculations.vWater} mL <span className="text-xs text-slate-400 font-normal">d'eau distillée</span>
                    </div>
                  </div>
                  <ArrowRight size={18} className="text-slate-600 hidden sm:block" />
                  <div className="text-center sm:text-left">
                    <div className="text-slate-400 text-[11px]">Volume final obtenu :</div>
                    <div className="text-base font-bold text-emerald-400">
                      {v2} mL <span className="text-xs text-slate-400 font-normal">homogène</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Colonne Facteur de Dilution & Résumé Visuel */}
          <div className="lg:col-span-5 space-y-5">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950/60 to-slate-900 border border-indigo-500/30 shadow-2xl">
              <span className="text-xs uppercase font-bold tracking-wider text-indigo-400">
                Facteur de Dilution F
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-white font-mono">
                  1 / {dilutionCalculations.factor || '—'}
                </span>
                <span className="text-xs text-indigo-300">({dilutionCalculations.factor}x)</span>
              </div>
              <p className="mt-2 text-xs text-slate-400">
                La solution est diluée d'un facteur de {dilutionCalculations.factor}. La concentration chute d'un ratio exact de{' '}
                <strong className="text-white font-mono">C₁ / C₂ = {dilutionCalculations.factor}</strong>.
              </p>

              <div className="mt-5 pt-4 border-t border-indigo-500/20 space-y-2 text-xs font-mono">
                <div className="flex justify-between text-slate-300">
                  <span>Volume Pipette Jaugée (V₁) :</span>
                  <strong className="text-violet-300">{dilutionCalculations.v1} mL</strong>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Volume d'eau à compléter (approx.) :</span>
                  <strong className="text-cyan-300">{dilutionCalculations.vWater} mL</strong>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Volume Fiole Finale (V₂) :</span>
                  <strong className="text-emerald-300">{v2} mL</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SOUS-VUE 3 : CALCULATEUR DE MASSE MOLAIRE PAR FORMULE */}
      {subTab === 'formula' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 backdrop-blur-xl space-y-5">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Saisir une formule chimique brute (supports hydrates, indices et parenthèses)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formulaInput}
                  onChange={(e) => setFormulaInput(e.target.value)}
                  placeholder="Ex: C6H12O6, Ca(OH)2, Fe2(SO4)3, CuSO4·5H2O"
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-base focus:border-violet-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setFormulaInput('C6H12O6')}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono"
                >
                  Glucose
                </button>
                <button
                  type="button"
                  onClick={() => setFormulaInput('Fe2(SO4)3')}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono"
                >
                  Fe₂(SO₄)₃
                </button>
              </div>
            </div>

            {parsedFormulaResult ? (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-3">
                <div className="md:col-span-5 p-5 rounded-xl bg-slate-950 border border-violet-500/30 flex flex-col justify-between">
                  <div>
                    <span className="text-xs uppercase font-bold tracking-wider text-violet-400">
                      Masse Molaire Calculée (M)
                    </span>
                    <div className="text-3xl font-extrabold text-white font-mono mt-1">
                      {parsedFormulaResult.molarMass}{' '}
                      <span className="text-lg text-violet-400 font-normal">g/mol</span>
                    </div>
                    <div className="text-xs text-slate-400 mt-2 font-mono">
                      Formule brute analysée : <strong className="text-white">{parsedFormulaResult.formula}</strong>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
                    Calcul conforme aux masses atomiques relatives standard UICPA (IUPAC).
                  </div>
                </div>

                {/* Décomposition Centésimale Massique */}
                <div className="md:col-span-7 space-y-3">
                  <div className="text-xs font-semibold text-slate-300">
                    Composition Élémentaire & Fractions Massiques :
                  </div>
                  <div className="space-y-2">
                    {parsedFormulaResult.composition.map((c) => (
                      <div key={c.element} className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                        <div className="flex justify-between items-center text-xs mb-1">
                          <span className="font-mono font-bold text-white">
                            {c.element} <span className="text-slate-400 font-normal">× {c.count}</span>
                          </span>
                          <span className="font-mono text-cyan-300 font-semibold">
                            {c.percent.toFixed(2)} % <span className="text-slate-400 text-[10px]">({c.mass.toFixed(3)} g/mol)</span>
                          </span>
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-violet-500 to-cyan-400 h-full rounded-full transition-all duration-300"
                            style={{ width: `${c.percent}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs">
                Impossible d'analyser la formule. Vérifiez la casse des symboles (ex: <code>Ca</code> et non <code>ca</code>, <code>H2O</code>).
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal d'Exportation de Compte-Rendu de TP */}
      <TPReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        title="Compte-Rendu de Travaux Pratiques : Solutions & Molarité"
        moduleName="Solutions & Molarité"
        academicLevel="Licence 1 · Licence 2"
        reportContent={generatedReport}
      />
    </div>
  );
}
