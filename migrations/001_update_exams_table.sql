-- Migration: Add new fields to exams table for enhanced exam management
-- Date: 2025-04-14

-- Add new columns to existing exams table
ALTER TABLE exams 
ADD COLUMN IF NOT EXISTS category VARCHAR(100) DEFAULT 'General',
ADD COLUMN IF NOT EXISTS institution VARCHAR(200) DEFAULT 'RwandaJobHub',
ADD COLUMN IF NOT EXISTS exam_type VARCHAR(50) DEFAULT 'Online Test',
ADD COLUMN IF NOT EXISTS pdf_url TEXT,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS participants INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS rating DECIMAL(3,2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS total_questions INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS duration_minutes INTEGER,
ADD COLUMN IF NOT EXISTS difficulty_level VARCHAR(20) DEFAULT 'Intermediate';

-- Update existing records to have default values
UPDATE exams 
SET 
    category = 'General',
    institution = 'RwandaJobHub',
    exam_type = 'Online Test',
    is_active = true,
    participants = 0,
    rating = 0.00,
    total_questions = 0,
    difficulty_level = 'Intermediate'
WHERE category IS NULL OR institution IS NULL;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_exams_category ON exams(category);
CREATE INDEX IF NOT EXISTS idx_exams_institution ON exams(institution);
CREATE INDEX IF NOT EXISTS idx_exams_exam_type ON exams(exam_type);
CREATE INDEX IF NOT EXISTS idx_exams_is_active ON exams(is_active);
CREATE INDEX IF NOT EXISTS idx_exams_created_at ON exams(created_at DESC);
