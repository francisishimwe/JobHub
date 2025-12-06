import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(request: Request) {
    try {
        // Optional: Add authentication/authorization check here
        // For example, check for a secret token in headers
        const authHeader = request.headers.get("authorization")
        const cronSecret = process.env.CRON_SECRET || "your-secret-key"

        // Uncomment this if you want to protect the endpoint
        // if (authHeader !== `Bearer ${cronSecret}`) {
        //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        // }

        const today = new Date().toISOString().split('T')[0] // Get today's date in YYYY-MM-DD format

        // Delete jobs where deadline has passed
        const { data: deletedJobs, error } = await supabase
            .from("jobs")
            .delete()
            .lt("deadline", today) // Less than today
            .not("deadline", "is", null) // Only jobs with a deadline
            .select()

        if (error) {
            console.error("Error deleting expired jobs:", error)
            return NextResponse.json(
                { error: "Failed to delete expired jobs", details: error.message },
                { status: 500 }
            )
        }

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
    } catch (error) {
        console.error("Unexpected error in cleanup-expired-jobs:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}

// Also support GET requests for manual testing
export async function GET() {
    return POST(new Request("http://localhost:3000/api/cleanup-expired-jobs", {
        method: "POST"
    }))
}
