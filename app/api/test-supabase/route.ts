import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // Test connection
    const { data: jobs, error: jobsError } = await supabase
      .from('jobs')
      .select('*')
      .limit(1)

    const { data: companies, error: companiesError } = await supabase
      .from('companies')
      .select('*')
      .limit(1)

    return NextResponse.json({
      status: 'testing',
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      jobs: {
        success: !jobsError,
        error: jobsError ? {
          message: jobsError.message,
          code: jobsError.code,
          details: jobsError.details,
          hint: jobsError.hint
        } : null,
        count: jobs?.length || 0
      },
      companies: {
        success: !companiesError,
        error: companiesError ? {
          message: companiesError.message,
          code: companiesError.code,
          details: companiesError.details,
          hint: companiesError.hint
        } : null,
        count: companies?.length || 0
      }
    })
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      message: error.message || 'Unknown error',
      error: error
    }, { status: 500 })
  }
}
