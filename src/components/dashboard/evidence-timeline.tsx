import { formatDate } from "@/lib/utils/format";
import type { EvidenceItem } from "@/types/domain";

interface EvidenceTimelineProps {
  items: EvidenceItem[];
  propertyNameById?: Record<string, string>;
}

const verificationClass: Record<EvidenceItem["verificationStatus"], string> = {
  verified: "bg-emerald-50 text-emerald-700",
  pending: "bg-amber-50 text-amber-700",
  flagged: "bg-rose-50 text-rose-700",
};

export function EvidenceTimeline({
  items,
  propertyNameById,
}: EvidenceTimelineProps) {
  return (
    <ol className="space-y-3">
      {items.map((item) => (
        <li
          key={item.id}
          className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-900">{item.title}</p>
              <p className="mt-1 text-xs text-slate-500">
                {item.type.toUpperCase()} uploaded by {item.source}
              </p>
              {propertyNameById && (
                <p className="mt-1 text-xs text-slate-600">
                  {propertyNameById[item.propertyId]}
                </p>
              )}
            </div>
            <span
              className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${verificationClass[item.verificationStatus]}`}
            >
              {item.verificationStatus}
            </span>
          </div>
          <p className="mt-3 text-xs text-slate-500">{formatDate(item.occurredAt)}</p>
        </li>
      ))}
    </ol>
  );
}
