import type { EvidenceItem } from "@/server/demo/property-cases";

function typeBadge(type: EvidenceItem["type"]): { label: string; color: string } {
  switch (type) {
    case "PHOTO":
      return { label: "Photo", color: "bg-cyan-400/10 text-cyan-200 ring-cyan-400/20" };
    case "VIDEO":
      return { label: "Video", color: "bg-violet-400/10 text-violet-200 ring-violet-400/20" };
    case "DOCUMENT":
      return { label: "Document", color: "bg-amber-400/10 text-amber-200 ring-amber-400/20" };
    case "MEASUREMENT":
      return { label: "Measurement", color: "bg-emerald-400/10 text-emerald-200 ring-emerald-400/20" };
    case "NOTE":
      return { label: "Note", color: "bg-white/5 text-zinc-200 ring-white/10" };
  }
}

export function EvidenceTimeline(props: { items: EvidenceItem[] }) {
  const items = [...props.items].sort(
    (a, b) => Date.parse(b.capturedAt) - Date.parse(a.capturedAt),
  );

  return (
    <div className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
      <div className="text-xs font-semibold uppercase tracking-wide text-zinc-300">
        Evidence & documentation timeline
      </div>
      <h2 className="mt-2 text-xl font-semibold tracking-tight text-zinc-50">
        Chain-of-context view
      </h2>
      <p className="mt-2 text-sm leading-6 text-zinc-300">
        This timeline is the defensible narrative backbone: who captured what,
        when, and why it matters.
      </p>

      <ol className="mt-6 space-y-3">
        {items.map((e) => {
          const badge = typeBadge(e.type);
          return (
            <li
              key={e.id}
              className="rounded-2xl bg-black/30 p-4 ring-1 ring-white/10"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${badge.color}`}
                >
                  {badge.label}
                </span>
                <div className="text-sm font-semibold text-zinc-100">{e.title}</div>
              </div>
              <div className="mt-2 text-xs text-zinc-400">
                Captured {new Date(e.capturedAt).toLocaleString()} by{" "}
                <span className="font-semibold text-zinc-200">{e.capturedBy.name}</span>{" "}
                ({e.capturedBy.role})
              </div>
              {e.notes ? (
                <div className="mt-3 text-sm leading-6 text-zinc-200">
                  {e.notes}
                </div>
              ) : null}
              <div className="mt-3 flex flex-wrap gap-2">
                {e.tags.map((t) => (
                  <span
                    key={`${e.id}-${t}`}
                    className="rounded-full bg-white/5 px-2.5 py-1 text-xs font-semibold text-zinc-200 ring-1 ring-white/10"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

