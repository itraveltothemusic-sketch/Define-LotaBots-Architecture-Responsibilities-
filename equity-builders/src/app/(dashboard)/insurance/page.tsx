/**
 * Insurance Intelligence Module — Claims List
 * 
 * Central view for all insurance claims across the portfolio.
 * Tracks claim lifecycle, identifies discrepancies, and provides
 * strategic guidance through ATOS integration.
 * 
 * Key insight: The claim-vs-forensic scope comparison is where
 * the platform delivers the most measurable value. Underpayments
 * are identified, documented, and actionable.
 */
"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Shield,
  Search,
  Plus,
  AlertTriangle,
  DollarSign,
  Clock,
  ArrowUpRight,
  Building2,
  Phone,
  Mail,
  TrendingDown,
  TrendingUp,
  Eye,
  BarChart3,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge, getStatusVariant } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/ui/stat-card";
import { formatCurrency, formatDate, formatStatus, formatPercent } from "@/lib/utils";
import { cn } from "@/lib/utils/cn";

interface ClaimListItem {
  id: string;
  claimNumber: string;
  property: string;
  propertyId: string;
  carrier: string;
  status: string;
  filedDate: string;
  claimedAmount: number;
  approvedAmount: number | null;
  discrepancy: number | null;
  adjuster: string;
  lastInteraction: string;
  daysOpen: number;
}

const claims: ClaimListItem[] = [
  {
    id: "1",
    claimNumber: "TRV-2024-08847",
    property: "450 Commerce Blvd, Dallas TX",
    propertyId: "1",
    carrier: "Travelers Insurance",
    status: "UNDER_REVIEW",
    filedDate: "2024-01-28",
    claimedAmount: 188300,
    approvedAmount: null,
    discrepancy: null,
    adjuster: "Robert Taylor",
    lastInteraction: "Feb 8",
    daysOpen: 12,
  },
  {
    id: "2",
    claimNumber: "SF-2024-12045",
    property: "1200 Industrial Pkwy, Houston TX",
    propertyId: "2",
    carrier: "State Farm",
    status: "APPROVED",
    filedDate: "2024-01-05",
    claimedAmount: 360000,
    approvedAmount: 312000,
    discrepancy: 48000,
    adjuster: "Jennifer Adams",
    lastInteraction: "Jan 22",
    daysOpen: 35,
  },
  {
    id: "3",
    claimNumber: "AET-2024-55123",
    property: "675 Warehouse Row, Fort Worth TX",
    propertyId: "5",
    carrier: "Aetna",
    status: "SUBMITTED",
    filedDate: "2024-02-01",
    claimedAmount: 95000,
    approvedAmount: null,
    discrepancy: null,
    adjuster: "Pending Assignment",
    lastInteraction: "Feb 1",
    daysOpen: 8,
  },
  {
    id: "4",
    claimNumber: "LIB-2023-78432",
    property: "2100 Office Park Ln, Austin TX",
    propertyId: "4",
    carrier: "Liberty Mutual",
    status: "SETTLED",
    filedDate: "2023-12-05",
    claimedAmount: 412000,
    approvedAmount: 389000,
    discrepancy: 23000,
    adjuster: "Mark Williams",
    lastInteraction: "Jan 30",
    daysOpen: 56,
  },
];

/** Scope comparison data for a sample claim showing line-item discrepancies */
const scopeComparison = [
  { item: "Roof membrane replacement", forensic: 87000, carrier: 72000, variance: -15000 },
  { item: "HVAC condenser units (4)", forensic: 58200, carrier: 23000, variance: -35200 },
  { item: "Facade repair — north wall", forensic: 12400, carrier: 11800, variance: -600 },
  { item: "Interior water damage", forensic: 18000, carrier: 15500, variance: -2500 },
  { item: "Ceiling tile replacement", forensic: 8500, carrier: 8000, variance: -500 },
  { item: "Drywall repair", forensic: 4200, carrier: 4200, variance: 0 },
];

export default function InsurancePage() {
  const [searchQuery, setSearchQuery] = useState("");

  const totalClaimed = claims.reduce((sum, c) => sum + c.claimedAmount, 0);
  const totalApproved = claims
    .filter((c) => c.approvedAmount)
    .reduce((sum, c) => sum + (c.approvedAmount || 0), 0);
  const totalDiscrepancy = claims
    .filter((c) => c.discrepancy)
    .reduce((sum, c) => sum + (c.discrepancy || 0), 0);
  const recoveryRate = totalApproved > 0 ? (totalApproved / totalClaimed) * 100 : 0;

  const filteredClaims = claims.filter((c) =>
    searchQuery === "" ||
    c.claimNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.property.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.carrier.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="p-2 rounded-lg bg-brand-500/10">
              <Shield className="w-5 h-5 text-brand-400" />
            </div>
            Insurance Intelligence
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Claim lifecycle tracking, scope comparison, and carrier intelligence
          </p>
        </div>
        <Button variant="primary" size="md" icon={<Plus className="w-4 h-4" />}>
          File New Claim
        </Button>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Claimed"
          value={formatCurrency(totalClaimed)}
          icon={<DollarSign className="w-5 h-5" />}
        />
        <StatCard
          label="Total Approved"
          value={formatCurrency(totalApproved)}
          change={{ value: recoveryRate, label: "recovery rate" }}
          trend="up"
          icon={<TrendingUp className="w-5 h-5" />}
        />
        <StatCard
          label="Total Discrepancy"
          value={formatCurrency(totalDiscrepancy)}
          icon={<TrendingDown className="w-5 h-5" />}
        />
        <StatCard
          label="Active Claims"
          value={claims.filter((c) => !["SETTLED", "DENIED"].includes(c.status)).length}
          icon={<Shield className="w-5 h-5" />}
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Claims List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search by claim number, property, or carrier..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
            />
          </div>

          {/* Claims Cards */}
          <div className="space-y-3">
            {filteredClaims.map((claim) => (
              <Card
                key={claim.id}
                variant="default"
                padding="md"
                className="hover:border-slate-600/50 transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-mono font-medium text-brand-300">
                        {claim.claimNumber}
                      </span>
                      <Badge variant={getStatusVariant(claim.status)} dot size="sm">
                        {formatStatus(claim.status)}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-300">{claim.property}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {claim.carrier} &middot; Filed {formatDate(claim.filedDate)} &middot; {claim.daysOpen} days open
                    </p>
                  </div>
                  <Link href={`/insurance/${claim.id}`}>
                    <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-3 border-t border-slate-700/20">
                  <div>
                    <p className="text-xs text-slate-500">Claimed</p>
                    <p className="text-sm font-semibold text-white">
                      {formatCurrency(claim.claimedAmount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Approved</p>
                    <p className="text-sm font-semibold text-emerald-400">
                      {claim.approvedAmount ? formatCurrency(claim.approvedAmount) : "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Discrepancy</p>
                    <p className={cn(
                      "text-sm font-semibold",
                      claim.discrepancy ? "text-red-400" : "text-slate-500"
                    )}>
                      {claim.discrepancy ? formatCurrency(claim.discrepancy) : "—"}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Right Panel — Scope Comparison */}
        <div className="space-y-6">
          {/* Scope Comparison Spotlight */}
          <Card variant="elevated" padding="md">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <CardTitle className="text-base">Scope Discrepancy</CardTitle>
              </div>
              <CardDescription>450 Commerce Blvd</CardDescription>
            </CardHeader>
            <p className="text-xs text-slate-400 mb-4">
              Line-by-line comparison between forensic scope and carrier assessment.
              Highlighted items indicate significant underpayment.
            </p>
            <div className="space-y-2">
              {scopeComparison.map((item, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "p-2.5 rounded-lg text-xs",
                    Math.abs(item.variance) > 5000
                      ? "bg-red-500/10 border border-red-500/20"
                      : "bg-slate-800/30 border border-slate-700/20"
                  )}
                >
                  <p className="text-slate-300 font-medium mb-1">{item.item}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-4">
                      <span className="text-slate-400">
                        Forensic: <span className="text-white">{formatCurrency(item.forensic)}</span>
                      </span>
                      <span className="text-slate-400">
                        Carrier: <span className="text-white">{formatCurrency(item.carrier)}</span>
                      </span>
                    </div>
                    <span
                      className={cn(
                        "font-semibold",
                        item.variance < -5000
                          ? "text-red-400"
                          : item.variance < 0
                          ? "text-amber-400"
                          : "text-emerald-400"
                      )}
                    >
                      {item.variance === 0 ? "Match" : formatCurrency(item.variance)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-slate-700/30 flex items-center justify-between">
              <span className="text-sm text-slate-400">Total Discrepancy</span>
              <span className="text-base font-bold text-red-400">
                {formatCurrency(scopeComparison.reduce((s, i) => s + i.variance, 0))}
              </span>
            </div>
            <Button variant="outline" size="sm" className="w-full mt-3">
              Prepare Supplemental Claim
            </Button>
          </Card>

          {/* Carrier Performance */}
          <Card variant="default" padding="md">
            <CardHeader>
              <CardTitle className="text-base">Carrier Response Times</CardTitle>
            </CardHeader>
            <div className="space-y-3">
              {[
                { carrier: "Travelers", avg: 8, status: "good" },
                { carrier: "State Farm", avg: 18, status: "slow" },
                { carrier: "Liberty Mutual", avg: 12, status: "normal" },
                { carrier: "Aetna", avg: 5, status: "good" },
              ].map((item) => (
                <div key={item.carrier} className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">{item.carrier}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white">{item.avg} days</span>
                    <div
                      className={cn(
                        "w-2 h-2 rounded-full",
                        item.status === "good" && "bg-emerald-500",
                        item.status === "normal" && "bg-amber-500",
                        item.status === "slow" && "bg-red-500"
                      )}
                    />
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
