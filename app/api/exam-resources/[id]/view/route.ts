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

export async function POST(
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
    
    // Increment view count
    const result = await sql`
      UPDATE exam_resources 
      SET view_count = COALESCE(view_count, 0) + 1
      WHERE id = ${id}
      RETURNING view_count
    `
    
    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Resource not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      view_count: result[0].view_count 
    })
  } catch (error) {
    console.error('Error updating view count:', error)
    return NextResponse.json(
      { error: 'Failed to update view count' },
      { status: 500 }
    )
  }
}
