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

    // Check counts for each important table
    const importantTables = ['jobs', 'companies', 'cv_profiles', 'job_applications', 'exams', 'exam_submissions']
    
    for (const tableName of importantTables) {
      if (inspection.database.tables[tableName]) {
        try {
          const countResult = await sql`SELECT COUNT(*) as count FROM ${sql.unsafe(tableName)}`
          inspection.database.tableCounts[tableName] = countResult[0].count
          inspection.summary.totalRecords += countResult[0].count
          
          if (tableName === 'jobs' && countResult[0].count > 0) inspection.summary.hasJobs = true
          if (tableName === 'companies' && countResult[0].count > 0) inspection.summary.hasCompanies = true
          if (tableName === 'cv_profiles' && countResult[0].count > 0) inspection.summary.hasCVs = true
          
          // Get sample data for key tables
          if (countResult[0].count > 0 && ['jobs', 'companies', 'cv_profiles'].includes(tableName)) {
            try {
              let sampleQuery = ''
              if (tableName === 'jobs') {
                sampleQuery = `SELECT id, title, location, status, approved, created_at FROM ${tableName} LIMIT 3`
              } else if (tableName === 'companies') {
                sampleQuery = `SELECT id, name, location, industry, created_at FROM ${tableName} LIMIT 3`
              } else if (tableName === 'cv_profiles') {
                sampleQuery = `SELECT id, full_name, email, field_of_study, created_at FROM ${tableName} LIMIT 3`
              }
              
              const sampleData = await sql.unsafe(sampleQuery)
              inspection.database.sampleData[tableName] = sampleData
            } catch (sampleError: any) {
              inspection.database.sampleData[tableName] = [{ error: sampleError.message }]
            }
          }
          
        } catch (countError: any) {
          inspection.database.tableCounts[tableName] = `Error: ${countError.message}`
        }
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
