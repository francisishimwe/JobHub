# Supabase SQL Scripts for Test Exams

These SQL scripts allow you to add test exams directly through the Supabase SQL Editor.

## 📋 Available SQL Scripts

### 1. **add-test-exam-auto.sql** ⭐ **RECOMMENDED**
Fully automated script that adds an exam and all questions in one go.

**Features:**
- ✅ Single script execution
- ✅ Automatically handles exam ID
- ✅ Adds 8 questions
- ✅ No manual intervention needed

**How to Use:**
1. Open your [Supabase Dashboard](https://app.supabase.com)
2. Navigate to **SQL Editor**
3. Click **"New Query"**
4. Copy and paste the **entire content** of `add-test-exam-auto.sql`
5. Click **"Run"**
6. Check the output for the exam ID

---

### 2. **add-test-exam.sql**
Two-step manual process for more control.

**Features:**
- Manual control over exam ID
- Good for understanding the structure
- Requires replacing 'YOUR_EXAM_ID' placeholder

**How to Use:**
1. Open Supabase SQL Editor
2. Run **Step 1** (Insert exam)
3. Copy the returned exam ID
4. Replace all instances of `'YOUR_EXAM_ID'` with the actual ID
5. Run **Step 2** (Insert questions)

---

## 🎯 What Gets Created

**Exam Details:**
- **Title:** Web Development Essentials
- **Category:** Web Development
- **Duration:** 45 minutes
- **Difficulty:** Intermediate
- **Topics:** HTML, CSS, JavaScript, React, Web APIs

**Questions (8 total, 60 points):**
1. HTML acronym (5 pts) - Multiple Choice
2. CSS acronym (5 pts) - True/False
3. JavaScript array method (10 pts) - Multiple Choice
4. JavaScript compilation (5 pts) - True/False
5. API acronym (10 pts) - Short Answer
6. HTML script tag (10 pts) - Multiple Choice
7. React definition (5 pts) - True/False
8. CSS text color (10 pts) - Multiple Choice

---

## 🚀 Quick Start (Easiest Method)

1. **Go to Supabase Dashboard**
   ```
   https://app.supabase.com/project/YOUR_PROJECT/sql
   ```

2. **Run the automated script**
   - Open `add-test-exam-auto.sql`
   - Copy ALL content
   - Paste in SQL Editor
   - Click Run ✅

3. **View your exam**
   - Navigate to the exams table
   - Find the newly created exam
   - Or visit: `http://localhost:3000/exams/EXAM_ID`

---

## 📊 Verification

After running the script, verify the data:

```sql
-- Check if exam was created
SELECT * FROM exams 
WHERE title = 'Web Development Essentials'
ORDER BY posted_date DESC 
LIMIT 1;

-- Check questions count
SELECT COUNT(*) as question_count
FROM exam_questions
WHERE exam_id = 'YOUR_EXAM_ID';

-- View all questions for an exam
SELECT 
  order_number,
  question_text,
  question_type,
  points
FROM exam_questions
WHERE exam_id = 'YOUR_EXAM_ID'
ORDER BY order_number;
```

---

## 🔧 Troubleshooting

### Error: "relation exams does not exist"
**Solution:** Your database schema might be missing. Create the tables first.

### Error: "null value in column violates not-null constraint"
**Solution:** Check that all required fields are included in the INSERT statement.

### Error: "invalid input syntax for type uuid"
**Solution:** Make sure you're using the actual UUID returned from the exam insert, not 'YOUR_EXAM_ID' as a string.

---

## 🎨 Customizing the Script

To create your own exam, modify these sections:

```sql
-- Change exam details
INSERT INTO exams (
  title,           -- Change this
  category,        -- Change this
  duration,        -- Change this
  difficulty,      -- Change this
  description,     -- Change this
  topics,          -- Change this array
  ...
)

-- Change questions
INSERT INTO exam_questions (
  question_text,   -- Your question
  question_type,   -- 'multiple-choice', 'true-false', or 'short-answer'
  options,         -- JSON array for multiple choice
  correct_answer,  -- The right answer
  explanation,     -- Why it's correct
  points,          -- Point value
  order_number     -- Question order
)
```

---

## 📝 Tips

- Always use the **automated script** (`add-test-exam-auto.sql`) for simplicity
- Run scripts in a transaction if you want to test first:
  ```sql
  BEGIN;
  -- Your script here
  ROLLBACK; -- or COMMIT; when satisfied
  ```
- Check the Messages panel in Supabase SQL Editor for the exam ID
- Keep exam IDs handy for linking to the app

---

## ✅ Success!

Once your script runs successfully:
- ✅ Exam is in the database
- ✅ All questions are linked
- ✅ Ready to test in your app
- ✅ Accessible at `/exams/EXAM_ID`

Happy testing! 🎉
