import { NextRequest, NextResponse } from 'next/server'
import { sql, getSql } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const employerEmail = searchParams.get('email')
    
    if (!employerEmail) {
      return NextResponse.json({ error: 'Employer email is required' }, { status: 400 })
    }

    console.log('🔄 Fetching employer analytics for:', employerEmail)

    // Try to get analytics from database first
    try {
      // Get overall stats
      const overallStats = await sql`
        SELECT 
          COUNT(DISTINCT j.id) as total_jobs,
          COUNT(DISTINCT ja.id) as total_applications,
          COALESCE(SUM(j.views), 0) as total_views,
          COALESCE(AVG(j.views), 0) as avg_views_per_job,
          COUNT(DISTINCT CASE WHEN ja.status = 'shortlisted' THEN ja.id END) as shortlisted_applications,
          COUNT(DISTINCT CASE WHEN ja.status = 'hired' THEN ja.id END) as hired_applications
        FROM jobs j
        LEFT JOIN companies c ON j.company_id = c.id
        LEFT JOIN job_applications ja ON j.id = ja.job_id
        WHERE c.name = ${employerEmail}
      `

      // Get job performance data
      const jobPerformance = await sql`
        SELECT 
          j.id,
          j.title,
          j.views,
          j.applicants,
          COUNT(DISTINCT ja.id) as actual_applications,
          COUNT(DISTINCT CASE WHEN ja.status = 'shortlisted' THEN ja.id END) as shortlisted_count,
          COUNT(DISTINCT CASE WHEN ja.status = 'hired' THEN ja.id END) as hired_count,
          j.created_at,
          j.deadline
        FROM jobs j
        LEFT JOIN companies c ON j.company_id = c.id
        LEFT JOIN job_applications ja ON j.id = ja.job_id
        WHERE c.name = ${employerEmail}
        GROUP BY j.id, j.title, j.views, j.applicants, j.created_at, j.deadline
        ORDER BY j.created_at DESC
      `

      // Get application trends by month
      const applicationTrends = await sql`
        SELECT 
          DATE_TRUNC('month', ja.application_date) as month,
          COUNT(DISTINCT ja.id) as applications,
          COUNT(DISTINCT ja.job_id) as jobs_with_applications
        FROM job_applications ja
        INNER JOIN jobs j ON ja.job_id = j.id
        LEFT JOIN companies c ON j.company_id = c.id
        WHERE c.name = ${employerEmail}
          AND ja.application_date >= CURRENT_DATE - INTERVAL '12 months'
        GROUP BY DATE_TRUNC('month', ja.application_date)
        ORDER BY month DESC
      `

      // Get top locations from applicant profiles
      const topLocations = await sql`
        SELECT 
          COUNT(DISTINCT cv.id) as applicant_count
        FROM cv_profiles cv
        INNER JOIN job_applications ja ON cv.id = ja.cv_profile_id
        INNER JOIN jobs j ON ja.job_id = j.id
        LEFT JOIN companies c ON j.company_id = c.id
        WHERE c.name = ${employerEmail}
      `

      // Get application status distribution
      const statusDistribution = await sql`
        SELECT 
          ja.status,
          COUNT(DISTINCT ja.id) as count,
          ROUND(COUNT(DISTINCT ja.id) * 100.0 / SUM(COUNT(DISTINCT ja.id)) OVER (), 2) as percentage
        FROM job_applications ja
        INNER JOIN jobs j ON ja.job_id = j.id
        LEFT JOIN companies c ON j.company_id = c.id
        WHERE c.name = ${employerEmail}
        GROUP BY ja.status
        ORDER BY count DESC
      `

      // Calculate conversion rate
      const stats = overallStats[0]
      const conversionRate = stats.total_views > 0 
        ? ((stats.total_applications / stats.total_views) * 100).toFixed(2)
        : '0.00'

      const analytics = {
        totalJobs: parseInt(stats.total_jobs) || 0,
        totalApplications: parseInt(stats.total_applications) || 0,
        totalViews: parseInt(stats.total_views) || 0,
        avgViewsPerJob: parseFloat(stats.avg_views_per_job) || 0,
        shortlistedApplications: parseInt(stats.shortlisted_applications) || 0,
        hiredApplications: parseInt(stats.hired_applications) || 0,
        conversionRate: parseFloat(conversionRate),
        jobPerformance: jobPerformance.map((job: any) => ({
          jobId: job.id,
          jobTitle: job.title,
          views: parseInt(job.views) || 0,
          applicants: parseInt(job.actual_applications) || 0,
          shortlisted: parseInt(job.shortlisted_count) || 0,
          hired: parseInt(job.hired_count) || 0,
          postedDate: job.created_at,
          deadline: job.deadline
        })),
        applicationTrends: applicationTrends.map((trend: any) => ({
          month: trend.month,
          applications: parseInt(trend.applications) || 0,
          jobsWithApplications: parseInt(trend.jobs_with_applications) || 0
        })),
        topLocations: [{
          name: 'All Locations',
          count: parseInt(topLocations[0]?.applicant_count) || 0
        }],
        statusDistribution: statusDistribution.map((status: any) => ({
          status: status.status,
          count: parseInt(status.count) || 0,
          percentage: parseFloat(status.percentage) || 0
        }))
      }

      console.log('✅ Generated analytics for employer:', employerEmail)

      return NextResponse.json({ 
        success: true, 
        analytics,
        database: true // Flag to indicate this is database data
      })

    } catch (dbError) {
      console.error('Database query failed:', dbError)
      
      // Return empty/simulated analytics when database is not available
      console.log('🔄 Returning simulated analytics due to database unavailability')
      const simulatedAnalytics = {
        totalJobs: 0,
        totalApplications: 0,
        totalViews: 0,
        avgViewsPerJob: 0,
        shortlistedApplications: 0,
        hiredApplications: 0,
        conversionRate: 0,
        jobPerformance: [],
        applicationTrends: [],
        topLocations: [{ name: 'All Locations', count: 0 }],
        statusDistribution: [],
        message: 'Analytics temporarily unavailable'
      }

      return NextResponse.json({ 
        success: true, 
        analytics: simulatedAnalytics,
        database: false,
        message: 'Database temporarily unavailable'
      })
    }

  } catch (error) {
    console.error('❌ Error fetching employer analytics:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch employer analytics',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
