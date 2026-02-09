import { buildAtosBrief } from "@/lib/atos/engine";
import {
  claims,
  equityOutcomes,
  properties,
  propertyNameById,
} from "@/lib/data/mock-data";

export async function getEquitySnapshot() {
  const aggregateBaseline = equityOutcomes.reduce(
    (sum, outcome) => sum + outcome.baselineValue,
    0,
  );
  const aggregateRecovered = equityOutcomes.reduce(
    (sum, outcome) => sum + outcome.postRecoveryValue,
    0,
  );

  return {
    outcomes: equityOutcomes,
    properties,
    claims,
    propertyNameById,
    aggregateBaseline,
    aggregateRecovered,
    atosBrief: buildAtosBrief({
      module: "equity",
      outcomes: equityOutcomes,
      claims,
      properties,
    }),
  };
}
