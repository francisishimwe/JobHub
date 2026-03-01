const { neon } = require('@neondatabase/serverless');

async function fixProductionDatabase() {
  console.log('🔧 Fixing PRODUCTION database that Vercel is actually using...');
  
  try {
    // Use the actual connection string from debug endpoint
    const sql = neon('postgresql://neondb_owner:npg_CD5GYcTUPz7q@ep-withered-heart-agegb3fq-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require');
    
    console.log('🔗 Connected to production database...');
    
    // Check if jobs table exists
    const checkJobsTable = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_name = 'jobs'
    `;
    
    console.log('📊 Jobs table exists:', checkJobsTable.length > 0);
    
    if (checkJobsTable.length > 0) {
      // Check if company_id column exists
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
        
        // Add foreign key constraint (only if companies table exists)
        try {
          const checkCompaniesTable = await sql`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_name = 'companies'
          `;
          
          if (checkCompaniesTable.length > 0) {
            await sql`ALTER TABLE jobs ADD CONSTRAINT fk_jobs_company_id FOREIGN KEY (company_id) REFERENCES companies(id)`;
            console.log('✅ Foreign key constraint added successfully');
          }
        } catch (fkError) {
          console.log('⚠️ Foreign key constraint failed:', fkError.message);
        }
        
        // Create index for better performance
        await sql`CREATE INDEX IF NOT EXISTS idx_jobs_company_id ON jobs(company_id)`;
        
        console.log('✅ Index on company_id created successfully');
        
        console.log('✅ Production database schema updated successfully!');
        
      } else {
        console.log('ℹ️ company_id column already exists in production');
      }
      
      // Show current jobs table structure
      const tableStructure = await sql`
        SELECT column_name, data_type, is_nullable 
        FROM information_schema.columns 
        WHERE table_name = 'jobs'
        ORDER BY ordinal_position
      `;
      
      console.log('📋 Jobs table structure:');
      tableStructure.forEach(col => {
        console.log(`  - ${col.column_name}: ${col.data_type} (${col.is_nullable})`);
      });
      
    } else {
      console.log('❌ Jobs table does not exist in this database');
    }
    
  } catch (error) {
    console.error('❌ Failed to fix production database:', error);
    throw error;
  }
}

// Run the fix
fixProductionDatabase().then(() => {
  console.log('🎉 Production database fix completed!');
  process.exit(0);
}).catch((error) => {
  console.error('💥 Production database fix failed:', error);
  process.exit(1);
});
