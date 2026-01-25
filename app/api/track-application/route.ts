import { sql } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { withRateLimit, isValidOrigin } from '@/lib/api-middleware'

async function handleTrackApplication(request: NextRequest) {
    try {
        // Validate origin
        if (!isValidOrigin(request)) {
            return NextResponse.json({ error: 'Invalid origin' }, { status: 403 })
        }

        const { jobId } = await request.json()

        console.log('[TRACK-APPLICATION] Received request for jobId:', jobId)

        if (!jobId) {
            console.error('[TRACK-APPLICATION] Missing jobId')
            return NextResponse.json({ error: 'Job ID is required' }, { status: 400 })
        }

        // Get current applicant count
        const jobResult = await sql`
            SELECT applicants, title FROM jobs WHERE id = ${jobId}
        `

        if (jobResult.length === 0) {
            console.error('[TRACK-APPLICATION] Job not found:', jobId)
            return NextResponse.json({ error: 'Job not found' }, { status: 404 })
        }

        const job = jobResult[0]
        console.log('[TRACK-APPLICATION] Current applicants for job:', job.title, '=', job.applicants || 0)

        // Increment count
        const newCount = (job.applicants || 0) + 1

        await sql`
            UPDATE jobs SET applicants = ${newCount} WHERE id = ${jobId}
        `

        console.log('[TRACK-APPLICATION] Successfully updated applicants to:', newCount)

        return NextResponse.json({ success: true, applicants: newCount })
    } catch (error) {
        console.error('[TRACK-APPLICATION] Unexpected error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export const POST = withRateLimit(handleTrackApplication, { maxRequests: 50, windowMs: 60000 })
