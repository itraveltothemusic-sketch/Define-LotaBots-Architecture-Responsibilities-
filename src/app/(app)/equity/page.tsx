import { redirect } from "next/navigation";

import { AtosPanel } from "@/components/atos/atos-panel";
import { MetricCard } from "@/components/intelligence/metric-card";
import { Card, CardTitle } from "@/components/ui/card";
import { canAccessModule } from "@/lib/auth/permissions";
import { getSession } from "@/lib/auth/session";
import { generateAtosGuidance } from "@/lib/atos";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { getRoleScopedSnapshot } from "@/server/repositories/platform-repository";

export default async function EquityPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  if (!canAccessModule(session.role, "equity")) {
    redirect("/not-authorized");
  }

  const snapshot = await getRoleScopedSnapshot(session.role);
  const atosGuidance = generateAtosGuidance("equity", snapshot);

  const valuationLift =
    ((snapshot.equity.postExecutionValuationUsd - snapshot.equity.baselineValuationUsd) /
      snapshot.equity.baselineValuationUsd) *
    100;

  return (
    <div className="space-y-6">
      <section>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Equity Outcome Module</p>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">
          Valuation impact, recovery deltas, and confidence narrative
        </h1>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Baseline Valuation"
          value={formatCurrency(snapshot.equity.baselineValuationUsd)}
          detail="Pre-loss valuation baseline."
          tone="neutral"
        />
        <MetricCard
          label="Post-Execution Valuation"
          value={formatCurrency(snapshot.equity.postExecutionValuationUsd)}
          detail={`Lift of ${formatPercent(valuationLift)} over baseline.`}
          tone="success"
        />
        <MetricCard
          label="Projected Equity Gain"
          value={formatCurrency(snapshot.equity.projectedEquityGainUsd)}
          detail="Forecast from validated restoration and risk mitigation."
          tone="info"
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.45fr_0.95fr]">
        <div className="space-y-4">
          <Card>
            <CardTitle
              title="Claim vs Payout Delta"
              subtitle="Reconciliation between submitted claim and settled insurance outcomes."
            />
            <div className="grid gap-3 text-sm sm:grid-cols-2">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900">
                <p className="text-xs uppercase tracking-wide text-slate-500">Total Claimed</p>
                <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">
                  {formatCurrency(snapshot.equity.totalClaimedUsd)}
                </p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900">
                <p className="text-xs uppercase tracking-wide text-slate-500">Total Settled</p>
                <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">
                  {formatCurrency(snapshot.equity.totalSettledUsd)}
                </p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900 sm:col-span-2">
                <p className="text-xs uppercase tracking-wide text-slate-500">Net Recovery Delta</p>
                <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">
                  {formatCurrency(snapshot.equity.netRecoveryDeltaUsd)}
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <CardTitle
              title="Equity Gain Narrative"
              subtitle="Explainable summary linking operational work to financial improvement."
            />
            <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              {snapshot.equity.narrative}
            </p>
          </Card>
        </div>

        <AtosPanel guidance={atosGuidance} />
      </section>
    </div>
  );
}
