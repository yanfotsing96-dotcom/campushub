import { useCallback } from 'react';
import { useAuth } from './useAuth';
import {
  normalizeRole,
  ROLE_BADGES,
  ROLES,
  canAddResource as checkCanAddResource,
  canModifyResource as checkCanModifyResource,
  canDeleteResource as checkCanDeleteResource,
} from '../constants/rbacConstants';

export function usePermissions() {
  const { user, role, roleLabel, can, hasRole, switchRole, demoProfiles } = useAuth();
  const normRole = normalizeRole(role || user?.role);

  // Granular resource access helpers
  const canAddResource = useCallback(
    (targetFiliere = null) => checkCanAddResource(user, targetFiliere),
    [user]
  );

  const canModifyResource = useCallback(
    (resource) => checkCanModifyResource(user, resource),
    [user]
  );

  const canDeleteResource = useCallback(
    (resource) => checkCanDeleteResource(user, resource),
    [user]
  );

  return {
    user,
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
    // Granular RBAC helpers
    canAddResource,
    canModifyResource,
    canDeleteResource,
    demoProfiles,
  };
}

export default usePermissions;

