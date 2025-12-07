-- SQL script to make job fields optional (allow NULL values)
-- Run this in your Supabase SQL Editor

-- Make description column nullable
ALTER TABLE jobs ALTER COLUMN description DROP NOT NULL;

-- Make location column nullable
ALTER TABLE jobs ALTER COLUMN location DROP NOT NULL;

-- Make location_type column nullable
ALTER TABLE jobs ALTER COLUMN location_type DROP NOT NULL;

-- Verify the changes
SELECT 
    column_name,
    is_nullable,
    data_type
FROM 
    information_schema.columns
WHERE 
    table_name = 'jobs'
    AND column_name IN ('description', 'location', 'location_type')
ORDER BY 
    column_name;
