/**
 * Equity Outcome Detail Page
 * 
 * Deep dive into a single property's equity outcome — showing
 * the complete value transformation narrative with verified data.
 */
"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  TrendingUp,
  Building2,
  DollarSign,
  CheckCircle2,
  FileText,
  Download,
  ArrowUpRight,
  Shield,
  HardHat,
  Sparkles,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ATOSPanel } from "@/components/atos";
import { formatCurrency, formatPercent, formatDate } from "@/lib/utils";

const outcome = {
  id: "1",
  property: "2100 Office Park Ln",
  propertyId: "4",
  address: "2100 Office Park Ln, Austin, TX 78701",
  preEventValue: 3_200_000,
  claimTotal: 389_000,
  repairCosts: 342_000,
  postRepairValue: 3_740_000,
  equityGain: 540_000,
  roiPercent: 16.9,
  isVerified: true,
  verifiedDate: "2024-02-05",
  narrative:
    "This Class A office property sustained significant wind and hail damage during the May 2023 storm event. Forensic inspection documented severe roof membrane damage, HVAC system impairment, and facade deterioration. The insurance claim was filed with Liberty Mutual for $412,000, with $389,000 approved after supplemental documentation. Repairs were executed by Summit Roofing Solutions and DFW Interior Specialists, with total costs of $342,000 — $47,000 under the approved amount. Post-repair appraisal confirmed a property value increase to $3.74M, representing a net equity gain of $540,000 (16.9% ROI). The property now features a new 25-year roof system, modernized HVAC units, and restored facade — improvements that exceed pre-event condition.",
};

const valueBreakdown = [
  { label: "Pre-Event Appraised Value", value: outcome.preEventValue, type: "neutral" as const },
  { label: "Insurance Claim Approved", value: outcome.claimTotal, type: "positive" as const },
  { label: "Total Repair Investment", value: -outcome.repairCosts, type: "negative" as const },
  { label: "Net Claim Profit", value: outcome.claimTotal - outcome.repairCosts, type: "positive" as const },
  { label: "Post-Repair Appraised Value", value: outcome.postRepairValue, type: "neutral" as const },
  { label: "Equity Gain (Post - Pre)", value: outcome.equityGain, type: "highlight" as const },
];

const milestones = [
  { date: "May 15, 2023", event: "Storm event occurred", status: "complete" },
  { date: "Nov 20, 2023", event: "Property registered on platform", status: "complete" },
  { date: "Dec 4, 2023", event: "Forensic inspection completed", status: "complete" },
  { date: "Dec 5, 2023", event: "Claim filed — $412,000", status: "complete" },
  { date: "Dec 22, 2023", event: "Claim approved — $389,000", status: "complete" },
  { date: "Jan 3, 2024", event: "Contractors assigned", status: "complete" },
  { date: "Jan 28, 2024", event: "Repairs completed", status: "complete" },
  { date: "Feb 5, 2024", event: "Equity gain verified — +$540,000", status: "complete" },
];

export default function EquityDetailPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Link href="/equity" className="hover:text-slate-300 transition-colors flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" />
          Equity Analysis
        </Link>
        <span>/</span>
        <span className="text-slate-300">{outcome.property}</span>
      </div>

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-white">{outcome.property}</h1>
            <Badge variant="success" dot>Equity Verified</Badge>
          </div>
          <p className="text-sm text-slate-400">{outcome.address}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" icon={<Download className="w-4 h-4" />}>
            Download Report
          </Button>
          <Button variant="primary" size="sm" icon={<FileText className="w-4 h-4" />}>
            Generate Narrative
          </Button>
        </div>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card variant="glass" padding="lg" className="text-center">
          <p className="text-xs text-slate-500 mb-2">Pre-Event Value</p>
          <p className="text-2xl font-bold text-white">{formatCurrency(outcome.preEventValue)}</p>
        </Card>
        <Card variant="glass" padding="lg" className="text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent" />
          <p className="text-xs text-slate-500 mb-2 relative">Equity Gain</p>
          <p className="text-3xl font-bold text-emerald-400 relative">+{formatCurrency(outcome.equityGain)}</p>
          <p className="text-sm text-emerald-500 mt-1 relative">{formatPercent(outcome.roiPercent)} ROI</p>
        </Card>
        <Card variant="glass" padding="lg" className="text-center">
          <p className="text-xs text-slate-500 mb-2">Post-Repair Value</p>
          <p className="text-2xl font-bold text-white">{formatCurrency(outcome.postRepairValue)}</p>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Value Breakdown */}
          <Card variant="default" padding="md">
            <CardHeader>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-brand-400" />
                <CardTitle className="text-base">Value Transformation</CardTitle>
              </div>
              <CardDescription>Complete financial breakdown</CardDescription>
            </CardHeader>
            <div className="space-y-2">
              {valueBreakdown.map((item, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    item.type === "highlight"
                      ? "bg-emerald-500/10 border border-emerald-500/20"
                      : "bg-slate-800/30 border border-slate-700/20"
                  }`}
                >
                  <span className="text-sm text-slate-300">{item.label}</span>
                  <span
                    className={`text-sm font-semibold ${
                      item.type === "highlight"
                        ? "text-emerald-400 text-lg"
                        : item.type === "positive"
                        ? "text-emerald-400"
                        : item.type === "negative"
                        ? "text-red-400"
                        : "text-white"
                    }`}
                  >
                    {item.value >= 0 && item.type !== "neutral" ? "+" : ""}
                    {formatCurrency(Math.abs(item.value))}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Equity Narrative */}
          <Card variant="default" padding="md">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-400" />
                <CardTitle className="text-base">Equity Narrative</CardTitle>
              </div>
              <Badge variant="success" size="sm">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Verified {formatDate(outcome.verifiedDate)}
              </Badge>
            </CardHeader>
            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {outcome.narrative}
            </p>
          </Card>

          {/* Project Timeline */}
          <Card variant="default" padding="md">
            <CardHeader>
              <CardTitle className="text-base">Project Timeline</CardTitle>
              <CardDescription>From storm to verified equity</CardDescription>
            </CardHeader>
            <div className="relative ml-2 border-l border-slate-700/50 pl-6 space-y-4">
              {milestones.map((milestone, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute -left-[29px] w-3 h-3 rounded-full bg-emerald-500 border-2 border-emerald-400" />
                  <p className="text-xs text-slate-500">{milestone.date}</p>
                  <p className="text-sm text-slate-300">{milestone.event}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Panel */}
        <div className="space-y-6">
          {/* Key Metrics */}
          <Card variant="elevated" padding="md">
            <CardHeader>
              <CardTitle className="text-base">Key Metrics</CardTitle>
            </CardHeader>
            <div className="space-y-4">
              {[
                { label: "Return on Investment", value: formatPercent(outcome.roiPercent), color: "text-emerald-400" },
                { label: "Claim Utilization", value: formatPercent((outcome.repairCosts / outcome.claimTotal) * 100), color: "text-blue-400" },
                { label: "Net Claim Profit", value: formatCurrency(outcome.claimTotal - outcome.repairCosts), color: "text-emerald-400" },
                { label: "Value Appreciation", value: formatPercent(((outcome.postRepairValue - outcome.preEventValue) / outcome.preEventValue) * 100), color: "text-brand-400" },
                { label: "Days to Completion", value: "77 days", color: "text-white" },
              ].map((metric) => (
                <div key={metric.label} className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">{metric.label}</span>
                  <span className={`text-sm font-semibold ${metric.color}`}>{metric.value}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* ATOS */}
          <ATOSPanel
            context="EQUITY_ANALYSIS"
            initialInsights={[
              { type: "opportunity", text: "16.9% ROI exceeds portfolio average of 11.9%. The roof system upgrade is the primary value driver." },
              { type: "recommendation", text: "This outcome narrative is ready for stakeholder distribution and investor reporting." },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
