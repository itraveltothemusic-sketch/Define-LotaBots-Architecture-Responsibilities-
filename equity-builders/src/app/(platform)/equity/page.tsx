"use client";

/**
 * Equity Outcome Module — The endgame.
 * 
 * This module visualizes the transformation of storm damage into
 * verified equity gains. It provides:
 * - Before/after property valuations
 * - Claim-to-payout analysis
 * - Net equity gain calculations
 * - Narrative reports for stakeholder presentation
 * 
 * WHY: The equity outcome is the measure of success. This module
 * must convey trust, verification, and verified financial results
 * that property owners, investors, and insurers can rely on.
 */

import Link from "next/link";
import { Topbar } from "@/components/layout/topbar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import { equityOutcomes, properties } from "@/lib/mock-data";
import { formatCurrency, formatPercentage, cn } from "@/lib/utils";
import {
  TrendingUp,
  DollarSign,
  Building2,
  ArrowUpRight,
  CheckCircle2,
  BarChart3,
  FileText,
  Award,
  ArrowRight,
  Minus,
} from "lucide-react";

export default function EquityPage() {
  // Calculate portfolio-wide equity metrics
  const totalPreStormValue = equityOutcomes.reduce((sum, e) => sum + e.preStormValue, 0);
  const totalPostRepairValue = equityOutcomes.reduce((sum, e) => sum + e.postRepairValue, 0);
  const totalEquityGain = equityOutcomes.reduce((sum, e) => sum + e.netEquityGain, 0);
  const totalClaimAmount = equityOutcomes.reduce((sum, e) => sum + e.totalClaimAmount, 0);
  const totalPayout = equityOutcomes.reduce((sum, e) => sum + e.totalPayoutReceived, 0);
  const totalRepairCost = equityOutcomes.reduce((sum, e) => sum + e.totalRepairCost, 0);

  // Properties with verified equity
  const verifiedProperties = properties.filter((p) => p.status === "equity_verified");
  // Properties in progress (not yet verified)
  const inProgressProperties = properties.filter(
    (p) => p.status !== "equity_verified" && p.status !== "intake"
  );

  return (
    <div>
      <Topbar
        title="Equity Outcomes"
        subtitle="Before/after valuations, claim analysis, and verified equity gains"
      />

      <div className="p-6 space-y-6">
        {/* Portfolio Equity Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="p-6 lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-forensic-500/10 rounded-lg border border-forensic-500/20">
                <TrendingUp className="w-5 h-5 text-forensic-400" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">Portfolio Equity Summary</h3>
                <p className="text-xs text-navy-400">Verified equity gains across all completed properties</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-navy-800/30 rounded-lg border border-navy-700/20">
                <p className="text-[11px] text-navy-500 uppercase tracking-wider mb-1">Pre-Storm Value</p>
                <p className="text-xl font-bold text-white">{formatCurrency(totalPreStormValue)}</p>
              </div>
              <div className="p-4 bg-navy-800/30 rounded-lg border border-navy-700/20">
                <p className="text-[11px] text-navy-500 uppercase tracking-wider mb-1">Post-Repair Value</p>
                <p className="text-xl font-bold text-forensic-400">{formatCurrency(totalPostRepairValue)}</p>
              </div>
              <div className="p-4 bg-forensic-500/10 rounded-lg border border-forensic-500/20">
                <p className="text-[11px] text-forensic-400 uppercase tracking-wider mb-1">Net Equity Gain</p>
                <p className="text-xl font-bold text-forensic-300">{formatCurrency(totalEquityGain)}</p>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowUpRight className="w-3.5 h-3.5 text-forensic-400" />
                  <span className="text-xs text-forensic-400 font-medium">
                    {equityOutcomes.length > 0 ? formatPercentage(equityOutcomes[0].equityGainPercentage) : "0%"} gain
                  </span>
                </div>
              </div>
              <div className="p-4 bg-navy-800/30 rounded-lg border border-navy-700/20">
                <p className="text-[11px] text-navy-500 uppercase tracking-wider mb-1">Claim Recovery</p>
                <p className="text-xl font-bold text-white">{formatCurrency(totalPayout)}</p>
                <p className="text-xs text-navy-400 mt-1">
                  {totalClaimAmount > 0 ? formatPercentage((totalPayout / totalClaimAmount) * 100) : "0%"} of claimed
                </p>
              </div>
            </div>
          </Card>

          {/* Quick Stats */}
          <Card className="p-6">
            <h3 className="text-sm font-semibold text-white mb-4">Performance Metrics</h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-navy-400">Claim-to-Payout Ratio</span>
                  <span className="text-forensic-400 font-semibold">
                    {totalClaimAmount > 0 ? formatPercentage((totalPayout / totalClaimAmount) * 100) : "—"}
                  </span>
                </div>
                <ProgressBar
                  value={totalClaimAmount > 0 ? (totalPayout / totalClaimAmount) * 100 : 0}
                  showPercentage={false}
                  color="forensic"
                  size="sm"
                />
              </div>
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-navy-400">Repair Cost Efficiency</span>
                  <span className="text-brand-400 font-semibold">
                    {totalPayout > 0 ? formatPercentage((totalRepairCost / totalPayout) * 100) : "—"}
                  </span>
                </div>
                <ProgressBar
                  value={totalPayout > 0 ? (totalRepairCost / totalPayout) * 100 : 0}
                  showPercentage={false}
                  color="brand"
                  size="sm"
                />
              </div>
              <div className="pt-3 border-t border-navy-700/30">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-navy-400">Verified Properties</span>
                  <span className="text-sm font-bold text-white">{verifiedProperties.length}</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-navy-400">In Progress</span>
                  <span className="text-sm font-bold text-white">{inProgressProperties.length}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Verified Equity Outcomes */}
        <div>
          <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-forensic-400" />
            Verified Equity Outcomes
          </h3>
          {equityOutcomes.length > 0 ? (
            <div className="space-y-4">
              {equityOutcomes.map((outcome) => {
                const property = properties.find((p) => p.id === outcome.propertyId);

                return (
                  <Card key={outcome.id} className="p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Property Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <Building2 className="w-5 h-5 text-brand-400" />
                          {property && (
                            <Link
                              href={`/properties/${property.id}`}
                              className="text-lg font-semibold text-white hover:text-brand-300 transition-colors"
                            >
                              {property.name}
                            </Link>
                          )}
                          <Badge variant="success" size="sm">
                            Equity Verified
                          </Badge>
                        </div>

                        {/* Equity Flow Visualization */}
                        <div className="flex items-center gap-3 my-4 flex-wrap">
                          <div className="p-3 bg-navy-800/40 rounded-lg border border-navy-700/30 text-center min-w-[120px]">
                            <p className="text-[10px] text-navy-500 uppercase tracking-wider">Pre-Storm</p>
                            <p className="text-lg font-bold text-white">{formatCurrency(outcome.preStormValue)}</p>
                          </div>
                          <ArrowRight className="w-5 h-5 text-navy-600" />
                          <div className="p-3 bg-navy-800/40 rounded-lg border border-navy-700/30 text-center min-w-[120px]">
                            <p className="text-[10px] text-navy-500 uppercase tracking-wider">Claim Payout</p>
                            <p className="text-lg font-bold text-brand-400">{formatCurrency(outcome.totalPayoutReceived)}</p>
                          </div>
                          <Minus className="w-5 h-5 text-navy-600" />
                          <div className="p-3 bg-navy-800/40 rounded-lg border border-navy-700/30 text-center min-w-[120px]">
                            <p className="text-[10px] text-navy-500 uppercase tracking-wider">Repair Cost</p>
                            <p className="text-lg font-bold text-alert-400">{formatCurrency(outcome.totalRepairCost)}</p>
                          </div>
                          <ArrowRight className="w-5 h-5 text-navy-600" />
                          <div className="p-3 bg-forensic-500/10 rounded-lg border border-forensic-500/20 text-center min-w-[120px]">
                            <p className="text-[10px] text-forensic-400 uppercase tracking-wider">Post-Repair</p>
                            <p className="text-lg font-bold text-forensic-300">{formatCurrency(outcome.postRepairValue)}</p>
                          </div>
                        </div>

                        {/* Net Equity Gain Highlight */}
                        <div className="p-4 bg-forensic-500/10 border border-forensic-500/20 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold text-forensic-300">Net Equity Gain</span>
                            <div className="flex items-center gap-2">
                              <span className="text-2xl font-bold text-forensic-300">
                                {formatCurrency(outcome.netEquityGain)}
                              </span>
                              <Badge variant="success" size="md">
                                +{formatPercentage(outcome.equityGainPercentage)}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Narrative */}
                    <div className="mt-6 p-4 bg-navy-800/30 rounded-lg border border-navy-700/20">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="w-4 h-4 text-brand-400" />
                        <span className="text-xs text-navy-500 uppercase tracking-wider font-semibold">
                          Equity Gain Narrative
                        </span>
                      </div>
                      <p className="text-sm text-navy-200 leading-relaxed">
                        {outcome.narrative}
                      </p>
                      {outcome.verifiedAt && outcome.verifiedBy && (
                        <div className="flex items-center gap-2 mt-3 pt-2 border-t border-navy-700/20 text-xs text-navy-400">
                          <CheckCircle2 className="w-3.5 h-3.5 text-forensic-400" />
                          Verified by {outcome.verifiedBy} on{" "}
                          {new Date(outcome.verifiedAt).toLocaleDateString("en-US", {
                            year: "numeric", month: "long", day: "numeric"
                          })}
                        </div>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <Award className="w-10 h-10 text-navy-600 mx-auto mb-3" />
              <p className="text-navy-400">No verified equity outcomes yet</p>
              <p className="text-xs text-navy-500 mt-1">
                Properties with completed repairs and verified valuations will appear here
              </p>
            </Card>
          )}
        </div>

        {/* Pipeline — Properties In Progress */}
        <div>
          <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-brand-400" />
            Equity Pipeline
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {inProgressProperties.map((property) => (
              <Link key={property.id} href={`/properties/${property.id}`}>
                <Card hover className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="text-sm font-medium text-white">{property.name}</h4>
                      <p className="text-xs text-navy-400 mt-0.5">
                        {property.city}, {property.state}
                      </p>
                    </div>
                    <Badge
                      variant={
                        property.status === "in_repair" || property.status === "completed" ? "info" :
                        property.status === "negotiation" || property.status === "claim_filed" ? "warning" :
                        "neutral"
                      }
                      size="sm"
                    >
                      {property.status.replace(/_/g, " ")}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-navy-400">Estimated Value</span>
                    <span className="text-white font-medium">{formatCurrency(property.estimatedValue)}</span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
