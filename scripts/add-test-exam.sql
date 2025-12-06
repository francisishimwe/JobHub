-- SQL Script to Add Test Exam to Supabase
-- Run this directly in your Supabase SQL Editor

-- Step 1: Insert the exam
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
RETURNING id;

-- Step 2: Copy the exam ID from above and replace 'YOUR_EXAM_ID' below with it
-- Or run this second script separately after getting the exam ID

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
  'YOUR_EXAM_ID',
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
  'YOUR_EXAM_ID',
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
  'YOUR_EXAM_ID',
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
  'YOUR_EXAM_ID',
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
  'YOUR_EXAM_ID',
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
  'YOUR_EXAM_ID',
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
  'YOUR_EXAM_ID',
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
  'YOUR_EXAM_ID',
  'Which CSS property is used to change the text color?',
  'multiple-choice',
  '["text-color", "color", "font-color", "text-style"]',
  'color',
  'The ''color'' property in CSS is used to set the color of text.',
  10,
  8
);

-- Summary:
-- Total Questions: 8
-- Total Points: 60
-- Topics: HTML, CSS, JavaScript, React, Web APIs
