export const OrgRoles = ["OWNER", "CONTRACTOR", "ADJUSTER", "INTERNAL"] as const;
export type OrgRole = (typeof OrgRoles)[number];

export function isOrgRole(value: unknown): value is OrgRole {
  return typeof value === "string" && (OrgRoles as readonly string[]).includes(value);
}

/**
 * RBAC policy helpers.
 *
 * WHY: We must be explicit and auditable about access decisions.
 * Keep policy logic centralized and small; higher-level checks compose from here.
 */
export function canManageOrg(role: OrgRole) {
  return role === "OWNER" || role === "INTERNAL";
}

export function canEditProperty(role: OrgRole) {
  return role === "OWNER" || role === "INTERNAL" || role === "CONTRACTOR";
}

export function canViewClaims(role: OrgRole) {
  return role === "OWNER" || role === "INTERNAL" || role === "ADJUSTER";
}

