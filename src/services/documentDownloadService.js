import { marked } from 'marked';
import katex from 'katex';
import renderMathInElement from 'katex/contrib/auto-render';
import 'katex/dist/katex.min.css';
import katexCss from 'katex/dist/katex.min.css?inline';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

/**
 * Service Universel de Génération, Rendu HTML/KaTeX et Téléchargement PDF A4
 * CampusHub · Pôle Sciences
 */

marked.setOptions({
  gfm: true,
  breaks: false,
});

/**
 * Génère un slug propre pour le nom de fichier : compte-rendu-<module>-<date>.pdf
 */
export function buildReportFilename(moduleName = 'chimie', extension = 'pdf') {
  const dateIso = new Date().toISOString().slice(0, 10);
  const moduleSlug = String(moduleName || 'chimie')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  const ext = extension.replace(/^\./, '');
  return `compte-rendu-${moduleSlug || 'tp'}-${dateIso}.${ext}`;
}

/**
 * Convertit le Markdown en HTML avec marked tout en préservant les backslashes LaTeX
 * et en rendant les formules ($...$ et $$...$$) avec KaTeX.
 * Aucun symbole $ ni commande LaTeX brute (ex: \mathbf) ne reste visible.
 */
export function renderMarkdownWithKatex(markdown = '') {
  if (!markdown) return '';

  const mathBlocks = [];
  const mathInlines = [];

  // 1. Extraire les formules en bloc $$...$$ et \[...\] avant le passage de marked
  let processed = String(markdown).replace(/\$\$([\s\S]+?)\$\$/g, (_, expr) => {
    const id = mathBlocks.length;
    mathBlocks.push(expr.trim());
    return `\n\n@@KATEX_BLOCK_${id}@@\n\n`;
  });

  processed = processed.replace(/\\\[([\s\S]+?)\\\]/g, (_, expr) => {
    const id = mathBlocks.length;
    mathBlocks.push(expr.trim());
    return `\n\n@@KATEX_BLOCK_${id}@@\n\n`;
  });

  // 2. Extraire les formules inline $...$ et \(...\)
  processed = processed.replace(/\$([^\n$]+?)\$/g, (_, expr) => {
    const id = mathInlines.length;
    mathInlines.push(expr.trim());
    return `@@KATEX_INLINE_${id}@@`;
  });

  processed = processed.replace(/\\\(([\s\S]+?)\\\)/g, (_, expr) => {
    const id = mathInlines.length;
    mathInlines.push(expr.trim());
    return `@@KATEX_INLINE_${id}@@`;
  });

  // 3. Convertir le Markdown en HTML via marked
  let html = marked.parse(processed);

  // 4. Réinjecter les formules en bloc rendues avec KaTeX
  html = html.replace(/<p>\s*@@KATEX_BLOCK_(\d+)@@\s*<\/p>|@@KATEX_BLOCK_(\d+)@@/g, (_, id1, id2) => {
    const idx = Number(id1 ?? id2);
    const tex = mathBlocks[idx] || '';
    try {
      const rendered = katex.renderToString(tex, {
        displayMode: true,
        throwOnError: false,
        strict: false,
        trust: true,
      });
      return `<div class="math-block">${rendered}</div>`;
    } catch {
      return `<div class="math-block">${tex}</div>`;
    }
  });

  // 5. Réinjecter les formules inline rendues avec KaTeX
  html = html.replace(/@@KATEX_INLINE_(\d+)@@/g, (_, id) => {
    const idx = Number(id);
    const tex = mathInlines[idx] || '';
    try {
      const rendered = katex.renderToString(tex, {
        displayMode: false,
        throwOnError: false,
        strict: false,
        trust: true,
      });
      return `<span class="math-inline">${rendered}</span>`;
    } catch {
      return `<span class="math-inline">${tex}</span>`;
    }
  });

  return html;
}

/**
 * Applique KaTeX auto-render sur un conteneur DOM pour tout délimiteur $...$ ou $$...$$ résiduel.
 */
export function applyKatexAutoRender(containerElement) {
  if (!containerElement) return;
  try {
    renderMathInElement(containerElement, {
      delimiters: [
        { left: '$$', right: '$$', display: true },
        { left: '$', right: '$', display: false },
        { left: '\\[', right: '\\]', display: true },
        { left: '\\(', right: '\\)', display: false },
      ],
      throwOnError: false,
    });
  } catch {
    // Ignorer si déjà rendu
  }
}

/**
 * Feuille de style CSS partagée entre l'aperçu, l'impression (@media print) et l'export PDF A4.
 */
export function getAcademicReportCss() {
  return `
    @page {
      size: A4;
      margin: 20mm;
    }

    *, *::before, *::after {
      box-sizing: border-box;
    }

    .academic-report-sheet {
      font-family: 'Inter', 'Georgia', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, serif;
      font-size: 11pt;
      line-height: 1.5;
      color: #1e293b;
      background-color: #ffffff;
      text-align: justify;
      width: 100%;
      max-width: 210mm;
      margin: 0 auto;
      padding: 18mm 20mm;
    }

    .report-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 16px;
      border-bottom: 2.5px solid #4338ca;
      padding-bottom: 10px;
      margin-bottom: 18px;
      text-align: left;
    }

    .report-brand {
      font-size: 13.5pt;
      font-weight: 800;
      color: #312e81;
      letter-spacing: -0.3px;
      text-transform: uppercase;
    }

    .report-subtitle {
      font-size: 8.5pt;
      color: #64748b;
      margin-top: 2px;
      font-weight: 500;
    }

    .report-meta {
      text-align: right;
      font-size: 8.5pt;
      color: #334155;
      line-height: 1.45;
      white-space: nowrap;
    }

    .report-meta strong {
      color: #1e1b4b;
      font-weight: 700;
    }

    .report-body h1 {
      font-size: 15pt;
      font-weight: 800;
      color: #312e81;
      border-bottom: 1px solid #c7d2fe;
      padding-bottom: 6px;
      margin-top: 0;
      margin-bottom: 12px;
      line-height: 1.3;
      text-align: left;
      page-break-after: avoid;
      break-after: avoid;
    }

    .report-body h2 {
      font-size: 12pt;
      font-weight: 700;
      color: #4338ca;
      border-bottom: 1px solid #e0e7ff;
      padding-bottom: 4px;
      margin-top: 14px;
      margin-bottom: 8px;
      line-height: 1.35;
      text-align: left;
      page-break-after: avoid;
      break-after: avoid;
    }

    .report-body h3 {
      font-size: 11pt;
      font-weight: 700;
      color: #3730a3;
      margin-top: 10px;
      margin-bottom: 6px;
      text-align: left;
      page-break-after: avoid;
      break-after: avoid;
    }

    .report-body p {
      margin-top: 0;
      margin-bottom: 8px;
      text-align: justify;
      color: #1e293b;
    }

    .report-body ul,
    .report-body ol {
      margin-top: 4px;
      margin-bottom: 10px;
      padding-left: 20px;
      color: #1e293b;
      text-align: justify;
    }

    .report-body li {
      margin-bottom: 4px;
    }

    .report-body strong {
      color: #0f172a;
      font-weight: 700;
    }

    .report-body hr {
      border: none;
      border-top: 1px solid #e2e8f0;
      margin: 12px 0;
    }

    .report-body table {
      width: 100%;
      border-collapse: collapse;
      margin: 10px 0 12px 0;
      font-size: 10pt;
      page-break-inside: avoid;
      break-inside: avoid;
    }

    .report-body thead th {
      background-color: #4338ca;
      color: #ffffff;
      font-weight: 700;
      text-align: left;
      padding: 7px 10px;
      border: 1px solid #4338ca;
    }

    .report-body thead th strong {
      color: #ffffff;
    }

    .report-body tbody td {
      padding: 6px 10px;
      border: 1px solid #cbd5e1;
      color: #1e293b;
      text-align: left;
      vertical-align: middle;
    }

    .report-body tbody tr:nth-child(even) td {
      background-color: #f8fafc;
    }

    .report-body .math-block {
      margin: 10px 0;
      padding: 9px 14px;
      background-color: #f8fafc;
      border: 1px solid #e0e7ff;
      border-left: 3.5px solid #6366f1;
      border-radius: 6px;
      text-align: center;
      overflow-x: auto;
      page-break-inside: avoid;
      break-inside: avoid;
    }

    .report-body .math-block .katex-display {
      margin: 0;
    }

    .report-body .math-inline {
      padding: 0 1px;
    }

    .report-body blockquote,
    .report-body .result-box {
      margin: 12px 0;
      padding: 10px 14px;
      background-color: #eef2ff;
      border: 1px solid #c7d2fe;
      border-left: 4px solid #4338ca;
      border-radius: 6px;
      color: #1e1b4b;
      page-break-inside: avoid;
      break-inside: avoid;
    }

    .report-body blockquote p:last-child,
    .report-body blockquote ul:last-child {
      margin-bottom: 0;
    }

    .report-footer {
      margin-top: 22px;
      padding-top: 8px;
      border-top: 1px solid #cbd5e1;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 8.5pt;
      color: #64748b;
      page-break-inside: avoid;
      break-inside: avoid;
    }

    @media print {
      html, body {
        margin: 0;
        padding: 0;
        background: #ffffff;
      }
      .academic-report-sheet {
        padding: 0;
        max-width: none;
        box-shadow: none;
      }
      .report-body thead th,
      .report-body tbody tr:nth-child(even) td,
      .report-body .math-block,
      .report-body blockquote,
      .report-body .result-box {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
    }
  `;
}

/**
 * Construit le fragment HTML interne de la feuille A4 (utilisé par l'aperçu ET le générateur PDF).
 */
export function buildAcademicSheetInnerHtml({
  moduleName = 'Sciences & Ingénierie',
  academicLevel = 'Licence · Master',
  content = '',
  includeFooter = true,
}) {
  const dateStr = new Date().toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const bodyHtml = renderMarkdownWithKatex(content);

  return `
    <header class="report-header">
      <div>
        <div class="report-brand">CAMPUSHUB · Pôle Sciences</div>
        <div class="report-subtitle">Laboratoires Virtuels &amp; Enseignement Supérieur</div>
      </div>
      <div class="report-meta">
        <div><strong>Discipline :</strong> ${moduleName}</div>
        <div><strong>Niveau :</strong> ${academicLevel}</div>
        <div><strong>Date :</strong> ${dateStr}</div>
      </div>
    </header>
    <main class="report-body">
      ${bodyHtml}
    </main>
    ${
      includeFooter
        ? `<footer class="report-footer">
            <span>CAMPUSHUB · Pôle Sciences — Document académique officiel</span>
            <span>Page 1 / 1</span>
          </footer>`
        : ''
    }
  `;
}

/**
 * Génère un document HTML autonome complet (pour iframe d'aperçu et impression window.print()).
 */
export function generateAcademicHtmlDocument({
  title = 'Compte-Rendu de Travaux Pratiques',
  moduleName = 'Sciences & Ingénierie',
  academicLevel = 'Licence · Master',
  content = '',
}) {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const sheetHtml = buildAcademicSheetInnerHtml({
    moduleName,
    academicLevel,
    content,
    includeFooter: true,
  });

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  ${origin ? `<base href="${origin}/" />` : ''}
  <title>${title} - CampusHub</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css" crossorigin="anonymous" />
  <style>${katexCss}</style>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #ffffff;
    }
    ${getAcademicReportCss()}
  </style>
</head>
<body>
  <div class="academic-report-sheet">
    ${sheetHtml}
  </div>
</body>
</html>`;
}

/**
 * Retourne le Markdown propre du rapport (sans symboles ASCII bruts ni suppression de backslashes).
 */
export function formatDocumentForExport({
  title = 'Compte-Rendu de Travaux Pratiques',
  moduleName = 'CampusHub Sciences',
  academicLevel = 'Licence · Master',
  content = '',
}) {
  if (content && content.trim()) {
    return content.trim();
  }
  const dateStr = new Date().toLocaleDateString('fr-FR');
  return `# ${title}\n\n- **Module :** ${moduleName}\n- **Niveau :** ${academicLevel}\n- **Date :** ${dateStr}\n`;
}

/**
 * Copie le rapport Markdown propre dans le presse-papier.
 */
export async function copyCleanAcademicDocument({
  title,
  moduleName,
  academicLevel,
  content,
}) {
  const cleanMarkdown = formatDocumentForExport({
    title,
    moduleName,
    academicLevel,
    content,
  });

  if (navigator?.clipboard?.writeText) {
    await navigator.clipboard.writeText(cleanMarkdown);
  } else {
    const textArea = document.createElement('textarea');
    textArea.value = cleanMarkdown;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
  }

  return true;
}

/**
 * Génère et télécharge un vrai fichier PDF A4 (.pdf) avec marges 20mm, rendu KaTeX et pied de page "Page X / Y",
 * ou un fichier Markdown (.md) si fileFormat === 'md'.
 */
export async function triggerAcademicDownload({
  title = 'Compte-Rendu de Travaux Pratiques',
  moduleName = 'chimie',
  academicLevel = 'Licence · Master',
  content = '',
  fileFormat = 'pdf', // 'pdf' | 'md'
}) {
  const normalizedFormat = fileFormat === 'md' ? 'md' : 'pdf';
  const filename = buildReportFilename(moduleName, normalizedFormat);

  // Téléchargement en Markdown brut (.md)
  if (normalizedFormat === 'md') {
    const markdownText = formatDocumentForExport({
      title,
      moduleName,
      academicLevel,
      content,
    });
    const blob = new Blob([markdownText], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
    return { success: true, filename };
  }

  // Génération du vrai PDF A4 (210mm x 297mm, marges 20mm, scale 2)
  // Zone imprimable : largeur = 170mm (210 - 2*20), hauteur corps = 244mm + pied de page
  const RENDER_WIDTH_PX = 680; // 4 px = 1 mm pour 170 mm de largeur utile
  const PX_PER_MM = RENDER_WIDTH_PX / 170; // 4 px/mm
  const PAGE_BODY_MAX_MM = 244;
  const PAGE_BODY_MAX_PX = Math.floor(PAGE_BODY_MAX_MM * PX_PER_MM); // 976 px

  const wrapper = document.createElement('div');
  wrapper.style.position = 'fixed';
  wrapper.style.left = '-10000px';
  wrapper.style.top = '0';
  wrapper.style.width = `${RENDER_WIDTH_PX}px`;
  wrapper.style.backgroundColor = '#ffffff';
  wrapper.style.zIndex = '-1';

  const styleEl = document.createElement('style');
  styleEl.textContent = `
    ${getAcademicReportCss()}
    .pdf-capture-root {
      width: ${RENDER_WIDTH_PX}px !important;
      max-width: ${RENDER_WIDTH_PX}px !important;
      padding: 0 !important;
      margin: 0 !important;
      background: #ffffff !important;
    }
  `;

  const sheetEl = document.createElement('div');
  sheetEl.className = 'academic-report-sheet pdf-capture-root';
  sheetEl.innerHTML = buildAcademicSheetInnerHtml({
    moduleName,
    academicLevel,
    content,
    includeFooter: false,
  });

  wrapper.appendChild(styleEl);
  wrapper.appendChild(sheetEl);
  document.body.appendChild(wrapper);

  try {
    // S'assurer que tout délimiteur mathématique résiduel est rendu par KaTeX auto-render
    applyKatexAutoRender(sheetEl);

    if (document.fonts?.ready) {
      await document.fonts.ready;
    }

    // Calculer les points de coupure propres entre les blocs pour éviter toute coupure au milieu d'un tableau/formule/encadré
    const sheetRect = sheetEl.getBoundingClientRect();
    const totalDomHeight = Math.ceil(sheetEl.scrollHeight);
    const bodyEl = sheetEl.querySelector('.report-body');
    const children = bodyEl ? Array.from(bodyEl.children) : [];

    const breakOffsetsPx = [0];
    let currentStartPx = 0;

    while (currentStartPx + PAGE_BODY_MAX_PX < totalDomHeight - 4) {
      const targetMaxPx = currentStartPx + PAGE_BODY_MAX_PX;
      let bestBreakPx = targetMaxPx;

      for (let i = 0; i < children.length; i++) {
        const el = children[i];
        const rect = el.getBoundingClientRect();
        const elTop = Math.floor(rect.top - sheetRect.top);
        const elBottom = Math.ceil(rect.bottom - sheetRect.top);

        // Si un bloc dépasse la limite de page
        if (elTop > currentStartPx + 40 && elBottom > targetMaxPx) {
          // Si l'élément précédent est un titre (h1, h2, h3), couper avant le titre pour ne pas le laisser orphelin
          if (i > 0 && /^H[1-3]$/.test(children[i - 1].tagName)) {
            const prevRect = children[i - 1].getBoundingClientRect();
            const prevTop = Math.floor(prevRect.top - sheetRect.top);
            if (prevTop > currentStartPx + 40) {
              bestBreakPx = prevTop - 4;
              break;
            }
          }
          bestBreakPx = Math.max(currentStartPx + 100, elTop - 4);
          break;
        }
      }

      if (bestBreakPx <= currentStartPx) {
        bestBreakPx = targetMaxPx;
      }

      breakOffsetsPx.push(bestBreakPx);
      currentStartPx = bestBreakPx;
    }

    breakOffsetsPx.push(totalDomHeight);

    const scale = 2;
    const fullCanvas = await html2canvas(sheetEl, {
      scale,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
      width: RENDER_WIDTH_PX,
      windowWidth: RENDER_WIDTH_PX,
    });

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    const totalPages = Math.max(1, breakOffsetsPx.length - 1);

    for (let pageIdx = 0; pageIdx < totalPages; pageIdx++) {
      if (pageIdx > 0) {
        pdf.addPage('a4', 'portrait');
      }

      const startDomY = breakOffsetsPx[pageIdx];
      const endDomY = breakOffsetsPx[pageIdx + 1];
      const sliceDomHeight = Math.max(1, endDomY - startDomY);

      const startCanvasY = Math.floor(startDomY * scale);
      const sliceCanvasHeight = Math.min(
        fullCanvas.height - startCanvasY,
        Math.ceil(sliceDomHeight * scale)
      );

      if (sliceCanvasHeight > 0) {
        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = fullCanvas.width;
        pageCanvas.height = sliceCanvasHeight;

        const ctx = pageCanvas.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
        ctx.drawImage(
          fullCanvas,
          0,
          startCanvasY,
          fullCanvas.width,
          sliceCanvasHeight,
          0,
          0,
          fullCanvas.width,
          sliceCanvasHeight
        );

        const imgData = pageCanvas.toDataURL('image/png');
        const sliceHeightMm = sliceDomHeight / PX_PER_MM;

        // Marges de 20mm (gauche = 20mm, haut = 20mm, largeur utile = 170mm)
        pdf.addImage(imgData, 'PNG', 20, 20, 170, sliceHeightMm, undefined, 'FAST');
      }

      // Pied de page officiel avec numéro de page "Page X / Y" à 20mm du bas (y = 277mm)
      pdf.setDrawColor(203, 213, 225); // #cbd5e1
      pdf.setLineWidth(0.3);
      pdf.line(20, 272, 190, 272);

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8.5);
      pdf.setTextColor(100, 116, 139); // #64748b
      pdf.text(`CAMPUSHUB · Pole Sciences — ${moduleName}`, 20, 276.5);
      pdf.text(`Page ${pageIdx + 1} / ${totalPages}`, 190, 276.5, { align: 'right' });
    }

    pdf.save(filename);
    return { success: true, filename };
  } finally {
    if (wrapper.parentNode) {
      wrapper.parentNode.removeChild(wrapper);
    }
  }
}
