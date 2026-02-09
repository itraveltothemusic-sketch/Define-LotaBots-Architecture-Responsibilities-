/**
 * Equity Builders — Core Type Definitions
 * 
 * These types represent the domain model for the forensic property
 * intelligence platform. Every type is designed to be:
 * - Self-documenting (field names convey meaning)
 * - Strict (no implicit any, no loose unions)
 * - Extensible (ready for API serialization)
 */

// ─── Auth & Users ──────────────────────────────────────────

export type UserRole = "owner" | "contractor" | "adjuster" | "internal";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  organization?: string;
  createdAt: string;
  lastLoginAt?: string;
}

export interface AuthSession {
  user: User;
  token: string;
  expiresAt: string;
}

// ─── Properties ────────────────────────────────────────────

export type PropertyStatus =
  | "intake"          // Initial data gathering
  | "inspection"      // Forensic inspection in progress
  | "assessment"      // Damage assessment and classification
  | "claim_filed"     // Insurance claim submitted
  | "negotiation"     // Carrier negotiation phase
  | "approved"        // Claim approved
  | "in_repair"       // Contractor executing repairs
  | "completed"       // All work finished
  | "equity_verified"; // Final equity gain calculated

export type DamageClassification =
  | "wind"
  | "hail"
  | "water"
  | "structural"
  | "roof"
  | "facade"
  | "interior"
  | "electrical"
  | "plumbing"
  | "hvac"
  | "other";

export interface Property {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  propertyType: "commercial" | "industrial" | "mixed-use" | "retail" | "office";
  status: PropertyStatus;
  ownerId: string;
  squareFootage: number;
  yearBuilt: number;
  estimatedValue: number;
  stormDate?: string;
  stormType?: string;
  createdAt: string;
  updatedAt: string;
  imageUrl?: string;
}

// ─── Inspections ───────────────────────────────────────────

export interface Inspection {
  id: string;
  propertyId: string;
  inspectorName: string;
  inspectionDate: string;
  findings: string;
  damageClassifications: DamageClassification[];
  severity: "minor" | "moderate" | "severe" | "catastrophic";
  estimatedRepairCost: number;
  photoCount: number;
  documentCount: number;
  status: "scheduled" | "in_progress" | "completed" | "reviewed";
  createdAt: string;
}

// ─── Evidence & Documentation ──────────────────────────────

export type EvidenceType = "photo" | "video" | "document" | "report" | "invoice" | "correspondence";

export interface Evidence {
  id: string;
  propertyId: string;
  type: EvidenceType;
  title: string;
  description?: string;
  fileUrl: string;
  thumbnailUrl?: string;
  uploadedBy: string;
  uploadedAt: string;
  tags: string[];
  metadata?: Record<string, string>;
}

// ─── Insurance Claims ──────────────────────────────────────

export type ClaimStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "additional_info_requested"
  | "approved"
  | "partially_approved"
  | "denied"
  | "appealed"
  | "settled";

export interface InsuranceClaim {
  id: string;
  propertyId: string;
  claimNumber: string;
  carrier: string;
  policyNumber: string;
  filedDate: string;
  status: ClaimStatus;
  claimedAmount: number;
  approvedAmount?: number;
  deductible: number;
  adjusterName?: string;
  adjusterEmail?: string;
  adjusterPhone?: string;
  lastContactDate?: string;
  nextActionDate?: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface CarrierInteraction {
  id: string;
  claimId: string;
  date: string;
  type: "call" | "email" | "letter" | "meeting" | "site_visit";
  summary: string;
  participants: string[];
  outcome?: string;
  followUpRequired: boolean;
  followUpDate?: string;
  documentIds: string[];
}

// ─── Scope & Discrepancies ─────────────────────────────────

export interface ScopeItem {
  id: string;
  claimId: string;
  category: string;
  description: string;
  ownerEstimate: number;
  carrierEstimate?: number;
  approvedAmount?: number;
  discrepancy?: number;
  notes?: string;
}

// ─── Contractors ───────────────────────────────────────────

export type ContractorStatus = "pending" | "approved" | "active" | "suspended" | "completed";

export interface Contractor {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  licenseNumber: string;
  insuranceVerified: boolean;
  specializations: string[];
  rating: number;
  completedJobs: number;
  status: ContractorStatus;
  createdAt: string;
}

export interface ScopeAssignment {
  id: string;
  propertyId: string;
  contractorId: string;
  description: string;
  estimatedCost: number;
  actualCost?: number;
  startDate: string;
  expectedEndDate: string;
  actualEndDate?: string;
  status: "assigned" | "in_progress" | "inspection_needed" | "completed" | "disputed";
  complianceChecks: ComplianceCheck[];
  progressPercentage: number;
}

export interface ComplianceCheck {
  id: string;
  name: string;
  description: string;
  passed: boolean;
  checkedAt?: string;
  checkedBy?: string;
  notes?: string;
}

// ─── Equity Outcomes ───────────────────────────────────────

export interface EquityOutcome {
  id: string;
  propertyId: string;
  preStormValue: number;
  postRepairValue: number;
  totalClaimAmount: number;
  totalPayoutReceived: number;
  totalRepairCost: number;
  netEquityGain: number;
  equityGainPercentage: number;
  narrative: string;
  verifiedAt?: string;
  verifiedBy?: string;
  createdAt: string;
}

// ─── ATOS Intelligence ─────────────────────────────────────

export type AtosMessageRole = "user" | "assistant" | "system";
export type AtosContext = "general" | "property" | "insurance" | "contractor" | "equity";

export interface AtosMessage {
  id: string;
  role: AtosMessageRole;
  content: string;
  context: AtosContext;
  contextId?: string;      // ID of the entity being discussed
  timestamp: string;
  metadata?: {
    confidence?: number;    // 0-1 confidence in the guidance
    sources?: string[];     // References to evidence/data
    actionItems?: string[]; // Suggested next steps
    riskFlags?: string[];   // Identified risks
  };
}

export interface AtosInsight {
  id: string;
  propertyId?: string;
  category: "risk" | "opportunity" | "gap" | "recommendation" | "milestone";
  title: string;
  description: string;
  severity: "info" | "low" | "medium" | "high" | "critical";
  actionRequired: boolean;
  suggestedAction?: string;
  createdAt: string;
  acknowledged: boolean;
}

// ─── Dashboard & Analytics ─────────────────────────────────

export interface DashboardStats {
  totalProperties: number;
  activeInspections: number;
  pendingClaims: number;
  totalEquityGained: number;
  averageClaimCycle: number;      // days
  claimApprovalRate: number;      // percentage
  activeContractors: number;
  propertiesInRepair: number;
}

// ─── Timeline Events ───────────────────────────────────────

export interface TimelineEvent {
  id: string;
  propertyId: string;
  timestamp: string;
  type: "inspection" | "claim" | "evidence" | "contractor" | "milestone" | "atos_insight";
  title: string;
  description: string;
  userId?: string;
  relatedEntityId?: string;
  metadata?: Record<string, string>;
}
