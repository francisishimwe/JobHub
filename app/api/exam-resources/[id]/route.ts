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

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
    if (!id) {
      return NextResponse.json(
        { error: 'Resource ID is required' },
        { status: 400 }
      )
    }

    const sql = getDatabase()
    
    // Get the resource with all details
    const resources = await sql`
      SELECT id, title, category, content_type, text_content, file_url, 
             institution, featured, estimated_reading_time, view_count,
             created_at, updated_at
      FROM exam_resources
      WHERE id = ${id}
    `
    
    if (resources.length === 0) {
      return NextResponse.json(
        { error: 'Resource not found' },
        { status: 404 }
      )
    }

    const resource = resources[0]
    
    // Map to the expected interface
    const mappedResource = {
      id: resource.id,
      title: resource.title,
      category: resource.category,
      content_type: resource.content_type,
      text_content: resource.text_content,
      file_url: resource.file_url,
      institution: resource.institution,
      featured: resource.featured,
      study_time: resource.estimated_reading_time,
      view_count: resource.view_count || 0,
      created_at: resource.created_at,
      updated_at: resource.updated_at
    }

    // Cache for 10 minutes (600 seconds)
    const response = NextResponse.json({ resource: mappedResource })
    response.headers.set('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=1200')
    
    return response
  } catch (error) {
    console.error('Error fetching exam resource:', error)
    return NextResponse.json(
      { error: 'Failed to fetch exam resource' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
    if (!id) {
      return NextResponse.json(
        { error: 'Resource ID is required' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const {
      title,
      category,
      content_type,
      text_content,
      file_url,
      institution,
      featured,
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
    
    // Check if resource exists
    const existing = await sql`SELECT id FROM exam_resources WHERE id = ${id}`
    if (existing.length === 0) {
      return NextResponse.json(
        { error: 'Resource not found' },
        { status: 404 }
      )
    }
    
    // Update the resource
    const result = await sql`
      UPDATE exam_resources 
      SET title = ${title}, 
          category = ${category}, 
          content_type = ${content_type}, 
          text_content = ${text_content}, 
          file_url = ${file_url}, 
          institution = ${institution}, 
          featured = ${featured}, 
          estimated_reading_time = ${estimated_reading_time}
      WHERE id = ${id}
      RETURNING *
    `
    
    return NextResponse.json({ resource: result[0] }, { status: 200 })
  } catch (error) {
    console.error('Error updating exam resource:', error)
    return NextResponse.json(
      { error: 'Failed to update exam resource' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
    if (!id) {
      return NextResponse.json(
        { error: 'Resource ID is required' },
        { status: 400 }
      )
    }

    const sql = getDatabase()
    
    // Check if resource exists
    const existing = await sql`SELECT id FROM exam_resources WHERE id = ${id}`
    if (existing.length === 0) {
      return NextResponse.json(
        { error: 'Resource not found' },
        { status: 404 }
      )
    }
    
    // Delete the resource
    await sql`DELETE FROM exam_resources WHERE id = ${id}`
    
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Error deleting exam resource:', error)
    return NextResponse.json(
      { error: 'Failed to delete exam resource' },
      { status: 500 }
    )
  }
}
