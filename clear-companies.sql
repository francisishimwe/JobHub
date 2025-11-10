-- Clear all companies from the database
-- This will also cascade delete related jobs and exams due to foreign key constraints

DELETE FROM companies;

-- Optional: Reset the auto-increment if needed
-- ALTER SEQUENCE companies_id_seq RESTART WITH 1;
