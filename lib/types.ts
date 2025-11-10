export interface Company {
  id: string
  name: string
  logo: string
  createdDate: Date
}

export interface Job {
  id: string
  title: string
  companyId: string
  description: string
  location: string
  locationType: "Remote" | "On-site" | "Hybrid"
  jobType: "Full-time" | "Part-time" | "Contract" | "Freelance"
  opportunityType: "Job" | "Internship" | "Scholarship"
  experienceLevel: "Entry level" | "Intermediate" | "Expert"
  deadline?: string
  applicants: number
  postedDate: Date
  featured?: boolean
  applicationLink: string
}

export interface JobFilters {
  search: string
  location: string
  experienceLevels: string[]
  jobTypes: string[]
  opportunityTypes: string[]
}

export interface Exam {
  id: string
  title: string
  category: string
  duration: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  participants: number
  rating: number
  description: string
  topics: string[]
  postedDate: Date
  totalQuestions?: number
  totalPoints?: number
}

export interface ExamQuestion {
  id: string
  examId: string
  questionText: string
  questionType: "multiple-choice" | "true-false" | "short-answer"
  options?: string[] // For multiple choice questions
  correctAnswer: string
  explanation?: string
  points: number
  orderNumber: number
  createdAt: Date
}

export interface ExamSubmission {
  id: string
  examId: string
  userEmail: string
  score: number
  totalQuestions: number
  percentage: number
  answers: Record<string, string> // questionId -> user's answer
  submittedAt: Date
}
