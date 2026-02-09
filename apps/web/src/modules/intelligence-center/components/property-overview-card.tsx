import { MapPin, DatabaseZap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { IntelligenceProperty } from "@/modules/intelligence-center/types";

function formatAddress(p: IntelligenceProperty) {
  const parts = [p.addressLine1, [p.city, p.region].filter(Boolean).join(", "), p.postalCode]
    .filter(Boolean)
    .join(" · ");
  return parts || "Address not captured yet";
}

export function PropertyOverviewCard({
  mode,
  property,
  evidenceCount,
}: {
  mode: "live" | "stub";
  property: IntelligenceProperty | null;
  evidenceCount: number;
}) {
  if (!property) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Property overview</CardTitle>
          <CardDescription>
            No property case file found yet. Create a property to begin forensic documentation.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-zinc-600 dark:text-zinc-400">
          ATOS will guide next steps once a property is present.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-3">
          <span>Property overview</span>
          <span className="inline-flex items-center gap-1 rounded-full border border-zinc-200 bg-white px-2 py-1 text-xs text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
            <DatabaseZap className="size-3.5" aria-hidden="true" />
            {mode === "live" ? "Live" : "Stub"}
          </span>
        </CardTitle>
        <CardDescription>{property.displayName}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 text-sm">
        <div className="flex items-start gap-2 text-zinc-700 dark:text-zinc-300">
          <MapPin className="mt-0.5 size-4 text-zinc-500" aria-hidden="true" />
          <div>
            <div className="font-medium text-zinc-950 dark:text-zinc-50">Address</div>
            <div className="text-zinc-600 dark:text-zinc-400">{formatAddress(property)}</div>
          </div>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Evidence items</div>
          <div className="text-lg font-semibold tracking-tight">{evidenceCount}</div>
          <div className="text-xs text-zinc-600 dark:text-zinc-400">
            Evidence completeness is a leading indicator of claim defensibility.
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

