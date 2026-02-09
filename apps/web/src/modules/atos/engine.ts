import type { IntelligenceSnapshot } from "@/modules/intelligence-center/types";
import type { AtosGuidanceItem, AtosGuidanceSeverity } from "@/modules/atos/types";

function rank(sev: AtosGuidanceSeverity) {
  switch (sev) {
    case "critical":
      return 0;
    case "warning":
      return 1;
    case "info":
    default:
      return 2;
  }
}

/**
 * ATOS Guidance Engine (deterministic, inspectable).
 *
 * This is intentionally NOT model-based yet. It produces guidance only from provided data,
 * and it returns "groundedFacts" to make reasoning auditable.
 *
 * As the platform evolves, an LLM layer can *augment* this output (language, prioritization)
 * but must never invent facts beyond grounded facts.
 */
export function deriveAtosGuidance(snapshot: IntelligenceSnapshot): AtosGuidanceItem[] {
  const items: AtosGuidanceItem[] = [];

  if (snapshot.mode === "stub") {
    items.push({
      id: "mode-stub",
      severity: "warning",
      title: "You are viewing stub data (non-authoritative)",
      whyThisMatters:
        "Forensic workflows require verification and provenance. Stub data is useful for UI scaffolding, but it must never be treated as case truth.",
      groundedFacts: ["Snapshot mode: stub (DATABASE_URL not configured)"],
      recommendedActions: [
        {
          label: "Configure DATABASE_URL (Neon Postgres) and run migrations",
          rationale: "Enables real case data, evidence integrity, and audit-ready workflows.",
        },
      ],
    });
  }

  if (!snapshot.property) {
    items.push({
      id: "no-property",
      severity: "critical",
      title: "No property case file selected/available",
      whyThisMatters:
        "Insurance and execution work must be anchored to a specific property. Without a case file, evidence cannot be attributed and timelines cannot be defended.",
      groundedFacts: ["Property: null"],
      recommendedActions: [
        {
          label: "Create a property case file (name + address + stakeholders)",
          rationale: "Establishes the canonical identity for evidence, inspections, and claim tracking.",
        },
      ],
    });
    return items.sort((a, b) => rank(a.severity) - rank(b.severity));
  }

  const evidenceCount = snapshot.evidence.length;
  const unverifiedCount = snapshot.evidence.filter((e) => e.verificationStatus === "UNVERIFIED").length;
  const rejectedCount = snapshot.evidence.filter((e) => e.verificationStatus === "REJECTED").length;
  const docCount = snapshot.evidence.filter((e) => e.type === "DOCUMENT").length;
  const photoCount = snapshot.evidence.filter((e) => e.type === "PHOTO").length;
  const videoCount = snapshot.evidence.filter((e) => e.type === "VIDEO").length;

  if (!snapshot.property.addressLine1 || !snapshot.property.city || !snapshot.property.region) {
    items.push({
      id: "missing-address",
      severity: "warning",
      title: "Property address is incomplete",
      whyThisMatters:
        "Carrier correspondence, inspection scheduling, and report credibility depend on complete property identity. Incomplete addresses create avoidable friction and documentation risk.",
      groundedFacts: [
        `addressLine1: ${snapshot.property.addressLine1 ?? "missing"}`,
        `city: ${snapshot.property.city ?? "missing"}`,
        `region: ${snapshot.property.region ?? "missing"}`,
      ],
      recommendedActions: [
        {
          label: "Capture full address (line1, city, region/state, postal code)",
          rationale: "Improves downstream claim documents, reports, and case defensibility.",
        },
      ],
    });
  }

  if (evidenceCount === 0) {
    items.push({
      id: "no-evidence",
      severity: "critical",
      title: "No evidence captured yet",
      whyThisMatters:
        "Without time-stamped evidence, the claim position is weak and execution cannot be verified. Evidence is the foundation of scope accuracy and payout leverage.",
      groundedFacts: ["Evidence items: 0"],
      recommendedActions: [
        {
          label: "Upload initial damage photos/videos (wide + close + context)",
          rationale: "Establishes a defensible baseline for damage extent and severity.",
        },
        {
          label: "Add an inspection note summarizing observed damage and next steps",
          rationale: "Creates an explainable narrative tied to evidence artifacts.",
        },
      ],
    });
  } else {
    if (unverifiedCount > 0) {
      items.push({
        id: "unverified-evidence",
        severity: "warning",
        title: "Evidence verification is incomplete",
        whyThisMatters:
          "Unverified artifacts reduce trust. Verification is how the platform distinguishes 'uploaded' from 'defensible'.",
        groundedFacts: [`Evidence items: ${evidenceCount}`, `Unverified: ${unverifiedCount}`, `Rejected: ${rejectedCount}`],
        recommendedActions: [
          {
            label: "Verify provenance for key artifacts (capture time, source, integrity)",
            rationale: "Raises confidence for adjuster review and formal reporting.",
          },
        ],
      });
    }

    if (photoCount + videoCount === 0) {
      items.push({
        id: "no-media",
        severity: "warning",
        title: "No photo/video media evidence found",
        whyThisMatters:
          "Media is typically the fastest path to establishing visible damage patterns and supporting scope items.",
        groundedFacts: [`Photos: ${photoCount}`, `Videos: ${videoCount}`],
        recommendedActions: [
          {
            label: "Add photo/video captures for each affected area",
            rationale: "Supports classification, scope justification, and claim defensibility.",
          },
        ],
      });
    }

    if (docCount === 0) {
      items.push({
        id: "no-documents",
        severity: "info",
        title: "No key claim documents attached yet",
        whyThisMatters:
          "Policy and claim documents anchor coverage terms, timelines, and carrier positions. Missing docs delay discrepancy detection and negotiation leverage.",
        groundedFacts: [`Document evidence items: ${docCount}`],
        recommendedActions: [
          {
            label: "Attach policy declarations + claim acknowledgement + adjuster estimate",
            rationale: "Enables scope comparison and precise lifecycle tracking.",
          },
        ],
      });
    }
  }

  return items.sort((a, b) => rank(a.severity) - rank(b.severity));
}

