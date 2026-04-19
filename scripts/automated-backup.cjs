const { neon } = require('@neondatabase/serverless');
const fs = require('fs');

const NEON_DB_URL = "postgresql://neondb_owner:npg_mabQenpJ35yN@ep-fragrant-glitter-agu94zx1-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

async function automatedBackup() {
  try {
    console.log('=== AUTOMATED BACKUP ===\n');
    
    const sql = neon(NEON_DB_URL);
    
    // Get current data
    const companies = await sql`SELECT * FROM companies ORDER BY name`;
    const jobs = await sql`
      SELECT j.*, c.name as company_name
      FROM jobs j
      LEFT JOIN companies c ON j.company_id = c.id
      ORDER BY j.created_at DESC
    `;
    
    // Create backup
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
    
    // Save with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = `backups/automated-backup-${timestamp}.json`;
    
    // Create backups directory if it doesn't exist
    if (!fs.existsSync('backups')) {
      fs.mkdirSync('backups');
    }
    
    fs.writeFileSync(backupFile, JSON.stringify(backup, null, 2));
    
    // Keep only last 10 backups
    const backupFiles = fs.readdirSync('backups')
      .filter(f => f.startsWith('automated-backup-') && f.endsWith('.json'))
      .map(f => ({
        name: f,
        path: `backups/${f}`,
        time: fs.statSync(`backups/${f}`).mtime
      }))
      .sort((a, b) => b.time - a.time);
    
    if (backupFiles.length > 10) {
      const filesToDelete = backupFiles.slice(10);
      filesToDelete.forEach(file => {
        fs.unlinkSync(file.path);
        console.log(`Deleted old backup: ${file.name}`);
      });
    }
    
    console.log(`Backup saved: ${backupFile}`);
    console.log(`Stats: ${backup.stats.total_jobs} jobs, ${backup.stats.total_companies} companies`);
    
    return backupFile;
    
  } catch (error) {
    console.error('Automated backup failed:', error.message);
    throw error;
  }
}

automatedBackup();
