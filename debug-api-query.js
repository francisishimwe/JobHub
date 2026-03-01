const { neon } = require('@neondatabase/serverless');

async function debugApiQuery() {
  const sql = neon("postgresql://neondb_owner:npg_mabQenpJ35yN@ep-fragrant-glitter-agu94zx1-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require");
  
  console.log('🔍 Debugging API query...\n');
  
  // Test the exact API query
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
      c.logo as company_logo,
      LENGTH(j.description) as desc_length
    FROM jobs j
    LEFT JOIN companies c ON j.company_id = c.id
    WHERE (j.status = 'published' OR j.status = 'active')
    AND j.approved = true
    AND (j.deadline IS NULL OR j.deadline >= CURRENT_DATE)
    ORDER BY j.created_at DESC
    LIMIT 10
  `;
  
  console.log(`API query returned ${apiJobs.length} jobs\n`);
  
  apiJobs.forEach((job, index) => {
    console.log(`${index + 1}. ${job.title}`);
    console.log(`   Company: ${job.company_name || 'No company'}`);
    console.log(`   Description length: ${job.desc_length || 0} chars`);
    console.log(`   Deadline: ${job.deadline}`);
    console.log(`   Status: ${job.status}, Approved: ${job.approved}`);
    console.log('');
  });
  
  // Now let's check jobs with descriptions that should be included
  console.log('🔍 Checking jobs with descriptions that should appear...\n');
  
  const jobsWithDesc = await sql`
    SELECT 
      j.id,
      j.title,
      j.description,
      j.deadline,
      LENGTH(j.description) as desc_length,
      c.name as company_name
    FROM jobs j
    LEFT JOIN companies c ON j.company_id = c.id
    WHERE (j.status = 'published' OR j.status = 'active')
    AND j.approved = true
    AND j.description IS NOT NULL 
    AND j.description != ''
    AND (j.deadline IS NULL OR j.deadline >= CURRENT_DATE)
    ORDER BY j.created_at DESC
    LIMIT 5
  `;
  
  console.log(`Found ${jobsWithDesc.length} jobs with descriptions:\n`);
  
  jobsWithDesc.forEach((job, index) => {
    console.log(`${index + 1}. ${job.title}`);
    console.log(`   Company: ${job.company_name || 'No company'}`);
    console.log(`   Description length: ${job.desc_length} chars`);
    console.log(`   Preview: "${job.description.substring(0, 100)}..."`);
    console.log(`   Deadline: ${job.deadline}`);
    console.log('');
  });
}

debugApiQuery().catch(console.error);
