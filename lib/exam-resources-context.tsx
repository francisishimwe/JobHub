"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

interface ExamResource {
  id: string
  title: string
  category: 'WRITTEN_EXAM' | 'INTERVIEW_PREP'
  content_type: 'TEXT' | 'PDF_URL'
  text_content?: string
  file_url?: string
  institution: string
  featured: boolean
  estimated_reading_time?: number
  view_count?: number
  created_at: string
  updated_at: string
}

interface ExamResourcesContextType {
  examResources: ExamResource[]
  writtenExams: ExamResource[]
  interviewPrep: ExamResource[]
  isLoading: boolean
  error: string | null
}

const ExamResourcesContext = createContext<ExamResourcesContextType | undefined>(undefined)

export function useExamResources() {
  const context = useContext(ExamResourcesContext)
  if (context === undefined) {
    throw new Error('useExamResources must be used within an ExamResourcesProvider')
  }
  return context
}

export function ExamResourcesProvider({ children }: { children: ReactNode }) {
  const [examResources, setExamResources] = useState<ExamResource[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchExamResources()
  }, [])

  const fetchExamResources = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch('/api/exam-resources-simple')
      if (!response.ok) {
        throw new Error('Failed to fetch exam resources')
      }
      
      const data = await response.json()
      setExamResources(data.resources || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch exam resources')
      console.error('Error fetching exam resources:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Split resources by category
  const writtenExams = examResources.filter(resource => resource.category === 'WRITTEN_EXAM')
  const interviewPrep = examResources.filter(resource => resource.category === 'INTERVIEW_PREP')

  const value: ExamResourcesContextType = {
    examResources,
    writtenExams,
    interviewPrep,
    isLoading,
    error
  }

  return (
    <ExamResourcesContext.Provider value={value}>
      {children}
    </ExamResourcesContext.Provider>
  )
}
