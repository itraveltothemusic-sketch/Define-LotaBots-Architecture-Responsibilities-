export type AtosGuidanceSeverity = "critical" | "warning" | "info";

export type AtosAction = {
  label: string;
  rationale: string;
};

export type AtosGuidanceItem = {
  id: string;
  severity: AtosGuidanceSeverity;
  title: string;
  whyThisMatters: string;
  groundedFacts: string[];
  recommendedActions: AtosAction[];
};

