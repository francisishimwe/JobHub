const { neon } = require('@neondatabase/serverless');

async function testAPIResponse() {
  console.log('🔧 TEST API RESPONSE - Checking what API actually returns...');
  
  try {
    // Test the API endpoint directly
    const connectionString = 'postgresql://neondb_owner:npg_CD5GYcTUPz7q@ep-withered-heart-agegb3fq-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require';
    const sql = neon(connectionString);
    
    console.log('🔗 Connected to database...');
    
    // Test the exact query with COALESCE
    console.log('🧪 Testing API query with COALESCE...');
    
    try {
      const jobs = await sql`
        SELECT 
          j.id,
          j.title,
          j.company_id,
          j.location,
          j.job_type,
          j.opportunity_type,
          j.experience_level,
          j.deadline,
          COALESCE(j.featured, false) as featured,
          j.description,
          j.attachment_url,
          j.application_link,
          j.application_method,
          j.primary_email,
          j.cc_emails,
          j.status,
          j.approved,
          COALESCE(j.applicants, 0) as applicants,
          COALESCE(j.views, 0) as views,
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
      
      console.log('✅ API query successful, returned', jobs.length, 'jobs');
      
      if (jobs.length > 0) {
        jobs.forEach((job, index) => {
          console.log(`  ${index + 1}. ${job.title} - ${job.company_name || 'No company'}`);
          console.log(`     Status: ${job.status}, Approved: ${job.approved}, Featured: ${job.featured}`);
        });
        
        // Test the response format
        const response = {
          jobs: jobs,
          total: jobs.length,
          featuredCount: jobs.length,
          featuredGroupCount: jobs.length,
          page: 0,
          limit: 5,
          hasMore: false,
          database: true
        };
        
        console.log('📋 API Response format:');
        console.log(JSON.stringify(response, null, 2));
        
      } else {
        console.log('❌ No jobs returned from API query');
        
        // Check what's wrong with the WHERE clause
        console.log('🔍 Testing individual WHERE conditions...');
        
        const allJobs = await sql`
          SELECT id, title, status, approved, deadline, created_at
          FROM jobs
          ORDER BY created_at DESC
          LIMIT 5
        `;
        
        console.log('📋 All jobs in database:');
        allJobs.forEach((job, index) => {
          console.log(`  ${index + 1}. ${job.title}`);
          console.log(`     Status: ${job.status}, Approved: ${job.approved}, Deadline: ${job.deadline}`);
          
          // Check if this job meets the criteria
          const statusMatch = job.status === 'published' || job.status === 'active';
          const approvedMatch = job.approved === true;
          const deadlineMatch = !job.deadline || job.deadline === '' || job.deadline !== null;
          
          console.log(`     Matches criteria: status=${statusMatch}, approved=${approvedMatch}, deadline=${deadlineMatch}`);
        });
      }
      
    } catch (apiError) {
      console.log('❌ API query failed:', apiError.message);
      console.log('🔧 This is why API falls back to mock data');
      
      // Try without COALESCE
      console.log('🧪 Trying without COALESCE...');
      
      try {
        const simpleJobs = await sql`
          SELECT 
            j.id,
            j.title,
            j.status,
            j.approved,
            j.created_at,
            c.name as company_name
          FROM jobs j
          LEFT JOIN companies c ON j.company_id = c.id
          WHERE j.status = 'published' AND j.approved = true
          ORDER BY j.created_at DESC
          LIMIT 5
        `;
        
        console.log('✅ Simple query successful, returned', simpleJobs.length, 'jobs');
        simpleJobs.forEach((job, index) => {
          console.log(`  ${index + 1}. ${job.title} - ${job.company_name || 'No company'}`);
        });
        
      } catch (simpleError) {
        console.log('❌ Simple query also failed:', simpleError.message);
      }
    }
    
    console.log('🎉 API response test completed!');
    
  } catch (error) {
    console.error('❌ Failed to test API response:', error);
    throw error;
  }
}

// Run the test
testAPIResponse().then(() => {
  console.log('🎉 API RESPONSE TEST COMPLETED!');
  process.exit(0);
}).catch((error) => {
  console.error('💥 API RESPONSE TEST FAILED:', error);
  process.exit(1);
});
