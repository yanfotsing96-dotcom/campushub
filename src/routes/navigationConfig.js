import {
  User,
  Library,
  Sparkles,
  Award,
  ShieldCheck,
  Crown,
  HelpCircle,
  LayoutDashboard,
  FileCheck2,
} from 'lucide-react';

export const NAVIGATION_ITEMS = [
  {
    path: '/dashboard',
    label: 'Tableau de Bord',
    icon: LayoutDashboard,
    isPrimary: true,
    description: 'Espace étudiant cloisonné par filière et niveau',
  },
  {
    path: '/exams',
    label: 'Compositions en Ligne',
    icon: FileCheck2,
    description: 'Évaluations chronométrées, autosave et relevés notés',
  },
  {
    path: '/learning',
    label: 'Laboratoires & Playgrounds',
    icon: Sparkles,
    description: 'Bacs à sable C/Py, simulateurs physiques, chimie, biologie & maths',
  },
  {
    path: '/ressources',
    label: 'Ressources Nationales',
    icon: Library,
    description: 'Structure nationale : Universités, Facultés, Filières, Niveaux et UEs',
  },
  {
    path: '/profile',
    label: 'Profil National',
    icon: User,
    description: 'Identité académique, matricule et cursus',
  },
  {
    path: '/delegate',
    label: 'Espace Délégué',
    icon: Award,
    requiredRole: 'delegate',
    description: 'Avis officiels, calendrier de classe et coordination amphi',
  },
  {
    path: '/moderation',
    label: 'Console Modération',
    icon: ShieldCheck,
    requiredRole: 'moderator',
    description: 'Signalements, audit anti-plagiat et conformité',
  },
  {
    path: '/admin',
    label: 'Administration',
    icon: Crown,
    requiredRole: 'admin',
    description: 'Gestion des comptes, modération & statistiques nationales',
  },
  {
    path: '/help',
    label: 'Centre d\'Aide & FAQ',
    icon: HelpCircle,
    description: 'FAQ, guide d\'accueil et tickets d\'assistance',
  },
];

export const PUBLIC_ROUTES = [
  { path: '/login', label: 'Connexion' },
  { path: '/register', label: 'Inscription' },
];
