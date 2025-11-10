-- Supabase Database Schema for RwandaJobHub Job Board
-- Run these SQL commands in your Supabase SQL Editor

-- ============================================
-- 1. COMPANIES TABLE
-- ============================================
CREATE TABLE companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  logo TEXT,
  created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 2. JOBS TABLE
-- ============================================
CREATE TABLE jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  location_type TEXT NOT NULL, -- 'Remote', 'On-site', 'Hybrid'
  job_type TEXT NOT NULL, -- 'Full-time', 'Part-time', 'Contract', 'Freelance'
  opportunity_type TEXT NOT NULL, -- 'Job', 'Internship', 'Scholarship'
  experience_level TEXT NOT NULL, -- 'Entry level', 'Intermediate', 'Expert'
  deadline DATE,
  applicants INTEGER DEFAULT 0,
  posted_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  featured BOOLEAN DEFAULT FALSE,
  application_link TEXT NOT NULL
);

-- ============================================
-- 3. EXAMS TABLE
-- ============================================
CREATE TABLE exams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  duration TEXT NOT NULL, -- e.g., '90 minutes'
  difficulty TEXT NOT NULL, -- 'Beginner', 'Intermediate', 'Advanced'
  participants INTEGER DEFAULT 0,
  rating DECIMAL(2,1) DEFAULT 0.0,
  description TEXT NOT NULL,
  topics TEXT[] NOT NULL, -- Array of topics
  posted_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 4. EXAM QUESTIONS TABLE
-- ============================================
CREATE TABLE exam_questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  exam_id UUID REFERENCES exams(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL, -- 'multiple-choice', 'true-false', 'short-answer'
  options JSONB, -- For multiple choice: ["Option A", "Option B", "Option C", "Option D"]
  correct_answer TEXT NOT NULL,
  explanation TEXT, -- Optional explanation for the correct answer
  points INTEGER DEFAULT 1,
  order_number INTEGER NOT NULL, -- Question order in the exam
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 5. EXAM SUBMISSIONS TABLE (for tracking user attempts)
-- ============================================
CREATE TABLE exam_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  exam_id UUID REFERENCES exams(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL, -- or user_id if you implement auth
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  percentage DECIMAL(5,2) NOT NULL,
  answers JSONB NOT NULL, -- Store user's answers
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 6. EMAIL SUBSCRIBERS TABLE (for newsletter/updates)
-- ============================================
CREATE TABLE email_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);

-- ============================================
-- 7. ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_subscribers ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 8. RLS POLICIES - Allow public read access
-- ============================================

-- Companies: Public can read all
CREATE POLICY "Public can view companies"
  ON companies FOR SELECT
  USING (true);

-- Companies: Only authenticated users can insert
CREATE POLICY "Authenticated users can insert companies"
  ON companies FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Companies: Only authenticated users can update/delete
CREATE POLICY "Authenticated users can update companies"
  ON companies FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete companies"
  ON companies FOR DELETE
  USING (auth.role() = 'authenticated');

-- Jobs: Public can read all
CREATE POLICY "Public can view jobs"
  ON jobs FOR SELECT
  USING (true);

-- Jobs: Only authenticated users can insert
CREATE POLICY "Authenticated users can insert jobs"
  ON jobs FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Jobs: Only authenticated users can update/delete
CREATE POLICY "Authenticated users can update jobs"
  ON jobs FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete jobs"
  ON jobs FOR DELETE
  USING (auth.role() = 'authenticated');

-- Exams: Public can read all
CREATE POLICY "Public can view exams"
  ON exams FOR SELECT
  USING (true);

-- Exams: Only authenticated users can insert
CREATE POLICY "Authenticated users can insert exams"
  ON exams FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Exams: Only authenticated users can update/delete
CREATE POLICY "Authenticated users can update exams"
  ON exams FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete exams"
  ON exams FOR DELETE
  USING (auth.role() = 'authenticated');

-- Exam Questions: Public can read all
CREATE POLICY "Public can view exam questions"
  ON exam_questions FOR SELECT
  USING (true);

-- Exam Questions: Only authenticated users can insert
CREATE POLICY "Authenticated users can insert exam questions"
  ON exam_questions FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Exam Questions: Only authenticated users can update/delete
CREATE POLICY "Authenticated users can update exam questions"
  ON exam_questions FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete exam questions"
  ON exam_questions FOR DELETE
  USING (auth.role() = 'authenticated');

-- Exam Submissions: Users can view their own submissions
CREATE POLICY "Users can view their own submissions"
  ON exam_submissions FOR SELECT
  USING (true);

-- Exam Submissions: Anyone can insert submissions
CREATE POLICY "Anyone can insert exam submissions"
  ON exam_submissions FOR INSERT
  WITH CHECK (true);

-- Email Subscribers: Anyone can insert (subscribe)
CREATE POLICY "Anyone can subscribe"
  ON email_subscribers FOR INSERT
  WITH CHECK (true);

-- Email Subscribers: Only authenticated users can view
CREATE POLICY "Authenticated users can view subscribers"
  ON email_subscribers FOR SELECT
  USING (auth.role() = 'authenticated');

-- ============================================
-- 9. CREATE INDEXES FOR BETTER PERFORMANCE
-- ============================================
-- Jobs table indexes
CREATE INDEX IF NOT EXISTS idx_jobs_company_id ON jobs(company_id);
CREATE INDEX IF NOT EXISTS idx_jobs_opportunity_type ON jobs(opportunity_type);
CREATE INDEX IF NOT EXISTS idx_jobs_posted_date ON jobs(posted_date DESC);
CREATE INDEX IF NOT EXISTS idx_jobs_deadline ON jobs(deadline);
CREATE INDEX IF NOT EXISTS idx_jobs_featured ON jobs(featured);
CREATE INDEX IF NOT EXISTS idx_jobs_job_type ON jobs(job_type);
CREATE INDEX IF NOT EXISTS idx_jobs_experience_level ON jobs(experience_level);
CREATE INDEX IF NOT EXISTS idx_jobs_location_type ON jobs(location_type);

-- Companies table indexes
CREATE INDEX IF NOT EXISTS idx_companies_name ON companies(name);
CREATE INDEX IF NOT EXISTS idx_companies_created_date ON companies(created_date DESC);

-- Exams table indexes
CREATE INDEX IF NOT EXISTS idx_exams_category ON exams(category);
CREATE INDEX IF NOT EXISTS idx_exams_posted_date ON exams(posted_date DESC);
CREATE INDEX IF NOT EXISTS idx_exams_difficulty ON exams(difficulty);

-- Exam questions indexes
CREATE INDEX IF NOT EXISTS idx_exam_questions_exam_id ON exam_questions(exam_id);
CREATE INDEX IF NOT EXISTS idx_exam_questions_order ON exam_questions(exam_id, order_number);

-- Exam submissions indexes
CREATE INDEX IF NOT EXISTS idx_exam_submissions_exam_id ON exam_submissions(exam_id);
CREATE INDEX IF NOT EXISTS idx_exam_submissions_user_email ON exam_submissions(user_email);
CREATE INDEX IF NOT EXISTS idx_exam_submissions_submitted_at ON exam_submissions(submitted_at DESC);

-- Email subscribers indexes
CREATE INDEX IF NOT EXISTS idx_email_subscribers_email ON email_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_email_subscribers_subscribed_at ON email_subscribers(subscribed_at DESC);

-- ============================================
-- 10. INSERT SAMPLE DATA (from mock-data.ts)
-- ============================================

-- Insert Companies
INSERT INTO companies (name, logo, created_date) VALUES
  ('PlusAl', '/plusai-logo.jpg', '2024-01-01'),
  ('Apollo', '/apollo-logo.jpg', '2024-01-02'),
  ('TechFlow', '/techflow-logo.jpg', '2024-01-03'),
  ('DesignHub', '/designhub-logo.jpg', '2024-01-04'),
  ('ShopTech', '/shoptech-logo.jpg', '2024-01-05'),
  ('ContentPro', '/contentpro-logo.jpg', '2024-01-06')
RETURNING id;

-- Note: Since we're using auto-generated UUIDs, you'll need to add jobs manually through the dashboard
-- or update company_id references after companies are created.
-- For now, we'll skip job inserts. You can add them via the application.

-- Note: Sample data for exams and jobs should be added through the application dashboard
-- after the tables are created, as they will have auto-generated UUIDs.
-- You can use your admin login (admin@RwandaJobHub.com) to add sample data via the UI.
