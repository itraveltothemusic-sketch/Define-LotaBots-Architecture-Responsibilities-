import {
  FileSearch,
  Plus,
  Filter,
  Search,
  AlertTriangle,
  DollarSign,
  ArrowRight,
  BarChart3,
  TrendingUp,
  Clock,
} from "lucide-react";
import { MetricCard } from "@/components/ui/metric-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge, getClaimStatusVariant } from "@/components/ui/status-badge";
import { formatCurrency, formatDate, formatPercentage } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { mockClaims, mockProperties } from "@/lib/db/mock-data";
import Link from "next/link";

/**
 * Insurance Claims List Page — Insurance Intelligence Module entry point.
 *
 * This page provides:
 * - Portfolio-level claim metrics
 * - Visual claim pipeline
 * - Individual claim cards with discrepancy highlighting
 * - Clear CTA for filing new claims
 *
 * The discrepancy detection is the killer feature here —
 * highlighting gaps between what's documented and what's approved
 * is where this platform creates the most financial value.
 */
export default function InsurancePage() {
  const totalClaimed = mockClaims.reduce((sum, c) => sum + (c.claimedAmount || 0), 0);
  const totalApproved = mockClaims.reduce((sum, c) => sum + (c.approvedAmount || 0), 0);
  const totalSettled = mockClaims.reduce((sum, c) => sum + (c.settledAmount || 0), 0);
  const totalDiscrepancy = mockClaims.reduce((sum, c) => sum + (c.discrepancyAmount || 0), 0);
  const avgRecovery = totalClaimed > 0 ? (totalApproved / totalClaimed) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Insurance Intelligence
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Claim lifecycle tracking, carrier interactions, and discrepancy
            detection
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4" />
          New Claim
        </Button>
      </div>

      {/* KPI metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Claimed"
          value={formatCurrency(totalClaimed)}
          subtitle={`${mockClaims.length} claims filed`}
          icon={<DollarSign className="w-5 h-5 text-blue-500" />}
        />
        <MetricCard
          title="Total Approved"
          value={formatCurrency(totalApproved)}
          trend={{
            direction: "up",
            value: formatPercentage(avgRecovery) + " rate",
            isPositive: true,
          }}
          subtitle="Carrier-approved amounts"
          icon={<TrendingUp className="w-5 h-5 text-emerald-500" />}
        />
        <MetricCard
          title="Open Discrepancies"
          value={formatCurrency(totalDiscrepancy)}
          trend={{ direction: "down", value: "-$12K", isPositive: true }}
          subtitle="Under negotiation"
          icon={<AlertTriangle className="w-5 h-5 text-red-500" />}
        />
        <MetricCard
          title="Total Settled"
          value={formatCurrency(totalSettled)}
          subtitle="Paid to date"
          icon={<BarChart3 className="w-5 h-5 text-emerald-500" />}
        />
      </div>

      {/* Claim pipeline visualization */}
      <Card
        title="Claims Pipeline"
        description="Visual overview of all claims by status"
      >
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {[
            { status: "filed", label: "Filed", count: 0 },
            { status: "under_review", label: "Under Review", count: 0 },
            { status: "additional_info_requested", label: "Info Requested", count: 0 },
            { status: "approved", label: "Approved", count: 0 },
            { status: "settled", label: "Settled", count: 0 },
          ].map((stage) => {
            const count = mockClaims.filter((c) => c.status === stage.status).length;
            const statusConfig = getClaimStatusVariant(stage.status);
            return (
              <div
                key={stage.status}
                className="flex-1 min-w-[140px] p-4 rounded-xl border border-slate-100 bg-white text-center"
              >
                <div className="text-2xl font-bold text-slate-900">{count}</div>
                <StatusBadge
                  label={statusConfig.label}
                  variant={statusConfig.variant}
                  size="sm"
                />
              </div>
            );
          })}
        </div>
      </Card>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="flex-1 max-w-sm flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 bg-white">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by claim number, carrier, or property..."
            className="flex-1 text-sm bg-transparent border-none outline-none placeholder:text-slate-400"
          />
        </div>
        <Button variant="secondary" size="sm">
          <Filter className="w-3.5 h-3.5" />
          Filters
        </Button>
      </div>

      {/* Claims list */}
      <div className="space-y-4">
        {mockClaims.map((claim) => {
          const statusConfig = getClaimStatusVariant(claim.status);
          const property = mockProperties.find((p) => p.id === claim.propertyId);
          const hasDiscrepancy = claim.discrepancyAmount && claim.discrepancyAmount > 0;
          const recoveryPct =
            claim.approvedAmount && claim.claimedAmount
              ? (claim.approvedAmount / claim.claimedAmount) * 100
              : null;

          return (
            <Link key={claim.id} href={`/insurance/${claim.id}`} className="block group">
              <Card className="hover:shadow-md hover:border-slate-200 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                        {claim.claimNumber || "Pending Assignment"}
                      </h3>
                      <StatusBadge
                        label={statusConfig.label}
                        variant={statusConfig.variant}
                        size="md"
                      />
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      {claim.carrierName} · Policy: {claim.policyNumber}
                    </div>
                    {property && (
                      <div className="text-xs text-slate-400 mt-0.5">
                        Property: {property.address}, {property.city}, {property.state}
                      </div>
                    )}
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors mt-1" />
                </div>

                {/* Financial breakdown */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                  <div className="p-3 rounded-lg bg-slate-50">
                    <div className="text-[10px] text-slate-400 uppercase tracking-wide mb-0.5">
                      Claimed
                    </div>
                    <div className="text-sm font-bold text-slate-900">
                      {claim.claimedAmount ? formatCurrency(claim.claimedAmount) : "—"}
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50">
                    <div className="text-[10px] text-slate-400 uppercase tracking-wide mb-0.5">
                      Approved
                    </div>
                    <div className={cn(
                      "text-sm font-bold",
                      claim.approvedAmount ? "text-emerald-600" : "text-slate-400"
                    )}>
                      {claim.approvedAmount ? formatCurrency(claim.approvedAmount) : "Pending"}
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50">
                    <div className="text-[10px] text-slate-400 uppercase tracking-wide mb-0.5">
                      Settled
                    </div>
                    <div className={cn(
                      "text-sm font-bold",
                      claim.settledAmount ? "text-emerald-600" : "text-slate-400"
                    )}>
                      {claim.settledAmount ? formatCurrency(claim.settledAmount) : "—"}
                    </div>
                  </div>
                  <div className={cn(
                    "p-3 rounded-lg",
                    hasDiscrepancy ? "bg-red-50" : "bg-slate-50"
                  )}>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wide mb-0.5">
                      Discrepancy
                    </div>
                    <div className={cn(
                      "text-sm font-bold",
                      hasDiscrepancy ? "text-red-600" : "text-slate-400"
                    )}>
                      {claim.discrepancyAmount
                        ? formatCurrency(claim.discrepancyAmount)
                        : "—"}
                    </div>
                  </div>
                </div>

                {/* Discrepancy bar */}
                {recoveryPct !== null && (
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] text-slate-500">
                        Recovery: {formatPercentage(recoveryPct)}
                      </span>
                      {hasDiscrepancy && (
                        <span className="flex items-center gap-1 text-[10px] text-red-500 font-medium">
                          <AlertTriangle className="w-3 h-3" />
                          {formatCurrency(claim.discrepancyAmount!)} gap
                        </span>
                      )}
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all",
                          recoveryPct >= 90 ? "bg-emerald-500" : recoveryPct >= 70 ? "bg-amber-500" : "bg-red-500"
                        )}
                        style={{ width: `${recoveryPct}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Notes */}
                {claim.notes && (
                  <p className="text-xs text-slate-500 leading-relaxed border-t border-slate-100 pt-3">
                    {claim.notes}
                  </p>
                )}

                {/* Date information */}
                <div className="flex items-center gap-4 text-[10px] text-slate-400 mt-3">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Loss: {formatDate(claim.dateOfLoss)}
                  </span>
                  {claim.dateFiled && (
                    <span>Filed: {formatDate(claim.dateFiled)}</span>
                  )}
                  <span>Updated: {formatDate(claim.updatedAt)}</span>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
