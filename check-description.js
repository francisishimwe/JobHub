const { neon } = require('@neondatabase/serverless');

async function checkDescriptions() {
  const sql = neon("postgresql://neondb_owner:npg_mabQenpJ35yN@ep-fragrant-glitter-agu94zx1-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require");
  
  console.log('🔍 Checking job descriptions...\n');
  
  // Check first few jobs with their descriptions
  const jobsWithDescriptions = await sql`
    SELECT id, title, description, LEFT(description, 200) as description_preview
    FROM jobs 
    WHERE status = 'published' AND approved = true
    ORDER BY created_at DESC
    LIMIT 5
  `;
  
  console.log('Job descriptions:');
  jobsWithDescriptions.forEach((job, index) => {
    console.log(`\n${index + 1}. ${job.title}`);
    console.log(`   ID: ${job.id}`);
    console.log(`   Description length: ${job.description ? job.description.length : 0} characters`);
    console.log(`   Preview: "${job.description_preview || 'NO DESCRIPTION'}"`);
  });
  
  // Check how many jobs have descriptions vs no descriptions
  const withDesc = await sql`SELECT COUNT(*) as count FROM jobs WHERE description IS NOT NULL AND description != ''`;
  const withoutDesc = await sql`SELECT COUNT(*) as count FROM jobs WHERE description IS NULL OR description = ''`;
  
  console.log(`\n📊 Description Statistics:`);
  console.log(`Jobs with descriptions: ${withDesc[0].count}`);
  console.log(`Jobs without descriptions: ${withoutDesc[0].count}`);
}

checkDescriptions().catch(console.error);
