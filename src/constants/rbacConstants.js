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
 * Portée officielle pour chaque rôle (Standards CampusHub)
 */
export const ROLE_SCOPES = {
  [ROLES.STUDENT]: 'Sa filière et son niveau',
  [ROLES.DELEGATE]: 'Sa filière et son niveau',
  [ROLES.MODERATOR]: 'Une faculté ou une filière',
  [ROLES.ADMIN]: 'Une faculté (et ses filières)',
};

/**
 * Description officielle des attributions pour chaque rôle (Standards CampusHub)
 */
export const ROLE_DESCRIPTIONS = {
  [ROLES.STUDENT]: 'Consulte les UE, passe les évaluations, utilise le Playground & IA, télécharge les ressources.',
  [ROLES.DELEGATE]: 'Représente sa classe : relaie les annonces, propose des ressources et des dates d\'évaluation.',
  [ROLES.MODERATOR]: 'Valide les ressources publiées, programme les évaluations, signale ou retire les contenus inappropriés.',
  [ROLES.ADMIN]: 'Gère les comptes et les rôles, suit les statistiques, paramètre les modules de sa faculté.',
};

/**
 * Définition complète des 4 rôles CampusHub
 */
export const ROLE_DEFINITIONS = [
  {
    role: ROLES.STUDENT,
    label: 'Étudiant',
    labelEn: 'Student',
    scope: ROLE_SCOPES[ROLES.STUDENT],
    description: ROLE_DESCRIPTIONS[ROLES.STUDENT],
    color: '#6366f1',
    icon: 'BookOpen',
  },
  {
    role: ROLES.DELEGATE,
    label: 'Délégué',
    labelEn: 'Class Delegate',
    scope: ROLE_SCOPES[ROLES.DELEGATE],
    description: ROLE_DESCRIPTIONS[ROLES.DELEGATE],
    color: '#10b981',
    icon: 'Award',
  },
  {
    role: ROLES.MODERATOR,
    label: 'Modérateur',
    labelEn: 'Moderator',
    scope: ROLE_SCOPES[ROLES.MODERATOR],
    description: ROLE_DESCRIPTIONS[ROLES.MODERATOR],
    color: '#0284c7',
    icon: 'ShieldCheck',
  },
  {
    role: ROLES.ADMIN,
    label: 'Administrateur',
    labelEn: 'Administrator',
    scope: ROLE_SCOPES[ROLES.ADMIN],
    description: ROLE_DESCRIPTIONS[ROLES.ADMIN],
    color: '#d97706',
    icon: 'Crown',
  },
];

/**
 * Matrice des permissions officielle synchronisée avec les spécifications CampusHub
 * Valeurs : true (autorisé), false (non autorisé), 'sur validation' (soumis à validation)
 */
export const PERMISSIONS_MATRIX = [
  {
    id: 'consult_ues_and_resources',
    action: 'Consulter les UE et les ressources',
    description: 'Accès en lecture aux maquettes pédagogiques et documents de cours',
    [ROLES.STUDENT]: true,
    [ROLES.DELEGATE]: true,
    [ROLES.MODERATOR]: true,
    [ROLES.ADMIN]: true,
  },
  {
    id: 'pass_online_exams',
    action: 'Passer les évaluations et CC en ligne',
    description: 'Participation chronométrée aux contrôles continus et examens',
    [ROLES.STUDENT]: true,
    [ROLES.DELEGATE]: true,
    [ROLES.MODERATOR]: false,
    [ROLES.ADMIN]: false,
  },
  {
    id: 'use_playground_and_ai',
    action: 'Utiliser le Playground & IA',
    description: 'Laboratoires virtuels (code, physique, chimie, biologie, maths, FALSH)',
    [ROLES.STUDENT]: true,
    [ROLES.DELEGATE]: true,
    [ROLES.MODERATOR]: true,
    [ROLES.ADMIN]: true,
  },
  {
    id: 'publish_resource',
    action: 'Publier une ressource',
    description: 'Dépôt de supports de cours, polycopiés, fiches de révision et annales',
    [ROLES.STUDENT]: false,
    [ROLES.DELEGATE]: 'sur validation',
    [ROLES.MODERATOR]: true,
    [ROLES.ADMIN]: true,
  },
  {
    id: 'validate_or_remove_resource',
    action: 'Valider ou retirer une ressource',
    description: 'Certification académique, validation anti-plagiat et retrait de contenus',
    [ROLES.STUDENT]: false,
    [ROLES.DELEGATE]: false,
    [ROLES.MODERATOR]: true,
    [ROLES.ADMIN]: true,
  },
  {
    id: 'schedule_evaluation',
    action: 'Programmer une évaluation / un CC',
    description: 'Définition des créneaux, barèmes et sujets de contrôles continus',
    [ROLES.STUDENT]: false,
    [ROLES.DELEGATE]: 'sur validation',
    [ROLES.MODERATOR]: true,
    [ROLES.ADMIN]: true,
  },
  {
    id: 'publish_department_announcement',
    action: 'Publier une annonce de filière',
    description: 'Communication amphi, changement de salle et alertes académiques',
    [ROLES.STUDENT]: false,
    [ROLES.DELEGATE]: true,
    [ROLES.MODERATOR]: true,
    [ROLES.ADMIN]: true,
  },
  {
    id: 'manage_accounts_and_roles',
    action: 'Gérer les comptes et les rôles',
    description: 'Attribution des privilèges, suspension de comptes et gouvernance',
    [ROLES.STUDENT]: false,
    [ROLES.DELEGATE]: false,
    [ROLES.MODERATOR]: false,
    [ROLES.ADMIN]: true,
  },
  {
    id: 'view_faculty_statistics',
    action: 'Voir les statistiques de la faculté',
    description: 'Métriques d\'engagement, taux de participation et suivi des départements',
    [ROLES.STUDENT]: false,
    [ROLES.DELEGATE]: false,
    [ROLES.MODERATOR]: 'sur validation',
    [ROLES.ADMIN]: true,
  },
];

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
    scope: ROLE_SCOPES[ROLES.STUDENT],
    color: '#6366f1',
    bgColor: 'bg-indigo-50 dark:bg-indigo-950/70',
    textColor: 'text-indigo-700 dark:text-indigo-300',
    borderColor: 'border-indigo-200 dark:border-indigo-800',
    badgeGlow: 'shadow-indigo-500/10',
    icon: 'BookOpen',
    description: ROLE_DESCRIPTIONS[ROLES.STUDENT],
  },
  [ROLES.DELEGATE]: {
    label: 'Délégué',
    labelEn: 'Class Delegate',
    scope: ROLE_SCOPES[ROLES.DELEGATE],
    color: '#10b981',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950/70',
    textColor: 'text-emerald-700 dark:text-emerald-300',
    borderColor: 'border-emerald-200 dark:border-emerald-800',
    badgeGlow: 'shadow-emerald-500/10',
    icon: 'Award',
    description: ROLE_DESCRIPTIONS[ROLES.DELEGATE],
  },
  [ROLES.MODERATOR]: {
    label: 'Modérateur',
    labelEn: 'Moderator',
    scope: ROLE_SCOPES[ROLES.MODERATOR],
    color: '#0284c7',
    bgColor: 'bg-sky-50 dark:bg-sky-950/70',
    textColor: 'text-sky-700 dark:text-sky-300',
    borderColor: 'border-sky-200 dark:border-sky-800',
    badgeGlow: 'shadow-sky-500/10',
    icon: 'ShieldCheck',
    description: ROLE_DESCRIPTIONS[ROLES.MODERATOR],
  },
  [ROLES.ADMIN]: {
    label: 'Administrateur',
    labelEn: 'Super Admin',
    scope: ROLE_SCOPES[ROLES.ADMIN],
    color: '#d97706',
    bgColor: 'bg-amber-50 dark:bg-amber-950/70',
    textColor: 'text-amber-700 dark:text-amber-300',
    borderColor: 'border-amber-300 dark:border-amber-700',
    badgeGlow: 'shadow-amber-500/20',
    icon: 'Crown',
    description: ROLE_DESCRIPTIONS[ROLES.ADMIN],
  },
};

export const PERMISSIONS = {
  // Matrice standardisée
  CONSULT_UES_AND_RESOURCES: 'consult:ues_and_resources',
  PASS_ONLINE_EXAMS: 'exam:pass_online',
  USE_PLAYGROUND_AND_AI: 'playground:use_ai',
  PUBLISH_RESOURCE: 'resource:publish',
  VALIDATE_OR_REMOVE_RESOURCE: 'resource:validate_or_remove',
  SCHEDULE_EVALUATION: 'exam:schedule_evaluation',
  PUBLISH_DEPARTMENT_ANNOUNCEMENT: 'announcement:publish_department',
  MANAGE_ACCOUNTS_AND_ROLES: 'admin:manage_accounts_and_roles',
  VIEW_FACULTY_STATISTICS: 'analytics:view_faculty_statistics',

  // Aliases rétro-compatibles
  VIEW_CATALOG: 'consult:ues_and_resources',
  DOWNLOAD_DOCS: 'docs:download',
  USE_PLAYGROUND: 'playground:use_ai',
  USE_NOTEBOOK: 'notebook:use',
  UPLOAD_RESOURCE: 'resource:publish',
  RESOURCE_ADD: 'resource:add',
  RESOURCE_EDIT: 'resource:edit',
  RESOURCE_DELETE: 'resource:delete',
  RESOURCE_MANAGE_ANY: 'resource:manage_any',
  RATE_RESOURCE: 'resource:rate',

  PUBLISH_CLASS_ANNOUNCEMENT: 'announcement:publish_department',
  PIN_ANNOUNCEMENT: 'class:pin_announcement',
  MANAGE_CLASS_SCHEDULE: 'class:manage_schedule',
  VIEW_CLASS_ROSTER: 'class:view_roster',

  MODERATE_RESOURCES: 'resource:validate_or_remove',
  AUDIT_PLAGIARISM: 'moderation:plagiarism',
  RESOLVE_REPORTS: 'moderation:resolve_reports',
  FLAG_USERS: 'moderation:flag_users',
  DELETE_ANY_RESOURCE: 'moderation:delete_any_resource',

  MANAGE_USERS: 'admin:manage_accounts_and_roles',
  ASSIGN_ROLES: 'admin:assign_roles',
  VIEW_ANALYTICS: 'analytics:view_faculty_statistics',
  MANAGE_SYSTEM_SETTINGS: 'admin:system_settings',
  VIEW_AUDIT_LOGS: 'admin:view_audit_logs',
};

export const ROLE_PERMISSIONS = {
  [ROLES.STUDENT]: [
    PERMISSIONS.CONSULT_UES_AND_RESOURCES,
    PERMISSIONS.PASS_ONLINE_EXAMS,
    PERMISSIONS.USE_PLAYGROUND_AND_AI,
    PERMISSIONS.DOWNLOAD_DOCS,
    PERMISSIONS.USE_NOTEBOOK,
    PERMISSIONS.RATE_RESOURCE,
  ],
  [ROLES.DELEGATE]: [
    PERMISSIONS.CONSULT_UES_AND_RESOURCES,
    PERMISSIONS.PASS_ONLINE_EXAMS,
    PERMISSIONS.USE_PLAYGROUND_AND_AI,
    PERMISSIONS.DOWNLOAD_DOCS,
    PERMISSIONS.USE_NOTEBOOK,
    PERMISSIONS.RATE_RESOURCE,
    // Permissions étendues délégué (publications soumises à validation et annonces de filière)
    PERMISSIONS.PUBLISH_RESOURCE,
    PERMISSIONS.RESOURCE_ADD,
    PERMISSIONS.RESOURCE_EDIT,
    PERMISSIONS.RESOURCE_DELETE,
    PERMISSIONS.SCHEDULE_EVALUATION,
    PERMISSIONS.PUBLISH_DEPARTMENT_ANNOUNCEMENT,
    PERMISSIONS.PIN_ANNOUNCEMENT,
    PERMISSIONS.MANAGE_CLASS_SCHEDULE,
    PERMISSIONS.VIEW_CLASS_ROSTER,
  ],
  [ROLES.MODERATOR]: [
    PERMISSIONS.CONSULT_UES_AND_RESOURCES,
    PERMISSIONS.USE_PLAYGROUND_AND_AI,
    PERMISSIONS.DOWNLOAD_DOCS,
    PERMISSIONS.USE_NOTEBOOK,
    PERMISSIONS.RATE_RESOURCE,
    // Modération & gestion des ressources
    PERMISSIONS.PUBLISH_RESOURCE,
    PERMISSIONS.VALIDATE_OR_REMOVE_RESOURCE,
    PERMISSIONS.RESOURCE_ADD,
    PERMISSIONS.RESOURCE_EDIT,
    PERMISSIONS.RESOURCE_DELETE,
    PERMISSIONS.RESOURCE_MANAGE_ANY,
    PERMISSIONS.MODERATE_RESOURCES,
    PERMISSIONS.DELETE_ANY_RESOURCE,
    PERMISSIONS.SCHEDULE_EVALUATION,
    PERMISSIONS.PUBLISH_DEPARTMENT_ANNOUNCEMENT,
    PERMISSIONS.AUDIT_PLAGIARISM,
    PERMISSIONS.RESOLVE_REPORTS,
    PERMISSIONS.FLAG_USERS,
    PERMISSIONS.VIEW_FACULTY_STATISTICS,
    PERMISSIONS.VIEW_ANALYTICS,
  ],
  [ROLES.ADMIN]: [
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
 * Règle RBAC : Détermine si l'utilisateur est autorisé à ajouter une nouvelle ressource
 * - Étudiant : Strictement interdit (false)
 * - Délégué : Autorisé pour sa propre filière
 * - Modérateur / Admin : Autorisé pour toutes les filières
 */
export function canAddResource(user, targetFiliere = null) {
  if (!user) return false;
  const role = normalizeRole(user.role);

  // Étudiant : strictement interdit
  if (role === ROLES.STUDENT) return false;

  // Modérateur / Admin : accès universel
  if (role === ROLES.ADMIN || role === ROLES.MODERATOR) return true;

  // Délégué : autorisé pour sa filière
  if (role === ROLES.DELEGATE) {
    if (!targetFiliere) return true;
    const userFiliere = (user.filiereId || user.filiere || '').toLowerCase().trim();
    const target = String(targetFiliere).toLowerCase().trim();
    return !userFiliere || target === userFiliere;
  }

  return false;
}

/**
 * Règle RBAC : Détermine si l'utilisateur peut modifier une ressource
 * - Étudiant : Strictement interdit (bouton masqué)
 * - Délégué : Autorisé uniquement pour les ressources qu'il a lui-même créées OU celles de sa filière/classe
 * - Modérateur / Admin : Accès total sur n'importe quelle ressource
 */
export function canModifyResource(user, resource) {
  if (!user || !resource) return false;
  const role = normalizeRole(user.role);

  // Étudiant : strictement interdit
  if (role === ROLES.STUDENT) return false;

  // Modérateur / Admin : accès total
  if (role === ROLES.ADMIN || role === ROLES.MODERATOR) return true;

  // Délégué : restreint à ses publications ou sa filière
  if (role === ROLES.DELEGATE) {
    const userFiliere = (user.filiereId || user.filiere || '').toLowerCase().trim();
    const resFiliere = (resource.filiere || resource.filiereId || '').toLowerCase().trim();

    // 1. Ressource créée par l'utilisateur lui-même (par id ou matricule)
    const isOwnCreation = Boolean(
      (user.id && resource.authorId && String(resource.authorId) === String(user.id)) ||
      (user.matricule && resource.authorMatricule && String(resource.authorMatricule).toUpperCase() === String(user.matricule).toUpperCase())
    );

    // 2. Ressource appartenant à la même filière (classe du délégué)
    const isSameFiliere = Boolean(userFiliere && resFiliere && userFiliere === resFiliere);

    return isOwnCreation || isSameFiliere;
  }

  return false;
}

/**
 * Règle RBAC : Détermine si l'utilisateur peut supprimer une ressource
 * - Étudiant : Strictement interdit (bouton masqué)
 * - Délégué : Autorisé uniquement pour les ressources qu'il a lui-même créées OU celles de sa filière/classe
 * - Modérateur / Admin : Accès total
 */
export function canDeleteResource(user, resource) {
  if (!user || !resource) return false;
  const role = normalizeRole(user.role);

  // Étudiant : strictement interdit
  if (role === ROLES.STUDENT) return false;

  // Modérateur / Admin : accès total
  if (role === ROLES.ADMIN || role === ROLES.MODERATOR) return true;

  // Délégué : restreint à ses publications ou sa filière
  if (role === ROLES.DELEGATE) {
    const userFiliere = (user.filiereId || user.filiere || '').toLowerCase().trim();
    const resFiliere = (resource.filiere || resource.filiereId || '').toLowerCase().trim();

    const isOwnCreation = Boolean(
      (user.id && resource.authorId && String(resource.authorId) === String(user.id)) ||
      (user.matricule && resource.authorMatricule && String(resource.authorMatricule).toUpperCase() === String(user.matricule).toUpperCase())
    );

    const isSameFiliere = Boolean(userFiliere && resFiliere && userFiliere === resFiliere);

    return isOwnCreation || isSameFiliere;
  }

  return false;
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
    nom: 'Yan Fotsing',
    fullName: 'Yan Fotsing',
    status: 'Étudiant Pro',
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

/**
 * Fonctions d'évaluation directe basées sur la Matrice des Permissions
 */

/**
 * Récupère le statut d'une action dans la matrice : true, false ou 'sur validation'
 */
export function getMatrixPermission(role, actionId) {
  const norm = normalizeRole(role);
  const row = PERMISSIONS_MATRIX.find((item) => item.id === actionId);
  if (!row) return false;
  return row[norm] ?? false;
}

/**
 * Vérifie si le rôle a l'autorisation de passer les évaluations et CC en ligne
 * Selon la matrice : Étudiant (true), Délégué (true), Modérateur (false), Administrateur (false)
 */
export function canPassExams(role) {
  const norm = normalizeRole(role);
  return norm === ROLES.STUDENT || norm === ROLES.DELEGATE;
}

/**
 * Vérifie si le rôle peut programmer une évaluation / CC
 * Selon la matrice : Administrateur (true), Modérateur (true), Délégué ('sur validation'), Étudiant (false)
 */
export function canScheduleEvaluation(role) {
  const norm = normalizeRole(role);
  if (norm === ROLES.ADMIN || norm === ROLES.MODERATOR) return true;
  if (norm === ROLES.DELEGATE) return 'sur validation';
  return false;
}

/**
 * Vérifie si le rôle peut publier des annonces de filière
 * Selon la matrice : Délégué (true), Modérateur (true), Administrateur (true), Étudiant (false)
 */
export function canPublishAnnouncement(role) {
  const norm = normalizeRole(role);
  return norm === ROLES.DELEGATE || norm === ROLES.MODERATOR || norm === ROLES.ADMIN;
}

/**
 * Vérifie si le rôle peut gérer les comptes et les rôles
 * Selon la matrice : Administrateur uniquement (true)
 */
export function canManageAccountsAndRoles(role) {
  const norm = normalizeRole(role);
  return norm === ROLES.ADMIN;
}

/**
 * Vérifie si le rôle a accès aux statistiques de la faculté
 * Selon la matrice : Administrateur (true), Modérateur ('sur validation'), Délégué (false), Étudiant (false)
 */
export function canViewFacultyStats(role) {
  const norm = normalizeRole(role);
  if (norm === ROLES.ADMIN) return true;
  if (norm === ROLES.MODERATOR) return 'sur validation';
  return false;
}

