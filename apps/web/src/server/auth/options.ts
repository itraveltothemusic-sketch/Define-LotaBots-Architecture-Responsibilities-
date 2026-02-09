import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { z } from "zod";

import { getDb } from "@/server/db";
import { verifyPassword } from "@/server/security/password";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

/**
 * Auth configuration.
 *
 * WHY JWT sessions:
 * - Keeps session reads fast (no DB roundtrip on every request)
 * - Still enforces user existence and password verification at sign-in time
 *
 * NOTE:
 * We intentionally support a "degraded mode" (no DB configured) where auth is unavailable,
 * but the application can still boot and render public pages.
 */
export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
  adapter: (() => {
    const db = getDb();
    return db ? PrismaAdapter(db) : undefined;
  })(),
  providers: [
    CredentialsProvider({
      name: "Email & Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const db = getDb();
        if (!db) return null;

        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;
        const user = await db.user.findUnique({ where: { email } });
        if (!user || !user.passwordHash) return null;

        const ok = await verifyPassword(password, user.passwordHash);
        if (!ok) return null;

        // NextAuth expects a minimal user object here.
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // On initial login, persist role + uid into the token.
      if (user) {
        token.uid = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.uid && token.role) {
        session.user.id = token.uid;
        session.user.role = token.role;
      }
      return session;
    },
  },
};

