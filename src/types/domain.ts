export type RiskLevel = "low" | "moderate" | "high" | "critical";

export type VerificationStatus = "verified" | "pending" | "flagged";

export type PropertyPhase =
  | "forensic-intake"
  | "insurance-negotiation"
  | "execution"
  | "equity-validation";

export interface PropertyProfile {
  id: string;
  displayName: string;
  ownershipEntity: string;
  addressLine1: string;
  city: string;
  state: string;
  zipCode: string;
  grossAreaSqFt: number;
  occupancyType: "retail" | "industrial" | "mixed-use" | "office";
  stormEvent: string;
  dateOfLoss: string;
  currentPhase: PropertyPhase;
  riskLevel: RiskLevel;
}

export interface EvidenceRecord {
  id: string;
  capturedAt: string;
  evidenceType: "photo" | "video" | "document" | "report" | "call-note";
  title: string;
  capturedBy: string;
  verificationStatus: VerificationStatus;
  chainOfCustodyRef: string;
  summary: string;
}

export interface InspectionRecord {
  id: string;
  inspectedAt: string;
  inspector: string;
  disciplines: Array<"roofing" | "facade" | "mechanical" | "electrical" | "interior">;
  findingsSummary: string;
  confidenceScore: number;
}

export interface DamageClassification {
  category:
    | "roof-system"
    | "water-intrusion"
    | "structural"
    | "envelope"
    | "mechanical-electrical";
  severity: "minor" | "moderate" | "severe";
  affectedAreaSqFt: number;
  evidenceCount: number;
  verificationStatus: VerificationStatus;
}

export interface ClaimMilestone {
  id: string;
  phase:
    | "notice-filed"
    | "carrier-review"
    | "scope-negotiation"
    | "proof-of-loss"
    | "settlement";
  occurredAt: string;
  status: "completed" | "in-progress" | "blocked";
  owner: string;
  note: string;
}

export interface CarrierInteraction {
  id: string;
  occurredAt: string;
  channel: "email" | "phone" | "meeting" | "portal";
  carrierRepresentative: string;
  summary: string;
  commitments: string[];
}

export interface ScopeDiscrepancy {
  id: string;
  lineItem: string;
  insuredScopeAmountUsd: number;
  carrierScopeAmountUsd: number;
  deltaUsd: number;
  rationale: string;
  riskLevel: RiskLevel;
}

export interface ContractorProfile {
  id: string;
  legalName: string;
  trade: "general" | "roofing" | "water-mitigation" | "electrical";
  onboardingStatus: "approved" | "under-review" | "expired-documentation";
  insuranceExpiration: string;
  backgroundCheck: "clear" | "pending";
}

export interface ScopeAssignment {
  id: string;
  contractorId: string;
  scopeName: string;
  dueDate: string;
  percentComplete: number;
  verificationStatus: VerificationStatus;
}

export interface ComplianceCheckpoint {
  id: string;
  name: string;
  status: "met" | "at-risk" | "missed";
  dueDate: string;
  owner: string;
}

export interface EquityOutcome {
  baselineValuationUsd: number;
  postExecutionValuationUsd: number;
  totalClaimedUsd: number;
  totalSettledUsd: number;
  netRecoveryDeltaUsd: number;
  projectedEquityGainUsd: number;
  narrative: string;
}

export interface IntelligenceSnapshot {
  property: PropertyProfile;
  evidenceTimeline: EvidenceRecord[];
  inspections: InspectionRecord[];
  damageClassifications: DamageClassification[];
  claimMilestones: ClaimMilestone[];
  carrierInteractions: CarrierInteraction[];
  scopeDiscrepancies: ScopeDiscrepancy[];
  contractors: ContractorProfile[];
  assignments: ScopeAssignment[];
  compliance: ComplianceCheckpoint[];
  equity: EquityOutcome;
}

export interface AtosGuidance {
  context: string;
  whyItMatters: string;
  risks: string[];
  opportunities: string[];
  recommendedActions: string[];
  confidenceLabel: "grounded" | "partial" | "insufficient-evidence";
}
