import { useState, useRef, useMemo } from 'react';
import {
  X,
  Printer,
  Download,
  FileCheck,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  Loader2,
} from 'lucide-react';
import {
  generateAcademicHtmlDocument,
  triggerAcademicDownload,
} from '../../../services/documentDownloadService';

/**
 * Modal d'Aperçu Haute Fidélité de Mise en Page & Impression PDF A4
 * Utilise exactement le même HTML/CSS et rendu KaTeX que le fichier PDF téléchargé.
 */
export default function PdfPreviewModal({
  isOpen,
  onClose,
  title = 'Compte-Rendu de Travaux Pratiques',
  moduleName = 'Chimie Générale',
  academicLevel = 'Licence · Master',
  content = '',
}) {
  const iframeRef = useRef(null);
  const objectRef = useRef(null);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [previewTag, setPreviewTag] = useState('iframe'); // 'iframe' | 'object'
  const [selectedFormat, setSelectedFormat] = useState('pdf'); // 'pdf' | 'md'

  // Génération du document HTML autonome haute fidélité (Markdown + KaTeX + CSS A4)
  const htmlDocument = useMemo(() => {
    return generateAcademicHtmlDocument({
      title,
      moduleName,
      academicLevel,
      content,
    });
  }, [title, moduleName, academicLevel, content]);

  // Création d'une URL Blob pour la balise <object>
  const blobUrl = useMemo(() => {
    if (!htmlDocument) return '';
    const blob = new Blob([htmlDocument], { type: 'text/html;charset=utf-8' });
    return URL.createObjectURL(blob);
  }, [htmlDocument]);

  if (!isOpen) return null;

  // Déclenchement de l'impression native du navigateur (@media print A4 20mm)
  const handlePrint = () => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.focus();
      iframeRef.current.contentWindow.print();
    }
  };

  // Téléchargement du vrai PDF A4 (.pdf) ou du Markdown brut (.md)
  const handleDownload = async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    try {
      await triggerAcademicDownload({
        title,
        moduleName,
        academicLevel,
        content,
        fileFormat: selectedFormat,
      });
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 2500);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`relative w-full bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-left transition-all duration-300 ${
          isFullscreen ? 'h-[98vh] max-w-[98vw]' : 'h-[92vh] max-w-5xl'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* En-tête de la Modal d'Aperçu */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <FileCheck size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono">
                  APERÇU DOCUMENT &amp; MISE EN PAGE PDF A4
                </span>
                <span className="text-xs text-slate-400 font-mono">{academicLevel}</span>
              </div>
              <h3 className="text-base font-bold text-white tracking-tight">{title}</h3>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title={isFullscreen ? 'Fenêtre normale' : 'Plein écran'}
            >
              {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Fermer l'aperçu"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Barre d'outils de contrôle & zoom */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-2.5 bg-slate-950/70 border-b border-slate-800/80 text-xs">
          <div className="flex flex-wrap items-center gap-3 text-slate-300 font-medium">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Mise en page A4 (marges 20 mm) · Formules KaTeX rendues</span>
            </div>

            {/* Sélecteur de balise d'affichage (iframe vs object) */}
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-0.5 text-[11px]">
              <span className="px-2 text-slate-400 font-mono text-[10px]">Balise :</span>
              <button
                type="button"
                onClick={() => setPreviewTag('iframe')}
                className={`px-2.5 py-1 rounded-lg font-mono transition-colors ${
                  previewTag === 'iframe'
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Affichage via la balise standard <iframe>"
              >
                &lt;iframe&gt;
              </button>
              <button
                type="button"
                onClick={() => setPreviewTag('object')}
                className={`px-2.5 py-1 rounded-lg font-mono transition-colors ${
                  previewTag === 'object'
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Affichage via la balise document <object>"
              >
                &lt;object&gt;
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Sélecteur de format de téléchargement (.pdf / .md) */}
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-0.5 text-[11px]">
              <span className="px-2 text-slate-400 font-mono text-[10px]">Format :</span>
              <button
                type="button"
                onClick={() => setSelectedFormat('pdf')}
                className={`px-2.5 py-1 rounded-lg font-mono transition-colors ${
                  selectedFormat === 'pdf'
                    ? 'bg-violet-600 text-white font-bold'
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
                    ? 'bg-violet-600 text-white font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Document Markdown brut (.md)"
              >
                .md
              </button>
            </div>

            {/* Contrôles de zoom */}
            <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-xl p-1 text-slate-300">
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.max(60, z - 10))}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                title="Zoom arrière"
              >
                <ZoomOut size={14} />
              </button>
              <span className="font-mono text-[11px] px-2 text-slate-300 font-semibold min-w-[42px] text-center">
                {zoomLevel}%
              </span>
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.min(140, z + 10))}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                title="Zoom avant"
              >
                <ZoomIn size={14} />
              </button>
              <button
                type="button"
                onClick={() => setZoomLevel(100)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors ml-1"
                title="Réinitialiser zoom à 100%"
              >
                <RotateCcw size={13} />
              </button>
            </div>
          </div>
        </div>

        {/* Zone de prévisualisation simulant une feuille A4 */}
        <div className="flex-1 overflow-auto bg-slate-950/90 p-4 sm:p-8 flex justify-center items-start">
          <div
            className="w-full max-w-[820px] bg-white rounded-xl shadow-2xl border border-slate-300 overflow-hidden transition-transform origin-top"
            style={{ transform: `scale(${zoomLevel / 100})`, minHeight: '920px' }}
          >
            {previewTag === 'iframe' ? (
              <iframe
                ref={iframeRef}
                title="Aperçu PDF A4 du Compte-Rendu"
                srcDoc={htmlDocument}
                className="w-full h-[920px] border-none bg-white block"
              />
            ) : (
              <object
                ref={objectRef}
                data={blobUrl}
                type="text/html"
                title="Aperçu PDF A4 du Compte-Rendu (balise object)"
                className="w-full h-[920px] border-none bg-white block"
              >
                <iframe
                  ref={iframeRef}
                  title="Aperçu PDF A4 de secours"
                  srcDoc={htmlDocument}
                  className="w-full h-[920px] border-none bg-white block"
                />
              </object>
            )}
          </div>
        </div>

        {/* Pied de page d'actions (Imprimer / PDF, Télécharger, Fermer) */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-t border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Sparkles size={14} className="text-violet-400" />
            <span>Le fichier téléchargé utilise exactement ce rendu HTML/CSS et KaTeX au format A4.</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all"
            >
              Fermer l'Aperçu
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-2 transition-all border border-slate-700 hover:border-slate-600 shadow-sm"
              title="Imprimer avec le CSS @media print (A4, marges 20mm)"
            >
              <Printer size={15} />
              <span>Imprimer / PDF</span>
            </button>

            <button
              type="button"
              onClick={handleDownload}
              disabled={isDownloading}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-lg ${
                downloadSuccess
                  ? 'bg-emerald-600 text-white shadow-emerald-900/30'
                  : 'bg-violet-600 hover:bg-violet-500 text-white shadow-violet-900/30'
              }`}
              title={`Télécharger le rapport en format .${selectedFormat}`}
            >
              {isDownloading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  <span>Génération...</span>
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
          </div>
        </div>
      </div>
    </div>
  );
}
