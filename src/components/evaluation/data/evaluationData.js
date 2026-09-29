/**
 * Données de base pour le Module 07 : Évaluation & Gamification
 * Plateforme CampusHub — Université de Yaoundé I
 */

export const RATED_DOCUMENTS = [
  {
    id: 'doc-1',
    title: 'Polycopié Officiel : Structures de Données & Pointeurs en C',
    course: 'INF231',
    author: 'Dr. Tagne / Département Informatique',
    department: 'Faculté des Sciences · UY1',
    rating: 4.8,
    reviewsCount: 38,
    breakdown: { 5: 32, 4: 4, 3: 2, 2: 0, 1: 0 },
    verifiedByFaculty: true,
    downloads: 1420,
    tags: ['Pointeurs', 'Listes Chaînées', 'Arbres ABR', 'Examens'],
    comments: [
      {
        id: 'c-101',
        author: 'Marcelle Eyenga',
        matricule: '22S84912',
        level: 'L3 Informatique',
        rating: 5,
        date: 'Il y a 3 jours',
        text: 'Ce polycopié m\'a sauvé pour le rattrapage d\'INF231 ! Les schémas sur les déréférencements de pointeurs et les free() sont limpides. Je recommande vivement pour réviser avant l\'épreuve.',
        likes: 14,
        isHelpful: true,
        recommended: true,
        replies: [
          {
            id: 'r-201',
            author: 'Samuel Ndzie (Délégué L2)',
            matricule: '23S10482',
            date: 'Il y a 2 jours',
            text: 'Absolument d\'accord ! La page 34 sur la détection des fuites avec Valgrind correspond mot pour mot à l\'exercice 2 de l\'examen de l\'an dernier.',
            likes: 6,
          },
        ],
      },
      {
        id: 'c-102',
        author: 'Boris Kenmogne',
        matricule: '23S74891',
        level: 'L2 Informatique',
        rating: 4,
        date: 'Il y a 1 semaine',
        text: 'Très complet et bien rédigé. Une petite coquille cependant à la page 19 sur la fonction de suppression en fin de liste (il manque un test si la liste est vide avec 1 seul élément).',
        likes: 9,
        isHelpful: true,
        recommended: true,
        replies: [],
      },
    ],
  },
  {
    id: 'doc-2',
    title: 'Annales d\'Examens Corrigées (2021-2025) : Algorithmique Avancée',
    course: 'INF201',
    author: 'Club Informatique UY1 & Majors de Promo',
    department: 'Faculté des Sciences',
    rating: 4.9,
    reviewsCount: 52,
    breakdown: { 5: 48, 4: 3, 3: 1, 2: 0, 1: 0 },
    verifiedByFaculty: true,
    downloads: 2180,
    tags: ['Complexité', 'Grand O', 'Tri Fusion', 'Arbres'],
    comments: [
      {
        id: 'c-103',
        author: 'Arsène Fotsing',
        matricule: '23S99104',
        level: 'L2 Info',
        rating: 5,
        date: 'Il y a 5 jours',
        text: 'Les démonstrations mathématiques des bornes Omega(n log n) pour les tris comparatifs sont ultra détaillées et rigoureuses. Un must-have !',
        likes: 18,
        isHelpful: true,
        recommended: true,
        replies: [],
      },
    ],
  },
  {
    id: 'doc-3',
    title: 'Fiche Synthèse TP : Sémaphores & Concurrence Unix',
    course: 'INF211',
    author: 'Groupe d\'Étude Ngoa-Ekellé',
    department: 'Licence Informatique',
    rating: 4.6,
    reviewsCount: 24,
    breakdown: { 5: 16, 4: 6, 3: 2, 2: 0, 1: 0 },
    verifiedByFaculty: false,
    downloads: 870,
    tags: ['Processus', 'Mutex', 'Deadlock', 'Coffman'],
    comments: [
      {
        id: 'c-104',
        author: 'Nathalie Ngo',
        matricule: '23S14520',
        level: 'L2 Info',
        rating: 5,
        date: 'Il y a 2 semaines',
        text: 'L\'analogie du dîner des philosophes avec les sémaphores de Dijkstra a rendu la notion de verrouillage mortel limpide pour tout notre groupe de TD.',
        likes: 7,
        isHelpful: true,
        recommended: true,
        replies: [],
      },
    ],
  },
];

export const STUDENT_GAMIFICATION_PROFILE = {
  name: 'Yanick Fotsing',
  matricule: '23S40192',
  level: 'Licence 2 · Informatique',
  rank: 'Tuteur Académique Émérite',
  xp: 3450,
  nextLevelXp: 5000,
  currentLevel: 8,
  positionRank: 3,
  totalStudents: 340,
  karmaScore: 98,
  stats: {
    resourcesShared: 9,
    helpfulReviews: 28,
    resolvedQuestions: 17,
    verifiedBadgesCount: 5,
  },
};

export const MERIT_BADGES = [
  {
    id: 'badge-contributor',
    title: 'Contributeur Actif',
    category: 'Partage',
    icon: 'Share2',
    color: 'indigo',
    description: 'A partagé au moins 5 ressources validées par les pairs pour la communauté UY1.',
    earned: true,
    earnedDate: '14 Sept 2026',
    progress: 100,
    xpReward: 300,
  },
  {
    id: 'badge-c-python',
    title: 'Expert en C & Python',
    category: 'Technique',
    icon: 'Code2',
    color: 'emerald',
    description: 'A résolu avec succès 15 défis d\'algorithmes et TP sur le Playground interactif.',
    earned: true,
    earnedDate: '22 Sept 2026',
    progress: 100,
    xpReward: 500,
  },
  {
    id: 'badge-corrector',
    title: 'Top Correcteur & Mentor',
    category: 'Pédagogie',
    icon: 'CheckCircle2',
    color: 'blue',
    description: 'A rédigé plus de 10 réponses certifiées utiles sur les commentaires et forums.',
    earned: true,
    earnedDate: '26 Sept 2026',
    progress: 100,
    xpReward: 400,
  },
  {
    id: 'badge-sentinel',
    title: 'Sentinelle Anti-Plagiat',
    category: 'Qualité',
    icon: 'ShieldCheck',
    color: 'purple',
    description: 'A effectué plus de 5 audits de conformité académique sur des mémoires et devoirs.',
    earned: true,
    earnedDate: '28 Sept 2026',
    progress: 100,
    xpReward: 350,
  },
  {
    id: 'badge-major',
    title: 'Major de Promo (Top 5%)',
    category: 'Excellence',
    icon: 'Trophy',
    color: 'amber',
    description: 'Figure parmi les 5% des étudiants les plus actifs et mieux notés de la Faculté.',
    earned: true,
    earnedDate: '29 Sept 2026',
    progress: 100,
    xpReward: 800,
  },
  {
    id: 'badge-researcher',
    title: 'Chercheur en Algorithmique',
    category: 'Avancé',
    icon: 'BrainCircuit',
    color: 'rose',
    description: 'Publier une synthèse de recherche ou cours original ayant reçu plus de 50 avis positifs.',
    earned: false,
    earnedDate: null,
    progress: 76,
    xpReward: 1000,
  },
];

export const UY1_LEADERBOARD = [
  { rank: 1, name: 'Jean-Paul Kamga', filiere: 'L3 Info', xp: 5120, badges: 9, avatarBg: '#6366f1' },
  { rank: 2, name: 'Christelle Mvondo', filiere: 'L2 Maths-Info', xp: 4210, badges: 7, avatarBg: '#10b981' },
  { rank: 3, name: 'Yanick Fotsing (Moi)', filiere: 'L2 Info', xp: 3450, badges: 5, avatarBg: '#8b5cf6', isCurrentUser: true },
  { rank: 4, name: 'Éric Talla', filiere: 'M1 Génie Logiciel', xp: 2980, badges: 6, avatarBg: '#f59e0b' },
  { rank: 5, name: 'Vanessa Manga', filiere: 'L3 Info', xp: 2640, badges: 4, avatarBg: '#ec4899' },
];

export const SAMPLE_PLAGIARISM_CASES = [
  {
    id: 'case-original',
    title: 'TP original : Implémentation Arbre Binaire ABR en C (INF231)',
    text: `/* Travaux Pratiques INF231 - Université de Yaoundé I */
/* Auteur : Binôme Étudiants Licence 2 */
#include <stdio.h>
#include <stdlib.h>

typedef struct NoeudABR {
    int valeur;
    struct NoeudABR *sousArbreGauche;
    struct NoeudABR *sousArbreDroit;
} NoeudABR;

NoeudABR* creerNouveauNoeud(int cle) {
    NoeudABR *nouveau = (NoeudABR*)malloc(sizeof(NoeudABR));
    if (nouveau == NULL) {
        fprintf(stderr, "Erreur fatale : allocation mémoire impossible\\n");
        exit(EXIT_FAILURE);
    }
    nouveau->valeur = cle;
    nouveau->sousArbreGauche = NULL;
    nouveau->sousArbreDroit = NULL;
    return nouveau;
}

void parcoursInfixeRecursif(NoeudABR *racine) {
    if (racine != NULL) {
        parcoursInfixeRecursif(racine->sousArbreGauche);
        printf("%d -> ", racine->valeur);
        parcoursInfixeRecursif(racine->sousArbreDroit);
    }
}`,
    expectedScore: 4,
    status: 'ORIGINAL',
    matches: [
      { source: 'Bibliothèque standard C / stdlib.h', similarity: '3%', snippet: 'fprintf(stderr, ...)' },
    ],
  },
  {
    id: 'case-plagiarized',
    title: 'Rapport copié : Définition des conditions de Coffman (Interblocage)',
    text: `L'interblocage (deadlock) est une situation dans laquelle deux ou plusieurs processus s'attendent mutuellement sur des ressources sans jamais pouvoir continuer.
Pour qu'un interblocage apparaisse, quatre conditions nécessaires formulées par Edward G. Coffman en 1971 doivent être simultanément vérifiées :
1. L'exclusion mutuelle : Au moins une ressource doit être non partageable.
2. La rétention et l'attente : Des processus détiennent des ressources tout en attendant l'attribution d'autres ressources.
3. L'absence de préemption : Les ressources accordées à un processus ne peuvent pas lui être retirées de force avant leur libération volontaire.
4. L'attente circulaire : Il existe une chaîne fermée de processus dans laquelle chaque processus attend une ressource détenue par le processus suivant dans la boucle.`,
    expectedScore: 84,
    status: 'PLAGIAT_DETECTE',
    matches: [
      { source: 'Polycopié INF211 Systèmes d\'Exploitation UY1 (Chapitre 4)', similarity: '62%', snippet: 'quatre conditions nécessaires formulées par Edward G. Coffman en 1971...' },
      { source: 'Wikipédia / Interblocage informatique', similarity: '22%', snippet: 'Il existe une chaîne fermée de processus dans laquelle chaque processus...' },
    ],
  },
];
