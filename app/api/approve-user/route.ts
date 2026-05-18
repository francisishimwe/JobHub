import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

export async function POST(request: NextRequest) {
  try {
    const { userId, extensionDays, enableQuizAccess } = await request.json()

    if (!userId || !extensionDays) {
      return NextResponse.json(
        { success: false, message: "UserId na iminsi zikurikizwa birabanza" },
        { status: 400 }
      )
    }

    const connectionString = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL || process.env.POSTGRES_PRISMA_URL
    const sql = neon(connectionString!)
    const days = parseInt(extensionDays)
    const newExpiryDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000)

    // Add quiz_access columns if they don't exist
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
      console.log("Columns may already exist:", alterError)
    }

    // Update user with approval and quiz access
    const quizAccess = enableQuizAccess !== undefined ? enableQuizAccess : true
    const quizAccessExpiry = quizAccess ? newExpiryDate.toISOString() : null

    await sql`
      UPDATE membership_users 
      SET is_approved = true, 
          expires_at = ${newExpiryDate.toISOString()},
          quiz_access = ${quizAccess},
          quiz_access_expiry = ${quizAccessExpiry}
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
