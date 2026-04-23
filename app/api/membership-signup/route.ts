import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

export async function POST(request: NextRequest) {
  try {
    const { fullName, phoneNumber, password } = await request.json()

    if (!fullName || !phoneNumber || !password) {
      return NextResponse.json(
        { success: false, message: "Nimero ya telefone, amazina yose noma ijambo birabanza" },
        { status: 400 }
      )
    }

    const sql = neon(process.env.DATABASE_URL!)

    // Check if user already exists
    const existingUser = await sql`
      SELECT * FROM membership_users 
      WHERE phone_number = ${phoneNumber}
      LIMIT 1
    `

    if (existingUser.length > 0) {
      return NextResponse.json(
        { success: false, message: "Umuntu uyu nomero ya telefone wamenyekiriye. Mugerageza nomero zitandukwe." },
        { status: 400 }
      )
    }

    // Create new user
    const newUser = await sql`
      INSERT INTO membership_users (full_name, phone_number, password, is_approved, expires_at, created_at)
      VALUES (${fullName}, ${phoneNumber}, ${password}, false, ${new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()}, ${new Date().toISOString()})
      RETURNING *
    `

    return NextResponse.json({
      success: true,
      message: "Kugirango wemererwe gukora ano masuzumabumenyi, urasabwa guhamagara cg kwandikira Admin kuri (+250 783 074 056) kugirango aguhe uburenganzira. Murakoze!",
      user: newUser[0]
    })
  } catch (error) {
    console.error('Membership signup error:', error)
    return NextResponse.json(
      { success: false, message: "Ikibazo gikomeye serivisi. Mugerageze mukanya." },
      { status: 500 }
    )
  }
}
