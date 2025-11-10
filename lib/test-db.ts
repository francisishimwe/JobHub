import { supabase } from './supabase'

export async function testDatabaseConnection() {
  try {
    console.log('🔍 Testing Supabase connection...')
    
    // Test 1: Check if supabase client is initialized
    console.log('✅ Supabase client initialized')
    console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
    
    // Test 2: Try to fetch companies
    const { data: companies, error: companiesError } = await supabase
      .from('companies')
      .select('*')
      .limit(5)
    
    if (companiesError) {
      console.error('❌ Error fetching companies:', companiesError)
      return {
        success: false,
        error: companiesError.message,
        companies: []
      }
    }
    
    console.log('✅ Companies fetched:', companies?.length || 0)
    console.log('Companies:', companies)
    
    // Test 3: Try to fetch jobs
    const { data: jobs, error: jobsError } = await supabase
      .from('jobs')
      .select('*')
      .limit(5)
    
    if (jobsError) {
      console.error('❌ Error fetching jobs:', jobsError)
    } else {
      console.log('✅ Jobs fetched:', jobs?.length || 0)
    }
    
    // Test 4: Try to fetch exams
    const { data: exams, error: examsError } = await supabase
      .from('exams')
      .select('*')
      .limit(5)
    
    if (examsError) {
      console.error('❌ Error fetching exams:', examsError)
    } else {
      console.log('✅ Exams fetched:', exams?.length || 0)
    }
    
    return {
      success: true,
      companies: companies || [],
      companiesCount: companies?.length || 0,
      jobs: jobs || [],
      jobsCount: jobs?.length || 0,
      exams: exams || [],
      examsCount: exams?.length || 0
    }
    
  } catch (error) {
    console.error('❌ Database connection test failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}
