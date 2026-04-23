import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

export async function GET(request: NextRequest) {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    const users = await sql`
      SELECT * FROM membership_users 
      ORDER BY created_at DESC
    `

    return NextResponse.json({
      success: true,
      users
    })
  } catch (error) {
    console.error('Fetch membership users error:', error)
    return NextResponse.json(
      { success: false, message: "Ikibazo gikomeye serivisi" },
      { status: 500 }
    )
  }
}
