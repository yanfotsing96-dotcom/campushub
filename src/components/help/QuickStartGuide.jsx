import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  CheckCircle2,
  Circle,
  ArrowRight,
  UserCheck,
  Terminal,
  BookOpen,
  Clock,
  Crown,
  Lightbulb,
} from 'lucide-react';
import { ONBOARDING_STEPS } from './data/helpData';

const STEP_ICONS = {
  UserCheck,
  Terminal,
  BookOpen,
  Clock,
  Crown,
};

export default function QuickStartGuide() {
  const [completedSteps, setCompletedSteps] = useState(() => {
    try {
      const saved = localStorage.getItem('campushub_onboarding_completed');
      return saved ? JSON.parse(saved) : [1]; // Step 1 is done by default
    } catch {
      return [1];
    }
  });

  const toggleStepCompleted = (stepNum) => {
    setCompletedSteps((prev) => {
      const updated = prev.includes(stepNum)
        ? prev.filter((s) => s !== stepNum)
        : [...prev, stepNum];
      try {
        localStorage.setItem(
          'campushub_onboarding_completed',
          JSON.stringify(updated)
        );
      } catch (err) {
        console.warn('Erreur stockage guide :', err);
      }
      return updated;
    });
  };

  const progressPercent = Math.round(
    (completedSteps.length / ONBOARDING_STEPS.length) * 100
  );

  return (
    <div className="space-y-6">
      {/* Guide Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/50">
              <Compass size={14} className="text-emerald-600" />
              <span>Guide d'Accueil Étudiant · Campus de Ngoa-Ekellé & Universités du Cameroun</span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-slate-100">
              Bienvenue sur CampusHub : Les 5 étapes indispensables
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Suivez ce parcours pas-à-pas pour maîtriser l'ensemble des modules académiques dès votre première semaine de cours.
            </p>
          </div>

          {/* Progress Bar Widget */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 min-w-[220px] space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-700 dark:text-slate-300">Progression</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-mono">
                {completedSteps.length} / {ONBOARDING_STEPS.length} ({progressPercent}%)
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Steps Cards Grid */}
      <div className="space-y-4 max-w-4xl mx-auto">
        {ONBOARDING_STEPS.map((stepItem) => {
          const Icon = STEP_ICONS[stepItem.icon] || Compass;
          const isDone = completedSteps.includes(stepItem.step);

          return (
            <div
              key={stepItem.step}
              className={`rounded-3xl border p-5 md:p-6 transition-all bg-white dark:bg-slate-900 flex flex-col md:flex-row md:items-start justify-between gap-5 shadow-xs ${
                isDone
                  ? 'border-emerald-300/80 dark:border-emerald-800/60 ring-1 ring-emerald-500/20'
                  : 'border-slate-200 dark:border-slate-800 hover:border-indigo-300'
              }`}
            >
              {/* Left Column: Icon & Details */}
              <div className="flex items-start gap-4 flex-1">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black flex-shrink-0 shadow-sm ${
                    isDone
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600'
                      : 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600'
                  }`}
                >
                  <Icon size={24} />
                </div>

                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black uppercase tracking-wider bg-slate-900 text-white dark:bg-slate-800">
                      Étape {stepItem.step}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                      {stepItem.badge}
                    </span>
                    {isDone && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 size={13} />
                        <span>Validé</span>
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm md:text-base font-bold text-slate-900 dark:text-slate-100">
                    {stepItem.title}
                  </h3>

                  <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {stepItem.description}
                  </p>

                  {/* Practical Tip */}
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-[11px] text-slate-600 dark:text-slate-400 flex items-start gap-2">
                    <Lightbulb size={14} className="text-amber-500 flex-shrink-0 mt-0.5" />
                    <span>{stepItem.tip}</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Actions */}
              <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
                <Link
                  to={stepItem.actionLink}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors flex items-center gap-1.5 whitespace-nowrap"
                >
                  <span>{stepItem.actionText}</span>
                  <ArrowRight size={13} />
                </Link>

                <button
                  type="button"
                  onClick={() => toggleStepCompleted(stepItem.step)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-colors ${
                    isDone
                      ? 'border-emerald-300 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100'
                      : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {isDone ? (
                    <>
                      <CheckCircle2 size={14} className="text-emerald-500" />
                      <span>Terminé</span>
                    </>
                  ) : (
                    <>
                      <Circle size={14} />
                      <span>Marquer comme fait</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
