# Analytics Integration Setup Guide

## Current Status
The analytics dashboard is ready to display real data, but requires Supabase database setup.

## Quick Setup (5 minutes)

### Step 1: Create Analytics Tables in Supabase

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Run the SQL script from `supabase/analytics-schema.sql`

This will create two tables:
- `page_views` - Tracks every page view with device, browser, country info
- `visitors` - Tracks unique visitors

### Step 2: Add Analytics Tracker to Your App

Add this to your `app/layout.tsx` (inside the `<body>` tag):

```tsx
import { AnalyticsTracker } from "@/components/analytics-tracker"

// Inside <body>:
<AnalyticsTracker />
```

This will automatically track:
- Page views
- Unique visitors
- Device types (Mobile/Desktop/Tablet)
- Browsers (Chrome, Safari, Firefox, etc.)
- Countries (using IP geolocation)

### Step 3: That's It!

The analytics dashboard will now show REAL data from your Supabase database instead of mock data.

## How It Works

1. **AnalyticsTracker** component runs on every page
2. It detects device type, browser, and gets country from IP
3. Saves data to Supabase `page_views` and `visitors` tables
4. **Analytics Dashboard** fetches and displays this data

## Alternative: Use Vercel Analytics Dashboard

If you prefer to use Vercel's built-in analytics:
1. Go to your Vercel project dashboard
2. Enable Analytics in Settings
3. View analytics at: `https://vercel.com/[your-team]/[your-project]/analytics`

Note: Vercel Analytics doesn't provide an API to fetch data programmatically, so you can only view it in their dashboard.

## Current Implementation

For now, the dashboard shows placeholder data. Once you complete Step 1 & 2 above, it will show real analytics!
