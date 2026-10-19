/**
 * Dataset officiel et typé du Lab L01 : Labo Mathématiques & Statistiques
 * Source : Document officiel MINESUP de repérage des filières CampusHub (Page 2)
 * 14 Filières réparties sur les 11 Universités d'État et Grandes Écoles Normales du Cameroun
 */

import type { IFiliereL01, ILab01Metadata } from '../../types/lab01';

export const LAB_01_METADATA: ILab01Metadata = {
  id: 'L01',
  code: 'L01',
  title: 'Labo Mathématiques & Statistiques',
  domain: 'Sciences fondamentales',
  totalFilieres: 14,
  regionsCouvertes: 10,
  universitesImpliquees: 11,
  description:
    "Laboratoire national d'analyse mathématique, d'algèbre fondamentale, d'optimisation numérique et de modélisation statistique avancée pour les facultés des sciences et grandes écoles normales du Cameroun.",
  accentColor: '#4338CA', // Indigo académique
  badgeColor: '#E0E7FF',
  officialDocumentSource: 'CampusHub · Repérage des filières MINESUP (Page 2)',
};

export const LAB_01_FILIERES: IFiliereL01[] = [
  {
    id: 'l01-uy1-fs',
    labId: 'L01',
    filiere: 'Mathématiques',
    faculte: 'FS – Faculté des Sciences',
    faculteSigle: 'FS',
    faculteNom: 'Faculté des Sciences',
    sigleUniversite: 'UY1',
    universite: 'Université de Yaoundé I (UY1)',
    pageDossier: 26,
    region: 'Centre',
    ville: 'Yaoundé',
    campus: 'Ngoa-Ekélé (Campus Principal)',
    typeEtablissement: 'Faculté universitaire',
    langueEnseignement: 'BILINGUAL',
    diplomes: ['Licence Mathématiques', 'Master Recherche', 'Doctorat / Ph.D'],
    specialites: [
      'Analyse numérique',
      'Algèbre & Géométrie',
      'Probabilités & Statistiques',
      'Modélisation biomathématique'
    ],
    modulesParNiveau: {
      L1_L2: ['Calculus & Analyse réelle', 'Algèbre linéaire I & II', 'Arithmétique & Polynômes', 'Python scientifique'],
      L3_M1: ['Topologie générale', 'Analyse complexe & Mesure', 'Algèbre générale', 'Calcul différentiel'],
      M2_Doctorat: ['Équations aux Dérivées Partielles (EDP)', 'Systèmes dynamiques & Contrôle', 'Biomathématiques appliquées']
    },
    syllabusInfo: {
      page: 26,
      codeUeExemples: ['MAT111', 'MAT121', 'MAT211', 'MAT311'],
      volumeHoraireAnnuel: 600,
      creditsEcts: 60
    },
    notes: 'Programme complet de Licence Mathématiques Fondamentales et Appliquées (Page 26 du dossier officiel).'
  },
  {
    id: 'l01-uy1-ens',
    labId: 'L01',
    filiere: 'Mathématiques',
    faculte: 'ENS – École Normale Supérieure',
    faculteSigle: 'ENS',
    faculteNom: 'École Normale Supérieure',
    sigleUniversite: 'UY1',
    universite: 'Université de Yaoundé I (UY1)',
    pageDossier: 54,
    region: 'Centre',
    ville: 'Yaoundé',
    campus: 'ENS Yaoundé',
    typeEtablissement: 'Grande École de Formation des Enseignants',
    langueEnseignement: 'BILINGUAL',
    diplomes: ['DIPES I', 'DIPES II', 'Master Didactique'],
    specialites: [
      'Didactique des mathématiques',
      'Analyse réelle et complexe',
      'Géométrie différentielle',
      'Pédagogie et TICE'
    ],
    modulesParNiveau: {
      L1_L2: ['Fondements de l\'analyse', 'Algèbre linéaire appliquée', 'Géométrie euclidienne et affine'],
      L3_M1: ['Didactique des concepts mathématiques', 'Histoire et épistémologie des sciences', 'Logiciels dynamiques (GeoGebra/SageMath)'],
      ENS_Didactique: ['Micro-enseignement', 'Élaboration de situations problèmes', 'Docimologie mathématique']
    },
    syllabusInfo: {
      page: 54,
      codeUeExemples: ['ENSMAT101', 'ENSDID201', 'ENSPED301'],
      volumeHoraireAnnuel: 650,
      creditsEcts: 60
    },
    notes: "Formation des professeurs de mathématiques des lycées et collèges d'enseignement secondaire général (Page 54 du dossier)."
  },
  {
    id: 'l01-udo-fs',
    labId: 'L01',
    filiere: 'Mathématiques',
    faculte: 'FS – Faculté des Sciences',
    faculteSigle: 'FS',
    faculteNom: 'Faculté des Sciences',
    sigleUniversite: 'UDo',
    universite: 'Université de Douala',
    pageDossier: 87,
    region: 'Littoral',
    ville: 'Douala',
    campus: 'Ndogbong',
    typeEtablissement: 'Faculté universitaire',
    langueEnseignement: 'BILINGUAL',
    diplomes: ['Licence', 'Master Professionnel / Recherche', 'Doctorat'],
    specialites: [
      'Mathématiques financières & Actuariat',
      'Optimisation combinatoire',
      'Calcul scientifique & Data Science'
    ],
    modulesParNiveau: {
      L1_L2: ['Algèbre matricielle', 'Probabilités discrètes', 'Programmation scientifique (Python/R)'],
      L3_M1: ['Processus stochastiques', 'Optimisation linéaire et non-linéaire', 'Mathématiques de la finance'],
      M2_Doctorat: ['Calcul stochastique & Marchés financiers', 'Recherche opérationnelle avancée', 'Big Data Analytics']
    },
    syllabusInfo: {
      page: 87,
      codeUeExemples: ['MAT101_UDO', 'MAT203_UDO', 'FIN_MATH301'],
      volumeHoraireAnnuel: 580,
      creditsEcts: 60
    },
    notes: 'Cursus orienté sciences fondamentales et modélisation industrielle littorale (Page 87 du dossier).'
  },
  {
    id: 'l01-uds-fs',
    labId: 'L01',
    filiere: 'Mathématiques',
    faculte: 'FS – Faculté des Sciences',
    faculteSigle: 'FS',
    faculteNom: 'Faculté des Sciences',
    sigleUniversite: 'UDs',
    universite: 'Université de Dschang',
    pageDossier: 147,
    region: 'Ouest',
    ville: 'Dschang',
    campus: 'Campus Principal de Dschang',
    typeEtablissement: 'Faculté universitaire',
    langueEnseignement: 'BILINGUAL',
    diplomes: ['Licence', 'Master', 'Doctorat'],
    specialites: [
      'Équations aux dérivées partielles',
      'Biostatistiques agricoles',
      'Topologie et analyse fonctionnelle'
    ],
    modulesParNiveau: {
      L1_L2: ['Analyse mathématique I', 'Algèbre générale', 'Statistique descriptive et inférentielle'],
      L3_M1: ['Mesure et intégration de Lebesgue', 'Espaces hilbertiens', 'Modélisation des populations'],
      M2_Doctorat: ['EDP et analyse asymptotique', 'Plans d\'expériences agronomiques', 'Simulations numériques avancées']
    },
    syllabusInfo: {
      page: 147,
      codeUeExemples: ['MATH112', 'MATH224', 'BIOSTAT310'],
      volumeHoraireAnnuel: 600,
      creditsEcts: 60
    },
    notes: 'Programme officiel UDs articulant mathématiques pures et applications agronomiques/médicales (Page 147).'
  },
  {
    id: 'l01-ub-fshs',
    labId: 'L01',
    filiere: 'Mathématiques',
    faculte: 'Faculty of Science & Health Sciences – Science',
    faculteSigle: 'FACULTY_OF_SCIENCE',
    faculteNom: 'Faculty of Science & Health Sciences – Science',
    sigleUniversite: 'UB',
    universite: 'University of Buea (UB)',
    pageDossier: 203,
    region: 'Sud-Ouest',
    ville: 'Buea',
    campus: 'Molyko Campus',
    typeEtablissement: 'Anglo-Saxon Faculty',
    langueEnseignement: 'EN',
    diplomes: ['B.Sc. Mathematics', 'M.Sc. Mathematics', 'Ph.D.'],
    specialites: [
      'Applied Mathematics',
      'Pure Mathematics',
      'Statistical Computing',
      'Operations Research'
    ],
    modulesParNiveau: {
      L1_L2: ['MAT 201: Calculus I & II', 'MAT 203: Linear Algebra & Vector Spaces', 'MAT 205: Introduction to Statistics'],
      L3_M1: ['MAT 301: Real Analysis', 'MAT 305: Complex Variables', 'MAT 401: Abstract Algebra', 'MAT 407: Numerical Analysis'],
      M2_Doctorat: ['MAT 601: Advanced Differential Equations', 'MAT 615: Mathematical Modelling', 'Ph.D. Thesis Research']
    },
    syllabusInfo: {
      page: 203,
      codeUeExemples: ['MAT 201', 'MAT 203', 'MAT 301', 'MAT 401'],
      volumeHoraireAnnuel: 600,
      creditsEcts: 60
    },
    notes: 'Syllabus complet sous le système anglo-saxon avec crédits GPA (Page 203 du dossier).'
  },
  {
    id: 'l01-uba-fs',
    labId: 'L01',
    filiere: 'Mathématiques',
    faculte: 'FS – Faculté des Sciences',
    faculteSigle: 'FS',
    faculteNom: 'Faculté des Sciences',
    sigleUniversite: 'UBa',
    universite: 'The University of Bamenda (UBma)',
    pageDossier: 242,
    region: 'Nord-Ouest',
    ville: 'Bambili - Bamenda',
    campus: 'Bambili Campus',
    typeEtablissement: 'Anglo-Saxon Faculty',
    langueEnseignement: 'EN',
    diplomes: ['B.Sc.', 'M.Sc.', 'Ph.D.'],
    specialites: [
      'Mathematical Physics',
      'Stochastic Processes',
      'Numerical Methods'
    ],
    modulesParNiveau: {
      L1_L2: ['MATH 111: Foundation Calculus', 'MATH 122: Discrete Mathematics', 'MATH 211: Differential Equations'],
      L3_M1: ['MATH 311: Metric Spaces', 'MATH 322: Group Theory', 'MATH 333: Applied Probability Models'],
      M2_Doctorat: ['MATH 501: Fluid Dynamics Mathematics', 'MATH 520: Advanced Quantum Mathematics']
    },
    syllabusInfo: {
      page: 242,
      codeUeExemples: ['MATH 111', 'MATH 211', 'MATH 311'],
      volumeHoraireAnnuel: 600,
      creditsEcts: 60
    },
    notes: 'Programme académique en langue anglaise UBa (Page 242 du dossier officiel).'
  },
  {
    id: 'l01-uba-httc',
    labId: 'L01',
    filiere: 'Mathématiques',
    faculte: 'HTTC – Higher Teacher Training College',
    faculteSigle: 'HTTC',
    faculteNom: 'Higher Teacher Training College',
    sigleUniversite: 'UBa',
    universite: 'The University of Bamenda (UBma)',
    pageDossier: 281,
    region: 'Nord-Ouest',
    ville: 'Bambili',
    campus: 'HTTC Bambili',
    typeEtablissement: 'Higher Teacher Training College (ENS anglophone)',
    langueEnseignement: 'EN',
    diplomes: ['DIPES I (HTTC)', 'DIPES II (HTTC)'],
    specialites: [
      'Mathematics Teacher Education',
      'School Mathematics Pedagogy',
      'Calculus & Linear Algebra for Teaching'
    ],
    modulesParNiveau: {
      L1_L2: ['General Mathematics for Educators', 'Geometry & Trigonometry', 'Educational Foundations'],
      L3_M1: ['Curriculum Development in Secondary Maths', 'Computer Assisted Mathematics Learning', 'Practicum Teaching I & II'],
      ENS_Didactique: ['Classroom Pedagogy', 'Measurement and Evaluation in Mathematics']
    },
    syllabusInfo: {
      page: 281,
      codeUeExemples: ['EDM 201', 'EDM 305', 'PRAC 400'],
      volumeHoraireAnnuel: 650,
      creditsEcts: 60
    },
    notes: "Filière officielle de formation des enseignants de mathématiques en zone anglophone (Page 281 du dossier)."
  },
  {
    id: 'l01-ung-fs',
    labId: 'L01',
    filiere: 'Mathématiques',
    faculte: 'FS – Faculté des Sciences',
    faculteSigle: 'FS',
    faculteNom: 'Faculté des Sciences',
    sigleUniversite: 'UNg',
    universite: 'Université de Ngaoundéré',
    pageDossier: 305,
    region: 'Adamaoua',
    ville: 'Ngaoundéré',
    campus: 'Campus de Dang',
    typeEtablissement: 'Faculté universitaire',
    langueEnseignement: 'BILINGUAL',
    diplomes: ['Licence', 'Master', 'Doctorat'],
    specialites: [
      'Mathématiques pures',
      'Statistique et traitement de données',
      'Systèmes dynamiques'
    ],
    modulesParNiveau: {
      L1_L2: ['Algèbre élémentaire', 'Analyse dans R', 'Introduction à la programmation Python'],
      L3_M1: ['Topologie et géométrie différentielle', 'Statistiques non-paramétriques', 'Séries de Fourier & EDP'],
      M2_Doctorat: ['Modélisation des écosystèmes sahéliens', 'Théorie ergodique', 'Statistique spatiale']
    },
    syllabusInfo: {
      page: 305,
      codeUeExemples: ['MAT110_UNG', 'MAT220_UNG', 'STAT315'],
      volumeHoraireAnnuel: 590,
      creditsEcts: 60
    },
    notes: "Pôle de calcul mathématique et d'analyse de données de la région du château d'eau (Page 305 du dossier)."
  },
  {
    id: 'l01-uma-fs',
    labId: 'L01',
    filiere: 'Mathématiques',
    faculte: 'FS – Faculté des Sciences',
    faculteSigle: 'FS',
    faculteNom: 'Faculté des Sciences',
    sigleUniversite: 'UMa',
    universite: 'Université de Maroua',
    pageDossier: 358,
    region: 'Extrême-Nord',
    ville: 'Maroua',
    campus: 'Kongola-Djiddéo',
    typeEtablissement: 'Faculté universitaire',
    langueEnseignement: 'BILINGUAL',
    diplomes: ['Licence', 'Master', 'Doctorat'],
    specialites: [
      'Analyse mathématique',
      'Optimisation des ressources',
      'Statistiques appliquées'
    ],
    modulesParNiveau: {
      L1_L2: ['Algèbre linéaire', 'Suites et séries numériques', 'Calcul des probabilités'],
      L3_M1: ['Optimisation convexe', 'Analyse numérique matricielle', 'Équations différentielles'],
      M2_Doctorat: ['Mathématiques pour le développement durable', 'Contrôle optimal', 'Recherche appliquée']
    },
    syllabusInfo: {
      page: 358,
      codeUeExemples: ['UMA_M101', 'UMA_M202', 'UMA_OPT301'],
      volumeHoraireAnnuel: 580,
      creditsEcts: 60
    },
    notes: 'Programme universitaire du Sahel pour les sciences exactes (Page 358 du dossier).'
  },
  {
    id: 'l01-uma-ens',
    labId: 'L01',
    filiere: 'Mathématiques',
    faculte: 'ENS – École Normale Supérieure',
    faculteSigle: 'ENS',
    faculteNom: 'École Normale Supérieure',
    sigleUniversite: 'UMa',
    universite: 'Université de Maroua',
    pageDossier: 392,
    region: 'Extrême-Nord',
    ville: 'Maroua',
    campus: 'ENS Maroua',
    typeEtablissement: 'Grande École de Formation des Enseignants',
    langueEnseignement: 'BILINGUAL',
    diplomes: ['DIPES I', 'DIPES II'],
    specialites: [
      'Enseignement secondaire des mathématiques',
      'Algèbre linéaire',
      'Analyse mathématique avancée'
    ],
    modulesParNiveau: {
      L1_L2: ['Compléments de mathématiques fondamentales', 'Psychopédagogie de l\'adolescent'],
      L3_M1: ['Didactique de la géométrie et de l\'analyse', 'TICE appliquées à l\'enseignement'],
      ENS_Didactique: ['Stages pratiques d\'enseignement', 'Évaluation des compétences scolaires']
    },
    syllabusInfo: {
      page: 392,
      codeUeExemples: ['ENSUMA_M1', 'ENSUMA_DID', 'ENSUMA_STG'],
      volumeHoraireAnnuel: 640,
      creditsEcts: 60
    },
    notes: 'Formation des enseignants du secondaire septentrional (Page 392 du dossier).'
  },
  {
    id: 'l01-uga-fs',
    labId: 'L01',
    filiere: 'Mathématiques',
    faculte: 'FS – Faculté des Sciences',
    faculteSigle: 'FS',
    faculteNom: 'Faculté des Sciences',
    sigleUniversite: 'UGa',
    universite: 'Université de Garoua',
    pageDossier: 417,
    region: 'Nord',
    ville: 'Garoua',
    campus: 'Campus Principal de Garoua',
    typeEtablissement: 'Faculté universitaire',
    langueEnseignement: 'BILINGUAL',
    diplomes: ['Licence Fondamentale', 'Master'],
    specialites: [
      'Mathématiques appliquées',
      'Statistique décisionnelle',
      'Calcul différentiel'
    ],
    modulesParNiveau: {
      L1_L2: ['Fondements d\'analyse et algèbre', 'Probabilités et échantillonnage', 'Outils informatiques pour mathématiciens'],
      L3_M1: ['Méthodes numériques avancées', 'Modélisation statistique', 'Recherche opérationnelle']
    },
    syllabusInfo: {
      page: 417,
      codeUeExemples: ['UGA_MAT101', 'UGA_STAT202', 'UGA_NUM301'],
      volumeHoraireAnnuel: 580,
      creditsEcts: 60
    },
    notes: "Nouvelle université d'État créée par décret présidentiel de 2022 (Page 417 du dossier)."
  },
  {
    id: 'l01-ube-fs',
    labId: 'L01',
    filiere: 'Mathématiques',
    faculte: 'FS – Faculté des Sciences',
    faculteSigle: 'FS',
    faculteNom: 'Faculté des Sciences',
    sigleUniversite: 'UBe',
    universite: 'Université de Bertoua',
    pageDossier: 443,
    region: 'Est',
    ville: 'Bertoua',
    campus: 'Campus de Bertoua',
    typeEtablissement: 'Faculté universitaire',
    langueEnseignement: 'BILINGUAL',
    diplomes: ['Licence', 'Master'],
    specialites: [
      'Mathématiques générales',
      'Analyse numérique',
      'Algèbre abstraite'
    ],
    modulesParNiveau: {
      L1_L2: ['Analyse réelle approfondie', 'Espaces vectoriels & Matrices', 'Statistique descriptive'],
      L3_M1: ['Théorie des groupes et anneaux', 'Analyse numérique des équations', 'Introduction aux EDP']
    },
    syllabusInfo: {
      page: 443,
      codeUeExemples: ['UBE_MAT11', 'UBE_ALG21', 'UBE_ANA31'],
      volumeHoraireAnnuel: 580,
      creditsEcts: 60
    },
    notes: "Faculté des Sciences de l'Université de Bertoua (Région de l'Est, Page 443 du dossier)."
  },
  {
    id: 'l01-ube-ens',
    labId: 'L01',
    filiere: 'Mathématiques',
    faculte: 'ENS – École Normale Supérieure',
    faculteSigle: 'ENS',
    faculteNom: 'École Normale Supérieure',
    sigleUniversite: 'UBe',
    universite: 'Université de Bertoua',
    pageDossier: 483,
    region: 'Est',
    ville: 'Bertoua',
    campus: 'ENS Bertoua',
    typeEtablissement: 'Grande École de Formation des Enseignants',
    langueEnseignement: 'BILINGUAL',
    diplomes: ['DIPES I', 'DIPES II'],
    specialites: [
      'Didactique des sciences mathématiques',
      'Analyse et Géométrie',
      "Probabilités pour l'enseignement"
    ],
    modulesParNiveau: {
      L1_L2: ['Notions clés pour le secondaire', 'Pédagogie générale'],
      L3_M1: ['Ingénierie didactique', 'Pratiques d\'évaluation en classe'],
      ENS_Didactique: ['Stage en lycée pilote', 'Mémoire professionnel DIPES II']
    },
    syllabusInfo: {
      page: 483,
      codeUeExemples: ['ENSB_MAT10', 'ENSB_DID20', 'ENSB_MEM30'],
      volumeHoraireAnnuel: 640,
      creditsEcts: 60
    },
    notes: "Formation professorale ENS Bertoua (Page 483 du dossier d'inscription)."
  },
  {
    id: 'l01-ueb-fs',
    labId: 'L01',
    filiere: 'Mathématiques',
    faculte: 'FS – Faculté des Sciences',
    faculteSigle: 'FS',
    faculteNom: 'Faculté des Sciences',
    sigleUniversite: 'UEb',
    universite: "Université d'Ebolowa",
    pageDossier: 496,
    region: 'Sud',
    ville: 'Ebolowa',
    campus: 'Campus Principal d\'Ebolowa',
    typeEtablissement: 'Faculté universitaire',
    langueEnseignement: 'BILINGUAL',
    diplomes: ['Licence Mathématiques', 'Master'],
    specialites: [
      'Mathématiques appliquées',
      'Modélisation environnementale',
      'Analyse complexe'
    ],
    modulesParNiveau: {
      L1_L2: ['Analyse infinitésimale', 'Algèbre linéaire et bilinéaire', 'Probabilités et modélisation'],
      L3_M1: ['Mécanique des milieux continus', 'Équations différentielles appliquées', 'Statistique environnementale'],
      M2_Doctorat: ['Modèles mathématiques pour la biomasse et forêts', 'Calcul parallèle']
    },
    syllabusInfo: {
      page: 496,
      codeUeExemples: ['UEB_MAT101', 'UEB_ENV202', 'UEB_MODEL301'],
      volumeHoraireAnnuel: 580,
      creditsEcts: 60
    },
    notes: "Faculté des Sciences de l'Université d'Ebolowa (Page 496 du dossier officiel)."
  }
];

export default LAB_01_FILIERES;
