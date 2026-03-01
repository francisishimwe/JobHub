const { sql } = require('@vercel/postgres');

async function runMigration() {
  try {
    console.log('🔄 Adding company_logo column to jobs table...');
    
    // Add the company_logo column
    await sql`
      ALTER TABLE jobs ADD COLUMN IF NOT EXISTS company_logo TEXT;
    `;
    
    console.log('✅ company_logo column added successfully!');
    
    // Update existing jobs to set company_logo from company data
    console.log('🔄 Updating existing jobs with company logos...');
    
    const updateResult = await sql`
      UPDATE jobs 
      SET company_logo = c.logo 
      FROM companies c 
      WHERE jobs.company_id = c.id 
      AND jobs.company_logo IS NULL 
      AND c.logo IS NOT NULL;
    `;
    
    console.log(`✅ Updated ${updateResult.rowCount || 0} existing jobs with company logos!`);
    
    console.log('🎉 Company logo migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigration();
