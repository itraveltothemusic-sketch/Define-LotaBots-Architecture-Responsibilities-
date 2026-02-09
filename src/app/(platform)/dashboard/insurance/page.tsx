import { AtosPanel } from "@/components/atos/atos-panel";
import { ModuleHeader } from "@/components/dashboard/module-header";
import { Card } from "@/components/ui/card";
import { getInsuranceSnapshot } from "@/lib/services/insurance";
import { formatCurrency, formatDate } from "@/lib/utils/format";

const statusClass = {
  notice_submitted: "bg-slate-100 text-slate-700",
  under_review: "bg-sky-100 text-sky-700",
  scope_dispute: "bg-rose-100 text-rose-700",
  approved: "bg-emerald-100 text-emerald-700",
  closed: "bg-slate-200 text-slate-700",
} as const;

export default async function InsuranceModulePage() {
  const snapshot = await getInsuranceSnapshot();

  return (
    <div className="space-y-6">
      <ModuleHeader
        eyebrow="Module 2"
        title="Insurance Intelligence Module"
        description="Claim lifecycle tracking, carrier interaction governance, and scope discrepancy visibility."
      />

      <Card title="Claim lifecycle command board">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="py-2 pr-4">Property</th>
                <th className="py-2 pr-4">Carrier</th>
                <th className="py-2 pr-4">Policy</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">Reserve</th>
                <th className="py-2 pr-4">Payout</th>
                <th className="py-2">Variance</th>
              </tr>
            </thead>
            <tbody>
              {snapshot.claims.map((claim) => {
                const variance = snapshot.claimDiscrepancyById[claim.id]?.valueGap ?? 0;
                return (
                  <tr key={claim.id} className="border-t border-slate-200">
                    <td className="py-3 pr-4 font-medium text-slate-900">
                      {snapshot.propertyNameById[claim.propertyId]}
                    </td>
                    <td className="py-3 pr-4 text-slate-700">{claim.carrier}</td>
                    <td className="py-3 pr-4 text-slate-700">{claim.policyNumber}</td>
                    <td className="py-3 pr-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusClass[claim.status]}`}
                      >
                        {claim.status.replaceAll("_", " ")}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-slate-700">
                      {formatCurrency(claim.reserveEstimate)}
                    </td>
                    <td className="py-3 pr-4 text-slate-700">
                      {formatCurrency(claim.payoutAmount)}
                    </td>
                    <td className="py-3 text-slate-700">{formatCurrency(variance)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <section className="grid gap-6 xl:grid-cols-2">
        <Card
          title="Carrier interaction log"
          subtitle="Structured engagement records to preserve claim accountability"
        >
          <ul className="space-y-3">
            {snapshot.carrierInteractions.map((interaction) => (
              <li
                key={interaction.id}
                className="rounded-lg border border-slate-200 bg-slate-50 p-3"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {interaction.channel} · {formatDate(interaction.occurredAt)}
                </p>
                <p className="mt-2 text-sm text-slate-800">{interaction.summary}</p>
                <p className="mt-1 text-xs text-slate-500">Owner: {interaction.owner}</p>
              </li>
            ))}
          </ul>
        </Card>

        <Card
          title="Scope discrepancy detection"
          subtitle="Forensic-vs-carrier value mismatch by category"
        >
          <div className="space-y-3">
            {snapshot.scopeDiscrepancies.map((discrepancy) => (
              <article
                key={discrepancy.id}
                className="rounded-lg border border-slate-200 bg-white p-3"
              >
                <p className="text-sm font-semibold capitalize text-slate-900">
                  {discrepancy.category}
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  Claim: {snapshot.claimById[discrepancy.claimId].policyNumber}
                </p>
                <p className="mt-2 text-sm text-slate-700">
                  Carrier {formatCurrency(discrepancy.carrierValue)} vs forensic{" "}
                  {formatCurrency(discrepancy.forensicValue)}
                </p>
                <p className="mt-2 text-xs text-slate-600">{discrepancy.rationale}</p>
              </article>
            ))}
          </div>
        </Card>
      </section>

      <AtosPanel brief={snapshot.atosBrief} />
    </div>
  );
}
