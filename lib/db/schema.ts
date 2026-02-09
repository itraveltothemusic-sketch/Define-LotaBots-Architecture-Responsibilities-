/**
 * Database Schema for Equity Builders Platform
 * 
 * This schema represents the complete data model for forensic property intelligence,
 * insurance tracking, contractor execution, and equity outcome validation.
 * 
 * Design Principles:
 * - Comprehensive audit trails for all critical entities
 * - Role-based access control at the database level
 * - Optimized for timeline and history queries
 * - Support for document chains and evidence verification
 */

import { pgTable, text, timestamp, uuid, varchar, decimal, integer, jsonb, boolean, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ==================== ENUMS ====================

export const userRoleEnum = pgEnum('user_role', ['owner', 'contractor', 'adjuster', 'internal']);
export const propertyStatusEnum = pgEnum('property_status', ['pending', 'inspecting', 'documented', 'claim_submitted', 'in_negotiation', 'approved', 'in_repair', 'completed', 'closed']);
export const damageTypeEnum = pgEnum('damage_type', ['roof', 'structural', 'water', 'electrical', 'hvac', 'interior', 'exterior', 'foundation', 'other']);
export const damageSeverityEnum = pgEnum('damage_severity', ['minor', 'moderate', 'major', 'critical']);
export const claimStatusEnum = pgEnum('claim_status', ['draft', 'submitted', 'under_review', 'approved', 'denied', 'appealed', 'settled']);
export const contractorStatusEnum = pgEnum('contractor_status', ['pending', 'approved', 'active', 'suspended', 'inactive']);
export const taskStatusEnum = pgEnum('task_status', ['pending', 'in_progress', 'completed', 'blocked', 'cancelled']);
export const documentTypeEnum = pgEnum('document_type', ['photo', 'video', 'pdf', 'report', 'invoice', 'estimate', 'contract', 'correspondence', 'other']);

// ==================== USERS & AUTH ====================

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  role: userRoleEnum('role').notNull().default('owner'),
  passwordHash: text('password_hash'),
  phone: varchar('phone', { length: 50 }),
  avatar: text('avatar'),
  companyName: varchar('company_name', { length: 255 }),
  licenseNumber: varchar('license_number', { length: 100 }), // For contractors
  isActive: boolean('is_active').notNull().default(true),
  emailVerified: timestamp('email_verified'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const sessions = pgTable('sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  token: text('token').notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// ==================== PROPERTIES ====================

export const properties = pgTable('properties', {
  id: uuid('id').primaryKey().defaultRandom(),
  ownerId: uuid('owner_id').notNull().references(() => users.id),
  
  // Property Details
  address: text('address').notNull(),
  city: varchar('city', { length: 100 }).notNull(),
  state: varchar('state', { length: 50 }).notNull(),
  zipCode: varchar('zip_code', { length: 20 }).notNull(),
  latitude: decimal('latitude', { precision: 10, scale: 7 }),
  longitude: decimal('longitude', { precision: 10, scale: 7 }),
  
  // Property Characteristics
  propertyType: varchar('property_type', { length: 50 }).notNull(), // commercial, retail, office, industrial
  squareFootage: integer('square_footage'),
  yearBuilt: integer('year_built'),
  
  // Damage & Status
  stormDate: timestamp('storm_date'),
  stormType: varchar('storm_type', { length: 100 }), // hurricane, tornado, hail, flood
  status: propertyStatusEnum('status').notNull().default('pending'),
  
  // Valuation
  preDamageValue: decimal('pre_damage_value', { precision: 12, scale: 2 }),
  currentValue: decimal('current_value', { precision: 12, scale: 2 }),
  
  // Metadata
  metadata: jsonb('metadata'), // Flexible field for custom property data
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ==================== INSPECTIONS ====================

export const inspections = pgTable('inspections', {
  id: uuid('id').primaryKey().defaultRandom(),
  propertyId: uuid('property_id').notNull().references(() => properties.id, { onDelete: 'cascade' }),
  inspectorId: uuid('inspector_id').notNull().references(() => users.id),
  
  // Inspection Details
  scheduledAt: timestamp('scheduled_at'),
  completedAt: timestamp('completed_at'),
  duration: integer('duration_minutes'),
  
  // Findings
  summary: text('summary'),
  findings: jsonb('findings'), // Structured findings data
  recommendedActions: jsonb('recommended_actions'),
  
  // Quality & Verification
  isVerified: boolean('is_verified').notNull().default(false),
  verifiedBy: uuid('verified_by').references(() => users.id),
  verifiedAt: timestamp('verified_at'),
  
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const damageAssessments = pgTable('damage_assessments', {
  id: uuid('id').primaryKey().defaultRandom(),
  inspectionId: uuid('inspection_id').notNull().references(() => inspections.id, { onDelete: 'cascade' }),
  propertyId: uuid('property_id').notNull().references(() => properties.id, { onDelete: 'cascade' }),
  
  // Damage Classification
  damageType: damageTypeEnum('damage_type').notNull(),
  severity: damageSeverityEnum('severity').notNull(),
  location: text('location').notNull(), // Specific location within property
  description: text('description').notNull(),
  
  // Costing
  estimatedRepairCost: decimal('estimated_repair_cost', { precision: 10, scale: 2 }),
  
  // Evidence
  photoUrls: jsonb('photo_urls'), // Array of photo URLs
  videoUrls: jsonb('video_urls'), // Array of video URLs
  
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ==================== DOCUMENTS ====================

export const documents = pgTable('documents', {
  id: uuid('id').primaryKey().defaultRandom(),
  propertyId: uuid('property_id').notNull().references(() => properties.id, { onDelete: 'cascade' }),
  uploadedBy: uuid('uploaded_by').notNull().references(() => users.id),
  
  // Document Details
  fileName: varchar('file_name', { length: 255 }).notNull(),
  fileUrl: text('file_url').notNull(),
  fileSize: integer('file_size'), // bytes
  mimeType: varchar('mime_type', { length: 100 }),
  documentType: documentTypeEnum('document_type').notNull(),
  
  // Context
  title: varchar('title', { length: 255 }),
  description: text('description'),
  tags: jsonb('tags'), // Array of tags for searchability
  
  // Verification
  isVerified: boolean('is_verified').notNull().default(false),
  verifiedBy: uuid('verified_by').references(() => users.id),
  
  // Metadata
  metadata: jsonb('metadata'), // EXIF data, geolocation, timestamps, etc.
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ==================== INSURANCE CLAIMS ====================

export const insuranceClaims = pgTable('insurance_claims', {
  id: uuid('id').primaryKey().defaultRandom(),
  propertyId: uuid('property_id').notNull().references(() => properties.id, { onDelete: 'cascade' }),
  
  // Claim Details
  claimNumber: varchar('claim_number', { length: 100 }).unique(),
  carrierName: varchar('carrier_name', { length: 255 }).notNull(),
  policyNumber: varchar('policy_number', { length: 100 }),
  status: claimStatusEnum('status').notNull().default('draft'),
  
  // Dates
  filedAt: timestamp('filed_at'),
  responseDeadline: timestamp('response_deadline'),
  closedAt: timestamp('closed_at'),
  
  // Financials
  claimedAmount: decimal('claimed_amount', { precision: 12, scale: 2 }),
  approvedAmount: decimal('approved_amount', { precision: 12, scale: 2 }),
  paidAmount: decimal('paid_amount', { precision: 12, scale: 2 }),
  deductible: decimal('deductible', { precision: 10, scale: 2 }),
  
  // Assignment
  adjusterId: uuid('adjuster_id').references(() => users.id),
  internalOwnerId: uuid('internal_owner_id').references(() => users.id),
  
  // Notes & Context
  notes: text('notes'),
  metadata: jsonb('metadata'),
  
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const claimInteractions = pgTable('claim_interactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  claimId: uuid('claim_id').notNull().references(() => insuranceClaims.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => users.id),
  
  // Interaction Details
  interactionType: varchar('interaction_type', { length: 50 }).notNull(), // call, email, meeting, document_submission
  summary: text('summary').notNull(),
  outcome: text('outcome'),
  
  // Participants
  participants: jsonb('participants'), // Array of participant details
  
  // Documents
  attachmentIds: jsonb('attachment_ids'), // References to documents table
  
  occurredAt: timestamp('occurred_at').notNull().defaultNow(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const scopeComparisons = pgTable('scope_comparisons', {
  id: uuid('id').primaryKey().defaultRandom(),
  claimId: uuid('claim_id').notNull().references(() => insuranceClaims.id, { onDelete: 'cascade' }),
  
  // Comparison Data
  ourScope: jsonb('our_scope').notNull(), // Our assessment
  adjusterScope: jsonb('adjuster_scope').notNull(), // Insurance adjuster's assessment
  discrepancies: jsonb('discrepancies').notNull(), // Detailed differences
  
  // Analysis
  totalDifference: decimal('total_difference', { precision: 10, scale: 2 }),
  analysisNotes: text('analysis_notes'),
  
  // Resolution
  isResolved: boolean('is_resolved').notNull().default(false),
  resolution: text('resolution'),
  resolvedAt: timestamp('resolved_at'),
  
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ==================== CONTRACTORS ====================

export const contractors = pgTable('contractors', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  
  // Business Details
  companyName: varchar('company_name', { length: 255 }).notNull(),
  licenseNumber: varchar('license_number', { length: 100 }).notNull(),
  insurancePolicy: varchar('insurance_policy', { length: 100 }),
  bondInformation: text('bond_information'),
  
  // Specializations
  specializations: jsonb('specializations'), // Array of specialization types
  serviceAreas: jsonb('service_areas'), // Array of service locations
  
  // Ratings & Verification
  rating: decimal('rating', { precision: 3, scale: 2 }),
  totalJobs: integer('total_jobs').notNull().default(0),
  completedJobs: integer('completed_jobs').notNull().default(0),
  status: contractorStatusEnum('status').notNull().default('pending'),
  
  // Verification
  isVerified: boolean('is_verified').notNull().default(false),
  verifiedAt: timestamp('verified_at'),
  
  // Metadata
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const workOrders = pgTable('work_orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  propertyId: uuid('property_id').notNull().references(() => properties.id, { onDelete: 'cascade' }),
  contractorId: uuid('contractor_id').notNull().references(() => contractors.id),
  claimId: uuid('claim_id').references(() => insuranceClaims.id),
  
  // Work Details
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  scope: jsonb('scope').notNull(), // Detailed scope of work
  
  // Schedule
  scheduledStartDate: timestamp('scheduled_start_date'),
  scheduledEndDate: timestamp('scheduled_end_date'),
  actualStartDate: timestamp('actual_start_date'),
  actualEndDate: timestamp('actual_end_date'),
  
  // Financials
  estimatedCost: decimal('estimated_cost', { precision: 10, scale: 2 }),
  actualCost: decimal('actual_cost', { precision: 10, scale: 2 }),
  
  // Status
  status: taskStatusEnum('status').notNull().default('pending'),
  completionPercentage: integer('completion_percentage').notNull().default(0),
  
  // Verification
  isApproved: boolean('is_approved').notNull().default(false),
  approvedBy: uuid('approved_by').references(() => users.id),
  approvedAt: timestamp('approved_at'),
  
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const workOrderUpdates = pgTable('work_order_updates', {
  id: uuid('id').primaryKey().defaultRandom(),
  workOrderId: uuid('work_order_id').notNull().references(() => workOrders.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => users.id),
  
  // Update Details
  updateType: varchar('update_type', { length: 50 }).notNull(), // progress, issue, completion, photo
  description: text('description').notNull(),
  completionPercentage: integer('completion_percentage'),
  
  // Evidence
  photoUrls: jsonb('photo_urls'),
  documentIds: jsonb('document_ids'),
  
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// ==================== EQUITY OUTCOMES ====================

export const equityReports = pgTable('equity_reports', {
  id: uuid('id').primaryKey().defaultRandom(),
  propertyId: uuid('property_id').notNull().references(() => properties.id, { onDelete: 'cascade' }),
  
  // Valuation Data
  preDamageValue: decimal('pre_damage_value', { precision: 12, scale: 2 }).notNull(),
  postDamageValue: decimal('post_damage_value', { precision: 12, scale: 2 }).notNull(),
  postRepairValue: decimal('post_repair_value', { precision: 12, scale: 2 }).notNull(),
  
  // Financial Summary
  totalDamageCost: decimal('total_damage_cost', { precision: 12, scale: 2 }).notNull(),
  totalClaimPayout: decimal('total_claim_payout', { precision: 12, scale: 2 }).notNull(),
  totalRepairCost: decimal('total_repair_cost', { precision: 12, scale: 2 }).notNull(),
  equityGain: decimal('equity_gain', { precision: 12, scale: 2 }).notNull(),
  
  // Analysis
  narrative: text('narrative'), // Detailed explanation of equity outcome
  recommendations: jsonb('recommendations'),
  
  // Report Metadata
  generatedBy: uuid('generated_by').notNull().references(() => users.id),
  reportUrl: text('report_url'), // Link to PDF report
  
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ==================== ATOS INTELLIGENCE ====================

export const atosInsights = pgTable('atos_insights', {
  id: uuid('id').primaryKey().defaultRandom(),
  propertyId: uuid('property_id').references(() => properties.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').references(() => users.id),
  
  // Context
  contextType: varchar('context_type', { length: 50 }).notNull(), // property, claim, contractor, document
  contextId: uuid('context_id'), // ID of the related entity
  
  // Insight Details
  insightType: varchar('insight_type', { length: 50 }).notNull(), // risk, opportunity, gap, recommendation
  priority: varchar('priority', { length: 20 }).notNull(), // low, medium, high, critical
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  
  // Actions
  suggestedActions: jsonb('suggested_actions'),
  
  // Status
  isResolved: boolean('is_resolved').notNull().default(false),
  resolvedAt: timestamp('resolved_at'),
  
  // Metadata
  confidence: decimal('confidence', { precision: 3, scale: 2 }), // AI confidence score
  metadata: jsonb('metadata'),
  
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const atosConversations = pgTable('atos_conversations', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  propertyId: uuid('property_id').references(() => properties.id),
  
  // Conversation Context
  contextType: varchar('context_type', { length: 50 }), // general, property, claim, contractor
  contextId: uuid('context_id'),
  
  // Messages stored as array
  messages: jsonb('messages').notNull(), // Array of {role, content, timestamp}
  
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ==================== ACTIVITY LOG ====================

export const activityLog = pgTable('activity_log', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  propertyId: uuid('property_id').references(() => properties.id),
  
  // Activity Details
  actionType: varchar('action_type', { length: 100 }).notNull(),
  entityType: varchar('entity_type', { length: 50 }).notNull(), // property, claim, document, etc.
  entityId: uuid('entity_id'),
  
  // Description
  description: text('description').notNull(),
  metadata: jsonb('metadata'),
  
  // IP & User Agent for security
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: text('user_agent'),
  
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// ==================== RELATIONS ====================

export const usersRelations = relations(users, ({ many }) => ({
  properties: many(properties),
  sessions: many(sessions),
  documents: many(documents),
}));

export const propertiesRelations = relations(properties, ({ one, many }) => ({
  owner: one(users, {
    fields: [properties.ownerId],
    references: [users.id],
  }),
  inspections: many(inspections),
  documents: many(documents),
  claims: many(insuranceClaims),
  workOrders: many(workOrders),
  equityReports: many(equityReports),
}));

export const inspectionsRelations = relations(inspections, ({ one, many }) => ({
  property: one(properties, {
    fields: [inspections.propertyId],
    references: [properties.id],
  }),
  inspector: one(users, {
    fields: [inspections.inspectorId],
    references: [users.id],
  }),
  damageAssessments: many(damageAssessments),
}));

export const insuranceClaimsRelations = relations(insuranceClaims, ({ one, many }) => ({
  property: one(properties, {
    fields: [insuranceClaims.propertyId],
    references: [properties.id],
  }),
  interactions: many(claimInteractions),
  scopeComparisons: many(scopeComparisons),
}));

export const contractorsRelations = relations(contractors, ({ one, many }) => ({
  user: one(users, {
    fields: [contractors.userId],
    references: [users.id],
  }),
  workOrders: many(workOrders),
}));

export const workOrdersRelations = relations(workOrders, ({ one, many }) => ({
  property: one(properties, {
    fields: [workOrders.propertyId],
    references: [properties.id],
  }),
  contractor: one(contractors, {
    fields: [workOrders.contractorId],
    references: [contractors.id],
  }),
  updates: many(workOrderUpdates),
}));
