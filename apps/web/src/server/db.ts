import "server-only";

import { PrismaClient } from "@prisma/client";
import { hasDatabaseConfigured } from "@/server/env";

/**
 * Prisma client singleton.
 *
 * IMPORTANT:
 * - We intentionally support a "degraded mode" where the app boots without DB configured.
 *   This is useful for CI scaffolding and UI development. Any DB-dependent operation must
 *   explicitly handle `null`.
 */

declare global {
  var __equityBuildersPrisma: PrismaClient | undefined;
}

export type DbClient = PrismaClient;

export function getDb(): PrismaClient | null {
  if (!hasDatabaseConfigured()) return null;

  if (global.__equityBuildersPrisma) return global.__equityBuildersPrisma;

  const client = new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "info", "warn", "error"]
        : ["warn", "error"],
  });

  global.__equityBuildersPrisma = client;
  return client;
}

