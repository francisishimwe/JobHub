import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (id) {
      // Get a specific inquiry
      const result = await sql`
        SELECT * FROM inquiries WHERE id = ${id}
      `
      if (result.length === 0) {
        return NextResponse.json(
          { error: 'Inquiry not found' },
          { status: 404 }
        )
      }
      return NextResponse.json(result[0])
    } else {
      // Get all inquiries
      const inquiries = await sql`
        SELECT * FROM inquiries ORDER BY created_at DESC
      `
      return NextResponse.json({ inquiries })
    }
  } catch (error) {
    console.error('Error fetching inquiries:', error)
    return NextResponse.json(
      { error: 'Failed to fetch inquiries' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.firstName || !body.lastName || !body.email || !body.subject || !body.message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const id = crypto.randomUUID()
    const now = new Date().toISOString()

    const result = await sql`
      INSERT INTO inquiries (
        id,
        first_name,
        last_name,
        email,
        phone,
        subject,
        message,
        status,
        created_at
      ) VALUES (
        ${id},
        ${body.firstName},
        ${body.lastName},
        ${body.email},
        ${body.phone || null},
        ${body.subject},
        ${body.message},
        'new',
        ${now}
      )
      RETURNING id, first_name, last_name, email, phone, subject, message, status, created_at
    `

    if (!result || result.length === 0) {
      throw new Error('Failed to insert inquiry')
    }

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error('Error creating inquiry:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create inquiry' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Missing required parameter: id' },
        { status: 400 }
      )
    }

    // Update inquiry
    const updateFields = []
    const values = []

    if (body.status) {
      updateFields.push(`status = $${updateFields.length + 1}`)
      values.push(body.status)
    }
    if (body.firstName) {
      updateFields.push(`first_name = $${updateFields.length + 1}`)
      values.push(body.firstName)
    }
    if (body.lastName) {
      updateFields.push(`last_name = $${updateFields.length + 1}`)
      values.push(body.lastName)
    }

    if (updateFields.length === 0) {
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      )
    }

    values.push(id)

    const result = await sql`
      UPDATE inquiries
      SET ${updateFields.join(', ')}
      WHERE id = $${values.length}
      RETURNING *
    `

    if (!result || result.length === 0) {
      return NextResponse.json(
        { error: 'Inquiry not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error('Error updating inquiry:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update inquiry' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Missing required parameter: id' },
        { status: 400 }
      )
    }

    const result = await sql`
      DELETE FROM inquiries WHERE id = ${id}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting inquiry:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete inquiry' },
      { status: 500 }
    )
  }
}
