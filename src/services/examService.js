/**
 * Moteur Sécurisé de Compositions en Ligne & Examens Chronométrés
 * Cloisonnement strict par Filière & Matricule avec Autosave, Détection Anti-Fraude et Gestion Admin/Modérateur
 */

import { ROLES, normalizeRole } from '../constants/rbacConstants';

const STORAGE_EXAMS_KEY = 'campushub_exams_catalog';
const STORAGE_SUBMISSIONS_KEY = 'campushub_exam_submissions';
const STORAGE_DRAFT_KEY = 'campushub_exam_draft_';

export const INITIAL_EXAMS = [
  {
    id: 'exam-inf201-cc1',
    codeUe: 'INF201',
    filiereId: 'Informatique',
    niveau: 'L2',
    titre: 'Contrôle Continu Officiel : Algorithmique C & Arbres Binaires (ABR)',
    description: 'Évaluation semestrielle certifiée par le Département d\'Informatique. Épreuve sur les pointeurs, récursivité, arbres binaires de recherche et complexités.',
    durationMinutes: 20,
    totalPoints: 20,
    passPercentage: 50,
    academicYear: '2025-2026',
    professor: 'Dr. T. Mbarga',
    university: 'Université de Yaoundé I (UY1)',
    status: 'actif', // 'brouillon' | 'actif' | 'termine'
    dateDebut: '2026-03-25T08:00',
    dateFin: '2026-04-30T18:00',
    instructions: [
      'Chaque question possède une ou plusieurs réponses précises.',
      'Le compte à rebours est synchronisé en temps réel : toute sortie de fenêtre est comptabilisée dans l\'indice d\'intégrité.',
      'Vos réponses sont automatiquement sauvegardées toutes les 10 secondes.',
      'À 00:00, la composition est validée et corrigée instantanément.',
    ],
    questions: [
      {
        id: 'q1',
        text: 'Dans un Arbre Binaire de Recherche (ABR) non vide, où se trouve nécessairement le nœud possédant la valeur maximale ?',
        type: 'single',
        points: 4,
        options: [
          { id: 'opt_a', label: 'À la racine de l\'arbre' },
          { id: 'opt_b', label: 'Au nœud le plus à droite de l\'arbre (sans sous-arbre droit)' },
          { id: 'opt_c', label: 'Au nœud le plus à gauche de l\'arbre' },
          { id: 'opt_d', label: 'Au premier nœud de la première feuille' },
        ],
        correctOptionId: 'opt_b',
        explanation: 'Dans un ABR, tous les éléments du sous-arbre droit sont strictement supérieurs à la racine. Ainsi, le maximum se trouve en parcourant exclusivement la branche droite jusqu\'au dernier nœud.',
      },
      {
        id: 'q2',
        text: 'Quelle est la complexité temporelle asymptotique au pire des cas d\'une recherche dans un ABR déséquilibré (dégénéré en peigne) ?',
        type: 'single',
        points: 4,
        options: [
          { id: 'opt_a', label: 'O(1)' },
          { id: 'opt_b', label: 'O(log n)' },
          { id: 'opt_c', label: 'O(n)' },
          { id: 'opt_d', label: 'O(n log n)' },
        ],
        correctOptionId: 'opt_c',
        explanation: 'Si les insertions sont effectuées dans l\'ordre croissant ou décroissant, l\'arbre dégénère en peigne linéaire de hauteur n, conférant une complexité en O(n).',
      },
      {
        id: 'q3',
        text: 'Considérons en C le code suivant : `int *p = (int*) malloc(sizeof(int) * 10);`. Quelle instruction libère correctement et sans fuite mémoire cette allocation ?',
        type: 'single',
        points: 4,
        options: [
          { id: 'opt_a', label: 'delete(p);' },
          { id: 'opt_b', label: 'free(p); p = NULL;' },
          { id: 'opt_c', label: 'p = NULL;' },
          { id: 'opt_d', label: 'release(p, 10);' },
        ],
        correctOptionId: 'opt_b',
        explanation: 'En langage C ANSI, toute zone allouée via `malloc` doit être restituée au tas avec `free(p)`. Affecter `p = NULL` protège contre les pointeurs sauvages (dangling pointers).',
      },
      {
        id: 'q4',
        text: 'Quel parcours d\'arbre binaire de recherche restitue l\'ensemble des clés dans l\'ordre croissant ?',
        type: 'single',
        points: 4,
        options: [
          { id: 'opt_a', label: 'Parcours Préfixe (Racine, Gauche, Droite)' },
          { id: 'opt_b', label: 'Parcours Infixe (Gauche, Racine, Droite)' },
          { id: 'opt_c', label: 'Parcours Postfixe (Gauche, Droite, Racine)' },
          { id: 'opt_d', label: 'Parcours en Largeur (BFS)' },
        ],
        correctOptionId: 'opt_b',
        explanation: 'Le parcours Infixe (In-order traversal) visite le sous-arbre gauche (clés < racine), puis la racine, puis le sous-arbre droit (clés > racine), produisant une séquence triée.',
      },
      {
        id: 'q5',
        text: 'Expliquez brièvement en quelques lignes le principe de rééquilibrage par rotation (gauche ou droite) dans un arbre AVL.',
        type: 'development',
        points: 4,
        explanation: 'La rotation gauche ou droite réorganise les nœuds autour du pivot sans modifier la relation d\'ordre BST, afin de ramener le facteur d\'équilibrage dans l\'intervalle {-1, 0, +1} en temps O(1).',
      },
    ],
  },
  {
    id: 'exam-inf203-partiel',
    codeUe: 'INF203',
    filiereId: 'Informatique',
    niveau: 'L2',
    titre: 'Épreuve Système & POSIX : Processus, Fork & Sémaphores',
    description: 'Partiel sur la gestion des processus sous UNIX, appel système fork(), waitpid(), création de threads pthread et exclusion mutuelle.',
    durationMinutes: 15,
    totalPoints: 20,
    passPercentage: 50,
    academicYear: '2025-2026',
    professor: 'Pr. F. Nkenlifack',
    university: 'Université de Yaoundé I (UY1)',
    status: 'actif',
    dateDebut: '2026-03-25T08:00',
    dateFin: '2026-04-30T18:00',
    instructions: [
      'Questions techniques sur les mécanismes d\'exploitation POSIX.',
      'Chronomètre actif avec sauvegarde synchrone.',
    ],
    questions: [
      {
        id: 'q1',
        text: 'Quel est l\'effet de l\'appel système `fork()` sous UNIX ?',
        type: 'single',
        points: 5,
        options: [
          { id: 'opt_a', label: 'Il exécute immédiatement un nouveau binaire' },
          { id: 'opt_b', label: 'Il crée un clone exact du processus appelant avec son propre espace mémoire et un PID unique' },
          { id: 'opt_c', label: 'Il termine le processus parent' },
          { id: 'opt_d', label: 'Il alloue un fil d\'exécution (thread) léger' },
        ],
        correctOptionId: 'opt_b',
        explanation: '`fork()` duplique le processus parent. Il retourne 0 au processus fils, et le PID du fils au processus parent.',
      },
      {
        id: 'q2',
        text: 'Pour éviter qu\'un processus fils terminé ne devienne un « Processus Zombie », que doit faire le processus parent ?',
        type: 'single',
        points: 5,
        options: [
          { id: 'opt_a', label: 'Appeler exit(0)' },
          { id: 'opt_b', label: 'Appeler wait() ou waitpid() pour collecter son code de retour' },
          { id: 'opt_c', label: 'Envoyer le signal SIGKILL' },
          { id: 'opt_d', label: 'Redémarrer le système de fichiers' },
        ],
        correctOptionId: 'opt_b',
        explanation: 'Un processus zombie est un processus terminé dont l\'entrée subsiste dans la table des processus car le parent n\'a pas encore lu son statut avec wait().',
      },
      {
        id: 'q3',
        text: 'Dans un sémaphore de Dijkstra initialisé à 1 (Mutex binaire), que fait l\'opération P(s) (ou sem_wait) ?',
        type: 'single',
        points: 5,
        options: [
          { id: 'opt_a', label: 'Incrémente la valeur de s de 1' },
          { id: 'opt_b', label: 'Décrémente s de 1 ; si s < 0, le processus appelant est bloqué' },
          { id: 'opt_c', label: 'Détruit le sémaphore' },
          { id: 'opt_d', label: 'Réveille tous les processus endormis' },
        ],
        correctOptionId: 'opt_b',
        explanation: 'L\'opération P() décrémente le compteur. Si la ressource est occupée, le processus est mis en attente.',
      },
      {
        id: 'q4',
        text: 'Donnez un exemple concret d\'interblocage (Deadlock) entre deux processus P1 et P2 manipulant deux ressources R1 et R2.',
        type: 'development',
        points: 5,
        explanation: 'Attente circulaire : P1 détient R1 et demande R2 ; simultanément, P2 détient R2 et demande R1. Aucun ne peut progresser.',
      },
    ],
  },
  {
    id: 'exam-mat201-cc',
    codeUe: 'MAT201',
    filiereId: 'Mathématiques',
    niveau: 'L2',
    titre: 'Contrôle Continu : Séries Numériques & Règle de D\'Alembert',
    description: 'Épreuve d\'analyse mathématique réservée aux étudiants inscrits en Mathématiques L2.',
    durationMinutes: 15,
    totalPoints: 20,
    passPercentage: 50,
    academicYear: '2025-2026',
    professor: 'Pr. J. Nguemo',
    university: 'Université de Yaoundé I (UY1)',
    status: 'actif',
    dateDebut: '2026-03-25T08:00',
    dateFin: '2026-04-30T18:00',
    instructions: ['Calcul de limites de ratios Un+1 / Un et convergence absolue.'],
    questions: [
      {
        id: 'q1',
        text: 'Si lim (Un+1 / Un) = L avec L < 1 pour une série à termes strictement positifs, que conclut la règle de D\'Alembert ?',
        type: 'single',
        points: 10,
        options: [
          { id: 'opt_a', label: 'La série diverge grossièrement' },
          { id: 'opt_b', label: 'La série converge absolument' },
          { id: 'opt_c', label: 'Le test ne permet pas de conclure' },
          { id: 'opt_d', label: 'La somme vaut exactement 1' },
        ],
        correctOptionId: 'opt_b',
        explanation: 'Par comparaison avec une suite géométrique de raison L < 1, la série converge.',
      },
      {
        id: 'q2',
        text: 'Quel est le rayon de convergence R de la série entière sum(x^n / n!) ?',
        type: 'single',
        points: 10,
        options: [
          { id: 'opt_a', label: 'R = 0' },
          { id: 'opt_b', label: 'R = 1' },
          { id: 'opt_c', label: 'R = +infini' },
          { id: 'opt_d', label: 'R = e' },
        ],
        correctOptionId: 'opt_c',
        explanation: 'La série converge pour tout x réel et définit la fonction exponentielle e^x.',
      },
    ],
  },
  {
    id: 'exam-phy201-cc',
    codeUe: 'PHY201',
    filiereId: 'Physique',
    niveau: 'L2',
    titre: 'Électromagnétisme & Équations de Maxwell dans le Vide',
    description: 'Contrôle continu de physique fondamentale : flux électrique, induction et ondes.',
    durationMinutes: 20,
    totalPoints: 20,
    passPercentage: 50,
    academicYear: '2025-2026',
    professor: 'Dr. C. Fotso',
    university: 'Université de Yaoundé I (UY1)',
    status: 'actif',
    dateDebut: '2026-03-25T08:00',
    dateFin: '2026-04-30T18:00',
    instructions: ['Répondre aux questions théoriques et applications directes.'],
    questions: [
      {
        id: 'q1',
        text: 'Quelle équation de Maxwell traduit la conservation du flux magnétique (absence de monopôles magnétiques) ?',
        type: 'single',
        points: 10,
        options: [
          { id: 'opt_a', label: 'div B = 0' },
          { id: 'opt_b', label: 'div E = rho / epsilon_0' },
          { id: 'opt_c', label: 'rot E = -dB/dt' },
          { id: 'opt_d', label: 'rot B = mu_0 * j' },
        ],
        correctOptionId: 'opt_a',
        explanation: 'div B = 0 signifie que les lignes de champ magnétique sont fermées sur elles-mêmes.',
      },
      {
        id: 'q2',
        text: 'Définissez brièvement le rôle du courant de déplacement de Maxwell dans l\'équation d\'Ampère-Maxwell.',
        type: 'development',
        points: 10,
        explanation: 'Le terme epsilon_0 * dE/dt compense la discontinuité du courant de conduction (ex: dans un condensateur) et restaure la conservation de la charge.',
      },
    ],
  },
  {
    id: 'exam-chm101-cc',
    codeUe: 'CHM101',
    filiereId: 'Chimie',
    niveau: 'L1',
    titre: 'Chimie Générale & Équilibres Acido-Basiques en Solution Aqueuse',
    description: 'Partiel semestriel de chimie générale : pH, titrages et constantes de dissociation Ka.',
    durationMinutes: 20,
    totalPoints: 20,
    passPercentage: 50,
    academicYear: '2025-2026',
    professor: 'Dr. M. Biya',
    university: 'Université de Yaoundé I (UY1)',
    status: 'actif',
    dateDebut: '2026-03-25T08:00',
    dateFin: '2026-04-30T18:00',
    instructions: ['Calculatrice scientifique autorisée.'],
    questions: [
      {
        id: 'q1',
        text: 'Quel est le pH d\'une solution aqueuse d\'acide chlorhydrique (HCl) à la concentration de 10^-3 mol/L ?',
        type: 'single',
        points: 10,
        options: [
          { id: 'opt_a', label: 'pH = 1' },
          { id: 'opt_b', label: 'pH = 3' },
          { id: 'opt_c', label: 'pH = 7' },
          { id: 'opt_d', label: 'pH = 11' },
        ],
        correctOptionId: 'opt_b',
        explanation: 'HCl est un acide fort totalement dissocié : pH = -log[H3O+] = -log(10^-3) = 3.',
      },
      {
        id: 'q2',
        text: 'Qu\'appelle-t-on une solution tampon et quelle est sa propriété remarquable ?',
        type: 'development',
        points: 10,
        explanation: 'Une solution tampon est un mélange d\'acide faible et de sa base conjuguée dont le pH varie très peu lors d\'une addition modérée d\'acide ou de base ou par dilution.',
      },
    ],
  },
  {
    id: 'exam-bio101-cc',
    codeUe: 'BIO101',
    filiereId: 'Biologie',
    niveau: 'L1',
    titre: 'Contrôle Continu : Biologie Moléculaire & Synthèse Protéique',
    description: 'Épreuve semestrielle de biologie cellulaire et moléculaire : réplication, transcription et code génétique.',
    durationMinutes: 20,
    totalPoints: 20,
    passPercentage: 50,
    academicYear: '2025-2026',
    professor: 'Dr. S. Kuate',
    university: 'Université de Yaoundé I (UY1)',
    status: 'actif',
    dateDebut: '2026-03-25T08:00',
    dateFin: '2026-04-30T18:00',
    instructions: [
      'Chronomètre synchronisé en temps réel avec autosave.',
      'Validation obligatoire à 00:00 avec enregistrement sécurisé sous votre matricule.',
    ],
    questions: [
      {
        id: 'q1',
        text: 'Quelle enzyme assure l\'ouverture de la double hélice d\'ADN lors de la réplication ?',
        type: 'single',
        points: 10,
        options: [
          { id: 'opt_a', label: 'L\'ADN Ligase' },
          { id: 'opt_b', label: 'L\'Hélicase' },
          { id: 'opt_c', label: 'La Topoisomérase uniquement' },
          { id: 'opt_d', label: 'L\'ARN Polymérase I' },
        ],
        correctOptionId: 'opt_b',
        explanation: 'L\'hélicase rompt les liaisons hydrogène reliant les bases azotées complémentaires pour séparer les deux brins parentaux.',
      },
      {
        id: 'q2',
        text: 'Expliquez brièvement le principe de la dégénérescence (ou redondance) du code génétique.',
        type: 'development',
        points: 10,
        explanation: 'Plusieurs codons différents (triplets de nucléotides) peuvent spécifier un même acide aminé (61 codons pour 20 acides aminés standards).',
      },
    ],
  },
];

class ExamService {
  constructor() {
    this.exams = this.loadExams();
    this.submissions = this.loadSubmissions();
  }

  loadExams() {
    try {
      const saved = localStorage.getItem(STORAGE_EXAMS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const existingIds = new Set(parsed.map((e) => e.id));
          const missing = INITIAL_EXAMS.filter((e) => !existingIds.has(e.id));
          if (missing.length > 0) {
            const merged = [...parsed, ...missing];
            this.saveExams(merged);
            return merged;
          }
          return parsed;
        }
      }
    } catch {
      // Fallback
    }
    // Initialize default exams
    try {
      localStorage.setItem(STORAGE_EXAMS_KEY, JSON.stringify(INITIAL_EXAMS));
    } catch (err) {
      console.warn('Erreur init examens :', err);
    }
    return [...INITIAL_EXAMS];
  }

  saveExams(exams) {
    this.exams = exams;
    try {
      localStorage.setItem(STORAGE_EXAMS_KEY, JSON.stringify(exams));
      window.dispatchEvent(new CustomEvent('campushub:exams_updated'));
    } catch (err) {
      console.warn('Erreur sauvegarde examens :', err);
    }
  }

  loadSubmissions() {
    try {
      const saved = localStorage.getItem(STORAGE_SUBMISSIONS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  saveSubmissions(data) {
    this.submissions = data;
    try {
      localStorage.setItem(STORAGE_SUBMISSIONS_KEY, JSON.stringify(data));
      window.dispatchEvent(new CustomEvent('campushub:exams_updated'));
    } catch (err) {
      console.warn('Erreur stockage copies d\'examens :', err);
    }
  }

  /**
   * Retourne l'ensemble de la base d'examens (pour console admin / modérateur)
   */
  getAllExams() {
    return [...this.exams];
  }

  /**
   * Récupère la liste des compositions disponibles strictement cloisonnées selon l'étudiant
   * - Étudiant / Délégué : UNIQUEMENT statut 'actif', et même filière + même niveau
   * - Admin / Modérateur : voit tout (ou peut filtrer)
   */
  getAvailableExams(user) {
    if (!user) return [];
    const role = normalizeRole(user.role);
    const userFiliere = (user.filiereId || user.filiere || 'Informatique').toLowerCase();
    const userNiveau = user.niveau || 'L2';

    return this.exams.filter((exam) => {
      // Admin ou Modérateur : accès complet
      if (role === ROLES.ADMIN || role === ROLES.MODERATOR) {
        return true;
      }

      // Pour l'étudiant : doit être ACTIF, même filière, même niveau
      const isActive = exam.status === 'actif' || exam.status === 'active';
      const matchFiliere = (exam.filiereId || '').toLowerCase() === userFiliere;
      const matchNiveau = exam.niveau === userNiveau;

      return isActive && matchFiliere && matchNiveau;
    });
  }

  /**
   * Calcule le nombre exact d'épreuves actives pour le badge de notification
   */
  getActiveExamsCountForUser(user) {
    if (!user) return 0;
    const role = normalizeRole(user.role);
    if (role === ROLES.ADMIN || role === ROLES.MODERATOR) {
      return this.exams.filter((e) => e.status === 'actif' || e.status === 'active').length;
    }
    const userFiliere = (user.filiereId || user.filiere || 'Informatique').toLowerCase();
    const userNiveau = user.niveau || 'L2';
    return this.exams.filter(
      (e) =>
        (e.status === 'actif' || e.status === 'active') &&
        (e.filiereId || '').toLowerCase() === userFiliere &&
        e.niveau === userNiveau
    ).length;
  }

  /**
   * Récupère un examen précis avec vérification stricte de périmètre
   */
  getExamById(examId, user) {
    const exam = this.exams.find((e) => String(e.id) === String(examId));
    if (!exam) return null;

    if (user) {
      const role = normalizeRole(user.role);
      const userFiliere = (user.filiereId || user.filiere || 'Informatique').toLowerCase();
      const userNiveau = user.niveau || 'L2';

      if (role !== ROLES.ADMIN && role !== ROLES.MODERATOR) {
        if ((exam.filiereId || '').toLowerCase() !== userFiliere) {
          throw new Error(
            `Violation de cloisonnement : Cet examen est réservé aux étudiants de la filière ${exam.filiereId}. Votre profil est assigné à ${user.filiere}.`
          );
        }
        if (exam.niveau !== userNiveau) {
          throw new Error(
            `Violation de niveau : Cet examen est réservé au niveau ${exam.niveau}. Votre niveau actuel est ${userNiveau}.`
          );
        }
        if (exam.status !== 'actif' && exam.status !== 'active') {
          throw new Error(
            `Composition indisponible : Cet examen est actuellement au statut "${exam.status || 'brouillon'}".`
          );
        }
      }
    }

    return exam;
  }

  /**
   * Création sécurisée d'une nouvelle épreuve (Admin / Modérateur)
   */
  createExam(payload, authorUser) {
    const questions = Array.isArray(payload.questions) ? payload.questions : [];
    const totalPoints = questions.reduce((acc, q) => acc + (Number(q.points) || 1), 0);

    const newExam = {
      id: 'exam-' + Date.now(),
      codeUe: (payload.codeUe || `${payload.filiereId?.slice(0, 3)?.toUpperCase() || 'UE'}${payload.niveau || '1'}`).trim().toUpperCase(),
      filiereId: payload.filiereId || 'Informatique',
      niveau: payload.niveau || 'L1',
      titre: payload.titre.trim(),
      description: payload.description?.trim() || 'Épreuve en ligne officielle.',
      durationMinutes: Math.max(5, Number(payload.durationMinutes) || 20),
      totalPoints: totalPoints || 20,
      passPercentage: Number(payload.passPercentage) || 50,
      academicYear: payload.academicYear || '2025-2026',
      professor: payload.professor?.trim() || authorUser?.fullName || authorUser?.nom || 'Département Scientifique',
      university: authorUser?.universityName || 'Université de Yaoundé I (UY1)',
      status: payload.status || 'actif', // 'brouillon' | 'actif' | 'termine'
      dateDebut: payload.dateDebut || new Date().toISOString().slice(0, 16),
      dateFin: payload.dateFin || new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString().slice(0, 16),
      instructions: payload.instructions && payload.instructions.length > 0 ? payload.instructions : [
        'Chaque question possède une ou plusieurs réponses précises.',
        'Compte à rebours synchrone : toute sortie de fenêtre est comptabilisée dans l\'indice d\'intégrité.',
        'Vos réponses sont automatiquement sauvegardées en continu.',
        'Soumission définitive obligatoire avec signature par matricule.',
      ],
      questions: questions.length > 0 ? questions : [
        {
          id: 'q1',
          text: 'Question fondamentale du cours :',
          type: 'single',
          points: 5,
          options: [
            { id: 'opt_a', label: 'Option A (Correcte)' },
            { id: 'opt_b', label: 'Option B' },
            { id: 'opt_c', label: 'Option C' },
          ],
          correctOptionId: 'opt_a',
          explanation: 'Explication pédagogique.',
        },
      ],
      createdAt: new Date().toISOString(),
      authorMatricule: authorUser?.matricule || null,
      authorName: authorUser?.fullName || authorUser?.nom || 'Admin',
    };

    const updated = [newExam, ...this.exams];
    this.saveExams(updated);
    return newExam;
  }

  /**
   * Mise à jour d'un examen existant
   */
  updateExam(examId, updates) {
    let updatedExam = null;
    const updatedList = this.exams.map((e) => {
      if (String(e.id) === String(examId)) {
        const questions = updates.questions || e.questions;
        const totalPoints = questions.reduce((acc, q) => acc + (Number(q.points) || 1), 0);
        updatedExam = {
          ...e,
          ...updates,
          totalPoints,
          updatedAt: new Date().toISOString(),
        };
        return updatedExam;
      }
      return e;
    });

    this.saveExams(updatedList);
    return updatedExam;
  }

  /**
   * Bascule rapide du statut de gestion d'une épreuve ('brouillon' | 'actif' | 'termine')
   */
  toggleExamStatus(examId, targetStatus) {
    let updatedExam = null;
    const updatedList = this.exams.map((e) => {
      if (String(e.id) === String(examId)) {
        updatedExam = {
          ...e,
          status: targetStatus,
          updatedAt: new Date().toISOString(),
        };
        return updatedExam;
      }
      return e;
    });

    this.saveExams(updatedList);
    return updatedExam;
  }

  /**
   * Suppression d'un examen
   */
  deleteExam(examId) {
    const filtered = this.exams.filter((e) => String(e.id) !== String(examId));
    this.saveExams(filtered);
    return true;
  }

  /**
   * Sauvegarde temporaire du brouillon de réponses d'un étudiant (Autosave temps réel)
   */
  saveDraftAnswers(examId, studentMatricule, answers, remainingSeconds) {
    const key = `${STORAGE_DRAFT_KEY}${examId}_${studentMatricule}`;
    const draft = {
      examId,
      studentMatricule,
      answers,
      remainingSeconds,
      savedAt: new Date().toISOString(),
    };
    try {
      localStorage.setItem(key, JSON.stringify(draft));
    } catch (e) {
      console.warn('Autosave échec :', e);
    }
  }

  loadDraftAnswers(examId, studentMatricule) {
    const key = `${STORAGE_DRAFT_KEY}${examId}_${studentMatricule}`;
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  }

  clearDraft(examId, studentMatricule) {
    const key = `${STORAGE_DRAFT_KEY}${examId}_${studentMatricule}`;
    try {
      localStorage.removeItem(key);
    } catch (err) {
      console.warn('Erreur clear draft :', err);
    }
  }

  /**
   * Soumission finale et correction automatique sécurisée de l'examen
   */
  submitExam(examId, user, answers, { focusLossCount = 0, timeTakenSeconds = 0, submissionReason = 'normal' } = {}) {
    const exam = this.getExamById(examId, user);
    if (!exam) throw new Error('Examen introuvable');

    let totalEarned = 0;
    const questionsBreakdown = exam.questions.map((q) => {
      const studentAnswer = answers[q.id];

      // Question de type QCM / Single choice
      if (q.type === 'single' || q.type === 'qcm' || !q.type) {
        const isCorrect = studentAnswer === q.correctOptionId;
        const pointsEarned = isCorrect ? q.points : 0;
        totalEarned += pointsEarned;

        return {
          questionId: q.id,
          questionText: q.text,
          type: 'single',
          studentAnswerId: studentAnswer || null,
          correctOptionId: q.correctOptionId,
          isCorrect,
          pointsPossible: q.points,
          pointsEarned,
          explanation: q.explanation,
        };
      }

      // Question à développement / libre : Auto-notation bienveillante si renseigné + trace pour relecture
      const textAnswer = String(studentAnswer || '').trim();
      const hasAnswered = textAnswer.length > 10;
      // Attribution proportionnelle si l'étudiant a développé
      const pointsEarned = hasAnswered ? q.points : 0;
      totalEarned += pointsEarned;

      return {
        questionId: q.id,
        questionText: q.text,
        type: 'development',
        studentTextAnswer: textAnswer || 'Aucune réponse fournie',
        isCorrect: hasAnswered,
        isDevelopment: true,
        pointsPossible: q.points,
        pointsEarned,
        explanation: q.explanation || 'Évaluation textuelle académique enregistrée.',
      };
    });

    const percentage = Math.round((totalEarned / exam.totalPoints) * 100);
    const passed = percentage >= exam.passPercentage;

    // Calcul de l'indice d'intégrité anti-fraude (100% - pénalités)
    const integrityPenalty = Math.min(60, focusLossCount * 15);
    const integrityScore = Math.max(40, 100 - integrityPenalty);

    const submissionRecord = {
      submissionId: 'sub_' + Date.now(),
      examId: exam.id,
      codeUe: exam.codeUe,
      examTitle: exam.titre,
      filiereId: exam.filiereId,
      niveau: exam.niveau,
      studentMatricule: user.matricule || 'N/A',
      studentNom: user.fullName || user.nom || 'Étudiant',
      studentEmail: user.email,
      score: totalEarned,
      totalPoints: exam.totalPoints,
      percentage,
      passed,
      timeTakenSeconds,
      focusLossCount,
      integrityScore,
      submissionReason,
      submittedAt: new Date().toISOString(),
      breakdown: questionsBreakdown,
    };

    const updated = [submissionRecord, ...this.submissions];
    this.saveSubmissions(updated);
    this.clearDraft(examId, user.matricule);

    return submissionRecord;
  }

  getStudentSubmissions(studentMatricule) {
    if (!studentMatricule) return [];
    return this.submissions.filter((s) => s.studentMatricule === studentMatricule);
  }

  getSubmissionsForExam(examId) {
    return this.submissions.filter((s) => String(s.examId) === String(examId));
  }
}

export const examService = new ExamService();
