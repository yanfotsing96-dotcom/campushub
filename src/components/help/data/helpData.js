/**
 * Données pour le Centre d'Aide, FAQ & Support
 * Plateforme CampusHub — Cameroun
 */

export const HELP_CATEGORIES = [
  { id: 'all', label: 'Tous les Sujets', icon: 'Sparkles', color: '#6366f1' },
  { id: 'account', label: 'Compte & Connexion', icon: 'User', color: '#0ea5e9' },
  { id: 'resources', label: 'Ressources & Annales', icon: 'BookOpen', color: '#10b981' },
  { id: 'playground', label: 'Playground C / Python', icon: 'Terminal', color: '#f59e0b' },
  { id: 'billing', label: 'Abonnement & Paiement Pro', icon: 'Crown', color: '#8b5cf6' },
  { id: 'moderation', label: 'Règles de Modération', icon: 'ShieldCheck', color: '#ec4899' },
];

export const FAQ_ITEMS = [
  {
    id: 'faq-1',
    category: 'account',
    question: 'Comment créer mon compte et sélectionner mon université ?',
    answer: 'Lors de votre inscription ou à tout moment depuis votre profil, vous pouvez sélectionner votre établissement d\'origine parmi toutes les universités d\'État (Université de Yaoundé I, Université de Douala, Dschang, Buea, Bamenda...) et grandes écoles d\'ingénieurs (ENSPY, ENSPD). Renseignez votre filière et votre matricule académique pour débloquer les recommandations personnalisées.',
    tags: ['Inscription', 'Matricule', 'Université'],
  },
  {
    id: 'faq-2',
    category: 'account',
    question: 'J\'ai oublié mon mot de passe ou mon matricule, que faire ?',
    answer: 'Cliquez sur « Mot de passe oublié » sur la page de connexion. Un lien de réinitialisation sécurisé sera envoyé à votre adresse email universitaire. Si vous rencontrez un blocage lié à votre matricule, soumettez un ticket ci-dessous avec une photo de votre reçu de paiement des droits universitaires.',
    tags: ['Mot de passe', 'Sécurité', 'Récupération'],
  },
  {
    id: 'faq-3',
    category: 'resources',
    question: 'Comment publier un nouveau polycopié ou une annale d\'examen ?',
    answer: 'Rendez-vous dans la section « Ressources Nationales », puis utilisez le formulaire « Ajouter un cours ou document ». Précisez le titre de l\'UE (ex: INF201, MAT101), le nom de l\'enseignant, le type de document (Cours, TD, Partiel résolu), et joignez le fichier PDF. Votre document sera instantanément indexé et accessible à vos camarades.',
    tags: ['Publication', 'PDF', 'Cours', 'Annales'],
  },
  {
    id: 'faq-4',
    category: 'resources',
    question: 'Puis-je consulter les documents hors-ligne sans connexion internet ?',
    answer: 'Oui ! Tous les documents que vous ajoutez à vos Favoris sont automatiquement mis en mémoire cache dans votre navigateur. Vous pouvez les consulter même lors des coupures de réseau sur le campus de Ngoa-Ekellé ou en amphi. Les abonnés Pro bénéficient d\'un quota de stockage hors-ligne étendu jusqu\'à 15 Go.',
    tags: ['Hors-ligne', 'Cache', 'Favoris'],
  },
  {
    id: 'faq-5',
    category: 'playground',
    question: 'Comment fonctionne le Playground de programmation C, Python et SQL ?',
    answer: 'Le Playground permet d\'écrire et d\'exécuter du code source directement dans votre navigateur sans aucune installation locale de compilateur. Pour le langage C, un environnement GCC avec prise en charge des pointeurs et des threads POSIX est simulé. Pour Python 3, les structures de données (arbres, graphes, dictionnaires) sont exécutées en temps réel avec mesure du temps d\'exécution.',
    tags: ['C', 'GCC', 'Python', 'SQL', 'Compilateur'],
  },
  {
    id: 'faq-6',
    category: 'playground',
    question: 'Quelles sont les limites d\'exécution de code sur le Playground ?',
    answer: 'Les comptes gratuits disposent de 10 exécutions par jour avec un délai d\'attente standard de 10 secondes. Les étudiants membres CampusHub Pro disposent d\'un accès illimité, sans aucun délai d\'attente et avec une console de télémétrie mémoire approfondie.',
    tags: ['Quotas', 'Limites', 'Pro'],
  },
  {
    id: 'faq-7',
    category: 'billing',
    question: 'Quels sont les moyens de paiement acceptés pour CampusHub Pro ?',
    answer: 'Nous acceptons directement MTN Mobile Money (MoMo) avec validation USSD (*126#) et Orange Money (OM avec #150#) au Cameroun, ainsi que les cartes bancaires internationales (Visa, Mastercard) via une passerelle de paiement sécurisée chiffrée SSL aux normes PCI-DSS.',
    tags: ['MoMo', 'Orange Money', 'Paiement', 'Stripe'],
  },
  {
    id: 'faq-8',
    category: 'billing',
    question: 'Comment est attribué le badge « Membre Pro Certifié UY1 » ?',
    answer: 'Dès que votre paiement Mobile Money ou carte bancaire est validé (sous 2 à 3 secondes), votre statut est instantanément mis à niveau. La couronne dorée et le badge officiel apparaissent automatiquement sur votre profil, dans la barre latérale et sur vos publications sur les forums.',
    tags: ['Badge Pro', 'Certification', 'Avantages'],
  },
  {
    id: 'faq-9',
    category: 'billing',
    question: 'Puis-je résilier mon abonnement et me faire rembourser ?',
    answer: 'Tout à fait. Les abonnements sont sans engagement de durée. De plus, nous offrons une garantie de satisfaction étudiante : si CampusHub Pro ne correspond pas à vos attentes pour vos révisions, vous pouvez demander un remboursement intégral sous 14 jours via le formulaire de support.',
    tags: ['Remboursement', 'Garantie', 'Résiliation'],
  },
  {
    id: 'faq-10',
    category: 'moderation',
    question: 'Quelles sont les règles de publication pour éviter la suppression d\'un document ?',
    answer: 'Tout document partagé doit respecter la charte académique : il doit s\'agir d\'un document pédagogique vérifiable (cours professoral, fiche de TD, annale officielle). Les contenus plagiés, les examens en cours de déroulement (fraude) ou les documents illisibles sont automatiquement signalés et supprimés par l\'équipe de modération.',
    tags: ['Charte', 'Anti-Fraude', 'Modération'],
  },
  {
    id: 'faq-11',
    category: 'moderation',
    question: 'Comment fonctionne le système d\'audit anti-plagiat ?',
    answer: 'Notre outil d\'analyse compare les rapports de TP et devoirs soumis avec la base de données nationale des thèses et polycopiés universitaires. Il fournit un indice de similarité en pourcentage et surligne les passages textuels identiques pour vous aider à citer correctement vos sources bibliographiques.',
    tags: ['Anti-Plagiat', 'Similarité', 'Intégrité'],
  },
  {
    id: 'faq-12',
    category: 'account',
    question: 'Comment gagner des points d\'expérience (XP) et monter de niveau ?',
    answer: 'Vous gagnez automatiquement des XP en contribuant à la communauté : +50 XP pour la publication d\'un cours validé, +25 XP pour chaque exécution d\'algorithme sur le Playground, +15 XP pour une note d\'évaluation 1-5★ utile, et des bonus lors des sessions Pomodoro d\'amphi.',
    tags: ['XP', 'Gamification', 'Niveaux'],
  },
];

export const ONBOARDING_STEPS = [
  {
    step: 1,
    title: 'Configurez votre Profil Universitaire',
    description: 'Sélectionnez votre université camerounaise (UY1, ENSPY, Douala, Dschang, Buea...), indiquez votre filière et votre matricule pour recevoir des recommandations ciblées.',
    icon: 'UserCheck',
    actionText: 'Accéder à mon Profil',
    actionLink: '/profile',
    badge: 'Étape Obligatoire',
    tip: '💡 Votre université peut être modifiée à tout moment via le sélecteur national en haut de page.',
  },
  {
    step: 2,
    title: 'Explorez le Pôle Tech & Code',
    description: 'Accédez au laboratoire de programmation C, Python et SQL. Testez les corrigés d\'arbres binaires, l\'algorithme de Dijkstra et les primitives POSIX sans rien installer.',
    icon: 'Terminal',
    actionText: 'Ouvrir le Pôle Tech',
    actionLink: '/tech-hub',
    badge: 'Cœur Tech Flagship',
    tip: '💡 Exécuter un algorithme crédite immédiatement +25 XP sur votre profil étudiant !',
  },
  {
    step: 3,
    title: 'Téléchargez les Annales & Activez le Mode Hors-Ligne',
    description: 'Mettez en favoris les fiches de TD et corrigés d\'examens. Ils restent lisibles en amphi même en l\'absence de connexion Internet grâce au cache local.',
    icon: 'BookOpen',
    actionText: 'Voir le Catalogue',
    actionLink: '/ressources',
    badge: 'Indispensable',
    tip: '💡 Vos favoris sont synchronisés et consultables dans l\'onglet "Favoris & Historique".',
  },
  {
    step: 4,
    title: 'Boostez votre Productivité avec le Pomodoro',
    description: 'Rejoignez les sessions synchronisées de travail d\'amphi (25 min de révision / 5 min de pause) et utilisez le tableau blanc interactif pour schématiser vos cours.',
    icon: 'Clock',
    actionText: 'Lancer un Pomodoro',
    actionLink: '/productivity',
    badge: 'Méthode Éprouvée',
    tip: '💡 Compatible avec les exports d\'emplois du temps au format iCalendar (.ics).',
  },
  {
    step: 5,
    title: 'Rejoignez le Cercle CampusHub Pro',
    description: 'Activez la formule Pro via MTN MoMo ou Orange Money (1 500 FCFA/mois) pour débloquer le compilateur illimité, le tuteur IA d\'examen et le badge officiel de major.',
    icon: 'Crown',
    actionText: 'Découvrir les Offres Pro',
    actionLink: '/pricing',
    badge: 'Excellence',
    tip: '💡 Réduction de 25% disponible sur la formule semestrielle (6 mois).',
  },
];

export const TICKET_CATEGORIES = [
  { id: 'bug', label: '🐛 Signalement de Bug Technique' },
  { id: 'payment', label: '💳 Problème de Paiement (MoMo / OM / Carte)' },
  { id: 'document', label: '📄 Signalement de Document (Erreur ou Plagiat)' },
  { id: 'account', label: '🔑 Problème de Compte ou Matricule' },
  { id: 'feature', label: '💡 Suggestion Pédagogique ou Nouvelle Fonctionnalité' },
  { id: 'other', label: '💬 Autre Demande d\'Assistance' },
];

export const TICKET_PRIORITIES = [
  { id: 'low', label: 'Basse (Question générale)' },
  { id: 'normal', label: 'Normale (Traitement sous 12h)' },
  { id: 'urgent', label: 'Urgente (Examen ou concours imminent)' },
];
