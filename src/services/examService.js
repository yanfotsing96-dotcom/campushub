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
  // INFORMATIQUE L1
  {
    id: 'exam-inf101-cc',
    codeUe: 'INF101',
    filiereId: 'Informatique',
    niveau: 'L1',
    titre: 'Contrôle Continu : Algorithmique Fondamentale & Syntaxe C ANSI',
    description: 'Épreuve semestrielle L1 : types, boucles, structures de contrôle et tableaux statiques.',
    durationMinutes: 20,
    totalPoints: 20,
    passPercentage: 50,
    academicYear: '2025-2026',
    professor: 'Dr. P. Kamgue',
    university: 'Université de Yaoundé I (UY1)',
    status: 'actif',
    dateDebut: '2026-03-25T08:00',
    dateFin: '2026-04-30T18:00',
    instructions: ['Calcul de complexités simples et maîtrise des boucles while/for.'],
    questions: [
      {
        id: 'q1',
        text: 'Quelle est la taille minimale en octets garantie par le standard C pour un type int ?',
        type: 'single',
        points: 10,
        options: [
          { id: 'opt_a', label: '1 octet' },
          { id: 'opt_b', label: '2 octets (16 bits)' },
          { id: 'opt_c', label: '4 octets' },
          { id: 'opt_d', label: '8 octets' },
        ],
        correctOptionId: 'opt_b',
        explanation: 'La norme ANSI C garantit au minimum 16 bits (2 octets) pour int (bien que les architectures 32/64 bits utilisent 4 octets).',
      },
      {
        id: 'q2',
        text: 'Expliquez la différence essentielle entre une boucle "while" et une boucle "do ... while".',
        type: 'development',
        points: 10,
        explanation: 'La boucle while teste la condition avant la première itération, tandis que do..while exécute le corps au moins une fois avant le premier test.',
      },
    ],
  },
  // INFORMATIQUE L3
  {
    id: 'exam-inf301-cc',
    codeUe: 'INF301',
    filiereId: 'Informatique',
    niveau: 'L3',
    titre: 'Contrôle Continu : Bases de Données Relationnelles & Optimisation SQL',
    description: 'Épreuve de niveau L3 : formes normales BCNF, algèbre relationnelle et plans dexécution.',
    durationMinutes: 25,
    totalPoints: 20,
    passPercentage: 50,
    academicYear: '2025-2026',
    professor: 'Dr. M. Tchoupé',
    university: 'Université de Yaoundé I (UY1)',
    status: 'actif',
    dateDebut: '2026-03-25T08:00',
    dateFin: '2026-04-30T18:00',
    instructions: ['Analyse de dépendances fonctionnelles et requêtes SQL avec fenêtres.'],
    questions: [
      {
        id: 'q1',
        text: 'Dans un index B-Tree dense de profondeur h, quelle est la complexité dune recherche de clé par égalité ?',
        type: 'single',
        points: 10,
        options: [
          { id: 'opt_a', label: 'O(1)' },
          { id: 'opt_b', label: 'O(log n)' },
          { id: 'opt_c', label: 'O(n)' },
          { id: 'opt_d', label: 'O(n log n)' },
        ],
        correctOptionId: 'opt_b',
        explanation: 'Larbre B-Tree garantit un équilibrage strict de toutes les feuilles au même niveau, assurant O(log n) accès disques.',
      },
      {
        id: 'q2',
        text: 'Définissez la propriété dIsolation dans les transactions ACID.',
        type: 'development',
        points: 10,
        explanation: 'L’isolation garantit que l’exécution concurrente de plusieurs transactions produit le même état final qu’une exécution séquentielle.',
      },
    ],
  },
  // INFORMATIQUE MASTER
  {
    id: 'exam-inf401-cc',
    codeUe: 'INF401',
    filiereId: 'Informatique',
    niveau: 'Master',
    titre: 'Examen Master : Systèmes Distribués & Algorithme de Consensus Raft',
    description: 'Épreuve de Master Recherche & Ingénierie : consensus distribué, RPC gRPC et réplication d’état.',
    durationMinutes: 30,
    totalPoints: 20,
    passPercentage: 50,
    academicYear: '2025-2026',
    professor: 'Pr. E. Monkam',
    university: 'Université de Yaoundé I (UY1)',
    status: 'actif',
    dateDebut: '2026-03-25T08:00',
    dateFin: '2026-04-30T18:00',
    instructions: ['Répondre avec rigueur théorique aux problématiques de tolérance aux pannes.'],
    questions: [
      {
        id: 'q1',
        text: 'Dans le protocole Raft, combien de serveurs doivent répondre favorablement pour élire un Leader dans un cluster de N nœuds ?',
        type: 'single',
        points: 10,
        options: [
          { id: 'opt_a', label: 'Exactement 1 nœud' },
          { id: 'opt_b', label: 'Une majorité stricte : floor(N/2) + 1 nœuds' },
          { id: 'opt_c', label: 'Tous les N nœuds (unanimité)' },
          { id: 'opt_d', label: '2 nœuds au hasard' },
        ],
        correctOptionId: 'opt_b',
        explanation: 'Raft requiert un quorum majoritaire strict floor(N/2) + 1 pour éviter la scission en cerveau partagé (split-brain).',
      },
      {
        id: 'q2',
        text: 'Énoncez le théorème CAP de Brewer pour les systèmes distribués.',
        type: 'development',
        points: 10,
        explanation: 'En présence d’une partition réseau (P), un système distribué ne peut garantir simultanément la cohérence stricte (C) et la disponibilité (A).',
      },
    ],
  },
  // MATHÉMATIQUES L1
  {
    id: 'exam-mat101-cc',
    codeUe: 'MAT101',
    filiereId: 'Mathématiques',
    niveau: 'L1',
    titre: 'Contrôle Continu : Algèbre Linéaire & Espaces Vectoriels',
    description: 'Évaluation semestrielle : bases, dimension, théorèmes du rang et pivot de Gauss.',
    durationMinutes: 20,
    totalPoints: 20,
    passPercentage: 50,
    academicYear: '2025-2026',
    professor: 'Pr. J. Nguemo',
    university: 'Université de Yaoundé I (UY1)',
    status: 'actif',
    dateDebut: '2026-03-25T08:00',
    dateFin: '2026-04-30T18:00',
    instructions: ['Calcul de déterminants et applications linéaires.'],
    questions: [
      {
        id: 'q1',
        text: 'Quel est lénoncé exact du théorème du rang pour une application linéaire f: E -> F en dimension finie ?',
        type: 'single',
        points: 10,
        options: [
          { id: 'opt_a', label: 'dim(E) = dim(Ker f) + rg(f)' },
          { id: 'opt_b', label: 'dim(F) = dim(Ker f) + rg(f)' },
          { id: 'opt_c', label: 'rg(f) = dim(E) * dim(F)' },
          { id: 'opt_d', label: 'dim(Ker f) = rg(f)' },
        ],
        correctOptionId: 'opt_a',
        explanation: 'Le théorème du rang relie la dimension de lespace de départ à celle du noyau et de limage : dim(E) = dim(Ker f) + rg(f).',
      },
      {
        id: 'q2',
        text: 'Donnez la condition nécessaire et suffisante pour quune famille de vecteurs soit une base.',
        type: 'development',
        points: 10,
        explanation: 'La famille doit être à la fois libre (indépendance linéaire) et génératrice de lespace vectoriel.',
      },
    ],
  },
  // MATHÉMATIQUES L3
  {
    id: 'exam-mat301-cc',
    codeUe: 'MAT301',
    filiereId: 'Mathématiques',
    niveau: 'L3',
    titre: 'Contrôle Continu : Topologie Générale & Espaces Métriques',
    description: 'Épreuve de L3 : ouverts, fermés, compacité (Heine-Borel) et complétude.',
    durationMinutes: 25,
    totalPoints: 20,
    passPercentage: 50,
    academicYear: '2025-2026',
    professor: 'Pr. E. Nguemo',
    university: 'Université de Yaoundé I (UY1)',
    status: 'actif',
    dateDebut: '2026-03-25T08:00',
    dateFin: '2026-04-30T18:00',
    instructions: ['Raisonnement topologique rigoureux.'],
    questions: [
      {
        id: 'q1',
        text: 'Dans R^n muni de la norme euclidienne, une partie est compacte si et seulement si elle est :',
        type: 'single',
        points: 10,
        options: [
          { id: 'opt_a', label: 'Ouverte et bornée' },
          { id: 'opt_b', label: 'Fermée et bornée (Théorème de Borel-Lebesgue)' },
          { id: 'opt_c', label: 'Connexe et non vide' },
          { id: 'opt_d', label: 'Dénombrable' },
        ],
        correctOptionId: 'opt_b',
        explanation: 'En dimension finie, les compacts sont exactement les sous-ensembles fermés et bornés.',
      },
      {
        id: 'q2',
        text: 'Quappelle-t-on un espace métrique complet ?',
        type: 'development',
        points: 10,
        explanation: 'Un espace métrique est complet si toute suite de Cauchy y converge vers une limite appartenant à lespace.',
      },
    ],
  },
  // MATHÉMATIQUES MASTER
  {
    id: 'exam-mat401-cc',
    codeUe: 'MAT401',
    filiereId: 'Mathématiques',
    niveau: 'Master',
    titre: 'Examen Master : Analyse Fonctionnelle & Espaces de Hilbert',
    description: 'Épreuve de Master Recherche : opérateurs bornés, théorème de Riesz-Fréchet et décomposition spectrale.',
    durationMinutes: 30,
    totalPoints: 20,
    passPercentage: 50,
    academicYear: '2025-2026',
    professor: 'Pr. S. Talla',
    university: 'Université de Yaoundé I (UY1)',
    status: 'actif',
    dateDebut: '2026-03-25T08:00',
    dateFin: '2026-04-30T18:00',
    instructions: ['Démonstrations rigoureuses sur les espaces hilbertiens.'],
    questions: [
      {
        id: 'q1',
        text: 'Daprès le théorème de représentation de Riesz-Fréchet, toute forme linéaire continue sur un espace de Hilbert H est :',
        type: 'single',
        points: 10,
        options: [
          { id: 'opt_a', label: 'Nulle partout' },
          { id: 'opt_b', label: 'Représentée de manière unique par un produit scalaire <x, y>' },
          { id: 'opt_c', label: 'Non bornée sur la sphère unité' },
          { id: 'opt_d', label: 'Toujours injective' },
        ],
        correctOptionId: 'opt_b',
        explanation: 'Pour toute f dans H*, il existe un unique y dans H tel que f(x) = <x, y> pour tout x, avec ||f|| = ||y||.',
      },
      {
        id: 'q2',
        text: 'Définissez la projection orthogonale sur un sous-espace vectoriel fermé dun Hilbert.',
        type: 'development',
        points: 10,
        explanation: 'Tout x se décompose de manière unique sous la forme x = p(x) + q(x) où p(x) appartient à F et q(x) à lorthogonal de F.',
      },
    ],
  },
  // PHYSIQUE L1
  {
    id: 'exam-phy101-cc',
    codeUe: 'PHY101',
    filiereId: 'Physique',
    niveau: 'L1',
    titre: 'Contrôle Continu : Mécanique Newtonienne du Point & Oscillateurs',
    description: 'Épreuve L1 : lois de Newton, énergie potentielle, oscillateur harmonique amorti et pendule.',
    durationMinutes: 20,
    totalPoints: 20,
    passPercentage: 50,
    academicYear: '2025-2026',
    professor: 'Dr. P. Tsafack',
    university: 'Université de Yaoundé I (UY1)',
    status: 'actif',
    dateDebut: '2026-03-25T08:00',
    dateFin: '2026-04-30T18:00',
    instructions: ['Résolution déquations différentielles du second ordre.'],
    questions: [
      {
        id: 'q1',
        text: 'Quelle est la période propre T_0 dun pendule simple de longueur L sous accélération gravitationnelle g pour de petites oscillations ?',
        type: 'single',
        points: 10,
        options: [
          { id: 'opt_a', label: 'T_0 = 2 * pi * sqrt(L / g)' },
          { id: 'opt_b', label: 'T_0 = 2 * pi * (g / L)' },
          { id: 'opt_c', label: 'T_0 = pi * sqrt(g * L)' },
          { id: 'opt_d', label: 'T_0 = 1 / sqrt(L * g)' },
        ],
        correctOptionId: 'opt_a',
        explanation: 'Léquation différentielle theta" + (g/L)*theta = 0 a pour pulsation propre omega_0 = sqrt(g/L), doù T_0 = 2*pi*sqrt(L/g).',
      },
      {
        id: 'q2',
        text: 'Énoncez le théorème de lénergie cinétique pour un point matériel soumis à un ensemble de forces.',
        type: 'development',
        points: 10,
        explanation: 'La variation dénergie cinétique entre deux états est égale à la somme des travaux des forces extérieures appliquées : Delta(Ec) = Somme(W).',
      },
    ],
  },
  // PHYSIQUE L3
  {
    id: 'exam-phy301-cc',
    codeUe: 'PHY301',
    filiereId: 'Physique',
    niveau: 'L3',
    titre: 'Contrôle Continu : Mécanique Quantique & Équation de Schrödinger',
    description: 'Épreuve L3 : fonction donde, puits infini, opérateurs hermitiques et relations dincertitude de Heisenberg.',
    durationMinutes: 25,
    totalPoints: 20,
    passPercentage: 50,
    academicYear: '2025-2026',
    professor: 'Pr. J. Mvogo',
    university: 'Université de Yaoundé I (UY1)',
    status: 'actif',
    dateDebut: '2026-03-25T08:00',
    dateFin: '2026-04-30T18:00',
    instructions: ['Calcul de commutateurs et valeurs propres dénergie.'],
    questions: [
      {
        id: 'q1',
        text: 'Quelle est la valeur du commutateur [x, p_x] entre la position et limpulsion quantique ?',
        type: 'single',
        points: 10,
        options: [
          { id: 'opt_a', label: '0' },
          { id: 'opt_b', label: 'i * hbar' },
          { id: 'opt_c', label: '-i * hbar' },
          { id: 'opt_d', label: 'hbar^2' },
        ],
        correctOptionId: 'opt_b',
        explanation: 'La relation canonique de commutation de Dirac-Heisenberg stipule que [x, p_x] = i * hbar.',
      },
      {
        id: 'q2',
        text: 'Expliquez brièvement le phénomène deffet tunnel pour une particule quantique face à une barrière de potentiel.',
        type: 'development',
        points: 10,
        explanation: 'La particule a une probabilité non nulle de traverser une barrière de potentiel supérieure à son énergie mécanique grâce à la décroissance évanescente de sa fonction donde.',
      },
    ],
  },
  // PHYSIQUE MASTER
  {
    id: 'exam-phy401-cc',
    codeUe: 'PHY401',
    filiereId: 'Physique',
    niveau: 'Master',
    titre: 'Examen Master : Physique du Solide & Semi-conducteurs',
    description: 'Épreuve Master : structure de bandes, modèle de Kronig-Penney, niveau de Fermi et jonction p-n.',
    durationMinutes: 30,
    totalPoints: 20,
    passPercentage: 50,
    academicYear: '2025-2026',
    professor: 'Dr. G. Kenfack',
    university: 'Université de Yaoundé I (UY1)',
    status: 'actif',
    dateDebut: '2026-03-25T08:00',
    dateFin: '2026-04-30T18:00',
    instructions: ['Statistique de Fermi-Dirac et densité détats.'],
    questions: [
      {
        id: 'q1',
        text: 'À température T = 0 K, quelle est la probabilité d’occupation f(E) d’un état électronique situé au-dessus de l’énergie de Fermi E_F ?',
        type: 'single',
        points: 10,
        options: [
          { id: 'opt_a', label: 'f(E) = 1' },
          { id: 'opt_b', label: 'f(E) = 0' },
          { id: 'opt_c', label: 'f(E) = 0.5' },
          { id: 'opt_d', label: 'f(E) = exp(-1)' },
        ],
        correctOptionId: 'opt_b',
        explanation: 'À T = 0 K, la distribution de Fermi-Dirac est une fonction marche : f(E) = 1 pour E < E_F et f(E) = 0 pour E > E_F.',
      },
      {
        id: 'q2',
        text: 'Définissez la masse effective m* dun électron dans un réseau cristallin périodique.',
        type: 'development',
        points: 10,
        explanation: 'm* est inversement proportionnelle à la courbure de la bande dénergie : 1/m* = (1/hbar^2) * d^2E/dk^2.',
      },
    ],
  },
  // CHIMIE L1
  {
    id: 'exam-chm101-cc',
    codeUe: 'CHM101',
    filiereId: 'Chimie',
    niveau: 'L1',
    titre: 'Contrôle Continu : Thermochimie & Équilibres Acido-Basiques',
    description: 'Épreuve L1 : premier principe, enthalpie de réaction (loi de Hess) et pH des solutions aqueuses.',
    durationMinutes: 20,
    totalPoints: 20,
    passPercentage: 50,
    academicYear: '2025-2026',
    professor: 'Dr. M. Biya',
    university: 'Université de Yaoundé I (UY1)',
    status: 'actif',
    dateDebut: '2026-03-25T08:00',
    dateFin: '2026-04-30T18:00',
    instructions: ['Calculs de pH et bilans denthalpie standard de réaction.'],
    questions: [
      {
        id: 'q1',
        text: 'Quelle équation permet de calculer le pH dune solution tampon composée dun acide faible HA et de sa base conjuguée A- ?',
        type: 'single',
        points: 10,
        options: [
          { id: 'opt_a', label: 'pH = pKa + log([A-] / [HA]) (Henderson-Hasselbalch)' },
          { id: 'opt_b', label: 'pH = pKa - log([A-] / [HA])' },
          { id: 'opt_c', label: 'pH = 14 + pKa' },
          { id: 'opt_d', label: 'pH = -log([HA] * [A-])' },
        ],
        correctOptionId: 'opt_a',
        explanation: 'Léquation dHenderson-Hasselbalch relie le pH au pKa du couple et aux concentrations à léquilibre : pH = pKa + log([Base]/[Acide]).',
      },
      {
        id: 'q2',
        text: 'Énoncez la loi de Hess pour le calcul des grandeurs de réaction thermochimiques standard.',
        type: 'development',
        points: 10,
        explanation: 'Lenthalpie standard dune réaction ne dépend que des états initial et final, et est égale à la somme des enthalpies des réactions intermédiaires.',
      },
    ],
  },
  // CHIMIE L2 (Already exists exam-chm201-cc, make sure it is here)
  {
    id: 'exam-chm201-cc',
    codeUe: 'CHM201',
    filiereId: 'Chimie',
    niveau: 'L2',
    titre: 'Contrôle Continu : Chimie Organique & Mécanismes SN1 / SN2',
    description: 'Épreuve semestrielle : substitutions nucléophiles, éliminations, stéréochimie et inversions de Walden.',
    durationMinutes: 20,
    totalPoints: 20,
    passPercentage: 50,
    academicYear: '2025-2026',
    professor: 'Dr. M. Biya',
    university: 'Université de Yaoundé I (UY1)',
    status: 'actif',
    dateDebut: '2026-03-25T08:00',
    dateFin: '2026-04-30T18:00',
    instructions: ['Stéréochimie R/S et cinétique chimique.'],
    questions: [
      {
        id: 'q1',
        text: 'Quel est lordre cinétique global dune réaction de substitution nucléophile bimoléculaire (SN2) ?',
        type: 'single',
        points: 10,
        options: [
          { id: 'opt_a', label: 'Ordre 0' },
          { id: 'opt_b', label: 'Ordre 1' },
          { id: 'opt_c', label: 'Ordre 2 (vitesse = k * [RX] * [Nu-])' },
          { id: 'opt_d', label: 'Ordre 3' },
        ],
        correctOptionId: 'opt_c',
        explanation: 'Dans une SN2 concertée à une seule étape, la vitesse dépend simultanément du substrat électrophile et du nucléophile.',
      },
      {
        id: 'q2',
        text: 'Expliquez pourquoi le mécanisme SN2 entraîne une inversion stéréochimique complète (Inversion de Walden).',
        type: 'development',
        points: 10,
        explanation: 'Le nucléophile attaque le carbone asymétrique par la face opposée au groupe partant, provoquant le retournement des substituants comme un parapluie au vent.',
      },
    ],
  },
  // CHIMIE L3
  {
    id: 'exam-chm301-cc',
    codeUe: 'CHM301',
    filiereId: 'Chimie',
    niveau: 'L3',
    titre: 'Contrôle Continu : Cinétique Formelle & Électrochimie de Nernst',
    description: 'Épreuve L3 : vitesses de réaction, potentiel standard rédox et piles électrochimiques.',
    durationMinutes: 25,
    totalPoints: 20,
    passPercentage: 50,
    academicYear: '2025-2026',
    professor: 'Pr. A. Njoya',
    university: 'Université de Yaoundé I (UY1)',
    status: 'actif',
    dateDebut: '2026-03-25T08:00',
    dateFin: '2026-04-30T18:00',
    instructions: ['Application de léquation de Nernst et loi dArrhenius.'],
    questions: [
      {
        id: 'q1',
        text: 'Selon léquation de Nernst à 298 K, de combien varie le potentiel rédox E quand le rapport [Ox]/[Red] est multiplié par 10 pour un échange de n électrons ?',
        type: 'single',
        points: 10,
        options: [
          { id: 'opt_a', label: '0.059 V / n' },
          { id: 'opt_b', label: '0.59 V * n' },
          { id: 'opt_c', label: '1.23 V' },
          { id: 'opt_d', label: '0 V' },
        ],
        correctOptionId: 'opt_a',
        explanation: 'E = E° + (0.059/n) * log10([Ox]/[Red]). Si le ratio augmente dun facteur 10, E augmente de 0.059/n Volts.',
      },
      {
        id: 'q2',
        text: 'Donnez léquation dArrhenius reliant la constante de vitesse k à la température T et à lénergie dactivation Ea.',
        type: 'development',
        points: 10,
        explanation: 'k = A * exp(-Ea / (R * T)), où A est le facteur pré-exponentiel et R la constante des gaz parfaits.',
      },
    ],
  },
  // CHIMIE MASTER
  {
    id: 'exam-chm401-cc',
    codeUe: 'CHM401',
    filiereId: 'Chimie',
    niveau: 'Master',
    titre: 'Examen Master : Spectrométrie RMN 1H/13C & Cristallographie',
    description: 'Épreuve Master : résonance magnétique nucléaire, couplages scalaires et diffraction des rayons X (loi de Bragg).',
    durationMinutes: 30,
    totalPoints: 20,
    passPercentage: 50,
    academicYear: '2025-2026',
    professor: 'Pr. F. Tchinda',
    university: 'Université de Yaoundé I (UY1)',
    status: 'actif',
    dateDebut: '2026-03-25T08:00',
    dateFin: '2026-04-30T18:00',
    instructions: ['Élucidation structurale de molécules polyfonctionnelles.'],
    questions: [
      {
        id: 'q1',
        text: 'Selon la loi de Bragg en cristallographie par diffraction X, quelle est la condition dinterférence constructive sur un réseau de plans espacés de d ?',
        type: 'single',
        points: 10,
        options: [
          { id: 'opt_a', label: '2 * d * sin(theta) = n * lambda' },
          { id: 'opt_b', label: 'd * cos(theta) = lambda' },
          { id: 'opt_c', label: 'd / sin(theta) = n * lambda' },
          { id: 'opt_d', label: '2 * d = lambda' },
        ],
        correctOptionId: 'opt_a',
        explanation: 'La différence de marche entre deux rayons réfléchis par deux plans réticulaires successifs vaut 2*d*sin(theta) = n*lambda.',
      },
      {
        id: 'q2',
        text: 'Expliquez lorigine du déplacement chimique (delta en ppm) en RMN du proton.',
        type: 'development',
        points: 10,
        explanation: 'Le déplacement chimique résulte du blindage électronique local des noyaux qui modifie le champ magnétique effectif ressenti.',
      },
    ],
  },
  // BIOLOGIE L2
  {
    id: 'exam-bio201-cc',
    codeUe: 'BIO201',
    filiereId: 'Biologie',
    niveau: 'L2',
    titre: 'Contrôle Continu : Génétique des Populations & Évolution Moléculaire',
    description: 'Épreuve L2 : équilibre de Hardy-Weinberg, dérive génétique, mutations et sélection naturelle.',
    durationMinutes: 20,
    totalPoints: 20,
    passPercentage: 50,
    academicYear: '2025-2026',
    professor: 'Pr. S. Eyenga',
    university: 'Université de Yaoundé I (UY1)',
    status: 'actif',
    dateDebut: '2026-03-25T08:00',
    dateFin: '2026-04-30T18:00',
    instructions: ['Calcul de fréquences alléliques et génotypiques.'],
    questions: [
      {
        id: 'q1',
        text: 'Pour un locus biallélique (A, a) de fréquences respectives p et q à léquilibre de Hardy-Weinberg, quelle est la fréquence des hétérozygotes (Aa) ?',
        type: 'single',
        points: 10,
        options: [
          { id: 'opt_a', label: 'p^2' },
          { id: 'opt_b', label: '2 * p * q' },
          { id: 'opt_c', label: 'q^2' },
          { id: 'opt_d', label: 'p + q' },
        ],
        correctOptionId: 'opt_b',
        explanation: 'Le développement binomial donne p^2 + 2pq + q^2 = 1, où 2pq représente la proportion dhétérozygotes.',
      },
      {
        id: 'q2',
        text: 'Énumérez trois conditions nécessaires au maintien strict de léquilibre de Hardy-Weinberg dans une population.',
        type: 'development',
        points: 10,
        explanation: 'Population de taille infinie (pas de dérive), panmixie (accouplements aléatoires), et absence de sélection, mutation ou migration.',
      },
    ],
  },
  // BIOLOGIE L3
  {
    id: 'exam-bio301-cc',
    codeUe: 'BIO301',
    filiereId: 'Biologie',
    niveau: 'L3',
    titre: 'Contrôle Continu : Immunologie Cellulaire & Réponses Immunitaires',
    description: 'Épreuve L3 : complexe majeur dhistocompatibilité (CMH), lymphocytes T CD4+/CD8+, anticorps et cytokines.',
    durationMinutes: 25,
    totalPoints: 20,
    passPercentage: 50,
    academicYear: '2025-2026',
    professor: 'Dr. C. Mbida',
    university: 'Université de Yaoundé I (UY1)',
    status: 'actif',
    dateDebut: '2026-03-25T08:00',
    dateFin: '2026-04-30T18:00',
    instructions: ['Mécanismes de présentation antigénique.'],
    questions: [
      {
        id: 'q1',
        text: 'Quelles cellules reconnaissent spécifiquement les peptides antigéniques présentés par les molécules du CMH de classe I ?',
        type: 'single',
        points: 10,
        options: [
          { id: 'opt_a', label: 'Les lymphocytes B mémoires' },
          { id: 'opt_b', label: 'Les lymphocytes T cytotoxiques CD8+' },
          { id: 'opt_c', label: 'Les lymphocytes T auxiliaires CD4+' },
          { id: 'opt_d', label: 'Les plasmocytes' },
        ],
        correctOptionId: 'opt_b',
        explanation: 'Le corécepteur CD8 se lie au domaine invariant alpha-3 du CMH I, assurant la reconnaissance par les LT CD8+ cytotoxiques.',
      },
      {
        id: 'q2',
        text: 'Décrivez brièvement le rôle des immunoglobulines M (IgM) lors dune première réponse immunitaire humorale.',
        type: 'development',
        points: 10,
        explanation: 'Les IgM pentamériques sont les premiers anticorps sécrétés par les plasmocytes après contact initial avec lantigène, très efficaces pour activer le complément.',
      },
    ],
  },
  // BIOLOGIE MASTER
  {
    id: 'exam-bio401-cc',
    codeUe: 'BIO401',
    filiereId: 'Biologie',
    niveau: 'Master',
    titre: 'Examen Master : Biotechnologies Moléculaires & Édition Génomique CRISPR',
    description: 'Épreuve Master : système CRISPR-Cas9, séquençage nouvelle génération (NGS) et thérapie génique.',
    durationMinutes: 30,
    totalPoints: 20,
    passPercentage: 50,
    academicYear: '2025-2026',
    professor: 'Pr. H. Nguema',
    university: 'Université de Yaoundé I (UY1)',
    status: 'actif',
    dateDebut: '2026-03-25T08:00',
    dateFin: '2026-04-30T18:00',
    instructions: ['Conception darn guides sgRNA et réparation par recombinaison homologue.'],
    questions: [
      {
        id: 'q1',
        text: 'Quel motif nucléotidique indispensable adjacent au protospacer (PAM) dendonucléase Cas9 de S. pyogenes doit être présent sur lADN cible ?',
        type: 'single',
        points: 10,
        options: [
          { id: 'opt_a', label: '5-NGG-3' },
          { id: 'opt_b', label: '5-AAAA-3' },
          { id: 'opt_c', label: '5-TATA-3' },
          { id: 'opt_d', label: '5-CC-3' },
        ],
        correctOptionId: 'opt_a',
        explanation: 'SpCas9 reconnaît spécifiquement le motif PAM 5-NGG-3 en 3 de la séquence cible dADN bicaténaire pour déclencher la coupure double brin.',
      },
      {
        id: 'q2',
        text: 'Distinguez les deux voies majeures de réparation cellulaire après coupure double brin : NHEJ vs HDR.',
        type: 'development',
        points: 10,
        explanation: 'Le NHEJ (Non-Homologous End Joining) est rapide mais sujet aux erreurs (indels). Le HDR (Homology-Directed Repair) utilise une matrice homologue pour une édition précise sans erreur.',
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
    const userNiveau = String(user.niveau || 'L2').toUpperCase();

    return this.exams.filter((exam) => {
      // Admin ou Modérateur : accès complet
      if (role === ROLES.ADMIN || role === ROLES.MODERATOR) {
        return true;
      }

      // Pour l'étudiant : doit être ACTIF, même filière, même niveau
      const isActive = exam.status === 'actif' || exam.status === 'active';
      const examFiliere = (exam.filiereId || '').toLowerCase();
      const matchFiliere =
        examFiliere === userFiliere ||
        (userFiliere.includes('info') && examFiliere.includes('info')) ||
        (userFiliere.includes('math') && examFiliere.includes('math')) ||
        (userFiliere.includes('phys') && examFiliere.includes('phys')) ||
        (userFiliere.includes('chim') && examFiliere.includes('chim')) ||
        (userFiliere.includes('bio') && examFiliere.includes('bio'));

      const examNiveau = String(exam.niveau || '').toUpperCase();
      const matchNiveau =
        examNiveau === userNiveau ||
        ((userNiveau.includes('MASTER') || userNiveau.startsWith('M')) && (examNiveau.includes('MASTER') || examNiveau.startsWith('M'))) ||
        ((userNiveau.includes('L1') || userNiveau === '1') && examNiveau === 'L1') ||
        ((userNiveau.includes('L2') || userNiveau === '2') && examNiveau === 'L2') ||
        ((userNiveau.includes('L3') || userNiveau === '3') && examNiveau === 'L3');

      return isActive && matchFiliere && matchNiveau;
    });
  }

  /**
   * Calcule le nombre exact d'épreuves actives pour le badge de notification
   */
  getActiveExamsCountForUser(user) {
    if (!user) return 0;
    return this.getAvailableExams(user).length;
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
