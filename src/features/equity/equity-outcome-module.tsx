import { AtosAssistantPanel } from "@/components/atos/assistant-panel";
import { Badge } from "@/components/ui/badge";
import { Card, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/ui/metric-card";
import { SectionHeader } from "@/components/ui/section-header";
import type { AtosAnalysis } from "@/lib/atos/engine";
import type { EquityOutcomeData } from "@/lib/data/repository";
import { formatCurrency, formatDate } from "@/lib/utils";

interface EquityOutcomeModuleProps {
  data: EquityOutcomeData;
  atos: AtosAnalysis;
}

export function EquityOutcomeModule({ data, atos }: EquityOutcomeModuleProps) {
  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Module 05"
        title="Equity Outcome Module"
        description="Quantifies value creation from forensic execution, tracks claim-to-payout deltas, and produces investor-grade equity narratives."
      />

      <section className="grid gap-4 md:grid-cols-2">
        <MetricCard label="Aggregate equity gain" value={formatCurrency(data.aggregateGainUsd)} />
        <MetricCard
          label="Carrier delta"
          value={formatCurrency(data.aggregateCarrierDeltaUsd)}
          support="requested claim value minus paid amount"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <Card>
            <CardTitle
              title="Before / After Valuation"
              subtitle="Asset-level valuation shift after forensic and execution lifecycle."
            />
            <div className="space-y-3">
              {data.outcomes.map((outcome) => {
                const gain = outcome.valuationAfterUsd - outcome.valuationBeforeUsd;
                const spreadPercent = gain / outcome.valuationBeforeUsd;
                return (
                  <div
                    key={outcome.id}
                    className="rounded-xl border border-slate-800 bg-slate-950/70 p-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="text-sm font-medium text-white">{outcome.propertyId}</p>
                      <Badge tone={gain >= 0 ? "success" : "critical"}>
                        {gain >= 0 ? "Value Growth" : "Value Decline"}
                      </Badge>
                    </div>
                    <p className="mt-2 text-sm text-slate-300">
                      {formatCurrency(outcome.valuationBeforeUsd)} →{" "}
                      {formatCurrency(outcome.valuationAfterUsd)}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      Net shift: {formatCurrency(gain)} ({(spreadPercent * 100).toFixed(1)}%)
                    </p>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card>
            <CardTitle
              title="Claim vs Payout Delta"
              subtitle="Financial leakage diagnostics by property."
            />
            <div className="space-y-3">
              {data.outcomes.map((outcome) => {
                const delta = outcome.claimRequestedUsd - outcome.claimPaidUsd;
                const recovery = outcome.claimPaidUsd / outcome.claimRequestedUsd;
                return (
                  <div
                    key={`${outcome.id}-delta`}
                    className="rounded-xl border border-slate-800 bg-slate-950/70 p-3"
                  >
                    <p className="text-sm font-medium text-white">{outcome.propertyId}</p>
                    <p className="mt-1 text-sm text-slate-300">
                      Requested: {formatCurrency(outcome.claimRequestedUsd)} · Paid:{" "}
                      {formatCurrency(outcome.claimPaidUsd)}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      Delta: {formatCurrency(delta)} · Recovery ratio: {(recovery * 100).toFixed(1)}%
                    </p>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card>
            <CardTitle
              title="Equity Gain Narrative Reports"
              subtitle="Confidence-scored strategic narratives for internal and investor consumption."
            />
            <ul className="space-y-3">
              {data.reports.map((report) => (
                <li
                  key={report.id}
                  className="rounded-xl border border-slate-800 bg-slate-950/70 p-3"
                >
                  <p className="text-sm font-medium text-white">{report.title}</p>
                  <p className="mt-1 text-xs text-slate-400">
                    Generated {formatDate(report.generatedAt)} · confidence{" "}
                    {(report.confidence * 100).toFixed(0)}%
                  </p>
                  <p className="mt-2 text-sm text-slate-300">{report.executiveSummary}</p>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <AtosAssistantPanel module="equity-outcome" summary={atos.summary} guidance={atos.guidance} />
      </section>
    </div>
  );
}
