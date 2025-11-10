"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { supabase } from "./supabase"
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
  loading: boolean
}

const ExamContext = createContext<ExamContextType | undefined>(undefined)

export function ExamProvider({ children }: { children: ReactNode }) {
  const [exams, setExams] = useState<Exam[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch exams from Supabase
  useEffect(() => {
    fetchExams()
  }, [])

  const fetchExams = async () => {
    try {
      const { data, error } = await supabase
        .from("exams")
        .select("*")
        .order("posted_date", { ascending: false })

      if (error) throw error

      const formattedExams: Exam[] = (data || []).map((exam) => ({
        id: exam.id,
        title: exam.title,
        category: exam.category,
        duration: exam.duration,
        difficulty: exam.difficulty,
        participants: exam.participants || 0,
        rating: exam.rating || 0,
        description: exam.description,
        topics: exam.topics || [],
        postedDate: new Date(exam.posted_date),
      }))

      setExams(formattedExams)
    } catch (error) {
      console.error("Error fetching exams:", error)
    } finally {
      setLoading(false)
    }
  }

  const addExam = async (
    examData: Omit<Exam, "id" | "postedDate" | "participants" | "rating">,
    questions: Omit<ExamQuestion, "id" | "examId" | "createdAt">[]
  ) => {
    try {
      // Insert exam
      const { data: examResult, error: examError } = await supabase
        .from("exams")
        .insert([
          {
            title: examData.title,
            category: examData.category,
            duration: examData.duration,
            difficulty: examData.difficulty,
            description: examData.description,
            topics: examData.topics,
          },
        ])
        .select()
        .single()

      if (examError) throw examError

      // Insert questions
      if (questions.length > 0) {
        const questionsToInsert = questions.map((q, index) => ({
          exam_id: examResult.id,
          question_text: q.questionText,
          question_type: q.questionType,
          options: q.options ? JSON.stringify(q.options) : null,
          correct_answer: q.correctAnswer,
          explanation: q.explanation,
          points: q.points,
          order_number: index + 1,
        }))

        const { error: questionsError } = await supabase
          .from("exam_questions")
          .insert(questionsToInsert)

        if (questionsError) throw questionsError
      }

      const newExam: Exam = {
        id: examResult.id,
        title: examResult.title,
        category: examResult.category,
        duration: examResult.duration,
        difficulty: examResult.difficulty,
        participants: examResult.participants || 0,
        rating: examResult.rating || 0,
        description: examResult.description,
        topics: examResult.topics || [],
        postedDate: new Date(examResult.posted_date),
      }

      setExams([newExam, ...exams])
    } catch (error) {
      console.error("Error adding exam:", error)
      throw error
    }
  }

  const deleteExam = async (id: string) => {
    try {
      const { error } = await supabase.from("exams").delete().eq("id", id)

      if (error) throw error

      setExams(exams.filter((exam) => exam.id !== id))
    } catch (error) {
      console.error("Error deleting exam:", error)
      throw error
    }
  }

  const updateExam = async (id: string, examData: Partial<Exam>) => {
    try {
      const updateData: any = {}
      if (examData.title !== undefined) updateData.title = examData.title
      if (examData.category !== undefined) updateData.category = examData.category
      if (examData.duration !== undefined) updateData.duration = examData.duration
      if (examData.difficulty !== undefined) updateData.difficulty = examData.difficulty
      if (examData.description !== undefined) updateData.description = examData.description
      if (examData.topics !== undefined) updateData.topics = examData.topics

      const { error } = await supabase.from("exams").update(updateData).eq("id", id)

      if (error) throw error

      setExams(exams.map((exam) => (exam.id === id ? { ...exam, ...examData } : exam)))
    } catch (error) {
      console.error("Error updating exam:", error)
      throw error
    }
  }

  const getExamQuestions = async (examId: string): Promise<ExamQuestion[]> => {
    try {
      const { data, error } = await supabase
        .from("exam_questions")
        .select("*")
        .eq("exam_id", examId)
        .order("order_number", { ascending: true })

      if (error) throw error

      return (data || []).map((q) => ({
        id: q.id,
        examId: q.exam_id,
        questionText: q.question_text,
        questionType: q.question_type,
        options: q.options ? JSON.parse(q.options) : undefined,
        correctAnswer: q.correct_answer,
        explanation: q.explanation,
        points: q.points,
        orderNumber: q.order_number,
        createdAt: new Date(q.created_at),
      }))
    } catch (error) {
      console.error("Error fetching exam questions:", error)
      return []
    }
  }

  return (
    <ExamContext.Provider
      value={{ exams, addExam, deleteExam, updateExam, getExamQuestions, loading }}
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
