-- ═══════════════════════════════════════════════════════════════
-- Equity Builders — Database Schema
-- ═══════════════════════════════════════════════════════════════
-- Target: PostgreSQL 15+ (Neon-compatible)
-- 
-- Design decisions:
-- 1. UUID primary keys for distributed-safe ID generation
-- 2. Timestamps on everything for complete audit trails
-- 3. Enum types for constrained status fields
-- 4. Indexes on frequently queried columns (status, foreign keys)
-- 5. Soft deletes via archived_at rather than hard deletes
-- ═══════════════════════════════════════════════════════════════

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── Enums ──────────────────────────────────────────────────────

CREATE TYPE user_role AS ENUM ('owner', 'contractor', 'adjuster', 'internal');

CREATE TYPE property_status AS ENUM (
  'intake', 'inspection', 'claim-filed', 'claim-review',
  'approved', 'in-repair', 'verification', 'complete', 'disputed'
);

CREATE TYPE property_type AS ENUM ('commercial', 'industrial', 'mixed-use', 'multi-family');

CREATE TYPE damage_classification AS ENUM (
  'wind', 'hail', 'water', 'structural', 'roof',
  'facade', 'interior', 'electrical', 'hvac', 'other'
);

CREATE TYPE inspection_type AS ENUM ('initial', 'follow-up', 'verification', 'final');

CREATE TYPE evidence_type AS ENUM ('photo', 'video', 'document', 'report', 'correspondence');

CREATE TYPE claim_status AS ENUM (
  'draft', 'filed', 'acknowledged', 'under-review',
  'additional-info-requested', 'approved', 'partially-approved',
  'denied', 'appealed', 'settled'
);

CREATE TYPE contractor_status AS ENUM ('pending', 'verified', 'active', 'suspended', 'inactive');

CREATE TYPE assignment_status AS ENUM (
  'pending', 'accepted', 'in-progress', 'paused',
  'completed', 'verified', 'disputed'
);

CREATE TYPE equity_status AS ENUM ('calculating', 'draft', 'verified', 'published');

CREATE TYPE interaction_type AS ENUM ('call', 'email', 'letter', 'meeting', 'inspection', 'document');

-- ─── Users ──────────────────────────────────────────────────────

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role user_role NOT NULL DEFAULT 'owner',
  avatar_url TEXT,
  organization VARCHAR(255),
  phone VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_login_at TIMESTAMPTZ,
  archived_at TIMESTAMPTZ
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- ─── Properties ─────────────────────────────────────────────────

CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  address VARCHAR(500) NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(10) NOT NULL,
  zip VARCHAR(20) NOT NULL,
  property_type property_type NOT NULL,
  status property_status NOT NULL DEFAULT 'intake',
  owner_id UUID NOT NULL REFERENCES users(id),
  owner_name VARCHAR(255) NOT NULL,
  square_footage INTEGER,
  year_built INTEGER,
  estimated_value DECIMAL(15, 2),
  damage_date DATE,
  damage_classifications damage_classification[] DEFAULT '{}',
  primary_image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  archived_at TIMESTAMPTZ
);

CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_owner ON properties(owner_id);
CREATE INDEX idx_properties_city_state ON properties(city, state);

-- ─── Inspections ────────────────────────────────────────────────

CREATE TABLE inspections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id),
  type inspection_type NOT NULL,
  inspector_name VARCHAR(255) NOT NULL,
  inspector_id UUID REFERENCES users(id),
  inspection_date DATE NOT NULL,
  findings TEXT NOT NULL,
  damage_classifications damage_classification[] DEFAULT '{}',
  severity_score INTEGER NOT NULL CHECK (severity_score BETWEEN 1 AND 10),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  archived_at TIMESTAMPTZ
);

CREATE INDEX idx_inspections_property ON inspections(property_id);
CREATE INDEX idx_inspections_date ON inspections(inspection_date);

-- ─── Evidence ───────────────────────────────────────────────────

CREATE TABLE evidence (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id),
  inspection_id UUID REFERENCES inspections(id),
  type evidence_type NOT NULL,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  uploaded_by UUID NOT NULL REFERENCES users(id),
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  archived_at TIMESTAMPTZ
);

CREATE INDEX idx_evidence_property ON evidence(property_id);
CREATE INDEX idx_evidence_inspection ON evidence(inspection_id);
CREATE INDEX idx_evidence_type ON evidence(type);

-- ─── Insurance Claims ───────────────────────────────────────────

CREATE TABLE insurance_claims (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id),
  claim_number VARCHAR(100),
  carrier VARCHAR(255) NOT NULL,
  policy_number VARCHAR(100),
  status claim_status NOT NULL DEFAULT 'draft',
  filed_date DATE,
  amount_claimed DECIMAL(15, 2) NOT NULL,
  amount_approved DECIMAL(15, 2),
  amount_paid DECIMAL(15, 2),
  adjuster_name VARCHAR(255),
  adjuster_contact VARCHAR(255),
  scope_discrepancy DECIMAL(5, 2),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  archived_at TIMESTAMPTZ
);

CREATE INDEX idx_claims_property ON insurance_claims(property_id);
CREATE INDEX idx_claims_status ON insurance_claims(status);
CREATE INDEX idx_claims_carrier ON insurance_claims(carrier);

-- ─── Carrier Interactions ───────────────────────────────────────

CREATE TABLE carrier_interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  claim_id UUID NOT NULL REFERENCES insurance_claims(id),
  interaction_date DATE NOT NULL,
  type interaction_type NOT NULL,
  summary TEXT NOT NULL,
  outcome TEXT,
  follow_up_required BOOLEAN DEFAULT false,
  follow_up_date DATE,
  recorded_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_interactions_claim ON carrier_interactions(claim_id);

-- ─── Contractors ────────────────────────────────────────────────

CREATE TABLE contractors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_name VARCHAR(255) NOT NULL,
  contact_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50),
  license_number VARCHAR(100),
  insurance_verified BOOLEAN DEFAULT false,
  specialties TEXT[] DEFAULT '{}',
  status contractor_status NOT NULL DEFAULT 'pending',
  rating DECIMAL(3, 2),
  completed_projects INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  archived_at TIMESTAMPTZ
);

CREATE INDEX idx_contractors_status ON contractors(status);

-- ─── Contractor Assignments ─────────────────────────────────────

CREATE TABLE contractor_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contractor_id UUID NOT NULL REFERENCES contractors(id),
  property_id UUID NOT NULL REFERENCES properties(id),
  scope TEXT NOT NULL,
  status assignment_status NOT NULL DEFAULT 'pending',
  estimated_cost DECIMAL(15, 2) NOT NULL,
  actual_cost DECIMAL(15, 2),
  start_date DATE,
  estimated_end_date DATE,
  actual_end_date DATE,
  compliance_score DECIMAL(5, 2),
  progress_percent INTEGER DEFAULT 0 CHECK (progress_percent BETWEEN 0 AND 100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_assignments_contractor ON contractor_assignments(contractor_id);
CREATE INDEX idx_assignments_property ON contractor_assignments(property_id);
CREATE INDEX idx_assignments_status ON contractor_assignments(status);

-- ─── Equity Outcomes ────────────────────────────────────────────

CREATE TABLE equity_outcomes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id),
  value_before DECIMAL(15, 2) NOT NULL,
  value_after DECIMAL(15, 2) NOT NULL,
  insurance_payout DECIMAL(15, 2) NOT NULL DEFAULT 0,
  repair_cost DECIMAL(15, 2) NOT NULL DEFAULT 0,
  equity_gain DECIMAL(15, 2) GENERATED ALWAYS AS (value_after - value_before) STORED,
  equity_gain_percent DECIMAL(8, 4) GENERATED ALWAYS AS (
    CASE WHEN value_before > 0 THEN ((value_after - value_before) / value_before) * 100
    ELSE 0 END
  ) STORED,
  narrative TEXT,
  status equity_status NOT NULL DEFAULT 'calculating',
  verified_by UUID REFERENCES users(id),
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_equity_property ON equity_outcomes(property_id);
CREATE INDEX idx_equity_status ON equity_outcomes(status);

-- ─── ATOS Insights (Persisted) ──────────────────────────────────

CREATE TABLE atos_insights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(500) NOT NULL,
  description TEXT NOT NULL,
  severity VARCHAR(20) NOT NULL CHECK (severity IN ('info', 'warning', 'critical', 'opportunity')),
  module VARCHAR(50) NOT NULL,
  entity_id UUID,
  entity_type VARCHAR(50),
  action_label VARCHAR(100),
  action_url VARCHAR(500),
  dismissed BOOLEAN DEFAULT false,
  dismissed_by UUID REFERENCES users(id),
  dismissed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_insights_severity ON atos_insights(severity);
CREATE INDEX idx_insights_module ON atos_insights(module);
CREATE INDEX idx_insights_dismissed ON atos_insights(dismissed);

-- ─── Audit Log ──────────────────────────────────────────────────
-- Every significant action is logged for forensic traceability

CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id UUID NOT NULL,
  details JSONB,
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_user ON audit_log(user_id);
CREATE INDEX idx_audit_entity ON audit_log(entity_type, entity_id);
CREATE INDEX idx_audit_created ON audit_log(created_at);

-- ─── Updated At Trigger ─────────────────────────────────────────
-- Automatically updates updated_at on row modification

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_claims_updated_at BEFORE UPDATE ON insurance_claims
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contractors_updated_at BEFORE UPDATE ON contractors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assignments_updated_at BEFORE UPDATE ON contractor_assignments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_equity_updated_at BEFORE UPDATE ON equity_outcomes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
