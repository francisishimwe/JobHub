import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Testing database connection for pending jobs...');
    
    // Test database connection first
    try {
      const testConnection = await sql`SELECT 1 as test`;
      console.log('✅ Database connection successful for pending jobs:', testConnection);
      
      // Fetch pending jobs with company information
      const pendingJobs = await sql`
        SELECT 
          j.id,
          j.title,
          j.location,
          j.job_type,
          j.opportunity_type,
          j.deadline,
          j.description,
          j.plan_id,
          j.created_at,
          c.name as company_name,
          c.logo as company_logo
        FROM jobs j
        JOIN companies c ON j.company_id = c.id
        WHERE j.status = 'pending'
        ORDER BY j.created_at DESC
      `

      console.log(`✓ Database returned ${pendingJobs.length} pending jobs`);

      return NextResponse.json({
        success: true,
        jobs: pendingJobs,
        total: pendingJobs.length,
        database: true
      })
      
    } catch (dbError) {
      console.error('Database query failed for pending jobs:', dbError)
      
      // Return empty results when database is not available
      console.log('🔄 Database not available for pending jobs, returning empty results')
      
      return NextResponse.json({
        success: true,
        jobs: [],
        total: 0,
        database: false,
        message: 'Database temporarily unavailable'
      })
    }
    
  } catch (error) {
    console.error('Error in pending jobs API:', error)
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to fetch pending jobs',
        success: false
      },
      { status: 500 }
    )
  }
}
