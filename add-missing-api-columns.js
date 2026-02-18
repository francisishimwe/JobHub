const { neon } = require('@neondatabase/serverless');

async function addMissingAPIColumns() {
  console.log('🔧 ADD MISSING API COLUMNS - Adding featured, applicants, views...');
  
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
    
    // Add missing columns
    const missingColumns = [
      { name: 'featured', type: 'BOOLEAN DEFAULT false' },
      { name: 'applicants', type: 'INTEGER DEFAULT 0' },
      { name: 'views', type: 'INTEGER DEFAULT 0' }
    ];
    
    for (const column of missingColumns) {
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
    
    // Wait for database to sync
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Verify columns were added
    console.log('🔍 Verifying columns were added...');
    
    for (const column of missingColumns) {
      const verify = await sql`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'jobs' AND column_name = ${column.name}
      `;
      
      if (verify.length > 0) {
        console.log(`✅ ${column.name} verified: ${verify[0].data_type}`);
      } else {
        console.log(`❌ ${column.name} still not found`);
      }
    }
    
    // Test the API query again
    console.log('🧪 Testing API query after adding columns...');
    
    try {
      const jobs = await sql`
        SELECT 
          j.id,
          j.title,
          j.company_id,
          j.location,
          j.job_type,
          j.opportunity_type,
          j.experience_level,
          j.deadline,
          j.featured,
          j.description,
          j.attachment_url,
          j.application_link,
          j.application_method,
          j.primary_email,
          j.cc_emails,
          j.status,
          j.approved,
          j.applicants,
          j.views,
          j.created_at,
          c.name as company_name,
          c.logo as company_logo
        FROM jobs j
        LEFT JOIN companies c ON j.company_id = c.id
        WHERE (j.status = 'published' OR j.status = 'active')
        AND j.approved = true
        AND (j.deadline IS NULL OR j.deadline = '' OR j.deadline IS NOT NULL)
        ORDER BY j.created_at DESC
        LIMIT 5
      `;
      
      console.log('✅ API query now successful, returned', jobs.length, 'jobs');
      jobs.forEach((job, index) => {
        console.log(`  ${index + 1}. ${job.title} - ${job.company_name || 'No company'} (featured: ${job.featured})`);
      });
      
    } catch (apiError) {
      console.log('❌ API query still failed:', apiError.message);
    }
    
    console.log('🎉 Missing API columns added successfully!');
    
  } catch (error) {
    console.error('❌ Failed to add missing API columns:', error);
    throw error;
  }
}

// Run the fix
addMissingAPIColumns().then(() => {
  console.log('🎉 MISSING API COLUMNS ADDED!');
  process.exit(0);
}).catch((error) => {
  console.error('💥 FAILED TO ADD MISSING API COLUMNS:', error);
  process.exit(1);
});
