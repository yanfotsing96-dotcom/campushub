import { useState, useMemo, useRef, useEffect } from 'react';
import {
  FileText,
  Copy,
  Check,
  Download,
  X,
  Sparkles,
  User,
  School,
  Loader2,
  Calendar,
  GraduationCap,
  Eye,
} from 'lucide-react';
import {
  buildAcademicSheetInnerHtml,
  getAcademicReportCss,
  triggerAcademicDownload,
  copyCleanAcademicDocument,
  applyKatexAutoRender,
  buildReportFilename,
} from '../../../services/documentDownloadService';

/**
 * Aperçu direct HTML & KaTeX du compte-rendu A4 pour les sciences physiques
 * Utilise la typographie officielle, la mise en page académique et le moteur mathématique KaTeX
 */
function AcademicPhysicsSheetPreview({ moduleName, academicLevel, content }) {
  const containerRef = useRef(null);

  const sheetInnerHtml = useMemo(() => {
    return buildAcademicSheetInnerHtml({
      moduleName,
      academicLevel,
      content,
      includeFooter: true,
    });
  }, [moduleName, academicLevel, content]);

  const reportCss = useMemo(() => getAcademicReportCss(), []);

  useEffect(() => {
    if (containerRef.current) {
      applyKatexAutoRender(containerRef.current);
    }
  }, [sheetInnerHtml]);

  return (
    <div className="bg-slate-200/90 p-3 sm:p-5 rounded-2xl border border-slate-700 shadow-inner overflow-x-auto text-left">
      <style>{reportCss}</style>
      <div
        ref={containerRef}
        className="academic-report-sheet rounded-lg shadow-xl border border-slate-300"
        dangerouslySetInnerHTML={{ __html: sheetInnerHtml }}
      />
    </div>
  );
}

/**
 * Modal d'exportation de Compte-Rendu de Travaux Pratiques (TP) en Sciences Physiques
 * Architecture complète de Téléchargement PDF Natif (A4, scale 2, jsPDF + html2canvas).
 */
export default function TPExportModal({
  isOpen,
  onClose,
  moduleData,
  currentParams = {},
  computedResults = {},
}) {
  const [studentName, setStudentName] = useState('Étudiant(e) en Physique');
  const [matricule, setMatricule] = useState('PHY-2026-UY1');
  const [academicLevel, setAcademicLevel] = useState(
    moduleData?.levelLabel || 'Licence Sciences Physiques'
  );
  const [institution, setInstitution] = useState('Faculté des Sciences / École Polytechnique');
  const [notes, setNotes] = useState(
    'Les résultats expérimentaux obtenus corroborent fidèlement les prédictions du modèle théorique avec un accord satisfaisant aux bornes physiques.'
  );

  const [copied, setCopied] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [pdfSuccess, setPdfSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('preview'); // 'preview' | 'markdown'

  const dateStr = new Date().toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const moduleShortName = moduleData?.shortTitle || moduleData?.title || 'physique';

  // Nom dynamique certifié du fichier PDF selon la convention demandée : compte-rendu-[module]-[date].pdf
  const dynamicPdfFilename = buildReportFilename(moduleShortName, 'pdf');

  // Construction dynamique du Markdown textuel propre avec balisage mathématique KaTeX
  const markdownContent = useMemo(() => {
    if (!moduleData) return '';
    const lines = [
      `# COMPTE-RENDU DE TRAVAUX PRATIQUES : ${(moduleData.title || '').toUpperCase()}`,
      `**Plateforme :** CampusHub · ${institution}`,
      `**Unité d'Enseignement :** ${moduleData.code} - ${moduleData.title}`,
      `**Niveau Académique :** ${academicLevel}`,
      `**Date de la Manipulation :** ${dateStr}`,
      `**Étudiant(e) Expérimentateur(trice) :** ${studentName} (Matricule : \`${matricule}\`)`,
      ``,
      `---`,
      ``,
      `## 1. Contexte Théorique & Principes Fondamentaux`,
      `${moduleData.description}`,
      ``,
      `**Loi régissante maîtresse :** ${moduleData.keyLaw}`,
      ``,
      `**Formulation mathématique :**`,
      `$$${moduleData.formula}$$`,
      ``,
    ];

    if (moduleData.expandedFormula) {
      lines.push(`**Formulation développée / aux dérivées partielles :**`);
      lines.push(`$$${moduleData.expandedFormula}$$`);
      lines.push(``);
    }

    if (moduleData.learningOutcomes && moduleData.learningOutcomes.length > 0) {
      lines.push(`### Objectifs Pédagogiques Visés :`);
      moduleData.learningOutcomes.forEach((outcome, idx) => {
        lines.push(`${idx + 1}. ${outcome}`);
      });
      lines.push(``);
    }

    lines.push(
      `---`,
      ``,
      `## 2. Conditions Expérimentales & Paramètres Fixés`,
      ``,
      `Le tableau ci-dessous consigne les grandeurs d'entrée configurées sur le banc virtuel au cours de la manipulation :`,
      ``,
      `| Paramètre Physique | Valeur Fixée | Unité & Système |`,
      `| :--- | :--- | :--- |`
    );

    Object.entries(currentParams).forEach(([key, val]) => {
      lines.push(`| **${key}** | \`${val}\` | Système International (SI) |`);
    });

    lines.push(
      ``,
      `---`,
      ``,
      `## 3. Données Numériques & Résultats Calculés en Temps Réel`,
      ``,
      `| Grandeur Physique Calculée | Valeur Obtenue | Unité | Interprétation & Comportement |`,
      `| :--- | :--- | :--- | :--- |`
    );

    Object.entries(computedResults).forEach(([label, info]) => {
      const valStr = typeof info === 'object' ? `${info.val}` : `${info}`;
      const unitStr = typeof info === 'object' && info.unit ? info.unit : '';
      const commentStr =
        typeof info === 'object' && info.comment ? info.comment : 'Conforme au modèle analytique';
      lines.push(`| **${label}** | \`${valStr}\` | ${unitStr || '—'} | ${commentStr} |`);
    });

    lines.push(
      ``,
      `---`,
      ``,
      `## 4. Analyse Critique & Observations Personnelles`,
      `${notes}`,
      ``,
      `---`,
      ``,
      `## 5. Conclusion & Validation Académique`,
      `Les résultats observés sur ce laboratoire virtuel de physique corroborent de façon rigoureuse les lois fondamentales étudiées en cours magistral. La cohérence entre les valeurs théoriques et les points mesurés confirme la validité du protocole d'essai.`,
      ``,
      `*Rapport de TP officiel généré par CampusHub PhysicsLab Hub · Certifié conforme pour le cursus Licence / Master Sciences Physiques.*`
    );

    return lines.join('\n');
  }, [
    moduleData,
    institution,
    academicLevel,
    dateStr,
    studentName,
    matricule,
    currentParams,
    computedResults,
    notes,
  ]);

  // Déclencheur du téléchargement PDF natif A4 côté client
  const handleDownloadPdf = async () => {
    setIsDownloadingPdf(true);
    setPdfSuccess(false);

    try {
      await triggerAcademicDownload({
        title: `Compte-Rendu : ${moduleData.title}`,
        moduleName: moduleShortName,
        academicLevel,
        content: markdownContent,
        fileFormat: 'pdf',
      });
      setPdfSuccess(true);
      setTimeout(() => setPdfSuccess(false), 3000);
    } catch (err) {
      console.error('Erreur lors de la génération du PDF :', err);
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  // Copie propre du compte-rendu dans le presse-papier
  const handleCopy = async () => {
    const success = await copyCleanAcademicDocument(markdownContent);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isOpen || !moduleData) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="physics-tp-export-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md overflow-y-auto"
    >
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* EN-TÊTE DU MODAL */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shrink-0">
              <FileText size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="physics-tp-export-title" className="text-base sm:text-lg font-bold text-white">
                  Génération du Compte-Rendu de TP (PDF A4)
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {moduleData.code}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Document universitaire formaté A4 · Export PDF haute définition (scale: 2)
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Fermer le modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* CORPS SCROLLABLE DU MODAL */}
        <div className="p-5 overflow-y-auto space-y-5 text-left text-xs">
          {/* Métadonnées de l'étudiant */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <div>
              <label className="block text-slate-400 font-medium mb-1 flex items-center gap-1.5">
                <User size={12} className="text-indigo-400" />
                <span>Nom de l'étudiant(e)</span>
              </label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-medium focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1 flex items-center gap-1.5">
                <GraduationCap size={12} className="text-violet-400" />
                <span>Matricule / ID</span>
              </label>
              <input
                type="text"
                value={matricule}
                onChange={(e) => setMatricule(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono focus:border-violet-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1 flex items-center gap-1.5">
                <Calendar size={12} className="text-indigo-400" />
                <span>Niveau Académique</span>
              </label>
              <input
                type="text"
                value={academicLevel}
                onChange={(e) => setAcademicLevel(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1 flex items-center gap-1.5">
                <School size={12} className="text-violet-400" />
                <span>Établissement</span>
              </label>
              <input
                type="text"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white truncate focus:border-violet-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Saisie d'observations personnelles */}
          <div>
            <label className="block text-slate-300 font-bold mb-1.5 flex items-center gap-2">
              <Sparkles size={14} className="text-violet-400" />
              <span>Observations et analyse personnelle (Section 4 du rapport de TP) :</span>
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Saisissez ici vos constats physiques sur les incertitudes, déphasages ou limites du modèle..."
              className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-white text-xs leading-relaxed focus:border-indigo-500 focus:outline-none"
            />
          </div>

          {/* Onglets de prévisualisation */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                  activeTab === 'preview'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Eye size={12} />
                <span>Aperçu Document A4</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('markdown')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                  activeTab === 'markdown'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileText size={12} />
                <span>Texte Structuré</span>
              </button>
            </div>

            <div className="text-[11px] text-slate-400 font-mono hidden sm:flex items-center gap-1.5">
              <span className="text-indigo-400">Nom du fichier :</span>
              <span className="text-slate-300 font-bold">{dynamicPdfFilename}</span>
            </div>
          </div>

          {/* ZONE D'AFFICHAGE DE L'APERÇU */}
          {activeTab === 'preview' ? (
            <AcademicPhysicsSheetPreview
              moduleName={moduleShortName}
              academicLevel={academicLevel}
              content={markdownContent}
            />
          ) : (
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-300 max-h-80 overflow-y-auto font-mono text-[11px] leading-relaxed select-text whitespace-pre-wrap">
              {markdownContent}
            </div>
          )}
        </div>

        {/* PIED DE PAGE D'ACTIONS AVANCÉES (Sans .md et sans bouton Imprimer, conformément aux consignes) */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors text-xs font-semibold flex items-center gap-1.5 border border-slate-700"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              <span>{copied ? 'Copié !' : 'Copier le Rapport'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors text-xs font-semibold"
            >
              Fermer
            </button>

            {/* BOUTON UNIQUE D'EXPORTATION NATIVE PDF */}
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isDownloadingPdf}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
            >
              {isDownloadingPdf ? (
                <>
                  <Loader2 size={15} className="animate-spin text-white" />
                  <span>Génération du PDF A4 en cours...</span>
                </>
              ) : pdfSuccess ? (
                <>
                  <Check size={15} className="text-emerald-300" />
                  <span>PDF Téléchargé avec Succès !</span>
                </>
              ) : (
                <>
                  <Download size={15} />
                  <span>Télécharger PDF</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
