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
        j.id,
        j.title,
        j.company_id,
        j.location,
        j.location_type,
        j.job_type,
        j.opportunity_type,
        j.experience_level,
        j.deadline,
        j.featured,
        j.description,
        j.attachment_url,
        j.application_link,
        j.application_method,
        j.primary_email,
        j.cc_emails,
        j.status,
        j.approved,
        j.applicants,
        j.views,
        j.created_at,
        c.name as company_name,
        c.logo as company_logo
      FROM jobs j
      LEFT JOIN companies c ON j.company_id = c.id
      WHERE ${activeWhere}
      ORDER BY j.created_at DESC
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
    
    console.log('📝 Received job submission:', body)

    // Determine tier from selected plan
    const selectedPlan = body.selectedPlan || 'basic'
    
    // Tier configuration
    const tierConfig: { [key: string]: any } = {
      'featured': {
        tier: 'featured',
        price: 50000,
        priority_placement: false,
        social_media_promotion: false,
        whatsapp_promotion: false,
        candidate_pre_screening: false,
        priority_candidate_matching: false
      },
      'featured-plus': {
        tier: 'featured-plus',
        price: 75000,
        priority_placement: true,
        social_media_promotion: true,
        whatsapp_promotion: false,
        candidate_pre_screening: false,
        priority_candidate_matching: false
      },
      'super-featured': {
        tier: 'super-featured',
        price: 100000,
        priority_placement: true,
        social_media_promotion: true,
        whatsapp_promotion: true,
        candidate_pre_screening: false,
        priority_candidate_matching: false
      },
      'short-listing': {
        tier: 'short-listing',
        price: 150000,
        priority_placement: true,
        social_media_promotion: true,
        whatsapp_promotion: true,
        candidate_pre_screening: true,
        priority_candidate_matching: true
      },
      'basic': {
        tier: 'basic',
        price: 0,
        priority_placement: false,
        social_media_promotion: false,
        whatsapp_promotion: false,
        candidate_pre_screening: false,
        priority_candidate_matching: false
      }
    }

    const config = tierConfig[selectedPlan] || tierConfig['basic']
    
    // Determine if this is an employer job (has employer info or plan info) or admin job
    const isEmployerJob = body.planId || body.plan_id || body.employerName || selectedPlan !== 'basic'
    const planId = isEmployerJob ? (body.planId || body.plan_id || 1) : 1
    
    console.log('🏢 Job type check:', { isEmployerJob, planId, selectedPlan, config })
    
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
    const priority = config.tier === 'short-listing' ? 'Top' : (config.priority_placement ? 'High' : 'Normal')
    
    // For employer jobs, use the employer company info from form
    let companyId = body.company_id
    
    // Helper function to check if a string is a valid UUID
    function isValidUUID(str: string) {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      return uuidRegex.test(str)
    }

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
          INSERT INTO companies (name, logo, created_at) 
          VALUES (${body.employerName}, ${body.companyLogo || null}, ${new Date().toISOString()})
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
    } else if (companyId && typeof companyId === 'string' && !isValidUUID(companyId)) {
      // If companyId is not a valid UUID, treat it as a company name and create/find
      const existingCompany = await sql`
        SELECT id FROM companies WHERE name = ${companyId} LIMIT 1
      `
      
      if (existingCompany && existingCompany.length > 0) {
        companyId = existingCompany[0].id
      } else {
        const newCompany = await sql`
          INSERT INTO companies (name, created_at) 
          VALUES (${companyId}, ${new Date().toISOString()})
          RETURNING id
        `
        companyId = newCompany[0].id
      }
    }

    const id = crypto.randomUUID()
    const now = new Date().toISOString()

    // Ensure we have a valid company_id
    if (!companyId) {
      console.error('❌ No company_id found:', { companyId, body })
      return NextResponse.json(
        { error: 'Company information is required. Please select or add a company.' },
        { status: 400 }
      )
    }

    console.log('🏢 Company resolved:', { companyId })

    console.log('🚀 Inserting job with data:', {
      id,
      title: body.title,
      companyId,
      employerName: body.employerName,
      opportunity_type: body.opportunity_type,
      status: isEmployerJob ? 'pending' : 'published'
    })

    // Try to insert with all columns, fall back to basic columns if schema doesn't exist
    let result;
    try {
      result = await sql`
        INSERT INTO jobs (
          id,
          title,
          company_id,
          location,
          location_type,
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
          applicants,
          views,
          created_at
        ) VALUES (
          ${id},
          ${body.title},
          ${companyId},
          ${body.location || null},
          ${body.location_type || null},
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
          0,
          0,
          ${now}
        )
        RETURNING *
      `
    } catch (schemaError) {
      console.log('⚠️ Schema columns missing, trying basic insert...')
      // Fallback to basic schema without employer-specific columns
      result = await sql`
        INSERT INTO jobs (
          id,
          title,
          company_id,
          location,
          location_type,
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
          applicants,
          views,
          created_at
        ) VALUES (
          ${id},
          ${body.title},
          ${companyId},
          ${body.location || null},
          ${body.location_type || null},
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
          0,
          0,
          ${now}
        )
        RETURNING *
      `
    }

    if (!result || result.length === 0) {
      throw new Error('Failed to insert job')
    }

    const newJob = result[0]

    return NextResponse.json({
      id: newJob.id,
      title: newJob.title,
      company_id: newJob.company_id,
      location: newJob.location,
      location_type: newJob.location_type,
      job_type: newJob.job_type,
      opportunity_type: newJob.opportunity_type,
      experience_level: newJob.experience_level,
      deadline: newJob.deadline,
      featured: newJob.featured,
      description: newJob.description,
      attachment_url: newJob.attachment_url,
      application_link: newJob.application_link,
      application_method: newJob.application_method,
      primary_email: newJob.primary_email,
      cc_emails: newJob.cc_emails,
      status: newJob.status,
      approved: newJob.approved,
      applicants: newJob.applicants,
      views: newJob.views,
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
