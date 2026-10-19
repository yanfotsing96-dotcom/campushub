/**
 * Types TypeScript stricts pour le Laboratoire L02 : Labo Physique
 * Basé sur le repérage officiel MINESUP / CampusHub (Pages 2 et 3 du document national)
 */

import type { CameroonRegion, InstitutionalType, UniversitySigle, LanguageOfInstruction, AcademicLevel } from './lab01';

export interface IFiliereL02 {
  id: string;
  labId: 'L02';
  filiere: 'Physique';
  faculte: string;
  faculteSigle: InstitutionalType;
  faculteNom: string;
  sigleUniversite: UniversitySigle;
  universite: string;
  pageDossier: number; // Pages certifiées 27 à 497
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
  syllabusInfo: {
    page: number;
    codeUeExemples: string[];
    volumeHoraireAnnuel: number;
    creditsEcts: number;
  };
  notes: string;
}

export interface IRLCExperimentData {
  resistance: number; // Ohms
  inductance: number; // mH
  capacitance: number; // microFarads
  frequency: number; // Hz
  voltageGenerator: number; // Volts
  resonanceFrequency: number; // f0 (Hz)
  qualityFactor: number; // Q
  bandwidth: number; // Delta f (Hz)
  impedance: number; // Ohms
  phaseDeg: number; // Degrés
  currentMax: number; // Ampères
}

export interface IOpticsExperimentData {
  lensType: 'converging' | 'diverging';
  focalLength: number; // cm (f')
  objectDistance: number; // cm (p = OA, convention négative pour objet réel)
  objectHeight: number; // cm (AB)
  imageDistance: number; // cm (p' = OA')
  magnification: number; // gamma
  imageHeight: number; // cm (A'B')
  imageNature: 'REAL_INVERTED' | 'VIRTUAL_UPRIGHT' | 'AT_INFINITY';
}

export interface ITPReportL02 {
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
  rlcData?: IRLCExperimentData;
  opticsData?: IOpticsExperimentData;
  studentNotes: string;
  dateCreation: string;
}
