/**
 * Système de Rôles et Permissions (RBAC) pour CampusHub Cameroun
 * Standardisé pour les universités d'État et écoles d'ingénieurs
 */

export const ROLES = {
  STUDENT: 'student',
  DELEGATE: 'delegate',
  MODERATOR: 'moderator',
  ADMIN: 'admin',
};

export const ROLE_HIERARCHY = {
  [ROLES.STUDENT]: 1,
  [ROLES.DELEGATE]: 2,
  [ROLES.MODERATOR]: 3,
  [ROLES.ADMIN]: 4,
};

export const ROLE_LABELS = {
  [ROLES.STUDENT]: 'Étudiant',
  [ROLES.DELEGATE]: 'Délégué',
  [ROLES.MODERATOR]: 'Modérateur',
  [ROLES.ADMIN]: 'Administrateur',
};

/**
 * Codes d'Accès Secrets Obligatoires pour l'attribution des rôles sensibles
 */
export const ROLE_SECRET_PASSCODES = {
  [ROLES.DELEGATE]: 'DELEGUE-UY1-2026',
  [ROLES.MODERATOR]: 'MOD-SECURITY-7729',
  [ROLES.ADMIN]: 'SUPERADMIN-UY1-ROOT',
};

export const ROLE_PASSCODE_HINTS = {
  [ROLES.DELEGATE]: 'Code officiel amphi : DELEGUE-UY1-2026',
  [ROLES.MODERATOR]: 'Clé d\'authentification DSI : MOD-SECURITY-7729',
  [ROLES.ADMIN]: 'Clé racine d\'administration : SUPERADMIN-UY1-ROOT',
};

export function verifyRolePasscode(targetRole, enteredCode) {
  const norm = normalizeRole(targetRole);
  if (norm === ROLES.STUDENT) return { valid: true, error: null };
  const expected = ROLE_SECRET_PASSCODES[norm];
  if (!expected) return { valid: true, error: null };
  const isMatch = String(enteredCode || '').trim().toUpperCase() === expected;
  return {
    valid: isMatch,
    error: isMatch ? null : `Code d'accès secret incorrect pour le rôle ${ROLE_LABELS[norm] || norm}.`,
  };
}

export const ROLE_BADGES = {
  [ROLES.STUDENT]: {
    label: 'Étudiant',
    labelEn: 'Student',
    color: '#6366f1',
    bgColor: 'bg-indigo-50 dark:bg-indigo-950/70',
    textColor: 'text-indigo-700 dark:text-indigo-300',
    borderColor: 'border-indigo-200 dark:border-indigo-800',
    badgeGlow: 'shadow-indigo-500/10',
    icon: 'BookOpen',
    description: 'Accès standard aux cours, annales, carnet privé et playground de code.',
  },
  [ROLES.DELEGATE]: {
    label: 'Délégué',
    labelEn: 'Class Delegate',
    color: '#10b981',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950/70',
    textColor: 'text-emerald-700 dark:text-emerald-300',
    borderColor: 'border-emerald-200 dark:border-emerald-800',
    badgeGlow: 'shadow-emerald-500/10',
    icon: 'Award',
    description: 'Publication des avis officiels de filière, gestion du calendrier de classe et relais amphi.',
  },
  [ROLES.MODERATOR]: {
    label: 'Modérateur',
    labelEn: 'Moderator',
    color: '#0284c7',
    bgColor: 'bg-sky-50 dark:bg-sky-950/70',
    textColor: 'text-sky-700 dark:text-sky-300',
    borderColor: 'border-sky-200 dark:border-sky-800',
    badgeGlow: 'shadow-sky-500/10',
    icon: 'ShieldCheck',
    description: 'Contrôle qualité des documents, traitement des signalements et audit anti-plagiat.',
  },
  [ROLES.ADMIN]: {
    label: 'Administrateur',
    labelEn: 'Super Admin',
    color: '#d97706',
    bgColor: 'bg-amber-50 dark:bg-amber-950/70',
    textColor: 'text-amber-700 dark:text-amber-300',
    borderColor: 'border-amber-300 dark:border-amber-700',
    badgeGlow: 'shadow-amber-500/20',
    icon: 'Crown',
    description: 'Gouvernance globale, promotion des comptes, supervision analytique et sécurité.',
  },
};

export const PERMISSIONS = {
  // Student permissions
  VIEW_CATALOG: 'catalog:view',
  DOWNLOAD_DOCS: 'docs:download',
  USE_PLAYGROUND: 'playground:use',
  USE_NOTEBOOK: 'notebook:use',
  UPLOAD_RESOURCE: 'resource:upload',
  RATE_RESOURCE: 'resource:rate',

  // Delegate permissions
  PUBLISH_CLASS_ANNOUNCEMENT: 'class:publish_announcement',
  PIN_ANNOUNCEMENT: 'class:pin_announcement',
  MANAGE_CLASS_SCHEDULE: 'class:manage_schedule',
  VIEW_CLASS_ROSTER: 'class:view_roster',

  // Moderator permissions
  MODERATE_RESOURCES: 'moderation:resources',
  AUDIT_PLAGIARISM: 'moderation:plagiarism',
  RESOLVE_REPORTS: 'moderation:resolve_reports',
  FLAG_USERS: 'moderation:flag_users',
  DELETE_ANY_RESOURCE: 'moderation:delete_any_resource',

  // Admin permissions
  MANAGE_USERS: 'admin:manage_users',
  ASSIGN_ROLES: 'admin:assign_roles',
  VIEW_ANALYTICS: 'admin:view_analytics',
  MANAGE_SYSTEM_SETTINGS: 'admin:system_settings',
  VIEW_AUDIT_LOGS: 'admin:view_audit_logs',
};

export const ROLE_PERMISSIONS = {
  [ROLES.STUDENT]: [
    PERMISSIONS.VIEW_CATALOG,
    PERMISSIONS.DOWNLOAD_DOCS,
    PERMISSIONS.USE_PLAYGROUND,
    PERMISSIONS.USE_NOTEBOOK,
    PERMISSIONS.UPLOAD_RESOURCE,
    PERMISSIONS.RATE_RESOURCE,
  ],
  [ROLES.DELEGATE]: [
    // All student permissions
    PERMISSIONS.VIEW_CATALOG,
    PERMISSIONS.DOWNLOAD_DOCS,
    PERMISSIONS.USE_PLAYGROUND,
    PERMISSIONS.USE_NOTEBOOK,
    PERMISSIONS.UPLOAD_RESOURCE,
    PERMISSIONS.RATE_RESOURCE,
    // Delegate specific permissions
    PERMISSIONS.PUBLISH_CLASS_ANNOUNCEMENT,
    PERMISSIONS.PIN_ANNOUNCEMENT,
    PERMISSIONS.MANAGE_CLASS_SCHEDULE,
    PERMISSIONS.VIEW_CLASS_ROSTER,
  ],
  [ROLES.MODERATOR]: [
    // All student permissions
    PERMISSIONS.VIEW_CATALOG,
    PERMISSIONS.DOWNLOAD_DOCS,
    PERMISSIONS.USE_PLAYGROUND,
    PERMISSIONS.USE_NOTEBOOK,
    PERMISSIONS.UPLOAD_RESOURCE,
    PERMISSIONS.RATE_RESOURCE,
    // Moderator specific permissions
    PERMISSIONS.MODERATE_RESOURCES,
    PERMISSIONS.AUDIT_PLAGIARISM,
    PERMISSIONS.RESOLVE_REPORTS,
    PERMISSIONS.FLAG_USERS,
    PERMISSIONS.DELETE_ANY_RESOURCE,
    PERMISSIONS.VIEW_ANALYTICS,
  ],
  [ROLES.ADMIN]: [
    // Full access to every permission
    ...Object.values(PERMISSIONS),
  ],
};

/**
 * Normalise la valeur du rôle (gère le français ou les codes anglais)
 */
export function normalizeRole(role) {
  if (!role) return ROLES.STUDENT;
  const lower = String(role).toLowerCase().trim();

  if (lower === 'admin' || lower === 'administrateur') return ROLES.ADMIN;
  if (lower === 'moderator' || lower === 'modérateur' || lower === 'moderateur') return ROLES.MODERATOR;
  if (lower === 'delegate' || lower === 'délégué' || lower === 'delegue') return ROLES.DELEGATE;
  return ROLES.STUDENT;
}

/**
 * Vérifie si un rôle possède une permission spécifique
 */
export function hasPermission(role, permission) {
  const normRole = normalizeRole(role);
  const permissions = ROLE_PERMISSIONS[normRole] || [];
  return permissions.includes(permission);
}

/**
 * Vérifie si le rôle de l'utilisateur est supérieur ou égal au rôle requis
 */
export function isRoleAtLeast(userRole, requiredRole) {
  const userLevel = ROLE_HIERARCHY[normalizeRole(userRole)] || 1;
  const requiredLevel = ROLE_HIERARCHY[normalizeRole(requiredRole)] || 1;
  return userLevel >= requiredLevel;
}

/**
 * Retourne la route de destination spécifique pour un rôle
 */
export function getDashboardRouteForRole(role) {
  const normRole = normalizeRole(role);
  switch (normRole) {
    case ROLES.ADMIN:
      return '/admin';
    case ROLES.MODERATOR:
      return '/moderation';
    case ROLES.DELEGATE:
      return '/delegate';
    case ROLES.STUDENT:
    default:
      return '/dashboard';
  }
}

/**
 * Comptes Démo préconfigurés pour tester instantanément chaque profil
 */
export const DEMO_PROFILES = [
  {
    role: ROLES.STUDENT,
    nom: 'Yanick Fotsing (Étudiant)',
    email: 'yanfotsing96@gmail.com',
    filiere: 'Informatique',
    filiereId: 'Informatique',
    filiereLabel: 'Informatique & Génie Logiciel',
    niveau: 'L2',
    matricule: '23S40192',
    universityId: 'UY1',
    universityName: 'Université de Yaoundé I',
    badge: 'Étudiant Standard (L2 Info)',
  },
  {
    role: ROLES.DELEGATE,
    nom: 'Brice Kamga (Délégué INF201)',
    email: 'delegue.inf201@univ-yaounde1.cm',
    filiere: 'Informatique',
    filiereId: 'Informatique',
    filiereLabel: 'Informatique & Génie Logiciel',
    niveau: 'L2',
    matricule: '23U1084',
    universityId: 'UY1',
    universityName: 'Université de Yaoundé I',
    badge: 'Délégué Principal de Promotion (L2 Info)',
  },
  {
    role: ROLES.MODERATOR,
    nom: 'Dr. Sarah Eyenga (Modératrice)',
    email: 'moderation.sciences@univ-yaounde1.cm',
    filiere: 'Informatique',
    filiereId: 'Informatique',
    filiereLabel: 'Informatique & Biosciences',
    niveau: 'M2',
    matricule: 'MOD-FS-042',
    universityId: 'UY1',
    universityName: 'Université de Yaoundé I',
    badge: 'Modératrice Certifiée (Faculté des Sciences)',
  },
  {
    role: ROLES.ADMIN,
    nom: 'Prof. Joseph Nguemo (Super Admin)',
    email: 'admin.campushub@univ.cm',
    filiere: 'Informatique',
    filiereId: 'Informatique',
    filiereLabel: 'DSI & Faculté des Sciences',
    niveau: 'Direction',
    matricule: 'ADM-UY1-001',
    universityId: 'UY1',
    universityName: 'Université de Yaoundé I',
    badge: 'Administrateur Système (Super Admin)',
  },
];
