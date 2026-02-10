import "server-only";

import type { UserRole } from "@/lib/auth/types";
import { intelligenceSnapshot } from "@/server/data/mock-platform-data";
import type { IntelligenceSnapshot } from "@/types/domain";

function cloneSnapshot(): IntelligenceSnapshot {
  return structuredClone(intelligenceSnapshot);
}

export async function getIntelligenceSnapshot(): Promise<IntelligenceSnapshot> {
  return cloneSnapshot();
}

export async function getRoleScopedSnapshot(role: UserRole): Promise<IntelligenceSnapshot> {
  const snapshot = cloneSnapshot();

  // Role scoping is handled in the repository boundary so downstream views cannot
  // accidentally expose data that should be restricted for a persona.
  if (role === "CONTRACTOR") {
    snapshot.carrierInteractions = [];
    snapshot.scopeDiscrepancies = snapshot.scopeDiscrepancies.map((item) => ({
      ...item,
      rationale: "Visible after insured approval package release.",
    }));
  }

  if (role === "ADJUSTER") {
    snapshot.contractors = snapshot.contractors.map((item) => ({
      ...item,
      backgroundCheck: "pending",
    }));
  }

  return snapshot;
}
