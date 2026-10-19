/**
 * Structure de données officielle du Lab L02 : Labo Physique
 * Source : Document officiel MINESUP de repérage des filières CampusHub (Pages 2 et 3)
 * Domaine : Sciences fondamentales
 * Nombre de filières répertoriées : 14
 */

export const LAB_02_METADATA = {
  id: 'L02',
  code: 'L02',
  title: 'Labo Physique',
  domain: 'Sciences fondamentales',
  totalFilieres: 14,
  description:
    "Laboratoire d'expérimentation physique, mécanique du point et des solides, électromagnétisme de Maxwell, optique ondulatoire et géométrique, thermodynamique et physique quantique pour les universités d'État et ENS du Cameroun.",
  accentColor: '#0284C7', // Bleu Cyan / Technique Physique
  badgeColor: '#E0F2FE',
};

export const LAB_02_FILIERES = [
  {
    id: 'l02-uy1-fs',
    labId: 'L02',
    filiere: 'Physique',
    faculte: 'FS – Faculté des Sciences',
    faculteSigle: 'FS',
    faculteNom: 'Faculté des Sciences',
    sigleUniversite: 'UY1',
    universite: 'Université de Yaoundé I (UY1)',
    pageDossier: 27,
    region: 'Centre',
    ville: 'Yaoundé (Ngoa-Ekélé)',
    typeEtablissement: 'Faculté universitaire',
    diplomes: ['Licence de Physique', 'Master Recherche', 'Doctorat / Ph.D'],
    specialites: [
      'Mécanique & Matériaux',
      'Électronique, Électrotechnique & Automatique',
      'Physique du Rayonnement & Nucléaire',
      'Énergies Renouvelables'
    ],
    notes: 'Programme complet de Licence de Physique fondamentale et appliquée (Page 27 du dossier officiel).'
  },
  {
    id: 'l02-uy1-ens',
    labId: 'L02',
    filiere: 'Physique',
    faculte: 'ENS – École Normale Supérieure',
    faculteSigle: 'ENS',
    faculteNom: 'École Normale Supérieure',
    sigleUniversite: 'UY1',
    universite: 'Université de Yaoundé I (UY1)',
    pageDossier: 54,
    region: 'Centre',
    ville: 'Yaoundé',
    typeEtablissement: 'Grande École de Formation des Enseignants',
    diplomes: ['DIPES I', 'DIPES II', 'Master Didactique des Sciences'],
    specialites: [
      'Didactique de la physique',
      'Optique expérimentale',
      'Électrodynamique classique',
      'Travaux pratiques de laboratoire'
    ],
    notes: 'Formation des professeurs de physique-chimie des lycées et collèges d\'enseignement secondaire (Page 54).'
  },
  {
    id: 'l02-udo-fs',
    labId: 'L02',
    filiere: 'Physique',
    faculte: 'FS – Faculté des Sciences',
    faculteSigle: 'FS',
    faculteNom: 'Faculté des Sciences',
    sigleUniversite: 'UDo',
    universite: 'Université de Douala',
    pageDossier: 88,
    region: 'Littoral',
    ville: 'Douala (Ndogbong)',
    typeEtablissement: 'Faculté universitaire',
    diplomes: ['Licence', 'Master Professionnel / Recherche', 'Doctorat'],
    specialites: [
      'Physique des matériaux & nanosciences',
      'Instrumentation & Métrologie industrielle',
      'Thermodynamique des fluides'
    ],
    notes: 'Pôle orienté physique appliquée, instrumentation industrielle et énergétique du Littoral (Page 88).'
  },
  {
    id: 'l02-uds-fs',
    labId: 'L02',
    filiere: 'Physique',
    faculte: 'FS – Faculté des Sciences',
    faculteSigle: 'FS',
    faculteNom: 'Faculté des Sciences',
    sigleUniversite: 'UDs',
    universite: 'Université de Dschang',
    pageDossier: 148,
    region: 'Ouest',
    ville: 'Dschang',
    typeEtablissement: 'Faculté universitaire',
    diplomes: ['Licence', 'Master', 'Doctorat'],
    specialites: [
      'Physique théorique & modélisation',
      'Électronique et traitement du signal',
      'Géophysique & physique environnementale'
    ],
    notes: 'Cursus articulé autour de la physique fondamentale et des applications géophysiques de l\'Ouest (Page 148).'
  },
  {
    id: 'l02-ub-fshs',
    labId: 'L02',
    filiere: 'Physique',
    faculte: 'Faculty of Science & Health Sciences – Science',
    faculteSigle: 'Faculty of Science',
    faculteNom: 'Faculty of Science & Health Sciences – Science',
    sigleUniversite: 'UB',
    universite: 'University of Buea (UB)',
    pageDossier: 204,
    region: 'Sud-Ouest',
    ville: 'Buea',
    typeEtablissement: 'Anglo-Saxon Faculty',
    diplomes: ['B.Sc. Physics', 'M.Sc. Physics', 'Ph.D.'],
    specialites: [
      'Condensed Matter Physics',
      'Renewable Energy & Solar Cells',
      'Telecommunications & Photonics',
      'Computational Physics'
    ],
    notes: 'Syllabus complet du département de physique sous système anglo-saxon (GPA / Crédits, Page 204).'
  },
  {
    id: 'l02-uba-fs',
    labId: 'L02',
    filiere: 'Physique',
    faculte: 'FS – Faculté des Sciences',
    faculteSigle: 'FS',
    faculteNom: 'Faculté des Sciences',
    sigleUniversite: 'UBa',
    universite: 'The University of Bamenda (UBma)',
    pageDossier: 243,
    region: 'Nord-Ouest',
    ville: 'Bambili - Bamenda',
    typeEtablissement: 'Anglo-Saxon Faculty',
    diplomes: ['B.Sc.', 'M.Sc.', 'Ph.D.'],
    specialites: [
      'Atmospheric Physics',
      'Solid State Physics',
      'Electronics & Microprocessors'
    ],
    notes: 'Programme anglophone UBa axé sur la physique expérimentale et des matériaux (Page 243 du dossier).'
  },
  {
    id: 'l02-uba-httc',
    labId: 'L02',
    filiere: 'Physique',
    faculte: 'HTTC – Higher Teacher Training College',
    faculteSigle: 'HTTC',
    faculteNom: 'Higher Teacher Training College',
    sigleUniversite: 'UBa',
    universite: 'The University of Bamenda (UBma)',
    pageDossier: 281,
    region: 'Nord-Ouest',
    ville: 'Bambili',
    typeEtablissement: 'Higher Teacher Training College (ENS anglophone)',
    diplomes: ['DIPES I (HTTC)', 'DIPES II (HTTC)'],
    specialites: [
      'Physics Education',
      'Practical Physics & Lab Design',
      'Electromagnetism & Waves'
    ],
    notes: 'Formation professorale des enseignants de physique pour le sous-système anglophone (Page 281).'
  },
  {
    id: 'l02-ung-fs',
    labId: 'L02',
    filiere: 'Physique',
    faculte: 'FS – Faculté des Sciences',
    faculteSigle: 'FS',
    faculteNom: 'Faculté des Sciences',
    sigleUniversite: 'UNg',
    universite: 'Université de Ngaoundéré',
    pageDossier: 306,
    region: 'Adamaoua',
    ville: 'Ngaoundéré (Dang)',
    typeEtablissement: 'Faculté universitaire',
    diplomes: ['Licence', 'Master', 'Doctorat'],
    specialites: [
      'Énergie solaire & Thermique',
      'Physique des plasmas',
      'Mécanique des milieux continus'
    ],
    notes: 'Pôle d\'excellence pour l\'énergie thermique et solaire de la zone soudano-sahélienne (Page 306).'
  },
  {
    id: 'l02-uma-fs',
    labId: 'L02',
    filiere: 'Physique',
    faculte: 'FS – Faculté des Sciences',
    faculteSigle: 'FS',
    faculteNom: 'Faculté des Sciences',
    sigleUniversite: 'UMa',
    universite: 'Université de Maroua',
    pageDossier: 359,
    region: 'Extrême-Nord',
    ville: 'Maroua (Kongola)',
    typeEtablissement: 'Faculté universitaire',
    diplomes: ['Licence', 'Master', 'Doctorat'],
    specialites: [
      'Physique de la matière condensée',
      'Rayonnement solaire & photovoltaïque',
      'Physique atomique et moléculaire'
    ],
    notes: 'Programme universitaire du Sahel axé sur l\'énergie renouvelable et la physique fondamentale (Page 359).'
  },
  {
    id: 'l02-uma-ens',
    labId: 'L02',
    filiere: 'Physique',
    faculte: 'ENS – École Normale Supérieure',
    faculteSigle: 'ENS',
    faculteNom: 'École Normale Supérieure',
    sigleUniversite: 'UMa',
    universite: 'Université de Maroua',
    pageDossier: 392,
    region: 'Extrême-Nord',
    ville: 'Maroua',
    typeEtablissement: 'Grande École de Formation des Enseignants',
    diplomes: ['DIPES I', 'DIPES II'],
    specialites: [
      'Enseignement secondaire de la physique',
      'Optique & Ondes',
      'Mécanique générale & TP'
    ],
    notes: 'Formation des enseignants de sciences physiques pour le Grand Nord camerounais (Page 392).'
  },
  {
    id: 'l02-uga-fs',
    labId: 'L02',
    filiere: 'Physique',
    faculte: 'FS – Faculté des Sciences',
    faculteSigle: 'FS',
    faculteNom: 'Faculté des Sciences',
    sigleUniversite: 'UGa',
    universite: 'Université de Garoua',
    pageDossier: 418,
    region: 'Nord',
    ville: 'Garoua',
    typeEtablissement: 'Faculté universitaire',
    diplomes: ['Licence Fondamentale', 'Master'],
    specialites: [
      'Physique générale',
      'Électrodynamique',
      'Thermodynamique appliquée'
    ],
    notes: 'Faculté des Sciences de l\'Université d\'État de Garoua créée par décret présidentiel en 2022 (Page 418).'
  },
  {
    id: 'l02-ube-fs',
    labId: 'L02',
    filiere: 'Physique',
    faculte: 'FS – Faculté des Sciences',
    faculteSigle: 'FS',
    faculteNom: 'Faculté des Sciences',
    sigleUniversite: 'UBe',
    universite: 'Université de Bertoua',
    pageDossier: 444,
    region: 'Est',
    ville: 'Bertoua',
    typeEtablissement: 'Faculté universitaire',
    diplomes: ['Licence', 'Master'],
    specialites: [
      'Physique appliquée',
      'Électronique de base',
      'Mécanique analytique'
    ],
    notes: 'Faculté des Sciences de l\'Université de Bertoua dans la région de l\'Est (Page 444 du dossier).'
  },
  {
    id: 'l02-ube-ens',
    labId: 'L02',
    filiere: 'Physique',
    faculte: 'ENS – École Normale Supérieure',
    faculteSigle: 'ENS',
    faculteNom: 'École Normale Supérieure',
    sigleUniversite: 'UBe',
    universite: 'Université de Bertoua',
    pageDossier: 483,
    region: 'Est',
    ville: 'Bertoua',
    typeEtablissement: 'Grande École de Formation des Enseignants',
    diplomes: ['DIPES I', 'DIPES II'],
    specialites: [
      'Pédagogie de la physique expérimentale',
      'Électromagnétisme & Circuits',
      'Thermodynamique classique'
    ],
    notes: 'Formation des professeurs de sciences physiques à l\'ENS de Bertoua (Page 483 du dossier).'
  },
  {
    id: 'l02-ueb-fs',
    labId: 'L02',
    filiere: 'Physique',
    faculte: 'FS – Faculté des Sciences',
    faculteSigle: 'FS',
    faculteNom: 'Faculté des Sciences',
    sigleUniversite: 'UEb',
    universite: "Université d'Ebolowa",
    pageDossier: 497,
    region: 'Sud',
    ville: 'Ebolowa',
    typeEtablissement: 'Faculté universitaire',
    diplomes: ['Licence de Physique', 'Master'],
    specialites: [
      'Physique environnementale & bioclimatique',
      'Énergies renouvelables & biomasse',
      'Optique & Capteurs'
    ],
    notes: "Faculté des Sciences de l'Université d'Ebolowa, pôle Sud de la recherche physique (Page 497)."
  }
];

export default LAB_02_FILIERES;
