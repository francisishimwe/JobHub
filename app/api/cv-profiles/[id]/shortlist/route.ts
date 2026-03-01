import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { NotificationService } from '@/lib/notifications'

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()
    const { id } = params

    // Update CV profile to mark as shortlisted
    const { data: cvProfile, error: cvError } = await supabase
      .from('cv_profiles')
      .update({ is_shortlisted: true })
      .eq('id', id)
      .select()
      .single()

    if (cvError) {
      console.error('CV Profile shortlist error:', cvError)
      return NextResponse.json(
        { error: 'Failed to shortlist candidate' },
        { status: 500 }
      )
    }

    // Update job application status
    const { error: applicationError } = await supabase
      .from('job_applications')
      .update({ status: 'shortlisted' })
      .eq('cv_profile_id', id)

    if (applicationError) {
      console.error('Application update error:', applicationError)
      return NextResponse.json(
        { error: 'Failed to update application status' },
        { status: 500 }
      )
    }

    // Get job details for notification
    const { data: jobData } = await supabase
      .from('jobs')
      .select('title, company_id')
      .eq('id', cvProfile.job_id)
      .single()

    // Get company details
    let companyName = 'Company'
    if (jobData?.company_id) {
      const { data: companyData } = await supabase
        .from('companies')
        .select('name')
        .eq('id', jobData.company_id)
        .single()
      companyName = companyData?.name || 'Company'
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
