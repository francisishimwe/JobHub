import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { verifyCronSecret } from "@/lib/api-middleware"

// Shared logic for cleanup
async function handleCleanup(request: NextRequest) {
    try {
        // Verify cron secret for security
        if (!verifyCronSecret(request)) {
            console.error("Unauthorized cleanup attempt")
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const today = new Date().toISOString().split('T')[0] // Get today's date in YYYY-MM-DD format

        // Delete jobs where deadline has passed
        const deletedJobs = await sql`
            DELETE FROM jobs
            WHERE deadline < ${today} AND deadline IS NOT NULL
            RETURNING id, title, deadline
        `

        console.log(`Deleted ${deletedJobs?.length || 0} expired jobs`)

        return NextResponse.json({
            success: true,
            message: `Successfully deleted ${deletedJobs?.length || 0} expired job(s)`,
            deletedCount: deletedJobs?.length || 0,
            deletedJobs: deletedJobs?.map(job => ({
                id: job.id,
                title: job.title,
                deadline: job.deadline
            }))
        })
    } catch (error: any) {
        console.error("Unexpected error in cleanup-expired-jobs:", error)
        return NextResponse.json(
            { message: "Internal server error", error: error.message },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    return handleCleanup(request)
}

// Also support GET requests for cron jobs
export async function GET(request: NextRequest) {
    return handleCleanup(request)
}
