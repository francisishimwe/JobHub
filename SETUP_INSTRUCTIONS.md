# Logo Upload Fix - Setup Instructions

## Problem
The company logo upload is failing because Vercel Blob storage is not configured.

## Solution Options

### Option 1: Configure Vercel Blob Storage (Recommended)

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Select your project**
3. **Go to Settings → Environment Variables**
4. **Add new variable**:
   - Name: `BLOB_READ_WRITE_TOKEN`
   - Value: Get from Vercel Blob storage settings
5. **Set up Vercel Blob**:
   - In your project, go to Storage → Create Database → Blob
   - Or use existing blob storage token

### Option 2: Use Base64 Fallback (Already Implemented)

The upload endpoint now has a fallback that converts images to base64 when Vercel Blob is not configured. This allows logo uploads to work immediately.

## Quick Fix (Already Applied)

✅ **Fixed upload endpoint** (`/api/upload/logo`):
- Added base64 fallback when `BLOB_READ_WRITE_TOKEN` is missing
- Improved error handling
- Better error messages

✅ **Updated frontend** (`components/add-job-form.tsx`):
- Better error handling
- Fallback to base64 preview
- More descriptive error messages

## Testing

The logo upload should now work immediately with the base64 fallback. For production deployment, configure Vercel Blob storage for optimal performance.

## Files Modified

- `app/api/upload/logo/route.ts` - Added base64 fallback
- `components/add-job-form.tsx` - Improved error handling
- `SETUP_INSTRUCTIONS.md` - This file

## Next Steps

1. Test logo upload functionality
2. If working with base64, you're good to go!
3. For production, configure Vercel Blob storage following Option 1
