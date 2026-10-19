import { useState, useMemo, useCallback } from 'react';
import {
  School,
  Hash,
  CheckCircle2,
  BookOpen,
  GraduationCap,
  Copy,
  Check,
  FlaskConical,
  Activity,
  Layers,
  Thermometer,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Download,
  AlertTriangle,
  Award,
  Sliders,
  Info,
  RotateCcw,
} from 'lucide-react';
import { LAB_03_FILIERES, LAB_03_METADATA } from '../../../data/labs/lab03Data';
import type { AcademicLevel } from '../../../types/lab01';
import type { IFiliereL03, ICstrReactorData, IDistillationData, IHeatExchangerData, FiliereL03Branch } from '../../../types/lab03';
import KaTeXMath from '../../common/KaTeXMath';
import ProcessReportModal from './ProcessReportModal';
import UnitOperationsDesignModule from './UnitOperationsDesignModule';

export default function ProcessLabWorkspace() {
  // 1. Sélection institutionnelle (21 filières officielles)
  const [selectedBranchFilter, setSelectedBranchFilter] = useState<'ALL' | FiliereL03Branch>('ALL');
  const [selectedFiliereId, setSelectedFiliereId] = useState<string>(LAB_03_FILIERES[0].id);
  const [academicLevel, setAcademicLevel] = useState<AcademicLevel>('L1');
  const [copiedRef, setCopiedRef] = useState<boolean>(false);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);

  // Étudiant & Validation
  const [studentName, setStudentName] = useState<string>('Nguegang Patrice');
  const [studentMatricule, setStudentMatricule] = useState<string>('24GP0412-UDO');
  const [tpNotes, setTpNotes] = useState<string>(
    "Observation : Le réacteur CSTR atteint un taux de conversion stabilisé de 81.3% à 65°C. La régulation de la double enveloppe (TIC-102) maintient la température stationnaire sans risque d'emballement thermique."
  );
  const [completedSkills, setCompletedSkills] = useState<Record<string, boolean>>({
    skill_fds: true,
    skill_cstr: true,
    skill_pid: true,
    skill_energy: false,
  });

  // Onglet central
  const [activeCenterTab, setActiveCenterTab] = useState<'cstr' | 'operations' | 'katex'>('cstr');
  const [liveDistillation, setLiveDistillation] = useState<IDistillationData | undefined>();
  const [liveExchanger, setLiveExchanger] = useState<IHeatExchangerData | undefined>();

  // Moteur 1 : Paramètres Réacteur CSTR Agité Continu
  const [reactorV, setReactorV] = useState<number>(120); // Litres
  const [flowQ, setFlowQ] = useState<number>(15); // L/min
  const [ca0, setCa0] = useState<number>(2.0); // mol/L
  const [tempC, setTempC] = useState<number>(65); // °C
  const [actEnergyKJ, setActEnergyKJ] = useState<number>(55); // kJ/mol
  const [deltaHkJ, setDeltaHkJ] = useState<number>(-75); // kJ/mol (exothermique)

  // Moteur 2 : Paramètres Distillation Continue (McCabe-Thiele)
  const [feedFlowF, setFeedFlowF] = useState<number>(100); // kmol/h
  const [zf, setZf] = useState<number>(0.45); // fraction molaire entrée
  const [xd, setXd] = useState<number>(0.95); // pureté tête
  const [xb, setXb] = useState<number>(0.05); // fond
  const [refluxR, setRefluxR] = useState<number>(2.2); // Taux de reflux L/D

  // Moteur 3 : KaTeX Custom Playground
  const [customLatex, setCustomLatex] = useState<string>(
    '\\tau = \\frac{V}{Q}, \\quad X_A = \\frac{k \\tau}{1 + k \\tau}, \\quad \\dot{Q} = Q \\cdot X_A \\cdot C_{A0} \\cdot (-\\Delta H_r)'
  );

  // Filières filtrées par branche
  const branchFilteredFilieres = useMemo(() => {
    if (selectedBranchFilter === 'ALL') return LAB_03_FILIERES;
    return LAB_03_FILIERES.filter((f) => f.branch === selectedBranchFilter);
  }, [selectedBranchFilter]);

  // Filière active
  const currentFiliere: IFiliereL03 = useMemo(() => {
    return LAB_03_FILIERES.find((f) => f.id === selectedFiliereId) || LAB_03_FILIERES[0];
  }, [selectedFiliereId]);

  // ─── CALCULS DU RÉACTEUR CSTR ──────────────────────────────────────────────
  const cstrCalculations: ICstrReactorData = useMemo(() => {
    const tempK = tempC + 273.15;
    const rGas = 8.314; // J/(mol.K)
    const eaJoules = actEnergyKJ * 1000;

    // Constante pré-exponentielle étalonnée A = 1e8 min^-1
    const preExpA = 1e8;
    const kRate = preExpA * Math.exp(-eaJoules / (rGas * tempK)); // min^-1

    // Temps de passage tau = V / Q
    const tau = flowQ > 0 ? reactorV / flowQ : 0; // minutes

    // Réaction d'ordre 1 : CA = CA0 / (1 + k*tau)
    const ca = ca0 / (1 + kRate * tau);
    const conversion = ca0 > 0 ? ((ca0 - ca) / ca0) * 100 : 0;

    // Chaleur dégagée : Q_dot = F_A0 * X_A * (-deltaH) = Q * (CA0 - CA) * (-deltaH)
    // Q en L/min => m3/s ou mol/s
    const molesReactedPerSec = ((ca0 - ca) * flowQ) / 60; // mol/s
    const heatWatts = molesReactedPerSec * (-deltaHkJ * 1000); // Watts

    return {
      reactorVolume: reactorV,
      volumetricFlowRate: flowQ,
      inletConcentrationA: ca0,
      outletConcentrationA: ca,
      rateConstant: kRate,
      temperatureK: tempK,
      activationEnergyJ: eaJoules,
      residenceTimeMin: tau,
      conversionRate: Math.max(0, Math.min(100, conversion)),
      heatGeneratedWatts: heatWatts,
      reactionEnthalpyKJ: deltaHkJ,
    };
  }, [reactorV, flowQ, ca0, tempC, actEnergyKJ, deltaHkJ]);

  // ─── CALCULS DE DISTILLATION (MCCABE-THIELE) ────────────────────────────────
  const distillationCalculations: IDistillationData = useMemo(() => {
    // Bilan global : F = D + B et F*zF = D*xD + B*xB
    // D = F * (zF - xB) / (xD - xB)
    const D = (feedFlowF * (zf - xb)) / Math.max(0.01, xd - xb);
    const B = feedFlowF - D;

    // Estimation approchée des plateaux de Fenske / Gilliland
    const alpha = 2.4; // Volatilité relative
    const nFenske = Math.log((xd / (1 - xd)) * ((1 - xb) / xb)) / Math.log(alpha);
    const estimatedTheoreticalTrays = Math.max(4, Math.round(nFenske * 1.5 + refluxR * 0.8));

    return {
      feedFlowRate: feedFlowF,
      feedFractionLight: zf,
      distillateFraction: xd,
      bottomsFraction: xb,
      refluxRatio: refluxR,
      theoreticalTrays: estimatedTheoreticalTrays,
      feedTrayIndex: Math.round(estimatedTheoreticalTrays * 0.45),
      condenserDutyKW: D * 38.5 * (refluxR + 1), // kW
      reboilerDutyKW: (D * (refluxR + 1) + feedFlowF * 0.2) * 35.2,
    };
  }, [feedFlowF, zf, xd, xb, refluxR]);

  // Presets CSTR
  const applyCstrPreset = (type: 'high_conversion' | 'high_flow' | 'ambient' | 'exothermic') => {
    switch (type) {
      case 'high_conversion':
        setReactorV(200);
        setFlowQ(10);
        setTempC(75);
        break;
      case 'high_flow':
        setReactorV(80);
        setFlowQ(30);
        setTempC(50);
        break;
      case 'ambient':
        setTempC(25);
        setFlowQ(15);
        break;
      case 'exothermic':
        setDeltaHkJ(-110);
        setTempC(70);
        break;
    }
  };

  const handleCopyRef = () => {
    const text = `Lab L03 - ${currentFiliere.sigleUniversite} (${currentFiliere.faculte}), Page ${currentFiliere.pageDossier} du recueil officiel MINESUP CampusHub.`;
    navigator.clipboard?.writeText(text);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  const toggleSkill = (key: string) => {
    setCompletedSkills((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const isThermalRunawayRisk = tempC > 80 && deltaHkJ < -70;

  return (
    <div className="space-y-6 text-left">
      {/* ─── EN-TÊTE DU WORKSPACE L03 ────────────────────────────────────────── */}
      <div className="rounded-3xl bg-[#EFECE6] border border-[#E3DEC9] p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-[#059669] text-white uppercase tracking-wider">
                {LAB_03_METADATA.code} · HALLE PILOTE VIRTUELLE
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#E3DEC9] text-[#5C4033] border border-[#D5CEA3]">
                {currentFiliere.branch.replace(/_/g, ' ')}
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-900 border border-emerald-200 flex items-center gap-1">
                <Hash size={12} className="text-emerald-800" />
                Page {currentFiliere.pageDossier} MINESUP
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-[#2C2218] tracking-tight">
              ProcédésLab Workspace · {currentFiliere.sigleUniversite}
            </h2>
            <p className="text-xs sm:text-sm text-[#6E5D4F]">
              Atelier d'opérations unitaires, de cinétique réactionnelle, de schémas P&ID et de sécurité chimique pour les 21 filières d'État
            </p>
          </div>

          {/* Niveau & Bouton Exportation */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <div className="inline-flex p-1 rounded-2xl bg-[#F7F5F0] border border-[#E3DEC9] text-xs font-bold">
              {(['L1', 'L2', 'L3', 'M1', 'M2', 'DIPET_I', 'DIPET_II'] as AcademicLevel[]).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setAcademicLevel(lvl)}
                  className={`px-2.5 py-1 rounded-xl transition-all ${
                    academicLevel === lvl
                      ? 'bg-[#059669] text-white shadow-xs'
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
              className="px-4 py-2 rounded-2xl bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
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
            PANNEAU GAUCHE (3 cols) : RÉFÉRENTIEL MINESUP & SÉCURITÉ CHIMIQUE
        ════════════════════════════════════════════════════════════════════ */}
        <div className="lg:col-span-3 space-y-4">
          <div className="rounded-3xl bg-[#F7F5F0] border border-[#E3DEC9] p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#E3DEC9]/70 pb-3">
              <span className="text-xs font-black text-[#059669] uppercase tracking-wider flex items-center gap-1.5">
                <School size={14} />
                Filières MINESUP (21)
              </span>
              <button
                type="button"
                onClick={handleCopyRef}
                title="Copier référence officielle"
                className="p-1 rounded-lg text-[#8C7355] hover:text-[#059669] hover:bg-white transition-colors"
              >
                {copiedRef ? <Check size={13} className="text-emerald-700" /> : <Copy size={13} />}
              </button>
            </div>

            {/* Filtre de Branche : Chimie vs Chimie Ind vs Génie des Procédés */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#8C7355] uppercase tracking-wider">
                Branche d'Enseignement
              </label>
              <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-[#EFECE6] border border-[#E3DEC9] text-[10px] font-black text-center">
                <button
                  type="button"
                  onClick={() => setSelectedBranchFilter('ALL')}
                  className={`py-1 rounded-lg transition-all ${
                    selectedBranchFilter === 'ALL' ? 'bg-[#059669] text-white' : 'text-[#6E5D4F]'
                  }`}
                >
                  Toutes (21)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedBranchFilter('CHIMIE_FONDAMENTALE')}
                  className={`py-1 rounded-lg transition-all ${
                    selectedBranchFilter === 'CHIMIE_FONDAMENTALE' ? 'bg-[#059669] text-white' : 'text-[#6E5D4F]'
                  }`}
                >
                  Chimie (14)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedBranchFilter('GENIE_DES_PROCEDES')}
                  className={`py-1 rounded-lg transition-all ${
                    selectedBranchFilter === 'GENIE_DES_PROCEDES' ? 'bg-[#059669] text-white' : 'text-[#6E5D4F]'
                  }`}
                >
                  Procédés (4)
                </button>
              </div>
            </div>

            {/* Menu des 21 filières officielles */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#8C7355] uppercase tracking-wider">
                Établissement & Page
              </label>
              <select
                value={selectedFiliereId}
                onChange={(e) => setSelectedFiliereId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#E3DEC9] text-xs font-bold text-[#2C2218] focus:outline-hidden focus:ring-2 focus:ring-[#059669]/20"
              >
                {branchFilteredFilieres.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.sigleUniversite} • {f.faculteSigle} (p. {f.pageDossier})
                  </option>
                ))}
              </select>
            </div>

            {/* Fiche synthétique institutionnelle */}
            <div className="p-3.5 rounded-2xl bg-[#EFECE6] border border-[#E3DEC9] space-y-2 text-xs">
              <div className="font-black text-[#2C2218] leading-snug">
                {currentFiliere.universite}
              </div>
              <div className="text-[11px] font-bold text-[#059669]">
                {currentFiliere.faculte}
              </div>
              <div className="text-[11px] text-[#6E5D4F]">
                Campus : {currentFiliere.campus} ({currentFiliere.region})
              </div>
              <div className="pt-2 border-t border-[#E3DEC9]/70 flex items-center justify-between text-[11px]">
                <span className="text-[#8C7355] font-semibold">Folio MINESUP :</span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 font-black border border-emerald-200">
                  Page {currentFiliere.pageDossier}
                </span>
              </div>
            </div>

            {/* Fiche de Sécurité Chimique FDS & EPI */}
            <div className="p-3.5 rounded-2xl bg-white border border-[#E3DEC9] space-y-2 text-xs">
              <div className="text-[11px] font-bold text-[#8C7355] uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck size={13} className="text-[#059669]" />
                Sécurité & Protocole EPI
              </div>

              <div className="grid grid-cols-2 gap-1.5 text-[10px] font-bold">
                <span className="p-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-center">
                  Blouse 100% Coton
                </span>
                <span className="p-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-center">
                  Gants Nitrile
                </span>
                <span className="p-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-center">
                  Lunettes Écran
                </span>
                <span className="p-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-center">
                  Hotte Ventilée
                </span>
              </div>

              <div className="text-[10px] text-[#6E5D4F] leading-tight pt-1 border-t border-[#E3DEC9]/60">
                Phrases H314 (Brûlures graves) et P280 (Porter des gants et lunettes).
              </div>
            </div>

            {/* Compétences de Procédés */}
            <div className="space-y-2.5 pt-2 border-t border-[#E3DEC9]/70">
              <div className="text-[11px] font-bold text-[#8C7355] uppercase tracking-wider flex items-center gap-1">
                <GraduationCap size={13} className="text-[#059669]" />
                Compétences Pratiques Visées
              </div>

              <div className="space-y-2">
                {[
                  { id: 'skill_fds', label: "Respect des FDS, EPI et matrice d'incompatibilité" },
                  { id: 'skill_cstr', label: "Bilan matière & calcul du taux de conversion CSTR" },
                  { id: 'skill_pid', label: "Interprétation des boucles d'instrumentation P&ID" },
                  { id: 'skill_energy', label: "Bilan d'énergie & surveillance d'emballement" },
                ].map((sk) => (
                  <button
                    key={sk.id}
                    type="button"
                    onClick={() => toggleSkill(sk.id)}
                    className="w-full text-left p-2 rounded-xl bg-white border border-[#E3DEC9] hover:border-[#059669]/40 transition-all flex items-start gap-2 text-xs"
                  >
                    <div
                      className={`w-4 h-4 rounded-md mt-0.5 flex items-center justify-center shrink-0 border transition-all ${
                        completedSkills[sk.id]
                          ? 'bg-[#059669] border-[#059669] text-white'
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
            PANNEAU CENTRAL (6 cols) : HALLE PILOTE & SIMULATION NUMÉRIQUE
        ════════════════════════════════════════════════════════════════════ */}
        <div className="lg:col-span-6 space-y-4">
          <div className="rounded-3xl bg-[#F7F5F0] border border-[#E3DEC9] p-5 sm:p-6 space-y-5 shadow-xs">
            {/* Onglets de la Halle Pilote */}
            <div className="flex items-center justify-between border-b border-[#E3DEC9]/70 pb-3">
              <div className="inline-flex p-1 rounded-2xl bg-[#EFECE6] border border-[#E3DEC9] text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setActiveCenterTab('cstr')}
                  className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                    activeCenterTab === 'cstr'
                      ? 'bg-[#059669] text-white shadow-xs'
                      : 'text-[#6E5D4F] hover:text-[#2C2218]'
                  }`}
                >
                  <Activity size={13} />
                  <span>Réacteur CSTR & P&ID</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveCenterTab('operations')}
                  className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                    activeCenterTab === 'operations'
                      ? 'bg-[#059669] text-white shadow-xs'
                      : 'text-[#6E5D4F] hover:text-[#2C2218]'
                  }`}
                >
                  <Layers size={13} />
                  <span>Opérations Unitaires (McCabe & Échangeur)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveCenterTab('katex')}
                  className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                    activeCenterTab === 'katex'
                      ? 'bg-[#059669] text-white shadow-xs'
                      : 'text-[#6E5D4F] hover:text-[#2C2218]'
                  }`}
                >
                  <BookOpen size={13} />
                  <span>Formules Procédés</span>
                </button>
              </div>

              <span className="text-[11px] font-bold text-[#059669] flex items-center gap-1">
                <Sparkles size={13} />
                Banc d'Essai Pilote
              </span>
            </div>

            {/* ─── 1. SIMULATEUR CSTR & SCHÉMA P&ID ───────────────────────── */}
            {activeCenterTab === 'cstr' && (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-sm font-black text-[#2C2218] flex items-center gap-1.5">
                    <FlaskConical size={16} className="text-[#059669]" />
                    Réacteur Agité Continu Isotherme / Régulé (CSTR)
                  </h3>

                  {/* Presets rapides */}
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <span className="text-[#8C7355] font-semibold">Presets :</span>
                    <button
                      type="button"
                      onClick={() => applyCstrPreset('high_conversion')}
                      className="px-2 py-0.5 rounded-lg bg-emerald-100 text-emerald-900 border border-emerald-200 font-bold hover:bg-emerald-200"
                    >
                      Haute Conv. (85%+)
                    </button>
                    <button
                      type="button"
                      onClick={() => applyCstrPreset('high_flow')}
                      className="px-2 py-0.5 rounded-lg bg-white border border-[#E3DEC9] font-bold hover:bg-[#EFECE6]"
                    >
                      Fort Débit
                    </button>
                    <button
                      type="button"
                      onClick={() => applyCstrPreset('exothermic')}
                      className="px-2 py-0.5 rounded-lg bg-amber-100 text-amber-900 border border-amber-200 font-bold hover:bg-amber-200"
                    >
                      Exothermique
                    </button>
                  </div>
                </div>

                {/* Schéma P&ID Vectoriel SVG Interactif */}
                <div className="p-3 rounded-2xl bg-slate-900 text-white border border-[#E3DEC9] shadow-inner space-y-2">
                  <div className="flex items-center justify-between text-[11px] px-1 font-mono">
                    <span className="text-emerald-400 font-bold">P&ID : R-101 (CSTR) · Double Enveloppe</span>
                    <span className="text-amber-400">TIC-102 : T = {tempC}°C (Consigne Maintenue)</span>
                  </div>

                  <svg viewBox="0 0 450 170" className="w-full h-40 select-none bg-slate-950/80 rounded-xl">
                    {/* Canalisation d'entrée */}
                    <line x1="20" y1="45" x2="160" y2="45" stroke="#38BDF8" strokeWidth="3" />
                    <polygon points="150,40 160,45 150,50" fill="#38BDF8" />
                    <text x="30" y="38" fontSize="10" fill="#38BDF8" fontWeight="bold">
                      Alimentation A (CA₀ = {ca0} M, Q = {flowQ} L/min)
                    </text>

                    {/* Vanne d'entrée & Transmetteur de Débit FT-101 */}
                    <circle cx="100" cy="45" r="10" fill="#1E293B" stroke="#38BDF8" strokeWidth="1.5" />
                    <text x="92" y="48" fontSize="8" fill="#38BDF8" fontWeight="bold">FT</text>

                    {/* Cuve du réacteur CSTR */}
                    <rect x="160" y="25" width="130" height="110" rx="20" fill="#0F172A" stroke="#059669" strokeWidth="2.5" />

                    {/* Liquide réactionnel dans la cuve */}
                    <rect x="165" y="55" width="120" height="75" rx="10" fill="#059669" fillOpacity="0.25" />

                    {/* Moteur et axe d'agitateur */}
                    <rect x="215" y="10" width="20" height="15" fill="#64748B" rx="2" />
                    <line x1="225" y1="25" x2="225" y2="105" stroke="#E2E8F0" strokeWidth="2" />
                    {/* Pales d'agitation */}
                    <line x1="205" y1="105" x2="245" y2="105" stroke="#E2E8F0" strokeWidth="3" />
                    <line x1="210" y1="95" x2="240" y2="95" stroke="#E2E8F0" strokeWidth="2.5" />

                    {/* Double enveloppe de refroidissement */}
                    <path d="M 152 40 L 152 135 L 298 135 L 298 40" fill="none" stroke="#0284C7" strokeWidth="2" strokeDasharray="4 2" />
                    <text x="175" y="148" fontSize="9" fill="#0284C7" fontWeight="bold">
                      Double Enveloppe (Eau Froide)
                    </text>

                    {/* Sonde de température TT-102 */}
                    <circle cx="270" cy="80" r="10" fill="#1E293B" stroke="#F59E0B" strokeWidth="1.5" />
                    <text x="263" y="83" fontSize="8" fill="#F59E0B" fontWeight="bold">TT</text>

                    {/* Canalisation de sortie */}
                    <line x1="290" y1="115" x2="430" y2="115" stroke="#10B981" strokeWidth="3" />
                    <polygon points="420,110 430,115 420,120" fill="#10B981" />
                    <text x="310" y="105" fontSize="10" fill="#10B981" fontWeight="bold">
                      Produit (X_A = {cstrCalculations.conversionRate.toFixed(1)}%)
                    </text>
                  </svg>
                </div>

                {/* Sliders de Contrôle du Réacteur */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-2xl bg-[#EFECE6] border border-[#E3DEC9] space-y-1">
                    <div className="flex justify-between">
                      <span className="font-bold text-[#8C7355]">Volume V (L)</span>
                      <span className="font-mono font-bold text-[#2C2218]">{reactorV} L</span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="300"
                      step="10"
                      value={reactorV}
                      onChange={(e) => setReactorV(parseFloat(e.target.value))}
                      className="w-full accent-[#059669]"
                    />
                  </div>

                  <div className="p-3 rounded-2xl bg-[#EFECE6] border border-[#E3DEC9] space-y-1">
                    <div className="flex justify-between">
                      <span className="font-bold text-[#8C7355]">Débit Q (L/min)</span>
                      <span className="font-mono font-bold text-[#2C2218]">{flowQ} L/min</span>
                    </div>
                    <input
                      type="range"
                      min="2"
                      max="40"
                      step="1"
                      value={flowQ}
                      onChange={(e) => setFlowQ(parseFloat(e.target.value))}
                      className="w-full accent-[#059669]"
                    />
                  </div>

                  <div className="p-3 rounded-2xl bg-[#EFECE6] border border-[#E3DEC9] space-y-1">
                    <div className="flex justify-between">
                      <span className="font-bold text-[#8C7355]">Température T</span>
                      <span className="font-mono font-bold text-[#059669]">{tempC} °C</span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="95"
                      step="1"
                      value={tempC}
                      onChange={(e) => setTempC(parseFloat(e.target.value))}
                      className="w-full accent-[#059669]"
                    />
                  </div>

                  <div className="p-3 rounded-2xl bg-[#EFECE6] border border-[#E3DEC9] space-y-1">
                    <div className="flex justify-between">
                      <span className="font-bold text-[#8C7355]">Conc. Entrée CA₀</span>
                      <span className="font-mono font-bold text-[#2C2218]">{ca0} M</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="5.0"
                      step="0.1"
                      value={ca0}
                      onChange={(e) => setCa0(parseFloat(e.target.value))}
                      className="w-full accent-[#059669]"
                    />
                  </div>

                  <div className="p-3 rounded-2xl bg-[#EFECE6] border border-[#E3DEC9] space-y-1">
                    <div className="flex justify-between">
                      <span className="font-bold text-[#8C7355]">Énergie Act. Ea</span>
                      <span className="font-mono font-bold text-[#2C2218]">{actEnergyKJ} kJ/mol</span>
                    </div>
                    <input
                      type="range"
                      min="30"
                      max="90"
                      step="5"
                      value={actEnergyKJ}
                      onChange={(e) => setActEnergyKJ(parseFloat(e.target.value))}
                      className="w-full accent-[#059669]"
                    />
                  </div>

                  <div className="p-3 rounded-2xl bg-[#EFECE6] border border-[#E3DEC9] space-y-1">
                    <div className="flex justify-between">
                      <span className="font-bold text-[#8C7355]">Enthalpie ΔHr</span>
                      <span className="font-mono font-bold text-[#5C4033]">{deltaHkJ} kJ/mol</span>
                    </div>
                    <input
                      type="range"
                      min="-120"
                      max="40"
                      step="5"
                      value={deltaHkJ}
                      onChange={(e) => setDeltaHkJ(parseFloat(e.target.value))}
                      className="w-full accent-[#059669]"
                    />
                  </div>
                </div>

                {/* Métriques Clés Calculées */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-2xl bg-white border border-[#E3DEC9]">
                    <span className="text-[#8C7355] font-bold block text-[11px]">Temps Séjour τ</span>
                    <span className="text-base font-black text-[#059669] font-mono">
                      {cstrCalculations.residenceTimeMin.toFixed(2)} min
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-white border border-[#E3DEC9]">
                    <span className="text-[#8C7355] font-bold block text-[11px]">Taux Conversion XA</span>
                    <span className="text-base font-black text-emerald-800 font-mono">
                      {cstrCalculations.conversionRate.toFixed(1)}%
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-white border border-[#E3DEC9]">
                    <span className="text-[#8C7355] font-bold block text-[11px]">Conc. Sortie CA</span>
                    <span className="text-base font-black text-[#2C2218] font-mono">
                      {cstrCalculations.outletConcentrationA.toFixed(3)} M
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-white border border-[#E3DEC9]">
                    <span className="text-[#8C7355] font-bold block text-[11px]">Chaleur Dégagée</span>
                    <span className="text-base font-black text-[#5C4033] font-mono">
                      {cstrCalculations.heatGeneratedWatts.toFixed(0)} W
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* ─── 2. OPÉRATIONS UNITAIRES AVANCÉES (MCCABE-THIELE & DTLM) ── */}
            {activeCenterTab === 'operations' && (
              <UnitOperationsDesignModule
                onDistillationChange={setLiveDistillation}
                onExchangerChange={setLiveExchanger}
              />
            )}

            {/* ─── 3. FORMULES KATEX ────────────────────────────────────────── */}
            {activeCenterTab === 'katex' && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#8C7355] uppercase tracking-wider">
                    Saisie d'Équation de Génie Chimique (LaTeX)
                  </label>
                  <textarea
                    rows={3}
                    value={customLatex}
                    onChange={(e) => setCustomLatex(e.target.value)}
                    className="w-full p-3 rounded-2xl bg-white border border-[#E3DEC9] font-mono text-xs text-[#2C2218] focus:outline-hidden focus:ring-2 focus:ring-[#059669]/20"
                  />
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {[
                    { label: 'CSTR Design', code: 'V = \\frac{F_{A0} \\cdot X_A}{-r_A}' },
                    { label: 'Loi Arrhenius', code: 'k(T) = A \\cdot e^{-\\frac{E_a}{R T}}' },
                    { label: 'Transfert Thermique', code: '\\dot{Q} = U \\cdot A \\cdot \\Delta T_{\\ln}' },
                    { label: 'Nombre de Reynolds', code: 'Re = \\frac{\\rho \\cdot v \\cdot D}{\\mu}' },
                  ].map((snip) => (
                    <button
                      key={snip.label}
                      type="button"
                      onClick={() => setCustomLatex(snip.code)}
                      className="px-2.5 py-1 rounded-lg bg-[#EFECE6] border border-[#E3DEC9] text-[11px] font-bold text-[#059669] hover:bg-white"
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
            PANNEAU DROIT (3 cols) : CORRECTEUR INTELLIGENT & DIAGNOSTIC HAZOP
        ════════════════════════════════════════════════════════════════════ */}
        <div className="lg:col-span-3 space-y-4">
          <div className="rounded-3xl bg-[#F7F5F0] border border-[#E3DEC9] p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#E3DEC9]/70 pb-3">
              <span className="text-xs font-black text-[#059669] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles size={14} />
                Diagnostic HAZOP & Procédés
              </span>
              <span className={`w-2.5 h-2.5 rounded-full ${isThermalRunawayRisk ? 'bg-rose-500 animate-ping' : 'bg-emerald-500'}`} />
            </div>

            {/* Diagnostic Thermique & Sécurité */}
            <div className="p-3.5 rounded-2xl bg-white border border-[#E3DEC9] space-y-2 text-xs">
              <div className="font-bold text-[#2C2218] flex items-center gap-1.5">
                <Info size={13} className="text-[#059669]" />
                Sécurité du Régime Stationnaire
              </div>
              <p className="text-[11px] text-[#6E5D4F] leading-relaxed">
                {isThermalRunawayRisk ? (
                  <>
                    <strong className="text-rose-700 flex items-center gap-1">
                      <AlertTriangle size={12} />
                      Alerte Emballement Thermique :
                    </strong>{' '}
                    Température élevée ({tempC}°C) combinée à une forte exothermie ({deltaHkJ} kJ/mol). Augmenter le débit de refroidissement de la double enveloppe.
                  </>
                ) : (
                  <>
                    <strong className="text-emerald-800">Régime Stable et Isotherme :</strong> La puissance dégagée ({cstrCalculations.heatGeneratedWatts.toFixed(0)} W) est parfaitement absorbée par le fluide de caloporteur. Le réacteur fonctionne dans la zone optimale de Levenspiel.
                  </>
                )}
              </p>
            </div>

            {/* Principes Fondateurs */}
            <div className="p-3.5 rounded-2xl bg-[#EFECE6] border border-[#E3DEC9] space-y-1.5 text-xs">
              <div className="text-[11px] font-bold text-[#8C7355] uppercase tracking-wider flex items-center gap-1">
                <Award size={12} className="text-[#059669]" />
                Lois & Théorèmes Industriels
              </div>
              <ul className="text-[11px] text-[#6E5D4F] space-y-1">
                <li className="flex items-center gap-1">
                  <CheckCircle2 size={11} className="text-emerald-700 shrink-0" />
                  <span>Bilan stationnaire : Entrée - Sortie + Réaction = 0</span>
                </li>
                <li className="flex items-center gap-1">
                  <CheckCircle2 size={11} className="text-emerald-700 shrink-0" />
                  <span>Loi de Le Chatelier & Van 't Hoff</span>
                </li>
                <li className="flex items-center gap-1">
                  <CheckCircle2 size={11} className="text-emerald-700 shrink-0" />
                  <span>Critère de dimensionnement de Levenspiel</span>
                </li>
              </ul>
            </div>

            {/* Statut Opérations Unitaires Actives */}
            {(liveDistillation || liveExchanger) && (
              <div className="p-3.5 rounded-2xl bg-white border border-[#E3DEC9] space-y-1.5 text-xs">
                <div className="font-bold text-[#059669] flex items-center gap-1.5 text-[11px] uppercase">
                  <Layers size={12} />
                  Opérations Unitaires Actives
                </div>
                {liveDistillation && (
                  <div className="text-[11px] text-[#2C2218] flex justify-between">
                    <span className="text-[#8C7355]">McCabe-Thiele :</span>
                    <strong className="text-[#059669]">
                      {liveDistillation.theoreticalTrays} pl. théo (R={liveDistillation.refluxRatio})
                    </strong>
                  </div>
                )}
                {liveExchanger && (
                  <div className="text-[11px] text-[#2C2218] flex justify-between">
                    <span className="text-[#8C7355]">Échangeur DTLM :</span>
                    <strong className="text-[#059669]">
                      {liveExchanger.requiredAreaM2.toFixed(2)} m² (Φ={liveExchanger.heatDutyKW.toFixed(0)} kW)
                    </strong>
                  </div>
                )}
              </div>
            )}

            {/* Identifiants Étudiant */}
            <div className="space-y-3 pt-2 border-t border-[#E3DEC9]/70 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#8C7355] uppercase">
                  Opérateur Pilote (Étudiant)
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
                  Matricule Académique
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
                  Observations de Pilotage
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
              className="w-full py-2.5 rounded-2xl bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
            >
              <Download size={13} />
              <span>Générer Compte-Rendu PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* ─── MODALE D'EXPORTATION PDF OFFICIEL ─────────────────────────────────── */}
      <ProcessReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        filiere={currentFiliere}
        academicLevel={academicLevel}
        studentName={studentName}
        studentMatricule={studentMatricule}
        cstrData={cstrCalculations}
        distillationData={liveDistillation || distillationCalculations}
        exchangerData={liveExchanger}
        customLatex={customLatex}
        studentNotes={tpNotes}
      />
    </div>
  );
}
