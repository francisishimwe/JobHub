import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    console.log('=== CV PROFILE NO DB TEST START ===')
    
    const cvData = await request.json()
    console.log('CV Submission Data:', cvData)
    
    // Extract fields without database operations
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

    console.log('=== CV PROFILE NO DB TEST SUCCESS ===')
    
    // Return success without database operations
    return NextResponse.json({
      success: true,
      message: 'CV profile validation successful (no database)',
      data: {
        job_id,
        full_name,
        email,
        phone,
        field_of_study,
        skills: skills.join(', '),
        education_count: filteredEducation.length,
        experience_count: filteredExperience.length,
        languages_count: filteredLanguages.length,
        referees_count: filteredReferees.length,
      }
    })

  } catch (error) {
    console.error('=== CV PROFILE NO DB TEST ERROR ===', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
