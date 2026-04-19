const { neon } = require('@neondatabase/serverless');

// Direct database URL
const NEON_DB_URL = "postgresql://neondb_owner:npg_mabQenpJ35yN@ep-fragrant-glitter-agu94zx1-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

async function quickMigrate() {
  try {
    console.log('=== QUICK JOB LISTINGS MIGRATION ===\n');
    
    // Connect to Neon database
    const sql = neon(NEON_DB_URL);
    console.log('Connected to Neon database');
    
    // Create tables
    console.log('\n1. Creating tables...');
    
    // Create companies table
    await sql`
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
    await sql`
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
    
    console.log('Tables created successfully');
    
    // Check existing data
    const existingCompanies = await sql`SELECT COUNT(*) as count FROM companies`;
    const existingJobs = await sql`SELECT COUNT(*) as count FROM jobs`;
    
    console.log(`\nExisting data:`);
    console.log(`- Companies: ${existingCompanies[0].count}`);
    console.log(`- Jobs: ${existingJobs[0].count}`);
    
    // Create sample data if tables are empty
    if (existingCompanies[0].count === 0) {
      console.log('\n2. Creating sample companies...');
      
      // Insert sample companies
      const companiesResult = await sql`
        INSERT INTO companies (name, location, industry, website, description) VALUES
        ('Rwanda Revenue Authority (RRA)', 'Kigali, Rwanda', 'Government', 'https://www.rra.gov.rw', 'Rwanda Revenue Authority is responsible for tax collection and customs administration.'),
        ('Bank of Kiguli', 'Kigali, Rwanda', 'Banking', 'https://www.bankofkiguli.rw', 'Bank of Kiguli is a leading commercial bank in Rwanda.'),
        ('Irembo', 'Kigali, Rwanda', 'Technology', 'https://www.irembo.gov.rw', 'Irembo is a digital government services platform.'),
        ('Rwanda Development Board (RDB)', 'Kigali, Rwanda', 'Government', 'https://www.rdb.rw', 'RDB is responsible for accelerating economic development.'),
        ('MTN Rwanda', 'Kigali, Rwanda', 'Telecommunications', 'https://www.mtn.rw', 'MTN Rwanda is a leading telecommunications company.')
        RETURNING id, name
      `;
      
      console.log(`Created ${companiesResult.length} companies`);
      
      // Create sample jobs
      console.log('\n3. Creating sample jobs...');
      
      const jobs = [
        {
          title: 'Revenue Officer',
          company_name: 'Rwanda Revenue Authority (RRA)',
          location: 'Kigali, Rwanda',
          job_type: 'Full-time',
          opportunity_type: 'Permanent',
          experience_level: 'Mid-level',
          salary_min: 500000,
          salary_max: 800000,
          deadline: '2024-06-30',
          description: 'We are looking for a Revenue Officer to join our team at Rwanda Revenue Authority.',
          requirements: 'Bachelor\'s degree in Finance, Accounting, or related field. 3+ years experience.',
          benefits: 'Health insurance, pension plan, professional development.',
          status: 'published',
          approved: true,
          featured: true
        },
        {
          title: 'Banking Operations Manager',
          company_name: 'Bank of Kiguli',
          location: 'Kigali, Rwanda',
          job_type: 'Full-time',
          opportunity_type: 'Permanent',
          experience_level: 'Senior-level',
          salary_min: 800000,
          salary_max: 1200000,
          deadline: '2024-05-31',
          description: 'Bank of Kiguli is seeking an experienced Banking Operations Manager.',
          requirements: 'Master\'s degree in Banking or Finance. 5+ years in banking operations.',
          benefits: 'Competitive salary, performance bonuses, career advancement.',
          status: 'published',
          approved: true,
          featured: false
        },
        {
          title: 'Software Engineer',
          company_name: 'Irembo',
          location: 'Kigali, Rwanda',
          job_type: 'Full-time',
          opportunity_type: 'Permanent',
          experience_level: 'Mid-level',
          salary_min: 600000,
          salary_max: 900000,
          deadline: '2024-07-15',
          description: 'Join Irembo\'s tech team to build digital government services.',
          requirements: 'Bachelor\'s degree in Computer Science. Strong programming skills.',
          benefits: 'Flexible working hours, tech equipment allowance, training budget.',
          status: 'published',
          approved: true,
          featured: true
        },
        {
          title: 'Investment Analyst',
          company_name: 'Rwanda Development Board (RDB)',
          location: 'Kigali, Rwanda',
          job_type: 'Full-time',
          opportunity_type: 'Contract',
          experience_level: 'Entry-level',
          salary_min: 400000,
          salary_max: 600000,
          deadline: '2024-06-15',
          description: 'RDB is looking for an Investment Analyst to support economic development projects.',
          requirements: 'Bachelor\'s degree in Economics or Finance. Analytical skills required.',
          benefits: 'Exposure to major projects, networking opportunities, mentorship.',
          status: 'published',
          approved: true,
          featured: false
        },
        {
          title: 'Network Engineer',
          company_name: 'MTN Rwanda',
          location: 'Kigali, Rwanda',
          job_type: 'Full-time',
          opportunity_type: 'Permanent',
          experience_level: 'Mid-level',
          salary_min: 550000,
          salary_max: 850000,
          deadline: '2024-05-30',
          description: 'MTN Rwanda is seeking a Network Engineer to maintain and optimize our network infrastructure.',
          requirements: 'Bachelor\'s degree in Telecommunications. 3+ years network experience.',
          benefits: 'Health insurance, transportation allowance, career growth.',
          status: 'draft',
          approved: false,
          featured: false
        }
      ];
      
      // Insert jobs
      for (const job of jobs) {
        const company = companiesResult.find(c => c.name === job.company_name);
        if (company) {
          await sql`
            INSERT INTO jobs (title, company_id, location, job_type, opportunity_type, experience_level, salary_min, salary_max, deadline, description, requirements, benefits, status, approved, featured)
            VALUES (${job.title}, ${company.id}, ${job.location}, ${job.job_type}, ${job.opportunity_type}, ${job.experience_level}, ${job.salary_min}, ${job.salary_max}, ${job.deadline}, ${job.description}, ${job.requirements}, ${job.benefits}, ${job.status}, ${job.approved}, ${job.featured})
          `;
        }
      }
      
      console.log(`Created ${jobs.length} jobs`);
    } else {
      console.log('\nTables already contain data. Skipping sample data creation.');
    }
    
    // Verify migration
    console.log('\n4. Verification...');
    const finalCompanies = await sql`SELECT COUNT(*) as count FROM companies`;
    const finalJobs = await sql`SELECT COUNT(*) as count FROM jobs`;
    
    console.log(`\nFinal counts:`);
    console.log(`- Companies: ${finalCompanies[0].count}`);
    console.log(`- Jobs: ${finalJobs[0].count}`);
    
    // Show sample data
    const sampleJobs = await sql`
      SELECT j.title, c.name as company_name, j.status, j.approved, j.salary_min, j.salary_max
      FROM jobs j
      JOIN companies c ON j.company_id = c.id
      ORDER BY j.created_at DESC
      LIMIT 5
    `;
    
    console.log('\nSample jobs:');
    sampleJobs.forEach((job, index) => {
      console.log(`${index + 1}. ${job.title} at ${job.company_name}`);
      console.log(`   Status: ${job.status} | Approved: ${job.approved} | Salary: ${job.salary_min} - ${job.salary_max} RWF`);
    });
    
    console.log('\n=== MIGRATION COMPLETED SUCCESSFULLY ===');
    console.log('\nYour job listings are now ready!');
    console.log('You can test them at: https://rwandajobhub.vercel.app');
    
  } catch (error) {
    console.error('Migration failed:', error.message);
    process.exit(1);
  }
}

// Run the migration
quickMigrate();
