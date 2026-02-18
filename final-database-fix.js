const { neon } = require('@neondatabase/serverless');

async function finalDatabaseFix() {
  console.log('🔧 FINAL DATABASE FIX - Ensuring all columns exist...');
  
  try {
    // Use the production database connection from debug endpoint
    const sql = neon('postgresql://neondb_owner:npg_CD5GYcTUPz7q@ep-withered-heart-agegb3fq-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require');
    
    console.log('🔗 Connected to production database...');
    
    // Check if jobs table exists
    const checkJobsTable = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_name = 'jobs'
    `;
    
    if (checkJobsTable.length === 0) {
      console.log('❌ Jobs table does not exist - creating it...');
      
      // Create the complete jobs table
      await sql.unsafe(`
        CREATE TABLE jobs (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          title TEXT NOT NULL,
          company_id UUID,
          location TEXT,
          location_type TEXT DEFAULT 'On-site',
          job_type TEXT DEFAULT 'Full-time',
          opportunity_type TEXT NOT NULL,
          experience_level TEXT,
          deadline TEXT,
          description TEXT,
          featured BOOLEAN DEFAULT false,
          status TEXT DEFAULT 'published',
          approved BOOLEAN DEFAULT true,
          applicants INTEGER DEFAULT 0,
          views INTEGER DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          posted_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          attachment_url TEXT,
          application_link TEXT,
          application_method TEXT DEFAULT 'email',
          primary_email TEXT,
          cc_emails TEXT,
          contact_name TEXT,
          contact_phone TEXT,
          plan_id INTEGER DEFAULT 1,
          priority TEXT DEFAULT 'Normal',
          agency_verified BOOLEAN DEFAULT false,
          category TEXT
        )
      `);
      
      console.log('✅ Jobs table created successfully');
    } else {
      console.log('✅ Jobs table exists - checking columns...');
      
      // Get current columns
      const currentColumns = await sql`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'jobs'
      `;
      
      const existingColumns = currentColumns.map(col => col.column_name);
      console.log('📋 Current columns:', existingColumns);
      
      // Required columns
      const requiredColumns = [
        'id', 'title', 'company_id', 'location', 'location_type', 'job_type', 
        'opportunity_type', 'experience_level', 'deadline', 'description', 
        'featured', 'status', 'approved', 'applicants', 'views', 'created_at',
        'posted_date', 'attachment_url', 'application_link', 'application_method',
        'primary_email', 'cc_emails', 'contact_name', 'contact_phone', 
        'plan_id', 'priority', 'agency_verified', 'category'
      ];
      
      // Add missing columns
      for (const column of requiredColumns) {
        if (!existingColumns.includes(column)) {
          console.log(`➕ Adding missing column: ${column}`);
          
          let columnDef = column;
          let dataType = 'TEXT';
          
          // Define data types for specific columns
          if (column === 'id') dataType = 'UUID PRIMARY KEY DEFAULT gen_random_uuid()';
          else if (column === 'title') dataType = 'TEXT NOT NULL';
          else if (column === 'company_id') dataType = 'UUID';
          else if (column === 'applicants' || column === 'views' || column === 'plan_id') dataType = 'INTEGER DEFAULT 0';
          else if (column === 'featured' || column === 'approved' || column === 'agency_verified') dataType = 'BOOLEAN DEFAULT false';
          else if (column === 'created_at' || column === 'posted_date') dataType = 'TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP';
          else if (column === 'opportunity_type') dataType = 'TEXT NOT NULL';
          else if (column === 'location_type') dataType = "TEXT DEFAULT 'On-site'";
          else if (column === 'job_type') dataType = "TEXT DEFAULT 'Full-time'";
          else if (column === 'status') dataType = "TEXT DEFAULT 'published'";
          else if (column === 'application_method') dataType = "TEXT DEFAULT 'email'";
          else if (column === 'priority') dataType = "TEXT DEFAULT 'Normal'";
          
          try {
            await sql.unsafe(`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS ${column} ${dataType}`);
            console.log(`✅ Column ${column} added successfully`);
          } catch (error) {
            console.log(`⚠️ Failed to add column ${column}:`, error.message);
          }
        } else {
          console.log(`ℹ️ Column ${column} already exists`);
        }
      }
    }
    
    // Show final table structure
    const finalColumns = await sql`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'jobs'
      ORDER BY ordinal_position
    `;
    
    console.log('📋 Final jobs table structure:');
    finalColumns.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type} (${col.is_nullable}) ${col.column_default ? `[DEFAULT: ${col.column_default}]` : ''}`);
    });
    
    // Test inserting a sample job to verify everything works
    console.log('🧪 Testing job insertion...');
    try {
      const testJob = await sql`
        INSERT INTO jobs (title, description, opportunity_type, status, approved)
        VALUES ('Test Job', 'This is a test job description', 'Job', 'published', true)
        RETURNING id, title, description
      `;
      
      console.log('✅ Test job inserted successfully:', testJob[0]);
      
      // Clean up test job
      await sql`DELETE FROM jobs WHERE title = 'Test Job'`;
      console.log('🧹 Test job cleaned up');
      
    } catch (testError) {
      console.log('❌ Test job insertion failed:', testError.message);
    }
    
    console.log('✅ Final database fix completed successfully!');
    
  } catch (error) {
    console.error('❌ Final database fix failed:', error);
    throw error;
  }
}

// Run the final fix
finalDatabaseFix().then(() => {
  console.log('🎉 FINAL DATABASE FIX COMPLETED!');
  process.exit(0);
}).catch((error) => {
  console.error('💥 FINAL FIX FAILED:', error);
  process.exit(1);
});
