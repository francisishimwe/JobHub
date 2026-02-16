import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const envCheck = {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'NOT SET',
      supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET',
      supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET' : 'NOT SET',
      nodeEnv: process.env.NODE_ENV,
      supabaseUrlLength: process.env.NEXT_PUBLIC_SUPABASE_URL?.length || 0,
      serviceKeyLength: process.env.SUPABASE_SERVICE_ROLE_KEY?.length || 0,
      anonKeyLength: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length || 0,
    }
    
    return NextResponse.json(envCheck)
    
  } catch (error) {
    return NextResponse.json({ 
      error: 'Environment check failed', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
