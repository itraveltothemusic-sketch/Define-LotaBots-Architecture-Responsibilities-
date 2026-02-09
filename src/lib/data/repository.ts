import {
  carrierInteractions,
  claims,
  complianceCheckpoints,
  contractors,
  equityNarrativeReports,
  equityOutcomes,
  evidenceTimeline,
  inspections,
  properties,
  scopeAssignments,
  scopeComparisonLines,
} from "@/lib/data/mock-data";
import type {
  AtosModuleId,
  CarrierInteraction,
  ClaimRecord,
  ComplianceCheckpoint,
  ContractorProfile,
  EquityNarrativeReport,
  EquityOutcome,
  EvidenceItem,
  InspectionRecord,
  PropertyProfile,
  ScopeAssignment,
  ScopeComparisonLine,
} from "@/types/domain";

function toUsd(value: number) {
  return Math.round(value);
}

export interface DashboardSnapshot {
  propertyCount: number;
  activeClaimCount: number;
  unresolvedEvidenceCount: number;
  openComplianceIssues: number;
  totalClaimedUsd: number;
  totalApprovedUsd: number;
  totalEquityGainUsd: number;
  weightedConfidence: number;
}

export interface IntelligenceCenterData {
  focusProperty: PropertyProfile;
  inspections: InspectionRecord[];
  evidence: EvidenceItem[];
  claim: ClaimRecord | null;
  propertyTimeline: Array<
    | { kind: "inspection"; at: string; title: string; summary: string; severity: string }
    | { kind: "evidence"; at: string; title: string; summary: string; severity: string }
  >;
  snapshot: DashboardSnapshot;
}

export interface ForensicPropertyData {
  properties: PropertyProfile[];
  inspections: InspectionRecord[];
  evidenceQueue: EvidenceItem[];
  damageClassification: Array<{
    category: string;
    incidentCount: number;
    totalEstimatedLossUsd: number;
    maxSeverity: string;
  }>;
}

export interface InsuranceIntelligenceData {
  claims: ClaimRecord[];
  carrierInteractions: CarrierInteraction[];
  scopeComparisons: ScopeComparisonLine[];
  discrepancyExposureUsd: number;
}

export interface ContractorExecutionData {
  contractors: ContractorProfile[];
  assignments: ScopeAssignment[];
  compliance: ComplianceCheckpoint[];
}

export interface EquityOutcomeData {
  outcomes: EquityOutcome[];
  reports: EquityNarrativeReport[];
  aggregateGainUsd: number;
  aggregateCarrierDeltaUsd: number;
}

export async function getDashboardSnapshot(): Promise<DashboardSnapshot> {
  const activeClaimCount = claims.filter((claim) => claim.stage !== "CLOSED").length;
  const unresolvedEvidenceCount = evidenceTimeline.filter(
    (item) => item.verificationStatus !== "VERIFIED",
  ).length;
  const openComplianceIssues = complianceCheckpoints.filter(
    (checkpoint) => checkpoint.status !== "PASSED",
  ).length;
  const totalClaimedUsd = claims.reduce((sum, claim) => sum + claim.claimedAmountUsd, 0);
  const totalApprovedUsd = claims.reduce((sum, claim) => sum + claim.approvedAmountUsd, 0);
  const totalEquityGainUsd = equityOutcomes.reduce(
    (sum, outcome) => sum + (outcome.valuationAfterUsd - outcome.valuationBeforeUsd),
    0,
  );
  const weightedConfidence =
    properties.reduce((sum, property) => sum + property.confidenceScore, 0) /
    properties.length;

  return {
    propertyCount: properties.length,
    activeClaimCount,
    unresolvedEvidenceCount,
    openComplianceIssues,
    totalClaimedUsd: toUsd(totalClaimedUsd),
    totalApprovedUsd: toUsd(totalApprovedUsd),
    totalEquityGainUsd: toUsd(totalEquityGainUsd),
    weightedConfidence,
  };
}

export async function getIntelligenceCenterData(): Promise<IntelligenceCenterData> {
  const focusProperty = properties[0];
  const propertyInspections = inspections
    .filter((inspection) => inspection.propertyId === focusProperty.id)
    .sort((left, right) => right.inspectionDate.localeCompare(left.inspectionDate));
  const propertyEvidence = evidenceTimeline
    .filter((item) => item.propertyId === focusProperty.id)
    .sort((left, right) => right.capturedAt.localeCompare(left.capturedAt));
  const claim = claims.find((item) => item.propertyId === focusProperty.id) ?? null;

  const inspectionEvents = propertyInspections.map((inspection) => ({
    kind: "inspection" as const,
    at: inspection.inspectionDate,
    title: `Inspection by ${inspection.inspector}`,
    summary: inspection.summary,
    severity: inspection.severity,
  }));

  const evidenceEvents = propertyEvidence.map((evidence) => ({
    kind: "evidence" as const,
    at: evidence.capturedAt,
    title: evidence.title,
    summary: evidence.note,
    severity: evidence.verificationStatus,
  }));

  const propertyTimeline = [...inspectionEvents, ...evidenceEvents].sort((left, right) =>
    right.at.localeCompare(left.at),
  );

  return {
    focusProperty,
    inspections: propertyInspections,
    evidence: propertyEvidence,
    claim,
    propertyTimeline,
    snapshot: await getDashboardSnapshot(),
  };
}

export async function getForensicPropertyData(): Promise<ForensicPropertyData> {
  const evidenceQueue = evidenceTimeline
    .filter((item) => item.verificationStatus !== "VERIFIED")
    .sort((left, right) => right.capturedAt.localeCompare(left.capturedAt));

  const damageMap = new Map<
    string,
    { incidentCount: number; totalEstimatedLossUsd: number; maxSeverity: string }
  >();

  for (const inspection of inspections) {
    for (const category of inspection.categories) {
      const previous = damageMap.get(category) ?? {
        incidentCount: 0,
        totalEstimatedLossUsd: 0,
        maxSeverity: "LOW",
      };

      const severityOrder = ["LOW", "MODERATE", "HIGH", "CRITICAL"];
      const maxSeverity =
        severityOrder.indexOf(inspection.severity) > severityOrder.indexOf(previous.maxSeverity)
          ? inspection.severity
          : previous.maxSeverity;

      damageMap.set(category, {
        incidentCount: previous.incidentCount + 1,
        totalEstimatedLossUsd: previous.totalEstimatedLossUsd + inspection.estimatedLossUsd,
        maxSeverity,
      });
    }
  }

  const damageClassification = [...damageMap.entries()]
    .map(([category, summary]) => ({
      category,
      incidentCount: summary.incidentCount,
      totalEstimatedLossUsd: toUsd(summary.totalEstimatedLossUsd),
      maxSeverity: summary.maxSeverity,
    }))
    .sort((left, right) => right.totalEstimatedLossUsd - left.totalEstimatedLossUsd);

  return {
    properties,
    inspections: [...inspections].sort((left, right) =>
      right.inspectionDate.localeCompare(left.inspectionDate),
    ),
    evidenceQueue,
    damageClassification,
  };
}

function calculateLineDelta(line: ScopeComparisonLine) {
  const carrierValue = line.insurerQuantity * line.insurerUnitCostUsd;
  const scopedValue = line.contractorQuantity * line.contractorUnitCostUsd;
  return scopedValue - carrierValue;
}

export async function getInsuranceIntelligenceData(): Promise<InsuranceIntelligenceData> {
  const discrepancyExposureUsd = scopeComparisonLines.reduce(
    (sum, line) => sum + calculateLineDelta(line),
    0,
  );

  return {
    claims: [...claims].sort((left, right) =>
      right.lastCarrierTouchpointAt.localeCompare(left.lastCarrierTouchpointAt),
    ),
    carrierInteractions: [...carrierInteractions].sort((left, right) =>
      right.occurredAt.localeCompare(left.occurredAt),
    ),
    scopeComparisons: scopeComparisonLines,
    discrepancyExposureUsd: toUsd(discrepancyExposureUsd),
  };
}

export async function getContractorExecutionData(): Promise<ContractorExecutionData> {
  return {
    contractors,
    assignments: [...scopeAssignments].sort((left, right) =>
      right.targetCompletionDate.localeCompare(left.targetCompletionDate),
    ),
    compliance: complianceCheckpoints,
  };
}

export async function getEquityOutcomeData(): Promise<EquityOutcomeData> {
  const aggregateGainUsd = equityOutcomes.reduce(
    (sum, outcome) => sum + (outcome.valuationAfterUsd - outcome.valuationBeforeUsd),
    0,
  );
  const aggregateCarrierDeltaUsd = equityOutcomes.reduce(
    (sum, outcome) => sum + (outcome.claimRequestedUsd - outcome.claimPaidUsd),
    0,
  );

  return {
    outcomes: equityOutcomes,
    reports: equityNarrativeReports,
    aggregateGainUsd: toUsd(aggregateGainUsd),
    aggregateCarrierDeltaUsd: toUsd(aggregateCarrierDeltaUsd),
  };
}

export async function getAtosModuleContext(module: AtosModuleId) {
  if (module === "intelligence") {
    return getIntelligenceCenterData();
  }
  if (module === "forensic-property") {
    return getForensicPropertyData();
  }
  if (module === "insurance-intelligence") {
    return getInsuranceIntelligenceData();
  }
  if (module === "contractor-execution") {
    return getContractorExecutionData();
  }
  return getEquityOutcomeData();
}
