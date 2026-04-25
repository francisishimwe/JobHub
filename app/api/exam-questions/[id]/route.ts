import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const sql = neon(process.env.DATABASE_URL!)
    const body = await request.json()
    const { id } = params

    const { question_text, options, correct_answer, time_limit } = body

    if (!question_text || !options || !correct_answer || !time_limit) {
      return NextResponse.json(
        { success: false, message: "Uzuza amazina yose akenewe" },
        { status: 400 }
      )
    }

    const result = await sql`
      UPDATE exam_questions 
      SET question_text = ${question_text}, 
          options = ${options}, 
          correct_answer = ${correct_answer}, 
          time_limit = ${time_limit}
      WHERE id = ${id}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json(
        { success: false, message: "Ibibazo bitabonetse" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      question: result[0]
    })
  } catch (error) {
    console.error('Update exam question error:', error)
    return NextResponse.json(
      { success: false, message: "Ikibazo gikomeye serivisi" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const sql = neon(process.env.DATABASE_URL!)
    const { id } = params

    const result = await sql`
      DELETE FROM exam_questions 
      WHERE id = ${id}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json(
        { success: false, message: "Ibibazo bitabonetse" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Ibibazo byasibwe neza"
    })
  } catch (error) {
    console.error('Delete exam question error:', error)
    return NextResponse.json(
      { success: false, message: "Ikibazo gikomeye serivisi" },
      { status: 500 }
    )
  }
}
