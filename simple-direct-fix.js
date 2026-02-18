const { neon } = require('@neondatabase/serverless');

async function simpleDirectFix() {
  console.log('🔧 SIMPLE DIRECT FIX - No more complex approaches...');
  
  try {
    const sql = neon('postgresql://neondb_owner:npg_CD5GYcTUPz7q@ep-withered-heart-agegb3fq-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require');
    
    console.log('🔗 Connected to database...');
    
    // Just add the experience_level column directly
    console.log('➕ Adding experience_level column...');
    
    try {
      await sql`ALTER TABLE jobs ADD COLUMN experience_level TEXT`;
      console.log('✅ experience_level added successfully');
    } catch (error) {
      console.log('⚠️ First attempt failed:', error.message);
      
      try {
        await sql.unsafe(`ALTER TABLE jobs ADD COLUMN experience_level TEXT`);
        console.log('✅ experience_level added with unsafe');
      } catch (unsafeError) {
        console.log('⚠️ Unsafe failed:', unsafeError.message);
        
        try {
          await sql.unsafe(`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS experience_level TEXT`);
          console.log('✅ experience_level added with IF NOT EXISTS');
        } catch (ifError) {
          console.log('❌ All attempts failed for experience_level');
          throw new Error('Cannot add experience_level column');
        }
      }
    }
    
    // Wait a moment
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Check if it exists now
    console.log('🔍 Checking if experience_level exists...');
    
    const check = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'jobs' AND column_name = 'experience_level'
    `;
    
    if (check.length > 0) {
      console.log('✅ experience_level verified:', check[0]);
      
      // Test job insertion
      console.log('🧪 Testing job insertion...');
      
      const testJob = await sql`
        INSERT INTO jobs (id, title, description, opportunity_type, status, approved, created_at, experience_level)
        VALUES (gen_random_uuid(), 'Simple Test', 'Test description', 'Job', 'published', true, CURRENT_TIMESTAMP, 'Entry Level')
        RETURNING id, title, experience_level
      `;
      
      console.log('✅ Test job successful:', testJob[0]);
      
      // Clean up
      await sql`DELETE FROM jobs WHERE title = 'Simple Test'`;
      console.log('🧹 Test job cleaned up');
      
      console.log('🎉 Simple direct fix completed successfully!');
      
    } else {
      console.log('❌ experience_level still not found');
      
      // Show all columns for debugging
      const allColumns = await sql`
        SELECT column_name, data_type
        FROM information_schema.columns 
        WHERE table_name = 'jobs'
        ORDER BY ordinal_position
      `;
      
      console.log('📋 All columns currently in database:');
      allColumns.forEach(col => {
        console.log(`  - ${col.column_name}: ${col.data_type}`);
      });
      
      throw new Error('experience_level column could not be added');
    }
    
  } catch (error) {
    console.error('❌ Simple direct fix failed:', error);
    throw error;
  }
}

// Run the simple direct fix
simpleDirectFix().then(() => {
  console.log('🎉 SIMPLE DIRECT FIX COMPLETED!');
  process.exit(0);
}).catch((error) => {
  console.error('💥 SIMPLE DIRECT FIX FAILED:', error);
  process.exit(1);
});
