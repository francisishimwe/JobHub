import { NextRequest, NextResponse } from 'next/server'
import { sql, getSql } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 GET /api/exam-resources called')
    
    // Test database connection first
    try {
      const testConnection = await sql`SELECT 1 as test`;
      console.log('✅ Database connection successful:', testConnection);
    } catch (dbError) {
      console.error('❌ Database connection failed:', dbError);
      return NextResponse.json(
        { error: 'Database connection failed', details: dbError.message },
        { status: 500 }
      )
    }
    
    // Check if table exists
    try {
      const tableCheck = await sql`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'exam_resources'
      `;
      
      console.log('📋 Table check result:', tableCheck);
      
      if (tableCheck.length === 0) {
        console.log('🔧 Creating exam_resources table...');
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
        console.log('✅ Table created successfully');
      }
    } catch (tableError) {
      console.error('❌ Table check failed:', tableError);
    }
    
    // Fetch resources
    const resources = await sql`
      SELECT id, title, category, content_type, institution, featured, 
             estimated_reading_time, COALESCE(view_count, 0) as view_count,
             created_at, updated_at
      FROM exam_resources
      ORDER BY featured DESC, created_at DESC
    `;
    
    console.log(`📊 Found ${resources.length} resources`);
    
    return NextResponse.json({ resources })
  } catch (error) {
    console.error('❌ Error in GET /api/exam-resources:', error);
    return NextResponse.json(
      { error: 'Failed to fetch exam resources', details: error.message },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('📝 POST /api/exam-resources called');
    
    const body = await request.json()
    const {
      title,
      category,
      content_type,
      text_content,
      file_url,
      institution,
      featured = false,
      estimated_reading_time
    } = body
    
    console.log('📋 Request data:', { title, category, content_type, institution, featured });
    
    // Validation
    if (!title || !category || !content_type || !institution) {
      return NextResponse.json(
        { error: 'Missing required fields: title, category, content_type, institution' },
        { status: 400 }
      )
    }
    
    if (!['WRITTEN_EXAM', 'INTERVIEW_PREP'].includes(category)) {
      return NextResponse.json(
        { error: 'Invalid category. Must be WRITTEN_EXAM or INTERVIEW_PREP' },
        { status: 400 }
      )
    }
    
    if (!['TEXT', 'PDF_URL'].includes(content_type)) {
      return NextResponse.json(
        { error: 'Invalid content_type. Must be TEXT or PDF_URL' },
        { status: 400 }
      )
    }
    
    if (content_type === 'TEXT' && !text_content) {
      return NextResponse.json(
        { error: 'text_content is required when content_type is TEXT' },
        { status: 400 }
      )
    }
    
    if (content_type === 'PDF_URL' && !file_url) {
      return NextResponse.json(
        { error: 'file_url is required when content_type is PDF_URL' },
        { status: 400 }
      )
    }
    
    const result = await sql`
      INSERT INTO exam_resources (
        title, category, content_type, text_content, file_url, 
        institution, featured, estimated_reading_time
      )
      VALUES (${title}, ${category}, ${content_type}, ${text_content}, ${file_url}, 
              ${institution}, ${featured}, ${estimated_reading_time})
      RETURNING *
    `
    
    console.log('✅ Resource created successfully:', result[0]);
    
    return NextResponse.json({ resource: result[0] }, { status: 201 })
  } catch (error) {
    console.error('❌ Error in POST /api/exam-resources:', error);
    return NextResponse.json(
      { error: 'Failed to create exam resource', details: error.message },
      { status: 500 }
    )
  }
}
