import { AssistantPanel } from "@/components/atos/assistant-panel";
import { GuidanceList } from "@/components/atos/guidance-list";
import { StatusBadge } from "@/components/ui/status-badge";
import { ModuleAccessDenied } from "@/components/ui/module-access-denied";
import { getModuleAccess } from "@/lib/auth/module-guard";
import {
  listCarrierInteractions,
  listClaims,
  listScopeDiscrepancies,
} from "@/lib/db/repositories";
import { generateModuleGuidance } from "@/lib/intelligence/atos";
import { formatCurrency, formatDate } from "@/lib/utils/format";

function stageTone(stage: string) {
  if (stage === "Closed" || stage === "Settlement") {
    return "success";
  }
  if (stage === "Negotiation" || stage === "Carrier Review") {
    return "warning";
  }
  return "info";
}

function discrepancyTone(severity: "low" | "medium" | "high" | "critical") {
  if (severity === "critical") {
    return "critical";
  }
  if (severity === "high") {
    return "danger";
  }
  if (severity === "medium") {
    return "warning";
  }
  return "info";
}

export default async function InsuranceIntelligencePage() {
  const [{ allowed }, claims, interactions, discrepancies, guidance] = await Promise.all([
    getModuleAccess("insurance-intelligence"),
    listClaims(),
    listCarrierInteractions(),
    listScopeDiscrepancies(),
    generateModuleGuidance("insurance-intelligence"),
  ]);

  if (!allowed) {
    return <ModuleAccessDenied module="insurance-intelligence" />;
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Insurance Intelligence Module
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Claim lifecycle control, carrier communications, and discrepancy detection.
        </p>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <GuidanceList guidance={guidance} />
        <AssistantPanel module="insurance-intelligence" />
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-base font-semibold text-slate-900">Claim Lifecycle Tracking</h3>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="pb-2 pr-4">Claim</th>
                <th className="pb-2 pr-4">Carrier</th>
                <th className="pb-2 pr-4">Stage</th>
                <th className="pb-2 pr-4">Submitted Scope</th>
                <th className="pb-2 pr-4">Carrier Scope</th>
                <th className="pb-2">Payout</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {claims.map((claim) => (
                <tr key={claim.id}>
                  <td className="py-3 pr-4">
                    <p className="font-medium text-slate-900">{claim.claimNumber}</p>
                    <p className="text-xs text-slate-500">
                      Updated {formatDate(claim.lastUpdatedAt)}
                    </p>
                  </td>
                  <td className="py-3 pr-4">{claim.carrier}</td>
                  <td className="py-3 pr-4">
                    <StatusBadge label={claim.stage} tone={stageTone(claim.stage)} />
                  </td>
                  <td className="py-3 pr-4">{formatCurrency(claim.submittedScopeUsd)}</td>
                  <td className="py-3 pr-4">{formatCurrency(claim.carrierScopeUsd)}</td>
                  <td className="py-3">{formatCurrency(claim.payoutUsd)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900">Carrier Interaction Log</h3>
          <ul className="mt-4 space-y-3">
            {interactions.map((interaction) => (
              <li
                key={interaction.id}
                className="rounded-xl border border-slate-200 bg-slate-50 p-4"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-slate-900">{interaction.summary}</p>
                  <StatusBadge
                    label={interaction.status}
                    tone={interaction.status === "Closed" ? "success" : "warning"}
                  />
                </div>
                <p className="mt-2 text-xs text-slate-600">
                  {interaction.channel} • Owner: {interaction.owner}
                </p>
                <p className="text-xs text-slate-500">
                  {formatDate(interaction.interactionAt)} • Due{" "}
                  {formatDate(interaction.responseDueAt)}
                </p>
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900">
            Scope Discrepancy Detection
          </h3>
          <ul className="mt-4 space-y-3">
            {discrepancies.map((discrepancy) => (
              <li
                key={discrepancy.id}
                className="rounded-xl border border-slate-200 bg-slate-50 p-4"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-slate-900">
                    {discrepancy.lineItem}
                  </p>
                  <StatusBadge
                    label={discrepancy.severity.toUpperCase()}
                    tone={discrepancyTone(discrepancy.severity)}
                  />
                </div>
                <p className="mt-2 text-xs text-slate-700">
                  Submitted {formatCurrency(discrepancy.submittedUsd)} vs Carrier{" "}
                  {formatCurrency(discrepancy.carrierUsd)}
                </p>
                <p className="text-xs text-rose-700">
                  Delta {formatCurrency(discrepancy.deltaUsd)}
                </p>
                <p className="mt-1 text-xs text-slate-600">{discrepancy.rationaleGap}</p>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </div>
  );
}
