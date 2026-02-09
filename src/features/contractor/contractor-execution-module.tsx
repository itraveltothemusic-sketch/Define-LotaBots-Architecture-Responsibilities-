import { AtosAssistantPanel } from "@/components/atos/assistant-panel";
import { Badge } from "@/components/ui/badge";
import { Card, CardTitle } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import type { AtosAnalysis } from "@/lib/atos/engine";
import type { ContractorExecutionData } from "@/lib/data/repository";
import { formatDate } from "@/lib/utils";

interface ContractorExecutionModuleProps {
  data: ContractorExecutionData;
  atos: AtosAnalysis;
}

function onboardingTone(status: string) {
  if (status === "VERIFIED") return "success";
  if (status === "RESTRICTED") return "critical";
  return "warning";
}

function complianceTone(status: string) {
  if (status === "PASSED") return "success";
  if (status === "FAILED") return "critical";
  return "warning";
}

export function ContractorExecutionModule({ data, atos }: ContractorExecutionModuleProps) {
  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Module 04"
        title="Contractor Execution Module"
        description="Manages contractor readiness, scope assignment execution, and compliance evidence needed for defensible progress verification."
      />

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <Card>
            <CardTitle
              title="Contractor Onboarding"
              subtitle="Credential and quality posture before field deployment."
            />
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="text-xs uppercase tracking-wide text-slate-400">
                  <tr>
                    <th className="pb-2 pr-3">Contractor</th>
                    <th className="pb-2 pr-3">Trade</th>
                    <th className="pb-2 pr-3">Onboarding</th>
                    <th className="pb-2">Quality score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {data.contractors.map((contractor) => (
                    <tr key={contractor.id}>
                      <td className="py-3 pr-3">
                        <p className="font-medium text-white">{contractor.companyName}</p>
                        <p className="text-xs text-slate-400">
                          License: {contractor.licenseVerified ? "Verified" : "Pending"} · Insurance:{" "}
                          {contractor.insuranceVerified ? "Verified" : "Pending"}
                        </p>
                      </td>
                      <td className="py-3 pr-3 text-slate-200">{contractor.trade}</td>
                      <td className="py-3 pr-3">
                        <Badge tone={onboardingTone(contractor.onboardingStatus)}>
                          {contractor.onboardingStatus}
                        </Badge>
                      </td>
                      <td className="py-3 text-slate-200">
                        {(contractor.qualityScore * 100).toFixed(0)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card>
            <CardTitle
              title="Scope Assignment & Progress Verification"
              subtitle="Execution posture by workstream with verification-ready progress evidence."
            />
            <div className="space-y-3">
              {data.assignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="rounded-xl border border-slate-800 bg-slate-950/70 p-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm font-medium text-white">{assignment.workstream}</p>
                    <Badge tone="neutral">{assignment.status}</Badge>
                  </div>
                  <p className="mt-1 text-xs text-slate-400">
                    Target completion: {formatDate(assignment.targetCompletionDate)}
                  </p>
                  <div className="mt-3 h-2 w-full rounded-full bg-slate-800">
                    <div
                      className="h-2 rounded-full bg-sky-400"
                      style={{ width: `${assignment.progressPercent}%` }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-slate-400">
                    Progress verified: {assignment.progressPercent}%
                  </p>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <CardTitle
              title="Compliance Tracking"
              subtitle="Requirement-level pass/fail controls across active assignments."
            />
            <ul className="space-y-3">
              {data.compliance.map((checkpoint) => (
                <li
                  key={checkpoint.id}
                  className="rounded-xl border border-slate-800 bg-slate-950/70 p-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm font-medium text-white">{checkpoint.requirement}</p>
                    <Badge tone={complianceTone(checkpoint.status)}>{checkpoint.status}</Badge>
                  </div>
                  <p className="mt-1 text-xs text-slate-400">
                    {checkpoint.validatedAt
                      ? `Last validated: ${formatDate(checkpoint.validatedAt)}`
                      : "Awaiting validation evidence"}
                  </p>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <AtosAssistantPanel
          module="contractor-execution"
          summary={atos.summary}
          guidance={atos.guidance}
        />
      </section>
    </div>
  );
}
