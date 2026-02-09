import type { UserRole } from "@/lib/auth/types";

export type AppModule = "intelligence" | "forensic" | "insurance" | "execution" | "equity";

const ROLE_MODULE_ACCESS: Record<UserRole, AppModule[]> = {
  OWNER: ["intelligence", "forensic", "insurance", "execution", "equity"],
  INTERNAL: ["intelligence", "forensic", "insurance", "execution", "equity"],
  ADJUSTER: ["intelligence", "forensic", "insurance", "equity"],
  CONTRACTOR: ["intelligence", "forensic", "execution"],
};

export function canAccessModule(role: UserRole, module: AppModule): boolean {
  return ROLE_MODULE_ACCESS[role].includes(module);
}
