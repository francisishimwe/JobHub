const { neon } = require('@neondatabase/serverless');

async function testMinimalAPI() {
  console.log('🔧 TEST MINIMAL API - Creating minimal working query...');
  
  try {
    const sql = neon('postgresql://neondb_owner:npg_CD5GYcTUPz7q@ep-withered-heart-agegb3fq-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require');
    
    console.log('🔗 Connected to database...');
    
    // First, check what columns actually exist
    console.log('📋 Checking available columns...');
    
    const columns = await sql`
      SELECT column_name, data_type
      FROM information_schema.columns 
      WHERE table_name = 'jobs'
      ORDER BY ordinal_position
    `;
    
    console.log('Available columns:');
    columns.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type}`);
    });
    
    // Create a minimal query with only existing columns
    console.log('🧪 Testing minimal query with only existing columns...');
    
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
          j.status,
          j.approved,
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
      
      console.log('✅ Minimal query successful, returned', jobs.length, 'jobs');
      
      if (jobs.length > 0) {
        console.log('📋 Jobs returned:');
        jobs.forEach((job, index) => {
          console.log(`  ${index + 1}. ${job.title} - ${job.company_name || 'No company'}`);
        });
        
        // Test the mapping with defaults for missing fields
        console.log('🧪 Testing mapping with defaults...');
        
        const mappedJobs = jobs.map((job) => ({
          ...job,
          application_method: 'email', // Default value
          featured: false, // Default value
          applicants: 0, // Default value
          views: 0, // Default value
          attachment_url: job.attachment_url || null,
          application_link: job.application_link || null,
          primary_email: job.primary_email || null,
          cc_emails: job.cc_emails || null
        }));
        
        console.log('✅ Mapping with defaults successful');
        
        // Test the full response
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
        
        console.log('📋 Minimal API Response:');
        console.log(JSON.stringify(response, null, 2));
        
        console.log('✅ Minimal API should work perfectly!');
        console.log('🎯 This is the query we should use in the API!');
        
      } else {
        console.log('❌ No jobs returned from minimal query');
      }
      
    } catch (minimalError) {
      console.log('❌ Minimal query failed:', minimalError.message);
    }
    
    console.log('🎉 Minimal API test completed!');
    
  } catch (error) {
    console.error('❌ Failed to test minimal API:', error);
    throw error;
  }
}

// Run the test
testMinimalAPI().then(() => {
  console.log('🎉 MINIMAL API TEST COMPLETED!');
  process.exit(0);
}).catch((error) => {
  console.error('💥 MINIMAL API TEST FAILED:', error);
  process.exit(1);
});
