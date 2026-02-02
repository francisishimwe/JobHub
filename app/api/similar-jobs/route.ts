import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const jobId = searchParams.get('jobId')
    const limit = parseInt(searchParams.get('limit') || '6')

    if (!jobId) {
      return NextResponse.json(
        { error: 'Missing jobId parameter' },
        { status: 400 }
      )
    }

    // First get the current job details to find similar jobs
    const currentJobResult = await sql`
      SELECT opportunity_type, job_type, location, title
      FROM jobs 
      WHERE id = ${jobId} AND status = 'published' AND approved = true
    `

    if (currentJobResult.length === 0) {
      return NextResponse.json({ jobs: [] })
    }

    const currentJob = currentJobResult[0]

    // Find similar jobs based on opportunity_type, job_type, and location
    // Exclude the current job and only return active jobs
    const similarJobs = await sql`
      SELECT 
        id,
        title,
        company_id,
        location,
        job_type,
        opportunity_type,
        deadline,
        featured,
        is_verified,
        description,
        status,
        approved,
        created_at
      FROM jobs
      WHERE 
        id != ${jobId}
        AND status = 'published'
        AND approved = true
        AND (deadline IS NULL OR deadline >= CURRENT_DATE)
        AND (
          opportunity_type = ${currentJob.opportunity_type}
          OR job_type = ${currentJob.job_type}
          OR location = ${currentJob.location}
        )
      ORDER BY 
        featured DESC,
        CASE 
          WHEN opportunity_type = ${currentJob.opportunity_type} THEN 1
          WHEN job_type = ${currentJob.job_type} THEN 2
          WHEN location = ${currentJob.location} THEN 3
          ELSE 4
        END,
        created_at DESC
      LIMIT ${limit}
    `

    return NextResponse.json({
      jobs: similarJobs
    })
  } catch (error) {
    console.error('Error fetching similar jobs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch similar jobs' },
      { status: 500 }
    )
  }
}
