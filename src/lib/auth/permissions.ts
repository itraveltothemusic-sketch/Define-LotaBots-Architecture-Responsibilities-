import type { ModuleKey, UserRole } from "@/types/domain";

export interface ModuleDefinition {
  key: ModuleKey;
  label: string;
  href: string;
  description: string;
}

export const dashboardModules: ModuleDefinition[] = [
  {
    key: "intelligence",
    label: "Intelligence Center",
    href: "/dashboard/intelligence",
    description: "Portfolio command center with evidence and guidance.",
  },
  {
    key: "forensic-property",
    label: "Forensic Property",
    href: "/dashboard/properties",
    description: "Inspections, ingestion, and damage classification.",
  },
  {
    key: "insurance-intelligence",
    label: "Insurance Intelligence",
    href: "/dashboard/insurance",
    description: "Claim lifecycle and discrepancy intelligence.",
  },
  {
    key: "contractor-execution",
    label: "Contractor Execution",
    href: "/dashboard/contractors",
    description: "Onboarding, assignment, compliance and progress.",
  },
  {
    key: "equity-outcome",
    label: "Equity Outcome",
    href: "/dashboard/equity",
    description: "Equity impact analytics and investor narrative.",
  },
];

const roleModuleAccess: Record<UserRole, ModuleKey[]> = {
  Owner: dashboardModules.map((module) => module.key),
  Internal: dashboardModules.map((module) => module.key),
  Adjuster: [
    "intelligence",
    "forensic-property",
    "insurance-intelligence",
    "equity-outcome",
  ],
  Contractor: ["intelligence", "forensic-property", "contractor-execution"],
};

export function canAccessModule(role: UserRole, moduleKey: ModuleKey): boolean {
  return roleModuleAccess[role].includes(moduleKey);
}

export function getAllowedModules(role: UserRole): ModuleDefinition[] {
  return dashboardModules.filter((module) => canAccessModule(role, module.key));
}
