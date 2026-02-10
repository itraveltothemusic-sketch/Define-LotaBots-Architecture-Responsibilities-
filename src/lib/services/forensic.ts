import { buildAtosBrief } from "@/lib/atos/engine";
import {
  evidenceTimeline,
  inspections,
  properties,
  propertyNameById,
} from "@/lib/data/mock-data";

export async function getForensicSnapshot() {
  const damageClassDistribution = inspections.reduce<Record<string, number>>(
    (distribution, inspection) => {
      inspection.damageClasses.forEach((damageClass) => {
        distribution[damageClass] = (distribution[damageClass] ?? 0) + 1;
      });
      return distribution;
    },
    {},
  );

  return {
    properties,
    inspections,
    evidenceTimeline: [...evidenceTimeline].sort((a, b) =>
      b.occurredAt.localeCompare(a.occurredAt),
    ),
    damageClassDistribution,
    propertyNameById,
    atosBrief: buildAtosBrief({
      module: "forensic",
      properties,
      inspections,
      evidence: evidenceTimeline,
    }),
  };
}
