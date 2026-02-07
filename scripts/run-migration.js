const { neon } = require('@neondatabase/serverless');
require('dotenv').config();

async function runMigration() {
  try {
    const connectionString = process.env.NEON_DATABASE_URL || process.env.POSTGRES_URL;
    if (!connectionString) {
      throw new Error('Database connection string not found. Make sure NEON_DATABASE_URL or POSTGRES_URL is set.');
    }

    const sql = neon(connectionString);
    
    console.log('Running migration: Adding employer contact columns...');
    
    // Add employer contact information columns to jobs table
    await sql`
      ALTER TABLE jobs 
      ADD COLUMN IF NOT EXISTS employer_name VARCHAR(255),
      ADD COLUMN IF NOT EXISTS employer_email VARCHAR(255),
      ADD COLUMN IF NOT EXISTS employer_phone VARCHAR(50),
      ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
    `;

    // Create index for updated_at column
    await sql`
      CREATE INDEX IF NOT EXISTS idx_jobs_updated_at ON jobs(updated_at);
    `;

    // Update existing jobs to have current timestamp for updated_at
    await sql`
      UPDATE jobs SET updated_at = created_at WHERE updated_at IS NULL;
    `;

    console.log('✅ Migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigration();
