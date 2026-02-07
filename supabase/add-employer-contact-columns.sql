-- Add employer contact information columns to jobs table
ALTER TABLE jobs 
ADD COLUMN IF NOT EXISTS employer_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS employer_email VARCHAR(255),
ADD COLUMN IF NOT EXISTS employer_phone VARCHAR(50),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Create index for updated_at column
CREATE INDEX IF NOT EXISTS idx_jobs_updated_at ON jobs(updated_at);

-- Update existing jobs to have current timestamp for updated_at
UPDATE jobs SET updated_at = created_at WHERE updated_at IS NULL;
