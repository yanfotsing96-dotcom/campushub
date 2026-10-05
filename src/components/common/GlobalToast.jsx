import { CheckCircle2, Info, Zap, X } from 'lucide-react';
import { useCampusHub } from '../../hooks/useCampusHub';

export default function GlobalToast() {
  const { toastNotification, clearToast } = useCampusHub();

  if (!toastNotification) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl animate-in slide-in-from-bottom-5 duration-300 smooth-gpu">
      <div className="flex items-start gap-3">
        <div
          className={`w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 ${
            toastNotification.type === 'success'
              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600'
              : toastNotification.type === 'xp'
              ? 'bg-amber-100 dark:bg-amber-950 text-amber-600'
              : 'bg-indigo-100 dark:bg-indigo-950 text-indigo-600'
          }`}
        >
          {toastNotification.type === 'success' ? (
            <CheckCircle2 size={18} />
          ) : toastNotification.type === 'xp' ? (
            <Zap size={18} />
          ) : (
            <Info size={18} />
          )}
        </div>

        <div className="flex-1 space-y-0.5">
          <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
            {toastNotification.title}
          </h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
            {toastNotification.message}
          </p>
        </div>

        <button
          type="button"
          onClick={clearToast}
          className="p-1 text-slate-400 hover:text-slate-600 rounded-full"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
