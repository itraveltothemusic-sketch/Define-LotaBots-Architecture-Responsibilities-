import { AssistantPanel } from "@/components/atos/assistant-panel";
import { GuidanceList } from "@/components/atos/guidance-list";
import { EvidenceTimeline } from "@/components/intelligence/evidence-timeline";
import { PropertyOverviewGrid } from "@/components/intelligence/property-overview-grid";
import { KpiCard } from "@/components/ui/kpi-card";
import { ModuleAccessDenied } from "@/components/ui/module-access-denied";
import { getModuleAccess } from "@/lib/auth/module-guard";
import { getIntelligenceSnapshot, listEvidence, listPropertyProfiles } from "@/lib/db/repositories";
import { getPortfolioKpis } from "@/lib/intelligence/analytics";
import { generateModuleGuidance } from "@/lib/intelligence/atos";
import { formatCurrency, formatPercent } from "@/lib/utils/format";

export default async function IntelligenceCenterPage() {
  const [{ allowed }, snapshot, properties, evidence, guidance, kpis] = await Promise.all([
    getModuleAccess("intelligence"),
    getIntelligenceSnapshot(),
    listPropertyProfiles(),
    listEvidence(),
    generateModuleGuidance("intelligence"),
    getPortfolioKpis(),
  ]);

  if (!allowed) {
    return <ModuleAccessDenied module="intelligence" />;
  }

  const timeline = [...evidence]
    .sort((left, right) => right.capturedAt.localeCompare(left.capturedAt))
    .slice(0, 6);
  const payoutCaptureRatio =
    snapshot.totalClaimSubmittedUsd > 0
      ? snapshot.totalPayoutUsd / snapshot.totalClaimSubmittedUsd
      : 0;

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-indigo-200 bg-indigo-50/50 p-5">
        <h2 className="text-lg font-semibold text-indigo-950">Intelligence Center</h2>
        <p className="mt-1 text-sm text-indigo-900/80">
          Unified command of property condition, evidence defensibility, and claim posture.
        </p>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Portfolio Insured Value"
          value={formatCurrency(kpis.totalInsuredValueUsd)}
          trend="Total insured exposure under active management."
        />
        <KpiCard
          label="Submitted Claims"
          value={formatCurrency(snapshot.totalClaimSubmittedUsd)}
          trend={`Payout captured ${formatPercent(payoutCaptureRatio, 0)}`}
        />
        <KpiCard
          label="Evidence Verification"
          value={formatPercent(snapshot.verificationCoveragePct)}
          trend={`${snapshot.unresolvedEvidenceCount} package(s) require resolution.`}
          intent={snapshot.unresolvedEvidenceCount > 0 ? "alert" : "positive"}
        />
        <KpiCard
          label="Realized Equity Gain"
          value={formatCurrency(kpis.totalEquityGainUsd)}
          trend={`${snapshot.criticalRiskCount} critical risk cluster(s) still active.`}
          intent={snapshot.criticalRiskCount > 0 ? "alert" : "positive"}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <GuidanceList guidance={guidance} />
        <AssistantPanel module="intelligence" />
      </div>

      <PropertyOverviewGrid properties={properties} />
      <EvidenceTimeline items={timeline} />
    </div>
  );
}
