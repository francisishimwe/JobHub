# Quick Fix for CV Submission Issues

## Step 1: Diagnose the Problem
Visit this URL to see what's wrong:
```
https://www.rwandajobhub.rw/api/diagnose
```

This will tell you:
- If your database connection is working
- If tables exist
- If there are jobs in the database
- What environment variables are missing

## Step 2: Try the Simple CV API
If the original CV submission doesn't work, try this simplified version:
- Change your CV form to submit to `/api/cv-profiles-simple` instead of `/api/cv-profiles`
- This version bypasses job validation and creates dummy jobs if needed

## Step 3: Quick Database Setup

### Option A: Create Sample Job
```bash
curl -X POST https://www.rwandajobhub.rw/api/setup-sample-job
```

### Option B: Run Database Setup
```bash
node setup-neon-database.js
```

## Step 4: Check Environment Variables
Make sure you have `DATABASE_URL` set in your hosting platform with your Neon connection string.

## Step 5: Test Again
After running the setup, try submitting a CV again.

## If Still Not Working

1. **Check the diagnostic output** from Step 1
2. **Verify your Neon database** is running and accessible
3. **Check the browser console** for specific error messages
4. **Try the simple API** at `/api/cv-profiles-simple`

## Emergency Fix

If nothing else works, temporarily modify your CV form to submit to:
```
/api/cv-profiles-simple
```

This version is more forgiving and should work even with database setup issues.
