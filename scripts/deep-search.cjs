const { neon } = require('@neondatabase/serverless');

const NEON_DB_URL = "postgresql://neondb_owner:npg_mabQenpJ35yN@ep-fragrant-glitter-agu94zx1-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

async function deepSearch() {
  try {
    console.log('=== DEEP DATABASE SEARCH ===\n');
    
    const sql = neon(NEON_DB_URL);
    
    // Check all tables in the database
    console.log('1. All tables in database:');
    const allTables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;
    
    allTables.forEach(table => {
      console.log(`  - ${table.table_name}`);
    });
    
    // Check for any other job-related tables
    console.log('\n2. Checking for job-related tables...');
    const jobTables = allTables.filter(t => 
      t.table_name.toLowerCase().includes('job') || 
      t.table_name.toLowerCase().includes('posting') ||
      t.table_name.toLowerCase().includes('listing')
    );
    
    if (jobTables.length > 0) {
      console.log('Found job-related tables:');
      jobTables.forEach(table => {
        console.log(`  - ${table.table_name}`);
      });
      
      // Check each job table
      for (const table of jobTables) {
        console.log(`\n3. Checking table: ${table.table_name}`);
        try {
          const count = await sql`SELECT COUNT(*) as count FROM ${sql.unsafe(table.table_name)}`;
          console.log(`   Records: ${count[0].count}`);
          
          if (count[0].count > 0) {
            const sample = await sql`SELECT * FROM ${sql.unsafe(table.table_name)} LIMIT 3`;
            console.log('   Sample records:');
            sample.forEach((record, index) => {
              console.log(`     ${index + 1}. ${JSON.stringify(record, null, 2)}`);
            });
          }
        } catch (error) {
          console.log(`   Error accessing table: ${error.message}`);
        }
      }
    }
    
    // Check companies table for more records
    console.log('\n4. Detailed companies search:');
    const allCompanies = await sql`SELECT * FROM companies ORDER BY created_at DESC`;
    console.log(`Total companies: ${allCompanies.length}`);
    
    allCompanies.forEach((company, index) => {
      console.log(`${index + 1}. ${company.name} - ID: ${company.id} - Created: ${company.created_at}`);
    });
    
    // Check if there are any deleted/archived jobs
    console.log('\n5. Checking for archived/deleted jobs...');
    try {
      const archivedJobs = await sql`
        SELECT * FROM jobs 
        WHERE status = 'archived' OR status = 'deleted' OR status = 'closed'
        ORDER BY created_at DESC
      `;
      console.log(`Archived/closed jobs: ${archivedJobs.length}`);
      
      if (archivedJobs.length > 0) {
        archivedJobs.forEach((job, index) => {
          console.log(`${index + 1}. ${job.title} - Status: ${job.status}`);
        });
      }
    } catch (error) {
      console.log('No archived jobs found or error checking');
    }
    
    // Check for any backup tables
    console.log('\n6. Checking for backup tables...');
    const backupTables = allTables.filter(t => 
      t.table_name.toLowerCase().includes('backup') || 
      t.table_name.toLowerCase().includes('old') ||
      t.table_name.toLowerCase().includes('archive')
    );
    
    if (backupTables.length > 0) {
      console.log('Found backup/archive tables:');
      backupTables.forEach(table => {
        console.log(`  - ${table.table_name}`);
      });
    }
    
    // Check total record counts
    console.log('\n7. Total record counts:');
    for (const table of allTables) {
      try {
        const count = await sql`SELECT COUNT(*) as count FROM ${sql.unsafe(table.table_name)}`;
        console.log(`  ${table.table_name}: ${count[0].count} records`);
      } catch (error) {
        console.log(`  ${table.table_name}: Error counting records`);
      }
    }
    
  } catch (error) {
    console.error('Deep search failed:', error.message);
  }
}

deepSearch();
