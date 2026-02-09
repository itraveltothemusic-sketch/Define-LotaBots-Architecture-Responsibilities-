"use client";

/**
 * Claim overview cards for the dashboard.
 * Shows active claims with key metrics and risk indicators.
 */

import Link from "next/link";
import {
  Shield,
  DollarSign,
  AlertTriangle,
  Calendar,
  ChevronRight,
} from "lucide-react";
import { cn, formatCurrency, formatStatus, timeAgo } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { insuranceClaims } from "@/lib/mock-data";
import type { InsuranceClaim } from "@/types";

function ClaimCard({ claim }: { claim: InsuranceClaim }) {
  const discrepancy = claim.claimedAmount - (claim.approvedAmount ?? 0);
  const hasDiscrepancy = claim.approvedAmount !== undefined && discrepancy > 0;

  const statusVariant =
    claim.status === "settled" || claim.status === "approved"
      ? "success"
      : claim.status === "denied"
      ? "danger"
      : claim.status === "under_review" || claim.status === "submitted"
      ? "warning"
      : "neutral";

  return (
    <Link href={`/insurance/${claim.id}`}>
      <Card hover className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-brand-400" />
            <span className="text-xs font-mono text-navy-400">{claim.claimNumber}</span>
          </div>
          <Badge variant={statusVariant} size="sm">
            {formatStatus(claim.status)}
          </Badge>
        </div>
        <h4 className="text-sm font-medium text-white mb-1">{claim.carrier}</h4>
        <div className="grid grid-cols-2 gap-3 mt-3">
          <div>
            <p className="text-[11px] text-navy-400">Claimed</p>
            <p className="text-sm font-semibold text-white">{formatCurrency(claim.claimedAmount)}</p>
          </div>
          {claim.approvedAmount !== undefined && (
            <div>
              <p className="text-[11px] text-navy-400">Approved</p>
              <p className="text-sm font-semibold text-forensic-400">
                {formatCurrency(claim.approvedAmount)}
              </p>
            </div>
          )}
        </div>
        {hasDiscrepancy && claim.status !== "settled" && (
          <div className="flex items-center gap-1.5 mt-3 text-xs text-alert-400">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{formatCurrency(discrepancy)} discrepancy under review</span>
          </div>
        )}
        {claim.nextActionDate && (
          <div className="flex items-center gap-1.5 mt-2 text-xs text-navy-400">
            <Calendar className="w-3.5 h-3.5" />
            <span>Next action: {new Date(claim.nextActionDate).toLocaleDateString()}</span>
          </div>
        )}
      </Card>
    </Link>
  );
}

export function ClaimOverview() {
  const activeClaims = insuranceClaims.filter(
    (c) => c.status !== "settled" && c.status !== "denied"
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-white">Active Claims</h3>
          <p className="text-xs text-navy-400 mt-0.5">
            {activeClaims.length} claims requiring attention
          </p>
        </div>
        <Link
          href="/insurance"
          className="text-xs text-brand-400 hover:text-brand-300 font-medium transition-colors"
        >
          View All Claims
        </Link>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {activeClaims.map((claim) => (
          <ClaimCard key={claim.id} claim={claim} />
        ))}
      </div>
    </div>
  );
}
