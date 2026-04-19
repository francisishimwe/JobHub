const { neon } = require('@neondatabase/serverless');

const NEON_DB_URL = "postgresql://neondb_owner:npg_mabQenpJ35yN@ep-fragrant-glitter-agu94zx1-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

async function populateExistingSchema() {
  try {
    console.log('=== POPULATING EXISTING DATABASE ===\n');
    
    const sql = neon(NEON_DB_URL);
    console.log('Connected to Neon database');
    
    // Check current data
    const existingCompanies = await sql`SELECT COUNT(*) as count FROM companies`;
    const existingJobs = await sql`SELECT COUNT(*) as count FROM jobs`;
    
    console.log(`Current data:`);
    console.log(`- Companies: ${existingCompanies[0].count}`);
    console.log(`- Jobs: ${existingJobs[0].count}`);
    
    if (existingCompanies[0].count === 0) {
      console.log('\n1. Creating sample companies...');
      
      // Insert sample companies using existing schema
      await sql`
        INSERT INTO companies (name, logo, location, industry, website, description) VALUES
        ('Rwanda Revenue Authority (RRA)', null, 'Kigali, Rwanda', 'Government', 'https://www.rra.gov.rw', 'Rwanda Revenue Authority is responsible for tax collection and customs administration.'),
        ('Bank of Kiguli', null, 'Kigali, Rwanda', 'Banking', 'https://www.bankofkiguli.rw', 'Bank of Kiguli is a leading commercial bank in Rwanda.'),
        ('Irembo', null, 'Kigali, Rwanda', 'Technology', 'https://www.irembo.gov.rw', 'Irembo is a digital government services platform.'),
        ('Rwanda Development Board (RDB)', null, 'Kigali, Rwanda', 'Government', 'https://www.rdb.rw', 'RDB is responsible for accelerating economic development.'),
        ('MTN Rwanda', null, 'Kigali, Rwanda', 'Telecommunications', 'https://www.mtn.rw', 'MTN Rwanda is a leading telecommunications company.')
        RETURNING id, name
      `;
      
      console.log('Created 5 sample companies');
    } else {
      console.log('\nCompanies already exist. Skipping company creation.');
    }
    
    // Get companies for job creation
    const companies = await sql`SELECT id, name FROM companies ORDER BY created_at`;
    console.log(`\nAvailable companies: ${companies.length}`);
    
    if (existingJobs[0].count === 0) {
      console.log('\n2. Creating sample jobs...');
      
      // Create sample jobs using existing schema
      const jobs = [
        {
          title: 'Revenue Officer',
          company_name: 'Rwanda Revenue Authority (RRA)',
          location: 'Kigali, Rwanda',
          job_type: 'Full-time',
          opportunity_type: 'Permanent',
          experience_level: 'Mid-level',
          deadline: '2024-06-30',
          description: 'We are looking for a Revenue Officer to join our team at Rwanda Revenue Authority. Responsibilities include tax assessment, collection, and compliance monitoring.',
          category: 'Finance',
          location_type: 'On-site',
          application_link: 'mailto:careers@rra.gov.rw',
          application_method: 'link',
          status: 'published',
          approved: true,
          featured: true,
          priority: 'High'
        },
        {
          title: 'Banking Operations Manager',
          company_name: 'Bank of Kiguli',
          location: 'Kigali, Rwanda',
          job_type: 'Full-time',
          opportunity_type: 'Permanent',
          experience_level: 'Senior-level',
          deadline: '2024-05-31',
          description: 'Bank of Kiguli is seeking an experienced Banking Operations Manager to oversee daily banking operations and ensure excellent customer service.',
          category: 'Banking',
          location_type: 'On-site',
          application_link: 'mailto:hr@bankofkiguli.rw',
          application_method: 'link',
          status: 'published',
          approved: true,
          featured: false,
          priority: 'Normal'
        },
        {
          title: 'Software Engineer',
          company_name: 'Irembo',
          location: 'Kigali, Rwanda',
          job_type: 'Full-time',
          opportunity_type: 'Permanent',
          experience_level: 'Mid-level',
          deadline: '2024-07-15',
          description: 'Join Irembo\'s tech team to build digital government services. You will work on innovative projects that serve millions of Rwandans.',
          category: 'Technology',
          location_type: 'Hybrid',
          application_link: 'mailto:jobs@irembo.gov.rw',
          application_method: 'link',
          status: 'published',
          approved: true,
          featured: true,
          priority: 'High'
        },
        {
          title: 'Investment Analyst',
          company_name: 'Rwanda Development Board (RDB)',
          location: 'Kigali, Rwanda',
          job_type: 'Full-time',
          opportunity_type: 'Contract',
          experience_level: 'Entry-level',
          deadline: '2024-06-15',
          description: 'RDB is looking for an Investment Analyst to support economic development projects and attract foreign investment to Rwanda.',
          category: 'Investment',
          location_type: 'On-site',
          application_link: 'mailto:careers@rdb.rw',
          application_method: 'link',
          status: 'published',
          approved: true,
          featured: false,
          priority: 'Normal'
        },
        {
          title: 'Network Engineer',
          company_name: 'MTN Rwanda',
          location: 'Kigali, Rwanda',
          job_type: 'Full-time',
          opportunity_type: 'Permanent',
          experience_level: 'Mid-level',
          deadline: '2024-05-30',
          description: 'MTN Rwanda is seeking a Network Engineer to maintain and optimize our network infrastructure across the country.',
          category: 'Telecommunications',
          location_type: 'On-site',
          application_link: 'mailto:careers@mtn.rw',
          application_method: 'link',
          status: 'draft',
          approved: false,
          featured: false,
          priority: 'Normal'
        },
        {
          title: 'Marketing Manager',
          company_name: 'Bank of Kiguli',
          location: 'Kigali, Rwanda',
          job_type: 'Full-time',
          opportunity_type: 'Permanent',
          experience_level: 'Senior-level',
          deadline: '2024-06-20',
          description: 'Bank of Kiguli is looking for a creative Marketing Manager to develop and implement marketing strategies for our banking products.',
          category: 'Marketing',
          location_type: 'Hybrid',
          application_link: 'mailto:hr@bankofkiguli.rw',
          application_method: 'link',
          status: 'published',
          approved: true,
          featured: false,
          priority: 'Normal'
        },
        {
          title: 'Data Scientist',
          company_name: 'Irembo',
          location: 'Kigali, Rwanda',
          job_type: 'Full-time',
          opportunity_type: 'Permanent',
          experience_level: 'Mid-level',
          deadline: '2024-07-01',
          description: 'Irembo is seeking a Data Scientist to analyze user behavior and improve our digital government services using data-driven insights.',
          category: 'Technology',
          location_type: 'Hybrid',
          application_link: 'mailto:jobs@irembo.gov.rw',
          application_method: 'link',
          status: 'published',
          approved: true,
          featured: true,
          priority: 'High'
        },
        {
          title: 'Project Manager',
          company_name: 'Rwanda Development Board (RDB)',
          location: 'Kigali, Rwanda',
          job_type: 'Full-time',
          opportunity_type: 'Contract',
          experience_level: 'Mid-level',
          deadline: '2024-06-10',
          description: 'RDB needs a Project Manager to oversee various economic development projects and ensure timely delivery of objectives.',
          category: 'Management',
          location_type: 'On-site',
          application_link: 'mailto:careers@rdb.rw',
          application_method: 'link',
          status: 'published',
          approved: true,
          featured: false,
          priority: 'Normal'
        }
      ];
      
      // Insert jobs
      for (const job of jobs) {
        const company = companies.find(c => c.name === job.company_name);
        if (company) {
          await sql`
            INSERT INTO jobs (title, company_id, location, job_type, opportunity_type, experience_level, deadline, description, category, location_type, application_link, application_method, status, approved, featured, priority)
            VALUES (${job.title}, ${company.id}, ${job.location}, ${job.job_type}, ${job.opportunity_type}, ${job.experience_level}, ${job.deadline}, ${job.description}, ${job.category}, ${job.location_type}, ${job.application_link}, ${job.application_method}, ${job.status}, ${job.approved}, ${job.featured}, ${job.priority})
          `;
          console.log(`  Created: ${job.title} at ${job.company_name}`);
        }
      }
      
      console.log(`\nCreated ${jobs.length} sample jobs`);
    } else {
      console.log('\nJobs already exist. Skipping job creation.');
    }
    
    // Final verification
    console.log('\n3. Final verification...');
    const finalCompanies = await sql`SELECT COUNT(*) as count FROM companies`;
    const finalJobs = await sql`SELECT COUNT(*) as count FROM jobs`;
    
    console.log(`\nFinal counts:`);
    console.log(`- Companies: ${finalCompanies[0].count}`);
    console.log(`- Jobs: ${finalJobs[0].count}`);
    
    // Show sample data
    const sampleJobs = await sql`
      SELECT j.title, c.name as company_name, j.status, j.approved, j.featured, j.deadline
      FROM jobs j
      JOIN companies c ON j.company_id = c.id
      ORDER BY j.created_at DESC
      LIMIT 8
    `;
    
    console.log('\nSample jobs:');
    sampleJobs.forEach((job, index) => {
      console.log(`${index + 1}. ${job.title} at ${job.company_name}`);
      console.log(`   Status: ${job.status} | Approved: ${job.approved} | Featured: ${job.featured} | Deadline: ${job.deadline}`);
    });
    
    console.log('\n=== MIGRATION COMPLETED SUCCESSFULLY ===');
    console.log('\nYour job listings are now ready!');
    console.log('You can test them at: https://rwandajobhub.vercel.app');
    console.log('\nAdmin features available at: https://rwandajobhub.vercel.app/admin');
    
  } catch (error) {
    console.error('Migration failed:', error.message);
    process.exit(1);
  }
}

// Run the migration
populateExistingSchema();
