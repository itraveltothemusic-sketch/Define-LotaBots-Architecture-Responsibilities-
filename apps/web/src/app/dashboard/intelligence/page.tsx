import { requireUser } from "@/server/auth/require-user";
import { getIntelligenceSnapshot } from "@/modules/intelligence-center/data";
import { PropertyOverviewCard } from "@/modules/intelligence-center/components/property-overview-card";
import { EvidenceTimelineCard } from "@/modules/intelligence-center/components/evidence-timeline-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function IntelligenceCenterPage() {
  const session = await requireUser();
  const snapshot = await getIntelligenceSnapshot({
    userId: session.user.id,
    role: session.user.role,
  });

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Intelligence Center</CardTitle>
          <CardDescription>
            Centralized view of property health, evidence completeness, risks, and guided next actions.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-zinc-600 dark:text-zinc-400">
          This page is designed to be auditable: ATOS guidance is always grounded in the case file’s current data.
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <PropertyOverviewCard
          mode={snapshot.mode}
          property={snapshot.property}
          evidenceCount={snapshot.evidence.length}
        />
        <EvidenceTimelineCard evidence={snapshot.evidence} />
      </div>
    </div>
  );
}

