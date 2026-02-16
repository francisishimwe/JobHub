import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    console.log('=== CV SUBMISSION START ===')
    
    const cvData = await request.json()
    console.log('CV Submission Data:', cvData)

    // Extract fields from CV builder form
    const {
      job_id,
      full_name,
      email,
      phone,
      residence,
      birth_date,
      gender,
      fathers_name,
      mothers_name,
      place_of_birth,
      nationality,
      additional_education = [],
      additional_experience = [],
      additional_languages = [],
      additional_referees = [],
    } = cvData

    console.log('Extracted fields:', { job_id, full_name, email, phone })

    // Validate required fields
    if (!job_id || !full_name || !email) {
      return NextResponse.json(
        { error: 'Missing required fields: job_id, full_name, email' },
        { status: 400 }
      )
    }

    // Validate job_id format (should be a UUID)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(job_id)) {
      console.error('Invalid job_id format:', job_id)
      return NextResponse.json(
        { error: 'Invalid job_id format. Job ID must be a valid UUID.' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      console.error('Invalid email format:', email)
      return NextResponse.json(
        { error: 'Invalid email format.' },
        { status: 400 }
      )
    }

    console.log('Field validation passed')

    // Check if job exists
    console.log('Checking if job exists:', job_id)
    const jobResult = await sql`
      SELECT id, title 
      FROM jobs 
      WHERE id = ${job_id}
    `
    
    if (jobResult.length === 0) {
      console.error('Job not found')
      return NextResponse.json(
        { error: 'Job not found. Please check the job listing and try again.' },
        { status: 404 }
      )
    }
    
    console.log('Job found:', jobResult[0].title)

    // Filter out empty entries from dynamic arrays
    const filteredEducation = additional_education.filter((edu: any) => 
      edu.degree || edu.graduation_year || edu.institution
    )
    const filteredExperience = additional_experience.filter((exp: any) => 
      exp.position || exp.company || exp.start_date || exp.end_date || exp.description
    )
    const filteredLanguages = additional_languages.filter((lang: any) => 
      lang.name || lang.reading || lang.writing || lang.speaking
    )
    const filteredReferees = additional_referees.filter((ref: any) => 
      ref.name || ref.phone || ref.email || ref.relationship
    )

    console.log('Filtered arrays:', { 
      education: filteredEducation, 
      experience: filteredExperience, 
      languages: filteredLanguages, 
      referees: filteredReferees 
    })

    // Create field_of_study from first education entry or default
    const field_of_study = filteredEducation.length > 0 && filteredEducation[0].degree 
      ? filteredEducation[0].degree 
      : 'General'

    // Create skills from language proficiencies
    const skills = filteredLanguages.map((lang: any) => lang.name).filter(Boolean)

    // Insert CV profile into database
    console.log('Inserting CV profile...')
    const cvProfileResult = await sql`
      INSERT INTO cv_profiles (
        job_id, full_name, email, phone, field_of_study, 
        experience, skills, education, portfolio_url, 
        linkedin_url, github_url, additional_info
      ) VALUES (
        ${job_id}, ${full_name}, ${email}, ${phone}, ${field_of_study},
        ${JSON.stringify(filteredExperience)}, ${skills.join(', ')}, ${JSON.stringify(filteredEducation)}, 
        ${null}, ${null}, ${null}, ${JSON.stringify({
          residence,
          birth_date,
          gender,
          fathers_name,
          mothers_name,
          place_of_birth,
          nationality,
          referees: filteredReferees,
          languages: filteredLanguages
        })}
      )
      RETURNING id
    `

    const cvProfileId = cvProfileResult[0].id
    console.log('CV profile inserted with ID:', cvProfileId)

    // Create job application record
    console.log('Creating job application...')
    await sql`
      INSERT INTO job_applications (
        job_id, cv_profile_id, application_date, status
      ) VALUES (
        ${job_id}, ${cvProfileId}, ${new Date().toISOString()}, 'applied'
      )
    `

    console.log('=== CV SUBMISSION SUCCESS ===')
    
    return NextResponse.json({
      success: true,
      message: 'CV profile submitted successfully',
      cvProfileId
    })

  } catch (error) {
    console.error('=== CV SUBMISSION ERROR ===', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const jobId = searchParams.get('jobId')
    const fieldOfStudy = searchParams.get('fieldOfStudy')
    const experienceLevel = searchParams.get('experienceLevel')
    const limit = parseInt(searchParams.get('limit') || '10')

    let query = sql`
      SELECT cp.*, j.title as job_title, c.name as company_name
      FROM cv_profiles cp
      JOIN jobs j ON cp.job_id = j.id
      JOIN companies c ON j.company_id = c.id
      WHERE 1=1
    `

    if (jobId) {
      query = sql`${query} AND cp.job_id = ${jobId}`
    }
    if (fieldOfStudy) {
      query = sql`${query} AND cp.field_of_study ILIKE ${'%' + fieldOfStudy + '%'}`
    }
    if (experienceLevel) {
      query = sql`${query} AND cp.experience ILIKE ${'%' + experienceLevel + '%'}`
    }

    const cvProfiles = await query

    return NextResponse.json({
      success: true,
      data: cvProfiles
    })

  } catch (error) {
    console.error('Error fetching CV profiles:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
