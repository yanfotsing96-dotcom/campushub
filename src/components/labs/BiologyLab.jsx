import { useState, useMemo } from 'react';
import {
  Dna,
  Layers,
  Sparkles,
  BookOpen,
  Activity,
} from 'lucide-react';

const CELL_ORGANELLES = [
  { id: 'noyau', name: 'Noyau & Nucléole', role: 'Contient l\'information génétique sous forme de chromatine (ADN) et pilote l\'expression génique.', presence: 'Animale & Végétale', icon: '🧬' },
  { id: 'mito', name: 'Mitochondrie', role: 'Centrale énergétique cellulaire. Siège de la respiration cellulaire, du cycle de Krebs et de la phosphorylation oxydative (synthèse d\'ATP).', presence: 'Animale & Végétale', icon: '⚡' },
  { id: 'chloro', name: 'Chloroplaste', role: 'Organite de la photosynthèse contenant les thylakoïdes et la chlorophylle. Conversion de l\'énergie lumineuse en glucides.', presence: 'Végétale uniquement', icon: '🌿' },
  { id: 're', name: 'Réticulum Endoplasmique (RER & REL)', role: 'RER (rugueux avec ribosomes) : synthèse et repliement des protéines. REL : synthèse des lipides et détoxification.', presence: 'Animale & Végétale', icon: '🕸️' },
  { id: 'golgi', name: 'Appareil de Golgi', role: 'Maturation, glycosylation et tri des protéines en provenance du réticulum avant sécrétion vésiculaire.', presence: 'Animale & Végétale', icon: '📦' },
  { id: 'paroi', name: 'Paroi Pecto-cellulosique', role: 'Structure rigide externe conférant turgescence, soutien mécanique et protection contre les chocs osmotiques.', presence: 'Végétale uniquement', icon: '🛡️' },
];

const GENETIC_CODE_TABLE = {
  AUG: { aa: 'Met (Méthionine - Début)', full: 'Méthionine (Start)' },
  UUU: { aa: 'Phe (Phénylalanine)', full: 'Phénylalanine' },
  UUC: { aa: 'Phe (Phénylalanine)', full: 'Phénylalanine' },
  UUA: { aa: 'Leu (Leucine)', full: 'Leucine' },
  UUG: { aa: 'Leu (Leucine)', full: 'Leucine' },
  CUU: { aa: 'Leu (Leucine)', full: 'Leucine' },
  CCU: { aa: 'Pro (Proline)', full: 'Proline' },
  UAA: { aa: 'STOP', full: 'Codon Stop (Ocre)' },
  UAG: { aa: 'STOP', full: 'Codon Stop (Ambre)' },
  UGA: { aa: 'STOP', full: 'Codon Stop (Opale)' },
  GAA: { aa: 'Glu (Acide glutamique)', full: 'Acide glutamique' },
  GAG: { aa: 'Glu (Acide glutamique)', full: 'Acide glutamique' },
  AAA: { aa: 'Lys (Lysine)', full: 'Lysine' },
  AAG: { aa: 'Lys (Lysine)', full: 'Lysine' },
  GCU: { aa: 'Ala (Alanine)', full: 'Alanine' },
  GCC: { aa: 'Ala (Alanine)', full: 'Alanine' },
  GGU: { aa: 'Gly (Glycine)', full: 'Glycine' },
  GGC: { aa: 'Gly (Glycine)', full: 'Glycine' },
};

export default function BiologyLab() {
  const [activeTab, setActiveTab] = useState('genetics'); // 'genetics' | 'punnett' | 'atlas' | 'microscopy'
  const [dnaInput, setDnaInput] = useState('TACAAAGCTCCCGAAACT');
  const [selectedOrganelle, setSelectedOrganelle] = useState(CELL_ORGANELLES[0]);

  // Punnett Cross: Parent 1 (ex: Aa) x Parent 2 (ex: Aa)
  const [p1Allele1, setP1Allele1] = useState('A');
  const [p1Allele2, setP1Allele2] = useState('a');
  const [p2Allele1, setP2Allele1] = useState('A');
  const [p2Allele2, setP2Allele2] = useState('a');

  // DNA -> mRNA transcription: A->U, T->A, C->G, G->C
  const mrna = useMemo(() => {
    return dnaInput
      .toUpperCase()
      .replace(/\s+/g, '')
      .split('')
      .map((base) => {
        if (base === 'T') return 'A';
        if (base === 'A') return 'U';
        if (base === 'C') return 'G';
        if (base === 'G') return 'C';
        return '';
      })
      .join('');
  }, [dnaInput]);

  // mRNA -> Polypeptide chain
  const codons = useMemo(() => {
    const list = [];
    for (let i = 0; i < mrna.length; i += 3) {
      if (i + 3 <= mrna.length) {
        const codon = mrna.slice(i, i + 3);
        const match = GENETIC_CODE_TABLE[codon] || { aa: 'Acide aminé (' + codon + ')', full: 'AA' };
        list.push({ codon, ...match });
      }
    }
    return list;
  }, [mrna]);

  // Punnett Square 2x2
  const punnettCells = useMemo(() => {
    const formatGenotype = (a1, a2) => {
      const sorted = [a1, a2].sort((a) => (a === a.toUpperCase() ? -1 : 1));
      return sorted.join('');
    };

    const g11 = formatGenotype(p1Allele1, p2Allele1);
    const g12 = formatGenotype(p1Allele1, p2Allele2);
    const g21 = formatGenotype(p1Allele2, p2Allele1);
    const g22 = formatGenotype(p1Allele2, p2Allele2);

    const counts = {};
    [g11, g12, g21, g22].forEach((g) => {
      counts[g] = (counts[g] || 0) + 1;
    });

    return { grid: [[g11, g12], [g21, g22]], counts };
  }, [p1Allele1, p1Allele2, p2Allele1, p2Allele2]);

  return (
    <div className="space-y-6 text-left">
      {/* Header Tabs */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex p-1 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('genetics')}
            className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'genetics'
                ? 'bg-pink-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Dna size={14} />
            <span>Transcription & Traduction ADN</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('punnett')}
            className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'punnett'
                ? 'bg-pink-600 text-white shadow-md'
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
                ? 'bg-pink-600 text-white shadow-md'
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
                ? 'bg-pink-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen size={14} />
            <span>Protocoles Coloration de Gram</span>
          </button>
        </div>

        <div className="text-xs text-pink-300 font-mono flex items-center gap-1.5">
          <Sparkles size={13} className="text-pink-400" />
          <span>BIO101 / BIO201 · Faculté des Sciences UY1</span>
        </div>
      </div>

      {/* 1. Genetics DNA -> RNA -> Peptide */}
      {activeTab === 'genetics' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Dna size={18} className="text-pink-400" />
              <span>Séquence d'ADN Brin Transcrit (3' → 5')</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Saisissez la séquence nucléotidique (A, T, C, G) :
                </label>
                <input
                  type="text"
                  value={dnaInput}
                  onChange={(e) => setDnaInput(e.target.value.toUpperCase().replace(/[^ATCG]/g, ''))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-pink-300 font-mono text-sm tracking-wider uppercase font-bold"
                  placeholder="Ex: TACAAAGCTCCCGAAACT"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setDnaInput('TACAAAGCTCCCGAAACT')}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold"
                >
                  Exemple Début (AUG Start)
                </button>
                <button
                  type="button"
                  onClick={() => setDnaInput('TACCCCGGGTGAATT')}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold"
                >
                  Exemple Muté
                </button>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 space-y-1 font-mono">
                <div>Règle de transcription complémentaire :</div>
                <div>A (Adénine) ➔ U (Uracile)</div>
                <div>T (Thymine) ➔ A (Adénine)</div>
                <div>C (Cytosine) ➔ G (Guanine) / G ➔ C</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white">Résultat Transcription & Traduction</h3>

            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[11px] text-slate-400 block font-bold">ARN Messager (5' → 3') :</span>
                <span className="text-base font-black text-amber-400 font-mono tracking-widest break-all">
                  {mrna || 'Séquence vide'}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-[11px] text-slate-400 block font-bold">Chaîne Polypeptidique (Acides Aminés) :</span>
                {codons.length === 0 ? (
                  <p className="text-slate-500 italic">Saisissez au moins 3 nucléotides (un codon).</p>
                ) : (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {codons.map((c, i) => (
                      <div
                        key={i}
                        className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold border flex items-center gap-1 ${
                          c.aa.includes('Met')
                            ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300'
                            : c.aa.includes('STOP')
                            ? 'bg-rose-950/70 border-rose-500 text-rose-300'
                            : 'bg-indigo-950/70 border-indigo-500/50 text-indigo-300'
                        }`}
                      >
                        <span className="text-[10px] text-slate-400 font-normal">[{c.codon}]</span>
                        <span>{c.aa}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Punnett Square */}
      {activeTab === 'punnett' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white">Génotypes Parentaux</h3>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="font-bold text-pink-300 block">Parent 1 (Allèles) :</span>
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
                <span className="font-bold text-pink-300 block">Parent 2 (Allèles) :</span>
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
                    <th className="p-3 bg-slate-950 text-pink-300 border border-slate-800">{p2Allele1}</th>
                    <th className="p-3 bg-slate-950 text-pink-300 border border-slate-800">{p2Allele2}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th className="p-3 bg-slate-950 text-pink-300 border border-slate-800">{p1Allele1}</th>
                    <td className="p-4 bg-slate-900 border border-slate-800 font-bold text-white text-base">
                      {punnettCells.grid[0][0]}
                    </td>
                    <td className="p-4 bg-slate-900 border border-slate-800 font-bold text-white text-base">
                      {punnettCells.grid[0][1]}
                    </td>
                  </tr>
                  <tr>
                    <th className="p-3 bg-slate-950 text-pink-300 border border-slate-800">{p1Allele2}</th>
                    <td className="p-4 bg-slate-900 border border-slate-800 font-bold text-white text-base">
                      {punnettCells.grid[1][0]}
                    </td>
                    <td className="p-4 bg-slate-900 border border-slate-800 font-bold text-white text-base">
                      {punnettCells.grid[1][1]}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs pt-2">
              {Object.entries(punnettCells.counts).map(([genotype, count]) => (
                <div key={genotype} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                  <span className="font-mono font-bold text-pink-400 block">{genotype}</span>
                  <span className="text-white font-bold">{((count / 4) * 100).toFixed(0)}%</span>
                  <span className="text-[10px] text-slate-500 block">({count}/4)</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. Cellular Atlas */}
      {activeTab === 'atlas' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers size={18} className="text-pink-400" />
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
                      ? 'bg-pink-950/60 border-pink-400 text-white shadow-md'
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
                <span className="text-xs text-pink-400 font-semibold">{selectedOrganelle.presence}</span>
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

      {/* 4. Microscopy & Gram Staining */}
      {activeTab === 'microscopy' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Gram Positif (Violet)
            </span>
            <h4 className="text-sm font-bold text-white">Paroi Épaisse de Peptidoglycane</h4>
            <p className="text-slate-400 leading-relaxed">
              Exemples : Staphylococcus aureus, Bacillus subtilis. Le complexe violet de gentiane-Lugol est piégé dans le réseau serré de muréine et résiste à l'alcool 95°.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-pink-500/20 text-pink-300 border border-pink-500/30">
              Gram Négatif (Rose)
            </span>
            <h4 className="text-sm font-bold text-white">Membrane Externe Lipidique (LPS)</h4>
            <p className="text-slate-400 leading-relaxed">
              Exemples : Escherichia coli, Salmonella enterica. L'alcool dissout la membrane externe, décolorant la bactérie qui est recolorée en rose par la fuchsine de Ziehl.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
