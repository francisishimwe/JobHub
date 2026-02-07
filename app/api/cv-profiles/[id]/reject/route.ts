import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()
    const { id } = params

    // Update job application status to rejected
    const { error: applicationError } = await supabase
      .from('job_applications')
      .update({ status: 'rejected' })
      .eq('cv_profile_id', id)

    if (applicationError) {
      console.error('Application reject error:', applicationError)
      return NextResponse.json(
        { error: 'Failed to reject candidate' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Candidate rejected successfully'
    })

  } catch (error) {
    console.error('Reject API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
