const { neon } = require('@neondatabase/serverless');

async function checkTables() {
  console.log('🔍 Checking existing tables in database...\n');
  
  try {
    const sql = neon(process.env.DATABASE_URL || "postgresql://neondb_owner:npg_mabQenpJ35yN@ep-fragrant-glitter-agu94zx1-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require");
    
    await sql`SELECT 1 as test`;
    console.log('✅ Database connection successful');
    
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;
    
    console.log('\n📊 Existing tables:');
    if (tables.length === 0) {
      console.log('   No tables found in database');
    } else {
      tables.forEach(table => {
        console.log(`   - ${table.table_name}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error checking tables:', error.message);
  }
}

checkTables();
