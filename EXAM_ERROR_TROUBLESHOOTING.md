# Exam Addition Error - Troubleshooting Guide

## Problem
Getting "Error adding exam: {}" when trying to add exams to the database.

## Root Cause Analysis
The empty object error `{}` typically means one of these issues:

1. **Database tables don't exist** ❌
2. **Supabase not configured properly** ❌  
3. **RLS (Row Level Security) blocking inserts** ❌

## Solution Steps

### Step 1: Check Supabase Configuration

Open your `.env.local` file and verify you have:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-key-here
```

**Do NOT use:**
- `https://placeholder.supabase.co` ❌
- Placeholder keys ❌

### Step 2: Create Database Tables

1. Go to your Supabase Dashboard
2. Click on "SQL Editor" in the left sidebar
3. Click "New Query"
4. Copy the **entire contents** of `supabase/exams-schema.sql`
5. Paste into the SQL Editor
6. Click "Run" or press `Ctrl+Enter`
7. Wait for success message

### Step 3: Verify Tables Were Created

After running the schema SQL, scroll down in the SQL Editor and run these verification queries:

```sql
-- Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('exams', 'exam_questions');
```

You should see 2 rows (one for each table).

### Step 4: Test the Application

1. Restart your dev server:
   ```bash
   # Stop the current server (Ctrl+C)
   npm run dev
   ```

2. Try adding an exam again

3. Check the browser console for detailed error logs (we added extensive logging)

## Debugging with Browser Console

When you try to add an exam now, you'll see these logs:
- `Adding exam with data:` - Shows what data is being sent
- `Inserting exam:` - Shows the exact object being inserted
- `Exam insert result:` - Shows if the insert was successful
- `Exam insert error:` - **Shows the actual error message!**
- `Error details:` - Shows Supabase error details (code, message, hint)

## Common Error Codes

If you see an error code in the console:

- **`42P01`** = Table doesn't exist → Run the schema SQL
- **`42703`** = Column doesn't exist → Schema mismatch, check table structure
- **`23505`** = Duplicate key violation → Trying to insert duplicate ID
- **Connection refused** → Check Supabase URL configuration

## Still Having Issues?

1. **Check the browser console** - Our enhanced logging will show the exact error
2. **Check Supabase Dashboard Logs** - Go to Database → Logs to see server-side errors
3. **Verify RLS policies** - Make sure the insert policies are enabled (the schema creates them)
4. **Check API Keys** - Ensure your anon key has proper permissions

## Next Steps

After fixing the database issue, you might want to:

1. Remove the debug `console.log` statements (or keep them for now)
2. Set up proper authentication for exam creation
3. Add more restrictive RLS policies based on your auth setup
