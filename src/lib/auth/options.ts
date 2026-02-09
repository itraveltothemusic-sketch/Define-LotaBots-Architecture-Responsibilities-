import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/db/prisma";
import { SignInSchema } from "@/lib/validation/auth";
import { verifyPassword } from "@/lib/security/password";

type AuthenticatedUserShape = {
  id: string;
  email: string;
  name: string;
  orgId: string | null;
  orgName: string | null;
  role: "OWNER" | "CONTRACTOR" | "ADJUSTER" | "INTERNAL" | null;
};

function isAuthenticatedUserShape(value: unknown): value is AuthenticatedUserShape {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.id === "string" &&
    typeof v.email === "string" &&
    (typeof v.orgId === "string" || v.orgId === null || typeof v.orgId === "undefined") &&
    (typeof v.orgName === "string" || v.orgName === null || typeof v.orgName === "undefined") &&
    (typeof v.role === "string" || v.role === null || typeof v.role === "undefined")
  );
}

type HeadersLike = Headers | Record<string, string | string[] | undefined>;
function getHeader(req: unknown, key: string): string | null {
  const headers = (req as { headers?: HeadersLike } | null)?.headers;
  if (!headers) return null;
  if (typeof (headers as Headers).get === "function") return (headers as Headers).get(key);
  const h = headers as Record<string, string | string[] | undefined>;
  const value = h[key] ?? h[key.toLowerCase()];
  if (!value) return null;
  return Array.isArray(value) ? value[0] ?? null : value;
}

/**
 * NextAuth configuration (Credentials).
 *
 * WHY Credentials (initially):
 * - Works with enterprise SSO later (we’ll add providers/invites).
 * - Keeps RBAC + org membership in our Postgres truth layer.
 * - Avoids demo-only auth while still enabling immediate secure sign-in.
 */
export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: { signIn: "/sign-in" },
  providers: [
    CredentialsProvider({
      name: "Email & Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const parsed = SignInSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email.toLowerCase() },
          include: {
            memberships: { orderBy: { createdAt: "asc" }, include: { org: true } },
          },
        });

        if (!user) return null;
        const ok = await verifyPassword(parsed.data.password, user.passwordHash);
        if (!ok) return null;

        const primary = user.memberships[0];

        // Audit sign-in (best-effort). Never block auth on audit logging.
        const xff = getHeader(req, "x-forwarded-for");
        const ua = getHeader(req, "user-agent");

        prisma.auditEvent
          .create({
            data: {
              orgId: primary?.orgId ?? null,
              userId: user.id,
              actorType: "USER",
              eventType: "AUTH_SIGNIN",
              resourceType: "user",
              resourceId: user.email,
              ip: xff ? xff.split(",")[0] : null,
              userAgent: ua,
            },
          })
          .catch(() => {});

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          orgId: primary?.orgId ?? null,
          orgName: primary?.org?.name ?? null,
          role: primary?.role ?? null,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user && isAuthenticatedUserShape(user)) {
        token.userId = user.id;
        token.orgId = user.orgId;
        token.orgName = user.orgName;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.userId ?? session.user.id;
        session.user.orgId = token.orgId ?? null;
        session.user.orgName = token.orgName ?? null;
        session.user.role = token.role ?? null;
      }
      return session;
    },
  },
};

