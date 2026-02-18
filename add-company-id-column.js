const { neon } = require('@neondatabase/serverless');

async function addCompanyIdColumn() {
  console.log('🔧 Adding company_id column to jobs table...');
  
  try {
    // Use your actual Neon database connection
    const sql = neon('postgresql://neondb_owner:npg_mabQenpJ35yN@ep-fragrant-glitter-agu94zx1-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require');
    
    // Check if column already exists
    console.log('🔍 Checking if company_id column already exists...');
    const checkColumn = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'jobs' 
      AND column_name = 'company_id'
    `;
    
    const columnExists = checkColumn.length > 0;
    console.log('📊 company_id column exists:', columnExists);
    
    if (!columnExists) {
      console.log('➕ Adding company_id column to jobs table...');
      
      // Add company_id column as UUID type
      await sql`ALTER TABLE jobs ADD COLUMN company_id UUID`;
      
      console.log('✅ company_id column added successfully');
      
      // Add foreign key constraint
      await sql`ALTER TABLE jobs ADD CONSTRAINT fk_jobs_company_id FOREIGN KEY (company_id) REFERENCES companies(id)`;
      
      console.log('✅ Foreign key constraint added successfully');
      
      // Create index for better performance
      await sql`CREATE INDEX IF NOT EXISTS idx_jobs_company_id ON jobs(company_id)`;
      
      console.log('✅ Index on company_id created successfully');
      
      console.log('✅ Database schema updated successfully!');
      
    } else {
      console.log('ℹ️ company_id column already exists');
    }
    
  } catch (error) {
    console.error('❌ Failed to add company_id column:', error);
    throw error;
  }
}

// Run the migration
addCompanyIdColumn().then(() => {
  console.log('🎉 Migration completed!');
  process.exit(0);
}).catch((error) => {
  console.error('💥 Migration failed:', error);
  process.exit(1);
});
