import { NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

export async function GET() {
  try {
    const dbUrl = process.env.DATABASE_URL
    if (!dbUrl) {
      return NextResponse.json({ error: 'DATABASE_URL not found' }, { status: 500 })
    }

    const sql = neon(dbUrl)
    
    // Check if table exists
    const tableCheck = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'exam_resources'
    `
    
    let tableExists = tableCheck.length > 0
    
    let data = []
    if (tableExists) {
      data = await sql`SELECT * FROM exam_resources ORDER BY created_at DESC`
    }
    
    return NextResponse.json({
      tableExists,
      count: data.length,
      data: data.map(item => ({
        id: item.id,
        title: item.title,
        category: item.category,
        institution: item.institution,
        featured: item.featured,
        created_at: item.created_at,
        text_content: item.text_content ? 'Yes' : 'No',
        file_url: item.file_url ? 'Yes' : 'No'
      }))
    })
    
  } catch (error) {
    console.error('Debug error:', error)
    return NextResponse.json({ 
      error: error.message,
      stack: error.stack 
    }, { status: 500 })
  }
}
