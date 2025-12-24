import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { withRateLimit } from '@/lib/api-middleware'

async function handleJobStats(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const jobId = searchParams.get('jobId')

        if (!jobId) {
            return NextResponse.json({ error: 'Job ID is required' }, { status: 400 })
        }

        const supabase = await createClient()

        // Get current applicant count
        const { data: job, error } = await supabase
            .from('jobs')
            .select('applicants')
            .eq('id', jobId)
            .single()

        if (error) {
            console.error('[JOB-STATS] Error fetching job:', error)
            return NextResponse.json({ error: 'Job not found' }, { status: 404 })
        }

        return NextResponse.json({ applicants: job.applicants || 0 })
    } catch (error) {
        console.error('[JOB-STATS] Unexpected error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export const GET = withRateLimit(handleJobStats, { maxRequests: 200, windowMs: 60000 })
