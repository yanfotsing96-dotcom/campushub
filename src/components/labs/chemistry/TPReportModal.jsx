import { useState, useMemo } from 'react';
import {
  FileText,
  Copy,
  Check,
  Download,
  X,
  Printer,
  Sparkles,
  Eye,
} from 'lucide-react';
import {
  triggerAcademicDownload,
  formatDocumentForExport,
} from '../../../services/documentDownloadService';
import PdfPreviewModal from './PdfPreviewModal';

/**
 * Nettoie une expression mathématique ou scientifique des balises LaTeX brutes
 */
function sanitizeFormula(formulaStr) {
  if (!formulaStr) return '';
  return formulaStr
    .replace(/\\text\{([^}]+)\}/g, '$1')
    .replace(/\\times/g, '×')
    .replace(/\\cdot/g, '·')
    .replace(/\\iff/g, '⇔')
    .replace(/\\rightarrow|\\to/g, '➔')
    .replace(/\\Delta/g, 'Δ')
    .replace(/\\circ/g, '°')
    .replace(/\\log_\{?10\}?/g, 'log₁₀')
    .replace(/\\nu/g, 'ν')
    .replace(/\\max/g, 'max')
    .replace(/\\pm/g, '±')
    .replace(/\\([a-zA-Z]+)/g, '$1')
    .replace(/[{}]/g, '')
    .trim();
}

/**
 * Formate le texte en ligne pour interpréter le gras (**...**), le code (`...`) et les formules ($...$).
 * Élimine toute exposition de balises Markdown brutes.
 */
function renderInlineFormatted(text) {
  if (!text) return null;

  // Regex capturant **gras**, $formule$ et `code`
  const regex = /(\*\*.*?\*\*|\$.*?\$|`.*?`)/g;
  const parts = text.split(regex);

  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={idx} className="font-bold text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('$') && part.endsWith('$')) {
      const cleanMath = sanitizeFormula(part.slice(1, -1));
      return (
        <span
          key={idx}
          className="mx-1 px-1.5 py-0.5 rounded-md bg-slate-950 border border-indigo-500/30 text-cyan-300 font-mono text-[11px] font-semibold"
        >
          {cleanMath}
        </span>
      );
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <span
          key={idx}
          className="mx-1 px-1.5 py-0.5 rounded-md bg-slate-950 border border-slate-700 text-violet-300 font-mono text-[11px]"
        >
          {part.slice(1, -1)}
        </span>
      );
    }
    return <span key={idx}>{part}</span>;
  });
}

/**
 * Moteur de rendu visuel structuré permanent :
 * Convertit les flux de données en une mise en page d'article académique moderne,
 * sans aucune balise de code source exposée.
 */
function DocumentVisualRenderer({ content }) {
  const renderedBlocks = useMemo(() => {
    if (!content) return null;

    const lines = content.split('\n');
    const blocks = [];
    let currentTable = null;
    let currentList = null;

    const flushTable = () => {
      if (currentTable) {
        blocks.push(
          <div key={`table-${blocks.length}`} className="my-3 overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/70 shadow-sm">
            <table className="w-full text-left text-xs text-slate-200">
              <thead className="bg-slate-900 border-b border-slate-800 text-[11px] font-bold uppercase text-slate-400">
                <tr>
                  {currentTable.headers.map((th, hIdx) => (
                    <th key={hIdx} className="px-4 py-2.5">
                      {renderInlineFormatted(th.trim())}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
                {currentTable.rows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-slate-900/40 transition-colors">
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="px-4 py-2.5">
                        {renderInlineFormatted(cell.trim())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        currentTable = null;
      }
    };

    const flushList = () => {
      if (currentList) {
        if (currentList.type === 'ul') {
          blocks.push(
            <ul key={`ul-${blocks.length}`} className="my-2.5 space-y-1.5 pl-2">
              {currentList.items.map((it, iIdx) => (
                <li key={iIdx} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-1.5 shrink-0" />
                  <div>{renderInlineFormatted(it)}</div>
                </li>
              ))}
            </ul>
          );
        } else {
          blocks.push(
            <ol key={`ol-${blocks.length}`} className="my-2.5 space-y-1.5 pl-2">
              {currentList.items.map((it, iIdx) => (
                <li key={iIdx} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
                  <span className="font-mono text-violet-400 font-bold shrink-0">{iIdx + 1}.</span>
                  <div>{renderInlineFormatted(it)}</div>
                </li>
              ))}
            </ol>
          );
        }
        currentList = null;
      }
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Ligne de tableau
      if (line.startsWith('|') && line.endsWith('|')) {
        flushList();
        const cells = line.split('|').slice(1, -1);
        if (cells.every((c) => c.trim().match(/^:?-+:?$/))) {
          continue;
        }
        if (!currentTable) {
          currentTable = { headers: cells, rows: [] };
        } else {
          currentTable.rows.push(cells);
        }
        continue;
      } else {
        flushTable();
      }

      // Ligne vide
      if (!line) {
        flushList();
        continue;
      }

      // Titre principal
      if (line.startsWith('# ')) {
        flushList();
        blocks.push(
          <div key={`h1-${i}`} className="pb-3 border-b border-indigo-500/30 mb-4 mt-1">
            <h2 className="text-lg md:text-xl font-extrabold text-white tracking-tight">
              {renderInlineFormatted(line.slice(2))}
            </h2>
          </div>
        );
        continue;
      }

      // Titre de section
      if (line.startsWith('## ')) {
        flushList();
        blocks.push(
          <div key={`h2-${i}`} className="mt-5 mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded bg-violet-500 shrink-0" />
            <h3 className="text-sm md:text-base font-bold text-violet-200 tracking-tight">
              {renderInlineFormatted(line.slice(3))}
            </h3>
          </div>
        );
        continue;
      }

      // Sous-titre
      if (line.startsWith('### ')) {
        flushList();
        blocks.push(
          <h4 key={`h3-${i}`} className="text-xs md:text-sm font-semibold text-indigo-300 mt-3 mb-1">
            {renderInlineFormatted(line.slice(4))}
          </h4>
        );
        continue;
      }

      // Bloc de formule mathématique / chimique
      if (line.startsWith('$$') && line.endsWith('$$')) {
        flushList();
        const cleanFormula = sanitizeFormula(line.slice(2, -2));
        blocks.push(
          <div
            key={`math-${i}`}
            className="my-3.5 p-3.5 rounded-xl bg-gradient-to-r from-slate-950 via-indigo-950/40 to-slate-950 border border-indigo-500/30 text-center text-sm font-mono font-bold text-cyan-300 shadow-inner"
          >
            {cleanFormula}
          </div>
        );
        continue;
      }

      // Séparateur horizontal
      if (line === '---' || line === '***') {
        flushList();
        blocks.push(<hr key={`hr-${i}`} className="my-4 border-slate-800" />);
        continue;
      }

      // Puces de liste
      if (line.startsWith('- ') || line.startsWith('* ')) {
        if (!currentList || currentList.type !== 'ul') {
          flushList();
          currentList = { type: 'ul', items: [] };
        }
        currentList.items.push(line.slice(2));
        continue;
      }

      // Listes numérotées
      if (/^\d+\.\s/.test(line)) {
        if (!currentList || currentList.type !== 'ol') {
          flushList();
          currentList = { type: 'ol', items: [] };
        }
        currentList.items.push(line.replace(/^\d+\.\s/, ''));
        continue;
      }

      // Paragraphe standard
      flushList();
      blocks.push(
        <p key={`p-${i}`} className="text-xs text-slate-300 leading-relaxed my-1.5">
          {renderInlineFormatted(line)}
        </p>
      );
    }

    flushTable();
    flushList();

    return blocks;
  }, [content]);

  return <div className="space-y-1">{renderedBlocks}</div>;
}

/**
 * Modal de Compte-Rendu de Travaux Pratiques (TP)
 * Présentation visuelle unique, épurée et professionnelle.
 * Aucun code source brut ni onglet n'est exposé.
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

  // Texte structuré épuré (sans aucune balise Markdown ni symboles bruts)
  const cleanStructuredText = useMemo(() => {
    return formatDocumentForExport({
      title,
      moduleName,
      academicLevel,
      content: reportContent,
    });
  }, [title, moduleName, academicLevel, reportContent]);

  if (!isOpen) return null;

  // Copie d'un texte net et directement intégrable dans un rapport
  const handleCopy = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(cleanStructuredText);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = cleanStructuredText;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Téléchargement d'un document texte structuré propre
  const handleDownload = () => {
    setIsPdfPreviewOpen(true);
  };

  // Impression soignée au format document universitaire / PDF
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="fr">
        <head>
          <meta charset="utf-8" />
          <title>${title} - CampusHub</title>
          <style>
            @media print {
              body { margin: 15mm; }
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
              padding: 40px;
              line-height: 1.6;
              color: #0f172a;
              background: #ffffff;
              max-width: 800px;
              margin: 0 auto;
            }
            h1 {
              color: #312e81;
              font-size: 22px;
              border-bottom: 2px solid #e0e7ff;
              padding-bottom: 8px;
              margin-bottom: 6px;
            }
            .header-info {
              color: #64748b;
              font-size: 12px;
              margin-bottom: 24px;
              font-weight: 500;
            }
            .content {
              font-size: 13px;
              white-space: pre-wrap;
              line-height: 1.7;
              color: #1e293b;
            }
          </style>
        </head>
        <body>
          <h1>${title}</h1>
          <div class="header-info">
            CampusHub Sciences · Module : ${moduleName} · Niveau : ${academicLevel} · Date : ${new Date().toLocaleDateString('fr-FR')}
          </div>
          <div class="content">${cleanStructuredText.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-3xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-left"
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
                  COMPTE-RENDU DE TP
                </span>
                <span className="text-xs text-slate-400 font-mono">{academicLevel}</span>
              </div>
              <h3 className="text-base font-bold text-white tracking-tight">{title}</h3>
            </div>
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

        {/* Sous-en-tête informatif élégant */}
        <div className="flex items-center justify-between px-6 py-2.5 bg-slate-950/70 border-b border-slate-800/80 text-xs">
          <span className="text-slate-400 font-medium">
            Document académique généré automatiquement pour vos travaux de laboratoire
          </span>
          <span className="font-mono text-[11px] text-slate-500 hidden sm:inline">
            Édité le {new Date().toLocaleDateString('fr-FR')}
          </span>
        </div>

        {/* Corps de la Modal : Affichage Visuel Unique & Impeccable */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800/90 shadow-inner max-h-[52vh] overflow-y-auto">
            <DocumentVisualRenderer content={reportContent} />
          </div>

          <div className="p-3 rounded-xl bg-violet-950/30 border border-violet-500/20 text-xs text-violet-300 flex items-center gap-2">
            <Sparkles size={16} className="text-violet-400 shrink-0" />
            <span>
              Document universitaire formaté prêt à l'emploi. Copiez le texte structuré ou téléchargez-le pour l'intégrer directement dans vos devoirs.
            </span>
          </div>
        </div>

        {/* Footer avec Actions Épurées (Imprimer / PDF, Aperçu PDF, Télécharger, Copier le Rapport) */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-t border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-2 transition-all"
            >
              <Printer size={15} />
              <span>Imprimer / PDF</span>
            </button>

            <button
              type="button"
              onClick={() => setIsPdfPreviewOpen(true)}
              className="px-4 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 hover:border-indigo-500/50 text-xs font-semibold flex items-center gap-2 transition-all"
              title="Vérifier la mise en page A4 avant téléchargement"
            >
              <Eye size={15} />
              <span>Aperçu PDF</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownload}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-2 transition-all border border-slate-700 hover:border-slate-600"
              title="Vérifier la mise en page et télécharger le compte-rendu"
            >
              <Download size={15} />
              <span>Télécharger</span>
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
                  <span>Copier le Rapport</span>
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
