-- Equity Builders core relational schema (PostgreSQL / Neon compatible)
-- This schema emphasizes forensic traceability and insurer-grade auditability.

create extension if not exists "pgcrypto";

do $$
begin
  if not exists (select 1 from pg_type where typname = 'app_role') then
    create type app_role as enum ('OWNER', 'CONTRACTOR', 'ADJUSTER', 'INTERNAL');
  end if;
end $$;

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null unique,
  role app_role not null,
  password_hash text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists properties (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text not null,
  occupancy_type text not null,
  storm_event text not null,
  confidence_score numeric(5,2) not null default 0,
  inspection_status text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists inspections (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references properties(id) on delete cascade,
  inspector_name text not null,
  inspected_at timestamptz not null,
  severity text not null,
  findings_summary text not null,
  created_at timestamptz not null default now()
);

create table if not exists evidence_items (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references properties(id) on delete cascade,
  inspection_id uuid references inspections(id) on delete set null,
  evidence_type text not null,
  title text not null,
  storage_uri text not null,
  uploaded_by uuid references users(id),
  verification_status text not null,
  occurred_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table if not exists claims (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references properties(id) on delete cascade,
  carrier_name text not null,
  policy_number text not null,
  status text not null,
  reserve_estimate numeric(14,2) not null default 0,
  payout_amount numeric(14,2) not null default 0,
  opened_at timestamptz not null,
  updated_at timestamptz not null default now()
);

create table if not exists carrier_interactions (
  id uuid primary key default gen_random_uuid(),
  claim_id uuid not null references claims(id) on delete cascade,
  channel text not null,
  summary text not null,
  owner_user_id uuid references users(id),
  occurred_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table if not exists scope_discrepancies (
  id uuid primary key default gen_random_uuid(),
  claim_id uuid not null references claims(id) on delete cascade,
  category text not null,
  carrier_value numeric(14,2) not null,
  forensic_value numeric(14,2) not null,
  rationale text not null,
  created_at timestamptz not null default now()
);

create table if not exists contractors (
  id uuid primary key default gen_random_uuid(),
  company_name text not null,
  trade text not null,
  onboarding_status text not null,
  compliance_score numeric(5,2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists execution_milestones (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references properties(id) on delete cascade,
  contractor_id uuid not null references contractors(id) on delete restrict,
  title text not null,
  status text not null,
  due_at timestamptz not null,
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists equity_outcomes (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references properties(id) on delete cascade,
  baseline_value numeric(14,2) not null,
  post_recovery_value numeric(14,2) not null,
  claim_estimate numeric(14,2) not null,
  payout_value numeric(14,2) not null,
  narrative text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_properties_inspection_status
  on properties (inspection_status);
create index if not exists idx_evidence_items_property
  on evidence_items (property_id, verification_status);
create index if not exists idx_claims_property_status
  on claims (property_id, status);
create index if not exists idx_execution_milestones_status
  on execution_milestones (status, due_at);
