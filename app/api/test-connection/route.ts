import { NextResponse } from 'next/server'

export async function GET() {
  const env = {
    DATABASE_URL: process.env.DATABASE_URL ? 'SET' : 'NOT SET',
    NEON_DATABASE_URL: process.env.NEON_DATABASE_URL ? 'SET' : 'NOT SET',
    POSTGRES_URL: process.env.POSTGRES_URL ? 'SET' : 'NOT SET',
    NODE_ENV: process.env.NODE_ENV || 'NOT SET'
  }

  const hasAnyDb = env.DATABASE_URL !== 'NOT SET' || env.NEON_DATABASE_URL !== 'NOT SET' || env.POSTGRES_URL !== 'NOT SET'

  return NextResponse.json({
    environment: env,
    hasDatabaseConnection: hasAnyDb,
    status: hasAnyDb ? 'DATABASE_CONFIGURED' : 'DATABASE_MISSING',
    message: hasAnyDb 
      ? 'Database connection string is configured' 
      : '❌ CRITICAL: No database connection string found. Set DATABASE_URL environment variable in your hosting platform.',
    fix: 'Add DATABASE_URL to your Vercel/Netlify/Hosting platform environment variables with your Neon connection string.'
  })
}
