"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { Exam, ExamQuestion } from "./types"

interface ExamContextType {
  exams: Exam[]
  addExam: (
    exam: Omit<Exam, "id" | "postedDate" | "participants" | "rating">,
    questions: Omit<ExamQuestion, "id" | "examId" | "createdAt">[]
  ) => Promise<void>
  deleteExam: (id: string) => Promise<void>
  updateExam: (id: string, exam: Partial<Exam>) => Promise<void>
  getExamQuestions: (examId: string) => Promise<ExamQuestion[]>
}

const ExamContext = createContext<ExamContextType | undefined>(undefined)

export function ExamProvider({ children }: { children: ReactNode }) {
  const [exams, setExams] = useState<Exam[]>([])

  // Fetch exams from API
  useEffect(() => {
    fetchExams()
  }, [])

  const fetchExams = async () => {
    try {
      const response = await fetch('/api/exams-emergency')
      
      if (!response.ok) {
        throw new Error('Failed to fetch exams')
      }

      const data = await response.json()

      const formattedExams: Exam[] = (data.exams || []).map((exam: any) => ({
        id: exam.id,
        title: exam.title,
        duration: exam.duration,
        difficulty: exam.difficulty,
        description: exam.description,
        postedDate: new Date(exam.created_at),
        participants: exam.participants || 0,
        rating: exam.rating || 0,
        category: exam.category || 'General',
        institution: exam.institution || 'RwandaJobHub',
        exam_type: exam.exam_type || 'Online Test',
        pdf_url: exam.pdf_url,
        is_active: exam.is_active !== undefined ? exam.is_active : true,
        total_questions: exam.total_questions || 0,
        duration_minutes: exam.duration_minutes,
        difficulty_level: exam.difficulty_level || 'Intermediate',
        topics: [],
      }))

      setExams(formattedExams)
    } catch (error) {
      console.error("Error fetching exams:", error)
    }
  }

  const addExam = async (
    examData: Omit<Exam, "id" | "postedDate" | "participants" | "rating">,
    questions: Omit<ExamQuestion, "id" | "examId" | "createdAt">[]
  ) => {
    try {
      const response = await fetch('/api/exams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: examData.title,
          duration: examData.duration,
          difficulty: examData.difficulty,
          description: examData.description,
          questions: questions.map(q => ({
            question_text: q.question_text,
            question_type: q.question_type,
            options: q.options,
            correct_answer: q.correct_answer,
            explanation: q.explanation,
            points: q.points,
          })),
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to add exam')
      }

      const examResult = await response.json()

      const newExam: Exam = {
        id: examResult.id,
        title: examResult.title,
        duration: examResult.duration,
        difficulty: examResult.difficulty,
        description: examResult.description,
        created_at: examResult.created_at,
        postedDate: new Date(examResult.created_at),
        participants: examResult.participants || 0,
        rating: examResult.rating || 0,
        category: examResult.category || 'General',
        institution: examResult.institution || 'RwandaJobHub',
        exam_type: examResult.exam_type || 'Online Test',
        pdf_url: examResult.pdf_url,
        is_active: examResult.is_active !== undefined ? examResult.is_active : true,
        total_questions: examResult.total_questions || 0,
        duration_minutes: examResult.duration_minutes,
        difficulty_level: examResult.difficulty_level || 'Intermediate',
        topics: [],
      }

      setExams([newExam, ...exams])
    } catch (error) {
      console.error("Error adding exam:", error)
      throw error
    }
  }

  const deleteExam = async (id: string) => {
    try {
      const response = await fetch(`/api/exams?id=${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete exam')
      }

      setExams(exams.filter((exam) => exam.id !== id))
    } catch (error) {
      console.error("Error deleting exam:", error)
      throw error
    }
  }

  const updateExam = async (id: string, examData: Partial<Exam>) => {
    try {
      // Note: PUT endpoint not implemented yet for exams
      // For now, just update local state
      setExams(exams.map((exam) => (exam.id === id ? { ...exam, ...examData } : exam)))
    } catch (error) {
      console.error("Error updating exam:", error)
      throw error
    }
  }

  const getExamQuestions = async (examId: string): Promise<ExamQuestion[]> => {
    try {
      const response = await fetch(`/api/exams?examId=${examId}`)

      if (!response.ok) {
        throw new Error('Failed to fetch exam questions')
      }

      const data = await response.json()

      return (data.questions || []).map((q: any) => ({
        id: q.id,
        examId: examId,
        questionText: q.question_text,
        questionType: q.question_type,
        options: q.options ? JSON.parse(q.options) : [],
        correctAnswer: q.correct_answer,
        explanation: q.explanation,
        points: q.points,
        orderNumber: q.order_number,
        createdAt: new Date(),
      }))
    } catch (error) {
      console.error("Error fetching exam questions:", error)
      return []
    }
  }

  return (
    <ExamContext.Provider
      value={{ exams, addExam, deleteExam, updateExam, getExamQuestions }}
    >
      {children}
    </ExamContext.Provider>
  )
}

export function useExams() {
  const context = useContext(ExamContext)
  if (context === undefined) {
    throw new Error("useExams must be used within an ExamProvider")
  }
  return context
}
