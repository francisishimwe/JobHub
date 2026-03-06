import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function GET() {
  try {
    console.log('🔄 Fixing King Faisal Hospital logo...')

    // Update King Faisal Hospital logo in database
    const result = await sql`
      UPDATE companies
      SET logo = '/logos/king-faisal-hospital-logo.png'
      WHERE name = 'King Faisal Hospital Rwanda Foundation (KFHRF)'
      RETURNING id, name, logo
    `

    console.log('✅ Database update result:', result)

    if (result.length === 0) {
      return NextResponse.json({ 
        error: 'King Faisal Hospital not found' 
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: 'King Faisal Hospital logo updated successfully',
      company: result[0],
      logoUrl: 'https://www.rwandajobhub.rw/logos/king-faisal-hospital-logo.png'
    })

  } catch (error) {
    console.error('❌ Error updating logo:', error)
    return NextResponse.json({ 
      error: 'Database error',
      details: error 
    }, { status: 500 })
  }
}
