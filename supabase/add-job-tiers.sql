-- Add tier-based pricing columns to jobs table
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS tier VARCHAR(50) DEFAULT 'basic' CHECK (tier IN ('basic', 'featured', 'featured-plus', 'super-featured', 'short-listing'));
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS tier_price INTEGER DEFAULT 0;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS priority_placement BOOLEAN DEFAULT false;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS social_media_promotion BOOLEAN DEFAULT false;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS whatsapp_promotion BOOLEAN DEFAULT false;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS candidate_pre_screening BOOLEAN DEFAULT false;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS priority_candidate_matching BOOLEAN DEFAULT false;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS matched_candidates_count INTEGER DEFAULT 0;

-- Update existing jobs to have basic tier
UPDATE jobs SET tier = 'basic', tier_price = 0 WHERE tier IS NULL;

-- Create indexes for tier-based queries
CREATE INDEX IF NOT EXISTS idx_jobs_tier ON jobs(tier);
CREATE INDEX IF NOT EXISTS idx_jobs_priority_placement ON jobs(priority_placement) WHERE priority_placement = true;
CREATE INDEX IF NOT EXISTS idx_jobs_candidate_pre_screening ON jobs(candidate_pre_screening) WHERE candidate_pre_screening = true;
