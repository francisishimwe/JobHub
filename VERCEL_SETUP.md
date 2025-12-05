# Vercel Deployment Guide for RwandaJobHub

## Environment Variables Setup

### Required Environment Variables

When deploying to Vercel, you need to set up the following environment variables in your Vercel project settings:

1. **NEXT_PUBLIC_SUPABASE_URL**
   - Value: `https://ususiljxhkrjvzfcixcr.supabase.co`
   - Description: Your Supabase project URL

2. **NEXT_PUBLIC_SUPABASE_ANON_KEY**
   - Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzdXNpbGp4aGtyanZ6ZmNpeGNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI2ODA4MTgsImV4cCI6MjA3ODI1NjgxOH0.7t-jgiRi4HF19y2WIiXcYDwRwyOll1Wd0Og2OgjhN5A`
   - Description: Your Supabase anonymous/public key

3. **NEXT_PUBLIC_SITE_URL**
   - Value: `https://your-domain.vercel.app` (or your custom domain)
   - Description: Your production site URL for Open Graph metadata

### Steps to Add Environment Variables in Vercel

1. **Go to Vercel Dashboard**
   - Visit https://vercel.com/dashboard
   - Select your project (RwandaJobHub)

2. **Navigate to Settings**
   - Click on the "Settings" tab at the top
   - Select "Environment Variables" from the left sidebar

3. **Add Each Variable**
   - Click "Add New" button
   - Enter the **Name** (e.g., `NEXT_PUBLIC_SUPABASE_URL`)
   - Enter the **Value**
   - Select **Environment**: Choose "Production", "Preview", and "Development" (all three)
   - Click "Save"

4. **Repeat for All Variables**
   - Add all three environment variables listed above

5. **Redeploy**
   - After adding variables, go to "Deployments" tab
   - Find your latest deployment
   - Click the three dots (...) menu
   - Select "Redeploy"
   - Check "Use existing Build Cache" (optional)
   - Click "Redeploy"

### Important Notes

- **NEXT_PUBLIC_SITE_URL** is critical for:
  - Dynamic favicons (company logos)
  - Open Graph metadata for WhatsApp/social sharing
  - Canonical URLs for SEO
  
- Make sure to update `NEXT_PUBLIC_SITE_URL` with your actual production domain after deployment

- If you have a custom domain, use that instead of the `.vercel.app` domain

## WhatsApp Link Preview Configuration

The app is now configured to show:
- **Dynamic Favicon**: Company logo appears as the page favicon
- **OG Image**: Company logo appears in WhatsApp link previews
- **Required Meta Tags**: All Facebook/WhatsApp sharing debugger requirements met
  - `og:url` ✅
  - `og:image` with proper dimensions (1200x630) ✅
  - `og:title` ✅
  - `og:description` ✅
  - `og:type` ✅

### Testing Social Sharing

1. **Facebook Sharing Debugger**
   - URL: https://developers.facebook.com/tools/debug/
   - Paste your job URL
   - Click "Debug" to see how it will appear

2. **WhatsApp Preview**
   - Send the link to yourself on WhatsApp
   - The company logo should appear in the preview

3. **LinkedIn Post Inspector**
   - URL: https://www.linkedin.com/post-inspector/
   - Paste your job URL to verify

### Troubleshooting

If images don't appear:
1. Clear the cache in Facebook Sharing Debugger
2. Ensure company logos are publicly accessible URLs
3. Verify `NEXT_PUBLIC_SITE_URL` is set correctly
4. Check that company logos are uploaded to Supabase storage with public access

## Build & Deployment

Vercel will automatically:
- Detect Next.js framework
- Install dependencies with `npm install` or `pnpm install`
- Build with `npm run build` or `pnpm build`
- Deploy to production

No additional configuration needed!
