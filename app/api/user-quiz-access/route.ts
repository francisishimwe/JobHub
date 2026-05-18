import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

export async function GET(request: NextRequest) {
  try {
    const connectionString = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL || process.env.POSTGRES_PRISMA_URL
    const sql = neon(connectionString!)

    // Get phone number from query params (this would typically come from session/auth)
    const { searchParams } = new URL(request.url)
    const phoneNumber = searchParams.get('phone_number')

    if (!phoneNumber) {
      return NextResponse.json(
        { success: false, message: "Phone number is required" },
        { status: 400 }
      )
    }

    // Add quiz_access columns if they don't exist
    try {
      await sql`
        ALTER TABLE membership_users 
        ADD COLUMN IF NOT EXISTS quiz_access BOOLEAN DEFAULT FALSE
      `
      await sql`
        ALTER TABLE membership_users 
        ADD COLUMN IF NOT EXISTS quiz_access_expiry TIMESTAMP
      `
    } catch (alterError) {
      console.log("Columns may already exist:", alterError)
    }

    // Fetch user's quiz access status from database
    const users = await sql`
      SELECT id, full_name, phone_number, is_approved, expires_at, quiz_access, quiz_access_expiry, created_at
      FROM membership_users 
      WHERE phone_number = ${phoneNumber}
      ORDER BY created_at DESC
      LIMIT 1
    `

    if (users.length === 0) {
      return NextResponse.json({
        success: false,
        message: "User not found"
      })
    }

    const user = users[0]

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        full_name: user.full_name,
        phone_number: user.phone_number,
        is_approved: user.is_approved,
        expires_at: user.expires_at,
        quiz_access: user.quiz_access,
        quiz_access_expiry: user.quiz_access_expiry,
        created_at: user.created_at
      }
    })
  } catch (error) {
    console.error('Fetch user quiz access error:', error)
    return NextResponse.json(
      { success: false, message: "Ikibazo gikomeye serivisi" },
      { status: 500 }
    )
  }
}
