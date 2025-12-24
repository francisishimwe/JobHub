import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { withRateLimit, isValidOrigin } from '@/lib/api-middleware'

// Test endpoint to verify Supabase connection
async function handleGetTest(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Try to query the table
    const { data, error } = await supabase
      .from('email_subscribers')
      .select('count')
      .limit(1)
    
    if (error) {
      return NextResponse.json({
        status: 'error',
        message: 'Cannot connect to email_subscribers table',
      }, { status: 500 })
    }
    
    return NextResponse.json({
      status: 'success',
      message: 'Supabase connection working',
      tableExists: true
    })
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Server error'
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

    const supabase = await createClient()

    // Insert email into database
    const { data, error } = await supabase
      .from('email_subscribers')
      .insert([
        {
          email: email.toLowerCase().trim(),
          is_active: true,
        },
      ])
      .select()

    if (error) {
      // Check if email already exists
      if (error.code === '23505') {
        return NextResponse.json(
          { message: 'Email already subscribed', success: true },
          { status: 200 }
        )
      }

      console.error('Supabase error:', error.code, error.message)
      
      let errorMessage = 'Failed to save email'
      
      if (error.code === '42P01') {
        errorMessage = 'Table does not exist'
      } else if (error.code === 'PGRST301') {
        errorMessage = 'Permission denied'
      }
      
      return NextResponse.json(
        { error: errorMessage },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: 'Successfully subscribed', success: true },
      { status: 201 }
    )
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
