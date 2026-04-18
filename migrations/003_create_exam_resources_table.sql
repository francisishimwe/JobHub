-- Migration: Create exam_resources table for secure document system
-- Date: 2025-04-18

-- Create exam_resources table
CREATE TABLE IF NOT EXISTS exam_resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('WRITTEN_EXAM', 'INTERVIEW_PREP')),
    content_type TEXT NOT NULL CHECK (content_type IN ('TEXT', 'PDF_URL')),
    text_content TEXT,
    file_url TEXT,
    institution TEXT NOT NULL,
    featured BOOLEAN DEFAULT false,
    estimated_reading_time INTEGER, -- in minutes
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_exam_resources_category ON exam_resources(category);
CREATE INDEX IF NOT EXISTS idx_exam_resources_institution ON exam_resources(institution);
CREATE INDEX IF NOT EXISTS idx_exam_resources_featured ON exam_resources(featured);
CREATE INDEX IF NOT EXISTS idx_exam_resources_created_at ON exam_resources(created_at DESC);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_exam_resources_updated_at 
    BEFORE UPDATE ON exam_resources 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
