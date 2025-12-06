-- Automated SQL Script to Add Test Exam to Supabase
-- This version uses a DO block to automatically handle the exam ID
-- Run this ENTIRE script in your Supabase SQL Editor

DO $$
DECLARE
  exam_uuid UUID;
BEGIN
  -- Step 1: Insert the exam and store its ID
  INSERT INTO exams (
    title,
    category,
    duration,
    difficulty,
    description,
    topics,
    participants,
    rating
  ) VALUES (
    'Web Development Essentials',
    'Web Development',
    '45 minutes',
    'Intermediate',
    'Test your knowledge of HTML, CSS, JavaScript, and modern web development practices.',
    ARRAY['HTML', 'CSS', 'JavaScript', 'React', 'Web APIs'],
    0,
    0
  )
  RETURNING id INTO exam_uuid;

  -- Step 2: Insert all questions using the exam ID
  
  -- Question 1
  INSERT INTO exam_questions (
    exam_id,
    question_text,
    question_type,
    options,
    correct_answer,
    explanation,
    points,
    order_number
  ) VALUES (
    exam_uuid,
    'What does HTML stand for?',
    'multiple-choice',
    '["Hyper Text Markup Language", "High Tech Modern Language", "Home Tool Markup Language", "Hyperlinks and Text Markup Language"]',
    'Hyper Text Markup Language',
    'HTML stands for Hyper Text Markup Language, the standard markup language for creating web pages.',
    5,
    1
  );

  -- Question 2
  INSERT INTO exam_questions (
    exam_id,
    question_text,
    question_type,
    options,
    correct_answer,
    explanation,
    points,
    order_number
  ) VALUES (
    exam_uuid,
    'CSS stands for Cascading Style Sheets.',
    'true-false',
    '["True", "False"]',
    'True',
    'CSS (Cascading Style Sheets) is used to style and layout web pages.',
    5,
    2
  );

  -- Question 3
  INSERT INTO exam_questions (
    exam_id,
    question_text,
    question_type,
    options,
    correct_answer,
    explanation,
    points,
    order_number
  ) VALUES (
    exam_uuid,
    'Which method is used to add an element at the end of an array in JavaScript?',
    'multiple-choice',
    '["append()", "push()", "add()", "insert()"]',
    'push()',
    'The push() method adds one or more elements to the end of an array and returns the new length.',
    10,
    3
  );

  -- Question 4
  INSERT INTO exam_questions (
    exam_id,
    question_text,
    question_type,
    options,
    correct_answer,
    explanation,
    points,
    order_number
  ) VALUES (
    exam_uuid,
    'JavaScript is a compiled language.',
    'true-false',
    '["True", "False"]',
    'False',
    'JavaScript is an interpreted language, not a compiled one. It is executed line by line at runtime.',
    5,
    4
  );

  -- Question 5
  INSERT INTO exam_questions (
    exam_id,
    question_text,
    question_type,
    options,
    correct_answer,
    explanation,
    points,
    order_number
  ) VALUES (
    exam_uuid,
    'What does API stand for?',
    'short-answer',
    NULL,
    'Application Programming Interface',
    'API stands for Application Programming Interface, which allows different software applications to communicate.',
    10,
    5
  );

  -- Question 6
  INSERT INTO exam_questions (
    exam_id,
    question_text,
    question_type,
    options,
    correct_answer,
    explanation,
    points,
    order_number
  ) VALUES (
    exam_uuid,
    'Which HTML tag is used to define an external JavaScript file?',
    'multiple-choice',
    '["<javascript>", "<js>", "<script>", "<code>"]',
    '<script>',
    'The <script> tag is used to embed or reference JavaScript code in HTML documents.',
    10,
    6
  );

  -- Question 7
  INSERT INTO exam_questions (
    exam_id,
    question_text,
    question_type,
    options,
    correct_answer,
    explanation,
    points,
    order_number
  ) VALUES (
    exam_uuid,
    'React is a JavaScript library for building user interfaces.',
    'true-false',
    '["True", "False"]',
    'True',
    'React is a popular JavaScript library developed by Facebook for building user interfaces, especially single-page applications.',
    5,
    7
  );

  -- Question 8
  INSERT INTO exam_questions (
    exam_id,
    question_text,
    question_type,
    options,
    correct_answer,
    explanation,
    points,
    order_number
  ) VALUES (
    exam_uuid,
    'Which CSS property is used to change the text color?',
    'multiple-choice',
    '["text-color", "color", "font-color", "text-style"]',
    'color',
    'The ''color'' property in CSS is used to set the color of text.',
    10,
    8
  );

  -- Output the exam ID
  RAISE NOTICE 'Exam created with ID: %', exam_uuid;
  RAISE NOTICE 'Total Questions: 8';
  RAISE NOTICE 'Total Points: 60';
  RAISE NOTICE 'View at: /exams/%', exam_uuid;

END $$;
