import { useState, useMemo } from 'react';
import {
  Sparkles,
  Search,
  BookOpen,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Quote,
  Flame,
  Award,
} from 'lucide-react';
import { FIGURES_OF_STYLE_DATA } from '../data/falshData';

const QUIZ_QUESTIONS = [
  {
    id: 1,
    citation: '« Le poète est semblable au prince des nuées / Qui hante la tempête et se rit de l\'archer » (Charles Baudelaire)',
    options: ['Comparaison', 'Métaphore', 'Litote', 'Oxymore'],
    correct: 'Comparaison',
    explication: 'La présence explicite de l\'outil de comparaison « semblable à » caractérise formellement la comparaison.',
  },
  {
    id: 2,
    citation: '« Cette obscure clarté qui tombe des étoiles » (Pierre Corneille, Le Cid)',
    options: ['Antithèse', 'Oxymore', 'Hyperbole', 'Métonymie'],
    correct: 'Oxymore',
    explication: 'L\'association côte à côte de deux mots contradictoires (« obscure » et « clarté ») au sein du même syntagme forme un oxymore.',
  },
  {
    id: 3,
    citation: '« Haïti où la négritude se mit debout pour la première fois » (Aimé Césaire)',
    options: ['Personnification', 'Métonymie', 'Litote', 'Euphémisme'],
    correct: 'Personnification',
    explication: 'Attribuer le geste humain de « se mettre debout » au concept abstrait de la négritude constitue une personnification frappante.',
  },
  {
    id: 4,
    citation: '« Il faut manger pour vivre et non pas vivre pour manger » (Molière)',
    options: ['Chiasme', 'Anaphore', 'Allégorie', 'Synecdoque'],
    correct: 'Chiasme',
    explication: 'La disposition croisée des termes (manger - vivre / vivre - manger) structure un chiasme symétrique.',
  },
];

const CATEGORIES = ['Tous', 'Analogie', 'Substitution', 'Opposition', 'Insistance', 'Atténuation'];

export default function FiguresOfStyleModule() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [activeTab, setActiveTab] = useState('dictionary'); // 'dictionary' | 'quiz'

  // Quiz state
  const [currentQuizIdx, setCurrentQuizIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const filteredFigures = useMemo(() => {
    return FIGURES_OF_STYLE_DATA.filter((fig) => {
      const matchCat = selectedCategory === 'Tous' || fig.category === selectedCategory;
      const matchSearch =
        fig.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fig.definition.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fig.exempleClassique.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fig.exempleAfricain.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [searchQuery, selectedCategory]);

  const handleAnswerClick = (option) => {
    if (selectedOption !== null) return;
    setSelectedOption(option);
    if (option === QUIZ_QUESTIONS[currentQuizIdx].correct) {
      setScore((s) => s + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuizIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuizIdx((i) => i + 1);
      setSelectedOption(null);
    } else {
      setQuizFinished(true);
    }
  };

  const handleResetQuiz = () => {
    setCurrentQuizIdx(0);
    setSelectedOption(null);
    setScore(0);
    setQuizFinished(false);
  };

  return (
    <div className="space-y-6 text-left">
      {/* En-tête du Module */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
            <Sparkles size={13} />
            <span>Module 2 · Stylistique & Rhétorique Comparée</span>
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-white mt-1">
            Guide Interactif des Figures de Style & Effets de Sens
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Dictionnaire complet avec corpus classique et littérature négro-africaine, enrichi d'un module d'auto-évaluation.
          </p>
        </div>

        {/* Bascule Dictionnaire / Quiz */}
        <div className="inline-flex p-1 rounded-xl bg-slate-950 border border-slate-800 self-start md:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('dictionary')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'dictionary'
                ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen size={14} />
            <span>Dictionnaire ({FIGURES_OF_STYLE_DATA.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('quiz')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'quiz'
                ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Award size={14} />
            <span>Test d'Identification</span>
          </button>
        </div>
      </div>

      {activeTab === 'dictionary' && (
        <>
          {/* Barre de Recherche et Filtres par Catégorie */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-3 rounded-2xl">
            {/* Champ de recherche */}
            <div className="relative flex-1 max-w-md">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher une figure, une définition ou un auteur..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            {/* Onglets de Catégorie */}
            <div className="flex flex-wrap items-center gap-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    selectedCategory === cat
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Grille des Figures de Style */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFigures.map((fig) => (
              <div
                key={fig.id}
                className="bg-slate-900 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-extrabold text-white tracking-wide">
                      {fig.name}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 font-bold">
                      {fig.category}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed font-sans mb-3">
                    {fig.definition}
                  </p>

                  <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1 mb-2.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                      <Flame size={11} />
                      <span>Effet Stylistique Produit :</span>
                    </span>
                    <p className="text-[11px] text-slate-400 leading-normal">
                      {fig.effet}
                    </p>
                  </div>
                </div>

                {/* Exemples biculturels */}
                <div className="space-y-2 pt-2 border-t border-slate-800/60 text-xs">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-semibold text-slate-500 flex items-center gap-1">
                      <Quote size={10} className="text-indigo-400" />
                      <span>Exemple Patrimonial Classique :</span>
                    </span>
                    <p className="text-[11px] text-slate-300 italic font-serif pl-2 border-l border-indigo-500/40">
                      {fig.exempleClassique}
                    </p>
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-[10px] font-semibold text-amber-500/80 flex items-center gap-1">
                      <Quote size={10} className="text-amber-400" />
                      <span>Exemple Corpus Négro-Africain :</span>
                    </span>
                    <p className="text-[11px] text-amber-200/90 italic font-serif pl-2 border-l border-amber-500/40">
                      {fig.exempleAfricain}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredFigures.length === 0 && (
            <div className="p-12 text-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-500">
              <BookOpen size={36} className="mx-auto mb-2 text-slate-600" />
              <p className="text-sm font-semibold">Aucune figure trouvée pour votre recherche.</p>
              <p className="text-xs mt-1">Essayez un autre mot-clé ou sélectionnez « Tous ».</p>
            </div>
          )}
        </>
      )}

      {/* Mode Quiz Interactif d'Identification */}
      {activeTab === 'quiz' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl max-w-2xl mx-auto space-y-6">
          {!quizFinished ? (
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
                <span className="text-amber-400 font-bold uppercase tracking-wider">
                  Question {currentQuizIdx + 1} / {QUIZ_QUESTIONS.length}
                </span>
                <span className="font-mono text-slate-400">
                  Score actuel : {score} point{score > 1 ? 's' : ''}
                </span>
              </div>

              {/* Citation à identifier */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-2">
                <span className="text-[11px] text-slate-500 uppercase tracking-widest font-bold">
                  Identifiez la figure de style dominante :
                </span>
                <p className="text-sm sm:text-base text-amber-200 font-serif italic leading-relaxed">
                  {QUIZ_QUESTIONS[currentQuizIdx].citation}
                </p>
              </div>

              {/* Options de réponse */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {QUIZ_QUESTIONS[currentQuizIdx].options.map((option) => {
                  const isSelected = selectedOption === option;
                  const isCorrect = option === QUIZ_QUESTIONS[currentQuizIdx].correct;

                  let btnStyle = 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-200';
                  if (selectedOption !== null) {
                    if (isCorrect) {
                      btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-300 font-bold';
                    } else if (isSelected) {
                      btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-300 font-bold';
                    } else {
                      btnStyle = 'bg-slate-950/40 border-slate-800/40 text-slate-500';
                    }
                  }

                  return (
                    <button
                      key={option}
                      type="button"
                      disabled={selectedOption !== null}
                      onClick={() => handleAnswerClick(option)}
                      className={`p-3.5 rounded-xl border text-xs text-left transition-all flex items-center justify-between ${btnStyle} cursor-pointer`}
                    >
                      <span>{option}</span>
                      {selectedOption !== null && isCorrect && (
                        <CheckCircle2 size={16} className="text-emerald-400" />
                      )}
                      {selectedOption !== null && isSelected && !isCorrect && (
                        <XCircle size={16} className="text-rose-400" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explication après réponse */}
              {selectedOption !== null && (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-amber-400">
                    <Sparkles size={14} />
                    <span>Explication pédagogique :</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    {QUIZ_QUESTIONS[currentQuizIdx].explication}
                  </p>
                  <div className="flex justify-end pt-2">
                    <button
                      type="button"
                      onClick={handleNextQuestion}
                      className="px-4 py-1.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors cursor-pointer"
                    >
                      {currentQuizIdx < QUIZ_QUESTIONS.length - 1 ? 'Question suivante' : 'Voir mon score'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 space-y-4">
              <Award size={48} className="mx-auto text-amber-400" />
              <h3 className="text-lg font-bold text-white">Évaluation Terminée !</h3>
              <p className="text-sm text-slate-300">
                Votre score est de <strong className="text-amber-400">{score} sur {QUIZ_QUESTIONS.length}</strong>.
              </p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                {score === QUIZ_QUESTIONS.length
                  ? 'Félicitations ! Vous maîtrisez parfaitement l\'identification des figures de style au niveau Licence/Master.'
                  : 'Bon entraînement ! Révisez les définitions dans le dictionnaire pour consolider votre œil critique.'}
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleResetQuiz}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RotateCcw size={14} />
                  <span>Recommencer le test</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
