"use client";

/**
 * Contractor Detail — placeholder for individual contractor profiles.
 * Routes here from contractor cards; shows full history, 
 * assignment records, and compliance documentation.
 */

import { use } from "react";
import Link from "next/link";
import { Topbar } from "@/components/layout/topbar";
import { contractors } from "@/lib/mock-data";
import { HardHat, ArrowLeft } from "lucide-react";

export default function ContractorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const contractor = contractors.find((c) => c.id === id);

  if (!contractor) {
    return (
      <div>
        <Topbar title="Contractor Not Found" />
        <div className="p-6 text-center py-20">
          <HardHat className="w-12 h-12 text-navy-600 mx-auto mb-4" />
          <p className="text-navy-400 text-lg">Contractor not found</p>
          <Link href="/contractors" className="text-brand-400 hover:text-brand-300 text-sm mt-2 inline-block">
            Back to Contractors
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Topbar
        title={contractor.name}
        subtitle={contractor.company}
      />
      <div className="p-6">
        <Link
          href="/contractors"
          className="inline-flex items-center gap-1.5 text-sm text-navy-400 hover:text-brand-400 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Contractors
        </Link>

        <div className="text-center py-20">
          <HardHat className="w-16 h-16 text-navy-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">{contractor.name}</h2>
          <p className="text-navy-400">{contractor.company}</p>
          <p className="text-sm text-navy-500 mt-4 max-w-md mx-auto">
            Full contractor profile with assignment history, compliance records,
            and performance analytics will be displayed here.
          </p>
        </div>
      </div>
    </div>
  );
}
