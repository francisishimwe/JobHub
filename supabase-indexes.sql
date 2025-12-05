-- Supabase Performance Optimization Indexes
-- Run these SQL commands in your Supabase SQL Editor
-- Go to: Supabase Dashboard → SQL Editor → New Query

-- Index on company_id for faster joins
CREATE INDEX IF NOT EXISTS idx_jobs_company_id ON jobs(company_id);

-- Index on posted_date for sorting (descending for recent first)
CREATE INDEX IF NOT EXISTS idx_jobs_posted_date ON jobs(created_at DESC);

-- Index on opportunity_type for filtering
CREATE INDEX IF NOT EXISTS idx_jobs_opportunity_type ON jobs(opportunity_type);

-- Index on featured for featured jobs
CREATE INDEX IF NOT EXISTS idx_jobs_featured ON jobs(featured) WHERE featured = true;

-- Composite index for common query patterns (type + date)
CREATE INDEX IF NOT EXISTS idx_jobs_type_date ON jobs(opportunity_type, created_at DESC);

-- Index on deadline for upcoming deadlines
CREATE INDEX IF NOT EXISTS idx_jobs_deadline ON jobs(deadline) WHERE deadline IS NOT NULL;

-- Index on applicants for analytics/top performing jobs
CREATE INDEX IF NOT EXISTS idx_jobs_applicants ON jobs(applicants DESC);

-- Analyze tables after creating indexes
ANALYZE jobs;
ANALYZE companies;
ANALYZE exams;

-- Verify indexes were created
SELECT 
    tablename,
    indexname,
    indexdef
FROM 
    pg_indexes
WHERE 
    tablename IN ('jobs', 'companies', 'exams')
ORDER BY 
    tablename, indexname;
