import type { PropertyCase } from "@/server/demo/property-cases";

export function PropertyOverviewCard(props: { caseData: PropertyCase }) {
  const c = props.caseData;
  return (
    <div className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
      <div className="text-xs font-semibold uppercase tracking-wide text-zinc-300">
        Property overview
      </div>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-50">
        {c.name}
      </h1>
      <div className="mt-2 text-sm text-zinc-300">{c.address}</div>

      <div className="mt-6 grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl bg-black/30 p-4 ring-1 ring-white/10">
          <div className="text-xs font-semibold uppercase tracking-wide text-zinc-300">
            Peril
          </div>
          <div className="mt-2 text-sm font-semibold text-zinc-100">
            {c.event.peril}
          </div>
        </div>
        <div className="rounded-2xl bg-black/30 p-4 ring-1 ring-white/10">
          <div className="text-xs font-semibold uppercase tracking-wide text-zinc-300">
            Reported loss date
          </div>
          <div className="mt-2 text-sm font-semibold text-zinc-100">
            {new Date(c.event.reportedLossDate).toDateString()}
          </div>
        </div>
        <div className="rounded-2xl bg-black/30 p-4 ring-1 ring-white/10">
          <div className="text-xs font-semibold uppercase tracking-wide text-zinc-300">
            Workflow status
          </div>
          <div className="mt-2 text-sm font-semibold text-zinc-100">
            {c.status}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div className="text-xs font-semibold uppercase tracking-wide text-zinc-300">
          Known facts (structured)
        </div>
        <dl className="mt-3 grid gap-3 md:grid-cols-2">
          {c.facts.map((f) => (
            <div
              key={f.id}
              className="rounded-2xl bg-black/30 p-4 ring-1 ring-white/10"
            >
              <dt className="text-xs font-semibold text-zinc-300">{f.label}</dt>
              <dd className="mt-1 text-sm text-zinc-100">{f.value}</dd>
              {f.sourceEvidenceId ? (
                <div className="mt-2 text-xs text-zinc-400">
                  Source evidence: {f.sourceEvidenceId}
                </div>
              ) : null}
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

