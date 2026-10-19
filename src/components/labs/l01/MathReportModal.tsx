import { useState } from 'react';
import {
  X,
  Download,
  FileCheck,
  Hash,
  School,
  GraduationCap,
  Copy,
  Check,
  Sparkles,
  Info,
  Calendar,
  User,
  ShieldCheck,
} from 'lucide-react';
import type { IFiliereL01, AcademicLevel } from '../../../types/lab01';
import { exportLab01Pdf, type IExportLab01Data } from '../../../services/exportLab01Pdf';
import KaTeXMath from '../../common/KaTeXMath';

interface MathReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  filiere: IFiliereL01;
  academicLevel: AcademicLevel;
  studentName: string;
  studentMatricule: string;
  matrixData: {
    a: number;
    b: number;
    c: number;
    d: number;
    det: number;
    trace: number;
    rank: number;
    isInvertible: boolean;
    eigenvaluesText: string;
  };
  calculusData: {
    functionName: string;
    x0: number;
    fx0: number;
    fPrimeX0: number;
    integralA: number;
    integralB: number;
    simpsonResult: number;
  };
  customLatex?: string;
  studentNotes?: string;
}

export default function MathReportModal({
  isOpen,
  onClose,
  filiere,
  academicLevel,
  studentName: initialName,
  studentMatricule: initialMatricule,
  matrixData,
  calculusData,
  customLatex,
  studentNotes: initialNotes,
}: MathReportModalProps) {
  const [name, setName] = useState(initialName || '');
  const [matricule, setMatricule] = useState(initialMatricule || '');
  const [supervisor, setSupervisor] = useState('Dr. Nguiffo / Pr. Bitjong');
  const [notes, setNotes] = useState(
    initialNotes ||
      'Validation expérimentale complète. Le calcul spectral et la quadrature numérique de Simpson concordent avec les prédictions théoriques du cours.'
  );
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const handleDownloadPdf = () => {
    setIsExporting(true);
    try {
      const exportData: IExportLab01Data = {
        filiere,
        academicLevel,
        studentName: name,
        studentMatricule: matricule,
        supervisorName: supervisor,
        matrixData,
        calculusData,
        customLatex,
        studentNotes: notes,
      };
      exportLab01Pdf(exportData);
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopySummary = () => {
    const text = `COMPTE-RENDU TP LAB L01 : MATHÉMATIQUES & STATISTIQUES
Établissement : ${filiere.universite} (${filiere.faculte})
Page MINESUP : Page ${filiere.pageDossier}
Étudiant : ${name} (${matricule}) - Niveau : ${academicLevel}
Déterminant M : ${matrixData.det} | Inversible : ${matrixData.isInvertible ? 'OUI' : 'NON'}
Quadrature Simpson : ${calculusData.simpsonResult.toFixed(4)}
Notes : ${notes}`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs text-left animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl rounded-3xl bg-[#F7F5F0] border border-[#E3DEC9] shadow-2xl p-6 sm:p-7 max-h-[92vh] overflow-y-auto space-y-5">
        {/* Bouton de Fermeture */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-[#8C7355] hover:text-[#2C2218] hover:bg-[#EFECE6] transition-all"
        >
          <X size={18} />
        </button>

        {/* En-tête Modal */}
        <div className="space-y-1.5 pr-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-black bg-[#5C4033] text-white">
              {filiere.sigleUniversite} · LAB L01
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-900 border border-amber-200 flex items-center gap-1">
              <Hash size={12} className="text-amber-800" />
              Page {filiere.pageDossier} MINESUP
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#E3DEC9] text-[#5C4033]">
              Niveau {academicLevel}
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-[#2C2218] flex items-center gap-2">
            <FileCheck size={22} className="text-[#5C4033]" />
            Prévisualiseur & Exporteur de Compte-Rendu PDF
          </h3>
          <p className="text-xs text-[#6E5D4F]">
            Génération conforme au standard académique des universités d'État et ENS du Cameroun
          </p>
        </div>

        {/* Aperçu de l'en-tête officiel du document */}
        <div className="p-4 rounded-2xl bg-[#EFECE6] border border-[#E3DEC9] space-y-3 text-xs">
          <div className="flex items-center justify-between border-b border-[#E3DEC9]/70 pb-2">
            <div className="font-bold text-[#2C2218] flex items-center gap-1.5">
              <School size={14} className="text-[#5C4033]" />
              {filiere.universite}
            </div>
            <span className="text-[11px] text-[#8C7355] font-semibold flex items-center gap-1">
              <Calendar size={12} />
              {new Date().toLocaleDateString('fr-FR')}
            </span>
          </div>

          <div className="text-[11px] text-[#6E5D4F] flex flex-wrap justify-between gap-2">
            <span>Faculté : <strong className="text-[#2C2218]">{filiere.faculte}</strong></span>
            <span>Campus : <strong className="text-[#2C2218]">{filiere.campus}</strong></span>
            <span>Folio Certifié : <strong className="text-amber-900">Page {filiere.pageDossier}</strong></span>
          </div>
        </div>

        {/* Données de l'étudiant éditables */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-[#8C7355] uppercase flex items-center gap-1">
              <User size={12} />
              Nom de l'Étudiant
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nom et prénom..."
              className="w-full px-3 py-2 rounded-xl bg-white border border-[#E3DEC9] font-medium text-[#2C2218]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-[#8C7355] uppercase">
              Matricule Académique
            </label>
            <input
              type="text"
              value={matricule}
              onChange={(e) => setMatricule(e.target.value)}
              placeholder="ex: 24M0912"
              className="w-full px-3 py-2 rounded-xl bg-white border border-[#E3DEC9] font-mono text-[#2C2218]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-[#8C7355] uppercase">
              Enseignant / Tuteur
            </label>
            <input
              type="text"
              value={supervisor}
              onChange={(e) => setSupervisor(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white border border-[#E3DEC9] font-medium text-[#2C2218]"
            />
          </div>
        </div>

        {/* Aperçu des Résultats Mathématiques & KaTeX */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-[#8C7355] uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles size={13} className="text-[#5C4033]" />
            Résultats Inclus dans le PDF
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* Volet Algèbre */}
            <div className="p-3.5 rounded-2xl bg-white border border-[#E3DEC9] space-y-2">
              <span className="font-bold text-[#5C4033] block border-b border-[#E3DEC9]/60 pb-1">
                1. Algèbre Matricielle
              </span>
              <div className="text-center py-1">
                <KaTeXMath
                  math={`M = \\begin{pmatrix} ${matrixData.a} & ${matrixData.b} \\\\ ${matrixData.c} & ${matrixData.d} \\end{pmatrix}`}
                  block
                />
              </div>
              <div className="space-y-0.5 text-[11px] text-[#2C2218]">
                <div>• det(M) = <strong>{matrixData.det}</strong> ({matrixData.isInvertible ? 'Inversible' : 'Singulière'})</div>
                <div>• Trace = <strong>{matrixData.trace}</strong> | Rang = <strong>{matrixData.rank}</strong></div>
                <div>• Spectre : {matrixData.eigenvaluesText}</div>
              </div>
            </div>

            {/* Volet Analyse */}
            <div className="p-3.5 rounded-2xl bg-white border border-[#E3DEC9] space-y-2">
              <span className="font-bold text-[#5C4033] block border-b border-[#E3DEC9]/60 pb-1">
                2. Analyse Numérique & Tracé
              </span>
              <div className="space-y-1 text-[11px] text-[#2C2218] pt-1">
                <div>• Fonction : <strong>{calculusData.functionName}</strong></div>
                <div>• Point x₀ = {calculusData.x0} : f(x₀) = <strong>{calculusData.fx0.toFixed(3)}</strong></div>
                <div>• Dérivée locale f'(x₀) ≈ <strong>{calculusData.fPrimeX0.toFixed(3)}</strong></div>
                <div>
                  • Quadrature Simpson [{calculusData.integralA}, {calculusData.integralB}] ={' '}
                  <strong className="text-[#5C4033] font-mono text-xs">
                    {calculusData.simpsonResult.toFixed(4)}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Note & Synthèse de l'étudiant */}
        <div className="space-y-1.5 text-xs">
          <label className="text-[11px] font-bold text-[#8C7355] uppercase">
            Observations & Synthèse de l'Étudiant (imprimée dans le rapport)
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-2.5 rounded-xl bg-white border border-[#E3DEC9] text-xs text-[#2C2218]"
          />
        </div>

        {/* Badge de certification */}
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2.5 text-xs text-emerald-900">
          <ShieldCheck size={16} className="text-emerald-700 shrink-0" />
          <span>
            Document certifié conforme aux normes du Ministère de l'Enseignement Supérieur (MINESUP) et au recueil national CampusHub.
          </span>
        </div>

        {/* Pied de Modal avec Actions */}
        <div className="pt-3 border-t border-[#E3DEC9] flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleCopySummary}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-white border border-[#E3DEC9] hover:border-[#5C4033] text-xs font-bold text-[#5C4033] flex items-center justify-center gap-1.5 transition-all"
          >
            {copied ? (
              <>
                <Check size={14} className="text-emerald-700" />
                <span>Copié dans le presse-papier</span>
              </>
            ) : (
              <>
                <Copy size={14} />
                <span>Copier le texte de synthèse</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-bold text-[#6E5D4F] hover:bg-[#EFECE6] transition-all"
            >
              Annuler
            </button>
            <button
              type="button"
              disabled={isExporting}
              onClick={handleDownloadPdf}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-[#5C4033] hover:bg-[#4A3328] text-white text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-2"
            >
              <Download size={14} />
              <span>{isExporting ? 'Génération...' : 'Télécharger le PDF Certifié A4'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
