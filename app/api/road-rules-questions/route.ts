import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

export async function GET(request: NextRequest) {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    // Create road_rules_questions table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS road_rules_questions (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        question_text TEXT NOT NULL,
        options TEXT[] NOT NULL,
        correct_answer TEXT NOT NULL,
        time_limit INTEGER NOT NULL DEFAULT 300,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    const questions = await sql`
      SELECT * FROM road_rules_questions 
      ORDER BY id ASC
    `

    return NextResponse.json({
      success: true,
      questions
    })
  } catch (error) {
    console.error('Fetch road rules questions error:', error)
    return NextResponse.json(
      { success: false, message: "Ikibazo gikomeye serivisi" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const sql = neon(process.env.DATABASE_URL!)
    const body = await request.json()

    const { question_text, options, correct_answer, time_limit } = body

    if (!question_text || !options || !correct_answer || !time_limit) {
      return NextResponse.json(
        { success: false, message: "Uzuza amazina yose akenewe" },
        { status: 400 }
      )
    }

    // Create table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS road_rules_questions (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        question_text TEXT NOT NULL,
        options TEXT[] NOT NULL,
        correct_answer TEXT NOT NULL,
        time_limit INTEGER NOT NULL DEFAULT 300,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    const result = await sql`
      INSERT INTO road_rules_questions (question_text, options, correct_answer, time_limit)
      VALUES (${question_text}, ${options}, ${correct_answer}, ${time_limit})
      RETURNING *
    `

    return NextResponse.json({
      success: true,
      question: result[0]
    })
  } catch (error) {
    console.error('Create road rules question error:', error)
    return NextResponse.json(
      { success: false, message: "Ikibazo gikomeye serivisi" },
      { status: 500 }
    )
  }
}
