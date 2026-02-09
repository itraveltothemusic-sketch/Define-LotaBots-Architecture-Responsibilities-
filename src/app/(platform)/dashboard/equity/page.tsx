import { AtosPanel } from "@/components/atos/atos-panel";
import { ModuleHeader } from "@/components/dashboard/module-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { Card } from "@/components/ui/card";
import { getEquitySnapshot } from "@/lib/services/equity";
import { formatCurrency, formatDelta } from "@/lib/utils/format";

export default async function EquityModulePage() {
  const snapshot = await getEquitySnapshot();

  const totalClaimValue = snapshot.outcomes.reduce(
    (sum, outcome) => sum + outcome.claimEstimate,
    0,
  );
  const totalPayout = snapshot.outcomes.reduce(
    (sum, outcome) => sum + outcome.payoutValue,
    0,
  );

  return (
    <div className="space-y-6">
      <ModuleHeader
        eyebrow="Module 4"
        title="Equity Outcome Module"
        description="Valuation delta intelligence connecting claim performance and execution quality to realized property equity."
      />

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Portfolio baseline value"
          value={formatCurrency(snapshot.aggregateBaseline)}
          trend="pre-recovery valuation"
        />
        <StatCard
          label="Portfolio post-recovery value"
          value={formatCurrency(snapshot.aggregateRecovered)}
          trend={`delta ${formatDelta(snapshot.aggregateRecovered, snapshot.aggregateBaseline)}`}
        />
        <StatCard
          label="Claim payout conversion"
          value={formatDelta(totalPayout, totalClaimValue)}
          trend={`${formatCurrency(totalPayout)} paid of ${formatCurrency(totalClaimValue)} estimated`}
        />
      </section>

      <Card
        title="Property-level equity narrative"
        subtitle="Before/after valuation, claim payout alignment, and strategic interpretation"
      >
        <div className="space-y-3">
          {snapshot.outcomes.map((outcome) => (
            <article
              key={outcome.id}
              className="rounded-lg border border-slate-200 bg-white p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {snapshot.propertyNameById[outcome.propertyId]}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Baseline {formatCurrency(outcome.baselineValue)} · Recovered{" "}
                    {formatCurrency(outcome.postRecoveryValue)} · Delta{" "}
                    {formatDelta(outcome.postRecoveryValue, outcome.baselineValue)}
                  </p>
                </div>
                <p className="text-xs text-slate-600">
                  Claim {formatCurrency(outcome.claimEstimate)} / Payout{" "}
                  {formatCurrency(outcome.payoutValue)}
                </p>
              </div>
              <p className="mt-3 text-sm text-slate-700">{outcome.narrative}</p>
            </article>
          ))}
        </div>
      </Card>

      <AtosPanel brief={snapshot.atosBrief} />
    </div>
  );
}
