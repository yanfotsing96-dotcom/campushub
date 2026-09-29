import { useState, useMemo } from 'react';
import {
  BookMarked,
  Copy,
  Check,
  Download,
  Plus,
  Trash2,
  Sparkles,
  FileText,
} from 'lucide-react';
import { CITATION_TEMPLATES } from './data/servicesData';

const STYLES = [
  { id: 'APA', label: 'APA (7ème éd.)', description: 'Standard universel pour rapports & mémoires' },
  { id: 'IEEE', label: 'IEEE', description: 'Norme de référence en Informatique & Ingénierie UY1' },
  { id: 'MLA', label: 'MLA (9ème éd.)', description: 'Format littéraire et sciences humaines' },
  { id: 'HARVARD', label: 'Harvard', description: 'Système auteur-date international' },
  { id: 'CHICAGO', label: 'Chicago', description: 'Style notes et bibliographie classique' },
];

const STORAGE_SAVED_CITATIONS_KEY = 'campushub_saved_bibliography';

export default function BibliographyGenerator() {
  const [currentStyle, setCurrentStyle] = useState('IEEE');
  const [selectedTemplateId, setSelectedTemplateId] = useState('cormen');

  // Form Fields State
  const [authors, setAuthors] = useState(CITATION_TEMPLATES[0].authors);
  const [year, setYear] = useState(CITATION_TEMPLATES[0].year);
  const [title, setTitle] = useState(CITATION_TEMPLATES[0].sourceTitle);
  const [publisher, setPublisher] = useState(CITATION_TEMPLATES[0].publisher);
  const [city, setCity] = useState(CITATION_TEMPLATES[0].city);
  const [url, setUrl] = useState(CITATION_TEMPLATES[0].url);
  const [doi, setDoi] = useState(CITATION_TEMPLATES[0].doi);
  const [pages, setPages] = useState(CITATION_TEMPLATES[0].pages);
  const [sourceType, setSourceType] = useState('book'); // 'book', 'poly', 'article', 'web'

  // Saved bibliography list
  const [savedBibliography, setSavedBibliography] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_SAVED_CITATIONS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [copiedFormatted, setCopiedFormatted] = useState(false);
  const [copiedBibtex, setCopiedBibtex] = useState(false);
  const [bannerMessage, setBannerMessage] = useState('');

  // Handle template selection
  const handleSelectTemplate = (templateId) => {
    setSelectedTemplateId(templateId);
    const tmpl = CITATION_TEMPLATES.find((t) => t.id === templateId);
    if (tmpl) {
      setAuthors(tmpl.authors);
      setYear(tmpl.year);
      setTitle(tmpl.sourceTitle);
      setPublisher(tmpl.publisher);
      setCity(tmpl.city);
      setUrl(tmpl.url);
      setDoi(tmpl.doi);
      setPages(tmpl.pages);
      setSourceType(tmpl.type);
    }
  };

  // Generate citation based on selected style
  const formattedCitation = useMemo(() => {
    const cleanAuthors = authors.trim() || 'Auteur inconnu';
    const cleanYear = year.trim() || 's.d.';
    const cleanTitle = title.trim() || 'Titre non spécifié';
    const cleanPublisher = publisher.trim();
    const cleanCity = city.trim();
    const cleanPages = pages.trim() ? `pp. ${pages.trim()}` : '';
    const cleanDoi = doi.trim() ? `https://doi.org/${doi.trim()}` : '';
    const cleanUrl = url.trim();

    if (currentStyle === 'APA') {
      // APA 7: Authors (Year). Title. Publisher. DOI or URL.
      let cit = `${cleanAuthors} (${cleanYear}). ${cleanTitle}.`;
      if (cleanPublisher) cit += ` ${cleanPublisher}.`;
      if (cleanDoi) cit += ` ${cleanDoi}`;
      else if (cleanUrl) cit += ` ${cleanUrl}`;
      return cit;
    }

    if (currentStyle === 'IEEE') {
      // IEEE: [1] J. K. Author, "Title," Publisher, City, Year, pp. Pages.
      let cit = `${cleanAuthors}, "${cleanTitle},"`;
      if (cleanPublisher) cit += ` ${cleanPublisher},`;
      if (cleanCity) cit += ` ${cleanCity},`;
      cit += ` ${cleanYear}`;
      if (cleanPages) cit += `, ${cleanPages}`;
      cit += '.';
      if (cleanDoi) cit += ` doi: ${doi.trim()}.`;
      return cit;
    }

    if (currentStyle === 'MLA') {
      // MLA 9: Authors. Title. Publisher, Year. URL.
      let cit = `${cleanAuthors}. ${cleanTitle}.`;
      if (cleanPublisher) cit += ` ${cleanPublisher},`;
      cit += ` ${cleanYear}.`;
      if (cleanUrl) cit += ` ${cleanUrl}.`;
      return cit;
    }

    if (currentStyle === 'HARVARD') {
      // Harvard: Authors (Year) Title. City: Publisher. Available at: URL.
      let cit = `${cleanAuthors} (${cleanYear}) ${cleanTitle}.`;
      if (cleanCity && cleanPublisher) cit += ` ${cleanCity}: ${cleanPublisher}.`;
      else if (cleanPublisher) cit += ` ${cleanPublisher}.`;
      if (cleanUrl) cit += ` Disponible sur: ${cleanUrl}.`;
      return cit;
    }

    // Chicago
    let cit = `${cleanAuthors}. ${cleanTitle}.`;
    if (cleanCity) cit += ` ${cleanCity}:`;
    if (cleanPublisher) cit += ` ${cleanPublisher},`;
    cit += ` ${cleanYear}.`;
    return cit;
  }, [currentStyle, authors, year, title, publisher, city, pages, doi, url]);

  // Generate BibTeX snippet
  const bibtexSnippet = useMemo(() => {
    const key = (authors.split(' ')[0] || 'ref').toLowerCase().replace(/[^a-z]/g, '') + (year || '2026');
    const entryType = sourceType === 'article' ? 'article' : sourceType === 'web' ? 'misc' : 'book';

    return `@${entryType}{${key},
  author    = {${authors.trim()}},
  title     = {${title.trim()}},
  year      = {${year.trim()}},
  publisher = {${publisher.trim()}},
  address   = {${city.trim()}},
  pages     = {${pages.trim()}},
  url       = {${url.trim()}},
  doi       = {${doi.trim()}}
}`;
  }, [authors, title, year, publisher, city, pages, url, doi, sourceType]);

  const handleCopyCitation = () => {
    navigator.clipboard.writeText(formattedCitation);
    setCopiedFormatted(true);
    setTimeout(() => setCopiedFormatted(false), 2000);
  };

  const handleCopyBibtex = () => {
    navigator.clipboard.writeText(bibtexSnippet);
    setCopiedBibtex(true);
    setTimeout(() => setCopiedBibtex(false), 2000);
  };

  const handleAddToBibliography = () => {
    const item = {
      id: `cit-${Date.now()}`,
      style: currentStyle,
      citation: formattedCitation,
      bibtex: bibtexSnippet,
      title: title.trim(),
    };
    const updated = [item, ...savedBibliography];
    setSavedBibliography(updated);
    try {
      localStorage.setItem(STORAGE_SAVED_CITATIONS_KEY, JSON.stringify(updated));
    } catch (err) {
      console.warn('Erreur stockage local :', err);
    }
    setBannerMessage('Citation ajoutée à votre bibliographie de mémoire !');
    setTimeout(() => setBannerMessage(''), 3000);
  };

  const handleDeleteSavedCitation = (id) => {
    const updated = savedBibliography.filter((c) => c.id !== id);
    setSavedBibliography(updated);
    localStorage.setItem(STORAGE_SAVED_CITATIONS_KEY, JSON.stringify(updated));
  };

  const handleExportAllTxt = () => {
    if (savedBibliography.length === 0) return;
    const content = `BIBLIOGRAPHIE ACADÉMIQUE · CAMPUSHUB UY1\nDate: ${new Date().toLocaleDateString()}\n\n` +
      savedBibliography.map((c, i) => `[${i + 1}] ${c.citation}`).join('\n\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const dlUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = dlUrl;
    link.download = `bibliographie-memoire-uy1.txt`;
    link.click();
    URL.revokeObjectURL(dlUrl);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs transition-colors">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200/50 dark:border-purple-800/50 mb-2">
              <BookMarked size={13} />
              <span>CampusHub · Rédaction Scientifique & Mémoires</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              Générateur Automatique de Citations & Bibliographie
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Formatez rigoureusement vos sources selon les normes académiques officielles (APA, IEEE, MLA) pour vos rapports de stage et mémoires de PFE.
            </p>
          </div>

          {/* Quick Preset Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Sparkles size={12} className="text-purple-500" />
              <span>Modèle UY1 :</span>
            </span>
            <select
              value={selectedTemplateId}
              onChange={(e) => handleSelectTemplate(e.target.value)}
              className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
            >
              {CITATION_TEMPLATES.map((tmpl) => (
                <option key={tmpl.id} value={tmpl.id}>
                  {tmpl.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Style Selector Buttons */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {STYLES.map((st) => {
            const isSelected = currentStyle === st.id;
            return (
              <button
                key={st.id}
                type="button"
                onClick={() => setCurrentStyle(st.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                  isSelected
                    ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>{st.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {bannerMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2 animate-in fade-in">
          <Check size={16} className="text-emerald-500 flex-shrink-0" />
          <span>{bannerMessage}</span>
        </div>
      )}

      {/* Main Split: Interactive Form & Live Citation Box */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Source Fields Form (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <FileText size={16} className="text-purple-600" />
              <span>Détails de la Source Documentaire</span>
            </h3>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400">Type :</span>
              <select
                value={sourceType}
                onChange={(e) => setSourceType(e.target.value)}
                className="px-2.5 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
              >
                <option value="book">Livre / Manuel</option>
                <option value="poly">Polycopié de cours UY1</option>
                <option value="article">Article scientifique / IEEE</option>
                <option value="web">Documentation Web / GitHub</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Auteur(s) (Format : Nom, Prénom ou Noms séparés par des virgules) *
              </label>
              <input
                type="text"
                value={authors}
                onChange={(e) => setAuthors(e.target.value)}
                placeholder="Ex: Cormen, Thomas H., Leiserson, Charles E."
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Titre de l'ouvrage, polycopié ou article *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Introduction to Algorithms (4th Edition)"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Année de parution *
                </label>
                <input
                  type="text"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder="2024"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Éditeur / Institution UY1
                </label>
                <input
                  type="text"
                  value={publisher}
                  onChange={(e) => setPublisher(e.target.value)}
                  placeholder="Faculté des Sciences, UY1"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Ville / Pays
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Yaoundé, Cameroun"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Pages citées
                </label>
                <input
                  type="text"
                  value={pages}
                  onChange={(e) => setPages(e.target.value)}
                  placeholder="Ex: 45-60"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Identifiant DOI (Optionnel)
                </label>
                <input
                  type="text"
                  value={doi}
                  onChange={(e) => setDoi(e.target.value)}
                  placeholder="10.1109/TPDS.2024..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Lien URL de consultation
                </label>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={handleAddToBibliography}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-xs transition-colors"
            >
              <Plus size={14} />
              <span>Ajouter à ma bibliographie de mémoire</span>
            </button>
          </div>
        </div>

        {/* Right Column: Live Formatted Citation & BibTeX (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Live Formatted Citation Preview */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                Citation Formatée ({currentStyle})
              </span>

              <button
                type="button"
                onClick={handleCopyCitation}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-300"
              >
                {copiedFormatted ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                <span>{copiedFormatted ? 'Copié !' : 'Copier'}</span>
              </button>
            </div>

            {/* Formatted Citation Output Box */}
            <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40 text-xs md:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-serif">
              {formattedCitation}
            </div>

            <p className="text-[11px] text-slate-400">
              Prêt à être collé dans la section « Références bibliographiques » de votre rapport Word ou LaTeX.
            </p>
          </div>

          {/* BibTeX Export Box */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">
                Format LaTeX BibTeX (.bib)
              </span>

              <button
                type="button"
                onClick={handleCopyBibtex}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-300"
              >
                {copiedBibtex ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                <span>{copiedBibtex ? 'Copié !' : 'Copier'}</span>
              </button>
            </div>

            <pre className="p-3.5 rounded-2xl bg-slate-950 text-emerald-400 font-mono text-xs overflow-x-auto whitespace-pre-wrap leading-relaxed border border-slate-800">
              {bibtexSnippet}
            </pre>
          </div>
        </div>
      </div>

      {/* Saved Bibliography Table */}
      {savedBibliography.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <BookMarked size={16} className="text-purple-600" />
                <span>Ma Bibliographie de Mémoire ({savedBibliography.length} références sauvegardées)</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Références rassemblées pour la session en cours.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleExportAllTxt}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-xs"
              >
                <Download size={14} />
                <span>Exporter le fichier (.txt)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Voulez-vous vider votre bibliographie de mémoire ?')) {
                    setSavedBibliography([]);
                    localStorage.removeItem(STORAGE_SAVED_CITATIONS_KEY);
                  }
                }}
                className="p-2 text-slate-400 hover:text-rose-600 rounded-xl border border-slate-200 dark:border-slate-700"
                title="Vider la bibliographie"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>

          <div className="space-y-2.5 pt-1">
            {savedBibliography.map((item, idx) => (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs flex items-start justify-between gap-3"
              >
                <div className="flex items-start gap-2.5">
                  <span className="font-bold text-purple-600 font-mono">[{idx + 1}]</span>
                  <div className="space-y-1">
                    <p className="text-slate-800 dark:text-slate-200 font-serif leading-relaxed">
                      {item.citation}
                    </p>
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                      Norme {item.style}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteSavedCitation(item.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg flex-shrink-0"
                  title="Supprimer"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
