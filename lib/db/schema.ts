/**
 * Database Schema for Equity Builders
 * 
 * This schema defines the complete data model for the platform.
 * Built with Drizzle ORM for type-safe database operations.
 */

import { pgTable, text, timestamp, uuid, integer, decimal, jsonb, pgEnum, boolean, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ==========================================
// ENUMS
// ==========================================

export const userRoleEnum = pgEnum("user_role", ["owner", "contractor", "adjuster", "internal"]);
export const propertyStatusEnum = pgEnum("property_status", ["intake", "inspection", "documentation", "claim_filed", "under_review", "approved", "work_in_progress", "completed", "closed"]);
export const claimStatusEnum = pgEnum("claim_status", ["draft", "submitted", "under_review", "pending_info", "approved", "partially_approved", "denied", "settled"]);
export const damageTypeEnum = pgEnum("damage_type", ["structural", "water", "fire", "wind", "hail", "electrical", "hvac", "roofing", "other"]);
export const damageSeverityEnum = pgEnum("damage_severity", ["minor", "moderate", "major", "severe", "catastrophic"]);
export const documentTypeEnum = pgEnum("document_type", ["photo", "video", "pdf", "inspection_report", "estimate", "invoice", "correspondence", "other"]);
export const contractorStatusEnum = pgEnum("contractor_status", ["pending", "verified", "active", "suspended", "inactive"]);

// ==========================================
// USERS & AUTHENTICATION
// ==========================================

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull(),
  role: userRoleEnum("role").notNull().default("owner"),
  phone: varchar("phone", { length: 20 }),
  company: text("company"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const sessions = pgTable("sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ==========================================
// PROPERTIES
// ==========================================

export const properties = pgTable("properties", {
  id: uuid("id").defaultRandom().primaryKey(),
  ownerId: uuid("owner_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: varchar("state", { length: 2 }).notNull(),
  zipCode: varchar("zip_code", { length: 10 }).notNull(),
  propertyType: text("property_type").notNull(), // "office", "retail", "warehouse", etc.
  squareFeet: integer("square_feet"),
  yearBuilt: integer("year_built"),
  status: propertyStatusEnum("status").notNull().default("intake"),
  stormDate: timestamp("storm_date"),
  stormType: text("storm_type"), // "hurricane", "tornado", "hail", etc.
  preStormValue: decimal("pre_storm_value", { precision: 12, scale: 2 }),
  estimatedDamageValue: decimal("estimated_damage_value", { precision: 12, scale: 2 }),
  metadata: jsonb("metadata"), // Additional flexible data
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ==========================================
// INSPECTIONS
// ==========================================

export const inspections = pgTable("inspections", {
  id: uuid("id").defaultRandom().primaryKey(),
  propertyId: uuid("property_id").notNull().references(() => properties.id, { onDelete: "cascade" }),
  inspectorId: uuid("inspector_id").notNull().references(() => users.id),
  scheduledDate: timestamp("scheduled_date").notNull(),
  completedDate: timestamp("completed_date"),
  type: text("type").notNull(), // "initial", "follow-up", "final", etc.
  summary: text("summary"),
  findings: jsonb("findings"), // Structured findings data
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ==========================================
// DAMAGE ASSESSMENTS
// ==========================================

export const damageAssessments = pgTable("damage_assessments", {
  id: uuid("id").defaultRandom().primaryKey(),
  propertyId: uuid("property_id").notNull().references(() => properties.id, { onDelete: "cascade" }),
  inspectionId: uuid("inspection_id").references(() => inspections.id),
  damageType: damageTypeEnum("damage_type").notNull(),
  severity: damageSeverityEnum("severity").notNull(),
  location: text("location").notNull(), // Specific area/room
  description: text("description").notNull(),
  estimatedCost: decimal("estimated_cost", { precision: 10, scale: 2 }),
  repairPriority: integer("repair_priority"), // 1 = highest
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ==========================================
// DOCUMENTS & EVIDENCE
// ==========================================

export const documents = pgTable("documents", {
  id: uuid("id").defaultRandom().primaryKey(),
  propertyId: uuid("property_id").notNull().references(() => properties.id, { onDelete: "cascade" }),
  uploadedBy: uuid("uploaded_by").notNull().references(() => users.id),
  type: documentTypeEnum("type").notNull(),
  fileName: text("file_name").notNull(),
  fileUrl: text("file_url").notNull(),
  fileSize: integer("file_size"), // bytes
  mimeType: text("mime_type"),
  description: text("description"),
  tags: jsonb("tags"), // Array of tags for categorization
  metadata: jsonb("metadata"), // EXIF, AI analysis results, etc.
  linkedToInspectionId: uuid("linked_to_inspection_id").references(() => inspections.id),
  linkedToClaimId: uuid("linked_to_claim_id").references(() => claims.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ==========================================
// INSURANCE CLAIMS
// ==========================================

export const claims = pgTable("claims", {
  id: uuid("id").defaultRandom().primaryKey(),
  propertyId: uuid("property_id").notNull().references(() => properties.id, { onDelete: "cascade" }),
  claimNumber: varchar("claim_number", { length: 100 }).notNull().unique(),
  carrierName: text("carrier_name").notNull(),
  policyNumber: varchar("policy_number", { length: 100 }).notNull(),
  adjusterId: uuid("adjuster_id").references(() => users.id),
  status: claimStatusEnum("status").notNull().default("draft"),
  filedDate: timestamp("filed_date"),
  initialClaimAmount: decimal("initial_claim_amount", { precision: 12, scale: 2 }),
  approvedAmount: decimal("approved_amount", { precision: 12, scale: 2 }),
  paidAmount: decimal("paid_amount", { precision: 12, scale: 2 }),
  deductible: decimal("deductible", { precision: 10, scale: 2 }),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const claimInteractions = pgTable("claim_interactions", {
  id: uuid("id").defaultRandom().primaryKey(),
  claimId: uuid("claim_id").notNull().references(() => claims.id, { onDelete: "cascade" }),
  userId: uuid("user_id").notNull().references(() => users.id),
  interactionType: text("interaction_type").notNull(), // "call", "email", "meeting", "submission"
  summary: text("summary").notNull(),
  details: text("details"),
  interactionDate: timestamp("interaction_date").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ==========================================
// SCOPES (for comparison)
// ==========================================

export const scopes = pgTable("scopes", {
  id: uuid("id").defaultRandom().primaryKey(),
  claimId: uuid("claim_id").notNull().references(() => claims.id, { onDelete: "cascade" }),
  version: integer("version").notNull(), // 1, 2, 3... for tracking revisions
  scopeType: text("scope_type").notNull(), // "initial", "adjuster", "contractor", "final"
  lineItems: jsonb("line_items").notNull(), // Array of { item, qty, unit, unitCost, totalCost }
  totalAmount: decimal("total_amount", { precision: 12, scale: 2 }).notNull(),
  submittedBy: uuid("submitted_by").notNull().references(() => users.id),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ==========================================
// CONTRACTORS
// ==========================================

export const contractors = pgTable("contractors", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  companyName: text("company_name").notNull(),
  licenseNumber: varchar("license_number", { length: 100 }),
  licenseState: varchar("license_state", { length: 2 }),
  insuranceCertificate: text("insurance_certificate_url"),
  specialties: jsonb("specialties"), // Array of specialties
  status: contractorStatusEnum("status").notNull().default("pending"),
  rating: decimal("rating", { precision: 3, scale: 2 }), // 0.00 to 5.00
  completedProjects: integer("completed_projects").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const workOrders = pgTable("work_orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  propertyId: uuid("property_id").notNull().references(() => properties.id, { onDelete: "cascade" }),
  contractorId: uuid("contractor_id").notNull().references(() => contractors.id),
  claimId: uuid("claim_id").references(() => claims.id),
  scopeId: uuid("scope_id").references(() => scopes.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  startDate: timestamp("start_date"),
  targetCompletionDate: timestamp("target_completion_date"),
  actualCompletionDate: timestamp("actual_completion_date"),
  status: text("status").notNull().default("assigned"), // assigned, in_progress, under_review, completed
  progressPercentage: integer("progress_percentage").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const milestones = pgTable("milestones", {
  id: uuid("id").defaultRandom().primaryKey(),
  workOrderId: uuid("work_order_id").notNull().references(() => workOrders.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  targetDate: timestamp("target_date"),
  completedDate: timestamp("completed_date"),
  isCompleted: boolean("is_completed").notNull().default(false),
  verifiedBy: uuid("verified_by").references(() => users.id),
  sortOrder: integer("sort_order").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ==========================================
// EQUITY OUTCOMES
// ==========================================

export const valuations = pgTable("valuations", {
  id: uuid("id").defaultRandom().primaryKey(),
  propertyId: uuid("property_id").notNull().references(() => properties.id, { onDelete: "cascade" }),
  valuationType: text("valuation_type").notNull(), // "pre_storm", "post_storm", "post_restoration"
  valuationAmount: decimal("valuation_amount", { precision: 12, scale: 2 }).notNull(),
  valuationDate: timestamp("valuation_date").notNull(),
  valuedBy: text("valued_by"), // Appraiser name/company
  methodology: text("methodology"),
  notes: text("notes"),
  reportUrl: text("report_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const equityReports = pgTable("equity_reports", {
  id: uuid("id").defaultRandom().primaryKey(),
  propertyId: uuid("property_id").notNull().references(() => properties.id, { onDelete: "cascade" }),
  claimId: uuid("claim_id").references(() => claims.id),
  reportDate: timestamp("report_date").notNull().defaultNow(),
  preStormValue: decimal("pre_storm_value", { precision: 12, scale: 2 }),
  postRestorationValue: decimal("post_restoration_value", { precision: 12, scale: 2 }),
  totalClaimPayout: decimal("total_claim_payout", { precision: 12, scale: 2 }),
  totalRestorationCost: decimal("total_restoration_cost", { precision: 12, scale: 2 }),
  netEquityGain: decimal("net_equity_gain", { precision: 12, scale: 2 }),
  narrative: text("narrative"), // Summary story of the equity gain
  generatedBy: uuid("generated_by").notNull().references(() => users.id),
  reportUrl: text("report_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ==========================================
// ATOS INTELLIGENCE
// ==========================================

export const atosInsights = pgTable("atos_insights", {
  id: uuid("id").defaultRandom().primaryKey(),
  propertyId: uuid("property_id").references(() => properties.id),
  claimId: uuid("claim_id").references(() => claims.id),
  insightType: text("insight_type").notNull(), // "risk", "opportunity", "recommendation", "alert"
  title: text("title").notNull(),
  description: text("description").notNull(),
  priority: integer("priority").notNull(), // 1 = highest
  reasoning: text("reasoning"), // Why ATOS surfaced this
  actionable: boolean("actionable").notNull().default(true),
  dismissed: boolean("dismissed").notNull().default(false),
  dismissedBy: uuid("dismissed_by").references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ==========================================
// ACTIVITY LOG
// ==========================================

export const activityLog = pgTable("activity_log", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id),
  propertyId: uuid("property_id").references(() => properties.id),
  claimId: uuid("claim_id").references(() => claims.id),
  action: text("action").notNull(), // "created_property", "uploaded_document", etc.
  entityType: text("entity_type"), // "property", "claim", "document", etc.
  entityId: uuid("entity_id"),
  description: text("description").notNull(),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ==========================================
// RELATIONS (for Drizzle ORM queries)
// ==========================================

export const usersRelations = relations(users, ({ many }) => ({
  properties: many(properties),
  inspections: many(inspections),
  documents: many(documents),
}));

export const propertiesRelations = relations(properties, ({ one, many }) => ({
  owner: one(users, {
    fields: [properties.ownerId],
    references: [users.id],
  }),
  inspections: many(inspections),
  damageAssessments: many(damageAssessments),
  documents: many(documents),
  claims: many(claims),
  valuations: many(valuations),
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
  documents: many(documents),
}));

export const claimsRelations = relations(claims, ({ one, many }) => ({
  property: one(properties, {
    fields: [claims.propertyId],
    references: [properties.id],
  }),
  adjuster: one(users, {
    fields: [claims.adjusterId],
    references: [users.id],
  }),
  interactions: many(claimInteractions),
  scopes: many(scopes),
  documents: many(documents),
}));
