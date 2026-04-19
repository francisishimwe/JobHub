const { neon } = require('@neondatabase/serverless');

// Direct database URL
const dbUrl = "postgresql://neondb_owner:npg_mabQenpJ35yN@ep-fragrant-glitter-agu94zx1-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

async function testConnection() {
  try {
    console.log('Testing database connection...');
    console.log('URL length:', dbUrl.length);
    
    const sql = neon(dbUrl);
    
    const result = await sql`SELECT NOW() as current_time, version() as db_version`;
    console.log('Database connected successfully!');
    console.log('Current time:', result[0].current_time);
    console.log('Database version:', result[0].db_version);
    
    // Check if exam_resources table exists
    const tableCheck = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'exam_resources'
    `;
    
    if (tableCheck.length > 0) {
      console.log('exam_resources table exists!');
      
      // Count records
      const count = await sql`SELECT COUNT(*) as count FROM exam_resources`;
      console.log(`Records in exam_resources: ${count[0].count}`);
      
      // Show sample records
      const records = await sql`SELECT title, category, institution FROM exam_resources LIMIT 3`;
      console.log('Sample records:');
      records.forEach((record, index) => {
        console.log(`${index + 1}. ${record.title} (${record.category} - ${record.institution})`);
      });
    } else {
      console.log('exam_resources table does not exist. Running migration...');
      await sql`
        CREATE TABLE IF NOT EXISTS exam_resources (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            title TEXT NOT NULL,
            category TEXT NOT NULL CHECK (category IN ('WRITTEN_EXAM', 'INTERVIEW_PREP')),
            content_type TEXT NOT NULL CHECK (content_type IN ('TEXT', 'PDF_URL')),
            text_content TEXT,
            file_url TEXT,
            institution TEXT NOT NULL,
            featured BOOLEAN DEFAULT false,
            estimated_reading_time INTEGER,
            view_count INTEGER DEFAULT 0,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `;
      
      console.log('Table created successfully!');
    }
    
  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  }
}

testConnection();
