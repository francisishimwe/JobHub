-- ============================================
-- Fix Storage RLS Policy Issues
-- ============================================
-- This fixes "row violates row-level security policy" error
-- ============================================

-- Step 1: Drop existing restrictive policies
DROP POLICY IF EXISTS "rwandajobhub_attachments_auth_insert" ON storage.objects;
DROP POLICY IF EXISTS "rwandajobhub_attachments_auth_delete" ON storage.objects;

-- Step 2: Create more permissive policies for authenticated users
-- Allow all authenticated users to insert files
CREATE POLICY "rwandajobhub_attachments_insert_authenticated"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'attachments' );

-- Allow all authenticated users to update their files
CREATE POLICY "rwandajobhub_attachments_update_authenticated"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'attachments' )
WITH CHECK ( bucket_id = 'attachments' );

-- Allow all authenticated users to delete files
CREATE POLICY "rwandajobhub_attachments_delete_authenticated"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'attachments' );

-- Step 3: Verify new policies
SELECT 
    policyname,
    cmd as operation,
    roles
FROM pg_policies 
WHERE schemaname = 'storage' 
AND tablename = 'objects'
AND policyname LIKE '%rwandajobhub_attachments%'
ORDER BY cmd;

-- Step 4: Verify bucket configuration
SELECT id, name, public, file_size_limit, allowed_mime_types
FROM storage.buckets 
WHERE id = 'attachments';
