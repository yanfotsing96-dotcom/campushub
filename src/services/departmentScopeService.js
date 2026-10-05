/**
 * Service de Cloisonnement par Filière & Moteur de Requêtes Relationnelles
 * Assure le partitionnement étanche des données (Tenant Isolation par Filière & Niveau)
 */

import { DEPARTMENTS, RELATION_COURSES } from '../constants/academicScopes';
import { ROLES, normalizeRole } from '../constants/rbacConstants';

const STORAGE_MATERIALS_KEY = 'campushub_scoped_materials';

// Initial course materials linked relationally to courses
const INITIAL_COURSE_MATERIALS = [
  {
    id: 'mat-101',
    courseId: 'course-inf201',
    codeUe: 'INF201',
    filiereId: 'Informatique',
    niveau: 'L2',
    titre: 'Polycopié Officiel : Arbres Binaires de Recherche (ABR) & Équilibrage AVL en C',
    type: 'pdf',
    format: 'PDF',
    size: '3.4 Mo',
    pages: 48,
    enseignant: 'Dr. T. Mbarga',
    url: '#download-pdf-abr',
    downloads: 245,
    description: 'Algorithmes d\'insertion récursive, de suppression complexe et de rotation gauche/droite (LL, RR, LR, RL). Code source C complet testé avec Valgrind.',
    publishedAt: '2026-03-10',
    verified: true,
  },
  {
    id: 'mat-102',
    courseId: 'course-inf201',
    codeUe: 'INF201',
    filiereId: 'Informatique',
    niveau: 'L2',
    titre: 'Vidéo Conférence : Démonstration des Rotations AVL & Arbres Rouges-Noirs',
    type: 'video',
    format: 'MP4 / Stream',
    duration: '45 min',
    enseignant: 'Dr. T. Mbarga',
    url: '#watch-video-avl',
    downloads: 182,
    description: 'Enregistrement en direct de l\'amphi 250 avec trace pas-à-pas de l\'arbre mémoire.',
    publishedAt: '2026-03-12',
    verified: true,
  },
  {
    id: 'mat-103',
    courseId: 'course-inf203',
    codeUe: 'INF203',
    filiereId: 'Informatique',
    niveau: 'L2',
    titre: 'Guide Pratique POSIX : Programmation des Sémaphores & Tubes Anonymes (Pipes)',
    type: 'pdf',
    format: 'PDF',
    size: '2.8 Mo',
    pages: 36,
    enseignant: 'Pr. F. Nkenlifack',
    url: '#download-pdf-posix',
    downloads: 310,
    description: 'Implémentation du problème Producteur-Consommateur en C avec sem_init, sem_wait et sem_post sous Linux Ubuntu.',
    publishedAt: '2026-03-14',
    verified: true,
  },
  {
    id: 'mat-104',
    courseId: 'course-inf205',
    codeUe: 'INF205',
    filiereId: 'Informatique',
    niveau: 'L2',
    titre: 'Fiche d\'Exercices : Décodage des Instructions x86-64 & Calcul de Cache Hit/Miss',
    type: 'exercise',
    format: 'PDF / TD',
    size: '1.5 Mo',
    pages: 14,
    enseignant: 'Dr. C. Fotso',
    url: '#download-td-cache',
    downloads: 194,
    description: 'Exercices d\'examen sur les politiques de remplacement LRU, calcul du temps moyen d\'accès mémoire (AMAT) et registres RAX, RBX, RCX.',
    publishedAt: '2026-03-18',
    verified: true,
  },
  // Document for IA-Data (Partitioned from Informatique)
  {
    id: 'mat-201',
    courseId: 'course-iad201',
    codeUe: 'IAD201',
    filiereId: 'IA-Data',
    niveau: 'L2',
    titre: 'Notebook Python : Régression Logistique & Optimisation SGD from Scratch',
    type: 'code',
    format: 'IPYNB',
    size: '4.2 Mo',
    enseignant: 'Dr. R. Mvogo',
    url: '#download-ipynb-sgd',
    downloads: 120,
    description: 'Calcul matriciel avec NumPy, tracé de la frontière de décision avec Matplotlib.',
    publishedAt: '2026-03-05',
    verified: true,
  },
  // Document for Mathématiques (Partitioned)
  {
    id: 'mat-301',
    courseId: 'course-mat201',
    codeUe: 'MAT201',
    filiereId: 'Mathématiques',
    niveau: 'L2',
    titre: 'Annales Corrigées : Séries Numériques & Séries Entières (2020-2025)',
    type: 'pdf',
    format: 'PDF',
    size: '5.1 Mo',
    pages: 64,
    enseignant: 'Pr. J. Nguemo',
    url: '#download-pdf-maths',
    downloads: 215,
    description: 'Corrigés détaillés avec développement en série de Taylor et calculs de rayons de convergence.',
    publishedAt: '2026-02-28',
    verified: true,
  },
];

class DepartmentScopeService {
  constructor() {
    this.materials = this.loadMaterials();
  }

  loadMaterials() {
    try {
      const saved = localStorage.getItem(STORAGE_MATERIALS_KEY);
      return saved ? JSON.parse(saved) : INITIAL_COURSE_MATERIALS;
    } catch {
      return INITIAL_COURSE_MATERIALS;
    }
  }

  saveMaterials(data) {
    this.materials = data;
    try {
      localStorage.setItem(STORAGE_MATERIALS_KEY, JSON.stringify(data));
    } catch (err) {
      console.warn('Erreur stockage cours :', err);
    }
  }

  getDepartment(filiereId) {
    return DEPARTMENTS.find((d) => d.id === filiereId) || DEPARTMENTS[0];
  }

  getAllDepartments() {
    return DEPARTMENTS;
  }

  /**
   * Vérifie si l'utilisateur a le droit d'accéder aux données d'une filière
   */
  canAccessFiliere(user, targetFiliereId) {
    if (!user) return false;
    const role = normalizeRole(user.role);

    // L'administrateur a une visibilité globale
    if (role === ROLES.ADMIN) return true;

    // Pour l'étudiant et le délégué, accès strictement restreint à leur propre filière
    const userFiliere = user.filiereId || user.filiere || 'Informatique';
    return userFiliere.toLowerCase() === targetFiliereId.toLowerCase();
  }

  /**
   * Requête relationnelle sécurisée pour récupérer les cours (UEs) selon le scope de l'utilisateur
   */
  getScopedCourses(user, { filiereId, niveau } = {}) {
    const role = normalizeRole(user?.role);
    const userFiliere = user?.filiereId || user?.filiere || 'Informatique';
    const userNiveau = user?.niveau || 'L2';

    // Règle de cloisonnement :
    // - Si Admin : peut filtrer librement ou voir tout
    // - Si Étudiant ou Délégué : strictement cantonné à sa filière et son niveau
    const effectiveFiliere = role === ROLES.ADMIN ? (filiereId || userFiliere) : userFiliere;
    const effectiveNiveau = role === ROLES.ADMIN ? (niveau || userNiveau) : userNiveau;

    return RELATION_COURSES.filter((c) => {
      const matchFiliere = !effectiveFiliere || c.filiereId.toLowerCase() === effectiveFiliere.toLowerCase();
      const matchNiveau = !effectiveNiveau || c.niveau === effectiveNiveau;
      return matchFiliere && matchNiveau;
    });
  }

  /**
   * Récupère les supports de cours (PDF, vidéos, exercices) strictement cloisonnés
   */
  getScopedMaterials(user, { courseId, type, searchQuery } = {}) {
    const role = normalizeRole(user?.role);
    const userFiliere = user?.filiereId || user?.filiere || 'Informatique';
    const userNiveau = user?.niveau || 'L2';

    return this.materials.filter((m) => {
      // Cloisonnement strict si non-admin
      if (role !== ROLES.ADMIN) {
        if (m.filiereId.toLowerCase() !== userFiliere.toLowerCase()) return false;
        if (m.niveau !== userNiveau) return false;
      }

      // Filtre optionnel par cours (ex: INF201)
      if (courseId && m.courseId !== courseId) return false;

      // Filtre par type (pdf, video, exercise, code)
      if (type && type !== 'all' && m.type !== type) return false;

      // Filtre textuel
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = m.titre.toLowerCase().includes(q);
        const matchesCode = m.codeUe.toLowerCase().includes(q);
        const matchesTeacher = m.enseignant.toLowerCase().includes(q);
        if (!matchesTitle && !matchesCode && !matchesTeacher) return false;
      }

      return true;
    });
  }

  /**
   * Publication sécurisée d'un support pédagogique avec vérification de périmètre
   */
  publishMaterial(user, payload) {
    const role = normalizeRole(user?.role);
    const userFiliere = user?.filiereId || user?.filiere || 'Informatique';
    const userNiveau = user?.niveau || 'L2';

    // Délégué ou enseignant ne peut publier QUE dans sa filière
    if (role !== ROLES.ADMIN && payload.filiereId && payload.filiereId.toLowerCase() !== userFiliere.toLowerCase()) {
      throw new Error(`Violation de périmètre : Vous ne pouvez pas publier de cours pour une autre filière (${payload.filiereId}).`);
    }

    const newMaterial = {
      id: 'mat-' + Date.now(),
      courseId: payload.courseId || 'course-inf201',
      codeUe: payload.codeUe || 'INF201',
      filiereId: role === ROLES.ADMIN ? (payload.filiereId || userFiliere) : userFiliere,
      niveau: role === ROLES.ADMIN ? (payload.niveau || userNiveau) : userNiveau,
      titre: payload.titre,
      type: payload.type || 'pdf',
      format: payload.format || 'PDF',
      size: payload.size || '1.8 Mo',
      pages: payload.pages || 25,
      enseignant: payload.enseignant || user?.nom || 'Délégué Promotion',
      url: payload.url || '#download-material',
      downloads: 0,
      description: payload.description,
      publishedAt: new Date().toISOString().split('T')[0],
      verified: role === ROLES.ADMIN || role === ROLES.MODERATOR,
    };

    const updated = [newMaterial, ...this.materials];
    this.saveMaterials(updated);
    return newMaterial;
  }
}

export const departmentScopeService = new DepartmentScopeService();
