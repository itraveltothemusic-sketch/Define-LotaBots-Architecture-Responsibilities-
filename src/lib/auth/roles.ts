export const APP_ROLES = ["OWNER", "CONTRACTOR", "ADJUSTER", "INTERNAL"] as const;

export type AppRole = (typeof APP_ROLES)[number];

export const ROLE_LABELS: Record<AppRole, string> = {
  OWNER: "Owner",
  CONTRACTOR: "Contractor",
  ADJUSTER: "Adjuster",
  INTERNAL: "Internal",
};
