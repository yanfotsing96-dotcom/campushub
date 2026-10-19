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
  Calendar,
  User,
  ShieldCheck,
  Zap,
  Eye,
} from 'lucide-react';
import type { IFiliereL02, IRLCExperimentData, IOpticsExperimentData } from '../../../types/lab02';
import type { AcademicLevel } from '../../../types/lab01';
import { exportLab02Pdf } from '../../../services/exportLab02Pdf';
import KaTeXMath from '../../common/KaTeXMath';

interface PhysicsReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  filiere: IFiliereL02;
  academicLevel: AcademicLevel;
  studentName: string;
  studentMatricule: string;
  rlcData: IRLCExperimentData;
  opticsData: IOpticsExperimentData;
  customLatex?: string;
  studentNotes?: string;
}

export default function PhysicsReportModal({
  isOpen,
  onClose,
  filiere,
  academicLevel,
  studentName: initialName,
  studentMatricule: initialMatricule,
  rlcData,
  opticsData,
  customLatex,
  studentNotes: initialNotes,
}: PhysicsReportModalProps) {
  const [name, setName] = useState(initialName || '');
  const [matricule, setMatricule] = useState(initialMatricule || '');
  const [supervisor, setSupervisor] = useState('Dr. Kenmogne / Pr. Tchoffo');
  const [notes, setNotes] = useState(
    initialNotes ||
      'Validation expérimentale complète. Le phénomène de résonance du circuit RLC série et la conjugaison de la lentille mince convergent avec les prévisions théoriques du cours.'
  );
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const handleDownloadPdf = () => {
    setIsExporting(true);
    try {
      exportLab02Pdf({
        filiere,
        academicLevel,
        studentName: name,
        studentMatricule: matricule,
        supervisorName: supervisor,
        rlcData,
        opticsData,
        customLatex,
        studentNotes: notes,
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopySummary = () => {
    const text = `COMPTE-RENDU TP LAB L02 : PHYSIQUE FONDAMENTALE & APPLIQUÉE
Établissement : ${filiere.universite} (${filiere.faculte})
Page Dossier MINESUP : Page ${filiere.pageDossier}
Étudiant : ${name} (${matricule}) - Niveau : ${academicLevel}
Circuit RLC : f0 = ${rlcData.resonanceFrequency.toFixed(2)} Hz | Q = ${rlcData.qualityFactor.toFixed(2)} | Z = ${rlcData.impedance.toFixed(2)} Ω
Banc Optique : f' = ${opticsData.focalLength} cm | p' = ${opticsData.imageDistance.toFixed(2)} cm | γ = ${opticsData.magnification.toFixed(2)}
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
            <span className="px-3 py-1 rounded-full text-xs font-black bg-[#0284C7] text-white">
              {filiere.sigleUniversite} · LAB L02 PHYSIQUE
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-black bg-sky-100 text-sky-900 border border-sky-200 flex items-center gap-1">
              <Hash size={12} className="text-sky-800" />
              Page {filiere.pageDossier} MINESUP
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#E3DEC9] text-[#5C4033]">
              Niveau {academicLevel}
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-[#2C2218] flex items-center gap-2">
            <FileCheck size={22} className="text-[#0284C7]" />
            Prévisualiseur & Exporteur de Compte-Rendu PDF (Physique)
          </h3>
          <p className="text-xs text-[#6E5D4F]">
            Génération conforme au standard académique des universités d'État et ENS du Cameroun (Pages 2-3 du document officiel)
          </p>
        </div>

        {/* Aperçu Institutionnel */}
        <div className="p-4 rounded-2xl bg-[#EFECE6] border border-[#E3DEC9] space-y-3 text-xs">
          <div className="flex items-center justify-between border-b border-[#E3DEC9]/70 pb-2">
            <div className="font-bold text-[#2C2218] flex items-center gap-1.5">
              <School size={14} className="text-[#0284C7]" />
              {filiere.universite}
            </div>
            <span className="text-[11px] text-[#8C7355] font-semibold flex items-center gap-1">
              <Calendar size={12} />
              {new Date().toLocaleDateString('fr-FR')}
            </span>
          </div>

          <div className="text-[11px] text-[#6E5D4F] flex flex-wrap justify-between gap-2">
            <span>Faculté / École : <strong className="text-[#2C2218]">{filiere.faculte}</strong></span>
            <span>Campus : <strong className="text-[#2C2218]">{filiere.campus}</strong></span>
            <span>Folio Officiel : <strong className="text-sky-900">Page {filiere.pageDossier}</strong></span>
          </div>
        </div>

        {/* Informations de l'Étudiant */}
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
              placeholder="ex: 24P0318"
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

        {/* Aperçu des Résultats Expérimentaux */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {/* RLC */}
          <div className="p-3.5 rounded-2xl bg-white border border-[#E3DEC9] space-y-2">
            <span className="font-bold text-[#0284C7] flex items-center gap-1.5 border-b border-[#E3DEC9]/60 pb-1">
              <Zap size={13} />
              1. Circuit RLC & Résonance
            </span>
            <div className="text-center py-1">
              <KaTeXMath math="f_0 = \frac{1}{2\pi\sqrt{LC}}" block />
            </div>
            <div className="space-y-1 text-[11px] text-[#2C2218]">
              <div>• Fréquence propre f₀ : <strong>{rlcData.resonanceFrequency.toFixed(2)} Hz</strong></div>
              <div>• Facteur de qualité Q : <strong>{rlcData.qualityFactor.toFixed(2)}</strong></div>
              <div>• Impédance Z(f) : <strong>{rlcData.impedance.toFixed(2)} Ω</strong> (φ = {rlcData.phaseDeg.toFixed(1)}°)</div>
            </div>
          </div>

          {/* Optique */}
          <div className="p-3.5 rounded-2xl bg-white border border-[#E3DEC9] space-y-2">
            <span className="font-bold text-[#0284C7] flex items-center gap-1.5 border-b border-[#E3DEC9]/60 pb-1">
              <Eye size={13} />
              2. Optique Géométrique
            </span>
            <div className="text-center py-1">
              <KaTeXMath math="\frac{1}{\overline{OA'}} - \frac{1}{\overline{OA}} = \frac{1}{f'}" block />
            </div>
            <div className="space-y-1 text-[11px] text-[#2C2218]">
              <div>• Distance focale f' : <strong>{opticsData.focalLength} cm</strong></div>
              <div>• Position image p' (OA') : <strong>{opticsData.imageDistance.toFixed(2)} cm</strong></div>
              <div>• Grandissement γ : <strong>{opticsData.magnification.toFixed(2)}</strong></div>
            </div>
          </div>
        </div>

        {/* Note de Synthèse */}
        <div className="space-y-1.5 text-xs">
          <label className="text-[11px] font-bold text-[#8C7355] uppercase">
            Observations & Synthèse de l'Étudiant
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-2.5 rounded-xl bg-white border border-[#E3DEC9] text-xs text-[#2C2218]"
          />
        </div>

        {/* Sceau de conformité */}
        <div className="p-3 rounded-xl bg-sky-50 border border-sky-200 flex items-center gap-2.5 text-xs text-sky-900">
          <ShieldCheck size={16} className="text-sky-700 shrink-0" />
          <span>
            Document conforme aux normes du Ministère de l'Enseignement Supérieur (MINESUP) et au recueil CampusHub Cameroun (Page {filiere.pageDossier}).
          </span>
        </div>

        {/* Actions */}
        <div className="pt-3 border-t border-[#E3DEC9] flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleCopySummary}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-white border border-[#E3DEC9] hover:border-[#0284C7] text-xs font-bold text-[#0284C7] flex items-center justify-center gap-1.5 transition-all"
          >
            {copied ? (
              <>
                <Check size={14} className="text-emerald-700" />
                <span>Copié dans le presse-papier</span>
              </>
            ) : (
              <>
                <Copy size={14} />
                <span>Copier synthèse textuelle</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-bold text-[#6E5D4F] hover:bg-[#EFECE6] transition-all"
            >
              Fermer
            </button>
            <button
              type="button"
              disabled={isExporting}
              onClick={handleDownloadPdf}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-2"
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
