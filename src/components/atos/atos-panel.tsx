import { Sparkles, TriangleAlert } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardTitle } from "@/components/ui/card";
import type { AtosGuidance } from "@/types/domain";

const confidenceLabelMap = {
  grounded: { text: "Grounded in current record", variant: "success" as const },
  partial: { text: "Partial record coverage", variant: "warning" as const },
  "insufficient-evidence": { text: "Insufficient evidence", variant: "danger" as const },
};

interface AtosPanelProps {
  guidance: AtosGuidance;
}

export function AtosPanel({ guidance }: AtosPanelProps) {
  const confidence = confidenceLabelMap[guidance.confidenceLabel];

  return (
    <Card className="h-full border-sky-200/70 bg-gradient-to-b from-sky-50/80 to-white dark:border-sky-900/60 dark:from-slate-950 dark:to-slate-950">
      <CardTitle
        title="ATOS Intelligence Advisor"
        subtitle="Forensic guidance anchored in current evidence and workflow state."
        trailing={<Badge label={confidence.text} variant={confidence.variant} />}
      />

      <div className="space-y-5 text-sm text-slate-700 dark:text-slate-300">
        <section>
          <p className="font-semibold text-slate-900 dark:text-white">Why this matters</p>
          <p className="mt-1 leading-relaxed">{guidance.whyItMatters}</p>
        </section>

        <section>
          <p className="inline-flex items-center gap-2 font-semibold text-rose-700 dark:text-rose-300">
            <TriangleAlert className="size-4" />
            Risks surfaced
          </p>
          <ul className="mt-2 space-y-2">
            {guidance.risks.map((risk) => (
              <li key={risk} className="rounded-lg border border-rose-200/70 bg-rose-50/60 p-2 dark:border-rose-900/60 dark:bg-rose-950/30">
                {risk}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <p className="inline-flex items-center gap-2 font-semibold text-emerald-700 dark:text-emerald-300">
            <Sparkles className="size-4" />
            Opportunities
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {guidance.opportunities.map((opportunity) => (
              <li key={opportunity}>{opportunity}</li>
            ))}
          </ul>
        </section>

        <section>
          <p className="font-semibold text-slate-900 dark:text-white">Recommended actions</p>
          <ol className="mt-2 list-decimal space-y-2 pl-5">
            {guidance.recommendedActions.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </section>
      </div>
    </Card>
  );
}
