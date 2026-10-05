import { useState } from 'react';
import {
  FileCheck2,
  Award,
  AlertTriangle,
  X,
  CheckCircle2,
  Lock,
  User,
} from 'lucide-react';

export default function ExamFinalSubmitModal({
  isOpen,
  onClose,
  onConfirm,
  exam,
  user,
  answeredCount,
  totalQuestions,
  focusLossCount,
  isSubmitting,
}) {
  const officialMatricule = user?.matricule || '23S40192';
  const officialFullName = user?.fullName || user?.nom || 'Yan Fotsing';

  const [confirmMatricule, setConfirmMatricule] = useState('');
  const [confirmNom, setConfirmNom] = useState('');
  const [certifiedHonour, setCertifiedHonour] = useState(true);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const unansweredCount = totalQuestions - answeredCount;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const cleanInputMatricule = confirmMatricule.trim().toUpperCase();
    const cleanOfficialMatricule = officialMatricule.trim().toUpperCase();

    if (cleanInputMatricule !== cleanOfficialMatricule) {
      setError(
        `Matricule de confirmation invalide. Vous devez saisir votre matricule officiel (${officialMatricule}) pour sceller la copie.`
      );
      return;
    }

    if (!confirmNom.trim()) {
      setError('Veuillez renseigner votre Nom Complet d\'étudiant.');
      return;
    }

    if (!certifiedHonour) {
      setError('Vous devez certifier sur l\'honneur l\'intégrité de votre composition.');
      return;
    }

    onConfirm();
  };

  const handleQuickSign = () => {
    setConfirmMatricule(officialMatricule);
    setConfirmNom(officialFullName);
    setCertifiedHonour(true);
    setError('');
  };

  return (
    <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-7 max-w-lg w-full shadow-2xl space-y-5 animate-in zoom-in-95">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-3.5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <FileCheck2 size={24} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                  Signature Numérique
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                  {exam.codeUe}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                Confirmation & Scellement de la Copie
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
          >
            <X size={16} />
          </button>
        </div>

        {/* Progress & Integrity Summary */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
            <div className="text-slate-500 text-[11px]">Questions renseignées :</div>
            <div className="font-bold text-slate-900 dark:text-slate-100 text-sm">
              {answeredCount} / {totalQuestions}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
            <div className="text-slate-500 text-[11px]">Indice d'intégrité :</div>
            <div
              className={`font-bold text-sm ${
                focusLossCount === 0 ? 'text-emerald-600' : 'text-amber-600'
              }`}
            >
              {focusLossCount === 0 ? '100% (Aucune sortie)' : `${focusLossCount} sortie(s)`}
            </div>
          </div>
        </div>

        {/* Warning if unanswered questions remain */}
        {unansweredCount > 0 && (
          <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs flex items-center gap-2">
            <AlertTriangle size={16} className="text-amber-600 flex-shrink-0" />
            <span>
              Attention : Il vous reste <strong>{unansweredCount} question{unansweredCount > 1 ? 's' : ''}</strong> non renseignée{unansweredCount > 1 ? 's' : ''}. Si vous validez, ces questions compteront 0 point.
            </span>
          </div>
        )}

        {/* Identity Confirmation Form (Full Name & Matricule) */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              1. Confirmez votre Nom Complet d'étudiant * :
            </label>
            <div className="relative">
              <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                required
                value={confirmNom}
                onChange={(e) => {
                  setConfirmNom(e.target.value);
                  setError('');
                }}
                placeholder={`Ex : ${officialFullName}`}
                className="w-full pl-10 pr-3.5 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              2. Saisissez votre Numéro de Matricule officiel * :
            </label>
            <div className="relative">
              <Award size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                required
                value={confirmMatricule}
                onChange={(e) => {
                  setConfirmMatricule(e.target.value.toUpperCase());
                  setError('');
                }}
                placeholder={`Ex : ${officialMatricule}`}
                className="w-full pl-10 pr-3.5 py-2.5 text-xs font-mono font-bold uppercase tracking-wider rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Honor certification */}
          <label className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 cursor-pointer text-xs">
            <input
              type="checkbox"
              checked={certifiedHonour}
              onChange={(e) => setCertifiedHonour(e.target.checked)}
              className="mt-0.5 text-indigo-600 focus:ring-indigo-500 rounded"
            />
            <span className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
              Je certifie sur l'honneur être l'auteur authentique et exclusif de cette composition, réalisée conformément au règlement des examens universitaires du MINESUP.
            </span>
          </label>

          {error && (
            <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-[11px] font-semibold flex items-center gap-1.5">
              <AlertTriangle size={14} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Sign Shortcut */}
          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Lock size={11} />
              <span>Identité certifiée : {officialMatricule}</span>
            </span>

            <button
              type="button"
              onClick={handleQuickSign}
              className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Remplir automatiquement
            </button>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Reprendre et réviser
            </button>

            <button
              type="submit"
              disabled={!confirmMatricule.trim() || isSubmitting}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 disabled:opacity-40"
            >
              <CheckCircle2 size={14} />
              <span>{isSubmitting ? 'Scellement...' : 'Confirmer & Transmettre'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
