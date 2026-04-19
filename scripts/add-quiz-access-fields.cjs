const { neon } = require('@neondatabase/serverless');

async function addQuizAccessFields() {
  console.log('🔧 Adding quiz access fields to users table...\n');
  
  try {
    // Create database connection
    const sql = neon(process.env.DATABASE_URL || "postgresql://neondb_owner:npg_mabQenpJ35yN@ep-fragrant-glitter-agu94zx1-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require");
    
    // Test connection
    await sql`SELECT 1 as test`;
    console.log('✅ Database connection successful');
    
    // Add quiz access fields to users table
    console.log('📝 Adding has_quiz_access column...');
    await sql`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS has_quiz_access BOOLEAN DEFAULT FALSE
    `;
    console.log('✅ has_quiz_access column added');
    
    console.log('📝 Adding quiz_access_expiry column...');
    await sql`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS quiz_access_expiry TIMESTAMP
    `;
    console.log('✅ quiz_access_expiry column added');
    
    // Verify the columns were added
    console.log('\n🔍 Verifying table structure...');
    const columns = await sql`
      SELECT column_name, data_type, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      AND column_name IN ('has_quiz_access', 'quiz_access_expiry')
      ORDER BY column_name
    `;
    
    console.log('\n📊 Updated users table structure:');
    columns.forEach(col => {
      console.log(`   ${col.column_name}: ${col.data_type} ${col.column_default ? `(default: ${col.column_default})` : ''}`);
    });
    
    console.log('\n✅ Quiz access fields successfully added to users table!');
    console.log('🎯 The system is now ready for Road Rules quiz management!');
    
  } catch (error) {
    console.error('❌ Error adding quiz access fields:', error.message);
    process.exit(1);
  }
}

// Run the migration
addQuizAccessFields().then(() => {
  console.log('\n🎉 Migration completed successfully!');
  process.exit(0);
}).catch((error) => {
  console.error('❌ Migration failed:', error);
  process.exit(1);
});
