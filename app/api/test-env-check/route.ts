import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    console.log('=== ENVIRONMENT CHECK START ===')
    
    // Check environment variables
    const envCheck = {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'NOT SET',
      supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET',
      supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET' : 'NOT SET',
      nodeEnv: process.env.NODE_ENV,
      supabaseUrlLength: process.env.NEXT_PUBLIC_SUPABASE_URL?.length || 0,
      serviceKeyLength: process.env.SUPABASE_SERVICE_ROLE_KEY?.length || 0,
    }
    
    console.log('Environment variables:', envCheck)
    
    // Test database connection
    const supabase = createClient()
    console.log('Supabase client created')
    
    // Test basic query
    const { data, error } = await supabase
      .from('companies')
      .select('count')
      .single()
    
    if (error) {
      console.error('Database query failed:', error)
      return NextResponse.json({ 
        ...envCheck,
        databaseStatus: 'FAILED',
        databaseError: error.message,
        databaseErrorDetails: error
      }, { status: 500 })
    }
    
    console.log('Database query successful, count:', data?.count)
    
    // Test cv_profiles table access
    const { data: cvData, error: cvError } = await supabase
      .from('cv_profiles')
      .select('count')
      .single()
    
    if (cvError) {
      console.error('CV profiles table access failed:', cvError)
      return NextResponse.json({ 
        ...envCheck,
        databaseStatus: 'PARTIAL',
        companiesCount: data?.count || 0,
        cvProfilesError: cvError.message,
        cvProfilesErrorDetails: cvError
      }, { status: 500 })
    }
    
    console.log('CV profiles table access successful, count:', cvData?.count)
    
    console.log('=== ENVIRONMENT CHECK SUCCESS ===')
    
    return NextResponse.json({ 
      ...envCheck,
      databaseStatus: 'OK',
      companiesCount: data?.count || 0,
      cvProfilesCount: cvData?.count || 0,
      message: 'All checks passed'
    })
    
  } catch (error) {
    console.error('=== ENVIRONMENT CHECK ERROR ===', error)
    return NextResponse.json({ 
      error: 'Environment check failed', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
