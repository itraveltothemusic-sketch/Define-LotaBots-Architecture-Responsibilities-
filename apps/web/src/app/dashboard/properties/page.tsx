import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { requireUser } from "@/server/auth/require-user";
import { listPropertiesForUser } from "@/modules/forensic-property/data";
import { createPropertyAction } from "@/modules/forensic-property/actions";

function formatDate(d: Date) {
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(d);
}

export default async function PropertiesPage() {
  const session = await requireUser();
  const snapshot = await listPropertiesForUser({
    userId: session.user.id,
    role: session.user.role,
  });

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Forensic Property</CardTitle>
          <CardDescription>
            Property profiles, inspection records, media/document ingestion, and damage classification.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {snapshot.mode === "stub" ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200">
              Database is not configured, so property data is unavailable. Set <code>DATABASE_URL</code> to
              enable live case files.
            </div>
          ) : null}

          <div className="grid gap-3 md:grid-cols-2">
            <Card className="p-4">
              <div className="text-sm font-semibold tracking-tight">Create property case file</div>
              <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                This is the anchor for evidence, inspections, claims, execution verification, and outcomes.
              </div>
              <form action={createPropertyAction} className="mt-4 space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wide text-zinc-600 dark:text-zinc-400">
                    Display name
                  </label>
                  <input
                    name="displayName"
                    required
                    minLength={3}
                    className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-950 outline-none focus:border-zinc-300 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-zinc-700 dark:focus:ring-zinc-800"
                    placeholder="e.g., Cedar Ridge Commerce Center"
                  />
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wide text-zinc-600 dark:text-zinc-400">
                      Address line 1
                    </label>
                    <input
                      name="addressLine1"
                      className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-950 outline-none focus:border-zinc-300 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-zinc-700 dark:focus:ring-zinc-800"
                      placeholder="1200 Cedar Ridge Pkwy"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wide text-zinc-600 dark:text-zinc-400">
                      Postal code
                    </label>
                    <input
                      name="postalCode"
                      className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-950 outline-none focus:border-zinc-300 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-zinc-700 dark:focus:ring-zinc-800"
                      placeholder="78701"
                    />
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wide text-zinc-600 dark:text-zinc-400">
                      City
                    </label>
                    <input
                      name="city"
                      className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-950 outline-none focus:border-zinc-300 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-zinc-700 dark:focus:ring-zinc-800"
                      placeholder="Austin"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wide text-zinc-600 dark:text-zinc-400">
                      Region / State
                    </label>
                    <input
                      name="region"
                      className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-950 outline-none focus:border-zinc-300 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-zinc-700 dark:focus:ring-zinc-800"
                      placeholder="TX"
                    />
                  </div>
                </div>

                <Button type="submit">Create property</Button>
              </form>
            </Card>

            <Card className="p-4">
              <div className="text-sm font-semibold tracking-tight">Properties</div>
              <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                Select a case file to ingest evidence and build a defensible timeline.
              </div>

              <div className="mt-4 space-y-2">
                {snapshot.properties.length === 0 ? (
                  <div className="text-sm text-zinc-600 dark:text-zinc-400">
                    No properties found yet.
                  </div>
                ) : (
                  snapshot.properties.map((p) => (
                    <Link
                      key={p.id}
                      href={`/dashboard/properties/${p.id}`}
                      className="block rounded-xl border border-zinc-200 bg-white px-3 py-3 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <div className="truncate text-sm font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
                            {p.displayName}
                          </div>
                          <div className="truncate text-xs text-zinc-600 dark:text-zinc-400">
                            {[p.city, p.region].filter(Boolean).join(", ") || "Location not captured"}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-zinc-600 dark:text-zinc-400">
                            {p.evidenceCount} evidence
                          </div>
                          <div className="text-xs text-zinc-500 dark:text-zinc-500">
                            {formatDate(p.createdAt)}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

