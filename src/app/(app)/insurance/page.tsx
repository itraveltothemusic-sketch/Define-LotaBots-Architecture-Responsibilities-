import { format } from "date-fns";
import { redirect } from "next/navigation";

import { AtosPanel } from "@/components/atos/atos-panel";
import { Badge } from "@/components/ui/badge";
import { Card, CardTitle } from "@/components/ui/card";
import { canAccessModule } from "@/lib/auth/permissions";
import { getSession } from "@/lib/auth/session";
import { generateAtosGuidance } from "@/lib/atos";
import { formatCurrency } from "@/lib/utils";
import { getRoleScopedSnapshot } from "@/server/repositories/platform-repository";

function discrepancyVariant(risk: "low" | "moderate" | "high" | "critical") {
  if (risk === "critical") return "danger" as const;
  if (risk === "high") return "warning" as const;
  if (risk === "moderate") return "info" as const;
  return "success" as const;
}

export default async function InsurancePage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  if (!canAccessModule(session.role, "insurance")) {
    redirect("/not-authorized");
  }

  const snapshot = await getRoleScopedSnapshot(session.role);
  const atosGuidance = generateAtosGuidance("insurance", snapshot);

  return (
    <div className="space-y-6">
      <section>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Insurance Intelligence Module
        </p>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">
          Claim lifecycle, carrier interactions, and discrepancy detection
        </h1>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.45fr_0.95fr]">
        <div className="space-y-4">
          <Card>
            <CardTitle
              title="Claim Lifecycle Tracker"
              subtitle="Milestones with ownership accountability and status clarity."
            />
            <div className="space-y-2">
              {snapshot.claimMilestones.map((milestone) => (
                <article
                  key={milestone.id}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-semibold capitalize text-slate-900 dark:text-white">
                      {milestone.phase.replaceAll("-", " ")}
                    </p>
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
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {format(new Date(milestone.occurredAt), "MMM d, yyyy h:mm a")} · Owner: {milestone.owner}
                  </p>
                  <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{milestone.note}</p>
                </article>
              ))}
            </div>
          </Card>

          <Card>
            <CardTitle title="Carrier Interaction Log" subtitle="Auditable communications and commitments." />
            {snapshot.carrierInteractions.length === 0 ? (
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Carrier logs are restricted for this role scope.
              </p>
            ) : (
              <div className="space-y-3">
                {snapshot.carrierInteractions.map((interaction) => (
                  <article
                    key={interaction.id}
                    className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 dark:border-slate-800 dark:bg-slate-900"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-semibold text-slate-900 dark:text-white">
                        {interaction.carrierRepresentative}
                      </p>
                      <Badge label={interaction.channel} variant="neutral" />
                    </div>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {format(new Date(interaction.occurredAt), "MMM d, yyyy h:mm a")}
                    </p>
                    <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{interaction.summary}</p>
                    <ul className="mt-2 list-disc pl-5 text-xs text-slate-600 dark:text-slate-400">
                      {interaction.commitments.map((commitment) => (
                        <li key={commitment}>{commitment}</li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            )}
          </Card>

          <Card>
            <CardTitle
              title="Scope Comparison & Discrepancy Detection"
              subtitle="Financial variances between insured and carrier scope assumptions."
            />
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead className="text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="pb-2">Line Item</th>
                    <th className="pb-2">Insured Scope</th>
                    <th className="pb-2">Carrier Scope</th>
                    <th className="pb-2">Delta</th>
                    <th className="pb-2">Risk</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {snapshot.scopeDiscrepancies.map((row) => (
                    <tr key={row.id}>
                      <td className="py-2">
                        <p className="font-medium text-slate-900 dark:text-white">{row.lineItem}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{row.rationale}</p>
                      </td>
                      <td className="py-2">{formatCurrency(row.insuredScopeAmountUsd)}</td>
                      <td className="py-2">{formatCurrency(row.carrierScopeAmountUsd)}</td>
                      <td className="py-2 font-semibold">{formatCurrency(row.deltaUsd)}</td>
                      <td className="py-2">
                        <Badge label={row.riskLevel} variant={discrepancyVariant(row.riskLevel)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        <AtosPanel guidance={atosGuidance} />
      </section>
    </div>
  );
}
