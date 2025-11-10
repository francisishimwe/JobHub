-- Fix RLS Policies to Allow Anonymous Writes
-- This is a temporary fix for development
-- In production, you should implement proper Supabase authentication

-- Update Jobs policies to allow anyone to insert/update/delete
DROP POLICY IF EXISTS "Authenticated users can insert jobs" ON jobs;
DROP POLICY IF EXISTS "Authenticated users can update jobs" ON jobs;
DROP POLICY IF EXISTS "Authenticated users can delete jobs" ON jobs;

CREATE POLICY "Anyone can insert jobs"
  ON jobs FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update jobs"
  ON jobs FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can delete jobs"
  ON jobs FOR DELETE
  USING (true);

-- Update Companies policies to allow anyone to insert/update/delete
DROP POLICY IF EXISTS "Authenticated users can insert companies" ON companies;
DROP POLICY IF EXISTS "Authenticated users can update companies" ON companies;
DROP POLICY IF EXISTS "Authenticated users can delete companies" ON companies;

CREATE POLICY "Anyone can insert companies"
  ON companies FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update companies"
  ON companies FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can delete companies"
  ON companies FOR DELETE
  USING (true);

-- Update Exams policies to allow anyone to insert/update/delete
DROP POLICY IF EXISTS "Authenticated users can insert exams" ON exams;
DROP POLICY IF EXISTS "Authenticated users can update exams" ON exams;
DROP POLICY IF EXISTS "Authenticated users can delete exams" ON exams;

CREATE POLICY "Anyone can insert exams"
  ON exams FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update exams"
  ON exams FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can delete exams"
  ON exams FOR DELETE
  USING (true);

-- Update Exam Questions policies
DROP POLICY IF EXISTS "Authenticated users can insert exam questions" ON exam_questions;
DROP POLICY IF EXISTS "Authenticated users can update exam questions" ON exam_questions;
DROP POLICY IF EXISTS "Authenticated users can delete exam questions" ON exam_questions;

CREATE POLICY "Anyone can insert exam questions"
  ON exam_questions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update exam questions"
  ON exam_questions FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can delete exam questions"
  ON exam_questions FOR DELETE
  USING (true);
