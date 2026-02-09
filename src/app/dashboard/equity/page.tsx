import { AssistantPanel } from "@/components/atos/assistant-panel";
import { GuidanceList } from "@/components/atos/guidance-list";
import { KpiCard } from "@/components/ui/kpi-card";
import { ModuleAccessDenied } from "@/components/ui/module-access-denied";
import { getModuleAccess } from "@/lib/auth/module-guard";
import { listEquityOutcomes } from "@/lib/db/repositories";
import { generateModuleGuidance } from "@/lib/intelligence/atos";
import { formatCurrency, formatPercent } from "@/lib/utils/format";

export default async function EquityOutcomePage() {
  const [{ allowed }, outcomes, guidance] = await Promise.all([
    getModuleAccess("equity-outcome"),
    listEquityOutcomes(),
    generateModuleGuidance("equity-outcome"),
  ]);

  if (!allowed) {
    return <ModuleAccessDenied module="equity-outcome" />;
  }

  const totalEquityGainUsd = outcomes.reduce(
    (total, outcome) => total + outcome.equityGainUsd,
    0,
  );
  const totalSubmittedClaims = outcomes.reduce(
    (total, outcome) => total + outcome.claimSubmittedUsd,
    0,
  );
  const totalPayout = outcomes.reduce(
    (total, outcome) => total + outcome.payoutReceivedUsd,
    0,
  );
  const valuationBefore = outcomes.reduce(
    (total, outcome) => total + outcome.valuationBeforeUsd,
    0,
  );
  const valuationAfter = outcomes.reduce(
    (total, outcome) => total + outcome.valuationAfterUsd,
    0,
  );

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Equity Outcome Module</h2>
        <p className="mt-1 text-sm text-slate-600">
          Before/after valuation, claim-to-payout delta, and investor-grade outcome
          narrative.
        </p>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Portfolio Equity Gain" value={formatCurrency(totalEquityGainUsd)} />
        <KpiCard
          label="Claim vs Payout"
          value={`${formatCurrency(totalSubmittedClaims)} / ${formatCurrency(totalPayout)}`}
          intent={totalPayout < totalSubmittedClaims ? "alert" : "positive"}
        />
        <KpiCard
          label="Valuation Lift"
          value={formatCurrency(valuationAfter - valuationBefore)}
          trend={`${formatCurrency(valuationBefore)} → ${formatCurrency(valuationAfter)}`}
          intent="positive"
        />
        <KpiCard
          label="Recovery Efficiency"
          value={
            totalSubmittedClaims > 0
              ? formatPercent(totalPayout / totalSubmittedClaims)
              : "0%"
          }
          trend="Payout captured against submitted scope."
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <GuidanceList guidance={guidance} />
        <AssistantPanel module="equity-outcome" />
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-base font-semibold text-slate-900">Equity Gain Narrative</h3>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {outcomes.map((outcome) => (
            <article
              key={outcome.id}
              className="rounded-xl border border-slate-200 bg-slate-50 p-4"
            >
              <p className="text-sm font-semibold text-slate-900">Asset {outcome.propertyId}</p>
              <p className="mt-2 text-sm text-slate-700">{outcome.narrative}</p>
              <dl className="mt-3 space-y-1 text-xs text-slate-600">
                <div className="flex justify-between gap-2">
                  <dt>Valuation Before</dt>
                  <dd>{formatCurrency(outcome.valuationBeforeUsd)}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt>Valuation After</dt>
                  <dd>{formatCurrency(outcome.valuationAfterUsd)}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt>Claim Submitted</dt>
                  <dd>{formatCurrency(outcome.claimSubmittedUsd)}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt>Payout Received</dt>
                  <dd>{formatCurrency(outcome.payoutReceivedUsd)}</dd>
                </div>
                <div className="flex justify-between gap-2 font-semibold text-slate-900">
                  <dt>Equity Gain</dt>
                  <dd>{formatCurrency(outcome.equityGainUsd)}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
