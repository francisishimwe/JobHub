const { neon } = require('@neondatabase/serverless');

const NEON_DB_URL = "postgresql://neondb_owner:npg_mabQenpJ35yN@ep-fragrant-glitter-agu94zx1-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

async function addFreshJobs() {
  try {
    console.log('=== ADDING FRESH JOB LISTINGS ===\n');
    
    const sql = neon(NEON_DB_URL);
    console.log('Connected to Neon database');
    
    // Get current companies
    const companies = await sql`SELECT id, name FROM companies ORDER BY name`;
    console.log(`Found ${companies.length} companies`);
    
    // Add new companies if needed
    const newCompanies = [
      { name: 'Rwanda Revenue Authority (RRA)', industry: 'Government', website: 'https://www.rra.gov.rw' },
      { name: 'Bank of Kiguli', industry: 'Banking', website: 'https://www.bankofkiguli.rw' },
      { name: 'Irembo', industry: 'Technology', website: 'https://www.irembo.gov.rw' },
      { name: 'Rwanda Development Board (RDB)', industry: 'Government', website: 'https://www.rdb.rw' },
      { name: 'MTN Rwanda', industry: 'Telecommunications', website: 'https://www.mtn.rw' }
    ];
    
    let companyMap = {};
    
    // Check if new companies exist and add them if not
    for (const newCompany of newCompanies) {
      const existing = companies.find(c => c.name === newCompany.name);
      if (!existing) {
        const result = await sql`
          INSERT INTO companies (name, industry, website, description)
          VALUES (${newCompany.name}, ${newCompany.industry}, ${newCompany.website}, ${`Leading ${newCompany.industry.toLowerCase()} organization in Rwanda`})
          RETURNING id, name
        `;
        companyMap[newCompany.name] = result[0];
        console.log(`Added new company: ${newCompany.name}`);
      } else {
        companyMap[newCompany.name] = existing;
      }
    }
    
    // Add fresh jobs with current deadlines
    const freshJobs = [
      {
        title: 'Revenue Officer',
        company_name: 'Rwanda Revenue Authority (RRA)',
        location: 'Kigali, Rwanda',
        job_type: 'Full-time',
        opportunity_type: 'Permanent',
        experience_level: 'Mid-level',
        deadline: '2024-12-31',
        description: 'RRA is seeking qualified Revenue Officers to join our tax administration team. Responsibilities include tax assessment, collection, and compliance monitoring.',
        category: 'Finance',
        location_type: 'On-site',
        application_link: 'mailto:careers@rra.gov.rw',
        status: 'published',
        approved: true,
        featured: true,
        priority: 'High'
      },
      {
        title: 'Digital Banking Manager',
        company_name: 'Bank of Kiguli',
        location: 'Kigali, Rwanda',
        job_type: 'Full-time',
        opportunity_type: 'Permanent',
        experience_level: 'Senior-level',
        deadline: '2024-12-15',
        description: 'Lead Bank of Kiguli\'s digital transformation initiatives. Experience with digital banking platforms and fintech required.',
        category: 'Banking',
        location_type: 'Hybrid',
        application_link: 'mailto:hr@bankofkiguli.rw',
        status: 'published',
        approved: true,
        featured: true,
        priority: 'High'
      },
      {
        title: 'Full Stack Developer',
        company_name: 'Irembo',
        location: 'Kigali, Rwanda',
        job_type: 'Full-time',
        opportunity_type: 'Permanent',
        experience_level: 'Mid-level',
        deadline: '2025-01-15',
        description: 'Join Irembo\'s engineering team to build scalable digital government services. Experience with React, Node.js, and cloud platforms required.',
        category: 'Technology',
        location_type: 'Hybrid',
        application_link: 'mailto:jobs@irembo.gov.rw',
        status: 'published',
        approved: true,
        featured: true,
        priority: 'High'
      },
      {
        title: 'Investment Promotion Officer',
        company_name: 'Rwanda Development Board (RDB)',
        location: 'Kigali, Rwanda',
        job_type: 'Full-time',
        opportunity_type: 'Permanent',
        experience_level: 'Entry-level',
        deadline: '2024-12-20',
        description: 'Support RDB\'s investment promotion activities. Help attract foreign investment and facilitate business establishment in Rwanda.',
        category: 'Investment',
        location_type: 'On-site',
        application_link: 'mailto:careers@rdb.rw',
        status: 'published',
        approved: true,
        featured: false,
        priority: 'Normal'
      },
      {
        title: '5G Network Engineer',
        company_name: 'MTN Rwanda',
        location: 'Kigali, Rwanda',
        job_type: 'Full-time',
        opportunity_type: 'Permanent',
        experience_level: 'Senior-level',
        deadline: '2025-01-10',
        description: 'Lead MTN Rwanda\'s 5G network deployment and optimization. Experience with 5G technology and network infrastructure required.',
        category: 'Telecommunications',
        location_type: 'On-site',
        application_link: 'mailto:careers@mtn.rw',
        status: 'published',
        approved: true,
        featured: true,
        priority: 'High'
      },
      {
        title: 'Tax Compliance Specialist',
        company_name: 'Rwanda Revenue Authority (RRA)',
        location: 'Kigali, Rwanda',
        job_type: 'Full-time',
        opportunity_type: 'Contract',
        experience_level: 'Mid-level',
        deadline: '2024-11-30',
        description: 'Support tax compliance programs and help businesses understand tax obligations. Strong analytical and communication skills required.',
        category: 'Finance',
        location_type: 'Hybrid',
        application_link: 'mailto:careers@rra.gov.rw',
        status: 'published',
        approved: true,
        featured: false,
        priority: 'Normal'
      },
      {
        title: 'UX/UI Designer',
        company_name: 'Irembo',
        location: 'Kigali, Rwanda',
        job_type: 'Full-time',
        opportunity_type: 'Permanent',
        experience_level: 'Mid-level',
        deadline: '2025-01-20',
        description: 'Design intuitive user interfaces for digital government services. Experience with design systems and user research required.',
        category: 'Design',
        location_type: 'Remote',
        application_link: 'mailto:jobs@irembo.gov.rw',
        status: 'published',
        approved: true,
        featured: false,
        priority: 'Normal'
      },
      {
        title: 'Business Development Manager',
        company_name: 'Rwanda Development Board (RDB)',
        location: 'Kigali, Rwanda',
        job_type: 'Full-time',
        opportunity_type: 'Permanent',
        experience_level: 'Senior-level',
        deadline: '2024-12-25',
        description: 'Drive business development initiatives and support private sector growth. Experience with investment promotion and economic development required.',
        category: 'Business Development',
        location_type: 'On-site',
        application_link: 'mailto:careers@rdb.rw',
        status: 'published',
        approved: true,
        featured: false,
        priority: 'Normal'
      },
      {
        title: 'Cybersecurity Analyst',
        company_name: 'MTN Rwanda',
        location: 'Kigali, Rwanda',
        job_type: 'Full-time',
        opportunity_type: 'Permanent',
        experience_level: 'Mid-level',
        deadline: '2025-01-05',
        description: 'Protect MTN Rwanda\'s digital infrastructure and customer data. Experience with cybersecurity frameworks and threat detection required.',
        category: 'Security',
        location_type: 'Hybrid',
        application_link: 'mailto:careers@mtn.rw',
        status: 'published',
        approved: true,
        featured: false,
        priority: 'High'
      },
      {
        title: 'Financial Analyst',
        company_name: 'Bank of Kiguli',
        location: 'Kigali, Rwanda',
        job_type: 'Full-time',
        opportunity_type: 'Permanent',
        experience_level: 'Entry-level',
        deadline: '2024-12-10',
        description: 'Support financial analysis and reporting activities. Recent graduates with finance or accounting degrees encouraged to apply.',
        category: 'Finance',
        location_type: 'On-site',
        application_link: 'mailto:hr@bankofkiguli.rw',
        status: 'published',
        approved: true,
        featured: false,
        priority: 'Normal'
      }
    ];
    
    console.log(`\nAdding ${freshJobs.length} fresh job listings...`);
    
    let addedCount = 0;
    for (const job of freshJobs) {
      const company = companyMap[job.company_name];
      if (company) {
        await sql`
          INSERT INTO jobs (title, company_id, location, job_type, opportunity_type, experience_level, deadline, description, category, location_type, application_link, application_method, status, approved, featured, priority)
          VALUES (${job.title}, ${company.id}, ${job.location}, ${job.job_type}, ${job.opportunity_type}, ${job.experience_level}, ${job.deadline}, ${job.description}, ${job.category}, ${job.location_type}, ${job.application_link}, 'link', ${job.status}, ${job.approved}, ${job.featured}, ${job.priority})
        `;
        console.log(`  Added: ${job.title} at ${job.company_name}`);
        addedCount++;
      }
    }
    
    // Final verification
    console.log('\n=== FINAL VERIFICATION ===');
    const finalCompanies = await sql`SELECT COUNT(*) as count FROM companies`;
    const finalJobs = await sql`SELECT COUNT(*) as count FROM jobs`;
    
    console.log(`\nDatabase now contains:`);
    console.log(`- Companies: ${finalCompanies[0].count}`);
    console.log(`- Jobs: ${finalJobs[0].count} (added ${addedCount} fresh jobs)`);
    
    // Show latest jobs
    const latestJobs = await sql`
      SELECT j.title, c.name as company_name, j.status, j.approved, j.featured, j.deadline, j.created_at
      FROM jobs j
      JOIN companies c ON j.company_id = c.id
      ORDER BY j.created_at DESC
      LIMIT 10
    `;
    
    console.log('\nLatest job listings:');
    latestJobs.forEach((job, index) => {
      console.log(`${index + 1}. ${job.title} at ${job.company_name}`);
      console.log(`   Status: ${job.status} | Approved: ${job.approved} | Featured: ${job.featured}`);
      console.log(`   Deadline: ${job.deadline} | Posted: ${job.created_at?.toISOString?.().split('T')[0] || 'Recent'}`);
      console.log('');
    });
    
    console.log('=== FRESH JOBS ADDED SUCCESSFULLY ===');
    console.log('\nYour job listings are now up to date!');
    console.log('Test them at: https://rwandajobhub.vercel.app');
    console.log('Admin panel: https://rwandajobhub.vercel.app/admin');
    
  } catch (error) {
    console.error('Failed to add fresh jobs:', error.message);
    process.exit(1);
  }
}

// Run the script
addFreshJobs();
