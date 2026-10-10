import { useState, useMemo } from 'react';
import {
  Dna,
  RotateCcw,
  Sparkles,
  Thermometer,
  Clock,
  FlaskConical,
  FileText,
  AlertCircle,
  Scissors,
  GraduationCap,
} from 'lucide-react';
import { BIOLOGY_MODULES, GENETIC_CODE_MAPPING } from './biologyData';
import BiologyTPExportModal from './BiologyTPExportModal';

export default function MolecularGeneticsModule({ onNavigateToExam }) {
  const moduleData = BIOLOGY_MODULES.find((m) => m.id === 'molecular_genetics');

  // Paramètres personnalisables en champs libres
  const [dnaInput, setDnaInput] = useState('TACAAAGCTCCCGAAACT'); // Brin matrice 3' -> 5'
  const [cultureTime, setCultureTime] = useState(15); // min (durée d'incubation)
  const [temperature, setTemperature] = useState(37); // °C
  const [initialPopulation, setInitialPopulation] = useState(100); // copies de matrice d'ADN
  const [substrateConcentration, setSubstrateConcentration] = useState(2.5); // µM de dNTPs / ARN Pol
  const [mutationType, setMutationType] = useState('none'); // 'none' | 'silent' | 'missense' | 'nonsense' | 'frameshift'
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Séquence d'ADN manipulée selon la mutation injectée
  const mutatedDna = useMemo(() => {
    const raw = dnaInput.toUpperCase().replace(/[^ATCG]/g, '');
    if (mutationType === 'none') return raw;

    if (mutationType === 'silent') {
      // Modifie le 3ème nucléotide d'un codon sans changer l'acide aminé (ex: GAA -> GAG)
      if (raw.length >= 15) {
        return raw.slice(0, 14) + (raw[14] === 'A' ? 'G' : 'A') + raw.slice(15);
      }
      return raw;
    }

    if (mutationType === 'missense') {
      // Mutation faux-sens (change un AA, ex: drépanocytose CTC -> CAC)
      if (raw.length >= 8) {
        return raw.slice(0, 6) + 'T' + raw.slice(7);
      }
      return raw;
    }

    if (mutationType === 'nonsense') {
      // Mutation non-sens (génère un codon stop prématuré, ex: TAA/TAG/TGA dans ARNm -> ATT/ATC/ACT dans ADN)
      if (raw.length >= 9) {
        return raw.slice(0, 6) + 'ATC' + raw.slice(9);
      }
      return raw;
    }

    if (mutationType === 'frameshift') {
      // Décalage du cadre de lecture par insertion d'un nucléotide
      if (raw.length >= 4) {
        return raw.slice(0, 4) + 'G' + raw.slice(4);
      }
      return raw;
    }

    return raw;
  }, [dnaInput, mutationType]);

  // Brin codant (5' -> 3') : Watson-Crick complémentaire
  const codingDna = useMemo(() => {
    return mutatedDna
      .split('')
      .map((b) => {
        if (b === 'A') return 'T';
        if (b === 'T') return 'A';
        if (b === 'C') return 'G';
        if (b === 'G') return 'C';
        return '';
      })
      .join('');
  }, [mutatedDna]);

  // Transcription enzymatique par l'ARN Polymérase II (3' -> 5' ADN ➔ 5' -> 3' ARNm)
  const mrna = useMemo(() => {
    return mutatedDna
      .split('')
      .map((b) => {
        if (b === 'A') return 'U';
        if (b === 'T') return 'A';
        if (b === 'C') return 'G';
        if (b === 'G') return 'C';
        return '';
      })
      .join('');
  }, [mutatedDna]);

  // Traduction ribosomique en chaîne peptidique (Codons ➔ Acides Aminés)
  const translation = useMemo(() => {
    const peptide = [];
    let stopEncountered = false;

    for (let i = 0; i < mrna.length; i += 3) {
      if (i + 3 <= mrna.length) {
        const codon = mrna.slice(i, i + 3);
        const mapped = GENETIC_CODE_MAPPING[codon] || { aa: '???', name: 'Inconnu', type: 'unknown' };
        peptide.push({ codon, ...mapped, isStop: mapped.type === 'stop' });
        if (mapped.type === 'stop') {
          stopEncountered = true;
          break;
        }
      }
    }

    // Rendement de transcription estimé selon T et dNTPs
    const tempFactor = Math.max(0.1, 1 - Math.abs(temperature - 37) * 0.05);
    const yieldMolecules = Math.round(initialPopulation * substrateConcentration * tempFactor * (cultureTime / 5) * 120);

    return {
      peptide,
      stopEncountered,
      yieldMolecules,
    };
  }, [mrna, temperature, substrateConcentration, initialPopulation, cultureTime]);

  const currentParams = {
    dnaSequence: mutatedDna,
    initialPopulation,
    cultureTime,
    temperature,
    substrateConcentration,
    mutationType,
  };

  const experimentalResults = {
    'ARN Messager Produit': {
      value: mrna || 'N/A',
      unit: '',
      comment: `Taille : ${mrna.length} nucléotides`,
    },
    'Longueur de la Protéine': {
      value: translation.peptide.length,
      unit: 'résidus',
      comment: translation.stopEncountered ? 'Terminaison normale sur codon STOP' : 'Chaîne tronquée ou non stoppée',
    },
    'Molécules d\'ARNm Synthétisées': {
      value: translation.yieldMolecules.toLocaleString(),
      unit: 'transcrits',
      comment: `Pour ${initialPopulation} matrices en ${cultureTime} min`,
    },
    'Type de Mutation': {
      value: mutationType.toUpperCase(),
      unit: '',
      comment: mutationType === 'none' ? 'Gène sauvage conforme' : 'Allèle muté expérimental',
    },
  };

  const handleReset = () => {
    setDnaInput('TACAAAGCTCCCGAAACT');
    setCultureTime(15);
    setTemperature(37);
    setInitialPopulation(100);
    setSubstrateConcentration(2.5);
    setMutationType('none');
  };

  const applyPreset = (preset) => {
    if (preset.dnaSequence) setDnaInput(preset.dnaSequence);
    if (preset.temperature) setTemperature(preset.temperature);
    if (preset.cultureTime) setCultureTime(preset.cultureTime);
    setMutationType('none');
  };

  return (
    <div className="space-y-6 text-left">
      {/* En-tête du module */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-violet-500/20 text-violet-300 border border-violet-500/30 font-mono">
              {moduleData?.code || 'BIO301'} · AVANCÉ (L3-MASTER)
            </span>
            <span className="text-xs text-slate-400 font-mono">Génomique & Synthèse Protéique</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <Dna className="text-violet-400" size={24} />
            <span>Génétique Moléculaire : Transcription & Traduction</span>
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Expression génique in silico : transcription du brin matrice (3' ➔ 5') en ARNm (5' ➔ 3'), décodage ribosomique et analyse prédictive des mutations génétiques.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          <button
            type="button"
            onClick={handleReset}
            className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors cursor-pointer"
            title="Réinitialiser"
          >
            <RotateCcw size={16} />
          </button>

          <button
            type="button"
            onClick={() => onNavigateToExam && onNavigateToExam('Génétique Moléculaire')}
            className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-violet-400 hover:text-violet-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
            title="S'entraîner aux examens et TD de génétique"
          >
            <GraduationCap size={15} />
            <span>Mode Examen & TD</span>
          </button>

          <button
            type="button"
            onClick={() => setIsExportOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-lg shadow-violet-900/30 cursor-pointer"
          >
            <FileText size={15} />
            <span>Exporter Rapport TP (PDF A4)</span>
          </button>
        </div>
      </div>

      {/* Presets de gènes types */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-mono font-bold text-slate-400 flex items-center gap-1.5 mr-1">
          <Sparkles size={14} className="text-violet-400" />
          <span>Séquences Types :</span>
        </span>
        {moduleData?.presets?.map((p, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => applyPreset(p)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-violet-500/40 text-[11px] text-slate-300 transition-colors font-medium"
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* Grille principale : Paramètres à gauche, Décodage moléculaire à droite */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* PARAMÈTRES GÉNOMIKES */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Dna size={16} className="text-violet-400" />
                <span>Brin d'ADN Matrice & Conditions</span>
              </h3>
              <span className="text-[10px] font-mono text-violet-400 bg-violet-950/60 px-2 py-0.5 rounded border border-violet-500/30">
                Champs Libres
              </span>
            </div>

            {/* 1. Séquence d'ADN libre */}
            <div className="space-y-1 text-xs">
              <label className="block text-slate-300 font-bold mb-1">
                Séquence Nucléotidique Matrice (3' ➔ 5') :
              </label>
              <input
                type="text"
                value={dnaInput}
                onChange={(e) => setDnaInput(e.target.value.toUpperCase().replace(/[^ATCG]/g, ''))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-violet-300 font-mono text-xs tracking-widest uppercase font-bold focus:border-violet-500/60 focus:outline-none"
                placeholder="Ex: TACAAAGCTCCCGAAACT"
              />
              <span className="text-[10px] text-slate-500 block">
                Seules les bases A, T, C, G sont autorisées (3 nucléotides = 1 codon).
              </span>
            </div>

            {/* 2. Simulateur de Mutation Ponctuelle */}
            <div className="space-y-1.5 text-xs pt-1 border-t border-slate-800">
              <label className="flex items-center gap-1.5 font-bold text-slate-300">
                <Scissors size={13} className="text-pink-400" />
                <span>Injecter une Mutation Génétique In Silico :</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                {[
                  { id: 'none', label: 'Témoin (Sauvage)' },
                  { id: 'silent', label: 'Silencieuse' },
                  { id: 'missense', label: 'Faux-Sens' },
                  { id: 'nonsense', label: 'Non-Sens (Stop)' },
                  { id: 'frameshift', label: 'Décalage (+1nt)' },
                ].map((mut) => (
                  <button
                    key={mut.id}
                    type="button"
                    onClick={() => setMutationType(mut.id)}
                    className={`py-1.5 px-2 rounded-xl text-[10px] font-bold border transition-colors ${
                      mutationType === mut.id
                        ? 'bg-violet-600 text-white border-violet-500 shadow-md'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {mut.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Température (°C) */}
            <div className="space-y-1 text-xs">
              <div className="flex justify-between font-bold text-slate-300">
                <label className="flex items-center gap-1.5">
                  <Thermometer size={13} className="text-slate-400" />
                  <span>Température de Réaction (T) :</span>
                </label>
                <span className="font-mono text-violet-400">{temperature} °C</span>
              </div>
              <input
                type="number"
                min="20"
                max="50"
                step="1"
                value={temperature}
                onChange={(e) => setTemperature(Number(e.target.value) || 37)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:border-violet-500/60 focus:outline-none"
              />
            </div>

            {/* 4. Concentration en dNTPs / Polymérase & Durée */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <label className="flex items-center gap-1 text-slate-300 font-bold">
                  <FlaskConical size={12} className="text-slate-400" />
                  <span>[ARN Pol II] (µM) :</span>
                </label>
                <input
                  type="number"
                  min="0.1"
                  max="10"
                  step="0.5"
                  value={substrateConcentration}
                  onChange={(e) => setSubstrateConcentration(Math.max(0.1, Number(e.target.value) || 0.1))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs"
                />
              </div>

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
            </div>
          </div>
        </div>

        {/* DÉCODAGE MOLÉCULAIRE : ADN ➔ ARNM ➔ POLYPEPTIDE */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-md space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Sparkles size={16} className="text-violet-400" />
              <span>Cascade d'Expression : Transcription & Traduction</span>
            </h3>

            {/* Étape 1 : Brin d'ADN Matrice & Codant */}
            <div className="space-y-2 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 font-mono font-bold block">
                  ADN Brin Matrice (3' ➔ 5') :
                </span>
                <span className="text-sm font-mono font-black text-pink-400 tracking-widest break-all">
                  3'-{mutatedDna}-5'
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 font-mono font-bold block">
                  ADN Brin Codant Complémentaire (5' ➔ 3') :
                </span>
                <span className="text-sm font-mono font-black text-indigo-300 tracking-widest break-all">
                  5'-{codingDna}-3'
                </span>
              </div>
            </div>

            {/* Étape 2 : ARN Messager (5' -> 3') */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-mono font-bold block">
                  ARN Messager Transcrit (5' ➔ 3') :
                </span>
                <span className="text-[10px] font-mono text-amber-400">
                  Cap-5' ... Poly(A)-3'
                </span>
              </div>
              <span className="text-base font-mono font-black text-amber-400 tracking-widest break-all block py-1">
                {mrna || 'Séquence vide'}
              </span>
            </div>

            {/* Étape 3 : Chaîne Polypeptidique (Protéine) */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-mono font-bold block">
                  Polypeptide Ribosomique (N-terminal ➔ C-terminal) :
                </span>
                <span className="text-[10px] font-mono text-emerald-400">
                  {translation.peptide.length} acides aminés
                </span>
              </div>

              {translation.peptide.length === 0 ? (
                <p className="text-slate-500 italic">Entrez au moins un triplet de nucléotides (codon).</p>
              ) : (
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {translation.peptide.map((c, i) => {
                    let badgeStyle = 'bg-slate-800 border-slate-700 text-slate-300';
                    if (c.type === 'hydrophobic') {
                      badgeStyle = 'bg-indigo-950/70 border-indigo-500 text-indigo-300';
                    } else if (c.type === 'polar') {
                      badgeStyle = 'bg-teal-950/70 border-teal-500 text-teal-300';
                    } else if (c.type === 'basic') {
                      badgeStyle = 'bg-sky-950/70 border-sky-500 text-sky-300';
                    } else if (c.type === 'acidic') {
                      badgeStyle = 'bg-rose-950/70 border-rose-500 text-rose-300';
                    } else if (c.type === 'stop') {
                      badgeStyle = 'bg-red-950/80 border-red-500 text-red-300 ring-2 ring-red-500/30';
                    }

                    return (
                      <div
                        key={i}
                        className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold border flex items-center gap-1.5 ${badgeStyle}`}
                        title={`${c.name} (Codon : ${c.codon})`}
                      >
                        <span className="text-[10px] opacity-60">[{c.codon}]</span>
                        <span>{c.aa}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Note diagnostique sur l'effet de la mutation */}
            {mutationType !== 'none' && (
              <div className="p-3.5 rounded-2xl bg-pink-950/30 border border-pink-500/30 text-xs text-pink-300 flex items-start gap-2">
                <AlertCircle size={16} className="text-pink-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold block">Conséquence Phénotypique de la Mutation :</span>
                  <p className="text-[11px] text-pink-300/80 leading-relaxed">
                    {mutationType === 'silent' && 'Mutation synonyme : aucun changement de la séquence primaire.'}
                    {mutationType === 'missense' && 'Substitution d\'un acide aminé : peut altérer la conformation spatiale de l\'enzyme.'}
                    {mutationType === 'nonsense' && 'Codon STOP prématuré : protéine tronquée non fonctionnelle.'}
                    {mutationType === 'frameshift' && 'Décalage du cadre de lecture : modification de tous les acides aminés en aval.'}
                  </p>
                </div>
              </div>
            )}
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
