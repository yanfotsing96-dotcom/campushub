import { useState } from 'react';
import {
  FileText,
  Copy,
  Check,
  Download,
  X,
  Printer,
  Sparkles,
  BookOpen,
} from 'lucide-react';

/**
 * Modal d'exportation de compte-rendu de Travaux Pratiques (TP)
 * Génère et permet de copier / télécharger un rapport complet au format Markdown et texte structuré.
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

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(reportContent);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = reportContent;
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

  const handleDownload = () => {
    const filename = `compte-rendu-tp-${moduleName.toLowerCase().replace(/[^a-z0-9]/g, '-')}.md`;
    const blob = new Blob([reportContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>${title} - CampusHub</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 30px; line-height: 1.6; color: #1e293b; }
            pre { background: #f8fafc; border: 1px solid #e2e8f0; padding: 15px; border-radius: 8px; font-family: monospace; font-size: 13px; white-space: pre-wrap; }
            h1 { color: #4338ca; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; }
            .header-info { color: #64748b; font-size: 12px; margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <h1>${title}</h1>
          <div class="header-info">CampusHub · Module : ${moduleName} · Niveau : ${academicLevel} · Date : ${new Date().toLocaleDateString('fr-FR')}</div>
          <pre>${reportContent.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
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

        {/* Aperçu du rapport en format Markdown / Texte Structuré */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-medium">
              <BookOpen size={14} className="text-violet-400" />
              <span>Format Markdown normalisé prêt pour intégration dans votre rapport académique</span>
            </span>
            <span className="font-mono text-[11px] text-slate-500">
              Généré le {new Date().toLocaleDateString('fr-FR')} à {new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          <div className="relative rounded-2xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs text-slate-200 overflow-x-auto leading-relaxed shadow-inner max-h-[50vh]">
            <pre className="whitespace-pre-wrap select-all font-mono text-[12px] text-slate-300">
              {reportContent}
            </pre>
          </div>

          <div className="p-3 rounded-xl bg-violet-950/30 border border-violet-500/20 text-xs text-violet-300 flex items-center gap-2">
            <Sparkles size={16} className="text-violet-400 shrink-0" />
            <span>
              Astuce : Vous pouvez coller directement ce contenu dans Word, Google Docs, Notion, Overleaf (LaTeX) ou votre éditeur Markdown habituel.
            </span>
          </div>
        </div>

        {/* Footer avec Actions (Copier, Télécharger, Imprimer) */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-t border-slate-800 bg-slate-950/70">
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-2 transition-all"
          >
            <Printer size={15} />
            <span>Imprimer / PDF</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownload}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-2 transition-all border border-slate-700 hover:border-slate-600"
            >
              <Download size={15} />
              <span>Télécharger (.md)</span>
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
    </div>
  );
}
