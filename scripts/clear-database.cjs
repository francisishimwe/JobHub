const { neon } = require('@neondatabase/serverless');

const NEON_DB_URL = "postgresql://neondb_owner:npg_mabQenpJ35yN@ep-fragrant-glitter-agu94zx1-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

async function clearDatabase() {
  try {
    console.log('=== CLEARING DATABASE ===\n');
    
    const sql = neon(NEON_DB_URL);
    console.log('Connected to database');
    
    // Clear all data
    console.log('Clearing all jobs and companies...');
    await sql`DELETE FROM jobs`;
    await sql`DELETE FROM companies`;
    
    // Verify it's empty
    const jobCount = await sql`SELECT COUNT(*) as count FROM jobs`;
    const companyCount = await sql`SELECT COUNT(*) as count FROM companies`;
    
    console.log(`\nDatabase cleared:`);
    console.log(`- Companies: ${companyCount[0].count}`);
    console.log(`- Jobs: ${jobCount[0].count}`);
    
    console.log('\n=== DATABASE CLEARED ===');
    console.log('Database is now empty and ready for fresh data');
    
  } catch (error) {
    console.error('Clearing failed:', error.message);
  }
}

clearDatabase();
