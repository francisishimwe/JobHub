const { neon } = require('@neondatabase/serverless');

async function testDeadlineFix() {
  const sql = neon("postgresql://neondb_owner:npg_mabQenpJ35yN@ep-fragrant-glitter-agu94zx1-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require");
  
  console.log('🔍 Testing deadline calculation...\n');
  
  // Get jobs with descriptions and check their deadlines
  const jobs = await sql`
    SELECT 
      j.id,
      j.title,
      j.deadline,
      j.description,
      c.name as company_name,
      LENGTH(j.description) as desc_length
    FROM jobs j
    LEFT JOIN companies c ON j.company_id = c.id
    WHERE (j.status = 'published' OR j.status = 'active')
    AND j.approved = true
    AND j.description IS NOT NULL 
    AND j.description != ''
    AND (j.deadline IS NULL OR j.deadline >= CURRENT_DATE)
    ORDER BY 
      CASE 
        WHEN j.description IS NULL OR j.description = '' THEN 2
        ELSE 1
      END,
      j.created_at DESC
    LIMIT 5
  `;
  
  console.log(`Found ${jobs.length} jobs with descriptions:\n`);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  jobs.forEach((job, index) => {
    const deadline = new Date(job.deadline);
    deadline.setHours(0, 0, 0, 0);
    
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    console.log(`${index + 1}. ${job.title}`);
    console.log(`   Company: ${job.company_name}`);
    console.log(`   Deadline: ${job.deadline}`);
    console.log(`   Today: ${today.toDateString()}`);
    console.log(`   Days remaining: ${diffDays}`);
    console.log(`   Status: ${diffDays > 0 ? 'Active' : diffDays === 0 ? 'Last day!' : 'Expired'}`);
    console.log('');
  });
}

testDeadlineFix().catch(console.error);
