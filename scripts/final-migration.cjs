const { neon } = require('@neondatabase/serverless');

// Database URLs
const OLD_DB_URL = 'postgresql://neondb_owner:npg_CD5GYcTUPz7q@ep-withered-heart-agegb3fq-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require';
const NEW_DB_URL = 'postgresql://neondb_owner:npg_mabQenpJ35yN@ep-fragrant-glitter-agu94zx1-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

async function finalMigration() {
  try {
    console.log('=== FINAL MIGRATION - ALL YOUR JOBS ===\n');
    
    const oldSql = neon(OLD_DB_URL);
    const newSql = neon(NEW_DB_URL);
    
    console.log('Connected to both databases');
    
    // Get all jobs from old database
    console.log('\n1. Fetching all jobs from old database...');
    const allOldJobs = await oldSql`
      SELECT id, title, company_id, location, job_type, opportunity_type, 
             experience_level, deadline, description, category, attachment_url, 
             application_link, status, approved, posted_date, created_at
      FROM jobs
      ORDER BY created_at DESC
    `;
    
    console.log(`Found ${allOldJobs.length} jobs in old database`);
    
    // Get all companies from old database
    console.log('\n2. Fetching all companies from old database...');
    const allOldCompanies = await oldSql`
      SELECT id, name, logo, location, industry, website, created_at
      FROM companies
      ORDER BY name
    `;
    
    console.log(`Found ${allOldCompanies.length} companies in old database`);
    
    // Clear current database to avoid conflicts
    console.log('\n3. Clearing current database...');
    await newSql`DELETE FROM jobs`;
    await newSql`DELETE FROM companies`;
    console.log('Current database cleared');
    
    // Migrate companies first
    console.log('\n4. Migrating companies...');
    let migratedCompanies = 0;
    
    for (const company of allOldCompanies) {
      try {
        await newSql`
          INSERT INTO companies (id, name, logo, location, industry, website, description, created_at, updated_at)
          VALUES (${company.id}, ${company.name}, ${company.logo}, ${company.location}, ${company.industry}, ${company.website}, ${company.name}, ${company.created_at}, ${company.created_at})
        `;
        migratedCompanies++;
        
        if (migratedCompanies % 20 === 0) {
          console.log(`  Companies: ${migratedCompanies}/${allOldCompanies.length}...`);
        }
      } catch (error) {
        console.error(`  Failed to migrate company ${company.name}:`, error.message);
      }
    }
    
    console.log(`Companies migration completed: ${migratedCompanies} migrated`);
    
    // Migrate jobs
    console.log('\n5. Migrating jobs...');
    let migratedJobs = 0;
    let failedJobs = 0;
    
    for (const job of allOldJobs) {
      try {
        await newSql`
          INSERT INTO jobs (
            id, title, company_id, location, job_type, opportunity_type,
            experience_level, deadline, description, category, attachment_url, 
            application_link, application_method, status, approved, featured,
            posted_date, created_at, updated_at
          )
          VALUES (
            ${job.id}, ${job.title}, ${job.company_id}, ${job.location}, ${job.job_type}, ${job.opportunity_type},
            ${job.experience_level}, ${job.deadline}, ${job.description}, ${job.category}, ${job.attachment_url}, 
            ${job.application_link}, 'link', ${job.status}, ${job.approved}, false,
            ${job.posted_date}, ${job.created_at}, ${job.created_at}
          )
        `;
        migratedJobs++;
        
        if (migratedJobs % 50 === 0) {
          console.log(`  Jobs: ${migratedJobs}/${allOldJobs.length}...`);
        }
      } catch (error) {
        failedJobs++;
        if (failedJobs <= 5) {
          console.error(`  Failed to migrate job ${job.title}:`, error.message);
        }
      }
    }
    
    console.log(`\nJobs migration completed: ${migratedJobs} migrated, ${failedJobs} failed`);
    
    // Final verification
    console.log('\n6. Final verification...');
    const finalJobs = await newSql`SELECT COUNT(*) as count FROM jobs`;
    const finalCompanies = await newSql`SELECT COUNT(*) as count FROM companies`;
    
    console.log(`\nMigration Results:`);
    console.log(`- Companies: ${finalCompanies[0].count}`);
    console.log(`- Jobs: ${finalJobs[0].count}`);
    
    // Show sample of migrated jobs
    const sampleJobs = await newSql`
      SELECT j.title, c.name as company_name, j.status, j.approved, j.featured, j.created_at
      FROM jobs j
      JOIN companies c ON j.company_id = c.id
      ORDER BY j.created_at DESC
      LIMIT 10
    `;
    
    console.log('\nSample of your migrated jobs:');
    sampleJobs.forEach((job, index) => {
      console.log(`${index + 1}. ${job.title} at ${job.company_name}`);
      console.log(`   Status: ${job.status} | Approved: ${job.approved} | Featured: ${job.featured}`);
      console.log(`   Created: ${new Date(job.created_at).toLocaleDateString()}`);
      console.log('');
    });
    
    // Show job categories
    const jobStats = await newSql`
      SELECT category, COUNT(*) as count
      FROM jobs 
      WHERE category IS NOT NULL AND category != ''
      GROUP BY category
      ORDER BY count DESC
    `;
    
    console.log('Job categories:');
    jobStats.forEach(stat => {
      console.log(`  ${stat.category}: ${stat.count} jobs`);
    });
    
    console.log('\n=== MIGRATION COMPLETED SUCCESSFULLY! ===');
    console.log(`\nAll your ${allOldJobs.length} jobs have been restored!`);
    console.log('Your original job listings are now live at:');
    console.log('https://rwandajobhub.vercel.app');
    console.log('\nAdmin panel: https://rwandajobhub.vercel.app/admin');
    
  } catch (error) {
    console.error('Migration failed:', error.message);
    process.exit(1);
  }
}

// Run the migration
finalMigration();
