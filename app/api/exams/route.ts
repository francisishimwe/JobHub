import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.NEON_DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const examId = searchParams.get('examId')

    if (examId) {
      // Get specific exam with its questions
      const exam = await sql`
        SELECT 
          id,
          title,
          duration,
          difficulty,
          description,
          created_at
        FROM exams
        WHERE id = ${examId}
      `

      if (!exam || exam.length === 0) {
        return NextResponse.json(
          { error: 'Exam not found' },
          { status: 404 }
        )
      }

      const questions = await sql`
        SELECT 
          id,
          question_text,
          question_type,
          options,
          correct_answer,
          explanation,
          points,
          order_number
        FROM exam_questions
        WHERE exam_id = ${examId}
        ORDER BY order_number ASC
      `

      return NextResponse.json({
        exam: exam[0],
        questions: questions || []
      })
    } else {
      // Get all exams
      const exams = await sql`
        SELECT 
          id,
          title,
          duration,
          difficulty,
          description,
          created_at
        FROM exams
        ORDER BY created_at DESC
      `

      return NextResponse.json({
        exams: exams || []
      })
    }
  } catch (error) {
    console.error('Error fetching exams:', error)
    return NextResponse.json(
      { error: 'Failed to fetch exams' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.title) {
      return NextResponse.json(
        { error: 'Missing required field: title' },
        { status: 400 }
      )
    }

    const id = crypto.randomUUID()
    const now = new Date().toISOString()

    // Insert exam
    const examResult = await sql`
      INSERT INTO exams (
        id,
        title,
        duration,
        difficulty,
        description,
        created_at
      ) VALUES (
        ${id},
        ${body.title},
        ${body.duration || null},
        ${body.difficulty || null},
        ${body.description || null},
        ${now}
      )
      RETURNING id, title, duration, difficulty, description, created_at
    `

    if (!examResult || examResult.length === 0) {
      throw new Error('Failed to insert exam')
    }

    const newExam = examResult[0]
    let insertedQuestions = []

    // Insert questions if provided
    if (body.questions && Array.isArray(body.questions) && body.questions.length > 0) {
      const questionsToInsert = body.questions.map((q: any, index: number) => ({
        id: crypto.randomUUID(),
        exam_id: newExam.id,
        question_text: q.questionText,
        question_type: q.questionType,
        options: q.options ? JSON.stringify(q.options) : null,
        correct_answer: q.correctAnswer,
        explanation: q.explanation || null,
        points: q.points || 1,
        order_number: index + 1,
        created_at: now
      }))

      for (const question of questionsToInsert) {
        const result = await sql`
          INSERT INTO exam_questions (
            id,
            exam_id,
            question_text,
            question_type,
            options,
            correct_answer,
            explanation,
            points,
            order_number,
            created_at
          ) VALUES (
            ${question.id},
            ${question.exam_id},
            ${question.question_text},
            ${question.question_type},
            ${question.options},
            ${question.correct_answer},
            ${question.explanation},
            ${question.points},
            ${question.order_number},
            ${question.created_at}
          )
          RETURNING id, question_text, question_type, options, correct_answer, explanation, points, order_number
        `
        if (result && result.length > 0) {
          insertedQuestions.push(result[0])
        }
      }
    }

    return NextResponse.json({
      id: newExam.id,
      title: newExam.title,
      duration: newExam.duration,
      difficulty: newExam.difficulty,
      description: newExam.description,
      created_at: newExam.created_at,
      questions: insertedQuestions
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating exam:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create exam' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Missing required parameter: id' },
        { status: 400 }
      )
    }

    // Delete questions first
    await sql`
      DELETE FROM exam_questions
      WHERE exam_id = ${id}
    `

    // Delete exam
    await sql`
      DELETE FROM exams
      WHERE id = ${id}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting exam:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete exam' },
      { status: 500 }
    )
  }
}
