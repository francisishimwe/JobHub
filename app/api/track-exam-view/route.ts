import { sql } from '@/lib/db'
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

        // Get current participant count
        const examResult = await sql`
            SELECT participants, title FROM exams WHERE id = ${examId}
        `

        if (examResult.length === 0) {
            console.error('[TRACK-EXAM-VIEW] Exam not found:', examId)
            return NextResponse.json({ error: 'Exam not found' }, { status: 404 })
        }

        const exam = examResult[0]
        console.log('[TRACK-EXAM-VIEW] Current participants for exam:', exam.title, '=', exam.participants || 0)

        // Increment count
        const newCount = (exam.participants || 0) + 1

        await sql`
            UPDATE exams SET participants = ${newCount} WHERE id = ${examId}
        `

        console.log('[TRACK-EXAM-VIEW] Successfully updated participants to:', newCount)

        return NextResponse.json({ success: true, participants: newCount })
    } catch (error) {
        console.error('[TRACK-EXAM-VIEW] Unexpected error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export const POST = withRateLimit(handleTrackExamView, { maxRequests: 50, windowMs: 60000 })
