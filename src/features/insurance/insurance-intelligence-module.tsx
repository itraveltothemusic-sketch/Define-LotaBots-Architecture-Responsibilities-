import { AtosAssistantPanel } from "@/components/atos/assistant-panel";
import { Badge } from "@/components/ui/badge";
import { Card, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/ui/metric-card";
import { SectionHeader } from "@/components/ui/section-header";
import type { AtosAnalysis } from "@/lib/atos/engine";
import type { InsuranceIntelligenceData } from "@/lib/data/repository";
import { formatCurrency, formatDate } from "@/lib/utils";

interface InsuranceIntelligenceModuleProps {
  data: InsuranceIntelligenceData;
  atos: AtosAnalysis;
}

function claimStageTone(stage: string) {
  if (stage === "SCOPE_NEGOTIATION") return "high";
  if (stage === "ADJUSTER_REVIEW") return "medium";
  if (stage === "PARTIAL_PAYOUT") return "warning";
  if (stage === "CLOSED") return "success";
  return "low";
}

export function InsuranceIntelligenceModule({
  data,
  atos,
}: InsuranceIntelligenceModuleProps) {
  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Module 03"
        title="Insurance Intelligence Module"
        description="Tracks claim lifecycle movement, logs carrier interactions, and quantifies where scope mismatches are creating under-recovery risk."
      />

      <section className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Active claims" value={String(data.claims.length)} />
        <MetricCard
          label="Discrepancy exposure"
          value={formatCurrency(data.discrepancyExposureUsd)}
          support="estimated claim value at risk"
        />
        <MetricCard
          label="Open carrier follow-ups"
          value={String(data.carrierInteractions.filter((item) => item.requiresFollowUp).length)}
          support="interaction items requiring immediate response"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <Card>
            <CardTitle
              title="Claim Lifecycle Tracking"
              subtitle="Real-time stage posture and financial trajectory."
            />
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="text-xs uppercase tracking-wide text-slate-400">
                  <tr>
                    <th className="pb-2 pr-3">Claim</th>
                    <th className="pb-2 pr-3">Stage</th>
                    <th className="pb-2 pr-3">Claimed</th>
                    <th className="pb-2">Approved</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {data.claims.map((claim) => (
                    <tr key={claim.id}>
                      <td className="py-3 pr-3">
                        <p className="font-medium text-white">{claim.claimNumber}</p>
                        <p className="text-xs text-slate-400">{claim.carrier}</p>
                      </td>
                      <td className="py-3 pr-3">
                        <Badge tone={claimStageTone(claim.stage)}>{claim.stage}</Badge>
                      </td>
                      <td className="py-3 pr-3 text-slate-200">
                        {formatCurrency(claim.claimedAmountUsd)}
                      </td>
                      <td className="py-3 text-slate-200">{formatCurrency(claim.approvedAmountUsd)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card>
            <CardTitle
              title="Carrier Interaction Log"
              subtitle="Documented contact history with follow-up accountability."
            />
            <ul className="space-y-3">
              {data.carrierInteractions.map((interaction) => (
                <li
                  key={interaction.id}
                  className="rounded-xl border border-slate-800 bg-slate-950/70 p-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm font-medium text-white">{interaction.summary}</p>
                    <Badge tone={interaction.requiresFollowUp ? "warning" : "success"}>
                      {interaction.requiresFollowUp ? "FOLLOW UP" : "CLOSED LOOP"}
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-slate-400">
                    {formatDate(interaction.occurredAt)} · {interaction.channel} · owner:{" "}
                    {interaction.owner}
                  </p>
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <CardTitle
              title="Scope Comparison & Discrepancy Detection"
              subtitle="Line-item level mismatch analysis between carrier and contractor scope."
            />
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="text-xs uppercase tracking-wide text-slate-400">
                  <tr>
                    <th className="pb-2 pr-3">Line item</th>
                    <th className="pb-2 pr-3">Type</th>
                    <th className="pb-2 pr-3">Carrier value</th>
                    <th className="pb-2">Scoped value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {data.scopeComparisons.map((line) => {
                    const carrierValue = line.insurerQuantity * line.insurerUnitCostUsd;
                    const scopedValue = line.contractorQuantity * line.contractorUnitCostUsd;
                    return (
                      <tr key={line.id}>
                        <td className="py-2 pr-3 text-slate-100">{line.lineItem}</td>
                        <td className="py-2 pr-3">
                          <Badge tone="high">{line.discrepancyType}</Badge>
                        </td>
                        <td className="py-2 pr-3 text-slate-300">{formatCurrency(carrierValue)}</td>
                        <td className="py-2 text-slate-300">{formatCurrency(scopedValue)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        <AtosAssistantPanel
          module="insurance-intelligence"
          summary={atos.summary}
          guidance={atos.guidance}
        />
      </section>
    </div>
  );
}
