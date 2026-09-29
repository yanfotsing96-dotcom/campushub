import {
  BookMarked,
  User,
  Search,
  Library,
  Star,
  Sparkles,
  Clock,
  Award,
  Briefcase,
  ShieldCheck,
  Crown,
} from 'lucide-react';

export const NAVIGATION_ITEMS = [
  {
    path: '/ressources',
    label: 'Ressources',
    icon: Library,
    description: 'Gestion & catalogue des cours (CRUD)',
  },
  {
    path: '/search',
    label: 'Recherche',
    icon: Search,
    description: 'Filtres avancés par filière et niveau',
  },
  {
    path: '/learning',
    label: 'Apprentissage',
    icon: Sparkles,
    description: 'Flashcards, Playground C/Py, IA Résumés & Dico Tech',
  },
  {
    path: '/productivity',
    label: 'Productivité',
    icon: Clock,
    description: 'Pomodoro de groupe, Tableau blanc, iCal & Hors-ligne',
  },
  {
    path: '/evaluation',
    label: 'Évaluation',
    icon: Award,
    description: 'Notes, avis, badges de mérite & anti-plagiat',
  },
  {
    path: '/services',
    label: 'Services & Campus',
    icon: Briefcase,
    description: 'Petites annonces, stages, covoiturage & bibliographie',
  },
  {
    path: '/pricing',
    label: 'CampusHub Pro',
    icon: Crown,
    description: 'Offres Pro, paiements sécurisés & Mobile Money',
  },
  {
    path: '/admin',
    label: 'Administration',
    icon: ShieldCheck,
    description: 'Gestion des comptes, modération & statistiques UY1',
  },
  {
    path: '/favs-history',
    aliases: ['/favorites'],
    label: 'Favoris & Historique',
    icon: Star,
    badgeKey: 'favoritesCount',
    description: 'Cours enregistrés et consultations',
  },
  {
    path: '/notebook',
    label: 'Carnet Privé',
    icon: BookMarked,
    description: 'Brouillons et notes personnelles',
  },
  {
    path: '/profile',
    label: 'Profil',
    icon: User,
    description: 'Informations étudiantes et badges',
  },
];

export const PUBLIC_ROUTES = [
  { path: '/login', label: 'Connexion' },
  { path: '/register', label: 'Inscription' },
];
