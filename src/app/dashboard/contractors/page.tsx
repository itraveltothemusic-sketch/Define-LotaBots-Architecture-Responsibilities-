import { AssistantPanel } from "@/components/atos/assistant-panel";
import { GuidanceList } from "@/components/atos/guidance-list";
import { StatusBadge } from "@/components/ui/status-badge";
import { ModuleAccessDenied } from "@/components/ui/module-access-denied";
import { getModuleAccess } from "@/lib/auth/module-guard";
import {
  listComplianceRecords,
  listContractors,
  listProgressVerifications,
  listScopeAssignments,
} from "@/lib/db/repositories";
import { generateModuleGuidance } from "@/lib/intelligence/atos";
import { formatDate, formatPercent, formatShortDate } from "@/lib/utils/format";

function contractorTone(status: string) {
  if (status === "Onboarded") {
    return "success";
  }
  if (status === "Vetted") {
    return "info";
  }
  if (status === "Suspended") {
    return "danger";
  }
  return "warning";
}

function complianceTone(status: string) {
  if (status === "Valid") {
    return "success";
  }
  if (status === "Expiring Soon") {
    return "warning";
  }
  return "danger";
}

export default async function ContractorExecutionPage() {
  const [{ allowed }, contractors, assignments, verifications, compliance, guidance] =
    await Promise.all([
      getModuleAccess("contractor-execution"),
      listContractors(),
      listScopeAssignments(),
      listProgressVerifications(),
      listComplianceRecords(),
      generateModuleGuidance("contractor-execution"),
    ]);

  if (!allowed) {
    return <ModuleAccessDenied module="contractor-execution" />;
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Contractor Execution Module
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Contractor onboarding, scope assignment, progress verification, and compliance
          assurance.
        </p>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <GuidanceList guidance={guidance} />
        <AssistantPanel module="contractor-execution" />
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-base font-semibold text-slate-900">Contractor Onboarding</h3>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="pb-2 pr-4">Contractor</th>
                <th className="pb-2 pr-4">Specialty</th>
                <th className="pb-2 pr-4">Status</th>
                <th className="pb-2">Compliance Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {contractors.map((contractor) => (
                <tr key={contractor.id}>
                  <td className="py-3 pr-4">
                    <p className="font-medium text-slate-900">{contractor.companyName}</p>
                    <p className="text-xs text-slate-500">
                      Active assignments: {contractor.activeAssignments}
                    </p>
                  </td>
                  <td className="py-3 pr-4">{contractor.specialty}</td>
                  <td className="py-3 pr-4">
                    <StatusBadge
                      label={contractor.status}
                      tone={contractorTone(contractor.status)}
                    />
                  </td>
                  <td className="py-3">{formatPercent(contractor.complianceScore)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900">Scope Assignment</h3>
          <ul className="mt-4 space-y-3">
            {assignments.map((assignment) => (
              <li
                key={assignment.id}
                className="rounded-xl border border-slate-200 bg-slate-50 p-4"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-slate-900">{assignment.scopeName}</p>
                  <StatusBadge
                    label={assignment.status}
                    tone={
                      assignment.status === "Completed"
                        ? "success"
                        : assignment.status === "Blocked"
                          ? "danger"
                          : assignment.status === "Active"
                            ? "info"
                            : "warning"
                    }
                  />
                </div>
                <p className="mt-2 text-xs text-slate-600">
                  Target completion {formatShortDate(assignment.targetCompletionDate)}
                </p>
                <p className="text-xs text-slate-600">
                  Verified progress {formatPercent(assignment.verifiedProgressPct)}
                </p>
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900">
            Progress Verification & Compliance
          </h3>
          <ul className="mt-4 space-y-3">
            {verifications.map((verification) => (
              <li
                key={verification.id}
                className="rounded-xl border border-slate-200 bg-slate-50 p-4"
              >
                <p className="text-sm font-semibold text-slate-900">{verification.checkedBy}</p>
                <p className="text-xs text-slate-600">
                  {formatDate(verification.checkedAt)} • Completion{" "}
                  {formatPercent(verification.completionPct)}
                </p>
                <p className="text-xs text-slate-600">
                  Evidence links: {verification.evidenceLinkCount}
                </p>
                <div className="mt-2">
                  <StatusBadge
                    label={`Quality risk: ${verification.qualityRisk}`}
                    tone={
                      verification.qualityRisk === "high"
                        ? "danger"
                        : verification.qualityRisk === "medium"
                          ? "warning"
                          : "success"
                    }
                  />
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-2">
            {compliance.map((record) => (
              <div
                key={record.id}
                className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2"
              >
                <div>
                  <p className="text-xs font-semibold text-slate-800">{record.category}</p>
                  <p className="text-xs text-slate-500">
                    Expires {formatShortDate(record.expiresAt)}
                  </p>
                </div>
                <StatusBadge label={record.status} tone={complianceTone(record.status)} />
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
