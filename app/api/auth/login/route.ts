import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'
import { randomBytes } from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber, password } = await request.json()

    if (!phoneNumber || !password) {
      return NextResponse.json(
        { success: false, message: "Numero ya telefone n'ijambo ry'ibanga birabanzwa" },
        { status: 400 }
      )
    }

    if (!process.env.DATABASE_URL) {
      console.error("DATABASE_URL environment variable is not set")
      return NextResponse.json(
        { success: false, message: "Database configuration error" },
        { status: 500 }
      )
    }

    const sql = neon(process.env.DATABASE_URL)

    // Find user by phone number
    console.log("Attempting to find user with phone:", phoneNumber)
    const user = await sql`
      SELECT * FROM membership_users 
      WHERE phone_number = ${phoneNumber}
      LIMIT 1
    `
    console.log("User query result:", user)

    if (user.length === 0) {
      return NextResponse.json(
        { success: false, message: "Reba niba nimero ndetse n'ijambo banga byanditse neza. Niba nta conte ugira banza uyikore." },
        { status: 401 }
      )
    }

    const foundUser = user[0]
    console.log("Found user:", { id: foundUser.id, phone: foundUser.phone_number, isApproved: foundUser.is_approved })

    // Verify password
    if (foundUser.password !== password) {
      return NextResponse.json(
        { success: false, message: "Reba niba nimero ndetse n'ijambo banga byanditse neza. Niba nta conte ugira banza uyikore." },
        { status: 401 }
      )
    }

    // Check approval status
    console.log("Checking approval status. is_approved:", foundUser.is_approved, "Type:", typeof foundUser.is_approved)
    if (!foundUser.is_approved) {
      return NextResponse.json({
        success: true,
        isApproved: false,
        message: "Kugirango wemererwe gukora ano masuzumabumenyi, urasabwa guhamagara cg kwandikira Admin kuri (+250 783 074 056) kugirango aguhe uburenganzira. Murakoze!",
        redirectTo: "/auth/not-approved"
      })
    }

    // Generate session token
    const sessionToken = randomBytes(32).toString('hex')

    // Update user with session token
    await sql`
      UPDATE membership_users 
      SET session_token = ${sessionToken}
      WHERE id = ${foundUser.id}
    `

    // Set session cookie
    const response = NextResponse.json({
      success: true,
      isApproved: true,
      message: "Winjiye neza",
      user: foundUser
    })

    response.cookies.set('session_token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    return response
  } catch (error) {
    console.error("Backend Auth Error:", error)
    return NextResponse.json(
      { success: false, message: "Ikibazo gikomeye serivisi. Mugerageze mukanya." },
      { status: 500 }
    )
  }
}
