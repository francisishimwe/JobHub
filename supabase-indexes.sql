-- Supabase Performance Optimization Indexes
-- Run these SQL commands in your Supabase SQL Editor
-- Go to: Supabase Dashboard → SQL Editor → New Query

-- IMPORTANT: Only run this ONCE. Remove any previously created problematic indexes first.

-- Index on company_id for faster joins with companies table
CREATE INDEX IF NOT EXISTS idx_jobs_company_id ON jobs(company_id);

-- Index on opportunity_type for filtering by job type
CREATE INDEX IF NOT EXISTS idx_jobs_opportunity_type ON jobs(opportunity_type);

-- Index on featured for quickly finding featured jobs
CREATE INDEX IF NOT EXISTS idx_jobs_featured ON jobs(featured) WHERE featured = true;

-- Index on applicants for analytics and sorting top jobs
CREATE INDEX IF NOT EXISTS idx_jobs_applicants ON jobs(applicants);

-- Analyze tables to update query planner statistics
ANALYZE jobs;
ANALYZE companies;
ANALYZE exams;

-- Verify indexes were created successfully
SELECT 
    tablename,
    indexname,
    indexdef
FROM 
    pg_indexes
WHERE 
    tablename IN ('jobs', 'companies', 'exams')
    AND indexname LIKE 'idx_%'
ORDER BY 
    tablename, indexname;
