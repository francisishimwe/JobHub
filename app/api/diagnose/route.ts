import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function GET() {
  const diagnosis: any = {
    timestamp: new Date().toISOString(),
    database: {
      connection: 'unknown',
      tables: {} as Record<string, string>,
      jobs: 0,
      companies: 0
    },
    environment: {} as Record<string, boolean | string>,
    recommendations: [] as string[]
  }

  try {
    // Check environment variables
    diagnosis.environment = {
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      hasNeonUrl: !!process.env.NEON_DATABASE_URL,
      hasPostgresUrl: !!process.env.POSTGRES_URL,
      nodeEnv: process.env.NODE_ENV || 'unknown'
    }

    // Test database connection
    console.log('Testing database connection...')
    const result = await sql`SELECT 1 as test`
    diagnosis.database.connection = 'connected'
    
    // Check if tables exist
    try {
      const tables = await sql`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
        ORDER BY table_name
      `
      diagnosis.database.tables = tables.reduce((acc: Record<string, string>, table: any) => {
        acc[table.table_name] = 'exists'
        return acc
      }, {})
    } catch (err: any) {
      diagnosis.database.connection = 'no_tables'
      diagnosis.recommendations.push('Database tables do not exist. Run setup script.')
    }

    // Count jobs if table exists
    if (diagnosis.database.tables.jobs) {
      try {
        const jobCount = await sql`SELECT COUNT(*) as count FROM jobs`
        diagnosis.database.jobs = jobCount[0].count
      } catch (err: any) {
        diagnosis.recommendations.push('Jobs table exists but query failed')
      }
    }

    // Count companies if table exists
    if (diagnosis.database.tables.companies) {
      try {
        const companyCount = await sql`SELECT COUNT(*) as count FROM companies`
        diagnosis.database.companies = companyCount[0].count
      } catch (err: any) {
        diagnosis.recommendations.push('Companies table exists but query failed')
      }
    }

    // Generate recommendations
    if (!diagnosis.environment.hasDatabaseUrl && !diagnosis.environment.hasNeonUrl && !diagnosis.environment.hasPostgresUrl) {
      diagnosis.recommendations.push('❌ CRITICAL: No database connection string found. Set DATABASE_URL environment variable.')
    }

    if (diagnosis.database.connection === 'connected') {
      diagnosis.recommendations.push('✅ Database connection is working')
      
      if (!diagnosis.database.tables.jobs) {
        diagnosis.recommendations.push('⚠️ Jobs table missing. Run: node setup-neon-database.js')
      } else if (diagnosis.database.jobs === 0) {
        diagnosis.recommendations.push('⚠️ No jobs found. Create sample job: POST /api/setup-sample-job')
      } else {
        diagnosis.recommendations.push(`✅ Found ${diagnosis.database.jobs} jobs in database`)
      }
    }

  } catch (error: any) {
    diagnosis.database.connection = 'failed'
    diagnosis.recommendations.push(`❌ Database connection failed: ${error.message}`)
    
    if (error.message.includes('connection string')) {
      diagnosis.recommendations.push('Set DATABASE_URL environment variable with your Neon connection string')
    }
  }

  return NextResponse.json(diagnosis)
}
