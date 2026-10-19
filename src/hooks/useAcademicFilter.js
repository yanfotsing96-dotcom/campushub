import { useMemo, useCallback } from 'react';
import { useAuth } from './useAuth';
import { ROLES, normalizeRole } from '../constants/rbacConstants';
import { DEPARTMENTS, ACADEMIC_LEVELS } from '../constants/academicScopes';
import { nationalAcademicService } from '../constants/nationalAcademicData';

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
  if (f.includes('info') || f.includes('code') || f.includes('software') || f.includes('gl')) return 'Informatique';
  if (f.includes('data') || f.includes('ia')) return 'IA-Data';
  if (f.includes('reseau') || f.includes('cyber')) return 'Cyber-Reseaux';
  if (f.includes('civil')) return 'Genie-Civil';
  if (f.includes('droit')) return 'Droit';
  if (f.includes('lettre') || f.includes('falsh')) return 'Lettres';
  return filiere;
}

/**
 * Normalise strictement le niveau académique vers son format pivot (L1, L2, L3, M1, M2, Doctorat)
 */
export function normalizeAcademicLevel(niveau) {
  if (!niveau || typeof niveau !== 'string') return 'L2';
  const n = String(niveau).toUpperCase().trim();
  if (n === 'L1' || n.includes('LICENCE 1') || n.includes('1ERE') || n.includes('1ÈRE')) return 'L1';
  if (n === 'L2' || n.includes('LICENCE 2') || n.includes('2EME') || n.includes('2ÈME')) return 'L2';
  if (n === 'L3' || n.includes('LICENCE 3') || n.includes('3EME') || n.includes('3ÈME')) return 'L3';
  if (n === 'M1' || n.includes('MASTER 1') || n.includes('4EME') || n.includes('4ÈME')) return 'M1';
  if (n === 'M2' || n.includes('MASTER 2') || n.includes('5EME') || n.includes('5ÈME')) return 'M2';
  if (n.includes('DOC') || n.includes('PHD')) return 'Doctorat';
  return n;
}

/**
 * Compare STRICTEMENT deux niveaux académiques :
 * Uniquement et exclusivement si le niveau de l'étudiant correspond exactement au niveau du document.
 */
export function matchAcademicLevel(studentNiveau, itemNiveau) {
  if (!studentNiveau || !itemNiveau) return false;
  return normalizeAcademicLevel(studentNiveau) === normalizeAcademicLevel(itemNiveau);
}

/**
 * Hook Central de Filtrage Dynamique & Cloisonnement Académique Strict
 * Récupère le profil de l'étudiant (Université -> Faculté -> Filière -> Niveau exact)
 * et isole strictement toutes les ressources nationales pour n'afficher que ce qui correspond.
 */
export function useAcademicFilter() {
  const { user } = useAuth();
  const role = normalizeRole(user?.role || ROLES.STUDENT);
  const isAdmin = role === ROLES.ADMIN;
  const isModerator = role === ROLES.MODERATOR;

  // 1. Profil Étudiant Structuré (Université -> Faculté -> Filière -> Niveau Exact)
  const activeFiliere = useMemo(() => {
    return normalizeFiliere(user?.filiereId || user?.filiere || 'Informatique');
  }, [user?.filiereId, user?.filiere]);

  const rawNiveau = user?.niveau || 'L2';
  const activeNiveau = useMemo(() => {
    return normalizeAcademicLevel(rawNiveau);
  }, [rawNiveau]);

  const universityId = user?.universityId || 'UY1';
  const universityName = user?.universityName || 'Université de Yaoundé I';
  const matricule = user?.matricule || '';

  // Métadonnées du département
  const department = useMemo(() => {
    return (
      DEPARTMENTS.find((d) => d.id === activeFiliere || normalizeFiliere(d.id) === activeFiliere) ||
      DEPARTMENTS[0]
    );
  }, [activeFiliere]);

  // Faculté de rattachement
  const facultyName = useMemo(() => {
    if (user?.facultyName) return user.facultyName;
    if (user?.faculty) return user.faculty;
    if (['Informatique', 'Chimie', 'Physique', 'Biologie', 'Mathématiques', 'IA-Data', 'Cyber-Reseaux'].includes(activeFiliere)) {
      return 'Faculté des Sciences (FS)';
    }
    if (activeFiliere === 'Genie-Civil') {
      return 'École Nationale Supérieure Polytechnique de Yaoundé (ENSPY)';
    }
    return 'Faculté des Arts, Lettres et Sciences Humaines (FALSH)';
  }, [user, activeFiliere]);

  // Niveau d'études actif
  const levelMeta = useMemo(() => {
    return (
      ACADEMIC_LEVELS.find((lvl) => matchAcademicLevel(lvl.id, activeNiveau)) ||
      ACADEMIC_LEVELS[1] // L2 fallback
    );
  }, [activeNiveau]);

  // Profil complet pour affichage clair
  const studentProfile = useMemo(() => ({
    universityId,
    universityName,
    facultyName,
    facultyCode: department.code ? department.code.split('-')[0] : 'FS',
    filiere: activeFiliere,
    filiereLabel: department.label,
    filiereCode: department.code,
    niveau: activeNiveau,
    niveauLabel: levelMeta.label,
    matricule,
  }), [universityId, universityName, facultyName, department, activeFiliere, activeNiveau, levelMeta, matricule]);

  /**
   * Récupère la liste des UEs officielles du MINESUP pour cette filière et ce niveau exact
   */
  const scopedUes = useMemo(() => {
    const filiereKeyMap = {
      Informatique: 'inf',
      Mathématiques: 'math',
      Physique: 'phys',
      Chimie: 'chim',
      Biologie: 'bio',
      'Genie-Civil': 'genie_civil',
      'IA-Data': 'inf',
      'Cyber-Reseaux': 'inf',
    };
    const key = filiereKeyMap[activeFiliere] || 'inf';
    return nationalAcademicService.getUesByFiliereAndLevel(key, activeNiveau);
  }, [activeFiliere, activeNiveau]);

  /**
   * Vérifie si un élément académique appartient STRICTEMENT au profil de l'étudiant
   */
  const canAccessItem = useCallback(
    (item, options = {}) => {
      if (!item) return false;
      const { strict = false } = options;
      // En mode strict (Ressources Nationales), même un admin peut voir le scope cloisonné
      if (isAdmin && !strict) return true;

      const itemFiliere = normalizeFiliere(item.filiereId || item.filiere || item.filiereLabel || '');
      const itemNiveau = item.niveau || '';

      const filiereMatches = itemFiliere === activeFiliere;
      const niveauMatches = matchAcademicLevel(activeNiveau, itemNiveau);

      return filiereMatches && niveauMatches;
    },
    [isAdmin, activeFiliere, activeNiveau]
  );

  /**
   * Alias de canAccessItem pour compatibilité des composants
   */
  const isResourceAllowed = useCallback(
    (item) => canAccessItem(item, { strict: true }),
    [canAccessItem]
  );

  /**
   * Filtrage strict des ressources (Exclusion totale de toute autre filière ou niveau)
   */
  const filterResources = useCallback(
    (resourcesList = [], options = {}) => {
      const { bypassGuard = false } = options;
      if (bypassGuard && isAdmin) return resourcesList;

      return resourcesList.filter((resource) => {
        const itemFiliere = normalizeFiliere(resource.filiere || resource.filiereId || resource.filiereLabel || '');
        const itemNiveau = resource.niveau || '';

        const filiereMatches = itemFiliere === activeFiliere;
        const niveauMatches = matchAcademicLevel(activeNiveau, itemNiveau);

        return filiereMatches && niveauMatches;
      });
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
   * Filtrage strict des supports pédagogiques
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
   * Filtrage strict des compositions et examens en ligne
   */
  const filterExams = useCallback(
    (examsList = [], options = {}) => {
      const { bypassGuard = false } = options;
      if (bypassGuard && (isAdmin || isModerator)) return examsList;

      return examsList.filter((exam) => {
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
    isStudentScoped: true,
    activeFiliere,
    activeNiveau,
    universityId,
    matricule,
    department,
    levelMeta,
    studentProfile,
    scopedUes,
    scopeSummary: {
      filiere: activeFiliere,
      filiereLabel: department.label,
      filiereCode: department.code,
      niveau: activeNiveau,
      niveauLabel: levelMeta.label,
      matricule,
    },
    canAccessItem,
    isResourceAllowed,
    filterCourses,
    filterMaterials,
    filterResources,
    filterExams,
  };
}
