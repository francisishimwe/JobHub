--===============================================
-- FIX: Make difficulty column nullable (optional)
-- Run this SQL in your Supabase SQL Editor
--===============================================

-- Make the difficulty column allow NULL values
ALTER TABLE exams 
  ALTER COLUMN difficulty DROP NOT NULL;

-- Verify the change
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'exams' AND column_name = 'difficulty';

-- Expected result: is_nullable should be 'YES'
