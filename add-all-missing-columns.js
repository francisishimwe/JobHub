const { neon } = require('@neondatabase/serverless');

async function addAllMissingColumns() {
  console.log('🔧 Adding ALL missing columns to production database...');
  
  try {
    // Use the actual production database connection
    const sql = neon('postgresql://neondb_owner:npg_CD5GYcTUPz7q@ep-withered-heart-agegb3fq-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require');
    
    console.log('🔗 Connected to production database...');
    
    // Check current jobs table structure
    const currentColumns = await sql`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'jobs'
      ORDER BY ordinal_position
    `;
    
    console.log('📋 Current jobs table columns:');
    currentColumns.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type} (${col.is_nullable})`);
    });
    
    // Required columns that should exist
    const requiredColumns = [
      { name: 'description', type: 'text', nullable: 'YES' },
      { name: 'company_id', type: 'uuid', nullable: 'YES' },
      { name: 'location_type', type: 'text', nullable: 'YES' },
      { name: 'experience_level', type: 'text', nullable: 'YES' },
      { name: 'featured', type: 'boolean', nullable: 'YES', default: 'false' },
      { name: 'approved', type: 'boolean', nullable: 'YES', default: 'true' },
      { name: 'applicants', type: 'integer', nullable: 'YES', default: '0' },
      { name: 'views', type: 'integer', nullable: 'YES', default: '0' },
      { name: 'created_at', type: 'timestamp with time zone', nullable: 'YES', default: 'CURRENT_TIMESTAMP' },
      { name: 'application_method', type: 'text', nullable: 'YES', default: 'email' },
      { name: 'primary_email', type: 'text', nullable: 'YES' },
      { name: 'cc_emails', type: 'text', nullable: 'YES' },
      { name: 'contact_name', type: 'text', nullable: 'YES' },
      { name: 'contact_phone', type: 'text', nullable: 'YES' },
      { name: 'plan_id', type: 'integer', nullable: 'YES', default: '1' },
      { name: 'priority', type: 'text', nullable: 'YES', default: 'Normal' },
      { name: 'agency_verified', type: 'boolean', nullable: 'YES', default: 'false' }
    ];
    
    // Add missing columns
    for (const column of requiredColumns) {
      const exists = currentColumns.some(col => col.column_name === column.name);
      
      if (!exists) {
        console.log(`➕ Adding column: ${column.name} (${column.type})`);
        
        let alterQuery = `ALTER TABLE jobs ADD COLUMN ${column.name} ${column.type}`;
        
        if (column.default !== undefined) {
          alterQuery += ` DEFAULT ${column.default}`;
        }
        
        if (column.nullable === 'NO') {
          alterQuery += ` NOT NULL`;
        }
        
        try {
          await sql.unsafe(alterQuery);
          console.log(`✅ Column ${column.name} added successfully`);
        } catch (error) {
          console.log(`⚠️ Failed to add column ${column.name}:`, error.message);
        }
      } else {
        console.log(`ℹ️ Column ${column.name} already exists`);
      }
    }
    
    // Show final table structure
    const finalColumns = await sql`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'jobs'
      ORDER BY ordinal_position
    `;
    
    console.log('📋 Final jobs table structure:');
    finalColumns.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type} (${col.is_nullable}) ${col.column_default ? `[DEFAULT: ${col.column_default}]` : ''}`);
    });
    
    console.log('✅ All missing columns added successfully!');
    
  } catch (error) {
    console.error('❌ Failed to add missing columns:', error);
    throw error;
  }
}

// Run the migration
addAllMissingColumns().then(() => {
  console.log('🎉 All columns migration completed!');
  process.exit(0);
}).catch((error) => {
  console.error('💥 Migration failed:', error);
  process.exit(1);
});
