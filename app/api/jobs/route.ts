import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.POSTGRES_URL!)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '0')
    const limit = parseInt(searchParams.get('limit') || '15')
    const offset = page * limit

    const jobs = await sql`
      SELECT 
        id,
        title,
        company_id,
        location,
        job_type,
        opportunity_type,
        deadline,
        featured,
        description,
        attachment_url,
        status,
        approved,
        created_at
      FROM jobs
      WHERE status = 'published' AND approved = true
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `

    const countResult = await sql`
      SELECT COUNT(*) as total FROM jobs 
      WHERE status = 'published' AND approved = true
    `

    const total = countResult[0]?.total || 0

    return NextResponse.json({
      jobs,
      total,
      page,
      limit,
      hasMore: offset + limit < total
    })
  } catch (error) {
    console.error('Error fetching jobs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.title || !body.company_id || !body.opportunity_type) {
      return NextResponse.json(
        { error: 'Missing required fields: title, company_id, opportunity_type' },
        { status: 400 }
      )
    }

    // Generate UUID
    const id = crypto.randomUUID()
    const now = new Date().toISOString()

    const result = await sql`
      INSERT INTO jobs (
        id,
        title,
        company_id,
        location,
        job_type,
        opportunity_type,
        deadline,
        featured,
        description,
        attachment_url,
        status,
        approved,
        created_at
      ) VALUES (
        ${id},
        ${body.title},
        ${body.company_id},
        ${body.location || null},
        ${body.job_type || null},
        ${body.opportunity_type},
        ${body.deadline || null},
        ${body.featured || false},
        ${body.description || null},
        ${body.attachment_url || null},
        ${'published'},
        ${true},
        ${now}
      )
      RETURNING *
    `

    if (!result || result.length === 0) {
      throw new Error('Failed to insert job')
    }

    const newJob = result[0]

    return NextResponse.json({
      id: newJob.id,
      title: newJob.title,
      company_id: newJob.company_id,
      location: newJob.location,
      job_type: newJob.job_type,
      opportunity_type: newJob.opportunity_type,
      deadline: newJob.deadline,
      featured: newJob.featured,
      description: newJob.description,
      attachment_url: newJob.attachment_url,
      status: newJob.status,
      approved: newJob.approved,
      created_at: newJob.created_at
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating job:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create job' },
      { status: 500 }
    )
  }
}
