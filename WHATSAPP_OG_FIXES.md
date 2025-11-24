# WhatsApp Open Graph & Favicon Fixes

## Issues Fixed

### 1. HTML Tags in WhatsApp Share Preview
**Problem:** When sharing job links on WhatsApp, HTML tags like `<p>`, `<strong>`, and HTML entities like `&amp;` were showing up in the description.

**Solution:** 
- Added `stripHtmlAndDecode()` helper function that:
  - Removes all HTML tags using regex: `/<[^>]*>/g`
  - Decodes common HTML entities (`&amp;`, `&lt;`, `&gt;`, `&quot;`, `&#39;`, `&nbsp;`)
  - Removes extra whitespace for clean formatting
- Applied this function to the job description before using it in Open Graph metadata

### 2. Favicon Not Displaying on WhatsApp
**Problem:** Favicons and preview images weren't showing when sharing on WhatsApp because they used relative URLs.

**Solution:**
- Constructed absolute URLs using the request headers to get the current domain
- Used `headers()` from Next.js to get the host
- Generated full URLs: `${protocol}://${host}/favicon-.png`
- Applied to both company logos and default favicon
- Ensured fallback to default Rwanda Job Hub logo when company logo is unavailable

## Files Modified

### `app/jobs/[id]/layout.tsx`
- Added `stripHtmlAndDecode()` helper function
- Imported `headers` from Next.js
- Updated `generateMetadata()` to:
  - Get base URL from request headers
  - Strip HTML from description
  - Use absolute URLs for all Open Graph images
- Updated `getDefaultMetadata()` to accept `baseUrl` parameter

## How It Works Now

1. **For Job Pages:**
   - Fetches job and company data from Supabase
   - Strips HTML tags and entities from job description
   - Creates absolute URLs for company logos
   - Falls back to Rwanda Job Hub logo if company logo is missing
   - Formats title as: `[Company] is hiring [Job] location: [Location] opportunity type: [Type] deadline is [Date]`

2. **For WhatsApp Sharing:**
   - Clean, readable description without HTML tags
   - Proper company logo or default logo displayed
   - All metadata properly formatted for social media platforms

## Testing

To test the fixes:
1. Deploy the changes to production
2. Share a job link on WhatsApp
3. Verify:
   - ✅ No HTML tags in description
   - ✅ Company logo displays correctly
   - ✅ All information is properly formatted

## Example Output

**Before:**
```
Description: <p>We are looking for <strong>experienced developers</strong> &amp; designers...</p>
Image: [not displayed]
```

**After:**
```
Description: We are looking for experienced developers & designers...
Image: [Company Logo displayed]
```
