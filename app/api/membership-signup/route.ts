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

    console.log("Inserting new user:", { fullName, phoneNumber })
    // Create new user - assume table already exists
    const newUser = await sql`
      INSERT INTO membership_users (full_name, phone_number, password, is_approved, status, created_at)
      VALUES (${fullName}, ${phoneNumber}, ${password}, false, 'Pending', ${new Date().toISOString()})
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
    
    // Check for unique constraint violation on phone_number
    if (error.code === '23505' || error.message?.includes('unique') || error.message?.includes('phone_number')) {
      console.log("Unique constraint violation detected")
      return NextResponse.json(
        { success: false, message: "Iyi nomero ya telefone yafashwe. Mugerageza indi nomero." },
        { status: 400 }
      )
    }
    
    // Check for table does not exist error
    if (error.code === '42P01' || error.message?.includes('relation') && error.message?.includes('does not exist')) {
      console.log("Table does not exist error")
      return NextResponse.json(
        { success: false, message: "Database table not found. Please contact administrator." },
        { status: 500 }
      )
    }
    
    console.log("Returning generic error to client")
    return NextResponse.json(
      { success: false, message: "Ikibazo gikomeye serivisi. Mugerageze mukanya." },
      { status: 500 }
    )
  }
}
