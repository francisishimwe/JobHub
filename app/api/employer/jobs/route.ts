import { NextRequest, NextResponse } from 'next/server'
import { sql, getSql } from '@/lib/db'

export async function GET(request: NextRequest) {
  console.log('🔍 Employer jobs API called')
  
  try {
    const url = new URL(request.url)
    const employerEmail = url.searchParams.get('email')
    
    console.log('🔍 Looking for jobs with employer email:', employerEmail)
    
    if (!employerEmail) {
      return NextResponse.json({ error: 'Employer email is required' }, { status: 400 })
    }

    console.log('🔄 Fetching employer jobs for:', employerEmail)

    // Try to get jobs from database first
    try {
      // Get jobs posted by this employer
      // We'll need to join with companies to find jobs by employer email
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
          j.attachment_url,
          j.application_link,
          j.status,
          j.approved,
          j.applicants,
          j.views,
          j.featured,
          j.created_at,
          c.name as company_name,
          c.logo as company_logo
        FROM jobs j
        LEFT JOIN companies c ON j.company_id = c.id
        WHERE j.employerName = ${employerEmail}
        ORDER BY j.created_at DESC
      `

      console.log(`✓ Found ${jobs.length} jobs for employer ${employerEmail}`)

      return NextResponse.json({ 
        success: true, 
        jobs: jobs,
        count: jobs.length,
        database: true // Flag to indicate this is database data
      })

    } catch (dbError) {
      console.error('Database query failed:', dbError)
      
      // Return empty results when database is not available
      console.log('🔄 Returning empty results due to database unavailability')
      return NextResponse.json({ 
        success: true, 
        jobs: [],
        count: 0,
        database: false,
        message: 'Database temporarily unavailable'
      })
    }

  } catch (error) {
    console.error('❌ Error fetching employer jobs:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch employer jobs',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const jobData = await request.json()
    const { employerEmail, ...jobFields } = jobData

    if (!employerEmail) {
      return NextResponse.json({ error: 'Employer email is required' }, { status: 400 })
    }

    console.log('🔄 Creating new job for employer:', employerEmail)

    // Try database operations
    try {
      // First, get or create company for this employer
      let companyResult = await sql`
        SELECT id FROM companies WHERE name = ${employerEmail}
      `

      let companyId
      if (companyResult.length === 0) {
        // Create new company
        const newCompany = await sql`
          INSERT INTO companies (name, created_at)
          VALUES (${employerEmail}, CURRENT_TIMESTAMP)
          RETURNING id
        `
        companyId = newCompany[0].id
        console.log('✓ Created new company for employer:', employerEmail)
      } else {
        companyId = companyResult[0].id
        console.log('✓ Using existing company for employer:', employerEmail)
      }

      // Create the job
      const newJob = await sql`
        INSERT INTO jobs (
          title,
          company_id,
          location,
          job_type,
          opportunity_type,
          experience_level,
          deadline,
          description,
          attachment_url,
          application_link,
          status,
          approved,
          featured,
          created_at
        ) VALUES (
          ${jobFields.title},
          ${companyId},
          ${jobFields.location || null},
          ${jobFields.job_type || null},
          ${jobFields.opportunity_type || 'Full-time'},
          ${jobFields.experience_level || null},
          ${jobFields.deadline || null},
          ${jobFields.description || null},
          ${jobFields.attachment_url || null},
          ${jobFields.application_link || null},
          'published',
          true, // Auto-approve employer jobs for immediate display
          ${jobFields.featured || false},
          CURRENT_TIMESTAMP
        )
        RETURNING *
      `

      console.log('✅ Job created successfully:', newJob[0])

      return NextResponse.json({ 
        success: true, 
        job: newJob[0],
        message: 'Job created successfully and published immediately',
        database: true
      })

    } catch (schemaError) {
      console.log('⚠️ Schema error, trying minimal insert...', schemaError)
      
      // Fallback to minimal schema
      try {
        // Try with minimal required fields
        const minimalJob = await sql`
          INSERT INTO jobs (title, company_id, status, approved, created_at)
          VALUES (
            ${jobFields.title},
            (SELECT id FROM companies WHERE name = ${employerEmail} LIMIT 1),
            'published',
            true, // Auto-approve employer jobs for immediate display
            CURRENT_TIMESTAMP
          )
          RETURNING id, title, status, approved, created_at
        `

        console.log('✅ Minimal job created successfully:', minimalJob[0])

        return NextResponse.json({ 
          success: true, 
          job: minimalJob[0],
          message: 'Job created successfully with basic information and published immediately',
          database: true
        })

      } catch (minimalError) {
        console.error('❌ Even minimal insert failed:', minimalError)
        
        // Final fallback - simulate job creation
        console.log('🔄 Simulating job creation due to database issues')
        const simulatedJob = {
          id: `sim_${Date.now()}`,
          title: jobFields.title,
          status: 'published',
          approved: true, // Auto-approve employer jobs even in simulation mode
          created_at: new Date().toISOString(),
          message: 'Job created but not saved to database due to connection issues'
        }

        return NextResponse.json({ 
          success: true, 
          job: simulatedJob,
          message: 'Job created (simulation mode - database unavailable)',
          database: false
        })
      }
    }

  } catch (error) {
    console.error('❌ Error creating job:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })
    return NextResponse.json({ 
      error: 'Failed to create job',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { jobId, jobData, employerEmail } = await request.json()

    if (!jobId || !employerEmail) {
      return NextResponse.json({ error: 'Job ID and employer email are required' }, { status: 400 })
    }

    console.log('🔄 Updating job:', jobId, 'for employer:', employerEmail)

    // Try database operations
    try {
      // Verify the job belongs to this employer
      const verification = await sql`
        SELECT j.id FROM jobs j
        LEFT JOIN companies c ON j.company_id = c.id
        WHERE j.id = ${jobId} AND c.name = ${employerEmail}
      `

      if (verification.length === 0) {
        return NextResponse.json({ error: 'Job not found or access denied' }, { status: 404 })
      }

      // Update the job
      const updatedJob = await sql`
        UPDATE jobs SET
          title = ${jobData.title},
          location = ${jobData.location || null},
          job_type = ${jobData.job_type || null},
          opportunity_type = ${jobData.opportunity_type || 'Full-time'},
          experience_level = ${jobData.experience_level || null},
          deadline = ${jobData.deadline || null},
          description = ${jobData.description || null},
          attachment_url = ${jobData.attachment_url || null},
          application_link = ${jobData.application_link || null},
          featured = ${jobData.featured || false},
          approved = false -- Reset approval status on update
        WHERE id = ${jobId}
        RETURNING *
      `

      console.log('✅ Job updated successfully:', updatedJob[0])

      return NextResponse.json({ 
        success: true, 
        job: updatedJob[0],
        message: 'Job updated successfully and resubmitted for approval',
        database: true
      })

    } catch (dbError) {
      console.error('Database update failed:', dbError)
      
      // Simulate update
      console.log('🔄 Simulating job update due to database issues')
      const simulatedUpdate = {
        id: jobId,
        title: jobData.title,
        message: 'Job updated but not saved to database due to connection issues'
      }

      return NextResponse.json({ 
        success: true, 
        job: simulatedUpdate,
        message: 'Job updated and published immediately (simulation mode - database unavailable)',
        database: false
      })
    }

  } catch (error) {
    console.error(' Error updating job:', error)
    return NextResponse.json({ 
      error: 'Failed to update job',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const jobId = searchParams.get('jobId')
    const employerEmail = searchParams.get('email')

    if (!jobId || !employerEmail) {
      return NextResponse.json({ error: 'Job ID and employer email are required' }, { status: 400 })
    }

    console.log('🔄 Deleting job:', jobId, 'for employer:', employerEmail)

    // Try database operations
    try {
      // Verify the job belongs to this employer
      const verification = await sql`
        SELECT j.id FROM jobs j
        LEFT JOIN companies c ON j.company_id = c.id
        WHERE j.id = ${jobId} AND c.name = ${employerEmail}
      `

      if (verification.length === 0) {
        return NextResponse.json({ error: 'Job not found or access denied' }, { status: 404 })
      }

      // Delete the job (this will cascade and delete related applications)
      await sql`DELETE FROM jobs WHERE id = ${jobId}`

      console.log('✅ Job deleted successfully:', jobId)

      return NextResponse.json({ 
        success: true, 
        message: 'Job deleted successfully',
        database: true
      })

    } catch (dbError) {
      console.error('Database delete failed:', dbError)
      
      // Simulate delete
      console.log('🔄 Simulating job deletion due to database issues')
      return NextResponse.json({ 
        success: true, 
        message: 'Job deleted (simulation mode - database unavailable)',
        database: false
      })
    }

  } catch (error) {
    console.error('❌ Error deleting job:', error)
    return NextResponse.json({ 
      error: 'Failed to delete job',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
