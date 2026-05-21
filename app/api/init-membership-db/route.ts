import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

export async function POST(request: NextRequest) {
  try {
    const databaseUrl = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL || process.env.DATABASE_URL_UNPOOLED
    
    if (!databaseUrl) {
      return NextResponse.json(
        { success: false, message: "DATABASE_URL environment variable is not set" },
        { status: 500 }
      )
    }

    const sql = neon(databaseUrl)

    // Create membership_users table
    await sql`
      CREATE TABLE IF NOT EXISTS membership_users (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        full_name TEXT NOT NULL,
        phone_number TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        is_approved BOOLEAN DEFAULT false,
        status TEXT DEFAULT 'Pending',
        session_token TEXT,
        expires_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    return NextResponse.json({
      success: true,
      message: "Database table initialized successfully"
    })
  } catch (error: any) {
    console.error("Database initialization error:", error)
    return NextResponse.json(
      { success: false, message: "Failed to initialize database: " + error.message },
      { status: 500 }
    )
  }
}
