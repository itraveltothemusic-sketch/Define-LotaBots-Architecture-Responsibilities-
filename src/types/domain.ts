import type { AppRole } from "@/lib/auth/roles";

export type VerificationStatus = "verified" | "pending" | "flagged";
export type DamageClass = "wind" | "hail" | "water" | "structural";

export interface PropertyProfile {
  id: string;
  name: string;
  address: string;
  occupancyType: "retail" | "office" | "mixed_use" | "industrial";
  stormEvent: string;
  inspectionStatus:
    | "scheduled"
    | "in_progress"
    | "completed"
    | "needs_reinspection";
  confidenceScore: number;
  lastInspectionAt: string;
  evidenceCoverage: {
    photos: number;
    videos: number;
    documents: number;
  };
}

export interface InspectionRecord {
  id: string;
  propertyId: string;
  inspector: string;
  inspectedAt: string;
  severity: "low" | "medium" | "high" | "critical";
  damageClasses: DamageClass[];
  findingsSummary: string;
}

export interface EvidenceItem {
  id: string;
  propertyId: string;
  occurredAt: string;
  type: "photo" | "video" | "document" | "note";
  title: string;
  source: string;
  verificationStatus: VerificationStatus;
}

export interface ClaimRecord {
  id: string;
  propertyId: string;
  carrier: string;
  policyNumber: string;
  status:
    | "notice_submitted"
    | "under_review"
    | "scope_dispute"
    | "approved"
    | "closed";
  reserveEstimate: number;
  payoutAmount: number;
  openedAt: string;
  updatedAt: string;
}

export interface CarrierInteractionLog {
  id: string;
  claimId: string;
  occurredAt: string;
  channel: "email" | "phone" | "portal" | "meeting";
  summary: string;
  owner: string;
}

export interface ScopeDiscrepancy {
  id: string;
  claimId: string;
  category: "roof" | "facade" | "mechanical" | "interior";
  carrierValue: number;
  forensicValue: number;
  rationale: string;
}

export interface ContractorProfile {
  id: string;
  companyName: string;
  trade: "general" | "roofing" | "mechanical" | "facade";
  onboardingStatus: "pending" | "approved" | "restricted";
  complianceScore: number;
  assignedScopeCount: number;
}

export interface ExecutionMilestone {
  id: string;
  propertyId: string;
  contractorId: string;
  title: string;
  dueAt: string;
  verifiedAt?: string;
  status: "planned" | "in_progress" | "verified" | "blocked";
}

export interface EquityOutcome {
  id: string;
  propertyId: string;
  baselineValue: number;
  postRecoveryValue: number;
  claimEstimate: number;
  payoutValue: number;
  narrative: string;
}

export interface AtosRecommendation {
  priority: "critical" | "high" | "medium";
  action: string;
  rationale: string;
}

export interface AtosBrief {
  module:
    | "intelligence"
    | "forensic"
    | "insurance"
    | "execution"
    | "equity";
  summary: string;
  whyItMatters: string;
  risks: string[];
  opportunities: string[];
  recommendations: AtosRecommendation[];
  evidenceConfidence: number;
}

export interface ModuleNavItem {
  title: string;
  href: string;
  description: string;
  roles: AppRole[];
}

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: AppRole;
}
