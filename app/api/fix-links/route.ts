import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function POST() {
  try {
    // Update the button links to point to the correct URLs
    await sql`
      UPDATE resources 
      SET button_link = '/resources' 
      WHERE button_link = '/resources/interview'
    `

    await sql`
      UPDATE resources 
      SET button_link = '/exams' 
      WHERE button_link = '/resources/qa'
    `

    // Also update button text to be more accurate
    await sql`
      UPDATE resources 
      SET button_text = 'Start Interview Prep' 
      WHERE button_text = 'Start Prep'
    `

    await sql`
      UPDATE resources 
      SET button_text = 'View Exams' 
      WHERE button_text = 'Browse Q&A'
    `

    return NextResponse.json({ 
      success: true, 
      message: 'Fixed button links to point to correct pages'
    })
  } catch (error) {
    console.error('Error fixing links:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to fix links'
    }, { status: 500 })
  }
}
