import type { AtosGuidance, IntelligenceSnapshot, ScopeDiscrepancy } from "@/types/domain";

export type AtosContext =
  | "intelligence"
  | "forensic"
  | "insurance"
  | "execution"
  | "equity";

function topDiscrepancies(discrepancies: ScopeDiscrepancy[]): ScopeDiscrepancy[] {
  return [...discrepancies].sort((a, b) => b.deltaUsd - a.deltaUsd).slice(0, 2);
}

export function generateAtosGuidance(
  context: AtosContext,
  snapshot: IntelligenceSnapshot,
): AtosGuidance {
  const verifiedEvidenceCount = snapshot.evidenceTimeline.filter(
    (entry) => entry.verificationStatus === "verified",
  ).length;
  const blockedClaims = snapshot.claimMilestones.filter((item) => item.status === "blocked");
  const atRiskCompliance = snapshot.compliance.filter((item) => item.status !== "met");
  const highRiskDiscrepancies = snapshot.scopeDiscrepancies.filter(
    (item) => item.riskLevel === "high" || item.riskLevel === "critical",
  );

  if (context === "intelligence") {
    return {
      context,
      whyItMatters:
        "The Intelligence Center exists to align evidence, claim posture, and execution progress into one defensible operating picture.",
      risks: [
        `${blockedClaims.length} claim milestone(s) are blocked, increasing cycle time and payout risk.`,
        `${atRiskCompliance.length} compliance checkpoint(s) are at-risk or missed, which can undermine admissibility and insurer confidence.`,
      ],
      opportunities: [
        `${verifiedEvidenceCount} evidence items are already verified and can be leveraged in immediate negotiation briefs.`,
        "Cross-linking inspection findings to discrepancy line items can improve claim substantiation quality.",
      ],
      recommendedActions: [
        "Resolve blocked milestones by assigning accountable owners with due-date commitments in the next 24 hours.",
        "Prioritize high-risk discrepancies for carrier response packages supported by chain-of-custody artifacts.",
        "Use ATOS guidance before every external carrier communication to maintain narrative consistency.",
      ],
      confidenceLabel: "grounded",
    };
  }

  if (context === "forensic") {
    const unverifiedEvidence = snapshot.evidenceTimeline.length - verifiedEvidenceCount;

    return {
      context,
      whyItMatters:
        "Forensic quality determines whether storm-related damage can be defended under scrutiny and translated into recoverable value.",
      risks: [
        `${unverifiedEvidence} evidence item(s) remain unverified, weakening chain-of-custody reliability.`,
        "Any discipline gap between inspections and observed damage categories can be challenged by carriers.",
      ],
      opportunities: [
        `${snapshot.damageClassifications.length} classified damage categories enable more precise scope and reserve planning.`,
        "Higher confidence inspection records can anchor rebuttals when carrier scopes are under-valued.",
      ],
      recommendedActions: [
        "Complete verification on pending evidence before next claim submission tranche.",
        "Map each severe damage classification to at least one signed inspection finding.",
        "Document classification rationale in plain language to improve adjuster and owner alignment.",
      ],
      confidenceLabel: "grounded",
    };
  }

  if (context === "insurance") {
    const largestGaps = topDiscrepancies(snapshot.scopeDiscrepancies);

    return {
      context,
      whyItMatters:
        "Insurance intelligence converts technical damage findings into financially defensible claim outcomes.",
      risks: [
        `${highRiskDiscrepancies.length} discrepancy line item(s) are currently high risk, directly impacting total settlement value.`,
        "Carrier interaction commitments can decay quickly if not converted into dated follow-ups.",
      ],
      opportunities: [
        largestGaps.length > 0
          ? `Largest open delta is ${largestGaps[0].lineItem}, creating a targeted negotiation focus.`
          : "Scope deltas are currently controlled.",
        "Milestone transparency can reduce avoidable carrier cycle-time delays.",
      ],
      recommendedActions: [
        "Prepare a discrepancy brief that cites evidence IDs and inspection confidence scores for each contested line item.",
        "Convert all verbal carrier commitments into written recap entries within the same business day.",
        "Escalate unresolved high-risk deltas with a formal proof-of-loss addendum where appropriate.",
      ],
      confidenceLabel: "grounded",
    };
  }

  if (context === "execution") {
    const lowProgressAssignments = snapshot.assignments.filter((item) => item.percentComplete < 50);

    return {
      context,
      whyItMatters:
        "Execution quality determines whether approved scope becomes measurable asset protection and equity recovery.",
      risks: [
        `${lowProgressAssignments.length} assignment(s) are below 50% completion, threatening schedule integrity.`,
        `${atRiskCompliance.length} compliance checkpoint(s) require intervention to avoid rework or legal exposure.`,
      ],
      opportunities: [
        "Verification checkpoints can be used as payment release gates to protect quality.",
        "Approved contractor profiles create leverage for assigning critical-path tasks immediately.",
      ],
      recommendedActions: [
        "Re-baseline critical path scopes with contractor-level weekly production targets.",
        "Require photographic and document verification at each completion milestone before acceptance.",
        "Escalate any expired contractor documentation before additional scope releases.",
      ],
      confidenceLabel: "grounded",
    };
  }

  const gain = snapshot.equity.projectedEquityGainUsd;
  return {
    context,
    whyItMatters:
      "Equity outcomes validate whether forensic and operational decisions produced real, documented financial improvement.",
    risks: [
      "If payout deltas are unresolved, projected equity gain can be overstated.",
      "Narratives without evidence traceability can fail investor or insurer diligence.",
    ],
    opportunities: [
      `Current projection indicates ${new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(gain)} in equity gain potential.`,
      "Before/after valuation framing strengthens trust across owners, lenders, and oversight stakeholders.",
    ],
    recommendedActions: [
      "Publish an evidence-linked gain narrative with explicit assumptions and confidence ranges.",
      "Reconcile final settlement values against original claimed scope before closing the case file.",
      "Schedule a post-mortem to codify repeatable gain drivers for future properties.",
    ],
    confidenceLabel: "grounded",
  };
}
