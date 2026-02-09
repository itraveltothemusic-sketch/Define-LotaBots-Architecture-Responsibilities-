import { PrismaClient } from "@prisma/client";

/**
 * Prisma client singleton.
 *
 * WHY: Next.js dev mode reloads modules frequently. A global singleton avoids
 * exhausting database connections (especially important on Neon).
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    // Keep logs lean by default; can be expanded via env if needed.
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

