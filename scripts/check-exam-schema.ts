/**
 * Database Schema Checker for Exams
 * 
 * This script verifies that the necessary Supabase tables exist
 * and helps debug exam creation issues.
 */

import { supabase } from './lib/supabase'

async function checkDatabaseSchema() {
    console.log('🔍 Checking Supabase Configuration...\n')

    // Check if Supabase is configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const hasAnonKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    console.log('Supabase URL:', supabaseUrl)
    console.log('Has Anon Key:', hasAnonKey)
    console.log('Is Placeholder:', supabaseUrl?.includes('placeholder'))
    console.log('')

    if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
        console.error('❌ ERROR: Supabase is not configured!')
        console.error('Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file')
        return
    }

    try {
        // Test connection by trying to query the exams table
        console.log('🔗 Testing connection to exams table...')
        const { data: examsData, error: examsError } = await supabase
            .from('exams')
            .select('*')
            .limit(1)

        if (examsError) {
            console.error('❌ Error accessing exams table:')
            console.error('  Message:', examsError.message)
            console.error('  Code:', examsError.code)
            console.error('  Details:', examsError.details)
            console.error('  Hint:', examsError.hint)

            if (examsError.code === '42P01') {
                console.error('\n💡 The "exams" table does not exist in your database!')
                console.error('You need to create it using SQL in your Supabase dashboard.')
            }
        } else {
            console.log('✅ Exams table exists and is accessible')
            console.log('  Current exam count:', examsData?.length || 0)
        }

        console.log('')

        // Test exam_questions table
        console.log('🔗 Testing connection to exam_questions table...')
        const { data: questionsData, error: questionsError } = await supabase
            .from('exam_questions')
            .select('*')
            .limit(1)

        if (questionsError) {
            console.error('❌ Error accessing exam_questions table:')
            console.error('  Message:', questionsError.message)
            console.error('  Code:', questionsError.code)
            console.error('  Details:', questionsError.details)
            console.error('  Hint:', questionsError.hint)

            if (questionsError.code === '42P01') {
                console.error('\n💡 The "exam_questions" table does not exist in your database!')
                console.error('You need to create it using SQL in your Supabase dashboard.')
            }
        } else {
            console.log('✅ Exam questions table exists and is accessible')
            console.log('  Current question count:', questionsData?.length || 0)
        }

        console.log('')

        // Show recommended SQL schema
        if (examsError?.code === '42P01' || questionsError?.code === '42P01') {
            console.log('📝 Run this SQL in your Supabase SQL Editor:\n')
            console.log(getSQLSchema())
        }

    } catch (err) {
        console.error('❌ Unexpected error:', err)
    }
}

function getSQLSchema() {
    return `
-- Create exams table
CREATE TABLE IF NOT EXISTS exams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT,
  duration TEXT,
  difficulty TEXT,
  description TEXT,
  topics TEXT[] DEFAULT '{}',
  participants INTEGER DEFAULT 0,
  rating DECIMAL DEFAULT 0,
  posted_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create exam_questions table
CREATE TABLE IF NOT EXISTS exam_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id UUID REFERENCES exams(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL,
  options TEXT,
  correct_answer TEXT NOT NULL,
  explanation TEXT,
  points INTEGER DEFAULT 1,
  order_number INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on exam_id for better performance
CREATE INDEX IF NOT EXISTS idx_exam_questions_exam_id ON exam_questions(exam_id);

-- Enable Row Level Security (optional but recommended)
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_questions ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public read access (adjust as needed)
CREATE POLICY "Allow public read access on exams" ON exams
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access on exam_questions" ON exam_questions
  FOR SELECT USING (true);

-- Create policies to allow insert (adjust as needed for your auth setup)
CREATE POLICY "Allow insert on exams" ON exams
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow insert on exam_questions" ON exam_questions
  FOR INSERT WITH CHECK (true);
`
}

// Run the check
checkDatabaseSchema()
    .then(() => {
        console.log('\n✨ Schema check complete!')
        process.exit(0)
    })
    .catch(err => {
        console.error('\n❌ Schema check failed:', err)
        process.exit(1)
    })
