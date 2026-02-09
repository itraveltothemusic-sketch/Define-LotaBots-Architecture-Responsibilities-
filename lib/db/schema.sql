-- ============================================
-- EQUITY BUILDERS DATABASE SCHEMA
-- PostgreSQL 14+
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS & AUTHENTICATION
-- ============================================

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('owner', 'contractor', 'adjuster', 'internal', 'admin')),
  phone VARCHAR(20),
  company VARCHAR(255),
  license_number VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- ============================================
-- PROPERTIES
-- ============================================

CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Basic Information
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('commercial', 'industrial', 'retail', 'office', 'multifamily', 'mixed-use')),
  status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inspection_pending', 'claim_submitted', 'repair_in_progress', 'completed', 'closed')),
  
  -- Location (stored as JSONB for flexibility)
  address JSONB NOT NULL,
  
  -- Property Details
  square_footage INTEGER NOT NULL,
  year_built INTEGER NOT NULL,
  stories_count INTEGER NOT NULL,
  construction_type VARCHAR(100),
  roof_type VARCHAR(100),
  
  -- Valuation
  pre_incident_value DECIMAL(12, 2) NOT NULL,
  estimated_repair_cost DECIMAL(12, 2),
  projected_post_repair_value DECIMAL(12, 2),
  
  -- Dates
  incident_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_properties_owner ON properties(owner_id);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_incident_date ON properties(incident_date);

-- ============================================
-- INSPECTIONS
-- ============================================

CREATE TABLE inspections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  inspector_id UUID NOT NULL REFERENCES users(id),
  
  status VARCHAR(50) NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'reviewed')),
  scheduled_date TIMESTAMP NOT NULL,
  completed_date TIMESTAMP,
  
  summary TEXT,
  total_damage_estimate DECIMAL(12, 2) DEFAULT 0,
  
  -- Weather data at time of incident
  weather_data JSONB,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_inspections_property ON inspections(property_id);
CREATE INDEX idx_inspections_inspector ON inspections(inspector_id);
CREATE INDEX idx_inspections_status ON inspections(status);

-- ============================================
-- DAMAGE ITEMS
-- ============================================

CREATE TABLE damage_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  inspection_id UUID NOT NULL REFERENCES inspections(id) ON DELETE CASCADE,
  
  category VARCHAR(50) NOT NULL CHECK (category IN ('structural', 'roof', 'water', 'wind', 'electrical', 'hvac', 'interior', 'exterior', 'foundation', 'other')),
  severity VARCHAR(50) NOT NULL CHECK (severity IN ('minor', 'moderate', 'major', 'severe', 'catastrophic')),
  description TEXT NOT NULL,
  location VARCHAR(255) NOT NULL,
  
  -- Measurements stored as JSONB
  measurements JSONB,
  
  estimated_cost DECIMAL(10, 2) NOT NULL,
  
  -- AI Analysis
  ai_confidence DECIMAL(3, 2),
  ai_tags TEXT[],
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_damage_items_inspection ON damage_items(inspection_id);
CREATE INDEX idx_damage_items_category ON damage_items(category);
CREATE INDEX idx_damage_items_severity ON damage_items(severity);

-- ============================================
-- MEDIA (Photos, Videos, Documents)
-- ============================================

CREATE TABLE media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type VARCHAR(50) NOT NULL CHECK (type IN ('photo', 'video', 'document', 'report')),
  filename VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  
  size BIGINT NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  uploaded_by UUID NOT NULL REFERENCES users(id),
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Context - which entity this media belongs to
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  inspection_id UUID REFERENCES inspections(id) ON DELETE CASCADE,
  claim_id UUID REFERENCES insurance_claims(id) ON DELETE CASCADE,
  damage_item_id UUID REFERENCES damage_items(id) ON DELETE CASCADE,
  
  -- AI Analysis for photos/videos
  ai_analysis JSONB,
  
  -- EXIF and metadata
  metadata JSONB
);

CREATE INDEX idx_media_property ON media(property_id);
CREATE INDEX idx_media_inspection ON media(inspection_id);
CREATE INDEX idx_media_claim ON media(claim_id);
CREATE INDEX idx_media_type ON media(type);

-- ============================================
-- INSURANCE CLAIMS
-- ============================================

CREATE TABLE insurance_claims (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  
  claim_number VARCHAR(100),
  carrier VARCHAR(255) NOT NULL,
  policy_number VARCHAR(100) NOT NULL,
  adjuster_id UUID REFERENCES users(id),
  
  status VARCHAR(50) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'under_review', 'additional_info_required', 'approved', 'partial_approval', 'denied', 'settled', 'closed')),
  
  -- Financial
  claimed_amount DECIMAL(12, 2) NOT NULL,
  approved_amount DECIMAL(12, 2),
  paid_amount DECIMAL(12, 2),
  deductible DECIMAL(12, 2) NOT NULL,
  
  -- Dates
  incident_date DATE NOT NULL,
  submitted_date DATE,
  approved_date DATE,
  settlement_date DATE,
  
  -- Scopes stored as JSONB
  forensic_scope JSONB NOT NULL,
  insurance_scope JSONB,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_claims_property ON insurance_claims(property_id);
CREATE INDEX idx_claims_status ON insurance_claims(status);
CREATE INDEX idx_claims_claim_number ON insurance_claims(claim_number);

-- ============================================
-- SCOPE DISCREPANCIES
-- ============================================

CREATE TABLE scope_discrepancies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  claim_id UUID NOT NULL REFERENCES insurance_claims(id) ON DELETE CASCADE,
  
  type VARCHAR(50) NOT NULL CHECK (type IN ('missing', 'underpaid', 'overpaid', 'quantity_mismatch', 'price_mismatch')),
  
  forensic_value DECIMAL(10, 2) NOT NULL,
  insurance_value DECIMAL(10, 2) NOT NULL,
  delta DECIMAL(10, 2) NOT NULL,
  
  explanation TEXT NOT NULL,
  severity VARCHAR(20) NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  
  ai_recommendation TEXT,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_discrepancies_claim ON scope_discrepancies(claim_id);

-- ============================================
-- CLAIM INTERACTIONS
-- ============================================

CREATE TABLE claim_interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  claim_id UUID NOT NULL REFERENCES insurance_claims(id) ON DELETE CASCADE,
  
  type VARCHAR(50) NOT NULL CHECK (type IN ('email', 'phone', 'meeting', 'document_upload', 'inspection_request', 'supplement_request', 'payment_received', 'status_update', 'other')),
  
  timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  initiated_by UUID NOT NULL REFERENCES users(id),
  
  summary TEXT NOT NULL,
  details TEXT,
  
  -- Action tracking
  action_required TEXT,
  due_date DATE
);

CREATE INDEX idx_interactions_claim ON claim_interactions(claim_id);
CREATE INDEX idx_interactions_timestamp ON claim_interactions(timestamp DESC);

-- ============================================
-- CONTRACTORS
-- ============================================

CREATE TABLE contractors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  
  company_name VARCHAR(255) NOT NULL,
  license_number VARCHAR(100) NOT NULL,
  insurance_certificate VARCHAR(255) NOT NULL,
  bond_number VARCHAR(100),
  
  specialties TEXT[] NOT NULL,
  service_areas TEXT[] NOT NULL,
  
  status VARCHAR(50) NOT NULL DEFAULT 'pending_verification' CHECK (status IN ('active', 'inactive', 'suspended', 'pending_verification')),
  verified_at TIMESTAMP,
  verified_by UUID REFERENCES users(id),
  
  -- Performance metrics stored as JSONB
  metrics JSONB DEFAULT '{
    "completedProjects": 0,
    "averageRating": 0,
    "onTimeCompletionRate": 0,
    "complianceScore": 0
  }',
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_contractors_user ON contractors(user_id);
CREATE INDEX idx_contractors_status ON contractors(status);

-- ============================================
-- WORK ORDERS
-- ============================================

CREATE TABLE work_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  contractor_id UUID NOT NULL REFERENCES contractors(id),
  claim_id UUID REFERENCES insurance_claims(id),
  
  status VARCHAR(50) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'assigned', 'accepted', 'in_progress', 'verification_pending', 'completed', 'cancelled')),
  
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  scope JSONB NOT NULL,
  total_value DECIMAL(12, 2) NOT NULL,
  
  -- Schedule
  start_date DATE NOT NULL,
  expected_completion_date DATE NOT NULL,
  actual_completion_date DATE,
  
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage BETWEEN 0 AND 100),
  
  -- Compliance
  permits_required BOOLEAN DEFAULT false,
  
  -- Verification
  verified_by UUID REFERENCES users(id),
  verified_at TIMESTAMP,
  verification_notes TEXT,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_work_orders_property ON work_orders(property_id);
CREATE INDEX idx_work_orders_contractor ON work_orders(contractor_id);
CREATE INDEX idx_work_orders_status ON work_orders(status);

-- ============================================
-- MILESTONES
-- ============================================

CREATE TABLE milestones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  work_order_id UUID NOT NULL REFERENCES work_orders(id) ON DELETE CASCADE,
  
  title VARCHAR(255) NOT NULL,
  description TEXT,
  target_date DATE NOT NULL,
  completed_date DATE,
  is_completed BOOLEAN DEFAULT false,
  
  photo_required BOOLEAN DEFAULT true,
  
  notes TEXT,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_milestones_work_order ON milestones(work_order_id);

-- ============================================
-- PERMITS
-- ============================================

CREATE TABLE permits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  work_order_id UUID NOT NULL REFERENCES work_orders(id) ON DELETE CASCADE,
  
  type VARCHAR(100) NOT NULL,
  number VARCHAR(100) NOT NULL,
  issued_by VARCHAR(255) NOT NULL,
  issued_date DATE NOT NULL,
  expiration_date DATE NOT NULL,
  
  status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'expired', 'rejected')),
  
  document_id UUID REFERENCES media(id)
);

CREATE INDEX idx_permits_work_order ON permits(work_order_id);

-- ============================================
-- EQUITY OUTCOMES
-- ============================================

CREATE TABLE equity_outcomes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  
  -- Valuation
  pre_incident_value DECIMAL(12, 2) NOT NULL,
  post_repair_value DECIMAL(12, 2) NOT NULL,
  valuation_method VARCHAR(255),
  valuation_date DATE NOT NULL,
  
  -- Claim Financial
  total_damage_estimate DECIMAL(12, 2) NOT NULL,
  insurance_approved DECIMAL(12, 2) NOT NULL,
  insurance_paid DECIMAL(12, 2) NOT NULL,
  out_of_pocket_expenses DECIMAL(12, 2) NOT NULL,
  
  -- Repair Costs
  total_repair_cost DECIMAL(12, 2) NOT NULL,
  paid_to_contractors DECIMAL(12, 2) NOT NULL,
  
  -- Equity Calculation
  equity_gain DECIMAL(12, 2) NOT NULL,
  roi DECIMAL(5, 2) NOT NULL,
  
  summary TEXT NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_equity_outcomes_property ON equity_outcomes(property_id);

-- ============================================
-- ATOS MESSAGES
-- ============================================

CREATE TABLE atos_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  context VARCHAR(50) NOT NULL CHECK (context IN ('property_overview', 'inspection_analysis', 'claim_strategy', 'scope_comparison', 'contractor_selection', 'risk_assessment', 'equity_forecast', 'general')),
  context_id UUID,
  
  user_query TEXT,
  system_prompt TEXT,
  ai_response TEXT NOT NULL,
  
  confidence DECIMAL(3, 2),
  sources TEXT[],
  actionable BOOLEAN DEFAULT false,
  
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_atos_messages_user ON atos_messages(user_id);
CREATE INDEX idx_atos_messages_context ON atos_messages(context, context_id);

-- ============================================
-- NOTIFICATIONS
-- ============================================

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  type VARCHAR(50) NOT NULL CHECK (type IN ('claim_status_change', 'inspection_scheduled', 'document_uploaded', 'payment_received', 'contractor_assigned', 'milestone_completed', 'action_required', 'atos_alert')),
  
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  
  entity_type VARCHAR(50),
  entity_id UUID,
  
  read BOOLEAN DEFAULT false,
  read_at TIMESTAMP,
  
  action_url TEXT,
  action_label VARCHAR(100),
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at trigger to all relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inspections_updated_at BEFORE UPDATE ON inspections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_damage_items_updated_at BEFORE UPDATE ON damage_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_claims_updated_at BEFORE UPDATE ON insurance_claims
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contractors_updated_at BEFORE UPDATE ON contractors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_work_orders_updated_at BEFORE UPDATE ON work_orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_equity_outcomes_updated_at BEFORE UPDATE ON equity_outcomes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SEED DATA (Development Only)
-- ============================================

-- Insert admin user (password: admin123)
-- Password hash generated with bcrypt, rounds=10
INSERT INTO users (email, password_hash, first_name, last_name, role, is_active)
VALUES ('admin@equitybuilders.com', '$2a$10$YourHashHere', 'Admin', 'User', 'admin', true)
ON CONFLICT (email) DO NOTHING;
