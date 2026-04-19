const { neon } = require('@neondatabase/serverless');
const fs = require('fs');

const NEON_DB_URL = "postgresql://neondb_owner:npg_mabQenpJ35yN@ep-fragrant-glitter-agu94zx1-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

async function backupJobs() {
  try {
    console.log('=== BACKING UP ALL JOBS ===\n');
    
    const sql = neon(NEON_DB_URL);
    
    // Get all companies
    const companies = await sql`SELECT * FROM companies ORDER BY name`;
    console.log(`Found ${companies.length} companies`);
    
    // Get all jobs with company info
    const jobs = await sql`
      SELECT j.*, c.name as company_name
      FROM jobs j
      LEFT JOIN companies c ON j.company_id = c.id
      ORDER BY j.created_at DESC
    `;
    console.log(`Found ${jobs.length} jobs`);
    
    // Create backup object
    const backup = {
      timestamp: new Date().toISOString(),
      version: '1.0',
      companies: companies,
      jobs: jobs
    };
    
    // Save to file
    const backupFile = `backup-jobs-${new Date().toISOString().split('T')[0]}.json`;
    fs.writeFileSync(backupFile, JSON.stringify(backup, null, 2));
    
    console.log(`\nBackup saved to: ${backupFile}`);
    console.log(`Total size: ${fs.statSync(backupFile).size} bytes`);
    
    // Show summary
    console.log('\nBackup Summary:');
    console.log(`- Companies: ${companies.length}`);
    console.log(`- Jobs: ${jobs.length}`);
    console.log(`- Published jobs: ${jobs.filter(j => j.status === 'published').length}`);
    console.log(`- Approved jobs: ${jobs.filter(j => j.approved === true).length}`);
    
    return backupFile;
    
  } catch (error) {
    console.error('Backup failed:', error.message);
    throw error;
  }
}

// Run backup
backupJobs().then(file => {
  console.log(`\n=== BACKUP COMPLETED ===`);
  console.log(`File: ${file}`);
}).catch(error => {
  console.error('Backup failed:', error);
  process.exit(1);
});
