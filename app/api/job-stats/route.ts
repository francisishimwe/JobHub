import { sql } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { withRateLimit } from '@/lib/api-middleware'

async function handleJobStats(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const jobId = searchParams.get('jobId')

        if (!jobId) {
            return NextResponse.json({ error: 'Job ID is required' }, { status: 400 })
        }

        // Get current applicant count
        const jobResult = await sql`
            SELECT applicants FROM jobs WHERE id = ${jobId}
        `

        if (jobResult.length === 0) {
            console.error('[JOB-STATS] Job not found:', jobId)
            return NextResponse.json({ error: 'Job not found' }, { status: 404 })
        }

        const job = jobResult[0]
        return NextResponse.json({ applicants: job.applicants || 0 })
    } catch (error) {
        console.error('[JOB-STATS] Unexpected error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export const GET = withRateLimit(handleJobStats, { maxRequests: 200, windowMs: 60000 })
