import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { withRateLimit, isValidOrigin } from '@/lib/api-middleware'

async function handleTrackExamView(request: NextRequest) {
    try {
        // Validate origin
        if (!isValidOrigin(request)) {
            return NextResponse.json({ error: 'Invalid origin' }, { status: 403 })
        }

        const { examId } = await request.json()

        console.log('[TRACK-EXAM-VIEW] Received request for examId:', examId)

        if (!examId) {
            console.error('[TRACK-EXAM-VIEW] Missing examId')
            return NextResponse.json({ error: 'Exam ID is required' }, { status: 400 })
        }

        const supabase = await createClient()

        // Get current participant count
        const { data: exam, error: fetchError } = await supabase
            .from('exams')
            .select('participants, title')
            .eq('id', examId)
            .single()

        if (fetchError) {
            console.error('[TRACK-EXAM-VIEW] Error fetching exam:', fetchError)
            return NextResponse.json({ error: 'Exam not found' }, { status: 404 })
        }

        console.log('[TRACK-EXAM-VIEW] Current participants for exam:', exam.title, '=', exam.participants || 0)

        // Increment count
        const newCount = (exam.participants || 0) + 1

        const { error: updateError } = await supabase
            .from('exams')
            .update({ participants: newCount })
            .eq('id', examId)

        if (updateError) {
            console.error('[TRACK-EXAM-VIEW] Error updating participants:', updateError)
            return NextResponse.json({ error: 'Failed to update count' }, { status: 500 })
        }

        console.log('[TRACK-EXAM-VIEW] Successfully updated participants to:', newCount)

        return NextResponse.json({ success: true, participants: newCount })
    } catch (error) {
        console.error('[TRACK-EXAM-VIEW] Unexpected error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export const POST = withRateLimit(handleTrackExamView, { maxRequests: 50, windowMs: 60000 })
