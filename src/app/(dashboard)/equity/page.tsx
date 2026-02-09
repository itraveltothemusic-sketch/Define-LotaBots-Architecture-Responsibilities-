import {
  TrendingUp,
  DollarSign,
  Building2,
  ArrowRight,
  BarChart3,
  Shield,
  FileText,
  Download,
  CheckCircle2,
} from "lucide-react";
import { MetricCard } from "@/components/ui/metric-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatCurrency, formatPercentage, formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import {
  mockProperties,
  mockEquityOutcomes,
  mockClaims,
} from "@/lib/db/mock-data";
import Link from "next/link";

/**
 * Equity Outcomes Page — The payoff.
 *
 * This is where the entire pipeline converges into a single number:
 * how much equity was created.
 *
 * Every equity figure must be:
 * 1. Derived from documented data (not projections)
 * 2. Traceable back to specific evidence
 * 3. Defensible to an investor or auditor
 * 4. Accompanied by a narrative explaining HOW
 *
 * This page builds the ultimate trust document.
 */
export default function EquityPage() {
  // Portfolio-level equity calculations
  const totalPreValue = mockProperties.reduce(
    (sum, p) => sum + (p.preEventValue || 0),
    0
  );
  const propertiesWithPostValue = mockProperties.filter(
    (p) => p.postRestorationValue
  );
  const totalPostValue = propertiesWithPostValue.reduce(
    (sum, p) => sum + (p.postRestorationValue || 0),
    0
  );
  const totalPreOfCompleted = propertiesWithPostValue.reduce(
    (sum, p) => sum + (p.preEventValue || 0),
    0
  );
  const totalEquityGain = totalPostValue - totalPreOfCompleted;
  const avgGainPct =
    totalPreOfCompleted > 0
      ? (totalEquityGain / totalPreOfCompleted) * 100
      : 0;
  const totalInsurancePayout = mockEquityOutcomes.reduce(
    (sum, eo) => sum + eo.totalInsurancePayout,
    0
  );
  const totalRestorationCost = mockEquityOutcomes.reduce(
    (sum, eo) => sum + eo.totalRestorationCost,
    0
  );

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Equity Outcomes</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Before/after valuations, equity gain analysis, and defensible reports
          </p>
        </div>
        <Button variant="secondary">
          <Download className="w-4 h-4" />
          Export Portfolio Report
        </Button>
      </div>

      {/* Portfolio equity metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Equity Gained"
          value={formatCurrency(totalEquityGain)}
          trend={{
            direction: "up",
            value: formatPercentage(avgGainPct),
            isPositive: true,
          }}
          subtitle="Verified outcomes"
          icon={<TrendingUp className="w-5 h-5 text-emerald-500" />}
        />
        <MetricCard
          title="Insurance Recovery"
          value={formatCurrency(totalInsurancePayout)}
          subtitle="Total insurance payouts"
          icon={<Shield className="w-5 h-5 text-blue-500" />}
        />
        <MetricCard
          title="Restoration Investment"
          value={formatCurrency(totalRestorationCost)}
          subtitle="Total restoration costs"
          icon={<DollarSign className="w-5 h-5 text-amber-500" />}
        />
        <MetricCard
          title="Net ROI"
          value={formatPercentage(
            totalRestorationCost > 0
              ? ((totalInsurancePayout - totalRestorationCost) / totalRestorationCost) * 100
              : 0
          )}
          trend={{
            direction: "up",
            value: "Strong performance",
            isPositive: true,
          }}
          subtitle="Insurance payout vs cost"
          icon={<BarChart3 className="w-5 h-5 text-emerald-500" />}
        />
      </div>

      {/* Portfolio value comparison */}
      <Card
        title="Portfolio Value Analysis"
        description="Pre-event vs post-restoration value comparison"
      >
        <div className="space-y-4">
          {mockProperties.map((property) => {
            const hasOutcome = property.postRestorationValue !== null;
            const equityGain = hasOutcome
              ? (property.postRestorationValue || 0) - (property.preEventValue || 0)
              : null;
            const gainPct =
              hasOutcome && property.preEventValue
                ? ((equityGain || 0) / property.preEventValue) * 100
                : null;

            return (
              <Link
                key={property.id}
                href={`/equity/${property.id}`}
                className="block group"
              >
                <div className="p-4 rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Building2 className="w-5 h-5 text-slate-400" />
                      <div>
                        <h3 className="text-sm font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors">
                          {property.address}
                        </h3>
                        <div className="text-xs text-slate-400">
                          {property.city}, {property.state} · {property.propertyType.replace("_", " ")}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {hasOutcome ? (
                        <div className="text-right">
                          <div className="text-sm font-bold text-emerald-600">
                            +{formatCurrency(equityGain || 0)}
                          </div>
                          <div className="text-[10px] text-emerald-500">
                            +{formatPercentage(gainPct || 0)} equity gain
                          </div>
                        </div>
                      ) : (
                        <StatusBadge label="In Progress" variant="warning" size="sm" />
                      )}
                      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500" />
                    </div>
                  </div>

                  {/* Value bars */}
                  <div className="space-y-2">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] text-slate-500">
                          Pre-Event Value
                        </span>
                        <span className="text-xs font-semibold text-slate-700">
                          {property.preEventValue
                            ? formatCurrency(property.preEventValue)
                            : "—"}
                        </span>
                      </div>
                      <div className="h-3 bg-slate-200 rounded-full" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] text-slate-500">
                          Post-Restoration Value
                        </span>
                        <span
                          className={cn(
                            "text-xs font-semibold",
                            hasOutcome ? "text-emerald-600" : "text-slate-400"
                          )}
                        >
                          {property.postRestorationValue
                            ? formatCurrency(property.postRestorationValue)
                            : "Pending Assessment"}
                        </span>
                      </div>
                      {property.preEventValue && (
                        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={cn(
                              "h-full rounded-full",
                              hasOutcome ? "bg-emerald-500" : "bg-slate-300"
                            )}
                            style={{
                              width: hasOutcome
                                ? `${Math.min(
                                    ((property.postRestorationValue || 0) /
                                      (property.preEventValue * 1.5)) *
                                      100,
                                    100
                                  )}%`
                                : "0%",
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </Card>

      {/* Completed equity reports */}
      {mockEquityOutcomes.length > 0 && (
        <Card
          title="Verified Equity Reports"
          description="Completed and verified equity gain narratives"
        >
          {mockEquityOutcomes.map((outcome) => {
            const property = mockProperties.find((p) => p.id === outcome.propertyId);
            return (
              <div
                key={outcome.id}
                className="p-6 rounded-xl border border-emerald-200 bg-emerald-50/50"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <h3 className="text-sm font-bold text-slate-900">
                        {property?.address || "Property"}
                      </h3>
                      <StatusBadge
                        label="Verified"
                        variant="success"
                        size="sm"
                      />
                    </div>
                    <div className="text-xs text-slate-500 mt-1 ml-8">
                      {property?.city}, {property?.state} · Generated{" "}
                      {formatDate(outcome.generatedAt)}
                      {outcome.verifiedAt &&
                        ` · Verified ${formatDate(outcome.verifiedAt)}`}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-emerald-600">
                      +{formatCurrency(outcome.netEquityGain)}
                    </div>
                    <div className="text-xs text-emerald-500">
                      +{formatPercentage(outcome.equityGainPercentage)} gain
                    </div>
                  </div>
                </div>

                {/* Financial breakdown */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-5 ml-8">
                  {[
                    {
                      label: "Pre-Event",
                      value: formatCurrency(outcome.preEventValue),
                    },
                    {
                      label: "Post-Restoration",
                      value: formatCurrency(outcome.postRestorationValue),
                    },
                    {
                      label: "Claim Amount",
                      value: formatCurrency(outcome.totalClaimAmount),
                    },
                    {
                      label: "Insurance Payout",
                      value: formatCurrency(outcome.totalInsurancePayout),
                    },
                    {
                      label: "Restoration Cost",
                      value: formatCurrency(outcome.totalRestorationCost),
                    },
                  ].map((item) => (
                    <div key={item.label} className="p-2 rounded-lg bg-white">
                      <div className="text-[9px] text-slate-400 uppercase tracking-wide">
                        {item.label}
                      </div>
                      <div className="text-xs font-bold text-slate-800 mt-0.5">
                        {item.value}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Narrative */}
                {outcome.narrative && (
                  <div className="ml-8 p-4 rounded-lg bg-white border border-slate-100">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-4 h-4 text-slate-400" />
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                        Equity Gain Narrative
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {outcome.narrative}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </Card>
      )}
    </div>
  );
}
