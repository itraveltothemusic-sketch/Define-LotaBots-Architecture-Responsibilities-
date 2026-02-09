import { AssistantPanel } from "@/components/atos/assistant-panel";
import { GuidanceList } from "@/components/atos/guidance-list";
import { StatusBadge } from "@/components/ui/status-badge";
import { ModuleAccessDenied } from "@/components/ui/module-access-denied";
import { getModuleAccess } from "@/lib/auth/module-guard";
import {
  listDamageClassifications,
  listEvidence,
  listInspectionRecords,
  listPropertyProfiles,
} from "@/lib/db/repositories";
import { generateModuleGuidance } from "@/lib/intelligence/atos";
import { formatCurrency, formatDate, formatPercent } from "@/lib/utils/format";

function severityTone(severity: "low" | "medium" | "high" | "critical") {
  switch (severity) {
    case "low":
      return "info";
    case "medium":
      return "warning";
    case "high":
      return "danger";
    case "critical":
      return "critical";
  }
}

export default async function ForensicPropertyPage() {
  const [{ allowed }, properties, inspections, evidence, damage, guidance] =
    await Promise.all([
      getModuleAccess("forensic-property"),
      listPropertyProfiles(),
      listInspectionRecords(),
      listEvidence(),
      listDamageClassifications(),
      generateModuleGuidance("forensic-property"),
    ]);

  if (!allowed) {
    return <ModuleAccessDenied module="forensic-property" />;
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Forensic Property Module</h2>
        <p className="mt-1 text-sm text-slate-600">
          Property profiles, inspection evidence ingestion, and defensible damage
          classification.
        </p>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <GuidanceList guidance={guidance} />
        <AssistantPanel module="forensic-property" />
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-base font-semibold text-slate-900">Property Profiles</h3>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="pb-2 pr-4">Property</th>
                <th className="pb-2 pr-4">Asset Type</th>
                <th className="pb-2 pr-4">Occupancy</th>
                <th className="pb-2 pr-4">Insured Value</th>
                <th className="pb-2">Forensic Confidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {properties.map((property) => (
                <tr key={property.id}>
                  <td className="py-3 pr-4">
                    <p className="font-medium text-slate-900">{property.name}</p>
                    <p className="text-xs text-slate-500">{property.address}</p>
                  </td>
                  <td className="py-3 pr-4">{property.assetType}</td>
                  <td className="py-3 pr-4">{formatPercent(property.occupancyRate)}</td>
                  <td className="py-3 pr-4">{formatCurrency(property.insuredValueUsd)}</td>
                  <td className="py-3">
                    {(property.forensicConfidenceScore * 100).toFixed(0)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900">Inspection Records</h3>
          <ul className="mt-4 space-y-3">
            {inspections.map((inspection) => (
              <li
                key={inspection.id}
                className="rounded-xl border border-slate-200 bg-slate-50 p-4"
              >
                <p className="text-sm font-semibold text-slate-900">{inspection.inspector}</p>
                <p className="text-xs text-slate-600">
                  {formatDate(inspection.inspectionDate)} • {inspection.weatherEvent}
                </p>
                <p className="mt-2 text-xs text-slate-700">
                  Roof {formatPercent(inspection.roofDamagePct)} | Envelope{" "}
                  {formatPercent(inspection.envelopeDamagePct)} | Interior{" "}
                  {formatPercent(inspection.interiorDamagePct)}
                </p>
                <p className="mt-2 text-xs text-slate-700">{inspection.recommendedAction}</p>
                <div className="mt-2">
                  <StatusBadge
                    label={
                      inspection.chainOfCustodyVerified
                        ? "Chain-of-custody verified"
                        : "Custody review required"
                    }
                    tone={inspection.chainOfCustodyVerified ? "success" : "warning"}
                  />
                </div>
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900">
            Damage Classification & Ingestion
          </h3>
          <ul className="mt-4 space-y-3">
            {damage.map((entry) => (
              <li key={entry.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-slate-900">{entry.component}</p>
                  <StatusBadge
                    label={entry.severity.toUpperCase()}
                    tone={severityTone(entry.severity)}
                  />
                </div>
                <p className="mt-2 text-xs text-slate-700">{entry.rationale}</p>
                <p className="mt-2 text-xs text-slate-600">
                  Est. Repair {formatCurrency(entry.estimatedRepairUsd)} • Confidence{" "}
                  {(entry.confidenceScore * 100).toFixed(0)}%
                </p>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-slate-500">
            Incoming media queue: {evidence.length} package(s) indexed with cryptographic
            integrity fingerprints.
          </p>
        </article>
      </section>
    </div>
  );
}
