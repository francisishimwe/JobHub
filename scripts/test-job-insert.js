/**
 * Test script to insert a minimal job with only required fields
 * Run with: node scripts/test-job-insert.js
 */

const { createClient } = require('@supabase/supabase-js')

// You'll need to add your Supabase credentials here
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'YOUR_SUPABASE_URL'
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function testMinimalJobInsert() {
  console.log('Testing minimal job insert with required fields...\n')

  // Test 1: Title, description, location, and opportunity_type (minimum required)
  console.log('Test 1: Inserting job with all required fields')
  const test1 = {
    title: 'Test Job - Minimal Required Fields',
    description: 'This is a test job description to verify the database schema.',
    location: 'Remote',
    opportunity_type: 'Job'
  }
  
  console.log('Data:', JSON.stringify(test1, null, 2))
  
  const { data: data1, error: error1 } = await supabase
    .from('jobs')
    .insert([test1])
    .select()

  if (error1) {
    console.error('❌ Test 1 FAILED')
    console.error('Error:', JSON.stringify(error1, null, 2))
  } else {
    console.log('✅ Test 1 PASSED')
    console.log('Inserted data:', JSON.stringify(data1, null, 2))
  }

  console.log('\n---\n')

  // Test 2: All fields with proper values
  console.log('Test 2: Inserting job with all optional fields as null')
  const test2 = {
    title: 'Test Job - All Fields',
    description: 'Complete test job with all optional fields set to null.',
    location: 'Kigali, Rwanda',
    company_id: null,
    location_type: null,
    job_type: null,
    opportunity_type: 'Job',
    experience_level: null,
    deadline: null,
    featured: false,
    application_link: null,
  }
  
  console.log('Data:', JSON.stringify(test2, null, 2))
  
  const { data: data2, error: error2 } = await supabase
    .from('jobs')
    .insert([test2])
    .select()

  if (error2) {
    console.error('❌ Test 2 FAILED')
    console.error('Error:', JSON.stringify(error2, null, 2))
  } else {
    console.log('✅ Test 2 PASSED')
    console.log('Inserted data:', JSON.stringify(data2, null, 2))
  }

  console.log('\n---\n')

  // Test 3: Check what fields are actually required by the database
  console.log('Test 3: Checking database schema for jobs table')
  
  const { data: columns, error: schemaError } = await supabase
    .rpc('get_table_columns', { table_name: 'jobs' })
    .select()

  if (schemaError) {
    console.log('⚠️  Could not fetch schema (RPC function may not exist)')
    console.log('Trying alternative method...')
    
    // Try to get a sample row to see structure
    const { data: sample, error: sampleError } = await supabase
      .from('jobs')
      .select('*')
      .limit(1)
    
    if (sampleError) {
      console.error('Error:', sampleError)
    } else if (sample && sample.length > 0) {
      console.log('Sample job structure:')
      console.log(Object.keys(sample[0]).join(', '))
    } else {
      console.log('No existing jobs to sample from')
    }
  } else {
    console.log('Table columns:', columns)
  }
}

// Run the tests
testMinimalJobInsert()
  .then(() => {
    console.log('\n✅ All tests completed')
    process.exit(0)
  })
  .catch((err) => {
    console.error('\n❌ Unexpected error:', err)
    process.exit(1)
  })
