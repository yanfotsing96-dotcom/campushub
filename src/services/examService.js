/**
 * Moteur Sécurisé de Compositions en Ligne & Examens Chronométrés
 * Cloisonnement strict par Filière & Matricule avec Autosave et Détection Anti-Fraude
 */

import { ROLES, normalizeRole } from '../constants/rbacConstants';

const STORAGE_SUBMISSIONS_KEY = 'campushub_exam_submissions';
const STORAGE_DRAFT_KEY = 'campushub_exam_draft_';

export const EXAMS_CATALOG = [
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
    status: 'active', // 'active' | 'upcoming' | 'closed'
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
        text: 'Quelle est la complexité temporelle asymptotique au pire des cas d\'une recherche dans un ABR déséquilibré (dégénéré en liste chaînée) ?',
        type: 'single',
        points: 4,
        options: [
          { id: 'opt_a', label: 'O(1)' },
          { id: 'opt_b', label: 'O(log n)' },
          { id: 'opt_c', label: 'O(n)' },
          { id: 'opt_d', label: 'O(n log n)' },
        ],
        correctOptionId: 'opt_c',
        explanation: 'Si les insertions sont effectuées dans l\'ordre croissant ou décroissant, l\'arbre dégénère en peigne linéaire de hauteur n, ce qui confère à la recherche une complexité au pire des cas en O(n).',
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
        text: 'Quelle propriété définit la hauteur maximale d\'un arbre binaire équilibré AVL à n nœuds ?',
        type: 'single',
        points: 4,
        options: [
          { id: 'opt_a', label: 'La différence de hauteur entre sous-arbre gauche et droit n\'excède jamais 1' },
          { id: 'opt_b', label: 'Tous les niveaux sauf le dernier doivent être complètement remplis' },
          { id: 'opt_c', label: 'Chaque nœud a exactement deux enfants' },
          { id: 'opt_d', label: 'La racine est égale à la médiane des clés' },
        ],
        correctOptionId: 'opt_a',
        explanation: 'Un arbre AVL garantit que pour tout nœud, le facteur d\'équilibrage (hauteur gauche - hauteur droite) appartient à {-1, 0, +1}, garantissant une hauteur bornée par 1.44 log2(n).',
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
    status: 'active',
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
        explanation: 'L\'opération P() (Proberen / Tester) décrémente le compteur. Si la ressource est occupée, le processus est placé dans la file d\'attente.',
      },
      {
        id: 'q4',
        text: 'Laquelle des conditions suivantes N\'EST PAS l\'une des 4 conditions de Coffman pour qu\'un interblocage (Deadlock) survienne ?',
        type: 'single',
        points: 5,
        options: [
          { id: 'opt_a', label: 'Exclusion mutuelle' },
          { id: 'opt_b', label: 'Rétention et attente (Hold and wait)' },
          { id: 'opt_c', label: 'Préemption forcée des ressources' },
          { id: 'opt_d', label: 'Attente circulaire' },
        ],
        correctOptionId: 'opt_c',
        explanation: 'La condition de Coffman est la "Non-préemption" : une ressource ne peut être retirée de force au processus qui la détient.',
      },
    ],
  },
  // Exam partitioned for Mathématiques
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
    status: 'active',
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
];

class ExamService {
  constructor() {
    this.submissions = this.loadSubmissions();
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
    } catch (err) {
      console.warn('Erreur stockage copies d\'examens :', err);
    }
  }

  /**
   * Récupère la liste des compositions disponibles strictement cloisonnées selon l'étudiant
   */
  getAvailableExams(user) {
    if (!user) return [];
    const role = normalizeRole(user.role);
    const userFiliere = user.filiereId || user.filiere || 'Informatique';
    const userNiveau = user.niveau || 'L2';

    return EXAMS_CATALOG.filter((exam) => {
      // Admin voit tous les examens
      if (role === ROLES.ADMIN) return true;

      // Cloisonnement strict : même filière et même niveau
      const matchFiliere = exam.filiereId.toLowerCase() === userFiliere.toLowerCase();
      const matchNiveau = exam.niveau === userNiveau;
      return matchFiliere && matchNiveau;
    });
  }

  /**
   * Récupère un examen précis avec vérification stricte de périmètre
   */
  getExamById(examId, user) {
    const exam = EXAMS_CATALOG.find((e) => e.id === examId);
    if (!exam) return null;

    if (user) {
      const role = normalizeRole(user.role);
      const userFiliere = user.filiereId || user.filiere || 'Informatique';
      const userNiveau = user.niveau || 'L2';

      if (role !== ROLES.ADMIN) {
        if (exam.filiereId.toLowerCase() !== userFiliere.toLowerCase()) {
          throw new Error(
            `Violation de cloisonnement : Cet examen est réservé aux étudiants de la filière ${exam.filiereId}. Votre profil est assigné à ${userFiliere}.`
          );
        }
        if (exam.niveau !== userNiveau) {
          throw new Error(
            `Violation de niveau : Cet examen est réservé au niveau ${exam.niveau}. Votre niveau actuel est ${userNiveau}.`
          );
        }
      }
    }

    return exam;
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

  /**
   * Charge le brouillon sauvegardé en cas de rafraîchissement
   */
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
  submitExam(examId, user, answers, { focusLossCount = 0, timeTakenSeconds = 0 } = {}) {
    const exam = this.getExamById(examId, user);
    if (!exam) throw new Error('Examen introuvable');

    let totalEarned = 0;
    const questionsBreakdown = exam.questions.map((q) => {
      const studentAnswer = answers[q.id];
      const isCorrect = studentAnswer === q.correctOptionId;
      const pointsEarned = isCorrect ? q.points : 0;
      totalEarned += pointsEarned;

      return {
        questionId: q.id,
        questionText: q.text,
        studentAnswerId: studentAnswer || null,
        correctOptionId: q.correctOptionId,
        isCorrect,
        pointsPossible: q.points,
        pointsEarned,
        explanation: q.explanation,
      };
    });

    const percentage = Math.round((totalEarned / exam.totalPoints) * 100);
    const passed = percentage >= exam.passPercentage;

    // Calcul de l'indice d'intégrité anti-fraude (100% - pénalités de changement de fenêtre)
    const integrityPenalty = Math.min(60, focusLossCount * 15);
    const integrityScore = Math.max(40, 100 - integrityPenalty);

    const submissionRecord = {
      submissionId: 'sub_' + Date.now(),
      examId: exam.id,
      codeUe: exam.codeUe,
      examTitle: exam.titre,
      filiereId: exam.filiereId,
      niveau: exam.niveau,
      studentMatricule: user.matricule || '23S40192',
      studentNom: user.nom || 'Étudiant UY1',
      studentEmail: user.email,
      score: totalEarned,
      totalPoints: exam.totalPoints,
      percentage,
      passed,
      timeTakenSeconds,
      focusLossCount,
      integrityScore,
      submittedAt: new Date().toISOString(),
      breakdown: questionsBreakdown,
    };

    const updated = [submissionRecord, ...this.submissions];
    this.saveSubmissions(updated);
    this.clearDraft(examId, user.matricule);

    return submissionRecord;
  }

  /**
   * Récupère les copies et notes associées au matricule de l'étudiant
   */
  getStudentSubmissions(studentMatricule) {
    if (!studentMatricule) return [];
    return this.submissions.filter((s) => s.studentMatricule === studentMatricule);
  }
}

export const examService = new ExamService();
