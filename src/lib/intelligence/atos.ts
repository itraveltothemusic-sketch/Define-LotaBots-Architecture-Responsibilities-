import {
  listCarrierInteractions,
  listClaims,
  listComplianceRecords,
  listDamageClassifications,
  listEquityOutcomes,
  listEvidence,
  listPropertyProfiles,
  listScopeAssignments,
  listScopeDiscrepancies,
} from "@/lib/db/repositories";
import type { AtosGuidance, ModuleKey, RiskSeverity } from "@/types/domain";

const severityWeight: Record<RiskSeverity, number> = {
  low: 1,
  medium: 2,
  high: 3,
  critical: 4,
};

function sortBySeverity(guidance: AtosGuidance[]): AtosGuidance[] {
  return [...guidance].sort(
    (left, right) => severityWeight[right.severity] - severityWeight[left.severity],
  );
}

export async function generateModuleGuidance(
  module: ModuleKey,
  propertyId?: string,
): Promise<AtosGuidance[]> {
  switch (module) {
    case "intelligence": {
      const evidence = await listEvidence(propertyId);
      const pendingEvidence = evidence.filter(
        (item) => item.verificationStatus !== "Verified",
      );

      const claims = await listClaims(propertyId);
      const stalledClaims = claims.filter(
        (claim) => claim.stage === "Carrier Review" || claim.stage === "Negotiation",
      );

      const issues: AtosGuidance[] = [];
      if (pendingEvidence.length > 0) {
        issues.push({
          id: "int-ev-coverage",
          module,
          title: "Close verification gaps in forensic evidence",
          whyThisMatters:
            "Unverified evidence weakens defensibility during carrier review and can reduce payout certainty.",
          recommendation: `Resolve ${pendingEvidence.length} evidence package(s) with pending/flagged verification metadata before the next carrier touchpoint.`,
          severity: pendingEvidence.some((item) => item.verificationStatus === "Flagged")
            ? "high"
            : "medium",
          confidenceScore: 0.94,
        });
      }

      if (stalledClaims.length > 0) {
        issues.push({
          id: "int-claim-momentum",
          module,
          title: "Protect claim momentum with quantified deltas",
          whyThisMatters:
            "Claims parked in review/negotiation stages are vulnerable to under-scoping without explicit discrepancy evidence.",
          recommendation:
            "Attach discrepancy tables and causation overlays to all active negotiation claims before cycle-end review.",
          severity: "high",
          confidenceScore: 0.9,
        });
      }

      if (issues.length === 0) {
        issues.push({
          id: "int-steady-state",
          module,
          title: "Maintain verification cadence",
          whyThisMatters:
            "Consistency is required to preserve defensibility and investor confidence.",
          recommendation:
            "Continue weekly evidence integrity checks and maintain claim update discipline.",
          severity: "low",
          confidenceScore: 0.82,
        });
      }

      return sortBySeverity(issues);
    }

    case "forensic-property": {
      const damages = await listDamageClassifications(propertyId);
      const criticalDamage = damages.filter((entry) => entry.severity === "critical");

      const guidance: AtosGuidance[] = [
        {
          id: "for-chain-of-custody",
          module,
          title: "Preserve chain-of-custody quality",
          whyThisMatters:
            "Forensic evidence is only as strong as its custody integrity in a claim dispute.",
          recommendation:
            "Require timestamp and capture-operator signatures for all new media uploads before report finalization.",
          severity: "medium",
          confidenceScore: 0.88,
        },
      ];

      if (criticalDamage.length > 0) {
        guidance.push({
          id: "for-critical-envelope",
          module,
          title: "Escalate critical component remediation package",
          whyThisMatters:
            "Critical component failures can create compounding interior losses and delay occupancy recovery.",
          recommendation:
            "Publish a sealed engineering addendum for critical components and align carrier scope to full replacement assumptions.",
          severity: "critical",
          confidenceScore: 0.92,
        });
      }

      return sortBySeverity(guidance);
    }

    case "insurance-intelligence": {
      const claims = await listClaims(propertyId);
      const discrepancies = await listScopeDiscrepancies();
      const interactions = await listCarrierInteractions();
      const openInteractions = interactions.filter((entry) => entry.status !== "Closed");

      const underScopedClaims = claims.filter(
        (claim) => claim.carrierScopeUsd > 0 && claim.submittedScopeUsd > claim.carrierScopeUsd,
      );
      const severeDiscrepancyCount = discrepancies.filter(
        (entry) => entry.severity === "critical" || entry.severity === "high",
      ).length;

      const guidance: AtosGuidance[] = [];
      if (underScopedClaims.length > 0) {
        guidance.push({
          id: "ins-under-scope",
          module,
          title: "Counter under-scoped carrier positions",
          whyThisMatters:
            "Scope compression directly lowers recoverable capital and slows rehabilitation.",
          recommendation:
            "Bundle line-item discrepancy evidence with causation rationale before the next carrier checkpoint.",
          severity: "high",
          confidenceScore: 0.93,
        });
      }

      if (openInteractions.length > 0) {
        guidance.push({
          id: "ins-response-sla",
          module,
          title: "Guard response SLA on carrier requests",
          whyThisMatters:
            "Missed response windows create avoidable claim delays and can reset negotiation leverage.",
          recommendation: `Track and close ${openInteractions.length} open carrier interaction(s) before due date expiration.`,
          severity: severeDiscrepancyCount > 0 ? "high" : "medium",
          confidenceScore: 0.87,
        });
      }

      return sortBySeverity(guidance);
    }

    case "contractor-execution": {
      const assignments = await listScopeAssignments(propertyId);
      const compliance = await listComplianceRecords();
      const blockedAssignments = assignments.filter(
        (assignment) => assignment.status === "Blocked",
      );
      const expiredCompliance = compliance.filter((item) => item.status === "Expired");

      const guidance: AtosGuidance[] = [];
      if (blockedAssignments.length > 0) {
        guidance.push({
          id: "con-unblock-work",
          module,
          title: "Remove blockers from critical assignments",
          whyThisMatters:
            "Blocked scopes create schedule drift that can erode both claim posture and NOI recovery timing.",
          recommendation: `Escalate unblock plan for ${blockedAssignments.length} blocked assignment(s), including owner and ETA for evidence correction.`,
          severity: "high",
          confidenceScore: 0.9,
        });
      }

      if (expiredCompliance.length > 0) {
        guidance.push({
          id: "con-compliance-risk",
          module,
          title: "Close contractor compliance expirations",
          whyThisMatters:
            "Expired compliance artifacts expose the platform to legal and insurance execution risk.",
          recommendation:
            "Suspend award of new scopes to non-compliant firms until documentation is renewed and verified.",
          severity: "critical",
          confidenceScore: 0.95,
        });
      }

      if (guidance.length === 0) {
        guidance.push({
          id: "con-operating-clean",
          module,
          title: "Maintain execution verification discipline",
          whyThisMatters:
            "Continuous verification sustains contractor accountability and schedule confidence.",
          recommendation:
            "Continue evidence-backed progress audits each week on all active scopes.",
          severity: "low",
          confidenceScore: 0.84,
        });
      }

      return sortBySeverity(guidance);
    }

    case "equity-outcome": {
      const outcomes = await listEquityOutcomes(propertyId);
      const underRecovered = outcomes.filter(
        (outcome) =>
          outcome.claimSubmittedUsd > 0 &&
          outcome.payoutReceivedUsd / outcome.claimSubmittedUsd < 0.75,
      );
      const properties = await listPropertyProfiles();

      const guidance: AtosGuidance[] = [];
      if (underRecovered.length > 0) {
        guidance.push({
          id: "eq-recovery-gap",
          module,
          title: "Increase payout capture efficiency",
          whyThisMatters:
            "Recovery gaps leave equity on the table even when physical restoration succeeds.",
          recommendation: `Focus escalation on ${underRecovered.length} under-recovered asset(s) by reconciling discrepancy rationale against carrier valuation assumptions.`,
          severity: "high",
          confidenceScore: 0.91,
        });
      }

      const growthDelta = properties.reduce(
        (total, property) => total + (property.valuationAfterUsd - property.valuationBeforeUsd),
        0,
      );
      if (growthDelta > 0) {
        guidance.push({
          id: "eq-storyline",
          module,
          title: "Codify investor-grade equity narrative",
          whyThisMatters:
            "Evidence-backed storytelling improves confidence among capital partners and insurers.",
          recommendation:
            "Publish a portfolio narrative linking forensic confidence, claim outcomes, and NOI stabilization.",
          severity: "medium",
          confidenceScore: 0.86,
        });
      }

      return sortBySeverity(guidance);
    }
  }
}

export async function generateAtosResponse(input: {
  module: ModuleKey;
  prompt: string;
  propertyId?: string;
}): Promise<{
  summary: string;
  whyThisMatters: string;
  nextBestAction: string;
  confidenceScore: number;
}> {
  const guidance = await generateModuleGuidance(input.module, input.propertyId);
  const primary = guidance[0];

  if (!primary) {
    return {
      summary:
        "No deterministic recommendations were generated from current evidence, claims, and execution data.",
      whyThisMatters:
        "ATOS only reasons from available records and cannot infer missing facts.",
      nextBestAction:
        "Ingest additional inspections, claim updates, or progress verifications and retry.",
      confidenceScore: 0.4,
    };
  }

  const trimmedPrompt = input.prompt.trim();
  const summary = trimmedPrompt
    ? `You asked: "${trimmedPrompt}". Based on current records, the highest-priority insight is "${primary.title}".`
    : `Highest-priority insight: ${primary.title}.`;

  return {
    summary,
    whyThisMatters: primary.whyThisMatters,
    nextBestAction: primary.recommendation,
    confidenceScore: primary.confidenceScore,
  };
}
