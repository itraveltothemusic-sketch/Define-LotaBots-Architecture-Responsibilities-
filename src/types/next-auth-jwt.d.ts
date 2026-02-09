import "next-auth/jwt";

declare module "next-auth/jwt" {
  interface JWT {
    userId?: string;
    orgId?: string | null;
    orgName?: string | null;
    role?: "OWNER" | "CONTRACTOR" | "ADJUSTER" | "INTERNAL" | null;
  }
}

