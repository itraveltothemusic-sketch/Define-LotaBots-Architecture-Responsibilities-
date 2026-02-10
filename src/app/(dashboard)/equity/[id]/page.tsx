import {
  ArrowLeft,
  TrendingUp,
  Building2,
  DollarSign,
  Shield,
  FileText,
  CheckCircle2,
  Download,
  BarChart3,
} from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatCurrency, formatPercentage, formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import {
  mockProperties,
  mockEquityOutcomes,
  mockClaims,
  mockInspections,
  mockScopeAssignments,
} from "@/lib/db/mock-data";

/**
 * Equity Outcome Detail Page
 *
 * The definitive equity report for a single property.
 * This page is designed to be printable / exportable as
 * a standalone equity gain report for investors and stakeholders.
 *
 * Every number is traced back to its source.
 */
export default async function EquityDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  const property = mockProperties.find((p) => p.id === id) || mockProperties[0];
  const outcome = mockEquityOutcomes.find((eo) => eo.propertyId === property.id);
  const claim = mockClaims.find((c) => c.propertyId === property.id);
  const inspection = mockInspections.find((i) => i.propertyId === property.id);
  const scopes = mockScopeAssignments.filter((s) => s.propertyId === property.id);

  const hasOutcome = outcome !== undefined;
  const equityGain = hasOutcome
    ? (property.postRestorationValue || 0) - (property.preEventValue || 0)
    : null;
  const gainPct =
    hasOutcome && property.preEventValue
      ? ((equityGain || 0) / property.preEventValue) * 100
      : null;

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Link
          href="/equity"
          className="flex items-center gap-1 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Equity Outcomes
        </Link>
        <span className="text-slate-300">/</span>
        <span className="text-slate-600 font-medium">{property.address}</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div
            className={cn(
              "flex items-center justify-center w-14 h-14 rounded-2xl",
              hasOutcome ? "bg-emerald-100" : "bg-slate-100"
            )}
          >
            <TrendingUp
              className={cn(
                "w-7 h-7",
                hasOutcome ? "text-emerald-600" : "text-slate-500"
              )}
            />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-slate-900">
                Equity Report: {property.address}
              </h1>
              {hasOutcome ? (
                <StatusBadge
                  label="Verified"
                  variant="success"
                  size="md"
                />
              ) : (
                <StatusBadge
                  label="In Progress"
                  variant="warning"
                  size="md"
                />
              )}
            </div>
            <div className="text-sm text-slate-500 mt-1">
              {property.city}, {property.state} {property.zipCode} ·{" "}
              {property.propertyType.replace("_", " ")} ·{" "}
              {property.squareFootage?.toLocaleString()} sq ft
            </div>
          </div>
        </div>
        <Button variant="secondary">
          <Download className="w-4 h-4" />
          Download Report
        </Button>
      </div>

      {hasOutcome && outcome ? (
        <>
          {/* Equity headline */}
          <div className="p-8 bg-gradient-to-r from-emerald-50 to-emerald-100/50 rounded-2xl border border-emerald-200 text-center">
            <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-2">
              Verified Net Equity Gain
            </p>
            <div className="text-4xl sm:text-5xl font-extrabold text-emerald-700 tracking-tight">
              +{formatCurrency(outcome.netEquityGain)}
            </div>
            <div className="text-lg font-semibold text-emerald-600 mt-1">
              +{formatPercentage(outcome.equityGainPercentage)} increase
            </div>
            <div className="text-xs text-emerald-500 mt-2">
              Verified {outcome.verifiedAt ? formatDate(outcome.verifiedAt) : "Pending verification"}
            </div>
          </div>

          {/* Financial flow */}
          <Card
            title="Financial Flow Analysis"
            description="Complete breakdown from storm event to equity realization"
          >
            <div className="space-y-6">
              {/* Before/After comparison */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-2">
                    Pre-Event Value
                  </div>
                  <div className="text-2xl font-bold text-slate-900">
                    {formatCurrency(outcome.preEventValue)}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Baseline property value before storm event
                  </div>
                </div>
                <div className="p-5 rounded-xl bg-emerald-50 border border-emerald-200">
                  <div className="text-[10px] font-bold text-emerald-500 uppercase tracking-wide mb-2">
                    Post-Restoration Value
                  </div>
                  <div className="text-2xl font-bold text-emerald-700">
                    {formatCurrency(outcome.postRestorationValue)}
                  </div>
                  <div className="text-xs text-emerald-600 mt-1">
                    +{formatCurrency(outcome.postRestorationValue - outcome.preEventValue)} value increase
                  </div>
                </div>
              </div>

              {/* Detailed financial breakdown */}
              <div className="border border-slate-100 rounded-xl overflow-hidden">
                <table className="w-full">
                  <tbody className="divide-y divide-slate-100">
                    <tr className="bg-slate-50">
                      <td className="px-5 py-3 text-xs font-semibold text-slate-700">
                        Insurance Claim Filed
                      </td>
                      <td className="px-5 py-3 text-sm font-bold text-slate-900 text-right">
                        {formatCurrency(outcome.totalClaimAmount)}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-5 py-3 text-xs font-semibold text-slate-700">
                        Insurance Payout Received
                      </td>
                      <td className="px-5 py-3 text-sm font-bold text-emerald-600 text-right">
                        {formatCurrency(outcome.totalInsurancePayout)}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-5 py-3 text-xs text-slate-500 pl-10">
                        Recovery Rate
                      </td>
                      <td className="px-5 py-3 text-xs font-semibold text-slate-700 text-right">
                        {formatPercentage(
                          (outcome.totalInsurancePayout / outcome.totalClaimAmount) * 100
                        )}
                      </td>
                    </tr>
                    <tr className="bg-slate-50">
                      <td className="px-5 py-3 text-xs font-semibold text-slate-700">
                        Total Restoration Cost
                      </td>
                      <td className="px-5 py-3 text-sm font-bold text-red-600 text-right">
                        ({formatCurrency(outcome.totalRestorationCost)})
                      </td>
                    </tr>
                    <tr>
                      <td className="px-5 py-3 text-xs text-slate-500 pl-10">
                        Net Insurance Surplus
                      </td>
                      <td className="px-5 py-3 text-xs font-semibold text-emerald-600 text-right">
                        +{formatCurrency(outcome.totalInsurancePayout - outcome.totalRestorationCost)}
                      </td>
                    </tr>
                    <tr className="bg-emerald-50">
                      <td className="px-5 py-3 text-sm font-bold text-emerald-800">
                        Net Equity Gain
                      </td>
                      <td className="px-5 py-3 text-lg font-bold text-emerald-700 text-right">
                        +{formatCurrency(outcome.netEquityGain)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </Card>

          {/* Narrative */}
          {outcome.narrative && (
            <Card
              title="Equity Gain Narrative"
              description="AI-generated analysis explaining the equity outcome"
            >
              <div className="p-5 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {outcome.narrative}
                </p>
              </div>
              <div className="flex items-center gap-2 mt-3 text-[10px] text-slate-400">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                Generated {formatDate(outcome.generatedAt)}
                {outcome.verifiedAt && (
                  <>
                    <span>·</span>
                    <span>Verified {formatDate(outcome.verifiedAt)}</span>
                  </>
                )}
              </div>
            </Card>
          )}
        </>
      ) : (
        /* In-progress state */
        <Card>
          <div className="text-center py-12">
            <BarChart3 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-700 mb-2">
              Equity Assessment In Progress
            </h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
              This property&apos;s equity outcome will be calculated once the
              restoration is complete and post-restoration valuation is performed.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg mx-auto">
              <div className="p-3 rounded-lg bg-slate-50">
                <div className="text-[10px] text-slate-400 uppercase tracking-wide mb-0.5">
                  Pre-Event Value
                </div>
                <div className="text-sm font-bold text-slate-900">
                  {property.preEventValue ? formatCurrency(property.preEventValue) : "—"}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-slate-50">
                <div className="text-[10px] text-slate-400 uppercase tracking-wide mb-0.5">
                  Claim Amount
                </div>
                <div className="text-sm font-bold text-slate-900">
                  {claim?.claimedAmount ? formatCurrency(claim.claimedAmount) : "—"}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-slate-50">
                <div className="text-[10px] text-slate-400 uppercase tracking-wide mb-0.5">
                  Active Scopes
                </div>
                <div className="text-sm font-bold text-slate-900">
                  {scopes.length}
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Supporting data */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Inspection summary */}
        {inspection && (
          <Card title="Inspection Summary" className="lg:col-span-2">
            <div className="space-y-3">
              {inspection.damageAreas.map((area) => (
                <div
                  key={area.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-50"
                >
                  <div>
                    <div className="text-xs font-semibold text-slate-900">
                      {area.location}
                    </div>
                    <div className="text-[10px] text-slate-500 capitalize">
                      {area.classification} · {area.severity}
                    </div>
                  </div>
                  <div className="text-xs font-bold text-slate-700">
                    {area.estimatedRepairCost
                      ? formatCurrency(area.estimatedRepairCost)
                      : "—"}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Quick links */}
        <Card title="Related Records">
          <div className="space-y-2">
            <Link
              href={`/properties/${property.id}`}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-all group"
            >
              <Building2 className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-700">Property Profile</span>
              <ArrowLeft className="w-3.5 h-3.5 text-slate-300 ml-auto rotate-180" />
            </Link>
            {claim && (
              <Link
                href={`/insurance/${claim.id}`}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-all group"
              >
                <Shield className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-700">
                  Insurance Claim {claim.claimNumber}
                </span>
                <ArrowLeft className="w-3.5 h-3.5 text-slate-300 ml-auto rotate-180" />
              </Link>
            )}
            {scopes.length > 0 && (
              <Link
                href="/contractors"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-all group"
              >
                <FileText className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-700">
                  {scopes.length} Scope Assignment{scopes.length !== 1 ? "s" : ""}
                </span>
                <ArrowLeft className="w-3.5 h-3.5 text-slate-300 ml-auto rotate-180" />
              </Link>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
