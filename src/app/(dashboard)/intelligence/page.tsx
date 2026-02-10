import {
  Brain,
  Building2,
  AlertTriangle,
  TrendingUp,
  Clock,
  ArrowRight,
  BarChart3,
  Shield,
} from "lucide-react";
import { MetricCard } from "@/components/ui/metric-card";
import { Card } from "@/components/ui/card";
import { StatusBadge, getPropertyStatusVariant, getClaimStatusVariant } from "@/components/ui/status-badge";
import { ATOSInsightPanel } from "@/components/atos/insight-panel";
import { ATOSAssistant } from "@/components/atos/assistant";
import { formatCurrency, formatPercentage } from "@/lib/utils";
import {
  mockDashboardMetrics,
  mockProperties,
  mockClaims,
  mockATOSInsights,
} from "@/lib/db/mock-data";
import Link from "next/link";

/**
 * Intelligence Center — The Heart of the Platform
 *
 * This is the "war room" view that synthesizes intelligence
 * from all modules into a single, actionable interface.
 *
 * Layout:
 * - Top: Key portfolio-level metrics
 * - Left (2/3): Module status summaries + insight feed
 * - Right (1/3): ATOS assistant (always available)
 *
 * This page should make the user feel like they have a
 * forensic expert + strategist looking over their shoulder.
 */
export default function IntelligenceCenterPage() {
  const metrics = mockDashboardMetrics;
  const allInsights = mockATOSInsights;
  const acknowledgedInsights = allInsights.filter((i) => i.acknowledged);
  const pendingInsights = allInsights.filter((i) => !i.acknowledged);

  // Calculate portfolio-level intelligence
  const totalClaimValue = mockClaims.reduce((sum, c) => sum + (c.claimedAmount || 0), 0);
  const totalApproved = mockClaims.reduce((sum, c) => sum + (c.approvedAmount || 0), 0);
  const totalDiscrepancy = mockClaims.reduce((sum, c) => sum + (c.discrepancyAmount || 0), 0);
  const avgRecoveryRate = totalApproved > 0 ? (totalApproved / totalClaimValue) * 100 : 0;

  // Properties by status for the pipeline view
  const statusCounts = mockProperties.reduce(
    (acc, p) => {
      acc[p.status] = (acc[p.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-violet-100">
              <Brain className="w-5 h-5 text-violet-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                Intelligence Center
              </h1>
              <p className="text-sm text-slate-500">
                Unified portfolio intelligence powered by ATOS
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-violet-50 border border-violet-200">
          <div className="w-2 h-2 bg-violet-500 rounded-full atos-pulse" />
          <span className="text-xs font-semibold text-violet-700">ATOS Active</span>
        </div>
      </div>

      {/* Portfolio Intelligence Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard
          title="Portfolio Value"
          value={formatCurrency(mockProperties.reduce((sum, p) => sum + (p.preEventValue || 0), 0))}
          subtitle="Pre-event aggregate"
          icon={<Building2 className="w-5 h-5 text-blue-500" />}
        />
        <MetricCard
          title="Total Claims Filed"
          value={formatCurrency(totalClaimValue)}
          subtitle={`${mockClaims.length} active claims`}
          icon={<BarChart3 className="w-5 h-5 text-amber-500" />}
        />
        <MetricCard
          title="Recovery Rate"
          value={formatPercentage(avgRecoveryRate)}
          trend={{ direction: "up", value: "+2.3%", isPositive: true }}
          subtitle="vs. industry average"
          icon={<Shield className="w-5 h-5 text-emerald-500" />}
        />
        <MetricCard
          title="Open Discrepancies"
          value={formatCurrency(totalDiscrepancy)}
          trend={{ direction: "down", value: "-$12K", isPositive: true }}
          subtitle="Being negotiated"
          icon={<AlertTriangle className="w-5 h-5 text-red-500" />}
        />
        <MetricCard
          title="Equity Realized"
          value={formatCurrency(metrics.totalEquityGained)}
          trend={{ direction: "up", value: formatPercentage(metrics.averageEquityGainPercentage), isPositive: true }}
          subtitle="Verified gains"
          icon={<TrendingUp className="w-5 h-5 text-emerald-500" />}
        />
      </div>

      {/* Main content: Intelligence feed + ATOS Assistant */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Intelligence feed */}
        <div className="lg:col-span-2 space-y-6">
          {/* Property Pipeline */}
          <Card
            title="Property Pipeline"
            description="Current state of all properties in the portfolio"
          >
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {[
                { label: "Inspection", count: (statusCounts["inspection_scheduled"] || 0) + (statusCounts["inspection_complete"] || 0), color: "bg-blue-500" },
                { label: "Claims Active", count: (statusCounts["claim_filed"] || 0) + (statusCounts["claim_in_progress"] || 0), color: "bg-amber-500" },
                { label: "Restoration", count: (statusCounts["restoration_active"] || 0), color: "bg-orange-500" },
                { label: "Equity Realized", count: (statusCounts["equity_realized"] || 0), color: "bg-emerald-500" },
              ].map((stage) => (
                <div
                  key={stage.label}
                  className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50/50"
                >
                  <div className={`w-3 h-3 rounded-full ${stage.color}`} />
                  <div>
                    <div className="text-lg font-bold text-slate-900">
                      {stage.count}
                    </div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-wide">
                      {stage.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Property list with claims status */}
            <div className="space-y-2">
              {mockProperties.map((property) => {
                const status = getPropertyStatusVariant(property.status);
                const claim = mockClaims.find((c) => c.propertyId === property.id);
                const claimStatus = claim ? getClaimStatusVariant(claim.status) : null;

                return (
                  <Link
                    key={property.id}
                    href={`/properties/${property.id}`}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-all group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Building2 className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-slate-800 truncate">
                          {property.address}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {property.city}, {property.state} · {property.stormEventType}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                      {claimStatus && (
                        <StatusBadge label={claimStatus.label} variant={claimStatus.variant} size="sm" />
                      )}
                      <StatusBadge label={status.label} variant={status.variant} size="sm" />
                      <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </Card>

          {/* ATOS Insights Feed */}
          <ATOSInsightPanel insights={allInsights} />

          {/* Claims Discrepancy Analysis */}
          <Card
            title="Claims Discrepancy Analysis"
            description="Gap between forensic assessments and carrier approvals"
          >
            <div className="space-y-4">
              {mockClaims
                .filter((c) => c.discrepancyAmount && c.discrepancyAmount > 0)
                .map((claim) => {
                  const property = mockProperties.find((p) => p.id === claim.propertyId);
                  const pctRecovered = claim.approvedAmount && claim.claimedAmount
                    ? (claim.approvedAmount / claim.claimedAmount) * 100
                    : 0;

                  return (
                    <div key={claim.id} className="p-4 rounded-xl border border-slate-100">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="text-sm font-semibold text-slate-900">
                            {claim.claimNumber}
                          </div>
                          <div className="text-xs text-slate-400">
                            {property?.address} · {claim.carrierName}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-red-600">
                            {formatCurrency(claim.discrepancyAmount || 0)} gap
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {formatPercentage(pctRecovered)} recovered
                          </div>
                        </div>
                      </div>
                      {/* Visual bar showing claimed vs approved */}
                      <div className="relative h-3 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="absolute left-0 top-0 bottom-0 bg-emerald-500 rounded-full"
                          style={{ width: `${pctRecovered}%` }}
                        />
                        <div
                          className="absolute top-0 bottom-0 bg-red-300 rounded-r-full"
                          style={{
                            left: `${pctRecovered}%`,
                            width: `${100 - pctRecovered}%`,
                          }}
                        />
                      </div>
                      <div className="flex justify-between mt-1.5">
                        <span className="text-[10px] text-emerald-600 font-medium">
                          Approved: {formatCurrency(claim.approvedAmount || 0)}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          Claimed: {formatCurrency(claim.claimedAmount || 0)}
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </Card>
        </div>

        {/* Right column: ATOS Assistant */}
        <div className="space-y-6">
          <ATOSAssistant />

          {/* Quick Actions */}
          <Card title="Quick Actions" description="Common workflows">
            <div className="space-y-2">
              {[
                { label: "Add New Property", href: "/properties", icon: Building2 },
                { label: "File New Claim", href: "/insurance", icon: BarChart3 },
                { label: "Schedule Inspection", href: "/properties", icon: Clock },
                { label: "Generate Equity Report", href: "/equity", icon: TrendingUp },
              ].map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-all group"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-emerald-50 transition-colors">
                    <action.icon className="w-4 h-4 text-slate-500 group-hover:text-emerald-600" />
                  </div>
                  <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">
                    {action.label}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500 ml-auto" />
                </Link>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
