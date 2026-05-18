import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

export async function GET(request: NextRequest) {
  try {
    const connectionString = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL || process.env.POSTGRES_PRISMA_URL
    const sql = neon(connectionString!)

    // Create road_rules_questions table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS road_rules_questions (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        assessment_number INTEGER NOT NULL,
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
    const connectionString = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL || process.env.POSTGRES_PRISMA_URL
    const sql = neon(connectionString!)
    const body = await request.json()

    // Check if this is a bulk insert (array of questions) or single question
    const { assessment_number, questions, question_text, options, correct_answer, time_limit } = body

    // Create table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS road_rules_questions (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        assessment_number INTEGER NOT NULL,
        question_text TEXT NOT NULL,
        options TEXT[] NOT NULL,
        correct_answer TEXT NOT NULL,
        time_limit INTEGER NOT NULL DEFAULT 300,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Handle bulk insert
    if (questions && Array.isArray(questions) && questions.length > 0) {
      if (!assessment_number) {
        return NextResponse.json(
          { success: false, message: "Uzuza amazina yose akenewe" },
          { status: 400 }
        )
      }

      // Validate each question
      for (const q of questions) {
        if (!q.question_text || !q.options || !Array.isArray(q.options) || q.options.length !== 4 || !q.correct_answer) {
          return NextResponse.json(
            { success: false, message: "Uzuza amazina yose akenewe ku bibazo" },
            { status: 400 }
          )
        }
      }

      // Transaction: Delete existing questions for this assessment first (to avoid duplicates)
      await sql`
        DELETE FROM road_rules_questions 
        WHERE assessment_number = ${assessment_number}
      `

      // Bulk insert all questions in a transaction-like manner
      const insertPromises = questions.map(q => 
        sql`
          INSERT INTO road_rules_questions (assessment_number, question_text, options, correct_answer, time_limit)
          VALUES (${assessment_number}, ${q.question_text}, ${q.options}, ${q.correct_answer}, ${q.time_limit || 300})
          RETURNING *
        `
      )

      const results = await Promise.all(insertPromises)

      // If any insert failed, this would have thrown an error already
      // All inserts succeeded, return success
      return NextResponse.json({
        success: true,
        count: results.length,
        questions: results.flat()
      })
    }

    // Handle single question insert (backward compatibility)
    if (!assessment_number || !question_text || !options || !correct_answer || !time_limit) {
      return NextResponse.json(
        { success: false, message: "Uzuza amazina yose akenewe" },
        { status: 400 }
      )
    }

    const result = await sql`
      INSERT INTO road_rules_questions (assessment_number, question_text, options, correct_answer, time_limit)
      VALUES (${assessment_number}, ${question_text}, ${options}, ${correct_answer}, ${time_limit})
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
