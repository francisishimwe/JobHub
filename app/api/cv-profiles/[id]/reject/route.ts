import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    // Update job application status to rejected
    const result = await sql`
      UPDATE job_applications 
      SET status = 'rejected' 
      WHERE cv_profile_id = ${id}
    `

    if (!result) {
      console.error('Application reject error: No result returned')
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
