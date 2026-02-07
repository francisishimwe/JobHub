-- Add email application fields to jobs table
-- This adds support for Email application method with Primary Email and CC Emails

ALTER TABLE jobs 
ADD COLUMN IF NOT EXISTS application_method VARCHAR(50) DEFAULT 'link' CHECK (application_method IN ('email', 'link')),
ADD COLUMN IF NOT EXISTS primary_email TEXT,
ADD COLUMN IF NOT EXISTS cc_emails TEXT;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_jobs_application_method ON jobs(application_method);
CREATE INDEX IF NOT EXISTS idx_jobs_primary_email ON jobs(primary_email);
