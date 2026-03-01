const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

async function updateJobDeadlines() {
  try {
    console.log('🔄 Updating job deadlines...');
    
    const connectionString = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL || process.env.POSTGRES_URL;
    
    if (!connectionString) {
      console.error('❌ No database connection string found.');
      return;
    }
    
    const sql = neon(connectionString);
    
    // Update existing job deadlines to future dates
    const updates = [
      { title: 'Full Stack Developer', deadline: '2025-03-31' },
      { title: 'Frontend Developer', deadline: '2025-04-15' },
      { title: 'Backend Developer', deadline: '2025-04-20' },
      { title: 'UI/UX Designer', deadline: '2025-04-25' },
      { title: 'Mobile App Developer', deadline: '2025-04-18' }
    ];
    
    for (const job of updates) {
      await sql`
        UPDATE jobs 
        SET deadline = ${job.deadline}
        WHERE title = ${job.title}
      `;
      console.log(`✅ Updated ${job.title} deadline to ${job.deadline}`);
    }
    
    // Verify the updates
    const result = await sql`
      SELECT title, deadline, 
             CASE WHEN deadline > CURRENT_DATE THEN 'Active' ELSE 'Expired' END as status
      FROM jobs 
      ORDER BY title
    `;
    
    console.log('\n📋 Current job status:');
    result.forEach(job => {
      console.log(`- ${job.title}: ${job.deadline} (${job.status})`);
    });
    
    console.log('\n✅ Job deadlines updated successfully!');
    
  } catch (error) {
    console.error('❌ Error updating job deadlines:', error);
  }
}

updateJobDeadlines();
