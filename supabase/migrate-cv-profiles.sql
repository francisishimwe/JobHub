-- Migration script to update cv_profiles and job_applications tables
-- Run this in Neon SQL Editor to update your existing schema

-- 1. Drop existing tables (this will delete existing data - backup first if needed)
DROP TABLE IF EXISTS job_applications CASCADE;
DROP TABLE IF EXISTS cv_profiles CASCADE;

-- 2. Create new cv_profiles table with updated structure
CREATE TABLE IF NOT EXISTS cv_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    field_of_study TEXT NOT NULL, -- Used for Match-Making logic
    skills TEXT[],
    experience_json JSONB, -- Stores work history as tiny text
    education_json JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create new job_applications table with updated structure
CREATE TABLE IF NOT EXISTS job_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    cv_profile_id UUID REFERENCES cv_profiles(id) ON DELETE SET NULL,
    applicant_name TEXT NOT NULL,
    status TEXT DEFAULT 'pending', -- 'pending', 'shortlisted', 'rejected'
    match_score INTEGER DEFAULT 0, -- Calculated by your match service
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Add indexes for faster Match-Making queries
CREATE INDEX IF NOT EXISTS idx_cv_field_of_study ON cv_profiles(field_of_study);
CREATE INDEX IF NOT EXISTS idx_job_apps_status ON job_applications(status);

-- 5. Add additional useful indexes
CREATE INDEX IF NOT EXISTS idx_cv_profiles_user_id ON cv_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_cv_profiles_email ON cv_profiles(email);
CREATE INDEX IF NOT EXISTS idx_job_applications_job_id ON job_applications(job_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_cv_profile_id ON job_applications(cv_profile_id);

-- 6. Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_cv_profiles_updated_at 
    BEFORE UPDATE ON cv_profiles 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
