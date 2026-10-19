/**
 * CampusHub - Configuration Pédagogique des Labs Professionnels (L01 à L26)
 * Conforme à l'architecture universitaire nationale camerounaise (MINESUP)
 */

export const LAB_FILIERE_COLORS = {
  informatique: {
    primary: '#1D4ED8', // Technical Royal Blue
    secondary: '#2563EB',
    light: '#EFF6FF',
    border: '#BFDBFE',
    badgeBg: '#DBEAFE',
    badgeText: '#1E40AF',
    gradient: 'from-blue-700 via-blue-600 to-indigo-700',
    name: 'Bleu Technique',
  },
  mathematiques: {
    primary: '#4338CA', // Deep Academic Indigo
    secondary: '#4F46E5',
    light: '#EEF2FF',
    border: '#C7D2FE',
    badgeBg: '#E0E7FF',
    badgeText: '#3730A3',
    gradient: 'from-indigo-700 via-indigo-600 to-purple-700',
    name: 'Indigo Mathématique',
  },
  physique: {
    primary: '#0369A1', // Cyan / Laser Sky
    secondary: '#0284C7',
    light: '#F0F9FF',
    border: '#BAE6FD',
    badgeBg: '#E0F2FE',
    badgeText: '#075985',
    gradient: 'from-sky-700 via-cyan-600 to-blue-700',
    name: 'Bleu Cyanique',
  },
  chimie: {
    primary: '#B45309', // Amber / Copper
    secondary: '#D97706',
    light: '#FFFBEB',
    border: '#FDE68A',
    badgeBg: '#FEF3C7',
    badgeText: '#92400E',
    gradient: 'from-amber-700 via-amber-600 to-yellow-600',
    name: 'Ambre Minéral',
  },
  biologie: {
    primary: '#0F766E', // Emerald / Bio Teal
    secondary: '#0D9488',
    light: '#F0FDFA',
    border: '#99F6E4',
    badgeBg: '#CCFBF1',
    badgeText: '#115E59',
    gradient: 'from-teal-700 via-emerald-600 to-green-700',
    name: 'Sarcelle Biologique',
  },
  agronomie: {
    primary: '#15803D', // Nature / Foliage Green
    secondary: '#16A34A',
    light: '#F0FDF4',
    border: '#BBF7D0',
    badgeBg: '#DCFCE7',
    badgeText: '#166534',
    gradient: 'from-emerald-700 via-green-600 to-lime-700',
    name: 'Vert Agronomie',
  },
  medecine: {
    primary: '#BE123C', // Medical Crimson
    secondary: '#E11D48',
    light: '#FFF1F2',
    border: '#FECDD3',
    badgeBg: '#FFE4E6',
    badgeText: '#9F1239',
    gradient: 'from-rose-700 via-rose-600 to-red-700',
    name: 'Pourpre Médical',
  },
  droit: {
    primary: '#831843', // Bordeaux / Judicial Wine
    secondary: '#9D174D',
    light: '#FDF2F8',
    border: '#FBCFE8',
    badgeBg: '#FCE7F3',
    badgeText: '#831843',
    gradient: 'from-pink-900 via-rose-800 to-purple-900',
    name: 'Bordeaux Judiciaire',
  },
  economie: {
    primary: '#854D0E', // Bronze Gold
    secondary: '#A16207',
    light: '#FEFCE8',
    border: '#FEF08A',
    badgeBg: '#FEF9C3',
    badgeText: '#713F12',
    gradient: 'from-yellow-800 via-amber-700 to-orange-800',
    name: 'Bronze Économique',
  },
  lettres: {
    primary: '#475569', // Anthracite Slate
    secondary: '#64748B',
    light: '#F8FAFC',
    border: '#E2E8F0',
    badgeBg: '#F1F5F9',
    badgeText: '#334155',
    gradient: 'from-slate-700 via-slate-600 to-gray-700',
    name: 'Ardoise Littéraire',
  },
};

export const LABS_REGISTRY = [
  // --------------------------------------------------------------------------
  // LAB L08 : INFORMATIQUE, PROGRAMMATION & IA (FLAGSHIP MODEL)
  // --------------------------------------------------------------------------
  {
    id: 'L08',
    code: 'LAB-L08',
    title: 'Informatique, Programmation & Intelligence Artificielle',
    filiere: 'Informatique & Génie Logiciel',
    filiereCategory: 'informatique',
    faculte: 'Faculté des Sciences / ENSPY',
    universite: 'Université de Yaoundé I (Ngoa-Ekélé)',
    niveau: 'Licence 2 (Semestre 3)',
    ueCode: 'INF231 / INF232',
    ueTitle: 'Structures de Données Avancées & Algorithmique Appliquée',
    credits: 6,
    duration: '3h00 (TP Noté & Séance Dirigée)',
    version: 'v2.4 - Session Officielle 2024/2025',

    // En-tête pédagogique
    consigne: {
      tpNumero: 'TP 04 / Série Nationale MINESUP',
      titre: 'Arbres Binaires de Recherche (ABR) & Classification Intelligente',
      contexte:
        'Dans le cadre de la gestion automatisée du registre académique national, vous devez concevoir un moteur d’indexation basé sur un Arbre Binaire de Recherche (ABR) balancé. Ce moteur permettra l’insertion rapide, la recherche dichotomique en O(log n) des relevés d’étudiants camerounais, ainsi qu’un algorithme de parcours infixe pour l’ordonnancement des délibérations de jurys.',
      prerequis: [
        'Pointeurs et allocation dynamique de mémoire',
        'Récursivité et complexité asymptotique (notations Grand-O)',
        'Notions de nœuds, clés primaires et facteurs d’équilibre',
      ],
      instructions: [
        '1. Compléter la méthode `inserer(cle, nom, moyenne)` pour garantir la propriété d’ordre ABR.',
        '2. Implémenter la recherche récursive `rechercher(cle)` retournant le nœud ou null.',
        '3. Coder le parcours infixe (In-Order) pour extraire la liste triée des matricules.',
        '4. Tester la robustesse face aux doublons et valider la complexité algorithmique.',
      ],
      baremeTotal: '20 Points',
      evaluationCriteria: [
        { label: 'Correction Algorithmique & Exactitude', points: '8 pts', desc: 'Validité des fonctions inserer, rechercher et parcours.' },
        { label: 'Gestion des Cas Limites & Mémoire', points: '5 pts', desc: 'Arbre vide, doublons, suppression sans fuite.' },
        { label: 'Qualité du Code & Respect PEP8 / Normes', points: '4 pts', desc: 'Nommage sémantique, docstrings, clarté.' },
        { label: 'Validation des Tests Unitaires', points: '3 pts', desc: 'Succès des assertions automatisées du jury.' },
      ],
    },

    // Objectifs pédagogiques avec suivi interactif
    objectifs: [
      { id: 'obj-1', label: 'Maîtriser la récursivité appliquée aux arbres binaires', status: 'done' },
      { id: 'obj-2', label: 'Garantir une complexité moyenne O(log n) en recherche', status: 'in_progress' },
      { id: 'obj-3', label: 'Implémenter le parcours infixe produisant un ordre strict croissant', status: 'pending' },
      { id: 'obj-4', label: 'Valider les 5 cas de tests unitaires officiels du jury MINESUP', status: 'pending' },
    ],

    // Ressources associées
    ressources: [
      {
        titre: 'Polycopié MINESUP : Algorithmique II (Dr. Fotsing, UY1)',
        type: 'PDF de Cours',
        pages: 'Chapitre IV - Arbres & Équilibrage (p. 45-68)',
        lien: 'https://univ-yaounde1.cm/facsciences/cours-abr.pdf',
      },
      {
        titre: 'Spécification de l’Algorithme AVL & Rotations Gauche/Droite',
        type: 'Fiche Synthèse',
        pages: 'Fiche Technique Réf #CM-INFO-2024',
        lien: 'https://enspy.cm/labo-info/avl-spec.pdf',
      },
      {
        titre: 'Mémento Syntaxe Python 3.12 & Typage Statique `typing`',
        type: 'Aide-Mémoire',
        pages: '2 pages récapitulatives',
        lien: '#',
      },
    ],

    // Fichiers du TP (Éditeur central)
    files: [
      {
        id: 'main.py',
        name: 'solution_abr.py',
        language: 'python',
        isMain: true,
        initialCode: `# ==============================================================================
# UNIVERSITÉ DE YAOUNDÉ I - DÉPARTEMENT D'INFORMATIQUE
# UE INF231 : STRUCTURES DE DONNÉES AVANCÉES
# TP 04 - Arbres Binaires de Recherche (ABR) & Moteur d'Indexation
# ==============================================================================

class Noeud:
    """Représente un étudiant dans l'arbre d'indexation académique."""
    def __init__(self, cle: int, nom: str, moyenne: float):
        self.cle = cle          # Numéro Matricule (Clé unique)
        self.nom = nom          # Nom et Prénom de l'étudiant
        self.moyenne = moyenne  # Moyenne académique /20
        self.gauche = None      # Sous-arbre gauche (clés < cle)
        self.droite = None      # Sous-arbre droit (clés > cle)

class ArbreBinaireRecherche:
    def __init__(self):
        self.racine = None
        self.taille = 0

    def inserer(self, cle: int, nom: str, moyenne: float) -> bool:
        """
        Insère un nouvel étudiant dans l'ABR.
        Retourne True si l'insertion réussit, False si doublon.
        """
        if self.racine is None:
            self.racine = Noeud(cle, nom, moyenne)
            self.taille += 1
            return True

        return self._inserer_recursif(self.racine, cle, nom, moyenne)

    def _inserer_recursif(self, courant: Noeud, cle: int, nom: str, moyenne: float) -> bool:
        if cle == courant.cle:
            # Doublon détecté : rejet strict selon le règlement des délibérations
            return False
        elif cle < courant.cle:
            if courant.gauche is None:
                courant.gauche = Noeud(cle, nom, moyenne)
                self.taille += 1
                return True
            return self._inserer_recursif(courant.gauche, cle, nom, moyenne)
        else:
            if courant.droite is None:
                courant.droite = Noeud(cle, nom, moyenne)
                self.taille += 1
                return True
            return self._inserer_recursif(courant.droite, cle, nom, moyenne)

    def rechercher(self, cle: int) -> Noeud | None:
        """
        Recherche dichotomique d'un étudiant par son matricule.
        Complexité temporelle moyenne : O(log n).
        """
        courant = self.racine
        while courant is not None:
            if cle == courant.cle:
                return courant
            elif cle < courant.cle:
                courant = courant.gauche
            else:
                courant = courant.droite
        return None

    def parcours_infixe(self) -> list:
        """
        Parcours infixe (G - R - D) : produit les étudiants triés par matricule.
        """
        resultat = []
        def _in_order(noeud):
            if noeud is not None:
                _in_order(noeud.gauche)
                resultat.append((noeud.cle, noeud.nom, noeud.moyenne))
                _in_order(noeud.droite)
        _in_order(self.racine)
        return resultat

# Démonstration automatique de validation
if __name__ == "__main__":
    abr = ArbreBinaireRecherche()
    donnees = [
        (1045, "Abena Marie-Ange", 14.75),
        (1012, "Kamgaing Samuel", 16.50),
        (1090, "Ngo Biyong Rachel", 15.20),
        (1005, "Ewane Patrick", 12.00),
        (1030, "Moussa Bello", 13.80)
    ]
    for mat, nom, moy in donnees:
        abr.inserer(mat, nom, moy)

    print(f"Indexation réussie : {abr.taille} étudiants enregistrés.")
    print("Liste ordonnée par matricule :", abr.parcours_infixe())
`,
      },
      {
        id: 'tests_tp.py',
        name: 'test_validation.py',
        language: 'python',
        isMain: false,
        initialCode: `# Suite de Tests Unitaires Officielle - Commission Examens MINESUP
import unittest

class TestIndexationABR(unittest.TestCase):
    def setUp(self):
        self.abr = ArbreBinaireRecherche()
        self.abr.inserer(200, "Student A", 14.0)
        self.abr.inserer(100, "Student B", 15.5)
        self.abr.inserer(300, "Student C", 16.0)

    def test_recherche_succes(self):
        noeud = self.abr.rechercher(100)
        self.assertIsNotNone(noeud)
        self.assertEqual(noeud.nom, "Student B")

    def test_recherche_inexistant(self):
        self.assertIsNone(self.abr.rechercher(999))

    def test_ordre_infixe_tri(self):
        cles = [cle for cle, _, _ in self.abr.parcours_infixe()]
        self.assertEqual(cles, [100, 200, 300])

if __name__ == '__main__':
    unittest.main()
`,
      },
    ],

    // Jeux de tests automatisés
    tests: [
      { id: 't1', name: 'Test 1 : Insertion dans un arbre initialement vide', passed: true, points: 2 },
      { id: 't2', name: 'Test 2 : Maintien de l’ordre strict dichotomique', passed: true, points: 2 },
      { id: 't3', name: 'Test 3 : Recherche O(log n) et gestion des éléments absents', passed: true, points: 2 },
      { id: 't4', name: 'Test 4 : Rejet strict des matricules doublons', passed: true, points: 2 },
      { id: 't5', name: 'Test 5 : Parcours Infixe ordonné sur 100 nœuds générés', passed: true, points: 2 },
    ],

    // Assistant IA / Correcteur Intelligent
    correcteurData: {
      scoreConformite: 95,
      noteEstimee: '19 / 20',
      mention: 'Très Bien · Code Conforme MINESUP',
      complexiteTemporelle: 'O(log n) en moyenne, O(n) pire cas',
      complexiteSpatiale: 'O(n) pour n nœuds alloués',
      pep8Score: '9.8 / 10',
      pointsForts: [
        'Excellente encapsulation orientée objet avec `Noeud` et `ArbreBinaireRecherche`.',
        'Le parcours infixe garantit un ordre rigoureusement croissant des matricules.',
        'La recherche itérative dans `rechercher()` économise la pile d’appels récursifs.',
      ],
      pointsAmelioration: [
        'Ajouter une méthode de calcul de la hauteur de l’arbre pour diagnostiquer le déséquilibre.',
        'Envisager une rotation d’équilibrage automatique (type AVL) pour éviter le pire cas O(n).',
      ],
      commentairesProfesseur:
        'Travail rigoureux et remarquable. L’étudiant démontre une compréhension solide des structures de données récursives et de l’ordonnancement universitaire camerounais.',
    },

    // Annales & Épreuves d'examens
    annales: [
      {
        id: 'ann-1',
        session: 'Session Normale Juin 2024 · UY1 Ngoa-Ekélé',
        epreuve: 'Épreuve d’Algorithmique & Structures de Données (INF231)',
        duree: '3 heures',
        coeff: 4,
        exercices: [
          'Exercice 1 : Arbres AVL et Rotations Doubles (6 pts)',
          'Exercice 2 : Tables de Hachage avec Adressage Ouvert (7 pts)',
          'Exercice 3 : Problème d’Optimisation des Inscriptions MINESUP (7 pts)',
        ],
        tauxReussite: '68%',
        telechargeable: true,
      },
      {
        id: 'ann-2',
        session: 'Rattrapage Septembre 2023 · ENSPY Yaoundé',
        epreuve: 'Épreuve de Génie Logiciel & Algorithmes (GLO-204)',
        duree: '3 heures',
        coeff: 5,
        exercices: [
          'Partie A : Arbres B-Tree et Indexation Disque (8 pts)',
          'Partie B : Complexité Algorithmique Amortie (6 pts)',
          'Partie C : Conception orientée objet en C++ / Python (6 pts)',
        ],
        tauxReussite: '54%',
        telechargeable: true,
      },
      {
        id: 'ann-3',
        session: 'Contrôle Continu Décembre 2023 · Université de Douala',
        epreuve: 'Contrôle Continu Semestriel INF211',
        duree: '1 heure 30',
        coeff: 2,
        exercices: [
          'Question de cours : Définition d’un ABR parfait (4 pts)',
          'Exercice pratique : Écriture du parcours suffixe post-order (16 pts)',
        ],
        tauxReussite: '81%',
        telechargeable: true,
      },
    ],

    // Questions fréquentes pour l'Aide Professeur IA
    promptsAide: [
      { id: 'p1', label: 'Expliquer l’algorithme de parcours infixe étape par étape', category: 'cours' },
      { id: 'p2', label: 'Comment éviter qu’un ABR ne dégénère en liste linéaire ?', category: 'optimisation' },
      { id: 'p3', label: 'Simuler le cas de test d’insertion avec matricule doublon', category: 'tests' },
      { id: 'p4', label: 'Quelle est la différence de complexité entre ABR et Table de Hachage ?', category: 'examens' },
    ],
  },

  // --------------------------------------------------------------------------
  // LAB L01 : MATHÉMATIQUES FONDAMENTALES & ALGÈBRE LINÉAIRE
  // --------------------------------------------------------------------------
  {
    id: 'L01',
    code: 'LAB-L01',
    title: 'Mathématiques Fondamentales & Algèbre Linéaire',
    filiere: 'Mathématiques & Informatique Fondamentale',
    filiereCategory: 'mathematiques',
    faculte: 'Faculté des Sciences',
    universite: 'Université de Yaoundé I',
    niveau: 'Licence 1 / Licence 2',
    ueCode: 'MAT111 / MAT211',
    ueTitle: 'Algèbre Linéaire & Espaces Vectoriels',
    credits: 6,
    duration: '2h30 (TD Numérique & Calcul Matriciel)',
    version: 'v1.8 - Rentrée Académique',
    consigne: {
      tpNumero: 'TP 02 - Algèbre Matricielle',
      titre: 'Diagonalisation des Matrices Carrées et Décomposition Spectrale',
      contexte:
        'Calcul des valeurs propres et vecteurs propres d’une matrice d’endomorphisme dans l’espace vectoriel R^n. Vérification du déterminant et du polynôme caractéristique.',
      prerequis: ['Espaces vectoriels', 'Polynômes caractéristiques', 'Échelonnement de Gauss'],
      instructions: [
        '1. Définir la matrice carrée A d’ordre 2 ou 3.',
        '2. Calculer le déterminant dét(A) et la trace tr(A).',
        '3. Déterminer les valeurs propres via l’équation caractéristique.',
        '4. Conclure sur la diagonalisabilité de l’endomorphisme.',
      ],
      baremeTotal: '20 Points',
      evaluationCriteria: [
        { label: 'Calculs Symboliques & Déterminant', points: '7 pts', desc: 'Rigueur des formules analytiques.' },
        { label: 'Spectre & Vecteurs Propres', points: '7 pts', desc: 'Exactitude des valeurs propres.' },
        { label: 'Interprétation Géométrique', points: '6 pts', desc: 'Base de vecteurs propres et sous-espaces.' },
      ],
    },
    objectifs: [
      { id: 'mobj-1', label: 'Calculer le polynôme caractéristique d’une matrice carrée', status: 'done' },
      { id: 'mobj-2', label: 'Identifier la multiplicité algébrique et géométrique', status: 'in_progress' },
      { id: 'mobj-3', label: 'Construire la matrice de passage P inversible', status: 'pending' },
    ],
    ressources: [
      { titre: 'Polycopié Algèbre I (Prof. Bitjong, FS UY1)', type: 'PDF', pages: 'Chap. 3 (p. 25-50)', lien: '#' },
      { titre: 'Formulaire de calcul matriciel & déterminants', type: 'Fiche', pages: '4 pages', lien: '#' },
    ],
    files: [
      {
        id: 'matrix.py',
        name: 'diagonalisation.py',
        language: 'python',
        isMain: true,
        initialCode: `# Algèbre Linéaire - Diagonalisation
import math

class Matrice2x2:
    def __init__(self, a, b, c, d):
        self.a, self.b = a, b
        self.c, self.d = c, d

    def determinant(self):
        return self.a * self.d - self.b * self.c

    def trace(self):
        return self.a + self.d

    def valeurs_propres(self):
        tr = self.trace()
        det = self.determinant()
        delta = tr**2 - 4 * det
        if delta < 0:
            return "Valeurs propres complexes"
        l1 = (tr + math.sqrt(delta)) / 2
        l2 = (tr - math.sqrt(delta)) / 2
        return (l1, l2)

m = Matrice2x2(4, 2, 1, 3)
print("Déterminant :", m.determinant())
print("Trace :", m.trace())
print("Spectre :", m.valeurs_propres())
`,
      },
    ],
    tests: [
      { id: 'mt1', name: 'Calcul exact du déterminant', passed: true, points: 5 },
      { id: 'mt2', name: 'Calcul exact de la trace', passed: true, points: 5 },
      { id: 'mt3', name: 'Détection du discriminant et des racines', passed: true, points: 10 },
    ],
    correcteurData: {
      scoreConformite: 92,
      noteEstimee: '18.5 / 20',
      mention: 'Excellent',
      complexiteTemporelle: 'O(1) pour dimension 2',
      complexiteSpatiale: 'O(1)',
      pep8Score: '9.5 / 10',
      pointsForts: ['Formules matricielles exactes', 'Gestion propre du discriminant'],
      pointsAmelioration: ['Étendre le code aux matrices d’ordre n avec décomposition QR'],
      commentairesProfesseur: 'Bonne base formelle en algèbre matricielle.',
    },
    annales: [
      {
        id: 'mann-1',
        session: 'Session Normale 2024 · UY1',
        epreuve: 'Examen MAT111 - Algèbre Linéaire',
        duree: '3 heures',
        coeff: 6,
        exercices: ['Théorème du rang', 'Matrices nilpotentes et diagonalisation'],
        tauxReussite: '58%',
        telechargeable: true,
      },
    ],
    promptsAide: [
      { id: 'mp1', label: 'Comment prouver qu’une matrice est diagonalisable ?', category: 'cours' },
      { id: 'mp2', label: 'Calculer la matrice inverse via les cofacteurs', category: 'technique' },
    ],
  },

  // --------------------------------------------------------------------------
  // LAB L12 : SCIENCES AGRONOMIQUES & PRODUCTION VÉGÉTALE (FASA DSCHANG)
  // --------------------------------------------------------------------------
  {
    id: 'L12',
    code: 'LAB-L12',
    title: 'Sciences Agronomiques & Production Végétale',
    filiere: 'Agronomie & Phytopathologie',
    filiereCategory: 'agronomie',
    faculte: 'Faculté d’Agronomie et des Sciences Agricoles (FASA)',
    universite: 'Université de Dschang',
    niveau: 'Ingénieur Agronome / Licence 3',
    ueCode: 'AGR312',
    ueTitle: 'Agro-Écologie, Pédologie & Protection des Cultures Tropicales',
    credits: 5,
    duration: '3h00 (Simulation & Étude de Sol)',
    version: 'v2.1 - Dschang Campus',
    consigne: {
      tpNumero: 'TP 03 - Pédologie Appliquée',
      titre: 'Modélisation du Bilan Hydrique et Fertilisation N-P-K des Sols des Hauts Plateaux de l’Ouest',
      contexte:
        'Calcul de la capacité au champ, point de flétrissement permanent et fertilisation raisonnée pour une parcelle expérimentale de maïs hybride et caféier arabica.',
      prerequis: ['Texture du sol', 'Constantes hydriques', 'Cinétique d’absorption minérale'],
      instructions: [
        '1. Saisir la composition granulométrique (Argile, Limon, Sable).',
        '2. Calculer la Réserve Utile (RU) et la Réserve Facilement Utilisable (RFU).',
        '3. Optimiser la dose d’apport en urée et superphosphate.',
      ],
      baremeTotal: '20 Points',
      evaluationCriteria: [
        { label: 'Bilan Hydrique & Texture', points: '7 pts', desc: 'Calcul de la RU en mm/m.' },
        { label: 'Plan de Fumure NPK', points: '8 pts', desc: 'Doses équilibrées selon le rendement cible.' },
        { label: 'Recommandations Écologiques', points: '5 pts', desc: 'Gestion de l’érosion et acidité du sol.' },
      ],
    },
    objectifs: [
      { id: 'aobj-1', label: 'Déterminer la Réserve Utile (RU) du sol volcanique', status: 'done' },
      { id: 'aobj-2', label: 'Programmer le calendrier d’irrigation déficitaire', status: 'in_progress' },
      { id: 'aobj-3', label: 'Corriger l’acidité via le chaulage calcique', status: 'pending' },
    ],
    ressources: [
      { titre: 'Guide Pédologique des Sols du Cameroun (IRAD)', type: 'Manuel', pages: 'Fiche Ouest Cameroun', lien: '#' },
    ],
    files: [
      {
        id: 'agro_model.py',
        name: 'bilan_hydrique_fasa.py',
        language: 'python',
        isMain: true,
        initialCode: `# Modélisation Agronomique - FASA Université de Dschang
def calculer_reserve_utile(argile_pct, limon_pct, sable_pct, profondeur_cm):
    """Calcule la Réserve Utile (RU) en mm selon la texture."""
    # Formule pédologique simplifiée pour sols ferrallitiques
    capacite_retention = (0.28 * argile_pct + 0.18 * limon_pct + 0.05 * sable_pct) / 100
    point_fletrissement = (0.14 * argile_pct + 0.06 * limon_pct + 0.02 * sable_pct) / 100
    ru_par_metre = (capacite_retention - point_fletrissement) * 1000  # mm/m
    ru_totale = ru_par_metre * (profondeur_cm / 100)
    rfu = 0.65 * ru_totale  # Réserve Facilement Utilisable
    return {"RU_mm": round(ru_totale, 2), "RFU_mm": round(rfu, 2)}

sol = calculer_reserve_utile(argile_pct=45, limon_pct=30, sable_pct=25, profondeur_cm=80)
print("Diagnostic Sol Hauts Plateaux :", sol)
`,
      },
    ],
    tests: [
      { id: 'at1', name: 'Calcul de la RU pour sol ferrallitique', passed: true, points: 10 },
      { id: 'at2', name: 'Estimation de la RFU à 65% de la RU', passed: true, points: 10 },
    ],
    correcteurData: {
      scoreConformite: 96,
      noteEstimee: '19 / 20',
      mention: 'Très Bien · Agronomie Durable',
      complexiteTemporelle: 'O(1)',
      complexiteSpatiale: 'O(1)',
      pep8Score: '10 / 10',
      pointsForts: ['Modélisation fidèle aux sols ferrallitiques tropicaux', 'Sortie claire en mm de pluie équivalente'],
      pointsAmelioration: ['Intégrer les précipitations mensuelles moyennes de Dschang'],
      commentairesProfesseur: 'Excellent protocole conforme aux travaux de recherche de la FASA.',
    },
    annales: [
      {
        id: 'aann-1',
        session: 'Session 2024 · FASA Dschang',
        epreuve: 'Examen Pédologie & Bilan Hydrique',
        duree: '3 heures',
        coeff: 4,
        exercices: ['Triangle des textures USDA', 'Cinétique du potassium en sol volcanique'],
        tauxReussite: '74%',
        telechargeable: true,
      },
    ],
    promptsAide: [
      { id: 'ap1', label: 'Quelle est la différence entre RU et RFU en climat tropical humide ?', category: 'cours' },
    ],
  },

  // --------------------------------------------------------------------------
  // LAB L15 : DROIT PRIVÉ & PROCÉDURE CIVILE (FSJP NGOA-EKÉLÉ)
  // --------------------------------------------------------------------------
  {
    id: 'L15',
    code: 'LAB-L15',
    title: 'Droit Privé, Contentieux & Procédure Camerounaise',
    filiere: 'Droit Privé & Sciences Criminelles',
    filiereCategory: 'droit',
    faculte: 'Faculté des Sciences Juridiques et Politiques (FSJP)',
    universite: 'Université de Yaoundé II (Soa)',
    niveau: 'Licence 3 / Master 1',
    ueCode: 'DRP301',
    ueTitle: 'Droit Judiciaire Privé & Voies d’Exécution OHADA',
    credits: 6,
    duration: '3h00 (Cas Pratique & Rédaction d’Exploits)',
    version: 'v2.0 - Acte Uniforme OHADA Révisé',
    consigne: {
      tpNumero: 'Séance Pratique 04 - Contentieux de Recouvrement',
      titre: 'Rédaction d’une Requête aux Fins d’Injonction de Payer selon l’Acte Uniforme OHADA',
      contexte:
        'La Société Commerciale Camerounaise (SCC SARL) à Douala détient une créance certaine, liquide et exigible de 15 500 000 FCFA sur les Établissements Mballa & Fils, résultant de livraisons de ciment impayées.',
      prerequis: ['Conditions de la créance OHADA (art. 1 et 2 AUPSRVE)', 'Compétence territoriale du TPI'],
      instructions: [
        '1. Analyser les pièces justificatives (factures acceptées, bordereaux de livraison).',
        '2. Rédiger la requête motivée adressée à Monsieur le Président du Tribunal de Première Instance.',
        '3. Vérifier les mentions substantielles à peine de nullité.',
      ],
      baremeTotal: '20 Points',
      evaluationCriteria: [
        { label: 'Qualification Juridique des Faits', points: '6 pts', desc: 'Preuve de la créance certaine, liquide et exigible.' },
        { label: 'Mentions Obligatoires de l’Exploit', points: '8 pts', desc: 'Article 4 de l’Acte Uniforme OHADA.' },
        { label: 'Style & Terminologie Judiciaire', points: '6 pts', desc: 'Rigueur du visa et dispositif.' },
      ],
    },
    objectifs: [
      { id: 'dobj-1', label: 'Vérifier les conditions d’ouverture de l’injonction de payer', status: 'done' },
      { id: 'dobj-2', label: 'Rédiger le dispositif de la requête sans vice de forme', status: 'in_progress' },
      { id: 'dobj-3', label: 'Maîtriser les délais de signification par huissier de justice', status: 'pending' },
    ],
    ressources: [
      { titre: 'Acte Uniforme OHADA portant organisation des procédures simplifiées de recouvrement', type: 'Code', pages: 'Articles 1 à 18', lien: '#' },
      { titre: 'Jurisprudence CCJA sur les créances contractuelles', type: 'Arrêt', pages: 'Arrêt CCJA N° 045/2021', lien: '#' },
    ],
    files: [
      {
        id: 'requete_injonction.txt',
        name: 'requete_injonction_payer.txt',
        language: 'text',
        isMain: true,
        initialCode: `À MONSIEUR LE PRÉSIDENT DU TRIBUNAL DE PREMIÈRE INSTANCE DE DOUALA-BONANJO

REQUÊTE AUX FINS D'INJONCTION DE PAYER
(Articles 1 à 8 de l'Acte Uniforme OHADA portant Recouvrement Simplifié)

POUR :
La Société Camerounaise de Distribution (SCD SARL), immatriculée au RCCM de Douala,
Ayant pour Conseil Maître NGOUNOU Pierre, Avocat au Barreau du Cameroun.

CONTRE :
Les Établissements MBALLA & FILS, domiciliés au quartier Akwa, Douala.

PLAISE À MONSIEUR LE PRÉSIDENT :

I. LES FAITS ET LA CRÉANCE
Attendu que par convention commerciale intervenue le 12 Janvier 2024, la requérante a livré
aux requis un lot de matériaux de construction d'une valeur de 15 500 000 FCFA ;
Attendu que cette créance est constatée par les factures N° 2024-041 et 042 dument acceptées
et non contestées à échéance...

II. PAR CES MOTIFS :
Vu les articles 1, 2, 4 et 5 de l'Acte Uniforme OHADA sur les voies d'exécution ;
ORDONNER aux requis de payer à la requérante la somme principale de 15 500 000 FCFA,
majorée des intérêts légaux et des dépens.
`,
      },
    ],
    tests: [
      { id: 'dt1', name: 'Vérification de la juridiction compétente (TPI Douala)', passed: true, points: 5 },
      { id: 'dt2', name: 'Présence des visas obligatoires des articles AUPSRVE', passed: true, points: 7 },
      { id: 'dt3', name: 'Caractère certain, liquide et exigible explicité', passed: true, points: 8 },
    ],
    correcteurData: {
      scoreConformite: 94,
      noteEstimee: '18 / 20',
      mention: 'Très Bien · Rédaction Rigoureuse',
      complexiteTemporelle: 'Analyse Textuelle Juridique',
      complexiteSpatiale: 'Acte OHADA Conforme',
      pep8Score: 'Style Juridique 10/10',
      pointsForts: ['Respect scrupuleux du formalisme de l’article 4 OHADA', 'Dispositif clair et précis'],
      pointsAmelioration: ['Préciser le décompte détaillé des intérêts de retard'],
      commentairesProfesseur: 'Excellente maîtrise des exigences procédurales OHADA.',
    },
    annales: [
      {
        id: 'dann-1',
        session: 'Examen Juin 2024 · FSJP UY2 Soa',
        epreuve: 'Épreuve de Procédures Simplifiées de Recouvrement',
        duree: '3 heures',
        coeff: 5,
        exercices: ['Dissertation : L’efficacité de l’injonction de payer dans l’espace OHADA'],
        tauxReussite: '62%',
        telechargeable: true,
      },
    ],
    promptsAide: [
      { id: 'dp1', label: 'Quels sont les délais d’opposition à l’ordonnance d’injonction de payer ?', category: 'procedure' },
    ],
  },
];

export const ALL_LAB_CODES = [
  { id: 'L01', title: 'L01 - Mathématiques Fondamentales & Algèbre', filiere: 'Mathématiques', category: 'mathematiques' },
  { id: 'L02', title: 'L02 - Probabilités & Calcul Matriciel', filiere: 'Mathématiques Appliquées', category: 'mathematiques' },
  { id: 'L03', title: 'L03 - Physique & Électromagnétisme', filiere: 'Physique', category: 'physique' },
  { id: 'L04', title: 'L04 - Chimie Organique & Cinétique', filiere: 'Chimie', category: 'chimie' },
  { id: 'L05', title: 'L05 - Biologie & Bio-Informatique', filiere: 'Biologie', category: 'biologie' },
  { id: 'L06', title: 'L06 - Sciences de la Terre & Géologie', filiere: 'Géosciences', category: 'physique' },
  { id: 'L07', title: 'L07 - Génie Électrique & Automatique', filiere: 'Génie Électrique', category: 'informatique' },
  { id: 'L08', title: 'L08 - Informatique, Programmation & IA (Star)', filiere: 'Informatique', category: 'informatique' },
  { id: 'L09', title: 'L09 - Génie Logiciel & Réseaux Télécoms', filiere: 'Réseaux & Télécoms', category: 'informatique' },
  { id: 'L10', title: 'L10 - Génie Civil & Résistance des Matériaux', filiere: 'Génie Civil', category: 'physique' },
  { id: 'L11', title: 'L11 - Génie Mécanique & Énergétique', filiere: 'Génie Mécanique', category: 'physique' },
  { id: 'L12', title: 'L12 - Sciences Agronomiques & Production Végétale', filiere: 'Agronomie', category: 'agronomie' },
  { id: 'L13', title: 'L13 - Médecine & Sémiologie Clinique', filiere: 'Médecine', category: 'medecine' },
  { id: 'L14', title: 'L14 - Pharmacie & Toxicologie Expérimentale', filiere: 'Pharmacie', category: 'medecine' },
  { id: 'L15', title: 'L15 - Droit Privé & Procédure Camerounaise', filiere: 'Droit Privé', category: 'droit' },
  { id: 'L16', title: 'L16 - Droit Public & Droit Administratif', filiere: 'Droit Public', category: 'droit' },
  { id: 'L17', title: 'L17 - Sciences Économiques & Économétrie', filiere: 'Économie', category: 'economie' },
  { id: 'L18', title: 'L18 - Sciences de Gestion & Comptabilité OHADA', filiere: 'Gestion & Finance', category: 'economie' },
  { id: 'L19', title: 'L19 - Lettres Modernes & Linguistique', filiere: 'Lettres Modernes', category: 'lettres' },
  { id: 'L20', title: 'L20 - English & Commonwealth Literary Studies', filiere: 'English Studies', category: 'lettres' },
  { id: 'L21', title: 'L21 - Histoire & Relations Internationales', filiere: 'Histoire & RI', category: 'lettres' },
  { id: 'L22', title: 'L22 - Géographie & Aménagement du Territoire', filiere: 'Géographie', category: 'agronomie' },
  { id: 'L23', title: 'L23 - Sociologie & Anthropologie Sociale', filiere: 'Sociologie', category: 'lettres' },
  { id: 'L24', title: 'L24 - Sciences de la Communication & Médias', filiere: 'Communication', category: 'lettres' },
  { id: 'L25', title: 'L25 - Sciences de l’Éducation & Didactique', filiere: 'Pédagogie', category: 'lettres' },
  { id: 'L26', title: 'L26 - Philosophie & Éthique Appliquée', filiere: 'Philosophie', category: 'lettres' },
];
