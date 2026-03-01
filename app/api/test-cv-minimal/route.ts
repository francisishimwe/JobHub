import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    console.log('=== MINIMAL CV TEST START ===')
    
    const supabase = createClient()
    console.log('Supabase client created')
    
    const testData = await request.json()
    console.log('Received test data:', testData)
    
    // Create minimal CV profile with hardcoded values
    const minimalProfile = {
      job_id: testData.jobId || '00000000-0000-0000-0000-000000000000',
      full_name: 'Test User',
      email: 'test@example.com',
      phone: '1234567890',
      field_of_study: 'Test Field',
      experience: '[]',
      skills: 'test',
      education: '[]',
      portfolio_url: null,
      linkedin_url: null,
      github_url: null,
      additional_info: '{}'
    }
    
    console.log('Attempting to insert minimal profile:', minimalProfile)
    
    const { data: insertData, error: insertError } = await supabase
      .from('cv_profiles')
      .insert(minimalProfile)
      .select()
      .single()
    
    if (insertError) {
      console.error('Minimal insert failed:', insertError)
      console.error('Insert error details:', JSON.stringify(insertError, null, 2))
      return NextResponse.json({ 
        error: 'Minimal insert failed', 
        details: insertError.message,
        errorDetails: insertError
      }, { status: 500 })
    }
    
    console.log('Minimal insert successful:', insertData)
    
    // Clean up
    await supabase
      .from('cv_profiles')
      .delete()
      .eq('id', insertData.id)
    
    console.log('=== MINIMAL CV TEST SUCCESS ===')
    
    return NextResponse.json({ 
      success: true, 
      message: 'Minimal CV test passed',
      insertedId: insertData.id
    })
    
  } catch (error) {
    console.error('=== MINIMAL CV TEST ERROR ===', error)
    return NextResponse.json({ 
      error: 'Minimal test failed', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
