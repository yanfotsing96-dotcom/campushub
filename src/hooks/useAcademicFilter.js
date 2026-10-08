import { useMemo, useCallback } from 'react';
import { useAuth } from './useAuth';
import { ROLES, normalizeRole } from '../constants/rbacConstants';
import { DEPARTMENTS, ACADEMIC_LEVELS } from '../constants/academicScopes';

/**
 * Normalise l'identifiant d'une filière pour un filtrage insensible à la casse et aux variantes
 */
export function normalizeFiliere(filiere) {
  if (!filiere || typeof filiere !== 'string') return 'Informatique';
  const f = filiere.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
  if (f.includes('chim')) return 'Chimie';
  if (f.includes('phys')) return 'Physique';
  if (f.includes('bio')) return 'Biologie';
  if (f.includes('math')) return 'Mathématiques';
  if (f.includes('info') || f.includes('code') || f.includes('software')) return 'Informatique';
  if (f.includes('data') || f.includes('ia')) return 'IA-Data';
  if (f.includes('reseau') || f.includes('cyber')) return 'Cyber-Reseaux';
  if (f.includes('civil')) return 'Genie-Civil';
  return filiere;
}

/**
 * Normalise et compare les niveaux académiques (L1, L2, L3, Master/M1/M2)
 */
export function matchAcademicLevel(studentNiveau, itemNiveau) {
  if (!studentNiveau || !itemNiveau) return true;
  const s = String(studentNiveau).toUpperCase().trim();
  const i = String(itemNiveau).toUpperCase().trim();

  if (s === i) return true;

  // Équivalence Master / M1 / M2
  const isStudentMaster = s === 'MASTER' || s === 'M1' || s === 'M2';
  const isItemMaster = i === 'MASTER' || i === 'M1' || i === 'M2';
  if (isStudentMaster && isItemMaster) return true;

  // Équivalences Licence
  if ((s === 'L1' || s === 'LICENCE 1') && (i === 'L1' || i === 'LICENCE 1')) return true;
  if ((s === 'L2' || s === 'LICENCE 2') && (i === 'L2' || i === 'LICENCE 2')) return true;
  if ((s === 'L3' || s === 'LICENCE 3') && (i === 'L3' || i === 'LICENCE 3')) return true;

  return false;
}

/**
 * Hook Central de Filtrage Dynamique & Cloisonnement Académique (Dynamic Content Guard)
 * Intercepte et filtre rigoureusement cours, supports, annales et examens
 * pour n'afficher QUE les contenus correspondant exactement au profil de l'étudiant.
 */
export function useAcademicFilter() {
  const { user } = useAuth();
  const role = normalizeRole(user?.role || ROLES.STUDENT);
  const isAdmin = role === ROLES.ADMIN;
  const isModerator = role === ROLES.MODERATOR;

  // Profil académique connecté
  const activeFiliere = useMemo(() => {
    return normalizeFiliere(user?.filiereId || user?.filiere || 'Informatique');
  }, [user?.filiereId, user?.filiere]);

  const activeNiveau = useMemo(() => {
    return user?.niveau || 'L2';
  }, [user?.niveau]);

  const universityId = user?.universityId || 'UY1';
  const matricule = user?.matricule || '';

  // Métadonnées du département actif
  const department = useMemo(() => {
    return (
      DEPARTMENTS.find((d) => d.id === activeFiliere || normalizeFiliere(d.id) === activeFiliere) ||
      DEPARTMENTS[0]
    );
  }, [activeFiliere]);

  // Niveau d'études actif
  const levelMeta = useMemo(() => {
    return (
      ACADEMIC_LEVELS.find((lvl) => matchAcademicLevel(lvl.id, activeNiveau)) ||
      ACADEMIC_LEVELS[1] // L2 fallback
    );
  }, [activeNiveau]);

  /**
   * Vérifie si un élément académique appartient strictement au profil de l'étudiant
   */
  const canAccessItem = useCallback(
    (item) => {
      if (!item) return false;
      if (isAdmin) return true; // L'administrateur a une vue globale

      const itemFiliere = normalizeFiliere(item.filiereId || item.filiere || '');
      const itemNiveau = item.niveau || '';

      const filiereMatches = itemFiliere === activeFiliere;
      const niveauMatches = matchAcademicLevel(activeNiveau, itemNiveau);

      return filiereMatches && niveauMatches;
    },
    [isAdmin, activeFiliere, activeNiveau]
  );

  /**
   * Filtrage strict des cours (UEs)
   */
  const filterCourses = useCallback(
    (coursesList = [], options = {}) => {
      const { bypassGuard = false } = options;
      if (bypassGuard && isAdmin) return coursesList;

      return coursesList.filter((course) => {
        const itemFiliere = normalizeFiliere(course.filiereId || course.filiere || '');
        const itemNiveau = course.niveau || '';

        const filiereMatches = itemFiliere === activeFiliere;
        const niveauMatches = matchAcademicLevel(activeNiveau, itemNiveau);

        return filiereMatches && niveauMatches;
      });
    },
    [isAdmin, activeFiliere, activeNiveau]
  );

  /**
   * Filtrage strict des supports pédagogiques (Polycopiés, TDs, Fiches, Vidéos)
   */
  const filterMaterials = useCallback(
    (materialsList = [], options = {}) => {
      const { bypassGuard = false } = options;
      if (bypassGuard && isAdmin) return materialsList;

      return materialsList.filter((mat) => {
        const itemFiliere = normalizeFiliere(mat.filiereId || mat.filiere || '');
        const itemNiveau = mat.niveau || '';

        const filiereMatches = itemFiliere === activeFiliere;
        const niveauMatches = matchAcademicLevel(activeNiveau, itemNiveau);

        return filiereMatches && niveauMatches;
      });
    },
    [isAdmin, activeFiliere, activeNiveau]
  );

  /**
   * Filtrage strict des ressources générales et annales
   */
  const filterResources = useCallback(
    (resourcesList = [], options = {}) => {
      const { bypassGuard = false } = options;
      if (bypassGuard && isAdmin) return resourcesList;

      return resourcesList.filter((resource) => {
        const itemFiliere = normalizeFiliere(resource.filiere || resource.filiereId || '');
        const itemNiveau = resource.niveau || '';

        const filiereMatches = itemFiliere === activeFiliere;
        const niveauMatches = matchAcademicLevel(activeNiveau, itemNiveau);

        return filiereMatches && niveauMatches;
      });
    },
    [isAdmin, activeFiliere, activeNiveau]
  );

  /**
   * Filtrage strict des compositions et examens en ligne
   */
  const filterExams = useCallback(
    (examsList = [], options = {}) => {
      const { bypassGuard = false } = options;
      if (bypassGuard && (isAdmin || isModerator)) return examsList;

      return examsList.filter((exam) => {
        // Pour les étudiants : doit être actif ou statut composition
        const isActive = exam.status === 'actif' || exam.status === 'active';
        const itemFiliere = normalizeFiliere(exam.filiereId || exam.filiere || '');
        const itemNiveau = exam.niveau || '';

        const filiereMatches = itemFiliere === activeFiliere;
        const niveauMatches = matchAcademicLevel(activeNiveau, itemNiveau);

        return isActive && filiereMatches && niveauMatches;
      });
    },
    [isAdmin, isModerator, activeFiliere, activeNiveau]
  );

  return {
    user,
    role,
    isAdmin,
    isModerator,
    activeFiliere,
    activeNiveau,
    universityId,
    matricule,
    department,
    levelMeta,
    scopeSummary: {
      filiere: activeFiliere,
      filiereLabel: department.label,
      filiereCode: department.code,
      niveau: activeNiveau,
      niveauLabel: levelMeta.label,
      matricule,
    },
    canAccessItem,
    filterCourses,
    filterMaterials,
    filterResources,
    filterExams,
  };
}
