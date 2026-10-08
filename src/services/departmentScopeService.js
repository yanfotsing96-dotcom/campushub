/**
 * Service de Cloisonnement par Filière & Moteur de Requêtes Relationnelles
 * Assure le partitionnement étanche des données (Tenant Isolation par Filière & Niveau)
 */

import { DEPARTMENTS, RELATION_COURSES } from '../constants/academicScopes';
import { ROLES, normalizeRole } from '../constants/rbacConstants';

const STORAGE_MATERIALS_KEY = 'campushub_scoped_materials';

// Initial course materials linked relationally to courses
const INITIAL_COURSE_MATERIALS = [
  // ==================== INFORMATIQUE ====================
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
    courseId: 'course-inf101',
    codeUe: 'INF101',
    filiereId: 'Informatique',
    niveau: 'L1',
    titre: 'Polycopié de Cours : Algorithmique Fondamentale & Programmation C ANSI',
    type: 'pdf',
    format: 'PDF',
    size: '2.4 Mo',
    pages: 42,
    enseignant: 'Dr. P. Kamgue',
    url: '#download-pdf-inf101',
    downloads: 380,
    description: 'Variables, types, structures conditionnelles, boucles et tableaux en langage C.',
    publishedAt: '2026-02-15',
    verified: true,
  },
  {
    id: 'mat-105',
    courseId: 'course-inf301',
    codeUe: 'INF301',
    filiereId: 'Informatique',
    niveau: 'L3',
    titre: 'Annales & Corrigés : Optimisation de Requêtes SQL & Index B-Tree',
    type: 'pdf',
    format: 'PDF',
    size: '3.1 Mo',
    pages: 38,
    enseignant: 'Dr. M. Tchoupé',
    url: '#download-pdf-inf301',
    downloads: 290,
    description: 'Plans d\'exécution EXPLAIN, jointures Hash/Merge, normalisation BCNF et transactions ACID.',
    publishedAt: '2026-03-02',
    verified: true,
  },
  {
    id: 'mat-106',
    courseId: 'course-inf401',
    codeUe: 'INF401',
    filiereId: 'Informatique',
    niveau: 'Master',
    titre: 'Polycopié de Recherche : Architectures Cloud & Algorithmes de Consensus Distribué',
    type: 'pdf',
    format: 'PDF',
    size: '4.5 Mo',
    pages: 58,
    enseignant: 'Pr. E. Monkam',
    url: '#download-pdf-inf401',
    downloads: 145,
    description: 'Algorithmes Raft et Paxos, sharding, réplication multi-régions et résilience aux pannes byzantines.',
    publishedAt: '2026-03-08',
    verified: true,
  },

  // ==================== PHYSIQUE ====================
  {
    id: 'mat-401',
    courseId: 'course-phy201',
    codeUe: 'PHY201',
    filiereId: 'Physique',
    niveau: 'L2',
    titre: 'Polycopié : Ondes Électromagnétiques & Cavités Résonnantes',
    type: 'pdf',
    format: 'PDF',
    size: '3.8 Mo',
    pages: 42,
    enseignant: 'Dr. E. Nana',
    url: '#download-pdf-phy',
    downloads: 140,
    description: 'Vecteur de Poynting, conditions aux limites et propagation dans les guides d\'ondes.',
    publishedAt: '2026-03-01',
    verified: true,
  },
  {
    id: 'mat-402',
    courseId: 'course-phy101',
    codeUe: 'PHY101',
    filiereId: 'Physique',
    niveau: 'L1',
    titre: 'Fiche d\'Exercices : Mécanique du Point & Dynamique Newtonienne',
    type: 'exercise',
    format: 'PDF',
    size: '1.9 Mo',
    pages: 24,
    enseignant: 'Dr. P. Tsafack',
    url: '#download-pdf-phy101',
    downloads: 210,
    description: 'Systèmes oscillants amortis, pendule pesant et frottement visqueux.',
    publishedAt: '2026-02-18',
    verified: true,
  },
  {
    id: 'mat-403',
    courseId: 'course-phy301',
    codeUe: 'PHY301',
    filiereId: 'Physique',
    niveau: 'L3',
    titre: 'Cours Magistral : Postulats de la Mécanique Quantique & Effet Tunnel',
    type: 'pdf',
    format: 'PDF',
    size: '3.5 Mo',
    pages: 46,
    enseignant: 'Pr. J. Mvogo',
    url: '#download-pdf-phy301',
    downloads: 165,
    description: 'Équation de Schrödinger indépendante du temps, puits de potentiel fini et oscillateur harmonique quantique.',
    publishedAt: '2026-03-11',
    verified: true,
  },
  {
    id: 'mat-404',
    courseId: 'course-phy401',
    codeUe: 'PHY401',
    filiereId: 'Physique',
    niveau: 'Master',
    titre: 'Monographie : Physique des Semi-conducteurs & Hétérostructures',
    type: 'pdf',
    format: 'PDF',
    size: '4.8 Mo',
    pages: 62,
    enseignant: 'Dr. G. Kenfack',
    url: '#download-pdf-phy401',
    downloads: 120,
    description: 'Zone de Brillouin, masse effective, transport de porteurs et diodes électroluminescentes.',
    publishedAt: '2026-02-28',
    verified: true,
  },

  // ==================== CHIMIE ====================
  {
    id: 'mat-501',
    courseId: 'course-chm101',
    codeUe: 'CHM101',
    filiereId: 'Chimie',
    niveau: 'L1',
    titre: 'Fiche Pratique : Titrages pH-métriques & Solutions Tampons',
    type: 'pdf',
    format: 'PDF',
    size: '2.1 Mo',
    pages: 20,
    enseignant: 'Dr. M. Biya',
    url: '#download-pdf-chm',
    downloads: 165,
    description: 'Protocoles de dosage acido-basique, calculs de pKa et courbes d\'équivalence.',
    publishedAt: '2026-03-04',
    verified: true,
  },
  {
    id: 'mat-502',
    courseId: 'course-chm201',
    codeUe: 'CHM201',
    filiereId: 'Chimie',
    niveau: 'L2',
    titre: 'Polycopié : Mécanismes Réactionnels en Chimie Organique (SN, E, Addition)',
    type: 'pdf',
    format: 'PDF',
    size: '3.6 Mo',
    pages: 52,
    enseignant: 'Pr. A. Nono',
    url: '#download-pdf-chm201',
    downloads: 195,
    description: 'Stéréochimie R/S, inversion de Walden, régiosélectivité de Markovnikov et synthèses aromatiques.',
    publishedAt: '2026-03-09',
    verified: true,
  },
  {
    id: 'mat-503',
    courseId: 'course-chm301',
    codeUe: 'CHM301',
    filiereId: 'Chimie',
    niveau: 'L3',
    titre: 'Guide d\'Analyse Spectroscopique RMN ¹H et ¹³C avec Tables de Déplacements',
    type: 'pdf',
    format: 'PDF',
    size: '4.2 Mo',
    pages: 44,
    enseignant: 'Dr. E. Mbassi',
    url: '#download-pdf-chm301',
    downloads: 140,
    description: 'Couplages spin-spin, constantes J, intégration et spectres IR corrélés.',
    publishedAt: '2026-03-12',
    verified: true,
  },
  {
    id: 'mat-504',
    courseId: 'course-chm401',
    codeUe: 'CHM401',
    filiereId: 'Chimie',
    niveau: 'Master',
    titre: 'Synthèse Asymétrique & Catalyse Énantiomérique Avancée',
    type: 'pdf',
    format: 'PDF',
    size: '4.6 Mo',
    pages: 56,
    enseignant: 'Pr. H. Boyom',
    url: '#download-pdf-chm401',
    downloads: 98,
    description: 'Auxiliaires chiraux d\'Evans, hydrogénation de Noyori et époxydation de Sharpless.',
    publishedAt: '2026-02-25',
    verified: true,
  },

  // ==================== BIOLOGIE ====================
  {
    id: 'mat-601',
    courseId: 'course-bio101',
    codeUe: 'BIO101',
    filiereId: 'Biologie',
    niveau: 'L1',
    titre: 'Atlas Illustré : Transcription, Traduction & Code Génétique',
    type: 'pdf',
    format: 'PDF',
    size: '6.4 Mo',
    pages: 56,
    enseignant: 'Dr. S. Kuate',
    url: '#download-pdf-bio',
    downloads: 195,
    description: 'Schémas en haute résolution sur les ribosomes, l\'ARN messager et la régulation de l\'opéron lactose.',
    publishedAt: '2026-03-08',
    verified: true,
  },
  {
    id: 'mat-602',
    courseId: 'course-bio201',
    codeUe: 'BIO201',
    filiereId: 'Biologie',
    niveau: 'L2',
    titre: 'Manuel de Microbiologie : Croissance Bactérienne & Tests Biochimiques',
    type: 'pdf',
    format: 'PDF',
    size: '3.7 Mo',
    pages: 48,
    enseignant: 'Pr. H. Mbiapo',
    url: '#download-pdf-bio201',
    downloads: 220,
    description: 'Galerie API 20E, catalase, oxydase, antibiogramme par diffusion sur gélose de Mueller-Hinton.',
    publishedAt: '2026-03-06',
    verified: true,
  },
  {
    id: 'mat-603',
    courseId: 'course-bio301',
    codeUe: 'BIO301',
    filiereId: 'Biologie',
    niveau: 'L3',
    titre: 'Immunologie Moléculaire : Structure des Immunoglobulines & Récepteurs TCR',
    type: 'pdf',
    format: 'PDF',
    size: '4.1 Mo',
    pages: 50,
    enseignant: 'Dr. C. Nguemo',
    url: '#download-pdf-bio301',
    downloads: 175,
    description: 'Recombinaison V(D)J, commutation isotypique, présentation par le CMH I et II.',
    publishedAt: '2026-03-14',
    verified: true,
  },
  {
    id: 'mat-604',
    courseId: 'course-bio401',
    codeUe: 'BIO401',
    filiereId: 'Biologie',
    niveau: 'Master',
    titre: 'Génie Génétique & Outils CRISPR-Cas9 en Biotechnologies',
    type: 'pdf',
    format: 'PDF',
    size: '5.2 Mo',
    pages: 64,
    enseignant: 'Pr. V. Nkouathio',
    url: '#download-pdf-bio401',
    downloads: 130,
    description: 'ARN guide, réparation par NHEJ/HDR, knock-out génique et clonage sans cicatrice.',
    publishedAt: '2026-03-01',
    verified: true,
  },

  // ==================== MATHÉMATIQUES ====================
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
  {
    id: 'mat-302',
    courseId: 'course-mat101',
    codeUe: 'MAT101',
    filiereId: 'Mathématiques',
    niveau: 'L1',
    titre: 'Recueil de TD : Algèbre Linéaire & Calcul Matriciel',
    type: 'exercise',
    format: 'PDF',
    size: '2.8 Mo',
    pages: 32,
    enseignant: 'Dr. G. Fotsing',
    url: '#download-pdf-mat101',
    downloads: 260,
    description: 'Espaces vectoriels de dimension finie, théorème du rang et pivot de Gauss.',
    publishedAt: '2026-02-14',
    verified: true,
  },
  {
    id: 'mat-303',
    courseId: 'course-mat301',
    codeUe: 'MAT301',
    filiereId: 'Mathématiques',
    niveau: 'L3',
    titre: 'Polycopié : Topologie des Espaces Métriques & Espaces de Hilbert',
    type: 'pdf',
    format: 'PDF',
    size: '4.3 Mo',
    pages: 55,
    enseignant: 'Pr. H. Nzengue',
    url: '#download-pdf-mat301',
    downloads: 180,
    description: 'Compacité, complétude, théorème du point fixe de Banach et projections orthogonales.',
    publishedAt: '2026-03-05',
    verified: true,
  },
  {
    id: 'mat-304',
    courseId: 'course-mat401',
    codeUe: 'MAT401',
    filiereId: 'Mathématiques',
    niveau: 'Master',
    titre: 'Théorie de l\'Intégration de Lebesgue & Espaces L^p',
    type: 'pdf',
    format: 'PDF',
    size: '5.0 Mo',
    pages: 60,
    enseignant: 'Pr. P. Njock',
    url: '#download-pdf-mat401',
    downloads: 110,
    description: 'Mesures de Radon, théorème de Radon-Nikodym, dualité L^p-L^q et convolution.',
    publishedAt: '2026-02-27',
    verified: true,
  },

  // Document for IA-Data
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
];

function normalizeMatchFiliere(f1, f2) {
  if (!f1 || !f2) return false;
  const n1 = String(f1).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
  const n2 = String(f2).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
  if (n1 === n2) return true;
  if ((n1.includes('info') || n1.includes('code')) && (n2.includes('info') || n2.includes('code'))) return true;
  if (n1.includes('phys') && n2.includes('phys')) return true;
  if (n1.includes('chim') && n2.includes('chim')) return true;
  if (n1.includes('bio') && n2.includes('bio')) return true;
  if (n1.includes('math') && n2.includes('math')) return true;
  return false;
}

function matchLevelHelper(l1, l2) {
  if (!l1 || !l2) return true;
  const s1 = String(l1).toUpperCase().trim();
  const s2 = String(l2).toUpperCase().trim();
  if (s1 === s2) return true;
  if ((s1 === 'MASTER' || s1 === 'M1' || s1 === 'M2') && (s2 === 'MASTER' || s2 === 'M1' || s2 === 'M2')) return true;
  if ((s1 === 'L1' || s1 === 'LICENCE 1') && (s2 === 'L1' || s2 === 'LICENCE 1')) return true;
  if ((s1 === 'L2' || s1 === 'LICENCE 2') && (s2 === 'L2' || s2 === 'LICENCE 2')) return true;
  if ((s1 === 'L3' || s1 === 'LICENCE 3') && (s2 === 'L3' || s2 === 'LICENCE 3')) return true;
  return false;
}

class DepartmentScopeService {
  constructor() {
    this.materials = this.loadMaterials();
  }

  loadMaterials() {
    try {
      const saved = localStorage.getItem(STORAGE_MATERIALS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const existingIds = new Set(parsed.map((m) => m.id));
          const missing = INITIAL_COURSE_MATERIALS.filter((m) => !existingIds.has(m.id));
          if (missing.length > 0) {
            const merged = [...parsed, ...missing];
            this.saveMaterials(merged);
            return merged;
          }
          return parsed;
        }
      }
    } catch {
      // Fallback
    }
    return [...INITIAL_COURSE_MATERIALS];
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
      const matchFiliere = !effectiveFiliere || normalizeMatchFiliere(c.filiereId, effectiveFiliere);
      const matchNiveau = !effectiveNiveau || matchLevelHelper(c.niveau, effectiveNiveau);
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
        if (!normalizeMatchFiliere(m.filiereId, userFiliere)) return false;
        if (!matchLevelHelper(m.niveau, userNiveau)) return false;
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
