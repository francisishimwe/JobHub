import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function GET() {
  try {
    console.log('🔄 Fixing King Faisal Hospital logo to use large OG endpoint...')

    // Update King Faisal Hospital logo to use the dynamic OG endpoint
    const result = await sql`
      UPDATE companies
      SET logo = '/api/og/king-faisal-logo'
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
      message: 'King Faisal Hospital logo updated to use large OG endpoint',
      company: result[0],
      logoUrl: 'https://www.rwandajobhub.rw/api/og/king-faisal-logo'
    })

  } catch (error) {
    console.error('❌ Error updating logo:', error)
    return NextResponse.json({ 
      error: 'Database error',
      details: error 
    }, { status: 500 })
  }
}
