-- Employer Journey Database Schema Updates
-- Add employer-specific tables and columns

-- Create employers table for account management
CREATE TABLE IF NOT EXISTS employers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  company VARCHAR(255) NOT NULL,
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  status VARCHAR(50) DEFAULT 'inactive' CHECK (status IN ('inactive', 'pending', 'approved', 'rejected')),
  current_plan_id UUID REFERENCES plans(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create plans table for subscription management
CREATE TABLE IF NOT EXISTS plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  price INTEGER NOT NULL, -- Price in RWF
  duration_months INTEGER DEFAULT 1,
  features JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default plans
INSERT INTO plans (name, price, duration_months, features) VALUES
('Featured', 50000, 1, '{"job_limit": 5, "featured": true, "shortlisting": false}'),
('Short-listing', 150000, 1, '{"job_limit": 15, "featured": true, "shortlisting": true}'),
('Premium', 250000, 1, '{"job_limit": 50, "featured": true, "shortlisting": true, "analytics": true}');

-- Add employer_id to jobs table for ownership
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS employer_id UUID REFERENCES employers(id);

-- Create employer_approvals table for admin approval tracking
CREATE TABLE IF NOT EXISTS employer_approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id UUID NOT NULL REFERENCES employers(id) ON DELETE CASCADE,
  admin_id UUID,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  notes TEXT,
  reviewed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_employers_email ON employers(email);
CREATE INDEX IF NOT EXISTS idx_employers_status ON employers(status);
CREATE INDEX IF NOT EXISTS idx_jobs_employer_id ON jobs(employer_id);
CREATE INDEX IF NOT EXISTS idx_employer_approvals_employer_id ON employer_approvals(employer_id);
CREATE INDEX IF NOT EXISTS idx_employer_approvals_status ON employer_approvals(status);
