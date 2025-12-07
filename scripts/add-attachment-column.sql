-- ============================================
-- Add Attachment Column to Jobs Table
-- ============================================
-- This script adds an attachment_url column to store uploaded files
-- Supports PDF, DOC, DOCX, XLS, XLSX files
--
-- Run this in your Supabase SQL Editor
-- ============================================

-- Add attachment_url column
ALTER TABLE jobs 
ADD COLUMN IF NOT EXISTS attachment_url TEXT;

-- Add comment to document the column
COMMENT ON COLUMN jobs.attachment_url IS 'URL to uploaded attachment file (PDF, DOC, Excel) - nullable/optional';

-- Verify the change
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'jobs' 
AND column_name = 'attachment_url';
