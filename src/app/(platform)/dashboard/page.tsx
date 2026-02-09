import { AtosPanel } from "@/components/atos/atos-panel";
import { EvidenceTimeline } from "@/components/dashboard/evidence-timeline";
import { ModuleHeader } from "@/components/dashboard/module-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { Card } from "@/components/ui/card";
import { getIntelligenceSnapshot } from "@/lib/services/intelligence";
import { formatDate, formatPercent } from "@/lib/utils/format";

const statusClass = {
  scheduled: "bg-slate-100 text-slate-700",
  in_progress: "bg-sky-100 text-sky-700",
  completed: "bg-emerald-100 text-emerald-700",
  needs_reinspection: "bg-rose-100 text-rose-700",
} as const;

export default async function IntelligenceDashboardPage() {
  const snapshot = await getIntelligenceSnapshot();

  return (
    <div className="space-y-6">
      <ModuleHeader
        eyebrow="Intelligence Center"
        title="Forensic command center"
        description="A unified operating picture across evidence integrity, insurance posture, contractor velocity, and equity conversion signals."
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {snapshot.kpis.map((kpi) => (
          <StatCard
            key={kpi.label}
            label={kpi.label}
            value={kpi.value}
            trend={kpi.trend}
          />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr,0.8fr]">
        <Card
          title="Property overview"
          subtitle="Inspection status, evidence coverage, and confidence posture"
        >
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="py-2 pr-4">Property</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2 pr-4">Last inspection</th>
                  <th className="py-2 pr-4">Evidence</th>
                  <th className="py-2">Confidence</th>
                </tr>
              </thead>
              <tbody>
                {snapshot.properties.map((property) => (
                  <tr key={property.id} className="border-t border-slate-200">
                    <td className="py-3 pr-4">
                      <p className="font-medium text-slate-900">{property.name}</p>
                      <p className="text-xs text-slate-500">{property.address}</p>
                    </td>
                    <td className="py-3 pr-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusClass[property.inspectionStatus]}`}
                      >
                        {property.inspectionStatus.replaceAll("_", " ")}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-slate-700">
                      {formatDate(property.lastInspectionAt)}
                    </td>
                    <td className="py-3 pr-4 text-slate-700">
                      {property.evidenceCoverage.photos}p /{" "}
                      {property.evidenceCoverage.videos}v /{" "}
                      {property.evidenceCoverage.documents}d
                    </td>
                    <td className="py-3 text-slate-700">
                      {formatPercent(property.confidenceScore)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card
          title="Evidence & documentation timeline"
          subtitle="Recent forensic signals entering verification flow"
        >
          <EvidenceTimeline items={snapshot.evidenceTimeline} />
        </Card>
      </section>

      <AtosPanel brief={snapshot.atosBrief} />
    </div>
  );
}
