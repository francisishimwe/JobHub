# Quick Setup: File Attachments Storage

## ⚠️ You're seeing upload errors because the storage bucket hasn't been created yet.

Follow these steps to set up file attachments:

## 📋 Step 1: Create Storage Bucket

### Option A: Via Supabase Dashboard (Recommended - 2 minutes)

1. **Open Supabase Dashboard**
   - Go to: https://supabase.com/dashboard
   - Select your project

2. **Navigate to Storage**
   - Click **Storage** in the left sidebar
   - Click **Create a new bucket** button

3. **Configure Bucket**
   - **Name**: `attachments` (exactly as written)
   - **Public bucket**: ✅ **ENABLE** (toggle ON)
   - **File size limit**: `10485760` (10MB in bytes)
   - **Allowed MIME types**: Leave empty or add:
     ```
     application/pdf
     application/msword
     application/vnd.openxmlformats-officedocument.wordprocessingml.document
     application/vnd.ms-excel
     application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
     ```
   - Click **Create bucket**

### Option B: Via SQL (Alternative)

Run this in Supabase SQL Editor:

```sql
-- Insert bucket configuration
INSERT INTO storage.buckets (id, name, public)
VALUES ('attachments', 'attachments', true)
ON CONFLICT (id) DO NOTHING;
```

## 📋 Step 2: Set Storage Policies

1. **Go to Storage Policies**
   - In Supabase Dashboard → Storage
   - Click on the **"attachments"** bucket
   - Click the **"Policies"** tab
   - Click **"New Policy"**

2. **Create Policy: Public Read Access**
   - Click **"For full customization"** or **"Create policy"**
   - **Policy name**: `Public Access`
   - **Allowed operation**: `SELECT`
   - **Policy definition**:
     ```sql
     bucket_id = 'attachments'
     ```
   - Click **"Review"** then **"Save policy"**

3. **Create Policy: Authenticated Upload**
   - Click **"New Policy"** again
   - **Policy name**: `Allow authenticated uploads`
   - **Allowed operation**: `INSERT`
   - **Policy definition**:
     ```sql
     bucket_id = 'attachments' AND auth.role() = 'authenticated'
     ```
   - Click **"Review"** then **"Save policy"**

4. **Create Policy: Authenticated Delete**
   - Click **"New Policy"** again
   - **Policy name**: `Allow authenticated deletes`
   - **Allowed operation**: `DELETE`
   - **Policy definition**:
     ```sql
     bucket_id = 'attachments' AND auth.role() = 'authenticated'
     ```
   - Click **"Review"** then **"Save policy"**

### Or Run All Policies via SQL:

```sql
-- Policy 1: Public read access
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'attachments' );

-- Policy 2: Authenticated users can upload
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'attachments' 
  AND auth.role() = 'authenticated'
);

-- Policy 3: Authenticated users can delete
CREATE POLICY "Allow authenticated deletes"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'attachments' 
  AND auth.role() = 'authenticated'
);
```

## 📋 Step 3: Run Database Migration

Execute this in Supabase SQL Editor:

```sql
-- Add attachment_url column to jobs table
ALTER TABLE jobs 
ADD COLUMN IF NOT EXISTS attachment_url TEXT;

COMMENT ON COLUMN jobs.attachment_url IS 'URL to uploaded attachment file (PDF, DOC, Excel) - nullable/optional';
```

Or run: `scripts/add-attachment-column.sql`

## 📋 Step 4: Test Upload

1. Refresh your application
2. Go to **Dashboard** → **Add Job**
3. Try uploading a file
4. ✅ Should work now!

## 🐛 Still Having Issues?

### Check Bucket Exists:
```sql
SELECT * FROM storage.buckets WHERE id = 'attachments';
```

Should return one row with:
- `id`: attachments
- `name`: attachments
- `public`: true

### Check Policies Exist:
```sql
SELECT * FROM pg_policies 
WHERE schemaname = 'storage' 
AND tablename = 'objects';
```

Should show your 3 policies.

### Check Column Added:
```sql
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'jobs' 
AND column_name = 'attachment_url';
```

Should return one row.

## ✅ Verification Checklist

- [ ] Storage bucket "attachments" created
- [ ] Bucket is set to PUBLIC
- [ ] Three storage policies added
- [ ] Database column `attachment_url` added
- [ ] Application refreshed
- [ ] File upload tested

---

**Estimated Setup Time**: 5 minutes

After completing these steps, file uploads will work! 🚀
