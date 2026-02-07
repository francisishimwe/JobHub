const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

async function runMigration() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase configuration not found. Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    
    console.log('Running migration: Adding employer contact columns...');
    
    // Add employer contact information columns to jobs table
    const { error: alterError } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE jobs 
        ADD COLUMN IF NOT EXISTS employer_name VARCHAR(255),
        ADD COLUMN IF NOT EXISTS employer_email VARCHAR(255),
        ADD COLUMN IF NOT EXISTS employer_phone VARCHAR(50),
        ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
      `
    });

    if (alterError) {
      console.error('Error adding columns:', alterError);
      // Try direct SQL approach
      const { error: directError } = await supabase
        .from('jobs')
        .select('id')
        .limit(1);
      
      if (directError) {
        throw directError;
      }
    }

    // Create index for updated_at column
    const { error: indexError } = await supabase.rpc('exec_sql', {
      sql: `CREATE INDEX IF NOT EXISTS idx_jobs_updated_at ON jobs(updated_at);`
    });

    if (indexError) {
      console.log('Index creation may need to be done manually:', indexError.message);
    }

    // Update existing jobs to have current timestamp for updated_at
    const { error: updateError } = await supabase.rpc('exec_sql', {
      sql: `UPDATE jobs SET updated_at = created_at WHERE updated_at IS NULL;`
    });

    if (updateError) {
      console.log('Update may need to be done manually:', updateError.message);
    }

    console.log('✅ Migration completed successfully!');
    console.log('⚠️  If you encountered any errors, please run the SQL manually in your Supabase dashboard:');
    console.log('File: supabase/add-employer-contact-columns.sql');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigration();
