/**
 * Database connection and query utilities.
 * 
 * WHY Neon Postgres: Neon provides serverless Postgres that scales to zero,
 * which is ideal for this platform's deployment model. It also supports
 * branching for development environments, which mirrors our need for
 * isolated testing of claim data workflows.
 * 
 * This module will be the single point of database access. All queries
 * go through here to ensure:
 * 1. Connection pooling
 * 2. Query logging for audit trails
 * 3. Error handling consistency
 * 4. Type-safe query results
 */

// Database schema definition for reference (Postgres DDL)
export const SCHEMA = `
-- Equity Builders Database Schema
-- Designed for Neon Postgres

-- Users table with role-based access control
CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         VARCHAR(255) UNIQUE NOT NULL,
  name          VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role          VARCHAR(50) NOT NULL CHECK (role IN ('owner', 'contractor', 'adjuster', 'internal')),
  avatar_url    TEXT,
  organization  VARCHAR(255),
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  last_login_at TIMESTAMPTZ,
  is_active     BOOLEAN DEFAULT TRUE
);

-- Properties — the core entity
CREATE TABLE IF NOT EXISTS properties (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            VARCHAR(255) NOT NULL,
  address         VARCHAR(500) NOT NULL,
  city            VARCHAR(100) NOT NULL,
  state           VARCHAR(2) NOT NULL,
  zip             VARCHAR(10) NOT NULL,
  property_type   VARCHAR(50) NOT NULL CHECK (property_type IN ('commercial', 'industrial', 'mixed-use', 'retail', 'office')),
  status          VARCHAR(50) NOT NULL DEFAULT 'intake',
  owner_id        UUID REFERENCES users(id),
  square_footage  INTEGER NOT NULL,
  year_built      INTEGER NOT NULL,
  estimated_value DECIMAL(12,2) NOT NULL,
  storm_date      DATE,
  storm_type      VARCHAR(255),
  image_url       TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Inspections
CREATE TABLE IF NOT EXISTS inspections (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id            UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  inspector_name         VARCHAR(255) NOT NULL,
  inspection_date        DATE NOT NULL,
  findings               TEXT NOT NULL,
  damage_classifications TEXT[] NOT NULL,
  severity               VARCHAR(50) NOT NULL CHECK (severity IN ('minor', 'moderate', 'severe', 'catastrophic')),
  estimated_repair_cost  DECIMAL(12,2) NOT NULL,
  photo_count            INTEGER DEFAULT 0,
  document_count         INTEGER DEFAULT 0,
  status                 VARCHAR(50) NOT NULL DEFAULT 'scheduled',
  created_at             TIMESTAMPTZ DEFAULT NOW()
);

-- Evidence documents
CREATE TABLE IF NOT EXISTS evidence (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id   UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  type          VARCHAR(50) NOT NULL CHECK (type IN ('photo', 'video', 'document', 'report', 'invoice', 'correspondence')),
  title         VARCHAR(500) NOT NULL,
  description   TEXT,
  file_url      TEXT NOT NULL,
  thumbnail_url TEXT,
  uploaded_by   UUID REFERENCES users(id),
  uploaded_at   TIMESTAMPTZ DEFAULT NOW(),
  tags          TEXT[] DEFAULT '{}',
  metadata      JSONB DEFAULT '{}'
);

-- Insurance claims
CREATE TABLE IF NOT EXISTS insurance_claims (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id      UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  claim_number     VARCHAR(100) UNIQUE NOT NULL,
  carrier          VARCHAR(255) NOT NULL,
  policy_number    VARCHAR(100) NOT NULL,
  filed_date       DATE NOT NULL,
  status           VARCHAR(50) NOT NULL DEFAULT 'draft',
  claimed_amount   DECIMAL(12,2) NOT NULL,
  approved_amount  DECIMAL(12,2),
  deductible       DECIMAL(12,2) NOT NULL,
  adjuster_name    VARCHAR(255),
  adjuster_email   VARCHAR(255),
  adjuster_phone   VARCHAR(50),
  last_contact_date DATE,
  next_action_date  DATE,
  notes            TEXT,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- Carrier interactions (audit trail)
CREATE TABLE IF NOT EXISTS carrier_interactions (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  claim_id          UUID NOT NULL REFERENCES insurance_claims(id) ON DELETE CASCADE,
  interaction_date  DATE NOT NULL,
  type              VARCHAR(50) NOT NULL CHECK (type IN ('call', 'email', 'letter', 'meeting', 'site_visit')),
  summary           TEXT NOT NULL,
  participants      TEXT[] DEFAULT '{}',
  outcome           TEXT,
  follow_up_required BOOLEAN DEFAULT FALSE,
  follow_up_date     DATE,
  document_ids       UUID[] DEFAULT '{}',
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- Scope items for discrepancy tracking
CREATE TABLE IF NOT EXISTS scope_items (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  claim_id         UUID NOT NULL REFERENCES insurance_claims(id) ON DELETE CASCADE,
  category         VARCHAR(100) NOT NULL,
  description      TEXT NOT NULL,
  owner_estimate   DECIMAL(12,2) NOT NULL,
  carrier_estimate DECIMAL(12,2),
  approved_amount  DECIMAL(12,2),
  discrepancy      DECIMAL(12,2),
  notes            TEXT
);

-- Contractors
CREATE TABLE IF NOT EXISTS contractors (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name               VARCHAR(255) NOT NULL,
  company            VARCHAR(255) NOT NULL,
  email              VARCHAR(255) UNIQUE NOT NULL,
  phone              VARCHAR(50),
  license_number     VARCHAR(100) NOT NULL,
  insurance_verified BOOLEAN DEFAULT FALSE,
  specializations    TEXT[] DEFAULT '{}',
  rating             DECIMAL(3,2) DEFAULT 0,
  completed_jobs     INTEGER DEFAULT 0,
  status             VARCHAR(50) NOT NULL DEFAULT 'pending',
  created_at         TIMESTAMPTZ DEFAULT NOW()
);

-- Scope assignments
CREATE TABLE IF NOT EXISTS scope_assignments (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id          UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  contractor_id        UUID NOT NULL REFERENCES contractors(id),
  description          TEXT NOT NULL,
  estimated_cost       DECIMAL(12,2) NOT NULL,
  actual_cost          DECIMAL(12,2),
  start_date           DATE NOT NULL,
  expected_end_date    DATE NOT NULL,
  actual_end_date      DATE,
  status               VARCHAR(50) NOT NULL DEFAULT 'assigned',
  progress_percentage  INTEGER DEFAULT 0,
  created_at           TIMESTAMPTZ DEFAULT NOW()
);

-- Compliance checks for scope assignments
CREATE TABLE IF NOT EXISTS compliance_checks (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID NOT NULL REFERENCES scope_assignments(id) ON DELETE CASCADE,
  name          VARCHAR(255) NOT NULL,
  description   TEXT,
  passed        BOOLEAN DEFAULT FALSE,
  checked_at    TIMESTAMPTZ,
  checked_by    UUID REFERENCES users(id),
  notes         TEXT
);

-- Equity outcomes
CREATE TABLE IF NOT EXISTS equity_outcomes (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id            UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  pre_storm_value        DECIMAL(12,2) NOT NULL,
  post_repair_value      DECIMAL(12,2) NOT NULL,
  total_claim_amount     DECIMAL(12,2) NOT NULL,
  total_payout_received  DECIMAL(12,2) NOT NULL,
  total_repair_cost      DECIMAL(12,2) NOT NULL,
  net_equity_gain        DECIMAL(12,2) NOT NULL,
  equity_gain_percentage DECIMAL(5,2) NOT NULL,
  narrative              TEXT NOT NULL,
  verified_at            TIMESTAMPTZ,
  verified_by            UUID REFERENCES users(id),
  created_at             TIMESTAMPTZ DEFAULT NOW()
);

-- ATOS insights
CREATE TABLE IF NOT EXISTS atos_insights (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id      UUID REFERENCES properties(id) ON DELETE SET NULL,
  category         VARCHAR(50) NOT NULL CHECK (category IN ('risk', 'opportunity', 'gap', 'recommendation', 'milestone')),
  title            VARCHAR(500) NOT NULL,
  description      TEXT NOT NULL,
  severity         VARCHAR(50) NOT NULL CHECK (severity IN ('info', 'low', 'medium', 'high', 'critical')),
  action_required  BOOLEAN DEFAULT FALSE,
  suggested_action TEXT,
  acknowledged     BOOLEAN DEFAULT FALSE,
  acknowledged_by  UUID REFERENCES users(id),
  acknowledged_at  TIMESTAMPTZ,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- Timeline events (audit log)
CREATE TABLE IF NOT EXISTS timeline_events (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id       UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  timestamp         TIMESTAMPTZ DEFAULT NOW(),
  type              VARCHAR(50) NOT NULL,
  title             VARCHAR(500) NOT NULL,
  description       TEXT,
  user_id           UUID REFERENCES users(id),
  related_entity_id UUID,
  metadata          JSONB DEFAULT '{}'
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_owner ON properties(owner_id);
CREATE INDEX IF NOT EXISTS idx_inspections_property ON inspections(property_id);
CREATE INDEX IF NOT EXISTS idx_evidence_property ON evidence(property_id);
CREATE INDEX IF NOT EXISTS idx_claims_property ON insurance_claims(property_id);
CREATE INDEX IF NOT EXISTS idx_claims_status ON insurance_claims(status);
CREATE INDEX IF NOT EXISTS idx_interactions_claim ON carrier_interactions(claim_id);
CREATE INDEX IF NOT EXISTS idx_scope_items_claim ON scope_items(claim_id);
CREATE INDEX IF NOT EXISTS idx_assignments_property ON scope_assignments(property_id);
CREATE INDEX IF NOT EXISTS idx_assignments_contractor ON scope_assignments(contractor_id);
CREATE INDEX IF NOT EXISTS idx_compliance_assignment ON compliance_checks(assignment_id);
CREATE INDEX IF NOT EXISTS idx_equity_property ON equity_outcomes(property_id);
CREATE INDEX IF NOT EXISTS idx_insights_property ON atos_insights(property_id);
CREATE INDEX IF NOT EXISTS idx_insights_severity ON atos_insights(severity);
CREATE INDEX IF NOT EXISTS idx_timeline_property ON timeline_events(property_id);
CREATE INDEX IF NOT EXISTS idx_timeline_timestamp ON timeline_events(timestamp);
`;

/**
 * Database connection placeholder.
 * 
 * In production, initialize Neon client here:
 * 
 * import { neon } from '@neondatabase/serverless';
 * const sql = neon(process.env.DATABASE_URL!);
 * 
 * export async function query<T>(text: string, params?: any[]): Promise<T[]> {
 *   return sql(text, params) as Promise<T[]>;
 * }
 */

export function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.warn(
      "DATABASE_URL not set. Using mock data. Set DATABASE_URL to connect to Neon Postgres.",
    );
    return "";
  }
  return url;
}
