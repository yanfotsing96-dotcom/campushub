/**
 * Service Universel de Téléchargement & Formatage de Documents Académiques
 * CampusHub · Pôle Sciences & Ingénierie Pédagogique
 *
 * Assure un formatage visuel noble, net et structuré, débarrassé de tout code source
 * technique ou balisage parasite non interprété lors des téléchargements et copies.
 */

/**
 * Nettoie et transforme les formules scientifiques en typographie Unicode lisible
 */
export function sanitizeScientificFormulas(text) {
  if (!text) return '';
  return text
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
 * Convertit un contenu brut en document texte formaté, clair et professionnel
 * Le document résultant reflète fidèlement la structure visuelle à l'écran.
 */
export function formatDocumentForExport({
  title = 'COMPTE-RENDU ACADÉMIQUE',
  moduleName = 'CampusHub Sciences',
  academicLevel = 'Licence · Master',
  content = '',
}) {
  const dateStr = new Date().toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
  const timeStr = new Date().toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const headerBanner = [
    '========================================================================',
    `  CAMPUSHUB · ${title.toUpperCase()}`,
    `  Discipline / Module : ${moduleName}`,
    `  Niveau Académique   : ${academicLevel}`,
    `  Date d'édition      : ${dateStr} à ${timeStr}`,
    '========================================================================',
    '',
  ];

  if (!content) return headerBanner.join('\n');

  const lines = content.split('\n');
  const body = [];

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i].trim();

    // Ligne vide
    if (!rawLine) {
      body.push('');
      continue;
    }

    // Séparateurs
    if (rawLine === '---' || rawLine === '***') {
      body.push('────────────────────────────────────────────────────────────────────────');
      continue;
    }

    // Titres principaux (# )
    if (rawLine.startsWith('# ')) {
      const h1 = rawLine.slice(2).trim();
      body.push('');
      body.push(`■ ${h1.toUpperCase()}`);
      body.push('─'.repeat(Math.max(h1.length + 4, 35)));
      continue;
    }

    // Sous-titres (## )
    if (rawLine.startsWith('## ')) {
      const h2 = rawLine.slice(3).trim();
      body.push('');
      body.push(`▶ ${h2}`);
      body.push('·'.repeat(Math.max(h2.length + 4, 25)));
      continue;
    }

    // Sections de 3e niveau (### )
    if (rawLine.startsWith('### ')) {
      const h3 = rawLine.slice(4).trim();
      body.push(`  ◆ ${h3} :`);
      continue;
    }

    // Formules en bloc ($$...$$)
    if (rawLine.startsWith('$$') && rawLine.endsWith('$$')) {
      const formula = sanitizeScientificFormulas(rawLine.slice(2, -2));
      body.push('');
      body.push(`      [ FORMULE ]  ${formula}`);
      body.push('');
      continue;
    }

    // Tableaux structurés (| col1 | col2 |)
    if (rawLine.startsWith('|') && rawLine.endsWith('|')) {
      const cells = rawLine.split('|').slice(1, -1).map((c) => c.trim());
      // Ligne séparatrice de tableau
      if (cells.every((c) => c.match(/^:?-+:?$/))) {
        continue;
      }
      const cleanCells = cells.map((cell) =>
        sanitizeScientificFormulas(
          cell
            .replace(/\*\*(.*?)\*\*/g, '$1')
            .replace(/\$(.*?)\$/g, '$1')
            .replace(/`([^`]+)`/g, '$1')
        )
      );
      body.push(`  • ${cleanCells.join('  |  ')}`);
      continue;
    }

    // Puces de listes
    if (rawLine.startsWith('- ') || rawLine.startsWith('* ')) {
      const bulletText = sanitizeScientificFormulas(
        rawLine
          .slice(2)
          .replace(/\*\*(.*?)\*\*/g, '$1')
          .replace(/\$(.*?)\$/g, '$1')
          .replace(/`([^`]+)`/g, '$1')
      );
      body.push(`  • ${bulletText}`);
      continue;
    }

    // Listes numérotées (1. 2. 3.)
    if (/^\d+\.\s/.test(rawLine)) {
      const numText = sanitizeScientificFormulas(
        rawLine
          .replace(/\*\*(.*?)\*\*/g, '$1')
          .replace(/\$(.*?)\$/g, '$1')
          .replace(/`([^`]+)`/g, '$1')
      );
      body.push(`  ${numText}`);
      continue;
    }

    // Paragraphe classique épuré
    const cleanParagraph = sanitizeScientificFormulas(
      rawLine
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/\$(.*?)\$/g, '$1')
        .replace(/`([^`]+)`/g, '$1')
    );
    body.push(cleanParagraph);
  }

  const footerBanner = [
    '',
    '────────────────────────────────────────────────────────────────────────',
    '  Document généré automatiquement par CampusHub · Pôle Académique',
    '  Conforme aux standards universitaires de travaux pratiques & dirigés.',
    '========================================================================',
  ];

  return [...headerBanner, ...body, ...footerBanner].join('\n');
}

/**
 * Déclenche le téléchargement direct d'un document structuré au format propre (.txt ou .md)
 */
export function triggerAcademicDownload({
  title,
  moduleName = 'rapport',
  academicLevel,
  content,
  fileFormat = 'txt', // 'txt' | 'md'
}) {
  const cleanDocument = formatDocumentForExport({
    title,
    moduleName,
    academicLevel,
    content,
  });

  const slug = moduleName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
  const filename = `campushub-${slug}-${Date.now().toString().slice(-6)}.${fileFormat}`;

  const mimeType = fileFormat === 'md' ? 'text/markdown;charset=utf-8' : 'text/plain;charset=utf-8';
  const blob = new Blob([cleanDocument], { type: mimeType });
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

/**
 * Copie dans le presse-papier le document structuré propre sans balisage parasite
 */
export async function copyCleanAcademicDocument({
  title,
  moduleName,
  academicLevel,
  content,
}) {
  const cleanDocument = formatDocumentForExport({
    title,
    moduleName,
    academicLevel,
    content,
  });

  if (navigator?.clipboard?.writeText) {
    await navigator.clipboard.writeText(cleanDocument);
  } else {
    const textArea = document.createElement('textarea');
    textArea.value = cleanDocument;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
  }

  return true;
}

/**
 * Génère un document HTML complet autonome et stylisé pour prévisualisation haute fidélité
 * dans un iframe ou un tag object avant téléchargement ou impression PDF.
 */
export function generateAcademicHtmlDocument({
  title = 'COMPTE-RENDU DE TRAVAUX PRATIQUES',
  moduleName = 'Sciences & Ingénierie',
  academicLevel = 'Licence · Master',
  content = '',
}) {
  const dateStr = new Date().toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
  const timeStr = new Date().toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const lines = content ? content.split('\n') : [];
  const htmlBody = [];

  let currentTable = null;
  let currentList = null;

  const flushTable = () => {
    if (currentTable) {
      const rowsHtml = currentTable.rows
        .map(
          (row) => `
        <tr>
          ${row.map((cell) => `<td>${sanitizeScientificFormulas(cell.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'))}</td>`).join('')}
        </tr>`
        )
        .join('');

      const headersHtml = currentTable.headers
        .map((h) => `<th>${sanitizeScientificFormulas(h.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'))}</th>`)
        .join('');

      htmlBody.push(`
        <div class="table-container">
          <table>
            <thead>
              <tr>${headersHtml}</tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>
        </div>
      `);
      currentTable = null;
    }
  };

  const flushList = () => {
    if (currentList) {
      const tag = currentList.type;
      const itemsHtml = currentList.items
        .map((it) => `<li>${sanitizeScientificFormulas(it.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'))}</li>`)
        .join('');
      htmlBody.push(`<${tag}>${itemsHtml}</${tag}>`);
      currentList = null;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i].trim();

    if (rawLine.startsWith('|') && rawLine.endsWith('|')) {
      flushList();
      const cells = rawLine.split('|').slice(1, -1);
      if (cells.every((c) => c.trim().match(/^:?-+:?$/))) {
        continue;
      }
      if (!currentTable) {
        currentTable = { headers: cells.map((c) => c.trim()), rows: [] };
      } else {
        currentTable.rows.push(cells.map((c) => c.trim()));
      }
      continue;
    } else {
      flushTable();
    }

    if (!rawLine) {
      flushList();
      continue;
    }

    if (rawLine === '---' || rawLine === '***') {
      flushList();
      htmlBody.push('<hr />');
      continue;
    }

    if (rawLine.startsWith('# ')) {
      flushList();
      const h1 = rawLine.slice(2).trim();
      htmlBody.push(`<h1>${sanitizeScientificFormulas(h1.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'))}</h1>`);
      continue;
    }

    if (rawLine.startsWith('## ')) {
      flushList();
      const h2 = rawLine.slice(3).trim();
      htmlBody.push(`<h2>${sanitizeScientificFormulas(h2.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'))}</h2>`);
      continue;
    }

    if (rawLine.startsWith('### ')) {
      flushList();
      const h3 = rawLine.slice(4).trim();
      htmlBody.push(`<h3>${sanitizeScientificFormulas(h3.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'))}</h3>`);
      continue;
    }

    if (rawLine.startsWith('$$') && rawLine.endsWith('$$')) {
      flushList();
      const formula = sanitizeScientificFormulas(rawLine.slice(2, -2));
      htmlBody.push(`
        <div class="formula-box">
          <div class="formula-label">Formule Fondamentale</div>
          <div class="formula-code">${formula}</div>
        </div>
      `);
      continue;
    }

    if (rawLine.startsWith('- ') || rawLine.startsWith('* ')) {
      if (!currentList || currentList.type !== 'ul') {
        flushList();
        currentList = { type: 'ul', items: [] };
      }
      currentList.items.push(rawLine.slice(2));
      continue;
    }

    if (/^\d+\.\s/.test(rawLine)) {
      if (!currentList || currentList.type !== 'ol') {
        flushList();
        currentList = { type: 'ol', items: [] };
      }
      currentList.items.push(rawLine.replace(/^\d+\.\s/, ''));
      continue;
    }

    flushList();
    const cleanP = sanitizeScientificFormulas(
      rawLine
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\$(.*?)\$/g, '<span class="inline-formula">$1</span>')
        .replace(/`([^`]+)`/g, '<span class="inline-code">$1</span>')
    );
    htmlBody.push(`<p>${cleanP}</p>`);
  }

  flushTable();
  flushList();

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title} - CampusHub</title>
  <style>
    @page {
      size: A4;
      margin: 18mm 15mm 18mm 15mm;
    }
    *, *::before, *::after {
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      font-size: 11pt;
      line-height: 1.6;
      color: #0f172a;
      background-color: #ffffff;
      margin: 0;
      padding: 30px;
      max-width: 820px;
      margin-left: auto;
      margin-right: auto;
    }
    .header-banner {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #4338ca;
      padding-bottom: 14px;
      margin-bottom: 24px;
    }
    .brand-title {
      font-size: 14pt;
      font-weight: 800;
      color: #4338ca;
      letter-spacing: -0.5px;
      text-transform: uppercase;
    }
    .brand-subtitle {
      font-size: 9pt;
      color: #64748b;
      margin-top: 2px;
      font-weight: 500;
    }
    .meta-box {
      text-align: right;
      font-size: 8.5pt;
      color: #475569;
      font-family: monospace;
      line-height: 1.4;
    }
    h1 {
      font-size: 17pt;
      color: #1e1b4b;
      margin-top: 0;
      margin-bottom: 14px;
      font-weight: 800;
      line-height: 1.25;
      page-break-after: avoid;
    }
    h2 {
      font-size: 13pt;
      color: #312e81;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 6px;
      margin-top: 22px;
      margin-bottom: 10px;
      font-weight: 700;
      page-break-after: avoid;
    }
    h3 {
      font-size: 11pt;
      color: #4338ca;
      margin-top: 16px;
      margin-bottom: 6px;
      font-weight: 600;
      page-break-after: avoid;
    }
    p {
      margin-top: 0;
      margin-bottom: 10px;
      text-align: justify;
      color: #334155;
    }
    strong {
      color: #0f172a;
      font-weight: 700;
    }
    .formula-box {
      margin: 16px 0;
      padding: 12px 18px;
      background: #f8fafc;
      border: 1px solid #c7d2fe;
      border-left: 4px solid #4f46e5;
      border-radius: 8px;
      text-align: center;
      page-break-inside: avoid;
    }
    .formula-label {
      font-size: 8pt;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #6366f1;
      font-weight: 700;
      margin-bottom: 4px;
      font-family: sans-serif;
    }
    .formula-code {
      font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
      font-size: 11pt;
      font-weight: 700;
      color: #1e1b4b;
    }
    .inline-formula, .inline-code {
      font-family: "SFMono-Regular", Consolas, monospace;
      font-size: 9.5pt;
      background: #eef2ff;
      color: #3730a3;
      padding: 2px 5px;
      border-radius: 4px;
      border: 1px solid #e0e7ff;
    }
    .table-container {
      margin: 16px 0;
      overflow-x: auto;
      page-break-inside: avoid;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 9.5pt;
    }
    th {
      background-color: #f1f5f9;
      color: #1e293b;
      font-weight: 700;
      text-align: left;
      padding: 8px 12px;
      border: 1px solid #cbd5e1;
    }
    td {
      padding: 8px 12px;
      border: 1px solid #e2e8f0;
      color: #334155;
    }
    tr:nth-child(even) td {
      background-color: #f8fafc;
    }
    ul, ol {
      margin-top: 4px;
      margin-bottom: 12px;
      padding-left: 22px;
      color: #334155;
    }
    li {
      margin-bottom: 5px;
    }
    hr {
      border: none;
      border-top: 1px solid #e2e8f0;
      margin: 20px 0;
    }
    .footer-doc {
      margin-top: 35px;
      padding-top: 12px;
      border-top: 1px solid #cbd5e1;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 8.5pt;
      color: #64748b;
      font-family: sans-serif;
    }
    @media print {
      body {
        padding: 0;
        max-width: none;
      }
      .formula-box {
        background-color: #f8fafc !important;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      th {
        background-color: #f1f5f9 !important;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
    }
  </style>
</head>
<body>
  <div class="header-banner">
    <div>
      <div class="brand-title">CampusHub · Pôle Sciences</div>
      <div class="brand-subtitle">Université & Laboratoires Virtuels d'Enseignement</div>
    </div>
    <div class="meta-box">
      <div><strong>Discipline :</strong> ${moduleName}</div>
      <div><strong>Niveau :</strong> ${academicLevel}</div>
      <div><strong>Date :</strong> ${dateStr}</div>
    </div>
  </div>

  <main>
    ${htmlBody.join('\n')}
  </main>

  <div class="footer-doc">
    <div>CampusHub Sciences · Document officiel validé</div>
    <div>Page 1 sur 1</div>
  </div>
</body>
</html>`;
}

