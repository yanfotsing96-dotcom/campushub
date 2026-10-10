import { useState } from 'react';
import {
  Dna,
  Layers,
  Sparkles,
  BookOpen,
  Activity,
} from 'lucide-react';
import BiologyPlayground from './BiologyPlayground';

const CELL_ORGANELLES = [
  { id: 'noyau', name: 'Noyau & Nucléole', role: 'Contient l\'information génétique sous forme de chromatine (ADN) et pilote l\'expression génique.', presence: 'Animale & Végétale', icon: '🧬' },
  { id: 'mito', name: 'Mitochondrie', role: 'Centrale énergétique cellulaire. Siège de la respiration cellulaire, du cycle de Krebs et de la phosphorylation oxydative (synthèse d\'ATP).', presence: 'Animale & Végétale', icon: '⚡' },
  { id: 'chloro', name: 'Chloroplaste', role: 'Organite de la photosynthèse contenant les thylakoïdes et la chlorophylle. Conversion de l\'énergie lumineuse en glucides.', presence: 'Végétale uniquement', icon: '🌿' },
  { id: 're', name: 'Réticulum Endoplasmique (RER & REL)', role: 'RER (rugueux avec ribosomes) : synthèse et repliement des protéines. REL : synthèse des lipides et détoxification.', presence: 'Animale & Végétale', icon: '🕸️' },
  { id: 'golgi', name: 'Appareil de Golgi', role: 'Maturation, glycosylation et tri des protéines en provenance du réticulum avant sécrétion vésiculaire.', presence: 'Animale & Végétale', icon: '📦' },
  { id: 'paroi', name: 'Paroi Pecto-cellulosique', role: 'Structure rigide externe conférant turgescence, soutien mécanique et protection contre les chocs osmotiques.', presence: 'Végétale uniquement', icon: '🛡️' },
];

export default function BiologyLab() {
  const [activeTab, setActiveTab] = useState('playground'); // 'playground' | 'punnett' | 'atlas' | 'microscopy'
  const [selectedOrganelle, setSelectedOrganelle] = useState(CELL_ORGANELLES[0]);

  // Punnett Cross: Parent 1 (ex: Aa) x Parent 2 (ex: Aa)
  const [p1Allele1, setP1Allele1] = useState('A');
  const [p1Allele2, setP1Allele2] = useState('a');
  const [p2Allele1, setP2Allele1] = useState('A');
  const [p2Allele2, setP2Allele2] = useState('a');

  // Calcul 2x2 Punnett
  const formatGenotype = (a1, a2) => {
    const sorted = [a1, a2].sort((a) => (a === a.toUpperCase() ? -1 : 1));
    return sorted.join('');
  };

  const g11 = formatGenotype(p1Allele1, p2Allele1);
  const g12 = formatGenotype(p1Allele1, p2Allele2);
  const g21 = formatGenotype(p1Allele2, p2Allele1);
  const g22 = formatGenotype(p1Allele2, p2Allele2);

  const punnettCounts = {};
  [g11, g12, g21, g22].forEach((g) => {
    punnettCounts[g] = (punnettCounts[g] || 0) + 1;
  });

  return (
    <div className="space-y-6 text-left">
      {/* Barre de navigation des modes */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex p-1 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-bold flex-wrap gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('playground')}
            className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'playground'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-950/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Dna size={14} />
            <span>BiologyLab Hub (L1 ➔ Master 2)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('punnett')}
            className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'punnett'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Activity size={14} />
            <span>Échiquier de Croisement (Mendel)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('atlas')}
            className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'atlas'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers size={14} />
            <span>Atlas Cellulaire Interactif</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('microscopy')}
            className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'microscopy'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen size={14} />
            <span>Coloration de Gram</span>
          </button>
        </div>

        <div className="text-xs text-emerald-300 font-mono flex items-center gap-1.5">
          <Sparkles size={13} className="text-emerald-400" />
          <span>BIO101 ➔ BIO501 · Faculté des Sciences</span>
        </div>
      </div>

      {/* 0. BiologyLab Hub Principal */}
      {activeTab === 'playground' && (
        <div className="animate-in fade-in duration-200">
          <BiologyPlayground />
        </div>
      )}

      {/* 1. Échiquier de Mendel */}
      {activeTab === 'punnett' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white">Génotypes Parentaux</h3>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="font-bold text-emerald-300 block">Parent 1 (Allèles) :</span>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={p1Allele1}
                    onChange={(e) => setP1Allele1(e.target.value)}
                    className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono font-bold"
                  >
                    <option value="A">A (Dominant)</option>
                    <option value="a">a (Récessif)</option>
                  </select>
                  <select
                    value={p1Allele2}
                    onChange={(e) => setP1Allele2(e.target.value)}
                    className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono font-bold"
                  >
                    <option value="A">A (Dominant)</option>
                    <option value="a">a (Récessif)</option>
                  </select>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="font-bold text-emerald-300 block">Parent 2 (Allèles) :</span>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={p2Allele1}
                    onChange={(e) => setP2Allele1(e.target.value)}
                    className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono font-bold"
                  >
                    <option value="A">A (Dominant)</option>
                    <option value="a">a (Récessif)</option>
                  </select>
                  <select
                    value={p2Allele2}
                    onChange={(e) => setP2Allele2(e.target.value)}
                    className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono font-bold"
                  >
                    <option value="A">A (Dominant)</option>
                    <option value="a">a (Récessif)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white">Échiquier de Punnett (Génération F1)</h3>

            <div className="overflow-x-auto">
              <table className="w-full text-center border-collapse font-mono text-sm">
                <thead>
                  <tr>
                    <th className="p-2 text-slate-500 font-sans text-xs">P1 \ P2</th>
                    <th className="p-3 bg-slate-950 text-emerald-300 border border-slate-800">{p2Allele1}</th>
                    <th className="p-3 bg-slate-950 text-emerald-300 border border-slate-800">{p2Allele2}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th className="p-3 bg-slate-950 text-emerald-300 border border-slate-800">{p1Allele1}</th>
                    <td className="p-4 bg-slate-900 border border-slate-800 font-bold text-white text-base">
                      {g11}
                    </td>
                    <td className="p-4 bg-slate-900 border border-slate-800 font-bold text-white text-base">
                      {g12}
                    </td>
                  </tr>
                  <tr>
                    <th className="p-3 bg-slate-950 text-emerald-300 border border-slate-800">{p1Allele2}</th>
                    <td className="p-4 bg-slate-900 border border-slate-800 font-bold text-white text-base">
                      {g21}
                    </td>
                    <td className="p-4 bg-slate-900 border border-slate-800 font-bold text-white text-base">
                      {g22}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs pt-2">
              {Object.entries(punnettCounts).map(([genotype, count]) => (
                <div key={genotype} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                  <span className="font-mono font-bold text-emerald-400 block">{genotype}</span>
                  <span className="text-white font-bold">{((count / 4) * 100).toFixed(0)}%</span>
                  <span className="text-[10px] text-slate-500 block">({count}/4)</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. Atlas Cellulaire */}
      {activeTab === 'atlas' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers size={18} className="text-emerald-400" />
              <span>Organites Cellulaires Majeurs</span>
            </h3>

            <div className="space-y-2">
              {CELL_ORGANELLES.map((org) => (
                <button
                  key={org.id}
                  type="button"
                  onClick={() => setSelectedOrganelle(org)}
                  className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                    selectedOrganelle.id === org.id
                      ? 'bg-emerald-950/60 border-emerald-400 text-white shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">{org.icon}</span>
                    <span className="font-bold text-xs">{org.name}</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-semibold">
                    {org.presence}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{selectedOrganelle.icon}</span>
              <div>
                <h4 className="text-lg font-black text-white">{selectedOrganelle.name}</h4>
                <span className="text-xs text-emerald-400 font-semibold">{selectedOrganelle.presence}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed space-y-2">
              <span className="font-bold text-slate-400 block uppercase tracking-wider text-[10px]">
                Fonction Biologique Principale :
              </span>
              <p>{selectedOrganelle.role}</p>
            </div>
          </div>
        </div>
      )}

      {/* 3. Coloration de Gram */}
      {activeTab === 'microscopy' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Gram Positif (Violet)
            </span>
            <h4 className="text-sm font-bold text-white">Paroi Épaisse de Peptidoglycane</h4>
            <p className="text-slate-400 leading-relaxed">
              Exemples : Staphylococcus aureus, Bacillus subtilis. Le complexe violet de gentiane-Lugol est piégé dans le réseau serré de muréine et résiste à la décoloration par l'alcool 95°.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-pink-500/20 text-pink-300 border border-pink-500/30">
              Gram Négatif (Rose)
            </span>
            <h4 className="text-sm font-bold text-white">Membrane Externe Lipidique (LPS)</h4>
            <p className="text-slate-400 leading-relaxed">
              Exemples : Escherichia coli, Salmonella enterica. L'alcool dissout la membrane externe, décolorant la bactérie qui est recolorée en rose par la fuchsine de Ziehl ou la safranine.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
