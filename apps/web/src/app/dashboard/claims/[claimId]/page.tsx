import { notFound, redirect } from "next/navigation";

import { requireUser } from "@/server/auth/require-user";
import { canAccessModule } from "@/server/auth/rbac";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getClaimDetail } from "@/modules/insurance-intelligence/data";
import { addCarrierInteractionAction } from "@/modules/insurance-intelligence/actions";

function formatDateTime(d: Date) {
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export default async function ClaimDetailPage({
  params,
}: {
  params: { claimId: string };
}) {
  const session = await requireUser();
  if (!canAccessModule(session.user.role, "insurance")) redirect("/unauthorized");

  const snapshot = await getClaimDetail({
    claimId: params.claimId,
    userId: session.user.id,
    role: session.user.role,
  });

  if (snapshot.mode === "stub") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Claim</CardTitle>
          <CardDescription>
            Database is not configured. Set <code>DATABASE_URL</code> to load claim details.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!snapshot.claim) return notFound();

  const canWrite = session.user.role === "INTERNAL" || session.user.role === "ADJUSTER";
  const addInteraction = addCarrierInteractionAction.bind(null, snapshot.claim.id);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{snapshot.claim.carrierName}</CardTitle>
          <CardDescription>
            {snapshot.claim.propertyDisplayName}
            {snapshot.claim.claimNumber ? ` · ${snapshot.claim.claimNumber}` : ""}
            {" · "}
            Status: {snapshot.claim.status}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-zinc-600 dark:text-zinc-400">
          Carrier interactions are part of the audit trail. ATOS uses this timeline to surface gaps, risks, and scope leverage points.
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Interaction log</CardTitle>
            <CardDescription>
              Chronological record of carrier communications and outcomes (newest-first).
            </CardDescription>
          </CardHeader>
          <CardContent>
            {snapshot.claim.interactions.length === 0 ? (
              <div className="text-sm text-zinc-600 dark:text-zinc-400">
                No interactions logged yet. Add the initial claim acknowledgement and adjuster estimate request.
              </div>
            ) : (
              <ol className="space-y-3">
                {snapshot.claim.interactions.map((i) => (
                  <li
                    key={i.id}
                    className="rounded-xl border border-zinc-200 bg-white px-3 py-3 text-sm dark:border-zinc-800 dark:bg-zinc-950"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-xs font-semibold uppercase tracking-wide text-zinc-600 dark:text-zinc-400">
                        {i.channel}
                      </div>
                      <div className="text-xs text-zinc-500 dark:text-zinc-500">
                        {formatDateTime(i.occurredAt)}
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-zinc-800 dark:text-zinc-200">
                      {i.summary}
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Add interaction</CardTitle>
            <CardDescription>
              Log carrier communications with enough detail to support scope deltas and negotiation posture.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={addInteraction} className="space-y-3">
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wide text-zinc-600 dark:text-zinc-400">
                    Occurred at (optional)
                  </label>
                  <input
                    name="occurredAt"
                    type="datetime-local"
                    className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-950 outline-none focus:border-zinc-300 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-zinc-700 dark:focus:ring-zinc-800"
                    disabled={!canWrite}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wide text-zinc-600 dark:text-zinc-400">
                    Channel
                  </label>
                  <select
                    name="channel"
                    className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-950 outline-none focus:border-zinc-300 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-zinc-700 dark:focus:ring-zinc-800"
                    disabled={!canWrite}
                    defaultValue="EMAIL"
                  >
                    <option value="EMAIL">Email</option>
                    <option value="PHONE">Phone</option>
                    <option value="IN_PERSON">In-person</option>
                    <option value="PORTAL">Portal</option>
                    <option value="LETTER">Letter</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wide text-zinc-600 dark:text-zinc-400">
                  Summary
                </label>
                <textarea
                  name="summary"
                  required
                  minLength={5}
                  className="min-h-32 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-950 outline-none focus:border-zinc-300 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-zinc-700 dark:focus:ring-zinc-800"
                  placeholder="What was communicated, what was requested/committed, and what evidence supports it."
                  disabled={!canWrite}
                />
              </div>

              <Button type="submit" disabled={!canWrite}>
                Add interaction
              </Button>
              <div className="text-xs text-zinc-500 dark:text-zinc-500">
                Write access is currently limited to Internal and Adjuster roles.
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

