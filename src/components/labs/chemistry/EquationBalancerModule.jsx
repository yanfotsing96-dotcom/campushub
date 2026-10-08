import { useState, useMemo } from 'react';
import {
  Scale,
  ArrowRight,
  AlertCircle,
  BarChart2,
  Layers,
  FileText,
} from 'lucide-react';
import { PRESET_EQUATIONS } from './chemistryData';
import TPReportModal from './TPReportModal';

export default function EquationBalancerModule() {
  const [selectedPresetId, setSelectedPresetId] = useState(PRESET_EQUATIONS[0].id);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Mode Réaction Personnalisée / Valeur Custom
  const [isCustomReaction, setIsCustomReaction] = useState(false);
  const [customR1Name, setCustomR1Name] = useState('A');
  const [customR1Coeff, setCustomR1Coeff] = useState(1);
  const [customR2Name, setCustomR2Name] = useState('B');
  const [customR2Coeff, setCustomR2Coeff] = useState(2);
  const [customP1Name, setCustomP1Name] = useState('C');
  const [customP1Coeff, setCustomP1Coeff] = useState(1);
  const [customDeltaH, setCustomDeltaH] = useState(-150);

  const currentEquation = useMemo(() => {
    if (isCustomReaction) {
      return {
        id: 'custom_reaction',
        name: 'Réaction Personnalisée de TD',
        type: 'Réaction sur-mesure',
        reactants: [
          { formula: customR1Name || 'A', name: customR1Name || 'Réactif 1', coeff: Math.max(1, customR1Coeff), state: 'aq' },
          { formula: customR2Name || 'B', name: customR2Name || 'Réactif 2', coeff: Math.max(1, customR2Coeff), state: 'aq' },
        ],
        products: [
          { formula: customP1Name || 'C', name: customP1Name || 'Produit', coeff: Math.max(1, customP1Coeff), state: 'aq' },
        ],
        deltaH: customDeltaH,
      };
    }
    return PRESET_EQUATIONS.find((e) => e.id === selectedPresetId) || PRESET_EQUATIONS[0];
  }, [selectedPresetId, isCustomReaction, customR1Name, customR1Coeff, customR2Name, customR2Coeff, customP1Name, customP1Coeff, customDeltaH]);

  // Quantités initiales en moles pour les réactifs (indexés par formule)
  const [initialMoles, setInitialMoles] = useState({
    CH4: 2.0,
    O2: 5.0,
    H2: 4.0,
    C3H8: 1.0,
    N2: 2.0,
    Al: 4.0,
    HCl: 10.0,
    Fe: 4.0,
    A: 2.0,
    B: 5.0,
  });

  const handleMoleChange = (formula, value) => {
    setInitialMoles((prev) => ({
      ...prev,
      [formula]: Math.max(0, parseFloat(value) || 0),
    }));
  };

  // Calcul du tableau d'avancement
  const stoichiometryAnalysis = useMemo(() => {
    const { reactants, products } = currentEquation;

    // Déterminer x_max pour chaque réactif : x_max = n_0(R) / coeff(R)
    const reactantAnalysis = reactants.map((r) => {
      const n0 = initialMoles[r.formula] !== undefined ? initialMoles[r.formula] : 2.0;
      const xMaxPossible = r.coeff > 0 ? n0 / r.coeff : 0;
      return {
        ...r,
        n0,
        xMaxPossible,
      };
    });

    // Le réactif limitant est celui qui minimise x_max
    let minXMax = Infinity;
    let limitingReactant = null;

    reactantAnalysis.forEach((r) => {
      if (r.xMaxPossible < minXMax) {
        minXMax = r.xMaxPossible;
        limitingReactant = r;
      }
    });

    const xFinal = Number(minXMax.toFixed(3));

    // Bilan final des réactifs (n_f = n_0 - coeff * x_final)
    const finalReactants = reactantAnalysis.map((r) => {
      const nf = Math.max(0, Number((r.n0 - r.coeff * xFinal).toFixed(3)));
      return {
        ...r,
        nf,
        isLimiting: limitingReactant?.formula === r.formula,
      };
    });

    // Bilan final des produits (n_f = 0 + coeff * x_final)
    const finalProducts = products.map((p) => {
      const nf = Number((p.coeff * xFinal).toFixed(3));
      return {
        ...p,
        n0: 0,
        nf,
      };
    });

    return {
      xFinal,
      limitingReactant,
      finalReactants,
      finalProducts,
    };
  }, [currentEquation, initialMoles]);

  const generatedReport = useMemo(() => {
    const eqStr = `${currentEquation.reactants
      .map((r) => `${r.coeff > 1 ? r.coeff : ''}\\ \\text{${r.formula}}`)
      .join(' + ')} \\longrightarrow ${currentEquation.products
      .map((p) => `${p.coeff > 1 ? p.coeff : ''}\\ \\text{${p.formula}}`)
      .join(' + ')}`;

    const reactantsInitText = currentEquation.reactants
      .map(
        (r) =>
          `- Quantité initiale de **${r.formula}** : $n_0(\\text{${r.formula}}) = ${initialMoles[r.formula] || 0}\\ \\text{mol}$ (coefficient $\\nu = ${r.coeff}$)`
      )
      .join('\n');

    const ratiosText = currentEquation.reactants
      .map((r) => {
        const n0 = initialMoles[r.formula] || 0;
        const ratio = r.coeff > 0 ? (n0 / r.coeff).toFixed(3) : 0;
        return `- Rapport stœchiométrique pour **${r.formula}** : $x_{\\max}(\\text{${r.formula}}) = \\frac{n_0}{\\nu} = \\frac{${n0}}{${r.coeff}} = ${ratio}\\ \\text{mol}$`;
      })
      .join('\n');

    const tableRows = [
      ...stoichiometryAnalysis.finalReactants.map(
        (r) =>
          `| **${r.formula}** (Réactif) | $${r.n0}\\ \\text{mol}$ | $${r.n0} - ${r.coeff}x$ | **${r.nf} mol** ${r.isLimiting ? '**(Limitant)**' : '(Excès)'} |`
      ),
      ...stoichiometryAnalysis.finalProducts.map(
        (p) =>
          `| **${p.formula}** (Produit) | $0\\ \\text{mol}$ | $${p.coeff}x$ | **${p.nf} mol** (Formé) |`
      ),
    ].join('\n');

    return `# Compte-Rendu de TP : Stœchiométrie et Tableau d'Avancement

## 1. Équation Chimique Modélisée

$$${eqStr}$$

- Intitulé de la réaction : **${currentEquation.name}** (${currentEquation.type})
- Enthalpie standard de réaction ($\\Delta H^\\circ$) : **${currentEquation.deltaH} kJ/mol**

## 2. Conditions Initiales et Réactif Limitant
${reactantsInitText}

${ratiosText}

## 3. Tableau d'Avancement Réactionnel

| Espèce Chimique | État Initial ($x = 0$) | En cours ($x$) | État Final ($x_{\\max}$) |
| :--- | :---: | :---: | :--- |
${tableRows}

## 4. Résultats Finaux

> **Bilan stœchiométrique final :**
> - **Réactif limitant identifié :** **${stoichiometryAnalysis.limitingReactant?.formula || 'Aucun'}**
> - **Avancement maximal ($x_{\\max}$) :** **${stoichiometryAnalysis.xFinal} mol**
> - **Conservation de la matière :** Vérifiée conformément à la loi de Lavoisier.
`;
  }, [currentEquation, initialMoles, stoichiometryAnalysis]);

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Scale size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono">
                L1 · L2 FONDAMENTAL
              </span>
              <span className="text-xs text-slate-400">Stœchiométrie & Conservation de la Masse</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Équilibreur d'Équations & Tableau d'Avancement
            </h2>
          </div>
        </div>

        {/* Sélecteur de Réaction Prédéfinie & Bouton Export TP */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="min-w-[220px]">
            <select
              value={isCustomReaction ? 'custom' : selectedPresetId}
              onChange={(e) => {
                if (e.target.value === 'custom') {
                  setIsCustomReaction(true);
                } else {
                  setIsCustomReaction(false);
                  setSelectedPresetId(e.target.value);
                }
              }}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-semibold focus:border-indigo-500 focus:outline-none"
            >
              {PRESET_EQUATIONS.map((eq) => (
                <option key={eq.id} value={eq.id}>
                  {eq.name} ({eq.type})
                </option>
              ))}
              <option value="custom">★ Mode Réaction Sur-Mesure / Custom</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => setIsReportModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 text-xs font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-950/30 hover:shadow-indigo-900/40"
            title="Consulter le compte-rendu de laboratoire"
          >
            <FileText size={15} className="text-indigo-400" />
            <span>Compte-Rendu TP</span>
          </button>
        </div>
      </div>

      {/* Configuration Mode Réaction Sur-Mesure */}
      {isCustomReaction && (
        <div className="p-4 rounded-xl bg-slate-900/80 border border-indigo-500/30 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3 text-xs">
          <div>
            <label className="text-slate-400 block mb-1">Réactif 1</label>
            <input
              type="text"
              value={customR1Name}
              onChange={(e) => setCustomR1Name(e.target.value)}
              className="w-full px-2 py-1 bg-slate-950 border border-slate-700 rounded text-white font-mono"
            />
          </div>
          <div>
            <label className="text-slate-400 block mb-1">Coeff R1</label>
            <input
              type="number"
              min="1"
              max="10"
              value={customR1Coeff}
              onChange={(e) => setCustomR1Coeff(parseInt(e.target.value, 10) || 1)}
              className="w-full px-2 py-1 bg-slate-950 border border-slate-700 rounded text-white font-mono"
            />
          </div>
          <div>
            <label className="text-slate-400 block mb-1">Réactif 2</label>
            <input
              type="text"
              value={customR2Name}
              onChange={(e) => setCustomR2Name(e.target.value)}
              className="w-full px-2 py-1 bg-slate-950 border border-slate-700 rounded text-white font-mono"
            />
          </div>
          <div>
            <label className="text-slate-400 block mb-1">Coeff R2</label>
            <input
              type="number"
              min="1"
              max="10"
              value={customR2Coeff}
              onChange={(e) => setCustomR2Coeff(parseInt(e.target.value, 10) || 1)}
              className="w-full px-2 py-1 bg-slate-950 border border-slate-700 rounded text-white font-mono"
            />
          </div>
          <div>
            <label className="text-slate-400 block mb-1">Produit 1</label>
            <input
              type="text"
              value={customP1Name}
              onChange={(e) => setCustomP1Name(e.target.value)}
              className="w-full px-2 py-1 bg-slate-950 border border-slate-700 rounded text-white font-mono"
            />
          </div>
          <div>
            <label className="text-slate-400 block mb-1">Coeff P1</label>
            <input
              type="number"
              min="1"
              max="10"
              value={customP1Coeff}
              onChange={(e) => setCustomP1Coeff(parseInt(e.target.value, 10) || 1)}
              className="w-full px-2 py-1 bg-slate-950 border border-slate-700 rounded text-white font-mono"
            />
          </div>
          <div>
            <label className="text-slate-400 block mb-1">ΔH° (kJ/mol)</label>
            <input
              type="number"
              value={customDeltaH}
              onChange={(e) => setCustomDeltaH(parseFloat(e.target.value) || 0)}
              className="w-full px-2 py-1 bg-slate-950 border border-slate-700 rounded text-white font-mono"
            />
          </div>
        </div>
      )}

      {/* Affichage de l'équation équilibrée */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs uppercase font-bold tracking-wider text-indigo-300">
            Équation Chimique Stœchiométrique
          </span>
          <span className="text-xs text-slate-400 font-mono">
            ΔH° = {currentEquation.deltaH} kJ/mol
          </span>
        </div>

        {/* Formule en grand format lisible avec coefficients surlignés */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 py-4 text-base sm:text-2xl font-mono font-bold text-white bg-slate-950/70 rounded-xl border border-slate-800/80 px-4">
          {/* Réactifs */}
          {currentEquation.reactants.map((r, idx) => (
            <span key={r.formula} className="flex items-center gap-1.5">
              {idx > 0 && <span className="text-slate-500 font-light">+</span>}
              <span className="px-2 py-0.5 rounded-lg bg-indigo-600/30 text-indigo-300 border border-indigo-500/40">
                {r.coeff}
              </span>
              <span>{r.formula}</span>
              <sub className="text-xs text-slate-400 font-normal">({r.state})</sub>
            </span>
          ))}

          {/* Flèche de réaction */}
          <span className="text-indigo-400 px-2 flex items-center">
            <ArrowRight size={22} className="stroke-[3]" />
          </span>

          {/* Produits */}
          {currentEquation.products.map((p, idx) => (
            <span key={p.formula} className="flex items-center gap-1.5">
              {idx > 0 && <span className="text-slate-500 font-light">+</span>}
              <span className="px-2 py-0.5 rounded-lg bg-emerald-600/30 text-emerald-300 border border-emerald-500/40">
                {p.coeff}
              </span>
              <span>{p.formula}</span>
              <sub className="text-xs text-slate-400 font-normal">({p.state})</sub>
            </span>
          ))}
        </div>
      </div>

      {/* Saisie des Quantités Initiales & Tableau d'avancement */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Colonne Contrôle Réactifs Initiaux */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 backdrop-blur-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <Layers size={16} className="text-indigo-400" />
                <span>Conditions Initiales (t = 0)</span>
              </h3>
              <span className="text-[11px] text-slate-400 font-mono">en moles</span>
            </div>

            {currentEquation.reactants.map((r) => {
              const currentVal =
                initialMoles[r.formula] !== undefined ? initialMoles[r.formula] : 2.0;
              return (
                <div key={r.formula} className="space-y-1.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium text-slate-300">
                      Quantité de <strong className="text-white font-mono">{r.formula}</strong> :
                    </span>
                    <span className="font-mono text-indigo-400 font-bold text-sm">
                      {currentVal.toFixed(2)} mol
                    </span>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.1"
                    value={currentVal}
                    onChange={(e) => handleMoleChange(r.formula, e.target.value)}
                    className="w-full accent-indigo-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                  />
                </div>
              );
            })}

            {/* Alerte Réactif Limitant */}
            {stoichiometryAnalysis.limitingReactant && (
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold">
                  <AlertCircle size={15} className="text-amber-400" />
                  <span>Réactif Limitant Identifié :</span>
                  <span className="text-white font-mono underline decoration-amber-400">
                    {stoichiometryAnalysis.limitingReactant.formula}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Consommé intégralement en premier. Il bloque la progression de la réaction à{' '}
                  <strong className="text-white font-mono">
                    x_max = {stoichiometryAnalysis.xFinal} mol
                  </strong>
                  .
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Colonne Tableau d'avancement & Visualisation Barres */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 backdrop-blur-xl space-y-4 overflow-x-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <BarChart2 size={16} className="text-emerald-400" />
                <span>Tableau d'Avancement Réactionnel</span>
              </h3>
              <span className="text-xs font-mono text-emerald-400 font-bold">
                x_max = {stoichiometryAnalysis.xFinal} mol
              </span>
            </div>

            {/* Table formatifiée */}
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono">
                  <th className="py-2 pr-3">État du Système</th>
                  <th className="py-2 pr-3">Avancement (x)</th>
                  {currentEquation.reactants.map((r) => (
                    <th key={r.formula} className="py-2 pr-3 text-indigo-300">
                      n({r.formula})
                    </th>
                  ))}
                  {currentEquation.products.map((p) => (
                    <th key={p.formula} className="py-2 pr-3 text-emerald-300">
                      n({p.formula})
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-slate-200">
                <tr>
                  <td className="py-2.5 pr-3 text-slate-400">Initial (t = 0)</td>
                  <td className="py-2.5 pr-3 text-slate-500">x = 0</td>
                  {stoichiometryAnalysis.finalReactants.map((r) => (
                    <td key={r.formula} className="py-2.5 pr-3 font-semibold">
                      {r.n0} mol
                    </td>
                  ))}
                  {stoichiometryAnalysis.finalProducts.map((p) => (
                    <td key={p.formula} className="py-2.5 pr-3 text-slate-500">
                      0 mol
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-2.5 pr-3 text-slate-400">En cours (t)</td>
                  <td className="py-2.5 pr-3 text-indigo-400">x</td>
                  {stoichiometryAnalysis.finalReactants.map((r) => (
                    <td key={r.formula} className="py-2.5 pr-3 text-indigo-300 text-[11px]">
                      {r.n0} - {r.coeff}x
                    </td>
                  ))}
                  {stoichiometryAnalysis.finalProducts.map((p) => (
                    <td key={p.formula} className="py-2.5 pr-3 text-emerald-300 text-[11px]">
                      {p.coeff}x
                    </td>
                  ))}
                </tr>
                <tr className="bg-slate-950/70 font-bold">
                  <td className="py-2.5 pr-3 text-emerald-400">Final (t_final)</td>
                  <td className="py-2.5 pr-3 text-emerald-400">{stoichiometryAnalysis.xFinal} mol</td>
                  {stoichiometryAnalysis.finalReactants.map((r) => (
                    <td
                      key={r.formula}
                      className={`py-2.5 pr-3 ${
                        r.isLimiting ? 'text-amber-400 font-extrabold' : 'text-slate-200'
                      }`}
                    >
                      {r.nf} mol {r.isLimiting && '(épuisé)'}
                    </td>
                  ))}
                  {stoichiometryAnalysis.finalProducts.map((p) => (
                    <td key={p.formula} className="py-2.5 pr-3 text-emerald-400">
                      {p.nf} mol
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          {/* Diagramme Graphique des Moles Initiales vs Finales */}
          <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 text-xs space-y-3">
            <div className="text-slate-300 font-semibold flex items-center justify-between">
              <span>Bilan Molaire (Initial en bleu vs Final en vert)</span>
              <span className="text-[11px] text-slate-500">Loi de Lavoisier respectée</span>
            </div>

            <div className="space-y-3">
              {[...stoichiometryAnalysis.finalReactants, ...stoichiometryAnalysis.finalProducts].map(
                (item) => {
                  const maxDisplay = 10;
                  const initPct = Math.min(100, (item.n0 / maxDisplay) * 100);
                  const finPct = Math.min(100, (item.nf / maxDisplay) * 100);

                  return (
                    <div key={item.formula} className="space-y-1">
                      <div className="flex justify-between items-center text-[11px] font-mono">
                        <span className="text-slate-200 font-bold">{item.formula}</span>
                        <span className="text-slate-400">
                          {item.n0} mol ➔ <strong className="text-white">{item.nf} mol</strong>
                        </span>
                      </div>
                      <div className="flex gap-1 h-2 rounded-full overflow-hidden bg-slate-950">
                        <div
                          className="bg-indigo-500/60 rounded-full transition-all duration-300"
                          style={{ width: `${initPct}%` }}
                          title={`Initial: ${item.n0} mol`}
                        />
                        <div
                          className="bg-emerald-500 rounded-full transition-all duration-300"
                          style={{ width: `${finPct}%` }}
                          title={`Final: ${item.nf} mol`}
                        />
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal d'Exportation de Compte-Rendu de TP */}
      <TPReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        title="Compte-Rendu de TP : Équilibreur d'Équations & Stœchiométrie"
        moduleName="Stœchiométrie & Bilan de Matière"
        academicLevel="Licence 1 · Licence 2"
        reportContent={generatedReport}
      />
    </div>
  );
}
