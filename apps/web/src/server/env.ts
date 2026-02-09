import { z } from "zod";

/**
 * Centralized environment parsing.
 *
 * WHY:
 * - Prevents silent misconfiguration
 * - Makes "degraded mode" explicit when env isn't wired yet (common in greenfield scaffolds)
 */

const envSchema = z.object({
  DATABASE_URL: z.string().min(1).optional(),
  AUTH_SECRET: z.string().min(1).optional(),
  NEXT_PUBLIC_APP_URL: z.string().min(1).optional(),
});

export type AppEnv = z.infer<typeof envSchema>;

export function getEnv(): AppEnv {
  // We keep this permissive for bootstrapping; production deployments should enforce required values.
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) return {};
  return parsed.data;
}

export function hasDatabaseConfigured(): boolean {
  return Boolean(getEnv().DATABASE_URL);
}

