import { useState, useMemo, useCallback } from 'react';
import {
  School,
  Hash,
  CheckCircle2,
  BookOpen,
  GraduationCap,
  Copy,
  Check,
  Zap,
  Eye,
  Sigma,
  Sparkles,
  Download,
  Info,
  Layers,
  Award,
  Activity,
  Sliders,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import { LAB_02_FILIERES, LAB_02_METADATA } from '../../../data/labs/lab02Data';
import type { AcademicLevel } from '../../../types/lab01';
import type { IFiliereL02, IRLCExperimentData, IOpticsExperimentData } from '../../../types/lab02';
import KaTeXMath from '../../common/KaTeXMath';
import PhysicsReportModal from './PhysicsReportModal';

export default function PhysicsLabWorkspace() {
  // 1. Sélection institutionnelle (14 filières officielles)
  const [selectedFiliereId, setSelectedFiliereId] = useState<string>(LAB_02_FILIERES[0].id);
  const [academicLevel, setAcademicLevel] = useState<AcademicLevel>('L1');
  const [copiedRef, setCopiedRef] = useState<boolean>(false);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);

  // Étudiant & validation
  const [studentName, setStudentName] = useState<string>('Kamga Estelle');
  const [studentMatricule, setStudentMatricule] = useState<string>('24P0318-UY1');
  const [tpNotes, setTpNotes] = useState<string>(
    "Observation : En augmentant la fréquence du générateur, l'amplitude du courant passe par un maximum net à la fréquence de résonance f₀ ≈ 503.29 Hz avec déphasage nul. En optique, la position de l'image concorde avec la formule de conjugaison de Descartes."
  );
  const [completedSkills, setCompletedSkills] = useState<Record<string, boolean>>({
    skill_resonance: true,
    skill_quality: true,
    skill_descartes: true,
    skill_uncertainty: false,
  });

  // Onglet central
  const [activeCenterTab, setActiveCenterTab] = useState<'rlc' | 'optics' | 'katex'>('rlc');

  // Moteur 1 : Paramètres Circuit RLC Série
  const [resR, setResR] = useState<number>(50); // Ohms
  const [indL, setIndL] = useState<number>(100); // mH
  const [capC, setCapC] = useState<number>(1); // microFarads
  const [freqF, setFreqF] = useState<number>(503); // Hz (près de f0)
  const [genVoltage, setGenVoltage] = useState<number>(10); // Volts crête

  // Moteur 2 : Paramètres Optique Géométrique
  const [lensType, setLensType] = useState<'converging' | 'diverging'>('converging');
  const [focalLength, setFocalLength] = useState<number>(10); // cm
  const [objectDistance, setObjectDistance] = useState<number>(-25); // cm (OA < 0)
  const [objectHeight, setObjectHeight] = useState<number>(4); // cm (AB)

  // Moteur 3 : KaTeX Custom Playground
  const [customLatex, setCustomLatex] = useState<string>(
    'f_0 = \\frac{1}{2\\pi\\sqrt{L C}}, \\quad Q = \\frac{1}{R}\\sqrt{\\frac{L}{C}}'
  );

  // Filière active
  const currentFiliere: IFiliereL02 = useMemo(() => {
    return (LAB_02_FILIERES.find((f) => f.id === selectedFiliereId) || LAB_02_FILIERES[0]) as unknown as IFiliereL02;
  }, [selectedFiliereId]);

  // ─── CALCULS CIRCUITS RLC ──────────────────────────────────────────────────
  const rlcCalculations: IRLCExperimentData = useMemo(() => {
    const lHenry = indL * 1e-3;
    const cFarad = capC * 1e-6;

    // f0 = 1 / (2*pi*sqrt(L*C))
    const f0 = 1 / (2 * Math.PI * Math.sqrt(lHenry * cFarad));
    const omega0 = 2 * Math.PI * f0;
    const qualityFactor = (1 / resR) * Math.sqrt(lHenry / cFarad);
    const bandwidth = f0 / Math.max(0.01, qualityFactor);

    // Impédance à la fréquence f : Z = sqrt(R^2 + (L*omega - 1/(C*omega))^2)
    const omega = 2 * Math.PI * Math.max(1, freqF);
    const reactanceL = lHenry * omega;
    const reactanceC = 1 / (cFarad * omega);
    const totalReactance = reactanceL - reactanceC;
    const impedance = Math.sqrt(resR * resR + totalReactance * totalReactance);

    // Déphasage phi = atan(X / R)
    const phaseRad = Math.atan2(totalReactance, resR);
    const phaseDeg = (phaseRad * 180) / Math.PI;

    // Courant max I_max = U_max / Z
    const currentMax = genVoltage / impedance;

    return {
      resistance: resR,
      inductance: indL,
      capacitance: capC,
      frequency: freqF,
      voltageGenerator: genVoltage,
      resonanceFrequency: f0,
      qualityFactor,
      bandwidth,
      impedance,
      phaseDeg,
      currentMax,
    };
  }, [resR, indL, capC, freqF, genVoltage]);

  // Presets RLC
  const applyRlcPreset = (type: 'resonance' | 'inductive' | 'capacitive' | 'damped') => {
    switch (type) {
      case 'resonance':
        setFreqF(Math.round(rlcCalculations.resonanceFrequency));
        break;
      case 'inductive':
        setFreqF(Math.round(rlcCalculations.resonanceFrequency * 1.6));
        break;
      case 'capacitive':
        setFreqF(Math.round(rlcCalculations.resonanceFrequency * 0.6));
        break;
      case 'damped':
        setResR(250);
        break;
    }
  };

  // ─── CALCULS OPTIQUE GÉOMÉTRIQUE ──────────────────────────────────────────
  const opticsCalculations: IOpticsExperimentData = useMemo(() => {
    const fPrime = lensType === 'converging' ? Math.abs(focalLength) : -Math.abs(focalLength);
    const p = objectDistance; // < 0

    // Formule de Descartes : 1/p' - 1/p = 1/f' => 1/p' = 1/f' + 1/p = (p + f') / (p * f')
    // p' = (p * f') / (p + f')
    const denominator = p + fPrime;
    let pPrime: number;
    let nature: 'REAL_INVERTED' | 'VIRTUAL_UPRIGHT' | 'AT_INFINITY';

    if (Math.abs(denominator) < 1e-4) {
      pPrime = 9999;
      nature = 'AT_INFINITY';
    } else {
      pPrime = (p * fPrime) / denominator;
      nature = pPrime > 0 ? 'REAL_INVERTED' : 'VIRTUAL_UPRIGHT';
    }

    // Grandissement gamma = p' / p
    const gamma = Math.abs(p) > 1e-3 ? pPrime / p : 1;
    const hPrime = gamma * objectHeight;

    return {
      lensType,
      focalLength: Math.abs(focalLength),
      objectDistance: p,
      objectHeight,
      imageDistance: pPrime,
      magnification: gamma,
      imageHeight: hPrime,
      imageNature: nature,
    };
  }, [lensType, focalLength, objectDistance, objectHeight]);

  // Formes d'ondes SVG RLC (u(t) et i(t))
  const rlcWavePoints = useMemo(() => {
    const ptsU: { x: number; y: number }[] = [];
    const ptsI: { x: number; y: number }[] = [];
    const samples = 100;
    const phiRad = (rlcCalculations.phaseDeg * Math.PI) / 180;

    for (let i = 0; i <= samples; i++) {
      const t = (i / samples) * 2 * Math.PI * 2; // 2 périodes
      const u = Math.sin(t);
      const iNorm = Math.sin(t - phiRad) * (rlcCalculations.currentMax / (genVoltage / resR));

      ptsU.push({ x: (i / samples) * 380 + 10, y: 75 - u * 45 });
      ptsI.push({ x: (i / samples) * 380 + 10, y: 75 - iNorm * 45 });
    }
    return { ptsU, ptsI };
  }, [rlcCalculations, genVoltage, resR]);

  const pathU = useMemo(() => {
    return rlcWavePoints.ptsU.reduce((acc, pt, idx) => {
      return idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
    }, '');
  }, [rlcWavePoints]);

  const pathI = useMemo(() => {
    return rlcWavePoints.ptsI.reduce((acc, pt, idx) => {
      return idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
    }, '');
  }, [rlcWavePoints]);

  const handleCopyRef = () => {
    const text = `Lab L02 - ${currentFiliere.sigleUniversite} (${currentFiliere.faculte}), Page ${currentFiliere.pageDossier} du dossier officiel MINESUP CampusHub.`;
    navigator.clipboard?.writeText(text);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  const toggleSkill = (key: string) => {
    setCompletedSkills((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const isAtResonance = Math.abs(freqF - rlcCalculations.resonanceFrequency) < rlcCalculations.resonanceFrequency * 0.03;

  return (
    <div className="space-y-6 text-left">
      {/* ─── EN-TÊTE DU WORKSPACE L02 ────────────────────────────────────────── */}
      <div className="rounded-3xl bg-[#EFECE6] border border-[#E3DEC9] p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-[#0284C7] text-white uppercase tracking-wider">
                {LAB_02_METADATA.code} · ESPACE DE TRAVAIL OFFICIEL
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#E3DEC9] text-[#5C4033] border border-[#D5CEA3]">
                Sciences Fondamentales
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-black bg-sky-100 text-sky-900 border border-sky-200 flex items-center gap-1">
                <Hash size={12} className="text-sky-800" />
                Page {currentFiliere.pageDossier} MINESUP
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-[#2C2218] tracking-tight">
              PhysicsLab Workspace · {currentFiliere.sigleUniversite}
            </h2>
            <p className="text-xs sm:text-sm text-[#6E5D4F]">
              Banc d'expérimentation virtuelle en électrocinétique, optique ondulatoire et géométrique, et validation expérimentale
            </p>
          </div>

          {/* Niveau & Bouton Exportation */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <div className="inline-flex p-1 rounded-2xl bg-[#F7F5F0] border border-[#E3DEC9] text-xs font-bold">
              {(['L1', 'L2', 'L3', 'M1', 'M2', 'DIPES_I', 'DIPES_II'] as AcademicLevel[]).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setAcademicLevel(lvl)}
                  className={`px-2.5 py-1 rounded-xl transition-all ${
                    academicLevel === lvl
                      ? 'bg-[#0284C7] text-white shadow-xs'
                      : 'text-[#6E5D4F] hover:text-[#2C2218]'
                  }`}
                >
                  {lvl.replace('_', ' ')}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setShowReportModal(true)}
              className="px-4 py-2 rounded-2xl bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
            >
              <Download size={14} />
              <span>Générer Rapport PDF Certifié</span>
            </button>
          </div>
        </div>
      </div>

      {/* ─── ARCHITECTURE EN 3 PANNEAUX ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* ════════════════════════════════════════════════════════════════════
            PANNEAU GAUCHE (3 cols) : RÉFÉRENTIEL MINESUP & OBJECTIFS TP
        ════════════════════════════════════════════════════════════════════ */}
        <div className="lg:col-span-3 space-y-4">
          <div className="rounded-3xl bg-[#F7F5F0] border border-[#E3DEC9] p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#E3DEC9]/70 pb-3">
              <span className="text-xs font-black text-[#0284C7] uppercase tracking-wider flex items-center gap-1.5">
                <School size={14} />
                Filière & Syllabus MINESUP
              </span>
              <button
                type="button"
                onClick={handleCopyRef}
                title="Copier référence officielle"
                className="p-1 rounded-lg text-[#8C7355] hover:text-[#0284C7] hover:bg-white transition-colors"
              >
                {copiedRef ? <Check size={13} className="text-emerald-700" /> : <Copy size={13} />}
              </button>
            </div>

            {/* Menu des 14 institutions certifiées (Pages 2 et 3) */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#8C7355] uppercase tracking-wider">
                Établissement (14 répertoriés)
              </label>
              <select
                value={selectedFiliereId}
                onChange={(e) => setSelectedFiliereId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#E3DEC9] text-xs font-bold text-[#2C2218] focus:outline-hidden focus:ring-2 focus:ring-[#0284C7]/20"
              >
                {LAB_02_FILIERES.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.sigleUniversite} • {f.faculteSigle} (p. {f.pageDossier})
                  </option>
                ))}
              </select>
            </div>

            {/* Fiche synthétique */}
            <div className="p-3.5 rounded-2xl bg-[#EFECE6] border border-[#E3DEC9] space-y-2 text-xs">
              <div className="font-black text-[#2C2218] leading-snug">
                {currentFiliere.universite}
              </div>
              <div className="text-[11px] font-bold text-[#0284C7]">
                {currentFiliere.faculte}
              </div>
              <div className="text-[11px] text-[#6E5D4F]">
                Campus : {currentFiliere.ville} ({currentFiliere.region})
              </div>
              <div className="pt-2 border-t border-[#E3DEC9]/70 flex items-center justify-between text-[11px]">
                <span className="text-[#8C7355] font-semibold">Folio MINESUP :</span>
                <span className="px-2 py-0.5 rounded-md bg-sky-100 text-sky-900 font-black border border-sky-200">
                  Page {currentFiliere.pageDossier}
                </span>
              </div>
            </div>

            {/* Codes UE du Syllabus */}
            <div className="space-y-2 text-xs">
              <div className="text-[11px] font-bold text-[#8C7355] uppercase tracking-wider flex items-center gap-1">
                <BookOpen size={12} className="text-[#0284C7]" />
                Unités d'Enseignement & Modules
              </div>
              <div className="flex flex-wrap gap-1.5">
                {['PHY101', 'PHY201', 'ELEC204', 'OPT202'].map((ue) => (
                  <span
                    key={ue}
                    className="px-2.5 py-1 rounded-lg bg-white border border-[#E3DEC9] font-mono text-[11px] font-bold text-[#0284C7]"
                  >
                    {ue}
                  </span>
                ))}
              </div>
            </div>

            {/* Compétences de laboratoire */}
            <div className="space-y-2.5 pt-2 border-t border-[#E3DEC9]/70">
              <div className="text-[11px] font-bold text-[#8C7355] uppercase tracking-wider flex items-center gap-1">
                <GraduationCap size={13} className="text-[#0284C7]" />
                Compétences Pratiques Visées
              </div>

              <div className="space-y-2">
                {[
                  { id: 'skill_resonance', label: "Détection du pic de résonance RLC & déphasage nul" },
                  { id: 'skill_quality', label: "Calcul du facteur de surtension Q et bande passante" },
                  { id: 'skill_descartes', label: "Vérification des relations de conjugaison de Descartes" },
                  { id: 'skill_uncertainty', label: "Évaluation des incertitudes de mesure expérimentale" },
                ].map((sk) => (
                  <button
                    key={sk.id}
                    type="button"
                    onClick={() => toggleSkill(sk.id)}
                    className="w-full text-left p-2 rounded-xl bg-white border border-[#E3DEC9] hover:border-[#0284C7]/40 transition-all flex items-start gap-2 text-xs"
                  >
                    <div
                      className={`w-4 h-4 rounded-md mt-0.5 flex items-center justify-center shrink-0 border transition-all ${
                        completedSkills[sk.id]
                          ? 'bg-[#0284C7] border-[#0284C7] text-white'
                          : 'border-[#E3DEC9] bg-[#F7F5F0]'
                      }`}
                    >
                      {completedSkills[sk.id] && <Check size={11} strokeWidth={3} />}
                    </div>
                    <span
                      className={`leading-tight ${
                        completedSkills[sk.id] ? 'text-[#2C2218] font-bold' : 'text-[#6E5D4F]'
                      }`}
                    >
                      {sk.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════════
            PANNEAU CENTRAL (6 cols) : BANC DE SIMULATION INTERACTIF
        ════════════════════════════════════════════════════════════════════ */}
        <div className="lg:col-span-6 space-y-4">
          <div className="rounded-3xl bg-[#F7F5F0] border border-[#E3DEC9] p-5 sm:p-6 space-y-5 shadow-xs">
            {/* Onglets du banc d'essai */}
            <div className="flex items-center justify-between border-b border-[#E3DEC9]/70 pb-3">
              <div className="inline-flex p-1 rounded-2xl bg-[#EFECE6] border border-[#E3DEC9] text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setActiveCenterTab('rlc')}
                  className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                    activeCenterTab === 'rlc'
                      ? 'bg-[#0284C7] text-white shadow-xs'
                      : 'text-[#6E5D4F] hover:text-[#2C2218]'
                  }`}
                >
                  <Zap size={13} />
                  <span>Circuit RLC & Résonance</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveCenterTab('optics')}
                  className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                    activeCenterTab === 'optics'
                      ? 'bg-[#0284C7] text-white shadow-xs'
                      : 'text-[#6E5D4F] hover:text-[#2C2218]'
                  }`}
                >
                  <Eye size={13} />
                  <span>Optique & Lentilles</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveCenterTab('katex')}
                  className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                    activeCenterTab === 'katex'
                      ? 'bg-[#0284C7] text-white shadow-xs'
                      : 'text-[#6E5D4F] hover:text-[#2C2218]'
                  }`}
                >
                  <Sigma size={13} />
                  <span>Formules Physiques</span>
                </button>
              </div>

              <span className="text-[11px] font-bold text-[#0284C7] flex items-center gap-1">
                <Activity size={13} />
                Banc d'Essai
              </span>
            </div>

            {/* ─── 1. SIMULATEUR CIRCUIT RLC ──────────────────────────────── */}
            {activeCenterTab === 'rlc' && (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-sm font-black text-[#2C2218] flex items-center gap-1.5">
                    <Zap size={16} className="text-[#0284C7]" />
                    Circuit RLC Série en Régime Sinusoïdal Forcé
                  </h3>

                  {/* Presets rapides */}
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <span className="text-[#8C7355] font-semibold">Presets :</span>
                    <button
                      type="button"
                      onClick={() => applyRlcPreset('resonance')}
                      className="px-2 py-0.5 rounded-lg bg-emerald-100 text-emerald-900 border border-emerald-200 font-bold hover:bg-emerald-200"
                    >
                      Résonance f₀
                    </button>
                    <button
                      type="button"
                      onClick={() => applyRlcPreset('capacitive')}
                      className="px-2 py-0.5 rounded-lg bg-white border border-[#E3DEC9] font-bold hover:bg-[#EFECE6]"
                    >
                      Capacitif
                    </button>
                    <button
                      type="button"
                      onClick={() => applyRlcPreset('inductive')}
                      className="px-2 py-0.5 rounded-lg bg-white border border-[#E3DEC9] font-bold hover:bg-[#EFECE6]"
                    >
                      Inductif
                    </button>
                  </div>
                </div>

                {/* Oscillogramme SVG en temps réel */}
                <div className="p-3 rounded-2xl bg-slate-900 text-white border border-[#E3DEC9] shadow-inner space-y-2">
                  <div className="flex items-center justify-between text-[11px] px-1 font-mono">
                    <span className="text-amber-400 font-bold">── Tension u(t) (Générateur)</span>
                    <span className="text-cyan-400 font-bold">── Courant i(t) × R (Déphasé de φ={rlcCalculations.phaseDeg.toFixed(1)}°)</span>
                  </div>

                  <svg viewBox="0 0 400 150" className="w-full h-36 select-none bg-slate-950/80 rounded-xl">
                    {/* Grille oscillateur */}
                    <line x1="0" y1="75" x2="400" y2="75" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
                    <line x1="200" y1="0" x2="200" y2="150" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />

                    {/* Courbe u(t) */}
                    <path d={pathU} fill="none" stroke="#FBBF24" strokeWidth="2.5" />

                    {/* Courbe i(t) */}
                    <path d={pathI} fill="none" stroke="#38BDF8" strokeWidth="2.5" />
                  </svg>
                </div>

                {/* Sliders de réglages des composants */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-2xl bg-[#EFECE6] border border-[#E3DEC9] space-y-1">
                    <div className="flex justify-between">
                      <span className="font-bold text-[#8C7355]">Résistance R</span>
                      <span className="font-mono font-bold text-[#2C2218]">{resR} Ω</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="200"
                      step="5"
                      value={resR}
                      onChange={(e) => setResR(parseFloat(e.target.value))}
                      className="w-full accent-[#0284C7]"
                    />
                  </div>

                  <div className="p-3 rounded-2xl bg-[#EFECE6] border border-[#E3DEC9] space-y-1">
                    <div className="flex justify-between">
                      <span className="font-bold text-[#8C7355]">Inductance L</span>
                      <span className="font-mono font-bold text-[#2C2218]">{indL} mH</span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="500"
                      step="10"
                      value={indL}
                      onChange={(e) => setIndL(parseFloat(e.target.value))}
                      className="w-full accent-[#0284C7]"
                    />
                  </div>

                  <div className="p-3 rounded-2xl bg-[#EFECE6] border border-[#E3DEC9] space-y-1">
                    <div className="flex justify-between">
                      <span className="font-bold text-[#8C7355]">Capacité C</span>
                      <span className="font-mono font-bold text-[#2C2218]">{capC} µF</span>
                    </div>
                    <input
                      type="range"
                      min="0.1"
                      max="10"
                      step="0.1"
                      value={capC}
                      onChange={(e) => setCapC(parseFloat(e.target.value))}
                      className="w-full accent-[#0284C7]"
                    />
                  </div>

                  <div className="p-3 rounded-2xl bg-[#EFECE6] border border-[#E3DEC9] space-y-1">
                    <div className="flex justify-between">
                      <span className="font-bold text-[#8C7355]">Fréquence f</span>
                      <span className="font-mono font-bold text-[#0284C7]">{freqF} Hz</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="1500"
                      step="5"
                      value={freqF}
                      onChange={(e) => setFreqF(parseFloat(e.target.value))}
                      className="w-full accent-[#0284C7]"
                    />
                  </div>
                </div>

                {/* Métriques Calculées */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-2xl bg-white border border-[#E3DEC9]">
                    <span className="text-[#8C7355] font-bold block text-[11px]">Fréquence Propre f₀</span>
                    <span className="text-base font-black text-[#0284C7] font-mono">
                      {rlcCalculations.resonanceFrequency.toFixed(1)} Hz
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-white border border-[#E3DEC9]">
                    <span className="text-[#8C7355] font-bold block text-[11px]">Facteur de Qualité Q</span>
                    <span className="text-base font-black text-[#2C2218] font-mono">
                      {rlcCalculations.qualityFactor.toFixed(2)}
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-white border border-[#E3DEC9]">
                    <span className="text-[#8C7355] font-bold block text-[11px]">Impédance Z(f)</span>
                    <span className="text-base font-black text-[#5C4033] font-mono">
                      {rlcCalculations.impedance.toFixed(1)} Ω
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-white border border-[#E3DEC9]">
                    <span className="text-[#8C7355] font-bold block text-[11px]">Bande Passante Δf</span>
                    <span className="text-base font-black text-[#8C7355] font-mono">
                      {rlcCalculations.bandwidth.toFixed(1)} Hz
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* ─── 2. SIMULATEUR OPTIQUE GÉOMÉTRIQUE ───────────────────────── */}
            {activeCenterTab === 'optics' && (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-sm font-black text-[#2C2218] flex items-center gap-1.5">
                    <Eye size={16} className="text-[#0284C7]" />
                    Banc d'Optique & Lentilles Minces (Descartes)
                  </h3>

                  <div className="inline-flex p-1 rounded-xl bg-[#EFECE6] border border-[#E3DEC9] text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => setLensType('converging')}
                      className={`px-3 py-1 rounded-lg ${
                        lensType === 'converging' ? 'bg-[#0284C7] text-white' : 'text-[#6E5D4F]'
                      }`}
                    >
                      Lentille Convergente (f' &gt; 0)
                    </button>
                    <button
                      type="button"
                      onClick={() => setLensType('diverging')}
                      className={`px-3 py-1 rounded-lg ${
                        lensType === 'diverging' ? 'bg-[#0284C7] text-white' : 'text-[#6E5D4F]'
                      }`}
                    >
                      Lentille Divergente (f' &lt; 0)
                    </button>
                  </div>
                </div>

                {/* Banc d'optique SVG avec tracé de rayons */}
                <div className="p-3 rounded-2xl bg-white border border-[#E3DEC9]">
                  <svg viewBox="0 0 450 180" className="w-full h-44 select-none">
                    {/* Axe optique principal */}
                    <line x1="0" y1="90" x2="450" y2="90" stroke="#CBD5E1" strokeWidth="1.5" />
                    <text x="435" y="85" fontSize="10" fill="#64748B">Axe</text>

                    {/* Lentille au centre (x = 225) */}
                    <line x1="225" y1="15" x2="225" y2="165" stroke="#0284C7" strokeWidth="2.5" />
                    <text x="230" y="25" fontSize="11" fontWeight="bold" fill="#0284C7">
                      {lensType === 'converging' ? 'L (+)' : 'L (-)'}
                    </text>

                    {/* Foyers F et F' (échelle : 1 cm = 4 px) */}
                    {(() => {
                      const scale = 4;
                      const fpx = focalLength * scale;
                      const fPrimeX = lensType === 'converging' ? 225 + fpx : 225 - fpx;
                      const fX = lensType === 'converging' ? 225 - fpx : 225 + fpx;

                      // Objet position et hauteur
                      const objX = 225 + objectDistance * scale;
                      const objHeightPx = objectHeight * scale;

                      // Image position et hauteur
                      const imgX = 225 + opticsCalculations.imageDistance * scale;
                      const imgHeightPx = opticsCalculations.imageHeight * scale;

                      return (
                        <>
                          {/* Foyer F */}
                          <circle cx={fX} cy={90} r="3" fill="#DC2626" />
                          <text x={fX - 4} y="105" fontSize="10" fontWeight="bold" fill="#DC2626">F</text>

                          {/* Foyer F' */}
                          <circle cx={fPrimeX} cy={90} r="3" fill="#16A34A" />
                          <text x={fPrimeX - 5} y="105" fontSize="10" fontWeight="bold" fill="#16A34A">F'</text>

                          {/* Objet AB (flèche verte) */}
                          <line x1={objX} y1={90} x2={objX} y2={90 - objHeightPx} stroke="#059669" strokeWidth="3" />
                          <polygon
                            points={`${objX},${90 - objHeightPx - 5} ${objX - 4},${90 - objHeightPx} ${objX + 4},${90 - objHeightPx}`}
                            fill="#059669"
                          />
                          <text x={objX - 8} y={90 - objHeightPx - 8} fontSize="10" fontWeight="bold" fill="#059669">
                            Objet (B)
                          </text>

                          {/* Image A'B' (flèche violette si réelle/virtuelle) */}
                          {Math.abs(opticsCalculations.imageDistance) < 200 && (
                            <>
                              <line
                                x1={imgX}
                                y1={90}
                                x2={imgX}
                                y2={90 - imgHeightPx}
                                stroke="#7C3AED"
                                strokeWidth="3"
                                strokeDasharray={opticsCalculations.imageNature === 'VIRTUAL_UPRIGHT' ? '4 3' : ''}
                              />
                              <text x={imgX - 8} y={90 - imgHeightPx - 6} fontSize="10" fontWeight="bold" fill="#7C3AED">
                                Image (B')
                              </text>
                            </>
                          )}

                          {/* Rayon 1 : Passant par O (non dévié) */}
                          <line x1={objX} y1={90 - objHeightPx} x2={420} y2={90 + (420 - 225) * ((90 - objHeightPx - 90) / (objX - 225))} stroke="#F59E0B" strokeWidth="1.5" />

                          {/* Rayon 2 : Parallèle à l'axe puis passant par F' */}
                          <line x1={objX} y1={90 - objHeightPx} x2={225} y2={90 - objHeightPx} stroke="#3B82F6" strokeWidth="1.5" />
                          <line x1={225} y1={90 - objHeightPx} x2={fPrimeX} y2={90} stroke="#3B82F6" strokeWidth="1.5" />
                        </>
                      );
                    })()}
                  </svg>
                </div>

                {/* Sliders Optique */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-2xl bg-[#EFECE6] border border-[#E3DEC9] space-y-1">
                    <div className="flex justify-between">
                      <span className="font-bold text-[#8C7355]">Distance focale f'</span>
                      <span className="font-mono font-bold text-[#0284C7]">{focalLength} cm</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="20"
                      step="1"
                      value={focalLength}
                      onChange={(e) => setFocalLength(parseFloat(e.target.value))}
                      className="w-full accent-[#0284C7]"
                    />
                  </div>

                  <div className="p-3 rounded-2xl bg-[#EFECE6] border border-[#E3DEC9] space-y-1">
                    <div className="flex justify-between">
                      <span className="font-bold text-[#8C7355]">Position objet p (OA)</span>
                      <span className="font-mono font-bold text-[#2C2218]">{objectDistance} cm</span>
                    </div>
                    <input
                      type="range"
                      min="-40"
                      max="-12"
                      step="1"
                      value={objectDistance}
                      onChange={(e) => setObjectDistance(parseFloat(e.target.value))}
                      className="w-full accent-[#0284C7]"
                    />
                  </div>

                  <div className="p-3 rounded-2xl bg-[#EFECE6] border border-[#E3DEC9] space-y-1">
                    <div className="flex justify-between">
                      <span className="font-bold text-[#8C7355]">Hauteur objet AB</span>
                      <span className="font-mono font-bold text-[#2C2218]">{objectHeight} cm</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="8"
                      step="0.5"
                      value={objectHeight}
                      onChange={(e) => setObjectHeight(parseFloat(e.target.value))}
                      className="w-full accent-[#0284C7]"
                    />
                  </div>
                </div>

                {/* Résultats de conjugaison */}
                <div className="p-4 rounded-2xl bg-white border border-[#E3DEC9] flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="text-[#8C7355] font-semibold block text-[11px]">Position Image p' (OA')</span>
                    <span className="font-mono text-base font-black text-[#0284C7]">
                      {opticsCalculations.imageDistance.toFixed(2)} cm
                    </span>
                  </div>
                  <div>
                    <span className="text-[#8C7355] font-semibold block text-[11px]">Grandissement γ</span>
                    <span className="font-mono text-base font-black text-[#2C2218]">
                      {opticsCalculations.magnification.toFixed(2)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#8C7355] font-semibold block text-[11px]">Nature de l'Image</span>
                    <span className="font-bold text-emerald-800">
                      {opticsCalculations.imageNature === 'REAL_INVERTED' ? 'Réelle et inversée' : 'Virtuelle et droite'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* ─── 3. FORMULES PHYSIQUES KATEX ────────────────────────────── */}
            {activeCenterTab === 'katex' && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#8C7355] uppercase tracking-wider">
                    Saisie d'Équation Physique LaTeX
                  </label>
                  <textarea
                    rows={3}
                    value={customLatex}
                    onChange={(e) => setCustomLatex(e.target.value)}
                    className="w-full p-3 rounded-2xl bg-white border border-[#E3DEC9] font-mono text-xs text-[#2C2218] focus:outline-hidden focus:ring-2 focus:ring-[#0284C7]/20"
                  />
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {[
                    { label: 'Maxwell-Faraday', code: '\\vec{\\nabla} \\times \\vec{E} = -\\frac{\\partial \\vec{B}}{\\partial t}' },
                    { label: 'Descartes Lentilles', code: '\\frac{1}{\\overline{OA\'}} - \\frac{1}{\\overline{OA}} = \\frac{1}{f\'}' },
                    { label: 'Oscillateur Harmonique', code: '\\frac{d^2 x}{dt^2} + 2\\lambda \\frac{dx}{dt} + \\omega_0^2 x = 0' },
                    { label: 'Loi de Bragg', code: '2d \\sin(\\theta) = n\\lambda' },
                  ].map((snip) => (
                    <button
                      key={snip.label}
                      type="button"
                      onClick={() => setCustomLatex(snip.code)}
                      className="px-2.5 py-1 rounded-lg bg-[#EFECE6] border border-[#E3DEC9] text-[11px] font-bold text-[#0284C7] hover:bg-white"
                    >
                      {snip.label}
                    </button>
                  ))}
                </div>

                <div className="p-6 rounded-2xl bg-white border border-[#E3DEC9] text-center min-h-[100px] flex items-center justify-center">
                  <KaTeXMath math={customLatex} block />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════════
            PANNEAU DROIT (3 cols) : CORRECTEUR INTELLIGENT & SYNTHÈSE
        ════════════════════════════════════════════════════════════════════ */}
        <div className="lg:col-span-3 space-y-4">
          <div className="rounded-3xl bg-[#F7F5F0] border border-[#E3DEC9] p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#E3DEC9]/70 pb-3">
              <span className="text-xs font-black text-[#0284C7] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles size={14} />
                Correcteur & Diagnostic
              </span>
              <span className={`w-2.5 h-2.5 rounded-full ${isAtResonance ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
            </div>

            {/* Diagnostic Expérimental en Temps Réel */}
            <div className="p-3.5 rounded-2xl bg-white border border-[#E3DEC9] space-y-2 text-xs">
              <div className="font-bold text-[#2C2218] flex items-center gap-1.5">
                <Info size={13} className="text-[#0284C7]" />
                État du Système Expérimental
              </div>
              <p className="text-[11px] text-[#6E5D4F] leading-relaxed">
                {isAtResonance ? (
                  <>
                    <strong className="text-emerald-800">Résonance Électrique Atteinte !</strong> La fréquence du générateur correspond à la fréquence propre ({freqF} Hz ≈ {rlcCalculations.resonanceFrequency.toFixed(1)} Hz). Le déphasage tension/courant est nul (φ ≈ 0°), l'impédance est minimale (Z = R) et le courant est maximal.
                  </>
                ) : freqF < rlcCalculations.resonanceFrequency ? (
                  <>
                    <strong className="text-sky-800">Régime Capacitif :</strong> Fréquence inférieure à f₀. Le terme capacitif 1/Cω domine. Le courant i(t) est en avance de phase sur la tension u(t).
                  </>
                ) : (
                  <>
                    <strong className="text-amber-800">Régime Inductif :</strong> Fréquence supérieure à f₀. L'impédance de la bobine Lω domine. La tension u(t) est en avance sur le courant.
                  </>
                )}
              </p>
            </div>

            {/* Principes Fondateurs */}
            <div className="p-3.5 rounded-2xl bg-[#EFECE6] border border-[#E3DEC9] space-y-1.5 text-xs">
              <div className="text-[11px] font-bold text-[#8C7355] uppercase tracking-wider flex items-center gap-1">
                <Award size={12} className="text-[#0284C7]" />
                Lois & Principes Associés
              </div>
              <ul className="text-[11px] text-[#6E5D4F] space-y-1">
                <li className="flex items-center gap-1">
                  <CheckCircle2 size={11} className="text-emerald-700 shrink-0" />
                  <span>Lois des mailles & nœuds (Kirchhoff)</span>
                </li>
                <li className="flex items-center gap-1">
                  <CheckCircle2 size={11} className="text-emerald-700 shrink-0" />
                  <span>Formules de conjugaison de Descartes</span>
                </li>
                <li className="flex items-center gap-1">
                  <CheckCircle2 size={11} className="text-emerald-700 shrink-0" />
                  <span>Conservation de l'énergie en régime forcé</span>
                </li>
              </ul>
            </div>

            {/* Identifiants Étudiant */}
            <div className="space-y-3 pt-2 border-t border-[#E3DEC9]/70 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#8C7355] uppercase">
                  Nom de l'Étudiant
                </label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-xl bg-white border border-[#E3DEC9] font-medium text-[#2C2218] text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#8C7355] uppercase">
                  Matricule Universitaire
                </label>
                <input
                  type="text"
                  value={studentMatricule}
                  onChange={(e) => setStudentMatricule(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-xl bg-white border border-[#E3DEC9] font-mono text-[#2C2218] text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#8C7355] uppercase">
                  Observations Expérimentales
                </label>
                <textarea
                  rows={3}
                  value={tpNotes}
                  onChange={(e) => setTpNotes(e.target.value)}
                  className="w-full p-2 rounded-xl bg-white border border-[#E3DEC9] text-[11px] text-[#2C2218]"
                />
              </div>
            </div>

            {/* Boutons d'action */}
            <button
              type="button"
              onClick={() => setShowReportModal(true)}
              className="w-full py-2.5 rounded-2xl bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
            >
              <Download size={13} />
              <span>Générer Compte-Rendu PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* ─── MODALE D'EXPORTATION PDF OFFICIEL ─────────────────────────────────── */}
      <PhysicsReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        filiere={currentFiliere}
        academicLevel={academicLevel}
        studentName={studentName}
        studentMatricule={studentMatricule}
        rlcData={rlcCalculations}
        opticsData={opticsCalculations}
        customLatex={customLatex}
        studentNotes={tpNotes}
      />
    </div>
  );
}
