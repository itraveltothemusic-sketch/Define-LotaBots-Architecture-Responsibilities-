import { notFound } from "next/navigation";
import Link from "next/link";
import { getPropertyCase } from "@/server/demo/property-cases";
import { generateAtosGuidance } from "@/server/atos/engine";
import { PropertyOverviewCard } from "@/components/intelligence/PropertyOverviewCard";
import { EvidenceTimeline } from "@/components/intelligence/EvidenceTimeline";
import { AtosPanel } from "@/components/atos/AtosPanel";

export default async function PropertyIntelligencePage(props: {
  params: Promise<{ propertyId: string }>;
}) {
  const { propertyId } = await props.params;
  const caseData = getPropertyCase(propertyId);
  if (!caseData) notFound();

  const initialGuidance = generateAtosGuidance({ caseData });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/app/intelligence"
          className="text-sm font-semibold text-emerald-300 hover:text-emerald-200"
        >
          ← Back to Intelligence Center
        </Link>
        <div className="rounded-2xl bg-white/5 px-3 py-2 text-xs font-semibold text-zinc-200 ring-1 ring-white/10">
          Property intelligence file
        </div>
      </div>

      <PropertyOverviewCard caseData={caseData} />

      <div className="grid gap-6 lg:grid-cols-2">
        <EvidenceTimeline items={caseData.evidence} />
        <AtosPanel propertyId={caseData.id} initialGuidance={initialGuidance} />
      </div>
    </div>
  );
}

