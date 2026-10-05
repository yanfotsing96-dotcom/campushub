import { useState } from 'react';
import {
  KeyRound,
  ShieldCheck,
  Award,
  Crown,
  X,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
} from 'lucide-react';
import {
  ROLES,
  ROLE_LABELS,
  ROLE_BADGES,
  ROLE_SECRET_PASSCODES,
  ROLE_PASSCODE_HINTS,
} from '../../constants/rbacConstants';
import { useAuth } from '../../hooks/useAuth';
import RoleBadge from '../common/RoleBadge';

export default function RoleVerificationModal({
  targetRole,
  isOpen,
  onClose,
  onSuccess,
}) {
  const { elevateRole } = useAuth();
  const [passcode, setPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  if (!isOpen || !targetRole || targetRole === ROLES.STUDENT) return null;

  const roleLabel = ROLE_LABELS[targetRole] || targetRole;
  const badgeConfig = ROLE_BADGES[targetRole] || ROLE_BADGES[ROLES.STUDENT];
  const demoCode = ROLE_SECRET_PASSCODES[targetRole] || '';
  const hintText = ROLE_PASSCODE_HINTS[targetRole] || '';

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsVerifying(true);

    const res = elevateRole(targetRole, passcode);
    setIsVerifying(false);

    if (res.success) {
      setPasscode('');
      if (onSuccess) onSuccess(targetRole);
      onClose();
    } else {
      setError(res.error || 'Code secret incorrect.');
    }
  };

  const handleApplyDemoCode = () => {
    setPasscode(demoCode);
    setError('');
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in modal-backdrop-gpu">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-7 max-w-md w-full shadow-2xl space-y-5 animate-in zoom-in-95 modal-content-gpu">
        {/* Header with Role Icon */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black ${
                targetRole === ROLES.ADMIN
                  ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400'
                  : targetRole === ROLES.MODERATOR
                  ? 'bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-400'
                  : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400'
              }`}
            >
              {targetRole === ROLES.ADMIN ? (
                <Crown size={24} />
              ) : targetRole === ROLES.MODERATOR ? (
                <ShieldCheck size={24} />
              ) : (
                <Award size={24} />
              )}
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Vérification Requise
                </h3>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <RoleBadge role={targetRole} size="xs" />
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Rôle sensible
                </span>
              </div>
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

        {/* Informative Explanation */}
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          {badgeConfig.description} L'attribution du rôle <strong>« {roleLabel} »</strong> requiert la validation d'un <strong>Code d'Accès Secret</strong> délivré par la scolarité ou la DSI universitaire.
        </p>

        {/* Verification Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Code d'Accès Secret * :
            </label>
            <div className="relative">
              <KeyRound size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type={showPasscode ? 'text' : 'password'}
                required
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  setError('');
                }}
                placeholder={`Ex : ${demoCode || '••••••••'}`}
                className="w-full pl-10 pr-10 py-2.5 text-xs font-mono font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 uppercase tracking-wider"
              />
              <button
                type="button"
                onClick={() => setShowPasscode((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPasscode ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>

            {error && (
              <div className="mt-2 p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-1.5 animate-in fade-in">
                <AlertCircle size={14} className="flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Quick Demo Helper Tooltip / Button for Instant Testing */}
          {demoCode && (
            <div className="p-3 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/60 space-y-1.5 text-left text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-indigo-700 dark:text-indigo-300 flex items-center gap-1 text-[11px]">
                  <Sparkles size={12} className="text-amber-500" />
                  <span>Environnement de Démonstration :</span>
                </span>
                <button
                  type="button"
                  onClick={handleApplyDemoCode}
                  className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline uppercase"
                >
                  Remplir automatiquement
                </button>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                {hintText}
              </p>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={!passcode.trim() || isVerifying}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-500/20 disabled:opacity-40"
            >
              <CheckCircle2 size={14} />
              <span>Valider les privilèges</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
