import { useState, useMemo } from 'react';
import {
  FlaskConical,
  Calculator,
  Shield,
  Search,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Atom,
} from 'lucide-react';
import ChemistryPlayground from './ChemistryPlayground';

const PERIODIC_ELEMENTS = [
  { z: 1, s: 'H', n: 'Hydrogène', m: 1.008, cat: 'Non-métal', en: 2.20, config: '1s¹', period: 1, group: 1 },
  { z: 2, s: 'He', n: 'Hélium', m: 4.003, cat: 'Gaz noble', en: null, config: '1s²', period: 1, group: 18 },
  { z: 3, s: 'Li', n: 'Lithium', m: 6.94, cat: 'Métal alcalin', en: 0.98, config: '[He] 2s¹', period: 2, group: 1 },
  { z: 4, s: 'Be', n: 'Béryllium', m: 9.012, cat: 'Alcalino-terreux', en: 1.57, config: '[He] 2s²', period: 2, group: 2 },
  { z: 5, s: 'B', n: 'Bore', m: 10.81, cat: 'Métalloïde', en: 2.04, config: '[He] 2s² 2p¹', period: 2, group: 13 },
  { z: 6, s: 'C', n: 'Carbone', m: 12.011, cat: 'Non-métal', en: 2.55, config: '[He] 2s² 2p²', period: 2, group: 14 },
  { z: 7, s: 'N', n: 'Azote', m: 14.007, cat: 'Non-métal', en: 3.04, config: '[He] 2s² 2p³', period: 2, group: 15 },
  { z: 8, s: 'O', n: 'Oxygène', m: 15.999, cat: 'Non-métal', en: 3.44, config: '[He] 2s² 2p⁴', period: 2, group: 16 },
  { z: 9, s: 'F', n: 'Fluor', m: 18.998, cat: 'Halogène', en: 3.98, config: '[He] 2s² 2p⁵', period: 2, group: 17 },
  { z: 10, s: 'Ne', n: 'Néon', m: 20.180, cat: 'Gaz noble', en: null, config: '[He] 2s² 2p⁶', period: 2, group: 18 },
  { z: 11, s: 'Na', n: 'Sodium', m: 22.990, cat: 'Métal alcalin', en: 0.93, config: '[Ne] 3s¹', period: 3, group: 1 },
  { z: 12, s: 'Mg', n: 'Magnésium', m: 24.305, cat: 'Alcalino-terreux', en: 1.31, config: '[Ne] 3s²', period: 3, group: 2 },
  { z: 13, s: 'Al', n: 'Aluminium', m: 26.982, cat: 'Métal pauvre', en: 1.61, config: '[Ne] 3s² 3p¹', period: 3, group: 13 },
  { z: 14, s: 'Si', n: 'Silicium', m: 28.085, cat: 'Métalloïde', en: 1.90, config: '[Ne] 3s² 3p²', period: 3, group: 14 },
  { z: 15, s: 'P', n: 'Phosphore', m: 30.974, cat: 'Non-métal', en: 2.19, config: '[Ne] 3s² 3p³', period: 3, group: 15 },
  { z: 16, s: 'S', n: 'Soufre', m: 32.06, cat: 'Non-métal', en: 2.58, config: '[Ne] 3s² 3p⁴', period: 3, group: 16 },
  { z: 17, s: 'Cl', n: 'Chlore', m: 35.45, cat: 'Halogène', en: 3.16, config: '[Ne] 3s² 3p⁵', period: 3, group: 17 },
  { z: 18, s: 'Ar', n: 'Argon', m: 39.95, cat: 'Gaz noble', en: null, config: '[Ne] 3s² 3p⁶', period: 3, group: 18 },
  { z: 19, s: 'K', n: 'Potassium', m: 39.098, cat: 'Métal alcalin', en: 0.82, config: '[Ar] 4s¹', period: 4, group: 1 },
  { z: 20, s: 'Ca', n: 'Calcium', m: 40.078, cat: 'Alcalino-terreux', en: 1.00, config: '[Ar] 4s²', period: 4, group: 2 },
  { z: 26, s: 'Fe', n: 'Fer', m: 55.845, cat: 'Métal de transition', en: 1.83, config: '[Ar] 3d⁶ 4s²', period: 4, group: 8 },
  { z: 29, s: 'Cu', n: 'Cuivre', m: 63.546, cat: 'Métal de transition', en: 1.90, config: '[Ar] 3d¹⁰ 4s¹', period: 4, group: 11 },
  { z: 30, s: 'Zn', n: 'Zinc', m: 65.38, cat: 'Métal de transition', en: 1.65, config: '[Ar] 3d¹⁰ 4s²', period: 4, group: 12 },
  { z: 47, s: 'Ag', n: 'Argent', m: 107.87, cat: 'Métal de transition', en: 1.93, config: '[Kr] 4d¹⁰ 5s¹', period: 5, group: 11 },
  { z: 79, s: 'Au', n: 'Or', m: 196.97, cat: 'Métal de transition', en: 2.54, config: '[Xe] 4f¹⁴ 5d¹⁰ 6s¹', period: 6, group: 11 },
];

export default function ChemistryLab() {
  const [activeTab, setActiveTab] = useState('playground'); // 'playground' | 'table' | 'molarity' | 'ph' | 'safety'
  const [searchElem, setSearchElem] = useState('');
  const [selectedElem, setSelectedElem] = useState(PERIODIC_ELEMENTS[5]); // Carbone default

  // Molarity State: m = C * V * M
  const [concentration, setConcentration] = useState(0.1); // mol/L
  const [volume, setVolume] = useState(250); // mL
  const [molarMass, setMolarMass] = useState(58.44); // NaCl default g/mol

  // pH State
  const [acidType, setAcidType] = useState('strongAcid'); // 'strongAcid' | 'strongBase' | 'weakAcid' | 'buffer'
  const [acidConcentration, setAcidConcentration] = useState(0.01); // mol/L
  const [pKa, setPKa] = useState(4.75); // Acide acétique
  const [ratioBaseAcid, setRatioBaseAcid] = useState(1.0); // [A-]/[HA]

  // Calculated Molarity mass: m = C * (V / 1000) * M
  const requiredMassGrams = concentration * (volume / 1000) * molarMass;

  // Calculated pH
  const computedPH = useMemo(() => {
    if (acidType === 'strongAcid') {
      return Math.max(0, -Math.log10(Math.max(1e-7, acidConcentration)));
    }
    if (acidType === 'strongBase') {
      return Math.min(14, 14 + Math.log10(Math.max(1e-7, acidConcentration)));
    }
    if (acidType === 'weakAcid') {
      // Formule approchée : pH = 0.5 * (pKa - log C)
      return Math.min(7, Math.max(1, 0.5 * (pKa - Math.log10(Math.max(1e-6, acidConcentration)))));
    }
    if (acidType === 'buffer') {
      // Henderson-Hasselbalch : pH = pKa + log([A-]/[HA])
      return Math.min(14, Math.max(0, pKa + Math.log10(Math.max(0.01, ratioBaseAcid))));
    }
    return 7;
  }, [acidType, acidConcentration, pKa, ratioBaseAcid]);

  const filteredElements = useMemo(() => {
    if (!searchElem.trim()) return PERIODIC_ELEMENTS;
    const q = searchElem.toLowerCase();
    return PERIODIC_ELEMENTS.filter(
      (e) => e.n.toLowerCase().includes(q) || e.s.toLowerCase().includes(q) || e.cat.toLowerCase().includes(q)
    );
  }, [searchElem]);

  return (
    <div className="space-y-6 text-left">
      {/* Top Header Tabs */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex p-1 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-bold flex-wrap gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('playground')}
            className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'playground'
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-900/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Atom size={14} />
            <span>Playground Modulaire (L1 ➔ Master 2)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('table')}
            className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'table'
                ? 'bg-teal-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FlaskConical size={14} />
            <span>Tableau Périodique Mendeleïev</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('safety')}
            className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'safety'
                ? 'bg-teal-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Shield size={14} />
            <span>Sécurité & Fiches SGH</span>
          </button>
        </div>

        <div className="text-xs text-indigo-300 font-mono flex items-center gap-1.5">
          <Sparkles size={13} className="text-violet-400" />
          <span>CHM101 ➔ CHM501 · Pôle Sciences Chimiques</span>
        </div>
      </div>

      {/* 0. Chemistry Playground Tab (Primary Experience) */}
      {activeTab === 'playground' && (
        <div className="animate-in fade-in duration-200">
          <ChemistryPlayground />
        </div>
      )}

      {/* 1. Periodic Table Tab */}
      {activeTab === 'table' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <FlaskConical size={18} className="text-teal-400" />
                  <span>Tableau Périodique des Éléments (Mendeleïev)</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Cliquez sur un élément pour inspecter sa configuration électronique et sa masse atomique.
                </p>
              </div>

              <div className="relative w-full sm:w-56">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Rechercher (ex: Fe, Carbone)..."
                  value={searchElem}
                  onChange={(e) => setSearchElem(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder:text-slate-500"
                />
              </div>
            </div>

            {/* Elements Grid */}
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
              {filteredElements.map((elem) => (
                <button
                  key={elem.z}
                  type="button"
                  onClick={() => setSelectedElem(elem)}
                  className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer ${
                    selectedElem.z === elem.z
                      ? 'bg-teal-950/80 border-teal-400 text-white shadow-lg shadow-teal-500/20 scale-105'
                      : 'bg-slate-950 border-slate-800/80 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="text-[10px] text-slate-500 font-mono">{elem.z}</div>
                  <div className="text-base font-black text-teal-300 font-mono">{elem.s}</div>
                  <div className="text-[10px] text-slate-400 truncate">{elem.n}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Element Inspector */}
          <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold text-teal-400 font-mono">
                Numéro Atomique Z = {selectedElem.z}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                {selectedElem.cat}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-teal-500/20 border border-teal-500/40 flex flex-col items-center justify-center text-teal-300">
                <span className="text-2xl font-black font-mono">{selectedElem.s}</span>
                <span className="text-[10px]">{selectedElem.m}</span>
              </div>
              <div>
                <h4 className="text-lg font-black text-white">{selectedElem.n}</h4>
                <p className="text-xs text-slate-400">Période {selectedElem.period} · Groupe {selectedElem.group}</p>
              </div>
            </div>

            <div className="space-y-2 text-xs pt-2">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between">
                <span className="text-slate-400">Masse atomique :</span>
                <span className="font-mono font-bold text-white">{selectedElem.m} g/mol</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between">
                <span className="text-slate-400">Électronégativité (Pauling) :</span>
                <span className="font-mono font-bold text-amber-400">{selectedElem.en ?? 'N/A'}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between">
                <span className="text-slate-400">Configuration électronique :</span>
                <span className="font-mono font-bold text-emerald-400">{selectedElem.config}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setMolarMass(selectedElem.m);
                setActiveTab('molarity');
              }}
              className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition-colors cursor-pointer"
            >
              Injecter dans le calculateur de molarité
            </button>
          </div>
        </div>
      )}

      {/* 2. Molarity Calculator */}
      {activeTab === 'molarity' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Calculator size={18} className="text-teal-400" />
              <span>Préparation de Solution : Calcul de Masse de Soluté</span>
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <div className="flex justify-between font-bold text-slate-300 mb-1">
                  <span>Concentration molaire souhaitée C (mol/L) :</span>
                  <span className="text-teal-400 font-mono">{concentration} mol/L</span>
                </div>
                <input
                  type="number"
                  step="0.01"
                  min="0.001"
                  value={concentration}
                  onChange={(e) => setConcentration(Math.max(0.001, Number(e.target.value)))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold text-slate-300 mb-1">
                  <span>Volume de fiole jaugée V (mL) :</span>
                  <span className="text-teal-400 font-mono">{volume} mL ({(volume / 1000).toFixed(3)} L)</span>
                </div>
                <select
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                >
                  <option value={50}>50 mL (Petite fiole)</option>
                  <option value={100}>100 mL</option>
                  <option value={200}>200 mL</option>
                  <option value={250}>250 mL (Standard TP)</option>
                  <option value={500}>500 mL</option>
                  <option value={1000}>1000 mL (1 Litre)</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between font-bold text-slate-300 mb-1">
                  <span>Masse molaire du réactif M (g/mol) :</span>
                  <span className="text-teal-400 font-mono">{molarMass} g/mol</span>
                </div>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  value={molarMass}
                  onChange={(e) => setMolarMass(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white">Résultat de Pesée Analytique</h3>

            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-2">
              <span className="text-slate-400 text-xs block">Masse de soluté à peser à la balance :</span>
              <div className="text-4xl font-black text-teal-400 font-mono">
                {requiredMassGrams.toFixed(4)} g
              </div>
              <span className="text-xs text-slate-500 font-mono block">
                Formule : m = C × V × M = {concentration} × {(volume / 1000).toFixed(3)} × {molarMass}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-teal-950/30 border border-teal-500/30 text-teal-300 text-xs leading-relaxed">
              <strong>Protocole de laboratoire :</strong> Peser exactement <strong>{requiredMassGrams.toFixed(4)} g</strong> dans une coupelle de pesée, introduire dans la fiole de {volume} mL avec un entonnoir, rincer à l'eau distillée, agiter jusqu'à dissolution complète puis ajuster au trait de jauge.
            </div>
          </div>
        </div>
      )}

      {/* 3. pH & Buffer Solutions */}
      {activeTab === 'ph' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white">Paramètres Acido-Basiques</h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Type de solution aqueuse :</label>
                <select
                  value={acidType}
                  onChange={(e) => setAcidType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                >
                  <option value="strongAcid">Acide Fort (ex: HCl 0.01M)</option>
                  <option value="strongBase">Base Forte (ex: NaOH 0.01M)</option>
                  <option value="weakAcid">Acide Faible (ex: CH3COOH)</option>
                  <option value="buffer">Solution Tampon (Henderson-Hasselbalch)</option>
                </select>
              </div>

              {acidType !== 'buffer' && (
                <div>
                  <div className="flex justify-between font-bold text-slate-300 mb-1">
                    <span>Concentration C (mol/L) :</span>
                    <span className="text-teal-400 font-mono">{acidConcentration} M</span>
                  </div>
                  <input
                    type="range"
                    min="0.0001"
                    max="1"
                    step="0.001"
                    value={acidConcentration}
                    onChange={(e) => setAcidConcentration(Number(e.target.value))}
                    className="w-full accent-teal-500 cursor-pointer"
                  />
                </div>
              )}

              {acidType === 'weakAcid' && (
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Constante pKa :</label>
                  <input
                    type="number"
                    step="0.1"
                    value={pKa}
                    onChange={(e) => setPKa(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                  />
                </div>
              )}

              {acidType === 'buffer' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">pKa du couple tampon :</label>
                    <input
                      type="number"
                      step="0.05"
                      value={pKa}
                      onChange={(e) => setPKa(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between font-bold text-slate-300 mb-1">
                      <span>Rapport [Base conjuguée] / [Acide] :</span>
                      <span className="text-teal-400 font-mono">{ratioBaseAcid.toFixed(2)}</span>
                    </div>
                    <input
                      type="range"
                      min="0.1"
                      max="10"
                      step="0.1"
                      value={ratioBaseAcid}
                      onChange={(e) => setRatioBaseAcid(Number(e.target.value))}
                      className="w-full accent-teal-500 cursor-pointer"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white">pH Théorique Calculé</h3>
            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-2">
              <span className="text-slate-400 text-xs block">Valeur du pH à 25°C :</span>
              <div className={`text-5xl font-black font-mono ${
                computedPH < 7 ? 'text-rose-400' : computedPH > 7 ? 'text-sky-400' : 'text-emerald-400'
              }`}>
                {computedPH.toFixed(2)}
              </div>
              <span className="text-xs text-slate-400 font-semibold block">
                Milieu {computedPH < 7 ? 'Acide' : computedPH > 7 ? 'Basique' : 'Neutre'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 4. Safety & GHS */}
      {activeTab === 'safety' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
              <AlertTriangle size={20} />
            </div>
            <h4 className="text-sm font-bold text-white">Corrosif & Acides Concentrés (SGH05)</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Toujours verser l'acide dans l'eau et JAMAIS l'inverse pour éviter une projection thermique violente. Manipulation sous hotte ventilée avec gants nitrile.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <Shield size={20} />
            </div>
            <h4 className="text-sm font-bold text-white">Inflammabilité & Solvants Organiques (SGH02)</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Tenir à l'écart de toute flamme ou plaque chauffante nue. Éther diéthylique et acétone doivent être stockés dans l'armoire ventilée ignifuge.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <CheckCircle2 size={20} />
            </div>
            <h4 className="text-sm font-bold text-white">Gestion des Effluents de TP</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Ne rien jeter à l'évier. Bidons de récupération dédiés : Déchets halogénés, Solvants non-halogénés et Solutions de métaux lourds (Fe, Cu, Zn).
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
