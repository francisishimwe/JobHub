const { neon } = require('@neondatabase/serverless');

async function cleanDatabase() {
  console.log('🧹 Starting database cleanup...');
  
  try {
    const sql = neon(process.env.DATABASE_URL || process.env.NEON_DATABASE_URL || process.env.POSTGRES_URL);
    
    // Delete all jobs
    console.log('🗑️ Deleting all jobs...');
    await sql`DELETE FROM jobs`;
    console.log('✅ All jobs deleted');
    
    // Delete all companies
    console.log('🗑️ Deleting all companies...');
    await sql`DELETE FROM companies`;
    console.log('✅ All companies deleted');
    
    console.log('✅ Database cleanup completed!');
    
  } catch (error) {
    console.error('❌ Database cleanup failed:', error);
    throw error;
  }
}

// Run the cleanup
cleanDatabase().then(() => {
  console.log('🎉 Cleanup process finished');
  process.exit(0);
}).catch((error) => {
  console.error('💥 Cleanup failed:', error);
  process.exit(1);
});
