const { neon } = require('@neondatabase/serverless');

// Get database connection string from environment
const connectionString = process.env.NEON_DATABASE_URL || process.env.POSTGRES_URL;

if (!connectionString) {
  console.error('Database connection string not found. Make sure NEON_DATABASE_URL or POSTGRES_URL is set.');
  process.exit(1);
}

const sql = neon(connectionString);

async function applySchemaUpdates() {
  try {
    console.log('🔄 Applying schema updates...');

    // Apply agency workflow schema updates
    console.log('📋 Adding plan_id column...');
    await sql`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS plan_id INTEGER DEFAULT 1;`;

    console.log('📋 Adding priority column...');
    await sql`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS priority VARCHAR(50) DEFAULT 'Normal';`;

    console.log('📋 Adding agency_verified column...');
    await sql`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS agency_verified BOOLEAN DEFAULT false;`;

    console.log('📋 Adding is_verified column...');
    await sql`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false;`;

    // Apply employer contact columns
    console.log('📋 Adding employer contact columns...');
    await sql`
      ALTER TABLE jobs 
      ADD COLUMN IF NOT EXISTS employer_name VARCHAR(255),
      ADD COLUMN IF NOT EXISTS employer_email VARCHAR(255),
      ADD COLUMN IF NOT EXISTS employer_phone VARCHAR(50),
      ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
    `;

    // Create indexes
    console.log('📋 Creating indexes...');
    await sql`CREATE INDEX IF NOT EXISTS idx_jobs_priority ON jobs(priority, created_at);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_jobs_plan_id ON jobs(plan_id);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_jobs_updated_at ON jobs(updated_at);`;

    // Update existing jobs
    console.log('📋 Updating existing jobs...');
    await sql`UPDATE jobs SET updated_at = created_at WHERE updated_at IS NULL;`;

    console.log('✅ Schema updates applied successfully!');
  } catch (error) {
    console.error('❌ Error applying schema updates:', error);
    process.exit(1);
  }
}

applySchemaUpdates();
