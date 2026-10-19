/**
 * CampusHub - Modèles & Schémas Mongoose (MongoDB ODM)
 * 
 * Hiérarchie : University -> Faculty -> Program (Filière) -> AcademicLevel -> TeachingUnit (UE) -> NationalResource
 * Conforme aux standards LMD et à la nomenclature MINESUP Cameroun.
 */

import mongoose from 'mongoose';
const { Schema, model } = mongoose;

// ============================================================================
// 1. SCHÉMA DES RESSOURCES NATIONALES
// ============================================================================
export const NationalResourceSchema = new Schema(
  {
    teachingUnitId: {
      type: Schema.Types.ObjectId,
      ref: 'TeachingUnit',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Le titre du document est requis'],
      trim: true,
      maxlength: 255,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    category: {
      type: String,
      required: true,
      enum: ['COURS', 'TD', 'TP', 'EXAMEN', 'CC', 'RESUME_REVISION', 'PROJET'],
      index: true,
    },
    academicYear: {
      type: String,
      required: true,
      match: [/^\d{4}\/\d{4}$/, 'Format attendu: YYYY/YYYY (ex: 2025/2026)'],
      index: true,
    },
    session: {
      type: String,
      enum: ['NORMALE', 'RATTRAPAGE', 'CONTROLE_CONTINU', 'PROJET_TUTORE', null],
      default: null,
    },
    fileUrl: {
      type: String,
      required: [true, 'L\'URL du fichier hébergé est requise'],
      trim: true,
    },
    fileFormat: {
      type: String,
      default: 'PDF',
      uppercase: true,
    },
    fileSizeBytes: {
      type: Number,
      default: 0,
    },
    hasSolution: {
      type: Boolean,
      default: false,
    },
    uploaderName: {
      type: String,
      trim: true,
    },
    uploaderRole: {
      type: String,
      enum: ['student', 'delegate', 'moderator', 'admin'],
      default: 'delegate',
    },
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED'],
      default: 'APPROVED',
      index: true,
    },
    downloadsCount: {
      type: Number,
      default: 0,
    },
    ratingAvg: {
      type: Number,
      min: 0,
      max: 5,
      default: 5.0,
    },
    // Dénormalisation pour recherche ultra-rapide sans cascade de populates
    scopeLookup: {
      universityCode: { type: String, index: true },
      facultyCode: { type: String, index: true },
      programCode: { type: String, index: true },
      levelCode: { type: String, index: true },
      ueCode: { type: String, index: true },
    },
  },
  { timestamps: true }
);

NationalResourceSchema.index({ 'scopeLookup.universityCode': 1, 'scopeLookup.programCode': 1, category: 1 });

// ============================================================================
// 2. SCHÉMA DES UNITÉS D'ENSEIGNEMENT (UE)
// ============================================================================
export const TeachingUnitSchema = new Schema(
  {
    levelId: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicLevel',
      required: true,
      index: true,
    },
    code: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    credits: {
      type: Number,
      default: 6,
      min: 1,
      max: 30,
    },
    semester: {
      type: Number,
      min: 1,
      max: 10,
    },
    isCore: {
      type: Boolean,
      default: true,
    },
    syllabusSummary: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

TeachingUnitSchema.virtual('resources', {
  ref: 'NationalResource',
  localField: '_id',
  foreignField: 'teachingUnitId',
});

TeachingUnitSchema.index({ levelId: 1, code: 1 }, { unique: true });

// ============================================================================
// 3. SCHÉMA DES NIVEAUX ACADÉMIQUES (L1, L2, L3, M1, M2...)
// ============================================================================
export const AcademicLevelSchema = new Schema(
  {
    programId: {
      type: Schema.Types.ObjectId,
      ref: 'Program',
      required: true,
      index: true,
    },
    code: {
      type: String,
      required: true,
      enum: ['L1', 'L2', 'L3', 'M1', 'M2', 'Doctorat', 'DUT1', 'DUT2', 'ING1', 'ING2', 'ING3', 'ING4', 'ING5'],
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    semesters: {
      type: [Number],
      default: [1, 2],
    },
    orderIndex: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

AcademicLevelSchema.virtual('teachingUnits', {
  ref: 'TeachingUnit',
  localField: '_id',
  foreignField: 'levelId',
});

AcademicLevelSchema.index({ programId: 1, code: 1 }, { unique: true });

// ============================================================================
// 4. SCHÉMA DES FILIÈRES (PROGRAMS)
// ============================================================================
export const ProgramSchema = new Schema(
  {
    facultyId: {
      type: Schema.Types.ObjectId,
      ref: 'Faculty',
      required: true,
      index: true,
    },
    code: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    domain: {
      type: String,
      trim: true,
      default: 'Sciences & Technologies',
    },
    cycle: {
      type: String,
      enum: ['LMD', 'INGENIEUR', 'SANTE', 'DUT', 'FORMATION_PROFESSIONNELLE'],
      default: 'LMD',
    },
    description: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

ProgramSchema.virtual('levels', {
  ref: 'AcademicLevel',
  localField: '_id',
  foreignField: 'programId',
});

ProgramSchema.index({ facultyId: 1, code: 1 }, { unique: true });

// ============================================================================
// 5. SCHÉMA DES FACULTÉS, ÉCOLES & INSTITUTS
// ============================================================================
export const FacultySchema = new Schema(
  {
    universityId: {
      type: Schema.Types.ObjectId,
      ref: 'University',
      required: true,
      index: true,
    },
    code: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['FACULTY', 'ENGINEERING_SCHOOL', 'INSTITUTE', 'NORMAL_SCHOOL', 'HEALTH_FACULTY'],
      default: 'FACULTY',
    },
    campus: {
      type: String,
      default: 'Campus Principal',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

FacultySchema.virtual('programs', {
  ref: 'Program',
  localField: '_id',
  foreignField: 'facultyId',
});

FacultySchema.index({ universityId: 1, code: 1 }, { unique: true });

// ============================================================================
// 6. SCHÉMA DES UNIVERSITÉS
// ============================================================================
export const UniversitySchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    shortName: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    region: {
      type: String,
      required: true,
      trim: true,
    },
    countryCode: {
      type: String,
      default: 'CMR',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

UniversitySchema.virtual('faculties', {
  ref: 'Faculty',
  localField: '_id',
  foreignField: 'universityId',
});

// Modèles Mongoose enregistrés (avec protection contre la re-déclaration)
export const University = mongoose.models.University || model('University', UniversitySchema);
export const Faculty = mongoose.models.Faculty || model('Faculty', FacultySchema);
export const Program = mongoose.models.Program || model('Program', ProgramSchema);
export const AcademicLevel = mongoose.models.AcademicLevel || model('AcademicLevel', AcademicLevelSchema);
export const TeachingUnit = mongoose.models.TeachingUnit || model('TeachingUnit', TeachingUnitSchema);
export const NationalResource = mongoose.models.NationalResource || model('NationalResource', NationalResourceSchema);
