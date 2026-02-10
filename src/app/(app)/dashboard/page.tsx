import { format } from "date-fns";
import { redirect } from "next/navigation";

import { AtosPanel } from "@/components/atos/atos-panel";
import { MetricCard } from "@/components/intelligence/metric-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardTitle } from "@/components/ui/card";
import { canAccessModule } from "@/lib/auth/permissions";
import { getSession } from "@/lib/auth/session";
import { generateAtosGuidance } from "@/lib/atos";
import { formatCurrency } from "@/lib/utils";
import { getRoleScopedSnapshot } from "@/server/repositories/platform-repository";

function riskVariant(risk: "low" | "moderate" | "high" | "critical") {
  if (risk === "critical") return "danger" as const;
  if (risk === "high") return "warning" as const;
  if (risk === "moderate") return "info" as const;
  return "success" as const;
}

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  if (!canAccessModule(session.role, "intelligence")) {
    redirect("/not-authorized");
  }

  const snapshot = await getRoleScopedSnapshot(session.role);
  const atosGuidance = generateAtosGuidance("intelligence", snapshot);
  const verifiedEvidence = snapshot.evidenceTimeline.filter(
    (entry) => entry.verificationStatus === "verified",
  ).length;
  const blockedMilestones = snapshot.claimMilestones.filter((entry) => entry.status === "blocked").length;
  const highRiskGaps = snapshot.scopeDiscrepancies.filter(
    (entry) => entry.riskLevel === "high" || entry.riskLevel === "critical",
  ).length;

  return (
    <div className="space-y-6">
      <section>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Intelligence Center</p>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">
          Command view: evidence, claims, execution, and equity
        </h1>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Verified Evidence"
          value={`${verifiedEvidence}/${snapshot.evidenceTimeline.length}`}
          detail="Artifacts currently admissible for claim substantiation."
          tone="success"
        />
        <MetricCard
          label="Blocked Claim Milestones"
          value={`${blockedMilestones}`}
          detail="Roadblocks that threaten cycle-time and payout quality."
          tone={blockedMilestones > 0 ? "warning" : "success"}
        />
        <MetricCard
          label="High-risk Scope Gaps"
          value={`${highRiskGaps}`}
          detail="Line items with material payout exposure."
          tone={highRiskGaps > 0 ? "danger" : "success"}
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.45fr_0.95fr]">
        <div className="space-y-4">
          <Card>
            <CardTitle
              title="Property Overview"
              subtitle={`${snapshot.property.addressLine1}, ${snapshot.property.city}, ${snapshot.property.state} ${snapshot.property.zipCode}`}
              trailing={<Badge label={snapshot.property.riskLevel} variant={riskVariant(snapshot.property.riskLevel)} />}
            />
            <div className="grid gap-3 text-sm text-slate-700 dark:text-slate-300 sm:grid-cols-2">
              <p>
                <span className="font-semibold text-slate-900 dark:text-slate-100">Ownership:</span>{" "}
                {snapshot.property.ownershipEntity}
              </p>
              <p>
                <span className="font-semibold text-slate-900 dark:text-slate-100">Occupancy:</span>{" "}
                {snapshot.property.occupancyType}
              </p>
              <p>
                <span className="font-semibold text-slate-900 dark:text-slate-100">Gross Area:</span>{" "}
                {snapshot.property.grossAreaSqFt.toLocaleString()} sq ft
              </p>
              <p>
                <span className="font-semibold text-slate-900 dark:text-slate-100">Storm Event:</span>{" "}
                {snapshot.property.stormEvent}
              </p>
            </div>
          </Card>

          <Card>
            <CardTitle
              title="Evidence & Documentation Timeline"
              subtitle="Chronological forensic record with verification status."
            />
            <div className="space-y-3">
              {snapshot.evidenceTimeline.map((entry) => (
                <article
                  key={entry.id}
                  className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{entry.title}</p>
                    <Badge
                      label={entry.verificationStatus}
                      variant={
                        entry.verificationStatus === "verified"
                          ? "success"
                          : entry.verificationStatus === "pending"
                            ? "warning"
                            : "danger"
                      }
                    />
                  </div>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {format(new Date(entry.capturedAt), "MMM d, yyyy h:mm a")} · {entry.capturedBy} · COC{" "}
                    {entry.chainOfCustodyRef}
                  </p>
                  <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{entry.summary}</p>
                </article>
              ))}
            </div>
          </Card>

          <Card>
            <CardTitle
              title="Insurance Posture Summary"
              subtitle="Current movement through claim lifecycle and financial deltas."
            />
            <div className="space-y-2 text-sm">
              {snapshot.claimMilestones.map((milestone) => (
                <div key={milestone.id} className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-900">
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">{milestone.phase}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{milestone.note}</p>
                  </div>
                  <Badge
                    label={milestone.status}
                    variant={
                      milestone.status === "completed"
                        ? "success"
                        : milestone.status === "in-progress"
                          ? "info"
                          : "danger"
                    }
                  />
                </div>
              ))}
              <div className="mt-3 rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-800">
                <p className="font-semibold text-slate-900 dark:text-slate-100">
                  Net recovery delta: {formatCurrency(snapshot.equity.netRecoveryDeltaUsd)}
                </p>
                <p className="text-slate-600 dark:text-slate-400">
                  Claimed {formatCurrency(snapshot.equity.totalClaimedUsd)} vs settled{" "}
                  {formatCurrency(snapshot.equity.totalSettledUsd)}
                </p>
              </div>
            </div>
          </Card>
        </div>

        <AtosPanel guidance={atosGuidance} />
      </section>
    </div>
  );
}
