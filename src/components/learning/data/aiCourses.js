/**
 * Cours et chapitres types pour l'IA d'apprentissage CampusHub UY1
 */

export const PRELOADED_COURSES = [
  {
    id: 'ch-pointers',
    title: 'INF231 · Chapitre 3 : Pointeurs & Allocation Dynamique en C',
    category: 'Langage C & Structures',
    rawText: `UNIVERSITÉ DE YAOUNDÉ I - FACULTÉ DES SCIENCES
DÉPARTEMENT D'INFORMATIQUE - COURS INF231

CHAPITRE 3 : LES POINTEURS ET L'ALLOCATION DYNAMIQUE

1. Définition et principe d'adressage
Un pointeur est une variable dont la valeur est l'adresse mémoire d'une autre variable.
En C, chaque variable possède trois caractéristiques fondamentales :
- Son identificateur (nom)
- Son type (qui détermine le nombre d'octets en mémoire)
- Son adresse (l'emplacement mémoire alloué, obtenu avec l'opérateur &)

Déclaration : type *nom_pointeur;
Exemple :
  int x = 20;
  int *p = &x; // p contient l'adresse de x
  *p = 50;     // Déréférencement : x vaut désormais 50

2. Les Fonctions d'Allocation Dynamique (stdlib.h)
Contrairement aux variables statiques allouées sur la pile (Stack), l'allocation dynamique s'effectue sur le tas (Heap).
- malloc(taille_en_octets) : alloue un bloc contigu sans initialisation.
- calloc(nb_elements, taille_element) : alloue et met tous les octets à zéro.
- realloc(pointeur, nouvelle_taille) : redimensionne un bloc existant.
- free(pointeur) : restitue le bloc mémoire au système d'exploitation.

Règle d'or : À chaque malloc/calloc doit correspondre un free(), sinon risque majeur de fuite mémoire (memory leak).
Toujours vérifier si le pointeur retourné n'est pas NULL avant utilisation.`,
    summary: {
      title: 'Synthèse Pédagogique : Pointeurs & Allocation Dynamique (INF231)',
      keyPoints: [
        "Un pointeur stocke une adresse mémoire ; l'opérateur & donne l'adresse, l'opérateur * permet le déréférencement (accès à la valeur pointée).",
        "La pile (Stack) gère les variables locales automatiquement, tandis que le tas (Heap) accueille les blocs alloués dynamiquement sous la responsabilité du programmeur.",
        "malloc() réserve la mémoire brute (non initialisée), alors que calloc() garantit l'initialisation de chaque octet à 0.",
        "Tout appel à malloc/calloc/realloc DOIT être testé contre la valeur NULL avant toute utilisation.",
        "L'oubli de free() conduit à une fuite mémoire (memory leak) qui sature la mémoire vive à terme.",
      ],
      examTrap: "Ne jamais libérer un pointeur déjà libéré (Double Free) ni utiliser un pointeur après son free() (Dangling Pointer / Pointeur suspendu).",
      syntaxHighlight: "int *ptr = (int *)malloc(n * sizeof(int)); if (ptr == NULL) exit(1); ... free(ptr); ptr = NULL;",
    },
    quiz: [
      {
        id: 'q1',
        question: "Quel opérateur permet d'obtenir l'adresse mémoire d'une variable en C ?",
        options: ['*', '&', '->', '%'],
        correctIndex: 1,
        explanation: "L'opérateur esperluette (&) est l'opérateur d'adresse en C, tandis que l'étoile (*) est l'opérateur d'indirection ou de déréférencement.",
      },
      {
        id: 'q2',
        question: "Dans quelle zone mémoire les fonctions malloc() et calloc() allouent-elles la mémoire ?",
        options: ["Sur la pile (Call Stack)", "Dans le segment de code (Text Segment)", "Sur le tas (Heap)", "Dans les registres du processeur"],
        correctIndex: 2,
        explanation: "L'allocation dynamique s'effectue sur le tas (Heap). La pile (Stack) est réservée aux variables locales et aux adresses de retour de fonctions.",
      },
      {
        id: 'q3',
        question: "Que retourne malloc() si la mémoire vive disponible est insuffisante ?",
        options: ['0xFFFFFFFF', '-1', 'NULL', 'Une exception d\'erreur'],
        correctIndex: 2,
        explanation: "En cas d'échec d'allocation, malloc() renvoie le pointeur NULL. C'est pourquoi un test `if (ptr == NULL)` est obligatoire.",
      },
      {
        id: 'q4',
        question: "Quel est le risque immédiat si le programmeur omet d'appeler free() avant la fin d'un calcul récursif lourd ?",
        options: ['Erreur de syntaxe à la compilation', 'Fuite de mémoire (Memory Leak)', 'Écrasement du chargeur de démarrage', 'Segmentation Fault immédiat'],
        correctIndex: 1,
        explanation: "Les blocs non libérés restent réservés : c'est la fuite mémoire (Memory Leak), qui gaspille les ressources du système hôte.",
      },
    ],
  },
  {
    id: 'ch-complexity',
    title: 'INF201 · Chapitre 1 : Analyse Asymptotique & Notations O, Ω, Θ',
    category: 'Algorithmique & Mathématiques',
    rawText: `UNIVERSITÉ DE YAOUNDÉ I - DÉPARTEMENT D'INFORMATIQUE
COURS INF201 : ALGORITHMIQUE ET COMPLEXITÉ

CHAPITRE 1 : COMPLEXITÉ DES ALGORITHMES ET ÉVALUATION ASYMPTOTIQUE

1. Motivation
L'analyse de complexité a pour objectif d'évaluer le temps d'exécution (complexité temporelle) et l'espace mémoire consommé (complexité spatiale) d'un algorithme de manière indépendante du matériel, du compilateur ou du langage de programmation.

2. Les Notations Asymptotiques Fondamentales
- Grand O (O) : Borne supérieure asymptotique (pire cas usuel).
  f(n) = O(g(n)) s'il existe c > 0 et n0 ≥ 0 tels que pour tout n ≥ n0 : f(n) ≤ c * g(n).
- Grand Oméga (Ω) : Borne inférieure asymptotique (meilleur cas).
  f(n) = Ω(g(n)) s'il existe c > 0 et n0 ≥ 0 tels que pour tout n ≥ n0 : f(n) ≥ c * g(n).
- Grand Thêta (Θ) : Encadrement asymptotique exact (ordre de grandeur exact).
  f(n) = Θ(g(n)) si f(n) = O(g(n)) et f(n) = Ω(g(n)).

3. Hiérarchie des classes de complexité classiques :
O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(n³) < O(2^n) < O(n!)`,
    summary: {
      title: 'Synthèse Pédagogique : Complexité Asymptotique (INF201)',
      keyPoints: [
        "La notation Grand O fournit une borne supérieure du coût pour de grandes valeurs de la taille d'entrée n.",
        "La notation Grand Oméga (Ω) fournit une borne inférieure (meilleur cas théorique).",
        "La notation Grand Thêta (Θ) caractérise un ordre de grandeur exact (f est à la fois O(g) et Ω(g)).",
        "Dans l'analyse des tris comparatifs : le pire cas théorique minimal pour trier n éléments est prouvé en Ω(n log n).",
        "Les constantes multiplicatives et les termes de degrés inférieurs sont systématiquement négligés quand n tend vers l'infini.",
      ],
      examTrap: "Confondre pire des cas et notation Grand O : le Grand O est un outil mathématique de borne supérieure, pas synonyme obligatoire de pire cas, bien qu'on l'utilise couramment pour le majorer.",
      syntaxHighlight: "Exemple de preuve : pour f(n) = 3n² + 5n + 7, pour n ≥ 1 : f(n) ≤ 3n² + 5n² + 7n² = 15n², donc f(n) = O(n²) avec c = 15 et n0 = 1.",
    },
    quiz: [
      {
        id: 'q1',
        question: "Quelle notation caractérise formellement une borne supérieure asymptotique ?",
        options: ['Notation Ω (Oméga)', 'Notation O (Grand O)', 'Notation Θ (Thêta)', 'Notation o (Petit o)'],
        correctIndex: 1,
        explanation: "La notation Grand O définit la majoration asymptotique : f(n) ≤ c · g(n) pour tout n supérieur à un certain seuil n0.",
      },
      {
        id: 'q2',
        question: "Parmi les classes suivantes, laquelle offre la croissance la plus lente (l'algorithme le plus rapide sur n grand) ?",
        options: ['O(n)', 'O(n log n)', 'O(log n)', 'O(n²)'],
        correctIndex: 2,
        explanation: "O(log n) (complexité logarithmique, ex: recherche dichotomique) croît beaucoup plus lentement que O(n) linéaire.",
      },
      {
        id: 'q3',
        question: "Si un algorithme effectue 3 boucles imbriquées dépendant chacune de n, quelle est sa complexité polynomiale typique ?",
        options: ['O(n)', 'O(3n)', 'O(n³)', 'O(3^n)'],
        correctIndex: 2,
        explanation: "Trois boucles imbriquées de 1 à n génèrent n * n * n = n³ itérations élémentaires, soit une complexité cubique O(n³).",
      },
    ],
  },
  {
    id: 'ch-os-deadlock',
    title: 'INF211 · Chapitre 4 : Processus, Sémaphores & Interblocages (Deadlock)',
    category: 'Systèmes d\'Exploitation',
    rawText: `UNIVERSITÉ DE YAOUNDÉ I - FACULTÉ DES SCIENCES
COURS INF211 : SYSTÈMES D'EXPLOITATION ET CONCURRENCE

CHAPITRE 4 : PROCESSUS ET PROBLÈMES DE SYNCHRONISATION

1. Concurrence et Section Critique
Lorsque plusieurs processus accèdent simultanément à une ressource partagée modifiable, il y a risque de condition de course (race condition).
Une section critique est la portion de code où s'effectue cet accès concurrent.
Propriétés exigées d'une solution :
- Exclusion mutuelle stricte
- Progrès (absence de famine)
- Attente bornée

2. Outils de Synchronisation : Sémaphores de Dijkstra
Un sémaphore S est un objet entier protégé manipulable uniquement par deux opérations atomiques :
- P(S) ou wait(S) : si S > 0, S = S - 1 ; sinon le processus est endormi/bloqué.
- V(S) ou signal(S) : si des processus attendent, l'un d'eux est réveillé ; sinon S = S + 1.

3. L'Interblocage (Deadlock)
Définition : Situation où un ensemble de processus sont bloqués, chacun attendant un événement ou une ressource que seul un autre processus bloqué de l'ensemble peut provoquer.
Les 4 conditions nécessaires de Coffman :
1) Exclusion mutuelle
2) Rétention et attente (Hold & Wait)
3) Absence de préemption (No Preemption)
4) Attente circulaire (Circular Wait)`,
    summary: {
      title: 'Synthèse Pédagogique : Sémaphores & Interblocages (INF211)',
      keyPoints: [
        "Une section critique doit obligatoirement être protégée pour éviter les incohérences de données dues aux conditions de course.",
        "Les opérations P(S) et V(S) sur un sémaphore sont strictement atomiques (indivisibles).",
        "Un Mutex est un sémaphore binaire initialisé à 1.",
        "Les 4 conditions de Coffman sont simultanément requises pour provoquer un interblocage : casser ne serait-ce qu'une seule condition suffit à prévenir le blocage.",
        "L'algorithme du Banquier de Dijkstra permet d'éviter les interblocages en maintenant le système dans un 'état sûr'.",
      ],
      examTrap: "Confusion fréquente : la famine (starvation) n'est pas un interblocage. Dans la famine, le système global progresse mais un processus malchanceux est indéfiniment ignoré.",
      syntaxHighlight: "Structure type : P(mutex); /* section critique protégée */ V(mutex);",
    },
    quiz: [
      {
        id: 'q1',
        question: "Quelles sont les deux opérations atomiques fondamentales inventées par Dijkstra pour les sémaphores ?",
        options: ['Lock et Unlock', 'P (Wait) et V (Signal)', 'Start et Stop', 'Fork et Join'],
        correctIndex: 1,
        explanation: "P (du néerlandais 'proberen', tester/attendre) et V ('verhogen', incrémenter/signaler) sont les deux opérations primitives indivisibles.",
      },
      {
        id: 'q2',
        question: "Combien de conditions de Coffman doivent être réunies simultanément pour qu'un interblocage (Deadlock) se produise ?",
        options: ['Une seule suffit', 'Exactement 2 conditions', 'Les 4 conditions simultanément', 'Aucune, cela dépend du processeur'],
        correctIndex: 2,
        explanation: "Les 4 conditions (Exclusion mutuelle, Rétention & attente, Non-préemption, Attente circulaire) doivent être vraies en même temps. En briser une seule élimine le risque.",
      },
      {
        id: 'q3',
        question: "Quelle méthode permet de briser la condition d'attente circulaire dans un système d'exploitation ?",
        options: ['Désactiver la mémoire virtuelle', 'Imposer un ordre total strict sur l\'allocation des ressources numérotées', 'Augmenter la fréquence du processeur', 'Utiliser uniquement des disques SSD'],
        correctIndex: 1,
        explanation: "En imposant aux processus de toujours demander les ressources selon un ordre croissant de numéro (R1 < R2 < ... < Rn), aucun cycle d'attente ne peut se former.",
      },
    ],
  },
];
