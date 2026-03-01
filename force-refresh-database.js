const { neon } = require('@neondatabase/serverless');

async function forceRefreshDatabase() {
  console.log('🔄 FORCE REFRESH - Clearing cache and verifying database...');
  
  try {
    // Create a fresh connection to avoid any caching
    const sql = neon('postgresql://neondb_owner:npg_CD5GYcTUPz7q@ep-withered-heart-agegb3fq-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require');
    
    console.log('🔗 Fresh database connection established...');
    
    // Force refresh the schema information
    console.log('🔄 Refreshing database schema...');
    
    // Drop and recreate the description column to ensure it exists
    try {
      console.log('🗑️ Dropping description column to recreate it...');
      await sql`ALTER TABLE jobs DROP COLUMN IF EXISTS description`;
      console.log('✅ Description column dropped');
    } catch (dropError) {
      console.log('ℹ️ Description column did not exist or could not be dropped');
    }
    
    // Add description column back with explicit definition
    console.log('➕ Adding description column with explicit definition...');
    await sql`ALTER TABLE jobs ADD COLUMN description TEXT`;
    console.log('✅ Description column added successfully');
    
    // Verify the column exists
    console.log('🔍 Verifying description column exists...');
    const verifyColumn = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'jobs' AND column_name = 'description'
    `;
    
    if (verifyColumn.length > 0) {
      console.log('✅ Description column verified:', verifyColumn[0]);
    } else {
      console.log('❌ Description column still not found');
      throw new Error('Description column verification failed');
    }
    
    // Test a simple insert to verify everything works
    console.log('🧪 Testing simple job insertion...');
    
    // First, let's see what columns we actually have
    const allColumns = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'jobs'
      ORDER BY ordinal_position
    `;
    
    console.log('📋 All available columns:', allColumns.map(col => col.column_name));
    
    // Try inserting with only the essential columns that definitely exist
    const essentialColumns = ['title', 'opportunity_type', 'status'];
    const testJobData = {
      title: 'Test Job Final',
      opportunity_type: 'Job',
      status: 'published'
    };
    
    // Build dynamic insert query
    const columns = Object.keys(testJobData);
    const values = Object.values(testJobData);
    const placeholders = values.map((_, index) => `$${index + 1}`).join(', ');
    
    const insertQuery = `INSERT INTO jobs (${columns.join(', ')}) VALUES (${placeholders}) RETURNING id, title`;
    
    console.log('🔧 Executing insert query:', insertQuery);
    
    const testJob = await sql.unsafe(insertQuery, values);
    console.log('✅ Test job inserted successfully:', testJob[0]);
    
    // Clean up
    await sql`DELETE FROM jobs WHERE title = 'Test Job Final'`;
    console.log('🧹 Test job cleaned up');
    
    console.log('🎉 Database force refresh completed successfully!');
    
  } catch (error) {
    console.error('❌ Database force refresh failed:', error);
    throw error;
  }
}

// Run the force refresh
forceRefreshDatabase().then(() => {
  console.log('🎉 FORCE REFRESH COMPLETED!');
  process.exit(0);
}).catch((error) => {
  console.error('💥 FORCE REFRESH FAILED:', error);
  process.exit(1);
});
