const { neon } = require('@neondatabase/serverless');

async function keepLatest15Jobs() {
  const sql = neon("postgresql://neondb_owner:npg_mabQenpJ35yN@ep-fragrant-glitter-agu94zx1-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require");
  
  console.log('🎯 Keeping only the latest 15 current jobs...\n');
  
  // Check current state
  const totalBefore = await sql`SELECT COUNT(*) as count FROM jobs`;
  console.log(`📊 Current total jobs: ${totalBefore[0].count}`);
  
  // Get the IDs of the 15 most recent active jobs with descriptions
  const latest15Result = await sql`
    SELECT id FROM jobs 
    WHERE (status = 'published' OR status = 'active')
    AND approved = true
    AND description IS NOT NULL 
    AND description != ''
    AND (deadline IS NULL OR deadline >= CURRENT_DATE)
    ORDER BY created_at DESC
    LIMIT 15
  `;
  
  const latest15Ids = latest15Result.map(row => row.id);
  
  console.log(`\n📋 Found ${latest15Ids.length} latest jobs to keep:`);
  
  // Show what jobs we're keeping
  const jobsToKeep = await sql`
    SELECT 
      j.title,
      j.deadline,
      c.name as company_name,
      LENGTH(j.description) as desc_length
    FROM jobs j
    LEFT JOIN companies c ON j.company_id = c.id
    WHERE j.id = ANY(${latest15Ids})
    ORDER BY j.created_at DESC
  `;
  
  jobsToKeep.forEach((job, index) => {
    const daysLeft = job.deadline ? Math.ceil((new Date(job.deadline) - new Date()) / (1000 * 60 * 60 * 24)) : 'Open';
    console.log(`${index + 1}. ${job.title} - ${job.company_name} (${daysLeft} days left)`);
  });
  
  if (latest15Ids.length === 0) {
    console.log('❌ No jobs found to keep!');
    return;
  }
  
  // Delete all jobs except these 15
  console.log(`\n🗑️  Deleting all other jobs (keeping only ${latest15Ids.length})...`);
  
  const deletedJobs = await sql`
    DELETE FROM jobs 
    WHERE id != ALL(${latest15Ids})
    RETURNING id, title
  `;
  
  console.log(`✅ Deleted ${deletedJobs.length} old jobs`);
  
  // Show some deleted jobs for confirmation
  if (deletedJobs.length > 0) {
    console.log('\n📋 Sample of deleted jobs:');
    deletedJobs.slice(0, 5).forEach((job, index) => {
      console.log(`   - ${job.title}`);
    });
    if (deletedJobs.length > 5) {
      console.log(`   ... and ${deletedJobs.length - 5} more`);
    }
  }
  
  // Final verification
  const totalAfter = await sql`SELECT COUNT(*) as count FROM jobs`;
  const finalJobs = await sql`
    SELECT COUNT(*) as count FROM jobs 
    WHERE (status = 'published' OR status = 'active')
    AND approved = true
    AND description IS NOT NULL 
    AND description != ''
    AND (deadline IS NULL OR deadline >= CURRENT_DATE)
  `;
  
  console.log('\n📊 Final state:');
  console.log(`   Total jobs in database: ${totalAfter[0].count}`);
  console.log(`   Active jobs with descriptions: ${finalJobs[0].count}`);
  
  console.log('\n✅ Database optimization completed!');
}

keepLatest15Jobs().catch(console.error);
