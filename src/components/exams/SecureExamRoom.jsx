import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Timer,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowLeft,
  Save,
  Award,
  Maximize2,
  Minimize2,
  AlertTriangle,
  Lock,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { examService } from '../../services/examService';
import ExamSecurityCheck from './ExamSecurityCheck';
import ExamFinalSubmitModal from './ExamFinalSubmitModal';

export default function SecureExamRoom({ exam, onExit }) {
  const { user } = useAuth();
  const studentMatricule = user?.matricule || '23S40192';
  const studentUsername = user?.username || user?.email?.split('@')[0] || 'etudiant';

  const [isIdentityVerified, setIsIdentityVerified] = useState(false);
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState(() => {
    const draft = examService.loadDraftAnswers(exam.id, studentMatricule);
    return draft?.answers || {};
  });
  const [remainingSeconds, setRemainingSeconds] = useState(() => {
    const draft = examService.loadDraftAnswers(exam.id, studentMatricule);
    return draft?.remainingSeconds && draft.remainingSeconds > 0
      ? draft.remainingSeconds
      : exam.durationMinutes * 60;
  });

  const [focusLossCount, setFocusLossCount] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [lastAutosave, setLastAutosave] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [showIntegrityWarning, setShowIntegrityWarning] = useState(false);
  const [isLockedByAntiCheat, setIsLockedByAntiCheat] = useState(false);

  const timerRef = useRef(null);
  const roomContainerRef = useRef(null);

  // 1. Submit Exam Callback
  const handleFinalSubmit = useCallback(
    (reason = 'normal') => {
      if (isSubmitting || result) return;
      setIsSubmitting(true);

      const timeSpent = exam.durationMinutes * 60 - remainingSeconds;
      const submission = examService.submitExam(exam.id, user, answers, {
        focusLossCount,
        timeTakenSeconds: Math.max(10, timeSpent),
        submissionReason: reason,
        isAutoSubmitted: reason === 'timeout' || reason === 'anticheat_lock',
      });

      setResult(submission);
      setIsSubmitting(false);
    },
    [isSubmitting, result, exam.durationMinutes, exam.id, remainingSeconds, user, answers, focusLossCount]
  );

  // 2. Active Synchronized Countdown Timer (only starts after Identity Certification)
  useEffect(() => {
    if (result || isLockedByAntiCheat || !isIdentityVerified) return;

    timerRef.current = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleFinalSubmit('timeout');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [result, isLockedByAntiCheat, isIdentityVerified, handleFinalSubmit]);

  // 3. Autosave every 10 seconds
  useEffect(() => {
    if (result || !isIdentityVerified) return;

    const autosaveInterval = setInterval(() => {
      examService.saveDraftAnswers(exam.id, studentMatricule, answers, remainingSeconds);
      setLastAutosave(new Date().toLocaleTimeString());
    }, 10000);

    return () => clearInterval(autosaveInterval);
  }, [exam.id, studentMatricule, answers, remainingSeconds, result, isIdentityVerified]);

  // 4. Anti-Cheat: Window Blur & Tab Switch Detector (3-Strike Rule)
  useEffect(() => {
    if (result || isLockedByAntiCheat || !isIdentityVerified) return;

    const handleFocusLoss = () => {
      setFocusLossCount((prev) => {
        const next = prev + 1;
        setShowIntegrityWarning(true);
        setTimeout(() => setShowIntegrityWarning(false), 5000);

        // If 3 infractions occur: immediate lockdown and forced submission!
        if (next >= 3) {
          setIsLockedByAntiCheat(true);
          handleFinalSubmit('anticheat_lock');
        }
        return next;
      });
    };

    window.addEventListener('blur', handleFocusLoss);
    const handleVisibility = () => {
      if (document.hidden) handleFocusLoss();
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      window.removeEventListener('blur', handleFocusLoss);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [result, isLockedByAntiCheat, isIdentityVerified, handleFinalSubmit]);

  // 5. Fullscreen Toggle
  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        if (roomContainerRef.current?.requestFullscreen) {
          await roomContainerRef.current.requestFullscreen();
          setIsFullscreen(true);
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
          setIsFullscreen(false);
        }
      }
    } catch (err) {
      console.warn('Plein écran non supporté :', err);
    }
  };

  // Fullscreen change listener
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Prevent copy & context menu in exam room
  const handlePreventCopy = (e) => {
    e.preventDefault();
  };

  const handleSelectOption = (questionId, optionId) => {
    if (result || isLockedByAntiCheat) return;
    const updated = { ...answers, [questionId]: optionId };
    setAnswers(updated);
    examService.saveDraftAnswers(exam.id, studentMatricule, updated, remainingSeconds);
    setLastAutosave(new Date().toLocaleTimeString());
  };

  const handleTextAnswer = (questionId, textVal) => {
    if (result || isLockedByAntiCheat) return;
    const updated = { ...answers, [questionId]: textVal };
    setAnswers(updated);
    examService.saveDraftAnswers(exam.id, studentMatricule, updated, remainingSeconds);
    setLastAutosave(new Date().toLocaleTimeString());
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const currentQ = exam.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === exam.questions.length - 1;
  const answeredCount = Object.keys(answers).length;

  // -------------------------------------------------------------
  // Mandatory Identity Verification Checkpoint Gate
  // -------------------------------------------------------------
  if (!isIdentityVerified) {
    return (
      <ExamSecurityCheck
        exam={exam}
        user={user}
        onVerified={() => setIsIdentityVerified(true)}
        onCancel={onExit}
      />
    );
  }

  // -------------------------------------------------------------
  // Result View (Submitted or Locked)
  // -------------------------------------------------------------
  if (result) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-in zoom-in-95">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl text-center space-y-5">
          <div
            className={`w-16 h-16 rounded-3xl flex items-center justify-center mx-auto shadow-lg ${
              isLockedByAntiCheat
                ? 'bg-rose-50 dark:bg-rose-950 text-rose-600 shadow-rose-500/10'
                : result.passed
                ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 shadow-emerald-500/10'
                : 'bg-rose-50 dark:bg-rose-950 text-rose-600 shadow-rose-500/10'
            }`}
          >
            {isLockedByAntiCheat ? (
              <ShieldAlert size={36} />
            ) : result.passed ? (
              <Award size={36} />
            ) : (
              <XCircle size={36} />
            )}
          </div>

          <div className="space-y-1">
            <span
              className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                isLockedByAntiCheat
                  ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                  : result.passed
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                  : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
              }`}
            >
              {isLockedByAntiCheat
                ? 'Copie Verrouillée par Détection Anti-Triche'
                : result.passed
                ? 'Composition Validée · Succès'
                : 'Note Insuffisante · Ajourné'}
            </span>

            <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100">
              Résultat Sécurisé : {exam.codeUe}
            </h2>
            <p className="text-xs text-slate-400">
              {exam.titre} · Session Officielle {exam.academicYear}
            </p>
          </div>

          {/* Detailed Score & Integrity Breakdown */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto pt-2">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                {result.score} / {result.totalPoints}
              </div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Note Finale</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <div className="text-2xl font-black text-slate-800 dark:text-slate-200">
                {result.percentage}%
              </div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Pourcentage</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <div
                className={`text-2xl font-black ${
                  result.integrityScore >= 80 ? 'text-emerald-500' : 'text-rose-500'
                }`}
              >
                {result.integrityScore}%
              </div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Indice Intégrité</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <div className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 truncate">
                {studentMatricule}
              </div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Matricule Étudiant</div>
            </div>
          </div>

          {/* Action Exit */}
          <div className="pt-2">
            <button
              type="button"
              onClick={onExit}
              className="px-6 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 font-bold text-xs shadow-md transition-colors"
            >
              Retour à l'espace compositions
            </button>
          </div>
        </div>

        {/* Question Review */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <Sparkles size={16} className="text-indigo-600" />
            <span>Corrigé de l'Épreuve & Trace d'Évaluation</span>
          </h3>

          <div className="space-y-3.5">
            {result.breakdown.map((item, idx) => (
              <div
                key={item.questionId}
                className={`p-4 rounded-2xl border text-xs space-y-2 ${
                  item.isCorrect
                    ? 'border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/30 dark:bg-emerald-950/20'
                    : 'border-rose-200 dark:border-rose-900/40 bg-rose-50/30 dark:bg-rose-950/20'
                }`}
              >
                <div className="flex items-center justify-between font-bold">
                  <span className="text-slate-800 dark:text-slate-200">
                    Question {idx + 1} ({item.pointsEarned} / {item.pointsPossible} pts)
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 font-bold ${
                      item.isCorrect ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    {item.isCorrect ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                    <span>{item.isCorrect ? 'Exacte' : 'Erronée'}</span>
                  </span>
                </div>

                <p className="font-semibold text-slate-900 dark:text-slate-100">
                  {item.questionText}
                </p>

                <div className="p-3 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-[11px] space-y-1">
                  <div className="font-bold text-indigo-600 dark:text-indigo-400">
                    Explication de l'enseignant ({exam.professor}) :
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {item.explanation}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // Active Exam Room View
  // -------------------------------------------------------------
  return (
    <div
      ref={roomContainerRef}
      onCopy={handlePreventCopy}
      onContextMenu={handlePreventCopy}
      className={`max-w-4xl mx-auto space-y-4 select-none ${
        isFullscreen ? 'bg-slate-100 dark:bg-slate-950 p-6 min-h-screen overflow-y-auto' : ''
      }`}
    >
      {/* Anti-Cheat Floating Banner */}
      {showIntegrityWarning && (
        <div className="p-3.5 rounded-2xl bg-rose-600 text-white text-xs font-bold flex items-center justify-between shadow-xl animate-in slide-in-from-top-4">
          <div className="flex items-center gap-2">
            <AlertTriangle size={18} className="animate-bounce" />
            <span>
              Avertissement Anti-Triche ({focusLossCount}/3) : Sortie de fenêtre détectée ! À la 3ème sortie, la copie est verrouillée.
            </span>
          </div>
          <span className="text-[10px] font-mono bg-white/20 px-2 py-0.5 rounded">
            Matricule {studentMatricule}
          </span>
        </div>
      )}

      {/* Exam Room Header Controller */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 md:p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center font-black text-xs">
            {exam.codeUe}
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>{exam.titre}</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                Filière {exam.filiereId}
              </span>
            </div>
            <div className="text-[10px] text-slate-400 flex items-center gap-2">
              <span>{user?.nom} (@{studentUsername})</span>
              <span>•</span>
              <span className="font-mono">{studentMatricule}</span>
              <span>•</span>
              <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                <Lock size={10} />
                <span>Session Sécurisée</span>
              </span>
            </div>
          </div>
        </div>

        {/* Live Countdown & Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {lastAutosave && (
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
              <Save size={11} />
              <span>Autosave {lastAutosave}</span>
            </span>
          )}

          {/* Fullscreen Button */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-slate-600 dark:text-slate-300 transition-colors"
            title={isFullscreen ? 'Quitter plein écran' : 'Passer en plein écran'}
          >
            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>

          {/* Synchronized Clock */}
          <div
            className={`px-3.5 py-1.5 rounded-2xl flex items-center gap-2 font-mono font-black text-xs border ${
              remainingSeconds < 180
                ? 'bg-rose-50 dark:bg-rose-950 text-rose-600 border-rose-300 animate-pulse'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700'
            }`}
          >
            <Timer size={14} className={remainingSeconds < 180 ? 'text-rose-500' : 'text-indigo-600'} />
            <span>{formatTime(remainingSeconds)}</span>
          </div>
        </div>
      </div>

      {/* Question Stepper Indicator */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {exam.questions.map((q, idx) => {
          const isAnswered = !!answers[q.id];
          const isCurrent = idx === currentQuestionIndex;
          return (
            <button
              key={q.id}
              type="button"
              onClick={() => setCurrentQuestionIndex(idx)}
              className={`w-9 h-9 rounded-xl text-xs font-bold transition-all flex items-center justify-center border ${
                isCurrent
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs ring-2 ring-indigo-500/20'
                  : isAnswered
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-indigo-400'
              }`}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>

      {/* Main Question Sandbox */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <span className="text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Question {currentQuestionIndex + 1} sur {exam.questions.length} ({currentQ.points} points)
          </span>

          <span className="text-[11px] text-slate-400">
            Progression : {answeredCount} / {exam.questions.length} répondue{answeredCount > 1 ? 's' : ''}
          </span>
        </div>

        <h3 className="text-base md:text-lg font-bold text-slate-900 dark:text-slate-100 leading-snug">
          {currentQ.text}
        </h3>

        {/* Options (QCM) ou Zone de Réponse Textuelle (Développement) */}
        {currentQ.type === 'development' || !currentQ.options || currentQ.options.length === 0 ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300">
                Votre argumentation & développement scientifique :
              </span>
              <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                Sauvegarde automatique active
              </span>
            </div>
            <textarea
              rows={6}
              value={answers[currentQ.id] || ''}
              onChange={(e) => handleTextAnswer(currentQ.id, e.target.value)}
              placeholder="Rédigez votre réponse structurée, démonstrations ou fragments de code C/Python..."
              className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 text-xs md:text-sm font-medium text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none leading-relaxed"
            />
          </div>
        ) : (
          <div className="space-y-3">
            {currentQ.options.map((opt) => {
              const isSelected = answers[currentQ.id] === opt.id;
              return (
                <label
                  key={opt.id}
                  className={`flex items-start gap-3 p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-50/80 dark:bg-indigo-950/60 border-indigo-500 shadow-xs'
                      : 'bg-slate-50/50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <input
                    type="radio"
                    name={`question_${currentQ.id}`}
                    checked={isSelected}
                    onChange={() => handleSelectOption(currentQ.id, opt.id)}
                    className="mt-0.5 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-xs md:text-sm text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                    {opt.label}
                  </span>
                </label>
              );
            })}
          </div>
        )}

        {/* Navigation & Final Submit */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <button
            type="button"
            disabled={currentQuestionIndex === 0}
            onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ArrowLeft size={13} />
            <span>Précédente</span>
          </button>

          {isLastQuestion ? (
            <button
              type="button"
              onClick={() => setSubmitModalOpen(true)}
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-emerald-500/20"
            >
              <CheckCircle2 size={15} />
              <span>Valider & Terminer la Composition</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
            >
              <span>Suivante</span>
              <ArrowRight size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Final Matricule Confirmation Signature Modal */}
      <ExamFinalSubmitModal
        isOpen={submitModalOpen}
        onClose={() => setSubmitModalOpen(false)}
        onConfirm={() => {
          setSubmitModalOpen(false);
          handleFinalSubmit('manual_signed');
        }}
        exam={exam}
        user={user}
        answeredCount={answeredCount}
        totalQuestions={exam.questions.length}
        focusLossCount={focusLossCount}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
