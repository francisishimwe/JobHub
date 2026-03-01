import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { jobId } = await request.json()
    
    if (!jobId) {
      return NextResponse.json(
        { error: 'Job ID is required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // First, get the job details
    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', jobId)
      .single()

    if (jobError || !job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      )
    }

    // Update job status to published
    const { error: updateError } = await supabase
      .from('jobs')
      .update({ 
        status: 'published',
        approved: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', jobId)

    if (updateError) {
      console.error('Error publishing job:', updateError)
      return NextResponse.json(
        { error: 'Failed to publish job' },
        { status: 500 }
      )
    }

    // If job has candidate matching enabled, find matching CVs
    if (job.priority_candidate_matching || job.candidate_pre_screening) {
      await findAndNotifyMatchingCandidates(job, supabase)
    }

    return NextResponse.json({
      success: true,
      message: 'Job published successfully',
      job: {
        ...job,
        status: 'published',
        approved: true
      }
    })

  } catch (error) {
    console.error('Error publishing job:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function findAndNotifyMatchingCandidates(job: any, supabase: any) {
  try {
    console.log('🔍 Finding matching candidates for job:', job.title)

    // Extract job category and requirements from description
    const jobCategory = job.opportunity_type || 'Job'
    const jobTitle = job.title.toLowerCase()
    const jobDescription = (job.description || '').toLowerCase()

    // Define skill/field mappings for matching
    const fieldMappings: { [key: string]: string[] } = {
      'technology': ['software', 'developer', 'programming', 'it', 'computer science', 'web', 'app', 'data', 'cybersecurity'],
      'business': ['business', 'management', 'marketing', 'sales', 'finance', 'accounting', 'hr', 'administration'],
      'healthcare': ['medical', 'nursing', 'healthcare', 'doctor', 'pharmacy', 'hospital'],
      'education': ['teaching', 'education', 'teacher', 'academic', 'university', 'school'],
      'engineering': ['engineering', 'civil', 'mechanical', 'electrical', 'construction'],
      'agriculture': ['agriculture', 'farming', 'agronomy', 'veterinary'],
      'hospitality': ['hotel', 'tourism', 'restaurant', 'hospitality', 'service'],
      'media': ['journalism', 'media', 'communication', 'design', 'creative', 'art']
    }

    // Determine job field based on title and description
    let jobField = 'general'
    for (const [field, keywords] of Object.entries(fieldMappings)) {
      if (keywords.some(keyword => jobTitle.includes(keyword) || jobDescription.includes(keyword))) {
        jobField = field
        break
      }
    }

    // Search for matching CV profiles
    let matchingQuery = supabase
      .from('cv_profiles')
      .select('*')
      .eq('is_active', true)

    // Match by field of study in education
    if (jobField !== 'general') {
      const fieldKeywords = fieldMappings[jobField] || []
      for (const keyword of fieldKeywords) {
        matchingQuery = matchingQuery.or(`education.cs.{fieldOfStudy:*.${keyword}*}`)
      }
    }

    const { data: matchedCVs, error: cvError } = await matchingQuery.limit(10)

    if (cvError) {
      console.error('Error finding matching CVs:', cvError)
      return
    }

    console.log(`Found ${matchedCVs?.length || 0} matching candidates`)

    // Update matched candidates count for the job
    if (matchedCVs && matchedCVs.length > 0) {
      await supabase
        .from('jobs')
        .update({ 
          matched_candidates_count: matchedCVs.length,
          updated_at: new Date().toISOString()
        })
        .eq('id', job.id)

      // Send notifications to matched candidates
      for (const cv of matchedCVs) {
        await sendJobNotification(cv, job, supabase)
      }
    }

  } catch (error) {
    console.error('Error in candidate matching:', error)
  }
}

async function sendJobNotification(candidate: any, job: any, supabase: any) {
  try {
    console.log('📧 Sending notification to:', candidate.email)

    // Create notification record (you could implement this as a separate table)
    const notification = {
      candidate_id: candidate.id,
      job_id: job.id,
      job_title: job.title,
      company_name: job.company_name || 'Company',
      notification_type: 'job_match',
      message: `New job opportunity: ${job.title} matches your profile!`,
      created_at: new Date().toISOString(),
      read: false
    }

    // For now, we'll just log the notification
    // In a real implementation, you would:
    // 1. Store notifications in a notifications table
    // 2. Send email notifications
    // 3. Send SMS notifications for premium tiers
    // 4. Send WhatsApp notifications for premium tiers

    console.log('📋 Notification created:', notification)

    // If you have email service integration, you could send emails here:
    // await sendEmailNotification(candidate.email, job)

  } catch (error) {
    console.error('Error sending notification:', error)
  }
}
