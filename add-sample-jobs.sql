-- Add Sample Jobs to Supabase
-- Run this AFTER the main schema is created
-- This will add jobs using the company UUIDs that were auto-generated

-- First, let's get the company IDs and insert jobs
-- You'll need to replace the company_id values with the actual UUIDs from your companies table

-- To get your company UUIDs, first run: SELECT id, name FROM companies;
-- Then replace the company_id values below with the actual UUIDs

-- Example inserts (you'll need to update company_id values):
/*
INSERT INTO jobs (title, company_id, description, location, location_type, job_type, opportunity_type, experience_level, deadline, applicants, featured, application_link) VALUES
('Experienced web designer needed for B2B business redesign', 
 (SELECT id FROM companies WHERE name = 'PlusAl' LIMIT 1),
 'We are looking for a skilled professional to join our team full-time. Your responsibilities will include building, editing, and managing our website, creating engaging PowerPoint presentations.',
 'Remote', 'Remote', 'Freelance', 'Job', 'Intermediate', '2024-02-15', 120, true, 'https://plusai.com/careers/apply'),

('Senior product designer / UI/UX designer',
 (SELECT id FROM companies WHERE name = 'Apollo' LIMIT 1),
 'We are seeking a talented and experienced Senior Product Designer / UI/UX Designer to join our team at Anyday Design This role involves working independently on the design of web applications.',
 'Remote', 'Remote', 'Freelance', 'Job', 'Expert', '2024-02-20', 24, false, 'https://apollo.io/careers/senior-designer'),

('Frontend Developer Internship',
 (SELECT id FROM companies WHERE name = 'TechFlow' LIMIT 1),
 'Looking for an enthusiastic intern to learn and build a modern SaaS dashboard using React and TypeScript. Great opportunity for students or recent graduates.',
 'United States', 'Remote', 'Part-time', 'Internship', 'Entry level', null, 45, false, 'mailto:jobs@techflow.com?subject=Frontend Developer Application'),

('Design Scholarship Program 2024',
 (SELECT id FROM companies WHERE name = 'DesignHub' LIMIT 1),
 'Full scholarship program for aspiring designers. Includes mentorship, design tools, and portfolio development. No prior experience required.',
 'London, UK', 'Hybrid', 'Part-time', 'Scholarship', 'Entry level', '2024-03-01', 67, false, 'https://designhub.io/apply/mobile-designer'),

('Full Stack Developer - E-commerce Platform',
 (SELECT id FROM companies WHERE name = 'ShopTech' LIMIT 1),
 'Seeking a full stack developer to build and maintain our e-commerce platform. Must have experience with payment integrations and database management.',
 'Remote', 'Remote', 'Full-time', 'Job', 'Expert', null, 89, false, 'https://shoptech.com/careers/fullstack-developer'),

('Software Engineering Internship Program',
 (SELECT id FROM companies WHERE name = 'ContentPro' LIMIT 1),
 '6-month paid internship program for computer science students. Work on real projects, learn from senior engineers, and gain industry experience.',
 'Remote', 'Remote', 'Full-time', 'Internship', 'Entry level', '2024-02-28', 156, false, 'mailto:hiring@contentpro.com?subject=Content Writer Application');
*/

-- Easier approach: Use a DO block to insert jobs automatically
DO $$
DECLARE
  company1_id UUID;
  company2_id UUID;
  company3_id UUID;
  company4_id UUID;
  company5_id UUID;
  company6_id UUID;
BEGIN
  -- Get company IDs
  SELECT id INTO company1_id FROM companies WHERE name = 'PlusAl' LIMIT 1;
  SELECT id INTO company2_id FROM companies WHERE name = 'Apollo' LIMIT 1;
  SELECT id INTO company3_id FROM companies WHERE name = 'TechFlow' LIMIT 1;
  SELECT id INTO company4_id FROM companies WHERE name = 'DesignHub' LIMIT 1;
  SELECT id INTO company5_id FROM companies WHERE name = 'ShopTech' LIMIT 1;
  SELECT id INTO company6_id FROM companies WHERE name = 'ContentPro' LIMIT 1;

  -- Insert jobs
  INSERT INTO jobs (title, company_id, description, location, location_type, job_type, opportunity_type, experience_level, deadline, applicants, featured, application_link) VALUES
  ('Experienced web designer needed for B2B business redesign', company1_id, 'We are looking for a skilled professional to join our team full-time. Your responsibilities will include building, editing, and managing our website, creating engaging PowerPoint presentations.', 'Remote', 'Remote', 'Freelance', 'Job', 'Intermediate', '2024-02-15', 120, true, 'https://plusai.com/careers/apply'),
  ('Senior product designer / UI/UX designer', company2_id, 'We are seeking a talented and experienced Senior Product Designer / UI/UX Designer to join our team at Anyday Design This role involves working independently on the design of web applications.', 'Remote', 'Remote', 'Freelance', 'Job', 'Expert', '2024-02-20', 24, false, 'https://apollo.io/careers/senior-designer'),
  ('Frontend Developer Internship', company3_id, 'Looking for an enthusiastic intern to learn and build a modern SaaS dashboard using React and TypeScript. Great opportunity for students or recent graduates.', 'United States', 'Remote', 'Part-time', 'Internship', 'Entry level', null, 45, false, 'mailto:jobs@techflow.com?subject=Frontend Developer Application'),
  ('Design Scholarship Program 2024', company4_id, 'Full scholarship program for aspiring designers. Includes mentorship, design tools, and portfolio development. No prior experience required.', 'London, UK', 'Hybrid', 'Part-time', 'Scholarship', 'Entry level', '2024-03-01', 67, false, 'https://designhub.io/apply/mobile-designer'),
  ('Full Stack Developer - E-commerce Platform', company5_id, 'Seeking a full stack developer to build and maintain our e-commerce platform. Must have experience with payment integrations and database management.', 'Remote', 'Remote', 'Full-time', 'Job', 'Expert', null, 89, false, 'https://shoptech.com/careers/fullstack-developer'),
  ('Software Engineering Internship Program', company6_id, '6-month paid internship program for computer science students. Work on real projects, learn from senior engineers, and gain industry experience.', 'Remote', 'Remote', 'Full-time', 'Internship', 'Entry level', '2024-02-28', 156, false, 'mailto:hiring@contentpro.com?subject=Content Writer Application');
END $$;
