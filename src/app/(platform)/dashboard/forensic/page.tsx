import { AtosPanel } from "@/components/atos/atos-panel";
import { EvidenceTimeline } from "@/components/dashboard/evidence-timeline";
import { ModuleHeader } from "@/components/dashboard/module-header";
import { Card } from "@/components/ui/card";
import { getForensicSnapshot } from "@/lib/services/forensic";
import { formatDate, formatPercent } from "@/lib/utils/format";

const severityClass = {
  low: "bg-slate-100 text-slate-700",
  medium: "bg-amber-100 text-amber-700",
  high: "bg-orange-100 text-orange-700",
  critical: "bg-rose-100 text-rose-700",
} as const;

export default async function ForensicModulePage() {
  const snapshot = await getForensicSnapshot();

  return (
    <div className="space-y-6">
      <ModuleHeader
        eyebrow="Module 1"
        title="Forensic Property Module"
        description="Operational system of record for property profiles, inspection evidence, and damage classification controls."
      />

      <section className="grid gap-6 xl:grid-cols-[1.15fr,0.85fr]">
        <Card
          title="Property profiles"
          subtitle="Current forensic confidence and evidence ingestion depth"
        >
          <div className="space-y-3">
            {snapshot.properties.map((property) => (
              <article
                key={property.id}
                className="rounded-lg border border-slate-200 bg-slate-50 p-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-slate-900">
                    {property.name}
                  </p>
                  <p className="text-xs text-slate-600">
                    Confidence {formatPercent(property.confidenceScore)}
                  </p>
                </div>
                <p className="mt-1 text-xs text-slate-600">{property.address}</p>
                <p className="mt-2 text-xs text-slate-500">
                  Storm event: {property.stormEvent}
                </p>
              </article>
            ))}
          </div>
        </Card>

        <Card title="Damage classification density" subtitle="Across all inspections">
          <ul className="space-y-2">
            {Object.entries(snapshot.damageClassDistribution).map(
              ([damageClass, count]) => (
                <li
                  key={damageClass}
                  className="flex items-center justify-between rounded-md border border-slate-200 px-3 py-2"
                >
                  <span className="text-sm font-medium capitalize text-slate-800">
                    {damageClass}
                  </span>
                  <span className="text-sm text-slate-600">{count} records</span>
                </li>
              ),
            )}
          </ul>
        </Card>
      </section>

      <Card
        title="Inspection records"
        subtitle="Severity-tagged findings and observed damage signatures"
      >
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="py-2 pr-4">Property</th>
                <th className="py-2 pr-4">Inspector</th>
                <th className="py-2 pr-4">Inspected</th>
                <th className="py-2 pr-4">Damage classes</th>
                <th className="py-2 pr-4">Severity</th>
                <th className="py-2">Summary</th>
              </tr>
            </thead>
            <tbody>
              {snapshot.inspections.map((inspection) => (
                <tr key={inspection.id} className="border-t border-slate-200">
                  <td className="py-3 pr-4 font-medium text-slate-900">
                    {snapshot.propertyNameById[inspection.propertyId]}
                  </td>
                  <td className="py-3 pr-4 text-slate-700">{inspection.inspector}</td>
                  <td className="py-3 pr-4 text-slate-700">
                    {formatDate(inspection.inspectedAt)}
                  </td>
                  <td className="py-3 pr-4 text-slate-700">
                    {inspection.damageClasses.join(", ")}
                  </td>
                  <td className="py-3 pr-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${severityClass[inspection.severity]}`}
                    >
                      {inspection.severity}
                    </span>
                  </td>
                  <td className="py-3 text-slate-700">
                    {inspection.findingsSummary}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card
        title="Evidence ingestion queue"
        subtitle="Photo, video, and document flow pending verification"
      >
        <EvidenceTimeline
          items={snapshot.evidenceTimeline}
          propertyNameById={snapshot.propertyNameById}
        />
      </Card>

      <AtosPanel brief={snapshot.atosBrief} />
    </div>
  );
}
