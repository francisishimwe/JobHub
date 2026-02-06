-- Agency Workflow Schema Updates
-- Add columns for plan tracking and priority system

-- Add plan_id column to jobs table
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS plan_id INTEGER DEFAULT 1;

-- Add priority column to jobs table
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS priority VARCHAR(50) DEFAULT 'Normal';

-- Add agency_verified column to jobs table  
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS agency_verified BOOLEAN DEFAULT false;

-- Add is_verified column for backward compatibility
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false;

-- Create index for priority sorting
CREATE INDEX IF NOT EXISTS idx_jobs_priority ON jobs(priority, created_at);

-- Create index for plan_id
CREATE INDEX IF NOT EXISTS idx_jobs_plan_id ON jobs(plan_id);

-- Add constraint for priority values
ALTER TABLE jobs ADD CONSTRAINT IF NOT EXISTS chk_priority 
  CHECK (priority IN ('Low', 'Normal', 'High', 'Top'));

-- Trigger function to automatically set priority and agency_verified for plan_id = 4
CREATE OR REPLACE FUNCTION set_agency_priority()
RETURNS TRIGGER AS $$
BEGIN
  -- If plan_id is 4 (Short-listing), set priority to 'Top' and agency_verified to true
  IF NEW.plan_id = 4 THEN
    NEW.priority := 'Top';
    NEW.agency_verified := true;
    NEW.is_verified := true;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically apply agency rules
DROP TRIGGER IF EXISTS trigger_set_agency_priority ON jobs;
CREATE TRIGGER trigger_set_agency_priority
  BEFORE INSERT OR UPDATE ON jobs
  FOR EACH ROW
  EXECUTE FUNCTION set_agency_priority();

-- Update existing jobs if needed
UPDATE jobs SET priority = 'Top', agency_verified = true, is_verified = true 
WHERE plan_id = 4 AND (priority != 'Top' OR agency_verified != true OR is_verified != true);
