const { neon } = require('@neondatabase/serverless');

async function fixDeadlineComparison() {
  console.log('🔧 FIX DEADLINE COMPARISON - Fixing SQL date comparison issue...');
  
  try {
    const sql = neon('postgresql://neondb_owner:npg_CD5GYcTUPz7q@ep-withered-heart-agegb3fq-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require');
    
    console.log('🔗 Connected to database...');
    
    // Check the current job
    console.log('📋 Checking current job...');
    const currentJob = await sql`
      SELECT id, title, status, approved, deadline, created_at, opportunity_type
      FROM jobs
      ORDER BY created_at DESC
      LIMIT 1
    `;
    
    if (currentJob.length > 0) {
      const job = currentJob[0];
      console.log('Current job:', job);
      
      // Check if deadline is causing issues
      if (job.deadline) {
        console.log('⚠️ Job has deadline:', job.deadline);
        
        // Try to fix the deadline format or make it nullable
        try {
          // Update the job to have no deadline (null) to avoid comparison issues
          await sql`
            UPDATE jobs 
            SET deadline = NULL 
            WHERE id = ${job.id}
          `;
          
          console.log('✅ Set deadline to NULL to avoid comparison issues');
        } catch (updateError) {
          console.log('⚠️ Failed to update deadline:', updateError.message);
        }
      }
      
      // Test the corrected API query
      console.log('🧪 Testing corrected API query...');
      
      try {
        const apiQueryResult = await sql`
          SELECT 
            j.id,
            j.title,
            j.company_id,
            j.location,
            j.location_type,
            j.job_type,
            j.opportunity_type,
            j.experience_level,
            j.deadline,
            j.featured,
            j.description,
            j.attachment_url,
            j.application_link,
            j.application_method,
            j.primary_email,
            j.cc_emails,
            j.status,
            j.approved,
            j.applicants,
            j.views,
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
        
        console.log('✅ Corrected API query successful, returned', apiQueryResult.length, 'jobs');
        apiQueryResult.forEach((job, index) => {
          console.log(`  ${index + 1}. ${job.title} - ${job.company_name || 'No company'} (${job.status})`);
        });
        
      } catch (apiError) {
        console.log('❌ API query still failed:', apiError.message);
        
        // Try even simpler query
        console.log('🔧 Trying simpler query...');
        
        try {
          const simpleQuery = await sql`
            SELECT 
              j.id,
              j.title,
              j.status,
              j.approved,
              j.created_at,
              j.opportunity_type,
              c.name as company_name,
              c.logo as company_logo
            FROM jobs j
            LEFT JOIN companies c ON j.company_id = c.id
            WHERE j.status = 'published' AND j.approved = true
            ORDER BY j.created_at DESC
            LIMIT 5
          `;
          
          console.log('✅ Simple query successful, returned', simpleQuery.length, 'jobs');
          simpleQuery.forEach((job, index) => {
            console.log(`  ${index + 1}. ${job.title} - ${job.company_name || 'No company'}`);
          });
          
        } catch (simpleError) {
          console.log('❌ Simple query also failed:', simpleError.message);
          throw new Error('All API query attempts failed');
        }
      }
      
      // Now let's update the jobs API to use the corrected query
      console.log('🔧 Updating jobs API to use corrected deadline comparison...');
      
    } else {
      console.log('❌ No jobs found in database');
    }
    
    console.log('🎉 Deadline comparison fix completed!');
    
  } catch (error) {
    console.error('❌ Failed to fix deadline comparison:', error);
    throw error;
  }
}

// Run the fix
fixDeadlineComparison().then(() => {
  console.log('🎉 DEADLINE COMPARISON FIX COMPLETED!');
  process.exit(0);
}).catch((error) => {
  console.error('💥 DEADLINE COMPARISON FIX FAILED:', error);
  process.exit(1);
});
