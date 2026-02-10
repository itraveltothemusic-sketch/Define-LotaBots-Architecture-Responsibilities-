import { format } from "date-fns";
import { redirect } from "next/navigation";

import { AtosPanel } from "@/components/atos/atos-panel";
import { Badge } from "@/components/ui/badge";
import { Card, CardTitle } from "@/components/ui/card";
import { canAccessModule } from "@/lib/auth/permissions";
import { getSession } from "@/lib/auth/session";
import { generateAtosGuidance } from "@/lib/atos";
import { getRoleScopedSnapshot } from "@/server/repositories/platform-repository";

function statusVariant(status: "approved" | "under-review" | "expired-documentation") {
  if (status === "approved") return "success" as const;
  if (status === "under-review") return "warning" as const;
  return "danger" as const;
}

function complianceVariant(status: "met" | "at-risk" | "missed") {
  if (status === "met") return "success" as const;
  if (status === "at-risk") return "warning" as const;
  return "danger" as const;
}

export default async function ExecutionPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  if (!canAccessModule(session.role, "execution")) {
    redirect("/not-authorized");
  }

  const snapshot = await getRoleScopedSnapshot(session.role);
  const atosGuidance = generateAtosGuidance("execution", snapshot);

  return (
    <div className="space-y-6">
      <section>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Contractor Execution Module
        </p>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">
          Onboarding, assignments, progress verification, and compliance
        </h1>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.45fr_0.95fr]">
        <div className="space-y-4">
          <Card>
            <CardTitle title="Contractor Onboarding" subtitle="Trade-aligned readiness and qualification posture." />
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead className="text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="pb-2">Legal Name</th>
                    <th className="pb-2">Trade</th>
                    <th className="pb-2">Insurance Expiration</th>
                    <th className="pb-2">Background</th>
                    <th className="pb-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {snapshot.contractors.map((contractor) => (
                    <tr key={contractor.id}>
                      <td className="py-2 font-medium text-slate-900 dark:text-white">{contractor.legalName}</td>
                      <td className="py-2 capitalize">{contractor.trade}</td>
                      <td className="py-2">
                        {format(new Date(contractor.insuranceExpiration), "MMM d, yyyy")}
                      </td>
                      <td className="py-2 capitalize">{contractor.backgroundCheck}</td>
                      <td className="py-2">
                        <Badge label={contractor.onboardingStatus} variant={statusVariant(contractor.onboardingStatus)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card>
            <CardTitle
              title="Scope Assignment Tracker"
              subtitle="Progress status and verification confidence across execution scopes."
            />
            <div className="space-y-3">
              {snapshot.assignments.map((assignment) => (
                <article
                  key={assignment.id}
                  className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-semibold text-slate-900 dark:text-white">{assignment.scopeName}</p>
                    <Badge
                      label={assignment.verificationStatus}
                      variant={
                        assignment.verificationStatus === "verified"
                          ? "success"
                          : assignment.verificationStatus === "pending"
                            ? "warning"
                            : "danger"
                      }
                    />
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                    <div
                      className="h-full rounded-full bg-sky-500"
                      style={{ width: `${Math.max(assignment.percentComplete, 4)}%` }}
                    />
                  </div>
                  <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span>{assignment.percentComplete}% complete</span>
                    <span>Due {format(new Date(assignment.dueDate), "MMM d, yyyy")}</span>
                  </div>
                </article>
              ))}
            </div>
          </Card>

          <Card>
            <CardTitle title="Compliance Verification" subtitle="Regulatory and quality checkpoints by owner." />
            <div className="space-y-2">
              {snapshot.compliance.map((checkpoint) => (
                <div
                  key={checkpoint.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2 dark:border-slate-800 dark:bg-slate-900"
                >
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">{checkpoint.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Owner: {checkpoint.owner} · Due {format(new Date(checkpoint.dueDate), "MMM d, yyyy")}
                    </p>
                  </div>
                  <Badge label={checkpoint.status} variant={complianceVariant(checkpoint.status)} />
                </div>
              ))}
            </div>
          </Card>
        </div>

        <AtosPanel guidance={atosGuidance} />
      </section>
    </div>
  );
}
