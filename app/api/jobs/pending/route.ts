import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    // Fetch pending jobs with company information
    const pendingJobs = await sql`
      SELECT 
        j.id,
        j.title,
        j.location,
        j.job_type,
        j.opportunity_type,
        j.deadline,
        j.description,
        j.plan_id,
        j.created_at,
        c.name as company_name,
        c.logo as company_logo
      FROM jobs j
      JOIN companies c ON j.company_id = c.id
      WHERE j.status = 'pending'
      ORDER BY j.created_at DESC
    `

    return NextResponse.json({
      jobs: pendingJobs,
      total: pendingJobs.length
    })
  } catch (error) {
    console.error('Error fetching pending jobs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch pending jobs' },
      { status: 500 }
    )
  }
}
