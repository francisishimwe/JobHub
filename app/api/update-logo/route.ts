import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { companyName, newLogoUrl } = body

    if (!companyName || !newLogoUrl) {
      return NextResponse.json({ 
        error: 'Missing companyName or newLogoUrl' 
      }, { status: 400 })
    }

    console.log('🔄 Updating logo:', { companyName, newLogoUrl })

    // Update company logo in database
    const result = await sql`
      UPDATE companies
      SET logo = ${newLogoUrl}
      WHERE name = ${companyName}
      RETURNING id, name, logo
    `

    console.log('✅ Database update result:', result)

    if (result.length === 0) {
      return NextResponse.json({ 
        error: 'Company not found' 
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: 'Logo updated successfully',
      company: result[0]
    })

  } catch (error) {
    console.error('❌ Error updating logo:', error)
    return NextResponse.json({ 
      error: 'Database error',
      details: error 
    }, { status: 500 })
  }
}
