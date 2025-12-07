-- ============================================
-- Fix Jobs Table Schema
-- ============================================
-- This script fixes the jobs table to match the application's requirements:
-- 1. Makes optional fields nullable (job_type, experience_level, application_link)
-- 2. Makes opportunity_type required (NOT NULL)
-- 3. Makes company_id required (NOT NULL)
-- 4. Adds category column if it doesn't exist
--
-- Run this in your Supabase SQL Editor
-- ============================================

-- Step 1: Make job_type nullable (it's optional in the form)
ALTER TABLE jobs 
ALTER COLUMN job_type DROP NOT NULL;

-- Step 2: Make experience_level nullable (it's optional in the form)
ALTER TABLE jobs 
ALTER COLUMN experience_level DROP NOT NULL;

-- Step 3: Make application_link nullable (it's optional in the form)
ALTER TABLE jobs 
ALTER COLUMN application_link DROP NOT NULL;

-- Step 4: Add category column if it doesn't exist (optional field)
ALTER TABLE jobs 
ADD COLUMN IF NOT EXISTS category TEXT;

-- Step 5: Ensure opportunity_type is required (NOT NULL)
-- First, update any existing NULL values to a default (just in case)
UPDATE jobs 
SET opportunity_type = 'Job' 
WHERE opportunity_type IS NULL;

-- Then add the NOT NULL constraint
ALTER TABLE jobs 
ALTER COLUMN opportunity_type SET NOT NULL;

-- Step 6: Ensure company_id is required (NOT NULL)
-- First, you need to handle any existing NULL values
-- Option A: Delete jobs without companies
DELETE FROM jobs WHERE company_id IS NULL;

-- Option B (Alternative): If you want to keep them, assign to a default company
-- UPDATE jobs SET company_id = 'your-default-company-id' WHERE company_id IS NULL;

-- Then add the NOT NULL constraint
ALTER TABLE jobs 
ALTER COLUMN company_id SET NOT NULL;

-- Add comments to clarify column purposes
COMMENT ON COLUMN jobs.job_type IS 'Job type field (nullable, optional) - e.g., Full-time, Part-time, Contract';
COMMENT ON COLUMN jobs.experience_level IS 'Experience level field (nullable, optional) - e.g., Entry level, Intermediate, Expert';
COMMENT ON COLUMN jobs.application_link IS 'Application link field (nullable, optional)';
COMMENT ON COLUMN jobs.category IS 'Job category field (nullable, optional) - e.g., Computer and IT, Engineering';
COMMENT ON COLUMN jobs.opportunity_type IS 'Opportunity type field (required, NOT NULL) - e.g., Job, Internship, Scholarship, Tender, Education, Blog, Announcement';
COMMENT ON COLUMN jobs.company_id IS 'Company ID field (required, NOT NULL) - references companies table';

-- Verify the changes
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'jobs' 
AND column_name IN ('job_type', 'experience_level', 'application_link', 'category', 'opportunity_type', 'company_id')
ORDER BY column_name;
