/**
 * Types TypeScript stricts pour le Laboratoire L01 : Labo Mathématiques & Statistiques
 * Basé sur le repérage officiel MINESUP / CampusHub (Page 2 du document national)
 */

export type InstitutionalType = 'FS' | 'ENS' | 'HTTC' | 'FACULTY_OF_SCIENCE';

export type CameroonRegion =
  | 'Centre'
  | 'Littoral'
  | 'Ouest'
  | 'Sud-Ouest'
  | 'Nord-Ouest'
  | 'Adamaoua'
  | 'Extrême-Nord'
  | 'Nord'
  | 'Est'
  | 'Sud';

export type UniversitySigle =
  | 'UY1'
  | 'UDo'
  | 'UDs'
  | 'UB'
  | 'UBa'
  | 'UNg'
  | 'UMa'
  | 'UGa'
  | 'UBe'
  | 'UEb';

export type LanguageOfInstruction = 'FR' | 'EN' | 'BILINGUAL';

export type AcademicLevel =
  | 'L1'
  | 'L2'
  | 'L3'
  | 'M1'
  | 'M2'
  | 'DIPES_I'
  | 'DIPES_II'
  | 'DOCTORAT';

export interface ISyllabusInfo {
  page: number; // Numéro de page exact dans le dossier officiel MINESUP
  codeUeExemples: string[];
  volumeHoraireAnnuel: number;
  creditsEcts: number;
}

export interface IFiliereL01 {
  id: string;
  labId: 'L01';
  filiere: 'Mathématiques';
  faculte: string;
  faculteSigle: InstitutionalType;
  faculteNom: string;
  sigleUniversite: UniversitySigle;
  universite: string;
  pageDossier: number; // Numéro de page officiel (26 à 496)
  region: CameroonRegion;
  ville: string;
  campus: string;
  typeEtablissement: string;
  langueEnseignement: LanguageOfInstruction;
  diplomes: string[];
  specialites: string[];
  modulesParNiveau: {
    L1_L2?: string[];
    L3_M1?: string[];
    M2_Doctorat?: string[];
    ENS_Didactique?: string[];
  };
  syllabusInfo: ISyllabusInfo;
  notes: string;
}

export interface ILab01Metadata {
  id: 'L01';
  code: 'L01';
  title: string;
  domain: 'Sciences fondamentales';
  totalFilieres: 14;
  description: string;
  accentColor: string; // #4338CA ou #5C4033
  badgeColor: string;
  officialDocumentSource: string;
  regionsCouvertes: number;
  universitesImpliquees: number;
}

export interface ITPReportL01 {
  id: string;
  filiereId: string;
  universiteSigle: UniversitySigle;
  universiteNom: string;
  faculteNom: string;
  pageDossier: number;
  etudiantNom: string;
  matricule: string;
  niveau: AcademicLevel;
  titreTP: string;
  dateCreation: string;
  equationsLatex: string[];
  donneesCalcul: Record<string, unknown>;
  conclusions: string;
  statut: 'DRAFT' | 'SUBMITTED' | 'VALIDATED';
}

export interface IMathStationL01 {
  id: string;
  stationNumber: number;
  nom: string;
  zone: 'ZONE_A_L1_L2' | 'ZONE_B_L3_M1' | 'ZONE_C_M2_RESEARCH';
  os: 'Ubuntu 24.04 LTS' | 'Windows 11 Pro' | 'Dual Boot';
  cpu: string;
  ramGo: number;
  gpu: string;
  isAvailable: boolean;
  activeUser?: string;
  jupyterPort?: number;
}
