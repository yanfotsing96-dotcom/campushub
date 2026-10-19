-- ============================================================================
-- CAMPUSHUB CAMEROON - SCHÉMA RELATIONNEL SQL (POSTGRESQL)
-- Hiérarchie : Université -> Faculté/École -> Filière -> Niveau -> UE -> Ressources
-- ============================================================================

-- Extensions recommandées
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Table des UNIVERSITÉS
CREATE TABLE IF NOT EXISTS universities (
    id VARCHAR(50) PRIMARY KEY,                  -- ex: 'UY1', 'UDLA', 'UDS', 'UB'
    code VARCHAR(50) UNIQUE NOT NULL,            -- ex: 'UY1'
    name VARCHAR(255) NOT NULL,                  -- ex: 'Université de Yaoundé I'
    short_name VARCHAR(100) NOT NULL,            -- ex: 'Univ. Yaoundé I'
    type VARCHAR(50) NOT NULL DEFAULT 'PUBLIC',  -- 'PUBLIC', 'PRIVATE', 'INTER_STATE'
    city VARCHAR(100) NOT NULL,                  -- ex: 'Yaoundé'
    region VARCHAR(100) NOT NULL,                -- ex: 'Centre'
    country_code VARCHAR(3) NOT NULL DEFAULT 'CMR',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Table des FACULTÉS, GRANDES ÉCOLES ET INSTITUTS
CREATE TABLE IF NOT EXISTS faculties (
    id VARCHAR(60) PRIMARY KEY,                  -- ex: 'UY1-FS', 'UY1-ENSPY', 'UY1-FALSH'
    university_id VARCHAR(50) NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
    code VARCHAR(50) NOT NULL,                   -- ex: 'FS', 'ENSPY', 'FMSB'
    name VARCHAR(255) NOT NULL,                  -- ex: 'Faculté des Sciences'
    type VARCHAR(50) NOT NULL,                   -- 'FACULTY', 'ENGINEERING_SCHOOL', 'INSTITUTE', 'NORMAL_SCHOOL'
    campus VARCHAR(100),                         -- ex: 'Ngoa-Ekellé'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_university_faculty UNIQUE (university_id, code)
);

-- 3. Table des FILIÈRES D'ÉTUDES
CREATE TABLE IF NOT EXISTS programs (
    id VARCHAR(100) PRIMARY KEY,                 -- ex: 'UY1-FS-INF'
    faculty_id VARCHAR(60) NOT NULL REFERENCES faculties(id) ON DELETE CASCADE,
    code VARCHAR(50) NOT NULL,                   -- ex: 'inf', 'math', 'phys'
    name VARCHAR(255) NOT NULL,                  -- ex: 'Licence en Informatique'
    domain VARCHAR(150),                         -- ex: 'Sciences et Technologies'
    cycle VARCHAR(50) NOT NULL DEFAULT 'LMD',    -- 'LMD', 'INGENIEUR', 'SANTE', 'DUT'
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_faculty_program UNIQUE (faculty_id, code)
);

-- 4. Table des NIVEAUX ACADÉMIQUES
CREATE TABLE IF NOT EXISTS academic_levels (
    id VARCHAR(120) PRIMARY KEY,                 -- ex: 'UY1-FS-INF-L1'
    program_id VARCHAR(100) NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
    code VARCHAR(20) NOT NULL,                   -- 'L1', 'L2', 'L3', 'M1', 'M2'
    name VARCHAR(100) NOT NULL,                  -- 'Licence 1 (L1)'
    semesters INTEGER[] NOT NULL DEFAULT ARRAY[1, 2],
    order_index INTEGER NOT NULL,                -- 1, 2, 3...
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_program_level UNIQUE (program_id, code)
);

-- 5. Table des UNITÉS D'ENSEIGNEMENT (UE)
CREATE TABLE IF NOT EXISTS teaching_units (
    id VARCHAR(150) PRIMARY KEY,                 -- ex: 'UY1-FS-INF-L1-INFO111'
    level_id VARCHAR(120) NOT NULL REFERENCES academic_levels(id) ON DELETE CASCADE,
    code VARCHAR(30) NOT NULL,                   -- ex: 'INFO 111'
    title VARCHAR(255) NOT NULL,                 -- ex: 'Algorithmique et programmation 1'
    semester INTEGER CHECK (semester IN (1, 2, 3, 4, 5, 6, 7, 8, 9, 10)),
    credits INTEGER NOT NULL DEFAULT 6,
    is_core BOOLEAN NOT NULL DEFAULT TRUE,       -- Obligatoire / Fondamentale
    syllabus_summary TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_level_unit_code UNIQUE (level_id, code)
);

-- 6. Table des RESSOURCES NATIONALES (Fichiers, épreuves, cours, résumés)
CREATE TABLE IF NOT EXISTS national_resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    teaching_unit_id VARCHAR(150) NOT NULL REFERENCES teaching_units(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL CHECK (
        category IN ('COURS', 'TD', 'TP', 'EXAMEN', 'CC', 'RESUME_REVISION', 'PROJET')
    ),
    academic_year VARCHAR(20) NOT NULL,          -- ex: '2025/2026'
    session VARCHAR(30) CHECK (
        session IN ('NORMALE', 'RATTRAPAGE', 'CONTROLE_CONTINU', 'PROJET_TUTORE', NULL)
    ),
    file_url TEXT NOT NULL,
    file_format VARCHAR(20) NOT NULL DEFAULT 'PDF',
    file_size_bytes BIGINT,
    has_solution BOOLEAN NOT NULL DEFAULT FALSE,
    uploader_name VARCHAR(150),
    uploader_role VARCHAR(50) NOT NULL DEFAULT 'delegate' CHECK (
        uploader_role IN ('student', 'delegate', 'moderator', 'admin')
    ),
    status VARCHAR(30) NOT NULL DEFAULT 'APPROVED' CHECK (
        status IN ('PENDING', 'APPROVED', 'REJECTED')
    ),
    downloads_count INTEGER NOT NULL DEFAULT 0,
    rating_avg NUMERIC(3, 2) NOT NULL DEFAULT 5.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- INDEXATION OPTIMISÉE POUR FILTRAGE INSTANTANÉ (SEARCH & SCOPING)
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_faculties_university ON faculties(university_id);
CREATE INDEX IF NOT EXISTS idx_programs_faculty ON programs(faculty_id);
CREATE INDEX IF NOT EXISTS idx_academic_levels_program ON academic_levels(program_id);
CREATE INDEX IF NOT EXISTS idx_teaching_units_level ON teaching_units(level_id);
CREATE INDEX IF NOT EXISTS idx_national_resources_tu_cat ON national_resources(teaching_unit_id, category);
CREATE INDEX IF NOT EXISTS idx_national_resources_status ON national_resources(status);
CREATE INDEX IF NOT EXISTS idx_national_resources_year ON national_resources(academic_year);

-- ============================================================================
-- VUE DÉDIÉE : "VUE RESSOURCES NATIONALES UNIFIÉE"
-- Jointure aplatie pour le tableau de bord étudiant et l'API de recherche nationale
-- ============================================================================
CREATE OR REPLACE VIEW view_national_resources_catalog AS
SELECT 
    r.id AS resource_id,
    r.title AS resource_title,
    r.category,
    r.academic_year,
    r.session,
    r.file_url,
    r.file_format,
    r.file_size_bytes,
    r.has_solution,
    r.downloads_count,
    r.rating_avg,
    r.status,
    u.id AS teaching_unit_id,
    u.code AS ue_code,
    u.title AS ue_title,
    u.credits AS ue_credits,
    l.code AS level_code,
    l.name AS level_name,
    p.code AS program_code,
    p.name AS program_name,
    f.code AS faculty_code,
    f.name AS faculty_name,
    uni.id AS university_id,
    uni.name AS university_name,
    uni.city AS university_city
FROM national_resources r
JOIN teaching_units u ON r.teaching_unit_id = u.id
JOIN academic_levels l ON u.level_id = l.id
JOIN programs p ON l.program_id = p.id
JOIN faculties f ON p.faculty_id = f.id
JOIN universities uni ON f.university_id = uni.id;
