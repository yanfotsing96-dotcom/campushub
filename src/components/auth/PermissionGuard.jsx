import { useAuth } from '../../hooks/useAuth';
import {
  normalizeRole,
  isRoleAtLeast,
  canAddResource,
  canModifyResource,
  canDeleteResource,
} from '../../constants/rbacConstants';

/**
 * Composant de garde de permission pour l'affichage conditionnel d'éléments d'interface
 * 
 * Exemples :
 * <PermissionGuard action="add_resource" targetFiliere="Informatique">
 *    <button>Ajouter un cours</button>
 * </PermissionGuard>
 *
 * <PermissionGuard action="modify_resource" resource={res}>
 *    <button>Modifier</button>
 * </PermissionGuard>
 *
 * <PermissionGuard permission="moderation:resources">
 *    <button>Modérer ce document</button>
 * </PermissionGuard>
 *
 * <PermissionGuard role="delegate">
 *    <button>Publier une annonce officielle</button>
 * </PermissionGuard>
 */
export default function PermissionGuard({
  action,
  resource,
  targetFiliere,
  permission,
  role,
  fallback = null,
  children,
}) {
  const { user, can } = useAuth();
  const currentRole = normalizeRole(user?.role);

  // 1. Check granular resource action if specified
  if (action) {
    if (action === 'add_resource') {
      if (!canAddResource(user, targetFiliere)) return fallback;
    } else if (action === 'modify_resource' || action === 'edit_resource') {
      if (!canModifyResource(user, resource)) return fallback;
    } else if (action === 'delete_resource') {
      if (!canDeleteResource(user, resource)) return fallback;
    }
  }

  // 2. Check role hierarchy if role is provided
  if (role) {
    const hasRequiredRole = isRoleAtLeast(currentRole, role);
    if (!hasRequiredRole) {
      return fallback;
    }
  }

  // 3. Check specific permission if permission is provided
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

