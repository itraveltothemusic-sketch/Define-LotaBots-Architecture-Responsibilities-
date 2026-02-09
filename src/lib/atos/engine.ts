import type {
  AtosBrief,
  ClaimRecord,
  ContractorProfile,
  EquityOutcome,
  EvidenceItem,
  ExecutionMilestone,
  InspectionRecord,
  PropertyProfile,
  ScopeDiscrepancy,
} from "@/types/domain";

interface AtosContext {
  module:
    | "intelligence"
    | "forensic"
    | "insurance"
    | "execution"
    | "equity";
  properties?: PropertyProfile[];
  inspections?: InspectionRecord[];
  evidence?: EvidenceItem[];
  claims?: ClaimRecord[];
  discrepancies?: ScopeDiscrepancy[];
  contractors?: ContractorProfile[];
  milestones?: ExecutionMilestone[];
  outcomes?: EquityOutcome[];
}

function clampConfidence(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function deriveEvidenceConfidence(
  evidence: EvidenceItem[] | undefined,
  properties: PropertyProfile[] | undefined,
): number {
  if (evidence && evidence.length > 0) {
    const verifiedCount = evidence.filter(
      (item) => item.verificationStatus === "verified",
    ).length;
    return clampConfidence((verifiedCount / evidence.length) * 100);
  }

  if (properties && properties.length > 0) {
    const average =
      properties.reduce((sum, property) => sum + property.confidenceScore, 0) /
      properties.length;
    return clampConfidence(average);
  }

  return 0;
}

// ATOS is intentionally deterministic so guidance is auditable and explainable.
export function buildAtosBrief(context: AtosContext): AtosBrief {
  const evidenceConfidence = deriveEvidenceConfidence(
    context.evidence,
    context.properties,
  );

  const properties = context.properties ?? [];
  const claims = context.claims ?? [];
  const discrepancies = context.discrepancies ?? [];
  const milestones = context.milestones ?? [];
  const contractors = context.contractors ?? [];
  const outcomes = context.outcomes ?? [];

  const pendingInspectionCount = properties.filter(
    (property) =>
      property.inspectionStatus === "scheduled" ||
      property.inspectionStatus === "in_progress" ||
      property.inspectionStatus === "needs_reinspection",
  ).length;
  const openClaimCount = claims.filter((claim) => claim.status !== "closed")
    .length;
  const blockedMilestoneCount = milestones.filter(
    (milestone) => milestone.status === "blocked",
  ).length;
  const highVarianceCount = discrepancies.filter(
    (scope) => scope.forensicValue - scope.carrierValue > 100000,
  ).length;

  const payoutGapValue = claims.reduce((total, claim) => {
    return total + Math.max(0, claim.reserveEstimate - claim.payoutAmount);
  }, 0);

  const underperformingContractors = contractors.filter(
    (contractor) => contractor.complianceScore < 90,
  );

  const positiveEquityCount = outcomes.filter(
    (outcome) => outcome.postRecoveryValue > outcome.baselineValue,
  ).length;

  switch (context.module) {
    case "forensic":
      return {
        module: "forensic",
        summary: `${pendingInspectionCount} properties still need inspection closure or reinspection.`,
        whyItMatters:
          "Insurance and execution decisions are only as strong as verified forensic evidence quality.",
        risks: [
          ...(pendingInspectionCount > 0
            ? [
                "Inspection backlog can reduce negotiating leverage in active claims.",
              ]
            : []),
          ...(evidenceConfidence < 85
            ? [
                "Evidence verification confidence is below target for defensible scope support.",
              ]
            : []),
        ],
        opportunities: [
          "Prioritize reinspection-ready properties for the highest claim impact first.",
          "Close flagged evidence items before next carrier submission cycle.",
        ],
        recommendations: [
          {
            priority: pendingInspectionCount > 0 ? "high" : "medium",
            action: "Run a 72-hour reinspection sprint on unresolved assets.",
            rationale:
              "Consolidated closure increases evidence completeness before carrier challenges.",
          },
          {
            priority: evidenceConfidence < 85 ? "high" : "medium",
            action: "Require verifier signoff on all pending video and note evidence.",
            rationale:
              "Higher verification confidence directly improves claim defensibility.",
          },
        ],
        evidenceConfidence,
      };
    case "insurance":
      return {
        module: "insurance",
        summary: `${openClaimCount} active claims with ${highVarianceCount} high-variance scope categories identified.`,
        whyItMatters:
          "Unresolved scope variance and interaction lag translate directly into lost recoverable value.",
        risks: [
          ...(payoutGapValue > 0
            ? [
                `Current aggregate reserve-to-payout exposure is ${new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                  maximumFractionDigits: 0,
                }).format(payoutGapValue)}.`,
              ]
            : []),
          ...(highVarianceCount > 0
            ? ["Major scope categories remain under-valued versus forensic findings."]
            : []),
        ],
        opportunities: [
          "Bundle discrepancy rationale with timestamped evidence before next adjuster meeting.",
          "Escalate high-variance claims to engineering-backed rebuttal packets.",
        ],
        recommendations: [
          {
            priority: highVarianceCount > 0 ? "critical" : "medium",
            action: "Issue discrepancy matrix packages for all disputed categories.",
            rationale:
              "Structured comparison accelerates carrier decision cycles and reduces ambiguity.",
          },
          {
            priority: payoutGapValue > 0 ? "high" : "medium",
            action: "Schedule weekly carrier response SLA reviews.",
            rationale:
              "SLA governance prevents review drift and preserves recovery momentum.",
          },
        ],
        evidenceConfidence,
      };
    case "execution":
      return {
        module: "execution",
        summary: `${blockedMilestoneCount} milestones are blocked and ${underperformingContractors.length} contractors are below compliance target.`,
        whyItMatters:
          "Execution friction delays completion proof, which can delay payout and suppress realized equity gains.",
        risks: [
          ...(blockedMilestoneCount > 0
            ? [
                "Blocked milestones can trigger cascading delays across scope dependencies.",
              ]
            : []),
          ...(underperformingContractors.length > 0
            ? ["At least one contractor is operating below compliance threshold."]
            : []),
        ],
        opportunities: [
          "Re-sequence milestone dependencies around approved contractors for critical path work.",
          "Use compliance scorecards as eligibility gates for net-new assignments.",
        ],
        recommendations: [
          {
            priority: blockedMilestoneCount > 0 ? "critical" : "medium",
            action: "Resolve blocked milestones within 48 hours using owner escalation.",
            rationale:
              "Removing blockers restores completion velocity and protects claim timelines.",
          },
          {
            priority:
              underperformingContractors.length > 0 ? "high" : "medium",
            action: "Place low-compliance contractors on corrective action plans.",
            rationale:
              "Early governance intervention prevents quality and audit failures.",
          },
        ],
        evidenceConfidence,
      };
    case "equity":
      return {
        module: "equity",
        summary: `${positiveEquityCount}/${outcomes.length} properties currently model a positive post-recovery valuation delta.`,
        whyItMatters:
          "Equity outcomes convert forensic and insurance performance into investor-grade value realization.",
        risks: [
          ...(payoutGapValue > 0
            ? ["Outstanding payout gaps continue to cap near-term equity realization."]
            : []),
        ],
        opportunities: [
          "Prioritize assets with high valuation upside and unresolved claim deltas.",
          "Use evidence-backed narratives to defend cap-rate assumptions in reporting.",
        ],
        recommendations: [
          {
            priority: payoutGapValue > 0 ? "high" : "medium",
            action: "Tie claim dispute closure milestones to equity report publication windows.",
            rationale:
              "Synchronizing legal/claims outcomes with valuation reporting improves credibility.",
          },
          {
            priority: "medium",
            action: "Publish quarterly before/after equity narratives by property.",
            rationale:
              "Narrative transparency helps operators, insurers, and investors align on outcomes.",
          },
        ],
        evidenceConfidence,
      };
    case "intelligence":
    default:
      return {
        module: "intelligence",
        summary: `${pendingInspectionCount} unresolved inspections, ${openClaimCount} active claims, and ${blockedMilestoneCount} blocked execution milestones currently require coordinated action.`,
        whyItMatters:
          "Cross-functional signal alignment is the difference between recoverable value and preventable leakage.",
        risks: [
          ...(pendingInspectionCount > 0
            ? [
                "Incomplete forensic closure could weaken near-term claim positioning.",
              ]
            : []),
          ...(highVarianceCount > 0
            ? [
                "Scope variance suggests materially underrepresented carrier valuations.",
              ]
            : []),
          ...(blockedMilestoneCount > 0
            ? ["Execution blockers may defer completion proof for payout release."]
            : []),
        ],
        opportunities: [
          "Consolidate forensic, insurance, and execution reviews into a single weekly command cadence.",
          "Prioritize property-level action queues by financial exposure and evidence confidence.",
        ],
        recommendations: [
          {
            priority: "critical",
            action: "Launch a 7-day command sprint for disputed claims and blocked milestones.",
            rationale:
              "Joint triage shortens feedback loops across adjusters, contractors, and internal analysts.",
          },
          {
            priority: evidenceConfidence < 85 ? "high" : "medium",
            action: "Elevate evidence verification SLAs for pending and flagged items.",
            rationale:
              "Higher evidence confidence increases trust and supports defensible decisions.",
          },
        ],
        evidenceConfidence,
      };
  }
}
