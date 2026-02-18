import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    // Neon Database Environment Variables
    databaseUrl: process.env.DATABASE_URL ? 'Set' : 'Not set',
    neonDatabaseUrl: process.env.NEON_DATABASE_URL ? 'Set' : 'Not set',
    postgresUrl: process.env.POSTGRES_URL ? 'Set' : 'Not set',
    
    // Show actual connection string (masked for security)
    actualConnection: process.env.DATABASE_URL || process.env.NEON_DATABASE_URL || process.env.POSTGRES_URL || 'None found',
    
    // Environment
    nodeEnv: process.env.NODE_ENV,
    
    // Legacy Supabase (should be removed)
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Not set',
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not set',
  })
}
