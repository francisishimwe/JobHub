// Neon database schema types

export interface Job {
  id: string;
  title: string;
  company_id: string;
  location: string;
  description: string;
  created_at: string;
  job_type: string;
  opportunity_type: string;
  deadline?: string;
  status: string;
  approved: boolean;
  featured?: boolean;
  attachment_url?: string;
  applicants?: number;
}

export interface Company {
  id: string;
  name: string;
  logo: string;
  createdDate?: Date;
}

export interface ExamQuestion {
  id: string;
  examId: string;
  questionText: string;
  questionType: "multiple-choice" | "true-false" | "short-answer";
  options: string[];
  correctAnswer: string;
  explanation?: string;
  points: number;
  createdAt: string;
  orderNumber: number;
}