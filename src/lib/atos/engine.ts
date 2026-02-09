import type {
  AtosGuidance,
  AtosModuleId,
  AtosPriority,
  CarrierInteraction,
  ComplianceCheckpoint,
  EvidenceItem,
  InspectionRecord,
  ScopeComparisonLine,
} from "@/types/domain";
import type {
  ContractorExecutionData,
  EquityOutcomeData,
  ForensicPropertyData,
  InsuranceIntelligenceData,
  IntelligenceCenterData,
} from "@/lib/data/repository";

interface AtosQuestionResult {
  answer: string;
  evidenceRefs: string[];
  confidence: number;
  limitations: string;
}

export interface AtosAnalysis {
  module: AtosModuleId;
  summary: string;
  guidance: AtosGuidance[];
}

function buildGuidance(
  module: AtosModuleId,
  priority: AtosPriority,
  insight: string,
  whyItMatters: string,
  recommendedAction: string,
  evidenceRefs: string[],
): AtosGuidance {
  return {
    id: `${module}-${priority}-${Math.random().toString(36).slice(2, 8)}`,
    module,
    priority,
    insight,
    whyItMatters,
    recommendedAction,
    evidenceRefs,
  };
}

const priorityRank: Record<AtosPriority, number> = {
  CRITICAL: 4,
  HIGH: 3,
  MEDIUM: 2,
  LOW: 1,
};

function sortGuidance(guidance: AtosGuidance[]) {
  return [...guidance].sort(
    (left, right) => priorityRank[right.priority] - priorityRank[left.priority],
  );
}

function getEvidenceIds(items: EvidenceItem[]) {
  return items.map((item) => item.id);
}

function getInspectionIds(items: InspectionRecord[]) {
  return items.map((item) => item.id);
}

function getCarrierInteractionIds(items: CarrierInteraction[]) {
  return items.map((item) => item.id);
}

function getScopeLineIds(items: ScopeComparisonLine[]) {
  return items.map((item) => item.id);
}

function getComplianceIds(items: ComplianceCheckpoint[]) {
  return items.map((item) => item.id);
}

function analyzeIntelligence(data: IntelligenceCenterData): AtosAnalysis {
  const payoutRatio = data.claim
    ? data.claim.approvedAmountUsd / data.claim.claimedAmountUsd
    : 0;
  const flaggedEvidence = data.evidence.filter(
    (item) => item.verificationStatus !== "VERIFIED",
  );
  const latestInspection = data.inspections[0];

  const guidance: AtosGuidance[] = [];

  if (latestInspection?.severity === "CRITICAL") {
    guidance.push(
      buildGuidance(
        "intelligence",
        "CRITICAL",
        "Latest forensic inspection remains in critical severity.",
        "Critical findings can materially impact claim defensibility and tenant continuity if remediation sequencing drifts.",
        "Lock a remediation milestone review within 48 hours and attach completion evidence to the claim packet.",
        [latestInspection.id],
      ),
    );
  }

  if (flaggedEvidence.length > 0) {
    guidance.push(
      buildGuidance(
        "intelligence",
        "HIGH",
        `${flaggedEvidence.length} evidence artifacts are not fully verified.`,
        "Unverified evidence weakens chain-of-custody confidence and can suppress carrier recovery outcomes.",
        "Prioritize metadata signing and affidavit reconciliation for all pending/flagged records.",
        getEvidenceIds(flaggedEvidence),
      ),
    );
  }

  if (data.claim && payoutRatio < 0.85) {
    guidance.push(
      buildGuidance(
        "intelligence",
        "HIGH",
        "Approved amount remains below expected recovery ratio.",
        "A sustained claim-to-approval delta usually indicates unresolved scope support or documentation gaps.",
        "Submit a targeted supplement focused on high-delta lines with peer-reviewed forensic support.",
        [data.claim.id],
      ),
    );
  }

  guidance.push(
    buildGuidance(
      "intelligence",
      "MEDIUM",
      "Portfolio confidence is strong but not fully converged.",
      "Confidence below full convergence suggests remaining uncertainty in either execution, payout, or evidence verification.",
      "Use weekly ATOS checkpoint reviews until weighted confidence crosses 0.95.",
      [data.focusProperty.id],
    ),
  );

  return {
    module: "intelligence",
    summary: `${data.focusProperty.label} is in ${data.focusProperty.status.toLowerCase()} mode with ${data.snapshot.unresolvedEvidenceCount} unresolved evidence items and ${Math.round(payoutRatio * 100)}% claim recovery realization.`,
    guidance: sortGuidance(guidance),
  };
}

function analyzeForensicProperty(data: ForensicPropertyData): AtosAnalysis {
  const pendingEvidence = data.evidenceQueue.length;
  const unreviewedInspections = data.inspections.filter((item) => !item.isPeerReviewed);
  const highestLossClass = data.damageClassification[0];

  const guidance: AtosGuidance[] = [];

  if (pendingEvidence > 0) {
    guidance.push(
      buildGuidance(
        "forensic-property",
        "HIGH",
        "Evidence queue has unresolved verification items.",
        "Each unresolved artifact delays forensic certainty and can reduce scope leverage during claim negotiation.",
        "Drive verification completion in chronological order to preserve evidentiary continuity.",
        getEvidenceIds(data.evidenceQueue),
      ),
    );
  }

  if (unreviewedInspections.length > 0) {
    guidance.push(
      buildGuidance(
        "forensic-property",
        "MEDIUM",
        "At least one inspection lacks peer review.",
        "Peer review increases defensibility when scope assumptions are challenged by carriers.",
        "Assign independent review to all non-reviewed inspections before final scope lock.",
        getInspectionIds(unreviewedInspections),
      ),
    );
  }

  if (highestLossClass) {
    guidance.push(
      buildGuidance(
        "forensic-property",
        "MEDIUM",
        `${highestLossClass.category} is currently the highest-loss damage class.`,
        "Concentrating investigative depth on dominant loss classes improves payout probability and workstream prioritization.",
        "Attach forensic exhibits and code references directly to this damage class in the claim package.",
        [highestLossClass.category],
      ),
    );
  }

  return {
    module: "forensic-property",
    summary: `Forensic pipeline tracks ${data.inspections.length} inspections across ${data.properties.length} assets. ${pendingEvidence} evidence records require verification action.`,
    guidance: sortGuidance(guidance),
  };
}

function analyzeInsuranceIntelligence(data: InsuranceIntelligenceData): AtosAnalysis {
  const followUpInteractions = data.carrierInteractions.filter(
    (interaction) => interaction.requiresFollowUp,
  );
  const missingLineItems = data.scopeComparisons.filter(
    (line) =>
      line.discrepancyType === "MISSING_LINE_ITEM" ||
      line.discrepancyType === "CODE_UPGRADE_OMITTED",
  );

  const guidance: AtosGuidance[] = [];

  if (data.discrepancyExposureUsd > 500_000) {
    guidance.push(
      buildGuidance(
        "insurance-intelligence",
        "CRITICAL",
        `Scope discrepancy exposure is ${toCurrency(data.discrepancyExposureUsd)}.`,
        "Large unresolved scope deltas are a direct predictor of claim under-recovery.",
        "Escalate discrepancy package with line-by-line evidentiary references and executive negotiation memo.",
        getScopeLineIds(data.scopeComparisons),
      ),
    );
  }

  if (missingLineItems.length > 0) {
    guidance.push(
      buildGuidance(
        "insurance-intelligence",
        "HIGH",
        `${missingLineItems.length} scope lines are omitted or code-upgrade related.`,
        "Omitted lines frequently become permanent value leakage if not challenged before closure milestones.",
        "Submit a supplemental estimate focused on code-triggered obligations and omitted items.",
        getScopeLineIds(missingLineItems),
      ),
    );
  }

  if (followUpInteractions.length > 0) {
    guidance.push(
      buildGuidance(
        "insurance-intelligence",
        "MEDIUM",
        `${followUpInteractions.length} carrier interactions require owner follow-up.`,
        "Delayed responses weaken negotiation posture and can shift timelines beyond favorable adjustment windows.",
        "Enforce a 24-hour SLA for all open follow-ups and log resulting commitments.",
        getCarrierInteractionIds(followUpInteractions),
      ),
    );
  }

  return {
    module: "insurance-intelligence",
    summary: `Insurance module tracks ${data.claims.length} active claims with ${toCurrency(data.discrepancyExposureUsd)} discrepancy exposure.`,
    guidance: sortGuidance(guidance),
  };
}

function analyzeContractorExecution(data: ContractorExecutionData): AtosAnalysis {
  const incompleteOnboarding = data.contractors.filter(
    (contractor) => contractor.onboardingStatus !== "VERIFIED",
  );
  const failedCompliance = data.compliance.filter((item) => item.status === "FAILED");
  const openCompliance = data.compliance.filter((item) => item.status === "OPEN");

  const guidance: AtosGuidance[] = [];

  if (failedCompliance.length > 0) {
    guidance.push(
      buildGuidance(
        "contractor-execution",
        "HIGH",
        `${failedCompliance.length} compliance checkpoints are failed.`,
        "Failed checkpoints can invalidate billing support and expose the owner to avoidable risk.",
        "Pause payout progression for affected assignments until corrective evidence is verified.",
        getComplianceIds(failedCompliance),
      ),
    );
  }

  if (incompleteOnboarding.length > 0) {
    guidance.push(
      buildGuidance(
        "contractor-execution",
        "MEDIUM",
        `${incompleteOnboarding.length} contractor records are not fully verified.`,
        "Incomplete onboarding increases execution and liability risk during accelerated restoration windows.",
        "Close license and insurance validation gaps before assigning additional scope.",
        incompleteOnboarding.map((item) => item.id),
      ),
    );
  }

  if (openCompliance.length > 0) {
    guidance.push(
      buildGuidance(
        "contractor-execution",
        "MEDIUM",
        `${openCompliance.length} compliance checkpoints remain open.`,
        "Open checkpoints reduce confidence in progress verification and schedule predictability.",
        "Timebox open checkpoints with assignment-level owners and deadline enforcement.",
        getComplianceIds(openCompliance),
      ),
    );
  }

  return {
    module: "contractor-execution",
    summary: `Execution layer is managing ${data.assignments.length} assignments across ${data.contractors.length} contractors, with ${failedCompliance.length + openCompliance.length} compliance risks open.`,
    guidance: sortGuidance(guidance),
  };
}

function analyzeEquityOutcome(data: EquityOutcomeData): AtosAnalysis {
  const underRecovered = data.outcomes.filter(
    (outcome) => outcome.claimPaidUsd < outcome.claimRequestedUsd,
  );
  const outOfPocketHeavy = data.outcomes.filter((outcome) => {
    const delta = outcome.claimRequestedUsd - outcome.claimPaidUsd;
    return delta > 500_000;
  });

  const guidance: AtosGuidance[] = [];

  if (outOfPocketHeavy.length > 0) {
    guidance.push(
      buildGuidance(
        "equity-outcome",
        "HIGH",
        `${outOfPocketHeavy.length} assets are carrying significant out-of-pocket claim deltas.`,
        "Persistent unrecovered spend suppresses realized equity gains and can distort capital planning.",
        "Prioritize supplementary recovery actions before final closeout narratives are published.",
        outOfPocketHeavy.map((item) => item.id),
      ),
    );
  }

  if (underRecovered.length > 0) {
    guidance.push(
      buildGuidance(
        "equity-outcome",
        "MEDIUM",
        "Portfolio recovery remains below requested claim value.",
        "Carrier under-recovery directly affects net equity realization and investor confidence.",
        "Document root-cause by line-item category and align next negotiation cycle to highest-value gaps.",
        underRecovered.map((item) => item.id),
      ),
    );
  }

  guidance.push(
    buildGuidance(
      "equity-outcome",
      "LOW",
      "Equity trajectory remains positive across tracked assets.",
      "Positive valuation movement demonstrates the value of forensic-guided execution and disciplined claim management.",
      "Continue publishing confidence-scored narrative reports at each milestone gate.",
      data.reports.map((report) => report.id),
    ),
  );

  return {
    module: "equity-outcome",
    summary: `Portfolio equity gain is ${toCurrency(data.aggregateGainUsd)} with a current carrier delta of ${toCurrency(data.aggregateCarrierDeltaUsd)}.`,
    guidance: sortGuidance(guidance),
  };
}

export function analyzeModule(module: AtosModuleId, moduleData: unknown): AtosAnalysis {
  if (module === "intelligence") {
    return analyzeIntelligence(moduleData as IntelligenceCenterData);
  }
  if (module === "forensic-property") {
    return analyzeForensicProperty(moduleData as ForensicPropertyData);
  }
  if (module === "insurance-intelligence") {
    return analyzeInsuranceIntelligence(moduleData as InsuranceIntelligenceData);
  }
  if (module === "contractor-execution") {
    return analyzeContractorExecution(moduleData as ContractorExecutionData);
  }
  return analyzeEquityOutcome(moduleData as EquityOutcomeData);
}

function toCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function answerQuestion(
  module: AtosModuleId,
  question: string,
  analysis: AtosAnalysis,
): AtosQuestionResult {
  const normalized = question.toLowerCase();

  if (normalized.includes("risk")) {
    const highest = analysis.guidance[0];
    if (highest) {
      return {
        answer: `Highest current risk: ${highest.insight} Why it matters: ${highest.whyItMatters}`,
        evidenceRefs: highest.evidenceRefs,
        confidence: 0.88,
        limitations:
          "Assessment is limited to platform records currently loaded in this workspace.",
      };
    }
  }

  if (normalized.includes("why") || normalized.includes("matter")) {
    const topTwo = analysis.guidance.slice(0, 2);
    return {
      answer: topTwo
        .map(
          (item, index) =>
            `${index + 1}. ${item.insight} This matters because ${item.whyItMatters}`,
        )
        .join(" "),
      evidenceRefs: topTwo.flatMap((item) => item.evidenceRefs),
      confidence: 0.85,
      limitations:
        "ATOS explanations are evidence-driven and do not include assumptions outside stored records.",
    };
  }

  if (normalized.includes("next step") || normalized.includes("next action")) {
    const top = analysis.guidance.slice(0, 3);
    return {
      answer: top
        .map((item, index) => `${index + 1}. ${item.recommendedAction}`)
        .join(" "),
      evidenceRefs: top.flatMap((item) => item.evidenceRefs),
      confidence: 0.9,
      limitations:
        "Recommended actions are prioritized from current system status and may change with new evidence.",
    };
  }

  return {
    answer: `${analysis.summary} Top action: ${analysis.guidance[0]?.recommendedAction ?? "Review module records."}`,
    evidenceRefs: analysis.guidance[0]?.evidenceRefs ?? [],
    confidence: 0.8,
    limitations:
      "Response is generated strictly from available platform data and may omit external facts.",
  };
}
