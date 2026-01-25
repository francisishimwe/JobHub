import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.exam_id) {
      return NextResponse.json(
        { error: 'Missing required field: exam_id' },
        { status: 400 }
      )
    }

    const id = crypto.randomUUID()
    const now = new Date().toISOString()

    // Insert submission
    const result = await sql`
      INSERT INTO exam_submissions (
        id,
        exam_id,
        user_email,
        score,
        total_questions,
        percentage,
        answers,
        created_at
      ) VALUES (
        ${id},
        ${body.exam_id},
        ${body.user_email || 'anonymous@user.com'},
        ${body.score || 0},
        ${body.total_questions || 0},
        ${body.percentage || 0},
        ${JSON.stringify(body.answers) || '{}'},
        ${now}
      )
      RETURNING id, exam_id, user_email, score, total_questions, percentage, created_at
    `

    if (!result || result.length === 0) {
      throw new Error('Failed to insert submission')
    }

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error('Error saving exam submission:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to save submission' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const examId = searchParams.get('examId')
    const email = searchParams.get('email')

    if (examId) {
      // Get submissions for a specific exam
      const query = email
        ? `SELECT * FROM exam_submissions WHERE exam_id = ${examId} AND user_email = ${email} ORDER BY created_at DESC`
        : `SELECT * FROM exam_submissions WHERE exam_id = ${examId} ORDER BY created_at DESC`

      const submissions = await sql(query)
      return NextResponse.json({ submissions })
    } else if (email) {
      // Get all submissions for a user
      const submissions = await sql`
        SELECT * FROM exam_submissions WHERE user_email = ${email} ORDER BY created_at DESC
      `
      return NextResponse.json({ submissions })
    } else {
      return NextResponse.json(
        { error: 'Please provide examId or email parameter' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Error fetching exam submissions:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch submissions' },
      { status: 500 }
    )
  }
}
