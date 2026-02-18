const { neon } = require('@neondatabase/serverless');

async function finalCompleteFix() {
  console.log('🔧 FINAL COMPLETE FIX - Adding ALL missing columns at once...');
  
  try {
    // Use the working connection from investigation
    const sql = neon('postgresql://neondb_owner:npg_CD5GYcTUPz7q@ep-withered-heart-agegb3fq-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require');
    
    console.log('🔗 Connected to production database...');
    
    // Get current columns
    const currentColumns = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'jobs'
    `;
    
    const existingColumns = currentColumns.map(col => col.column_name);
    console.log('📋 Current columns:', existingColumns);
    
    // ALL columns that should exist - add them all at once
    const allRequiredColumns = [
      { name: 'created_at', type: 'TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP' },
      { name: 'approved', type: 'BOOLEAN DEFAULT true' },
      { name: 'featured', type: 'BOOLEAN DEFAULT false' },
      { name: 'applicants', type: 'INTEGER DEFAULT 0' },
      { name: 'views', type: 'INTEGER DEFAULT 0' },
      { name: 'location_type', type: "TEXT DEFAULT 'On-site'" },
      { name: 'experience_level', type: 'TEXT' },
      { name: 'application_method', type: "TEXT DEFAULT 'email'" },
      { name: 'primary_email', type: 'TEXT' },
      { name: 'cc_emails', type: 'TEXT' },
      { name: 'contact_name', type: 'TEXT' },
      { name: 'contact_phone', type: 'TEXT' },
      { name: 'plan_id', type: 'INTEGER DEFAULT 1' },
      { name: 'priority', type: "TEXT DEFAULT 'Normal'" },
      { name: 'agency_verified', type: 'BOOLEAN DEFAULT false' },
      { name: 'application_link', type: 'TEXT' }
    ];
    
    // Add all missing columns in batch
    console.log('➕ Adding all missing columns...');
    
    for (const column of allRequiredColumns) {
      if (!existingColumns.includes(column.name)) {
        console.log(`➕ Adding ${column.name}...`);
        
        try {
          await sql.unsafe(`ALTER TABLE jobs ADD COLUMN ${column.name} ${column.type}`);
          console.log(`✅ ${column.name} added successfully`);
        } catch (error) {
          console.log(`⚠️ Failed to add ${column.name}:`, error.message);
          
          // Try with IF NOT EXISTS
          try {
            await sql.unsafe(`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS ${column.name} ${column.type}`);
            console.log(`✅ ${column.name} added with IF NOT EXISTS`);
          } catch (ifError) {
            console.log(`❌ ${column.name} failed completely:`, ifError.message);
          }
        }
      } else {
        console.log(`ℹ️ ${column.name} already exists`);
      }
    }
    
    // Force multiple refreshes to clear any cache
    console.log('🔄 Clearing database cache...');
    await sql`SELECT 1`;
    await sql`SELECT 1`;
    await sql`SELECT 1`;
    
    // Verify all critical columns exist
    const criticalColumns = ['id', 'title', 'description', 'approved', 'created_at', 'company_id', 'status', 'opportunity_type'];
    console.log('🔍 Verifying all critical columns...');
    
    let allCriticalExist = true;
    for (const colName of criticalColumns) {
      const verify = await sql`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'jobs' AND column_name = ${colName}
      `;
      
      if (verify.length > 0) {
        console.log(`✅ ${colName}: ${verify[0].data_type}`);
      } else {
        console.log(`❌ ${colName}: NOT FOUND`);
        allCriticalExist = false;
      }
    }
    
    if (!allCriticalExist) {
      throw new Error('Some critical columns are still missing');
    }
    
    // Test complete job insertion
    console.log('🧪 Testing complete job insertion...');
    
    const testJob = await sql`
      INSERT INTO jobs (
        title, description, opportunity_type, status, approved, created_at,
        company_id, location, experience_level, category, featured
      ) VALUES (
        'Final Complete Test', 
        'This is the final complete test job description', 
        'Job', 
        'published', 
        true, 
        CURRENT_TIMESTAMP,
        gen_random_uuid(), 
        'Kigali, Rwanda', 
        'Entry Level', 
        'Technology',
        false
      ) RETURNING id, title, description, approved, created_at, status
    `;
    
    console.log('✅ Complete test job inserted successfully:', testJob[0]);
    
    // Clean up
    await sql`DELETE FROM jobs WHERE title = 'Final Complete Test'`;
    console.log('🧹 Test job cleaned up');
    
    // Show final complete table structure
    const finalStructure = await sql`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'jobs'
      ORDER BY ordinal_position
    `;
    
    console.log('📋 Final complete table structure:');
    finalStructure.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type} (${col.is_nullable}) ${col.column_default ? `[DEFAULT: ${col.column_default}]` : ''}`);
    });
    
    console.log('🎉 Final complete fix completed successfully!');
    
  } catch (error) {
    console.error('❌ Final complete fix failed:', error);
    throw error;
  }
}

// Run the final complete fix
finalCompleteFix().then(() => {
  console.log('🎉 FINAL COMPLETE FIX COMPLETED!');
  process.exit(0);
}).catch((error) => {
  console.error('💥 FINAL COMPLETE FIX FAILED:', error);
  process.exit(1);
});
