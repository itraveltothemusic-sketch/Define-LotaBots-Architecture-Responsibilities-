export const ROLE_VALUES = ["OWNER", "CONTRACTOR", "ADJUSTER", "INTERNAL"] as const;

export type UserRole = (typeof ROLE_VALUES)[number];

export interface AuthSession {
  userId: string;
  fullName: string;
  email: string;
  role: UserRole;
}
