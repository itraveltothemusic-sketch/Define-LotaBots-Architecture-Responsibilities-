import type { EvidenceItem } from "@/types/domain";
import { formatDate } from "@/lib/utils/format";
import { StatusBadge } from "@/components/ui/status-badge";

function getTone(status: EvidenceItem["verificationStatus"]) {
  switch (status) {
    case "Verified":
      return "success";
    case "Pending":
      return "warning";
    case "Flagged":
      return "danger";
  }
}

export function EvidenceTimeline({ items }: { items: EvidenceItem[] }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <header className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-900">
          Evidence & Documentation Timeline
        </h2>
        <span className="text-xs text-slate-500">Chain-of-custody aware</span>
      </header>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={item.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                <p className="text-xs text-slate-600">
                  {item.type.toUpperCase()} • {item.fileCount} file(s) • Captured by{" "}
                  {item.capturedBy}
                </p>
              </div>
              <StatusBadge label={item.verificationStatus} tone={getTone(item.verificationStatus)} />
            </div>
            <p className="mt-2 text-xs text-slate-500">{formatDate(item.capturedAt)}</p>
            <p className="mt-1 truncate font-mono text-[11px] text-slate-500">
              {item.integrityHash}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
