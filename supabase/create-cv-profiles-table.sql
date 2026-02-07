-- Create cv_profiles table for storing CV text data
CREATE TABLE IF NOT EXISTS cv_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(50),
  birth_date DATE,
  place_of_birth VARCHAR(255),
  fathers_name VARCHAR(255),
  mothers_name VARCHAR(255),
  nationality VARCHAR(100) DEFAULT 'Rwanda',
  gender VARCHAR(20),
  district VARCHAR(100),
  sector VARCHAR(100),
  cell VARCHAR(100),
  village VARCHAR(100),
  
  -- Education information (stored as JSON array)
  education JSONB DEFAULT '[]'::jsonb,
  
  -- Experience information
  experience_level VARCHAR(100),
  experience_years VARCHAR(20),
  current_company VARCHAR(255),
  current_role VARCHAR(255),
  employer_phone VARCHAR(50),
  employer_email VARCHAR(255),
  
  -- Skills and languages (stored as JSON)
  skills TEXT[],
  languages JSONB DEFAULT '[]'::jsonb,
  
  -- Salary expectations
  salary_expectation VARCHAR(100),
  salary_currency VARCHAR(10) DEFAULT 'RWF',
  
  -- Referees (stored as JSON array)
  referees JSONB DEFAULT '[]'::jsonb,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT true
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_cv_profiles_email ON cv_profiles(email);
CREATE INDEX IF NOT EXISTS idx_cv_profiles_first_name ON cv_profiles(first_name);
CREATE INDEX IF NOT EXISTS idx_cv_profiles_last_name ON cv_profiles(last_name);
CREATE INDEX IF NOT EXISTS idx_cv_profiles_experience_level ON cv_profiles(experience_level);
CREATE INDEX IF NOT EXISTS idx_cv_profiles_education ON cv_profiles USING GIN(education);
CREATE INDEX IF NOT EXISTS idx_cv_profiles_skills ON cv_profiles USING GIN(skills);
CREATE INDEX IF NOT EXISTS idx_cv_profiles_created_at ON cv_profiles(created_at);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_cv_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER trigger_update_cv_profiles_updated_at
  BEFORE UPDATE ON cv_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_cv_profiles_updated_at();
