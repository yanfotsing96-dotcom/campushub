import { useState, useMemo } from 'react';
import {
  Search,
  ChevronDown,
  Sparkles,
  User,
  BookOpen,
  Terminal,
  Crown,
  ShieldCheck,
  ThumbsUp,
  ThumbsDown,
  Check,
  HelpCircle,
} from 'lucide-react';
import { HELP_CATEGORIES, FAQ_ITEMS } from './data/helpData';

const CATEGORY_ICONS = {
  Sparkles,
  User,
  BookOpen,
  Terminal,
  Crown,
  ShieldCheck,
};

export default function HelpFaqSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [openFaqId, setOpenFaqId] = useState('faq-1');
  const [feedbackGiven, setFeedbackGiven] = useState({}); // { [faqId]: 'up' | 'down' }

  // Filter FAQ items
  const filteredFaqs = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return FAQ_ITEMS.filter((item) => {
      const matchesCategory =
        selectedCategory === 'all' || item.category === selectedCategory;
      if (!matchesCategory) return false;

      if (!q) return true;
      return (
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [searchQuery, selectedCategory]);

  const toggleAccordion = (id) => {
    setOpenFaqId((prev) => (prev === id ? null : id));
  };

  const handleFeedback = (faqId, type) => {
    setFeedbackGiven((prev) => ({ ...prev, [faqId]: type }));
  };

  return (
    <div className="space-y-6">
      {/* Search Header Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="max-w-2xl mx-auto text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/50">
            <HelpCircle size={14} className="text-indigo-600" />
            <span>Base de Connaissances & FAQ Étudiante</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-slate-100">
            Comment pouvons-nous vous aider aujourd'hui ?
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Recherchez instantanément parmi les questions fréquentes sur les cours, le compilateur C/Python ou les paiements Mobile Money.
          </p>

          {/* Search Input */}
          <div className="relative pt-2">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tapez un mot-clé (ex: MoMo, GCC, mot de passe, annales, anti-plagiat, matricule...)"
              className="w-full pl-11 pr-4 py-3 text-xs md:text-sm rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-inner"
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-2">
          {HELP_CATEGORIES.map((cat) => {
            const Icon = CATEGORY_ICONS[cat.icon] || Sparkles;
            const isSelected = selectedCategory === cat.id;

            // Count for category
            const count =
              cat.id === 'all'
                ? FAQ_ITEMS.length
                : FAQ_ITEMS.filter((f) => f.category === cat.id).length;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 border ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <Icon size={14} />
                <span>{cat.label}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Accordion FAQ Items List */}
      <div className="space-y-3 max-w-4xl mx-auto">
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-12 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center mx-auto">
              <Search size={22} />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Aucune question trouvée pour « {searchQuery} »
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Essayez un autre mot-clé ou soumettez directement votre question à l'équipe de support via le formulaire de ticket ci-dessous.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white shadow-xs"
            >
              Réinitialiser la recherche
            </button>
          </div>
        ) : (
          filteredFaqs.map((faq) => {
            const isOpen = openFaqId === faq.id;
            const feedback = feedbackGiven[faq.id];

            return (
              <div
                key={faq.id}
                className={`rounded-2xl border transition-all overflow-hidden ${
                  isOpen
                    ? 'border-indigo-500/80 bg-white dark:bg-slate-900 shadow-md ring-1 ring-indigo-500/20'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {/* Accordion Header */}
                <button
                  type="button"
                  onClick={() => toggleAccordion(faq.id)}
                  className="w-full p-4 md:p-5 text-left flex items-start justify-between gap-4 transition-colors"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {faq.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <h3 className="text-xs md:text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug">
                      {faq.question}
                    </h3>
                  </div>

                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-200 mt-0.5 ${
                      isOpen
                        ? 'bg-indigo-600 text-white rotate-180 shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                    }`}
                  >
                    <ChevronDown size={16} />
                  </div>
                </button>

                {/* Accordion Body */}
                {isOpen && (
                  <div className="px-4 md:px-5 pb-5 pt-2 border-t border-slate-100 dark:border-slate-800 space-y-4 animate-in fade-in duration-150">
                    <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {faq.answer}
                    </p>

                    {/* Helpfulness Feedback Bar */}
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <span className="text-[11px]">
                        Cette réponse vous a-t-elle aidé à résoudre votre problème ?
                      </span>

                      <div className="flex items-center gap-2">
                        {feedback ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg">
                            <Check size={12} />
                            <span>Merci pour votre retour !</span>
                          </span>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => handleFeedback(faq.id, 'up')}
                              className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center gap-1.5 text-[11px] font-semibold transition-colors"
                            >
                              <ThumbsUp size={12} />
                              <span>Oui</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleFeedback(faq.id, 'down')}
                              className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center gap-1.5 text-[11px] font-semibold transition-colors"
                            >
                              <ThumbsDown size={12} />
                              <span>Non</span>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
