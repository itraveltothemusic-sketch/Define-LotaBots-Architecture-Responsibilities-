import { AlertTriangle, Info, Siren } from "lucide-react";

import { Card } from "@/components/ui/card";
import type { AtosGuidanceItem } from "@/modules/atos/types";
import { cn } from "@/lib/cn";

function severityIcon(sev: AtosGuidanceItem["severity"]) {
  switch (sev) {
    case "critical":
      return Siren;
    case "warning":
      return AlertTriangle;
    case "info":
    default:
      return Info;
  }
}

function severityStyles(sev: AtosGuidanceItem["severity"]) {
  switch (sev) {
    case "critical":
      return "border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-200";
    case "warning":
      return "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200";
    case "info":
    default:
      return "border-zinc-200 bg-white text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100";
  }
}

export function AtosPanel({ guidance }: { guidance: AtosGuidanceItem[] }) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold tracking-tight">ATOS</div>
          <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Forensic guidance grounded in current case data.
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {guidance.length === 0 ? (
          <div className="text-sm text-zinc-600 dark:text-zinc-400">
            No guidance to surface right now. Add evidence or update the property case file to unlock next actions.
          </div>
        ) : (
          guidance.map((g) => {
            const Icon = severityIcon(g.severity);
            return (
              <div key={g.id} className={cn("rounded-2xl border p-3", severityStyles(g.severity))}>
                <div className="flex items-start gap-2">
                  <div className="mt-0.5 grid size-8 place-items-center rounded-xl bg-white/60 text-current dark:bg-black/20">
                    <Icon className="size-4" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold leading-6">{g.title}</div>
                    <div className="mt-1 text-sm opacity-90">{g.whyThisMatters}</div>
                  </div>
                </div>

                <div className="mt-3 space-y-2">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wide opacity-80">
                      Grounded facts
                    </div>
                    <ul className="mt-1 list-inside list-disc text-xs opacity-90">
                      {g.groundedFacts.map((f, idx) => (
                        <li key={idx}>{f}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wide opacity-80">
                      Recommended actions
                    </div>
                    <ul className="mt-1 space-y-1 text-xs opacity-90">
                      {g.recommendedActions.map((a, idx) => (
                        <li key={idx}>
                          <span className="font-semibold">{a.label}</span>
                          <span className="opacity-80"> — {a.rationale}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
}

