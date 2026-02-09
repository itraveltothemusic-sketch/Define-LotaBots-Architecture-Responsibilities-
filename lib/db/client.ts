/**
 * Database Client Configuration
 * 
 * Configures the Neon serverless PostgreSQL connection
 * with Drizzle ORM for type-safe database operations.
 */

import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

// Get database URL from environment
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL environment variable is not set. Please add it to your .env file."
  );
}

// Create Neon HTTP client
const sql = neon(databaseUrl);

// Create Drizzle instance with schema
export const db = drizzle(sql, { schema });

// Export types for use throughout the application
export type Database = typeof db;
