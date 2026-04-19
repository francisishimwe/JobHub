const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

const NEON_DB_URL = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_mabQenpJ35yN@ep-fragrant-glitter-agu94zx1-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

async function debugExamResources() {
  try {
    console.log('=== DEBUG EXAM RESOURCES ===\n');
    
    const sql = neon(NEON_DB_URL);
    console.log('Connected to database');
    
    // Check if exam_resources table exists
    console.log('\n1. Checking exam_resources table...');
    try {
      const tableCheck = await sql`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'exam_resources'
      `;
      
      if (tableCheck.length === 0) {
        console.log('exam_resources table does NOT exist');
        
        // Create the table
        console.log('\n2. Creating exam_resources table...');
        await sql`
          CREATE TABLE IF NOT EXISTS exam_resources (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            title VARCHAR(255) NOT NULL,
            category VARCHAR(50) NOT NULL CHECK (category IN ('WRITTEN_EXAM', 'INTERVIEW_PREP')),
            content_type VARCHAR(20) NOT NULL CHECK (content_type IN ('TEXT', 'PDF_URL')),
            text_content TEXT,
            file_url VARCHAR(500),
            institution VARCHAR(255) NOT NULL,
            featured BOOLEAN DEFAULT false,
            estimated_reading_time INTEGER,
            view_count INTEGER DEFAULT 0,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `;
        console.log('exam_resources table created successfully');
      } else {
        console.log('exam_resources table exists');
      }
    } catch (error) {
      console.log('Error checking table:', error.message);
    }
    
    // Check current data
    console.log('\n3. Checking current data in exam_resources...');
    try {
      const currentData = await sql`SELECT * FROM exam_resources ORDER BY created_at DESC`;
      console.log(`Found ${currentData.length} records:`);
      
      currentData.forEach((resource, index) => {
        console.log(`\n${index + 1}. ${resource.title}`);
        console.log(`   Category: ${resource.category}`);
        console.log(`   Institution: ${resource.institution}`);
        console.log(`   Featured: ${resource.featured}`);
        console.log(`   Created: ${resource.created_at}`);
        console.log(`   Content Type: ${resource.content_type}`);
        console.log(`   Text Content: ${resource.text_content ? 'Yes' : 'No'}`);
        console.log(`   File URL: ${resource.file_url ? 'Yes' : 'No'}`);
      });
    } catch (error) {
      console.log('Error fetching data:', error.message);
    }
    
    // Test API query
    console.log('\n4. Testing API query...');
    try {
      const apiQuery = await sql`
        SELECT id, title, category, content_type, institution, featured, 
               estimated_reading_time, COALESCE(view_count, 0) as view_count,
               created_at, updated_at
        FROM exam_resources
        WHERE 1=1
        ORDER BY featured DESC, created_at DESC
      `;
      console.log(`API query returned ${apiQuery.length} results`);
    } catch (error) {
      console.log('Error with API query:', error.message);
    }
    
  } catch (error) {
    console.error('Debug failed:', error.message);
  }
}

debugExamResources();
