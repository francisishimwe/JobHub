import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const testData = await request.json()
    
    console.log('Test CV API - Received data:', testData)
    
    // Test basic database connection
    const { data, error } = await supabase
      .from('cv_profiles')
      .select('count')
      .single()
    
    if (error) {
      console.error('Test CV API - Database connection error:', error)
      return NextResponse.json({ 
        error: 'Database connection failed', 
        details: error.message 
      }, { status: 500 })
    }
    
    console.log('Test CV API - Database connection successful')
    
    return NextResponse.json({ 
      success: true, 
      message: 'Test API working',
      count: data?.count || 0
    })
    
  } catch (error) {
    console.error('Test CV API - General error:', error)
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
