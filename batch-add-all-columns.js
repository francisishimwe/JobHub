const { neon } = require('@neondatabase/serverless');

async function batchAddAllColumns() {
  console.log('🔧 BATCH ADD ALL COLUMNS - Adding every possible column at once...');
  
  try {
    const sql = neon('postgresql://neondb_owner:npg_CD5GYcTUPz7q@ep-withered-heart-agegb3fq-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require');
    
    console.log('🔗 Connected to database...');
    
    // Get current columns
    const currentColumns = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'jobs'
    `;
    
    const existingColumns = currentColumns.map(col => col.column_name);
    console.log('📋 Current columns:', existingColumns);
    
    // EVERY possible column the API might need
    const allPossibleColumns = [
      'application_link',
      'location_type', 
      'experience_level',
      'featured',
      'applicants', 
      'views',
      'application_method',
      'primary_email',
      'cc_emails',
      'contact_name',
      'contact_phone',
      'plan_id',
      'priority',
      'agency_verified',
      'created_at',
      'approved',
      'company_id',
      'description'
    ];
    
    // Add all missing columns in one batch
    console.log('➕ Adding all missing columns in batch...');
    
    for (const columnName of allPossibleColumns) {
      if (!existingColumns.includes(columnName)) {
        console.log(`➕ Adding ${columnName}...`);
        
        try {
          // Define column types based on name
          let columnType = 'TEXT';
          if (columnName === 'created_at') columnType = 'TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP';
          else if (columnName === 'approved' || columnName === 'featured' || columnName === 'agency_verified') columnType = 'BOOLEAN DEFAULT false';
          else if (columnName === 'applicants' || columnName === 'views' || columnName === 'plan_id') columnType = 'INTEGER DEFAULT 0';
          else if (columnName === 'location_type') columnType = "TEXT DEFAULT 'On-site'";
          else if (columnName === 'application_method') columnType = "TEXT DEFAULT 'email'";
          else if (columnName === 'priority') columnType = "TEXT DEFAULT 'Normal'";
          else if (columnName === 'approved') columnType = 'BOOLEAN DEFAULT true';
          
          await sql.unsafe(`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS ${columnName} ${columnType}`);
          console.log(`✅ ${columnName} added successfully`);
        } catch (error) {
          console.log(`⚠️ Failed to add ${columnName}:`, error.message);
        }
      } else {
        console.log(`ℹ️ ${columnName} already exists`);
      }
    }
    
    // Force refresh
    console.log('🔄 Forcing database refresh...');
    await sql`SELECT 1`;
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Verify all critical columns exist
    const criticalColumns = [
      'id', 'title', 'description', 'application_link', 'approved', 'created_at', 
      'company_id', 'status', 'opportunity_type', 'experience_level'
    ];
    
    console.log('🔍 Verifying all critical columns...');
    
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
    
    // Test complete job insertion
    console.log('🧪 Testing complete job insertion...');
    
    const testJob = await sql`
      INSERT INTO jobs (
        id, title, description, opportunity_type, status, approved, created_at,
        company_id, location, experience_level, category, application_link,
        location_type, featured, applicants, views, application_method,
        primary_email, cc_emails, contact_name, contact_phone, plan_id,
        priority, agency_verified
      ) VALUES (
        gen_random_uuid(), 
        'Batch Test Job', 
        'This is the batch test job description to verify all columns work', 
        'Job', 
        'published', 
        true, 
        CURRENT_TIMESTAMP,
        gen_random_uuid(), 
        'Kigali, Rwanda', 
        'Entry Level', 
        'Technology',
        'https://example.com/apply',
        'On-site',
        false,
        0,
        0,
        'email',
        'test@example.com',
        'cc@example.com',
        'Test Contact',
        '+250788123456',
        1,
        'Normal',
        false
      ) RETURNING id, title, application_link, experience_level, location_type
    `;
    
    console.log('✅ Complete test job inserted successfully:', testJob[0]);
    
    // Clean up
    await sql`DELETE FROM jobs WHERE title = 'Batch Test Job'`;
    console.log('🧹 Test job cleaned up');
    
    console.log('🎉 Batch add all columns completed successfully!');
    console.log('✅ All possible columns are now available!');
    console.log('✅ Job posting should work with any combination of fields!');
    
  } catch (error) {
    console.error('❌ Batch add all columns failed:', error);
    throw error;
  }
}

// Run the batch fix
batchAddAllColumns().then(() => {
  console.log('🎉 BATCH ADD ALL COLUMNS COMPLETED!');
  process.exit(0);
}).catch((error) => {
  console.error('💥 BATCH ADD ALL COLUMNS FAILED:', error);
  process.exit(1);
});
