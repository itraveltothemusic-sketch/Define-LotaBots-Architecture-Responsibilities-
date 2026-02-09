export function isTruthyEnv(value: string | undefined): boolean {
  return value === "1" || value?.toLowerCase() === "true";
}

/**
 * Demo mode exists so the repository runs immediately without database/secrets.
 * It must never be enabled silently in production.
 */
export const EB_DEMO_MODE =
  isTruthyEnv(process.env.EB_DEMO_MODE) ||
  (process.env.EB_DEMO_MODE == null && process.env.NODE_ENV !== "production");

export function getRequiredEnv(name: string): string {
  const v = process.env[name];
  if (v && v.length > 0) return v;
  throw new Error(`Missing required environment variable: ${name}`);
}

