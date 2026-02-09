import { AtosPanel } from "@/components/atos/atos-panel";
import { ModuleHeader } from "@/components/dashboard/module-header";
import { Card } from "@/components/ui/card";
import { getExecutionSnapshot } from "@/lib/services/execution";
import { formatDate, formatPercent } from "@/lib/utils/format";

const onboardingClass = {
  pending: "bg-amber-100 text-amber-700",
  approved: "bg-emerald-100 text-emerald-700",
  restricted: "bg-rose-100 text-rose-700",
} as const;

const milestoneClass = {
  planned: "bg-slate-100 text-slate-700",
  in_progress: "bg-sky-100 text-sky-700",
  verified: "bg-emerald-100 text-emerald-700",
  blocked: "bg-rose-100 text-rose-700",
} as const;

export default async function ExecutionModulePage() {
  const snapshot = await getExecutionSnapshot();

  return (
    <div className="space-y-6">
      <ModuleHeader
        eyebrow="Module 3"
        title="Contractor Execution Module"
        description="Onboarding governance, scope assignments, progress verification, and compliance controls."
      />

      <Card
        title="Contractor onboarding and compliance"
        subtitle="Role-scoped assignment eligibility and quality indicators"
      >
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="py-2 pr-4">Contractor</th>
                <th className="py-2 pr-4">Trade</th>
                <th className="py-2 pr-4">Onboarding</th>
                <th className="py-2 pr-4">Compliance</th>
                <th className="py-2">Assigned scopes</th>
              </tr>
            </thead>
            <tbody>
              {snapshot.contractors.map((contractor) => (
                <tr key={contractor.id} className="border-t border-slate-200">
                  <td className="py-3 pr-4 font-medium text-slate-900">
                    {contractor.companyName}
                  </td>
                  <td className="py-3 pr-4 capitalize text-slate-700">
                    {contractor.trade}
                  </td>
                  <td className="py-3 pr-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${onboardingClass[contractor.onboardingStatus]}`}
                    >
                      {contractor.onboardingStatus}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-slate-700">
                    {formatPercent(contractor.complianceScore)}
                  </td>
                  <td className="py-3 text-slate-700">
                    {contractor.assignedScopeCount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card
        title="Execution milestone verification"
        subtitle="Cross-property scope completion and blocker visibility"
      >
        <div className="space-y-3">
          {snapshot.milestones.map((milestone) => (
            <article
              key={milestone.id}
              className="rounded-lg border border-slate-200 bg-white p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {milestone.title}
                  </p>
                  <p className="text-xs text-slate-500">
                    {snapshot.propertyNameById[milestone.propertyId]} ·{" "}
                    {snapshot.contractorById[milestone.contractorId].companyName}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${milestoneClass[milestone.status]}`}
                >
                  {milestone.status.replaceAll("_", " ")}
                </span>
              </div>

              <div className="mt-3 grid gap-2 text-xs text-slate-600 sm:grid-cols-2">
                <p>Due: {formatDate(milestone.dueAt)}</p>
                <p>
                  Verified:{" "}
                  {milestone.verifiedAt ? formatDate(milestone.verifiedAt) : "Pending"}
                </p>
              </div>
            </article>
          ))}
        </div>
      </Card>

      <AtosPanel brief={snapshot.atosBrief} />
    </div>
  );
}
