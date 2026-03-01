const { neon } = require('@neondatabase/serverless');

async function ultimateDatabaseFix() {
  console.log('🔧 ULTIMATE DATABASE FIX - Complete schema refresh...');
  
  try {
    // Create a completely fresh connection
    const sql = neon('postgresql://neondb_owner:npg_CD5GYcTUPz7q@ep-withered-heart-agegb3fq-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require');
    
    console.log('🔗 Fresh database connection established...');
    
    // Get current columns
    const currentColumns = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'jobs'
    `;
    
    const existingColumns = currentColumns.map(col => col.column_name);
    console.log('📋 Current columns:', existingColumns);
    
    // ALL required columns with their exact definitions
    const allRequiredColumns = [
      { name: 'id', type: 'UUID PRIMARY KEY DEFAULT gen_random_uuid()', nullable: 'NO' },
      { name: 'title', type: 'TEXT NOT NULL', nullable: 'NO' },
      { name: 'company_id', type: 'UUID', nullable: 'YES' },
      { name: 'location', type: 'TEXT', nullable: 'YES' },
      { name: 'location_type', type: "TEXT DEFAULT 'On-site'", nullable: 'YES' },
      { name: 'job_type', type: "TEXT DEFAULT 'Full-time'", nullable: 'YES' },
      { name: 'opportunity_type', type: 'TEXT NOT NULL', nullable: 'NO' },
      { name: 'experience_level', type: 'TEXT', nullable: 'YES' },
      { name: 'deadline', type: 'TEXT', nullable: 'YES' },
      { name: 'description', type: 'TEXT', nullable: 'YES' },
      { name: 'featured', type: 'BOOLEAN DEFAULT false', nullable: 'YES' },
      { name: 'status', type: "TEXT DEFAULT 'published'", nullable: 'YES' },
      { name: 'approved', type: 'BOOLEAN DEFAULT true', nullable: 'YES' },
      { name: 'applicants', type: 'INTEGER DEFAULT 0', nullable: 'YES' },
      { name: 'views', type: 'INTEGER DEFAULT 0', nullable: 'YES' },
      { name: 'created_at', type: 'TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP', nullable: 'YES' },
      { name: 'posted_date', type: 'TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP', nullable: 'YES' },
      { name: 'attachment_url', type: 'TEXT', nullable: 'YES' },
      { name: 'application_link', type: 'TEXT', nullable: 'YES' },
      { name: 'application_method', type: "TEXT DEFAULT 'email'", nullable: 'YES' },
      { name: 'primary_email', type: 'TEXT', nullable: 'YES' },
      { name: 'cc_emails', type: 'TEXT', nullable: 'YES' },
      { name: 'contact_name', type: 'TEXT', nullable: 'YES' },
      { name: 'contact_phone', type: 'TEXT', nullable: 'YES' },
      { name: 'plan_id', type: 'INTEGER DEFAULT 1', nullable: 'YES' },
      { name: 'priority', type: "TEXT DEFAULT 'Normal'", nullable: 'YES' },
      { name: 'agency_verified', type: 'BOOLEAN DEFAULT false', nullable: 'YES' },
      { name: 'category', type: 'TEXT', nullable: 'YES' }
    ];
    
    // Add all missing columns
    for (const column of allRequiredColumns) {
      if (!existingColumns.includes(column.name)) {
        console.log(`➕ Adding column: ${column.name} (${column.type})`);
        
        try {
          await sql.unsafe(`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS ${column.name} ${column.type}`);
          console.log(`✅ Column ${column.name} added successfully`);
        } catch (error) {
          console.log(`⚠️ Failed to add column ${column.name}:`, error.message);
          
          // Try with simpler syntax
          try {
            await sql.unsafe(`ALTER TABLE jobs ADD COLUMN ${column.name} ${column.type.split(' DEFAULT')[0]}`);
            console.log(`✅ Column ${column.name} added with simple syntax`);
          } catch (simpleError) {
            console.log(`❌ Simple syntax also failed for ${column.name}:`, simpleError.message);
          }
        }
      } else {
        console.log(`ℹ️ Column ${column.name} already exists`);
      }
    }
    
    // Force refresh the schema cache
    console.log('🔄 Refreshing schema cache...');
    await sql`SELECT 1 as refresh`;
    
    // Verify all critical columns exist
    const criticalColumns = ['id', 'title', 'description', 'approved', 'company_id', 'status', 'opportunity_type'];
    console.log('🔍 Verifying critical columns...');
    
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
        throw new Error(`Critical column ${colName} is missing`);
      }
    }
    
    // Test a complete job insertion
    console.log('🧪 Testing complete job insertion...');
    
    const testJob = await sql`
      INSERT INTO jobs (
        title, description, opportunity_type, status, approved, 
        company_id, location, experience_level, category
      ) VALUES (
        'Ultimate Test Job', 
        'This is the ultimate test job description', 
        'Job', 
        'published', 
        true, 
        gen_random_uuid(), 
        'Kigali, Rwanda', 
        'Entry Level', 
        'Technology'
      ) RETURNING id, title, description, approved, status
    `;
    
    console.log('✅ Complete test job inserted successfully:', testJob[0]);
    
    // Clean up
    await sql`DELETE FROM jobs WHERE title = 'Ultimate Test Job'`;
    console.log('🧹 Test job cleaned up');
    
    // Show final table structure
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
    
    console.log('🎉 Ultimate database fix completed successfully!');
    
  } catch (error) {
    console.error('❌ Ultimate database fix failed:', error);
    throw error;
  }
}

// Run the ultimate fix
ultimateDatabaseFix().then(() => {
  console.log('🎉 ULTIMATE DATABASE FIX COMPLETED!');
  process.exit(0);
}).catch((error) => {
  console.error('💥 ULTIMATE FIX FAILED:', error);
  process.exit(1);
});
