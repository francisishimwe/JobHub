import { sql } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { withRateLimit, isValidOrigin } from '@/lib/api-middleware'

async function handleTrackView(request: NextRequest) {
    try {
        // Validate origin
        if (!isValidOrigin(request)) {
            return NextResponse.json({ error: 'Invalid origin' }, { status: 403 })
        }

        const body = await request.json()
        const { content_type, content_id } = body

        console.log('[TRACK-VIEW] Received request for content_type:', content_type, 'content_id:', content_id)

        if (!content_type || !content_id) {
            console.error('[TRACK-VIEW] Missing content_type or content_id')
            return NextResponse.json({ error: 'content_type and content_id are required' }, { status: 400 })
        }

        // Track based on content type
        if (content_type === 'job') {
            const jobResult = await sql`
                SELECT views FROM jobs WHERE id = ${content_id}
            `

            if (jobResult.length === 0) {
                console.error('[TRACK-VIEW] Job not found:', content_id)
                return NextResponse.json({ error: 'Job not found' }, { status: 404 })
            }

            const job = jobResult[0]
            const newCount = (job.views || 0) + 1

            await sql`
                UPDATE jobs SET views = ${newCount} WHERE id = ${content_id}
            `

            console.log('[TRACK-VIEW] Successfully updated job views to:', newCount)
            return NextResponse.json({ success: true, views: newCount })
        }

        return NextResponse.json({ error: 'Invalid content_type' }, { status: 400 })
    } catch (error) {
        console.error('[TRACK-VIEW] Unexpected error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export const POST = withRateLimit(handleTrackView, { maxRequests: 200, windowMs: 60000 })
