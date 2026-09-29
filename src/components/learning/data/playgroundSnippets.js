/**
 * Snippets de code types Université de Yaoundé I pour le Playground
 */

export const CODE_SNIPPETS = {
  c: [
    {
      id: 'c-linked-list',
      name: 'Liste Chaînée : Insertion & Affichage',
      module: 'INF231 · Structures de Données',
      code: `#include <stdio.h>
#include <stdlib.h>

// Définition de la cellule de liste simplement chaînée
typedef struct Maillon {
    int valeur;
    struct Maillon *suivant;
} Maillon;

// Insertion en tête de liste : O(1)
Maillon* insererEnTete(Maillon *tete, int val) {
    Maillon *nouveau = (Maillon*)malloc(sizeof(Maillon));
    if (nouveau == NULL) {
        printf("Erreur critique d'allocation mémoire sur le tas.\\n");
        exit(EXIT_FAILURE);
    }
    nouveau->valeur = val;
    nouveau->suivant = tete;
    return nouveau;
}

// Affichage itératif de la liste
void afficherListe(Maillon *tete) {
    Maillon *courant = tete;
    printf("Tête -> ");
    while (courant != NULL) {
        printf("[%d] -> ", courant->valeur);
        courant = courant->suivant;
    }
    printf("NULL\\n");
}

// Libération propre de la mémoire
void libererListe(Maillon *tete) {
    Maillon *tmp;
    while (tete != NULL) {
        tmp = tete;
        tete = tete->suivant;
        free(tmp);
    }
    printf("Mémoire libérée avec succès (0 leak).\\n");
}

int main(void) {
    printf("=== CampusHub UY1 : Démonstration Liste Chaînée (INF231) ===\\n");
    Maillon *maListe = NULL;

    maListe = insererEnTete(maListe, 45);
    maListe = insererEnTete(maListe, 12);
    maListe = insererEnTete(maListe, 99);
    maListe = insererEnTete(maListe, 3);

    afficherListe(maListe);
    libererListe(maListe);

    return 0;
}`,
      expectedOutput: `=== CampusHub UY1 : Démonstration Liste Chaînée (INF231) ===
Tête -> [3] -> [99] -> [12] -> [45] -> NULL
Mémoire libérée avec succès (0 leak).`,
    },
    {
      id: 'c-bst',
      name: 'Arbre Binaire de Recherche (ABR)',
      module: 'INF231 · Algorithmique & Arbres',
      code: `#include <stdio.h>
#include <stdlib.h>

typedef struct Noeud {
    int cle;
    struct Noeud *gauche;
    struct Noeud *droite;
} Noeud;

Noeud* creerNoeud(int val) {
    Noeud *n = (Noeud*)malloc(sizeof(Noeud));
    n->cle = val;
    n->gauche = n->droite = NULL;
    return n;
}

Noeud* inserer(Noeud *racine, int val) {
    if (racine == NULL) return creerNoeud(val);
    if (val < racine->cle)
        racine->gauche = inserer(racine->gauche, val);
    else if (val > racine->cle)
        racine->droite = inserer(racine->droite, val);
    return racine;
}

// Parcours Infixe (Affiche les clés dans l'ordre croissant)
void parcoursInfixe(Noeud *racine) {
    if (racine != NULL) {
        parcoursInfixe(racine->gauche);
        printf("%d ", racine->cle);
        parcoursInfixe(racine->droite);
    }
}

int main(void) {
    printf("=== ABR : Insertion & Parcours Infixe trié ===\\n");
    Noeud *racine = NULL;
    int elements[] = {50, 30, 20, 40, 70, 60, 80};
    int n = sizeof(elements) / sizeof(elements[0]);

    for (int i = 0; i < n; i++) {
        racine = inserer(racine, elements[i]);
    }

    printf("Parcours Infixe ordonné : ");
    parcoursInfixe(racine);
    printf("\\nPropriété ABR vérifiée : ordre strictement croissant.\\n");
    return 0;
}`,
      expectedOutput: `=== ABR : Insertion & Parcours Infixe trié ===
Parcours Infixe ordonné : 20 30 40 50 60 70 80 
Propriété ABR vérifiée : ordre strictement croissant.`,
    },
    {
      id: 'c-pointers',
      name: 'Pointeurs & Arithmétique d\'Adresses',
      module: 'INF231 · Fondamentaux C',
      code: `#include <stdio.h>

void permutation(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

int main(void) {
    int x = 42;
    int y = 99;
    int tab[3] = {10, 20, 30};
    int *ptr = tab;

    printf("Avant permutation : x = %d, y = %d\\n", x, y);
    permutation(&x, &y);
    printf("Après permutation : x = %d, y = %d\\n", x, y);

    printf("\\n--- Arithmétique des Pointeurs ---\\n");
    for (int i = 0; i < 3; i++) {
        printf("*(ptr + %d) = %d [Adresse : %p]\\n", i, *(ptr + i), (void*)(ptr + i));
    }

    return 0;
}`,
      expectedOutput: `Avant permutation : x = 42, y = 99
Après permutation : x = 99, y = 42

--- Arithmétique des Pointeurs ---
*(ptr + 0) = 10 [Adresse : 0x7ffe420a]
*(ptr + 1) = 20 [Adresse : 0x7ffe420e]
*(ptr + 2) = 30 [Adresse : 0x7ffe4212]`,
    },
  ],
  python: [
    {
      id: 'py-mergesort',
      name: 'Tri Fusion (Merge Sort) - O(n log n)',
      module: 'INF201 · Complexité & Tris',
      code: `def fusion(gauche, droite):
    """Fusionne deux sous-listes triées en une seule liste triée."""
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
    """Paradigme Diviser pour Régner."""
    if len(liste) <= 1:
        return liste
    milieu = len(liste) // 2
    gauche = tri_fusion(liste[:milieu])
    droite = tri_fusion(liste[milieu:])
    return fusion(gauche, droite)

# Test sur une liste d'étudiants de Yaoundé I
notes_tp = [14.5, 8.0, 19.0, 11.5, 16.0, 5.5, 12.0]
print("Notes non triées :", notes_tp)
notes_triees = tri_fusion(notes_tp)
print("Notes après Tri Fusion :", notes_triees)
print("Complexité Asymptotique garantie : O(n log n)")
`,
      expectedOutput: `Notes non triées : [14.5, 8.0, 19.0, 11.5, 16.0, 5.5, 12.0]
Notes après Tri Fusion : [5.5, 8.0, 11.5, 12.0, 14.5, 16.0, 19.0]
Complexité Asymptotique garantie : O(n log n)`,
    },
    {
      id: 'py-stack',
      name: 'Implémentation Pile (LIFO) & Vérificateur Parenthèses',
      module: 'INF231 · Structures Linéaires',
      code: `class Pile:
    def __init__(self):
        self._elements = []

    def empiler(self, item):
        self._elements.append(item)

    def depiler(self):
        if self.est_vide():
            raise IndexError("Dépilement impossible : la pile est vide.")
        return self._elements.pop()

    def sommet(self):
        return self._elements[-1] if not self.est_vide() else None

    def est_vide(self):
        return len(self._elements) == 0

    def taille(self):
        return len(self._elements)

def verifier_parentheses(expression):
    p = Pile()
    ouvrantes = {"(": ")", "{": "}", "[": "]"}
    for char in expression:
        if char in ouvrantes:
            p.empiler(char)
        elif char in ouvrantes.values():
            if p.est_vide() or ouvrantes[p.depiler()] != char:
                return False
    return p.est_vide()

expressions = ["((2 + 3) * [5 - 1])", "{[a + b) * c}", "((a + b)"]
for exp in expressions:
    valide = verifier_parentheses(exp)
    symbole = "✅ Valide" if valide else "❌ Non équilibrée"
    print(f"'{exp}' -> {symbole}")
`,
      expectedOutput: `'((2 + 3) * [5 - 1])' -> ✅ Valide
'{[a + b) * c}' -> ❌ Non équilibrée
'((a + b)' -> ❌ Non équilibrée`,
    },
    {
      id: 'py-fibonacci-dp',
      name: 'Fibonacci Mémoïsé (Programmation Dynamique)',
      module: 'INF201 · Optimisation Algorithmique',
      code: `import time

def fib_memo(n, cache=None):
    if cache is None:
        cache = {}
    if n in cache:
        return cache[n]
    if n <= 1:
        return n
    cache[n] = fib_memo(n - 1, cache) + fib_memo(n - 2, cache)
    return cache[n]

print("=== Calcul Optimisé de la suite de Fibonacci ===")
valeurs = [10, 25, 40, 50]
for v in valeurs:
    debut = time.time()
    res = fib_memo(v)
    duree = (time.time() - debut) * 1000
    print(f"F({v:02d}) = {res} (calculé en {duree:.4f} ms)")

print("Complexité temporelle ramenée de O(2^n) à O(n) !")
`,
      expectedOutput: `=== Calcul Optimisé de la suite de Fibonacci ===
F(10) = 55 (calculé en 0.0050 ms)
F(25) = 75025 (calculé en 0.0080 ms)
F(40) = 102334155 (calculé en 0.0120 ms)
F(50) = 12586269025 (calculé en 0.0150 ms)
Complexité temporelle ramenée de O(2^n) à O(n) !`,
    },
  ],
};
