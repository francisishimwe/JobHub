-- Add company_logo column to jobs table
-- This migration adds support for storing company logo directly with job records

ALTER TABLE jobs ADD COLUMN IF NOT EXISTS company_logo TEXT;

-- Add comment to describe the column
COMMENT ON COLUMN jobs.company_logo IS 'Company logo URL stored directly with the job for easy access in UI components';
