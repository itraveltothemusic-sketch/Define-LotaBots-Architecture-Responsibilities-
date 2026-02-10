import { format } from "date-fns";
import { redirect } from "next/navigation";

import { AtosPanel } from "@/components/atos/atos-panel";
import { Badge } from "@/components/ui/badge";
import { Card, CardTitle } from "@/components/ui/card";
import { canAccessModule } from "@/lib/auth/permissions";
import { getSession } from "@/lib/auth/session";
import { generateAtosGuidance } from "@/lib/atos";
import { getRoleScopedSnapshot } from "@/server/repositories/platform-repository";

function classificationTone(status: "verified" | "pending" | "flagged") {
  if (status === "verified") return "success" as const;
  if (status === "pending") return "warning" as const;
  return "danger" as const;
}

export default async function ForensicPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  if (!canAccessModule(session.role, "forensic")) {
    redirect("/not-authorized");
  }

  const snapshot = await getRoleScopedSnapshot(session.role);
  const atosGuidance = generateAtosGuidance("forensic", snapshot);

  const ingestionByType = snapshot.evidenceTimeline.reduce<Record<string, number>>((acc, item) => {
    acc[item.evidenceType] = (acc[item.evidenceType] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <section>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Forensic Property Module</p>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">
          Property profiles, inspections, ingestion, and classification
        </h1>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.45fr_0.95fr]">
        <div className="space-y-4">
          <Card>
            <CardTitle title="Property Profile" subtitle="Canonical operating record for this commercial asset." />
            <div className="grid gap-3 text-sm sm:grid-cols-2">
              <p>
                <span className="font-semibold text-slate-900 dark:text-white">Display name:</span>{" "}
                {snapshot.property.displayName}
              </p>
              <p>
                <span className="font-semibold text-slate-900 dark:text-white">Ownership entity:</span>{" "}
                {snapshot.property.ownershipEntity}
              </p>
              <p>
                <span className="font-semibold text-slate-900 dark:text-white">Date of loss:</span>{" "}
                {format(new Date(snapshot.property.dateOfLoss), "MMM d, yyyy")}
              </p>
              <p>
                <span className="font-semibold text-slate-900 dark:text-white">Current phase:</span>{" "}
                {snapshot.property.currentPhase}
              </p>
            </div>
          </Card>

          <Card>
            <CardTitle
              title="Inspection Records"
              subtitle="Multi-discipline findings with confidence scoring and timestamped provenance."
            />
            <div className="space-y-3">
              {snapshot.inspections.map((inspection) => (
                <article
                  key={inspection.id}
                  className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-semibold text-slate-900 dark:text-white">{inspection.inspector}</p>
                    <Badge
                      label={`confidence ${inspection.confidenceScore}%`}
                      variant={inspection.confidenceScore >= 90 ? "success" : "info"}
                    />
                  </div>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {format(new Date(inspection.inspectedAt), "MMM d, yyyy h:mm a")}
                  </p>
                  <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{inspection.findingsSummary}</p>
                  <p className="mt-2 text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Disciplines: {inspection.disciplines.join(", ")}
                  </p>
                </article>
              ))}
            </div>
          </Card>

          <Card>
            <CardTitle
              title="Ingestion Throughput"
              subtitle="Photo/video/document evidence intake organized by artifact type."
            />
            <div className="grid gap-3 sm:grid-cols-2">
              {Object.entries(ingestionByType).map(([type, count]) => (
                <div
                  key={type}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm dark:border-slate-800 dark:bg-slate-900"
                >
                  <p className="font-semibold capitalize text-slate-900 dark:text-white">{type}</p>
                  <p className="text-slate-600 dark:text-slate-400">{count} ingested item(s)</p>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <CardTitle
              title="Damage Classification Matrix"
              subtitle="Severity, affected area, and verification posture by damage category."
            />
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] text-left text-sm">
                <thead className="text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="pb-2">Category</th>
                    <th className="pb-2">Severity</th>
                    <th className="pb-2">Affected Area</th>
                    <th className="pb-2">Evidence</th>
                    <th className="pb-2">Verification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {snapshot.damageClassifications.map((classification) => (
                    <tr key={classification.category}>
                      <td className="py-2 font-medium text-slate-900 dark:text-white">
                        {classification.category}
                      </td>
                      <td className="py-2 capitalize">{classification.severity}</td>
                      <td className="py-2">{classification.affectedAreaSqFt.toLocaleString()} sq ft</td>
                      <td className="py-2">{classification.evidenceCount}</td>
                      <td className="py-2">
                        <Badge
                          label={classification.verificationStatus}
                          variant={classificationTone(classification.verificationStatus)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        <AtosPanel guidance={atosGuidance} />
      </section>
    </div>
  );
}
