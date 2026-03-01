const { neon } = require('@neondatabase/serverless');

async function fixDeadlines() {
  const sql = neon("postgresql://neondb_owner:npg_mabQenpJ35yN@ep-fragrant-glitter-agu94zx1-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require");
  
  console.log('🔧 Fixing deadline issues in database...\n');
  
  // Check jobs with empty string deadlines
  const emptyDeadlineJobs = await sql`SELECT COUNT(*) as count FROM jobs WHERE deadline = ''`;
  console.log(`Jobs with empty string deadlines: ${emptyDeadlineJobs[0].count}`);
  
  // Fix empty string deadlines by setting them to NULL
  if (emptyDeadlineJobs[0].count > 0) {
    console.log('🔄 Converting empty string deadlines to NULL...');
    const result = await sql`
      UPDATE jobs 
      SET deadline = NULL 
      WHERE deadline = ''
    `;
    console.log(`✅ Updated ${result.count} rows`);
  }
  
  // Check for null deadlines
  const nullDeadlineJobs = await sql`SELECT COUNT(*) as count FROM jobs WHERE deadline IS NULL`;
  console.log(`Jobs with NULL deadlines: ${nullDeadlineJobs[0].count}`);
  
  // Test the API query again
  console.log('\n🔍 Testing API query after fix...');
  try {
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
      AND (j.deadline IS NULL OR j.deadline >= CURRENT_DATE)
      ORDER BY j.created_at DESC
      LIMIT 5
    `;
    
    console.log(`✅ API query now returns ${apiJobs.length} jobs`);
    if (apiJobs.length > 0) {
      console.log('First job:', {
        id: apiJobs[0].id,
        title: apiJobs[0].title,
        company: apiJobs[0].company_name,
        deadline: apiJobs[0].deadline
      });
    }
  } catch (error) {
    console.error('❌ API query still failing:', error.message);
  }
}

fixDeadlines().catch(console.error);
