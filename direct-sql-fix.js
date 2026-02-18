const { neon } = require('@neondatabase/serverless');

async function directSQLFix() {
  console.log('🔧 DIRECT SQL FIX - Bypassing all caching...');
  
  try {
    // Create a completely fresh connection
    const sql = neon('postgresql://neondb_owner:npg_CD5GYcTUPz7q@ep-withered-heart-agegb3fq-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require');
    
    console.log('🔗 Fresh database connection established...');
    
    // First, let's see what's actually in the database
    console.log('🔍 Checking current database state...');
    
    const currentColumns = await sql`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'jobs'
      ORDER BY ordinal_position
    `;
    
    console.log('📋 Current database columns:');
    currentColumns.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type} (${col.is_nullable}) ${col.column_default ? `[DEFAULT: ${col.column_default}]` : ''}`);
    });
    
    // Try to add the approved column with multiple approaches
    console.log('➕ Adding approved column with multiple approaches...');
    
    // Approach 1: Simple ALTER TABLE
    try {
      await sql.unsafe(`ALTER TABLE jobs ADD COLUMN approved BOOLEAN DEFAULT true`);
      console.log('✅ Approach 1: Simple ALTER TABLE succeeded');
    } catch (error1) {
      console.log('⚠️ Approach 1 failed:', error1.message);
      
      // Approach 2: IF NOT EXISTS
      try {
        await sql.unsafe(`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS approved BOOLEAN DEFAULT true`);
        console.log('✅ Approach 2: IF NOT EXISTS succeeded');
      } catch (error2) {
        console.log('⚠️ Approach 2 failed:', error2.message);
        
        // Approach 3: Drop and recreate
        try {
          await sql.unsafe(`ALTER TABLE jobs DROP COLUMN IF EXISTS approved`);
          await sql.unsafe(`ALTER TABLE jobs ADD COLUMN approved BOOLEAN DEFAULT true`);
          console.log('✅ Approach 3: Drop and recreate succeeded');
        } catch (error3) {
          console.log('⚠️ Approach 3 failed:', error3.message);
          
          // Approach 4: Using raw SQL without unsafe
          try {
            await sql`ALTER TABLE jobs ADD COLUMN approved BOOLEAN DEFAULT true`;
            console.log('✅ Approach 4: Raw SQL succeeded');
          } catch (error4) {
            console.log('⚠️ Approach 4 failed:', error4.message);
            throw new Error('All approaches to add approved column failed');
          }
        }
      }
    }
    
    // Force a schema refresh
    console.log('🔄 Forcing schema refresh...');
    await sql`SELECT 1`;
    await sql`SELECT 1`;
    await sql`SELECT 1`;
    
    // Check again after all attempts
    console.log('🔍 Final verification...');
    
    const finalCheck = await sql`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'jobs' AND column_name = 'approved'
    `;
    
    if (finalCheck.length > 0) {
      console.log('✅ Approved column verified:', finalCheck[0]);
    } else {
      console.log('❌ Approved column still not found');
      
      // Let's check the entire table structure again
      const allColumns = await sql`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_name = 'jobs'
        ORDER BY ordinal_position
      `;
      
      console.log('📋 Full table structure after all attempts:');
      allColumns.forEach(col => {
        console.log(`  - ${col.column_name}: ${col.data_type} (${col.is_nullable}) ${col.column_default ? `[DEFAULT: ${col.column_default}]` : ''}`);
      });
      
      throw new Error('Approved column could not be added');
    }
    
    // Test job insertion with approved column
    console.log('🧪 Testing job insertion with approved column...');
    
    const testJob = await sql`
      INSERT INTO jobs (title, description, opportunity_type, status, approved)
      VALUES ('Direct SQL Test', 'Test description', 'Job', 'published', true)
      RETURNING id, title, approved, status
    `;
    
    console.log('✅ Test job with approved column successful:', testJob[0]);
    
    // Clean up
    await sql`DELETE FROM jobs WHERE title = 'Direct SQL Test'`;
    console.log('🧹 Test job cleaned up');
    
    console.log('🎉 Direct SQL fix completed successfully!');
    
  } catch (error) {
    console.error('❌ Direct SQL fix failed:', error);
    throw error;
  }
}

// Run the direct SQL fix
directSQLFix().then(() => {
  console.log('🎉 DIRECT SQL FIX COMPLETED!');
  process.exit(0);
}).catch((error) => {
  console.error('💥 DIRECT SQL FIX FAILED:', error);
  process.exit(1);
});
