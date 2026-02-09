import { defineConfig } from "prisma/config";

/**
 * Prisma v7 moved connection URLs out of schema.prisma.
 * This config is used by CLI commands (migrate, introspect, etc.).
 */
export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // Keep this optional so `prisma generate` can run without a DB,
    // while migrate/introspect will still require DATABASE_URL at runtime.
    url: process.env.DATABASE_URL,
  },
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
});

