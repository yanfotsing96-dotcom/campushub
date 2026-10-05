/**
 * Dictionnaire de traduction bilingue (Français / English)
 * Conforme au statut bilingue officiel de la République du Cameroun
 */

export const SUPPORTED_LANGUAGES = [
  {
    code: 'fr',
    name: 'Français',
    flag: '🇫🇷',
    shortLabel: 'FR',
    subtitle: 'Langue officielle',
  },
  {
    code: 'en',
    name: 'English',
    flag: '🇬🇧',
    shortLabel: 'EN',
    subtitle: 'Official language',
  },
];

export const TRANSLATIONS = {
  fr: {
    // Topbar & Navigation
    nav: {
      dashboard: 'Tableau de Bord Filière',
      exams: 'Compositions en Ligne',
      resources: 'Ressources Nationales',
      techHub: 'Pôle Info & Tech',
      search: 'Recherche & Filtres',
      learning: 'Playground & IA',
      productivity: 'Productivité & iCal',
      evaluation: 'Évaluation & Mérite',
      services: 'Services & Covoiturage',
      pricing: 'CampusHub Pro',
      delegate: 'Espace Délégué',
      moderation: 'Console Modération',
      admin: 'Administration',
      help: 'Centre d\'Aide & FAQ',
      favorites: 'Favoris & Historique',
      notebook: 'Carnet Privé',
      profile: 'Profil National',
      logout: 'Déconnexion',
      coreTechFlagship: 'CŒUR TECH & CODE (FLAGSHIP)',
      nationalResources: 'RESSOURCES NATIONALES',
      studyTools: 'OUTILS D\'ÉTUDE',
      campusLife: 'VIE DU CAMPUS',
      proGovernance: 'PRO & CONTRÔLE',
      assistanceGuides: 'ASSISTANCE & GUIDES',
      mySpace: 'MON ESPACE',
    },

    // Header & Quick Utilities
    header: {
      searchPlaceholder: 'Rechercher... (⌘K)',
      searchLabel: 'Rechercher...',
      switchUniversity: 'Changer',
      proActive: 'Pro Actif',
      upgradePro: 'Passer Pro',
      nationalSubheader: 'Consortium des Universités d\'État & Écoles d\'Ingénieurs du Cameroun',
      academicYear: 'Année Universitaire 2025-2026',
    },

    // Auth (Login & Register)
    auth: {
      registerTitle: 'Créer mon compte étudiant',
      registerSubtitle: 'Portail académique unifié des universités camerounaises',
      loginTitle: 'Connexion à votre espace',
      loginSubtitle: 'Accédez à vos cours, au compilateur C/Python et aux annales',
      fullName: 'Nom complet',
      fullNamePlaceholder: 'Ex: Yan Fotsing',
      email: 'Email universitaire ou personnel',
      emailPlaceholder: 'etudiant@univ.cm ou nom@gmail.com',
      password: 'Mot de passe',
      passwordPlaceholder: '••••••••',
      department: 'Filière d\'études',
      level: 'Niveau académique',
      university: 'Université ou École d\'Ingénieurs au Cameroun',
      avatarOptional: 'Photo de profil (Optionnel)',
      submitRegister: 'Créer mon compte & Commencer',
      submitLogin: 'Se connecter à CampusHub',
      alreadyRegistered: 'Déjà inscrit sur CampusHub ?',
      goToLogin: 'Se connecter ici',
      noAccountYet: 'Pas encore de compte ?',
      goToRegister: 'Créer un compte gratuitement',
      bilingualNotice: 'Plateforme bilingue · Disponible en Français et Anglais',
    },

    // Common labels
    common: {
      language: 'Langue',
      selectLanguage: 'Choisir la langue d\'affichage',
      cancel: 'Annuler',
      confirm: 'Confirmer',
      save: 'Enregistrer',
      close: 'Fermer',
      camerounFlag: '🇨🇲 Cameroun',
    },
  },

  en: {
    // Topbar & Navigation
    nav: {
      dashboard: 'Department Dashboard',
      exams: 'Online Assessments',
      resources: 'National Resources',
      techHub: 'Tech & Code Hub',
      search: 'Search & Filters',
      learning: 'Playground & AI',
      productivity: 'Productivity & iCal',
      evaluation: 'Evaluation & Merit',
      services: 'Campus Services & Rides',
      pricing: 'CampusHub Pro',
      delegate: 'Class Delegate Space',
      moderation: 'Moderation Console',
      admin: 'Administration',
      help: 'Help Center & FAQ',
      favorites: 'Bookmarks & History',
      notebook: 'Private Notebook',
      profile: 'National Profile',
      logout: 'Log out',
      coreTechFlagship: 'CORE TECH & CODE (FLAGSHIP)',
      nationalResources: 'NATIONAL RESOURCES',
      studyTools: 'STUDY TOOLS',
      campusLife: 'CAMPUS LIFE',
      proGovernance: 'PRO & GOVERNANCE',
      assistanceGuides: 'ASSISTANCE & GUIDES',
      mySpace: 'MY SPACE',
    },

    // Header & Quick Utilities
    header: {
      searchPlaceholder: 'Search... (⌘K)',
      searchLabel: 'Search...',
      switchUniversity: 'Switch',
      proActive: 'Pro Active',
      upgradePro: 'Upgrade to Pro',
      nationalSubheader: 'Consortium of State Universities & Engineering Schools of Cameroon',
      academicYear: 'Academic Year 2025-2026',
    },

    // Auth (Login & Register)
    auth: {
      registerTitle: 'Create student account',
      registerSubtitle: 'Unified academic portal for Cameroonian universities',
      loginTitle: 'Sign in to your account',
      loginSubtitle: 'Access your lecture notes, C/Python playground and past exams',
      fullName: 'Full name',
      fullNamePlaceholder: 'e.g. Yan Fotsing',
      email: 'University or personal email',
      emailPlaceholder: 'student@univ.cm or name@gmail.com',
      password: 'Password',
      passwordPlaceholder: '••••••••',
      department: 'Field of study / Department',
      level: 'Academic level',
      university: 'University or Engineering School in Cameroon',
      avatarOptional: 'Profile picture (Optional)',
      submitRegister: 'Create Account & Get Started',
      submitLogin: 'Sign In to CampusHub',
      alreadyRegistered: 'Already have an account?',
      goToLogin: 'Sign in here',
      noAccountYet: 'Don\'t have an account yet?',
      goToRegister: 'Create a free account',
      bilingualNotice: 'Bilingual platform · Available in French and English',
    },

    // Common labels
    common: {
      language: 'Language',
      selectLanguage: 'Select display language',
      cancel: 'Cancel',
      confirm: 'Confirm',
      save: 'Save',
      close: 'Close',
      camerounFlag: '🇨🇲 Cameroon',
    },
  },
};
