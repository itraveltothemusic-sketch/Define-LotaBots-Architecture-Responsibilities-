/**
 * Database Connection and Client Configuration
 * 
 * This module sets up the database connection using Neon's serverless driver
 * and Drizzle ORM for type-safe database operations.
 */

import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Create the SQL client
const sql = neon(process.env.DATABASE_URL);

// Create the Drizzle database instance with schema
export const db = drizzle(sql, { schema });

// Export schema for use in queries
export { schema };

// Type helper for inferring select/insert types from schema
export type DbClient = typeof db;
