-- ============================================
-- Storage Policies for Attachments Bucket
-- ============================================
-- This script creates storage policies for the attachments bucket
-- Run each section separately if you get "already exists" errors
-- ============================================

-- Step 1: Check existing policies (run this first)
SELECT 
    policyname,
    cmd as operation,
    CASE 
        WHEN cmd = 'SELECT' THEN 'Read'
        WHEN cmd = 'INSERT' THEN 'Upload'
        WHEN cmd = 'DELETE' THEN 'Delete'
    END as permission_type
FROM pg_policies 
WHERE schemaname = 'storage' 
AND tablename = 'objects'
ORDER BY cmd;

-- Step 2: If policies don't exist, create them
-- (Comment out any that already exist based on Step 1 results)

-- Policy 1: Public read access for attachments bucket
CREATE POLICY "rwandajobhub_attachments_public_read"
ON storage.objects FOR SELECT
USING ( bucket_id = 'attachments' );

-- Policy 2: Authenticated users can upload to attachments
CREATE POLICY "rwandajobhub_attachments_auth_insert"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'attachments' 
  AND auth.role() = 'authenticated'
);

-- Policy 3: Authenticated users can delete from attachments
CREATE POLICY "rwandajobhub_attachments_auth_delete"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'attachments' 
  AND auth.role() = 'authenticated'
);

-- Step 3: Verify policies were created
SELECT 
    policyname,
    cmd as operation
FROM pg_policies 
WHERE schemaname = 'storage' 
AND tablename = 'objects'
AND policyname LIKE '%rwandajobhub_attachments%'
ORDER BY cmd;

