-- Migration script to add missing columns to jobs table
-- This script adds columns that are expected by the application but are missing from the schema

-- Add location_type column if it doesn't exist
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS location_type VARCHAR(100);

-- Add experience_level column if it doesn't exist
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS experience_level VARCHAR(100);

-- Add application_link column if it doesn't exist
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS application_link TEXT;

-- Add applicants column if it doesn't exist
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS applicants INTEGER DEFAULT 0;

-- Verify the columns exist
SELECT 
    column_name,
    data_type,
    is_nullable
FROM 
    information_schema.columns
WHERE 
    table_name = 'jobs'
ORDER BY 
    ordinal_position;
