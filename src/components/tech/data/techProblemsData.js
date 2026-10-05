/**
 * Problèmes académiques & templates pour le Pôle Informatique & Génie Logiciel
 * Conformes aux programmes des universités camerounaises (UY1, ENSPY, Univ. Douala, etc.)
 */

export const TECH_CHALLENGES = [
  {
    id: 'c-trees',
    title: 'Arbres Binaires de Recherche (ABR) & Parcours Infixe en C',
    language: 'c',
    level: 'Licence 2 (L2) / INF201 UY1',
    university: 'Université de Yaoundé I',
    codeUe: 'INF201',
    description: 'Implémentation de l\'insertion d\'un nœud dans un ABR et affichage trié des éléments par parcours infixe (gauche, racine, droite).',
    starterCode: `// CampusHub UY1 - INF201 : Arbre Binaire de Recherche
#include <stdio.h>
#include <stdlib.h>

typedef struct Node {
    int data;
    struct Node* left;
    struct Node* right;
} Node;

Node* createNode(int val) {
    Node* n = (Node*)malloc(sizeof(Node));
    n->data = val;
    n->left = n->right = NULL;
    return n;
}

Node* insert(Node* root, int val) {
    if (root == NULL) return createNode(val);
    if (val < root->data) root->left = insert(root->left, val);
    else root->right = insert(root->right, val);
    return root;
}

void inorder(Node* root) {
    if (root != NULL) {
        inorder(root->left);
        printf("%d -> ", root->data);
        inorder(root->right);
    }
}

int main() {
    printf("=== Test ABR - Département Informatique UY1 ===\\n");
    Node* root = NULL;
    int notes[] = {14, 8, 18, 5, 11, 16, 20};
    for(int i = 0; i < 7; i++) {
        root = insert(root, notes[i]);
    }
    printf("Parcours Infixe (Tri croissant) :\\n");
    inorder(root);
    printf("FIN\\n");
    return 0;
}`,
    expectedOutput: `=== Test ABR - Département Informatique UY1 ===
Parcours Infixe (Tri croissant) :
5 -> 8 -> 11 -> 14 -> 16 -> 18 -> 20 -> FIN`,
  },
  {
    id: 'py-dijkstra',
    title: 'Algorithme de Dijkstra & Plus Court Chemin en Python',
    language: 'python',
    level: 'Niveau 3 / ENSPY Polytechnique',
    university: 'Polytechnique Yaoundé',
    codeUe: 'INFO304',
    description: 'Recherche du plus court chemin entre les carrefours du campus de Yaoundé (Ngoa-Ekellé, Poste Centrale, Melen, Bastos).',
    starterCode: `# CampusHub ENSPY - Algorithme de Dijkstra (Graphe Pondéré)
import heapq

def dijkstra(graph, start):
    distances = {node: float('inf') for node in graph}
    distances[start] = 0
    pq = [(0, start)]
    
    while pq:
        current_dist, current_node = heapq.heappop(pq)
        
        if current_dist > distances[current_node]:
            continue
            
        for neighbor, weight in graph[current_node].items():
            distance = current_dist + weight
            if distance < distances[neighbor]:
                distances[neighbor] = distance
                heapq.heappush(pq, (distance, neighbor))
                
    return distances

# Réseau routier simplifié Yaoundé
campus_network = {
    'Ngoa-Ekellé': {'Poste Centrale': 4, 'Melen': 2},
    'Melen': {'Ngoa-Ekellé': 2, 'Biyem-Assi': 3, 'Poste Centrale': 3},
    'Poste Centrale': {'Ngoa-Ekellé': 4, 'Melen': 3, 'Bastos': 5},
    'Biyem-Assi': {'Melen': 3, 'Mendong': 2},
    'Mendong': {'Biyem-Assi': 2},
    'Bastos': {'Poste Centrale': 5}
}

print("=== Calcul des plus courts trajets depuis Ngoa-Ekellé ===")
resultats = dijkstra(campus_network, 'Ngoa-Ekellé')
for dest, distance in sorted(resultats.items()):
    print(f"Vers {dest:15} : {distance} km")
`,
    expectedOutput: `=== Calcul des plus courts trajets depuis Ngoa-Ekellé ===
Vers Bastos          : 9 km
Vers Biyem-Assi      : 5 km
Vers Melen           : 2 km
Vers Mendong         : 7 km
Vers Ngoa-Ekellé     : 0 km
Vers Poste Centrale  : 4 km`,
  },
  {
    id: 'c-posix',
    title: 'Synchronisation POSIX : Sémaphores & Mutex en C',
    language: 'c',
    level: 'Licence 2 (L2) / INF211 Systèmes d\'Exploitation',
    university: 'Université de Douala',
    codeUe: 'INFO211',
    description: 'Prévention des conditions de course (Race Condition) sur une variable partagée avec exclusion mutuelle.',
    starterCode: `// CampusHub UDo - Exclusion Mutuelle POSIX
#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>

#define NUM_THREADS 4
#define ITERATIONS 1000

int solde_compte = 150000; // Solde partagé (FCFA)
pthread_mutex_t verrou;

void* deposer(void* arg) {
    int id = *((int*)arg);
    for (int i = 0; i < ITERATIONS; i++) {
        pthread_mutex_lock(&verrou);
        solde_compte += 10;
        pthread_mutex_unlock(&verrou);
    }
    printf("Thread [%d] a terminé ses dépôts.\\n", id);
    return NULL;
}

int main() {
    pthread_t threads[NUM_THREADS];
    int thread_ids[NUM_THREADS];
    pthread_mutex_init(&verrou, NULL);
    
    printf("Solde initial : %d FCFA\\n", solde_compte);
    for (int i = 0; i < NUM_THREADS; i++) {
        thread_ids[i] = i + 1;
        pthread_create(&threads[i], NULL, deposer, &thread_ids[i]);
    }
    
    for (int i = 0; i < NUM_THREADS; i++) {
        pthread_join(threads[i], NULL);
    }
    
    pthread_mutex_destroy(&verrou);
    printf("Solde final garanti sans race condition : %d FCFA\\n", solde_compte);
    return 0;
}`,
    expectedOutput: `Solde initial : 150000 FCFA
Thread [1] a terminé ses dépôts.
Thread [2] a terminé ses dépôts.
Thread [3] a terminé ses dépôts.
Thread [4] a terminé ses dépôts.
Solde final garanti sans race condition : 190000 FCFA`,
  },
  {
    id: 'sql-db',
    title: 'Requêtes SQL Avancées : Jointures, Vues & Agrégations',
    language: 'sql',
    level: 'Licence 2 / Licence 3 / Bases de Données SGBD',
    university: 'Université de Yaoundé I & Polytech',
    codeUe: 'INF204',
    description: 'Analyse des inscriptions académiques et calcul des moyennes de promotions universitaires camerounaises.',
    starterCode: `-- Base de Données CampusHub Cameroun (SGBD Relationnel)
-- Création et requêtes d'analyse

SELECT 
    etudiants.matricule,
    etudiants.nom,
    etudiants.filiere,
    COUNT(inscriptions.code_ue) AS total_cours_inscrits,
    ROUND(AVG(evaluations.note), 2) AS moyenne_generale,
    CASE 
        WHEN AVG(evaluations.note) >= 16 THEN 'Mention Très Bien'
        WHEN AVG(evaluations.note) >= 14 THEN 'Mention Bien'
        WHEN AVG(evaluations.note) >= 12 THEN 'Mention Assez Bien'
        ELSE 'Passable'
    END AS mention
FROM etudiants
JOIN inscriptions ON etudiants.id = inscriptions.etudiant_id
JOIN evaluations ON inscriptions.id = evaluations.inscription_id
WHERE etudiants.universite = 'UY1'
GROUP BY etudiants.id, etudiants.nom, etudiants.filiere
ORDER BY moyenne_generale DESC;`,
    expectedOutput: `+------------+--------------------+----------------+----------------------+------------------+-------------------+
| matricule  | nom                | filiere        | total_cours_inscrits | moyenne_generale | mention           |
+------------+--------------------+----------------+----------------------+------------------+-------------------+
| 23S40192   | Yan Fotsing        | Informatique   | 8                    | 17.50            | Mention Très Bien |
| 23S10482   | Samuel Ndzie       | Informatique   | 8                    | 16.20            | Mention Très Bien |
| 22S84912   | Marcelle Eyenga    | Informatique   | 7                    | 14.80            | Mention Bien      |
| 23S77142   | Patrick Kouam      | Mathématiques  | 6                    | 13.40            | Mention Assez Bien|
+------------+--------------------+----------------+----------------------+------------------+-------------------+
(4 lignes analysées en 1.8 ms)`,
  },
  {
    id: 'js-async',
    title: 'Microservices & Traitement Asynchrone en JavaScript',
    language: 'javascript',
    level: 'Master 1 Génie Logiciel / Node.js',
    university: 'University of Buea (FET)',
    codeUe: 'CEF408',
    description: 'Traitement concurrent de flux de données d\'examens avec Promesses et async/await.',
    starterCode: `// CampusHub Buea - Traitement Asynchrone des Bulletins
async function fetchCourseGrades(courseCode) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                course: courseCode,
                totalStudents: 140,
                successRate: '88.4%',
                averageScore: 14.2
            });
        }, 120);
    });
}

async function generateAcademicReport() {
    console.log("=== Début de la compilation nationale des notes ===");
    const courses = ['INF201', 'INF211', 'MAT201', 'PHY203'];
    
    const results = await Promise.all(
        courses.map(code => fetchCourseGrades(code))
    );
    
    results.forEach(res => {
        console.log(\`[UE: \${res.course}] - Taux de réussite: \${res.successRate} (Moyenne: \${res.averageScore}/20)\`);
    });
    console.log("=== Synthèse achevée avec succès ===");
}

generateAcademicReport();`,
    expectedOutput: `=== Début de la compilation nationale des notes ===
[UE: INF201] - Taux de réussite: 88.4% (Moyenne: 14.2/20)
[UE: INF211] - Taux de réussite: 88.4% (Moyenne: 14.2/20)
[UE: MAT201] - Taux de réussite: 88.4% (Moyenne: 14.2/20)
[UE: PHY203] - Taux de réussite: 88.4% (Moyenne: 14.2/20)
=== Synthèse achevée avec succès ===`,
  },
];

export const BIG_O_COMPLEXITIES = [
  {
    notation: 'O(1)',
    name: 'Temps Constant',
    evaluation: 'Excellent',
    color: '#10b981',
    description: 'Accès par index dans un tableau ou recherche par clé dans une table de hachage.',
    cExample: 'int x = tab[3];',
  },
  {
    notation: 'O(log n)',
    name: 'Temps Logarithmique',
    evaluation: 'Très Bon',
    color: '#0ea5e9',
    description: 'Recherche dichotomique dans un tableau trié ou recherche dans un Arbre Binaire Équilibré (AVL).',
    cExample: 'binary_search(tab, 0, n - 1, val);',
  },
  {
    notation: 'O(n)',
    name: 'Temps Linéaire',
    evaluation: 'Acceptable',
    color: '#f59e0b',
    description: 'Parcours séquentiel d\'une liste simplement chaînée ou recherche du maximum.',
    cExample: 'for (int i = 0; i < n; i++) { ... }',
  },
  {
    notation: 'O(n log n)',
    name: 'Temps Quasi-Linéaire',
    evaluation: 'Standard de Tri',
    color: '#6366f1',
    description: 'Algorithmes de tri optimaux comme Tri Fusion (MergeSort) ou Tri Rapide moyen (QuickSort).',
    cExample: 'merge_sort(tab, 0, n - 1);',
  },
  {
    notation: 'O(n²)',
    name: 'Temps Quadratique',
    evaluation: 'À Éviter pour n > 10 000',
    color: '#ef4444',
    description: 'Tri à bulles, tri par sélection ou doubles boucles imbriquées sans optimisation.',
    cExample: 'for(i) { for(j) { ... } }',
  },
];

export const UNIX_POSIX_COMMANDS = [
  { syscall: 'fork()', purpose: 'Création d\'un nouveau processus enfant (duplication du contexte)', category: 'Processus' },
  { syscall: 'execvp()', purpose: 'Remplacement de l\'image mémoire par un nouvel exécutable binaire', category: 'Processus' },
  { syscall: 'pipe()', purpose: 'Canal unidirectionnel de communication inter-processus (IPC)', category: 'IPC' },
  { syscall: 'pthread_create()', purpose: 'Instanciation d\'un thread léger partageant l\'espace d\'adressage', category: 'Threads' },
  { syscall: 'sem_wait() / sem_post()', purpose: 'Primitives P et V de Dijkstra pour synchronisation et section critique', category: 'Sémaphores' },
  { syscall: 'socket() / bind() / listen()', purpose: 'Primitives réseau TCP/IP pour architecture client-serveur', category: 'Réseau' },
];
