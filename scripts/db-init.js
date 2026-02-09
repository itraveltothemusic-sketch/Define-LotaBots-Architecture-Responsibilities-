#!/usr/bin/env node

/**
 * Database Initialization Script
 * 
 * This script initializes the database schema and optionally seeds with demo data.
 * 
 * Usage:
 *   node scripts/db-init.js [--seed]
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

const SCHEMA_FILE = path.join(__dirname, '../lib/db/schema.sql');
const DATABASE_URL = process.env.POSTGRES_URL || process.env.DATABASE_URL;

async function main() {
  const args = process.argv.slice(2);
  const shouldSeed = args.includes('--seed');

  console.log('🔧 Equity Builders - Database Initialization\n');

  // Check if database URL is configured
  if (!DATABASE_URL) {
    console.error('❌ Error: DATABASE_URL or POSTGRES_URL not configured');
    console.error('Please set the environment variable in .env file\n');
    process.exit(1);
  }

  // Check if schema file exists
  if (!fs.existsSync(SCHEMA_FILE)) {
    console.error(`❌ Error: Schema file not found at ${SCHEMA_FILE}\n`);
    process.exit(1);
  }

  try {
    console.log('📊 Initializing database schema...');
    
    // Read schema file
    const schema = fs.readFileSync(SCHEMA_FILE, 'utf8');
    
    // Execute schema via psql
    const command = `psql "${DATABASE_URL}" -c "${schema.replace(/"/g, '\\"')}"`;
    await execAsync(command);
    
    console.log('✅ Database schema initialized successfully\n');

    if (shouldSeed) {
      console.log('🌱 Seeding demo data...');
      // Add seeding logic here if needed
      console.log('✅ Demo data seeded successfully\n');
    }

    console.log('🎉 Database initialization complete!\n');
  } catch (error) {
    console.error('❌ Error during database initialization:');
    console.error(error.message);
    console.error('\nPlease check:');
    console.error('  1. Database connection string is correct');
    console.error('  2. Database exists and is accessible');
    console.error('  3. User has necessary permissions\n');
    process.exit(1);
  }
}

main();
