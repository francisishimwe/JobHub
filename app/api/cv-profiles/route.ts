import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const cvData = await request.json()

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
      university_degree,
      university_graduation,
      secondary_degree,
      secondary_graduation,
      experience_level,
      current_position,
      years_experience,
      current_employer,
      kinyarwanda_reading,
      kinyarwanda_writing,
      kinyarwanda_speaking,
      english_reading,
      english_writing,
      english_speaking,
      french_reading,
      french_writing,
      french_speaking,
      other_reading,
      other_writing,
      other_speaking,
      referee_name,
      referee_phone,
      referee_email,
    } = cvData

    // Validate required fields
    if (!job_id || !full_name || !email) {
      return NextResponse.json(
        { error: 'Missing required fields: job_id, full_name, email' },
        { status: 400 }
      )
    }

    // Create field_of_study from university degree
    const field_of_study = university_degree || 'General'

    // Create skills from language proficiencies
    const skills = []
    if (kinyarwanda_reading || kinyarwanda_writing || kinyarwanda_speaking) {
      skills.push('Kinyarwanda')
    }
    if (english_reading || english_writing || english_speaking) {
      skills.push('English')
    }
    if (french_reading || french_writing || french_speaking) {
      skills.push('French')
    }

    // Create experience object
    const experience = {
      level: experience_level,
      years: years_experience,
      current_position: current_position,
      current_employer: current_employer
    }

    // Create education object
    const education = {
      university: {
        degree: university_degree,
        graduation_year: university_graduation
      },
      secondary: {
        degree: secondary_degree,
        graduation_year: secondary_graduation
      }
    }

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
        referee_name,
        referee_phone,
        referee_email,
        language_proficiency: {
          kinyarwanda: {
            reading: kinyarwanda_reading,
            writing: kinyarwanda_writing,
            speaking: kinyarwanda_speaking
          },
          english: {
            reading: english_reading,
            writing: english_writing,
            speaking: english_speaking
          },
          french: {
            reading: french_reading,
            writing: french_writing,
            speaking: french_speaking
          },
          other: {
            reading: other_reading,
            writing: other_writing,
            speaking: other_speaking
          }
        }
      })
    }

    // Insert new profile
    const { data: result, error } = await supabase
      .from('cv_profiles')
      .insert(cvProfile)
      .select()
      .single()

    if (error) {
      console.error('CV Profile save error:', error)
      return NextResponse.json(
        { error: 'Failed to save CV profile', details: error.message },
        { status: 500 }
      )
    }

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
      return NextResponse.json(
        { error: 'Failed to create application record' },
        { status: 500 }
      )
    }

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
