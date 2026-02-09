/**
 * Database Connection and Query Utilities
 * 
 * This module provides a centralized database connection pool and query utilities
 * for the Equity Builders platform. Uses Vercel Postgres (Neon) for production
 * and can be configured for local PostgreSQL in development.
 */

import { sql } from '@vercel/postgres';

// ============================================
// DATABASE CLIENT
// ============================================

/**
 * Execute a SQL query with parameterized values
 * Prevents SQL injection by using parameterized queries
 */
export async function query<T = unknown>(
  queryText: string,
  params: unknown[] = []
): Promise<T[]> {
  try {
    const result = await sql.query(queryText, params);
    return result.rows as T[];
  } catch (error) {
    console.error('Database query error:', error);
    throw new Error('Database query failed');
  }
}

/**
 * Execute a single SQL query and return the first result
 */
export async function queryOne<T = unknown>(
  queryText: string,
  params: unknown[] = []
): Promise<T | null> {
  const results = await query<T>(queryText, params);
  return results.length > 0 ? results[0] : null;
}

/**
 * Execute a query within a transaction
 */
export async function transaction<T>(
  callback: () => Promise<T>
): Promise<T> {
  await sql`BEGIN`;
  try {
    const result = await callback();
    await sql`COMMIT`;
    return result;
  } catch (error) {
    await sql`ROLLBACK`;
    throw error;
  }
}

// ============================================
// DATABASE INITIALIZATION
// ============================================

/**
 * Initialize database tables
 * Should only be run once during setup or in development
 */
export async function initializeDatabase(): Promise<void> {
  // This would read and execute the schema.sql file
  // For production, use migrations instead
  console.log('Database initialization should be done via migrations');
  console.log('Run: psql -d your_database < lib/db/schema.sql');
}

/**
 * Check if database connection is healthy
 */
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await sql`SELECT 1`;
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

// ============================================
// COMMON QUERIES
// ============================================

/**
 * Check if a table exists
 */
export async function tableExists(tableName: string): Promise<boolean> {
  const result = await queryOne<{ exists: boolean }>(
    `SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = $1
    )`,
    [tableName]
  );
  return result?.exists ?? false;
}

/**
 * Get table row count
 */
export async function getTableCount(tableName: string): Promise<number> {
  const result = await queryOne<{ count: string }>(
    `SELECT COUNT(*) as count FROM ${tableName}`
  );
  return parseInt(result?.count ?? '0', 10);
}

// Export the sql client for direct use when needed
export { sql };
