import { useState, useMemo } from 'react';
import {
  Layers,
  RotateCcw,
  Sparkles,
  Thermometer,
  Clock,
  Users,
  FlaskConical,
  Eye,
  FileText,
  Activity,
  CheckCircle2,
  GraduationCap,
} from 'lucide-react';
import { BIOLOGY_MODULES } from './biologyData';
import BiologyTPExportModal from './BiologyTPExportModal';

const MITOSIS_PHASES = [
  {
    id: 'interphase',
    name: 'Interphase (G1, S, G2)',
    short: 'Interphase',
    baseShare: 0.90,
    color: '#64748b',
    border: 'border-slate-500',
    bg: 'bg-slate-800/40',
    textColor: 'text-slate-300',
    description: 'Phase de repos mitotique, duplication de l\'ADN (phase S) et synthèse protéique active.',
    morphology: 'Noyau intact avec chromatine diffuse et nucléole bien visible.',
  },
  {
    id: 'prophase',
    name: 'Prophase',
    short: 'Prophase',
    baseShare: 0.04,
    color: '#818cf8',
    border: 'border-indigo-500',
    bg: 'bg-indigo-950/40',
    textColor: 'text-indigo-300',
    description: 'Condensation de la chromatine en chromosomes individualisés à deux chromatides et disparition du nucléole.',
    morphology: 'Chromosomes visibles, début de formation du fuseau mitotique.',
  },
  {
    id: 'metaphase',
    name: 'Métaphase',
    short: 'Métaphase',
    baseShare: 0.03,
    color: '#a855f7',
    border: 'border-purple-500',
    bg: 'bg-purple-950/40',
    textColor: 'text-purple-300',
    description: 'Alignement précis des centromères des chromosomes sur le plan équatorial cellulaire.',
    morphology: 'Plaque équatoriale alignée, fibres kinétochoriennes sous tension.',
  },
  {
    id: 'anaphase',
    name: 'Anaphase',
    short: 'Anaphase',
    baseShare: 0.015,
    color: '#ec4899',
    border: 'border-pink-500',
    bg: 'bg-pink-950/40',
    textColor: 'text-pink-300',
    description: 'Clivage des centromères et migration polaire synchrone des chromatides sœurs tractées par les microtubules.',
    morphology: 'Séparation en deux lots symétriques de chromosomes fils.',
  },
  {
    id: 'telophase',
    name: 'Télophase & Cytodiérèse',
    short: 'Télophase',
    baseShare: 0.015,
    color: '#10b981',
    border: 'border-emerald-500',
    bg: 'bg-emerald-950/40',
    textColor: 'text-emerald-300',
    description: 'Décondensation des chromosomes, reformation de l\'enveloppe nucléaire et division physique du cytoplasme.',
    morphology: 'Sillon de division / anneau contractile d\'actomyosine visible.',
  },
];

export default function CellMitosisModule({ onNavigateToExam }) {
  const moduleData = BIOLOGY_MODULES.find((m) => m.id === 'cell_mitosis');

  // Paramètres personnalisables en champs libres
  const [initialPopulation, setInitialPopulation] = useState(1200); // cellules observées
  const [cultureTime, setCultureTime] = useState(24); // heures
  const [temperature, setTemperature] = useState(37); // °C
  const [substrateConcentration, setSubstrateConcentration] = useState(25); // facteurs trophiques ng/mL
  const [colchicineDose, setColchicineDose] = useState(0); // µg/mL (bloqueur métaphasique)
  const [selectedPhaseId, setSelectedPhaseId] = useState('metaphase');
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Calculs dynamiques de régulation mitotique
  const simulation = useMemo(() => {
    // Facteur d'activité selon température (optimal à 37°C)
    const tempFactor = Math.max(0.2, 1 - Math.abs(temperature - 37) * 0.045);
    // Effet stimulant du substrat/facteurs de croissance
    const growthFactor = Math.min(1.6, 0.8 + (substrateConcentration / 50) * 0.5);

    // Effet de la colchicine : bloque les cellules en métaphase en empêchant l'anaphase
    const colchicineEffect = Math.min(0.40, (colchicineDose / 10) * 0.35);

    // Répartition recalculée
    const adjustedShares = {
      interphase: Math.max(0.45, 0.90 - colchicineEffect * 0.7),
      prophase: 0.04 * tempFactor * growthFactor,
      metaphase: 0.03 + colchicineEffect, // accumulation massive si colchicine > 0
      anaphase: Math.max(0.001, 0.015 * (1 - colchicineEffect * 2.2)),
      telophase: Math.max(0.001, 0.015 * (1 - colchicineEffect * 2.2)),
    };

    // Normalisation de la somme des parts
    const totalShare = Object.values(adjustedShares).reduce((a, b) => a + b, 0);
    const normalized = {};
    Object.keys(adjustedShares).forEach((k) => {
      normalized[k] = adjustedShares[k] / totalShare;
    });

    // Effectifs cellulaires par phase
    const counts = {};
    let totalMitotic = 0;
    MITOSIS_PHASES.forEach((p) => {
      const cnt = Math.round(initialPopulation * normalized[p.id]);
      counts[p.id] = cnt;
      if (p.id !== 'interphase') {
        totalMitotic += cnt;
      }
    });

    // Index Mitotique (%) : IM = (N_mitose / N_total) * 100
    const mitoticIndex = (totalMitotic / initialPopulation) * 100;

    // Durée théorique du cycle cellulaire (heures) et des sous-phases (minutes)
    const cycleDurationHours = Math.max(10, 24 / (tempFactor * growthFactor));
    const phaseDurationsMin = {};
    MITOSIS_PHASES.forEach((p) => {
      phaseDurationsMin[p.id] = Math.round(normalized[p.id] * cycleDurationHours * 60);
    });

    const totalW = 300;
    const widths = MITOSIS_PHASES.map((p) => Math.max(8, normalized[p.id] * totalW));
    const phaseSegments = MITOSIS_PHASES.map((p, idx) => {
      const x = 10 + widths.slice(0, idx).reduce((sum, val) => sum + val, 0);
      return { ...p, x, w: widths[idx] };
    });

    return {
      normalized,
      counts,
      totalMitotic,
      mitoticIndex,
      cycleDurationHours,
      phaseDurationsMin,
      phaseSegments,
    };
  }, [initialPopulation, temperature, substrateConcentration, colchicineDose]);

  const selectedPhase = MITOSIS_PHASES.find((p) => p.id === selectedPhaseId) || MITOSIS_PHASES[0];

  const currentParams = {
    initialPopulation,
    cultureTime,
    temperature,
    substrateConcentration,
    colchicineDose,
  };

  const experimentalResults = {
    'Index Mitotique (IM)': {
      value: simulation.mitoticIndex.toFixed(2),
      unit: '%',
      comment: simulation.mitoticIndex > 15 ? 'Hyperprolifération ou blocage métaphasique' : 'Prolifération physiologique normale',
    },
    'Cellules en Mitose Active': {
      value: simulation.totalMitotic,
      unit: 'cellules',
      comment: `Sur un échantillon total de ${initialPopulation} cellules`,
    },
    'Durée Totale du Cycle (Tc)': {
      value: simulation.cycleDurationHours.toFixed(1),
      unit: 'heures',
      comment: `À T = ${temperature}°C et [S] = ${substrateConcentration} ng/mL`,
    },
    'Cellules en Métaphase': {
      value: simulation.counts.metaphase,
      unit: 'cellules',
      comment: colchicineDose > 0 ? `Effet colchicine actif (${colchicineDose} µg/mL)` : 'Répartition normale',
    },
  };

  const handleReset = () => {
    setInitialPopulation(1200);
    setCultureTime(24);
    setTemperature(37);
    setSubstrateConcentration(25);
    setColchicineDose(0);
  };

  const applyPreset = (preset) => {
    if (preset.initialPopulation) setInitialPopulation(preset.initialPopulation);
    if (preset.cultureTime) setCultureTime(preset.cultureTime);
    if (preset.temperature) setTemperature(preset.temperature);
    if (preset.colchicineDose !== undefined) setColchicineDose(preset.colchicineDose);
  };

  return (
    <div className="space-y-6 text-left">
      {/* En-tête du module */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
              {moduleData?.code || 'BIO101'} · FONDAMENTAUX (L1-L2)
            </span>
            <span className="text-xs text-slate-400 font-mono">Banc d'Essai de Cytologie</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <Layers className="text-emerald-400" size={24} />
            <span>Biologie Cellulaire & Dynamique de Mitose</span>
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Dénombrement cellulaire sous microscope virtuel, calcul de l'Index Mitotique (IM), estimation des durées de phases et étude du blocage métaphasique par la colchicine.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          <button
            type="button"
            onClick={handleReset}
            className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors cursor-pointer"
            title="Réinitialiser les paramètres"
          >
            <RotateCcw size={16} />
          </button>

          <button
            type="button"
            onClick={() => onNavigateToExam && onNavigateToExam('Biologie Cellulaire & Mitose')}
            className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-emerald-400 hover:text-emerald-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
            title="S'entraîner aux examens et TD sur ce thème"
          >
            <GraduationCap size={15} />
            <span>Mode Examen & TD</span>
          </button>

          <button
            type="button"
            onClick={() => setIsExportOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-lg shadow-emerald-900/30 cursor-pointer"
          >
            <FileText size={15} />
            <span>Exporter Rapport TP (PDF A4)</span>
          </button>
        </div>
      </div>

      {/* Presets rapides de TP */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-mono font-bold text-slate-400 flex items-center gap-1.5 mr-1">
          <Sparkles size={14} className="text-emerald-400" />
          <span>Protocoles Types :</span>
        </span>
        {moduleData?.presets?.map((p, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => applyPreset(p)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/40 text-[11px] text-slate-300 transition-colors font-medium"
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* Grille principale : Paramètres à gauche, Visualisation & Microscope à droite */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* PANNEAU DE PERSONNALISATION DES PARAMÈTRES (Champs libres) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FlaskConical size={16} className="text-emerald-400" />
                <span>Paramètres Biologiques & Culture</span>
              </h3>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                Champs Libres
              </span>
            </div>

            {/* 1. Population initiale / Cellules observées */}
            <div className="space-y-1 text-xs">
              <div className="flex justify-between font-bold text-slate-300">
                <label className="flex items-center gap-1.5">
                  <Users size={13} className="text-slate-400" />
                  <span>Population Initiale Observée (N₀) :</span>
                </label>
                <span className="font-mono text-emerald-400">{initialPopulation} cellules</span>
              </div>
              <input
                type="number"
                min="100"
                max="10000"
                step="50"
                value={initialPopulation}
                onChange={(e) => setInitialPopulation(Math.max(50, Number(e.target.value) || 0))}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:border-emerald-500/60 focus:outline-none"
              />
              <p className="text-[10px] text-slate-500">
                Taille de l'échantillon de cellules examinées sous le champ microscopique.
              </p>
            </div>

            {/* 2. Temps de culture (heures) */}
            <div className="space-y-1 text-xs">
              <div className="flex justify-between font-bold text-slate-300">
                <label className="flex items-center gap-1.5">
                  <Clock size={13} className="text-slate-400" />
                  <span>Temps de Culture In Vitro (t) :</span>
                </label>
                <span className="font-mono text-emerald-400">{cultureTime} heures</span>
              </div>
              <input
                type="number"
                min="1"
                max="72"
                step="1"
                value={cultureTime}
                onChange={(e) => setCultureTime(Math.max(1, Number(e.target.value) || 1))}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:border-emerald-500/60 focus:outline-none"
              />
              <p className="text-[10px] text-slate-500">
                Durée d'incubation en boîte de Pétri avant fixation et coloration acéto-carmin.
              </p>
            </div>

            {/* 3. Température de la couveuse (°C) */}
            <div className="space-y-1 text-xs">
              <div className="flex justify-between font-bold text-slate-300">
                <label className="flex items-center gap-1.5">
                  <Thermometer size={13} className="text-slate-400" />
                  <span>Température d'Incubation (T) :</span>
                </label>
                <span className="font-mono text-emerald-400">{temperature} °C</span>
              </div>
              <input
                type="number"
                min="15"
                max="45"
                step="0.5"
                value={temperature}
                onChange={(e) => setTemperature(Number(e.target.value) || 37)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:border-emerald-500/60 focus:outline-none"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>20°C (Hypothermie)</span>
                <span className="text-emerald-400 font-bold">37°C (Optimum)</span>
                <span>42°C (Stress thermique)</span>
              </div>
            </div>

            {/* 4. Facteurs de croissance / Concentration substrat */}
            <div className="space-y-1 text-xs">
              <div className="flex justify-between font-bold text-slate-300">
                <label className="flex items-center gap-1.5">
                  <Sparkles size={13} className="text-slate-400" />
                  <span>Facteurs de Croissance / Sérum ([S]) :</span>
                </label>
                <span className="font-mono text-emerald-400">{substrateConcentration} ng/mL</span>
              </div>
              <input
                type="number"
                min="0"
                max="100"
                step="5"
                value={substrateConcentration}
                onChange={(e) => setSubstrateConcentration(Math.max(0, Number(e.target.value) || 0))}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:border-emerald-500/60 focus:outline-none"
              />
            </div>

            {/* 5. Colchicine (Antimitotique) */}
            <div className="space-y-1 text-xs pt-1 border-t border-slate-800">
              <div className="flex justify-between font-bold text-slate-300">
                <label className="flex items-center gap-1.5">
                  <Activity size={13} className="text-purple-400" />
                  <span>Inhibiteur du Fuseau (Colchicine) :</span>
                </label>
                <span className="font-mono text-purple-400">{colchicineDose} µg/mL</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                step="0.5"
                value={colchicineDose}
                onChange={(e) => setColchicineDose(Number(e.target.value))}
                className="w-full accent-purple-500 cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 block">
                {colchicineDose > 0
                  ? `Bloque la polymérisation des microtubules. Les cellules s'accumulent en plaque métaphasique.`
                  : 'Aucun traitement antimitotique (progression anaphasique fluide).'}
              </span>
            </div>
          </div>

          {/* Indicateurs Clés de l'Index Mitotique */}
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
              Synthèse Quantitative
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 block">Index Mitotique (IM)</span>
                <span className="text-2xl font-black font-mono text-emerald-400">
                  {simulation.mitoticIndex.toFixed(2)} %
                </span>
                <span className="text-[9px] text-slate-500 block">
                  ({simulation.totalMitotic} / {initialPopulation})
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 block">Durée Totale Cycle</span>
                <span className="text-2xl font-black font-mono text-indigo-400">
                  {simulation.cycleDurationHours.toFixed(1)} h
                </span>
                <span className="text-[9px] text-slate-500 block">Tc à {temperature}°C</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 space-y-1">
              <div className="font-bold text-slate-400 flex items-center gap-1.5 text-[11px]">
                <CheckCircle2 size={13} className="text-emerald-400" />
                <span>Interprétation Cytologique :</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {simulation.mitoticIndex < 5
                  ? 'Tissu quiescent ou sénescent à faible taux de division.'
                  : simulation.mitoticIndex > 15
                  ? 'Tissu à haute prolifération active (ex: méristème apical, tissu embryonnaire ou tumeur).'
                  : 'Prolifération homéostatique normale de cellules épithéliales.'}
              </p>
            </div>
          </div>
        </div>

        {/* VISUALISATION DES PHASES & MICROSCOPE VIRTUEL */}
        <div className="lg:col-span-7 space-y-4">
          {/* Microscope Virtuel et Sélection de Phase */}
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Eye size={16} className="text-emerald-400" />
                  <span>Microscope Virtuel : Répartition des Phases Mitotiques</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Cliquez sur une phase pour inspecter la morphologie chromosomique et les effectifs.
                </p>
              </div>

              <span className="px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-emerald-300">
                Grossissement ×400
              </span>
            </div>

            {/* Sélecteur visuel de phase en pastilles */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {MITOSIS_PHASES.map((phase) => {
                const isSelected = selectedPhaseId === phase.id;
                const count = simulation.counts[phase.id];
                const pct = (simulation.normalized[phase.id] * 100).toFixed(1);

                return (
                  <button
                    key={phase.id}
                    type="button"
                    onClick={() => setSelectedPhaseId(phase.id)}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      isSelected
                        ? `${phase.bg} ${phase.border} ring-2 ring-emerald-500/30 shadow-lg`
                        : 'bg-slate-950 border-slate-800/80 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-[10px] font-bold block truncate">{phase.short}</span>
                    <span className="text-base font-black font-mono text-white block mt-0.5">{count}</span>
                    <span className={`text-[10px] font-mono font-bold block ${phase.textColor}`}>{pct}%</span>
                  </button>
                );
              })}
            </div>

            {/* Représentation graphique SVG du Cycle Cellulaire */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center">
              <span className="text-[11px] font-mono text-slate-400 self-start mb-2">
                Spectre Circulaire du Cycle Cellulaire (G1 ➔ S ➔ G2 ➔ Mitose M)
              </span>

              <div className="w-full max-w-md h-36 flex items-center justify-center">
                <svg viewBox="0 0 320 120" className="w-full h-full">
                  {/* Barre cumulative des proportions */}
                  {simulation.phaseSegments.map((p) => (
                    <g key={p.id}>
                      <rect
                        x={p.x}
                        y={35}
                        width={p.w}
                        height={30}
                        fill={p.color}
                        opacity={selectedPhaseId === p.id ? 1 : 0.75}
                        rx={4}
                        className="cursor-pointer transition-all hover:opacity-100"
                        onClick={() => setSelectedPhaseId(p.id)}
                      />
                      <text
                        x={p.x + p.w / 2}
                        y={80}
                        textAnchor="middle"
                        fill="#94a3b8"
                        fontSize="9"
                        fontFamily="monospace"
                      >
                        {p.w > 25 ? p.short.slice(0, 4) : ''}
                      </text>
                    </g>
                  ))}
                  <text x="160" y="22" textAnchor="middle" fill="#cbd5e1" fontSize="10" fontWeight="bold">
                    Proportion Temporelle Relative des Phases
                  </text>
                </svg>
              </div>
            </div>

            {/* Fiche d'inspection de la phase sélectionnée */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: selectedPhase.color }}
                  />
                  <h4 className="text-sm font-bold text-white">{selectedPhase.name}</h4>
                </div>
                <span className="text-xs font-mono text-slate-400">
                  Durée estimée : ~{simulation.phaseDurationsMin[selectedPhase.id]} minutes
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-500 font-mono block">
                    Événements Cellulaires :
                  </span>
                  <p className="text-slate-300 leading-relaxed text-[11px]">{selectedPhase.description}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-500 font-mono block">
                    Aspect Microscopique :
                  </span>
                  <p className="text-slate-400 leading-relaxed text-[11px]">{selectedPhase.morphology}</p>
                </div>
              </div>
            </div>
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
