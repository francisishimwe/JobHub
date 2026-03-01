const { neon } = require('@neondatabase/serverless');

async function fixDeadlines() {
  const sql = neon("postgresql://neondb_owner:npg_mabQenpJ35yN@ep-fragrant-glitter-agu94zx1-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require");
  
  console.log('🔧 Fixing deadline issues in database...\n');
  
  // First, let's see what's in the deadline column without filtering
  console.log('🔍 Checking deadline values...');
  const deadlineSamples = await sql`
    SELECT id, title, deadline 
    FROM jobs 
    WHERE deadline IS NOT NULL
    LIMIT 10
  `;
  
  console.log('Sample deadline values:');
  deadlineSamples.forEach((job, index) => {
    console.log(`${index + 1}. ${job.title}: "${job.deadline}"`);
  });
  
  // Use a safer approach to find and fix empty deadlines
  try {
    // Update using CASE statement to avoid direct comparison
    console.log('\n🔄 Fixing empty deadlines...');
    const result = await sql`
      UPDATE jobs 
      SET deadline = NULL 
      WHERE CASE 
        WHEN deadline IS NOT NULL AND trim(deadline) = '' THEN true
        ELSE false
      END
    `;
    console.log(`✅ Updated result:`, result);
  } catch (error) {
    console.log('⚠️ Update failed, trying alternative approach...');
    
    // Try using LENGTH to detect empty strings
    try {
      const result2 = await sql`
        UPDATE jobs 
        SET deadline = NULL 
        WHERE LENGTH(deadline) = 0
      `;
      console.log(`✅ Alternative update result:`, result2);
    } catch (error2) {
      console.error('❌ Both update approaches failed');
    }
  }
  
  // Test the API query with a safer version
  console.log('\n🔍 Testing improved API query...');
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
    
    console.log(`✅ API query returns ${apiJobs.length} jobs`);
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
