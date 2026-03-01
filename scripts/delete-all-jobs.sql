-- Delete all job-related data from JobHub database
-- This script deletes all jobs and related data in the correct order to respect foreign key constraints

-- Delete job_applications first (depends on cv_profiles and jobs)
DELETE FROM job_applications;

-- Delete cv_profiles (depends on jobs)
DELETE FROM cv_profiles;

-- Delete all jobs
DELETE FROM jobs;

-- Delete companies (orphaned after jobs deletion)
DELETE FROM companies;

-- Delete exam data
DELETE FROM exam_submissions;
DELETE FROM exam_questions;
DELETE FROM exams;

-- Delete analytics data
DELETE FROM email_subscribers;
DELETE FROM page_views;
DELETE FROM visitors;

-- Reset sequences for auto-incrementing IDs
ALTER SEQUENCE IF EXISTS companies_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS jobs_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS cv_profiles_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS job_applications_id_seq RESTART WITH 1;

COMMIT;

-- Verify deletion
SELECT 'companies' as table_name, COUNT(*) as count FROM companies
UNION ALL
SELECT 'jobs', COUNT(*) FROM jobs
UNION ALL
SELECT 'cv_profiles', COUNT(*) FROM cv_profiles
UNION ALL
SELECT 'job_applications', COUNT(*) FROM job_applications;
