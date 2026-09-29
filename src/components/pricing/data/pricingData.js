/**
 * Données de tarification pour le Module 10 : Tarification & Paiement (Pricing & Checkout)
 * Plateforme CampusHub — Université de Yaoundé I
 */

export const PRICING_PLANS = [
  {
    id: 'free',
    name: 'Plan Standard',
    tagline: 'L\'essentiel pour réviser et suivre ses cours à l\'Université de Yaoundé I.',
    monthlyPrice: 0,
    semesterPrice: 0,
    currency: 'FCFA',
    isPopular: false,
    ctaText: 'Votre formule actuelle',
    ctaDisabled: true,
    features: [
      { text: 'Accès aux polycopiés et annales publiques', included: true },
      { text: 'Consultation directe visionneuse PDF', included: true },
      { text: 'Minuteur Pomodoro de base', included: true },
      { text: 'Participation aux forums de discussion Q/R', included: true },
      { text: 'Playground C & Python (limité à 10 exécutions/jour)', included: false },
      { text: 'Générateur IA de résumés & quiz illimité', included: false },
      { text: 'Espace hors-ligne étendu (15 Go de cache)', included: false },
      { text: 'Détecteur anti-plagiat haute précision illimité', included: false },
      { text: 'Badge de distinction « Membre Pro Certifié »', included: false },
    ],
  },
  {
    id: 'pro',
    name: 'Plan Étudiant Pro',
    tagline: 'La formule plébiscitée par les majors de promo pour booster leurs notes.',
    monthlyPrice: 1500,
    semesterPrice: 6500, // Reduced from 9000 (1500 * 6 = 9000 -> 6500)
    savingsSemester: 'Économisez 2 500 FCFA',
    currency: 'FCFA',
    isPopular: true,
    popularBadge: 'Recommandé Majors UY1',
    ctaText: 'Passer à CampusHub Pro',
    ctaDisabled: false,
    features: [
      { text: 'Tout le Plan Standard inclus', included: true },
      { text: 'Playground C & Python illimité sans délai d\'attente', included: true },
      { text: 'Assistant IA : Résumés de cours & Quiz d\'examen illimités', included: true },
      { text: 'Stockage hors-ligne étendu (jusqu\'à 15 Go d\'annales en cache)', included: true },
      { text: 'Audit anti-plagiat avancé et vérification de conformité UY1', included: true },
      { text: 'Tableau blanc collaboratif avec exports vectoriels illimités', included: true },
      { text: 'Badge doré exclusif « Membre Pro / Certifié » sur votre profil', included: true },
      { text: 'Accès prioritaire aux annales d\'examens résolues avec corrigés types', included: true },
      { text: 'Support technique et tutorat collégial prioritaire', included: true },
    ],
  },
  {
    id: 'amphi',
    name: 'Plan Groupe & Délégué',
    tagline: 'Conçu pour les délégués d\'amphi, groupes de TP et collectifs d\'étude.',
    monthlyPrice: 3500,
    semesterPrice: 16000,
    savingsSemester: 'Économisez 5 000 FCFA',
    currency: 'FCFA',
    isPopular: false,
    ctaText: 'Activer le Pack Amphi',
    ctaDisabled: false,
    features: [
      { text: 'Tous les avantages Étudiant Pro pour 5 comptes binômes', included: true },
      { text: 'Espace partagé de TP et disques d\'amphi centralisés', included: true },
      { text: 'Tableau blanc interactif multi-curseurs en temps réel', included: true },
      { text: 'Organisation de sessions Pomodoro synchronisées privées', included: true },
      { text: 'Outil de diffusion des corrigés certifiés par les délégués', included: true },
      { text: 'Accréditation officielle de groupe d\'étude UY1', included: true },
    ],
  },
];

export const PRICING_FAQS = [
  {
    q: 'Quels sont les moyens de paiement acceptés au Cameroun ?',
    a: 'Nous acceptons directement MTN Mobile Money (MoMo), Orange Money (OM) ainsi que les cartes bancaires internationales (Visa, Mastercard) via une passerelle de paiement chiffrée SSL aux normes PCI-DSS.',
  },
  {
    q: 'Puis-je résilier mon abonnement à tout moment ?',
    a: 'Oui, sans aucun engagement. Vous pouvez stopper la reconduction en un clic depuis votre espace profil tout en conservant vos avantages Pro jusqu\'à la fin de la période payée.',
  },
  {
    q: 'Le badge « Membre Pro / Certifié » s\'affiche-t-il immédiatement ?',
    a: 'Dès la validation de votre paiement par Mobile Money ou carte bancaire, le badge officiel Pro est immédiatement crédité sur votre compte et visible auprès de tous vos camarades sur les forums et cours partagés.',
  },
  {
    q: 'Comment fonctionne la garantie de satisfaction étudiante ?',
    a: 'Si CampusHub Pro ne vous a pas aidé à préparer vos examens, nous vous remboursons intégralement sur simple demande sous 14 jours, sans justificatif.',
  },
];

export const TEST_PAYMENT_METHODS = [
  {
    id: 'momo',
    name: 'MTN Mobile Money',
    description: 'Paiement instantané via code USSD (*126#)',
    placeholder: '67X XX XX XX / 68X XX XX XX',
    prefix: '+237',
    badge: 'Cameroun',
    color: 'from-amber-400 to-yellow-500',
  },
  {
    id: 'om',
    name: 'Orange Money',
    description: 'Paiement sécurisé via code secret (#150#)',
    placeholder: '69X XX XX XX / 65X XX XX XX',
    prefix: '+237',
    badge: 'Cameroun',
    color: 'from-orange-500 to-amber-600',
  },
  {
    id: 'card',
    name: 'Carte Bancaire (Stripe)',
    description: 'Visa, Mastercard, UBA, Ecobank, etc.',
    placeholder: '4242 •••• •••• 4242',
    badge: 'International',
    color: 'from-indigo-600 to-blue-600',
  },
];
