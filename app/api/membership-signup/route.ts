import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

export async function POST(request: NextRequest) {
  try {
    console.log("=== SIGNUP REQUEST STARTED ===")
    const { fullName, phoneNumber, password } = await request.json()
    console.log("Received data:", { fullName, phoneNumber, password: "***" })

    if (!fullName || !phoneNumber || !password) {
      console.error("Validation failed: Missing required fields")
      return NextResponse.json(
        { success: false, message: "Nimero ya telefone, amazina yose noma ijambo birabanza" },
        { status: 400 }
      )
    }

    const databaseUrl = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL || process.env.DATABASE_URL_UNPOOLED
    console.log("Database URL found:", databaseUrl ? "YES" : "NO")
    
    if (!databaseUrl) {
      console.error("DATABASE_URL environment variable is not set")
      return NextResponse.json(
        { success: false, message: "Database configuration error" },
        { status: 500 }
      )
    }

    console.log("Initializing Neon SQL connection...")
    const sql = neon(databaseUrl)

    console.log("Creating membership_users table if not exists")
    // Create membership_users table if it doesn't exist with session_token column
    try {
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
      console.log("Table creation/check successful")
    } catch (tableError: any) {
      console.error("Table creation error:", tableError)
      // Continue anyway - table might already exist
    }

    console.log("Inserting new user:", { fullName, phoneNumber })
    // Create new user
    const newUser = await sql`
      INSERT INTO membership_users (full_name, phone_number, password, is_approved, status, expires_at, created_at)
      VALUES (${fullName}, ${phoneNumber}, ${password}, false, 'Pending', ${new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()}, ${new Date().toISOString()})
      RETURNING *
    `
    console.log("New user created successfully:", newUser[0])

    return NextResponse.json({
      success: true,
      message: "Kugirango wemererwe gukora ano masuzumabumenyi, urasabwa guhamagara cg kwandikira Admin kuri (+250 783 074 056) kugirango aguhe uburenganzira. Murakoze!",
      user: newUser[0]
    })
  } catch (error: any) {
    console.error("=== SIGNUP ERROR ===")
    console.error("Error details:", error)
    console.error("Error code:", error.code)
    console.error("Error message:", error.message)
    console.error("Error stack:", error.stack)
    
    // Check for unique constraint violation on phone_number
    if (error.code === '23505' || error.message?.includes('unique') || error.message?.includes('phone_number')) {
      console.log("Unique constraint violation detected")
      return NextResponse.json(
        { success: false, message: "Iyi nomero ya telefone yafashwe. Mugerageza indi nomero." },
        { status: 400 }
      )
    }
    
    console.log("Returning generic error to client")
    return NextResponse.json(
      { success: false, message: "Ikibazo gikomeye serivisi. Mugerageze mukanya." },
      { status: 500 }
    )
  }
}
