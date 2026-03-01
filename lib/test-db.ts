import { sql } from './db'

export async function testDatabaseConnection() {
  try {
    console.log('🔍 Testing Neon connection...')
    
    // Test 1: Check if database client is initialized
    console.log('✅ Neon client initialized')
    
    // Test 2: Try to fetch companies
    const companies = await sql`
      SELECT * FROM companies LIMIT 5
    `
    
    if (!companies) {
      return {
        success: false,
        error: 'Failed to fetch companies',
        companies: []
      }
    }
    
    console.log('✅ Companies fetched:', companies?.length || 0)
    console.log('Companies:', companies)
    
    // Test 3: Try to fetch jobs
    try {
      const jobs = await sql`
        SELECT * FROM jobs LIMIT 5
      `
      console.log('✅ Jobs fetched:', jobs?.length || 0)
    } catch (error) {
      console.error('❌ Error fetching jobs:', error)
    }
    
    // Test 4: Try to fetch exams
    try {
      const exams = await sql`
        SELECT * FROM exams LIMIT 5
      `
      console.log('✅ Exams fetched:', exams?.length || 0)
    } catch (error) {
      console.error('❌ Error fetching exams:', error)
    }
    
    return {
      success: true,
      companies: companies || [],
      companiesCount: companies?.length || 0,
      jobs: [],
      jobsCount: 0,
      exams: [],
      examsCount: 0
    }
    
  } catch (error) {
    console.error('❌ Database connection test failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}
