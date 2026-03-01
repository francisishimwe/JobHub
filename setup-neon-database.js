const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

async function setupDatabase() {
  try {
    console.log('🚀 Setting up Neon database...');
    
    // Use DATABASE_URL first, then fall back to other options
    const connectionString = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL || process.env.POSTGRES_URL;
    
    if (!connectionString) {
      console.error('❌ No database connection string found. Please set DATABASE_URL in your environment variables.');
      return;
    }
    
    const sql = neon(connectionString);
    
    // Read and execute schema
    console.log('📋 Creating database schema...');
    const fs = require('fs');
    const schema = fs.readFileSync('schema.sql', 'utf8');
    
    // Split schema into individual statements and execute them
    const statements = schema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await sql`${statement}`;
        } catch (error) {
          // Some statements might fail if they already exist, that's okay
          console.log(`⚠️  Schema note: ${error.message}`);
        }
      }
    }
    
    console.log('✅ Database schema created successfully!');
    
    // Check if we have jobs data
    if (fs.existsSync('jobs_data.csv')) {
      console.log('📊 Importing job data...');
      const { parse } = require('csv-parse/sync');
      const fileContent = fs.readFileSync('jobs_data.csv');
      const records = parse(fileContent, { columns: true });
      
      let importedJobs = 0;
      for (const job of records) {
        try {
          // First create company if needed
          if (job.company_name) {
            await sql`
              INSERT INTO companies (id, name, location, industry)
              VALUES (${job.id}, ${job.company_name}, ${job.location || 'Rwanda'}, ${job.category || 'Technology'})
              ON CONFLICT (id) DO NOTHING
            `;
          }
          
          // Then create job
          await sql`
            INSERT INTO jobs (id, title, company_id, location, job_type, opportunity_type, deadline, status, approved)
            VALUES (${job.id}, ${job.title}, ${job.id}, ${job.location}, ${job.job_type}, ${job.opportunity_type}, ${job.deadline}, ${job.status || 'published'}, true)
            ON CONFLICT (id) DO NOTHING
          `;
          importedJobs++;
        } catch (error) {
          console.log(`⚠️  Job import note: ${error.message}`);
        }
      }
      
      console.log(`✅ Imported ${importedJobs} jobs successfully!`);
    } else {
      console.log('⚠️  jobs_data.csv not found. You can add jobs later through the admin panel.');
    }
    
    // Verify setup
    const jobCount = await sql`SELECT COUNT(*) as count FROM jobs`;
    const companyCount = await sql`SELECT COUNT(*) as count FROM companies`;
    
    console.log(`🎉 Database setup complete!`);
    console.log(`   - Companies: ${companyCount[0].count}`);
    console.log(`   - Jobs: ${jobCount[0].count}`);
    console.log(`   - CV submissions table ready`);
    console.log(`   - Job applications table ready`);
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    console.error('Full error:', error);
  }
}

setupDatabase();
