import type { AtosGuidance } from "@/types/domain";
import { StatusBadge } from "@/components/ui/status-badge";

function toTone(severity: AtosGuidance["severity"]) {
  switch (severity) {
    case "critical":
      return "critical";
    case "high":
      return "danger";
    case "medium":
      return "warning";
    case "low":
      return "info";
  }
}

export function GuidanceList({ guidance }: { guidance: AtosGuidance[] }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <header className="flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-slate-900">ATOS Priority Guidance</h2>
        <span className="text-xs text-slate-500">
          Deterministic recommendations from verified records
        </span>
      </header>
      <div className="mt-4 space-y-4">
        {guidance.map((entry) => (
          <article
            key={entry.id}
            className="rounded-xl border border-slate-200 bg-slate-50 p-4"
          >
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-slate-900">{entry.title}</h3>
              <StatusBadge
                label={entry.severity.toUpperCase()}
                tone={toTone(entry.severity)}
              />
            </div>
            <p className="mt-2 text-sm text-slate-700">{entry.whyThisMatters}</p>
            <p className="mt-3 text-sm text-slate-800">
              <span className="font-semibold text-slate-900">Recommended action:</span>{" "}
              {entry.recommendation}
            </p>
            <p className="mt-2 text-xs text-slate-500">
              Confidence {(entry.confidenceScore * 100).toFixed(0)}%
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
