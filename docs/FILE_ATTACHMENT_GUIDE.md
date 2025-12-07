# 📎 File Attachment Feature for Jobs

## Overview

I've added file attachment functionality to the job creation form. Admins can now upload documents (PDF, DOC, Excel files) when adding jobs.

## ✅ What Was Implemented

### 1. **Database Schema**
- Added `attachment_url` column to the `jobs` table
- Column stores the public URL of uploaded files
- Nullable/optional field

### 2. **File Upload Support**
Supported file types:
- **PDF** (.pdf)
- **Word Documents** (.doc, .docx)
- **Excel Spreadsheets** (.xls, .xlsx)

**Limitations:**
- Maximum file size: **10MB**
- One file per job posting

### 3. **Upload Process**
1. Admin selects a file using the file input
2. File is validated (type and size)
3. File is uploaded to Supabase Storage bucket: `attachments`
4. Public URL is stored in the job record
5. File name and size are displayed

### 4. **UI Components**
- File input field in Add Job form
- Upload progress indicator
- File information display (name, size)
- Clear button to remove selected file

## 📋 Setup Required

### **Step 1: Run SQL Migration**

Execute this in your Supabase SQL Editor:

\`\`\`sql
-- Add attachment_url column to jobs table
ALTER TABLE jobs 
ADD COLUMN IF NOT EXISTS attachment_url TEXT;

COMMENT ON COLUMN jobs.attachment_url IS 'URL to uploaded attachment file (PDF, DOC, Excel) - nullable/optional';
\`\`\`

Or run the script: \`scripts/add-attachment-column.sql\`

### **Step 2: Create Supabase Storage Bucket**

1. Go to your Supabase Dashboard
2. Navigate to **Storage** → **Buckets**
3. Click **Create Bucket**
4. Set the following:
   - **Name**: \`attachments\`
   - **Public**: ✅ Yes (checked)
   - **File size limit**: 10485760 bytes (10MB)
   - **Allowed MIME types**: 
     - \`application/pdf\`
     - \`application/msword\`
     - \`application/vnd.openxmlformats-officedocument.wordprocessingml.document\`
     - \`application/vnd.ms-excel\`
     - \`application/vnd.openxmlformats-officedocument.spreadsheetml.sheet\`

5. Click **Create Bucket**

### **Step 3: Set Storage Policies**

In Supabase Storage → **Policies** tab for the "attachments" bucket:

**Allow Public Access (Read)**:
\`\`\`sql
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'attachments' );
\`\`\`

**Allow Authenticated Upload**:
\`\`\`sql
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'attachments' AND auth.role() = 'authenticated');
\`\`\`

**Allow Authenticated Delete**:
\`\`\`sql
CREATE POLICY "Allow authenticated deletes"
ON storage.objects FOR DELETE
USING (bucket_id = 'attachments' AND auth.role() = 'authenticated');
\`\`\`

## 🎯 How to Use

### **For Admins (Adding Jobs)**

1. Go to **Dashboard** → **Add Job**
2. Fill in the required job details
3. Scroll to the **Attachment** field
4. Click **Choose File** and select a document
5. Wait for upload confirmation
6. The file name and size will be displayed
7. Click **Add Job** to save

**To Remove a File:**
- Click the **Clear** button next to the file input
- Select a different file if needed

### **For Users (Viewing Jobs)**

*Note: You'll need to add a download/view link in the job details page to display the attachment to users.*

## 📁 File Storage Structure

Files are stored in Supabase Storage with this structure:

\`\`\`
attachments/
  └── job-attachments/
      ├── 1702123456789-abc123.pdf
      ├── 1702123456790-def456.docx
      └── 1702123456791-ghi789.xlsx
\`\`\`

**File Naming Convention:**
- Format: \`{timestamp}-{randomID}.{extension}\`
- Example: \`1702123456789-abc123.pdf\`
- Prevents naming conflicts
- Unique for each upload

## 🔧 Technical Details

### **Modified Files**

1. \`lib/types.ts\` - Added \`attachmentUrl?: string\`
2. \`components/add-job-form.tsx\` - Added file upload UI and logic
3. \`lib/job-context.tsx\` - Added attachment handling in CRUD operations
4. \`scripts/add-attachment-column.sql\` - Database migration script

### **Upload Flow**

\`\`\`
User selects file
    ↓
Validate type & size
    ↓
Upload to Supabase Storage
    ↓
Get public URL
    ↓
Store URL in formData
    ↓
Save with job record
\`\`\`

### **Error Handling**

- Invalid file type → Alert user
- File too large → Alert user
- Upload failure → Alert user & clear selection
- Network error → Alert user & retry option

## 🎨 Displaying Attachments (TO DO)

To show attachments on job detail pages, add this to \`components/job-details-content.tsx\`:

\`\`\`typescript
{job.attachmentUrl && (
  <div className="mt-4">
    <h3 className="text-lg font-semibold mb-2">Attachment</h3>
    <a 
      href={job.attachmentUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
    >
      <Download className="h-4 w-4" />
      Download Attachment
    </a>
  </div>
)}
\`\`\`

## 🔒 Security Considerations

1. **File Type Validation**: Only specific MIME types allowed
2. **File Size Limit**: 10MB maximum
3. **Authentication**: Upload requires authenticated user
4. **Public Access**: Files are publicly accessible (read-only)
5. **Unique Filenames**: Prevents overwriting and conflicts

## 🐛 Troubleshooting

### **Upload Fails**

1. Check Supabase Storage bucket exists
2. Verify bucket is public
3. Check storage policies are set correctly
4. Verify file size < 10MB
5. Check file type is supported

### **File Not Displaying**

1. Check \`attachment_url\` column exists in database
2. Verify public URL is accessible
3. Check storage bucket permissions

### **Cannot Delete Old Files**

1. Files remain in storage even if job is deleted
2. Implement cleanup script or manual deletion
3. Consider lifecycle policies in Supabase

## 📊 Database Column Details

\`\`\`sql
Column Name: attachment_url
Data Type: TEXT
Nullable: Yes
Default: NULL
Purpose: Stores public URL to uploaded file
\`\`\`

## 🚀 Future Enhancements

1. **Multiple Files**: Allow multiple attachments per job
2. **File Preview**: Show PDF/document preview inline
3. **Auto-deletion**: Delete file when job is deleted
4. **Download Stats**: Track attachment downloads
5. **File Versioning**: Keep history of uploaded files
6. **Drag & Drop**: Drag and drop file upload
7. **Progress Bar**: Visual upload progress indicator

---

## ✅ Checklist

Before using this feature:

- [ ] Run SQL migration (\`add-attachment-column.sql\`)
- [ ] Create "attachments" bucket in Supabase Storage
- [ ] Set bucket to public
- [ ] Configure storage policies
- [ ] Test file upload
- [ ] Add attachment display to job details page
- [ ] Test file download

---

**Feature Status**: ✅ Ready to use (after running SQL and setting up storage)
