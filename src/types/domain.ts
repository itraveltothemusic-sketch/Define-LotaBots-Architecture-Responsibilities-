export type UserRole = "Owner" | "Contractor" | "Adjuster" | "Internal";

export type ModuleKey =
  | "intelligence"
  | "forensic-property"
  | "insurance-intelligence"
  | "contractor-execution"
  | "equity-outcome";

export type RiskSeverity = "low" | "medium" | "high" | "critical";

export type EvidenceType = "photo" | "video" | "document" | "report";

export type ClaimStage =
  | "Notice of Loss"
  | "Inspection"
  | "Carrier Review"
  | "Negotiation"
  | "Settlement"
  | "Closed";

export type ContractorStatus =
  | "Invited"
  | "Vetted"
  | "Onboarded"
  | "Suspended";

export type ScopeAssignmentStatus =
  | "Queued"
  | "Active"
  | "Blocked"
  | "Completed";

export interface UserSession {
  userId: string;
  displayName: string;
  role: UserRole;
  lastAuthenticatedAt: string;
}

export interface PropertyProfile {
  id: string;
  name: string;
  address: string;
  assetType: "Retail" | "Industrial" | "Office" | "Mixed Use";
  stormDate: string;
  occupancyRate: number;
  insuredValueUsd: number;
  valuationBeforeUsd: number;
  valuationAfterUsd: number;
  forensicConfidenceScore: number;
}

export interface InspectionRecord {
  id: string;
  propertyId: string;
  inspectionDate: string;
  inspector: string;
  weatherEvent: string;
  roofDamagePct: number;
  envelopeDamagePct: number;
  interiorDamagePct: number;
  recommendedAction: string;
  chainOfCustodyVerified: boolean;
}

export interface EvidenceItem {
  id: string;
  propertyId: string;
  capturedAt: string;
  capturedBy: string;
  type: EvidenceType;
  title: string;
  fileCount: number;
  integrityHash: string;
  verificationStatus: "Verified" | "Pending" | "Flagged";
}

export interface DamageClassification {
  id: string;
  propertyId: string;
  component: string;
  severity: RiskSeverity;
  estimatedRepairUsd: number;
  confidenceScore: number;
  rationale: string;
}

export interface ClaimLifecycle {
  id: string;
  propertyId: string;
  claimNumber: string;
  carrier: string;
  stage: ClaimStage;
  reserveUsd: number;
  submittedScopeUsd: number;
  carrierScopeUsd: number;
  payoutUsd: number;
  lastUpdatedAt: string;
}

export interface CarrierInteraction {
  id: string;
  claimId: string;
  interactionAt: string;
  channel: "Email" | "Phone" | "Portal" | "Meeting";
  owner: string;
  summary: string;
  responseDueAt: string;
  status: "Open" | "Awaiting Carrier" | "Closed";
}

export interface ScopeDiscrepancy {
  id: string;
  claimId: string;
  lineItem: string;
  submittedUsd: number;
  carrierUsd: number;
  deltaUsd: number;
  rationaleGap: string;
  severity: RiskSeverity;
}

export interface ContractorProfile {
  id: string;
  companyName: string;
  specialty: string;
  status: ContractorStatus;
  complianceScore: number;
  activeAssignments: number;
}

export interface ScopeAssignment {
  id: string;
  propertyId: string;
  contractorId: string;
  scopeName: string;
  status: ScopeAssignmentStatus;
  targetCompletionDate: string;
  verifiedProgressPct: number;
}

export interface ProgressVerification {
  id: string;
  assignmentId: string;
  checkedAt: string;
  checkedBy: string;
  completionPct: number;
  evidenceLinkCount: number;
  qualityRisk: RiskSeverity;
}

export interface ComplianceRecord {
  id: string;
  contractorId: string;
  category: string;
  expiresAt: string;
  status: "Valid" | "Expiring Soon" | "Expired";
}

export interface EquityOutcome {
  id: string;
  propertyId: string;
  valuationBeforeUsd: number;
  valuationAfterUsd: number;
  claimSubmittedUsd: number;
  payoutReceivedUsd: number;
  recoveryEfficiencyPct: number;
  equityGainUsd: number;
  narrative: string;
}

export interface AtosGuidance {
  id: string;
  module: ModuleKey;
  title: string;
  whyThisMatters: string;
  recommendation: string;
  severity: RiskSeverity;
  confidenceScore: number;
}

export interface IntelligenceSnapshot {
  portfolioValueBeforeUsd: number;
  portfolioValueAfterUsd: number;
  totalClaimSubmittedUsd: number;
  totalPayoutUsd: number;
  unresolvedEvidenceCount: number;
  criticalRiskCount: number;
  verificationCoveragePct: number;
}
