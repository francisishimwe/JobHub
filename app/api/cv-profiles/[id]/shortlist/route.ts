import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { NotificationService } from '@/lib/notifications'

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    // Update CV profile to mark as shortlisted
    const cvProfileResult = await sql`
      UPDATE cv_profiles 
      SET is_shortlisted = true 
      WHERE id = ${id}
      RETURNING *
    `

    if (!cvProfileResult || cvProfileResult.length === 0) {
      console.error('CV Profile shortlist error: No result returned')
      return NextResponse.json(
        { error: 'Failed to shortlist candidate' },
        { status: 500 }
      )
    }

    const cvProfile = cvProfileResult[0]

    // Update job application status
    await sql`
      UPDATE job_applications 
      SET status = 'shortlisted' 
      WHERE cv_profile_id = ${id}
    `

    // Get job details for notification
    const jobDataResult = await sql`
      SELECT title, company_id 
      FROM jobs 
      WHERE id = ${cvProfile.job_id}
      LIMIT 1
    `

    const jobData = jobDataResult[0] || {}

    // Get company details
    let companyName = 'Company'
    if (jobData?.company_id) {
      const companyDataResult = await sql`
        SELECT name 
        FROM companies 
        WHERE id = ${jobData.company_id}
        LIMIT 1
      `
      companyName = companyDataResult[0]?.name || 'Company'
    }

    // Send notification to candidate
    const notificationSent = await NotificationService.notifyShortlistedCandidate(
      cvProfile.full_name,
      jobData?.title || 'Position',
      companyName,
      cvProfile.phone,
      cvProfile.email
    )

    console.log(`Candidate ${cvProfile.full_name} has been shortlisted. Notification sent: ${notificationSent}`)

    return NextResponse.json({
      success: true,
      message: 'Candidate shortlisted successfully',
      data: cvProfile
    })

  } catch (error) {
    console.error('Shortlist API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
