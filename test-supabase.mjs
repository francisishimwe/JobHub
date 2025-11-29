// Test script to verify Supabase job insertion
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ususiljxhkrjvzfcixcr.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzdXNpbGp4aGtyanZ6ZmNpeGNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI2ODA4MTgsImV4cCI6MjA3ODI1NjgxOH0.7t-jgiRi4HF19y2WIiXcYDwRwyOll1Wd0Og2OgjhN5A'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testSupabase() {
  console.log('🔍 Testing Supabase connection...\n')

  // Test 1: Fetch companies
  console.log('1️⃣ Testing: Fetch companies')
  const { data: companies, error: companiesError } = await supabase
    .from('companies')
    .select('*')
    .limit(5)

  if (companiesError) {
    console.error('❌ Error fetching companies:', {
      message: companiesError.message,
      details: companiesError.details,
      hint: companiesError.hint,
      code: companiesError.code
    })
  } else {
    console.log('✅ Successfully fetched', companies?.length || 0, 'companies')
    if (companies && companies.length > 0) {
      console.log('   First company:', companies[0].name, '(' + companies[0].id + ')')
    }
  }

  // Test 2: Try to add a test company
  console.log('\n2️⃣ Testing: Add a test company')
  const { data: newCompany, error: addCompanyError } = await supabase
    .from('companies')
    .insert([{
      name: 'Test Company ' + Date.now(),
      logo: 'https://via.placeholder.com/150'
    }])
    .select()
    .single()

  if (addCompanyError) {
    console.error('❌ Error adding company:', {
      message: addCompanyError.message,
      details: addCompanyError.details,
      hint: addCompanyError.hint,
      code: addCompanyError.code
    })
  } else {
    console.log('✅ Successfully added test company:', newCompany.name, '(' + newCompany.id + ')')

    // Test 3: Try to add a test job
    console.log('\n3️⃣ Testing: Add a test job')
    const { data: newJob, error: addJobError } = await supabase
      .from('jobs')
      .insert([{
        title: 'Test Job ' + Date.now(),
        company_id: newCompany.id,
        description: 'This is a test description',
        location: 'Kigali, Rwanda',
        location_type: 'Remote',
        job_type: 'Full-time',
        opportunity_type: 'Job',
        experience_level: 'Intermediate',
        deadline: null,
        featured: false,
        application_link: 'https://example.com/apply'
      }])
      .select()
      .single()

    if (addJobError) {
      console.error('❌ Error adding job:', {
        message: addJobError.message,
        details: addJobError.details,
        hint: addJobError.hint,
        code: addJobError.code
      })
    } else {
      console.log('✅ Successfully added test job:', newJob.title, '(' + newJob.id + ')')

      // Clean up: Delete test job
      console.log('\n4️⃣ Cleaning up: Deleting test job')
      const { error: deleteJobError } = await supabase
        .from('jobs')
        .delete()
        .eq('id', newJob.id)

      if (deleteJobError) {
        console.error('❌ Error deleting test job:', deleteJobError.message)
      } else {
        console.log('✅ Successfully deleted test job')
      }
    }

    // Clean up: Delete test company
    console.log('\n5️⃣ Cleaning up: Deleting test company')
    const { error: deleteCompanyError } = await supabase
      .from('companies')
      .delete()
      .eq('id', newCompany.id)

    if (deleteCompanyError) {
      console.error('❌ Error deleting test company:', deleteCompanyError.message)
    } else {
      console.log('✅ Successfully deleted test company')
    }
  }

  console.log('\n✨ Test complete!\n')
}

testSupabase().catch(console.error)
