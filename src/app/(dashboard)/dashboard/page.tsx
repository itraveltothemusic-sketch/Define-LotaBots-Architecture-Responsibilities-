import {
  Building2,
  ClipboardList,
  HardHat,
  TrendingUp,
  AlertTriangle,
  Search,
  ArrowRight,
} from "lucide-react";
import { MetricCard } from "@/components/ui/metric-card";
import { Card } from "@/components/ui/card";
import { StatusBadge, getPropertyStatusVariant, getClaimStatusVariant } from "@/components/ui/status-badge";
import { ATOSInsightPanel } from "@/components/atos/insight-panel";
import { PropertyTimeline } from "@/components/dashboard/property-timeline";
import { formatCurrency, formatPercentage } from "@/lib/utils";
import { mockDashboardMetrics, mockProperties, mockClaims, mockATOSInsights, mockTimelineEvents } from "@/lib/db/mock-data";
import Link from "next/link";

/**
 * Main Dashboard Page — The Intelligence Center entry point.
 *
 * This is the first thing users see after login.
 * It must answer three questions instantly:
 * 1. What is the overall state of my portfolio?
 * 2. What needs my attention right now?
 * 3. What is ATOS telling me?
 *
 * Layout: Metrics row > ATOS insights > Properties overview + Timeline
 */
export default function DashboardPage() {
  const metrics = mockDashboardMetrics;
  const recentProperties = mockProperties.slice(0, 4);
  const activeClaims = mockClaims.filter((c) => c.status !== "settled" && c.status !== "closed");
  const insights = mockATOSInsights.filter((i) => !i.acknowledged).slice(0, 3);
  const recentTimeline = mockTimelineEvents.slice(-5).reverse();

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900">
          Intelligence Dashboard
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Portfolio overview and actionable intelligence for your properties.
        </p>
      </div>

      {/* KPI metrics row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Properties"
          value={String(metrics.totalProperties)}
          subtitle="Across DFW region"
          icon={<Building2 className="w-5 h-5 text-blue-500" />}
        />
        <MetricCard
          title="Pending Claims"
          value={String(metrics.pendingClaims)}
          trend={{ direction: "flat", value: "No change", isPositive: true }}
          subtitle="Requiring action"
          icon={<ClipboardList className="w-5 h-5 text-amber-500" />}
        />
        <MetricCard
          title="Active Restorations"
          value={String(metrics.activeRestorations)}
          subtitle="In progress"
          icon={<HardHat className="w-5 h-5 text-orange-500" />}
        />
        <MetricCard
          title="Total Equity Gained"
          value={formatCurrency(metrics.totalEquityGained)}
          trend={{ direction: "up", value: formatPercentage(metrics.averageEquityGainPercentage), isPositive: true }}
          subtitle="Verified outcomes"
          icon={<TrendingUp className="w-5 h-5 text-emerald-500" />}
        />
      </div>

      {/* ATOS Insights — the intelligence layer */}
      {insights.length > 0 && (
        <ATOSInsightPanel insights={insights} />
      )}

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Properties overview — takes 2/3 on large screens */}
        <div className="lg:col-span-2 space-y-6">
          <Card
            title="Properties"
            description="All managed properties and their current status"
            action={
              <Link
                href="/properties"
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
              >
                View All <ArrowRight className="w-3 h-3" />
              </Link>
            }
          >
            <div className="space-y-3">
              {recentProperties.map((property) => {
                const status = getPropertyStatusVariant(property.status);
                return (
                  <Link
                    key={property.id}
                    href={`/properties/${property.id}`}
                    className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/50 transition-all group"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-slate-100 group-hover:bg-slate-200 transition-colors">
                          <Building2 className="w-5 h-5 text-slate-500" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-slate-900 truncate">
                            {property.address}
                          </div>
                          <div className="text-xs text-slate-400">
                            {property.city}, {property.state} {property.zipCode} · {property.propertyType.replace("_", " ")}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 ml-4">
                      {property.preEventValue && (
                        <span className="text-xs font-semibold text-slate-500 hidden sm:block">
                          {formatCurrency(property.preEventValue)}
                        </span>
                      )}
                      <StatusBadge label={status.label} variant={status.variant} />
                      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </Card>

          {/* Active Claims */}
          <Card
            title="Active Insurance Claims"
            description="Claims requiring attention or awaiting carrier response"
            action={
              <Link
                href="/insurance"
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
              >
                View All <ArrowRight className="w-3 h-3" />
              </Link>
            }
          >
            <div className="space-y-3">
              {activeClaims.map((claim) => {
                const status = getClaimStatusVariant(claim.status);
                const property = mockProperties.find((p) => p.id === claim.propertyId);
                return (
                  <Link
                    key={claim.id}
                    href={`/insurance/${claim.id}`}
                    className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/50 transition-all group"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold text-slate-900">
                        {claim.claimNumber || "Pending"}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {claim.carrierName} · {property?.address || "Unknown property"}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 ml-4">
                      {claim.claimedAmount && (
                        <div className="text-right hidden sm:block">
                          <div className="text-xs font-semibold text-slate-700">
                            {formatCurrency(claim.claimedAmount)}
                          </div>
                          {claim.discrepancyAmount && claim.discrepancyAmount > 0 && (
                            <div className="text-[10px] text-red-500 font-medium flex items-center gap-0.5 justify-end">
                              <AlertTriangle className="w-3 h-3" />
                              {formatCurrency(claim.discrepancyAmount)} gap
                            </div>
                          )}
                        </div>
                      )}
                      <StatusBadge label={status.label} variant={status.variant} />
                      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Right sidebar — Timeline */}
        <div className="space-y-6">
          <PropertyTimeline events={recentTimeline} />
        </div>
      </div>
    </div>
  );
}
