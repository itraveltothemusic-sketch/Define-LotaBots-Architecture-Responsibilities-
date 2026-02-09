export type Role = "OWNER" | "CONTRACTOR" | "ADJUSTER" | "INTERNAL";

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: Role;
};

