const { neon } = require('@neondatabase/serverless');

const NEON_DB_URL = "postgresql://neondb_owner:npg_mabQenpJ35yN@ep-fragrant-glitter-agu94zx1-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

async function checkSchema() {
  try {
    console.log('=== CHECKING DATABASE SCHEMA ===\n');
    
    const sql = neon(NEON_DB_URL);
    
    // Check companies table
    console.log('1. Companies table schema:');
    const companiesSchema = await sql`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'companies' AND table_schema = 'public'
      ORDER BY ordinal_position
    `;
    
    companiesSchema.forEach(col => {
      console.log(`  ${col.column_name}: ${col.data_type} (${col.is_nullable}) ${col.column_default ? `DEFAULT ${col.column_default}` : ''}`);
    });
    
    // Check jobs table
    console.log('\n2. Jobs table schema:');
    const jobsSchema = await sql`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'jobs' AND table_schema = 'public'
      ORDER BY ordinal_position
    `;
    
    jobsSchema.forEach(col => {
      console.log(`  ${col.column_name}: ${col.data_type} (${col.is_nullable}) ${col.column_default ? `DEFAULT ${col.column_default}` : ''}`);
    });
    
    // Show sample data
    console.log('\n3. Sample data:');
    
    const companies = await sql`SELECT id, name FROM companies LIMIT 3`;
    console.log('Companies:');
    companies.forEach(c => console.log(`  ${c.id}: ${c.name}`));
    
    const jobs = await sql`SELECT id, title, company_id FROM jobs LIMIT 3`;
    console.log('\nJobs:');
    jobs.forEach(j => console.log(`  ${j.id}: ${j.title} (company: ${j.company_id})`));
    
  } catch (error) {
    console.error('Schema check failed:', error.message);
  }
}

checkSchema();
