import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      orgId: string | null;
      orgName: string | null;
      role: "OWNER" | "CONTRACTOR" | "ADJUSTER" | "INTERNAL" | null;
    };
  }
}

