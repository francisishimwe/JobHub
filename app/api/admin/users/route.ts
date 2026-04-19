import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    // Test database connection first
    await sql`SELECT 1 as test`
    
    // Fetch all users with their quiz access status
    const users = await sql`
      SELECT 
        id,
        email,
        name,
        role,
        created_at,
        COALESCE(has_quiz_access, false) as has_quiz_access,
        quiz_access_expiry
      FROM users 
      ORDER BY created_at DESC
    `
    
    return NextResponse.json({
      success: true,
      users: users.map(user => ({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        hasQuizAccess: user.has_quiz_access,
        quizAccessExpiry: user.quiz_access_expiry,
        created_at: user.created_at
      }))
    })
    
  } catch (error) {
    console.error('Error fetching users:', error)
    
    // Return empty array if database fails
    return NextResponse.json({
      success: false,
      users: [],
      message: 'Failed to fetch users from database'
    }, { status: 500 })
  }
}
