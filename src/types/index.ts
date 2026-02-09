/**
 * Equity Builders — Core Type Definitions
 *
 * These types form the contract between all modules.
 * Every type is designed to be self-documenting and enforce
 * data integrity at the type level.
 */

// ─── Authentication & Authorization ─────────────────────────────────────────

export type UserRole = "owner" | "contractor" | "adjuster" | "internal";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  organizationId: string | null;
  avatarUrl: string | null;
  createdAt: Date;
  lastActiveAt: Date;
}

export interface Session {
  user: User;
  token: string;
  expiresAt: Date;
}

// ─── Property Module ────────────────────────────────────────────────────────

export type PropertyStatus =
  | "intake"
  | "inspection_scheduled"
  | "inspection_complete"
  | "documentation_review"
  | "claim_filed"
  | "claim_in_progress"
  | "restoration_active"
  | "restoration_complete"
  | "equity_realized";

export type DamageClassification =
  | "wind"
  | "hail"
  | "water"
  | "fire"
  | "structural"
  | "roof"
  | "siding"
  | "interior"
  | "landscaping"
  | "other";

export interface Property {
  id: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  propertyType: "commercial" | "residential" | "industrial" | "mixed_use";
  squareFootage: number | null;
  yearBuilt: number | null;
  ownerId: string;
  status: PropertyStatus;
  /** Pre-damage estimated value */
  preEventValue: number | null;
  /** Post-restoration estimated value */
  postRestorationValue: number | null;
  stormEventDate: Date | null;
  stormEventType: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Inspection & Evidence ──────────────────────────────────────────────────

export type EvidenceType = "photo" | "video" | "document" | "report" | "invoice" | "estimate";

export interface Evidence {
  id: string;
  propertyId: string;
  type: EvidenceType;
  title: string;
  description: string | null;
  fileUrl: string;
  thumbnailUrl: string | null;
  /** Who captured or uploaded this evidence */
  uploadedById: string;
  /** AI-generated tags for searchability */
  tags: string[];
  /** Damage classifications detected in this evidence */
  damageClassifications: DamageClassification[];
  capturedAt: Date;
  uploadedAt: Date;
  metadata: Record<string, unknown>;
}

export interface Inspection {
  id: string;
  propertyId: string;
  inspectorId: string;
  scheduledAt: Date;
  completedAt: Date | null;
  status: "scheduled" | "in_progress" | "completed" | "cancelled";
  findings: string | null;
  /** Structured damage assessment */
  damageAreas: DamageArea[];
  evidenceIds: string[];
  createdAt: Date;
}

export interface DamageArea {
  id: string;
  location: string;
  classification: DamageClassification;
  severity: "minor" | "moderate" | "severe" | "critical";
  description: string;
  estimatedRepairCost: number | null;
  evidenceIds: string[];
}

// ─── Insurance Module ───────────────────────────────────────────────────────

export type ClaimStatus =
  | "draft"
  | "filed"
  | "acknowledged"
  | "under_review"
  | "additional_info_requested"
  | "approved"
  | "partially_approved"
  | "denied"
  | "appealed"
  | "settled"
  | "closed";

export interface InsuranceClaim {
  id: string;
  propertyId: string;
  claimNumber: string | null;
  carrierId: string;
  carrierName: string;
  policyNumber: string;
  dateOfLoss: Date;
  dateFiled: Date | null;
  status: ClaimStatus;
  /** Amount claimed based on forensic assessment */
  claimedAmount: number | null;
  /** Amount the carrier approved */
  approvedAmount: number | null;
  /** Final settlement amount */
  settledAmount: number | null;
  /** Discrepancy between claimed and approved — key metric */
  discrepancyAmount: number | null;
  adjusterAssignedId: string | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CarrierInteraction {
  id: string;
  claimId: string;
  type: "call" | "email" | "letter" | "meeting" | "inspection" | "document_request" | "payment";
  date: Date;
  summary: string;
  /** Who initiated: 'us' or 'carrier' */
  initiatedBy: "internal" | "carrier";
  contactName: string | null;
  contactRole: string | null;
  outcome: string | null;
  attachmentIds: string[];
  createdById: string;
  createdAt: Date;
}

// ─── Contractor Module ──────────────────────────────────────────────────────

export type ContractorStatus = "pending_approval" | "approved" | "active" | "suspended" | "inactive";

export interface Contractor {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  licenseNumber: string | null;
  insuranceCertificateUrl: string | null;
  specialties: string[];
  status: ContractorStatus;
  rating: number | null;
  completedProjects: number;
  createdAt: Date;
}

export type ScopeAssignmentStatus =
  | "draft"
  | "assigned"
  | "accepted"
  | "in_progress"
  | "pending_verification"
  | "verified"
  | "completed"
  | "disputed";

export interface ScopeAssignment {
  id: string;
  propertyId: string;
  contractorId: string;
  title: string;
  description: string;
  /** Specific work items within this scope */
  lineItems: ScopeLineItem[];
  status: ScopeAssignmentStatus;
  totalAmount: number;
  startDate: Date | null;
  estimatedCompletionDate: Date | null;
  actualCompletionDate: Date | null;
  complianceChecks: ComplianceCheck[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ScopeLineItem {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  unitCost: number;
  totalCost: number;
  status: "pending" | "in_progress" | "completed" | "verified";
}

export interface ComplianceCheck {
  id: string;
  name: string;
  description: string;
  status: "pending" | "passed" | "failed" | "waived";
  checkedAt: Date | null;
  checkedById: string | null;
  notes: string | null;
}

// ─── Equity Outcome Module ──────────────────────────────────────────────────

export interface EquityOutcome {
  id: string;
  propertyId: string;
  preEventValue: number;
  postRestorationValue: number;
  totalClaimAmount: number;
  totalInsurancePayout: number;
  totalRestorationCost: number;
  /** Net equity gain = (postValue - preValue) + (payout - restorationCost) */
  netEquityGain: number;
  /** Percentage gain over pre-event value */
  equityGainPercentage: number;
  /** AI-generated narrative explaining the equity outcome */
  narrative: string | null;
  generatedAt: Date;
  verifiedAt: Date | null;
  verifiedById: string | null;
}

// ─── ATOS AI Module ─────────────────────────────────────────────────────────

export type ATOSMessageRole = "user" | "assistant" | "system";

export type ATOSContext =
  | "general"
  | "property_analysis"
  | "inspection_guidance"
  | "claim_strategy"
  | "contractor_evaluation"
  | "equity_assessment";

export interface ATOSMessage {
  id: string;
  role: ATOSMessageRole;
  content: string;
  context: ATOSContext;
  /** References to entities discussed */
  entityReferences: EntityReference[];
  /** Confidence level of AI response (0-1) */
  confidence: number | null;
  /** Reasoning chain — explainability is non-negotiable */
  reasoning: string | null;
  createdAt: Date;
}

export interface EntityReference {
  type: "property" | "claim" | "contractor" | "inspection" | "evidence";
  id: string;
  label: string;
}

export interface ATOSInsight {
  id: string;
  propertyId: string | null;
  type: "risk" | "opportunity" | "gap" | "recommendation" | "alert";
  severity: "low" | "medium" | "high" | "critical";
  title: string;
  description: string;
  /** What the user should do about this */
  actionableSteps: string[];
  /** Why this matters — always explain */
  reasoning: string;
  acknowledged: boolean;
  acknowledgedAt: Date | null;
  createdAt: Date;
}

// ─── Timeline Events ────────────────────────────────────────────────────────

export interface TimelineEvent {
  id: string;
  propertyId: string;
  type: string;
  title: string;
  description: string;
  date: Date;
  actorId: string | null;
  actorName: string | null;
  metadata: Record<string, unknown>;
}

// ─── Dashboard Aggregates ───────────────────────────────────────────────────

export interface DashboardMetrics {
  totalProperties: number;
  activeInspections: number;
  pendingClaims: number;
  activeRestorations: number;
  totalEquityGained: number;
  averageEquityGainPercentage: number;
  criticalAlerts: number;
}
