const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

async function createTable() {
  const sql = neon(process.env.POSTGRES_URL);
  console.log("Creating table in Neon...");
  
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS jobs (
        id UUID PRIMARY KEY,
        title TEXT NOT NULL,
        company_id TEXT,
        location TEXT,
        job_type TEXT,
        opportunity_type TEXT,
        deadline TEXT,
        category TEXT,
        description TEXT,
        application_link TEXT,
        attachment_url TEXT,
        status TEXT DEFAULT 'published',
        approved BOOLEAN DEFAULT true,
        featured BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log("✅ Table 'jobs' created successfully!");
  } catch (err) {
    console.error("❌ Error creating table:", err.message);
  }
}

createTable();