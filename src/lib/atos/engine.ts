export type AtosSeverity = "info" | "attention" | "critical";

export type AtosAction = {
  title: string;
  whyThisMatters: string;
  severity: AtosSeverity;
};

export type AtosRisk = {
  title: string;
  rationale: string;
  severity: AtosSeverity;
};

export type AtosGuidance = {
  headline: string;
  basedOn: Record<string, unknown>;
  actions: AtosAction[];
  risks: AtosRisk[];
};

export type AtosOrgSnapshot = {
  orgName: string | null;
  stats: {
    properties: number;
    inspections: number;
    evidenceItems: number;
    claims: number;
  };
};

/**
 * ATOS Guidance Engine (deterministic + data-bound).
 *
 * WHY:
 * - The platform must NEVER invent facts.
 * - Early guidance is rules-based and fully explainable.
 * - Later, we can layer LLM reasoning on top of verified platform facts.
 */
export function generateGuidance(snapshot: AtosOrgSnapshot): AtosGuidance {
  const { stats } = snapshot;

  const actions: AtosAction[] = [];
  const risks: AtosRisk[] = [];

  if (stats.properties === 0) {
    actions.push({
      title: "Create your first property record",
      severity: "critical",
      whyThisMatters:
        "Everything downstream (inspections, evidence timeline, claims, execution, equity outcomes) depends on a defensible property record as the root of truth.",
    });
    risks.push({
      title: "No properties in system",
      severity: "critical",
      rationale:
        "Without a property record, evidence cannot be contextualized or audited and claim strategy cannot be structured.",
    });
  } else {
    actions.push({
      title: "Verify each property has an inspection record",
      severity: stats.inspections < stats.properties ? "attention" : "info",
      whyThisMatters:
        "Inspection records anchor what was observed, when it was observed, and by whom—reducing ambiguity during scope and coverage discussions.",
    });

    if (stats.evidenceItems === 0) {
      actions.push({
        title: "Attach time-stamped photo/video evidence",
        severity: "critical",
        whyThisMatters:
          "Insurance outcomes depend on evidence quality and provenance. Time-stamped, organized evidence prevents narrative gaps and supports defensible scope.",
      });
      risks.push({
        title: "Evidence gap",
        severity: "critical",
        rationale:
          "Properties exist but no evidence is attached. This creates high risk of under-scoped damage and weakens negotiation leverage.",
      });
    } else if (stats.evidenceItems < stats.properties * 5) {
      actions.push({
        title: "Expand evidence coverage (exterior, roof, envelope, interiors)",
        severity: "attention",
        whyThisMatters:
          "Broader evidence coverage reduces the chance that damage categories are missed or disputed later in the claim lifecycle.",
      });
    }

    if (stats.claims === 0) {
      actions.push({
        title: "Start claim tracking for eligible properties",
        severity: "attention",
        whyThisMatters:
          "Claim lifecycle tracking centralizes carrier interactions, scope versions, and discrepancy signals—so strategy stays coherent and auditable.",
      });
    }
  }

  if (stats.inspections > 0 && stats.evidenceItems === 0) {
    risks.push({
      title: "Inspection without evidence",
      severity: "attention",
      rationale:
        "Inspection notes without supporting artifacts are harder to defend. Attach evidence or document why evidence is unavailable.",
    });
  }

  return {
    headline:
      "ATOS: Forensic guidance generated strictly from your platform data.",
    basedOn: {
      orgName: snapshot.orgName,
      stats,
      rulesVersion: "v1-deterministic",
    },
    actions,
    risks,
  };
}

