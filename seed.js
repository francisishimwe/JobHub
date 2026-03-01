const { neon } = require('@neondatabase/serverless');
const fs = require('fs');
const { parse } = require('csv-parse/sync');
require('dotenv').config({ path: '.env.local' });

async function run() {
  // Uses the POSTGRES_URL from your .env.local
  const sql = neon(process.env.POSTGRES_URL);
  
  if (!fs.existsSync('jobs_data.csv')) {
    console.error("❌ Error: jobs_data.csv not found in the sidebar!");
    return;
  }

  const fileContent = fs.readFileSync('jobs_data.csv');
  const records = parse(fileContent, { columns: true });

  console.log(`Found ${records.length} jobs. Uploading to Neon...`);

  for (const r of records) {
    try {
      // Added "public"."jobs" to fix the "relation does not exist" error
      await sql`
        INSERT INTO "public"."jobs" (id, title, location, job_type, opportunity_type, deadline, category, status)
        VALUES (${r.id}, ${r.title}, ${r.location}, ${r.job_type}, ${r.opportunity_type}, ${r.deadline}, ${r.category}, ${r.status || 'published'})
        ON CONFLICT (id) DO NOTHING;
      `;
    } catch (err) {
      console.error(`❌ Failed: ${r.title} -> ${err.message}`);
    }
  }
  
  // Final verification check
  const count = await sql`SELECT count(*) FROM "public"."jobs"`;
  console.log(`✅ Finished! Database now contains ${count[0].count} jobs.`);
}

run();