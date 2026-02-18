const { neon } = require('@neondatabase/serverless');

async function directConnectionTest() {
  console.log('🔧 DIRECT CONNECTION TEST - Ensuring proper database connection...');
  
  try {
    // Create multiple fresh connections to test
    console.log('🔗 Testing multiple fresh connections...');
    
    const connectionString = 'postgresql://neondb_owner:npg_CD5GYcTUPz7q@ep-withered-heart-agegb3fq-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require';
    
    // Connection 1: Check current state
    console.log('\n📋 Connection 1: Checking current state...');
    const sql1 = neon(connectionString);
    const currentColumns = await sql1`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'jobs'
      ORDER BY ordinal_position
    `;
    
    console.log('Current columns:');
    currentColumns.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type} (${col.is_nullable}) ${col.column_default ? `[DEFAULT: ${col.column_default}]` : ''}`);
    });
    
    // Connection 2: Add created_at column
    console.log('\n➕ Connection 2: Adding created_at column...');
    const sql2 = neon(connectionString);
    
    // First, try to drop it if it exists (to ensure clean state)
    try {
      await sql2`ALTER TABLE jobs DROP COLUMN IF EXISTS created_at`;
      console.log('✅ Dropped existing created_at column');
    } catch (dropError) {
      console.log('ℹ️ No existing created_at column to drop');
    }
    
    // Add the column
    try {
      await sql2`ALTER TABLE jobs ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP`;
      console.log('✅ Added created_at column');
    } catch (addError) {
      console.log('❌ Failed to add created_at:', addError.message);
      
      // Try alternative approach
      try {
        await sql2.unsafe(`ALTER TABLE jobs ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP`);
        console.log('✅ Added created_at with unsafe');
      } catch (unsafeError) {
        console.log('❌ Unsafe also failed:', unsafeError.message);
        throw new Error('Cannot add created_at column');
      }
    }
    
    // Connection 3: Verify the column exists
    console.log('\n🔍 Connection 3: Verifying created_at column...');
    const sql3 = neon(connectionString);
    
    // Wait a moment for database to sync
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const verifyColumn = await sql3`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'jobs' AND column_name = 'created_at'
    `;
    
    if (verifyColumn.length > 0) {
      console.log('✅ created_at column verified:', verifyColumn[0]);
    } else {
      console.log('❌ created_at column still not found');
      
      // Check all columns again
      const allColumnsAgain = await sql3`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_name = 'jobs'
        ORDER BY ordinal_position
      `;
      
      console.log('All columns after attempt:');
      allColumnsAgain.forEach(col => {
        console.log(`  - ${col.column_name}: ${col.data_type} (${col.is_nullable}) ${col.column_default ? `[DEFAULT: ${col.column_default}]` : ''}`);
      });
      
      throw new Error('created_at column verification failed');
    }
    
    // Connection 4: Test job insertion
    console.log('\n🧪 Connection 4: Testing job insertion...');
    const sql4 = neon(connectionString);
    
    const testJob = await sql4`
      INSERT INTO jobs (title, description, opportunity_type, status, approved, created_at)
      VALUES ('Direct Connection Test', 'Test description', 'Job', 'published', true, CURRENT_TIMESTAMP)
      RETURNING id, title, description, approved, created_at, status
    `;
    
    console.log('✅ Test job inserted successfully:', testJob[0]);
    
    // Clean up
    await sql4`DELETE FROM jobs WHERE title = 'Direct Connection Test'`;
    console.log('🧹 Test job cleaned up');
    
    console.log('\n🎉 Direct connection test completed successfully!');
    
  } catch (error) {
    console.error('❌ Direct connection test failed:', error);
    throw error;
  }
}

// Run the direct connection test
directConnectionTest().then(() => {
  console.log('🎉 DIRECT CONNECTION TEST COMPLETED!');
  process.exit(0);
}).catch((error) => {
  console.error('💥 DIRECT CONNECTION TEST FAILED:', error);
  process.exit(1);
});
