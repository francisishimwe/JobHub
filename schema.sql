-- JobHub Database Schema for Neon PostgreSQL
-- Run this SQL to initialize your database tables

-- Create companies table
CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  logo TEXT,
  location VARCHAR(255),
  industry VARCHAR(255),
  website VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  company_logo TEXT,
  location VARCHAR(255),
  location_type VARCHAR(100),
  job_type VARCHAR(100),
  opportunity_type VARCHAR(100) NOT NULL,
  experience_level VARCHAR(100),
  deadline DATE,
  featured BOOLEAN DEFAULT false,
  description TEXT,
  attachment_url TEXT,
  application_link TEXT,
  status VARCHAR(50) DEFAULT 'published' CHECK (status IN ('published', 'draft', 'closed', 'pending')),
  approved BOOLEAN DEFAULT true,
  applicants INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create exams table
CREATE TABLE IF NOT EXISTS exams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  duration VARCHAR(50),
  difficulty VARCHAR(50),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create exam_questions table
CREATE TABLE IF NOT EXISTS exam_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type VARCHAR(50),
  options JSONB,
  correct_answer VARCHAR(255),
  explanation TEXT,
  points INTEGER DEFAULT 1,
  order_number INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create exam_submissions table
CREATE TABLE IF NOT EXISTS exam_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  user_email VARCHAR(255) DEFAULT 'anonymous@user.com',
  score INTEGER DEFAULT 0,
  total_questions INTEGER DEFAULT 0,
  percentage INTEGER DEFAULT 0,
  answers JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create email_subscribers table
CREATE TABLE IF NOT EXISTS email_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create page_views table
CREATE TABLE IF NOT EXISTS page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_url TEXT NOT NULL,
  visitor_id VARCHAR(255) NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  country VARCHAR(100),
  device_type VARCHAR(50),
  browser VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create visitors table
CREATE TABLE IF NOT EXISTS visitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id VARCHAR(255) NOT NULL UNIQUE,
  country VARCHAR(100),
  device_type VARCHAR(50),
  browser VARCHAR(100),
  first_visit TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_visit TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  visit_count INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create cv_profiles table for CV Builder
CREATE TABLE IF NOT EXISTS cv_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  field_of_study VARCHAR(255),
  experience TEXT,
  skills TEXT,
  education TEXT,
  portfolio_url TEXT,
  linkedin_url TEXT,
  github_url TEXT,
  additional_info TEXT,
  is_shortlisted BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create job_applications table to track applications
CREATE TABLE IF NOT EXISTS job_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  cv_profile_id UUID NOT NULL REFERENCES cv_profiles(id) ON DELETE CASCADE,
  application_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(50) DEFAULT 'applied' CHECK (status IN ('applied', 'shortlisted', 'rejected', 'hired')),
  match_score INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_jobs_company_id ON jobs(company_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status_approved ON jobs(status, approved) WHERE status = 'published' AND approved = true;
CREATE INDEX IF NOT EXISTS idx_jobs_plan_id ON jobs(plan_id);
CREATE INDEX IF NOT EXISTS idx_exam_questions_exam_id ON exam_questions(exam_id);
CREATE INDEX IF NOT EXISTS idx_exam_submissions_exam_id ON exam_submissions(exam_id);
CREATE INDEX IF NOT EXISTS idx_exam_submissions_email ON exam_submissions(user_email);
CREATE INDEX IF NOT EXISTS idx_email_subscribers_email ON email_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_page_views_visitor_id ON page_views(visitor_id);
CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON page_views(created_at);
CREATE INDEX IF NOT EXISTS idx_visitors_visitor_id ON visitors(visitor_id);
CREATE INDEX IF NOT EXISTS idx_cv_profiles_job_id ON cv_profiles(job_id);
CREATE INDEX IF NOT EXISTS idx_cv_profiles_field_of_study ON cv_profiles(field_of_study);
CREATE INDEX IF NOT EXISTS idx_job_applications_job_id ON job_applications(job_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_cv_profile_id ON job_applications(cv_profile_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_status ON job_applications(status);
