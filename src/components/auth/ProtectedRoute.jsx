import { Navigate, useLocation, Link } from 'react-router-dom';
import {
  ShieldAlert,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { normalizeRole, isRoleAtLeast, hasPermission, ROLE_BADGES, ROLES, ROLE_LABELS } from '../../constants/rbacConstants';
import RoleBadge from '../common/RoleBadge';

export default function ProtectedRoute({
  requiredRole,
  requiredPermission,
  children,
}) {
  const { isAuthenticated, user, switchRole } = useAuth();
  const location = useLocation();

  // 1. Not Authenticated -> Redirect to Login with state
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const currentRole = normalizeRole(user?.role);

  // 2. Check Role Hierarchy (if specified)
  let isAuthorized = true;
  let reason = '';

  if (requiredRole) {
    const normRequired = normalizeRole(requiredRole);
    if (!isRoleAtLeast(currentRole, normRequired)) {
      isAuthorized = false;
      reason = `Ce module est strictement réservé au statut « ${ROLE_LABELS[normRequired]} » (ou supérieur).`;
    }
  }

  // 3. Check Specific Permission (if specified)
  if (isAuthorized && requiredPermission) {
    if (!hasPermission(currentRole, requiredPermission)) {
      isAuthorized = false;
      reason = `Votre compte ne dispose pas du privilège : ${requiredPermission}.`;
    }
  }

  // 4. Unauthorized Access UI (HTTP 403 SaaS Card)
  if (!isAuthorized) {
    const requiredRoleBadge = ROLE_BADGES[normalizeRole(requiredRole || ROLES.ADMIN)];

    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="max-w-xl w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl text-center space-y-6 animate-in zoom-in-95 duration-200">
          {/* Security Alert Header Icon */}
          <div className="w-16 h-16 rounded-3xl bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto shadow-lg shadow-rose-500/10">
            <ShieldAlert size={34} strokeWidth={2.2} />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-rose-100/80 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-300/40">
              <span>Erreur 403 · Accès Restreint</span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-slate-100">
              Privilèges Insuffisants
            </h2>
            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
              {reason}
            </p>
          </div>

          {/* Role Status Comparison Card */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-left text-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2.5">
              <span className="text-slate-500 dark:text-slate-400">Votre rôle actuel :</span>
              <RoleBadge role={currentRole} size="md" />
            </div>

            {requiredRole && (
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2.5">
                <span className="text-slate-500 dark:text-slate-400">Rôle minimum requis :</span>
                <span className="inline-flex items-center gap-1 font-bold text-slate-800 dark:text-slate-200">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: requiredRoleBadge.color }} />
                  {requiredRoleBadge.label}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400">Université :</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {user?.filiere || 'Univ. Yaoundé I'}
              </span>
            </div>
          </div>

          {/* Role Simulator Tool for Quick Evaluation */}
          <div className="p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/60 space-y-2 text-left">
            <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 dark:text-indigo-300">
              <Sparkles size={14} className="text-amber-500" />
              <span>Simulateur RBAC CampusHub (Test Rapide) :</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">
              Basculez instantanément votre profil pour tester cet espace sans vous reconnecter :
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 pt-1">
              {[ROLES.STUDENT, ROLES.DELEGATE, ROLES.MODERATOR, ROLES.ADMIN].map((r) => {
                const isActive = currentRole === r;
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => switchRole(r)}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 border ${
                      isActive
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-400'
                    }`}
                  >
                    <span>{ROLE_LABELS[r]}</span>
                    {isActive && <CheckCircle2 size={12} />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Fallback Action Button */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/ressources"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-2xs"
            >
              <ArrowLeft size={14} />
              <span>Retour à mon espace étudiant</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 5. Authorized -> Render children or Outlet
  return children;
}
