"use client";

/**
 * Equity Detail — Individual property equity analysis.
 * Shows detailed before/after valuation with full documentation.
 */

import { use } from "react";
import Link from "next/link";
import { Topbar } from "@/components/layout/topbar";
import { equityOutcomes, properties } from "@/lib/mock-data";
import { TrendingUp, ArrowLeft } from "lucide-react";

export default function EquityDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const outcome = equityOutcomes.find((e) => e.id === id);

  if (!outcome) {
    return (
      <div>
        <Topbar title="Equity Outcome Not Found" />
        <div className="p-6 text-center py-20">
          <TrendingUp className="w-12 h-12 text-navy-600 mx-auto mb-4" />
          <p className="text-navy-400 text-lg">Equity outcome not found</p>
          <Link href="/equity" className="text-brand-400 hover:text-brand-300 text-sm mt-2 inline-block">
            Back to Equity
          </Link>
        </div>
      </div>
    );
  }

  const property = properties.find((p) => p.id === outcome.propertyId);

  return (
    <div>
      <Topbar
        title={`Equity Outcome — ${property?.name ?? "Property"}`}
        subtitle="Detailed valuation analysis and verified equity gain"
      />
      <div className="p-6">
        <Link
          href="/equity"
          className="inline-flex items-center gap-1.5 text-sm text-navy-400 hover:text-brand-400 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Equity
        </Link>

        <div className="text-center py-20">
          <TrendingUp className="w-16 h-16 text-forensic-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">
            Detailed Equity Analysis
          </h2>
          <p className="text-sm text-navy-500 mt-4 max-w-md mx-auto">
            Full equity breakdown with supporting documentation, appraiser
            reports, and stakeholder-ready presentation will be displayed here.
          </p>
        </div>
      </div>
    </div>
  );
}
