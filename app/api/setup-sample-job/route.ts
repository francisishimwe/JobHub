import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function POST() {
  try {
    console.log('Creating sample job and company for testing...')
    
    // Create a sample company first
    const companyResult = await sql`
      INSERT INTO companies (id, name, location, industry, website)
      VALUES (
        gen_random_uuid(),
        'Tech Solutions Rwanda',
        'Kigali, Rwanda',
        'Technology',
        'https://techsolutions.rw'
      )
      RETURNING id
    `
    
    const companyId = companyResult[0].id
    
    // Create a sample job
    const jobResult = await sql`
      INSERT INTO jobs (
        id, 
        title, 
        company_id, 
        location, 
        location_type, 
        job_type, 
        opportunity_type, 
        experience_level, 
        deadline, 
        description, 
        status, 
        approved
      ) VALUES (
        gen_random_uuid(),
        'Full Stack Developer',
        ${companyId},
        'Kigali, Rwanda',
        'On-site',
        'Full-time',
        'Job',
        'Mid-level (3-5 years)',
        '2024-12-31',
        'We are looking for a talented Full Stack Developer to join our team. You will work on modern web applications using React, Node.js, and PostgreSQL.',
        'published',
        true
      )
      RETURNING id, title
    `
    
    console.log('Sample job created:', jobResult[0])
    
    return NextResponse.json({
      success: true,
      message: 'Sample job created successfully',
      job: jobResult[0],
      company: {
        id: companyId,
        name: 'Tech Solutions Rwanda'
      }
    })
    
  } catch (error) {
    console.error('Error creating sample job:', error)
    return NextResponse.json(
      { 
        error: 'Failed to create sample job', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}
