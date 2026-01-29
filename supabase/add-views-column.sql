-- Migration script to add views column to jobs table
-- This script adds the views column that is used for tracking job views

ALTER TABLE jobs ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;

-- Verify the column exists
SELECT 
    column_name,
    data_type,
    is_nullable
FROM 
    information_schema.columns
WHERE 
    table_name = 'jobs'
    AND column_name = 'views';
