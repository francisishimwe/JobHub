import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Create client only if env vars are available
const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Test endpoint to verify Supabase connection
export async function GET() {
  if (!supabase) {
    return NextResponse.json({
      status: 'error',
      message: 'Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.'
    }, { status: 500 })
  }

  try {
    // Try to query the table
    const { data, error } = await supabase
      .from('email_subscribers')
      .select('count')
      .limit(1)
    
    if (error) {
      return NextResponse.json({
        status: 'error',
        message: 'Cannot connect to email_subscribers table',
        error: error.message,
        code: error.code,
        hint: error.hint
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
      message: 'Server error',
      error: String(error)
    }, { status: 500 })
  }
}

export async function POST(request: Request) {
  if (!supabase) {
    return NextResponse.json({
      error: 'Supabase is not configured. Please set environment variables.'
    }, { status: 500 })
  }

  try {
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

    // Insert email into database
    // Note: Supabase auto-generates subscribed_at with DEFAULT NOW()
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

      // Log detailed error information
      console.error('Supabase error details:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
        fullError: error
      })
      
      // Return more specific error message
      let errorMessage = error.message || 'Failed to save email'
      
      // Common error messages and fixes
      if (error.code === '42P01') {
        errorMessage = 'Table email_subscribers does not exist. Please run the SQL setup script.'
      } else if (error.code === 'PGRST301') {
        errorMessage = 'Permission denied. Check RLS policies on email_subscribers table.'
      } else if (error.message?.includes('JWT')) {
        errorMessage = 'Authentication error. Check your Supabase keys.'
      }
      
      return NextResponse.json(
        { 
          error: errorMessage,
          details: error.message,
          code: error.code,
          hint: error.hint
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: 'Successfully subscribed', success: true, data },
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
