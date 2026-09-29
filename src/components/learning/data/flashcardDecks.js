/**
 * Decks de Flashcards académiques pour l'Université de Yaoundé I
 */

export const DEFAULT_FLASHCARD_DECKS = [
  {
    id: 'deck-c-structs',
    title: 'Structures de Données en C (INF231)',
    badge: 'Langage C · INF231',
    description: 'Pointeurs, listes chaînées, piles, files et gestion de mémoire sur le tas.',
    cards: [
      {
        id: 'c-1',
        question: 'Quelle est la différence fondamentale entre malloc() et calloc() ?',
        answer: 'malloc(size) réserve un bloc d\'octets sans initialisation (la mémoire contient des valeurs résiduelles). calloc(n, size) réserve de la mémoire et initialise TOUS les octets à zéro.',
        hint: 'Pensez à l\'état des bits en mémoire juste après l\'allocation.',
        tag: 'Allocation Mémoire',
      },
      {
        id: 'c-2',
        question: 'Comment déclare-t-on le prototype d\'un nœud de liste simplement chaînée contenant un entier ?',
        answer: 'typedef struct Node {\n  int donnee;\n  struct Node *suivant;\n} Node;',
        hint: 'Le membre "suivant" doit être un pointeur vers la même structure.',
        tag: 'Listes Chaînées',
      },
      {
        id: 'c-3',
        question: 'Pourquoi ne doit-on jamais déréférencer un pointeur NULL (*ptr lorsque ptr == NULL) ?',
        answer: 'Cela déclenche une violation d\'accès mémoire (Segmentation Fault / Erreur de segmentation), car l\'adresse 0x0 est réservée et protégée par le système d\'exploitation.',
        hint: 'Erreur d\'exécution classique lors des TP en C.',
        tag: 'Pointeurs & Sécurité',
      },
      {
        id: 'c-4',
        question: 'Quelle est la complexité d\'insertion en tête dans une liste simplement chaînée vs en fin de liste (sans pointeur de queue) ?',
        answer: 'En tête : O(1) (temps constant immédiat). En fin : O(n) car il faut parcourir tous les maillons jusqu\'au dernier nœud (dont le pointeur suivant vaut NULL).',
        hint: 'Comparez le nombre d\'instructions nécessaires.',
        tag: 'Complexité C',
      },
      {
        id: 'c-5',
        question: 'Que se passe-t-il si on omet free() sur un bloc alloué dynamiquement ?',
        answer: 'Cela crée une fuite de mémoire (Memory Leak). La mémoire consommée reste allouée jusqu\'à la fin du processus et peut saturer la RAM du système.',
        hint: 'Outil de diagnostic : Valgrind.',
        tag: 'Gestion Mémoire',
      },
    ],
  },
  {
    id: 'deck-algo-complexity',
    title: 'Algorithmique & Complexité (INF201)',
    badge: 'Algorithmique · INF201',
    description: 'Analyse asymptotique, notations O/Ω/Θ, récursivité et algorithmes de tri.',
    cards: [
      {
        id: 'algo-1',
        question: 'Quelle est la définition mathématique de la notation Grand O (f(n) = O(g(n))) ?',
        answer: 'Il existe des constantes réelles positives c > 0 et n0 ≥ 0 telles que pour tout n ≥ n0, |f(n)| ≤ c · |g(n)|. Elle représente une borne supérieure asymptotique.',
        hint: 'Comportement pour n grand.',
        tag: 'Asymptotique',
      },
      {
        id: 'algo-2',
        question: 'Quelle est la complexité pire cas et moyenne du Tri Rapide (Quicksort) ?',
        answer: 'Moyenne : O(n log n). Pire cas : O(n²) lorsque le pivot choisi est systématiquement le minimum ou maximum (ex: tableau déjà trié sans pivot aléatoire).',
        hint: 'Le choix du pivot est déterminant.',
        tag: 'Tris',
      },
      {
        id: 'algo-3',
        question: 'Quelle est la condition nécessaire pour appliquer une Recherche Dichotomique sur un tableau ?',
        answer: 'Le tableau doit impérativement être TRIÉ (dans l\'ordre croissant ou décroissant) et offrir un accès direct aux éléments en O(1) (accès par index).',
        hint: 'Pourquoi ne peut-on pas la faire directement sur une liste simplement chaînée classique en O(log n) ?',
        tag: 'Recherche',
      },
      {
        id: 'algo-4',
        question: 'Quelles sont les 3 étapes fondamentales du paradigme "Diviser pour Régner" ?',
        answer: '1. Diviser le problème en sous-problèmes de même nature mais de taille réduite.\n2. Régner en résolvant récursivement chaque sous-problème.\n3. Combiner les solutions partielles pour obtenir la solution finale.',
        hint: 'Exemples types : Tri Fusion, Multiplication de Strassen.',
        tag: 'Méthodologie',
      },
    ],
  },
  {
    id: 'deck-os-architecture',
    title: 'Systèmes d\'Exploitation & Processus (INF211)',
    badge: 'OS & Systèmes · INF211',
    description: 'Ordonnancement, états des processus, mémoire virtuelle et synchronisation sémaphores.',
    cards: [
      {
        id: 'os-1',
        question: 'Quels sont les 3 états fondamentaux du cycle de vie d\'un processus dans l\'ordonnanceur ?',
        answer: '1. Élu (Running) : Le processus exécute ses instructions sur le CPU.\n2. Prêt (Ready) : En attente d\'attribution d\'un créneau CPU (quantum).\n3. Bloqué (Waiting/Blocked) : En attente d\'un événement (I/O, verrou, signal).',
        hint: 'Diagramme d\'état à 3 ou 5 états.',
        tag: 'Processus',
      },
      {
        id: 'os-2',
        question: 'Quelles sont les 4 conditions simultanées de Coffman pour qu\'un Interblocage (Deadlock) survienne ?',
        answer: '1. Exclusion mutuelle (ressource non partageable)\n2. Rétention et attente (détient une ressource et en attend une autre)\n3. Pas de préemption (ressource non retirable de force)\n4. Attente circulaire (cycle de dépendances de processus)',
        hint: 'Si on brise UNE seule condition, l\'interblocage est impossible.',
        tag: 'Concurrence',
      },
      {
        id: 'os-3',
        question: 'Quelle est la différence essentielle entre un sémaphore d\'exclusion mutuelle (Mutex) et un sémaphore de comptage ?',
        answer: 'Le Mutex prend uniquement les valeurs 0 et 1 (une seule tâche en section critique). Le sémaphore de comptage initialise un compteur entier N représentant la quantité disponible de ressources simultanées.',
        hint: 'Primitives P(wait) et V(signal).',
        tag: 'Synchronisation',
      },
    ],
  },
];
