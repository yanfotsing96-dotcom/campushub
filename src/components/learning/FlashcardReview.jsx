import { useState, useEffect, useMemo } from 'react';
import {
  RotateCw,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  Shuffle,
  RotateCcw,
  Plus,
  BookOpen,
  Award,
  Layers,
  X,
} from 'lucide-react';
import { DEFAULT_FLASHCARD_DECKS } from './data/flashcardDecks';

const STORAGE_KEY_MASTERED = 'campushub_flashcards_mastered';
const STORAGE_KEY_CUSTOM_DECKS = 'campushub_flashcards_custom_decks';

export default function FlashcardReview() {
  const [selectedDeckId, setSelectedDeckId] = useState(DEFAULT_FLASHCARD_DECKS[0].id);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [masteredIds, setMasteredIds] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MASTERED);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [customDecks, setCustomDecks] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CUSTOM_DECKS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCard, setNewCard] = useState({ question: '', answer: '', hint: '', tag: 'C & Algorithmique' });

  // Merge default and custom decks
  const allDecks = useMemo(() => {
    return [...DEFAULT_FLASHCARD_DECKS, ...customDecks];
  }, [customDecks]);

  const activeDeck = useMemo(() => {
    return allDecks.find((d) => d.id === selectedDeckId) || allDecks[0];
  }, [allDecks, selectedDeckId]);

  const [deckCards, setDeckCards] = useState(() => activeDeck?.cards || []);

  const handleSelectDeck = (deckId) => {
    setSelectedDeckId(deckId);
    const targetDeck = allDecks.find((d) => d.id === deckId);
    if (targetDeck) {
      setDeckCards(targetDeck.cards);
      setCurrentIndex(0);
      setIsFlipped(false);
      setShowHint(false);
    }
  };

  // Persist mastered list
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_MASTERED, JSON.stringify(masteredIds));
    } catch (err) {
      console.warn('Erreur de sauvegarde locale :', err);
    }
  }, [masteredIds]);

  const currentCard = deckCards[currentIndex] || deckCards[0];
  const isCurrentMastered = currentCard ? masteredIds.includes(currentCard.id) : false;

  const deckMasteredCount = useMemo(() => {
    if (!activeDeck) return 0;
    return activeDeck.cards.filter((c) => masteredIds.includes(c.id)).length;
  }, [activeDeck, masteredIds]);

  const progressPercent = activeDeck?.cards?.length
    ? Math.round((deckMasteredCount / activeDeck.cards.length) * 100)
    : 0;

  const handleNext = () => {
    setIsFlipped(false);
    setShowHint(false);
    setCurrentIndex((prev) => (prev + 1 < deckCards.length ? prev + 1 : 0));
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setShowHint(false);
    setCurrentIndex((prev) => (prev - 1 >= 0 ? prev - 1 : deckCards.length - 1));
  };

  const toggleFlip = () => {
    setIsFlipped((prev) => !prev);
  };

  const toggleMastered = (cardId) => {
    setMasteredIds((prev) => {
      if (prev.includes(cardId)) {
        return prev.filter((id) => id !== cardId);
      } else {
        return [...prev, cardId];
      }
    });
  };

  const handleShuffle = () => {
    setIsFlipped(false);
    setShowHint(false);
    const shuffled = [...deckCards].sort(() => Math.random() - 0.5);
    setDeckCards(shuffled);
    setCurrentIndex(0);
  };

  const handleResetProgress = () => {
    if (window.confirm('Voulez-vous réinitialiser votre progression pour ce paquet de cartes ?')) {
      const activeIds = activeDeck.cards.map((c) => c.id);
      setMasteredIds((prev) => prev.filter((id) => !activeIds.includes(id)));
    }
  };

  const handleAddCard = (e) => {
    e.preventDefault();
    if (!newCard.question.trim() || !newCard.answer.trim()) return;

    const createdCard = {
      id: `custom-card-${Date.now()}`,
      question: newCard.question.trim(),
      answer: newCard.answer.trim(),
      hint: newCard.hint.trim() || 'Aucun indice fourni',
      tag: newCard.tag || 'Personnel',
    };

    // Add to custom deck or create custom deck
    let updatedCustomDecks = [...customDecks];
    const existingDeckIdx = updatedCustomDecks.findIndex((d) => d.id === 'deck-custom');

    if (existingDeckIdx >= 0) {
      updatedCustomDecks[existingDeckIdx].cards.push(createdCard);
    } else {
      updatedCustomDecks.push({
        id: 'deck-custom',
        title: 'Mes Cartes Personnalisées',
        badge: 'Mes Notes · UY1',
        description: 'Cartes mémoires créées par l\'étudiant pour ses révisions personnelles.',
        cards: [createdCard],
      });
    }

    setCustomDecks(updatedCustomDecks);
    localStorage.setItem(STORAGE_KEY_CUSTOM_DECKS, JSON.stringify(updatedCustomDecks));
    setSelectedDeckId('deck-custom');
    const createdDeck = updatedCustomDecks.find((d) => d.id === 'deck-custom');
    if (createdDeck) {
      setDeckCards(createdDeck.cards);
      setCurrentIndex(createdDeck.cards.length - 1);
    }
    setNewCard({ question: '', answer: '', hint: '', tag: 'C & Algorithmique' });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Deck Selector & Global Progress Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/50 mb-2">
              <Layers size={13} />
              <span>CampusHub · Répétition Espacée</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              Cartes Mémoires Interactives
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Révisez vos notions clés du cursus informatique de l'Université de Yaoundé I.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleShuffle}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
              title="Mélanger l'ordre des cartes"
            >
              <Shuffle size={14} />
              <span>Mélanger</span>
            </button>
            <button
              type="button"
              onClick={handleResetProgress}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
              title="Réinitialiser les statuts maîtrisés"
            >
              <RotateCcw size={14} />
              <span>Réinitialiser</span>
            </button>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-colors"
            >
              <Plus size={14} />
              <span>Créer une carte</span>
            </button>
          </div>
        </div>

        {/* Deck Pills */}
        <div className="mt-5 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {allDecks.map((deck) => {
            const isSelected = deck.id === selectedDeckId;
            return (
              <button
                key={deck.id}
                type="button"
                onClick={() => handleSelectDeck(deck.id)}
                className={`flex-shrink-0 text-left px-3.5 py-2 rounded-xl text-xs transition-all border ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md font-semibold'
                    : 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <BookOpen size={13} className={isSelected ? 'text-indigo-200' : 'text-slate-400'} />
                  <span>{deck.title}</span>
                </div>
                <div className={`mt-0.5 text-[11px] ${isSelected ? 'text-indigo-100' : 'text-slate-500 dark:text-slate-400'}`}>
                  {deck.cards.length} cartes · {deck.cards.filter((c) => masteredIds.includes(c.id)).length} maîtrisée(s)
                </div>
              </button>
            );
          })}
        </div>

        {/* Progression Progress Bar */}
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 font-medium">
            <Award size={15} className="text-amber-500" />
            <span>Maîtrise du paquet : {deckMasteredCount} / {deckCards.length} cartes ({progressPercent}%)</span>
          </div>
          <div className="w-48 max-w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-emerald-500 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Flashcard Display Area */}
      {currentCard ? (
        <div className="flex flex-col items-center">
          {/* Card Counter & Tag Header */}
          <div className="w-full max-w-2xl mb-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Carte {currentIndex + 1} sur {deckCards.length}
              </span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-mono text-[11px] text-slate-600 dark:text-slate-300">
                {currentCard.tag || 'Notion'}
              </span>
            </div>

            {isCurrentMastered && (
              <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium text-xs">
                <CheckCircle2 size={14} />
                <span>Maîtrisée</span>
              </span>
            )}
          </div>

          {/* Interactive Card Container (Click to Flip) */}
          <div
            onClick={toggleFlip}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                toggleFlip();
              }
            }}
            className="w-full max-w-2xl min-h-[300px] cursor-pointer group focus:outline-none select-none"
            aria-label="Cliquer pour retourner la carte"
          >
            <div
              className={`relative w-full h-full min-h-[300px] p-8 rounded-3xl border transition-all duration-300 flex flex-col justify-between shadow-md ${
                isFlipped
                  ? 'bg-gradient-to-br from-indigo-50/90 to-purple-50/90 dark:from-slate-900 dark:to-indigo-950/40 border-indigo-300 dark:border-indigo-800'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-slate-700'
              }`}
            >
              {/* Badge side */}
              <div className="flex items-center justify-between text-xs">
                <span
                  className={`px-3 py-1 rounded-full font-bold uppercase tracking-wider text-[10px] ${
                    isFlipped
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {isFlipped ? 'VERSO · RÉPONSE' : 'RECTO · QUESTION'}
                </span>

                <div className="flex items-center gap-1 text-slate-400 dark:text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors text-xs font-medium">
                  <RotateCw size={13} className="transition-transform duration-300 group-hover:rotate-180" />
                  <span>Cliquer pour retourner</span>
                </div>
              </div>

              {/* Main Card Content */}
              <div className="py-6 my-auto text-center">
                {!isFlipped ? (
                  <div className="space-y-4">
                    <p className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100 leading-relaxed max-w-xl mx-auto">
                      {currentCard.question}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 italic">
                      Prenez un instant pour formuler la réponse avant de tourner la carte.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    <div className="text-base md:text-lg text-slate-800 dark:text-slate-200 leading-relaxed font-medium whitespace-pre-line text-left bg-white/60 dark:bg-slate-900/60 p-5 rounded-2xl border border-indigo-100 dark:border-indigo-900/50">
                      {currentCard.answer}
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Hint or Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800/80 text-xs">
                {currentCard.hint ? (
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowHint((prev) => !prev);
                    }}
                    className="inline-flex items-center gap-1.5 text-amber-600 dark:text-amber-400 hover:underline font-medium cursor-pointer"
                  >
                    <HelpCircle size={14} />
                    <span>{showHint ? `Indice : ${currentCard.hint}` : 'Afficher un indice'}</span>
                  </div>
                ) : (
                  <div />
                )}

                <div className="text-slate-400 dark:text-slate-500 font-mono text-[11px]">
                  Espace / Entrée pour tourner
                </div>
              </div>
            </div>
          </div>

          {/* Navigation & Action Controls Bar */}
          <div className="w-full max-w-2xl mt-6 flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3.5 rounded-2xl shadow-sm">
            {/* Previous */}
            <button
              type="button"
              onClick={handlePrev}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium text-xs transition-colors shadow-sm"
            >
              <ChevronLeft size={16} />
              <span>Précédent</span>
            </button>

            {/* Flip Center Action */}
            <button
              type="button"
              onClick={toggleFlip}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs transition-colors"
            >
              <RotateCw size={15} />
              <span>{isFlipped ? 'Voir la question' : 'Retourner la carte'}</span>
            </button>

            {/* Mastered Toggle */}
            <button
              type="button"
              onClick={() => toggleMastered(currentCard.id)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isCurrentMastered
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm'
                  : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100'
              }`}
            >
              <CheckCircle2 size={16} />
              <span>{isCurrentMastered ? 'Maîtrisé ✓' : 'Marquer comme maîtrisé'}</span>
            </button>

            {/* Next */}
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium text-xs transition-colors shadow-sm"
            >
              <span>Suivant</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
          <Sparkles className="mx-auto text-indigo-500 mb-2" size={32} />
          <p className="font-semibold text-slate-800 dark:text-slate-200">Aucune carte dans ce paquet.</p>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-medium"
          >
            Ajouter la première carte
          </button>
        </div>
      )}

      {/* Modal : Ajouter une carte personnalisée */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-lg shadow-2xl relative">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full"
            >
              <X size={18} />
            </button>

            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-1">
              <Plus size={18} className="text-indigo-600" />
              <span>Créer une carte mémoire personnalisée</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Ajoutez une notion clé d'un cours de l'Université de Yaoundé I pour vos révisions.
            </p>

            <form onSubmit={handleAddCard} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Question / Notion recto *
                </label>
                <textarea
                  rows={2}
                  value={newCard.question}
                  onChange={(e) => setNewCard({ ...newCard, question: e.target.value })}
                  placeholder="Ex : Quelle est la différence entre pile et tas en C ?"
                  required
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Réponse / Explication verso *
                </label>
                <textarea
                  rows={3}
                  value={newCard.answer}
                  onChange={(e) => setNewCard({ ...newCard, answer: e.target.value })}
                  placeholder="Explication claire, formule ou syntaxe de référence..."
                  required
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Indice optionnel
                  </label>
                  <input
                    type="text"
                    value={newCard.hint}
                    onChange={(e) => setNewCard({ ...newCard, hint: e.target.value })}
                    placeholder="Pensez aux allocations..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Matière / Tag
                  </label>
                  <input
                    type="text"
                    value={newCard.tag}
                    onChange={(e) => setNewCard({ ...newCard, tag: e.target.value })}
                    placeholder="Ex : INF231, BD, Maths"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm"
                >
                  Enregistrer la carte
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
