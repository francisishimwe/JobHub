const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

async function fixDatabaseSchema() {
  try {
    console.log('🔧 Fixing database schema...');
    
    const connectionString = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL || process.env.POSTGRES_URL;
    
    if (!connectionString) {
      console.error('❌ No database connection string found.');
      return;
    }
    
    const sql = neon(connectionString);
    
    // Check if company_id column exists in jobs table
    console.log('🔍 Checking if company_id column exists...');
    const checkResult = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'jobs' AND column_name = 'company_id'
    `;
    
    if (checkResult.length === 0) {
      console.log('➕ Adding company_id column to jobs table...');
      await sql`
        ALTER TABLE jobs 
        ADD COLUMN company_id UUID REFERENCES companies(id) ON DELETE CASCADE
      `;
      console.log('✅ company_id column added successfully');
    } else {
      console.log('✅ company_id column already exists');
    }
    
    // Check and add other missing columns
    const columnsToAdd = [
      { name: 'company_name', type: 'VARCHAR(255)', default: null },
      { name: 'application_method', type: 'VARCHAR(50)', default: "'email'" },
      { name: 'planId', type: 'INTEGER', default: '4' },
      { name: 'priority', type: 'VARCHAR(50)', default: "'Top'" }
    ];
    
    for (const column of columnsToAdd) {
      console.log(`🔍 Checking if ${column.name} column exists...`);
      const checkCol = await sql`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'jobs' AND column_name = ${column.name}
      `;
      
      if (checkCol.length === 0) {
        console.log(`➕ Adding ${column.name} column...`);
        await sql`
          ALTER TABLE jobs 
          ADD COLUMN ${sql(column.name)} ${sql(column.type)} DEFAULT ${sql(column.default)}
        `;
        console.log(`✅ ${column.name} column added successfully`);
      } else {
        console.log(`✅ ${column.name} column already exists`);
      }
    }
    
    console.log('🎉 Database schema fixed successfully!');
    
  } catch (error) {
    console.error('❌ Error fixing database schema:', error);
  }
}

fixDatabaseSchema();
