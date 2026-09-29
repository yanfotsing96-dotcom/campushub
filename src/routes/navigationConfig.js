import {
  BookMarked,
  User,
  Search,
  Library,
  Star,
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
