-- Migration script to add missing email-related columns to jobs table
-- This script adds columns that are expected by the application but are missing from the schema

-- Add application_method column if it doesn't exist
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS application_method VARCHAR(50) DEFAULT 'email';

-- Add primary_email column if it doesn't exist
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS primary_email TEXT;

-- Add cc_emails column if it doesn't exist
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS cc_emails TEXT;

-- Verify the columns exist
SELECT 
    column_name,
    data_type,
    is_nullable
FROM 
    information_schema.columns
WHERE 
    table_name = 'jobs'
    AND column_name IN ('application_method', 'primary_email', 'cc_emails')
ORDER BY 
    column_name;
