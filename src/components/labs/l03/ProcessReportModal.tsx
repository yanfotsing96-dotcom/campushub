import { useState } from 'react';
import {
  X,
  Download,
  FileCheck,
  Hash,
  School,
  Copy,
  Check,
  Sparkles,
  User,
  ShieldCheck,
  Activity,
  Layers,
  Thermometer,
} from 'lucide-react';
import type { IFiliereL03, ICstrReactorData, IDistillationData, IHeatExchangerData } from '../../../types/lab03';
import type { AcademicLevel } from '../../../types/lab01';
import { exportLab03Pdf } from '../../../services/exportLab03Pdf';
import KaTeXMath from '../../common/KaTeXMath';

interface ProcessReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  filiere: IFiliereL03;
  academicLevel: AcademicLevel;
  studentName: string;
  studentMatricule: string;
  cstrData: ICstrReactorData;
  distillationData?: IDistillationData;
  exchangerData?: IHeatExchangerData;
  customLatex?: string;
  studentNotes?: string;
}

export default function ProcessReportModal({
  isOpen,
  onClose,
  filiere,
  academicLevel,
  studentName: initialName,
  studentMatricule: initialMatricule,
  cstrData,
  distillationData,
  exchangerData,
  customLatex,
  studentNotes: initialNotes,
}: ProcessReportModalProps) {
  const [name, setName] = useState(initialName || '');
  const [matricule, setMatricule] = useState(initialMatricule || '');
  const [supervisor, setSupervisor] = useState('Dr. Ebanda / Pr. Nono');
  const [safetyApproved, setSafetyApproved] = useState(true);
  const [notes, setNotes] = useState(
    initialNotes ||
      'Validation de la réaction en réacteur agité continu (CSTR) et des opérations unitaires. Les bilans matière et énergie sont vérifiés avec un régime thermique stable sans risque d\'emballement.'
  );
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const handleDownloadPdf = () => {
    setIsExporting(true);
    try {
      exportLab03Pdf({
        filiere,
        academicLevel,
        studentName: name,
        studentMatricule: matricule,
        supervisorName: supervisor,
        cstrData,
        distillationData,
        exchangerData,
        customLatex,
        studentNotes: notes,
        safetyCompliant: safetyApproved,
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopySummary = () => {
    let text = `COMPTE-RENDU TP LAB L03 : CHIMIE & GÉNIE DES PROCÉDÉS
Établissement : ${filiere.universite} (${filiere.faculte})
Page MINESUP : Page ${filiere.pageDossier}
Étudiant : ${name} (${matricule}) - Niveau : ${academicLevel}
Superviseur : ${supervisor}

=== 1. RÉACTEUR CSTR ===
Volume = ${cstrData.reactorVolume} L | Débit = ${cstrData.volumetricFlowRate} L/min
Temps de passage τ = ${cstrData.residenceTimeMin.toFixed(2)} min | Conversion XA = ${cstrData.conversionRate.toFixed(1)}%
Puissance thermique = ${cstrData.heatGeneratedWatts.toFixed(1)} W`;

    if (distillationData) {
      text += `\n\n=== 2. DISTILLATION (MCCABE-THIELE) ===
Alimentation F = ${distillationData.feedFlowRate} kmol/h (zF=${distillationData.feedFractionLight})
Distillat xD = ${distillationData.distillateFraction} | Résidu xB = ${distillationData.bottomsFraction}
Taux de reflux R = ${distillationData.refluxRatio} (Rmin = ${distillationData.minRefluxRatio.toFixed(2)})
Plateaux théoriques : ${distillationData.theoreticalTrays} (Alimentation au plateau #${distillationData.feedTrayIndex})
Plateaux réels Murphree (75%) : ${distillationData.actualTrays}`;
    }

    if (exchangerData) {
      text += `\n\n=== 3. ÉCHANGEUR DE CHALEUR (DTLM) ===
Régime : ${exchangerData.flowArrangement === 'counter_current' ? 'Contre-courant' : 'Co-courant'}
Puissance thermique Φ = ${exchangerData.heatDutyKW.toFixed(1)} kW
DTLM = ${exchangerData.dtlmC.toFixed(2)} °C | Coeff global U = ${exchangerData.overallUCoeff} W/(m².K)
Surface requise A = ${exchangerData.requiredAreaM2.toFixed(2)} m²`;
    }

    text += `\n\nObservations : ${notes}`;

    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs text-left animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl rounded-3xl bg-[#F7F5F0] border border-[#E3DEC9] shadow-2xl p-6 sm:p-7 max-h-[92vh] overflow-y-auto space-y-5">
        {/* Bouton Fermeture */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-[#8C7355] hover:text-[#2C2218] hover:bg-[#EFECE6] transition-colors"
          title="Fermer"
        >
          <X size={18} />
        </button>

        {/* En-tête Modal */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-100 text-[#059669]">
              <FileCheck size={18} />
            </span>
            <div>
              <h3 className="text-base font-black text-[#2C2218]">
                Compte-Rendu de Travaux Pratiques & Pilote L03
              </h3>
              <p className="text-xs text-[#8C7355]">
                Génération automatisée du document certifié A4 aux normes MINESUP Cameroun
              </p>
            </div>
          </div>
        </div>

        {/* Fiche Institutionnelle */}
        <div className="p-3.5 rounded-2xl bg-white border border-[#E3DEC9] space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E3DEC9]/60 pb-2">
            <span className="text-xs font-black text-[#2C2218] flex items-center gap-1.5">
              <School size={14} className="text-[#059669]" />
              {filiere.universite}
            </span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-[#F7F5F0] border border-[#E3DEC9] text-[#059669] font-bold">
              {new Date().toLocaleDateString('fr-FR')}
            </span>
          </div>

          <div className="text-[11px] text-[#6E5D4F] flex flex-wrap justify-between gap-2">
            <span>
              Faculté / Établissement : <strong className="text-[#2C2218]">{filiere.faculte}</strong>
            </span>
            <span>
              Campus : <strong className="text-[#2C2218]">{filiere.campus}</strong>
            </span>
            <span>
              Folio Certifié : <strong className="text-emerald-900">Page {filiere.pageDossier}</strong>
            </span>
          </div>
        </div>

        {/* Coordonnées Étudiant */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-[#8C7355] uppercase flex items-center gap-1">
              <User size={12} />
              Nom de l'Opérateur (Étudiant)
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
            <label className="text-[11px] font-bold text-[#8C7355] uppercase flex items-center gap-1">
              <Hash size={12} />
              Matricule Académique
            </label>
            <input
              type="text"
              value={matricule}
              onChange={(e) => setMatricule(e.target.value)}
              placeholder="ex: 24GP012"
              className="w-full px-3 py-2 rounded-xl bg-white border border-[#E3DEC9] font-mono text-[#2C2218]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-[#8C7355] uppercase">
              Responsable de Halle Pilote
            </label>
            <input
              type="text"
              value={supervisor}
              onChange={(e) => setSupervisor(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white border border-[#E3DEC9] font-medium text-[#2C2218]"
            />
          </div>
        </div>

        {/* Aperçu des Résultats Procédés & KaTeX */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-[#8C7355] uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles size={13} className="text-[#059669]" />
            Synthèse des Données Simulatrices & Procédés
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            {/* Volet CSTR */}
            <div className="p-3.5 rounded-2xl bg-white border border-[#E3DEC9] space-y-2">
              <span className="font-bold text-[#059669] flex items-center gap-1.5 border-b border-[#E3DEC9]/60 pb-1">
                <Activity size={13} />
                1. Réacteur CSTR
              </span>
              <div className="text-center py-0.5">
                <KaTeXMath math="\tau = \frac{V}{Q}" block />
              </div>
              <div className="space-y-1 text-[11px] text-[#2C2218]">
                <div>
                  • Temps de passage τ : <strong>{cstrData.residenceTimeMin.toFixed(2)} min</strong>
                </div>
                <div>
                  • Taux de conversion :{' '}
                  <strong className="text-emerald-700">{cstrData.conversionRate.toFixed(1)}%</strong>
                </div>
                <div>
                  • Puissance thermique : <strong>{cstrData.heatGeneratedWatts.toFixed(0)} W</strong>
                </div>
              </div>
            </div>

            {/* Volet Distillation */}
            <div className="p-3.5 rounded-2xl bg-white border border-[#E3DEC9] space-y-2">
              <span className="font-bold text-[#059669] flex items-center gap-1.5 border-b border-[#E3DEC9]/60 pb-1">
                <Layers size={13} />
                2. Distillation McCabe-Thiele
              </span>
              <div className="text-center py-0.5">
                <KaTeXMath math="R = \frac{L}{D} \ge R_{\min}" block />
              </div>
              <div className="space-y-1 text-[11px] text-[#2C2218]">
                {distillationData ? (
                  <>
                    <div>
                      • Reflux R : <strong>{distillationData.refluxRatio}</strong> (Rmin :{' '}
                      {distillationData.minRefluxRatio.toFixed(2)})
                    </div>
                    <div>
                      • Plateaux théoriques :{' '}
                      <strong className="text-emerald-700">{distillationData.theoreticalTrays} étages</strong>
                    </div>
                    <div>
                      • Rebouilleur Qb : <strong>{distillationData.reboilerDutyKW.toFixed(0)} kW</strong>
                    </div>
                  </>
                ) : (
                  <div className="text-[#8C7355] italic">Configurée aux valeurs standard</div>
                )}
              </div>
            </div>

            {/* Volet Échangeur DTLM */}
            <div className="p-3.5 rounded-2xl bg-white border border-[#E3DEC9] space-y-2">
              <span className="font-bold text-[#059669] flex items-center gap-1.5 border-b border-[#E3DEC9]/60 pb-1">
                <Thermometer size={13} />
                3. Échangeur Thermique
              </span>
              <div className="text-center py-0.5">
                <KaTeXMath math="\dot{Q} = U \cdot A \cdot \Delta T_{\ln}" block />
              </div>
              <div className="space-y-1 text-[11px] text-[#2C2218]">
                {exchangerData ? (
                  <>
                    <div>
                      • DTLM (ΔTln) : <strong>{exchangerData.dtlmC.toFixed(1)} °C</strong>
                    </div>
                    <div>
                      • Surface requise A :{' '}
                      <strong className="text-emerald-700">{exchangerData.requiredAreaM2.toFixed(2)} m²</strong>
                    </div>
                    <div>
                      • Flux thermique Φ : <strong>{exchangerData.heatDutyKW.toFixed(1)} kW</strong>
                    </div>
                  </>
                ) : (
                  <div className="text-[#8C7355] italic">DTLM calculée selon le flux chaud/froid</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Validation Sécurité */}
        <div className="p-3 rounded-2xl bg-[#EFECE6] border border-[#E3DEC9] flex items-center justify-between text-xs">
          <span className="text-[#2C2218] font-bold">Certification du Port des EPI & Respect des FDS :</span>
          <button
            type="button"
            onClick={() => setSafetyApproved(!safetyApproved)}
            className={`px-3 py-1 rounded-xl text-xs font-black transition-all ${
              safetyApproved
                ? 'bg-[#059669] text-white shadow-xs'
                : 'bg-rose-100 text-rose-800 border border-rose-300'
            }`}
          >
            {safetyApproved ? 'EPI & FDS Validés' : 'Non Validé'}
          </button>
        </div>

        {/* Observations de l'Étudiant */}
        <div className="space-y-1.5 text-xs">
          <label className="text-[11px] font-bold text-[#8C7355] uppercase">
            Observations, Diagnostic HAZOP & Synthèse Opérateur
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-2.5 rounded-xl bg-white border border-[#E3DEC9] text-xs text-[#2C2218]"
          />
        </div>

        {/* Sceau de Conformité */}
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2.5 text-xs text-emerald-900">
          <ShieldCheck size={16} className="text-emerald-700 shrink-0" />
          <span>
            Document certifié MINESUP · Lab L03 Chimie & Génie des Procédés (Page {filiere.pageDossier}) · Halle Pilote Virtuelle CampusHub.
          </span>
        </div>

        {/* Actions */}
        <div className="pt-3 border-t border-[#E3DEC9] flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleCopySummary}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-white border border-[#E3DEC9] hover:border-[#059669] text-xs font-bold text-[#059669] flex items-center justify-center gap-1.5 transition-all"
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
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-2"
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
