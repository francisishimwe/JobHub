import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function GET() {
  try {
    console.log('🔍 Testing database connection...')
    
    // Test basic connection
    const connectionTest = await sql`SELECT NOW() as current_time`
    console.log('✅ Database connection successful:', connectionTest[0])
    
    // Check if jobs table exists and count records
    const tableCheck = await sql`
      SELECT COUNT(*) as count FROM information_schema.tables 
      WHERE table_name = 'jobs'
    `
    console.log('📊 Jobs table exists:', tableCheck[0].count > 0 ? 'YES' : 'NO')
    
    if (tableCheck[0].count > 0) {
      // Count total jobs
      const totalJobs = await sql`SELECT COUNT(*) as total FROM jobs`
      console.log('📈 Total jobs in database:', totalJobs[0].total)
      
      // Count active jobs (published + approved + not expired)
      const activeJobs = await sql`
        SELECT COUNT(*) as active FROM jobs 
        WHERE status = 'published' 
        AND approved = true 
        AND (deadline IS NULL OR deadline >= CURRENT_DATE)
      `
      console.log('✅ Active jobs:', activeJobs[0].active)
      
      // Get sample of jobs for debugging
      const sampleJobs = await sql`
        SELECT id, title, status, approved, deadline, created_at, opportunity_type
        FROM jobs 
        ORDER BY created_at DESC 
        LIMIT 5
      `
      console.log('📝 Sample jobs:', sampleJobs)
      
      return NextResponse.json({
        success: true,
        connection: 'OK',
        tableExists: true,
        totalJobs: totalJobs[0].total,
        activeJobs: activeJobs[0].active,
        sampleJobs: sampleJobs
      })
    } else {
      return NextResponse.json({
        success: false,
        connection: 'OK',
        tableExists: false,
        message: 'Jobs table does not exist'
      })
    }
  } catch (error) {
    console.error('❌ Database test failed:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}
