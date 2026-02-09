/**
 * Shared TypeScript Types
 * 
 * Central type definitions used throughout the application.
 */

import { users, properties, claims, inspections, contractors } from "@/lib/db/schema";

// ==========================================
// USER TYPES
// ==========================================

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type UserRole = "owner" | "contractor" | "adjuster" | "internal";

export interface AuthenticatedUser extends User {
  sessionToken?: string;
}

// ==========================================
// PROPERTY TYPES
// ==========================================

export type Property = typeof properties.$inferSelect;
export type NewProperty = typeof properties.$inferInsert;
export type PropertyStatus = 
  | "intake" 
  | "inspection" 
  | "documentation" 
  | "claim_filed" 
  | "under_review" 
  | "approved" 
  | "work_in_progress" 
  | "completed" 
  | "closed";

export interface PropertyWithDetails extends Property {
  owner: User;
  claims: Claim[];
  inspections: Inspection[];
  damageCount: number;
  documentCount: number;
}

// ==========================================
// CLAIM TYPES
// ==========================================

export type Claim = typeof claims.$inferSelect;
export type NewClaim = typeof claims.$inferInsert;
export type ClaimStatus = 
  | "draft" 
  | "submitted" 
  | "under_review" 
  | "pending_info" 
  | "approved" 
  | "partially_approved" 
  | "denied" 
  | "settled";

export interface ClaimWithProperty extends Claim {
  property: Property;
  adjuster?: User;
  scopeCount: number;
  interactionCount: number;
}

// ==========================================
// INSPECTION TYPES
// ==========================================

export type Inspection = typeof inspections.$inferSelect;
export type NewInspection = typeof inspections.$inferInsert;

// ==========================================
// CONTRACTOR TYPES
// ==========================================

export type Contractor = typeof contractors.$inferSelect;
export type NewContractor = typeof contractors.$inferInsert;
export type ContractorStatus = "pending" | "verified" | "active" | "suspended" | "inactive";

// ==========================================
// DAMAGE TYPES
// ==========================================

export type DamageType = "structural" | "water" | "fire" | "wind" | "hail" | "electrical" | "hvac" | "roofing" | "other";
export type DamageSeverity = "minor" | "moderate" | "major" | "severe" | "catastrophic";

export interface DamageAssessmentSummary {
  type: DamageType;
  severity: DamageSeverity;
  count: number;
  totalEstimatedCost: number;
}

// ==========================================
// DOCUMENT TYPES
// ==========================================

export type DocumentType = "photo" | "video" | "pdf" | "inspection_report" | "estimate" | "invoice" | "correspondence" | "other";

export interface DocumentUpload {
  file: File;
  type: DocumentType;
  description?: string;
  tags?: string[];
}

// ==========================================
// ATOS TYPES
// ==========================================

export interface ATOSInsight {
  id: string;
  type: "risk" | "opportunity" | "recommendation" | "alert";
  title: string;
  description: string;
  priority: number;
  reasoning?: string;
  actionable: boolean;
  createdAt: Date;
}

export interface ATOSMessage {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

// ==========================================
// DASHBOARD TYPES
// ==========================================

export interface DashboardStats {
  totalProperties: number;
  activeProperties: number;
  totalClaims: number;
  pendingClaims: number;
  totalDamageValue: number;
  totalApprovedAmount: number;
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  action: string;
  description: string;
  user: User;
  timestamp: Date;
  entityType?: string;
  entityId?: string;
}

// ==========================================
// SCOPE COMPARISON TYPES
// ==========================================

export interface ScopeLineItem {
  item: string;
  description?: string;
  quantity: number;
  unit: string;
  unitCost: number;
  totalCost: number;
}

export interface ScopeComparison {
  initial: ScopeLineItem[];
  adjuster: ScopeLineItem[];
  contractor: ScopeLineItem[];
  discrepancies: ScopeDiscrepancy[];
}

export interface ScopeDiscrepancy {
  item: string;
  type: "missing" | "different_quantity" | "different_cost";
  description: string;
  impactAmount: number;
}

// ==========================================
// EQUITY OUTCOME TYPES
// ==========================================

export interface EquityOutcome {
  propertyId: string;
  preStormValue: number;
  postRestorationValue: number;
  totalClaimPayout: number;
  totalRestorationCost: number;
  netEquityGain: number;
  gainPercentage: number;
  narrative: string;
}

// ==========================================
// API RESPONSE TYPES
// ==========================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
}
