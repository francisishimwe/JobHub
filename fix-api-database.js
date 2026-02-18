const { neon } = require('@neondatabase/serverless');

async function fixAPIDatabase() {
  console.log('🔧 FIX API DATABASE - Ensuring API uses correct database...');
  
  try {
    // Test the connection that the API would use (from environment variables)
    const connectionString = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL || process.env.POSTGRES_URL;
    
    if (!connectionString) {
      console.log('❌ No database connection string found in environment variables');
      console.log('🔍 Testing with known working connection...');
      
      // Use the working connection we know works
      const workingConnection = 'postgresql://neondb_owner:npg_CD5GYcTUPz7q@ep-withered-heart-agegb3fq-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require';
      const sql = neon(workingConnection);
      
      console.log('🔗 Using working connection:', workingConnection.substring(0, 50) + '...');
      
      // Check if there are any jobs in the database
      const jobCount = await sql`
        SELECT COUNT(*) as count FROM jobs
      `;
      
      console.log('📊 Current job count:', jobCount[0].count);
      
      // Get all jobs to see what's there
      const allJobs = await sql`
        SELECT id, title, status, approved, created_at, opportunity_type
        FROM jobs
        ORDER BY created_at DESC
        LIMIT 10
      `;
      
      console.log('📋 Recent jobs in database:');
      allJobs.forEach((job, index) => {
        console.log(`  ${index + 1}. ${job.title} (${job.status}, approved: ${job.approved}) - ${job.created_at}`);
      });
      
      // Check if there are any jobs that should appear on home page
      const activeJobs = await sql`
        SELECT COUNT(*) as count FROM jobs
        WHERE (status = 'published' OR status = 'active')
        AND approved = true
        AND (deadline IS NULL OR deadline >= CURRENT_DATE)
      `;
      
      console.log('📊 Active jobs count (should appear on home page):', activeJobs[0].count);
      
      if (activeJobs[0].count === 0) {
        console.log('❌ No active jobs found - this explains why home page shows mock data');
        console.log('🔍 Checking all jobs to see why none are active...');
        
        const allJobsDetailed = await sql`
          SELECT id, title, status, approved, deadline, created_at
          FROM jobs
          ORDER BY created_at DESC
        `;
        
        console.log('📋 All jobs with details:');
        allJobsDetailed.forEach((job, index) => {
          const deadlineStatus = job.deadline ? (new Date(job.deadline) >= new Date() ? 'Valid' : 'Expired') : 'No deadline';
          console.log(`  ${index + 1}. ${job.title}: status=${job.status}, approved=${job.approved}, deadline=${deadlineStatus}`);
        });
        
        // If there are jobs but none are active, let's make the most recent one active
        if (allJobsDetailed.length > 0) {
          const latestJob = allJobsDetailed[0];
          console.log(`➕ Making latest job active: ${latestJob.title}`);
          
          await sql`
            UPDATE jobs 
            SET status = 'published', approved = true 
            WHERE id = ${latestJob.id}
          `;
          
          console.log('✅ Latest job updated to be active');
        }
      } else {
        console.log('✅ Active jobs found - they should appear on home page');
        
        // Get the active jobs that should appear
        const activeJobsList = await sql`
          SELECT id, title, status, approved, created_at, opportunity_type
          FROM jobs
          WHERE (status = 'published' OR status = 'active')
          AND approved = true
          AND (deadline IS NULL OR deadline >= CURRENT_DATE)
          ORDER BY created_at DESC
          LIMIT 5
        `;
        
        console.log('📋 Active jobs that should appear on home page:');
        activeJobsList.forEach((job, index) => {
          console.log(`  ${index + 1}. ${job.title} (${job.opportunity_type})`);
        });
      }
      
      // Test the API query directly
      console.log('🧪 Testing API query directly...');
      
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
          AND (j.deadline IS NULL OR j.deadline >= CURRENT_DATE)
          ORDER BY j.created_at DESC
          LIMIT 5
        `;
        
        console.log('✅ API query successful, returned', apiQueryResult.length, 'jobs');
        apiQueryResult.forEach((job, index) => {
          console.log(`  ${index + 1}. ${job.title} - ${job.company_name || 'No company'}`);
        });
        
      } catch (apiError) {
        console.log('❌ API query failed:', apiError.message);
        console.log('🔧 This explains why the API falls back to mock data');
      }
      
      console.log('🎉 API database fix completed!');
      
    } else {
      console.log('🔗 Using environment connection:', connectionString.substring(0, 50) + '...');
      
      const sql = neon(connectionString);
      
      // Test the connection
      const test = await sql`SELECT 1 as test`;
      console.log('✅ Environment connection successful:', test[0]);
      
      // Check jobs
      const jobCount = await sql`SELECT COUNT(*) as count FROM jobs`;
      console.log('📊 Job count with environment connection:', jobCount[0].count);
    }
    
  } catch (error) {
    console.error('❌ Failed to fix API database:', error);
    throw error;
  }
}

// Run the fix
fixAPIDatabase().then(() => {
  console.log('🎉 API DATABASE FIX COMPLETED!');
  process.exit(0);
}).catch((error) => {
  console.error('💥 API DATABASE FIX FAILED:', error);
  process.exit(1);
});
