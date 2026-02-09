import {
  carrierInteractions,
  claimLifecycles,
  complianceRecords,
  contractorProfiles,
  damageClassifications,
  equityOutcomes,
  evidenceItems,
  inspectionRecords,
  progressVerifications,
  propertyProfiles,
  scopeAssignments,
  scopeDiscrepancies,
} from "@/lib/mock/data";
import type {
  ClaimLifecycle,
  IntelligenceSnapshot,
  PropertyProfile,
} from "@/types/domain";

export async function listPropertyProfiles(): Promise<PropertyProfile[]> {
  return propertyProfiles;
}

export async function listInspectionRecords(propertyId?: string) {
  if (!propertyId) {
    return inspectionRecords;
  }
  return inspectionRecords.filter((inspection) => inspection.propertyId === propertyId);
}

export async function listEvidence(propertyId?: string) {
  if (!propertyId) {
    return evidenceItems;
  }
  return evidenceItems.filter((evidence) => evidence.propertyId === propertyId);
}

export async function listDamageClassifications(propertyId?: string) {
  if (!propertyId) {
    return damageClassifications;
  }
  return damageClassifications.filter((damage) => damage.propertyId === propertyId);
}

export async function listClaims(propertyId?: string): Promise<ClaimLifecycle[]> {
  if (!propertyId) {
    return claimLifecycles;
  }
  return claimLifecycles.filter((claim) => claim.propertyId === propertyId);
}

export async function listCarrierInteractions(claimId?: string) {
  if (!claimId) {
    return carrierInteractions;
  }
  return carrierInteractions.filter((interaction) => interaction.claimId === claimId);
}

export async function listScopeDiscrepancies(claimId?: string) {
  if (!claimId) {
    return scopeDiscrepancies;
  }
  return scopeDiscrepancies.filter((discrepancy) => discrepancy.claimId === claimId);
}

export async function listContractors() {
  return contractorProfiles;
}

export async function listScopeAssignments(propertyId?: string) {
  if (!propertyId) {
    return scopeAssignments;
  }
  return scopeAssignments.filter((assignment) => assignment.propertyId === propertyId);
}

export async function listProgressVerifications(assignmentId?: string) {
  if (!assignmentId) {
    return progressVerifications;
  }
  return progressVerifications.filter(
    (verification) => verification.assignmentId === assignmentId,
  );
}

export async function listComplianceRecords(contractorId?: string) {
  if (!contractorId) {
    return complianceRecords;
  }
  return complianceRecords.filter((record) => record.contractorId === contractorId);
}

export async function listEquityOutcomes(propertyId?: string) {
  if (!propertyId) {
    return equityOutcomes;
  }
  return equityOutcomes.filter((outcome) => outcome.propertyId === propertyId);
}

export async function getIntelligenceSnapshot(): Promise<IntelligenceSnapshot> {
  const portfolioValueBeforeUsd = propertyProfiles.reduce(
    (total, property) => total + property.valuationBeforeUsd,
    0,
  );
  const portfolioValueAfterUsd = propertyProfiles.reduce(
    (total, property) => total + property.valuationAfterUsd,
    0,
  );
  const totalClaimSubmittedUsd = claimLifecycles.reduce(
    (total, claim) => total + claim.submittedScopeUsd,
    0,
  );
  const totalPayoutUsd = claimLifecycles.reduce(
    (total, claim) => total + claim.payoutUsd,
    0,
  );
  const unresolvedEvidenceCount = evidenceItems.filter(
    (item) => item.verificationStatus !== "Verified",
  ).length;
  const criticalRiskCount = damageClassifications.filter(
    (item) => item.severity === "critical",
  ).length;

  const verificationCoveragePct =
    evidenceItems.length === 0
      ? 0
      : evidenceItems.filter((item) => item.verificationStatus === "Verified").length /
        evidenceItems.length;

  return {
    portfolioValueBeforeUsd,
    portfolioValueAfterUsd,
    totalClaimSubmittedUsd,
    totalPayoutUsd,
    unresolvedEvidenceCount,
    criticalRiskCount,
    verificationCoveragePct,
  };
}
