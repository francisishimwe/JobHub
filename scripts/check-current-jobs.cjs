const { neon } = require('@neondatabase/serverless');

const NEON_DB_URL = "postgresql://neondb_owner:npg_mabQenpJ35yN@ep-fragrant-glitter-agu94zx1-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

async function checkCurrentJobs() {
  try {
    console.log('=== CHECKING CURRENT JOBS IN DATABASE ===\n');
    
    const sql = neon(NEON_DB_URL);
    
    // Get all current jobs with company info
    const allJobs = await sql`
      SELECT 
        j.id,
        j.title,
        j.status,
        j.approved,
        j.featured,
        j.deadline,
        j.created_at,
        j.posted_date,
        j.location,
        j.job_type,
        j.experience_level,
        c.name as company_name,
        c.industry
      FROM jobs j
      JOIN companies c ON j.company_id = c.id
      ORDER BY j.created_at DESC
    `;
    
    console.log(`Total jobs in database: ${allJobs.length}\n`);
    
    if (allJobs.length === 0) {
      console.log('No jobs found in the database.');
      return;
    }
    
    // Group by status
    const publishedJobs = allJobs.filter(j => j.status === 'published');
    const draftJobs = allJobs.filter(j => j.status === 'draft');
    const approvedJobs = allJobs.filter(j => j.approved === true);
    const featuredJobs = allJobs.filter(j => j.featured === true);
    
    console.log(`Status breakdown:`);
    console.log(`- Published: ${publishedJobs.length}`);
    console.log(`- Draft: ${draftJobs.length}`);
    console.log(`- Approved: ${approvedJobs.length}`);
    console.log(`- Featured: ${featuredJobs.length}\n`);
    
    // Show all jobs
    console.log('=== ALL CURRENT JOBS ===\n');
    
    allJobs.forEach((job, index) => {
      console.log(`${index + 1}. ${job.title}`);
      console.log(`   Company: ${job.company_name} (${job.industry})`);
      console.log(`   Location: ${job.location || 'Not specified'}`);
      console.log(`   Type: ${job.job_type || 'Not specified'} | Level: ${job.experience_level || 'Not specified'}`);
      console.log(`   Status: ${job.status} | Approved: ${job.approved} | Featured: ${job.featured}`);
      console.log(`   Deadline: ${job.deadline ? new Date(job.deadline).toLocaleDateString() : 'Not set'}`);
      console.log(`   Posted: ${job.created_at ? new Date(job.created_at).toLocaleDateString() : 'Unknown'}`);
      console.log('');
    });
    
    // Show companies
    console.log('=== COMPANIES ===\n');
    const companies = await sql`SELECT id, name, industry, created_at FROM companies ORDER BY name`;
    companies.forEach((company, index) => {
      console.log(`${index + 1}. ${company.name} (${company.industry})`);
      console.log(`   ID: ${company.id}`);
      console.log(`   Created: ${company.created_at ? new Date(company.created_at).toLocaleDateString() : 'Unknown'}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('Failed to check current jobs:', error.message);
  }
}

checkCurrentJobs();
