import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function POST() {
  try {
    const sampleExams = [
      {
        id: crypto.randomUUID(),
        title: "Bank of Kigali Entry Exam 2025",
        duration: "90 minutes",
        difficulty: "Intermediate",
        description: "Comprehensive assessment for Bank of Kigali entry-level positions covering banking operations, customer service, and financial literacy.",
        category: "Past Paper",
        institution: "Bank of Kigali",
        exam_type: "Online Test",
        pdf_url: null,
        is_active: true,
        participants: 156,
        rating: 4.2,
        total_questions: 50,
        duration_minutes: 90,
        difficulty_level: "Intermediate"
      },
      {
        id: crypto.randomUUID(),
        title: "RRA Tax Assessment Mock Test",
        duration: "120 minutes",
        difficulty: "Advanced",
        description: "Mock test for Rwanda Revenue Authority tax positions covering tax law, compliance, and assessment procedures.",
        category: "Mock Test",
        institution: "RRA",
        exam_type: "Online Test",
        pdf_url: null,
        is_active: true,
        participants: 89,
        rating: 4.5,
        total_questions: 75,
        duration_minutes: 120,
        difficulty_level: "Advanced"
      },
      {
        id: crypto.randomUUID(),
        title: "MINECOFIN Economic Analysis Practice Test",
        duration: "60 minutes",
        difficulty: "Intermediate",
        description: "Practice test for Ministry of Finance and Economic Planning positions covering economic analysis, budgeting, and policy evaluation.",
        category: "Practice Test",
        institution: "MINECOFIN",
        exam_type: "Online Test",
        pdf_url: null,
        is_active: true,
        participants: 124,
        rating: 4.1,
        total_questions: 40,
        duration_minutes: 60,
        difficulty_level: "Intermediate"
      },
      {
        id: crypto.randomUUID(),
        title: "Public Service Commission Assessment",
        duration: "180 minutes",
        difficulty: "Advanced",
        description: "Comprehensive assessment for public service positions covering governance, ethics, and administrative procedures.",
        category: "Assessment",
        institution: "Public Service Commission",
        exam_type: "Online Test",
        pdf_url: null,
        is_active: true,
        participants: 203,
        rating: 4.3,
        total_questions: 100,
        duration_minutes: 180,
        difficulty_level: "Advanced"
      },
      {
        id: crypto.randomUUID(),
        title: "RDB Tourism Industry Certification",
        duration: "45 minutes",
        difficulty: "Beginner",
        description: "Certification exam for tourism and hospitality professionals covering customer service, tourism products, and industry standards.",
        category: "Past Paper",
        institution: "RDB",
        exam_type: "Online Test",
        pdf_url: null,
        is_active: true,
        participants: 67,
        rating: 3.9,
        total_questions: 30,
        duration_minutes: 45,
        difficulty_level: "Beginner"
      },
      {
        id: crypto.randomUUID(),
        title: "Rwanda Energy Group Technical Assessment",
        duration: "150 minutes",
        difficulty: "Advanced",
        description: "Technical assessment for engineering positions at REG covering electrical systems, renewable energy, and project management.",
        category: "Mock Test",
        institution: "REG",
        exam_type: "Online Test",
        pdf_url: null,
        is_active: true,
        participants: 45,
        rating: 4.6,
        total_questions: 80,
        duration_minutes: 150,
        difficulty_level: "Advanced"
      }
    ]

    const now = new Date().toISOString()
    let insertedCount = 0

    for (const exam of sampleExams) {
      try {
        await sql`
          INSERT INTO exams (
            id,
            title,
            duration,
            difficulty,
            description,
            category,
            institution,
            exam_type,
            pdf_url,
            is_active,
            participants,
            rating,
            total_questions,
            duration_minutes,
            difficulty_level,
            created_at
          ) VALUES (
            ${exam.id},
            ${exam.title},
            ${exam.duration},
            ${exam.difficulty},
            ${exam.description},
            ${exam.category},
            ${exam.institution},
            ${exam.exam_type},
            ${exam.pdf_url},
            ${exam.is_active},
            ${exam.participants},
            ${exam.rating},
            ${exam.total_questions},
            ${exam.duration_minutes},
            ${exam.difficulty_level},
            ${now}
          )
        `
        insertedCount++
      } catch (error) {
        // Skip if exam already exists
        console.log(`Exam already exists: ${exam.title}`)
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully inserted ${insertedCount} sample exams`,
      count: insertedCount
    })
  } catch (error) {
    console.error('Error setting up sample exams:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to setup sample exams'
    }, { status: 500 })
  }
}
