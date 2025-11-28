import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const { jobId } = await request.json()

        if (!jobId) {
            return NextResponse.json({ error: 'Job ID is required' }, { status: 400 })
        }

        const supabase = await createClient()

        // Get current applicant count
        const { data: job, error: fetchError } = await supabase
            .from('jobs')
            .select('applicants')
            .eq('id', jobId)
            .single()

        if (fetchError) {
            console.error('Error fetching job:', fetchError)
            return NextResponse.json({ error: 'Job not found' }, { status: 404 })
        }

        // Increment count
        const newCount = (job.applicants || 0) + 1

        const { error: updateError } = await supabase
            .from('jobs')
            .update({ applicants: newCount })
            .eq('id', jobId)

        if (updateError) {
            console.error('Error updating applicants:', updateError)
            return NextResponse.json({ error: 'Failed to update count' }, { status: 500 })
        }

        return NextResponse.json({ success: true, applicants: newCount })
    } catch (error) {
        console.error('Error tracking application:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
