const { neon } = require('@neondatabase/serverless');

async function createUsersTable() {
  console.log('🔧 Creating users table with quiz access fields...\n');
  
  try {
    const sql = neon(process.env.DATABASE_URL || "postgresql://neondb_owner:npg_mabQenpJ35yN@ep-fragrant-glitter-agu94zx1-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require");
    
    await sql`SELECT 1 as test`;
    console.log('✅ Database connection successful');
    
    // Create users table with quiz access fields
    console.log('📝 Creating users table...');
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255),
        role VARCHAR(50) DEFAULT 'user',
        password_hash VARCHAR(255),
        has_quiz_access BOOLEAN DEFAULT FALSE,
        quiz_access_expiry TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('✅ Users table created successfully');
    
    // Create index on email for faster lookups
    console.log('📝 Creating index on email...');
    await sql`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)
    `;
    console.log('✅ Email index created');
    
    // Verify table structure
    console.log('\n🔍 Verifying table structure...');
    const columns = await sql`
      SELECT column_name, data_type, column_default, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      ORDER BY ordinal_position
    `;
    
    console.log('\n📊 Users table structure:');
    columns.forEach(col => {
      console.log(`   ${col.column_name}: ${col.data_type} ${col.is_nullable === 'YES' ? '(nullable)' : '(not null)'} ${col.column_default ? `(default: ${col.column_default})` : ''}`);
    });
    
    console.log('\n✅ Users table with quiz access fields created successfully!');
    console.log('🎯 The system is now ready for Road Rules quiz management!');
    
  } catch (error) {
    console.error('❌ Error creating users table:', error.message);
    process.exit(1);
  }
}

createUsersTable().then(() => {
  console.log('\n🎉 Users table creation completed successfully!');
  process.exit(0);
}).catch((error) => {
  console.error('❌ Users table creation failed:', error);
  process.exit(1);
});
