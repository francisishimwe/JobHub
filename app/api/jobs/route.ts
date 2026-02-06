import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '0')
    const limit = parseInt(searchParams.get('limit') || '15')
    const offset = page * limit

    // "Active" = published + approved + not expired (deadline in future or null)
    // (Your schema allows status: published|draft|closed; we exclude expired by deadline)
    const activeWhere = sql`
      status = 'published'
      AND approved = true
      AND (deadline IS NULL OR deadline >= CURRENT_DATE)
    `

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
        is_verified,
        description,
        attachment_url,
        status,
        approved,
        plan_id,
        priority,
        agency_verified,
        created_at
      FROM jobs
      WHERE ${activeWhere}
      ORDER BY 
        CASE 
          WHEN priority = 'Top' THEN 1
          WHEN priority = 'High' THEN 2
          WHEN priority = 'Normal' THEN 3
          WHEN priority = 'Low' THEN 4
          ELSE 5
        END ASC,
        featured DESC, 
        created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `

    const countResult = await sql`
      SELECT COUNT(*) as total FROM jobs 
      WHERE ${activeWhere}
    `

    const total = countResult[0]?.total || 0
    // Featured tab should count *all* active items (Jobs, Tenders, Internships, Scholarships, Education, Blogs)
    const featuredCount = total

    return NextResponse.json({
      jobs,
      total,
      featuredCount,
      // Back-compat for older client code paths: keep field but ensure it matches featuredCount
      featuredGroupCount: featuredCount,
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
    if (!body.title || !body.company || !body.opportunity_type) {
      return NextResponse.json(
        { error: 'Missing required fields: title, company, opportunity_type' },
        { status: 400 }
      )
    }

    // Create or get company
    let companyId = body.company_id
    if (!companyId && body.company) {
      // Check if company already exists
      const existingCompany = await sql`
        SELECT id FROM companies WHERE name = ${body.company} LIMIT 1
      `
      
      if (existingCompany && existingCompany.length > 0) {
        companyId = existingCompany[0].id
      } else {
        // Create new company
        const newCompany = await sql`
          INSERT INTO companies (name, created_at) 
          VALUES (${body.company}, ${new Date().toISOString()})
          RETURNING id
        `
        companyId = newCompany[0].id
      }
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
        experience_level,
        deadline,
        featured,
        description,
        attachment_url,
        application_link,
        status,
        approved,
        plan_id,
        priority,
        agency_verified,
        is_verified,
        created_at
      ) VALUES (
        ${id},
        ${body.title},
        ${companyId},
        ${body.location || null},
        ${body.jobType || body.job_type || null},
        ${body.opportunity_type},
        ${body.experienceLevel || body.experience_level || null},
        ${body.deadline || null},
        ${body.featured || false},
        ${body.description || null},
        ${body.attachment_url || null},
        ${body.applicationLink || body.application_link || null},
        ${'published'},
        ${true},
        ${body.planId || body.plan_id || 1},
        ${body.planId === 4 || body.plan_id === 4 ? 'Top' : 'Normal'},
        ${body.planId === 4 || body.plan_id === 4 ? true : false},
        ${body.planId === 4 || body.plan_id === 4 ? true : false},
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
      experience_level: newJob.experience_level,
      deadline: newJob.deadline,
      featured: newJob.featured,
      description: newJob.description,
      attachment_url: newJob.attachment_url,
      application_link: newJob.application_link,
      status: newJob.status,
      approved: newJob.approved,
      plan_id: newJob.plan_id,
      priority: newJob.priority,
      agency_verified: newJob.agency_verified,
      is_verified: newJob.is_verified,
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
