/**
 * Prisma Client Singleton
 *
 * In development, Next.js hot reloading causes the Prisma Client to be
 * instantiated multiple times. This singleton pattern prevents that
 * by caching the client on the global object.
 *
 * In production, this simply creates a single instance.
 */
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
