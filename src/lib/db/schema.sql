-- ============================================================================
-- Equity Builders — Database Schema
-- PostgreSQL (Neon-compatible)
--
-- This schema is designed for:
-- 1. Data integrity — every relationship is enforced
-- 2. Audit trails — created_at/updated_at on every table
-- 3. Performance — strategic indexing on query-heavy columns
-- 4. Extensibility — JSONB metadata fields for flexible data
--
-- Naming conventions:
-- - Tables: snake_case, plural
-- - Columns: snake_case
-- - Foreign keys: referenced_table_id
-- - Indexes: idx_table_column
-- ============================================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── Users & Authentication ─────────────────────────────────────────────────

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255), -- NULL for SSO users
    role VARCHAR(50) NOT NULL CHECK (role IN ('owner', 'contractor', 'adjuster', 'internal')),
    organization_id UUID REFERENCES organizations(id),
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true,
    last_active_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('internal', 'property_owner', 'contractor', 'insurance_carrier')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(500) UNIQUE NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_sessions_token ON sessions(token);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);

-- ─── Properties ─────────────────────────────────────────────────────────────

CREATE TABLE properties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    address VARCHAR(500) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(2) NOT NULL,
    zip_code VARCHAR(10) NOT NULL,
    property_type VARCHAR(50) NOT NULL CHECK (property_type IN ('commercial', 'residential', 'industrial', 'mixed_use')),
    square_footage INTEGER,
    year_built INTEGER,
    owner_id UUID NOT NULL REFERENCES users(id),
    status VARCHAR(50) NOT NULL DEFAULT 'intake' CHECK (status IN (
        'intake', 'inspection_scheduled', 'inspection_complete',
        'documentation_review', 'claim_filed', 'claim_in_progress',
        'restoration_active', 'restoration_complete', 'equity_realized'
    )),
    pre_event_value DECIMAL(14, 2),
    post_restoration_value DECIMAL(14, 2),
    storm_event_date DATE,
    storm_event_type VARCHAR(255),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_properties_owner ON properties(owner_id);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_city_state ON properties(city, state);

-- ─── Inspections & Damage ───────────────────────────────────────────────────

CREATE TABLE inspections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    inspector_id UUID NOT NULL REFERENCES users(id),
    scheduled_at TIMESTAMPTZ NOT NULL,
    completed_at TIMESTAMPTZ,
    status VARCHAR(50) NOT NULL DEFAULT 'scheduled' CHECK (status IN (
        'scheduled', 'in_progress', 'completed', 'cancelled'
    )),
    findings TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE damage_areas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    inspection_id UUID NOT NULL REFERENCES inspections(id) ON DELETE CASCADE,
    property_id UUID NOT NULL REFERENCES properties(id),
    location VARCHAR(500) NOT NULL,
    classification VARCHAR(50) NOT NULL CHECK (classification IN (
        'wind', 'hail', 'water', 'fire', 'structural', 'roof', 'siding', 'interior', 'landscaping', 'other'
    )),
    severity VARCHAR(50) NOT NULL CHECK (severity IN ('minor', 'moderate', 'severe', 'critical')),
    description TEXT NOT NULL,
    estimated_repair_cost DECIMAL(14, 2),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_inspections_property ON inspections(property_id);
CREATE INDEX idx_inspections_status ON inspections(status);
CREATE INDEX idx_damage_areas_property ON damage_areas(property_id);
CREATE INDEX idx_damage_areas_classification ON damage_areas(classification);

-- ─── Evidence ───────────────────────────────────────────────────────────────

CREATE TABLE evidence (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    damage_area_id UUID REFERENCES damage_areas(id),
    type VARCHAR(50) NOT NULL CHECK (type IN ('photo', 'video', 'document', 'report', 'invoice', 'estimate')),
    title VARCHAR(500) NOT NULL,
    description TEXT,
    file_url TEXT NOT NULL,
    thumbnail_url TEXT,
    uploaded_by_id UUID NOT NULL REFERENCES users(id),
    tags TEXT[] DEFAULT '{}',
    damage_classifications TEXT[] DEFAULT '{}',
    captured_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_evidence_property ON evidence(property_id);
CREATE INDEX idx_evidence_type ON evidence(type);
CREATE INDEX idx_evidence_tags ON evidence USING GIN(tags);

-- ─── Insurance Claims ───────────────────────────────────────────────────────

CREATE TABLE insurance_claims (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES properties(id),
    claim_number VARCHAR(100),
    carrier_id UUID,
    carrier_name VARCHAR(255) NOT NULL,
    policy_number VARCHAR(100) NOT NULL,
    date_of_loss DATE NOT NULL,
    date_filed DATE,
    status VARCHAR(50) NOT NULL DEFAULT 'draft' CHECK (status IN (
        'draft', 'filed', 'acknowledged', 'under_review',
        'additional_info_requested', 'approved', 'partially_approved',
        'denied', 'appealed', 'settled', 'closed'
    )),
    claimed_amount DECIMAL(14, 2),
    approved_amount DECIMAL(14, 2),
    settled_amount DECIMAL(14, 2),
    discrepancy_amount DECIMAL(14, 2),
    adjuster_assigned_id UUID REFERENCES users(id),
    notes TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE carrier_interactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    claim_id UUID NOT NULL REFERENCES insurance_claims(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN (
        'call', 'email', 'letter', 'meeting', 'inspection', 'document_request', 'payment'
    )),
    date TIMESTAMPTZ NOT NULL,
    summary TEXT NOT NULL,
    initiated_by VARCHAR(50) NOT NULL CHECK (initiated_by IN ('internal', 'carrier')),
    contact_name VARCHAR(255),
    contact_role VARCHAR(255),
    outcome TEXT,
    metadata JSONB DEFAULT '{}',
    created_by_id UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_claims_property ON insurance_claims(property_id);
CREATE INDEX idx_claims_status ON insurance_claims(status);
CREATE INDEX idx_claims_carrier ON insurance_claims(carrier_name);
CREATE INDEX idx_carrier_interactions_claim ON carrier_interactions(claim_id);

-- ─── Contractors ────────────────────────────────────────────────────────────

CREATE TABLE contractors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_name VARCHAR(255) NOT NULL,
    contact_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    license_number VARCHAR(100),
    insurance_certificate_url TEXT,
    specialties TEXT[] DEFAULT '{}',
    status VARCHAR(50) NOT NULL DEFAULT 'pending_approval' CHECK (status IN (
        'pending_approval', 'approved', 'active', 'suspended', 'inactive'
    )),
    rating DECIMAL(3, 2),
    completed_projects INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE scope_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES properties(id),
    contractor_id UUID NOT NULL REFERENCES contractors(id),
    title VARCHAR(500) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'draft' CHECK (status IN (
        'draft', 'assigned', 'accepted', 'in_progress',
        'pending_verification', 'verified', 'completed', 'disputed'
    )),
    total_amount DECIMAL(14, 2) NOT NULL,
    start_date DATE,
    estimated_completion_date DATE,
    actual_completion_date DATE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE scope_line_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scope_assignment_id UUID NOT NULL REFERENCES scope_assignments(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    quantity DECIMAL(10, 2) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    unit_cost DECIMAL(10, 2) NOT NULL,
    total_cost DECIMAL(14, 2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN (
        'pending', 'in_progress', 'completed', 'verified'
    )),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE compliance_checks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scope_assignment_id UUID NOT NULL REFERENCES scope_assignments(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN (
        'pending', 'passed', 'failed', 'waived'
    )),
    checked_at TIMESTAMPTZ,
    checked_by_id UUID REFERENCES users(id),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_scope_assignments_property ON scope_assignments(property_id);
CREATE INDEX idx_scope_assignments_contractor ON scope_assignments(contractor_id);
CREATE INDEX idx_scope_assignments_status ON scope_assignments(status);

-- ─── Equity Outcomes ────────────────────────────────────────────────────────

CREATE TABLE equity_outcomes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES properties(id),
    pre_event_value DECIMAL(14, 2) NOT NULL,
    post_restoration_value DECIMAL(14, 2) NOT NULL,
    total_claim_amount DECIMAL(14, 2) NOT NULL,
    total_insurance_payout DECIMAL(14, 2) NOT NULL,
    total_restoration_cost DECIMAL(14, 2) NOT NULL,
    net_equity_gain DECIMAL(14, 2) NOT NULL,
    equity_gain_percentage DECIMAL(6, 2) NOT NULL,
    narrative TEXT,
    generated_at TIMESTAMPTZ DEFAULT NOW(),
    verified_at TIMESTAMPTZ,
    verified_by_id UUID REFERENCES users(id),
    metadata JSONB DEFAULT '{}'
);

CREATE INDEX idx_equity_outcomes_property ON equity_outcomes(property_id);

-- ─── ATOS Intelligence ──────────────────────────────────────────────────────

CREATE TABLE atos_conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    context VARCHAR(50) NOT NULL DEFAULT 'general',
    property_id UUID REFERENCES properties(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE atos_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES atos_conversations(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    confidence DECIMAL(3, 2),
    reasoning TEXT,
    entity_references JSONB DEFAULT '[]',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE atos_insights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID REFERENCES properties(id),
    type VARCHAR(50) NOT NULL CHECK (type IN ('risk', 'opportunity', 'gap', 'recommendation', 'alert')),
    severity VARCHAR(50) NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    title VARCHAR(500) NOT NULL,
    description TEXT NOT NULL,
    actionable_steps TEXT[] DEFAULT '{}',
    reasoning TEXT NOT NULL,
    acknowledged BOOLEAN DEFAULT false,
    acknowledged_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_atos_insights_property ON atos_insights(property_id);
CREATE INDEX idx_atos_insights_type ON atos_insights(type);
CREATE INDEX idx_atos_insights_severity ON atos_insights(severity);
CREATE INDEX idx_atos_insights_acknowledged ON atos_insights(acknowledged);

-- ─── Timeline Events (Audit Trail) ─────────────────────────────────────────

CREATE TABLE timeline_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES properties(id),
    type VARCHAR(100) NOT NULL,
    title VARCHAR(500) NOT NULL,
    description TEXT NOT NULL,
    date TIMESTAMPTZ NOT NULL,
    actor_id UUID REFERENCES users(id),
    actor_name VARCHAR(255),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_timeline_property ON timeline_events(property_id);
CREATE INDEX idx_timeline_date ON timeline_events(date);
CREATE INDEX idx_timeline_type ON timeline_events(type);

-- ─── Triggers: Auto-update updated_at ───────────────────────────────────────

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_properties_updated_at
    BEFORE UPDATE ON properties
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_claims_updated_at
    BEFORE UPDATE ON insurance_claims
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scope_assignments_updated_at
    BEFORE UPDATE ON scope_assignments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
