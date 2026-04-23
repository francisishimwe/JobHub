import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

export async function POST(request: NextRequest) {
  try {
    const { userId, extensionDays } = await request.json()

    if (!userId || !extensionDays) {
      return NextResponse.json(
        { success: false, message: "UserId na iminsi zikurikizwa birabanza" },
        { status: 400 }
      )
    }

    const sql = neon(process.env.DATABASE_URL!)
    const days = parseInt(extensionDays)
    const newExpiryDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000)

    await sql`
      UPDATE membership_users 
      SET is_approved = true, expires_at = ${newExpiryDate.toISOString()}
      WHERE id = ${userId}
    `

    return NextResponse.json({
      success: true,
      message: "Ushizewe neza!"
    })
  } catch (error) {
    console.error('Approve user error:', error)
    return NextResponse.json(
      { success: false, message: "Ikibazo gikomeye serivisi" },
      { status: 500 }
    )
  }
}
