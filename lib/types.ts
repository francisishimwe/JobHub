export interface Job {
  id: string;
  title: string;
  location: string;
  description?: string;
  
  // Database format (snake_case) - optional for backward compatibility
  company_id?: string | null;
  job_type?: string;
  opportunity_type?: string;
  created_at?: string;
  deadline?: string;
  status?: string;
  approved?: boolean;
  featured?: boolean;
  attachment_url?: string | null;
  location_type?: string;
  experience_level?: string;
  application_link?: string;
  applicants?: number;
  is_verified?: boolean;

  // Component format (camelCase) - mapped in your Provider
  companyId?: string | null;
  jobType?: string;
  opportunityType?: string;
  postedDate?: Date;
  applicationLink?: string;
  experienceLevel?: string;
  locationType?: string;
  attachmentUrl?: string | null;
  isVerified?: boolean;
  
  // Relational data
  company?: {
    name: string;
    logo: string;
  };
  companyLogo?: string;
}

export interface Company {
  id: string;
  name: string;
  logo?: string;
  location?: string;
  industry?: string;
  website?: string;
  createdDate?: Date;
}

export interface Exam {
  id: string;
  title: string;
  duration?: string;
  difficulty?: string;
  description?: string;
  created_at: string;
}

export interface ExamQuestion {
  id: string;
  exam_id: string;
  question_text: string;
  question_type?: string;
  options?: any;
  correct_answer?: string;
  explanation?: string;
  points?: number;
  order_number?: number;
  created_at: string;
}

// If you need the Filter type as well:
export interface JobFilters {
  search: string;
  location: string;
  opportunityTypes: string[];
}