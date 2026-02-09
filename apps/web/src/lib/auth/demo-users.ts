import type { Role, SessionUser } from "./types";

type DemoUser = SessionUser & { password: string };

/**
 * Demo users are only used when EB_DEMO_MODE is enabled.
 * They exist to make the repo boot immediately without external dependencies.
 */
export const DEMO_USERS: readonly DemoUser[] = [
  {
    id: "demo_owner_001",
    email: "owner@equitybuilders.demo",
    name: "Demo Owner",
    role: "OWNER",
    password: "password",
  },
  {
    id: "demo_contractor_001",
    email: "contractor@equitybuilders.demo",
    name: "Demo Contractor",
    role: "CONTRACTOR",
    password: "password",
  },
  {
    id: "demo_adjuster_001",
    email: "adjuster@equitybuilders.demo",
    name: "Demo Adjuster",
    role: "ADJUSTER",
    password: "password",
  },
  {
    id: "demo_internal_001",
    email: "internal@equitybuilders.demo",
    name: "Demo Internal",
    role: "INTERNAL",
    password: "password",
  },
] as const;

export function roleLabel(role: Role): string {
  switch (role) {
    case "OWNER":
      return "Owner";
    case "CONTRACTOR":
      return "Contractor";
    case "ADJUSTER":
      return "Adjuster";
    case "INTERNAL":
      return "Internal";
  }
}

