import postgres, { type Sql } from "postgres";

let sqlInstance: Sql | null = null;

export function getSqlClient(): Sql | null {
  if (sqlInstance) {
    return sqlInstance;
  }

  if (!process.env.DATABASE_URL) {
    return null;
  }

  sqlInstance = postgres(process.env.DATABASE_URL, {
    ssl: "require",
    max: 5,
    prepare: true,
  });

  return sqlInstance;
}

export async function getDatabaseHealth(): Promise<{
  provider: "neon";
  mode: "connected" | "fixture";
}> {
  const sql = getSqlClient();
  if (!sql) {
    return { provider: "neon", mode: "fixture" };
  }

  try {
    await sql`select 1`;
    return { provider: "neon", mode: "connected" };
  } catch {
    return { provider: "neon", mode: "fixture" };
  }
}
