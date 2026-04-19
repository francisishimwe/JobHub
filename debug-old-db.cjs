const { neon } = require('@neondatabase/serverless');

async function debugOldDatabase() {
  try {
    console.log('=== CHECKING OLD DATABASE ===\n');
    
    // This is the database URL from the debug file
    const OLD_DB_URL = 'postgresql://neondb_owner:npg_CD5GYcTUPz7q@ep-withered-heart-agegb3fq-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require';
    
    const sql = neon(OLD_DB_URL);
    console.log('Connected to old database...');
    
    // Check all jobs in old database
    const allJobs = await sql`
      SELECT id, title, status, approved, deadline, created_at
      FROM jobs
      ORDER BY created_at DESC
      LIMIT 30
    `;
    
    console.log(`Found ${allJobs.length} jobs in old database:\n`);
    
    allJobs.forEach((job, index) => {
      console.log(`${index + 1}. ${job.title}`);
      console.log(`   Status: ${job.status} | Approved: ${job.approved}`);
      console.log(`   Deadline: ${job.deadline || 'Not set'}`);
      console.log(`   Created: ${job.created_at}`);
      console.log('');
    });
    
    // Check companies
    const companies = await sql`
      SELECT id, name, created_at
      FROM companies
      ORDER BY created_at DESC
    `;
    
    console.log(`Found ${companies.length} companies in old database:\n`);
    
    companies.forEach((company, index) => {
      console.log(`${index + 1}. ${company.name} (${company.id})`);
      console.log(`   Created: ${company.created_at}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('Failed to connect to old database:', error.message);
  }
}

debugOldDatabase();
