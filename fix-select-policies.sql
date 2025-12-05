-- Fix Missing SELECT Policies
-- This adds the SELECT policies that were missing from the fix-rls-policies.sql script

-- Drop existing SELECT policies if they exist
DROP POLICY IF EXISTS "Public can view jobs" ON jobs;
DROP POLICY IF EXISTS "Public can view companies" ON companies;
DROP POLICY IF EXISTS "Public can view exams" ON exams;
DROP POLICY IF EXISTS "Public can view exam questions" ON exam_questions;

-- Create SELECT policies to allow anyone to read data
CREATE POLICY "Anyone can view jobs"
  ON jobs FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view companies"
  ON companies FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view exams"
  ON exams FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view exam questions"
  ON exam_questions FOR SELECT
  USING (true);
