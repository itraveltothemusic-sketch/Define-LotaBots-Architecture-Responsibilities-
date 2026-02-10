import type { AtosBrief } from "@/types/domain";

const priorityStyle: Record<AtosBrief["recommendations"][number]["priority"], string> =
  {
    critical: "bg-rose-100 text-rose-700",
    high: "bg-amber-100 text-amber-700",
    medium: "bg-sky-100 text-sky-700",
  };

interface AtosPanelProps {
  brief: AtosBrief;
}

export function AtosPanel({ brief }: AtosPanelProps) {
  return (
    <section className="rounded-xl border border-cyan-200 bg-cyan-50/40 p-5">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">
          ATOS Intelligence
        </p>
        <h2 className="mt-2 text-lg font-semibold text-slate-900">
          {brief.summary}
        </h2>
        <p className="mt-2 text-sm text-slate-700">{brief.whyItMatters}</p>
      </header>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <article className="rounded-lg border border-slate-200 bg-white p-4">
          <h3 className="text-sm font-semibold text-slate-800">Risks surfaced</h3>
          <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-slate-700">
            {brief.risks.length > 0 ? (
              brief.risks.map((risk) => <li key={risk}>{risk}</li>)
            ) : (
              <li>No active risk flags from current verified dataset.</li>
            )}
          </ul>
        </article>
        <article className="rounded-lg border border-slate-200 bg-white p-4">
          <h3 className="text-sm font-semibold text-slate-800">Opportunities</h3>
          <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-slate-700">
            {brief.opportunities.map((opportunity) => (
              <li key={opportunity}>{opportunity}</li>
            ))}
          </ul>
        </article>
      </div>

      <article className="mt-4 rounded-lg border border-slate-200 bg-white p-4">
        <h3 className="text-sm font-semibold text-slate-800">
          Recommended next actions
        </h3>
        <ul className="mt-3 space-y-3">
          {brief.recommendations.map((recommendation) => (
            <li
              key={`${recommendation.priority}-${recommendation.action}`}
              className="rounded-lg border border-slate-100 bg-slate-50 p-3"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase ${priorityStyle[recommendation.priority]}`}
                >
                  {recommendation.priority}
                </span>
                <p className="text-sm font-semibold text-slate-800">
                  {recommendation.action}
                </p>
              </div>
              <p className="mt-2 text-sm text-slate-600">
                {recommendation.rationale}
              </p>
            </li>
          ))}
        </ul>
      </article>

      <p className="mt-4 text-xs font-medium text-slate-600">
        Evidence confidence: {brief.evidenceConfidence}%
      </p>
    </section>
  );
}
