--===============================================
-- EXAMS SYSTEM DATABASE SCHEMA
-- Copy and paste this entire file into your Supabase SQL Editor
-- Then click "Run" to create the tables
--===============================================

-- Create exams table
CREATE TABLE IF NOT EXISTS exams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT,
  duration TEXT,
  difficulty TEXT,
  description TEXT,
  topics TEXT[] DEFAULT '{}',
  participants INTEGER DEFAULT 0,
  rating DECIMAL DEFAULT 0,
  posted_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create exam_questions table
CREATE TABLE IF NOT EXISTS exam_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id UUID REFERENCES exams(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL CHECK (question_type IN ('multiple-choice', 'true-false', 'short-answer')),
  options TEXT, -- JSON string for multiple choice options
  correct_answer TEXT NOT NULL,
  explanation TEXT,
  points INTEGER DEFAULT 1,
  order_number INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on exam_id for better performance
CREATE INDEX IF NOT EXISTS idx_exam_questions_exam_id 
  ON exam_questions(exam_id);

-- Create index on posted_date for sorting
CREATE INDEX IF NOT EXISTS idx_exams_posted_date 
  ON exams(posted_date DESC);

-- Enable Row Level Security
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_questions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read access on exams" ON exams;
DROP POLICY IF EXISTS "Allow public read access on exam_questions" ON exam_questions;
DROP POLICY IF EXISTS "Allow insert on exams" ON exams;
DROP POLICY IF EXISTS "Allow insert on exam_questions" ON exam_questions;

-- Create policies for public read access
CREATE POLICY "Allow public read access on exams" 
  ON exams FOR SELECT 
  USING (true);

CREATE POLICY "Allow public read access on exam_questions" 
  ON exam_questions FOR SELECT 
  USING (true);

-- Create policies for insert (adjust based on your auth requirements)
-- Currently allows anyone to insert. Update this based on your needs.
CREATE POLICY "Allow insert on exams" 
  ON exams FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Allow insert on exam_questions" 
  ON exam_questions FOR INSERT 
  WITH CHECK (true);

-- Optional: Create policies for update and delete
CREATE POLICY "Allow update on exams" 
  ON exams FOR UPDATE 
  USING (true);

CREATE POLICY "Allow delete on exams" 
  ON exams FOR DELETE 
  USING (true);

--===============================================
-- VERIFICATION QUERIES
-- Run these after creating the tables to verify
--===============================================

-- Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('exams', 'exam_questions');

-- Check table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'exams'
ORDER BY ordinal_position;

SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'exam_questions'
ORDER BY ordinal_position;
