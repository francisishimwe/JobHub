import { NextRequest, NextResponse } from 'next/server'
import { sql, getSql } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const employerEmail = searchParams.get('email')
    
    if (!employerEmail) {
      return NextResponse.json({ error: 'Employer email is required' }, { status: 400 })
    }

    console.log('🔄 Fetching employer applicants for:', employerEmail)

    // Try to get applicants from database first
    try {
      // Get all applicants for jobs posted by this employer
      const applicants = await sql`
        SELECT 
          cv.id as cv_profile_id,
          cv.full_name,
          cv.email,
          cv.phone,
          cv.field_of_study,
          cv.experience,
          cv.skills,
          cv.education,
          cv.portfolio_url,
          cv.linkedin_url,
          cv.github_url,
          cv.additional_info,
          cv.is_shortlisted,
          cv.created_at as cv_created_at,
          ja.id as application_id,
          ja.application_date,
          ja.status as application_status,
          ja.match_score,
          ja.notes,
          j.id as job_id,
          j.title as job_title,
          j.location as job_location,
          c.name as company_name
        FROM cv_profiles cv
        INNER JOIN job_applications ja ON cv.id = ja.cv_profile_id
        INNER JOIN jobs j ON ja.job_id = j.id
        LEFT JOIN companies c ON j.company_id = c.id
        WHERE c.name = ${employerEmail}
        ORDER BY ja.application_date DESC
      `

      console.log(`✓ Found ${applicants.length} applicants for employer ${employerEmail}`)

      return NextResponse.json({ 
        success: true, 
        applicants: applicants,
        count: applicants.length,
        database: true // Flag to indicate this is database data
      })

    } catch (dbError) {
      console.error('Database query failed:', dbError)
      
      // Return empty results when database is not available
      console.log('🔄 Returning empty results due to database unavailability')
      return NextResponse.json({ 
        success: true, 
        applicants: [],
        count: 0,
        database: false,
        message: 'Database temporarily unavailable'
      })
    }

  } catch (error) {
    console.error('❌ Error fetching employer applicants:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch employer applicants',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { applicationId, status, notes, employerEmail } = await request.json()

    if (!applicationId || !status || !employerEmail) {
      return NextResponse.json({ error: 'Application ID, status, and employer email are required' }, { status: 400 })
    }

    console.log('🔄 Updating application status:', applicationId, 'to:', status, 'for employer:', employerEmail)

    // Try database operations
    try {
      // Verify the application belongs to a job posted by this employer
      const verification = await sql`
        SELECT ja.id FROM job_applications ja
        INNER JOIN jobs j ON ja.job_id = j.id
        LEFT JOIN companies c ON j.company_id = c.id
        WHERE ja.id = ${applicationId} AND c.name = ${employerEmail}
      `

      if (verification.length === 0) {
        return NextResponse.json({ error: 'Application not found or access denied' }, { status: 404 })
      }

      // Update the application status
      const updatedApplication = await sql`
        UPDATE job_applications SET
          status = ${status},
          notes = ${notes || null},
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ${applicationId}
        RETURNING *
      `

      // Also update the CV profile shortlisted status if needed
      if (status === 'shortlisted') {
        await sql`
          UPDATE cv_profiles SET
            is_shortlisted = true,
            updated_at = CURRENT_TIMESTAMP
          WHERE id = (SELECT cv_profile_id FROM job_applications WHERE id = ${applicationId})
        `
      }

      console.log('✅ Application status updated successfully:', updatedApplication[0])

      return NextResponse.json({ 
        success: true, 
        application: updatedApplication[0],
        message: 'Application status updated successfully',
        database: true
      })

    } catch (dbError) {
      console.error('Database update failed:', dbError)
      
      // Simulate update
      console.log('🔄 Simulating application status update due to database issues')
      const simulatedUpdate = {
        id: applicationId,
        status: status,
        notes: notes,
        message: 'Application status updated but not saved to database due to connection issues'
      }

      return NextResponse.json({ 
        success: true, 
        application: simulatedUpdate,
        message: 'Application status updated (simulation mode - database unavailable)',
        database: false
      })
    }

  } catch (error) {
    console.error('❌ Error updating application status:', error)
    return NextResponse.json({ 
      error: 'Failed to update application status',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
