# Test Exam Scripts

This directory contains scripts to add sample exams to your Supabase database for testing purposes.

## Available Scripts

### 1. **quick-add-exam.js** (Recommended - Easiest)
Simple Node.js script that adds a "Web Development Essentials" exam with 8 questions.

**Usage:**
```bash
node scripts/quick-add-exam.js
```

**Features:**
- 8 questions covering HTML, CSS, JavaScript, React
- Mix of multiple-choice, true/false, and short-answer questions
- Total of 60 points
- Ready to run immediately

---

### 2. **add-sample-exam.ts**
TypeScript version with a comprehensive "Software Engineering Fundamentals" exam.

**Usage:**
```bash
npx tsx scripts/add-sample-exam.ts
```

**Features:**
- 10 questions covering data structures, algorithms, OOP, design patterns
- Multiple question types
- Detailed explanations for each answer
- 85 total points

---

### 3. **browser-add-exam.js**
Browser-compatible script for adding exams via console.

**Usage:**
1. Start your development server: `npm run dev`
2. Open browser console (F12)
3. Copy and paste the entire content of `browser-add-exam.js`
4. Call `addTestExam()`

---

## Quick Start

The fastest way to add a test exam:

```bash
# Make sure you're in the project root
cd /path/to/KoraJ

# Run the quick script
node scripts/quick-add-exam.js
```

## Requirements

- Node.js installed
- `.env.local` file with Supabase credentials:
  ```
  NEXT_PUBLIC_SUPABASE_URL=your-url
  NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
  ```

## Exam Structure

Each test exam includes:
- **Exam metadata**: title, category, duration, description, topics
- **Questions**: with text, type, options (if multiple choice), correct answer, explanation, and points

## Question Types Supported

1. **multiple-choice**: Questions with 2-4 options
2. **true-false**: Binary choice questions  
3. **short-answer**: Text-based answers

## After Running

Once the script completes, you'll see:
- ✅ Exam ID
- ✅ Number of questions added
- ✅ Total points
- ✅ URL to view the exam in your app

Navigate to the provided URL to test the exam functionality!

## Troubleshooting

**Error: Cannot find module '@supabase/supabase-js'**
```bash
npm install @supabase/supabase-js
```

**Error: dotenv not found**
```bash
npm install dotenv
```

**Connection Error:**
- Check your `.env.local` file
- Verify Supabase credentials are correct
- Ensure your Supabase project is running
