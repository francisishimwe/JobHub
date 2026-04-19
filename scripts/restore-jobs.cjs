const { neon } = require('@neondatabase/serverless');
const fs = require('fs');

const NEON_DB_URL = "postgresql://neondb_owner:npg_mabQenpJ35yN@ep-fragrant-glitter-agu94zx1-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

async function restoreJobs(backupFile) {
  try {
    console.log('=== RESTORING JOBS FROM BACKUP ===\n');
    
    const sql = neon(NEON_DB_URL);
    
    // Read backup file
    const backupData = JSON.parse(fs.readFileSync(backupFile, 'utf8'));
    console.log(`Backup from: ${backupData.timestamp}`);
    console.log(`Version: ${backupData.version}`);
    
    // Clear current database
    console.log('\n1. Clearing current database...');
    await sql`DELETE FROM jobs`;
    await sql`DELETE FROM companies`;
    console.log('Database cleared');
    
    // Restore companies
    console.log('\n2. Restoring companies...');
    let restoredCompanies = 0;
    
    for (const company of backupData.companies) {
      try {
        await sql`
          INSERT INTO companies (id, name, logo, location, industry, website, description, created_at, updated_at)
          VALUES (${company.id}, ${company.name}, ${company.logo}, ${company.location}, ${company.industry}, ${company.website}, ${company.description}, ${company.created_at}, ${company.updated_at})
        `;
        restoredCompanies++;
      } catch (error) {
        console.error(`Failed to restore company ${company.name}:`, error.message);
      }
    }
    
    console.log(`Companies restored: ${restoredCompanies}/${backupData.companies.length}`);
    
    // Restore jobs
    console.log('\n3. Restoring jobs...');
    let restoredJobs = 0;
    let failedJobs = 0;
    
    for (const job of backupData.jobs) {
      try {
        await sql`
          INSERT INTO jobs (
            id, title, company_id, location, job_type, opportunity_type, experience_level,
            salary_min, salary_max, deadline, description, requirements, benefits,
            category, location_type, application_link, application_method, status,
            approved, featured, view_count, posted_date, created_at, updated_at
          )
          VALUES (
            ${job.id}, ${job.title}, ${job.company_id}, ${job.location}, ${job.job_type}, ${job.opportunity_type}, ${job.experience_level},
            ${job.salary_min}, ${job.salary_max}, ${job.deadline}, ${job.description}, ${job.requirements}, ${job.benefits},
            ${job.category}, ${job.location_type}, ${job.application_link}, ${job.application_method}, ${job.status},
            ${job.approved}, ${job.featured}, ${job.view_count || 0}, ${job.posted_date}, ${job.created_at}, ${job.updated_at}
          )
        `;
        restoredJobs++;
      } catch (error) {
        failedJobs++;
        if (failedJobs <= 5) {
          console.error(`Failed to restore job ${job.title}:`, error.message);
        }
      }
    }
    
    console.log(`Jobs restored: ${restoredJobs}/${backupData.jobs.length}, Failed: ${failedJobs}`);
    
    // Verify restoration
    const finalJobs = await sql`SELECT COUNT(*) as count FROM jobs`;
    const finalCompanies = await sql`SELECT COUNT(*) as count FROM companies`;
    
    console.log(`\n=== RESTORATION COMPLETED ===`);
    console.log(`Database now contains:`);
    console.log(`- Companies: ${finalCompanies[0].count}`);
    console.log(`- Jobs: ${finalJobs[0].count}`);
    console.log(`Website: https://rwandajobhub.vercel.app`);
    
  } catch (error) {
    console.error('Restore failed:', error.message);
    throw error;
  }
}

// Get backup file from command line or use latest
const backupFile = process.argv[2];
if (!backupFile) {
  console.log('Usage: node restore-jobs.cjs <backup-file.json>');
  console.log('Or provide backup file name as argument');
  process.exit(1);
}

restoreJobs(backupFile);
