/**
 * Dataset officiel et typé du Lab L03 : Labo Chimie & Génie des procédés (ProcédésLab)
 * Source : Document officiel MINESUP de repérage des filières CampusHub (Page 3)
 * Contient les 21 filières officielles réparties sur les 11 Universités d'État, ENS, ENSET et IUT du Cameroun
 */

import type { IFiliereL03, ILab03Metadata } from '../../types/lab03';

export const LAB_03_METADATA: ILab03Metadata = {
  id: 'L03',
  code: 'L03',
  title: 'Labo Chimie & Génie des procédés',
  domain: 'Sciences fondamentales',
  totalFilieres: 21,
  regionsCouvertes: 10,
  universitesImpliquees: 11,
  description:
    "Laboratoire d'ingénierie chimique, d'opérations unitaires, de cinétique réactionnelle, de thermodynamique appliquée et de contrôle de procédés industriels pour les facultés des sciences, ENS, ENSET et IUT du Cameroun.",
  accentColor: '#059669', // Vert Émeraude / Chimie & Procédés
  badgeColor: '#D1FAE5',
  officialDocumentSource: 'CampusHub · Repérage des filières MINESUP (Page 3)',
};

export const LAB_03_FILIERES: IFiliereL03[] = [
  // ─── 1. CHIMIE FONDAMENTALE (14 Filières FS & ENS) ───────────────────────────
  {
    id: 'l03-uy1-fs',
    labId: 'L03',
    filiere: 'Chimie',
    branch: 'CHIMIE_FONDAMENTALE',
    faculte: 'FS – Faculté des Sciences',
    faculteSigle: 'FS',
    faculteNom: 'Faculté des Sciences',
    sigleUniversite: 'UY1',
    universite: 'Université de Yaoundé I (UY1)',
    pageDossier: 28,
    region: 'Centre',
    ville: 'Yaoundé',
    campus: 'Ngoa-Ekélé',
    typeEtablissement: 'Faculté universitaire',
    langueEnseignement: 'BILINGUAL',
    diplomes: ['Licence de Chimie', 'Master Recherche', 'Doctorat / Ph.D'],
    specialites: ['Chimie Organique & Substances Naturelles', 'Chimie Inorganique', 'Chimie Physique & Théorique'],
    modulesParNiveau: {
      L1_L2: ['Chimie générale', 'Thermodynamique chimique', 'Liaisons chimiques & Stéréochimie', 'TP Dosages & Volumétrie'],
      L3_M1: ['Spectroscopie RMN & IR', 'Cinétique chimique homogène', 'Chimie des polymères', 'Chimie de coordination'],
      M2_Doctorat: ['Extraction de principes actifs végétaux', 'Catalyse hétérogène', 'Modélisation moléculaire ab initio']
    },
    syllabusInfo: {
      page: 28,
      codeUeExemples: ['CHM111', 'CHM201', 'CHM305', 'CHM401'],
      volumeHoraireAnnuel: 600,
      creditsEcts: 60
    },
    notes: 'Programme complet de Licence et Master de Chimie (Page 28 du dossier officiel MINESUP).'
  },
  {
    id: 'l03-uy1-ens',
    labId: 'L03',
    filiere: 'Chimie',
    branch: 'CHIMIE_FONDAMENTALE',
    faculte: 'ENS – École Normale Supérieure',
    faculteSigle: 'ENS',
    faculteNom: 'École Normale Supérieure',
    sigleUniversite: 'UY1',
    universite: 'Université de Yaoundé I (UY1)',
    pageDossier: 55,
    region: 'Centre',
    ville: 'Yaoundé',
    campus: 'ENS Yaoundé',
    typeEtablissement: 'Grande École de Formation des Enseignants',
    langueEnseignement: 'BILINGUAL',
    diplomes: ['DIPES I', 'DIPES II', 'Master Didactique'],
    specialites: ['Didactique de la Chimie', 'Sécurité et gestion des déchets de laboratoire', 'Expérimentation pédagogique'],
    modulesParNiveau: {
      L1_L2: ['Concepts clés pour le secondaire', 'Chimie minérale', 'Techniques de laboratoire scolaire'],
      L3_M1: ['Didactique des réactions redox et acido-basiques', 'Conception de TP à faible coût'],
      ENS_Didactique: ['Micro-enseignement de chimie', 'Évaluation expérimentale']
    },
    syllabusInfo: {
      page: 55,
      codeUeExemples: ['ENS_CHM101', 'ENS_DID202', 'ENS_LAB303'],
      volumeHoraireAnnuel: 650,
      creditsEcts: 60
    },
    notes: 'Formation des professeurs de chimie des lycées d\'enseignement secondaire général (Page 55).'
  },
  {
    id: 'l03-udo-fs',
    labId: 'L03',
    filiere: 'Chimie',
    branch: 'CHIMIE_FONDAMENTALE',
    faculte: 'FS – Faculté des Sciences',
    faculteSigle: 'FS',
    faculteNom: 'Faculté des Sciences',
    sigleUniversite: 'UDo',
    universite: 'Université de Douala',
    pageDossier: 89,
    region: 'Littoral',
    ville: 'Douala',
    campus: 'Ndogbong',
    typeEtablissement: 'Faculté universitaire',
    langueEnseignement: 'BILINGUAL',
    diplomes: ['Licence', 'Master Professionnel / Recherche', 'Doctorat'],
    specialites: ['Chimie de l\'Environnement', 'Électrochimie & Corrosion marine', 'Chimie Analytique Industrielle'],
    modulesParNiveau: {
      L1_L2: ['Chimie des solutions', 'Structure de la matière', 'Méthodes électrochimiques'],
      L3_M1: ['Chromatographie HPLC/CPG', 'Traitement des effluents industriels', 'Corrosion des métaux portuaires'],
      M2_Doctorat: ['Chimie marine et estuarienne du Wouri', 'Technologies de dépollution avancée']
    },
    syllabusInfo: {
      page: 89,
      codeUeExemples: ['UDO_CHM10', 'UDO_ENV20', 'UDO_ANA30'],
      volumeHoraireAnnuel: 600,
      creditsEcts: 60
    },
    notes: 'Cursus orienté analyse environnementale littorale et chimie des solutions (Page 89 du dossier).'
  },
  {
    id: 'l03-uds-fs',
    labId: 'L03',
    filiere: 'Chimie',
    branch: 'CHIMIE_FONDAMENTALE',
    faculte: 'FS – Faculté des Sciences',
    faculteSigle: 'FS',
    faculteNom: 'Faculté des Sciences',
    sigleUniversite: 'UDs',
    universite: 'Université de Dschang',
    pageDossier: 149,
    region: 'Ouest',
    ville: 'Dschang',
    campus: 'Campus Principal de Dschang',
    typeEtablissement: 'Faculté universitaire',
    langueEnseignement: 'BILINGUAL',
    diplomes: ['Licence', 'Master', 'Doctorat'],
    specialites: ['Agrochimie & Phytochimie', 'Chimie des sols', 'Substances actives antiparasitaires'],
    modulesParNiveau: {
      L1_L2: ['Bases de la chimie organique', 'Thermochimie', 'Cinétique et équilibres'],
      L3_M1: ['Chimie des pesticides et fertilisants', 'Spectrophotométrie UV-Visible', 'Biochimie structurale']
    },
    syllabusInfo: {
      page: 149,
      codeUeExemples: ['UDS_CHM11', 'UDS_AGRO22', 'UDS_PHYTO33'],
      volumeHoraireAnnuel: 590,
      creditsEcts: 60
    },
    notes: 'Pôle de phytochimie et chimie appliquée aux sols volcaniques de l\'Ouest (Page 149).'
  },
  {
    id: 'l03-ub-fshs',
    labId: 'L03',
    filiere: 'Chimie',
    branch: 'CHIMIE_FONDAMENTALE',
    faculte: 'Faculty of Science & Health Sciences – Science',
    faculteSigle: 'FACULTY_OF_SCIENCE',
    faculteNom: 'Faculty of Science & Health Sciences – Science',
    sigleUniversite: 'UB',
    universite: 'University of Buea (UB)',
    pageDossier: 205,
    region: 'Sud-Ouest',
    ville: 'Buea',
    campus: 'Molyko Campus',
    typeEtablissement: 'Anglo-Saxon Faculty',
    langueEnseignement: 'EN',
    diplomes: ['B.Sc. Chemistry', 'M.Sc. Chemistry', 'Ph.D.'],
    specialites: ['Medicinal Chemistry', 'Natural Products', 'Physical & Quantum Chemistry'],
    modulesParNiveau: {
      L1_L2: ['CHM 201: General Physical Chemistry', 'CHM 203: Organic Chemistry I', 'CHM 205: Analytical Chemistry Lab'],
      L3_M1: ['CHM 301: Spectroscopy & Structure Determination', 'CHM 307: Chemical Kinetics', 'CHM 401: Advanced Synthesis']
    },
    syllabusInfo: {
      page: 205,
      codeUeExemples: ['CHM 201', 'CHM 203', 'CHM 301', 'CHM 401'],
      volumeHoraireAnnuel: 600,
      creditsEcts: 60
    },
    notes: 'Syllabus complet sous système anglo-saxon avec crédits ECTS/GPA (Page 205 du dossier).'
  },
  {
    id: 'l03-uba-fs',
    labId: 'L03',
    filiere: 'Chimie',
    branch: 'CHIMIE_FONDAMENTALE',
    faculte: 'FS – Faculté des Sciences',
    faculteSigle: 'FS',
    faculteNom: 'Faculté des Sciences',
    sigleUniversite: 'UBa',
    universite: 'The University of Bamenda (UBma)',
    pageDossier: 244,
    region: 'Nord-Ouest',
    ville: 'Bambili - Bamenda',
    campus: 'Bambili Campus',
    typeEtablissement: 'Anglo-Saxon Faculty',
    langueEnseignement: 'EN',
    diplomes: ['B.Sc.', 'M.Sc.', 'Ph.D.'],
    specialites: ['Inorganic Materials', 'Environmental Chemistry', 'Organic Synthesis'],
    modulesParNiveau: {
      L1_L2: ['CHEM 111: Inorganic Chemistry', 'CHEM 122: Organic Reaction Mechanisms'],
      L3_M1: ['CHEM 311: Coordination Chemistry', 'CHEM 322: Waste Management & Green Chemistry']
    },
    syllabusInfo: {
      page: 244,
      codeUeExemples: ['CHEM 111', 'CHEM 211', 'CHEM 311'],
      volumeHoraireAnnuel: 600,
      creditsEcts: 60
    },
    notes: 'Programme de sciences chimiques fondamentales en langue anglaise UBa (Page 244).'
  },
  {
    id: 'l03-uba-httc',
    labId: 'L03',
    filiere: 'Chimie',
    branch: 'CHIMIE_FONDAMENTALE',
    faculte: 'HTTC – Higher Teacher Training College',
    faculteSigle: 'HTTC',
    faculteNom: 'Higher Teacher Training College',
    sigleUniversite: 'UBa',
    universite: 'The University of Bamenda (UBma)',
    pageDossier: 282,
    region: 'Nord-Ouest',
    ville: 'Bambili',
    campus: 'HTTC Campus',
    typeEtablissement: 'Higher Teacher Training College (ENS anglophone)',
    langueEnseignement: 'EN',
    diplomes: ['DIPES I (HTTC)', 'DIPES II (HTTC)'],
    specialites: ['Chemistry Teacher Education', 'Laboratory Safety & Practice', 'Science Education Curriculum'],
    modulesParNiveau: {
      L1_L2: ['Fundamentals of Chemistry for Teachers', 'School Chemistry Lab Management'],
      L3_M1: ['Methodology of Science Teaching', 'Curriculum Design in Chemistry']
    },
    syllabusInfo: {
      page: 282,
      codeUeExemples: ['EDC 201', 'EDC 305', 'LAB 400'],
      volumeHoraireAnnuel: 650,
      creditsEcts: 60
    },
    notes: 'Formation professorale des enseignants de chimie en zone anglophone (Page 282).'
  },
  {
    id: 'l03-ung-fs',
    labId: 'L03',
    filiere: 'Chimie',
    branch: 'CHIMIE_FONDAMENTALE',
    faculte: 'FS – Faculté des Sciences',
    faculteSigle: 'FS',
    faculteNom: 'Faculté des Sciences',
    sigleUniversite: 'UNg',
    universite: 'Université de Ngaoundéré',
    pageDossier: 307,
    region: 'Adamaoua',
    ville: 'Ngaoundéré',
    campus: 'Campus de Dang',
    typeEtablissement: 'Faculté universitaire',
    langueEnseignement: 'BILINGUAL',
    diplomes: ['Licence', 'Master', 'Doctorat'],
    specialites: ['Chimie des Aliments', 'Extraction d\'huiles essentielles', 'Biochimie appliquée'],
    modulesParNiveau: {
      L1_L2: ['Chimie structurale', 'Chimie organique fonctionnelle', 'Cinétique chimique'],
      L3_M1: ['Analyse chromatographique des lipides', 'Chimie des arômes et parfums']
    },
    syllabusInfo: {
      page: 307,
      codeUeExemples: ['UNG_CHM1', 'UNG_ALIM2', 'UNG_EXT3'],
      volumeHoraireAnnuel: 600,
      creditsEcts: 60
    },
    notes: 'Pôle d\'extraction et d\'analyse chimique des matières premières du château d\'eau (Page 307).'
  },
  {
    id: 'l03-uma-fs',
    labId: 'L03',
    filiere: 'Chimie',
    branch: 'CHIMIE_FONDAMENTALE',
    faculte: 'FS – Faculté des Sciences',
    faculteSigle: 'FS',
    faculteNom: 'Faculté des Sciences',
    sigleUniversite: 'UMa',
    universite: 'Université de Maroua',
    pageDossier: 360,
    region: 'Extrême-Nord',
    ville: 'Maroua',
    campus: 'Kongola-Djiddéo',
    typeEtablissement: 'Faculté universitaire',
    langueEnseignement: 'BILINGUAL',
    diplomes: ['Licence', 'Master', 'Doctorat'],
    specialites: ['Chimie Minérale & Matériaux Sahéliens', 'Chimie de l\'eau & Traitement des saumures'],
    modulesParNiveau: {
      L1_L2: ['Chimie générale & atomistique', 'Équilibres en solution aqueuse'],
      L3_M1: ['Dessalement et potabilisation des eaux', 'Chimie des argiles et céramiques']
    },
    syllabusInfo: {
      page: 360,
      codeUeExemples: ['UMA_CHM10', 'UMA_EAU20', 'UMA_MAT30'],
      volumeHoraireAnnuel: 580,
      creditsEcts: 60
    },
    notes: 'Recherche et formation sur les ressources en eau et minéraux en zone sahélienne (Page 360).'
  },
  {
    id: 'l03-uma-ens',
    labId: 'L03',
    filiere: 'Chimie',
    branch: 'CHIMIE_FONDAMENTALE',
    faculte: 'ENS – École Normale Supérieure',
    faculteSigle: 'ENS',
    faculteNom: 'École Normale Supérieure',
    sigleUniversite: 'UMa',
    universite: 'Université de Maroua',
    pageDossier: 393,
    region: 'Extrême-Nord',
    ville: 'Maroua',
    campus: 'ENS Maroua',
    typeEtablissement: 'Grande École de Formation des Enseignants',
    langueEnseignement: 'BILINGUAL',
    diplomes: ['DIPES I', 'DIPES II'],
    specialites: ['Didactique des Sciences Physiques et Chimiques', 'Expérimentation en milieu éducatif'],
    modulesParNiveau: {
      L1_L2: ['Fondements de chimie pour enseignants', 'Psychologie des apprentissages'],
      L3_M1: ['Conception de TP de chimie au secondaire', 'Stage pratique en lycée']
    },
    syllabusInfo: {
      page: 393,
      codeUeExemples: ['ENS_UMA_CH1', 'ENS_UMA_DID2', 'ENS_UMA_TP3'],
      volumeHoraireAnnuel: 640,
      creditsEcts: 60
    },
    notes: 'Formation des enseignants de chimie du secondaire septentrional (Page 393).'
  },
  {
    id: 'l03-uga-fs',
    labId: 'L03',
    filiere: 'Chimie',
    branch: 'CHIMIE_FONDAMENTALE',
    faculte: 'FS – Faculté des Sciences',
    faculteSigle: 'FS',
    faculteNom: 'Faculté des Sciences',
    sigleUniversite: 'UGa',
    universite: 'Université de Garoua',
    pageDossier: 419,
    region: 'Nord',
    ville: 'Garoua',
    campus: 'Campus Principal de Garoua',
    typeEtablissement: 'Faculté universitaire',
    langueEnseignement: 'BILINGUAL',
    diplomes: ['Licence Fondamentale', 'Master'],
    specialites: ['Chimie des Agro-ressources', 'Chimie Verte', 'Valorisation des sous-produits'],
    modulesParNiveau: {
      L1_L2: ['Chimie générale', 'Thermodynamique chimique', 'Biochimie générale'],
      L3_M1: ['Valorisation de la filière coton & arachide', 'Méthodes spectroscopiques']
    },
    syllabusInfo: {
      page: 419,
      codeUeExemples: ['UGA_CHM101', 'UGA_VERTE202', 'UGA_SPEC301'],
      volumeHoraireAnnuel: 580,
      creditsEcts: 60
    },
    notes: 'Université d\'État de Garoua (création 2022, Page 419 du dossier officiel).'
  },
  {
    id: 'l03-ube-fs',
    labId: 'L03',
    filiere: 'Chimie',
    branch: 'CHIMIE_FONDAMENTALE',
    faculte: 'FS – Faculté des Sciences',
    faculteSigle: 'FS',
    faculteNom: 'Faculté des Sciences',
    sigleUniversite: 'UBe',
    universite: 'Université de Bertoua',
    pageDossier: 445,
    region: 'Est',
    ville: 'Bertoua',
    campus: 'Campus de Bertoua',
    typeEtablissement: 'Faculté universitaire',
    langueEnseignement: 'BILINGUAL',
    diplomes: ['Licence', 'Master'],
    specialites: ['Chimie des Substances Ligneuses', 'Chimie des Forêts', 'Chimie Analytique'],
    modulesParNiveau: {
      L1_L2: ['Chimie fondamentale', 'Éléments de chimie organique et minérale'],
      L3_M1: ['Chimie des tannins et résines forestières', 'Analyses physico-chimiques']
    },
    syllabusInfo: {
      page: 445,
      codeUeExemples: ['UBE_CHM11', 'UBE_BOIS21', 'UBE_ANA31'],
      volumeHoraireAnnuel: 580,
      creditsEcts: 60
    },
    notes: 'Faculté des Sciences de Bertoua (Région de l\'Est, Page 445).'
  },
  {
    id: 'l03-ube-ens',
    labId: 'L03',
    filiere: 'Chimie',
    branch: 'CHIMIE_FONDAMENTALE',
    faculte: 'ENS – École Normale Supérieure',
    faculteSigle: 'ENS',
    faculteNom: 'École Normale Supérieure',
    sigleUniversite: 'UBe',
    universite: 'Université de Bertoua',
    pageDossier: 484,
    region: 'Est',
    ville: 'Bertoua',
    campus: 'ENS Bertoua',
    typeEtablissement: 'Grande École de Formation des Enseignants',
    langueEnseignement: 'BILINGUAL',
    diplomes: ['DIPES I', 'DIPES II'],
    specialites: ['Didactique de la Chimie', 'Pédagogie active des sciences expérimentales'],
    modulesParNiveau: {
      L1_L2: ['Savoirs fondamentaux en chimie', 'Épistémologie des sciences'],
      L3_M1: ['Techniques de micro-expérimentation', 'Mémoire professionnel DIPES II']
    },
    syllabusInfo: {
      page: 484,
      codeUeExemples: ['ENSB_CHM10', 'ENSB_DID20', 'ENSB_STG30'],
      volumeHoraireAnnuel: 640,
      creditsEcts: 60
    },
    notes: 'Formation professorale ENS Bertoua (Page 484 du dossier).'
  },
  {
    id: 'l03-ueb-fs',
    labId: 'L03',
    filiere: 'Chimie',
    branch: 'CHIMIE_FONDAMENTALE',
    faculte: 'FS – Faculté des Sciences',
    faculteSigle: 'FS',
    faculteNom: 'Faculté des Sciences',
    sigleUniversite: 'UEb',
    universite: "Université d'Ebolowa",
    pageDossier: 498,
    region: 'Sud',
    ville: 'Ebolowa',
    campus: 'Campus Principal d\'Ebolowa',
    typeEtablissement: 'Faculté universitaire',
    langueEnseignement: 'BILINGUAL',
    diplomes: ['Licence de Chimie', 'Master'],
    specialites: ['Chimie Environnementale', 'Écotoxicologie', 'Chimie des Écosystèmes Forestiers'],
    modulesParNiveau: {
      L1_L2: ['Chimie générale', 'Chimie organique et minérale', 'Équilibres physico-chimiques'],
      L3_M1: ['Impact des effluents miniers et agricoles', 'Techniques séparatives avancées']
    },
    syllabusInfo: {
      page: 498,
      codeUeExemples: ['UEB_CHM101', 'UEB_TOX202', 'UEB_ENV301'],
      volumeHoraireAnnuel: 580,
      creditsEcts: 60
    },
    notes: "Faculté des Sciences d'Ebolowa (Page 498 du dossier officiel)."
  },

  // ─── 2. CHIMIE INDUSTRIELLE (3 Filières ENSET) ──────────────────────────────
  {
    id: 'l03-udo-enset',
    labId: 'L03',
    filiere: 'Chimie Industrielle',
    branch: 'CHIMIE_INDUSTRIELLE',
    faculte: "ENSET – École Normale Supérieure d'Enseignement Technique",
    faculteSigle: 'ENSET',
    faculteNom: "École Normale Supérieure d'Enseignement Technique",
    sigleUniversite: 'UDo',
    universite: 'Université de Douala',
    pageDossier: 140,
    region: 'Littoral',
    ville: 'Douala',
    campus: 'ENSET Douala',
    typeEtablissement: 'Grande École Technique et Professionnelle',
    langueEnseignement: 'BILINGUAL',
    diplomes: ['DIPET I', 'DIPET II', 'Master Professionnel Chimie Industrielle'],
    specialites: ['Génie Chimique Industriel', 'Contrôle Qualité & Métrologie', 'Formulation & Procédés Pharmaceutiques/Cosmétiques'],
    modulesParNiveau: {
      L1_L2: ['Bilans de matière et énergie', 'Chimie industrielle minérale et organique', 'Dessin technique & P&ID'],
      L3_M1: ['Régulation et automatismes industriels', 'Gestion des risques SEVESO', 'Opérations unitaires mécaniques et thermiques'],
      Ingenieur_Technologie: ['Dimensionnement d\'ateliers de fabrication', 'Pédagogie de l\'enseignement technique']
    },
    syllabusInfo: {
      page: 140,
      codeUeExemples: ['ENSET_CHI101', 'ENSET_PROC202', 'ENSET_CQ303'],
      volumeHoraireAnnuel: 700,
      creditsEcts: 60
    },
    notes: 'Formation des cadres et professeurs de chimie industrielle pour l\'industrie littorale (Page 140).'
  },
  {
    id: 'l03-uba-htttc',
    labId: 'L03',
    filiere: 'Chimie Industrielle',
    branch: 'CHIMIE_INDUSTRIELLE',
    faculte: 'HTTTC (ENSET) – Higher Technical Teacher Training College',
    faculteSigle: 'HTTTC',
    faculteNom: 'Higher Technical Teacher Training College',
    sigleUniversite: 'UBa',
    universite: 'The University of Bamenda (UBma)',
    pageDossier: 294,
    region: 'Nord-Ouest',
    ville: 'Bambili',
    campus: 'HTTTC Campus',
    typeEtablissement: 'Grande École Technique (système anglo-saxon)',
    langueEnseignement: 'EN',
    diplomes: ['DIPET I (HTTTC)', 'DIPET II (HTTTC)'],
    specialites: ['Industrial Chemical Technology', 'Process Engineering Education', 'Quality Control & Safety'],
    modulesParNiveau: {
      L1_L2: ['Industrial Stoichiometry', 'Applied Thermodynamics', 'Chemical Engineering Drawings'],
      L3_M1: ['Unit Operations Lab', 'Safety Engineering & HAZOP', 'Technical Didactics']
    },
    syllabusInfo: {
      page: 294,
      codeUeExemples: ['ICT 201', 'ICT 305', 'DIPET 400'],
      volumeHoraireAnnuel: 680,
      creditsEcts: 60
    },
    notes: 'Filière anglophone d\'enseignement technique en technologie chimique industrielle (Page 294).'
  },
  {
    id: 'l03-ueb-enset',
    labId: 'L03',
    filiere: 'Chimie Industrielle',
    branch: 'CHIMIE_INDUSTRIELLE',
    faculte: "ENSET – École Normale Supérieure d'Enseignement Technique",
    faculteSigle: 'ENSET',
    faculteNom: "École Normale Supérieure d'Enseignement Technique",
    sigleUniversite: 'UEb',
    universite: "Université d'Ebolowa",
    pageDossier: 532,
    region: 'Sud',
    ville: 'Ebolowa',
    campus: 'ENSET Ebolowa',
    typeEtablissement: 'Grande École Technique et Professionnelle',
    langueEnseignement: 'BILINGUAL',
    diplomes: ['DIPET I', 'DIPET II'],
    specialites: ['Agro-chimie industrielle', 'Procédés de valorisation du caoutchouc et cacao', 'Écologie industrielle'],
    modulesParNiveau: {
      L1_L2: ['Chimie appliquée aux biopolymères', 'Opérations préliminaires de raffinage'],
      L3_M1: ['Technologie des élastomères', 'Contrôle physico-chimique en usine']
    },
    syllabusInfo: {
      page: 532,
      codeUeExemples: ['ENSET_EB_CHI1', 'ENSET_EB_POLY2', 'ENSET_EB_PROC3'],
      volumeHoraireAnnuel: 680,
      creditsEcts: 60
    },
    notes: 'ENSET Ebolowa, filière orientée valorisation industrielle du Sud (Page 532 du dossier).'
  },

  // ─── 3. GÉNIE DES PROCÉDÉS & GÉNIE CHIMIQUE (4 Filières IUT) ────────────────
  {
    id: 'l03-udo-iut',
    labId: 'L03',
    filiere: 'Génie des Procédés ou Génie Chimique',
    branch: 'GENIE_DES_PROCEDES',
    faculte: 'IUT – Institut Universitaire de Technologie',
    faculteSigle: 'IUT',
    faculteNom: 'Institut Universitaire de Technologie',
    sigleUniversite: 'UDo',
    universite: 'Université de Douala',
    pageDossier: 82,
    region: 'Littoral',
    ville: 'Douala',
    campus: 'IUT Douala',
    typeEtablissement: 'Institut Universitaire de Technologie',
    langueEnseignement: 'BILINGUAL',
    diplomes: ['DUT Génie des Procédés', 'Licence de Technologie (LT)'],
    specialites: ['Pétrochimie & Raffinage', 'Opérations Unitaires Thermiques & Séparatives', 'Génie de la Réaction Chimique'],
    modulesParNiveau: {
      L1_L2: ['Mécanique des fluides incompressibles', 'Transferts thermiques', 'Bilans de matière et d\'énergie', 'Distillation continue & extraction'],
      L3_M1: ['Instrumentation industrielle & boucles PID', 'Halle pilote : Réacteurs CSTR/PFR', 'Sécurité industrielle & HAZOP']
    },
    syllabusInfo: {
      page: 82,
      codeUeExemples: ['GP_MDF101', 'GP_THERM201', 'GP_DIST301'],
      volumeHoraireAnnuel: 720,
      creditsEcts: 60
    },
    notes: 'Filière technologique d\'excellence pour les industries chimiques de la zone portuaire de Douala (Page 82).'
  },
  {
    id: 'l03-uds-iutfv',
    labId: 'L03',
    filiere: 'Génie des Procédés ou Génie Chimique',
    branch: 'GENIE_DES_PROCEDES',
    faculte: 'IUT Fotso Victor (Bandjoun) – Institut Universitaire de Technologie',
    faculteSigle: 'IUT',
    faculteNom: 'IUT Fotso Victor de Bandjoun',
    sigleUniversite: 'UDs',
    universite: 'Université de Dschang',
    pageDossier: 173,
    region: 'Ouest',
    ville: 'Bandjoun',
    campus: 'Campus de Bandjoun',
    typeEtablissement: 'Institut Universitaire de Technologie',
    langueEnseignement: 'BILINGUAL',
    diplomes: ['DUT', 'Licence de Technologie'],
    specialites: ['Génie des Procédés Agro-industriels', 'Traitement thermique des denrées', 'Séchage & Échangeurs de chaleur'],
    modulesParNiveau: {
      L1_L2: ['Thermodynamique des machines thermiques', 'Écoulement des fluides visqueux', 'Évaporateurs et échangeurs'],
      L3_M1: ['Génie biochimique', 'Automatisme de procédés', 'Projet industriel de fin d\'études']
    },
    syllabusInfo: {
      page: 173,
      codeUeExemples: ['IUTFV_GP11', 'IUTFV_THERM21', 'IUTFV_AGRO31'],
      volumeHoraireAnnuel: 720,
      creditsEcts: 60
    },
    notes: 'IUT Fotso Victor de Bandjoun, référence technologique de l\'Ouest (Page 173 du dossier).'
  },
  {
    id: 'l03-ung-iut',
    labId: 'L03',
    filiere: 'Génie des Procédés ou Génie Chimique',
    branch: 'GENIE_DES_PROCEDES',
    faculte: 'IUT – Institut Universitaire de Technologie',
    faculteSigle: 'IUT',
    faculteNom: 'Institut Universitaire de Technologie',
    sigleUniversite: 'UNg',
    universite: 'Université de Ngaoundéré',
    pageDossier: 331,
    region: 'Adamaoua',
    ville: 'Ngaoundéré',
    campus: 'Campus de Dang',
    typeEtablissement: 'Institut Universitaire de Technologie',
    langueEnseignement: 'BILINGUAL',
    diplomes: ['DUT', 'Licence Professionnelle'],
    specialites: ['Génie de la Fermentation', 'Procédés de Séparation Membranaire', 'Valorisation de la Biomasse'],
    modulesParNiveau: {
      L1_L2: ['Stœchiométrie industrielle', 'Réacteurs agités en régime isotherme', 'Bioréacteurs'],
      L3_M1: ['Filtration tangentielle & osmose inverse', 'Plans de tuyauterie et instrumentation (P&ID)']
    },
    syllabusInfo: {
      page: 331,
      codeUeExemples: ['UNG_IUT_GP1', 'UNG_IUT_FERM2', 'UNG_IUT_MEMB3'],
      volumeHoraireAnnuel: 710,
      creditsEcts: 60
    },
    notes: 'Pôle technologique de l\'Adamaoua orienté bio-procédés et génie fermentaire (Page 331).'
  },
  {
    id: 'l03-ube-iut',
    labId: 'L03',
    filiere: 'Génie des Procédés ou Génie Chimique',
    branch: 'GENIE_DES_PROCEDES',
    faculte: 'IUT – Institut Universitaire de Technologie',
    faculteSigle: 'IUT',
    faculteNom: 'Institut Universitaire de Technologie',
    sigleUniversite: 'UBe',
    universite: 'Université de Bertoua',
    pageDossier: 473,
    region: 'Est',
    ville: 'Bertoua',
    campus: 'Campus IUT de Bertoua',
    typeEtablissement: 'Institut Universitaire de Technologie',
    langueEnseignement: 'BILINGUAL',
    diplomes: ['DUT Génie des Procédés', 'Licence de Technologie'],
    specialites: ['Procédés Miniers & Métallurgie', 'Broyage, Lixiviation & Flottation', 'Gestion des Rejets Industriels'],
    modulesParNiveau: {
      L1_L2: ['Transfert de quantité de mouvement', 'Cinétique des réactions hétérogènes solide-liquide'],
      L3_M1: ['Procédés hydrométallurgiques', 'Décantation, filtration et hydrocyclonage']
    },
    syllabusInfo: {
      page: 473,
      codeUeExemples: ['UBE_IUT_GP10', 'UBE_IUT_MIN20', 'UBE_IUT_REC30'],
      volumeHoraireAnnuel: 710,
      creditsEcts: 60
    },
    notes: 'IUT de Bertoua, cursus axé sur les procédés d\'extraction minière et sylvicole de l\'Est (Page 473).'
  }
];

export default LAB_03_FILIERES;
