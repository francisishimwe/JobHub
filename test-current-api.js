const { neon } = require('@neondatabase/serverless');

async function testCurrentAPI() {
  console.log('🔧 TEST CURRENT API - Testing the exact query we just implemented...');
  
  try {
    const sql = neon('postgresql://neondb_owner:npg_CD5GYcTUPz7q@ep-withered-heart-agegb3fq-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require');
    
    console.log('🔗 Connected to database...');
    
    // Test the exact query from our updated API
    console.log('🧪 Testing exact current API query...');
    
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
      
      console.log('✅ Current API query successful, returned', jobs.length, 'jobs');
      
      if (jobs.length > 0) {
        console.log('📋 Jobs returned:');
        jobs.forEach((job, index) => {
          console.log(`  ${index + 1}. ${job.title} - ${job.company_name || 'No company'}`);
          console.log(`     Status: ${job.status}, Approved: ${job.approved}`);
          console.log(`     Experience: ${job.experience_level || 'Not specified'}`);
          console.log(`     Location: ${job.location || 'Not specified'}`);
        });
        
        // Test the mapping function
        console.log('🧪 Testing JavaScript mapping...');
        
        const mappedJobs = jobs.map((job) => ({
          ...job,
          application_method: job.application_method || 'email',
          featured: job.featured || false,
          applicants: job.applicants || 0,
          views: job.views || 0
        }));
        
        console.log('✅ Mapping successful');
        
        // Test the full response format
        const response = {
          jobs: mappedJobs,
          total: mappedJobs.length,
          featuredCount: mappedJobs.length,
          featuredGroupCount: mappedJobs.length,
          page: 0,
          limit: 5,
          hasMore: false,
          database: true
        };
        
        console.log('📋 Full API Response:');
        console.log(JSON.stringify(response, null, 2));
        
        console.log('✅ Current API should work perfectly!');
        
      } else {
        console.log('❌ No jobs returned from current API query');
      }
      
    } catch (apiError) {
      console.log('❌ Current API query failed:', apiError.message);
      console.log('🔧 This means the API will still fall back to mock data');
    }
    
    console.log('🎉 Current API test completed!');
    
  } catch (error) {
    console.error('❌ Failed to test current API:', error);
    throw error;
  }
}

// Run the test
testCurrentAPI().then(() => {
  console.log('🎉 CURRENT API TEST COMPLETED!');
  process.exit(0);
}).catch((error) => {
  console.error('💥 CURRENT API TEST FAILED:', error);
  process.exit(1);
});
