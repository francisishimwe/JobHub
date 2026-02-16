import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    
    // Test basic database connection first
    console.log('Testing database connection...')
    try {
      const { data: testConnection, error: connectionError } = await supabase
        .from('cv_profiles')
        .select('count')
        .single()
      
      if (connectionError) {
        console.error('Database connection failed:', connectionError)
        return NextResponse.json({ 
          error: 'Database connection failed', 
          details: connectionError.message 
        }, { status: 500 })
      }
      
      console.log('Database connection successful, count:', testConnection?.count)
    } catch (dbError) {
      console.error('Database connection error:', dbError)
      return NextResponse.json({ 
        error: 'Database connection failed', 
        details: dbError instanceof Error ? dbError.message : 'Unknown database error'
      }, { status: 500 })
    }
    
    const cvData = await request.json()
    
    console.log('CV Submission Data:', cvData) // Debug log

    // Extract and structure the data from CV builder form
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

    console.log('Extracted fields:', { job_id, full_name, email, phone }) // Debug log

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

    console.log('Field validation passed') // Debug log

    // Check if job exists
    console.log('Checking if job exists:', job_id)
    const { data: jobExists, error: jobCheckError } = await supabase
      .from('jobs')
      .select('id, title')
      .eq('id', job_id)
      .single()
    
    if (jobCheckError || !jobExists) {
      console.error('Job not found or error:', jobCheckError)
      return NextResponse.json(
        { error: 'Job not found. Please check the job listing and try again.' },
        { status: 404 }
      )
    }
    
    console.log('Job found:', jobExists.title) // Debug log

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

    // Create experience object from dynamic array
    const experience = filteredExperience.length > 0 ? filteredExperience : []

    // Create education object from dynamic array
    const education = filteredEducation.length > 0 ? filteredEducation : []

    // Create referees object from dynamic array
    const referees = filteredReferees.length > 0 ? filteredReferees : []

    const cvProfile = {
      job_id,
      full_name,
      email,
      phone,
      field_of_study,
      experience: JSON.stringify(experience),
      skills: skills.join(', '),
      education: JSON.stringify(education),
      portfolio_url: null,
      linkedin_url: null,
      github_url: null,
      additional_info: JSON.stringify({
        residence,
        birth_date,
        gender,
        fathers_name,
        mothers_name,
        place_of_birth,
        nationality,
        referees,
        languages: additional_languages
      })
    }

    console.log('CV Profile to insert:', cvProfile) // Debug log

    // Insert new profile
    const { data: result, error } = await supabase
      .from('cv_profiles')
      .insert(cvProfile)
      .select()
      .single()

    if (error) {
      console.error('CV Profile save error:', error)
      console.error('Error details:', JSON.stringify(error, null, 2))
      return NextResponse.json(
        { error: 'Failed to save CV profile', details: error.message },
        { status: 500 }
      )
    }

    console.log('CV Profile saved successfully:', result) // Debug log

    console.log('Creating job application for job_id:', job_id, 'cv_profile_id:', result.id) // Debug log

    // Create job application record
    const { error: applicationError } = await supabase
      .from('job_applications')
      .insert({
        job_id,
        cv_profile_id: result.id,
        status: 'applied',
        application_date: new Date().toISOString()
      })

    if (applicationError) {
      console.error('Application Error:', applicationError)
      console.error('Application Error details:', JSON.stringify(applicationError, null, 2))
      return NextResponse.json(
        { error: 'Failed to create application record', details: applicationError.message },
        { status: 500 }
      )
    }

    console.log('Job application created successfully') // Debug log

    return NextResponse.json({
      success: true,
      message: 'CV profile submitted successfully',
      data: result
    })

  } catch (error) {
    console.error('CV Profile API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const jobId = searchParams.get('jobId')
    const fieldOfStudy = searchParams.get('fieldOfStudy')
    const experienceLevel = searchParams.get('experienceLevel')
    const limit = parseInt(searchParams.get('limit') || '10')

    if (jobId) {
      // Get CV profiles for a specific job
      const { data: cvProfiles, error } = await supabase
        .from('cv_profiles')
        .select(`
          *,
          job_applications!inner(
            status,
            match_score,
            applied_at,
            documents_json
          )
        `)
        .eq('job_id', jobId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Fetch Error:', error)
        return NextResponse.json(
          { error: 'Failed to fetch CV profiles' },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        cvProfiles
      })
    } else {
      // General CV profiles search
      let query = supabase
        .from('cv_profiles')
        .select('*')
        .order('created_at', { ascending: false })

      // Filter by field of study if provided
      if (fieldOfStudy) {
        query = query.ilike('field_of_study', `%${fieldOfStudy}%`)
      }

      // Filter by experience level if provided
      if (experienceLevel) {
        query = query.ilike('experience', `%${experienceLevel}%`)
      }

      const { data, error } = await query.limit(limit)

      if (error) {
        console.error('CV Profile fetch error:', error)
        return NextResponse.json(
          { error: 'Failed to fetch CV profiles', details: error.message },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        data: data || []
      })
    }

  } catch (error) {
    console.error('CV Profile GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
