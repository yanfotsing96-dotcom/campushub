/**
 * Types TypeScript stricts pour le Laboratoire L03 : Labo Chimie & Génie des procédés (ProcédésLab)
 * Basé sur le repérage officiel MINESUP / CampusHub (Page 3 du document national)
 * Couvre 21 filières : Chimie Fondamentale (14), Chimie Industrielle (3), Génie des Procédés (4)
 */

import type { CameroonRegion, UniversitySigle, LanguageOfInstruction, AcademicLevel } from './lab01';

export type InstitutionalCategoryL03 =
  | 'FS'
  | 'ENS'
  | 'ENSET'
  | 'IUT'
  | 'FACULTY_OF_SCIENCE'
  | 'HTTC'
  | 'HTTTC';

export type FiliereL03Branch =
  | 'CHIMIE_FONDAMENTALE'
  | 'CHIMIE_INDUSTRIELLE'
  | 'GENIE_DES_PROCEDES';

export interface ISyllabusInfoL03 {
  page: number; // Numéro de page officiel dans le dossier MINESUP (28 à 532)
  codeUeExemples: string[];
  volumeHoraireAnnuel: number;
  creditsEcts: number;
}

export interface IFiliereL03 {
  id: string;
  labId: 'L03';
  filiere: 'Chimie' | 'Chimie Industrielle' | 'Génie des Procédés ou Génie Chimique';
  branch: FiliereL03Branch;
  faculte: string;
  faculteSigle: InstitutionalCategoryL03;
  faculteNom: string;
  sigleUniversite: UniversitySigle;
  universite: string;
  pageDossier: number; // Pages certifiées 28 à 532
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
    Ingenieur_Technologie?: string[];
  };
  syllabusInfo: ISyllabusInfoL03;
  notes: string;
}

export interface ILab03Metadata {
  id: 'L03';
  code: 'L03';
  title: string;
  domain: 'Sciences fondamentales';
  totalFilieres: 21;
  regionsCouvertes: number;
  universitesImpliquees: number;
  description: string;
  accentColor: string; // #059669 (Émeraude Alchimie / Procédés)
  badgeColor: string;
  officialDocumentSource: string;
}

export interface ICstrReactorData {
  reactorVolume: number; // Litres (V)
  volumetricFlowRate: number; // L/min (Q)
  inletConcentrationA: number; // mol/L (CA0)
  outletConcentrationA: number; // mol/L (CA)
  rateConstant: number; // min^-1 ou L/(mol.min) (k)
  temperatureK: number; // Kelvin (T)
  activationEnergyJ: number; // J/mol (Ea)
  residenceTimeMin: number; // min (tau = V / Q)
  conversionRate: number; // % (X = (CA0 - CA) / CA0)
  heatGeneratedWatts: number; // Watts
  reactionEnthalpyKJ: number; // kJ/mol (delta H)
}

export interface IDistillationData {
  feedFlowRate: number; // kmol/h (F)
  feedFractionLight: number; // zF
  distillateFraction: number; // xD
  bottomsFraction: number; // xB
  refluxRatio: number; // R = L / D
  relativeVolatility: number; // alpha
  thermalStateQ: number; // q (ex: 1 = liquide saturé)
  minRefluxRatio: number; // Rmin
  theoreticalTrays: number; // Nombre de plateaux théoriques
  feedTrayIndex: number; // Plateau d'alimentation
  actualTrays: number; // Plateaux réels avec efficacité Murphree
  condenserDutyKW: number; // kW
  reboilerDutyKW: number; // kW
  steps: { x: number; y: number }[]; // Points des marches d'escalier McCabe-Thiele
}

export interface IHeatExchangerData {
  flowArrangement: 'counter_current' | 'co_current';
  hotFluidName: string;
  coldFluidName: string;
  massFlowHotKgS: number; // kg/s
  massFlowColdKgS: number; // kg/s
  tHotInC: number; // °C
  tHotOutC: number; // °C
  tColdInC: number; // °C
  tColdOutC: number; // °C
  heatCapacityHot: number; // J/(kg.K)
  heatCapacityCold: number; // J/(kg.K)
  heatDutyKW: number; // kW
  dtlmC: number; // °C (Différence de température logarithmique moyenne)
  overallUCoeff: number; // W/(m².K)
  requiredAreaM2: number; // m²
}

export interface ISafetyDataSheet {
  reagentName: string;
  formula: string;
  casNumber: string;
  ghsPictograms: ('flammable' | 'corrosive' | 'toxic' | 'explosive' | 'irritant' | 'environmental')[];
  hazardPhrases: string[]; // Phrases H
  precautionaryPhrases: string[]; // Phrases P
  storageIncompatibilities: string[];
  requiredPpe: ('lab_coat' | 'safety_glasses' | 'nitrile_gloves' | 'fume_hood' | 'respirator')[];
}

export interface ITPReportL03 {
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
  cstrData?: ICstrReactorData;
  distillationData?: IDistillationData;
  exchangerData?: IHeatExchangerData;
  safetyChecks: boolean;
  studentNotes: string;
  dateCreation: string;
}
