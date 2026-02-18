const { neon } = require('@neondatabase/serverless');

async function debugJobsAPI() {
  console.log('🔍 DEBUG JOBS API - Checking what API is actually returning...');
  
  try {
    // Test the exact same query that the API uses
    const sql = neon('postgresql://neondb_owner:npg_CD5GYcTUPz7q@ep-withered-heart-agegb3fq-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require');
    
    console.log('🔗 Connected to database...');
    
    // Test the exact query from the API
    console.log('🧪 Testing exact API query...');
    
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
        LIMIT 15 OFFSET 0
      `;
      
      console.log('✅ API query successful, returned', jobs.length, 'jobs');
      
      if (jobs.length > 0) {
        jobs.forEach((job, index) => {
          console.log(`  ${index + 1}. ${job.title} - ${job.company_name || 'No company'} (${job.status})`);
        });
      } else {
        console.log('❌ No jobs returned from API query');
      }
      
      // Test the count query
      console.log('🧪 Testing count query...');
      
      const countResult = await sql`
        SELECT COUNT(*) as total FROM jobs 
        WHERE (status = 'published' OR status = 'active')
        AND approved = true
        AND (deadline IS NULL OR deadline = '' OR deadline IS NOT NULL)
      `;
      
      console.log('✅ Count query result:', countResult[0]);
      
      // Test what happens if we query all jobs
      console.log('🧪 Testing all jobs query...');
      
      const allJobs = await sql`
        SELECT id, title, status, approved, created_at, opportunity_type
        FROM jobs
        ORDER BY created_at DESC
        LIMIT 5
      `;
      
      console.log('✅ All jobs query returned', allJobs.length, 'jobs:');
      allJobs.forEach((job, index) => {
        console.log(`  ${index + 1}. ${job.title} (${job.status}, approved: ${job.approved})`);
      });
      
      // Check if there's a specific issue with the WHERE clause
      console.log('🧪 Testing simplified WHERE clause...');
      
      const simplifiedJobs = await sql`
        SELECT id, title, status, approved, created_at
        FROM jobs
        WHERE status = 'published' AND approved = true
        ORDER BY created_at DESC
        LIMIT 5
      `;
      
      console.log('✅ Simplified query returned', simplifiedJobs.length, 'jobs:');
      simplifiedJobs.forEach((job, index) => {
        console.log(`  ${index + 1}. ${job.title} (${job.status}, approved: ${job.approved})`);
      });
      
    } catch (apiError) {
      console.log('❌ API query failed:', apiError.message);
      console.log('🔧 This explains why API falls back to mock data');
      
      // Try to understand the error
      if (apiError.message.includes('column') && apiError.message.includes('does not exist')) {
        console.log('🔍 Missing column detected - checking what columns exist...');
        
        const columns = await sql`
          SELECT column_name, data_type
          FROM information_schema.columns 
          WHERE table_name = 'jobs'
          ORDER BY ordinal_position
        `;
        
        console.log('📋 Available columns:');
        columns.forEach(col => {
          console.log(`  - ${col.column_name}: ${col.data_type}`);
        });
      }
    }
    
    console.log('🎉 Jobs API debug completed!');
    
  } catch (error) {
    console.error('❌ Failed to debug jobs API:', error);
    throw error;
  }
}

// Run the debug
debugJobsAPI().then(() => {
  console.log('🎉 JOBS API DEBUG COMPLETED!');
  process.exit(0);
}).catch((error) => {
  console.error('💥 JOBS API DEBUG FAILED:', error);
  process.exit(1);
});
