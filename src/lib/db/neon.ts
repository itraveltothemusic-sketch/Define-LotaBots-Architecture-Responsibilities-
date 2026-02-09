import "server-only";

import postgres from "postgres";

let cachedClient: postgres.Sql | null = null;

export function getDbClient() {
  if (cachedClient) {
    return cachedClient;
  }

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not configured.");
  }

  cachedClient = postgres(connectionString, {
    max: 5,
    idle_timeout: 20,
    connect_timeout: 10,
    prepare: false,
  });

  return cachedClient;
}
