#!/usr/bin/env node
// Database initialization script
// Run with: npm run db:init
// Requires POSTGRES_URL environment variable

import { initializeDatabase, cleanupExpiredRecords } from '../api/lib/db.js';

async function main() {
  console.log('Initializing database tables...');

  const result = await initializeDatabase();

  if (result.success) {
    console.log('Database tables created successfully.');

    // Also run cleanup
    console.log('Cleaning up expired records...');
    const cleanupResult = await cleanupExpiredRecords();

    if (cleanupResult.success) {
      console.log('Cleanup completed.');
    } else {
      console.error('Cleanup failed:', cleanupResult.error);
    }
  } else {
    console.error('Database initialization failed:', result.error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('Unexpected error:', error);
  process.exit(1);
});
