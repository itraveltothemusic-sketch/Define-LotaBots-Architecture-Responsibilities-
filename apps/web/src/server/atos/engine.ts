import { z } from "zod";
import type { PropertyCase } from "@/server/demo/property-cases";

/**
 * ATOS is not a chatbot. This engine intentionally stays deterministic and
 * explainable: it only reasons from structured inputs we already have.
 *
 * In production, this module becomes the "policy layer" around any ML/LLM calls:
 * it enforces citations, identifies missing evidence, and blocks unsupported claims.
 */

export const AtosQuestionSchema = z.object({
  question: z.string().min(1).max(500),
});

export type AtosGuidance = {
  summary: string;
  whyThisMatters: string;
  risks: string[];
  gaps: string[];
  opportunities: string[];
  nextBestActions: Array<{ action: string; rationale: string }>;
  factsUsed: Array<{ fact: string; evidenceId?: string }>;
  limitations: string[];
  answer?: string;
};

function hasTag(caseData: PropertyCase, tag: string): boolean {
  return caseData.evidence.some((e) => e.tags.includes(tag));
}

function evidenceCountByType(caseData: PropertyCase): Record<string, number> {
  return caseData.evidence.reduce<Record<string, number>>((acc, e) => {
    acc[e.type] = (acc[e.type] ?? 0) + 1;
    return acc;
  }, {});
}

export function generateAtosGuidance(input: {
  caseData: PropertyCase;
  question?: string;
}): AtosGuidance {
  const { caseData, question } = input;
  const counts = evidenceCountByType(caseData);

  const factsUsed: AtosGuidance["factsUsed"] = [
    { fact: `Peril: ${caseData.event.peril}` },
    { fact: `Reported loss date: ${new Date(caseData.event.reportedLossDate).toDateString()}` },
    { fact: `Workflow status: ${caseData.status}` },
    { fact: `Evidence items: ${caseData.evidence.length}` },
  ];

  const gaps: string[] = [];
  const risks: string[] = [];
  const opportunities: string[] = [];
  const nextBestActions: AtosGuidance["nextBestActions"] = [];

  // Evidence completeness checks (forensic hygiene).
  if ((counts.MEASUREMENT ?? 0) === 0) {
    gaps.push("No measurements captured (dimensions, impact sizes, slopes, or reference scale).");
    nextBestActions.push({
      action: "Capture measurement-grade evidence (scale reference + close-ups + context shots).",
      rationale:
        "Measurements convert visual claims into defensible, repeatable facts and reduce dispute surface area.",
    });
  }

  if (!hasTag(caseData, "context") && caseData.evidence.length > 0) {
    gaps.push("Limited context shots; evidence may be challenged as non-attributable to location.");
    nextBestActions.push({
      action: "Add contextual photos that tie damage to elevations/areas (wide→medium→close).",
      rationale:
        "Context links detail evidence to the property, reducing ambiguity and denial risk.",
    });
  }

  if (caseData.event.peril === "HAIL" && !hasTag(caseData, "weather")) {
    gaps.push("No weather support evidence tagged for hail event verification.");
    nextBestActions.push({
      action: "Attach verified weather documentation and align it to reported loss date.",
      rationale:
        "Event verification supports causation and timing—two primary claim contention points.",
    });
  }

  // Stage-aware guidance.
  switch (caseData.status) {
    case "INTAKE": {
      nextBestActions.push({
        action: "Lock intake facts: who observed what, when, and first notice-of-loss timeline.",
        rationale:
          "Early contradictions weaken credibility; structured intake stabilizes the narrative.",
      });
      break;
    }
    case "INSPECTION": {
      opportunities.push("Convert inspection findings into a structured damage classification set.");
      nextBestActions.push({
        action: "Run a forensic inspection checklist (roof, HVAC, exterior metals, water ingress).",
        rationale:
          "A consistent checklist prevents missed items that later become unrecoverable or disputed.",
      });
      break;
    }
    case "CLAIM": {
      risks.push("If scope is not reconciled, partial estimates can understate replacement/repair needs.");
      nextBestActions.push({
        action: "Perform scope comparison: your evidence-driven scope vs carrier estimate.",
        rationale:
          "Delta analysis identifies discrepancies that directly translate into recoverable value.",
      });
      break;
    }
    case "EXECUTION": {
      risks.push("Unverified work progress can create compliance and payout timing issues.");
      nextBestActions.push({
        action: "Set verification checkpoints (photo logs + dated milestones + materials receipts).",
        rationale:
          "Verified execution protects claim supplements and supports final reconciliation.",
      });
      break;
    }
    case "OUTCOME": {
      opportunities.push("Produce an equity narrative with defensible before/after valuation links.");
      nextBestActions.push({
        action: "Generate an outcome report: claim vs payout delta, valuation impact, evidence appendix.",
        rationale:
          "A defensible narrative turns a payout into an investable, reviewable equity outcome.",
      });
      break;
    }
  }

  // Causation + timing hygiene.
  if (!hasTag(caseData, "loss_date")) {
    risks.push("Loss-date alignment is not explicitly evidenced; timing disputes are common.");
  }

  // Build an answer that refuses unsupported claims.
  let answer: string | undefined;
  if (question) {
    const q = question.toLowerCase();
    if (q.includes("what is missing") || q.includes("gaps")) {
      answer =
        gaps.length > 0
          ? `Gaps detected: ${gaps.join(" ")}`
          : "Based on the currently provided evidence set, I do not detect obvious gaps. Continue adding measurements and corroborating documentation as appropriate.";
    } else if (q.includes("next") || q.includes("what should we do")) {
      answer =
        nextBestActions.length > 0
          ? `Next best actions: ${nextBestActions
              .slice(0, 3)
              .map((a) => a.action)
              .join(" ")}`
          : "No next-best actions generated from the provided facts. Add more structured inputs (scope, measurements, timeline) to unlock guidance.";
    } else if (q.includes("prove") || q.includes("evidence")) {
      answer =
        caseData.evidence.length > 0
          ? `Available evidence items: ${caseData.evidence
              .slice(0, 5)
              .map((e) => `${e.type}: ${e.title}`)
              .join(" | ")}`
          : "No evidence has been provided yet. Capture dated photos/videos and supporting documents before making any conclusions.";
    } else {
      answer =
        "I can only answer from the evidence and structured facts currently captured. Ask about gaps, next actions, or what evidence supports a specific claim.";
    }
  }

  const summary = `ATOS review: ${caseData.name} is in ${caseData.status} with ${caseData.evidence.length} evidence item(s).`;
  const whyThisMatters =
    "Claims and outcome narratives fail when facts cannot be verified. ATOS focuses on turning observations into defensible, attributable evidence.";

  const limitations = [
    "ATOS guidance is limited to the provided evidence and structured facts.",
    "No external data sources are queried in demo mode.",
    "Do not treat guidance as an assertion of damage causation without measurement-grade support.",
  ];

  return {
    summary,
    whyThisMatters,
    risks,
    gaps,
    opportunities,
    nextBestActions,
    factsUsed,
    limitations,
    answer,
  };
}

