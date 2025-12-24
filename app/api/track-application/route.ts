import { createClient } from '@/lib/supabase/server'
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

        const supabase = await createClient()

        // Get current applicant count
        const { data: job, error: fetchError } = await supabase
            .from('jobs')
            .select('applicants, title')
            .eq('id', jobId)
            .single()

        if (fetchError) {
            console.error('[TRACK-APPLICATION] Error fetching job:', fetchError)
            return NextResponse.json({ error: 'Job not found' }, { status: 404 })
        }

        console.log('[TRACK-APPLICATION] Current applicants for job:', job.title, '=', job.applicants || 0)

        // Increment count
        const newCount = (job.applicants || 0) + 1

        const { error: updateError } = await supabase
            .from('jobs')
            .update({ applicants: newCount })
            .eq('id', jobId)

        if (updateError) {
            console.error('[TRACK-APPLICATION] Error updating applicants:', updateError)
            return NextResponse.json({ error: 'Failed to update count' }, { status: 500 })
        }

        console.log('[TRACK-APPLICATION] Successfully updated applicants to:', newCount)

        return NextResponse.json({ success: true, applicants: newCount })
    } catch (error) {
        console.error('[TRACK-APPLICATION] Unexpected error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export const POST = withRateLimit(handleTrackApplication, { maxRequests: 50, windowMs: 60000 })
