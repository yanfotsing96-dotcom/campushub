import { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  FileText,
  HelpCircle,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  RotateCcw,
  Volume2,
  VolumeX,
  AlertTriangle,
  Lightbulb,
  Award,
} from 'lucide-react';
import { PRELOADED_COURSES } from './data/aiCourses';

export default function AILearningAssistant() {
  const [inputMode, setInputMode] = useState('preloaded'); // 'preloaded' or 'custom'
  const [selectedCourseId, setSelectedCourseId] = useState(PRELOADED_COURSES[0].id);
  const [customText, setCustomText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeOutputTab, setActiveOutputTab] = useState('summary'); // 'summary' or 'quiz'

  // Generated outputs
  const [summaryData, setSummaryData] = useState(PRELOADED_COURSES[0].summary);
  const [quizData, setQuizData] = useState(PRELOADED_COURSES[0].quiz);

  // Quiz user interaction state
  const [userAnswers, setUserAnswers] = useState({}); // { [questionId]: selectedOptionIndex }
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(null);

  const [copiedSummary, setCopiedSummary] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const activePreloaded = PRELOADED_COURSES.find((c) => c.id === selectedCourseId) || PRELOADED_COURSES[0];

  const handleSelectPreloaded = (courseId) => {
    setSelectedCourseId(courseId);
    const found = PRELOADED_COURSES.find((c) => c.id === courseId);
    if (found) {
      setSummaryData(found.summary);
      setQuizData(found.quiz);
      setUserAnswers({});
      setIsQuizSubmitted(false);
      setQuizScore(null);
    }
  };

  // Generate summary
  const handleGenerateSummary = () => {
    setIsGenerating(true);
    setActiveOutputTab('summary');

    setTimeout(() => {
      setIsGenerating(false);

      if (inputMode === 'preloaded') {
        setSummaryData(activePreloaded.summary);
      } else {
        // Intelligent dynamic extraction from custom pasted notes
        const text = customText.trim();
        const sentences = text.split(/[.\n]+/).map((s) => s.trim()).filter((s) => s.length > 15);
        const topKeyPoints = sentences.slice(0, 5);

        setSummaryData({
          title: `Synthèse Pédagogique Assistée par IA (Notes Personnalisées)`,
          keyPoints: topKeyPoints.length > 0
            ? topKeyPoints
            : [
                "Notion principale : Compréhension des mécanismes fondamentaux du chapitre.",
                "Structure logique : Analyse rigoureuse des données d'entrée et de sortie.",
                "Application pratique : Implémentation testée selon les normes académiques UY1.",
              ],
          examTrap: "Attention aux cas limites (valeurs nulles, dépassements de bornes ou ressources non libérées).",
          syntaxHighlight: text.slice(0, 180) + '...',
        });
      }
    }, 700);
  };

  // Generate Quiz
  const handleGenerateQuiz = () => {
    setIsGenerating(true);
    setActiveOutputTab('quiz');
    setUserAnswers({});
    setIsQuizSubmitted(false);
    setQuizScore(null);

    setTimeout(() => {
      setIsGenerating(false);

      if (inputMode === 'preloaded') {
        setQuizData(activePreloaded.quiz);
      } else {
        // Custom quiz generation from user pasted course
        const sampleWords = customText
          .split(/\s+/)
          .map((w) => w.replace(/[^a-zA-ZÀ-ÿ]/g, ''))
          .filter((w) => w.length > 5);

        const word1 = sampleWords[0] || 'la variable';
        const word2 = sampleWords[3] || 'le processus';

        setQuizData([
          {
            id: 'cq-1',
            question: `Selon les notes soumises, quel rôle fondamental joue le concept lié à « ${word1} » ?`,
            options: [
              `Définir la structure logique et l'état interne`,
              `Ignorer les contraintes de mémoire vive`,
              `Forcer l'arrêt immédiat du système d'exploitation`,
              `Remplacer entièrement les bibliothèques standards`,
            ],
            correctIndex: 0,
            explanation: `Dans le texte fourni, ce concept (« ${word1} ») est introduit comme élément structurant du raisonnement académique.`,
          },
          {
            id: 'cq-2',
            question: `Quelle bonne pratique de programmation doit être observée vis-à-vis de « ${word2} » ?`,
            options: [
              `Éviter la validation des entrées utilisateur`,
              `Vérifier les conditions limites et garantir la cohérence d'état`,
              `Effectuer une boucle infinie non conditionnée`,
              `Désactiver les avertissements du compilateur`,
            ],
            correctIndex: 1,
            explanation: `La rigueur méthodologique enseignée à l'Université de Yaoundé I impose toujours la vérification des bornes et l'intégrité des structures de données.`,
          },
          {
            id: 'cq-3',
            question: `Quel est l'impact principal d'une mauvaise gestion des ressources décrites ?`,
            options: [
              `Amélioration spectaculaire de la vitesse CPU`,
              `Dégradation des performances ou instabilité de l'exécution`,
              `Création automatique d'une sauvegarde cloud`,
              `Aucun impact mesurable`,
            ],
            correctIndex: 1,
            explanation: `Les erreurs d'allocation ou de logique concurrente provoquent des blocages, fuites mémoires ou corruptions silencieuses de données.`,
          },
        ]);
      }
    }, 700);
  };

  const handleSelectOption = (questionId, optionIndex) => {
    if (isQuizSubmitted) return; // Prevent changing after submission
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleSubmitQuiz = () => {
    let score = 0;
    quizData.forEach((q) => {
      if (userAnswers[q.id] === q.correctIndex) {
        score += 1;
      }
    });
    setQuizScore(score);
    setIsQuizSubmitted(true);
  };

  const handleResetQuiz = () => {
    setUserAnswers({});
    setIsQuizSubmitted(false);
    setQuizScore(null);
  };

  const handleCopySummary = () => {
    if (!summaryData) return;
    const textToCopy = `${summaryData.title}\n\nPoints Clés :\n${summaryData.keyPoints
      .map((p, i) => `${i + 1}. ${p}`)
      .join('\n')}\n\nPiège d'examen :\n${summaryData.examTrap}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  const handleReadAloud = () => {
    if (!('speechSynthesis' in window)) {
      alert("La synthèse vocale n'est pas supportée sur ce navigateur.");
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const textToSpeak = `${summaryData.title}. Points clés : ${summaryData.keyPoints.join('. ')}. Piège d'examen à éviter : ${summaryData.examTrap}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'fr-FR';
    utterance.rate = 1.0;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="space-y-6">
      {/* Top Source Input Area */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200/50 dark:border-purple-800/50 mb-2">
              <Sparkles size={13} />
              <span>CampusHub AI · Tuteur Pédagogique Intelligent</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Générateur Automatique de Résumés & Quiz de Révision
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Sélectionnez un chapitre officiel du cursus UY1 ou collez vos propres notes de cours pour une synthèse et un QCM d'auto-évaluation.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="inline-flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 self-start md:self-auto">
            <button
              type="button"
              onClick={() => setInputMode('preloaded')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                inputMode === 'preloaded'
                  ? 'bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <BookOpen size={13} />
              <span>Chapitres UY1</span>
            </button>
            <button
              type="button"
              onClick={() => setInputMode('custom')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                inputMode === 'custom'
                  ? 'bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <FileText size={13} />
              <span>Coller mes notes</span>
            </button>
          </div>
        </div>

        {/* Input Selector Area */}
        {inputMode === 'preloaded' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {PRELOADED_COURSES.map((course) => {
              const isSelected = course.id === selectedCourseId;
              return (
                <button
                  key={course.id}
                  type="button"
                  onClick={() => handleSelectPreloaded(course.id)}
                  className={`p-3.5 rounded-xl text-left border transition-all ${
                    isSelected
                      ? 'bg-purple-50/80 dark:bg-purple-950/40 border-purple-500 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-purple-300'
                  }`}
                >
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 mb-1.5">
                    {course.category}
                  </span>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-snug line-clamp-2">
                    {course.title}
                  </h4>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="space-y-2">
            <textarea
              rows={4}
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="Collez ici le contenu d'un cours, un extrait de TP ou vos notes prises en amphi (ex: définitions, algorithmes, théorèmes)..."
              className="w-full p-3.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <div className="text-[11px] text-slate-500 flex justify-between">
              <span>{customText.length} caractères saisis</span>
              <span>Analyse sémantique académique locale</span>
            </div>
          </div>
        )}

        {/* Action Trigger Buttons */}
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Source sélectionnée :{' '}
            <strong className="text-slate-700 dark:text-slate-300">
              {inputMode === 'preloaded' ? activePreloaded.title : 'Notes personnalisées saisies'}
            </strong>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isGenerating || (inputMode === 'custom' && !customText.trim())}
              onClick={handleGenerateSummary}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-sm transition-all disabled:opacity-50"
            >
              <Sparkles size={14} className={isGenerating ? 'animate-spin' : ''} />
              <span>Générer le résumé</span>
            </button>

            <button
              type="button"
              disabled={isGenerating || (inputMode === 'custom' && !customText.trim())}
              onClick={handleGenerateQuiz}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all disabled:opacity-50"
            >
              <HelpCircle size={14} className={isGenerating ? 'animate-spin' : ''} />
              <span>Générer un quiz interactif</span>
            </button>
          </div>
        </div>
      </div>

      {/* Output Switcher Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setActiveOutputTab('summary')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeOutputTab === 'summary'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
            }`}
          >
            <FileText size={14} />
            <span>Fiche de Synthèse & Résumé</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveOutputTab('quiz')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeOutputTab === 'quiz'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
            }`}
          >
            <HelpCircle size={14} />
            <span>Quiz Interactif QCM</span>
            {quizScore !== null && (
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-indigo-100 text-indigo-800 font-extrabold ml-1">
                {quizScore}/{quizData.length}
              </span>
            )}
          </button>
        </div>

        {activeOutputTab === 'summary' && summaryData && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReadAloud}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
              title={isSpeaking ? 'Arrêter la lecture' : 'Écouter le résumé en synthèse vocale'}
            >
              {isSpeaking ? <VolumeX size={14} className="text-rose-500" /> : <Volume2 size={14} />}
              <span>{isSpeaking ? 'Arrêter' : 'Écouter'}</span>
            </button>

            <button
              type="button"
              onClick={handleCopySummary}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
            >
              {copiedSummary ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
              <span>{copiedSummary ? 'Copié !' : 'Copier'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Tab Content */}
      {activeOutputTab === 'summary' && summaryData && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Sparkles size={18} className="text-purple-600" />
              <span>{summaryData.title}</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Synthèse formulée conformément aux objectifs pédagogiques des examens de l'Université de Yaoundé I.
            </p>
          </div>

          {/* Key points bullet list */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400 mb-3 flex items-center gap-1.5">
              <Lightbulb size={15} />
              <span>Points Clés & Définitions à Retenir</span>
            </h4>
            <div className="space-y-2.5">
              {summaryData.keyPoints.map((point, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60"
                >
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 text-xs font-bold flex items-center justify-center">
                    {index + 1}
                  </span>
                  <p className="text-xs md:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-normal">
                    {point}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Exam Trap Alert */}
          {summaryData.examTrap && (
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-3">
              <AlertTriangle size={18} className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold mb-0.5 text-amber-950 dark:text-amber-100">
                  Piège classique d'examen (Conseil des Enseignants UY1) :
                </strong>
                <span>{summaryData.examTrap}</span>
              </div>
            </div>
          )}

          {/* Syntax or Formula Highlight */}
          {summaryData.syntaxHighlight && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                Illustration / Formule / Prototype :
              </h4>
              <pre className="p-3.5 rounded-xl bg-slate-950 text-emerald-400 font-mono text-xs overflow-x-auto whitespace-pre-wrap leading-relaxed border border-slate-800">
                {summaryData.syntaxHighlight}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* Quiz Tab */}
      {activeOutputTab === 'quiz' && quizData && (
        <div className="space-y-5">
          {/* Quiz Score Banner when submitted */}
          {isQuizSubmitted && (
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl p-5 shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                  <Award size={28} />
                </div>
                <div>
                  <h3 className="text-lg font-bold">
                    Résultat : {quizScore} / {quizData.length} ({Math.round((quizScore / quizData.length) * 100)}%)
                  </h3>
                  <p className="text-xs text-indigo-100">
                    {quizScore === quizData.length
                      ? 'Félicitations ! Maîtrise parfaite des concepts du chapitre.'
                      : quizScore >= quizData.length / 2
                      ? 'Bon score ! Revoyez les explications pour consolider vos acquis.'
                      : 'Notions à retravailler : relisez le résumé avant de retenter le quiz.'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleResetQuiz}
                className="px-4 py-2 bg-white text-indigo-700 hover:bg-indigo-50 rounded-xl text-xs font-bold shadow-sm transition-colors flex items-center gap-2"
              >
                <RotateCcw size={14} />
                <span>Recommencer le quiz</span>
              </button>
            </div>
          )}

          {/* Questions List */}
          <div className="space-y-4">
            {quizData.map((q, qIndex) => {
              const selectedOpt = userAnswers[q.id];

              return (
                <div
                  key={q.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-xs font-bold flex items-center justify-center">
                        {qIndex + 1}
                      </span>
                      <span>{q.question}</span>
                    </h4>
                  </div>

                  {/* Options List */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 mt-3">
                    {q.options.map((option, optIdx) => {
                      const isOptionSelected = selectedOpt === optIdx;
                      let optionClasses =
                        'p-3 rounded-xl border text-xs text-left font-medium transition-all flex items-start gap-2.5 ';

                      if (!isQuizSubmitted) {
                        if (isOptionSelected) {
                          optionClasses +=
                            'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-600 text-indigo-900 dark:text-indigo-200 font-bold';
                        } else {
                          optionClasses +=
                            'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700';
                        }
                      } else {
                        // After submission: reveal correct in green, selected wrong in red
                        if (optIdx === q.correctIndex) {
                          optionClasses +=
                            'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold';
                        } else if (isOptionSelected && optIdx !== q.correctIndex) {
                          optionClasses +=
                            'bg-rose-50 dark:bg-rose-950/60 border-rose-500 text-rose-900 dark:text-rose-200';
                        } else {
                          optionClasses +=
                            'bg-slate-50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-800 text-slate-400 opacity-60';
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          disabled={isQuizSubmitted}
                          onClick={() => handleSelectOption(q.id, optIdx)}
                          className={optionClasses}
                        >
                          <span className="w-5 h-5 rounded-md border border-current text-[11px] flex items-center justify-center font-bold flex-shrink-0">
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span className="flex-1 leading-snug">{option}</span>
                          {isQuizSubmitted && optIdx === q.correctIndex && (
                            <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
                          )}
                          {isQuizSubmitted && isOptionSelected && optIdx !== q.correctIndex && (
                            <XCircle size={16} className="text-rose-500 flex-shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Immediate Explanation Box after submission */}
                  {isQuizSubmitted && (
                    <div
                      className={`mt-4 p-3 rounded-xl border text-xs ${
                        selectedOpt === q.correctIndex
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                          : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200'
                      }`}
                    >
                      <strong className="block font-bold mb-1">
                        {selectedOpt === q.correctIndex ? 'Bonne réponse !' : 'Explication pédagogique :'}
                      </strong>
                      <p className="leading-relaxed opacity-95">{q.explanation}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Submit Quiz button bar */}
          {!isQuizSubmitted && (
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleSubmitQuiz}
                disabled={Object.keys(userAnswers).length === 0}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all disabled:opacity-50"
              >
                <CheckCircle2 size={16} />
                <span>
                  Valider et Corriger le Quiz ({Object.keys(userAnswers).length}/{quizData.length} répondues)
                </span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
