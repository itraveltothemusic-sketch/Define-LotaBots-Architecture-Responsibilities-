import { buildAtosBrief } from "@/lib/atos/engine";
import {
  claims,
  evidenceTimeline,
  executionMilestones,
  inspections,
  properties,
  scopeDiscrepancies,
} from "@/lib/data/mock-data";

export interface IntelligenceKpi {
  label: string;
  value: string;
  trend: string;
}

export interface IntelligenceSnapshot {
  kpis: IntelligenceKpi[];
  properties: typeof properties;
  evidenceTimeline: typeof evidenceTimeline;
  atosBrief: ReturnType<typeof buildAtosBrief>;
}

export async function getIntelligenceSnapshot(): Promise<IntelligenceSnapshot> {
  const verifiedEvidenceCount = evidenceTimeline.filter(
    (item) => item.verificationStatus === "verified",
  ).length;
  const pendingMilestones = executionMilestones.filter(
    (milestone) => milestone.status === "blocked",
  ).length;
  const unresolvedClaimGap = claims.reduce((total, claim) => {
    return total + Math.max(0, claim.reserveEstimate - claim.payoutAmount);
  }, 0);
  const disputedScopeValue = scopeDiscrepancies.reduce((sum, discrepancy) => {
    return sum + (discrepancy.forensicValue - discrepancy.carrierValue);
  }, 0);

  const kpis: IntelligenceKpi[] = [
    {
      label: "Open Claim Exposure",
      value: new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(unresolvedClaimGap),
      trend: "carrier delta requires active remediation",
    },
    {
      label: "Disputed Scope Variance",
      value: new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(disputedScopeValue),
      trend: "forensic evidence supports escalation",
    },
    {
      label: "Evidence Verified",
      value: `${verifiedEvidenceCount}/${evidenceTimeline.length}`,
      trend: "verification confidence benchmark",
    },
    {
      label: "Blocked Milestones",
      value: `${pendingMilestones}`,
      trend: "execution-critical workstreams",
    },
  ];

  const atosBrief = buildAtosBrief({
    module: "intelligence",
    properties,
    inspections,
    evidence: evidenceTimeline,
    claims,
    discrepancies: scopeDiscrepancies,
    milestones: executionMilestones,
  });

  return {
    kpis,
    properties,
    evidenceTimeline: [...evidenceTimeline].sort((a, b) =>
      b.occurredAt.localeCompare(a.occurredAt),
    ),
    atosBrief,
  };
}
