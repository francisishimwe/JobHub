import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function GET() {
  const inspection: any = {
    timestamp: new Date().toISOString(),
    database: {
      connection: 'unknown',
      tables: {} as Record<string, string>,
      tableCounts: {} as Record<string, number | string>,
      sampleData: {} as Record<string, any>
    },
    environment: {} as Record<string, boolean | string>,
    summary: {
      totalTables: 0,
      totalRecords: 0,
      hasJobs: false,
      hasCompanies: false,
      hasCVs: false
    }
  }

  try {
    // Check environment variables
    inspection.environment = {
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      hasNeonUrl: !!process.env.NEON_DATABASE_URL,
      hasPostgresUrl: !!process.env.POSTGRES_URL,
      nodeEnv: process.env.NODE_ENV || 'unknown'
    }

    // Test database connection
    console.log('Testing database connection...')
    await sql`SELECT 1 as test`
    inspection.database.connection = 'connected'
    
    // Get all tables
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `
    
    inspection.database.tables = tables.reduce((acc: Record<string, string>, table: any) => {
      acc[table.table_name] = 'exists'
      return acc
    }, {})
    
    inspection.summary.totalTables = tables.length

    // Check specific tables with direct queries
    try {
      const jobCount = await sql`SELECT COUNT(*) as count FROM jobs`
      inspection.database.tableCounts.jobs = jobCount[0].count
      inspection.summary.totalRecords += jobCount[0].count
      if (jobCount[0].count > 0) inspection.summary.hasJobs = true
    } catch (e: any) {
      inspection.database.tableCounts.jobs = `Error: ${e.message}`
    }

    try {
      const companyCount = await sql`SELECT COUNT(*) as count FROM companies`
      inspection.database.tableCounts.companies = companyCount[0].count
      inspection.summary.totalRecords += companyCount[0].count
      if (companyCount[0].count > 0) inspection.summary.hasCompanies = true
    } catch (e: any) {
      inspection.database.tableCounts.companies = `Error: ${e.message}`
    }

    try {
      const cvCount = await sql`SELECT COUNT(*) as count FROM cv_profiles`
      inspection.database.tableCounts.cv_profiles = cvCount[0].count
      inspection.summary.totalRecords += cvCount[0].count
      if (cvCount[0].count > 0) inspection.summary.hasCVs = true
    } catch (e: any) {
      inspection.database.tableCounts.cv_profiles = `Error: ${e.message}`
    }

    // Get sample data if available
    if (inspection.summary.hasJobs) {
      try {
        const sampleJobs = await sql`SELECT id, title, location, status, approved, created_at FROM jobs LIMIT 3`
        inspection.database.sampleData.jobs = sampleJobs
      } catch (e: any) {
        inspection.database.sampleData.jobs = [{ error: e.message }]
      }
    }

    if (inspection.summary.hasCompanies) {
      try {
        const sampleCompanies = await sql`SELECT id, name, location, industry, created_at FROM companies LIMIT 3`
        inspection.database.sampleData.companies = sampleCompanies
      } catch (e: any) {
        inspection.database.sampleData.companies = [{ error: e.message }]
      }
    }

    if (inspection.summary.hasCVs) {
      try {
        const sampleCVs = await sql`SELECT id, full_name, email, field_of_study, created_at FROM cv_profiles LIMIT 3`
        inspection.database.sampleData.cv_profiles = sampleCVs
      } catch (e: any) {
        inspection.database.sampleData.cv_profiles = [{ error: e.message }]
      }
    }

    // Add recommendations
    const recommendations = []
    
    if (!inspection.summary.hasJobs) {
      recommendations.push('⚠️ No jobs found. Run: POST /api/populate-jobs')
    }
    
    if (!inspection.summary.hasCompanies) {
      recommendations.push('⚠️ No companies found. Run: POST /api/populate-jobs')
    }
    
    if (inspection.summary.totalTables === 0) {
      recommendations.push('❌ No tables found. Run: POST /api/populate-jobs')
    }
    
    if (inspection.summary.hasJobs && inspection.summary.hasCompanies) {
      recommendations.push('✅ Database looks good! Jobs and companies are available.')
    }

    return NextResponse.json({
      ...inspection,
      recommendations,
      status: inspection.database.connection === 'connected' ? 'success' : 'error'
    })

  } catch (error: any) {
    inspection.database.connection = 'failed'
    return NextResponse.json({
      ...inspection,
      error: `Database connection failed: ${error.message}`,
      recommendations: ['❌ Check DATABASE_URL environment variable', '❌ Verify Neon database is running'],
      status: 'error'
    })
  }
}
