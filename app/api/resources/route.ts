import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    let query = `
      SELECT 
        id,
        title,
        description,
        category,
        icon,
        icon_color,
        button_text,
        button_color,
        button_link,
        is_active,
        sort_order,
        created_at,
        updated_at
      FROM resources
      WHERE is_active = true
    `

    const params = []

    if (category && category !== 'all') {
      query += ` AND category = ${category}`
    }

    query += ` ORDER BY sort_order ASC, created_at DESC`

    const resources = await sql`${query}`

    return NextResponse.json({
      resources: resources || []
    })
  } catch (error) {
    console.error('Error fetching resources:', error)
    return NextResponse.json(
      { error: 'Failed to fetch resources' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.title || !body.description || !body.category) {
      return NextResponse.json(
        { error: 'Missing required fields: title, description, category' },
        { status: 400 }
      )
    }

    const id = crypto.randomUUID()
    const now = new Date().toISOString()

    const result = await sql`
      INSERT INTO resources (
        id,
        title,
        description,
        category,
        icon,
        icon_color,
        button_text,
        button_color,
        button_link,
        is_active,
        sort_order,
        created_at,
        updated_at
      ) VALUES (
        ${id},
        ${body.title},
        ${body.description},
        ${body.category},
        ${body.icon || 'FileText'},
        ${body.icon_color || 'blue'},
        ${body.button_text || 'Browse'},
        ${body.button_color || 'blue'},
        ${body.button_link || '/resources'},
        ${body.is_active !== undefined ? body.is_active : true},
        ${body.sort_order || 0},
        ${now},
        ${now}
      )
      RETURNING id, title, description, category, icon, icon_color, button_text, button_color, button_link, is_active, sort_order, created_at
    `

    if (!result || result.length === 0) {
      throw new Error('Failed to create resource')
    }

    return NextResponse.json({
      success: true,
      resource: result[0]
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating resource:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create resource' },
      { status: 500 }
    )
  }
}
