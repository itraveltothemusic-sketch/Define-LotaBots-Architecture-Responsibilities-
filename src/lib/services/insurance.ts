import { buildAtosBrief } from "@/lib/atos/engine";
import {
  carrierInteractions,
  claimById,
  claims,
  properties,
  propertyNameById,
  scopeDiscrepancies,
} from "@/lib/data/mock-data";

export async function getInsuranceSnapshot() {
  const claimDiscrepancyById = scopeDiscrepancies.reduce<
    Record<string, { valueGap: number; discrepancyCount: number }>
  >((accumulator, discrepancy) => {
    const current = accumulator[discrepancy.claimId] ?? {
      valueGap: 0,
      discrepancyCount: 0,
    };

    current.valueGap += discrepancy.forensicValue - discrepancy.carrierValue;
    current.discrepancyCount += 1;
    accumulator[discrepancy.claimId] = current;
    return accumulator;
  }, {});

  return {
    claims,
    properties,
    scopeDiscrepancies,
    carrierInteractions: [...carrierInteractions].sort((a, b) =>
      b.occurredAt.localeCompare(a.occurredAt),
    ),
    propertyNameById,
    claimById,
    claimDiscrepancyById,
    atosBrief: buildAtosBrief({
      module: "insurance",
      claims,
      discrepancies: scopeDiscrepancies,
      properties,
    }),
  };
}
