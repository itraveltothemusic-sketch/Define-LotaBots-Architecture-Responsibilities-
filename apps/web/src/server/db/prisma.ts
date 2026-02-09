import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";

declare global {
  var __prisma: PrismaClient | undefined;
}

export function prisma(): PrismaClient {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL is not set. Configure Postgres to enable database-backed features.",
    );
  }

  if (!global.__prisma) {
    // Neon driver optimization: WebSocket connections + message pipelining.
    neonConfig.webSocketConstructor = ws;
    const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
    global.__prisma = new PrismaClient({ adapter });
  }
  return global.__prisma;
}

