import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

// Lazy database connection - only created when needed
const getDatabase = () => {
  const dbUrl = process.env.DATABASE_URL
  if (!dbUrl) {
    throw new Error('DATABASE_URL is not defined in environment variables')
  }
  return neon(dbUrl)
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const institution = searchParams.get('institution')
    const featured = searchParams.get('featured')
    
    // Create cache key based on search params
    const cacheKey = `exam-resources-${category || 'all'}-${institution || 'all'}-${featured || 'false'}`
    
    const sql = getDatabase()
    
    // Build the base query
    let query = `
      SELECT id, title, category, content_type, institution, featured, 
             estimated_reading_time, COALESCE(view_count, 0) as view_count,
             created_at, updated_at
      FROM exam_resources
      WHERE 1=1
    `
    
    // Apply filters conditionally
    const conditions = []
    
    if (category) {
      conditions.push(`category = ${category}`)
    }
    
    if (institution) {
      conditions.push(`institution ILIKE ${`%${institution}%`}`)
    }
    
    if (featured === 'true') {
      conditions.push(`featured = true`)
    }
    
    // Combine conditions
    if (conditions.length > 0) {
      query += ` AND ${conditions.join(' AND ')}`
    }
    
    query += ` ORDER BY featured DESC, created_at DESC`
    
    const resources = await sql.unsafe(query)
    
    // Cache for 5 minutes (300 seconds)
    const response = NextResponse.json({ resources })
    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600')
    
    return response
  } catch (error) {
    console.error('Error fetching exam resources:', error)
    return NextResponse.json(
      { error: 'Failed to fetch exam resources' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
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
    
    const sql = getDatabase()
    const result = await sql`
      INSERT INTO exam_resources (
        title, category, content_type, text_content, file_url, 
        institution, featured, estimated_reading_time
      )
      VALUES (${title}, ${category}, ${content_type}, ${text_content}, ${file_url}, 
              ${institution}, ${featured}, ${estimated_reading_time})
      RETURNING *
    `
    
    return NextResponse.json({ resource: result[0] }, { status: 201 })
  } catch (error) {
    console.error('Error creating exam resource:', error)
    return NextResponse.json(
      { error: 'Failed to create exam resource' },
      { status: 500 }
    )
  }
}
