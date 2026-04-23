import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

export async function GET(request: NextRequest) {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    const questions = await sql`
      SELECT * FROM exam_questions 
      ORDER BY id ASC
    `

    return NextResponse.json({
      success: true,
      questions
    })
  } catch (error) {
    console.error('Fetch exam questions error:', error)
    return NextResponse.json(
      { success: false, message: "Ikibazo gikomeye serivisi" },
      { status: 500 }
    )
  }
}
