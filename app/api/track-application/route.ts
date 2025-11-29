import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
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
            return NextResponse.json({ error: 'Job not found', details: fetchError.message }, { status: 404 })
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
            return NextResponse.json({ error: 'Failed to update count', details: updateError.message }, { status: 500 })
        }

        console.log('[TRACK-APPLICATION] Successfully updated applicants to:', newCount)

        return NextResponse.json({ success: true, applicants: newCount, jobTitle: job.title })
    } catch (error) {
        console.error('[TRACK-APPLICATION] Unexpected error:', error)
        return NextResponse.json({ error: 'Internal Server Error', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 })
    }
}
