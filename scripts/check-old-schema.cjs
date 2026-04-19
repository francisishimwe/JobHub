const { neon } = require('@neondatabase/serverless');

const OLD_DB_URL = 'postgresql://neondb_owner:npg_CD5GYcTUPz7q@ep-withered-heart-agegb3fq-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require';

async function checkOldSchema() {
  try {
    console.log('=== CHECKING OLD DATABASE SCHEMA ===\n');
    
    const sql = neon(OLD_DB_URL);
    
    // Check companies table
    console.log('Companies table columns:');
    const companyColumns = await sql`
      SELECT column_name, data_type
      FROM information_schema.columns 
      WHERE table_name = 'companies'
      ORDER BY ordinal_position
    `;
    
    companyColumns.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type}`);
    });
    
    // Check jobs table
    console.log('\nJobs table columns:');
    const jobColumns = await sql`
      SELECT column_name, data_type
      FROM information_schema.columns 
      WHERE table_name = 'jobs'
      ORDER BY ordinal_position
    `;
    
    jobColumns.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type}`);
    });
    
    // Sample data
    console.log('\nSample companies:');
    const sampleCompanies = await sql`SELECT * FROM companies LIMIT 3`;
    sampleCompanies.forEach((company, index) => {
      console.log(`${index + 1}. ${JSON.stringify(company, null, 2)}`);
    });
    
    console.log('\nSample jobs:');
    const sampleJobs = await sql`SELECT * FROM jobs LIMIT 3`;
    sampleJobs.forEach((job, index) => {
      console.log(`${index + 1}. ${JSON.stringify(job, null, 2)}`);
    });
    
  } catch (error) {
    console.error('Schema check failed:', error.message);
  }
}

checkOldSchema();
