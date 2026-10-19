import { useState, useMemo, useCallback } from 'react';
import {
  School,
  Hash,
  CheckCircle2,
  BookOpen,
  GraduationCap,
  Copy,
  Check,
  Binary,
  Calculator,
  Sigma,
  ArrowRight,
  Sparkles,
  Download,
  RotateCcw,
  Info,
  TrendingUp,
  FileCheck,
  Layers,
  Award,
} from 'lucide-react';
import { LAB_01_FILIERES, LAB_01_METADATA } from '../../../data/labs/lab01Data';
import type { IFiliereL01, AcademicLevel } from '../../../types/lab01';
import KaTeXMath from '../../common/KaTeXMath';
import MathReportModal from './MathReportModal';

export default function MathLabWorkspace() {
  // 1. Sélection institutionnelle (14 filières officielles)
  const [selectedFiliereId, setSelectedFiliereId] = useState<string>(LAB_01_FILIERES[0].id);
  const [academicLevel, setAcademicLevel] = useState<AcademicLevel>('L1');
  const [copiedRef, setCopiedRef] = useState<boolean>(false);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);

  // Étudiant & validation
  const [studentName, setStudentName] = useState<string>('Tchounkeu Alain');
  const [studentMatricule, setStudentMatricule] = useState<string>('24M0912-UY1');
  const [tpNotes, setTpNotes] = useState<string>(
    "Observation : La matrice testée est inversible avec un déterminant non nul. La dérivation numérique concorde avec la tangente géométrique au point choisi."
  );
  const [completedSkills, setCompletedSkills] = useState<Record<string, boolean>>({
    skill_det: true,
    skill_eigen: true,
    skill_simpson: false,
    skill_tangent: true,
  });

  // Onglet central
  const [activeCenterTab, setActiveCenterTab] = useState<'matrix' | 'calculus' | 'katex'>('matrix');

  // Moteur 1 : Calcul Matriciel 2x2
  const [matA, setMatA] = useState<number>(4);
  const [matB, setMatB] = useState<number>(2);
  const [matC, setMatC] = useState<number>(1);
  const [matD, setMatD] = useState<number>(3);

  // Moteur 2 : Analyse Numérique & Tracé
  const [funcKey, setFuncKey] = useState<'poly' | 'trig' | 'exp' | 'gauss'>('poly');
  const [xVal, setXVal] = useState<number>(1.2);
  const [intA, setIntA] = useState<number>(0);
  const [intB, setIntB] = useState<number>(2);

  // Moteur 3 : KaTeX Custom Playground
  const [customLatex, setCustomLatex] = useState<string>(
    '\\det(M - \\lambda I) = \\lambda^2 - \\text{Tr}(M)\\lambda + \\det(M) = 0'
  );

  // Filière active
  const currentFiliere: IFiliereL01 = useMemo(() => {
    return LAB_01_FILIERES.find((f) => f.id === selectedFiliereId) || LAB_01_FILIERES[0];
  }, [selectedFiliereId]);

  // Calculs Algèbre Matricielle
  const det = useMemo(() => matA * matD - matB * matC, [matA, matB, matC, matD]);
  const trace = useMemo(() => matA + matD, [matA, matD]);
  const delta = useMemo(() => trace * trace - 4 * det, [trace, det]);

  const eigenvalues = useMemo(() => {
    if (delta > 0) {
      const l1 = (trace + Math.sqrt(delta)) / 2;
      const l2 = (trace - Math.sqrt(delta)) / 2;
      return { type: 'real_distinct', l1, l2 };
    } else if (delta === 0) {
      const l0 = trace / 2;
      return { type: 'real_double', l0 };
    } else {
      const re = trace / 2;
      const im = Math.sqrt(-delta) / 2;
      return { type: 'complex', re, im };
    }
  }, [trace, delta]);

  const inverseMatrix = useMemo(() => {
    if (Math.abs(det) < 1e-12) return null;
    return {
      a: matD / det,
      b: -matB / det,
      c: -matC / det,
      d: matA / det,
    };
  }, [matA, matB, matC, matD, det]);

  // Presets de matrices remarquables
  const applyMatrixPreset = (type: 'identity' | 'rotation' | 'singular' | 'shear') => {
    switch (type) {
      case 'identity':
        setMatA(1); setMatB(0); setMatC(0); setMatD(1);
        break;
      case 'rotation': // Rotation 90°
        setMatA(0); setMatB(-1); setMatC(1); setMatD(0);
        break;
      case 'singular': // Rang 1
        setMatA(2); setMatB(4); setMatC(1); setMatD(2);
        break;
      case 'shear': // Transvection
        setMatA(1); setMatB(2); setMatC(0); setMatD(1);
        break;
    }
  };

  // Calculs Analyse Numérique
  const evaluateF = useCallback((x: number) => {
    switch (funcKey) {
      case 'poly':
        return x * x * x - 2 * x + 1; // f(x) = x^3 - 2x + 1
      case 'trig':
        return Math.sin(x) * Math.cos(2 * x); // f(x) = sin(x)cos(2x)
      case 'exp':
        return Math.exp(-0.5 * x) * Math.cos(x); // f(x) = e^(-x/2)cos(x)
      case 'gauss':
        return Math.exp(-x * x); // f(x) = e^(-x^2)
      default:
        return x;
    }
  }, [funcKey]);

  const fxVal = useMemo(() => evaluateF(xVal), [evaluateF, xVal]);
  const hStep = 1e-5;
  const fPrimeVal = useMemo(() => {
    return (evaluateF(xVal + hStep) - evaluateF(xVal - hStep)) / (2 * hStep);
  }, [evaluateF, xVal]);

  // Intégrale de Simpson numérique
  const simpsonIntegral = useMemo(() => {
    const n = 100;
    const a = Math.min(intA, intB);
    const b = Math.max(intA, intB);
    const step = (b - a) / n;
    let sum = evaluateF(a) + evaluateF(b);
    for (let i = 1; i < n; i++) {
      const x = a + i * step;
      sum += (i % 2 === 0 ? 2 : 4) * evaluateF(x);
    }
    return (step / 3) * sum;
  }, [evaluateF, intA, intB]);

  // Points pour le tracé SVG
  const plotPoints = useMemo(() => {
    const pts: { x: number; y: number }[] = [];
    const minX = -3;
    const maxX = 3;
    const steps = 120;
    const dx = (maxX - minX) / steps;
    for (let i = 0; i <= steps; i++) {
      const x = minX + i * dx;
      const y = evaluateF(x);
      pts.push({ x, y: Math.max(-4, Math.min(4, y)) });
    }
    return pts;
  }, [evaluateF]);

  // Transformation SVG : coords [-3, 3] x [-4, 4] -> SVG [0, 400] x [0, 220]
  const toSvgX = (x: number) => ((x + 3) / 6) * 400;
  const toSvgY = (y: number) => 220 - ((y + 4) / 8) * 220;

  const svgPathD = useMemo(() => {
    return plotPoints.reduce((acc, pt, idx) => {
      const sx = toSvgX(pt.x);
      const sy = toSvgY(pt.y);
      return idx === 0 ? `M ${sx} ${sy}` : `${acc} L ${sx} ${sy}`;
    }, '');
  }, [plotPoints]);

  const eigenvaluesText = useMemo(() => {
    if (eigenvalues.type === 'real_distinct') {
      return `λ₁ = ${eigenvalues.l1?.toFixed(3)}, λ₂ = ${eigenvalues.l2?.toFixed(3)}`;
    } else if (eigenvalues.type === 'real_double') {
      return `λ₀ = ${eigenvalues.l0?.toFixed(3)} (racine double)`;
    } else {
      return `${eigenvalues.re?.toFixed(3)} ± ${eigenvalues.im?.toFixed(3)} i (complexes)`;
    }
  }, [eigenvalues]);

  const handleOpenPdfModal = () => {
    setShowReportModal(true);
  };

  const handleCopyRef = () => {
    const text = `Lab L01 - ${currentFiliere.sigleUniversite} (${currentFiliere.faculte}), Page ${currentFiliere.pageDossier} du dossier MINESUP CampusHub.`;
    navigator.clipboard?.writeText(text);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  const toggleSkill = (key: string) => {
    setCompletedSkills((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleExportTextBackup = () => {
    const docSummary = `
===================================================================
COMPTE-RENDU DE TRAVAUX PRATIQUES - LAB L01 : MATHÉMATIQUES & STATS
MINISTÈRE DE L'ENSEIGNEMENT SUPÉRIEUR (MINESUP) · CAMPUSHUB
===================================================================
Établissement : ${currentFiliere.universite}
Faculté / École : ${currentFiliere.faculte}
Page Certifiée du Dossier : Page ${currentFiliere.pageDossier}
Région / Campus : ${currentFiliere.region} (${currentFiliere.campus})
Niveau : ${academicLevel}
Étudiant : ${studentName} (Matricule : ${studentMatricule})
Date : ${new Date().toLocaleDateString('fr-FR')}

1. ALGEBRE MATRICIELLE TESTEE :
   M = [[${matA}, ${matB}], [${matC}, ${matD}]]
   Trace = ${trace}
   Determinant = ${det} (Inversible : ${Math.abs(det) > 1e-12 ? 'OUI' : 'NON'})
   Spectre : ${eigenvaluesText}

2. ANALYSE NUMERIQUE :
   Fonction : ${funcKey}
   Point x_0 = ${xVal} => f(x_0) = ${fxVal.toFixed(4)}, f'(x_0) = ${fPrimeVal.toFixed(4)}
   Integrale Simpson [${intA}, ${intB}] = ${simpsonIntegral.toFixed(4)}

3. SYNTHESE & OBSERVATIONS :
   ${tpNotes}
===================================================================
Certifié conforme aux exigences du syllabus académique L01.
`;

    const blob = new Blob([docSummary], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Synthese_TP_MathLab_L01_${currentFiliere.sigleUniversite}_${studentMatricule}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 text-left">
      {/* ─── EN-TÊTE DU WORKSPACE L01 ────────────────────────────────────────── */}
      <div className="rounded-3xl bg-[#EFECE6] border border-[#E3DEC9] p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-[#5C4033] text-white uppercase tracking-wider">
                {LAB_01_METADATA.code} · ESPACE DE TRAVAIL OFFICIEL
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#E3DEC9] text-[#5C4033] border border-[#D5CEA3]">
                Sciences Fondamentales
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-900 border border-amber-200 flex items-center gap-1">
                <Hash size={12} className="text-amber-800" />
                Page {currentFiliere.pageDossier} MINESUP
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-[#2C2218] tracking-tight">
              MathLab Workspace · {currentFiliere.sigleUniversite}
            </h2>
            <p className="text-xs sm:text-sm text-[#6E5D4F]">
              Environnement numérique d'expérimentation mathématique, d'analyse fonctionnelle et de validation formelle
            </p>
          </div>

          {/* Sélecteur de niveau & Bouton d'exportation */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <div className="inline-flex p-1 rounded-2xl bg-[#F7F5F0] border border-[#E3DEC9] text-xs font-bold">
              {(['L1', 'L2', 'L3', 'M1', 'M2', 'DIPES_I', 'DIPES_II'] as AcademicLevel[]).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setAcademicLevel(lvl)}
                  className={`px-2.5 py-1 rounded-xl transition-all ${
                    academicLevel === lvl
                      ? 'bg-[#5C4033] text-white shadow-xs'
                      : 'text-[#6E5D4F] hover:text-[#2C2218]'
                  }`}
                >
                  {lvl.replace('_', ' ')}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={handleOpenPdfModal}
              className="px-4 py-2 rounded-2xl bg-[#5C4033] hover:bg-[#4A3328] text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
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
            PANNEAU GAUCHE (3 cols) : RÉFÉRENTIEL MINESUP & COMPÉTENCES
        ════════════════════════════════════════════════════════════════════ */}
        <div className="lg:col-span-3 space-y-4">
          <div className="rounded-3xl bg-[#F7F5F0] border border-[#E3DEC9] p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#E3DEC9]/70 pb-3">
              <span className="text-xs font-black text-[#5C4033] uppercase tracking-wider flex items-center gap-1.5">
                <School size={14} />
                Filière & Syllabus
              </span>
              <button
                type="button"
                onClick={handleCopyRef}
                title="Copier référence officielle"
                className="p-1 rounded-lg text-[#8C7355] hover:text-[#5C4033] hover:bg-white transition-colors"
              >
                {copiedRef ? <Check size={13} className="text-emerald-700" /> : <Copy size={13} />}
              </button>
            </div>

            {/* Menu déroulant des 14 institutions certifiées */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#8C7355] uppercase tracking-wider">
                Établissement (14 répertoriés)
              </label>
              <select
                value={selectedFiliereId}
                onChange={(e) => setSelectedFiliereId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#E3DEC9] text-xs font-bold text-[#2C2218] focus:outline-hidden focus:ring-2 focus:ring-[#5C4033]/20"
              >
                {LAB_01_FILIERES.map((f) => (
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
              <div className="text-[11px] font-bold text-[#5C4033]">
                {currentFiliere.faculte}
              </div>
              <div className="text-[11px] text-[#6E5D4F]">
                Campus : {currentFiliere.campus} ({currentFiliere.region})
              </div>
              <div className="pt-2 border-t border-[#E3DEC9]/70 flex items-center justify-between text-[11px]">
                <span className="text-[#8C7355] font-semibold">Folio MINESUP :</span>
                <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-black border border-amber-200">
                  Page {currentFiliere.pageDossier}
                </span>
              </div>
            </div>

            {/* Codes UE & Volume du Syllabus */}
            <div className="space-y-2 text-xs">
              <div className="text-[11px] font-bold text-[#8C7355] uppercase tracking-wider flex items-center gap-1">
                <BookOpen size={12} className="text-[#5C4033]" />
                Unités d'Enseignement Clés
              </div>
              <div className="flex flex-wrap gap-1.5">
                {currentFiliere.syllabusInfo.codeUeExemples.map((ue) => (
                  <span
                    key={ue}
                    className="px-2.5 py-1 rounded-lg bg-white border border-[#E3DEC9] font-mono text-[11px] font-bold text-[#5C4033]"
                  >
                    {ue}
                  </span>
                ))}
              </div>
            </div>

            {/* Compétences visées avec cases interactives */}
            <div className="space-y-2.5 pt-2 border-t border-[#E3DEC9]/70">
              <div className="text-[11px] font-bold text-[#8C7355] uppercase tracking-wider flex items-center gap-1">
                <GraduationCap size={13} className="text-[#5C4033]" />
                Objectifs & Compétences TP
              </div>

              <div className="space-y-2">
                {[
                  { id: 'skill_det', label: "Calcul de déterminant et test d'inversibilité" },
                  { id: 'skill_eigen', label: "Détermination des valeurs propres spectrales" },
                  { id: 'skill_tangent', label: "Dérivation numérique & tracé de tangente" },
                  { id: 'skill_simpson', label: "Quadrature numérique (Méthode de Simpson)" },
                ].map((sk) => (
                  <button
                    key={sk.id}
                    type="button"
                    onClick={() => toggleSkill(sk.id)}
                    className="w-full text-left p-2 rounded-xl bg-white border border-[#E3DEC9] hover:border-[#5C4033]/40 transition-all flex items-start gap-2 text-xs"
                  >
                    <div
                      className={`w-4 h-4 rounded-md mt-0.5 flex items-center justify-center shrink-0 border transition-all ${
                        completedSkills[sk.id]
                          ? 'bg-[#5C4033] border-[#5C4033] text-white'
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
            PANNEAU CENTRAL (6 cols) : MOTEUR INTERACTIF (Algèbre & Analyse)
        ════════════════════════════════════════════════════════════════════ */}
        <div className="lg:col-span-6 space-y-4">
          <div className="rounded-3xl bg-[#F7F5F0] border border-[#E3DEC9] p-5 sm:p-6 space-y-5 shadow-xs">
            {/* Onglets du Moteur de Calcul */}
            <div className="flex items-center justify-between border-b border-[#E3DEC9]/70 pb-3">
              <div className="inline-flex p-1 rounded-2xl bg-[#EFECE6] border border-[#E3DEC9] text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setActiveCenterTab('matrix')}
                  className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                    activeCenterTab === 'matrix'
                      ? 'bg-[#5C4033] text-white shadow-xs'
                      : 'text-[#6E5D4F] hover:text-[#2C2218]'
                  }`}
                >
                  <Binary size={13} />
                  <span>Algèbre Matricielle</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveCenterTab('calculus')}
                  className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                    activeCenterTab === 'calculus'
                      ? 'bg-[#5C4033] text-white shadow-xs'
                      : 'text-[#6E5D4F] hover:text-[#2C2218]'
                  }`}
                >
                  <TrendingUp size={13} />
                  <span>Analyse & Tracé</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveCenterTab('katex')}
                  className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                    activeCenterTab === 'katex'
                      ? 'bg-[#5C4033] text-white shadow-xs'
                      : 'text-[#6E5D4F] hover:text-[#2C2218]'
                  }`}
                >
                  <Sigma size={13} />
                  <span>Formules KaTeX</span>
                </button>
              </div>

              <span className="text-[11px] font-bold text-[#8C7355] flex items-center gap-1">
                <Sparkles size={12} className="text-[#5C4033]" />
                Moteur Interactif
              </span>
            </div>

            {/* 1. MOTEUR : MATRICES & VALEURS PROPRES */}
            {activeCenterTab === 'matrix' && (
              <div className="space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-sm font-black text-[#2C2218] flex items-center gap-1.5">
                    <Binary size={16} className="text-[#5C4033]" />
                    Matrice Réelle <KaTeXMath math="M \in \mathcal{M}_2(\mathbb{R})" className="ml-1" />
                  </h3>

                  {/* Presets rapides */}
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <span className="text-[#8C7355] font-semibold">Presets :</span>
                    <button
                      type="button"
                      onClick={() => applyMatrixPreset('identity')}
                      className="px-2 py-0.5 rounded-lg bg-white border border-[#E3DEC9] font-bold hover:bg-[#EFECE6]"
                    >
                      Identité
                    </button>
                    <button
                      type="button"
                      onClick={() => applyMatrixPreset('rotation')}
                      className="px-2 py-0.5 rounded-lg bg-white border border-[#E3DEC9] font-bold hover:bg-[#EFECE6]"
                    >
                      Rotation 90°
                    </button>
                    <button
                      type="button"
                      onClick={() => applyMatrixPreset('singular')}
                      className="px-2 py-0.5 rounded-lg bg-white border border-[#E3DEC9] font-bold hover:bg-[#EFECE6]"
                    >
                      Singulière
                    </button>
                  </div>
                </div>

                {/* Saisie de la grille 2x2 */}
                <div className="p-4 rounded-2xl bg-[#EFECE6] border border-[#E3DEC9] flex flex-col sm:flex-row items-center justify-center gap-6">
                  <div className="grid grid-cols-2 gap-3 max-w-[200px]">
                    <div>
                      <span className="text-[10px] text-[#8C7355] font-mono block">a (1,1)</span>
                      <input
                        type="number"
                        value={matA}
                        onChange={(e) => setMatA(parseFloat(e.target.value) || 0)}
                        className="w-full px-2 py-1.5 rounded-xl bg-white border border-[#E3DEC9] font-mono text-center font-bold text-[#2C2218]"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-[#8C7355] font-mono block">b (1,2)</span>
                      <input
                        type="number"
                        value={matB}
                        onChange={(e) => setMatB(parseFloat(e.target.value) || 0)}
                        className="w-full px-2 py-1.5 rounded-xl bg-white border border-[#E3DEC9] font-mono text-center font-bold text-[#2C2218]"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-[#8C7355] font-mono block">c (2,1)</span>
                      <input
                        type="number"
                        value={matC}
                        onChange={(e) => setMatC(parseFloat(e.target.value) || 0)}
                        className="w-full px-2 py-1.5 rounded-xl bg-white border border-[#E3DEC9] font-mono text-center font-bold text-[#2C2218]"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-[#8C7355] font-mono block">d (2,2)</span>
                      <input
                        type="number"
                        value={matD}
                        onChange={(e) => setMatD(parseFloat(e.target.value) || 0)}
                        className="w-full px-2 py-1.5 rounded-xl bg-white border border-[#E3DEC9] font-mono text-center font-bold text-[#2C2218]"
                      />
                    </div>
                  </div>

                  {/* Rendu KaTeX en direct */}
                  <div className="p-4 rounded-xl bg-white border border-[#E3DEC9] text-center min-w-[150px]">
                    <div className="text-[10px] uppercase font-bold text-[#8C7355] mb-1">
                      Représentation Formelle
                    </div>
                    <KaTeXMath
                      math={`M = \\begin{pmatrix} ${matA} & ${matB} \\\\ ${matC} & ${matD} \\end{pmatrix}`}
                      block
                    />
                  </div>
                </div>

                {/* Métriques d'algèbre calculées */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-2xl bg-white border border-[#E3DEC9]">
                    <span className="text-[#8C7355] font-bold block text-[11px]">Déterminant</span>
                    <span className="text-base font-black text-[#5C4033] font-mono">{det}</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-white border border-[#E3DEC9]">
                    <span className="text-[#8C7355] font-bold block text-[11px]">Trace</span>
                    <span className="text-base font-black text-[#2C2218] font-mono">{trace}</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-white border border-[#E3DEC9]">
                    <span className="text-[#8C7355] font-bold block text-[11px]">Rang</span>
                    <span className="text-base font-black text-[#4338CA] font-mono">
                      {Math.abs(det) > 1e-12 ? 2 : matA === 0 && matB === 0 && matC === 0 && matD === 0 ? 0 : 1}
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-white border border-[#E3DEC9]">
                    <span className="text-[#8C7355] font-bold block text-[11px]">Discriminant Δ</span>
                    <span className="text-base font-black text-[#8C7355] font-mono">{delta}</span>
                  </div>
                </div>

                {/* Spectre et Inverse */}
                <div className="p-4 rounded-2xl bg-white border border-[#E3DEC9] space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#8C7355]">Spectre des Valeurs Propres :</span>
                    <span className="font-mono font-bold text-[#5C4033]">
                      {eigenvalues.type === 'real_distinct' && (
                        <span>
                          λ₁ = {eigenvalues.l1?.toFixed(3)}, λ₂ = {eigenvalues.l2?.toFixed(3)}
                        </span>
                      )}
                      {eigenvalues.type === 'real_double' && (
                        <span>λ₀ = {eigenvalues.l0?.toFixed(3)} (racine double)</span>
                      )}
                      {eigenvalues.type === 'complex' && (
                        <span>
                          {eigenvalues.re?.toFixed(3)} ± {eigenvalues.im?.toFixed(3)} i (complexes)
                        </span>
                      )}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-[#E3DEC9]/70 flex items-center justify-between">
                    <span className="font-bold text-[#8C7355]">Inverse M⁻¹ :</span>
                    {inverseMatrix ? (
                      <span className="font-mono text-[11px] text-[#2C2218]">
                        [[{inverseMatrix.a.toFixed(2)}, {inverseMatrix.b.toFixed(2)}], [{inverseMatrix.c.toFixed(2)}, {inverseMatrix.d.toFixed(2)}]]
                      </span>
                    ) : (
                      <span className="font-bold text-rose-700 text-xs">Non Inversible (det = 0)</span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 2. MOTEUR : ANALYSE NUMÉRIQUE & TRACÉ */}
            {activeCenterTab === 'calculus' && (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="inline-flex p-1 rounded-xl bg-[#EFECE6] border border-[#E3DEC9] text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => setFuncKey('poly')}
                      className={`px-2.5 py-1 rounded-lg ${
                        funcKey === 'poly' ? 'bg-[#5C4033] text-white' : 'text-[#6E5D4F]'
                      }`}
                    >
                      x³ - 2x + 1
                    </button>
                    <button
                      type="button"
                      onClick={() => setFuncKey('trig')}
                      className={`px-2.5 py-1 rounded-lg ${
                        funcKey === 'trig' ? 'bg-[#5C4033] text-white' : 'text-[#6E5D4F]'
                      }`}
                    >
                      sin(x)cos(2x)
                    </button>
                    <button
                      type="button"
                      onClick={() => setFuncKey('exp')}
                      className={`px-2.5 py-1 rounded-lg ${
                        funcKey === 'exp' ? 'bg-[#5C4033] text-white' : 'text-[#6E5D4F]'
                      }`}
                    >
                      e^(-x/2)cos(x)
                    </button>
                    <button
                      type="button"
                      onClick={() => setFuncKey('gauss')}
                      className={`px-2.5 py-1 rounded-lg ${
                        funcKey === 'gauss' ? 'bg-[#5C4033] text-white' : 'text-[#6E5D4F]'
                      }`}
                    >
                      e^(-x²) (Gauss)
                    </button>
                  </div>

                  <span className="text-xs font-bold text-[#5C4033]">Tracé Numérique Haute Précision</span>
                </div>

                {/* Graphique SVG Interactif */}
                <div className="p-3 rounded-2xl bg-white border border-[#E3DEC9]">
                  <svg viewBox="0 0 400 220" className="w-full h-48 select-none">
                    {/* Grille douce */}
                    <line x1="0" y1="110" x2="400" y2="110" stroke="#E3DEC9" strokeWidth="1.5" />
                    <line x1="200" y1="0" x2="200" y2="220" stroke="#E3DEC9" strokeWidth="1.5" />

                    {/* Bornes d'intégration en transparence */}
                    <rect
                      x={toSvgX(Math.min(intA, intB))}
                      y="10"
                      width={Math.abs(toSvgX(intB) - toSvgX(intA))}
                      height="200"
                      fill="#5C4033"
                      fillOpacity="0.08"
                    />

                    {/* Courbe f(x) */}
                    <path d={svgPathD} fill="none" stroke="#5C4033" strokeWidth="2.5" />

                    {/* Point courant (x0, f(x0)) */}
                    <circle
                      cx={toSvgX(xVal)}
                      cy={toSvgY(fxVal)}
                      r="5"
                      fill="#4338CA"
                      stroke="#FFFFFF"
                      strokeWidth="2"
                    />

                    {/* Tangente au point x0 */}
                    {(() => {
                      const x1 = xVal - 0.8;
                      const y1 = fxVal - 0.8 * fPrimeVal;
                      const x2 = xVal + 0.8;
                      const y2 = fxVal + 0.8 * fPrimeVal;
                      return (
                        <line
                          x1={toSvgX(x1)}
                          y1={toSvgY(y1)}
                          x2={toSvgX(x2)}
                          y2={toSvgY(y2)}
                          stroke="#8C7355"
                          strokeWidth="1.8"
                          strokeDasharray="4 3"
                        />
                      );
                    })()}
                  </svg>
                </div>

                {/* Curseur et paramètres */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-2xl bg-[#EFECE6] border border-[#E3DEC9] space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-[#8C7355]">Curseur x₀ :</span>
                      <span className="font-mono font-black text-[#5C4033]">{xVal.toFixed(2)}</span>
                    </div>
                    <input
                      type="range"
                      min="-2.5"
                      max="2.5"
                      step="0.05"
                      value={xVal}
                      onChange={(e) => setXVal(parseFloat(e.target.value))}
                      className="w-full accent-[#5C4033]"
                    />
                    <div className="flex justify-between text-[11px] font-mono text-[#2C2218]">
                      <span>f(x₀) = {fxVal.toFixed(3)}</span>
                      <span>f'(x₀) ≈ {fPrimeVal.toFixed(3)}</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#EFECE6] border border-[#E3DEC9] space-y-2">
                    <span className="font-bold text-[#8C7355] block">
                      Intégration de Simpson [a, b]
                    </span>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={intA}
                        onChange={(e) => setIntA(parseFloat(e.target.value) || 0)}
                        className="w-16 px-2 py-1 rounded-lg bg-white border border-[#E3DEC9] font-mono text-xs"
                      />
                      <span className="text-[#8C7355]">à</span>
                      <input
                        type="number"
                        value={intB}
                        onChange={(e) => setIntB(parseFloat(e.target.value) || 0)}
                        className="w-16 px-2 py-1 rounded-lg bg-white border border-[#E3DEC9] font-mono text-xs"
                      />
                    </div>
                    <div className="text-[11px] font-bold text-[#5C4033]">
                      Résultat numérique : <span className="font-mono">{simpsonIntegral.toFixed(4)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 3. MOTEUR : PLAYGROUND KATEX */}
            {activeCenterTab === 'katex' && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#8C7355] uppercase tracking-wider">
                    Saisie de Formule LaTeX
                  </label>
                  <textarea
                    rows={3}
                    value={customLatex}
                    onChange={(e) => setCustomLatex(e.target.value)}
                    className="w-full p-3 rounded-2xl bg-white border border-[#E3DEC9] font-mono text-xs text-[#2C2218] focus:outline-hidden focus:ring-2 focus:ring-[#5C4033]/20"
                  />
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {[
                    { label: 'EDP Chaleur', code: '\\frac{\\partial u}{\\partial t} = \\alpha \\nabla^2 u' },
                    { label: 'Schrödinger', code: 'i\\hbar \\frac{\\partial}{\\partial t} \\Psi = \\hat{H}\\Psi' },
                    { label: 'Théorème Central', code: '\\frac{\\bar{X}_n - \\mu}{\\sigma / \\sqrt{n}} \\xrightarrow{\\mathcal{D}} \\mathcal{N}(0, 1)' },
                  ].map((snip) => (
                    <button
                      key={snip.label}
                      type="button"
                      onClick={() => setCustomLatex(snip.code)}
                      className="px-2.5 py-1 rounded-lg bg-[#EFECE6] border border-[#E3DEC9] text-[11px] font-bold text-[#5C4033] hover:bg-white"
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
            PANNEAU DROIT (3 cols) : VALIDATION, SYNTHÈSE & JOURNAL DE TP
        ════════════════════════════════════════════════════════════════════ */}
        <div className="lg:col-span-3 space-y-4">
          <div className="rounded-3xl bg-[#F7F5F0] border border-[#E3DEC9] p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#E3DEC9]/70 pb-3">
              <span className="text-xs font-black text-[#5C4033] uppercase tracking-wider flex items-center gap-1.5">
                <FileCheck size={14} />
                Validation & Diagnostic
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            {/* Diagnostic Algébrique en direct */}
            <div className="p-3.5 rounded-2xl bg-white border border-[#E3DEC9] space-y-2 text-xs">
              <div className="font-bold text-[#2C2218] flex items-center gap-1.5">
                <Info size={13} className="text-[#5C4033]" />
                Interprétation du Système
              </div>
              <p className="text-[11px] text-[#6E5D4F] leading-relaxed">
                {Math.abs(det) > 1e-12 ? (
                  <>
                    <strong className="text-emerald-800">Isomorphisme Linéaire :</strong> Le déterminant est non nul ({det}). L'endomorphisme associé est injectif et bijectif sur <KaTeXMath math="\mathbb{R}^2" />. L'espace image est de dimension 2 (rang maximal).
                  </>
                ) : (
                  <>
                    <strong className="text-rose-700">Matrice Singulière :</strong> Le noyau <KaTeXMath math="\ker(M)" /> est non réduit à zéro. Il y a écrasement de volume dans la transformation.
                  </>
                )}
              </p>
            </div>

            {/* Théorèmes et Références Syllabus */}
            <div className="p-3.5 rounded-2xl bg-[#EFECE6] border border-[#E3DEC9] space-y-1.5 text-xs">
              <div className="text-[11px] font-bold text-[#8C7355] uppercase tracking-wider flex items-center gap-1">
                <Award size={12} className="text-[#5C4033]" />
                Théorèmes Fondateurs
              </div>
              <ul className="text-[11px] text-[#6E5D4F] space-y-1">
                <li className="flex items-center gap-1">
                  <CheckCircle2 size={11} className="text-emerald-700 shrink-0" />
                  <span>Théorème du rang : dim E = dim Ker + dim Im</span>
                </li>
                <li className="flex items-center gap-1">
                  <CheckCircle2 size={11} className="text-emerald-700 shrink-0" />
                  <span>Cayley-Hamilton : P_M(M) = 0</span>
                </li>
                <li className="flex items-center gap-1">
                  <CheckCircle2 size={11} className="text-emerald-700 shrink-0" />
                  <span>Théorème fondamental de l'analyse</span>
                </li>
              </ul>
            </div>

            {/* Champs Étudiant & Matricule */}
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
                  Notes de Synthèse TP
                </label>
                <textarea
                  rows={3}
                  value={tpNotes}
                  onChange={(e) => setTpNotes(e.target.value)}
                  className="w-full p-2 rounded-xl bg-white border border-[#E3DEC9] text-[11px] text-[#2C2218]"
                />
              </div>
            </div>

            {/* Bouton d'action principal */}
            <button
              type="button"
              onClick={handleOpenPdfModal}
              className="w-full py-2.5 rounded-2xl bg-[#5C4033] hover:bg-[#4A3328] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
            >
              <Download size={13} />
              <span>Générer Compte-Rendu PDF</span>
            </button>

            <button
              type="button"
              onClick={handleExportTextBackup}
              className="w-full py-1.5 text-center text-[10px] text-[#8C7355] hover:text-[#5C4033] font-semibold transition-colors"
            >
              Télécharger copie de secours (.txt)
            </button>
          </div>
        </div>
      </div>

      {/* ─── MODALE D'EXPORTATION & PRÉVISUALISATION PDF CERTIFIÉ ─────────────── */}
      <MathReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        filiere={currentFiliere}
        academicLevel={academicLevel}
        studentName={studentName}
        studentMatricule={studentMatricule}
        matrixData={{
          a: matA,
          b: matB,
          c: matC,
          d: matD,
          det,
          trace,
          rank: Math.abs(det) > 1e-12 ? 2 : matA === 0 && matB === 0 && matC === 0 && matD === 0 ? 0 : 1,
          isInvertible: Math.abs(det) > 1e-12,
          eigenvaluesText,
        }}
        calculusData={{
          functionName: funcKey,
          x0: xVal,
          fx0: fxVal,
          fPrimeX0: fPrimeVal,
          integralA: intA,
          integralB: intB,
          simpsonResult: simpsonIntegral,
        }}
        customLatex={customLatex}
        studentNotes={tpNotes}
      />
    </div>
  );
}
