-- Add category column to jobs table
-- This column stores the job category (e.g., "Computer and IT", "Engineering", etc.)
-- The column is nullable since category is optional when adding jobs

ALTER TABLE jobs 
ADD COLUMN IF NOT EXISTS category TEXT;

-- Optional: Add a comment to the column
COMMENT ON COLUMN jobs.category IS 'Job category field (nullable, optional)';

-- Verify the column was added
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'jobs' 
AND column_name = 'category';
