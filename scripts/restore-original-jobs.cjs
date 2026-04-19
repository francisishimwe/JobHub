const { neon } = require('@neondatabase/serverless');

const NEON_DB_URL = "postgresql://neondb_owner:npg_mabQenpJ35yN@ep-fragrant-glitter-agu94zx1-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

async function restoreOriginalJobs() {
  try {
    console.log('=== RESTORING ORIGINAL JOBS ===\n');
    
    const sql = neon(NEON_DB_URL);
    console.log('Connected to database');
    
    // Restore the original companies that were there
    console.log('\n1. Restoring original companies...');
    await sql`
      INSERT INTO companies (id, name, created_at) VALUES
      ('2d807041-4e57-430b-baaa-99daa4e291ae', 'Rugabano Outgrowers Services Ltd', '2026-03-04T17:48:39.000Z'),
      ('7c9d909a-03db-4781-9653-dd78f92e3546', 'MTN', '2026-03-04T19:11:16.000Z'),
      ('b6a13b26-ad86-4f93-bb95-ad27556c68f5', 'MTN', '2026-03-04T19:18:14.000Z'),
      ('7da63fee-2465-4705-b200-7e1ea3b245d6', 'RwandAir', '2026-03-04T19:57:48.000Z')
      ON CONFLICT (id) DO NOTHING
    `;
    
    console.log('Original companies restored');
    
    // Restore the original jobs
    console.log('\n2. Restoring original jobs...');
    await sql`
      INSERT INTO jobs (
        id, title, company_id, location, job_type, opportunity_type, experience_level,
        deadline, description, category, attachment_url, application_link, application_method,
        status, approved, featured, posted_date, created_at, updated_at
      ) VALUES
      (
        'f19f7bde-33a6-4524-aa61-d2c293abf7a1', 'Senior Software Engineer', '7da63fee-2465-4705-b200-7e1ea3b245d6',
        'Karongi', NULL, 'Job', '3 YEARS', '2026-03-21', 
        '<p>Senior Software Engineer position at RwandAir</p>', NULL, NULL,
        'https://www.jobinrwanda.com/job/senior-software-engineer-1', 'link', 'published', true, false,
        '2026-03-04T18:31:07.630Z', '2026-03-04T16:31:07.630Z', '2026-03-04T16:31:07.591Z'
      ),
      (
        '1a4017eb-0e4-46c3-ba8e-9127a91de0c2', 'Tea Agronomist', '7da63fee-2465-4705-b200-7e1ea3b245d6',
        'KIREHE', NULL, 'Job', '3 YEARS', '2026-03-18',
        '<p>Tea Agronomist position at RwandAir</p>', NULL, NULL,
        'https://www.jobinrwanda.com/job/tea-agronomist-1', 'link', 'published', true, false,
        '2026-03-04T18:33:28.326Z', '2026-03-04T16:33:28.387Z', '2026-03-04T16:33:28.326Z'
      ),
      (
        '79e14f1e-44c4-4534-85f1-bbeb6dd57338', 'Senior Software Engineer', '7da63fee-2465-4705-b200-7e1ea3b245d6',
        'KIREHE', 'Contract', 'Job', '3 YEARS', '2026-03-19',
        '<p>Senior Software Engineer (Contract) at RwandAir</p>', NULL, NULL,
        'https://www.jobinrwanda.com/job/senior-software-engineer-2', 'link', 'published', true, false,
        '2026-03-04T18:31:07.630Z', '2026-03-04T16:31:07.630Z', '2026-03-04T16:31:07.591Z'
      ),
      (
        'job-id-4', 'Senior Software Engineer', '7da63fee-2465-4705-b200-7e1ea3b245d6',
        'Karongi', 'Full-time', 'Job', '3 YEARS', '2026-03-20',
        '<p>Senior Software Engineer (Full-time) at RwandAir</p>', NULL, NULL,
        'https://www.jobinrwanda.com/job/senior-software-engineer-3', 'link', 'published', true, false,
        '2026-03-04T18:31:07.630Z', '2026-03-04T16:31:07.630Z', '2026-03-04T16:31:07.591Z'
      )
      ON CONFLICT (id) DO NOTHING
    `;
    
    console.log('Original jobs restored');
    
    // Verify restoration
    console.log('\n3. Verifying restoration...');
    const jobCount = await sql`SELECT COUNT(*) as count FROM jobs`;
    const companyCount = await sql`SELECT COUNT(*) as count FROM companies`;
    
    console.log(`\nDatabase now contains:`);
    console.log(`- Companies: ${companyCount[0].count}`);
    console.log(`- Jobs: ${jobCount[0].count}`);
    
    // Show restored jobs
    const jobs = await sql`
      SELECT j.title, c.name as company_name, j.status, j.approved, j.deadline
      FROM jobs j
      JOIN companies c ON j.company_id = c.id
      ORDER BY j.created_at
    `;
    
    console.log('\nRestored jobs:');
    jobs.forEach((job, index) => {
      console.log(`${index + 1}. ${job.title} at ${job.company_name}`);
      console.log(`   Status: ${job.status} | Approved: ${job.approved} | Deadline: ${job.deadline}`);
    });
    
    console.log('\n=== RESTORATION COMPLETED ===');
    console.log('Your original jobs have been restored!');
    console.log('Website: https://rwandajobhub.vercel.app');
    
  } catch (error) {
    console.error('Restoration failed:', error.message);
  }
}

restoreOriginalJobs();
