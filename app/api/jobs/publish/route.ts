import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { jobId } = await request.json()
    
    if (!jobId) {
      return NextResponse.json(
        { error: 'Job ID is required' },
        { status: 400 }
      )
    }

    // First, get the job details
    const jobResult = await sql`
      SELECT * FROM jobs 
      WHERE id = ${jobId}
      LIMIT 1
    `

    if (!jobResult || jobResult.length === 0) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      )
    }

    const job = jobResult[0]

    // Update job status to published
    await sql`
      UPDATE jobs 
      SET 
        status = 'published',
        approved = true,
        updated_at = ${new Date().toISOString()}
      WHERE id = ${jobId}
    `

    // If job has candidate matching enabled, find matching CVs
    if (job.priority_candidate_matching || job.candidate_pre_screening) {
      await findAndNotifyMatchingCandidates(job)
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

async function findAndNotifyMatchingCandidates(job: any) {
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
    let whereClause = `is_active = true`
    
    // Match by field of study in education
    if (jobField !== 'general') {
      const fieldKeywords = fieldMappings[jobField] || []
      for (const keyword of fieldKeywords) {
        whereClause += ` OR education ILIKE '%${keyword}%'`
      }
    }

    const matchedCVs = await sql`
      SELECT * FROM cv_profiles 
      WHERE ${whereClause}
      LIMIT 10
    `

    console.log(`Found ${matchedCVs?.length || 0} matching candidates`)

    // Update matched candidates count for the job
    if (matchedCVs && matchedCVs.length > 0) {
      await sql`
        UPDATE jobs 
        SET 
          matched_candidates_count = ${matchedCVs.length},
          updated_at = ${new Date().toISOString()}
        WHERE id = ${job.id}
      `

      // Send notifications to matched candidates
      for (const cv of matchedCVs) {
        await sendJobNotification(cv, job)
      }
    }

  } catch (error) {
    console.error('Error in candidate matching:', error)
  }
}

async function sendJobNotification(candidate: any, job: any) {
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
