import { NextRequest, NextResponse } from 'next/server'
import { sql, getSql } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '0')
    const limit = parseInt(searchParams.get('limit') || '15')
    const offset = page * limit

    // "Active" = published + approved + active + not expired (deadline in future or null)
    // (Your schema allows status: published|draft|closed|active; we exclude expired by deadline)
    const activeWhere = sql`
      (status = 'published' OR status = 'active')
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

    // Map jobs to ensure application_method has a default
    const mappedJobs = jobs.map((job: any) => ({
      ...job,
      application_method: job.application_method || 'email'
    }))

    return NextResponse.json({
      jobs: mappedJobs,
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
    console.log('🔍 Body keys:', Object.keys(body))
    console.log('🔍 Body company_id:', body.company_id)
    console.log('🔍 Body employerName:', body.employerName)
    console.log('🔍 Body company:', body.company)

    // Check if this is an Admin user (bypass pending status)
    const isAdmin = body.userEmail === "admin@RwandaJobHub.com"
    console.log('👤 Admin check:', { userEmail: body.userEmail, isAdmin })

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
    const isEmployerJob = !isAdmin && (body.planId || body.plan_id || body.employerName || selectedPlan !== 'basic')
    const planId = isEmployerJob ? (body.planId || body.plan_id || 1) : 1
    
    console.log('🏢 Job type check:', { isAdmin, isEmployerJob, planId, selectedPlan, config })
    
    // Validate required fields
    if (!body.title || !body.opportunity_type) {
      return NextResponse.json(
        { error: 'Missing required fields: title, opportunity_type' },
        { status: 400 }
      )
    }

    if (isEmployerJob && !body.employerName) {
      return NextResponse.json(
        { error: 'Missing required field: employerName' },
        { status: 400 }
      )
    }

    // Additional validation for company_id
    if (body.company_id && typeof body.company_id !== 'string') {
      console.error('❌ Invalid company_id type:', typeof body.company_id, body.company_id)
      return NextResponse.json(
        { error: 'Invalid company_id format' },
        { status: 400 }
      )
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
      
      console.log('🔍 Existing company query result:', existingCompany)
      
      if (existingCompany && existingCompany.length > 0 && existingCompany[0]) {
        companyId = existingCompany[0].id
        console.log('✅ Found existing company ID:', companyId)
      } else {
        // Create new company from employer info
        console.log('🆕 Creating new company:', body.employerName)
        const newCompany = await sql`
          INSERT INTO companies (name, logo, created_at) 
          VALUES (${body.employerName}, ${body.companyLogo || null}, ${new Date().toISOString()})
          RETURNING id
        `
        
        console.log('🔍 New company query result:', newCompany)
        
        if (newCompany && newCompany.length > 0 && newCompany[0]) {
          companyId = newCompany[0].id
          console.log('✅ Created new company ID:', companyId)
        } else {
          throw new Error('Failed to create new company - no ID returned')
        }
      }
    } else if (!companyId && !isEmployerJob && body.company) {
      // Admin job - use company field
      const existingCompany = await sql`
        SELECT id FROM companies WHERE name = ${body.company} LIMIT 1
      `
      
      console.log('🔍 Admin company query result:', existingCompany)
      
      if (existingCompany && existingCompany.length > 0 && existingCompany[0]) {
        companyId = existingCompany[0].id
        console.log('✅ Found admin company ID:', companyId)
      } else {
        // Create new company
        console.log('🆕 Creating admin company:', body.company)
        const newCompany = await sql`
          INSERT INTO companies (name, created_at) 
          VALUES (${body.company}, ${new Date().toISOString()})
          RETURNING id
        `
        
        console.log('🔍 New admin company result:', newCompany)
        
        if (newCompany && newCompany.length > 0 && newCompany[0]) {
          companyId = newCompany[0].id
          console.log('✅ Created admin company ID:', companyId)
        } else {
          throw new Error('Failed to create admin company - no ID returned')
        }
      }
    } else if (companyId && typeof companyId === 'string' && !isValidUUID(companyId)) {
      // If companyId is not a valid UUID, treat it as a company name and create/find
      const existingCompany = await sql`
        SELECT id FROM companies WHERE name = ${companyId} LIMIT 1
      `
      
      console.log('🔍 UUID check company query result:', existingCompany)
      
      if (existingCompany && existingCompany.length > 0 && existingCompany[0]) {
        companyId = existingCompany[0].id
        console.log('✅ Found company by name ID:', companyId)
      } else {
        const newCompany = await sql`
          INSERT INTO companies (name, created_at) 
          VALUES (${companyId}, ${new Date().toISOString()})
          RETURNING id
        `
        
        console.log('🔍 New company by name result:', newCompany)
        
        if (newCompany && newCompany.length > 0 && newCompany[0]) {
          companyId = newCompany[0].id
          console.log('✅ Created company by name ID:', companyId)
        } else {
          throw new Error('Failed to create company by name - no ID returned')
        }
      }
    }

    const id = crypto.randomUUID()
    const now = new Date().toISOString()

    // Ensure we have a valid company_id
    if (!companyId) {
      console.error('❌ No company_id found:', { companyId, body, isEmployerJob })
      return NextResponse.json(
        { error: 'Company information is required. Please select or add a company.' },
        { status: 400 }
      )
    }

    // Final validation of companyId
    if (!companyId || typeof companyId !== 'string' || companyId.trim() === '') {
      console.error('❌ Invalid final companyId:', { companyId, type: typeof companyId })
      return NextResponse.json(
        { error: 'Invalid company ID. Please try again.' },
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
      isAdmin,
      status: isAdmin ? 'published' : (isEmployerJob ? 'pending' : 'published')
    })

    // Check which columns exist in the jobs table
    let result;
    try {
      // First, get the actual columns that exist in the jobs table
      const columnsCheck = await sql`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'jobs'
        ORDER BY ordinal_position
      `;
      
      const existingColumns = columnsCheck.map((row: any) => row.column_name);
      console.log('📋 Existing columns:', existingColumns);
      
      // Build dynamic INSERT based on existing columns
      const columnsToInsert = [
        'id', 'title', 'company_id', 'location', 'location_type', 'job_type',
        'opportunity_type', 'experience_level', 'deadline', 'featured', 'description',
        'attachment_url', 'application_link', 'status', 'approved', 'applicants', 
        'views', 'created_at'
      ];
      
      // Add optional columns if they exist
      if (existingColumns.includes('application_method')) {
        columnsToInsert.push('application_method');
      }
      if (existingColumns.includes('primary_email')) {
        columnsToInsert.push('primary_email');
      }
      if (existingColumns.includes('cc_emails')) {
        columnsToInsert.push('cc_emails');
      }
      
      // Build values array matching the columns
      const values = [
        id,
        body.title,
        companyId,
        body.location || null,
        body.location_type || null,
        body.jobType || body.job_type || null,
        body.opportunity_type,
        body.experienceLevel || body.experience_level || null,
        body.deadline || null,
        body.featured || false,
        body.description || null,
        body.attachment_url || null,
        body.applicationLink || body.application_link || null,
        isAdmin ? 'published' : 'published',
        isAdmin ? true : true,
        0,
        0,
        now
      ];
      
      // Add optional values if columns exist
      if (existingColumns.includes('application_method')) {
        values.push(body.application_method || 'email');
      }
      if (existingColumns.includes('primary_email')) {
        values.push(body.primary_email || null);
      }
      if (existingColumns.includes('cc_emails')) {
        values.push(body.cc_emails || null);
      }
      
      console.log('🔍 About to execute dynamic SQL with columns:', columnsToInsert);
      console.log('🔍 Values count:', values.length);
      
      // Build the SQL query dynamically
      const columnsStr = columnsToInsert.join(', ');
      const placeholders = values.map((_, index) => `$${index + 1}`).join(', ');
      
      const query = `
        INSERT INTO jobs (${columnsStr})
        VALUES (${placeholders})
        RETURNING *
      `;
      
      console.log('🔍 Executing query:', query);
      
      // Use the neon sql client directly with the built query
      const sqlFn = getSql();
      result = await sqlFn.unsafe(query, values);
      
    } catch (schemaError) {
      console.log('⚠️ Schema error, trying minimal insert...', schemaError);
      // Fallback to minimal schema
      result = await sql`
        INSERT INTO jobs (
          id, title, company_id, location, opportunity_type, 
          description, status, approved, created_at
        ) VALUES (
          ${id}, ${body.title}, ${companyId}, ${body.location || null}, 
          ${body.opportunity_type}, ${body.description || null}, 
          'published', true, ${now}
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
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to create job',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}
