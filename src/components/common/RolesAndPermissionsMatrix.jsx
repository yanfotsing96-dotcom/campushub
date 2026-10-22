import { useState } from 'react';
import {
  GraduationCap,
  Clock,
  BookOpen,
  Award,
  ShieldCheck,
  Crown,
  Info,
} from 'lucide-react';
import {
  ROLES,
  ROLE_DEFINITIONS,
  PERMISSIONS_MATRIX,
  normalizeRole,
} from '../../constants/rbacConstants';
import { useAuth } from '../../hooks/useAuth';

export default function RolesAndPermissionsMatrix({
  highlightRole = null,
  showRoleSelector = true,
  className = '',
}) {
  const { user } = useAuth();
  const currentRole = highlightRole || normalizeRole(user?.role);
  const [selectedRoleFilter, setSelectedRoleFilter] = useState(currentRole);

  const getRoleIcon = (role) => {
    switch (role) {
      case ROLES.ADMIN:
        return Crown;
      case ROLES.MODERATOR:
        return ShieldCheck;
      case ROLES.DELEGATE:
        return Award;
      case ROLES.STUDENT:
      default:
        return BookOpen;
    }
  };

  return (
    <div
      className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-8 font-sans ${className}`}
    >
      {/* Brand Header Identical to Document */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-black shadow-xs">
              <GraduationCap size={22} />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                CampusHub
              </span>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Architecture de Sécurité & Modèle de Contrôle d'Accès (RBAC)
              </p>
            </div>
          </div>

          {showRoleSelector && (
            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 px-2">
                Rôle actif :
              </span>
              {ROLE_DEFINITIONS.map((def) => {
                const Icon = getRoleIcon(def.role);
                const isSelected = selectedRoleFilter === def.role;
                return (
                  <button
                    key={def.role}
                    type="button"
                    onClick={() => setSelectedRoleFilter(def.role)}
                    className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs border border-slate-200 dark:border-slate-700'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    <Icon size={12} className={isSelected ? 'text-indigo-600 dark:text-indigo-400' : ''} />
                    <span>{def.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 3. Rôles et permissions (Title and Subtitle) */}
      <div className="space-y-1">
        <h2 className="text-2xl md:text-3xl font-black text-[#13294B] dark:text-slate-100 tracking-tight">
          3. Rôles et permissions
        </h2>
        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
          Quatre rôles, attribués pour chaque faculté et chaque filière.
        </p>
      </div>

      {/* TABLEAU 1 : Rôles, Portée et Description */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs md:text-sm">
            <thead>
              <tr className="bg-[#13294B] text-white">
                <th className="py-3 px-4 md:px-5 font-bold tracking-wide w-[18%]">Rôle</th>
                <th className="py-3 px-4 md:px-5 font-bold tracking-wide w-[28%]">Portée</th>
                <th className="py-3 px-4 md:px-5 font-bold tracking-wide">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900">
              {ROLE_DEFINITIONS.map((def, idx) => {
                const Icon = getRoleIcon(def.role);
                const isHighlighted = selectedRoleFilter === def.role;
                return (
                  <tr
                    key={def.role}
                    className={`transition-colors ${
                      isHighlighted
                        ? 'bg-indigo-50/70 dark:bg-indigo-950/40 font-medium'
                        : idx % 2 === 1
                        ? 'bg-slate-50/50 dark:bg-slate-850/40'
                        : ''
                    } hover:bg-slate-100/60 dark:hover:bg-slate-800/60`}
                  >
                    <td className="py-3.5 px-4 md:px-5">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                            def.role === ROLES.ADMIN
                              ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400'
                              : def.role === ROLES.MODERATOR
                              ? 'bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-400'
                              : def.role === ROLES.DELEGATE
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400'
                              : 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400'
                          }`}
                        >
                          <Icon size={13} />
                        </div>
                        <span className="font-bold text-slate-900 dark:text-slate-100">
                          {def.label}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 md:px-5 text-slate-700 dark:text-slate-300 font-medium">
                      {def.scope}
                    </td>
                    <td className="py-3.5 px-4 md:px-5 text-slate-600 dark:text-slate-400 leading-relaxed">
                      {def.description}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* TABLEAU 2 : Matrice des permissions (proposition) */}
      <div className="space-y-3 pt-2">
        <h3 className="text-lg md:text-xl font-black text-emerald-700 dark:text-emerald-400 tracking-tight">
          Matrice des permissions (proposition)
        </h3>

        <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs md:text-sm">
              <thead>
                <tr className="bg-[#13294B] text-white">
                  <th className="py-3.5 px-4 md:px-5 font-bold tracking-wide w-[40%]">Action</th>
                  <th
                    className={`py-3.5 px-3 md:px-4 font-bold text-center tracking-wide w-[15%] transition-colors ${
                      selectedRoleFilter === ROLES.STUDENT ? 'bg-indigo-900 text-indigo-200' : ''
                    }`}
                  >
                    Étudiant
                  </th>
                  <th
                    className={`py-3.5 px-3 md:px-4 font-bold text-center tracking-wide w-[15%] transition-colors ${
                      selectedRoleFilter === ROLES.DELEGATE ? 'bg-indigo-900 text-indigo-200' : ''
                    }`}
                  >
                    Délégué
                  </th>
                  <th
                    className={`py-3.5 px-3 md:px-4 font-bold text-center tracking-wide w-[15%] transition-colors ${
                      selectedRoleFilter === ROLES.MODERATOR ? 'bg-indigo-900 text-indigo-200' : ''
                    }`}
                  >
                    Modérateur
                  </th>
                  <th
                    className={`py-3.5 px-3 md:px-4 font-bold text-center tracking-wide w-[15%] transition-colors ${
                      selectedRoleFilter === ROLES.ADMIN ? 'bg-indigo-900 text-indigo-200' : ''
                    }`}
                  >
                    Administrateur
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900">
                {PERMISSIONS_MATRIX.map((row, idx) => (
                  <tr
                    key={row.id}
                    className={`transition-colors ${
                      idx % 2 === 1 ? 'bg-slate-50/50 dark:bg-slate-850/40' : ''
                    } hover:bg-slate-100/60 dark:hover:bg-slate-800/60`}
                  >
                    <td className="py-3.5 px-4 md:px-5 font-medium text-slate-800 dark:text-slate-200">
                      <div>
                        <span>{row.action}</span>
                      </div>
                    </td>

                    {/* Étudiant */}
                    <td
                      className={`py-3.5 px-3 md:px-4 text-center ${
                        selectedRoleFilter === ROLES.STUDENT
                          ? 'bg-indigo-50/60 dark:bg-indigo-950/30'
                          : ''
                      }`}
                    >
                      <PermissionCell value={row[ROLES.STUDENT]} />
                    </td>

                    {/* Délégué */}
                    <td
                      className={`py-3.5 px-3 md:px-4 text-center ${
                        selectedRoleFilter === ROLES.DELEGATE
                          ? 'bg-indigo-50/60 dark:bg-indigo-950/30'
                          : ''
                      }`}
                    >
                      <PermissionCell value={row[ROLES.DELEGATE]} />
                    </td>

                    {/* Modérateur */}
                    <td
                      className={`py-3.5 px-3 md:px-4 text-center ${
                        selectedRoleFilter === ROLES.MODERATOR
                          ? 'bg-indigo-50/60 dark:bg-indigo-950/30'
                          : ''
                      }`}
                    >
                      <PermissionCell value={row[ROLES.MODERATOR]} />
                    </td>

                    {/* Administrateur */}
                    <td
                      className={`py-3.5 px-3 md:px-4 text-center ${
                        selectedRoleFilter === ROLES.ADMIN
                          ? 'bg-indigo-50/60 dark:bg-indigo-950/30'
                          : ''
                      }`}
                    >
                      <PermissionCell value={row[ROLES.ADMIN]} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footnote matching exact document text */}
        <p className="text-xs text-slate-500 dark:text-slate-400 italic pt-1 flex items-center gap-1.5">
          <Info size={13} className="shrink-0 text-slate-400" />
          <span>Ces droits sont proposés à titre indicatif et sont à valider avant le développement.</span>
        </p>
      </div>
    </div>
  );
}

/**
 * Composant de cellule de permission :
 * - true : checkmark ✓ (emerald)
 * - false : tiret - (muted slate)
 * - 'sur validation' : badge textuel exact "sur validation" en ambre/jaune
 */
function PermissionCell({ value }) {
  if (value === true) {
    return (
      <span
        className="inline-flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold"
        title="Autorisé"
      >
        <span className="text-base leading-none">✓</span>
      </span>
    );
  }

  if (value === 'sur validation') {
    return (
      <span
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 whitespace-nowrap"
        title="Action soumise à validation hiérarchique"
      >
        <Clock size={11} className="shrink-0" />
        <span>sur validation</span>
      </span>
    );
  }

  return (
    <span
      className="inline-flex items-center justify-center text-slate-400 dark:text-slate-600 font-bold text-base"
      title="Non autorisé"
    >
      -
    </span>
  );
}
