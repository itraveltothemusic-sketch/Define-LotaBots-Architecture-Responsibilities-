/**
 * Intelligence Center
 * 
 * The heart of Equity Builders — a unified view of all property
 * intelligence, ATOS insights, and strategic guidance.
 * 
 * This page combines:
 * - Portfolio-wide risk assessment
 * - Property-level evidence timelines
 * - ATOS conversational intelligence
 * - Actionable insights with priority ranking
 */
"use client";

import React, { useState } from "react";
import {
  Sparkles,
  AlertTriangle,
  TrendingUp,
  Clock,
  CheckCircle2,
  Building2,
  Shield,
  Eye,
  ArrowUpRight,
  Filter,
  Zap,
  Target,
  BarChart3,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge, getStatusVariant } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ATOSPanel } from "@/components/atos";
import { formatCurrency, formatStatus } from "@/lib/utils";
import { cn } from "@/lib/utils/cn";

/** 
 * Intelligence items represent actionable insights derived from 
 * property data, claim analysis, and system monitoring.
 */
const intelligenceItems = [
  {
    id: "1",
    type: "RISK",
    severity: "CRITICAL",
    title: "Claim Filing Deadline Approaching",
    description:
      "675 Warehouse Row has a policy deadline of March 15. The forensic inspection is incomplete. Missing documentation could result in claim denial. Schedule inspection immediately.",
    property: "675 Warehouse Row",
    propertyId: "5",
    timestamp: "10 minutes ago",
    actionRequired: true,
    suggestedAction: "Schedule forensic inspection for this week",
  },
  {
    id: "2",
    type: "GAP",
    severity: "HIGH",
    title: "Scope Discrepancy — $47,200 Underpayment",
    description:
      "Carrier assessment for 450 Commerce Blvd values HVAC replacement at $23,000 vs forensic estimate of $58,200. Roof membrane repair omitted entirely from carrier scope ($12,000). File supplemental claim with documented evidence.",
    property: "450 Commerce Blvd",
    propertyId: "1",
    timestamp: "2 hours ago",
    actionRequired: true,
    suggestedAction: "Prepare supplemental claim with photo evidence",
  },
  {
    id: "3",
    type: "OPPORTUNITY",
    severity: "MEDIUM",
    title: "Equity Verification Ready",
    description:
      "2100 Office Park Ln repairs are complete and verified. Pre-event value: $3.2M. Post-repair appraisal shows $3.74M. Net equity gain of $540K (16.9% ROI) is ready for documentation.",
    property: "2100 Office Park Ln",
    propertyId: "4",
    timestamp: "1 day ago",
    actionRequired: false,
    suggestedAction: "Generate equity outcome report",
  },
  {
    id: "4",
    type: "ALERT",
    severity: "MEDIUM",
    title: "Contractor Insurance Expiring",
    description:
      "Rivera Construction's liability insurance policy expires on Feb 24. They have 2 active assignments. Ensure updated certificate is received before expiration to maintain compliance.",
    property: "System-wide",
    propertyId: null,
    timestamp: "3 hours ago",
    actionRequired: true,
    suggestedAction: "Contact Rivera Construction for updated insurance cert",
  },
  {
    id: "5",
    type: "RECOMMENDATION",
    severity: "LOW",
    title: "Inspection Pattern Detected",
    description:
      "Properties in the Dallas-Fort Worth area show consistent hail damage to HVAC condenser units. Consider adding HVAC inspection to the standard protocol for all DFW properties.",
    property: "Portfolio-wide",
    propertyId: null,
    timestamp: "6 hours ago",
    actionRequired: false,
    suggestedAction: "Update inspection protocol for DFW properties",
  },
  {
    id: "6",
    type: "RISK",
    severity: "HIGH",
    title: "Carrier Response Overdue",
    description:
      "State Farm has not responded to the supplemental claim for 1200 Industrial Pkwy filed 18 days ago. Most carriers respond within 14 days. Consider formal follow-up or escalation.",
    property: "1200 Industrial Pkwy",
    propertyId: "2",
    timestamp: "12 hours ago",
    actionRequired: true,
    suggestedAction: "Send formal follow-up letter to carrier",
  },
];

const propertyTimeline = [
  {
    id: "1",
    property: "450 Commerce Blvd",
    events: [
      { date: "Jan 15", action: "Property registered", type: "milestone" },
      { date: "Jan 22", action: "Forensic inspection completed", type: "milestone" },
      { date: "Jan 28", action: "Claim filed with Travelers", type: "milestone" },
      { date: "Feb 5", action: "Carrier acknowledgment received", type: "update" },
      { date: "Feb 8", action: "Scope discrepancy identified by ATOS", type: "alert" },
    ],
  },
  {
    id: "2",
    property: "1200 Industrial Pkwy",
    events: [
      { date: "Dec 10", action: "Property registered", type: "milestone" },
      { date: "Dec 18", action: "Forensic inspection completed", type: "milestone" },
      { date: "Jan 5", action: "Claim filed with State Farm", type: "milestone" },
      { date: "Jan 15", action: "Claim approved — $312,000", type: "success" },
      { date: "Jan 22", action: "Supplemental claim filed — $48,000", type: "milestone" },
      { date: "Feb 3", action: "Contractor assigned — repairs started", type: "update" },
    ],
  },
];

type FilterType = "ALL" | "RISK" | "GAP" | "OPPORTUNITY" | "ALERT" | "RECOMMENDATION";

export default function IntelligenceCenterPage() {
  const [filter, setFilter] = useState<FilterType>("ALL");

  const filteredItems = filter === "ALL"
    ? intelligenceItems
    : intelligenceItems.filter((item) => item.type === filter);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "RISK":
        return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case "GAP":
        return <Target className="w-4 h-4 text-amber-400" />;
      case "OPPORTUNITY":
        return <TrendingUp className="w-4 h-4 text-emerald-400" />;
      case "ALERT":
        return <Zap className="w-4 h-4 text-yellow-400" />;
      case "RECOMMENDATION":
        return <CheckCircle2 className="w-4 h-4 text-blue-400" />;
      default:
        return <Eye className="w-4 h-4 text-slate-400" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "CRITICAL":
        return "danger";
      case "HIGH":
        return "warning";
      case "MEDIUM":
        return "info";
      case "LOW":
        return "neutral";
      default:
        return "neutral";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="p-2 rounded-lg bg-brand-500/10">
              <Sparkles className="w-5 h-5 text-brand-400" />
            </div>
            Intelligence Center
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            ATOS-powered insights, risk analysis, and strategic guidance across your portfolio
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="success" dot>
            {intelligenceItems.filter((i) => i.actionRequired).length} actions required
          </Badge>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Active Risks", value: intelligenceItems.filter((i) => i.type === "RISK").length, icon: <AlertTriangle className="w-4 h-4" />, color: "text-red-400" },
          { label: "Gaps Detected", value: intelligenceItems.filter((i) => i.type === "GAP").length, icon: <Target className="w-4 h-4" />, color: "text-amber-400" },
          { label: "Opportunities", value: intelligenceItems.filter((i) => i.type === "OPPORTUNITY").length, icon: <TrendingUp className="w-4 h-4" />, color: "text-emerald-400" },
          { label: "Recommendations", value: intelligenceItems.filter((i) => i.type === "RECOMMENDATION").length, icon: <CheckCircle2 className="w-4 h-4" />, color: "text-blue-400" },
        ].map((stat) => (
          <Card key={stat.label} variant="glass" padding="sm">
            <div className="flex items-center gap-3">
              <div className={cn("p-2 rounded-lg bg-slate-800/50", stat.color)}>
                {stat.icon}
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-slate-500">{stat.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Intelligence Feed — Left 3/5 */}
        <div className="lg:col-span-3 space-y-4">
          {/* Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-slate-500" />
            {(["ALL", "RISK", "GAP", "OPPORTUNITY", "ALERT", "RECOMMENDATION"] as FilterType[]).map(
              (type) => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={cn(
                    "text-xs px-3 py-1.5 rounded-full border transition-colors",
                    filter === type
                      ? "bg-brand-600/20 border-brand-500/30 text-brand-300"
                      : "bg-transparent border-slate-700/50 text-slate-400 hover:border-slate-600 hover:text-slate-300"
                  )}
                >
                  {type === "ALL" ? "All Insights" : type.charAt(0) + type.slice(1).toLowerCase() + "s"}
                </button>
              )
            )}
          </div>

          {/* Intelligence Items */}
          <div className="space-y-3">
            {filteredItems.map((item) => (
              <Card
                key={item.id}
                variant="default"
                padding="md"
                className="hover:border-slate-600/50 transition-all cursor-pointer group"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-0.5 p-2 rounded-lg bg-slate-800/80">
                    {getTypeIcon(item.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="text-sm font-semibold text-white">
                        {item.title}
                      </h3>
                      <Badge variant={getSeverityColor(item.severity) as "danger" | "warning" | "info" | "neutral"} size="sm">
                        {item.severity}
                      </Badge>
                      {item.actionRequired && (
                        <Badge variant="warning" size="sm" dot>
                          Action Required
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed mb-3">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Building2 className="w-3 h-3" />
                          {item.property}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {item.timestamp}
                        </span>
                      </div>
                      {item.suggestedAction && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          {item.suggestedAction}
                          <ArrowUpRight className="w-3 h-3 ml-1" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Right Panel — ATOS + Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* ATOS Conversational Panel */}
          <ATOSPanel
            context="GENERAL"
            initialInsights={[
              {
                type: "risk",
                text: "1 claim filing deadline approaching this month",
              },
              {
                type: "opportunity",
                text: "$540K equity gain ready for verification",
              },
              {
                type: "alert",
                text: "Carrier response overdue on 1 supplemental claim",
              },
            ]}
          />

          {/* Evidence Timeline */}
          <Card variant="default" padding="md">
            <CardHeader>
              <CardTitle className="text-base">Evidence Timeline</CardTitle>
              <CardDescription>Recent property events</CardDescription>
            </CardHeader>
            <div className="space-y-6">
              {propertyTimeline.map((property) => (
                <div key={property.id}>
                  <p className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-slate-500" />
                    {property.property}
                  </p>
                  <div className="relative ml-2 border-l border-slate-700/50 pl-4 space-y-3">
                    {property.events.map((event, idx) => (
                      <div key={idx} className="relative">
                        <div
                          className={cn(
                            "absolute -left-[21px] w-2.5 h-2.5 rounded-full border-2",
                            event.type === "milestone" && "bg-brand-500 border-brand-400",
                            event.type === "update" && "bg-blue-500 border-blue-400",
                            event.type === "alert" && "bg-red-500 border-red-400",
                            event.type === "success" && "bg-emerald-500 border-emerald-400"
                          )}
                        />
                        <div>
                          <p className="text-xs text-slate-400">{event.date}</p>
                          <p className="text-sm text-slate-300">{event.action}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
