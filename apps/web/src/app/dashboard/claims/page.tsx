import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { requireUser } from "@/server/auth/require-user";
import { canAccessModule } from "@/server/auth/rbac";
import { listClaimsForUser } from "@/modules/insurance-intelligence/data";
import { createClaimAction } from "@/modules/insurance-intelligence/actions";
import { listPropertiesForUser } from "@/modules/forensic-property/data";

export default async function ClaimsPage() {
  const session = await requireUser();
  if (!canAccessModule(session.user.role, "insurance")) redirect("/unauthorized");

  const [claimsSnapshot, propsSnapshot] = await Promise.all([
    listClaimsForUser({ userId: session.user.id, role: session.user.role }),
    listPropertiesForUser({ userId: session.user.id, role: session.user.role }),
  ]);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Insurance Intelligence</CardTitle>
          <CardDescription>
            Claim lifecycle tracking, carrier interaction logs, and scope comparison for discrepancy detection.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {claimsSnapshot.mode === "stub" ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200">
              Database is not configured, so claim data is unavailable. Set <code>DATABASE_URL</code> to enable live insurance workflows.
            </div>
          ) : null}

          <div className="grid gap-3 md:grid-cols-2">
            <Card className="p-4">
              <div className="text-sm font-semibold tracking-tight">Create claim</div>
              <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                Anchor carrier-facing work to a property case file. Claims are the backbone of scope comparison and payout leverage.
              </div>

              <form action={createClaimAction} className="mt-4 space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wide text-zinc-600 dark:text-zinc-400">
                    Property
                  </label>
                  <select
                    name="propertyId"
                    required
                    className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-950 outline-none focus:border-zinc-300 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-zinc-700 dark:focus:ring-zinc-800"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select a property…
                    </option>
                    {propsSnapshot.properties.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.displayName}
                      </option>
                    ))}
                  </select>
                  {propsSnapshot.properties.length === 0 ? (
                    <div className="text-xs text-zinc-500 dark:text-zinc-500">
                      No properties found. Create a property case file first.
                    </div>
                  ) : null}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wide text-zinc-600 dark:text-zinc-400">
                    Carrier name
                  </label>
                  <input
                    name="carrierName"
                    required
                    minLength={2}
                    className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-950 outline-none focus:border-zinc-300 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-zinc-700 dark:focus:ring-zinc-800"
                    placeholder="e.g., Example Carrier"
                  />
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wide text-zinc-600 dark:text-zinc-400">
                      Claim number (optional)
                    </label>
                    <input
                      name="claimNumber"
                      className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-950 outline-none focus:border-zinc-300 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-zinc-700 dark:focus:ring-zinc-800"
                      placeholder="CLM-123456"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wide text-zinc-600 dark:text-zinc-400">
                      Loss date (optional)
                    </label>
                    <input
                      name="lossDate"
                      type="date"
                      className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-950 outline-none focus:border-zinc-300 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-zinc-700 dark:focus:ring-zinc-800"
                    />
                  </div>
                </div>

                <Button type="submit" disabled={propsSnapshot.properties.length === 0}>
                  Create claim
                </Button>

                <div className="text-xs text-zinc-500 dark:text-zinc-500">
                  Claim creation is enabled for Owners and Internal users in phase 1.
                </div>
              </form>
            </Card>

            <Card className="p-4">
              <div className="text-sm font-semibold tracking-tight">Claims</div>
              <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                Select a claim to review interactions and build an audit-ready lifecycle timeline.
              </div>

              <div className="mt-4 space-y-2">
                {claimsSnapshot.claims.length === 0 ? (
                  <div className="text-sm text-zinc-600 dark:text-zinc-400">No claims found yet.</div>
                ) : (
                  claimsSnapshot.claims.map((c) => (
                    <Link
                      key={c.id}
                      href={`/dashboard/claims/${c.id}`}
                      className="block rounded-xl border border-zinc-200 bg-white px-3 py-3 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <div className="truncate text-sm font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
                            {c.carrierName}
                          </div>
                          <div className="truncate text-xs text-zinc-600 dark:text-zinc-400">
                            {c.propertyDisplayName}
                            {c.claimNumber ? ` · ${c.claimNumber}` : ""}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-zinc-600 dark:text-zinc-400">{c.status}</div>
                          <div className="text-xs text-zinc-500 dark:text-zinc-500">
                            {c.interactionCount} interactions
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

