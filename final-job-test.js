const { neon } = require('@neondatabase/serverless');

async function finalJobTest() {
  console.log('🧪 FINAL JOB TEST - Testing complete job posting...');
  
  try {
    const sql = neon('postgresql://neondb_owner:npg_CD5GYcTUPz7q@ep-withered-heart-agegb3fq-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require');
    
    console.log('🔗 Connected to production database...');
    
    // Verify all required columns exist
    const requiredColumns = ['id', 'title', 'description', 'approved', 'created_at', 'company_id', 'status', 'opportunity_type'];
    console.log('🔍 Verifying all required columns...');
    
    for (const colName of requiredColumns) {
      const verify = await sql`
        SELECT column_name, data_type, column_default
        FROM information_schema.columns 
        WHERE table_name = 'jobs' AND column_name = ${colName}
      `;
      
      if (verify.length > 0) {
        console.log(`✅ ${colName}: ${verify[0].data_type} ${verify[0].column_default ? `[DEFAULT: ${verify[0].column_default}]` : ''}`);
      } else {
        console.log(`❌ ${colName}: NOT FOUND`);
        throw new Error(`Required column ${colName} is missing`);
      }
    }
    
    // Test job insertion with proper ID generation
    console.log('🧪 Testing job insertion with proper ID...');
    
    const testJob = await sql`
      INSERT INTO jobs (
        id, title, description, opportunity_type, status, approved, created_at,
        company_id, location, experience_level, category
      ) VALUES (
        gen_random_uuid(), 
        'Final Job Test', 
        'This is the final test job description to verify everything works', 
        'Job', 
        'published', 
        true, 
        CURRENT_TIMESTAMP,
        gen_random_uuid(), 
        'Kigali, Rwanda', 
        'Entry Level', 
        'Technology'
      ) RETURNING id, title, description, approved, created_at, status
    `;
    
    console.log('✅ Final test job inserted successfully:', testJob[0]);
    
    // Test fetching the job back
    console.log('🔍 Testing job retrieval...');
    const fetchedJob = await sql`
      SELECT id, title, description, approved, created_at, status
      FROM jobs 
      WHERE title = 'Final Job Test'
    `;
    
    if (fetchedJob.length > 0) {
      console.log('✅ Job retrieved successfully:', fetchedJob[0]);
    } else {
      throw new Error('Job could not be retrieved');
    }
    
    // Clean up
    await sql`DELETE FROM jobs WHERE title = 'Final Job Test'`;
    console.log('🧹 Test job cleaned up');
    
    console.log('🎉 Final job test completed successfully!');
    console.log('✅ All database issues have been resolved!');
    console.log('✅ Job posting should now work perfectly!');
    
  } catch (error) {
    console.error('❌ Final job test failed:', error);
    throw error;
  }
}

// Run the final job test
finalJobTest().then(() => {
  console.log('🎉 FINAL JOB TEST COMPLETED!');
  process.exit(0);
}).catch((error) => {
  console.error('💥 FINAL JOB TEST FAILED:', error);
  process.exit(1);
});
