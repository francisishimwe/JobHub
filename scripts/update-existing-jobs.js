import { sql } from '../lib/db.js';

async function updateExistingJobs() {
  try {
    console.log('🔄 Updating existing jobs to published status with plan_tier 1...');
    
    // First, let's see how many jobs exist and their current status
    const existingJobs = await sql`
      SELECT id, title, status, plan_id, created_at 
      FROM jobs 
      ORDER BY created_at DESC
    `;
    
    console.log(`📊 Found ${existingJobs.length} existing jobs:`);
    existingJobs.forEach((job, index) => {
      console.log(`  ${index + 1}. ${job.title} - Status: ${job.status || 'NULL'}, Plan: ${job.plan_id || 'NULL'}`);
    });
    
    // Update jobs that don't have plan_id to have plan_id = 1
    const updatePlanResult = await sql`
      UPDATE jobs 
      SET plan_id = 1, updated_at = CURRENT_TIMESTAMP
      WHERE plan_id IS NULL
    `;
    
    console.log(`✅ Updated ${updatePlanResult.count || 0} jobs with plan_id = 1`);
    
    // Update jobs that don't have status to have status = 'published'
    const updateStatusResult = await sql`
      UPDATE jobs 
      SET status = 'published', approved = true, updated_at = CURRENT_TIMESTAMP
      WHERE status IS NULL OR status = ''
    `;
    
    console.log(`✅ Updated ${updateStatusResult.count || 0} jobs with status = 'published'`);
    
    // Also update any jobs with status = 'draft' to 'published'
    const updateDraftResult = await sql`
      UPDATE jobs 
      SET status = 'published', approved = true, updated_at = CURRENT_TIMESTAMP
      WHERE status = 'draft'
    `;
    
    console.log(`✅ Updated ${updateDraftResult.count || 0} draft jobs to 'published'`);
    
    // Verify the updates
    const updatedJobs = await sql`
      SELECT id, title, status, plan_id, approved, created_at 
      FROM jobs 
      ORDER BY created_at DESC
    `;
    
    console.log('\n📋 Final job status:');
    updatedJobs.forEach((job, index) => {
      console.log(`  ${index + 1}. ${job.title} - Status: ${job.status}, Plan: ${job.plan_id}, Approved: ${job.approved}`);
    });
    
    const publishedCount = updatedJobs.filter(job => job.status === 'published').length;
    const pendingCount = updatedJobs.filter(job => job.status === 'pending').length;
    
    console.log(`\n🎯 Summary:`);
    console.log(`  - Published jobs: ${publishedCount}`);
    console.log(`  - Pending jobs: ${pendingCount}`);
    console.log(`  - Total jobs: ${updatedJobs.length}`);
    
    console.log('\n✅ Script completed successfully!');
    
  } catch (error) {
    console.error('❌ Error updating jobs:', error);
    process.exit(1);
  }
}

// Run the script
updateExistingJobs().then(() => {
  process.exit(0);
}).catch((error) => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});
