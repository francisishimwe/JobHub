import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    console.log('=== SIMPLE TEST START ===')
    
    const supabase = await createClient()
    console.log('Supabase client created')
    
    // Test 1: Basic connection
    const { data: testData, error: testError } = await supabase
      .from('companies')
      .select('count')
      .single()
    
    if (testError) {
      console.error('Database connection test failed:', testError)
      return NextResponse.json({ 
        error: 'Database connection failed', 
        details: testError.message 
      }, { status: 500 })
    }
    
    console.log('Database connection OK, companies count:', testData?.count)
    
    // Test 2: Simple insert into cv_profiles
    const testProfile = {
      job_id: '00000000-0000-0000-0000-000000000000', // dummy UUID
      full_name: 'Test User',
      email: 'test@example.com',
      phone: '1234567890',
      field_of_study: 'Test',
      experience: '[]',
      skills: 'test',
      education: '[]',
      portfolio_url: null,
      linkedin_url: null,
      github_url: null,
      additional_info: '{}'
    }
    
    console.log('Attempting to insert test profile:', testProfile)
    
    const { data: insertData, error: insertError } = await supabase
      .from('cv_profiles')
      .insert(testProfile)
      .select()
      .single()
    
    if (insertError) {
      console.error('Insert test failed:', insertError)
      return NextResponse.json({ 
        error: 'Insert failed', 
        details: insertError.message 
      }, { status: 500 })
    }
    
    console.log('Insert successful:', insertData)
    
    // Clean up the test record
    await supabase
      .from('cv_profiles')
      .delete()
      .eq('id', insertData.id)
    
    console.log('=== SIMPLE TEST SUCCESS ===')
    
    return NextResponse.json({ 
      success: true, 
      message: 'All tests passed',
      databaseConnection: 'OK',
      insertTest: 'OK'
    })
    
  } catch (error) {
    console.error('=== SIMPLE TEST ERROR ===', error)
    return NextResponse.json({ 
      error: 'Test failed', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
