'use client'

import { useEffect } from 'react'

export function JobViewTracker({ jobId }: { jobId: string }) {
    useEffect(() => {
        const trackView = async () => {
            try {
                await fetch('/api/track-view', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        content_type: 'job',
                        content_id: jobId,
                    }),
                })
            } catch (error) {
                console.error('Error tracking view:', error)
            }
        }

        if (jobId) {
            trackView()
        }
    }, [jobId])

    return null
}
