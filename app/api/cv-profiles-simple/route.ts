import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    console.log('=== SIMPLE CV SUBMISSION START ===')
    
    const cvData = await request.json()
    console.log('CV Submission Data:', cvData)

    // Extract fields from CV builder form
    const {
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

    console.log('Extracted fields:', { full_name, email, phone })

    // Validate required fields
    if (!full_name || !email) {
      return NextResponse.json(
        { error: 'Missing required fields: full_name, email' },
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

    // Try to create a dummy job if none exists
    let jobId = cvData.job_id
    if (!jobId) {
      try {
        const jobResult = await sql`
          INSERT INTO jobs (id, title, company_id, location, status, approved)
          VALUES (
            gen_random_uuid(),
            'General Application',
            gen_random_uuid(),
            'Rwanda',
            'published',
            true
          )
          RETURNING id
        `
        jobId = jobResult[0].id
        console.log('Created dummy job:', jobId)
      } catch (err: any) {
        console.log('Could not create dummy job:', err.message)
        jobId = '00000000-0000-0000-0000-000000000000' // fallback UUID
      }
    }

    // Insert CV profile into database
    console.log('Inserting CV profile...')
    const cvProfileResult = await sql`
      INSERT INTO cv_profiles (
        job_id, full_name, email, phone, field_of_study, 
        experience, skills, education, portfolio_url, 
        linkedin_url, github_url, additional_info
      ) VALUES (
        ${jobId}, ${full_name}, ${email}, ${phone}, ${field_of_study},
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
        ${jobId}, ${cvProfileId}, ${new Date().toISOString()}, 'applied'
      )
    `

    console.log('=== CV SUBMISSION SUCCESS ===')
    
    return NextResponse.json({
      success: true,
      message: 'CV profile submitted successfully',
      cvProfileId,
      jobId
    })

  } catch (error) {
    console.error('=== CV SUBMISSION ERROR ===', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
