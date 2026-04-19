const { neon } = require('@neondatabase/serverless');

const NEON_DB_URL = "postgresql://neondb_owner:npg_mabQenpJ35yN@ep-fragrant-glitter-agu94zx1-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

async function restoreSimple() {
  try {
    console.log('=== RESTORING ORIGINAL STATE ===\n');
    
    const sql = neon(NEON_DB_URL);
    console.log('Connected to database');
    
    // Clear everything first
    console.log('\n1. Clearing database...');
    await sql`DELETE FROM jobs`;
    await sql`DELETE FROM companies`;
    console.log('Database cleared');
    
    // Restore basic companies
    console.log('\n2. Restoring companies...');
    await sql`
      INSERT INTO companies (id, name, created_at) VALUES
        ('2d807041-4e57-430b-baaa-99daa4e291ae', 'Rugabano Outgrowers Services Ltd', '2026-03-04T17:48:39.000Z'),
        ('7c9d909a-03db-4781-9653-dd78f92e3546', 'MTN', '2026-03-04T19:11:16.000Z'),
        ('b6a13b26-ad86-4f93-bb95-ad27556c68f5', 'MTN', '2026-03-04T19:18:14.000Z'),
        ('7da63fee-2465-4705-b200-7e1ea3b245d6', 'RwandAir', '2026-03-04T19:57:48.000Z')
    `;
    
    console.log('Companies restored');
    
    // Restore basic jobs
    console.log('\n3. Restoring jobs...');
    await sql`
      INSERT INTO jobs (
        id, title, company_id, location, job_type, opportunity_type, experience_level,
        deadline, description, application_link, application_method, status, approved,
        posted_date, created_at, updated_at
      ) VALUES
      (
        'f19f7bde-33a6-4524-aa61-d2c293abf7a1', 'Senior Software Engineer', '7da63fee-2465-4705-b200-7e1ea3b245d6',
        'Karongi', NULL, 'Job', '3 YEARS', '2026-03-21', 
        '<p>Senior Software Engineer position</p>', 'https://example.com/job1', 'link', 'published', true,
        '2026-03-04T18:31:07.630Z', '2026-03-04T16:31:07.630Z', '2026-03-04T16:31:07.591Z'
      ),
      (
        '1a4017eb0e4f46c3ba8e9127a91de0c2', 'Tea Agronomist', '7da63fee-2465-4705-b200-7e1ea3b245d6',
        'KIREHE', NULL, 'Job', '3 YEARS', '2026-03-18',
        '<p>Tea Agronomist position</p>', 'https://example.com/job2', 'link', 'published', true,
        '2026-03-04T18:33:28.326Z', '2026-03-04T16:33:28.387Z', '2026-03-04T16:33:28.326Z'
      ),
      (
        '79e14f1e44c4453485f1bbeb6dd57338', 'Senior Software Engineer', '7da63fee-2465-4705-b200-7e1ea3b245d6',
        'KIREHE', 'Contract', 'Job', '3 YEARS', '2026-03-19',
        '<p>Senior Software Engineer (Contract)</p>', 'https://example.com/job3', 'link', 'published', true,
        '2026-03-04T18:31:07.630Z', '2026-03-04T16:31:07.630Z', '2026-03-04T16:31:07.591Z'
      ),
      (
        'jobid4524aa61d2c293abf7a1', 'Senior Software Engineer', '7da63fee-2465-4705-b200-7e1ea3b245d6',
        'Karongi', 'Full-time', 'Job', '3 YEARS', '2026-03-20',
        '<p>Senior Software Engineer (Full-time)</p>', 'https://example.com/job4', 'link', 'published', true,
        '2026-03-04T18:31:07.630Z', '2026-03-04T16:31:07.630Z', '2026-03-04T16:31:07.591Z'
      )
    `;
    
    console.log('Jobs restored');
    
    // Verify
    console.log('\n4. Verification...');
    const jobCount = await sql`SELECT COUNT(*) as count FROM jobs`;
    const companyCount = await sql`SELECT COUNT(*) as count FROM companies`;
    
    console.log(`Database now contains:`);
    console.log(`- Companies: ${companyCount[0].count}`);
    console.log(`- Jobs: ${jobCount[0].count}`);
    
    console.log('\n=== RESTORATION COMPLETED ===');
    console.log('Database has been restored to original state');
    console.log('Website: https://rwandajobhub.vercel.app');
    
  } catch (error) {
    console.error('Restoration failed:', error.message);
  }
}

restoreSimple();
