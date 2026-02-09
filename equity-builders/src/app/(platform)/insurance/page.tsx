"use client";

/**
 * Insurance Intelligence Module — Claim Lifecycle & Carrier Intelligence
 * 
 * Central hub for all insurance claim management:
 * - Claim lifecycle tracking with status pipeline
 * - Carrier interaction logs
 * - Scope comparison and discrepancy detection
 * - ATOS-powered risk analysis
 */

import { useState } from "react";
import Link from "next/link";
import { Topbar } from "@/components/layout/topbar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { insuranceClaims, properties } from "@/lib/mock-data";
import { formatCurrency, formatStatus, cn } from "@/lib/utils";
import {
  Shield,
  DollarSign,
  AlertTriangle,
  Calendar,
  ChevronRight,
  Plus,
  Filter,
  Phone,
  Mail,
  User,
  Building2,
  Clock,
  TrendingUp,
  FileText,
} from "lucide-react";
import type { ClaimStatus } from "@/types";

const claimStatusPipeline: ClaimStatus[] = [
  "draft",
  "submitted",
  "under_review",
  "additional_info_requested",
  "approved",
  "partially_approved",
  "settled",
];

const statusBadgeVariant = (status: ClaimStatus) => {
  if (status === "settled" || status === "approved") return "success" as const;
  if (status === "denied") return "danger" as const;
  if (status === "under_review" || status === "submitted" || status === "additional_info_requested" || status === "appealed") return "warning" as const;
  if (status === "partially_approved") return "info" as const;
  return "neutral" as const;
};

export default function InsurancePage() {
  const [filter, setFilter] = useState<ClaimStatus | "all">("all");

  const filtered = filter === "all"
    ? insuranceClaims
    : insuranceClaims.filter((c) => c.status === filter);

  // Summary stats
  const totalClaimed = insuranceClaims.reduce((sum, c) => sum + c.claimedAmount, 0);
  const totalApproved = insuranceClaims.reduce((sum, c) => sum + (c.approvedAmount ?? 0), 0);
  const activeClaims = insuranceClaims.filter(
    (c) => !["settled", "denied"].includes(c.status)
  ).length;

  return (
    <div>
      <Topbar
        title="Insurance Intelligence"
        subtitle="Claim lifecycle tracking, carrier interactions, and scope analysis"
      />

      <div className="p-6 space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-brand-500/10 rounded-lg border border-brand-500/20">
                <FileText className="w-5 h-5 text-brand-400" />
              </div>
              <div>
                <p className="text-xs text-navy-400">Total Claims</p>
                <p className="text-xl font-bold text-white">{insuranceClaims.length}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-alert-500/10 rounded-lg border border-alert-500/20">
                <Clock className="w-5 h-5 text-alert-400" />
              </div>
              <div>
                <p className="text-xs text-navy-400">Active Claims</p>
                <p className="text-xl font-bold text-white">{activeClaims}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-navy-600/20 rounded-lg border border-navy-600/30">
                <DollarSign className="w-5 h-5 text-navy-300" />
              </div>
              <div>
                <p className="text-xs text-navy-400">Total Claimed</p>
                <p className="text-xl font-bold text-white">{formatCurrency(totalClaimed)}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-forensic-500/10 rounded-lg border border-forensic-500/20">
                <TrendingUp className="w-5 h-5 text-forensic-400" />
              </div>
              <div>
                <p className="text-xs text-navy-400">Total Approved</p>
                <p className="text-xl font-bold text-forensic-400">{formatCurrency(totalApproved)}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <Filter className="w-4 h-4 text-navy-500 flex-shrink-0" />
            {(["all", "submitted", "under_review", "approved", "settled", "denied"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap",
                  filter === s
                    ? "bg-brand-600/15 text-brand-300 border-brand-500/30"
                    : "bg-navy-800/40 text-navy-400 border-navy-700/40 hover:text-navy-200",
                )}
              >
                {s === "all" ? "All Claims" : formatStatus(s)}
              </button>
            ))}
          </div>
          <Button>
            <Plus className="w-4 h-4" />
            New Claim
          </Button>
        </div>

        {/* Claims List */}
        <div className="space-y-4">
          {filtered.map((claim) => {
            const property = properties.find((p) => p.id === claim.propertyId);
            const discrepancy = claim.approvedAmount !== undefined
              ? claim.claimedAmount - claim.approvedAmount
              : null;

            return (
              <Link key={claim.id} href={`/insurance/${claim.id}`}>
                <Card hover className="p-5">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    {/* Claim Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Shield className="w-5 h-5 text-brand-400" />
                        <span className="text-xs font-mono text-navy-400">{claim.claimNumber}</span>
                        <Badge variant={statusBadgeVariant(claim.status)} size="sm">
                          {formatStatus(claim.status)}
                        </Badge>
                      </div>
                      <h3 className="text-base font-semibold text-white">{claim.carrier}</h3>
                      {property && (
                        <div className="flex items-center gap-1.5 mt-1 text-xs text-navy-400">
                          <Building2 className="w-3.5 h-3.5" />
                          {property.name} — {property.city}, {property.state}
                        </div>
                      )}
                      {claim.notes && (
                        <p className="text-xs text-navy-300 mt-2 line-clamp-2 leading-relaxed">
                          {claim.notes}
                        </p>
                      )}
                    </div>

                    {/* Financial Summary */}
                    <div className="grid grid-cols-3 gap-4 lg:w-80 flex-shrink-0">
                      <div>
                        <p className="text-[11px] text-navy-500">Claimed</p>
                        <p className="text-sm font-semibold text-white">
                          {formatCurrency(claim.claimedAmount)}
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] text-navy-500">Approved</p>
                        <p className="text-sm font-semibold text-forensic-400">
                          {claim.approvedAmount !== undefined
                            ? formatCurrency(claim.approvedAmount)
                            : "Pending"}
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] text-navy-500">Deductible</p>
                        <p className="text-sm font-medium text-navy-300">
                          {formatCurrency(claim.deductible)}
                        </p>
                      </div>
                    </div>

                    {/* Adjuster + Alert */}
                    <div className="lg:w-48 flex-shrink-0">
                      {claim.adjusterName && claim.adjusterName !== "Pending Assignment" && (
                        <div className="flex items-center gap-2 text-xs text-navy-400 mb-1.5">
                          <User className="w-3.5 h-3.5" />
                          {claim.adjusterName}
                        </div>
                      )}
                      {discrepancy !== null && discrepancy > 0 && claim.status !== "settled" && (
                        <div className="flex items-center gap-1.5 text-xs text-alert-400">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          {formatCurrency(discrepancy)} gap
                        </div>
                      )}
                      {claim.nextActionDate && (
                        <div className="flex items-center gap-1.5 text-xs text-navy-400 mt-1">
                          <Calendar className="w-3.5 h-3.5" />
                          Next: {new Date(claim.nextActionDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>

                    <ChevronRight className="w-5 h-5 text-navy-600 flex-shrink-0 hidden lg:block" />
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <Shield className="w-10 h-10 text-navy-600 mx-auto mb-3" />
            <p className="text-navy-400">No claims match your filter</p>
          </div>
        )}
      </div>
    </div>
  );
}
