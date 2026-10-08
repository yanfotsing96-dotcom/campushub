import { useState, useMemo, useRef, useEffect } from 'react';
import {
  FileText,
  Copy,
  Check,
  Download,
  X,
  Printer,
  Sparkles,
  Eye,
  Loader2,
} from 'lucide-react';
import {
  buildAcademicSheetInnerHtml,
  getAcademicReportCss,
  generateAcademicHtmlDocument,
  triggerAcademicDownload,
  copyCleanAcademicDocument,
  applyKatexAutoRender,
} from '../../../services/documentDownloadService';
import PdfPreviewModal from './PdfPreviewModal';

/**
 * Aperçu HTML/KaTeX utilisant exactement le même HTML et CSS que le PDF A4
 */
function AcademicHtmlPreview({ moduleName, academicLevel, content }) {
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
    <div className="bg-slate-200/90 p-3 sm:p-5 rounded-2xl border border-slate-700 shadow-inner overflow-x-auto">
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
 * Modal de Compte-Rendu de Travaux Pratiques (TP)
 * Aperçu HTML/KaTeX identique au PDF et téléchargement direct en PDF A4 (.pdf) ou Markdown (.md).
 */
export default function TPReportModal({
  isOpen,
  onClose,
  title = 'Compte-Rendu de Travaux Pratiques',
  moduleName = 'Chimie Générale',
  academicLevel = 'Licence 1 - Master 2',
  reportContent = '',
}) {
  const [copied, setCopied] = useState(false);
  const [isPdfPreviewOpen, setIsPdfPreviewOpen] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState('pdf'); // 'pdf' | 'md'
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const fullHtmlDocument = useMemo(() => {
    if (!isOpen) return '';
    return generateAcademicHtmlDocument({
      title,
      moduleName,
      academicLevel,
      content: reportContent,
    });
  }, [isOpen, title, moduleName, academicLevel, reportContent]);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await copyCleanAcademicDocument({
        title,
        moduleName,
        academicLevel,
        content: reportContent,
      });
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Téléchargement direct d'un vrai PDF A4 (.pdf) ou du Markdown brut (.md)
  const handleDownload = async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    try {
      await triggerAcademicDownload({
        title,
        moduleName,
        academicLevel,
        content: reportContent,
        fileFormat: selectedFormat,
      });
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 2500);
    } finally {
      setIsDownloading(false);
    }
  };

  // Impression via un iframe caché avec le même HTML/CSS et @media print (A4, marges 20mm)
  const handlePrint = () => {
    const printIframe = document.createElement('iframe');
    printIframe.style.position = 'fixed';
    printIframe.style.right = '0';
    printIframe.style.bottom = '0';
    printIframe.style.width = '0';
    printIframe.style.height = '0';
    printIframe.style.border = '0';
    document.body.appendChild(printIframe);

    const doc = printIframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(fullHtmlDocument);
      doc.close();
      setTimeout(() => {
        printIframe.contentWindow?.focus();
        printIframe.contentWindow?.print();
        setTimeout(() => {
          if (printIframe.parentNode) {
            printIframe.parentNode.removeChild(printIframe);
          }
        }, 1500);
      }, 350);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl max-h-[92vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header de la Modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
              <FileText size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono">
                  COMPTE-RENDU DE TP · A4
                </span>
                <span className="text-xs text-slate-400 font-mono">{academicLevel}</span>
              </div>
              <h3 className="text-base font-bold text-white tracking-tight">{title}</h3>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Sélecteur de format .pdf / .md */}
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-0.5 text-[11px]">
              <span className="px-2 text-slate-400 font-mono text-[10px]">Format :</span>
              <button
                type="button"
                onClick={() => setSelectedFormat('pdf')}
                className={`px-2.5 py-1 rounded-lg font-mono transition-colors ${
                  selectedFormat === 'pdf'
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Document PDF A4 officiel (.pdf)"
              >
                .pdf
              </button>
              <button
                type="button"
                onClick={() => setSelectedFormat('md')}
                className={`px-2.5 py-1 rounded-lg font-mono transition-colors ${
                  selectedFormat === 'md'
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Document Markdown brut (.md)"
              >
                .md
              </button>
            </div>

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

        {/* Sous-en-tête informatif */}
        <div className="flex items-center justify-between px-6 py-2 bg-slate-950/70 border-b border-slate-800/80 text-xs">
          <span className="text-slate-400 font-medium">
            Aperçu fidèle A4 (Markdown + KaTeX) — identique au fichier PDF exporté
          </span>
          <span className="font-mono text-[11px] text-slate-500 hidden sm:inline">
            Édité le {new Date().toLocaleDateString('fr-FR')}
          </span>
        </div>

        {/* Corps de la Modal : Feuille A4 rendue avec le même HTML/CSS que le PDF */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          <div className="max-h-[58vh] overflow-y-auto rounded-2xl">
            <AcademicHtmlPreview
              moduleName={moduleName}
              academicLevel={academicLevel}
              content={reportContent}
            />
          </div>

          <div className="p-3 rounded-xl bg-violet-950/30 border border-violet-500/20 text-xs text-violet-300 flex items-center gap-2">
            <Sparkles size={16} className="text-violet-400 shrink-0" />
            <span>
              Formules scientifiques rendues avec KaTeX et mise en page A4 normalisée (marges 20 mm). Cliquez sur « Télécharger » pour obtenir le fichier <strong>.{selectedFormat}</strong>.
            </span>
          </div>
        </div>

        {/* Footer avec Actions (Imprimer / PDF, Aperçu PDF, Télécharger, Copier le Rapport) */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-t border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 transition-all"
            >
              <Printer size={15} />
              <span>Imprimer / PDF</span>
            </button>

            <button
              type="button"
              onClick={() => setIsPdfPreviewOpen(true)}
              className="px-4 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 hover:border-indigo-500/50 text-xs font-semibold flex items-center gap-2 transition-all"
              title="Ouvrir l'aperçu plein écran A4"
            >
              <Eye size={15} />
              <span>Aperçu Plein Écran</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownload}
              disabled={isDownloading}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-lg ${
                downloadSuccess
                  ? 'bg-emerald-600 text-white shadow-emerald-900/30'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-900/30'
              }`}
              title={`Télécharger le rapport en format .${selectedFormat}`}
            >
              {isDownloading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  <span>Génération PDF...</span>
                </>
              ) : (
                <>
                  <Download size={15} />
                  <span>
                    {downloadSuccess
                      ? `Téléchargé (.${selectedFormat}) !`
                      : `Télécharger (.${selectedFormat})`}
                  </span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleCopy}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-lg ${
                copied
                  ? 'bg-emerald-600 text-white shadow-emerald-900/30'
                  : 'bg-violet-600 hover:bg-violet-500 text-white shadow-violet-900/30'
              }`}
            >
              {copied ? (
                <>
                  <Check size={15} />
                  <span>Rapport Copié !</span>
                </>
              ) : (
                <>
                  <Copy size={15} />
                  <span>Copier Markdown</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Modal d'Aperçu PDF Haute Fidélité (iframe / object) */}
      <PdfPreviewModal
        isOpen={isPdfPreviewOpen}
        onClose={() => setIsPdfPreviewOpen(false)}
        title={title}
        moduleName={moduleName}
        academicLevel={academicLevel}
        content={reportContent}
      />
    </div>
  );
}
