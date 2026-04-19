import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, hasQuizAccess, accessExpiry } = body

    if (!userId) {
      return NextResponse.json({
        success: false,
        message: 'User ID is required'
      }, { status: 400 })
    }

    // Test database connection first
    await sql`SELECT 1 as test`

    // Update user's quiz access
    await sql`
      UPDATE users 
      SET 
        has_quiz_access = ${hasQuizAccess},
        quiz_access_expiry = ${accessExpiry}
      WHERE id = ${userId}
    `

    return NextResponse.json({
      success: true,
      message: `Quiz access ${hasQuizAccess ? 'granted' : 'revoked'} successfully`
    })

  } catch (error) {
    console.error('Error updating quiz access:', error)
    
    return NextResponse.json({
      success: false,
      message: 'Failed to update quiz access'
    }, { status: 500 })
  }
}
