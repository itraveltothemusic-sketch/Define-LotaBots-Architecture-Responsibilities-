"use client";

/**
 * Insurance Claim Detail — Full claim lifecycle view.
 * 
 * Shows comprehensive claim data including:
 * - Claim status and financial summary
 * - Carrier interaction log
 * - Scope comparison with discrepancy detection
 * - ATOS intelligence for this claim
 */

import { use } from "react";
import Link from "next/link";
import { Topbar } from "@/components/layout/topbar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AtosPanel } from "@/components/atos/atos-panel";
import { insuranceClaims, properties, carrierInteractions, scopeItems } from "@/lib/mock-data";
import { formatCurrency, formatStatus, cn } from "@/lib/utils";
import {
  Shield,
  ArrowLeft,
  User,
  Phone,
  Mail,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  MessageSquare,
  FileText,
  DollarSign,
  Building2,
} from "lucide-react";

export default function ClaimDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const claim = insuranceClaims.find((c) => c.id === id);

  if (!claim) {
    return (
      <div>
        <Topbar title="Claim Not Found" />
        <div className="p-6 text-center py-20">
          <Shield className="w-12 h-12 text-navy-600 mx-auto mb-4" />
          <p className="text-navy-400 text-lg">Claim not found</p>
          <Link href="/insurance" className="text-brand-400 hover:text-brand-300 text-sm mt-2 inline-block">
            Back to Insurance
          </Link>
        </div>
      </div>
    );
  }

  const property = properties.find((p) => p.id === claim.propertyId);
  const interactions = carrierInteractions.filter((ci) => ci.claimId === id);
  const scope = scopeItems.filter((si) => si.claimId === id);
  const totalOwnerEstimate = scope.reduce((sum, s) => sum + s.ownerEstimate, 0);
  const totalCarrierEstimate = scope.reduce((sum, s) => sum + (s.carrierEstimate ?? 0), 0);
  const totalDiscrepancy = scope.reduce((sum, s) => sum + (s.discrepancy ?? 0), 0);

  return (
    <div>
      <Topbar
        title={`Claim ${claim.claimNumber}`}
        subtitle={`${claim.carrier} — ${property?.name ?? "Unknown Property"}`}
      />

      <div className="p-6 space-y-6">
        <Link
          href="/insurance"
          className="inline-flex items-center gap-1.5 text-sm text-navy-400 hover:text-brand-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Insurance
        </Link>

        {/* Claim Header */}
        <Card className="p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <Shield className="w-6 h-6 text-brand-400" />
                <span className="text-sm font-mono text-navy-400">{claim.claimNumber}</span>
                <Badge
                  variant={
                    claim.status === "settled" || claim.status === "approved" ? "success" :
                    claim.status === "denied" ? "danger" : "warning"
                  }
                  size="md"
                >
                  {formatStatus(claim.status)}
                </Badge>
              </div>
              <h1 className="text-2xl font-bold text-white mb-1">{claim.carrier}</h1>
              <p className="text-sm text-navy-400">Policy: {claim.policyNumber}</p>

              {property && (
                <Link
                  href={`/properties/${property.id}`}
                  className="flex items-center gap-1.5 mt-3 text-sm text-brand-400 hover:text-brand-300 transition-colors"
                >
                  <Building2 className="w-4 h-4" />
                  {property.name}
                </Link>
              )}
            </div>

            {/* Financial Summary */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-3 bg-navy-800/40 rounded-lg border border-navy-700/30">
                <p className="text-[11px] text-navy-500 uppercase tracking-wider">Claimed</p>
                <p className="text-lg font-bold text-white mt-0.5">{formatCurrency(claim.claimedAmount)}</p>
              </div>
              <div className="p-3 bg-navy-800/40 rounded-lg border border-navy-700/30">
                <p className="text-[11px] text-navy-500 uppercase tracking-wider">Approved</p>
                <p className="text-lg font-bold text-forensic-400 mt-0.5">
                  {claim.approvedAmount !== undefined ? formatCurrency(claim.approvedAmount) : "—"}
                </p>
              </div>
              <div className="p-3 bg-navy-800/40 rounded-lg border border-navy-700/30">
                <p className="text-[11px] text-navy-500 uppercase tracking-wider">Deductible</p>
                <p className="text-lg font-bold text-navy-200 mt-0.5">{formatCurrency(claim.deductible)}</p>
              </div>
              <div className="p-3 bg-navy-800/40 rounded-lg border border-navy-700/30">
                <p className="text-[11px] text-navy-500 uppercase tracking-wider">Filed</p>
                <p className="text-lg font-bold text-navy-200 mt-0.5">
                  {new Date(claim.filedDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </p>
              </div>
            </div>
          </div>

          {/* Adjuster Info */}
          {claim.adjusterName && claim.adjusterName !== "Pending Assignment" && (
            <div className="mt-4 p-4 bg-navy-800/30 rounded-lg border border-navy-700/20 flex flex-wrap items-center gap-6">
              <span className="text-xs text-navy-500 uppercase tracking-wider font-semibold">Adjuster</span>
              <div className="flex items-center gap-2 text-sm text-navy-200">
                <User className="w-4 h-4 text-navy-400" />
                {claim.adjusterName}
              </div>
              {claim.adjusterEmail && (
                <div className="flex items-center gap-2 text-sm text-navy-200">
                  <Mail className="w-4 h-4 text-navy-400" />
                  {claim.adjusterEmail}
                </div>
              )}
              {claim.adjusterPhone && (
                <div className="flex items-center gap-2 text-sm text-navy-200">
                  <Phone className="w-4 h-4 text-navy-400" />
                  {claim.adjusterPhone}
                </div>
              )}
            </div>
          )}

          {/* Notes */}
          {claim.notes && (
            <div className="mt-4 p-4 bg-navy-800/30 rounded-lg border border-navy-700/20">
              <p className="text-xs text-navy-500 uppercase tracking-wider font-semibold mb-2">Claim Notes</p>
              <p className="text-sm text-navy-200 leading-relaxed">{claim.notes}</p>
            </div>
          )}
        </Card>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            {/* Scope Comparison */}
            {scope.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-white">Scope Comparison & Discrepancy Analysis</h3>
                      <p className="text-xs text-navy-400 mt-0.5">
                        Owner estimate vs carrier estimate — {scope.length} line items
                      </p>
                    </div>
                    {totalDiscrepancy > 0 && (
                      <div className="flex items-center gap-1.5 text-sm text-alert-400 font-semibold">
                        <AlertTriangle className="w-4 h-4" />
                        {formatCurrency(totalDiscrepancy)} total discrepancy
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-navy-700/50">
                          <th className="text-left py-2 px-3 text-xs text-navy-500 font-semibold uppercase tracking-wider">Category</th>
                          <th className="text-left py-2 px-3 text-xs text-navy-500 font-semibold uppercase tracking-wider">Description</th>
                          <th className="text-right py-2 px-3 text-xs text-navy-500 font-semibold uppercase tracking-wider">Our Estimate</th>
                          <th className="text-right py-2 px-3 text-xs text-navy-500 font-semibold uppercase tracking-wider">Carrier Est.</th>
                          <th className="text-right py-2 px-3 text-xs text-navy-500 font-semibold uppercase tracking-wider">Discrepancy</th>
                        </tr>
                      </thead>
                      <tbody>
                        {scope.map((item) => (
                          <tr
                            key={item.id}
                            className={cn(
                              "border-b border-navy-700/30",
                              (item.discrepancy ?? 0) > 50000 && "bg-danger-500/5",
                            )}
                          >
                            <td className="py-3 px-3 text-navy-300 font-medium">{item.category}</td>
                            <td className="py-3 px-3 text-navy-200">
                              {item.description}
                              {item.notes && (
                                <p className="text-xs text-alert-400 mt-0.5">{item.notes}</p>
                              )}
                            </td>
                            <td className="py-3 px-3 text-right text-white font-medium">
                              {formatCurrency(item.ownerEstimate)}
                            </td>
                            <td className="py-3 px-3 text-right text-navy-300">
                              {item.carrierEstimate !== undefined ? formatCurrency(item.carrierEstimate) : "—"}
                            </td>
                            <td className={cn(
                              "py-3 px-3 text-right font-semibold",
                              (item.discrepancy ?? 0) > 50000 ? "text-danger-400" :
                              (item.discrepancy ?? 0) > 10000 ? "text-alert-400" :
                              "text-navy-400",
                            )}>
                              {item.discrepancy !== undefined ? formatCurrency(item.discrepancy) : "—"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="border-t-2 border-navy-600/50">
                          <td colSpan={2} className="py-3 px-3 text-white font-semibold">Total</td>
                          <td className="py-3 px-3 text-right text-white font-bold">{formatCurrency(totalOwnerEstimate)}</td>
                          <td className="py-3 px-3 text-right text-navy-300 font-bold">{formatCurrency(totalCarrierEstimate)}</td>
                          <td className={cn(
                            "py-3 px-3 text-right font-bold",
                            totalDiscrepancy > 0 ? "text-alert-400" : "text-forensic-400",
                          )}>
                            {formatCurrency(totalDiscrepancy)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Carrier Interactions */}
            {interactions.length > 0 && (
              <Card>
                <CardHeader>
                  <h3 className="text-sm font-semibold text-white">Carrier Interaction Log</h3>
                  <p className="text-xs text-navy-400 mt-0.5">
                    Complete communication history with {claim.carrier}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {interactions.map((interaction) => (
                    <div key={interaction.id} className="p-4 bg-navy-800/30 rounded-lg border border-navy-700/20">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-brand-400" />
                          <span className="text-xs font-semibold text-brand-300 uppercase">
                            {interaction.type.replace("_", " ")}
                          </span>
                          <span className="text-xs text-navy-400">
                            {new Date(interaction.date).toLocaleDateString("en-US", {
                              year: "numeric", month: "long", day: "numeric"
                            })}
                          </span>
                        </div>
                        {interaction.followUpRequired && (
                          <Badge variant="warning" size="sm">Follow-up Required</Badge>
                        )}
                      </div>
                      <p className="text-sm text-navy-200 leading-relaxed mb-2">
                        {interaction.summary}
                      </p>
                      {interaction.outcome && (
                        <div className="flex items-start gap-2 mt-2 pt-2 border-t border-navy-700/20">
                          <CheckCircle2 className="w-4 h-4 text-forensic-400 flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-forensic-300">{interaction.outcome}</p>
                        </div>
                      )}
                      <div className="flex items-center gap-3 mt-2 text-xs text-navy-500">
                        <span>Participants: {interaction.participants.join(", ")}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column */}
          <div>
            <AtosPanel propertyId={claim.propertyId} />
          </div>
        </div>
      </div>
    </div>
  );
}
