import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const cvData = await request.json()

    // Extract and structure the data for our simplified schema
    const {
      job_id,
      full_name,
      email,
      phone,
      field_of_study,
      experience,
      skills,
      education,
      portfolio_url,
      linkedin_url,
      github_url,
      additional_info,
    } = cvData

    // Validate required fields
    if (!job_id || !full_name || !email || !field_of_study || !skills) {
      return NextResponse.json(
        { error: 'Missing required fields: job_id, full_name, email, field_of_study, skills' },
        { status: 400 }
      )
    }

    const cvProfile = {
      job_id,
      full_name,
      email,
      phone,
      field_of_study,
      experience,
      skills,
      education,
      portfolio_url,
      linkedin_url,
      github_url,
      additional_info,
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
            application_date
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
