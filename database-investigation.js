const { neon } = require('@neondatabase/serverless');

async function investigateDatabase() {
  console.log('🔍 DATABASE INVESTIGATION - Finding the real issue...');
  
  try {
    // Test multiple possible connection strings
    const possibleConnections = [
      'postgresql://neondb_owner:npg_CD5GYcTUPz7q@ep-withered-heart-agegb3fq-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require',
      'postgresql://neondb_owner:npg_mabQenpJ35yN@ep-fragrant-glitter-agu94zx1-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
    ];
    
    for (let i = 0; i < possibleConnections.length; i++) {
      const connectionString = possibleConnections[i];
      console.log(`\n🔗 Testing connection ${i + 1}: ${connectionString.substring(0, 50)}...`);
      
      try {
        const sql = neon(connectionString);
        
        // Test basic connection
        const test = await sql`SELECT 1 as test, NOW() as time`;
        console.log(`✅ Connection ${i + 1} successful:`, test[0]);
        
        // Check if jobs table exists
        const jobsCheck = await sql`
          SELECT table_name 
          FROM information_schema.tables 
          WHERE table_name = 'jobs'
        `;
        
        if (jobsCheck.length > 0) {
          console.log(`✅ Jobs table exists in connection ${i + 1}`);
          
          // Get all columns
          const columns = await sql`
            SELECT column_name, data_type, is_nullable, column_default
            FROM information_schema.columns 
            WHERE table_name = 'jobs'
            ORDER BY ordinal_position
          `;
          
          console.log(`📋 Columns in connection ${i + 1}:`);
          columns.forEach(col => {
            console.log(`  - ${col.column_name}: ${col.data_type} (${col.is_nullable}) ${col.column_default ? `[DEFAULT: ${col.column_default}]` : ''}`);
          });
          
          // Check if approved column exists
          const approvedCheck = columns.find(col => col.column_name === 'approved');
          if (approvedCheck) {
            console.log(`✅ Approved column exists in connection ${i + 1}:`, approvedCheck);
            
            // Test adding a job with approved column
            try {
              const testJob = await sql`
                INSERT INTO jobs (title, description, opportunity_type, status, approved)
                VALUES ('Investigation Test', 'Test description', 'Job', 'published', true)
                RETURNING id, title, approved, status
              `;
              console.log(`✅ Job insertion successful in connection ${i + 1}:`, testJob[0]);
              
              // Clean up
              await sql`DELETE FROM jobs WHERE title = 'Investigation Test'`;
              console.log(`🧹 Test job cleaned up in connection ${i + 1}`);
              
              console.log(`🎯 CONNECTION ${i + 1} IS THE WORKING DATABASE!`);
              return;
              
            } catch (insertError) {
              console.log(`❌ Job insertion failed in connection ${i + 1}:`, insertError.message);
            }
          } else {
            console.log(`❌ Approved column missing in connection ${i + 1}`);
            
            // Try to add it
            try {
              await sql`ALTER TABLE jobs ADD COLUMN approved BOOLEAN DEFAULT true`;
              console.log(`✅ Added approved column to connection ${i + 1}`);
              
              // Verify it was added
              const verify = await sql`
                SELECT column_name, data_type 
                FROM information_schema.columns 
                WHERE table_name = 'jobs' AND column_name = 'approved'
              `;
              
              if (verify.length > 0) {
                console.log(`✅ Approved column verified in connection ${i + 1}:`, verify[0]);
                console.log(`🎯 CONNECTION ${i + 1} IS NOW FIXED!`);
                return;
              }
            } catch (addError) {
              console.log(`❌ Failed to add approved column in connection ${i + 1}:`, addError.message);
            }
          }
        } else {
          console.log(`❌ Jobs table does not exist in connection ${i + 1}`);
        }
        
      } catch (error) {
        console.log(`❌ Connection ${i + 1} failed:`, error.message);
      }
    }
    
    console.log('❌ No working database connection found');
    
  } catch (error) {
    console.error('❌ Database investigation failed:', error);
    throw error;
  }
}

// Run the investigation
investigateDatabase().then(() => {
  console.log('🎉 DATABASE INVESTIGATION COMPLETED!');
  process.exit(0);
}).catch((error) => {
  console.error('💥 INVESTIGATION FAILED:', error);
  process.exit(1);
});
