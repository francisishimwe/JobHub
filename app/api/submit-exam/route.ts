import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

export async function POST(request: NextRequest) {
  try {
    const { answers } = await request.json()

    if (!answers || typeof answers !== 'object') {
      return NextResponse.json(
        { success: false, message: "Ibisubizo by'ikizamini birabanza" },
        { status: 400 }
      )
    }

    const sql = neon(process.env.DATABASE_URL!)

    // Calculate results
    const results = Object.entries(answers).map(([questionId, userAnswer]) => {
      // Get question to check correct answer
      return {
        question_id: questionId,
        user_answer: userAnswer,
        is_correct: false // This would be calculated based on stored correct answers
      }
    })

    // Store exam results (in a real app, you'd fetch correct answers and compare)
    await sql`
      INSERT INTO exam_results (question_id, user_answer, is_correct, created_at)
      SELECT question_id, user_answer, is_correct, ${new Date().toISOString()}
      FROM json_populate_recordset(0, ${JSON.stringify(results)})
    `

    return NextResponse.json({
      success: true,
      message: "Byanzwe neza!",
      results
    })
  } catch (error) {
    console.error('Submit exam error:', error)
    return NextResponse.json(
      { success: false, message: "Ikibazo gikomeye serivisi" },
      { status: 500 }
    )
  }
}
