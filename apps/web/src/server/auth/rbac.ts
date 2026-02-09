import type { Role } from "@prisma/client";

export type ModuleKey =
  | "intelligence"
  | "forensic"
  | "insurance"
  | "execution"
  | "outcome";

/**
 * RBAC policy (phase 1).
 *
 * WHY a simple allowlist:
 * - Easy to audit and reason about.
 * - Separates "module access" from "record-level access" (which will come next).
 */
export const MODULE_ACCESS: Record<ModuleKey, Role[]> = {
  intelligence: ["OWNER", "CONTRACTOR", "ADJUSTER", "INTERNAL"],
  forensic: ["OWNER", "CONTRACTOR", "ADJUSTER", "INTERNAL"],
  insurance: ["OWNER", "ADJUSTER", "INTERNAL"],
  execution: ["CONTRACTOR", "INTERNAL"],
  outcome: ["OWNER", "INTERNAL"],
};

export function canAccessModule(role: Role, module: ModuleKey): boolean {
  return MODULE_ACCESS[module].includes(role);
}

