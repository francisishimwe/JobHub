const { neon } = require('@neondatabase/serverless');
const fs = require('fs');

// Database configuration
const NEON_DB_URL = "postgresql://neondb_owner:npg_mabQenpJ35yN@ep-fragrant-glitter-agu94zx1-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
const OLD_DB_URL = process.env.OLD_DATABASE_URL; // You'll need to set this

async function migrateJobListings() {
  try {
    console.log('=== JOB LISTINGS MIGRATION ===\n');
    
    // Connect to Neon database
    const neonSql = neon(NEON_DB_URL);
    console.log('Connected to Neon database');
    
    // Check if tables exist in Neon
    console.log('\n1. Checking existing tables in Neon...');
    const tables = await neonSql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;
    
    console.log('Existing tables:', tables.map(t => t.table_name));
    
    // Create tables if they don't exist
    console.log('\n2. Creating tables if needed...');
    
    // Create companies table
    await neonSql`
      CREATE TABLE IF NOT EXISTS companies (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        logo TEXT,
        location TEXT,
        industry TEXT,
        website TEXT,
        description TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    
    // Create jobs table
    await neonSql`
      CREATE TABLE IF NOT EXISTS jobs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title TEXT NOT NULL,
        company_id UUID REFERENCES companies(id),
        location TEXT,
        job_type TEXT,
        opportunity_type TEXT,
        experience_level TEXT,
        salary_min INTEGER,
        salary_max INTEGER,
        deadline DATE,
        description TEXT,
        requirements TEXT,
        benefits TEXT,
        status TEXT DEFAULT 'draft',
        approved BOOLEAN DEFAULT false,
        featured BOOLEAN DEFAULT false,
        view_count INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    
    // Create indexes
    await neonSql`CREATE INDEX IF NOT EXISTS idx_jobs_company_id ON jobs(company_id);`;
    await neonSql`CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);`;
    await neonSql`CREATE INDEX IF NOT EXISTS idx_jobs_approved ON jobs(approved);`;
    await neonSql`CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON jobs(created_at DESC);`;
    await neonSql`CREATE INDEX IF NOT EXISTS idx_companies_name ON companies(name);`;
    
    console.log('Tables created/verified');
    
    // Check if there's existing data
    const existingCompanies = await neonSql`SELECT COUNT(*) as count FROM companies`;
    const existingJobs = await neonSql`SELECT COUNT(*) as count FROM jobs`;
    
    console.log(`\nExisting data in Neon:`);
    console.log(`- Companies: ${existingCompanies[0].count}`);
    console.log(`- Jobs: ${existingJobs[0].count}`);
    
    if (existingCompanies[0].count > 0 || existingJobs[0].count > 0) {
      console.log('\nWARNING: Neon database already contains data!');
      const answer = await askQuestion('Do you want to continue and potentially overwrite data? (y/N): ');
      if (answer.toLowerCase() !== 'y') {
        console.log('Migration cancelled.');
        return;
      }
    }
    
    // If you have an old database, connect to it here
    if (OLD_DB_URL) {
      console.log('\n3. Migrating from old database...');
      await migrateFromOldDatabase(neonSql);
    } else {
      console.log('\n3. No old database URL provided. Creating sample data...');
      await createSampleData(neonSql);
    }
    
    // Verify migration
    console.log('\n4. Verifying migration...');
    const finalCompanies = await neonSql`SELECT COUNT(*) as count FROM companies`;
    const finalJobs = await neonSql`SELECT COUNT(*) as count FROM jobs`;
    
    console.log(`\nMigration completed!`);
    console.log(`- Companies: ${finalCompanies[0].count}`);
    console.log(`- Jobs: ${finalJobs[0].count}`);
    
    // Show sample data
    const sampleJobs = await neonSql`
      SELECT j.title, c.name as company_name, j.status, j.approved
      FROM jobs j
      JOIN companies c ON j.company_id = c.id
      LIMIT 5
    `;
    
    console.log('\nSample jobs:');
    sampleJobs.forEach((job, index) => {
      console.log(`${index + 1}. ${job.title} at ${job.company_name} (${job.status}, approved: ${job.approved})`);
    });
    
  } catch (error) {
    console.error('Migration failed:', error.message);
    process.exit(1);
  }
}

async function migrateFromOldDatabase(neonSql) {
  try {
    const oldSql = neon(OLD_DB_URL);
    
    // Migrate companies first
    console.log('Migrating companies...');
    const oldCompanies = await oldSql`SELECT * FROM companies ORDER BY created_at`;
    
    for (const company of oldCompanies) {
      await neonSql`
        INSERT INTO companies (id, name, logo, location, industry, website, description, created_at, updated_at)
        VALUES (${company.id}, ${company.name}, ${company.logo}, ${company.location}, ${company.industry}, ${company.website}, ${company.description}, ${company.created_at}, ${company.updated_at})
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          logo = EXCLUDED.logo,
          location = EXCLUDED.location,
          industry = EXCLUDED.industry,
          website = EXCLUDED.website,
          description = EXCLUDED.description,
          updated_at = EXCLUDED.updated_at
      `;
    }
    
    console.log(`Migrated ${oldCompanies.length} companies`);
    
    // Then migrate jobs
    console.log('Migrating jobs...');
    const oldJobs = await oldSql`SELECT * FROM jobs ORDER BY created_at`;
    
    for (const job of oldJobs) {
      await neonSql`
        INSERT INTO jobs (id, title, company_id, location, job_type, opportunity_type, experience_level, salary_min, salary_max, deadline, description, requirements, benefits, status, approved, featured, view_count, created_at, updated_at)
        VALUES (${job.id}, ${job.title}, ${job.company_id}, ${job.location}, ${job.job_type}, ${job.opportunity_type}, ${job.experience_level}, ${job.salary_min}, ${job.salary_max}, ${job.deadline}, ${job.description}, ${job.requirements}, ${job.benefits}, ${job.status}, ${job.approved}, ${job.featured}, ${job.view_count}, ${job.created_at}, ${job.updated_at})
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          company_id = EXCLUDED.company_id,
          location = EXCLUDED.location,
          job_type = EXCLUDED.job_type,
          opportunity_type = EXCLUDED.opportunity_type,
          experience_level = EXCLUDED.experience_level,
          salary_min = EXCLUDED.salary_min,
          salary_max = EXCLUDED.salary_max,
          deadline = EXCLUDED.deadline,
          description = EXCLUDED.description,
          requirements = EXCLUDED.requirements,
          benefits = EXCLUDED.benefits,
          status = EXCLUDED.status,
          approved = EXCLUDED.approved,
          featured = EXCLUDED.featured,
          view_count = EXCLUDED.view_count,
          updated_at = EXCLUDED.updated_at
      `;
    }
    
    console.log(`Migrated ${oldJobs.length} jobs`);
    
  } catch (error) {
    console.error('Failed to migrate from old database:', error.message);
    throw error;
  }
}

async function createSampleData(neonSql) {
  console.log('Creating sample companies and jobs...');
  
  // Sample companies
  const companies = [
    {
      name: 'Rwanda Revenue Authority (RRA)',
      logo: null,
      location: 'Kigali, Rwanda',
      industry: 'Government',
      website: 'https://www.rra.gov.rw',
      description: 'Rwanda Revenue Authority is responsible for tax collection and customs administration in Rwanda.'
    },
    {
      name: 'Bank of Kiguli',
      logo: null,
      location: 'Kigali, Rwanda',
      industry: 'Banking',
      website: 'https://www.bankofkiguli.rw',
      description: 'Bank of Kiguli is a leading commercial bank in Rwanda providing comprehensive banking services.'
    },
    {
      name: 'Irembo',
      logo: null,
      location: 'Kigali, Rwanda',
      industry: 'Technology',
      website: 'https://www.irembo.gov.rw',
      description: 'Irembo is a digital government services platform that provides access to public services online.'
    },
    {
      name: 'Rwanda Development Board (RDB)',
      logo: null,
      location: 'Kigali, Rwanda',
      industry: 'Government',
      website: 'https://www.rdb.rw',
      description: 'RDB is responsible for accelerating economic development in Rwanda.'
    },
    {
      name: 'MTN Rwanda',
      logo: null,
      location: 'Kigali, Rwanda',
      industry: 'Telecommunications',
      website: 'https://www.mtn.rw',
      description: 'MTN Rwanda is a leading telecommunications company providing mobile and data services.'
    }
  ];
  
  // Insert companies
  const insertedCompanies = [];
  for (const company of companies) {
    const result = await neonSql`
      INSERT INTO companies (name, logo, location, industry, website, description)
      VALUES (${company.name}, ${company.logo}, ${company.location}, ${company.industry}, ${company.website}, ${company.description})
      RETURNING id
    `;
    insertedCompanies.push({ ...company, id: result[0].id });
  }
  
  console.log(`Created ${insertedCompanies.length} companies`);
  
  // Sample jobs
  const jobs = [
    {
      title: 'Revenue Officer',
      company_id: insertedCompanies[0].id, // RRA
      location: 'Kigali, Rwanda',
      job_type: 'Full-time',
      opportunity_type: 'Permanent',
      experience_level: 'Mid-level',
      salary_min: 500000,
      salary_max: 800000,
      deadline: new Date('2024-06-30'),
      description: 'We are looking for a Revenue Officer to join our team at Rwanda Revenue Authority.',
      requirements: 'Bachelor\'s degree in Finance, Accounting, or related field. 3+ years experience.',
      benefits: 'Health insurance, pension plan, professional development opportunities.',
      status: 'published',
      approved: true,
      featured: true
    },
    {
      title: 'Banking Operations Manager',
      company_id: insertedCompanies[1].id, // Bank of Kiguli
      location: 'Kigali, Rwanda',
      job_type: 'Full-time',
      opportunity_type: 'Permanent',
      experience_level: 'Senior-level',
      salary_min: 800000,
      salary_max: 1200000,
      deadline: new Date('2024-05-31'),
      description: 'Bank of Kiguli is seeking an experienced Banking Operations Manager.',
      requirements: 'Master\'s degree in Banking or Finance. 5+ years in banking operations.',
      benefits: 'Competitive salary, performance bonuses, career advancement.',
      status: 'published',
      approved: true,
      featured: false
    },
    {
      title: 'Software Engineer',
      company_id: insertedCompanies[2].id, // Irembo
      location: 'Kigali, Rwanda',
      job_type: 'Full-time',
      opportunity_type: 'Permanent',
      experience_level: 'Mid-level',
      salary_min: 600000,
      salary_max: 900000,
      deadline: new Date('2024-07-15'),
      description: 'Join Irembo\'s tech team to build digital government services.',
      requirements: 'Bachelor\'s degree in Computer Science. Strong programming skills.',
      benefits: 'Flexible working hours, tech equipment allowance, training budget.',
      status: 'published',
      approved: true,
      featured: true
    },
    {
      title: 'Investment Analyst',
      company_id: insertedCompanies[3].id, // RDB
      location: 'Kigali, Rwanda',
      job_type: 'Full-time',
      opportunity_type: 'Contract',
      experience_level: 'Entry-level',
      salary_min: 400000,
      salary_max: 600000,
      deadline: new Date('2024-06-15'),
      description: 'RDB is looking for an Investment Analyst to support economic development projects.',
      requirements: 'Bachelor\'s degree in Economics or Finance. Analytical skills required.',
      benefits: 'Exposure to major projects, networking opportunities, mentorship.',
      status: 'published',
      approved: true,
      featured: false
    },
    {
      title: 'Network Engineer',
      company_id: insertedCompanies[4].id, // MTN Rwanda
      location: 'Kigali, Rwanda',
      job_type: 'Full-time',
      opportunity_type: 'Permanent',
      experience_level: 'Mid-level',
      salary_min: 550000,
      salary_max: 850000,
      deadline: new Date('2024-05-30'),
      description: 'MTN Rwanda is seeking a Network Engineer to maintain and optimize our network infrastructure.',
      requirements: 'Bachelor\'s degree in Telecommunications. 3+ years network experience.',
      benefits: 'Health insurance, transportation allowance, career growth opportunities.',
      status: 'draft',
      approved: false,
      featured: false
    }
  ];
  
  // Insert jobs
  for (const job of jobs) {
    await neonSql`
      INSERT INTO jobs (title, company_id, location, job_type, opportunity_type, experience_level, salary_min, salary_max, deadline, description, requirements, benefits, status, approved, featured)
      VALUES (${job.title}, ${job.company_id}, ${job.location}, ${job.job_type}, ${job.opportunity_type}, ${job.experience_level}, ${job.salary_min}, ${job.salary_max}, ${job.deadline}, ${job.description}, ${job.requirements}, ${job.benefits}, ${job.status}, ${job.approved}, ${job.featured})
    `;
  }
  
  console.log(`Created ${jobs.length} jobs`);
}

function askQuestion(question) {
  return new Promise((resolve) => {
    process.stdout.write(question);
    process.stdin.once('data', (data) => {
      resolve(data.toString().trim());
    });
  });
}

// Run the migration
migrateJobListings().then(() => {
  console.log('\n=== MIGRATION COMPLETED SUCCESSFULLY ===');
  process.exit(0);
}).catch(error => {
  console.error('\n=== MIGRATION FAILED ===');
  console.error(error.message);
  process.exit(1);
});
