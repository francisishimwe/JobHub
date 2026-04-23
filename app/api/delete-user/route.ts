import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "UserId birabanza" },
        { status: 400 }
      )
    }

    const sql = neon(process.env.DATABASE_URL!)

    await sql`
      DELETE FROM membership_users 
      WHERE id = ${userId}
    `

    return NextResponse.json({
      success: true,
      message: "Uwusibe neza!"
    })
  } catch (error) {
    console.error('Delete user error:', error)
    return NextResponse.json(
      { success: false, message: "Ikibazo gikomeye serivisi" },
      { status: 500 }
    )
  }
}
