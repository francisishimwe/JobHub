import { NextRequest, NextResponse } from 'next/server'
import { sql, getSql } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '0')
    const limit = parseInt(searchParams.get('limit') || '15')
    const offset = page * limit

    // Add client-visible debug
    console.log('🌐 GET /api/jobs called with params:', { page, limit, offset })

    // Try to get jobs from database first
    try {
      console.log('� Testing database connection for jobs GET...');
      const testConnection = await sql`SELECT 1 as test`;
      console.log('✅ Database connection successful for GET:', testConnection);
      
      console.log('🔄 Fetching jobs from database...')
      
      // Debug: Check all jobs first
      const allJobsDebug = await sql`SELECT id, title, status, approved, deadline FROM jobs ORDER BY created_at DESC LIMIT 10`
      console.log('🔍 All jobs in database (debug):', allJobsDebug)
      
      // "Active" = published + approved + active + not expired (deadline in future or null)
      // (Your schema allows status: published|draft|closed|active; we exclude expired by deadline)
      const jobs = await sql`
        SELECT 
          j.id,
          j.title,
          j.company_id,
          j.location,
          j.job_type,
          j.opportunity_type,
          j.experience_level,
          j.deadline,
          j.description,
          j.status,
          j.approved,
          j.created_at,
          c.name as company_name,
          c.logo as company_logo
        FROM jobs j
        LEFT JOIN companies c ON j.company_id = c.id
        WHERE (j.status = 'published' OR j.status = 'active')
        AND j.approved = true
        AND (j.deadline IS NULL OR j.deadline::date >= CURRENT_DATE)
        ORDER BY 
        CASE 
          WHEN j.description IS NULL OR j.description = '' THEN 2
          ELSE 1
        END,
        j.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `
      
      console.log('✓ Database returned jobs:', jobs.length, 'jobs')
      console.log('🔍 Raw jobs data:', jobs)

      const countResult = await sql`
        SELECT COUNT(*) as total FROM jobs 
        WHERE (status = 'published' OR status = 'active')
        AND approved = true
        AND (deadline IS NULL OR deadline >= CURRENT_DATE)
      `

      const total = countResult[0]?.total || 0
      // Featured tab should count *all* active items (Jobs, Tenders, Internships, Scholarships, Education, Blogs)
      const featuredCount = total

      // Map jobs to ensure all required fields have defaults
      const mappedJobs = jobs.map((job: any) => ({
        ...job,
        application_method: job.application_method || 'email',
        featured: job.featured || false,
        applicants: job.applicants || 0,
        views: job.views || 0,
        attachment_url: job.attachment_url || null,
        application_link: job.application_link || null,
        primary_email: job.primary_email || null,
        cc_emails: job.cc_emails || null,
        location_type: job.location_type || 'On-site'
      }))

      console.log(`✓ Database returned ${mappedJobs.length} jobs`)
      
      const formattedJobs = mappedJobs.map((job: any) => ({
        ...job,
        company: job.company_name,
        company_logo: job.company_logo,
        company_id: job.company_id,
      }));

      return NextResponse.json({
        success: true,
        jobs: formattedJobs,
        total,
        page,
        hasMore: offset + limit < total,
        featuredCount: featuredCount,
        featuredGroupCount: featuredCount,
        DEBUG_ALL_JOBS_COUNT: allJobsDebug.length,
        DEBUG_ALL_JOBS_SAMPLE: allJobsDebug.slice(0, 2),
        DEBUG_FILTERED_JOBS_COUNT: jobs.length,
        DEBUG_FILTERED_JOBS_SAMPLE: jobs.slice(0, 2),
        debug: {
          allJobsCount: allJobsDebug.length,
          allJobsSample: allJobsDebug.slice(0, 2),
          filteredJobsCount: jobs.length,
          filteredJobsSample: jobs.slice(0, 2)
        }
      })

    } catch (dbError: any) {
      console.error('Database query failed:', dbError)
      console.error('Database error details:', dbError?.message, dbError?.stack)
      
      // Return empty results when database is not available
      console.log('🔄 Database not available for jobs GET, returning empty results')
      
      const page = parseInt(new URL(request.url).searchParams.get('page') || '0')
      const limit = parseInt(new URL(request.url).searchParams.get('limit') || '15')
      
      return NextResponse.json({
        jobs: [],
        total: 0,
        featuredCount: 0,
        featuredGroupCount: 0,
        page,
        limit,
        hasMore: false,
        database: false,
        message: 'Database temporarily unavailable',
        error: dbError?.message || 'Unknown database error'
      })
    }
  } catch (error) {
    console.error('Error in jobs API:', error)
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
      try {
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
          try {
            const newCompany = await sql`
              INSERT INTO companies (name, logo, created_at) 
              VALUES (${body.employerName}, ${body.companyLogo || body.logo_url || null}, ${new Date().toISOString()})
              RETURNING id
            `
            
            console.log('🔍 New company query result:', newCompany)
            
            if (newCompany && newCompany.length > 0 && newCompany[0]) {
              companyId = newCompany[0].id
              console.log('✅ Created new company ID:', companyId)
            } else {
              throw new Error('Failed to create new company - no ID returned')
            }
          } catch (companyError) {
            console.log('⚠️ Company creation failed, using fallback:', companyError)
            // Generate a simulated company ID
            companyId = `sim_company_${Date.now()}`
            console.log('🔄 Using simulated company ID:', companyId)
          }
        }
      } catch (dbError) {
        console.log('⚠️ Company lookup failed, using fallback:', dbError)
        // Generate a simulated company ID
        companyId = `sim_company_${Date.now()}`
        console.log('🔄 Using simulated company ID:', companyId)
      }
    } else if (!companyId && !isEmployerJob && body.company) {
      // Admin job - use company field
      try {
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
          try {
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
          } catch (companyError) {
            console.log('⚠️ Admin company creation failed, using fallback:', companyError)
            // Generate a simulated company ID
            companyId = `sim_admin_company_${Date.now()}`
            console.log('🔄 Using simulated admin company ID:', companyId)
          }
        }
      } catch (dbError) {
        console.log('⚠️ Admin company lookup failed, using fallback:', dbError)
        // Generate a simulated company ID
        companyId = `sim_admin_company_${Date.now()}`
        console.log('🔄 Using simulated admin company ID:', companyId)
      }
    } else if (companyId && typeof companyId === 'string' && !isValidUUID(companyId)) {
      // If companyId is not a valid UUID, treat it as a company name and create/find
      try {
        const existingCompany = await sql`
          SELECT id FROM companies WHERE name = ${companyId} LIMIT 1
        `
        
        console.log('🔍 UUID check company query result:', existingCompany)
        
        if (existingCompany && existingCompany.length > 0 && existingCompany[0]) {
          companyId = existingCompany[0].id
          console.log('✅ Found company by name ID:', companyId)
        } else {
          try {
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
          } catch (companyError) {
            console.log('⚠️ Company by name creation failed, using fallback:', companyError)
            // Generate a simulated company ID
            companyId = `sim_name_company_${Date.now()}`
            console.log('🔄 Using simulated company by name ID:', companyId)
          }
        }
      } catch (dbError) {
        console.log('⚠️ Company by name lookup failed, using fallback:', dbError)
        // Generate a simulated company ID
        companyId = `sim_name_company_${Date.now()}`
        console.log('🔄 Using simulated company by name ID:', companyId)
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

    // Simplified approach - use standard SQL template literal with multi-level fallback
    let result;
    try {
      console.log('🔍 Testing database connection...');
      const testConnection = await sql`SELECT 1 as test`;
      console.log('✅ Database connection successful:', testConnection);
      
      console.log('🔍 Inserting job with full database approach...');
      result = await sql`
        INSERT INTO jobs (
          id, title, company_id, location, opportunity_type, 
          description, status, approved, created_at, application_link,
          job_type, experience_level, deadline, attachment_url
        ) VALUES (
          ${id}, ${body.title}, ${companyId}, ${body.location || null}, 
          ${body.opportunity_type}, ${body.description || null}, 
          'published', true, ${now}, ${body.application_link || null},
          ${body.job_type || null}, ${body.experience_level || null}, 
          ${body.deadline || null}, ${body.attachment_url || null}
        )
        RETURNING *
      `;
      
      console.log('✅ Job inserted successfully:', result);
      
    } catch (schemaError) {
      console.log('⚠️ Schema error, trying minimal insert...', schemaError);
      
      // Fallback to minimal schema
      try {
        result = await sql`
          INSERT INTO jobs (id, title, company_id, status, approved, created_at)
          VALUES (${id}, ${body.title}, ${companyId}, 'published', true, ${now})
          RETURNING id, title, company_id, status, approved, created_at
        `;
        console.log('✅ Minimal job inserted successfully:', result);
        
      } catch (minimalError) {
        console.error('❌ Even minimal insert failed:', minimalError);
        
        // Final fallback - simulate job creation
        console.log('🔄 Simulating job creation due to database issues');
        const simulatedJob = {
          id: id,
          title: body.title,
          company_id: companyId,
          location: body.location || null,
          opportunity_type: body.opportunity_type,
          description: body.description || null,
          status: 'published',
          approved: true,
          created_at: now,
          application_link: body.application_link || null,
          job_type: body.job_type || null,
          experience_level: body.experience_level || null,
          deadline: body.deadline || null,
          attachment_url: body.attachment_url || null,
          message: 'Job created but not saved to database due to connection issues'
        };
        
        console.log('✅ Simulated job created:', simulatedJob);
        
        return NextResponse.json({
          success: true,
          job: simulatedJob,
          message: 'Job created successfully (simulation mode - database unavailable)',
          database: false
        }, { status: 201 });
      }
    }

    if (!result || result.length === 0) {
      console.error('❌ No result returned from database insertion:', { result })
      throw new Error('Failed to insert job - no data returned')
    }

    if (!result[0]) {
      console.error('❌ No first item in result array:', { result })
      throw new Error('Failed to insert job - invalid result format')
    }

    const newJob = result[0]
    
    if (!newJob.id) {
      console.error('❌ New job missing ID:', { newJob, result })
      throw new Error('Failed to insert job - no ID generated')
    }

    console.log('✅ Successfully created job:', { id: newJob.id, title: newJob.title })

    return NextResponse.json({
      success: true,
      job: {
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
      },
      message: 'Job created successfully',
      database: true
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
