/**
 * Service de Cloisonnement Académique & Contrôle d'Accès par Rôles
 * CampusHub - Université de Yaoundé I
 *
 * Implémente la règle absolue d'étanchéité :
 * - Un étudiant de Niveau 1 (L1) ne voit JAMAIS les cours/examens/plannings d'un Niveau 2 (L2), etc.
 * - Un étudiant d'une filière ne voit QUE sa filière (sauf Admin avec vue d'audit).
 * - Hiérarchie des rôles : Étudiant < Délégué < Modérateur < Administrateur
 */

import { ROLES, normalizeRole } from '../constants/rbacConstants';
import {
  SCOPED_COURSES_CATALOG,
  SCOPED_CLASS_SCHEDULES,
  SCOPED_ANNOUNCEMENTS,
} from '../constants/academicDataStore';

const STORAGE_ANNOUNCEMENTS_KEY = 'campushub_scoped_announcements_v2';
const STORAGE_SCHEDULES_KEY = 'campushub_scoped_schedules_v2';

class AcademicAccessService {
  constructor() {
    this.announcements = this.loadAnnouncements();
    this.schedules = this.loadSchedules();
  }

  loadAnnouncements() {
    try {
      const saved = localStorage.getItem(STORAGE_ANNOUNCEMENTS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return [...SCOPED_ANNOUNCEMENTS];
  }

  saveAnnouncements(list) {
    this.announcements = list;
    try {
      localStorage.setItem(STORAGE_ANNOUNCEMENTS_KEY, JSON.stringify(list));
    } catch {
      // ignore
    }
  }

  loadSchedules() {
    try {
      const saved = localStorage.getItem(STORAGE_SCHEDULES_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return [...SCOPED_CLASS_SCHEDULES];
  }

  saveSchedules(list) {
    this.schedules = list;
    try {
      localStorage.setItem(STORAGE_SCHEDULES_KEY, JSON.stringify(list));
    } catch {
      // ignore
    }
  }

  /**
   * Normalisation et comparaison robuste de filières
   */
  normalizeFiliere(f) {
    if (!f || typeof f !== 'string') return 'informatique';
    return f
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  }

  matchFiliere(f1, f2) {
    if (!f1 || !f2) return false;
    const n1 = this.normalizeFiliere(f1);
    const n2 = this.normalizeFiliere(f2);
    if (n1 === n2) return true;
    if (n1.includes(n2) || n2.includes(n1)) return true;
    if ((n1.includes('info') || n1.includes('code')) && (n2.includes('info') || n2.includes('code'))) return true;
    if (n1.includes('chim') && n2.includes('chim')) return true;
    if (n1.includes('phys') && n2.includes('phys')) return true;
    if (n1.includes('math') && n2.includes('math')) return true;
    if (n1.includes('bio') && n2.includes('bio')) return true;
    if (n1.includes('lettre') && n2.includes('lettre')) return true;
    if (n1.includes('philo') && n2.includes('philo')) return true;
    if (n1.includes('hist') && n2.includes('hist')) return true;
    if (n1.includes('ling') && n2.includes('ling')) return true;
    return false;
  }

  /**
   * RÈGLE ABSOLUE D'ÉTANCHÉITÉ : Vérifie l'égalité stricte du niveau académique
   * L1 !== L2 !== L3 !== M1 !== M2
   */
  matchStrictLevel(l1, l2) {
    if (!l1 || !l2) return false;
    const s1 = String(l1).toUpperCase().trim();
    const s2 = String(l2).toUpperCase().trim();

    // Normalisation Licence 1 -> L1, etc.
    const norm = (lvl) => {
      if (lvl === 'L1' || lvl === 'LICENCE 1' || lvl === 'NIVEAU 1') return 'L1';
      if (lvl === 'L2' || lvl === 'LICENCE 2' || lvl === 'NIVEAU 2') return 'L2';
      if (lvl === 'L3' || lvl === 'LICENCE 3' || lvl === 'NIVEAU 3') return 'L3';
      if (lvl === 'M1' || lvl === 'MASTER 1') return 'M1';
      if (lvl === 'M2' || lvl === 'MASTER 2') return 'M2';
      if (lvl === 'MASTER') return 'M1'; // fallback
      return lvl;
    };

    return norm(s1) === norm(s2);
  }

  /**
   * Récupère la liste des cours STRICTEMENT cloisonnés
   */
  getScopedCourses(user, overrideFilters = null) {
    const role = normalizeRole(user?.role);
    const isAdmin = role === ROLES.ADMIN;

    const userFiliere = user?.filiereId || user?.filiere || 'Informatique';
    const userNiveau = user?.niveau || 'L2';

    const targetFiliere = (isAdmin && overrideFilters?.filiere) ? overrideFilters.filiere : userFiliere;
    const targetNiveau = (isAdmin && overrideFilters?.niveau) ? overrideFilters.niveau : userNiveau;

    return SCOPED_COURSES_CATALOG.filter((course) => {
      // 1. Filtrage strict par filière
      const filiereOk = this.matchFiliere(course.filiere, targetFiliere);
      // 2. Filtrage strict par niveau (Étanche)
      const niveauOk = this.matchStrictLevel(course.niveau, targetNiveau);

      return filiereOk && niveauOk;
    });
  }

  /**
   * Récupère le planning de cours STRICTEMENT cloisonné
   */
  getScopedSchedule(user, overrideFilters = null) {
    const role = normalizeRole(user?.role);
    const isAdmin = role === ROLES.ADMIN;

    const userFiliere = user?.filiereId || user?.filiere || 'Informatique';
    const userNiveau = user?.niveau || 'L2';

    const targetFiliere = (isAdmin && overrideFilters?.filiere) ? overrideFilters.filiere : userFiliere;
    const targetNiveau = (isAdmin && overrideFilters?.niveau) ? overrideFilters.niveau : userNiveau;

    const match = this.schedules.find((sch) => {
      return this.matchFiliere(sch.filiere, targetFiliere) && this.matchStrictLevel(sch.niveau, targetNiveau);
    });

    if (match) return match;

    // Fallback synthétique avec UEs du catalogue si pas de planning statique
    const courses = this.getScopedCourses(user, overrideFilters);
    return {
      id: `synthetic-${targetFiliere}-${targetNiveau}`,
      filiere: targetFiliere,
      niveau: targetNiveau,
      amphi: `Amphi Central · UY1 (${targetNiveau})`,
      semestre: 'Semestre Régulier (2025-2026)',
      slots: courses.slice(0, 4).map((c, idx) => ({
        day: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi'][idx] || 'Vendredi',
        time: ['08h00 - 11h00', '13h00 - 16h00', '09h00 - 12h00', '14h00 - 17h00'][idx] || '08h00 - 12h00',
        ue: c.codeUe,
        type: 'Cours Magistral & Séminaire',
        prof: c.enseignant,
        salle: `Amphi ${targetNiveau}`,
      })),
    };
  }

  /**
   * Récupère les annonces officielles de la classe
   */
  getScopedAnnouncements(user, overrideFilters = null) {
    const role = normalizeRole(user?.role);
    const isAdmin = role === ROLES.ADMIN;

    const userFiliere = user?.filiereId || user?.filiere || 'Informatique';
    const userNiveau = user?.niveau || 'L2';

    const targetFiliere = (isAdmin && overrideFilters?.filiere) ? overrideFilters.filiere : userFiliere;
    const targetNiveau = (isAdmin && overrideFilters?.niveau) ? overrideFilters.niveau : userNiveau;

    return this.announcements.filter((ann) => {
      return this.matchFiliere(ann.filiere, targetFiliere) && this.matchStrictLevel(ann.niveau, targetNiveau);
    });
  }

  /**
   * Publication d'une annonce (Réservé au Délégué, Modérateur ou Admin)
   */
  publishAnnouncement(user, { title, content, priority = 'normal', pinned = false }) {
    const role = normalizeRole(user?.role);
    if (role === ROLES.STUDENT) {
      throw new Error('Action non autorisée : Seuls les délégués et modérateurs peuvent publier des annonces.');
    }

    const userFiliere = user?.filiereId || user?.filiere || 'Informatique';
    const userNiveau = user?.niveau || 'L2';

    const newAnn = {
      id: 'ann-' + Date.now(),
      filiere: userFiliere,
      niveau: userNiveau,
      author: `${user?.fullName || user?.nom || 'Délégué'} (${user?.matricule || 'UY1'})`,
      authorRole: role,
      title,
      date: new Date().toISOString().split('T')[0],
      priority,
      content,
      pinned,
    };

    const updated = [newAnn, ...this.announcements];
    this.saveAnnouncements(updated);
    return newAnn;
  }

  /**
   * Détermine le bon Playground / Atelier interactif à charger
   */
  getPlaygroundConfig(filiere) {
    const norm = this.normalizeFiliere(filiere);

    if (norm.includes('info') || norm.includes('code') || norm.includes('ia') || norm.includes('reseau')) {
      return {
        type: 'code',
        title: 'CodePlayground Hub Interactif',
        description: 'Compilateur C (GCC/Valgrind), interpréteur Python 3, requêtes SQL et prévisualisation Web HTML/CSS.',
        badge: 'Informatique & Systèmes',
      };
    }

    if (norm.includes('chim')) {
      return {
        type: 'chemistry',
        title: 'Laboratoire Virtuel de Chimie',
        description: 'Tableau périodique de Mendeleïev, simulateur de titrages acido-basiques et calculs de molarité.',
        badge: 'Chimie & Procédés',
      };
    }

    if (norm.includes('phys')) {
      return {
        type: 'physics',
        title: 'Laboratoire Virtuel de Physique',
        description: 'Formulaires de lois de Maxwell, résonance des circuits RLC, optique géométrique et annales de TP.',
        badge: 'Physique & Électronique',
      };
    }

    if (norm.includes('bio')) {
      return {
        type: 'biology',
        title: 'Plateforme Virtuelle de Biosciences',
        description: 'Traduction/transcription ADN/ARN, échiquier de Punnett et atlas cytologique haute résolution.',
        badge: 'Biologie & Géosciences',
      };
    }

    if (norm.includes('math')) {
      return {
        type: 'mathematics',
        title: 'Atelier de Modélisation & Calcul Mathématique',
        description: 'Algèbre matricielle, calcul de déterminants, dérivation formelle et intégrales numériques de Simpson.',
        badge: 'Mathématiques & Analyse',
      };
    }

    // Filières FALSH (Lettres, Philo, Histoire, Langues)
    return {
      type: 'falsh',
      title: 'Atelier Méthodologique FALSH',
      description: 'Assistant de structuration de dissertation, dictionnaire des figures de style et générateur de bibliographie (APA/MLA/Chicago).',
      badge: 'Humanités & Lettres',
    };
  }
}

export const academicAccessService = new AcademicAccessService();
