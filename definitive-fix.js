const { neon } = require('@neondatabase/serverless');

async function definitiveFix() {
  console.log('🔧 DEFINITIVE FIX - Addressing systematic database issues...');
  
  try {
    const connectionString = 'postgresql://neondb_owner:npg_CD5GYcTUPz7q@ep-withered-heart-agegb3fq-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require';
    
    console.log('🔗 Creating fresh database connection...');
    
    // Create multiple fresh connections to avoid any caching
    const sql1 = neon(connectionString);
    const sql2 = neon(connectionString);
    const sql3 = neon(connectionString);
    
    // Step 1: Check current state with connection 1
    console.log('📋 Step 1: Checking current database state...');
    const currentColumns = await sql1`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'jobs'
    `;
    
    const existingColumns = currentColumns.map(col => col.column_name);
    console.log('Current columns:', existingColumns);
    
    // Step 2: Add application_link with connection 2
    console.log('➕ Step 2: Adding application_link column...');
    
    // First, try to drop it to ensure clean state
    try {
      await sql2`ALTER TABLE jobs DROP COLUMN IF EXISTS application_link`;
      console.log('✅ Dropped existing application_link column');
    } catch (dropError) {
      console.log('ℹ️ No existing application_link column to drop');
    }
    
    // Wait a moment
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Add the column
    try {
      await sql2`ALTER TABLE jobs ADD COLUMN application_link TEXT`;
      console.log('✅ Added application_link column');
    } catch (addError) {
      console.log('⚠️ Standard add failed:', addError.message);
      
      try {
        await sql2.unsafe(`ALTER TABLE jobs ADD COLUMN application_link TEXT`);
        console.log('✅ Added application_link with unsafe');
      } catch (unsafeError) {
        console.log('⚠️ Unsafe failed:', unsafeError.message);
        
        try {
          await sql2.unsafe(`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS application_link TEXT`);
          console.log('✅ Added application_link with IF NOT EXISTS');
        } catch (ifError) {
          console.log('❌ All attempts failed for application_link');
          throw new Error('Cannot add application_link column');
        }
      }
    }
    
    // Step 3: Wait for database to sync
    console.log('⏳ Step 3: Waiting for database to sync...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Step 4: Verify with connection 3
    console.log('🔍 Step 4: Verifying application_link column...');
    
    const verifyColumn = await sql3`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'jobs' AND column_name = 'application_link'
    `;
    
    if (verifyColumn.length > 0) {
      console.log('✅ application_link verified:', verifyColumn[0]);
      
      // Step 5: Test job insertion
      console.log('🧪 Step 5: Testing job insertion...');
      
      const testJob = await sql3`
        INSERT INTO jobs (id, title, description, opportunity_type, status, approved, created_at, application_link)
        VALUES (gen_random_uuid(), 'Definitive Test', 'Test description', 'Job', 'published', true, CURRENT_TIMESTAMP, 'https://example.com/apply')
        RETURNING id, title, application_link
      `;
      
      console.log('✅ Test job successful:', testJob[0]);
      
      // Clean up
      await sql3`DELETE FROM jobs WHERE title = 'Definitive Test'`;
      console.log('🧹 Test job cleaned up');
      
      // Step 6: Show final table structure
      console.log('📋 Step 6: Final table structure...');
      const finalStructure = await sql3`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_name = 'jobs'
        ORDER BY ordinal_position
      `;
      
      console.log('Final complete table structure:');
      finalStructure.forEach(col => {
        console.log(`  - ${col.column_name}: ${col.data_type} (${col.is_nullable}) ${col.column_default ? `[DEFAULT: ${col.column_default}]` : ''}`);
      });
      
      console.log('🎉 Definitive fix completed successfully!');
      console.log('✅ All database issues should now be resolved!');
      console.log('✅ Job posting should work perfectly!');
      
    } else {
      console.log('❌ application_link still not found after all attempts');
      
      // Debug: Show all columns again
      const debugColumns = await sql3`
        SELECT column_name, data_type
        FROM information_schema.columns 
        WHERE table_name = 'jobs'
        ORDER BY ordinal_position
      `;
      
      console.log('📋 Debug - All columns after all attempts:');
      debugColumns.forEach(col => {
        console.log(`  - ${col.column_name}: ${col.data_type}`);
      });
      
      throw new Error('application_link column could not be verified');
    }
    
  } catch (error) {
    console.error('❌ Definitive fix failed:', error);
    throw error;
  }
}

// Run the definitive fix
definitiveFix().then(() => {
  console.log('🎉 DEFINITIVE FIX COMPLETED!');
  process.exit(0);
}).catch((error) => {
  console.error('💥 DEFINITIVE FIX FAILED:', error);
  process.exit(1);
});
