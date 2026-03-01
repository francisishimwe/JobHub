const { neon } = require('@neondatabase/serverless');

async function debugDatabase() {
  const sql = neon("postgresql://neondb_owner:npg_mabQenpJ35yN@ep-fragrant-glitter-agu94zx1-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require");
  
  console.log('🔍 Debugging database contents...\n');
  
  // Check total jobs
  const totalJobs = await sql`SELECT COUNT(*) as count FROM jobs`;
  console.log(`Total jobs in database: ${totalJobs[0].count}`);
  
  // Check jobs with approved field
  const approvedJobs = await sql`SELECT COUNT(*) as count FROM jobs WHERE approved = true`;
  console.log(`Jobs with approved = true: ${approvedJobs[0].count}`);
  
  // Check jobs with published/active status
  const publishedJobs = await sql`SELECT COUNT(*) as count FROM jobs WHERE status = 'published' OR status = 'active'`;
  console.log(`Jobs with published/active status: ${publishedJobs[0].count}`);
  
  // Check sample jobs with their fields
  const sampleJobs = await sql`
    SELECT 
      id, 
      title, 
      status, 
      approved, 
      deadline,
      company_id
    FROM jobs 
    LIMIT 5
  `;
  
  console.log('\n📋 Sample jobs:');
  sampleJobs.forEach((job, index) => {
    console.log(`${index + 1}. ${job.title}`);
    console.log(`   Status: ${job.status}`);
    console.log(`   Approved: ${job.approved}`);
    console.log(`   Deadline: ${job.deadline}`);
    console.log(`   Company ID: ${job.company_id}`);
    console.log('');
  });
  
  // Check the exact query that the API uses
  console.log('🔍 Testing exact API query...');
  const apiJobs = await sql`
    SELECT 
      j.id,
      j.title,
      j.company_id,
      j.location,
      j.job_type,
      j.opportunity_type,
      j.experience_level,
      j.deadline,
      j.description,
      j.status,
      j.approved,
      j.created_at,
      c.name as company_name,
      c.logo as company_logo
    FROM jobs j
    LEFT JOIN companies c ON j.company_id = c.id
    WHERE (j.status = 'published' OR j.status = 'active')
    AND j.approved = true
    AND (j.deadline IS NULL OR j.deadline = '' OR j.deadline IS NOT NULL)
    ORDER BY j.created_at DESC
    LIMIT 5
  `;
  
  console.log(`API query returned ${apiJobs.length} jobs`);
  if (apiJobs.length > 0) {
    console.log('First API job:', apiJobs[0]);
  }
}

debugDatabase().catch(console.error);
