import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const companies = await sql`
      SELECT 
        id,
        name,
        logo,
        location,
        industry,
        website,
        created_at
      FROM companies
      ORDER BY created_at DESC
    `

    return NextResponse.json({
      companies: companies || []
    })
  } catch (error) {
    console.error('Error fetching companies:', error)
    return NextResponse.json(
      { error: 'Failed to fetch companies' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.name) {
      return NextResponse.json(
        { error: 'Missing required field: name' },
        { status: 400 }
      )
    }

    // Generate UUID
    const id = crypto.randomUUID()
    const now = new Date().toISOString()

    const result = await sql`
      INSERT INTO companies (
        id,
        name,
        logo,
        location,
        industry,
        website,
        created_at
      ) VALUES (
        ${id},
        ${body.name},
        ${body.logo || null},
        ${body.location || null},
        ${body.industry || null},
        ${body.website || null},
        ${now}
      )
      RETURNING id, name, logo, location, industry, website, created_at
    `

    if (!result || result.length === 0) {
      throw new Error('Failed to insert company')
    }

    const company = result[0]

    return NextResponse.json({
      id: company.id,
      name: company.name,
      logo: company.logo,
      location: company.location,
      industry: company.industry,
      website: company.website,
      created_at: company.created_at
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating company:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create company' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.id) {
      return NextResponse.json(
        { error: 'Missing required field: id' },
        { status: 400 }
      )
    }

    const result = await sql`
      UPDATE companies
      SET 
        name = ${body.name || null},
        logo = ${body.logo || null},
        location = ${body.location || null},
        industry = ${body.industry || null},
        website = ${body.website || null}
      WHERE id = ${body.id}
      RETURNING id, name, logo, location, industry, website, created_at
    `

    if (!result || result.length === 0) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      )
    }

    const company = result[0]

    return NextResponse.json({
      id: company.id,
      name: company.name,
      logo: company.logo,
      location: company.location,
      industry: company.industry,
      website: company.website,
      created_at: company.created_at
    })
  } catch (error) {
    console.error('Error updating company:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update company' },
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

    await sql`
      DELETE FROM companies
      WHERE id = ${id}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting company:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete company' },
      { status: 500 }
    )
  }
}
