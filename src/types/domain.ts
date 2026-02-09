export const platformRoles = [
  "OWNER",
  "CONTRACTOR",
  "ADJUSTER",
  "INTERNAL",
] as const;

export type PlatformRole = (typeof platformRoles)[number];

export interface PlatformUser {
  id: string;
  name: string;
  email: string;
  role: PlatformRole;
}

export type PropertyStatus =
  | "MONITORING"
  | "ACTIVE_CLAIM"
  | "RESTORING"
  | "RESOLVED";

export interface PropertyProfile {
  id: string;
  label: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  assetClass: "OFFICE" | "RETAIL" | "MULTIFAMILY" | "INDUSTRIAL" | "MIXED_USE";
  yearBuilt: number;
  grossSquareFeet: number;
  occupancyRate: number;
  weatherEventDate: string;
  currentValuationUsd: number;
  baselineValuationUsd: number;
  status: PropertyStatus;
  confidenceScore: number;
}

export type DamageCategory =
  | "ROOFING"
  | "HVAC"
  | "ENVELOPE"
  | "INTERIOR"
  | "STRUCTURAL"
  | "ELECTRICAL";

export type SeverityLevel = "LOW" | "MODERATE" | "HIGH" | "CRITICAL";

export interface InspectionRecord {
  id: string;
  propertyId: string;
  inspectionDate: string;
  inspector: string;
  summary: string;
  categories: DamageCategory[];
  severity: SeverityLevel;
  estimatedLossUsd: number;
  isPeerReviewed: boolean;
}

export type EvidenceKind = "PHOTO" | "VIDEO" | "DOCUMENT" | "NOTE";
export type VerificationStatus = "PENDING" | "VERIFIED" | "FLAGGED";

export interface EvidenceItem {
  id: string;
  propertyId: string;
  inspectionId?: string;
  title: string;
  kind: EvidenceKind;
  capturedAt: string;
  capturedBy: string;
  verificationStatus: VerificationStatus;
  chainOfCustodyRef: string;
  note: string;
}

export type ClaimStage =
  | "NOTICE_OF_LOSS"
  | "DOCUMENT_COLLECTION"
  | "ADJUSTER_REVIEW"
  | "SCOPE_NEGOTIATION"
  | "PARTIAL_PAYOUT"
  | "CLOSED";

export interface ClaimRecord {
  id: string;
  propertyId: string;
  carrier: string;
  policyNumber: string;
  claimNumber: string;
  stage: ClaimStage;
  claimedAmountUsd: number;
  approvedAmountUsd: number;
  reserveAmountUsd: number;
  lastCarrierTouchpointAt: string;
}

export interface CarrierInteraction {
  id: string;
  claimId: string;
  occurredAt: string;
  channel: "EMAIL" | "PHONE" | "PORTAL" | "MEETING";
  summary: string;
  owner: string;
  requiresFollowUp: boolean;
}

export type DiscrepancyType =
  | "MISSING_LINE_ITEM"
  | "QUANTITY_DELTA"
  | "UNIT_COST_DELTA"
  | "CODE_UPGRADE_OMITTED";

export interface ScopeComparisonLine {
  id: string;
  claimId: string;
  lineItem: string;
  insurerQuantity: number;
  contractorQuantity: number;
  insurerUnitCostUsd: number;
  contractorUnitCostUsd: number;
  discrepancyType: DiscrepancyType;
}

export type OnboardingStatus = "IN_PROGRESS" | "VERIFIED" | "RESTRICTED";

export interface ContractorProfile {
  id: string;
  companyName: string;
  trade: string;
  onboardingStatus: OnboardingStatus;
  insuranceVerified: boolean;
  licenseVerified: boolean;
  qualityScore: number;
}

export type AssignmentStatus =
  | "NOT_STARTED"
  | "IN_PROGRESS"
  | "AWAITING_VERIFICATION"
  | "VERIFIED";

export interface ScopeAssignment {
  id: string;
  propertyId: string;
  contractorId: string;
  workstream: string;
  targetCompletionDate: string;
  progressPercent: number;
  status: AssignmentStatus;
}

export interface ComplianceCheckpoint {
  id: string;
  assignmentId: string;
  requirement: string;
  status: "OPEN" | "PASSED" | "FAILED";
  validatedAt?: string;
}

export interface EquityOutcome {
  id: string;
  propertyId: string;
  valuationBeforeUsd: number;
  valuationAfterUsd: number;
  claimRequestedUsd: number;
  claimPaidUsd: number;
  capexOutOfPocketUsd: number;
  projectedNOIUpliftUsd: number;
}

export interface EquityNarrativeReport {
  id: string;
  propertyId: string;
  title: string;
  generatedAt: string;
  executiveSummary: string;
  confidence: number;
}

export type AtosPriority = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

export interface AtosGuidance {
  id: string;
  module: AtosModuleId;
  priority: AtosPriority;
  insight: string;
  whyItMatters: string;
  recommendedAction: string;
  evidenceRefs: string[];
}

export const atosModules = [
  "intelligence",
  "forensic-property",
  "insurance-intelligence",
  "contractor-execution",
  "equity-outcome",
] as const;

export type AtosModuleId = (typeof atosModules)[number];
