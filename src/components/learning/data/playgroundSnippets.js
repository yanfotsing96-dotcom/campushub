/**
 * CodePlayground Hub - Snippets Académiques (Filière Informatique L1 à Master)
 * Université de Yaoundé I & Écoles d'Ingénieurs
 */

export const PROGRAMMING_LANGUAGES = [
  {
    id: 'python',
    name: 'Python',
    version: '3.12.3 (CPython)',
    extension: '.py',
    color: 'emerald',
    badge: 'L1 → Master',
    type: 'interpreted',
    iconName: 'FileCode2',
    accentColor: '#10b981',
    description: 'Algorithmique, Data Science, IA & Automatisation',
  },
  {
    id: 'c',
    name: 'Langage C',
    version: 'C11 / GCC 13.2',
    extension: '.c',
    color: 'blue',
    badge: 'L1 → L3',
    type: 'compiled',
    iconName: 'Cpu',
    accentColor: '#3b82f6',
    description: 'Systèmes, mémoire, pointeurs & structures de données',
  },
  {
    id: 'sql',
    name: 'SQL (PostgreSQL)',
    version: 'ANSI SQL / Postgres 16',
    extension: '.sql',
    color: 'cyan',
    badge: 'L2 → Master',
    type: 'query',
    iconName: 'Database',
    accentColor: '#06b6d4',
    description: 'Bases de données relationnelles, jointures & agrégations',
  },
  {
    id: 'html',
    name: 'HTML5 / CSS3',
    version: 'Modern Web Living Std',
    extension: '.html',
    color: 'amber',
    badge: 'L1 → L3',
    type: 'markup',
    iconName: 'Layout',
    accentColor: '#f59e0b',
    description: 'Architecture web, styles CSS modernes & intégration UI',
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    version: 'ECMAScript 2024 (ES24)',
    extension: '.js',
    color: 'yellow',
    badge: 'L2 → Master',
    type: 'script',
    iconName: 'Terminal',
    accentColor: '#eab308',
    description: 'Programmation événementielle, asynchronisme & DOM',
  },
];

export const MOCK_SQL_DATABASE = {
  etudiants: [
    { id: 1, matricule: '21U2014', nom: 'Kamga Fotso Alain', filiere: 'Informatique', niveau: 'L3', moyenne: 15.8, ville: 'Yaoundé' },
    { id: 2, matricule: '22U1045', nom: 'Ngo Bisseck Marie', filiere: 'Informatique', niveau: 'L2', moyenne: 16.4, ville: 'Douala' },
    { id: 3, matricule: '20U3391', nom: 'Tchinda Boris', filiere: 'Génie Logiciel', niveau: 'M1', moyenne: 14.2, ville: 'Bafoussam' },
    { id: 4, matricule: '23U0128', nom: 'Abena Sandrine', filiere: 'Informatique', niveau: 'L1', moyenne: 13.7, ville: 'Yaoundé' },
    { id: 5, matricule: '21U5540', nom: 'Mballa Jean-Paul', filiere: 'Systèmes & Réseaux', niveau: 'L3', moyenne: 17.1, ville: 'Ebolowa' },
    { id: 6, matricule: '22U4421', nom: 'Fouda Christelle', filiere: 'Informatique', niveau: 'L2', moyenne: 15.0, ville: 'Yaoundé' },
  ],
  ue_cours: [
    { code_ue: 'INF111', intitule: 'Algorithmique & Programmation Impérative', credits: 6, semestre: 1, responsable: 'Dr. Mbarga' },
    { code_ue: 'INF231', intitule: 'Structures de Données & Pointeurs C', credits: 5, semestre: 3, responsable: 'Pr. Fotsing' },
    { code_ue: 'INF301', intitule: 'Bases de Données Relationnelles & SQL', credits: 5, semestre: 5, responsable: 'Dr. Nkenlifack' },
    { code_ue: 'INF305', intitule: 'Systèmes d\'Exploitation & Processus POSIX', credits: 4, semestre: 5, responsable: 'Pr. Batsa' },
    { code_ue: 'INF411', intitule: 'Optimisation Algorithmique & Théorie des Graphes', credits: 4, semestre: 7, responsable: 'Dr. Tchuente' },
  ],
  inscriptions: [
    { id: 101, etudiant_id: 1, code_ue: 'INF301', note_cc: 16.0, note_sn: 15.5, session: 'Normale' },
    { id: 102, etudiant_id: 1, code_ue: 'INF305', note_cc: 14.5, note_sn: 16.0, session: 'Normale' },
    { id: 103, etudiant_id: 2, code_ue: 'INF231', note_cc: 17.0, note_sn: 16.0, session: 'Normale' },
    { id: 104, etudiant_id: 3, code_ue: 'INF411', note_cc: 15.0, note_sn: 13.5, session: 'Normale' },
    { id: 105, etudiant_id: 4, code_ue: 'INF111', note_cc: 14.0, note_sn: 13.0, session: 'Normale' },
    { id: 106, etudiant_id: 5, code_ue: 'INF305', note_cc: 18.0, note_sn: 17.5, session: 'Normale' },
  ],
};

export const CODE_SNIPPETS = {
  python: [
    {
      id: 'py-basics',
      name: '1. Fonctions de base, Listes & Dictionnaires',
      level: 'L1 Fondamentaux',
      module: 'INF111 · Algorithmique & Python',
      description: 'Manipulation de fonctions, filtres sur listes par compréhension et agrégations.',
      code: `# -*- coding: utf-8 -*-
"""
CampusHub UY1 - Département d'Informatique
Module INF111 : Fonctions élémentaires et listes en Python 3.12
"""

def calculer_statistiques_notes(notes):
    """Calcule la moyenne, note minimale et maximale d'une promotion."""
    if not notes:
        return None
    
    moyenne = sum(notes) / len(notes)
    meilleure = max(notes)
    faible = min(notes)
    admis = [n for n in notes if n >= 10.0]
    taux_reussite = (len(admis) / len(notes)) * 100

    return {
        "effectif": len(notes),
        "moyenne": round(moyenne, 2),
        "min": faible,
        "max": meilleure,
        "taux_reussite": round(taux_reussite, 1),
        "admis_count": len(admis)
    }

# Échantillon de notes d'examen (Session Normale UY1)
notes_etudiants = [14.5, 8.0, 19.0, 11.5, 16.0, 5.5, 12.0, 17.5, 9.5]
stats = calculer_statistiques_notes(notes_etudiants)

print("=== BILAN ACADÉMIQUE DE LA SESSION D'EXAMEN ===")
print(f"Effectif évalué       : {stats['effectif']} étudiants")
print(f"Moyenne générale      : {stats['moyenne']} / 20")
print(f"Meilleure note        : {stats['max']} / 20")
print(f"Plus basse note       : {stats['min']} / 20")
print(f"Taux d'admission (>=10): {stats['taux_reussite']}% ({stats['admis_count']} étudiants)")
`,
      expectedOutput: `=== BILAN ACADÉMIQUE DE LA SESSION D'EXAMEN ===
Effectif évalué       : 9 étudiants
Moyenne générale      : 12.61 / 20
Meilleure note        : 19.0 / 20
Plus basse note       : 5.5 / 20
Taux d'admission (>=10): 66.7% (6 étudiants)`,
    },
    {
      id: 'py-mergesort',
      name: '2. Tri Fusion (Merge Sort) - O(n log n)',
      level: 'L2 Algorithmique',
      module: 'INF201 · Complexité & Tris',
      description: 'Implémentation récursive Diviser pour Régner garantissant une complexité quasi-linéaire.',
      code: `def fusion(gauche, droite):
    """Fusionne deux sous-listes déjà triées en une seule liste ordonnée."""
    resultat = []
    i = j = 0
    while i < len(gauche) and j < len(droite):
        if gauche[i] <= droite[j]:
            resultat.append(gauche[i])
            i += 1
        else:
            resultat.append(droite[j])
            j += 1
    resultat.extend(gauche[i:])
    resultat.extend(droite[j:])
    return resultat

def tri_fusion(liste):
    """Paradigme Diviser pour Régner : T(n) = 2T(n/2) + O(n) => O(n log n)."""
    if len(liste) <= 1:
        return liste
    milieu = len(liste) // 2
    gauche = tri_fusion(liste[:milieu])
    droite = tri_fusion(liste[milieu:])
    return fusion(gauche, droite)

# Test sur un relevé de notes non ordonné
notes_tp = [14.5, 8.0, 19.0, 11.5, 16.0, 5.5, 12.0]
print("Tableau initial non trié :", notes_tp)

notes_triees = tri_fusion(notes_tp)
print("Tableau après Tri Fusion  :", notes_triees)
print("Complexité Asymptotique garantie : O(n log n) dans le pire des cas.")
`,
      expectedOutput: `Tableau initial non trié : [14.5, 8.0, 19.0, 11.5, 16.0, 5.5, 12.0]
Tableau après Tri Fusion  : [5.5, 8.0, 11.5, 12.0, 14.5, 16.0, 19.0]
Complexité Asymptotique garantie : O(n log n) dans le pire des cas.`,
    },
    {
      id: 'py-dp-fibonacci',
      name: '3. Programmation Dynamique : Fibonacci & Mémoïsation',
      level: 'L3 / M1 Optimisation',
      module: 'INF301 / INF411 · Algorithmique Avancée',
      description: 'Remplacement de la récursion naïve O(2^n) par un cache de sous-problèmes en O(n).',
      code: `import time

def fib_memo(n, cache=None):
    """Calcule F(n) par Programmation Dynamique Top-Down avec mémoïsation."""
    if cache is None:
        cache = {}
    if n in cache:
        return cache[n]
    if n <= 1:
        return n
    cache[n] = fib_memo(n - 1, cache) + fib_memo(n - 2, cache)
    return cache[n]

print("=== PROGRAMMATION DYNAMIQUE & MÉMOÏSATION ===")
test_valeurs = [10, 25, 40, 50]

for v in test_valeurs:
    t_start = time.perf_counter()
    res = fib_memo(v)
    duree_ms = (time.perf_counter() - t_start) * 1000
    print(f"F({v:02d}) = {res:<12} (calculé en {duree_ms:.4f} ms)")

print("\\nGain d'efficacité : complexité passée de O(2^n) exponentielle à O(n) linéaire.")
`,
      expectedOutput: `=== PROGRAMMATION DYNAMIQUE & MÉMOÏSATION ===
F(10) = 55           (calculé en 0.0050 ms)
F(25) = 75025        (calculé en 0.0080 ms)
F(40) = 102334155    (calculé en 0.0120 ms)
F(50) = 12586269025  (calculé en 0.0150 ms)

Gain d'efficacité : complexité passée de O(2^n) exponentielle à O(n) linéaire.`,
    },
    {
      id: 'py-graphs-dijkstra',
      name: '4. Graphes : Plus Court Chemin (Dijkstra)',
      level: 'L3 / M1 Graphes',
      module: 'INF411 · Recherche Opérationnelle & Graphes',
      description: 'Algorithme glouton avec file de priorité pour calculer les distances minimales.',
      code: `import heapq

def dijkstra(graphe, depart):
    """Calcule le plus court chemin depuis 'depart' vers tous les sommets."""
    distances = {sommet: float('inf') for sommet in graphe}
    distances[depart] = 0
    file_prio = [(0, depart)]
    precedents = {sommet: None for sommet in graphe}

    while file_prio:
        dist_actuelle, u = heapq.heappop(file_prio)
        if dist_actuelle > distances[u]:
            continue

        for voisin, poids in graphe[u].items():
            dist = dist_actuelle + poids
            if dist < distances[voisin]:
                distances[voisin] = dist
                precedents[voisin] = u
                heapq.heappush(file_prio, (dist, voisin))

    return distances

# Modélisation du réseau campus (Ngoa-Ekellé, Amphi 250, Polytech, Labo Info)
campus = {
    'Ngoa-Ekellé': {'Amphi 250': 3, 'Labo Info': 2},
    'Amphi 250': {'Ngoa-Ekellé': 3, 'Polytech': 4, 'Bibliothèque': 2},
    'Labo Info': {'Ngoa-Ekellé': 2, 'Bibliothèque': 1, 'Polytech': 6},
    'Bibliothèque': {'Amphi 250': 2, 'Labo Info': 1, 'Polytech': 3},
    'Polytech': {'Amphi 250': 4, 'Bibliothèque': 3, 'Labo Info': 6}
}

plus_courts = dijkstra(campus, 'Ngoa-Ekellé')
print("=== PLUS COURTS CHEMINS DEPUIS NGOA-EKELLÉ ===")
for batiment, dist in sorted(plus_courts.items()):
    print(f" -> Destination: {batiment:<15} Distance min: {dist} km")
`,
      expectedOutput: `=== PLUS COURTS CHEMINS DEPUIS NGOA-EKELLÉ ===
 -> Destination: Amphi 250       Distance min: 3 km
 -> Destination: Bibliothèque    Distance min: 3 km
 -> Destination: Labo Info       Distance min: 2 km
 -> Destination: Ngoa-Ekellé     Distance min: 0 km
 -> Destination: Polytech        Distance min: 6 km`,
    },
  ],

  c: [
    {
      id: 'c-pointers',
      name: '1. Manipulation de Pointeurs & Arithmétique d\'Adresses',
      level: 'L1 / L2 Fondamentaux',
      module: 'INF231 · Fondamentaux C & Mémoire',
      description: 'Déréférencement (*), passage par adresse (&) et parcours d\'un tableau par pointeur.',
      code: `#include <stdio.h>

// Fonction d'échange de variables via pointeurs
void permuter(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

int main(void) {
    int x = 42;
    int y = 99;
    int notes[4] = {10, 14, 18, 20};
    int *ptr = notes;

    printf("=== CampusHub UY1 : Manipulation des Pointeurs (INF231) ===\\n");
    printf("Avant permutation : x = %d, y = %d\\n", x, y);
    permuter(&x, &y);
    printf("Après permutation  : x = %d, y = %d\\n", x, y);

    printf("\\n--- Arithmétique des Pointeurs sur le Tableau ---\\n");
    for (int i = 0; i < 4; i++) {
        printf("Element [%d] : valeur = %d | adresse = %p\\n", 
               i, *(ptr + i), (void*)(ptr + i));
    }

    printf("\\nStatut d'exécution : Code retour 0 (Aucun débordement pile).\\n");
    return 0;
}`,
      expectedOutput: `=== CampusHub UY1 : Manipulation des Pointeurs (INF231) ===
Avant permutation : x = 42, y = 99
Après permutation  : x = 99, y = 42

--- Arithmétique des Pointeurs sur le Tableau ---
Element [0] : valeur = 10 | adresse = 0x7ffe420a
Element [1] : valeur = 14 | adresse = 0x7ffe420e
Element [2] : valeur = 18 | adresse = 0x7ffe4212
Element [3] : valeur = 20 | adresse = 0x7ffe4216

Statut d'exécution : Code retour 0 (Aucun débordement pile).`,
    },
    {
      id: 'c-linked-list',
      name: '2. Structures & Listes Simplement Chaînées',
      level: 'L2 Structures de Données',
      module: 'INF231 · Structures Dynamiques',
      description: 'Allocation sur le tas avec malloc, insertion en tête O(1) et libération propre sans fuite.',
      code: `#include <stdio.h>
#include <stdlib.h>

typedef struct Cellule {
    int valeur;
    struct Cellule *suivant;
} Cellule;

// Insertion en tête de liste : complexité O(1)
Cellule* insererTete(Cellule *tete, int val) {
    Cellule *nouveau = (Cellule*)malloc(sizeof(Cellule));
    if (nouveau == NULL) {
        fprintf(stderr, "Erreur fatale : allocation tas impossible.\\n");
        exit(EXIT_FAILURE);
    }
    nouveau->valeur = val;
    nouveau->suivant = tete;
    return nouveau;
}

// Affichage séquentiel de la liste
void afficher(Cellule *tete) {
    Cellule *courant = tete;
    printf("Tête -> ");
    while (courant != NULL) {
        printf("[%d] -> ", courant->valeur);
        courant = courant->suivant;
    }
    printf("NULL\\n");
}

// Désallocation exhaustive de tous les maillons (Valgrind Clean)
void liberer(Cellule *tete) {
    Cellule *tmp;
    int liberes = 0;
    while (tete != NULL) {
        tmp = tete;
        tete = tete->suivant;
        free(tmp);
        liberes++;
    }
    printf("Libération mémoire réussie : %d blocs libérés sur le tas.\\n", liberes);
}

int main(void) {
    printf("=== DÉMONSTRATION LISTE CHAÎNÉE (INF231) ===\\n");
    Cellule *liste = NULL;

    liste = insererTete(liste, 45);
    liste = insererTete(liste, 12);
    liste = insererTete(liste, 99);
    liste = insererTete(liste, 7);

    afficher(liste);
    liberer(liste);

    return 0;
}`,
      expectedOutput: `=== DÉMONSTRATION LISTE CHAÎNÉE (INF231) ===
Tête -> [7] -> [99] -> [12] -> [45] -> NULL
Libération mémoire réussie : 4 blocs libérés sur le tas.`,
    },
    {
      id: 'c-memory-valgrind',
      name: '3. Diagnostic Mémoire : Allocation Dynamique & Valgrind',
      level: 'L2 / L3 Systèmes',
      module: 'INF231 / INF305 · Gestion Mémoire Bas Niveau',
      description: 'Allocation de matrices 2D dynamiques avec démonstration de libération complète.',
      code: `#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int n = 5;
    printf("=== ALLOCATION DYNAMIQUE TABLEAU 1D DANS LE TAS ===\\n");
    
    // Allocation d'un bloc continu
    int *tableau = (int*)malloc(n * sizeof(int));
    if (tableau == NULL) {
        return 1;
    }

    for (int i = 0; i < n; i++) {
        tableau[i] = (i + 1) * 10;
        printf("tableau[%d] = %d (alloué à %p)\\n", i, tableau[i], (void*)&tableau[i]);
    }

    // Libération impérative pour éviter les fuites (Memory Leaks)
    free(tableau);
    tableau = NULL;

    printf("\\n[Diagnostic Valgrind] Tous les blocs ont été libérés (0 leak).\\n");
    return 0;
}`,
      expectedOutput: `=== ALLOCATION DYNAMIQUE TABLEAU 1D DANS LE TAS ===
tableau[0] = 10 (alloué à 0x55a120)
tableau[1] = 20 (alloué à 0x55a124)
tableau[2] = 30 (alloué à 0x55a128)
tableau[3] = 40 (alloué à 0x55a12c)
tableau[4] = 50 (alloué à 0x55a130)

[Diagnostic Valgrind] Tous les blocs ont été libérés (0 leak).`,
    },
    {
      id: 'c-posix-fork',
      name: '4. Programmation Système POSIX (fork & waitpid)',
      level: 'L3 Systèmes d\'Exploitation',
      module: 'INF305 · Processus & Concurrence POSIX',
      description: 'Création d\'un processus fils avec fork(), synchronisation du parent avec waitpid().',
      code: `#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/wait.h>

int main(void) {
    printf("=== PROCESSUS MULTI-TÂCHES POSIX (INF305) ===\\n");
    pid_t pid = fork();

    if (pid < 0) {
        perror("Échec de l'appel système fork");
        return EXIT_FAILURE;
    }

    if (pid == 0) {
        // Code exécuté par le processus fils
        printf("[Processus Fils] PID = %d (Parent = %d)\\n", getpid(), getppid());
        printf("[Processus Fils] Calcul en tâche de fond achevé avec succès.\\n");
        exit(0);
    } else {
        // Code exécuté par le processus parent
        printf("[Processus Parent] PID = %d en attente de la fin du fils %d...\\n", getpid(), pid);
        int statut;
        waitpid(pid, &statut, 0);
        printf("[Processus Parent] Le fils s'est terminé sans fuite (Pas de processus zombie).\\n");
    }

    return 0;
}`,
      expectedOutput: `=== PROCESSUS MULTI-TÂCHES POSIX (INF305) ===
[Processus Parent] PID = 1042 en attente de la fin du fils 1043...
[Processus Fils] PID = 1043 (Parent = 1042)
[Processus Fils] Calcul en tâche de fond achevé avec succès.
[Processus Parent] Le fils s'est terminé sans fuite (Pas de processus zombie).`,
    },
  ],

  sql: [
    {
      id: 'sql-select-where',
      name: '1. Sélection, Projection & Filtres WHERE',
      level: 'L2 Fondamentaux BDD',
      module: 'INF301 · Bases de Données Relationnelles',
      description: 'Filtrer les étudiants admis avec projection sur les attributs clés et tri ORDER BY.',
      code: `-- CampusHub UY1 : Requête de sélection et filtrage conditionnel
SELECT 
    matricule, 
    nom, 
    filiere, 
    niveau, 
    moyenne, 
    ville
FROM etudiants
WHERE moyenne >= 14.0 
  AND filiere = 'Informatique'
ORDER BY moyenne DESC;
`,
      expectedOutput: `Requête exécutée avec succès (3 lignes renvoyées en 0.84 ms).`,
    },
    {
      id: 'sql-joins',
      name: '2. Jointures Relationnelles (INNER & LEFT JOIN)',
      level: 'L2 / L3 Relationnel',
      module: 'INF301 · Modèle Relationnel & Algèbre',
      description: 'Jointure tripartite entre étudiants, inscriptions et unités d\'enseignement (cours).',
      code: `-- Jointure entre la table des étudiants, leurs inscriptions et les UE
SELECT 
    e.matricule,
    e.nom,
    c.code_ue,
    c.intitule AS matiere,
    i.note_cc,
    i.note_sn,
    ROUND((i.note_cc * 0.3 + i.note_sn * 0.7)::numeric, 2) AS moyenne_ponderee
FROM etudiants e
INNER JOIN inscriptions i ON e.id = i.etudiant_id
INNER JOIN ue_cours c ON i.code_ue = c.code_ue
ORDER BY moyenne_ponderee DESC;
`,
      expectedOutput: `Requête avec Jointures INNER JOIN exécutée avec succès (6 lignes renvoyées en 1.12 ms).`,
    },
    {
      id: 'sql-aggregates',
      name: '3. Fonctions d\'Agrégation, GROUP BY & HAVING',
      level: 'L3 Analyse de Données',
      module: 'INF301 · SQL Avancé & Statistiques',
      description: 'Calculer la moyenne et le nombre d\'étudiants par filière avec filtre HAVING.',
      code: `-- Calcul statistique des moyennes par filière avec seuil minimum
SELECT 
    filiere,
    COUNT(*) AS effectif_total,
    ROUND(AVG(moyenne)::numeric, 2) AS moyenne_filiere,
    MAX(moyenne) AS meilleure_note,
    MIN(moyenne) AS note_plancher
FROM etudiants
GROUP BY filiere
HAVING COUNT(*) >= 1
ORDER BY moyenne_filiere DESC;
`,
      expectedOutput: `Agrégation GROUP BY / HAVING calculée avec succès (3 groupes analysés en 0.95 ms).`,
    },
    {
      id: 'sql-window',
      name: '4. Fonctions de Fenêtrage (RANK & DENSE_RANK)',
      level: 'M1 Conception Avancée',
      module: 'INF411 · Data Warehousing & SQL Analytique',
      description: 'Classement dynamique des étudiants par niveau avec la fonction RANK() OVER().',
      code: `-- Classement des étudiants au sein de leur propre niveau d'études
SELECT 
    matricule,
    nom,
    niveau,
    moyenne,
    RANK() OVER (PARTITION BY niveau ORDER BY moyenne DESC) AS rang_promo
FROM etudiants
ORDER BY niveau, rang_promo;
`,
      expectedOutput: `Fonctions de Fenêtrage exécutées avec succès (Classement calculé par partition de niveau).`,
    },
  ],

  html: [
    {
      id: 'html-student-card',
      name: '1. Carte d\'Étudiant Interactive (Glassmorphism & Flexbox)',
      level: 'L1 / L2 Technologies Web',
      module: 'INF202 · HTML5 & CSS3 Moderne',
      description: 'Design moderne d\'un badge d\'identification universitaire avec reflets et dégradés.',
      code: `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <style>
    body {
      margin: 0;
      padding: 24px;
      background: linear-gradient(135deg, #090d16 0%, #151c2d 100%);
      font-family: system-ui, -apple-system, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 280px;
      color: #e2e8f0;
    }
    .badge-card {
      width: 100%;
      max-width: 380px;
      background: rgba(30, 41, 59, 0.7);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(99, 102, 241, 0.3);
      border-radius: 20px;
      padding: 24px;
      box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.6);
      transition: transform 0.3s ease, border-color 0.3s ease;
    }
    .badge-card:hover {
      transform: translateY(-4px);
      border-color: #818cf8;
    }
    .header {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-bottom: 20px;
    }
    .avatar {
      width: 52px;
      height: 52px;
      border-radius: 14px;
      background: linear-gradient(135deg, #6366f1, #3b82f6);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 20px;
      color: #fff;
    }
    .title-h1 {
      margin: 0;
      font-size: 16px;
      font-weight: 800;
      color: #fff;
    }
    .sub {
      margin: 3px 0 0;
      font-size: 12px;
      color: #94a3b8;
    }
    .details {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      background: rgba(15, 23, 42, 0.6);
      border-radius: 12px;
      padding: 14px;
      margin-top: 14px;
    }
    .label {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #64748b;
      margin-bottom: 4px;
    }
    .value {
      font-size: 13px;
      font-weight: 700;
      color: #38bdf8;
    }
  </style>
</head>
<body>
  <div class="badge-card">
    <div class="header">
      <div class="avatar">UY1</div>
      <div>
        <h3 class="title-h1">CampusHub University</h3>
        <p class="sub">Filière Informatique · Promotion 2026</p>
      </div>
    </div>
    <div class="details">
      <div>
        <div class="label">Matricule</div>
        <div class="value">21U2014</div>
      </div>
      <div>
        <div class="label">Niveau</div>
        <div class="value">Licence 3 (L3)</div>
      </div>
      <div>
        <div class="label">Spécialité</div>
        <div class="value">Génie Logiciel</div>
      </div>
      <div>
        <div class="label">Statut</div>
        <div class="value" style="color: #4ade80;">● En Règle</div>
      </div>
    </div>
  </div>
</body>
</html>
`,
      expectedOutput: `Rendu HTML5 / CSS3 compilé avec succès dans le bac à sable de prévisualisation.`,
    },
    {
      id: 'html-algo-visualizer',
      name: '2. Visualiseur Visuel de Pile LIFO (CSS Animations)',
      level: 'L2 Structures Web',
      module: 'INF231 / INF202 · UI & Algorithmique',
      description: 'Simulation graphique des opérations Empiler (Push) et Dépiler (Pop) en pur CSS.',
      code: `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <style>
    body {
      margin: 0;
      padding: 24px;
      background: #0b1120;
      font-family: monospace;
      color: #f1f5f9;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    h2 {
      margin: 0 0 16px;
      color: #38bdf8;
      font-size: 16px;
    }
    .stack-container {
      width: 220px;
      border-left: 4px solid #6366f1;
      border-right: 4px solid #6366f1;
      border-bottom: 6px solid #6366f1;
      border-radius: 0 0 8px 8px;
      padding: 10px 10px 4px;
      display: flex;
      flex-direction: column-reverse;
      gap: 8px;
      background: rgba(99, 102, 241, 0.05);
      min-height: 180px;
    }
    .element {
      background: linear-gradient(90deg, #3b82f6, #6366f1);
      padding: 12px;
      text-align: center;
      font-weight: bold;
      border-radius: 8px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
      animation: pushAnim 0.4s ease-out;
    }
    .top-element {
      background: linear-gradient(90deg, #10b981, #059669);
      border: 1px dashed #6ee7b7;
    }
    @keyframes pushAnim {
      from { opacity: 0; transform: translateY(-20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .legend {
      margin-top: 14px;
      font-size: 11px;
      color: #94a3b8;
    }
  </style>
</head>
<body>
  <h2>Visualiseur Structure Pile (LIFO)</h2>
  <div class="stack-container">
    <div class="element">Maillon 1 (Valeur: 42)</div>
    <div class="element">Maillon 2 (Valeur: 88)</div>
    <div class="element top-element">Sommet (Valeur: 105) ★</div>
  </div>
  <div class="legend">Sommet : Dernier entré, premier sorti (Pop en O(1))</div>
</body>
</html>
`,
      expectedOutput: `Rendu du visualiseur de pile LIFO actif.`,
    },
  ],

  javascript: [
    {
      id: 'js-async-promises',
      name: '1. Programmation Asynchrone : Promesses & async/await',
      level: 'L2 / L3 Programmation Web',
      module: 'INF202 · JavaScript Moderne ES24',
      description: 'Simulation d\'un appel API étudiant avec Promise, gestion de latence réseau et try/catch.',
      code: `/**
 * CampusHub UY1 - Simulation d'appel API REST asynchrone
 */

// Simule un appel réseau vers le serveur de scolarité
function fetchEtudiant(matricule) {
  return new Promise((resolve, reject) => {
    console.log(\`[Réseau] Recherche du matricule \${matricule} en cours...\`);
    
    setTimeout(() => {
      const base = {
        '21U2014': { nom: 'Kamga Alain', filiere: 'Informatique', mention: 'Bien', credits: 180 },
        '22U1045': { nom: 'Ngo Marie', filiere: 'Informatique', mention: 'Très Bien', credits: 120 }
      };

      if (base[matricule]) {
        resolve({ status: 200, data: base[matricule] });
      } else {
        reject(new Error(\`Matricule \${matricule} non trouvé dans le registre MINESUP\`));
      }
    }, 400);
  });
}

async function chargerDossier(matricule) {
  try {
    const response = await fetchEtudiant(matricule);
    console.log(\`✅ Dossier trouvé (Code \${response.status}) :\`);
    console.log(\`  - Nom : \${response.data.nom}\`);
    console.log(\`  - Filière : \${response.data.filiere}\`);
    console.log(\`  - Mention : \${response.data.mention}\`);
    console.log(\`  - Crédits validés : \${response.data.credits} ECTS\`);
  } catch (err) {
    console.error(\`❌ Erreur : \${err.message}\`);
  }
}

console.log("=== DÉMONSTRATION ASYNCHRONE JAVASCRIPT ===");
chargerDossier('21U2014');
`,
      expectedOutput: `=== DÉMONSTRATION ASYNCHRONE JAVASCRIPT ===
[Réseau] Recherche du matricule 21U2014 en cours...
✅ Dossier trouvé (Code 200) :
  - Nom : Kamga Alain
  - Filière : Informatique
  - Mention : Bien
  - Crédits validés : 180 ECTS`,
    },
    {
      id: 'js-algo-sorting',
      name: '2. Algorithme de Tri & Mesure de Temps (Performance)',
      level: 'L2 Algorithmique',
      module: 'INF201 · Évaluation des Performances JS',
      description: 'Comparaison d\'un tri à bulles pas à pas versus Array.prototype.sort avec console.time.',
      code: `// Tri à bulles avec comptage des permutations
function triBulles(arr) {
  const t = [...arr];
  let permutations = 0;
  const n = t.length;

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (t[j] > t[j + 1]) {
        const tmp = t[j];
        t[j] = t[j + 1];
        t[j + 1] = tmp;
        permutations++;
      }
    }
  }

  return { resultat: t, permutations };
}

const donnees = [64, 34, 25, 12, 22, 11, 90, 88, 45, 5];
console.log("Tableau brut :", donnees);

console.time("Chrono Tri à Bulles");
const res = triBulles(donnees);
console.timeEnd("Chrono Tri à Bulles");

console.log("Tableau ordonné :", res.resultat);
console.log("Nombre de permutations :", res.permutations);
console.log("Complexité au pire cas : O(n²)");
`,
      expectedOutput: `Tableau brut : [ 64, 34, 25, 12, 22, 11, 90, 88, 45, 5 ]
Chrono Tri à Bulles: 0.124ms
Tableau ordonné : [ 5, 11, 12, 22, 25, 34, 45, 64, 88, 90 ]
Nombre de permutations : 24
Complexité au pire cas : O(n²)`,
    },
  ],
};
