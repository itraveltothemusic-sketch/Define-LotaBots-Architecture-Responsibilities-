"use client";

import * as React from "react";
import { AlertTriangle, Brain, CircleCheck, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Guidance = {
  headline: string;
  basedOn: Record<string, unknown>;
  actions: { title: string; whyThisMatters: string; severity: "info" | "attention" | "critical" }[];
  risks: { title: string; rationale: string; severity: "info" | "attention" | "critical" }[];
};

function SeverityIcon({ severity }: { severity: Guidance["actions"][number]["severity"] }) {
  if (severity === "critical") return <AlertTriangle className="h-4 w-4 text-red-600" />;
  if (severity === "attention") return <AlertTriangle className="h-4 w-4 text-amber-600" />;
  return <CircleCheck className="h-4 w-4 text-emerald-600" />;
}

export function AtosPanel() {
  const [data, setData] = React.useState<Guidance | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    async function run() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/atos", { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = (await res.json()) as Guidance;
        if (!cancelled) setData(json);
      } catch (e) {
        if (!cancelled) setError("ATOS guidance is unavailable right now.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="rounded-lg border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-start justify-between gap-3 border-b border-zinc-200 p-4 dark:border-zinc-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm font-semibold tracking-tight">
            <Brain className="h-4 w-4" />
            ATOS Intelligence
          </div>
          <div className="text-xs text-zinc-600 dark:text-zinc-400">
            Data-bound guidance. No fabricated facts.
          </div>
        </div>
      </div>

      <div className="space-y-4 p-4">
        {loading ? (
          <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
            <Loader2 className="h-4 w-4 animate-spin" />
            Generating guidance from your platform data…
          </div>
        ) : error ? (
          <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-200">
            {error}
          </div>
        ) : data ? (
          <>
            <div className="text-sm text-zinc-700 dark:text-zinc-300">
              {data.headline}
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold uppercase tracking-wide text-zinc-600 dark:text-zinc-400">
                Next best actions
              </div>
              <div className="space-y-2">
                {data.actions.length ? (
                  data.actions.map((a) => (
                    <div
                      key={a.title}
                      className={cn(
                        "rounded-md border px-3 py-2",
                        a.severity === "critical"
                          ? "border-red-200 bg-red-50 dark:border-red-900/40 dark:bg-red-950/30"
                          : a.severity === "attention"
                            ? "border-amber-200 bg-amber-50 dark:border-amber-900/40 dark:bg-amber-950/30"
                            : "border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/30",
                      )}
                    >
                      <div className="flex items-start gap-2">
                        <div className="mt-0.5">
                          <SeverityIcon severity={a.severity} />
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                            {a.title}
                          </div>
                          <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                            {a.whyThisMatters}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-zinc-600 dark:text-zinc-400">
                    No actions right now.
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold uppercase tracking-wide text-zinc-600 dark:text-zinc-400">
                Risks & gaps
              </div>
              <div className="space-y-2">
                {data.risks.length ? (
                  data.risks.map((r) => (
                    <div
                      key={r.title}
                      className="rounded-md border border-zinc-200 bg-white px-3 py-2 dark:border-zinc-800 dark:bg-zinc-950"
                    >
                      <div className="flex items-start gap-2">
                        <div className="mt-0.5">
                          <SeverityIcon severity={r.severity} />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                            {r.title}
                          </div>
                          <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                            {r.rationale}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-zinc-600 dark:text-zinc-400">
                    No risks detected from current data.
                  </div>
                )}
              </div>
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
}

