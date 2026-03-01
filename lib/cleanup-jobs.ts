/**
 * Utility to cleanup expired jobs
 * This function calls the API endpoint to delete expired jobs
 */
export async function cleanupExpiredJobs(): Promise<{
    success: boolean
    deletedCount: number
    message: string
}> {
    try {
        const response = await fetch("/api/cleanup-expired-jobs", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        })

        if (!response.ok) {
            const error = await response.json()
            throw new Error(error.message || "Failed to cleanup expired jobs")
        }

        const data = await response.json()
        return {
            success: true,
            deletedCount: data.deletedCount || 0,
            message: data.message || "Cleanup completed"
        }
    } catch (error) {
        console.error("Error cleaning up expired jobs:", error)
        return {
            success: false,
            deletedCount: 0,
            message: error instanceof Error ? error.message : "Unknown error"
        }
    }
}

/**
 * Filter out expired jobs from a job list
 * This is a client-side filter as a backup to server-side deletion
 */
export function filterExpiredJobs<T extends { deadline?: string | null }>(
    jobs: T[]
): T[] {
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Reset to start of day for accurate comparison

    return jobs.filter(job => {
        if (!job.deadline) {
            // Jobs without deadline never expire
            return true
        }

        const deadline = new Date(job.deadline)
        deadline.setHours(0, 0, 0, 0)

        // Keep job if deadline is today or in the future
        return deadline >= today
    })
}
