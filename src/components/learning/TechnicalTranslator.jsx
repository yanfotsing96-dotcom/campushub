import { useState, useMemo } from 'react';
import {
  Languages,
  Search,
  ArrowRightLeft,
  Volume2,
  Copy,
  Check,
  BookMarked,
  Filter,
  Info,
} from 'lucide-react';
import { TECHNICAL_TERMS, ACADEMIC_CATEGORIES } from './data/academicTerms';

export default function TechnicalTranslator() {
  const [searchQuery, setSearchQuery] = useState('');
  const [direction, setDirection] = useState('en-to-fr'); // 'en-to-fr' or 'fr-to-en'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [copiedId, setCopiedId] = useState(null);

  // Toggle translation direction
  const handleToggleDirection = () => {
    setDirection((prev) => (prev === 'en-to-fr' ? 'fr-to-en' : 'en-to-fr'));
  };

  // Filtered terms
  const filteredTerms = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return TECHNICAL_TERMS.filter((term) => {
      // Category filter
      if (selectedCategory !== 'all' && term.category !== selectedCategory) {
        return false;
      }
      // Text query match
      if (!q) return true;
      return (
        term.en.toLowerCase().includes(q) ||
        term.fr.toLowerCase().includes(q) ||
        term.definitionFr.toLowerCase().includes(q) ||
        term.definitionEn.toLowerCase().includes(q) ||
        (term.notes && term.notes.toLowerCase().includes(q))
      );
    });
  }, [searchQuery, selectedCategory]);

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handlePronounce = (text, lang) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="space-y-6">
      {/* Search & Configuration Header Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/50 dark:border-blue-800/50 mb-2">
              <Languages size={13} />
              <span>Lexique Académique Bilingue · UY1</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              Traducteur & Dictionnaire de Termes Techniques
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Terminologie spécialisée en Informatique, Algorithmique et Systèmes (Anglais ↔ Français).
            </p>
          </div>

          {/* Direction Switcher Button */}
          <button
            type="button"
            onClick={handleToggleDirection}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-all shadow-xs self-start md:self-auto"
          >
            <span>{direction === 'en-to-fr' ? 'Anglais (EN)' : 'Français (FR)'}</span>
            <ArrowRightLeft size={14} className="text-blue-600 dark:text-blue-400" />
            <span>{direction === 'en-to-fr' ? 'Français (FR)' : 'Anglais (EN)'}</span>
          </button>
        </div>

        {/* Live Search Input */}
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher un terme (ex: Pointeur, Allocation, Garbage Collector, Deadlock, Stack overflow)..."
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              Effacer
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs text-slate-400 flex items-center gap-1 mr-1">
            <Filter size={12} />
            <span>Filtrer :</span>
          </span>
          {ACADEMIC_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors border ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Count & Meta */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
        <span>
          {filteredTerms.length} terme{filteredTerms.length > 1 ? 's' : ''} technique{filteredTerms.length > 1 ? 's' : ''} répertorié{filteredTerms.length > 1 ? 's' : ''}
        </span>
        <span className="font-mono text-[11px]">Norme Terminologique ISO/IEC & UY1</span>
      </div>

      {/* Terms Grid */}
      {filteredTerms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTerms.map((term) => {
            const sourceTerm = direction === 'en-to-fr' ? term.en : term.fr;
            const targetTerm = direction === 'en-to-fr' ? term.fr : term.en;
            const sourceLang = direction === 'en-to-fr' ? 'en-US' : 'fr-FR';
            const targetLang = direction === 'en-to-fr' ? 'fr-FR' : 'en-US';
            const primaryDef = direction === 'en-to-fr' ? term.definitionFr : term.definitionEn;

            return (
              <div
                key={term.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs hover:border-blue-300 dark:hover:border-blue-900 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Category Pill & Audio */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {ACADEMIC_CATEGORIES.find((c) => c.id === term.category)?.label || 'Informatique'}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handlePronounce(sourceTerm, sourceLang)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors"
                        title="Prononcer le terme source"
                      >
                        <Volume2 size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCopy(`${sourceTerm} = ${targetTerm}`, term.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors"
                        title="Copier la traduction"
                      >
                        {copiedId === term.id ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                      </button>
                    </div>
                  </div>

                  {/* Primary Translation Pair */}
                  <div className="space-y-1 mb-3">
                    <div className="text-xs text-slate-400 font-medium">
                      {direction === 'en-to-fr' ? 'English' : 'Français'} :
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <span>{sourceTerm}</span>
                    </h3>

                    <div className="pt-2 text-xs text-blue-600 dark:text-blue-400 font-medium flex items-center gap-1">
                      <span>{direction === 'en-to-fr' ? 'Traduction officielle en français :' : 'Official English translation :'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-base font-semibold text-slate-800 dark:text-slate-200">
                        {targetTerm}
                      </div>
                      <button
                        type="button"
                        onClick={() => handlePronounce(targetTerm, targetLang)}
                        className="p-1 rounded text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"
                        title="Prononcer la traduction"
                      >
                        <Volume2 size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Detailed Definition */}
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
                    {primaryDef}
                  </p>

                  {/* Code snippet example */}
                  {term.example && (
                    <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-[11px] font-mono text-emerald-400 overflow-x-auto whitespace-pre-wrap mb-2">
                      <span className="text-slate-500 select-none block text-[10px] mb-0.5">Exemple de code :</span>
                      {term.example}
                    </div>
                  )}
                </div>

                {/* Academic Footnote */}
                {term.notes && (
                  <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-start gap-1.5">
                    <Info size={13} className="text-blue-500 flex-shrink-0 mt-0.5" />
                    <span>{term.notes}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
          <BookMarked className="mx-auto text-slate-400 mb-2" size={32} />
          <p className="font-semibold text-slate-800 dark:text-slate-200">Aucun terme correspondant à « {searchQuery} ».</p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-medium"
          >
            Réinitialiser les filtres
          </button>
        </div>
      )}
    </div>
  );
}
