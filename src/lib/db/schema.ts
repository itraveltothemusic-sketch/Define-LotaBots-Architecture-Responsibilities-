/**
 * Database Schema Definition using Drizzle ORM
 * 
 * This schema defines the complete database structure for the Equity Builders platform.
 * All tables are designed for PostgreSQL with proper indexes, constraints, and relationships.
 */

import { pgTable, text, varchar, timestamp, boolean, integer, decimal, jsonb, pgEnum, uuid, index, unique } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ============================================================================
// ENUMS
// ============================================================================

export const userRoleEnum = pgEnum('user_role', ['OWNER', 'CONTRACTOR', 'ADJUSTER', 'INTERNAL']);
export const propertyTypeEnum = pgEnum('property_type', ['RETAIL', 'OFFICE', 'INDUSTRIAL', 'MULTIFAMILY', 'MIXED_USE', 'HOSPITALITY', 'WAREHOUSE', 'OTHER']);
export const propertyStatusEnum = pgEnum('property_status', ['INITIAL_ASSESSMENT', 'DOCUMENTATION_IN_PROGRESS', 'CLAIM_FILED', 'NEGOTIATION', 'WORK_IN_PROGRESS', 'COMPLETED', 'ARCHIVED']);
export const damageCategoryEnum = pgEnum('damage_category', ['STRUCTURAL', 'ROOF', 'WATER', 'ELECTRICAL', 'HVAC', 'INTERIOR', 'EXTERIOR', 'FOUNDATION', 'WINDOWS_DOORS', 'OTHER']);
export const damageSeverityEnum = pgEnum('damage_severity', ['MINOR', 'MODERATE', 'MAJOR', 'CATASTROPHIC']);
export const evidenceTypeEnum = pgEnum('evidence_type', ['PHOTO', 'VIDEO', 'DOCUMENT', 'REPORT']);
export const claimStatusEnum = pgEnum('claim_status', ['DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'ADDITIONAL_INFO_REQUESTED', 'APPROVED', 'PARTIALLY_APPROVED', 'DENIED', 'APPEALED', 'SETTLED']);
export const contractorStatusEnum = pgEnum('contractor_status', ['PENDING_APPROVAL', 'APPROVED', 'SUSPENDED', 'REJECTED']);
export const workOrderStatusEnum = pgEnum('work_order_status', ['PENDING', 'ACCEPTED', 'IN_PROGRESS', 'INSPECTION_REQUIRED', 'COMPLETED', 'REJECTED']);

// ============================================================================
// USERS TABLE
// ============================================================================

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  role: userRoleEnum('role').notNull(),
  organizationId: uuid('organization_id'),
  phone: varchar('phone', { length: 50 }),
  avatar: text('avatar'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  lastLoginAt: timestamp('last_login_at'),
}, (table) => ({
  emailIdx: index('users_email_idx').on(table.email),
  roleIdx: index('users_role_idx').on(table.role),
}));

// ============================================================================
// PROPERTIES TABLE
// ============================================================================

export const properties = pgTable('properties', {
  id: uuid('id').defaultRandom().primaryKey(),
  ownerId: uuid('owner_id').notNull().references(() => users.id),
  name: varchar('name', { length: 255 }).notNull(),
  addressStreet: varchar('address_street', { length: 255 }).notNull(),
  addressCity: varchar('address_city', { length: 100 }).notNull(),
  addressState: varchar('address_state', { length: 50 }).notNull(),
  addressZip: varchar('address_zip', { length: 20 }).notNull(),
  addressCountry: varchar('address_country', { length: 100 }).notNull().default('USA'),
  propertyType: propertyTypeEnum('property_type').notNull(),
  status: propertyStatusEnum('status').notNull().default('INITIAL_ASSESSMENT'),
  squareFootage: integer('square_footage'),
  yearBuilt: integer('year_built'),
  stories: integer('stories'),
  latitude: decimal('latitude', { precision: 10, scale: 7 }),
  longitude: decimal('longitude', { precision: 10, scale: 7 }),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  ownerIdx: index('properties_owner_idx').on(table.ownerId),
  statusIdx: index('properties_status_idx').on(table.status),
}));

// ============================================================================
// DAMAGE ASSESSMENTS TABLE
// ============================================================================

export const damageAssessments = pgTable('damage_assessments', {
  id: uuid('id').defaultRandom().primaryKey(),
  propertyId: uuid('property_id').notNull().references(() => properties.id, { onDelete: 'cascade' }),
  category: damageCategoryEnum('category').notNull(),
  severity: damageSeverityEnum('severity').notNull(),
  description: text('description').notNull(),
  estimatedCost: decimal('estimated_cost', { precision: 12, scale: 2 }).notNull(),
  location: varchar('location', { length: 255 }).notNull(),
  assessedBy: uuid('assessed_by').notNull().references(() => users.id),
  assessedAt: timestamp('assessed_at').notNull().defaultNow(),
  verified: boolean('verified').notNull().default(false),
  verifiedBy: uuid('verified_by').references(() => users.id),
  verifiedAt: timestamp('verified_at'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  propertyIdx: index('damage_assessments_property_idx').on(table.propertyId),
  categoryIdx: index('damage_assessments_category_idx').on(table.category),
  verifiedIdx: index('damage_assessments_verified_idx').on(table.verified),
}));

// ============================================================================
// EVIDENCE TABLE
// ============================================================================

export const evidence = pgTable('evidence', {
  id: uuid('id').defaultRandom().primaryKey(),
  propertyId: uuid('property_id').notNull().references(() => properties.id, { onDelete: 'cascade' }),
  damageAssessmentId: uuid('damage_assessment_id').references(() => damageAssessments.id, { onDelete: 'set null' }),
  type: evidenceTypeEnum('type').notNull(),
  url: text('url').notNull(),
  filename: varchar('filename', { length: 255 }).notNull(),
  mimeType: varchar('mime_type', { length: 100 }).notNull(),
  size: integer('size').notNull(),
  uploadedBy: uuid('uploaded_by').notNull().references(() => users.id),
  uploadedAt: timestamp('uploaded_at').notNull().defaultNow(),
  caption: text('caption'),
  metadata: jsonb('metadata'),
  verified: boolean('verified').notNull().default(false),
}, (table) => ({
  propertyIdx: index('evidence_property_idx').on(table.propertyId),
  damageIdx: index('evidence_damage_idx').on(table.damageAssessmentId),
  typeIdx: index('evidence_type_idx').on(table.type),
}));

// ============================================================================
// INSURANCE CLAIMS TABLE
// ============================================================================

export const insuranceClaims = pgTable('insurance_claims', {
  id: uuid('id').defaultRandom().primaryKey(),
  propertyId: uuid('property_id').notNull().references(() => properties.id, { onDelete: 'cascade' }),
  claimNumber: varchar('claim_number', { length: 100 }).notNull(),
  carrier: varchar('carrier', { length: 255 }).notNull(),
  policyNumber: varchar('policy_number', { length: 100 }).notNull(),
  dateOfLoss: timestamp('date_of_loss').notNull(),
  dateSubmitted: timestamp('date_submitted'),
  status: claimStatusEnum('status').notNull().default('DRAFT'),
  claimedAmount: decimal('claimed_amount', { precision: 12, scale: 2 }).notNull(),
  approvedAmount: decimal('approved_amount', { precision: 12, scale: 2 }),
  paidAmount: decimal('paid_amount', { precision: 12, scale: 2 }),
  deductible: decimal('deductible', { precision: 12, scale: 2 }).notNull(),
  adjusterId: uuid('adjuster_id').references(() => users.id),
  notes: text('notes'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  propertyIdx: index('insurance_claims_property_idx').on(table.propertyId),
  claimNumberIdx: index('insurance_claims_claim_number_idx').on(table.claimNumber),
  statusIdx: index('insurance_claims_status_idx').on(table.status),
}));

// ============================================================================
// CLAIM INTERACTIONS TABLE
// ============================================================================

export const claimInteractions = pgTable('claim_interactions', {
  id: uuid('id').defaultRandom().primaryKey(),
  claimId: uuid('claim_id').notNull().references(() => insuranceClaims.id, { onDelete: 'cascade' }),
  date: timestamp('date').notNull().defaultNow(),
  type: varchar('type', { length: 50 }).notNull(),
  summary: text('summary').notNull(),
  participants: jsonb('participants').notNull(),
  outcome: text('outcome'),
  recordedBy: uuid('recorded_by').notNull().references(() => users.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  claimIdx: index('claim_interactions_claim_idx').on(table.claimId),
}));

// ============================================================================
// SCOPE DISCREPANCIES TABLE
// ============================================================================

export const scopeDiscrepancies = pgTable('scope_discrepancies', {
  id: uuid('id').defaultRandom().primaryKey(),
  claimId: uuid('claim_id').notNull().references(() => insuranceClaims.id, { onDelete: 'cascade' }),
  category: damageCategoryEnum('category').notNull(),
  ourScope: text('our_scope').notNull(),
  adjustersScope: text('adjusters_scope').notNull(),
  ourCost: decimal('our_cost', { precision: 12, scale: 2 }).notNull(),
  adjustersCost: decimal('adjusters_cost', { precision: 12, scale: 2 }).notNull(),
  variance: decimal('variance', { precision: 12, scale: 2 }).notNull(),
  variancePercent: decimal('variance_percent', { precision: 5, scale: 2 }).notNull(),
  flagged: boolean('flagged').notNull().default(true),
  resolution: text('resolution'),
  resolvedAt: timestamp('resolved_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  claimIdx: index('scope_discrepancies_claim_idx').on(table.claimId),
  flaggedIdx: index('scope_discrepancies_flagged_idx').on(table.flagged),
}));

// ============================================================================
// CONTRACTORS TABLE
// ============================================================================

export const contractors = pgTable('contractors', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id),
  companyName: varchar('company_name', { length: 255 }).notNull(),
  licenseNumber: varchar('license_number', { length: 100 }).notNull(),
  licenseState: varchar('license_state', { length: 50 }).notNull(),
  licenseExpiry: timestamp('license_expiry').notNull(),
  insuranceCertificate: text('insurance_certificate'),
  bondAmount: decimal('bond_amount', { precision: 12, scale: 2 }),
  specialties: jsonb('specialties').notNull(),
  rating: decimal('rating', { precision: 3, scale: 2 }),
  completedProjects: integer('completed_projects').notNull().default(0),
  status: contractorStatusEnum('status').notNull().default('PENDING_APPROVAL'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  userIdx: index('contractors_user_idx').on(table.userId),
  statusIdx: index('contractors_status_idx').on(table.status),
  licenseUniqueIdx: unique('contractors_license_unique').on(table.licenseNumber, table.licenseState),
}));

// ============================================================================
// WORK ORDERS TABLE
// ============================================================================

export const workOrders = pgTable('work_orders', {
  id: uuid('id').defaultRandom().primaryKey(),
  propertyId: uuid('property_id').notNull().references(() => properties.id, { onDelete: 'cascade' }),
  contractorId: uuid('contractor_id').notNull().references(() => contractors.id),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  scope: jsonb('scope').notNull(),
  estimatedCost: decimal('estimated_cost', { precision: 12, scale: 2 }).notNull(),
  actualCost: decimal('actual_cost', { precision: 12, scale: 2 }),
  startDate: timestamp('start_date'),
  completionDate: timestamp('completion_date'),
  status: workOrderStatusEnum('status').notNull().default('PENDING'),
  permitRequired: boolean('permit_required').notNull().default(false),
  permitNumber: varchar('permit_number', { length: 100 }),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  propertyIdx: index('work_orders_property_idx').on(table.propertyId),
  contractorIdx: index('work_orders_contractor_idx').on(table.contractorId),
  statusIdx: index('work_orders_status_idx').on(table.status),
}));

// ============================================================================
// PROGRESS UPDATES TABLE
// ============================================================================

export const progressUpdates = pgTable('progress_updates', {
  id: uuid('id').defaultRandom().primaryKey(),
  workOrderId: uuid('work_order_id').notNull().references(() => workOrders.id, { onDelete: 'cascade' }),
  date: timestamp('date').notNull().defaultNow(),
  percentComplete: integer('percent_complete').notNull(),
  description: text('description').notNull(),
  photosUrls: jsonb('photos_urls').notNull(),
  submittedBy: uuid('submitted_by').notNull().references(() => users.id),
  verified: boolean('verified').notNull().default(false),
  verifiedBy: uuid('verified_by').references(() => users.id),
  verifiedAt: timestamp('verified_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  workOrderIdx: index('progress_updates_work_order_idx').on(table.workOrderId),
}));

// ============================================================================
// PROPERTY VALUATIONS TABLE
// ============================================================================

export const propertyValuations = pgTable('property_valuations', {
  id: uuid('id').defaultRandom().primaryKey(),
  propertyId: uuid('property_id').notNull().references(() => properties.id, { onDelete: 'cascade' }),
  valuationType: varchar('valuation_type', { length: 50 }).notNull(),
  valuationDate: timestamp('valuation_date').notNull(),
  estimatedValue: decimal('estimated_value', { precision: 12, scale: 2 }).notNull(),
  valuationMethod: varchar('valuation_method', { length: 255 }).notNull(),
  valuedBy: uuid('valued_by').references(() => users.id),
  notes: text('notes'),
  documentUrl: text('document_url'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  propertyIdx: index('property_valuations_property_idx').on(table.propertyId),
  typeIdx: index('property_valuations_type_idx').on(table.valuationType),
}));

// ============================================================================
// EQUITY OUTCOMES TABLE
// ============================================================================

export const equityOutcomes = pgTable('equity_outcomes', {
  id: uuid('id').defaultRandom().primaryKey(),
  propertyId: uuid('property_id').notNull().references(() => properties.id, { onDelete: 'cascade' }),
  preDamageValue: decimal('pre_damage_value', { precision: 12, scale: 2 }).notNull(),
  postDamageValue: decimal('post_damage_value', { precision: 12, scale: 2 }).notNull(),
  postRestorationValue: decimal('post_restoration_value', { precision: 12, scale: 2 }).notNull(),
  totalClaimedAmount: decimal('total_claimed_amount', { precision: 12, scale: 2 }).notNull(),
  totalReceivedAmount: decimal('total_received_amount', { precision: 12, scale: 2 }).notNull(),
  totalRestorationCost: decimal('total_restoration_cost', { precision: 12, scale: 2 }).notNull(),
  netEquityGain: decimal('net_equity_gain', { precision: 12, scale: 2 }).notNull(),
  roi: decimal('roi', { precision: 5, scale: 2 }).notNull(),
  calculatedAt: timestamp('calculated_at').notNull().defaultNow(),
  reportUrl: text('report_url'),
}, (table) => ({
  propertyIdx: index('equity_outcomes_property_idx').on(table.propertyId),
}));

// ============================================================================
// ACTIVITY LOGS TABLE
// ============================================================================

export const activityLogs = pgTable('activity_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id),
  action: varchar('action', { length: 100 }).notNull(),
  entityType: varchar('entity_type', { length: 100 }).notNull(),
  entityId: uuid('entity_id').notNull(),
  description: text('description').notNull(),
  metadata: jsonb('metadata'),
  timestamp: timestamp('timestamp').notNull().defaultNow(),
}, (table) => ({
  userIdx: index('activity_logs_user_idx').on(table.userId),
  entityIdx: index('activity_logs_entity_idx').on(table.entityType, table.entityId),
  timestampIdx: index('activity_logs_timestamp_idx').on(table.timestamp),
}));

// ============================================================================
// ATOS GUIDANCE HISTORY TABLE
// ============================================================================

export const atosGuidance = pgTable('atos_guidance', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id),
  propertyId: uuid('property_id').references(() => properties.id),
  context: jsonb('context').notNull(),
  question: text('question'),
  guidance: text('guidance').notNull(),
  reasoning: text('reasoning').notNull(),
  suggestedActions: jsonb('suggested_actions'),
  risks: jsonb('risks'),
  opportunities: jsonb('opportunities'),
  timestamp: timestamp('timestamp').notNull().defaultNow(),
}, (table) => ({
  userIdx: index('atos_guidance_user_idx').on(table.userId),
  propertyIdx: index('atos_guidance_property_idx').on(table.propertyId),
  timestampIdx: index('atos_guidance_timestamp_idx').on(table.timestamp),
}));
