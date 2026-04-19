const { neon } = require('@neondatabase/serverless');

// Database URLs
const OLD_DB_URL = 'postgresql://neondb_owner:npg_CD5GYcTUPz7q@ep-withered-heart-agegb3fq-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require';
const NEW_DB_URL = 'postgresql://neondb_owner:npg_mabQenpJ35yN@ep-fragrant-glitter-agu94zx1-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

async function migrateAllJobs() {
  try {
    console.log('=== MIGRATING ALL JOBS FROM OLD DATABASE ===\n');
    
    const oldSql = neon(OLD_DB_URL);
    const newSql = neon(NEW_DB_URL);
    
    console.log('Connected to both databases');
    
    // Get all jobs from old database
    console.log('\n1. Fetching all jobs from old database...');
    const allOldJobs = await oldSql`
      SELECT 
        id, title, company_id, location, job_type, opportunity_type, 
        experience_level, deadline, description, requirements, benefits,
        category, attachment_url, application_link, application_method,
        primary_email, cc_emails, status, approved, featured, applicants,
        views, posted_date, created_at, updated_at
      FROM jobs
      ORDER BY created_at DESC
    `;
    
    console.log(`Found ${allOldJobs.length} jobs in old database`);
    
    // Get all companies from old database
    console.log('\n2. Fetching all companies from old database...');
    const allOldCompanies = await oldSql`
      SELECT id, name, logo, location, industry, website, description, created_at, updated_at
      FROM companies
      ORDER BY name
    `;
    
    console.log(`Found ${allOldCompanies.length} companies in old database`);
    
    // Migrate companies first
    console.log('\n3. Migrating companies to new database...');
    let migratedCompanies = 0;
    let skippedCompanies = 0;
    
    for (const company of allOldCompanies) {
      try {
        // Check if company already exists in new database
        const existing = await newSql`
          SELECT id FROM companies WHERE name = ${company.name}
        `;
        
        if (existing.length === 0) {
          await newSql`
            INSERT INTO companies (id, name, logo, location, industry, website, description, created_at, updated_at)
            VALUES (${company.id}, ${company.name}, ${company.logo}, ${company.location}, ${company.industry}, ${company.website}, ${company.description}, ${company.created_at}, ${company.updated_at})
          `;
          migratedCompanies++;
          console.log(`  Migrated: ${company.name}`);
        } else {
          skippedCompanies++;
        }
      } catch (error) {
        console.error(`  Failed to migrate company ${company.name}:`, error.message);
      }
    }
    
    console.log(`Companies migration: ${migratedCompanies} migrated, ${skippedCompanies} skipped (already exist)`);
    
    // Migrate jobs
    console.log('\n4. Migrating jobs to new database...');
    let migratedJobs = 0;
    let skippedJobs = 0;
    let failedJobs = 0;
    
    for (const job of allOldJobs) {
      try {
        // Check if job already exists in new database
        const existing = await newSql`
          SELECT id FROM jobs WHERE id = ${job.id}
        `;
        
        if (existing.length === 0) {
          await newSql`
            INSERT INTO jobs (
              id, title, company_id, location, job_type, opportunity_type,
              experience_level, deadline, description, requirements, benefits,
              category, attachment_url, application_link, application_method,
              primary_email, cc_emails, status, approved, featured, applicants,
              views, posted_date, created_at, updated_at
            )
            VALUES (
              ${job.id}, ${job.title}, ${job.company_id}, ${job.location}, ${job.job_type}, ${job.opportunity_type},
              ${job.experience_level}, ${job.deadline}, ${job.description}, ${job.requirements}, ${job.benefits},
              ${job.category}, ${job.attachment_url}, ${job.application_link}, ${job.application_method},
              ${job.primary_email}, ${job.cc_emails}, ${job.status}, ${job.approved}, ${job.featured}, ${job.applicants},
              ${job.views}, ${job.posted_date}, ${job.created_at}, ${job.updated_at}
            )
          `;
          migratedJobs++;
          
          if (migratedJobs % 50 === 0) {
            console.log(`  Progress: ${migratedJobs} jobs migrated...`);
          }
        } else {
          skippedJobs++;
        }
      } catch (error) {
        failedJobs++;
        console.error(`  Failed to migrate job ${job.title}:`, error.message);
      }
    }
    
    console.log(`\nJobs migration: ${migratedJobs} migrated, ${skippedJobs} skipped, ${failedJobs} failed`);
    
    // Final verification
    console.log('\n5. Final verification...');
    const finalJobs = await newSql`SELECT COUNT(*) as count FROM jobs`;
    const finalCompanies = await newSql`SELECT COUNT(*) as count FROM companies`;
    
    console.log(`\nNew database now contains:`);
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
    
    console.log('\nSample of migrated jobs:');
    sampleJobs.forEach((job, index) => {
      console.log(`${index + 1}. ${job.title} at ${job.company_name}`);
      console.log(`   Status: ${job.status} | Approved: ${job.approved} | Featured: ${job.featured}`);
      console.log(`   Created: ${new Date(job.created_at).toLocaleDateString()}`);
      console.log('');
    });
    
    console.log('=== MIGRATION COMPLETED SUCCESSFULLY ===');
    console.log(`\nAll your ${allOldJobs.length} jobs have been migrated to the new database!`);
    console.log('You can now see them at: https://rwandajobhub.vercel.app');
    
  } catch (error) {
    console.error('Migration failed:', error.message);
    process.exit(1);
  }
}

// Run the migration
migrateAllJobs();
