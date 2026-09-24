-- ====================================================================
-- BHOOMISUTRA – AI-POWERED LAND RECORD DIGITIZATION & VALIDATION SYSTEM
-- SMART INDIA HACKATHON 2026 (SIH26018)
-- PRODUCTION POSTGRESQL / SUPABASE DATABASE SCHEMA
-- ====================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS & ROLES
CREATE TYPE user_role AS ENUM ('ADMIN', 'OFFICER', 'CITIZEN');

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'CITIZEN',
    designation VARCHAR(255),
    department VARCHAR(255) DEFAULT 'Department of Revenue & Land Records',
    district VARCHAR(100),
    state VARCHAR(100) DEFAULT 'Maharashtra',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_demo BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. PARCELS (CADASTRAL REVENUE INDEX)
CREATE TABLE parcels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ulpin VARCHAR(64) UNIQUE,
    survey_number VARCHAR(64) NOT NULL,
    sub_division VARCHAR(32),
    village VARCHAR(128) NOT NULL,
    tehsil VARCHAR(128) NOT NULL,
    district VARCHAR(128) NOT NULL,
    state VARCHAR(128) NOT NULL DEFAULT 'Maharashtra',
    current_owner VARCHAR(255) NOT NULL,
    current_area NUMERIC(12, 4) NOT NULL,
    unit VARCHAR(32) NOT NULL DEFAULT 'Acre',
    classification VARCHAR(128) NOT NULL DEFAULT 'Agricultural Class-1',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_parcels_survey_village ON parcels(survey_number, village, district);
CREATE INDEX idx_parcels_ulpin ON parcels(ulpin);

-- 3. PARCEL LINEAGE & HISTORICAL TRANSACTIONS
CREATE TYPE lineage_event_type AS ENUM (
    'ORIGINAL_SURVEY',
    'SALE_TRANSFER',
    'SUBDIVISION',
    'MUTATION',
    'CURRENT_RECORD'
);

CREATE TABLE parcel_lineage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parcel_id UUID REFERENCES parcels(id) ON DELETE CASCADE,
    parent_parcel_id UUID REFERENCES parcels(id) ON DELETE SET NULL,
    child_parcel_id UUID REFERENCES parcels(id) ON DELETE SET NULL,
    year INT NOT NULL,
    event_date DATE NOT NULL,
    event_type lineage_event_type NOT NULL,
    title VARCHAR(255) NOT NULL,
    primary_party VARCHAR(255) NOT NULL,
    secondary_party VARCHAR(255),
    area_before NUMERIC(12, 4) NOT NULL,
    area_after NUMERIC(12, 4) NOT NULL,
    unit VARCHAR(32) NOT NULL DEFAULT 'Acre',
    document_ref VARCHAR(255),
    notes TEXT,
    is_violation BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. DOCUMENTS
CREATE TYPE document_status AS ENUM (
    'QUEUED',
    'PROCESSING',
    'COMPLETED',
    'NEEDS_REVIEW',
    'VERIFIED',
    'CORRECTION_REQUESTED',
    'REJECTED'
);

CREATE TYPE document_type AS ENUM (
    'RECORD_OF_RIGHTS',
    'MUTATION_REGISTER',
    'SALE_DEED',
    'SURVEY_PARCEL_MAP',
    'INHERITANCE_DEED'
);

CREATE TABLE documents (
    id VARCHAR(64) PRIMARY KEY,
    owner_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    parcel_id UUID REFERENCES parcels(id) ON DELETE SET NULL,
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(64) NOT NULL,
    file_size VARCHAR(32) NOT NULL,
    file_url TEXT NOT NULL,
    original_scan_url TEXT NOT NULL,
    preprocessed_scan_url TEXT,
    upload_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    status document_status NOT NULL DEFAULT 'QUEUED',
    processing_stage INT NOT NULL DEFAULT 1,
    processing_progress INT NOT NULL DEFAULT 0,
    document_type document_type NOT NULL DEFAULT 'RECORD_OF_RIGHTS',
    assigned_officer_id UUID REFERENCES users(id) ON DELETE SET NULL,
    quality_score INT DEFAULT 85,
    quality_assessment VARCHAR(32) DEFAULT 'GOOD',
    is_demo BOOLEAN NOT NULL DEFAULT FALSE,
    demo_scenario VARCHAR(64),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. OCR RESULTS
CREATE TABLE ocr_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id VARCHAR(64) REFERENCES documents(id) ON DELETE CASCADE,
    reader_agreement INT NOT NULL,
    text_confidence VARCHAR(32) NOT NULL DEFAULT 'HIGH',
    disagreement_level VARCHAR(32) NOT NULL DEFAULT 'NONE',
    raw_extracted_text TEXT NOT NULL,
    lines_detected INT NOT NULL DEFAULT 0,
    executed_engines JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. EXTRACTED FIELDS & EVIDENCE
CREATE TABLE extracted_fields (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id VARCHAR(64) REFERENCES documents(id) ON DELETE CASCADE,
    field_key VARCHAR(64) NOT NULL,
    field_label VARCHAR(128) NOT NULL,
    field_value TEXT NOT NULL,
    normalized_value TEXT NOT NULL,
    unit VARCHAR(32),
    confidence INT NOT NULL,
    source_page INT NOT NULL DEFAULT 1,
    crop_x NUMERIC(6, 2) NOT NULL,
    crop_y NUMERIC(6, 2) NOT NULL,
    crop_width NUMERIC(6, 2) NOT NULL,
    crop_height NUMERIC(6, 2) NOT NULL,
    crop_label VARCHAR(64),
    review_status VARCHAR(32) NOT NULL DEFAULT 'ORIGINAL',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. VALIDATION RULES & RESULTS
CREATE TABLE validation_rules (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    severity VARCHAR(32) NOT NULL DEFAULT 'MEDIUM',
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE validation_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id VARCHAR(64) REFERENCES documents(id) ON DELETE CASCADE,
    rule_id VARCHAR(64) REFERENCES validation_rules(id) ON DELETE CASCADE,
    status VARCHAR(32) NOT NULL, -- PASS, REVIEW, HOLD
    severity VARCHAR(32) NOT NULL,
    reason_code VARCHAR(128) NOT NULL,
    explanation TEXT NOT NULL,
    evidence TEXT NOT NULL,
    source_document VARCHAR(255) NOT NULL,
    recommended_action TEXT NOT NULL,
    metric_details JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. TRUST SCORES
CREATE TABLE trust_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id VARCHAR(64) UNIQUE REFERENCES documents(id) ON DELETE CASCADE,
    overall_score INT NOT NULL,
    routing VARCHAR(32) NOT NULL, -- CLEAR, REVIEW, HOLD
    reader_agreement_score INT NOT NULL,
    document_quality_score INT NOT NULL,
    rule_consistency_score INT NOT NULL,
    historical_lineage_score INT NOT NULL,
    rationale TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. TAMPER-EVIDENT AUDIT LEDGER (SHA-256 HASH CHAIN)
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    user_name VARCHAR(255) NOT NULL,
    user_role user_role NOT NULL,
    document_id VARCHAR(64),
    document_number VARCHAR(128),
    action VARCHAR(128) NOT NULL,
    details TEXT NOT NULL,
    old_value TEXT,
    new_value TEXT,
    previous_hash CHAR(64) NOT NULL,
    hash CHAR(64) NOT NULL,
    integrity_status VARCHAR(32) NOT NULL DEFAULT 'VERIFIED'
);

CREATE INDEX idx_audit_timestamp ON audit_logs(timestamp DESC);
CREATE INDEX idx_audit_document ON audit_logs(document_id);
