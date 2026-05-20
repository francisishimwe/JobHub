import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    // Get session token from cookies
    const sessionToken = request.cookies.get('session_token')?.value

    if (!sessionToken) {
      return NextResponse.json({ 
        success: false, 
        message: 'Not authenticated' 
      }, { status: 401 })
    }

    // Verify session and get user status
    const result = await sql`
      SELECT id, phone_number, status, full_name, is_approved 
      FROM membership_users 
      WHERE session_token = ${sessionToken}
      LIMIT 1
    `

    if (!result || result.length === 0) {
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid session' 
      }, { status: 401 })
    }

    const user = result[0]

    // Check if user is approved (either status is 'Yemewe' or is_approved is true)
    const isApproved = user.status === 'Yemewe' || user.is_approved === true

    return NextResponse.json({ 
      success: true, 
      status: user.status,
      isApproved: isApproved,
      user: {
        id: user.id,
        phone_number: user.phone_number,
        full_name: user.full_name
      }
    })

  } catch (error) {
    console.error('Auth check error:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Server error' 
    }, { status: 500 })
  }
}
