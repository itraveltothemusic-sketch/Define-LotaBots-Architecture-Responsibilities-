import {
  Camera,
  FileText,
  MessageSquareText,
  Video,
  BadgeCheck,
  BadgeX,
  BadgeAlert,
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { IntelligenceEvidenceItem } from "@/modules/intelligence-center/types";

function iconForType(type: IntelligenceEvidenceItem["type"]) {
  switch (type) {
    case "PHOTO":
      return Camera;
    case "VIDEO":
      return Video;
    case "DOCUMENT":
      return FileText;
    case "NOTE":
      return MessageSquareText;
    default:
      return FileText;
  }
}

function statusPill(status: IntelligenceEvidenceItem["verificationStatus"]) {
  switch (status) {
    case "VERIFIED":
      return { Icon: BadgeCheck, label: "Verified", cls: "text-emerald-700 dark:text-emerald-300" };
    case "REJECTED":
      return { Icon: BadgeX, label: "Rejected", cls: "text-rose-700 dark:text-rose-300" };
    case "UNVERIFIED":
    default:
      return { Icon: BadgeAlert, label: "Unverified", cls: "text-amber-700 dark:text-amber-300" };
  }
}

function formatTime(d: Date) {
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(d);
}

export function EvidenceTimelineCard({ evidence }: { evidence: IntelligenceEvidenceItem[] }) {
  const items = evidence.slice(0, 12);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Evidence timeline</CardTitle>
        <CardDescription>
          Documentation must be attributable, timestamped, and verifiable. This list is ordered newest-first.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <div className="text-sm text-zinc-600 dark:text-zinc-400">
            No evidence captured yet. Start with photos/videos of damage areas, then attach inspection notes and key claim documents.
          </div>
        ) : (
          <ol className="space-y-3">
            {items.map((e) => {
              const Icon = iconForType(e.type);
              const pill = statusPill(e.verificationStatus);
              return (
                <li key={e.id} className="flex items-start gap-3">
                  <div className="mt-0.5 grid size-9 place-items-center rounded-xl border border-zinc-200 bg-white text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
                    <Icon className="size-4" aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="truncate text-sm font-medium text-zinc-950 dark:text-zinc-50">
                        {e.title}
                      </div>
                      <div className={`inline-flex items-center gap-1 text-xs ${pill.cls}`}>
                        <pill.Icon className="size-3.5" aria-hidden="true" />
                        {pill.label}
                      </div>
                      <div className="text-xs text-zinc-500 dark:text-zinc-500">
                        {formatTime(e.capturedAt ?? e.createdAt)}
                      </div>
                    </div>
                    {e.description ? (
                      <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                        {e.description}
                      </div>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </CardContent>
    </Card>
  );
}

