const { neon } = require('@neondatabase/serverless');

async function cleanDatabase() {
  const sql = neon("postgresql://neondb_owner:npg_mabQenpJ35yN@ep-fragrant-glitter-agu94zx1-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require");
  
  console.log('🧹 Cleaning database - removing outdated and mock jobs...\n');
  
  // Check current state before cleaning
  const totalBefore = await sql`SELECT COUNT(*) as count FROM jobs`;
  const withDescBefore = await sql`SELECT COUNT(*) as count FROM jobs WHERE description IS NOT NULL AND description != ''`;
  const outdatedBefore = await sql`SELECT COUNT(*) as count FROM jobs WHERE deadline < CURRENT_DATE`;
  const emptyDescBefore = await sql`SELECT COUNT(*) as count FROM jobs WHERE description IS NULL OR description = ''`;
  
  console.log('📊 Before cleaning:');
  console.log(`   Total jobs: ${totalBefore[0].count}`);
  console.log(`   Jobs with descriptions: ${withDescBefore[0].count}`);
  console.log(`   Outdated jobs (deadline passed): ${outdatedBefore[0].count}`);
  console.log(`   Jobs with empty descriptions: ${emptyDescBefore[0].count}`);
  
  // Delete outdated jobs (deadline passed)
  console.log('\n🗑️  Deleting outdated jobs...');
  try {
    const deletedOutdated = await sql`
      DELETE FROM jobs 
      WHERE deadline < CURRENT_DATE
      RETURNING id, title
    `;
    console.log(`✅ Deleted ${deletedOutdated.length} outdated jobs`);
    deletedOutdated.forEach(job => {
      console.log(`   - ${job.title}`);
    });
  } catch (error) {
    console.log('⚠️  Error deleting outdated jobs:', error.message);
  }
  
  // Delete jobs with empty descriptions (mock jobs)
  console.log('\n🗑️  Deleting jobs with empty descriptions (mock jobs)...');
  try {
    const deletedEmpty = await sql`
      DELETE FROM jobs 
      WHERE description IS NULL OR description = '' OR LENGTH(TRIM(description)) = 0
      RETURNING id, title
    `;
    console.log(`✅ Deleted ${deletedEmpty.length} jobs with empty descriptions`);
    deletedEmpty.forEach(job => {
      console.log(`   - ${job.title}`);
    });
  } catch (error) {
    console.log('⚠️  Error deleting empty description jobs:', error.message);
  }
  
  // Check final state
  const totalAfter = await sql`SELECT COUNT(*) as count FROM jobs`;
  const withDescAfter = await sql`SELECT COUNT(*) as count FROM jobs WHERE description IS NOT NULL AND description != ''`;
  const activeJobs = await sql`
    SELECT COUNT(*) as count FROM jobs 
    WHERE (status = 'published' OR status = 'active')
    AND approved = true
    AND description IS NOT NULL 
    AND description != ''
    AND (deadline IS NULL OR deadline >= CURRENT_DATE)
  `;
  
  console.log('\n📊 After cleaning:');
  console.log(`   Total jobs remaining: ${totalAfter[0].count}`);
  console.log(`   Jobs with descriptions: ${withDescAfter[0].count}`);
  console.log(`   Active jobs with descriptions: ${activeJobs[0].count}`);
  
  // Show sample of remaining jobs
  console.log('\n📋 Sample of remaining jobs:');
  const sampleJobs = await sql`
    SELECT 
      j.title,
      j.deadline,
      c.name as company_name,
      LENGTH(j.description) as desc_length
    FROM jobs j
    LEFT JOIN companies c ON j.company_id = c.id
    WHERE (j.status = 'published' OR j.status = 'active')
    AND j.approved = true
    AND j.description IS NOT NULL 
    AND j.description != ''
    AND (j.deadline IS NULL OR j.deadline >= CURRENT_DATE)
    ORDER BY j.created_at DESC
    LIMIT 5
  `;
  
  sampleJobs.forEach((job, index) => {
    const daysLeft = job.deadline ? Math.ceil((new Date(job.deadline) - new Date()) / (1000 * 60 * 60 * 24)) : 'Open';
    console.log(`${index + 1}. ${job.title} - ${job.company_name} (${daysLeft} days left)`);
  });
  
  console.log('\n✅ Database cleaning completed!');
}

cleanDatabase().catch(console.error);
