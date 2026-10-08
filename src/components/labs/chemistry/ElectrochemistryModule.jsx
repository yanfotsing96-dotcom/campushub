import { useState, useMemo } from 'react';
import {
  Zap,
  BatteryCharging,
  FileText,
  SlidersHorizontal,
} from 'lucide-react';
import { REDOX_COUPLES } from './chemistryData';
import TPReportModal from './TPReportModal';

export default function ElectrochemistryModule() {
  // Sélection des deux demi-piles (Par défaut Daniell : Zn/Zn2+ à l'anode et Cu2+/Cu à la cathode)
  const [anodeCoupleId, setAnodeCoupleId] = useState('zn_zn');
  const [cathodeCoupleId, setCathodeCoupleId] = useState('cu_cu');

  // Concentrations molaires dans chaque compartiment (mol/L)
  const [cAnode, setCAnode] = useState(0.1); // [Zn2+]
  const [cCathode, setCCathode] = useState(1.0); // [Cu2+]

  // Modal Compte-Rendu TP
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Mode Couples Personnalisés / Constantes Custom (TD & TP)
  const [isCustomCell, setIsCustomCell] = useState(false);
  const [customAnodeName, setCustomAnodeName] = useState('Couple Anodique Custom');
  const [customAnodeFormula, setCustomAnodeFormula] = useState('M²⁺/M');
  const [customAnodeE0, setCustomAnodeE0] = useState(-0.763);
  const [customAnodeN, setCustomAnodeN] = useState(2);

  const [customCathodeName, setCustomCathodeName] = useState('Couple Cathodique Custom');
  const [customCathodeFormula, setCustomCathodeFormula] = useState('X²⁺/X');
  const [customCathodeE0, setCustomCathodeE0] = useState(0.337);
  const [customCathodeN, setCustomCathodeN] = useState(2);

  const anodeCouple = useMemo(() => {
    if (isCustomCell) {
      return {
        id: 'custom_anode',
        name: customAnodeName,
        formula: customAnodeFormula,
        e0: customAnodeE0,
        n: Math.max(1, customAnodeN),
        type: 'anode',
      };
    }
    return REDOX_COUPLES.find((c) => c.id === anodeCoupleId) || REDOX_COUPLES[13];
  }, [isCustomCell, customAnodeName, customAnodeFormula, customAnodeE0, customAnodeN, anodeCoupleId]);

  const cathodeCouple = useMemo(() => {
    if (isCustomCell) {
      return {
        id: 'custom_cathode',
        name: customCathodeName,
        formula: customCathodeFormula,
        e0: customCathodeE0,
        n: Math.max(1, customCathodeN),
        type: 'cathode',
      };
    }
    return REDOX_COUPLES.find((c) => c.id === cathodeCoupleId) || REDOX_COUPLES[7];
  }, [isCustomCell, customCathodeName, customCathodeFormula, customCathodeE0, customCathodeN, cathodeCoupleId]);

  const F = 96485; // Constante de Faraday en C/mol

  // Calculs Nernst & Électrochimiques
  const electroAnalysis = useMemo(() => {
    // Nombre d'électrons échangés n (ppcm ou n de la demi-pile)
    const n = Math.max(1, Math.min(cathodeCouple.n, anodeCouple.n));

    // f.e.m. standard E°_cell = E°_cathode - E°_anode
    const e0Cell = cathodeCouple.e0 - anodeCouple.e0;

    // Quotient réactionnel Q = [Anode] / [Cathode]
    const qRatio = Math.max(1e-6, cAnode) / Math.max(1e-6, cCathode);

    // Équation de Nernst à 298.15 K : E = E° - (0.0592 / n) * log10(Q)
    const deltaE = e0Cell - (0.0592 / n) * Math.log10(qRatio);

    // DeltaG° = -n * F * E°_cell (en Joules/mol -> convertir en kJ/mol)
    const deltaG0_kJ = (-n * F * e0Cell) / 1000;

    const isSpontaneous = deltaE > 0;

    return {
      n,
      e0Cell: Number(e0Cell.toFixed(3)),
      deltaE: Number(deltaE.toFixed(3)),
      qRatio: Number(qRatio.toFixed(3)),
      deltaG0_kJ: Number(deltaG0_kJ.toFixed(1)),
      isSpontaneous,
    };
  }, [anodeCouple, cathodeCouple, cAnode, cCathode]);

  // Génération dynamique du compte-rendu de TP au format Markdown
  const generatedReport = useMemo(() => {
    const spontaneityText = electroAnalysis.isSpontaneous
      ? 'Spontané (Mode Pile / Générateur : $\\Delta E > 0$ et $\\Delta G^\\circ < 0$)'
      : 'Non spontané (Mode Électrolyseur : $\\Delta E < 0$)';

    return `# Compte-Rendu de TP : Électrochimie et Piles Galvaniques

## 1. Description des Demi-Piles

| Compartiment | Couple Redox | Potentiel Standard $E^\\circ$ | Concentration |
| :--- | :---: | :---: | :---: |
| **Anode (Oxydation, pôle $-$)** | **${anodeCouple.formula}** (${anodeCouple.name}) | **${anodeCouple.e0 > 0 ? `+${anodeCouple.e0}` : anodeCouple.e0} V** | **${cAnode} mol/L** |
| **Cathode (Réduction, pôle $+$)** | **${cathodeCouple.formula}** (${cathodeCouple.name}) | **${cathodeCouple.e0 > 0 ? `+${cathodeCouple.e0}` : cathodeCouple.e0} V** | **${cCathode} mol/L** |

- Nombre d'électrons échangés ($n$) : **${electroAnalysis.n}**
- Quotient réactionnel ($Q = [\\text{Anode}] / [\\text{Cathode}]$) : **${electroAnalysis.qRatio}**

## 2. Formulation Théorique et Équation de Nernst
- **Force électromotrice standard ($E^\\circ_{\\text{cell}}$) :**

$$E^\\circ_{\\text{cell}} = E^\\circ(\\text{Cathode}) - E^\\circ(\\text{Anode}) = ${cathodeCouple.e0} - (${anodeCouple.e0}) = ${electroAnalysis.e0Cell}\\ \\text{V}$$

- **Équation de Nernst à $25\\ ^\\circ\\text{C}$ ($T = 298{,}15\\ \\text{K}$) :**

$$E = E^\\circ_{\\text{cell}} - \\frac{0{,}0592}{n} \\log_{10}(Q) = ${electroAnalysis.e0Cell} - \\frac{0{,}0592}{${electroAnalysis.n}} \\log_{10}(${electroAnalysis.qRatio}) = ${electroAnalysis.deltaE}\\ \\text{V}$$

- **Enthalpie libre standard de réaction ($\\Delta G^\\circ$) :**

$$\\Delta G^\\circ = -n \\times F \\times E^\\circ_{\\text{cell}} = ${electroAnalysis.deltaG0_kJ}\\ \\text{kJ/mol}$$

## 3. Résultats Finaux

> **Synthèse électrochimique de la cellule :**
> - **Force électromotrice théorique ($E$) :** **${electroAnalysis.deltaE > 0 ? `+${electroAnalysis.deltaE}` : electroAnalysis.deltaE} V**
> - **Différence de potentiel standard ($E^\\circ_{\\text{cell}}$) :** **${electroAnalysis.e0Cell > 0 ? `+${electroAnalysis.e0Cell}` : electroAnalysis.e0Cell} V**
> - **Variation d'enthalpie libre ($\\Delta G^\\circ$) :** **${electroAnalysis.deltaG0_kJ} kJ/mol**
> - **Régime :** **${spontaneityText}**

## 4. Protocole Expérimental de Laboratoire
- Préparer deux béchers de $100\\ \\text{mL}$ contenant les solutions ioniques respectives à **${cAnode} mol/L** et **${cCathode} mol/L**.
- Décaper les électrodes métalliques au papier émeri fin, puis les rincer à l'eau distillée.
- Relier les deux demi-piles par un pont salin gélifié saturé en $\\text{KNO}_3$ et mesurer la tension à vide à l'aide d'un voltmètre de haute impédance.
`;
  }, [anodeCouple, cathodeCouple, cAnode, cCathode, electroAnalysis]);

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
            <Zap size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-violet-500/20 text-violet-300 border border-violet-500/30 font-mono">
                L3 · MASTER AVANCÉ
              </span>
              <span className="text-xs text-slate-400">Potentiels Redox IUPAC & Équation de Nernst</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Électrochimie & Piles Galvaniques
            </h2>
          </div>
        </div>

        {/* Actions & Badge f.e.m. en direct */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-slate-950 border border-indigo-500/40 text-xs font-mono flex items-center gap-2">
            <span className="text-slate-400">f.é.m. en direct (E) :</span>
            <span
              className={`font-bold text-sm ${
                electroAnalysis.isSpontaneous ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {electroAnalysis.deltaE > 0 ? `+${electroAnalysis.deltaE}` : electroAnalysis.deltaE} V
            </span>
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

      {/* Schéma Interactif SVG de la Pile Électrochimique */}
      <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 shadow-2xl space-y-4">
        <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <BatteryCharging size={16} className="text-violet-400" />
            <span className="font-semibold text-slate-200">
              Modélisation Virtuelle : Pile Galvanique (Daniell Type)
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Flux électronique : Anode (-) ➔ Cathode (+)
          </span>
        </div>

        {/* Rendu SVG complet de la pile */}
        <div className="relative w-full h-64 sm:h-72 bg-slate-950 rounded-2xl border border-slate-800/80 p-2 overflow-hidden flex items-center justify-center">
          <svg viewBox="0 0 600 240" className="w-full h-full">
            {/* 1. Voltmètre Central */}
            <circle cx="300" cy="45" r="28" fill="#0f172a" stroke="#6366f1" strokeWidth="2" />
            <text x="300" y="42" fill="#38bdf8" fontSize="12" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              {electroAnalysis.deltaE} V
            </text>
            <text x="300" y="55" fill="#94a3b8" fontSize="8" textAnchor="middle">
              Voltmètre
            </text>

            {/* Câbles électriques */}
            {/* Câble gauche vers anode */}
            <path d="M 272 45 L 140 45 L 140 100" fill="none" stroke="#f43f5e" strokeWidth="2.5" />
            {/* Câble droit vers cathode */}
            <path d="M 328 45 L 460 45 L 460 100" fill="none" stroke="#3b82f6" strokeWidth="2.5" />

            {/* Flèche flux électrons */}
            <text x="210" y="38" fill="#f43f5e" fontSize="9" fontFamily="monospace">➔ e⁻</text>
            <text x="380" y="38" fill="#3b82f6" fontSize="9" fontFamily="monospace">➔ e⁻</text>

            {/* 2. Compartiment Anode (Gauche) */}
            {/* Bécher gauche */}
            <rect x="90" y="110" width="100" height="110" rx="4" fill="#1e293b" fillOpacity="0.4" stroke="#475569" strokeWidth="2" />
            {/* Solution gauche */}
            <rect x="92" y="140" width="96" height="78" rx="2" fill="#64748b" fillOpacity="0.25" />
            {/* Électrode anode (métal) */}
            <rect x="130" y="90" width="20" height="90" rx="2" fill="#94a3b8" stroke="#cbd5e1" strokeWidth="1.5" />
            <text x="140" y="85" fill="#f43f5e" fontSize="10" fontWeight="bold" textAnchor="middle">
              Anode (-)
            </text>
            <text x="140" y="215" fill="#cbd5e1" fontSize="9" textAnchor="middle" fontFamily="monospace">
              [{anodeCouple.red}] · {cAnode} M
            </text>

            {/* 3. Compartiment Cathode (Droite) */}
            {/* Bécher droit */}
            <rect x="410" y="110" width="100" height="110" rx="4" fill="#1e293b" fillOpacity="0.4" stroke="#475569" strokeWidth="2" />
            {/* Solution droite (colorée bleutée) */}
            <rect x="412" y="140" width="96" height="78" rx="2" fill="#0284c7" fillOpacity="0.4" />
            {/* Électrode cathode (métal) */}
            <rect x="450" y="90" width="20" height="90" rx="2" fill="#d97706" stroke="#fcd34d" strokeWidth="1.5" />
            <text x="460" y="85" fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="middle">
              Cathode (+)
            </text>
            <text x="460" y="215" fill="#cbd5e1" fontSize="9" textAnchor="middle" fontFamily="monospace">
              [{cathodeCouple.ox}] · {cCathode} M
            </text>

            {/* 4. Pont Salin (U inversé central) */}
            <path
              d="M 165 150 L 165 125 C 165 110 435 110 435 125 L 435 150"
              fill="none"
              stroke="#a855f7"
              strokeWidth="10"
              strokeLinecap="round"
            />
            <path
              d="M 165 150 L 165 125 C 165 110 435 110 435 125 L 435 150"
              fill="none"
              stroke="#e9d5ff"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <text x="300" y="118" fill="#d8b4fe" fontSize="8" fontWeight="bold" textAnchor="middle">
              Pont Salin (K⁺ / Cl⁻)
            </text>
          </svg>
        </div>
      </div>

      {/* Mode Couples Redox Personnalisés / Constantes Custom (TD & TP) */}
      <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 backdrop-blur-xl space-y-3">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-slate-200">
            <input
              type="checkbox"
              checked={isCustomCell}
              onChange={(e) => setIsCustomCell(e.target.checked)}
              className="w-4 h-4 rounded border-slate-700 text-violet-600 focus:ring-violet-500 bg-slate-950 cursor-pointer"
            />
            <span className="flex items-center gap-1.5">
              <SlidersHorizontal size={14} className="text-violet-400" />
              <span>Mode Couples Redox & Constantes Custom (TD & TP)</span>
            </span>
          </label>
          {isCustomCell && (
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-violet-500/20 text-violet-300 border border-violet-500/30">
              Paramètres Libres Actifs
            </span>
          )}
        </div>

        {isCustomCell && (
          <div className="pt-3 border-t border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-150">
            {/* Custom Anode */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-rose-500/30 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-rose-400 text-[11px] uppercase tracking-wider">
                  Demi-Pile Anodique Custom
                </span>
                <span className="text-[10px] font-mono text-slate-400">Pôle Négatif (-)</span>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Formule (Ox/Red)</label>
                  <input
                    type="text"
                    value={customAnodeFormula}
                    onChange={(e) => setCustomAnodeFormula(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:border-rose-500 focus:outline-none"
                    placeholder="Zn²⁺/Zn"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Désignation Espèce</label>
                  <input
                    type="text"
                    value={customAnodeName}
                    onChange={(e) => setCustomAnodeName(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:border-rose-500 focus:outline-none"
                    placeholder="Zinc métal"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">E° standard (V)</label>
                  <input
                    type="number"
                    step="0.001"
                    value={customAnodeE0}
                    onChange={(e) => setCustomAnodeE0(parseFloat(e.target.value) || 0)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-rose-500/50 text-white font-mono text-xs focus:border-rose-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Électrons n</label>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    value={customAnodeN}
                    onChange={(e) => setCustomAnodeN(parseInt(e.target.value, 10) || 1)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:border-rose-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Custom Cathode */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-cyan-500/30 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-cyan-400 text-[11px] uppercase tracking-wider">
                  Demi-Pile Cathodique Custom
                </span>
                <span className="text-[10px] font-mono text-slate-400">Pôle Positif (+)</span>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Formule (Ox/Red)</label>
                  <input
                    type="text"
                    value={customCathodeFormula}
                    onChange={(e) => setCustomCathodeFormula(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:border-cyan-500 focus:outline-none"
                    placeholder="Cu²⁺/Cu"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Désignation Espèce</label>
                  <input
                    type="text"
                    value={customCathodeName}
                    onChange={(e) => setCustomCathodeName(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:border-cyan-500 focus:outline-none"
                    placeholder="Cuivre métal"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">E° standard (V)</label>
                  <input
                    type="number"
                    step="0.001"
                    value={customCathodeE0}
                    onChange={(e) => setCustomCathodeE0(parseFloat(e.target.value) || 0)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-cyan-500/50 text-white font-mono text-xs focus:border-cyan-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Électrons n</label>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    value={customCathodeN}
                    onChange={(e) => setCustomCathodeN(parseInt(e.target.value, 10) || 1)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Paramètres des Demi-Piles & Équation de Nernst */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Colonne Anode */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 backdrop-blur-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">
                Demi-Pile Anodique (Oxydation)
              </span>
              <span className="text-xs font-mono text-slate-300">
                E° = {anodeCouple.e0} V
              </span>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Couple Redox Anodique :
              </label>
              <select
                value={anodeCoupleId}
                onChange={(e) => setAnodeCoupleId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-semibold focus:border-rose-500 focus:outline-none"
              >
                {REDOX_COUPLES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.formula} (E° = {c.e0 > 0 ? `+${c.e0}` : c.e0} V) · {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Slider Concentration Anode */}
            <div className="space-y-1.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">Concentration Anodique [Red] :</span>
                <span className="font-mono text-rose-400 font-bold text-sm">
                  {cAnode.toFixed(3)} mol/L
                </span>
              </div>
              <input
                type="range"
                min="0.005"
                max="2.0"
                step="0.005"
                value={cAnode}
                onChange={(e) => setCAnode(parseFloat(e.target.value))}
                className="w-full accent-rose-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Colonne Cathode */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 backdrop-blur-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                Demi-Pile Cathodique (Réduction)
              </span>
              <span className="text-xs font-mono text-slate-300">
                E° = {cathodeCouple.e0} V
              </span>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Couple Redox Cathodique :
              </label>
              <select
                value={cathodeCoupleId}
                onChange={(e) => setCathodeCoupleId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-semibold focus:border-cyan-500 focus:outline-none"
              >
                {REDOX_COUPLES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.formula} (E° = {c.e0 > 0 ? `+${c.e0}` : c.e0} V) · {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Slider Concentration Cathode */}
            <div className="space-y-1.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">Concentration Cathodique [Ox] :</span>
                <span className="font-mono text-cyan-400 font-bold text-sm">
                  {cCathode.toFixed(3)} mol/L
                </span>
              </div>
              <input
                type="range"
                min="0.005"
                max="2.0"
                step="0.005"
                value={cCathode}
                onChange={(e) => setCCathode(parseFloat(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bilan Thermodynamique & Nernst Récapitulatif */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Formulation Mathématique & Thermodynamique Nernstienne
          </span>
          <span className="text-xs font-mono text-violet-300">
            ΔG° = -n · F · E°_cell
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-slate-400 text-[10px] font-sans">Différence standard E°cell</div>
            <div className="text-base font-bold text-white mt-1">
              {electroAnalysis.e0Cell > 0 ? `+${electroAnalysis.e0Cell}` : electroAnalysis.e0Cell} V
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">E°(Cathode) - E°(Anode)</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-slate-400 text-[10px] font-sans">Quotient Réactionnel Q</div>
            <div className="text-base font-bold text-violet-300 mt-1">
              {electroAnalysis.qRatio}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">[Anode] / [Cathode]</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-slate-400 text-[10px] font-sans">Énergie Libre Standard ΔG°</div>
            <div
              className={`text-base font-bold mt-1 ${
                electroAnalysis.deltaG0_kJ < 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {electroAnalysis.deltaG0_kJ} kJ/mol
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              {electroAnalysis.deltaG0_kJ < 0 ? 'Exergonique (Générateur)' : 'Endergonique (Électrolyse)'}
            </div>
          </div>
        </div>
      </div>

      {/* Modal d'Exportation de Compte-Rendu de TP */}
      <TPReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        title="Compte-Rendu de Travaux Pratiques : Électrochimie & Nernst"
        moduleName="Piles Galvaniques & Potentiels Redox"
        academicLevel="Licence 3 · Master 1"
        reportContent={generatedReport}
      />
    </div>
  );
}
