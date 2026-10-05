import { useAuth } from '../../hooks/useAuth';
import { normalizeRole, isRoleAtLeast } from '../../constants/rbacConstants';

/**
 * Composant de garde de permission pour l'affichage conditionnel d'éléments d'interface
 * Exemple :
 * <PermissionGuard permission="moderation:resources">
 *    <button>Modérer ce document</button>
 * </PermissionGuard>
 *
 * ou
 * <PermissionGuard role="delegate">
 *    <button>Publier une annonce officielle</button>
 * </PermissionGuard>
 */
export default function PermissionGuard({
  permission,
  role,
  fallback = null,
  children,
}) {
  const { user, can } = useAuth();
  const currentRole = normalizeRole(user?.role);

  // Check role hierarchy if role is provided
  if (role) {
    const hasRequiredRole = isRoleAtLeast(currentRole, role);
    if (!hasRequiredRole) {
      return fallback;
    }
  }

  // Check specific permission if permission is provided
  if (permission) {
    const hasPerm = can(permission);
    if (!hasPerm) {
      return fallback;
    }
  }

  return children;
}

// Alias exporté pratique
export const Can = PermissionGuard;
