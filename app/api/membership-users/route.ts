import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

export async function GET(request: NextRequest) {
  try {
    const connectionString = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL || process.env.POSTGRES_PRISMA_URL
    const sql = neon(connectionString!)

    // Add quiz_access and quiz_access_expiry columns if they don't exist
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
      // Columns might already exist, ignore error
      console.log("Columns may already exist:", alterError)
    }

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
