# Debugging Company Logo Display on WhatsApp

## Issue
Company logos are not displaying when sharing job links on WhatsApp.

## Potential Causes

### 1. **Supabase Storage URLs Require Authentication**
If company logos are stored in Supabase Storage, they might not be publicly accessible.

**Solution:** Make sure the Supabase Storage bucket is set to public:
```sql
-- Check if bucket is public
SELECT * FROM storage.buckets WHERE name = 'company-logos';

-- Make bucket public if it isn't
UPDATE storage.buckets 
SET public = true 
WHERE name = 'company-logos';
```

### 2. **URLs Not Absolute**
WhatsApp requires absolute URLs starting with `http://` or `https://`.

**Current Fix:** The code now handles:
- Absolute URLs: `https://example.com/logo.png` → Used as is
- Relative with `/`: `/logo.png` → `https://yourdomain.com/logo.png`
- Relative without `/`: `logo.png` → `https://yourdomain.com/logo.png`
- No logo: Falls back to `/favicon-.png`

### 3. **Image Size or Format Issues**
WhatsApp has requirements for Open Graph images:
- Minimum size: 200 x 200 pixels
- Recommended: 1200 x 630 pixels
- Supported formats: JPG, PNG
- Max file size: Usually 8MB

### 4. **HTTPS Required in Production**
WhatsApp will not display images from `http://` URLs in production.

## Debug Steps

### Step 1: Check Console Logs
Open your job page and check the server logs for:
```
🖼️ OG Image: { 
  company: 'Company Name', 
  original: '<original URL from database>', 
  generated: '<final URL used in meta tags>' 
}
```

### Step 2: View Page Source
1. Open the job page
2. Right-click → "View Page Source"
3. Search for `og:image`
4. Verify the URL is:
   - Absolute (starts with http:// or https://)
   - Publicly accessible (open in a new tab)

### Step 3: Test the Logo URL Directly
Copy the `og:image` URL from the page source and try to open it in a browser:
- ✅ If it loads → URL is correct
- ❌ If it doesn't load → Check Supabase Storage permissions or file existence

### Step 4: Use WhatsApp's Debugger##  Alternatively, use Facebook's Sharing Debugger:
`https://developers.facebook.com/tools/debug/`

Paste your job URL and click "Scrape Again" to see what WhatsApp sees.

## Quick Fix Options

### Option 1: Use External Image Hosting
Store logos on a public CDN like:
- Cloudinary
- ImgBB
- AWS S3 (with public bucket)

### Option 2: Make Supabase Storage Public
```sql
-- In your Supabase SQL editor
UPDATE storage.buckets 
SET public = true 
WHERE name = 'company-logos';

-- Also ensure RLS policies allow public access
CREATE POLICY "Public Access" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'company-logos');
```

### Option 3: Use Base64 Data URLs (Not Recommended)
WhatsApp doesn't support data URLs, so this won't work.

## Testing the Fix

1. Make changes
2. Deploy to production (localhost won't work for WhatsApp)
3. Share a job link on WhatsApp
4. Check if the company logo appears in the preview

## Common Logo URL Patterns

```
✅ Good:
- https://your-project.supabase.co/storage/v1/object/public/company-logos/radisson.png
- https://cdn.example.com/logos/company.jpg
- https://yourdomain.com/public/logo.png

❌ Bad:
- /logo.png (relative)
- http://localhost:3000/logo.png (localhost)
- data:image/png;base64... (data URL)
- https://private-bucket.supabase.co/... (requires auth)
```

## Current Implementation

The code now:
1. Checks if logo URL is already absolute → use it
2. If relative → convert to absolute using current domain
3. If no logo → use default favicon
4. Logs the generated URL for debugging

Check your console logs to see what URL is being generated!
