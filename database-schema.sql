-- Neon Database Schema for RwandaJobHub Membership Assessment System

-- Membership Users Table
CREATE TABLE IF NOT EXISTS membership_users (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  phone_number VARCHAR(20) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  is_approved BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Exam Questions Table
CREATE TABLE IF NOT EXISTS exam_questions (
  id SERIAL PRIMARY KEY,
  question_text TEXT NOT NULL,
  options TEXT[] NOT NULL, -- PostgreSQL array for 4 options
  correct_answer VARCHAR(255) NOT NULL, -- Store the correct answer text
  time_limit INTEGER DEFAULT 300, -- Default 5 minutes per question
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Exam Results Table
CREATE TABLE IF NOT EXISTS exam_results (
  id SERIAL PRIMARY KEY,
  question_id INTEGER REFERENCES exam_questions(id),
  user_answer VARCHAR(255) NOT NULL,
  is_correct BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert Sample Exam Questions (Optional - for testing)
INSERT INTO exam_questions (question_text, options, correct_answer, time_limit) VALUES
('Kugeza kuri ibikoresho bya umuhanda, nikiyega cyambere?', 
 ARRAY['Uburyo bwo kugenda iburyo', 'Uburyo bwo kugenda iburyo n''iburyo', 'Uburyo bwo kugenda iburyo n''ibumoso', 'Uburyo bwo kugenda iburyo n''iburyo n''ibumoso'], 
 'Uburyo bwo kugenda iburyo', 300),
('Igihe cyo kugenda iburyo n''ibumoso ni iki?', 
 ARRAY['Igihe cy''ibumoso', 'Igihe cy''iburyo', 'Igihe cy''ibumoso n''iburyo', 'Igihe cy''ibumoso n''ibumoso'], 
 'Igihe cy''ibumoso n''iburyo', 300),
('Kugeza kuri ibikoresho bya umuhanda, nikiyega cyambere?', 
 ARRAY['Uburyo bwo kugenda iburyo', 'Uburyo bwo kugenda iburyo n''iburyo', 'Uburyo bwo kugenda iburyo n''ibumoso', 'Uburyo bwo kugenda iburyo n''iburyo n''ibumoso'], 
 'Uburyo bwo kugenda iburyo', 300),
('Igihe cyo kugenda iburyo n''ibumoso ni iki?', 
 ARRAY['Igihe cy''ibumoso', 'Igihe cy''iburyo', 'Igihe cy''ibumoso n''iburyo', 'Igihe cy''ibumoso n''ibumoso'], 
 'Igihe cy''ibumoso n''iburyo', 300),
('Kugeza kuri ibikoresho bya umuhanda, nikiyega cyambere?', 
 ARRAY['Uburyo bwo kugenda iburyo', 'Uburyo bwo kugenda iburyo n''iburyo', 'Uburyo bwo kugenda iburyo n''ibumoso', 'Uburyo bwo kugenda iburyo n''iburyo n''ibumoso'], 
 'Uburyo bwo kugenda iburyo', 300),
('Igihe cyo kugenda iburyo n''ibumoso ni iki?', 
 ARRAY['Igihe cy''ibumoso', 'Igihe cy''iburyo', 'Igihe cy''ibumoso n''iburyo', 'Igihe cy''ibumoso n''ibumoso'], 
 'Igihe cy''ibumoso n''iburyo', 300),
('Kugeza kuri ibikoresho bya umuhanda, nikiyega cyambere?', 
 ARRAY['Uburyo bwo kugenda iburyo', 'Uburyo bwo kugenda iburyo n''iburyo', 'Uburyo bwo kugenda iburyo n''ibumoso', 'Uburyo bwo kugenda iburyo n''iburyo n''ibumoso'], 
 'Uburyo bwo kugenda iburyo', 300),
('Igihe cyo kugenda iburyo n''ibumoso ni iki?', 
 ARRAY['Igihe cy''ibumoso', 'Igihe cy''iburyo', 'Igihe cy''ibumoso n''iburyo', 'Igihe cy''ibumoso n''ibumoso'], 
 'Igihe cy''ibumoso n''iburyo', 300),
('Kugeza kuri ibikoresho bya umuhanda, nikiyega cyambere?', 
 ARRAY['Uburyo bwo kugenda iburyo', 'Uburyo bwo kugenda iburyo n''iburyo', 'Uburyo bwo kugenda iburyo n''ibumoso', 'Uburyo bwo kugenda iburyo n''iburyo n''ibumoso'], 
 'Uburyo bwo kugenda iburyo', 300),
('Igihe cyo kugenda iburyo n''ibumoso ni iki?', 
 ARRAY['Igihe cy''ibumoso', 'Igihe cy''iburyo', 'Igihe cy''ibumoso n''iburyo', 'Igihe cy''ibumoso n''ibumoso'], 
 'Igihe cy''ibumoso n''iburyo', 300);

-- Create Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_membership_users_phone ON membership_users(phone_number);
CREATE INDEX IF NOT EXISTS idx_membership_users_approved ON membership_users(is_approved);
CREATE INDEX IF NOT EXISTS idx_exam_results_question ON exam_results(question_id);
