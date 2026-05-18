import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

export async function GET(request: NextRequest) {
  try {
    const connectionString = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL || process.env.POSTGRES_PRISMA_URL
    const sql = neon(connectionString!)

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
    console.error('Error details:', JSON.stringify(error, null, 2))
    return NextResponse.json(
      { success: false, message: "Ikibazo gikomeye serivisi" },
      { status: 500 }
    )
  }
}
