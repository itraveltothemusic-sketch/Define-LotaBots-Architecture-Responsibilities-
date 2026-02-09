import Link from "next/link";

import type { ModuleKey } from "@/types/domain";

const labels: Record<ModuleKey, string> = {
  intelligence: "Intelligence Center",
  "forensic-property": "Forensic Property",
  "insurance-intelligence": "Insurance Intelligence",
  "contractor-execution": "Contractor Execution",
  "equity-outcome": "Equity Outcome",
};

export function ModuleAccessDenied({ module }: { module: ModuleKey }) {
  return (
    <section className="rounded-2xl border border-amber-300 bg-amber-50 p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-amber-900">Access restricted</h2>
      <p className="mt-2 text-sm text-amber-800">
        Your role does not currently permit access to {labels[module]}. This control
        exists to preserve data governance and insurer-grade audit boundaries.
      </p>
      <Link
        href="/dashboard/intelligence"
        className="mt-4 inline-flex rounded-lg bg-amber-700 px-4 py-2 text-sm font-semibold text-white"
      >
        Return to Intelligence Center
      </Link>
    </section>
  );
}
