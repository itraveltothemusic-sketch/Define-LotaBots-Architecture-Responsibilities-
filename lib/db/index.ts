/**
 * Database Client Configuration
 * 
 * Uses Drizzle ORM with Neon Postgres for serverless-optimized connections.
 */

import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Create Neon client
const sql = neon(process.env.DATABASE_URL);

// Create Drizzle instance with schema
export const db = drizzle(sql, { schema });

// Export schema for external use
export { schema };
