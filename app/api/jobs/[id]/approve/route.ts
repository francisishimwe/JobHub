import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const jobId = params.id

    // Update job status to published and approved to true
    const result = await sql`
      UPDATE jobs 
      SET status = 'published', 
          approved = true,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${jobId} AND status = 'pending'
      RETURNING *
    `

    if (!result || result.length === 0) {
      return NextResponse.json(
        { error: 'Job not found or not in pending status' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      message: 'Job approved successfully',
      job: result[0]
    })
  } catch (error) {
    console.error('Error approving job:', error)
    return NextResponse.json(
      { error: 'Failed to approve job' },
      { status: 500 }
    )
  }
}
