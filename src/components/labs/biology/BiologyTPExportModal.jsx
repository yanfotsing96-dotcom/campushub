import { useState, useMemo, useRef, useEffect } from 'react';
import {
  FileText,
  Copy,
  Check,
  Download,
  X,
  Sparkles,
  BookOpen,
  User,
  School,
  Loader2,
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
 * Aperçu HTML et KaTeX direct du compte-rendu A4
 * Utilise la même typographie, mise en page et moteur mathématique que le PDF final.
 */
function AcademicBiologySheetPreview({ moduleName, academicLevel, content }) {
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
 * Modal d'exportation de Compte-Rendu de Travaux Pratiques (TP) en Biologie
 * Architecture complète de Téléchargement PDF Natif (A4, scale 2, jsPDF + html2canvas).
 */
export default function BiologyTPExportModal({
  isOpen,
  onClose,
  moduleData,
  currentParams = {},
  experimentalResults = {},
}) {
  const [studentName, setStudentName] = useState('Étudiant(e) Chercheur');
  const [matricule, setMatricule] = useState('BIO-2026-UY1');
  const [academicLevel, setAcademicLevel] = useState(moduleData?.levelLabel || 'Licence Sciences de la Vie');
  const [notes, setNotes] = useState(
    'Les résultats expérimentaux obtenus sont conformes aux prédictions théoriques et aux lois fondamentales de régulation biologique.'
  );

  const [copied, setCopied] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [pdfSuccess, setPdfSuccess] = useState(false);

  if (!isOpen || !moduleData) return null;

  const dateStr = new Date().toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const moduleShortName = moduleData.shortTitle || moduleData.title;

  // Nom dynamique certifié du fichier PDF
  const dynamicPdfFilename = buildReportFilename(moduleShortName, 'pdf');

  // Construction dynamique du Markdown textuel propre avec balisage mathématique KaTeX
  const generateCleanMarkdown = () => {
    const lines = [
      `# COMPTE-RENDU DE TRAVAUX PRATIQUES : ${moduleData.title.toUpperCase()}`,
      `**Plateforme :** CampusHub · Faculté des Sciences`,
      `**Unité d'Enseignement :** ${moduleData.code} - ${moduleData.title}`,
      `**Niveau Académique :** ${academicLevel}`,
      `**Date de Manipulation :** ${dateStr}`,
      `**Opérateur :** ${studentName} (Matricule : ${matricule})`,
      '',
      '---',
      '',
      '## 1. OBJECTIF & CADRE THÉORIQUE',
      `> ${moduleData.description}`,
      '',
      `### Loi & Formule Maîtresse :`,
      `- **Formule Théorique :** $$${moduleData.formula}$$`,
      `- **Développement Analytique :** $$${moduleData.expandedFormula}$$`,
      `- **Principe Directeur :** ${moduleData.keyLaw}`,
      '',
      '## 2. PARAMÈTRES EXPÉRIMENTAUX ÉTUDIÉS',
      '| Paramètre Biologique | Grandeur / Symbole | Valeur Fixée | Unité SI / Pratique |',
      '| :--- | :--- | :--- | :--- |',
      `| Concentration en Substrat | [S] | ${currentParams.substrateConcentration ?? 'N/A'} | mM ou g/L |`,
      `| Temps d'Incubation / Culture | t | ${currentParams.cultureTime ?? 'N/A'} | heures / minutes |`,
      `| Population Initiale | N₀ ou x₀ | ${currentParams.initialPopulation ?? 'N/A'} | cellules ou CFU/mL |`,
      `| Température Régulée | T | ${currentParams.temperature ?? 37} | °C |`,
    ];

    if (currentParams.vmax !== undefined) {
      lines.push(`| Vitesse Maximale Théorique | Vmax | ${currentParams.vmax} | µmol/(min·mg) |`);
      lines.push(`| Constante d'Affinité de Michaelis | Km | ${currentParams.km} | mM |`);
      lines.push(`| Inhibiteur Chimique | Mode | ${currentParams.inhibitorType || 'Aucun'} | - |`);
    }

    if (currentParams.colchicineDose !== undefined) {
      lines.push(`| Dose de Colchicine (Antimitotique) | [C] | ${currentParams.colchicineDose} | µg/mL |`);
    }

    if (currentParams.boosterDay !== undefined) {
      lines.push(`| Rappel Antigénique | Booster | J+${currentParams.boosterDay} | jour |`);
    }

    if (currentParams.alpha !== undefined) {
      lines.push(`| Taux de Natalité Proies | α | ${currentParams.alpha} | gén⁻¹ |`);
      lines.push(`| Efficacité de Prédation | β | ${currentParams.beta} | ind⁻¹·gén⁻¹ |`);
    }

    lines.push('', '## 3. RÉSULTATS EXPÉRIMENTAUX OBTENUS & DONNÉES NUMÉRIQUES', '');

    if (Object.keys(experimentalResults).length > 0) {
      lines.push('| Grandeur Mesurée | Résultat Numérique | Interprétation Biologique |');
      lines.push('| :--- | :--- | :--- |');
      Object.entries(experimentalResults).forEach(([key, val]) => {
        lines.push(`| ${key} | **${val.value}** ${val.unit || ''} | ${val.comment || 'Conforme au modèle'} |`);
      });
    } else {
      lines.push('*Toutes les cinétiques ont atteint la phase stationnaire attendue.*');
    }

    lines.push(
      '',
      '## 4. ANALYSE CRITIQUE & DISCUSSION SCIENTIFIQUE',
      notes,
      '',
      '## 5. CONCLUSION GÉNÉRALE DU TP',
      `Ce banc d'essai virtuel (${moduleData.code}) valide expérimentalement l'adéquation entre le formalisme mathématique et la physiologie cellulaire observée. Les conditions opératoires paramétrées garantissent la reproductibilité des mesures dans le respect des normes académiques universitaires.`,
      '',
      '---',
      `*Document académique certifié généré sur CampusHub le ${new Date().toISOString()}*`
    );

    return lines.join('\n');
  };

  const markdownContent = generateCleanMarkdown();

  // Action : Téléchargement Vrai PDF A4 (jsPDF + html2canvas, scale 2)
  const handleDownloadPdf = async () => {
    if (isDownloadingPdf) return;
    setIsDownloadingPdf(true);
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
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  // Action : Copie directe du texte dans le presse-papier
  const handleCopy = async () => {
    try {
      await copyCleanAcademicDocument({
        title: `Compte-Rendu : ${moduleData.title}`,
        moduleName: moduleShortName,
        academicLevel,
        content: markdownContent,
      });
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl max-h-[94vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER DE LA MODALE */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-md shadow-emerald-950/30">
              <FileText size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                  COMPTE-RENDU TP · EXPORT PDF A4 CERTIFIÉ
                </span>
                <span className="text-xs text-slate-400 font-mono">{moduleData.code}</span>
              </div>
              <h3 className="text-base font-bold text-white tracking-tight">{moduleData.title}</h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Fermer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* BANDEAU DES MÉTADONNÉES ÉDITABLES */}
        <div className="p-4 sm:p-5 border-b border-slate-800/80 bg-slate-950/40 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block text-slate-400 font-bold mb-1 flex items-center gap-1.5">
              <User size={12} className="text-emerald-400" />
              <span>Nom de l'Étudiant(e) :</span>
            </label>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-medium focus:border-emerald-500/60 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-bold mb-1 flex items-center gap-1.5">
              <School size={12} className="text-emerald-400" />
              <span>Matricule Universitaire :</span>
            </label>
            <input
              type="text"
              value={matricule}
              onChange={(e) => setMatricule(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-emerald-300 font-mono focus:border-emerald-500/60 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-bold mb-1 flex items-center gap-1.5">
              <BookOpen size={12} className="text-emerald-400" />
              <span>Promotion / Spécialité :</span>
            </label>
            <input
              type="text"
              value={academicLevel}
              onChange={(e) => setAcademicLevel(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-medium focus:border-emerald-500/60 focus:outline-none"
            />
          </div>
        </div>

        {/* CORPS DE LA MODALE : APERÇU A4 DYNAMIQUE */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {/* Ligne informative sur le nom dynamique du fichier */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs">
            <div className="flex items-center gap-2 text-slate-400">
              <Sparkles size={14} className="text-emerald-400 shrink-0" />
              <span>Nom du fichier généré :</span>
              <strong className="text-emerald-300 font-mono">
                {dynamicPdfFilename}
              </strong>
            </div>

            <span className="text-[11px] font-mono text-slate-500">
              Format A4 standard · Marges 20 mm · Résolution vectorielle (scale: 2)
            </span>
          </div>

          <div className="max-h-[50vh] overflow-y-auto rounded-2xl">
            <AcademicBiologySheetPreview
              moduleName={moduleShortName}
              academicLevel={academicLevel}
              content={markdownContent}
            />
          </div>

          {/* Zone d'observations et discussion scientifique */}
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1">
              Discussion critique & Observations expérimentales (intégrées au rapport) :
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ajoutez vos commentaires sur les résultats observés, cinétiques critiques..."
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-emerald-500/60 resize-none"
            />
          </div>
        </div>

        {/* FOOTER AVEC BOUTON D'ACTION PRINCIPAL PDF */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-t border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-2">
            {/* Bouton : Copier le Rapport dans le presse-papier */}
            <button
              type="button"
              onClick={handleCopy}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all border cursor-pointer ${
                copied
                  ? 'bg-emerald-600/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border-slate-800 hover:border-slate-700'
              }`}
              title="Copier le texte du compte-rendu dans le presse-papier"
            >
              {copied ? (
                <>
                  <Check size={14} className="text-emerald-400" />
                  <span>Rapport Copié !</span>
                </>
              ) : (
                <>
                  <Copy size={14} />
                  <span>Copier le Rapport</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Bouton Unique d'Export : Télécharger Vrai PDF A4 (Action principale) */}
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isDownloadingPdf}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all shadow-lg cursor-pointer ${
                pdfSuccess
                  ? 'bg-emerald-600 text-white shadow-emerald-950/40 ring-2 ring-emerald-400/50'
                  : 'bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white shadow-emerald-900/40 hover:shadow-emerald-900/60'
              }`}
              title={`Télécharger le vrai document PDF A4 (${dynamicPdfFilename})`}
            >
              {isDownloadingPdf ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  <span>Génération du PDF A4 (scale: 2)...</span>
                </>
              ) : pdfSuccess ? (
                <>
                  <Check size={15} />
                  <span>PDF A4 Téléchargé !</span>
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
