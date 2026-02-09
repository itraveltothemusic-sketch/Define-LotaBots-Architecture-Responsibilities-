import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/db/prisma";
import { SignInSchema } from "@/lib/validation/auth";
import { verifyPassword } from "@/lib/security/password";

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
        const headers: any = (req as any)?.headers ?? {};
        const xff =
          typeof headers.get === "function"
            ? headers.get("x-forwarded-for")
            : headers["x-forwarded-for"];
        const ua =
          typeof headers.get === "function" ? headers.get("user-agent") : headers["user-agent"];

        prisma.auditEvent
          .create({
            data: {
              orgId: primary?.orgId ?? null,
              userId: user.id,
              actorType: "USER",
              eventType: "AUTH_SIGNIN",
              resourceType: "user",
              resourceId: user.email,
              ip: (typeof xff === "string" ? xff.split(",")[0] : null) ?? null,
              userAgent: (typeof ua === "string" ? ua : null) ?? null,
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
      if (user) {
        token.userId = (user as any).id;
        token.orgId = (user as any).orgId;
        token.orgName = (user as any).orgName;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.userId as string;
        session.user.orgId = (token.orgId as string | null) ?? null;
        session.user.orgName = (token.orgName as string | null) ?? null;
        session.user.role = (token.role as any) ?? null;
      }
      return session;
    },
  },
};

