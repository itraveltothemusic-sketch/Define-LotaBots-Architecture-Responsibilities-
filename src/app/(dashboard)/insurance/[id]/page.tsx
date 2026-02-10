import {
  ArrowLeft,
  FileSearch,
  DollarSign,
  AlertTriangle,
  Phone,
  Mail,
  FileText,
  Calendar,
  Users,
  MessageSquare,
  Download,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge, getClaimStatusVariant } from "@/components/ui/status-badge";
import { ATOSInsightPanel } from "@/components/atos/insight-panel";
import { formatCurrency, formatDate, formatPercentage } from "@/lib/utils";
import { cn } from "@/lib/utils";
import {
  mockClaims,
  mockProperties,
  mockCarrierInteractions,
  mockATOSInsights,
} from "@/lib/db/mock-data";

/**
 * Insurance Claim Detail Page
 *
 * The full claim intelligence view:
 * - Claim overview with financial breakdown
 * - Carrier interaction log (every call, email, meeting documented)
 * - Discrepancy analysis with visual comparison
 * - ATOS strategy recommendations
 *
 * This page is designed to make claim negotiation a data-driven
 * process rather than a guesswork exercise.
 */

const interactionTypeConfig: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  call: { icon: Phone, color: "text-blue-600", bg: "bg-blue-50" },
  email: { icon: Mail, color: "text-violet-600", bg: "bg-violet-50" },
  letter: { icon: FileText, color: "text-slate-600", bg: "bg-slate-100" },
  meeting: { icon: Users, color: "text-emerald-600", bg: "bg-emerald-50" },
  inspection: { icon: FileSearch, color: "text-amber-600", bg: "bg-amber-50" },
  document_request: { icon: FileText, color: "text-orange-600", bg: "bg-orange-50" },
  payment: { icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50" },
};

export default async function ClaimDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  const claim = mockClaims.find((c) => c.id === id) || mockClaims[0];
  const property = mockProperties.find((p) => p.id === claim.propertyId);
  const interactions = mockCarrierInteractions.filter((ci) => ci.claimId === claim.id);
  const insights = mockATOSInsights.filter(
    (i) => i.propertyId === claim.propertyId && (i.type === "risk" || i.type === "gap")
  );
  const status = getClaimStatusVariant(claim.status);
  const recoveryPct =
    claim.approvedAmount && claim.claimedAmount
      ? (claim.approvedAmount / claim.claimedAmount) * 100
      : null;

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Link
          href="/insurance"
          className="flex items-center gap-1 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Insurance Claims
        </Link>
        <span className="text-slate-300">/</span>
        <span className="text-slate-600 font-medium">
          {claim.claimNumber || "Pending"}
        </span>
      </div>

      {/* Claim header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-slate-900">
              Claim {claim.claimNumber || "Pending"}
            </h1>
            <StatusBadge label={status.label} variant={status.variant} size="md" />
          </div>
          <div className="flex items-center gap-4 mt-1.5 text-sm text-slate-500">
            <span>{claim.carrierName}</span>
            <span>Policy: {claim.policyNumber}</span>
            {property && (
              <span>
                {property.address}, {property.city}, {property.state}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm">
            <Download className="w-3.5 h-3.5" />
            Export
          </Button>
          <Button size="sm">
            <Plus className="w-3.5 h-3.5" />
            Log Interaction
          </Button>
        </div>
      </div>

      {/* Financial breakdown cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div className="p-4 bg-white rounded-xl border border-slate-100">
          <div className="text-[10px] text-slate-400 uppercase tracking-wide mb-1">
            Claimed Amount
          </div>
          <div className="text-lg font-bold text-slate-900">
            {claim.claimedAmount ? formatCurrency(claim.claimedAmount) : "—"}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            Based on forensic assessment
          </div>
        </div>
        <div className="p-4 bg-white rounded-xl border border-slate-100">
          <div className="text-[10px] text-slate-400 uppercase tracking-wide mb-1">
            Carrier Approved
          </div>
          <div className={cn(
            "text-lg font-bold",
            claim.approvedAmount ? "text-emerald-600" : "text-slate-400"
          )}>
            {claim.approvedAmount ? formatCurrency(claim.approvedAmount) : "Pending"}
          </div>
          {recoveryPct !== null && (
            <div className="text-[10px] text-slate-400 mt-0.5">
              {formatPercentage(recoveryPct)} of claimed
            </div>
          )}
        </div>
        <div className={cn(
          "p-4 rounded-xl border",
          claim.discrepancyAmount && claim.discrepancyAmount > 0
            ? "bg-red-50 border-red-200"
            : "bg-white border-slate-100"
        )}>
          <div className="text-[10px] text-slate-400 uppercase tracking-wide mb-1">
            Discrepancy
          </div>
          <div className={cn(
            "text-lg font-bold",
            claim.discrepancyAmount && claim.discrepancyAmount > 0 ? "text-red-600" : "text-slate-400"
          )}>
            {claim.discrepancyAmount ? formatCurrency(claim.discrepancyAmount) : "—"}
          </div>
          {claim.discrepancyAmount && claim.claimedAmount && claim.discrepancyAmount > 0 && (
            <div className="text-[10px] text-red-500 mt-0.5 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              {formatPercentage((claim.discrepancyAmount / claim.claimedAmount) * 100)} gap
            </div>
          )}
        </div>
        <div className="p-4 bg-white rounded-xl border border-slate-100">
          <div className="text-[10px] text-slate-400 uppercase tracking-wide mb-1">
            Settled Amount
          </div>
          <div className={cn(
            "text-lg font-bold",
            claim.settledAmount ? "text-emerald-600" : "text-slate-400"
          )}>
            {claim.settledAmount ? formatCurrency(claim.settledAmount) : "—"}
          </div>
        </div>
        <div className="p-4 bg-white rounded-xl border border-slate-100">
          <div className="text-[10px] text-slate-400 uppercase tracking-wide mb-1">
            Date of Loss
          </div>
          <div className="text-sm font-bold text-slate-900">
            {formatDate(claim.dateOfLoss)}
          </div>
          {claim.dateFiled && (
            <div className="text-[10px] text-slate-400 mt-0.5">
              Filed: {formatDate(claim.dateFiled)}
            </div>
          )}
        </div>
      </div>

      {/* Discrepancy visual */}
      {claim.claimedAmount && claim.approvedAmount && (
        <Card title="Scope Comparison" description="Forensic assessment vs. carrier approval">
          <div className="space-y-4">
            {/* Claimed bar */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-slate-700">
                  Forensic Assessment
                </span>
                <span className="text-sm font-bold text-slate-900">
                  {formatCurrency(claim.claimedAmount)}
                </span>
              </div>
              <div className="h-4 bg-blue-500 rounded-lg" />
            </div>
            {/* Approved bar */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-slate-700">
                  Carrier Approved
                </span>
                <span className="text-sm font-bold text-emerald-600">
                  {formatCurrency(claim.approvedAmount)}
                </span>
              </div>
              <div className="h-4 bg-slate-100 rounded-lg overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-lg"
                  style={{
                    width: `${(claim.approvedAmount / claim.claimedAmount) * 100}%`,
                  }}
                />
              </div>
            </div>
            {/* Gap indicator */}
            {claim.discrepancyAmount && claim.discrepancyAmount > 0 && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-red-50 border border-red-200">
                <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-red-700">
                    {formatCurrency(claim.discrepancyAmount)} discrepancy detected
                  </p>
                  <p className="text-xs text-red-600 mt-0.5">
                    This gap represents scope items the carrier has not yet approved.
                    Review the ATOS recommendations below for negotiation strategy.
                  </p>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* ATOS insights for this claim */}
      {insights.length > 0 && <ATOSInsightPanel insights={insights} />}

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Carrier Interaction Log — 2/3 */}
        <div className="lg:col-span-2">
          <Card
            title="Carrier Interaction Log"
            description="Complete record of all communications with the insurance carrier"
            action={
              <Button variant="secondary" size="sm">
                <Plus className="w-3.5 h-3.5" />
                Log Interaction
              </Button>
            }
          >
            {interactions.length > 0 ? (
              <div className="space-y-4">
                {interactions.map((interaction) => {
                  const config =
                    interactionTypeConfig[interaction.type] ||
                    interactionTypeConfig.call;
                  const Icon = config.icon;

                  return (
                    <div
                      key={interaction.id}
                      className="p-4 rounded-xl border border-slate-100 hover:border-slate-200 transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={cn(
                            "flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-lg",
                            config.bg
                          )}
                        >
                          <Icon className={cn("w-4.5 h-4.5", config.color)} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-bold text-slate-900 capitalize">
                              {interaction.type.replace("_", " ")}
                            </span>
                            <span
                              className={cn(
                                "px-1.5 py-0.5 text-[9px] font-bold uppercase rounded",
                                interaction.initiatedBy === "internal"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-amber-100 text-amber-700"
                              )}
                            >
                              {interaction.initiatedBy === "internal"
                                ? "We Initiated"
                                : "Carrier Initiated"}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600 leading-relaxed">
                            {interaction.summary}
                          </p>
                          {interaction.outcome && (
                            <div className="mt-2 px-3 py-2 rounded-lg bg-slate-50">
                              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
                                Outcome:
                              </span>
                              <p className="text-xs text-slate-600 mt-0.5">
                                {interaction.outcome}
                              </p>
                            </div>
                          )}
                          <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-400">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDate(interaction.date)}
                            </span>
                            {interaction.contactName && (
                              <span>
                                Contact: {interaction.contactName}
                                {interaction.contactRole
                                  ? ` (${interaction.contactRole})`
                                  : ""}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <MessageSquare className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-sm text-slate-500">
                  No carrier interactions logged yet
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Document every call, email, and meeting for a complete audit trail.
                </p>
              </div>
            )}
          </Card>
        </div>

        {/* Claim details sidebar — 1/3 */}
        <div className="space-y-6">
          <Card title="Claim Details">
            <div className="space-y-3">
              {[
                { label: "Claim Number", value: claim.claimNumber || "Pending" },
                { label: "Carrier", value: claim.carrierName },
                { label: "Policy Number", value: claim.policyNumber },
                { label: "Date of Loss", value: formatDate(claim.dateOfLoss) },
                { label: "Date Filed", value: claim.dateFiled ? formatDate(claim.dateFiled) : "Not filed" },
                { label: "Status", value: status.label },
                { label: "Last Updated", value: formatDate(claim.updatedAt) },
              ].map((detail) => (
                <div
                  key={detail.label}
                  className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0"
                >
                  <span className="text-xs text-slate-500">{detail.label}</span>
                  <span className="text-xs font-semibold text-slate-900">
                    {detail.value}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Notes */}
          {claim.notes && (
            <Card title="Notes">
              <p className="text-sm text-slate-600 leading-relaxed">
                {claim.notes}
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
