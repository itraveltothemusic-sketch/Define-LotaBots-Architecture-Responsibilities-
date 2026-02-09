import { DASHBOARD_NAVIGATION } from "@/config/navigation";
import type { AppRole } from "@/lib/auth/roles";

export function hasModuleAccess(role: AppRole, href: string): boolean {
  const module = DASHBOARD_NAVIGATION.find((item) => item.href === href);
  if (!module) {
    return false;
  }

  return module.roles.includes(role);
}

export function getNavigationForRole(role: AppRole) {
  return DASHBOARD_NAVIGATION.filter((item) => item.roles.includes(role));
}
