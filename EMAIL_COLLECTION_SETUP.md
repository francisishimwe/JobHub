# Email Collection Setup Instructions

## Admin Credentials
```
Email: admin@RwandaJobHub.com
Password: Koral.admin@1234567890
```

## Database Setup

### Step 1: Add Email Subscribers Table to Supabase

Go to your Supabase project SQL Editor and run this SQL:

```sql
-- Create email_subscribers table
CREATE TABLE email_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);

-- Enable Row Level Security
ALTER TABLE email_subscribers ENABLE ROW LEVEL SECURITY;

-- Allow anyone to subscribe (insert)
CREATE POLICY "Anyone can subscribe"
  ON email_subscribers FOR INSERT
  WITH CHECK (true);

-- Only authenticated users can view subscribers
CREATE POLICY "Authenticated users can view subscribers"
  ON email_subscribers FOR SELECT
  USING (auth.role() = 'authenticated');

-- Create indexes for better performance
CREATE INDEX idx_email_subscribers_email ON email_subscribers(email);
CREATE INDEX idx_email_subscribers_subscribed_at ON email_subscribers(subscribed_at DESC);
```

### Step 2: Verify Environment Variables

Make sure your `.env.local` file has these variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Step 3: How It Works

1. **Email Collection Overlay**:
   - Appears after 3 seconds for first-time visitors
   - Won't show if user is logged in as admin
   - Won't show again after user subscribes or clicks "Maybe Later"

2. **API Route** (`/api/collect-email`):
   - Validates email format
   - Saves email to Supabase `email_subscribers` table
   - Handles duplicate emails gracefully
   - Returns success/error responses

3. **Database Storage**:
   - All emails are stored in `email_subscribers` table
   - Each email has a unique constraint (no duplicates)
   - Timestamps show when users subscribed
   - `is_active` field allows you to manage unsubscribes

### Step 4: View Collected Emails

To view all collected emails in Supabase:

1. Go to your Supabase Dashboard
2. Navigate to Table Editor
3. Select `email_subscribers` table
4. You'll see all subscribed emails with timestamps

OR run this SQL query:

```sql
SELECT * FROM email_subscribers 
WHERE is_active = true 
ORDER BY subscribed_at DESC;
```

### Step 5: Export Emails

To export emails for your email marketing tool:

```sql
SELECT email FROM email_subscribers 
WHERE is_active = true 
ORDER BY subscribed_at DESC;
```

## Testing

1. Open your site in incognito/private mode
2. Wait 3 seconds for the overlay to appear
3. Enter an email and click "Subscribe to Updates"
4. Check your Supabase `email_subscribers` table
5. The email should be saved there!

## Notes

- Emails are stored in lowercase and trimmed
- Duplicate emails are handled gracefully
- The overlay uses localStorage to prevent showing again
- Admins (logged in users) never see the overlay
