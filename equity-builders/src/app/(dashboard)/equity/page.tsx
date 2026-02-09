/**
 * Equity Outcome Module — Portfolio View
 * 
 * The culmination of the entire platform: verified equity gains.
 * This module shows before/after valuations, claim vs payout deltas,
 * and ROI analysis across the portfolio.
 * 
 * Why this matters: This is where the platform's value proposition
 * becomes tangible. Every property that goes through the pipeline
 * should demonstrate measurable equity creation.
 */
"use client";

import React from "react";
import Link from "next/link";
import {
  TrendingUp,
  DollarSign,
  Building2,
  ArrowUpRight,
  BarChart3,
  Eye,
  CheckCircle2,
  Clock,
  FileText,
  Sparkles,
  PieChart,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/ui/stat-card";
import { ATOSPanel } from "@/components/atos";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { cn } from "@/lib/utils/cn";

interface EquityItem {
  id: string;
  property: string;
  propertyId: string;
  preEventValue: number;
  claimTotal: number;
  repairCosts: number;
  postRepairValue: number;
  equityGain: number;
  roiPercent: number;
  isVerified: boolean;
  status: string;
}

const equityOutcomes: EquityItem[] = [
  {
    id: "1",
    property: "2100 Office Park Ln, Austin TX",
    propertyId: "4",
    preEventValue: 3_200_000,
    claimTotal: 389_000,
    repairCosts: 342_000,
    postRepairValue: 3_740_000,
    equityGain: 540_000,
    roiPercent: 16.9,
    isVerified: true,
    status: "VERIFIED",
  },
  {
    id: "2",
    property: "1200 Industrial Pkwy, Houston TX",
    propertyId: "2",
    preEventValue: 5_100_000,
    claimTotal: 312_000,
    repairCosts: 275_000,
    postRepairValue: 5_450_000,
    equityGain: 350_000,
    roiPercent: 6.9,
    isVerified: false,
    status: "IN_PROGRESS",
  },
  {
    id: "3",
    property: "450 Commerce Blvd, Dallas TX",
    propertyId: "1",
    preEventValue: 2_400_000,
    claimTotal: 188_300,
    repairCosts: 0,
    postRepairValue: 0,
    equityGain: 0,
    roiPercent: 0,
    isVerified: false,
    status: "PENDING",
  },
  {
    id: "4",
    property: "675 Warehouse Row, Fort Worth TX",
    propertyId: "5",
    preEventValue: 1_500_000,
    claimTotal: 95_000,
    repairCosts: 0,
    postRepairValue: 0,
    equityGain: 0,
    roiPercent: 0,
    isVerified: false,
    status: "PENDING",
  },
];

const portfolioStats = {
  totalPreEventValue: equityOutcomes.reduce((s, e) => s + e.preEventValue, 0),
  totalPostRepairValue: equityOutcomes.filter((e) => e.postRepairValue > 0).reduce((s, e) => s + e.postRepairValue, 0),
  totalEquityGain: equityOutcomes.reduce((s, e) => s + e.equityGain, 0),
  totalClaimProceeds: equityOutcomes.reduce((s, e) => s + e.claimTotal, 0),
  totalRepairCosts: equityOutcomes.reduce((s, e) => s + e.repairCosts, 0),
  verifiedCount: equityOutcomes.filter((e) => e.isVerified).length,
  pendingCount: equityOutcomes.filter((e) => !e.isVerified).length,
  avgROI: equityOutcomes.filter((e) => e.roiPercent > 0).reduce((s, e) => s + e.roiPercent, 0) / equityOutcomes.filter((e) => e.roiPercent > 0).length || 0,
};

export default function EquityPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="p-2 rounded-lg bg-brand-500/10">
              <TrendingUp className="w-5 h-5 text-brand-400" />
            </div>
            Equity Analysis
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Before-and-after valuation, claim utilization, and verified equity outcomes
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" icon={<FileText className="w-4 h-4" />}>
            Export Portfolio Report
          </Button>
        </div>
      </div>

      {/* Portfolio KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Equity Gain"
          value={formatCurrency(portfolioStats.totalEquityGain)}
          change={{ value: portfolioStats.avgROI, label: "avg ROI" }}
          trend="up"
          icon={<TrendingUp className="w-5 h-5" />}
        />
        <StatCard
          label="Claim Proceeds"
          value={formatCurrency(portfolioStats.totalClaimProceeds)}
          icon={<DollarSign className="w-5 h-5" />}
        />
        <StatCard
          label="Repair Investment"
          value={formatCurrency(portfolioStats.totalRepairCosts)}
          icon={<Building2 className="w-5 h-5" />}
        />
        <StatCard
          label="Verified Outcomes"
          value={`${portfolioStats.verifiedCount} of ${equityOutcomes.length}`}
          icon={<CheckCircle2 className="w-5 h-5" />}
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Equity Outcomes */}
          <div className="space-y-4">
            {equityOutcomes.map((outcome) => (
              <Card
                key={outcome.id}
                variant="default"
                padding="md"
                className="hover:border-slate-600/50 transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Link
                        href={`/properties/${outcome.propertyId}`}
                        className="text-sm font-semibold text-white hover:text-brand-300 transition-colors"
                      >
                        {outcome.property}
                      </Link>
                      {outcome.isVerified ? (
                        <Badge variant="success" dot size="sm">Verified</Badge>
                      ) : outcome.status === "IN_PROGRESS" ? (
                        <Badge variant="info" dot size="sm">In Progress</Badge>
                      ) : (
                        <Badge variant="neutral" dot size="sm">Pending</Badge>
                      )}
                    </div>
                  </div>
                  <Link href={`/equity/${outcome.id}`}>
                    <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>

                {/* Value Flow */}
                <div className="grid grid-cols-5 gap-2 items-center">
                  <div className="text-center">
                    <p className="text-xs text-slate-500 mb-1">Pre-Event</p>
                    <p className="text-sm font-semibold text-white">
                      {formatCurrency(outcome.preEventValue)}
                    </p>
                  </div>
                  <div className="text-center text-slate-600">
                    <ArrowUpRight className="w-4 h-4 mx-auto" />
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-slate-500 mb-1">Claim + Repairs</p>
                    <p className="text-sm font-semibold text-blue-400">
                      {outcome.claimTotal > 0 ? `+${formatCurrency(outcome.claimTotal)}` : "—"}
                    </p>
                    {outcome.repairCosts > 0 && (
                      <p className="text-xs text-slate-500">
                        -{formatCurrency(outcome.repairCosts)} costs
                      </p>
                    )}
                  </div>
                  <div className="text-center text-slate-600">
                    <ArrowUpRight className="w-4 h-4 mx-auto" />
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-slate-500 mb-1">Post-Repair</p>
                    <p className="text-sm font-semibold text-white">
                      {outcome.postRepairValue > 0 ? formatCurrency(outcome.postRepairValue) : "TBD"}
                    </p>
                  </div>
                </div>

                {/* Equity Gain Bar */}
                {outcome.equityGain > 0 && (
                  <div className="mt-4 pt-3 border-t border-slate-700/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-400">Equity Gain</span>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-emerald-400">
                          +{formatCurrency(outcome.equityGain)}
                        </span>
                        <Badge variant="success" size="sm">
                          {formatPercent(outcome.roiPercent)} ROI
                        </Badge>
                      </div>
                    </div>
                    <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400"
                        style={{
                          width: `${Math.min((outcome.equityGain / outcome.preEventValue) * 100 * 3, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                )}

                {outcome.status === "PENDING" && (
                  <div className="mt-4 pt-3 border-t border-slate-700/20 flex items-center gap-2 text-xs text-slate-500">
                    <Clock className="w-3.5 h-3.5" />
                    <span>
                      Equity analysis will be available after repairs are completed and property is re-appraised
                    </span>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* Right Panel */}
        <div className="space-y-6">
          {/* Portfolio Summary */}
          <Card variant="elevated" padding="md">
            <CardHeader>
              <div className="flex items-center gap-2">
                <PieChart className="w-4 h-4 text-brand-400" />
                <CardTitle className="text-base">Portfolio Summary</CardTitle>
              </div>
            </CardHeader>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Total Pre-Event Value</span>
                <span className="text-sm font-medium text-white">
                  {formatCurrency(portfolioStats.totalPreEventValue)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Total Claim Proceeds</span>
                <span className="text-sm font-medium text-blue-400">
                  +{formatCurrency(portfolioStats.totalClaimProceeds)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Total Repair Costs</span>
                <span className="text-sm font-medium text-red-400">
                  -{formatCurrency(portfolioStats.totalRepairCosts)}
                </span>
              </div>
              <div className="h-px bg-slate-700/50" />
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Net Claim Profit</span>
                <span className="text-sm font-bold text-emerald-400">
                  +{formatCurrency(portfolioStats.totalClaimProceeds - portfolioStats.totalRepairCosts)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Verified Equity Gain</span>
                <span className="text-base font-bold text-emerald-400">
                  +{formatCurrency(portfolioStats.totalEquityGain)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Average ROI</span>
                <span className="text-sm font-bold text-brand-300">
                  {formatPercent(portfolioStats.avgROI)}
                </span>
              </div>
            </div>
          </Card>

          {/* ATOS */}
          <ATOSPanel
            context="EQUITY_ANALYSIS"
            initialInsights={[
              { type: "opportunity", text: "2100 Office Park shows 16.9% ROI — above portfolio average. Document success factors for replication." },
              { type: "recommendation", text: "1200 Industrial Pkwy repairs at 65% — equity verification can be estimated at current trajectory." },
              { type: "risk", text: "2 properties awaiting repair start — delayed execution reduces time-adjusted ROI." },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
