import { AtosAssistantPanel } from "@/components/atos/assistant-panel";
import { Badge } from "@/components/ui/badge";
import { Card, CardTitle } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import type { AtosAnalysis } from "@/lib/atos/engine";
import type { ForensicPropertyData } from "@/lib/data/repository";
import { formatCurrency, formatDate, formatPercent } from "@/lib/utils";

interface ForensicPropertyModuleProps {
  data: ForensicPropertyData;
  atos: AtosAnalysis;
}

function verificationTone(status: string) {
  if (status === "VERIFIED") return "success";
  if (status === "FLAGGED") return "critical";
  return "warning";
}

function severityTone(level: string) {
  if (level === "CRITICAL") return "critical";
  if (level === "HIGH") return "high";
  if (level === "MODERATE") return "medium";
  return "low";
}

export function ForensicPropertyModule({ data, atos }: ForensicPropertyModuleProps) {
  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Module 02"
        title="Forensic Property Module"
        description="Profiles every storm-impacted property, structures inspection records, and maintains an evidence chain that can survive carrier and legal scrutiny."
      />

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <Card>
            <CardTitle title="Property Profiles" subtitle="Asset-level condition and valuation context." />
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="text-xs uppercase tracking-wide text-slate-400">
                  <tr>
                    <th className="pb-2 pr-4">Property</th>
                    <th className="pb-2 pr-4">Status</th>
                    <th className="pb-2 pr-4">Occupancy</th>
                    <th className="pb-2 pr-4">Current valuation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {data.properties.map((property) => (
                    <tr key={property.id}>
                      <td className="py-3 pr-4">
                        <p className="font-medium text-white">{property.label}</p>
                        <p className="text-xs text-slate-400">
                          {property.city}, {property.state}
                        </p>
                      </td>
                      <td className="py-3 pr-4">
                        <Badge tone="neutral">{property.status}</Badge>
                      </td>
                      <td className="py-3 pr-4 text-slate-200">
                        {formatPercent(property.occupancyRate)}
                      </td>
                      <td className="py-3 pr-4 text-slate-200">
                        {formatCurrency(property.currentValuationUsd)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card>
            <CardTitle
              title="Inspection Records"
              subtitle="Peer-review status and estimated loss posture across all assets."
            />
            <ul className="space-y-3">
              {data.inspections.map((inspection) => (
                <li
                  key={inspection.id}
                  className="rounded-xl border border-slate-800 bg-slate-950/70 p-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm font-medium text-white">{inspection.summary}</p>
                    <Badge tone={severityTone(inspection.severity)}>{inspection.severity}</Badge>
                  </div>
                  <p className="mt-1 text-xs text-slate-400">
                    {formatDate(inspection.inspectionDate)} · {inspection.inspector}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-300">
                    <span>Estimated loss: {formatCurrency(inspection.estimatedLossUsd)}</span>
                    <span>•</span>
                    <span>
                      Peer review: {inspection.isPeerReviewed ? "Complete" : "Pending"}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <CardTitle
              title="Media & Document Ingestion Queue"
              subtitle="Photo, video, and document records awaiting forensic verification."
            />
            <div className="space-y-3">
              {data.evidenceQueue.map((evidence) => (
                <div
                  key={evidence.id}
                  className="rounded-xl border border-slate-800 bg-slate-950/70 p-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-white">{evidence.title}</p>
                    <Badge tone={verificationTone(evidence.verificationStatus)}>
                      {evidence.verificationStatus}
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-slate-400">
                    {evidence.kind} · {formatDate(evidence.capturedAt)} · {evidence.capturedBy}
                  </p>
                  <p className="mt-2 text-sm text-slate-300">{evidence.note}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    Chain of custody: {evidence.chainOfCustodyRef}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardTitle
              title="Damage Classification"
              subtitle="Aggregated impact by damage class for scope prioritization."
            />
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="text-xs uppercase tracking-wide text-slate-400">
                  <tr>
                    <th className="pb-2 pr-3">Category</th>
                    <th className="pb-2 pr-3">Incidents</th>
                    <th className="pb-2 pr-3">Estimated loss</th>
                    <th className="pb-2">Peak severity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {data.damageClassification.map((item) => (
                    <tr key={item.category}>
                      <td className="py-2 pr-3 text-slate-100">{item.category}</td>
                      <td className="py-2 pr-3 text-slate-300">{item.incidentCount}</td>
                      <td className="py-2 pr-3 text-slate-300">
                        {formatCurrency(item.totalEstimatedLossUsd)}
                      </td>
                      <td className="py-2">
                        <Badge tone={severityTone(item.maxSeverity)}>{item.maxSeverity}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <AtosAssistantPanel
            module="forensic-property"
            summary={atos.summary}
            guidance={atos.guidance}
          />
        </div>
      </section>
    </div>
  );
}
