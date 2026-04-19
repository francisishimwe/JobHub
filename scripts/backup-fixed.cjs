const { neon } = require('@neondatabase/serverless');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

const NEON_DB_URL = "postgresql://neondb_owner:npg_mabQenpJ35yN@ep-fragrant-glitter-agu94zx1-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

async function backupJobs() {
  try {
    console.log('=== BACKUP JOBS ===\n');
    
    const sql = neon(NEON_DB_URL);
    console.log('Connected to database');
    
    // Get current data
    console.log('\n1. Getting current data...');
    const companies = await sql`SELECT * FROM companies ORDER BY name`;
    const jobs = await sql`
      SELECT j.*, c.name as company_name
      FROM jobs j
      LEFT JOIN companies c ON j.company_id = c.id
      ORDER BY j.created_at DESC
    `;
    
    console.log(`Found ${companies.length} companies and ${jobs.length} jobs`);
    
    // Create backup object
    const backup = {
      timestamp: new Date().toISOString(),
      version: '1.0',
      companies: companies,
      jobs: jobs,
      stats: {
        total_companies: companies.length,
        total_jobs: jobs.length,
        published_jobs: jobs.filter(j => j.status === 'published').length,
        approved_jobs: jobs.filter(j => j.approved === true).length,
        featured_jobs: jobs.filter(j => j.featured === true).length
      }
    };
    
    // Save backup
    const timestamp = new Date().toISOString().split('T')[0].replace(/:/g, '-');
    const backupFile = `backups/job-backup-${timestamp}.json`;
    
    // Create directory if needed
    if (!fs.existsSync('backups')) {
      fs.mkdirSync('backups');
    }
    
    fs.writeFileSync(backupFile, JSON.stringify(backup, null, 2));
    
    console.log(`\nBackup saved: ${backupFile}`);
    console.log(`Size: ${fs.statSync(backupFile).size} bytes`);
    
    // Show summary
    console.log('\nBackup Summary:');
    console.log(`- Companies: ${backup.stats.total_companies}`);
    console.log(`- Jobs: ${backup.stats.total_jobs}`);
    console.log(`- Published jobs: ${backup.stats.published_jobs}`);
    console.log(`- Approved jobs: ${backup.stats.approved_jobs}`);
    
    // Show sample
    console.log('\nSample of backed up jobs:');
    jobs.slice(0, 5).forEach((job, index) => {
      console.log(`${index + 1}. ${job.title} at ${job.company_name}`);
    });
    
    return backupFile;
    
  } catch (error) {
    console.error('Backup failed:', error.message);
    throw error;
  }
}

// Run backup
backupJobs();
