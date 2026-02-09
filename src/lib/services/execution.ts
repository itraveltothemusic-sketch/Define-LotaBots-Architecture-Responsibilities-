import { buildAtosBrief } from "@/lib/atos/engine";
import {
  contractors,
  executionMilestones,
  properties,
  propertyNameById,
} from "@/lib/data/mock-data";

const contractorById = Object.fromEntries(
  contractors.map((contractor) => [contractor.id, contractor]),
) as Record<string, (typeof contractors)[number]>;

export async function getExecutionSnapshot() {
  return {
    contractors,
    milestones: [...executionMilestones].sort((a, b) =>
      a.dueAt.localeCompare(b.dueAt),
    ),
    properties,
    propertyNameById,
    contractorById,
    atosBrief: buildAtosBrief({
      module: "execution",
      contractors,
      milestones: executionMilestones,
      properties,
    }),
  };
}
