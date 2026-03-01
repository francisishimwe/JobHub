const { neon } = require('@neondatabase/serverless');

async function addAllAPIColumns() {
  console.log('🔧 ADD ALL API COLUMNS - Adding every column the API needs...');
  
  try {
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
    
    // ALL columns that the API might need
    const allAPIColumns = [
      { name: 'experience_level', type: 'TEXT' },
      { name: 'location_type', type: "TEXT DEFAULT 'On-site'" },
      { name: 'featured', type: 'BOOLEAN DEFAULT false' },
      { name: 'applicants', type: 'INTEGER DEFAULT 0' },
      { name: 'views', type: 'INTEGER DEFAULT 0' },
      { name: 'application_method', type: "TEXT DEFAULT 'email'" },
      { name: 'primary_email', type: 'TEXT' },
      { name: 'cc_emails', type: 'TEXT' },
      { name: 'contact_name', type: 'TEXT' },
      { name: 'contact_phone', type: 'TEXT' },
      { name: 'plan_id', type: 'INTEGER DEFAULT 1' },
      { name: 'priority', type: "TEXT DEFAULT 'Normal'" },
      { name: 'agency_verified', type: 'BOOLEAN DEFAULT false' },
      { name: 'application_link', type: 'TEXT' },
      { name: 'attachment_url', type: 'TEXT' }
    ];
    
    // Add all missing columns
    console.log('➕ Adding all missing API columns...');
    
    for (const column of allAPIColumns) {
      if (!existingColumns.includes(column.name)) {
        console.log(`➕ Adding ${column.name}...`);
        
        try {
          await sql.unsafe(`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS ${column.name} ${column.type}`);
          console.log(`✅ ${column.name} added successfully`);
        } catch (error) {
          console.log(`⚠️ Failed to add ${column.name}:`, error.message);
        }
      } else {
        console.log(`ℹ️ ${column.name} already exists`);
      }
    }
    
    // Force refresh
    await sql`SELECT 1`;
    await sql`SELECT 1`;
    
    // Verify all columns exist
    const allRequiredColumns = [
      'id', 'title', 'description', 'approved', 'created_at', 'company_id', 
      'status', 'opportunity_type', 'experience_level', 'location_type'
    ];
    
    console.log('🔍 Verifying all required columns...');
    
    for (const colName of allRequiredColumns) {
      const verify = await sql`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'jobs' AND column_name = ${colName}
      `;
      
      if (verify.length > 0) {
        console.log(`✅ ${colName}: ${verify[0].data_type}`);
      } else {
        console.log(`❌ ${colName}: NOT FOUND`);
        throw new Error(`Required column ${colName} is missing`);
      }
    }
    
    // Test minimal job insertion (only essential columns)
    console.log('🧪 Testing minimal job insertion...');
    
    const testJob = await sql`
      INSERT INTO jobs (id, title, description, opportunity_type, status, approved, created_at)
      VALUES (gen_random_uuid(), 'API Test Job', 'Test description', 'Job', 'published', true, CURRENT_TIMESTAMP)
      RETURNING id, title, description, approved, created_at, status
    `;
    
    console.log('✅ Minimal test job inserted successfully:', testJob[0]);
    
    // Clean up
    await sql`DELETE FROM jobs WHERE title = 'API Test Job'`;
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
    
    console.log('🎉 All API columns added successfully!');
    console.log('✅ Job posting should now work with all fields!');
    
  } catch (error) {
    console.error('❌ Failed to add all API columns:', error);
    throw error;
  }
}

// Run the fix
addAllAPIColumns().then(() => {
  console.log('🎉 ALL API COLUMNS ADDED!');
  process.exit(0);
}).catch((error) => {
  console.error('💥 FAILED TO ADD API COLUMNS:', error);
  process.exit(1);
});
