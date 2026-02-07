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

    // Sorting hierarchy logic:
    // Rank 1: Employer Jobs with Tier 4 (Short-listing) - plan_id = 4 AND agency_verified = true
    // Rank 2: Employer Jobs with Tier 3/2 - plan_id IN (2,3) AND agency_verified = true  
    // Rank 3: Admin "Trending" jobs and Basic (Tier 1) Employer jobs - newest first
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
          -- Rank 1: Employer Tier 4 (Short-listing)
          WHEN agency_verified = true AND plan_id = 4 THEN 1
          -- Rank 2: Employer Tier 3/2 (Super Featured, Featured+)
          WHEN agency_verified = true AND plan_id IN (2,3) THEN 2
          -- Rank 3: Admin jobs and Basic Employer Tier 1
          ELSE 3
        END ASC,
        -- Within each rank, sort by newest first
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

    // Determine if this is an employer job (has plan info) or admin job
    const isEmployerJob = body.planId || body.plan_id
    const planId = isEmployerJob ? (body.planId || body.plan_id || 1) : 1
    
    // Validate required fields for employer jobs
    if (isEmployerJob) {
      if (!body.title || !body.employerName || !body.opportunity_type) {
        return NextResponse.json(
          { error: 'Missing required fields: title, employerName, opportunity_type' },
          { status: 400 }
        )
      }
    } else {
      // Admin job validation
      if (!body.title || !body.company || !body.opportunity_type) {
        return NextResponse.json(
          { error: 'Missing required fields: title, company, opportunity_type' },
          { status: 400 }
        )
      }
    }

    // Set agency verification for employer jobs based on plan
    const agencyVerified = isEmployerJob ? true : false
    const priority = planId === 4 ? 'Top' : (planId >= 2 ? 'High' : 'Normal')
    
    // For employer jobs, use the employer company info from form
    let companyId = body.company_id
    
    // If no company_id but we have employerName, create/find company
    if (!companyId && isEmployerJob && body.employerName) {
      // Check if company already exists
      const existingCompany = await sql`
        SELECT id FROM companies WHERE name = ${body.employerName} LIMIT 1
      `
      
      if (existingCompany && existingCompany.length > 0) {
        companyId = existingCompany[0].id
      } else {
        // Create new company from employer info
        const newCompany = await sql`
          INSERT INTO companies (name, created_at) 
          VALUES (${body.employerName}, ${new Date().toISOString()})
          RETURNING id
        `
        companyId = newCompany[0].id
      }
    } else if (!companyId && !isEmployerJob && body.company) {
      // Admin job - use company field
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

    // Ensure we have a valid company_id
    if (!companyId) {
      return NextResponse.json(
        { error: 'Company information is required. Please select or add a company.' },
        { status: 400 }
      )
    }

    const result = await sql`
      INSERT INTO jobs (
        id,
        title,
        company_id,
        employer_name,
        employer_email,
        employer_phone,
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
        created_at,
        updated_at
      ) VALUES (
        ${id},
        ${body.title},
        ${companyId},
        ${body.employerName || null},
        ${body.employerEmail || null},
        ${body.employerPhone || null},
        ${body.location || null},
        ${body.jobType || body.job_type || null},
        ${body.opportunity_type},
        ${body.experienceLevel || body.experience_level || null},
        ${body.deadline || null},
        ${body.featured || false},
        ${body.description || null},
        ${body.attachment_url || null},
        ${body.applicationLink || body.application_link || null},
        ${isEmployerJob ? 'pending' : 'published'},
        ${isEmployerJob ? false : true},
        ${planId},
        ${priority},
        ${agencyVerified},
        ${agencyVerified},
        ${now},
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
