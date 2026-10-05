import { useAuth } from './useAuth';
import { normalizeRole, ROLE_BADGES, ROLES } from '../constants/rbacConstants';

export function usePermissions() {
  const { user, role, roleLabel, can, hasRole, switchRole, demoProfiles } = useAuth();
  const normRole = normalizeRole(role || user?.role);

  return {
    role: normRole,
    roleLabel: roleLabel || 'Étudiant',
    badgeConfig: ROLE_BADGES[normRole] || ROLE_BADGES[ROLES.STUDENT],
    can,
    hasRole,
    switchRole,
    isStudent: normRole === ROLES.STUDENT,
    isDelegate: normRole === ROLES.DELEGATE,
    isModerator: normRole === ROLES.MODERATOR,
    isAdmin: normRole === ROLES.ADMIN,
    demoProfiles,
  };
}
