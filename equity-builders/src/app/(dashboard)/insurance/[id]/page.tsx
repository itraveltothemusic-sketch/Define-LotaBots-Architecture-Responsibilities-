/**
 * Insurance Claim Detail Page
 * 
 * Deep dive into a single claim — its lifecycle, carrier interactions,
 * scope comparison, and strategic ATOS guidance.
 */
"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Shield,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  FileText,
  MessageSquare,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Send,
  Plus,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge, getStatusVariant } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ATOSPanel } from "@/components/atos";
import { formatCurrency, formatDate, formatStatus } from "@/lib/utils";
import { cn } from "@/lib/utils/cn";

const claim = {
  id: "1",
  claimNumber: "TRV-2024-08847",
  property: "450 Commerce Blvd",
  propertyId: "1",
  propertyAddress: "450 Commerce Blvd, Dallas, TX 75201",
  carrier: "Travelers Insurance",
  policyNumber: "POL-8847-2024",
  status: "UNDER_REVIEW",
  filedDate: "2024-01-28",
  claimedAmount: 188300,
  approvedAmount: null,
  adjusterName: "Robert Taylor",
  adjusterEmail: "rtaylor@travelers.com",
  adjusterPhone: "(214) 555-0187",
};

const interactions = [
  {
    id: "1",
    date: "2024-02-08",
    type: "NOTE",
    summary: "ATOS detected HVAC scope discrepancy. Carrier assessment values HVAC at $23,000 vs forensic estimate of $58,200.",
    outcome: "Supplemental documentation being prepared",
    recordedBy: "ATOS System",
  },
  {
    id: "2",
    date: "2024-02-05",
    type: "EMAIL",
    summary: "Carrier acknowledged claim receipt. Claim number TRV-2024-08847 assigned. Adjuster Robert Taylor assigned to case.",
    outcome: "Adjuster site visit scheduled for Feb 12",
    recordedBy: "Alex Morgan",
  },
  {
    id: "3",
    date: "2024-01-28",
    type: "SUBMISSION",
    summary: "Initial claim filed with complete forensic documentation package. Included 47 inspection photos, damage assessment report, and line-item scope of work.",
    outcome: "Claim submitted successfully",
    recordedBy: "Alex Morgan",
  },
];

const scopeItems = [
  { item: "Roof membrane replacement — Sections A & B", forensic: 87000, carrier: 72000, notes: "Carrier used lower material grade in estimate" },
  { item: "HVAC condenser unit replacement (4 units)", forensic: 58200, carrier: 23000, notes: "Carrier only assessed 2 of 4 damaged units" },
  { item: "Facade repair — North wall exterior", forensic: 12400, carrier: 11800, notes: "" },
  { item: "Water damage remediation — 2nd floor", forensic: 18000, carrier: 15500, notes: "Carrier excluded ceiling tile replacement" },
  { item: "Ceiling tile replacement — Rooms 201-205", forensic: 8500, carrier: 8000, notes: "" },
  { item: "Drywall repair — 2nd floor", forensic: 4200, carrier: 4200, notes: "Match" },
];

export default function ClaimDetailPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Link href="/insurance" className="hover:text-slate-300 transition-colors flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" />
          Claims
        </Link>
        <span>/</span>
        <span className="text-slate-300">{claim.claimNumber}</span>
      </div>

      {/* Claim Header */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-white font-mono">{claim.claimNumber}</h1>
            <Badge variant={getStatusVariant(claim.status)} dot>
              {formatStatus(claim.status)}
            </Badge>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
            <Link href={`/properties/${claim.propertyId}`} className="hover:text-brand-300 transition-colors">
              {claim.propertyAddress}
            </Link>
            <span>&middot;</span>
            <span>{claim.carrier}</span>
            <span>&middot;</span>
            <span>Filed {formatDate(claim.filedDate)}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" icon={<Plus className="w-4 h-4" />}>
            Log Interaction
          </Button>
          <Button variant="primary" size="sm" icon={<FileText className="w-4 h-4" />}>
            File Supplement
          </Button>
        </div>
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-3 gap-4">
        <Card variant="default" padding="md">
          <p className="text-xs text-slate-500 mb-1">Amount Claimed</p>
          <p className="text-2xl font-bold text-white">{formatCurrency(claim.claimedAmount)}</p>
          <p className="text-xs text-slate-500 mt-1">Based on forensic scope</p>
        </Card>
        <Card variant="default" padding="md">
          <p className="text-xs text-slate-500 mb-1">Amount Approved</p>
          <p className="text-2xl font-bold text-amber-400">Pending</p>
          <p className="text-xs text-slate-500 mt-1">Carrier review in progress</p>
        </Card>
        <Card variant="default" padding="md">
          <p className="text-xs text-slate-500 mb-1">Identified Discrepancy</p>
          <p className="text-2xl font-bold text-red-400">
            {formatCurrency(scopeItems.reduce((s, i) => s + (i.forensic - i.carrier), 0))}
          </p>
          <p className="text-xs text-slate-500 mt-1">Forensic vs carrier delta</p>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Scope Comparison Table */}
          <Card variant="default" padding="none">
            <div className="px-6 py-4 border-b border-slate-700/50">
              <CardHeader className="mb-0">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <CardTitle className="text-base">Scope Comparison</CardTitle>
                </div>
                <CardDescription>Forensic scope vs carrier assessment</CardDescription>
              </CardHeader>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700/30">
                    <th className="text-left text-xs font-medium text-slate-500 uppercase px-6 py-3">Line Item</th>
                    <th className="text-right text-xs font-medium text-slate-500 uppercase px-6 py-3">Forensic</th>
                    <th className="text-right text-xs font-medium text-slate-500 uppercase px-6 py-3">Carrier</th>
                    <th className="text-right text-xs font-medium text-slate-500 uppercase px-6 py-3">Variance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/20">
                  {scopeItems.map((item, idx) => {
                    const variance = item.forensic - item.carrier;
                    return (
                      <tr key={idx} className={cn(
                        "hover:bg-slate-800/30",
                        variance > 5000 && "bg-red-500/5"
                      )}>
                        <td className="px-6 py-3">
                          <p className="text-sm text-slate-300">{item.item}</p>
                          {item.notes && item.notes !== "Match" && (
                            <p className="text-xs text-amber-400/80 mt-0.5">{item.notes}</p>
                          )}
                        </td>
                        <td className="px-6 py-3 text-right">
                          <span className="text-sm font-medium text-white">{formatCurrency(item.forensic)}</span>
                        </td>
                        <td className="px-6 py-3 text-right">
                          <span className="text-sm text-slate-300">{formatCurrency(item.carrier)}</span>
                        </td>
                        <td className="px-6 py-3 text-right">
                          <span className={cn(
                            "text-sm font-semibold",
                            variance > 5000 ? "text-red-400" : variance > 0 ? "text-amber-400" : "text-emerald-400"
                          )}>
                            {variance === 0 ? "—" : `-${formatCurrency(variance)}`}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="border-t border-slate-700/50">
                    <td className="px-6 py-3 text-sm font-semibold text-white">Total</td>
                    <td className="px-6 py-3 text-right text-sm font-bold text-white">
                      {formatCurrency(scopeItems.reduce((s, i) => s + i.forensic, 0))}
                    </td>
                    <td className="px-6 py-3 text-right text-sm font-bold text-slate-300">
                      {formatCurrency(scopeItems.reduce((s, i) => s + i.carrier, 0))}
                    </td>
                    <td className="px-6 py-3 text-right text-sm font-bold text-red-400">
                      -{formatCurrency(scopeItems.reduce((s, i) => s + (i.forensic - i.carrier), 0))}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </Card>

          {/* Carrier Interactions */}
          <Card variant="default" padding="md">
            <CardHeader>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-slate-400" />
                <CardTitle className="text-base">Carrier Interaction Log</CardTitle>
              </div>
              <Button variant="ghost" size="sm" icon={<Plus className="w-3.5 h-3.5" />}>
                Add Entry
              </Button>
            </CardHeader>
            <div className="space-y-4">
              {interactions.map((interaction) => (
                <div
                  key={interaction.id}
                  className="relative pl-6 border-l-2 border-slate-700/50 pb-4 last:pb-0"
                >
                  <div className={cn(
                    "absolute -left-[5px] w-2 h-2 rounded-full",
                    interaction.type === "NOTE" && "bg-amber-500",
                    interaction.type === "EMAIL" && "bg-blue-500",
                    interaction.type === "SUBMISSION" && "bg-brand-500"
                  )} />
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="neutral" size="sm">{interaction.type}</Badge>
                    <span className="text-xs text-slate-500">{formatDate(interaction.date)}</span>
                    <span className="text-xs text-slate-600">&middot;</span>
                    <span className="text-xs text-slate-500">{interaction.recordedBy}</span>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">{interaction.summary}</p>
                  {interaction.outcome && (
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      {interaction.outcome}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Panel */}
        <div className="space-y-6">
          {/* Adjuster Info */}
          <Card variant="default" padding="md">
            <CardHeader>
              <CardTitle className="text-base">Adjuster Contact</CardTitle>
            </CardHeader>
            <div className="space-y-3">
              <p className="text-sm font-medium text-white">{claim.adjusterName}</p>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Phone className="w-4 h-4" />
                <span>{claim.adjusterPhone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Mail className="w-4 h-4" />
                <span>{claim.adjusterEmail}</span>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Policy: {claim.policyNumber}
              </p>
            </div>
          </Card>

          {/* ATOS */}
          <ATOSPanel
            context="CLAIM_STRATEGY"
            initialInsights={[
              { type: "risk", text: "HVAC scope shows $35,200 underpayment — carrier only assessed 2 of 4 units" },
              { type: "recommendation", text: "Prepare photo evidence of all 4 damaged condenser units before adjuster visit on Feb 12" },
              { type: "opportunity", text: "Supplemental claim for undocumented items could recover additional $47K" },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
