import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { withRateLimit, isValidOrigin } from '@/lib/api-middleware'

// Test endpoint to verify Neon connection
async function handleGetTest(request: NextRequest) {
  try {
    // Try to query the table
    const result = await sql`
      SELECT COUNT(*) as count FROM email_subscribers LIMIT 1
    `
    
    return NextResponse.json({
      status: 'success',
      message: 'Neon connection working',
      tableExists: true
    })
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Cannot connect to email_subscribers table',
    }, { status: 500 })
  }
}

async function handlePostEmail(request: NextRequest) {
  try {
    // Validate origin
    if (!isValidOrigin(request)) {
      return NextResponse.json({ error: 'Invalid origin' }, { status: 403 })
    }

    const { email } = await request.json()

    // Validate email
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    const normalizedEmail = email.toLowerCase().trim()

    // Insert email into database
    try {
      const result = await sql`
        INSERT INTO email_subscribers (email, is_active)
        VALUES (${normalizedEmail}, true)
        ON CONFLICT (email) DO NOTHING
        RETURNING *
      `

      if (result.length === 0) {
        return NextResponse.json(
          { message: 'Email already subscribed', success: true },
          { status: 200 }
        )
      }

      return NextResponse.json(
        { message: 'Successfully subscribed', success: true },
        { status: 201 }
      )
    } catch (dbError: any) {
      console.error('Database error:', dbError)
      
      let errorMessage = 'Failed to save email'
      
      if (dbError.message?.includes('email_subscribers')) {
        errorMessage = 'Table does not exist'
      }
      
      return NextResponse.json(
        { error: errorMessage },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export const GET = withRateLimit(handleGetTest, { maxRequests: 50, windowMs: 60000 })
export const POST = withRateLimit(handlePostEmail, { maxRequests: 20, windowMs: 60000 })
