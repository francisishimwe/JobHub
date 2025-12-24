# Security Implementation Guide

## 🔒 Security Measures Implemented

### 1. **Environment Variables Protection**
All sensitive credentials are now stored in environment variables:
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL (public)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key (public, limited permissions)
- `SUPABASE_SERVICE_ROLE_KEY` - Admin key (SERVER-SIDE ONLY, never exposed)
- `CRON_SECRET` - Secret for cron job authentication

**✅ What's Protected:**
- API keys are never hardcoded in source code
- Service role key is only used server-side
- `.env.local` is ignored by git
- `.env.example` template provided without real values

### 2. **API Route Security**

#### Rate Limiting
All API endpoints now have rate limiting to prevent abuse:
- `track-application`: 50 requests/minute
- `job-stats`: 200 requests/minute
- `collect-email`: 20 requests/minute
- `analytics/total-views`: 100 requests/minute
- `cleanup-expired-jobs`: Protected by CRON_SECRET

#### Origin Validation
Critical endpoints validate the request origin to prevent CSRF attacks.

#### Request Validation
- All inputs are validated before processing
- Email format validation
- Required fields checking
- Type checking

### 3. **Supabase Client Architecture**

#### Client-Side (`lib/supabase.ts`)
- Uses `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Limited permissions via Row Level Security (RLS)
- Safe to use in browser

#### Server-Side (`lib/supabase/server.ts`)
- Uses cookies for authentication
- Proper session handling
- Used in API routes and server components

#### Admin Client (`lib/supabase/admin.ts`)
- Uses `SUPABASE_SERVICE_ROLE_KEY`
- **NEVER** exposed to client
- Only for administrative operations
- Used in cleanup jobs and admin tasks

### 4. **Cron Job Protection**

The cleanup endpoint (`/api/cleanup-expired-jobs`) requires Bearer token authentication:
```bash
Authorization: Bearer YOUR_CRON_SECRET
```

**To call this endpoint:**
```bash
curl -X GET https://your-domain.com/api/cleanup-expired-jobs \
  -H "Authorization: Bearer your_cron_secret_here"
```

### 5. **Error Message Sanitization**

All API routes now return generic error messages to users while logging detailed errors server-side. This prevents information leakage.

## 🚀 Setup Instructions

### 1. **Configure Environment Variables**

Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Fill in your actual values in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...  # From Supabase Settings > API
CRON_SECRET=generate_a_secure_random_string
```

### 2. **Generate Secure CRON_SECRET**

```bash
# Using OpenSSL (recommended)
openssl rand -base64 32

# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Using PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

### 3. **Configure Vercel (Production)**

Add environment variables in Vercel Dashboard:
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add each variable from `.env.local`
4. Set the environment (Production, Preview, Development)

### 4. **Setup Supabase Row Level Security (RLS)**

Enable RLS on your tables:

```sql
-- Enable RLS on jobs table
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access" ON jobs
  FOR SELECT USING (true);

-- Allow authenticated inserts (if needed)
CREATE POLICY "Allow authenticated inserts" ON jobs
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Similar policies for other tables
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
```

## 🛡️ Security Best Practices

### ✅ DO:
- Keep `.env.local` in `.gitignore`
- Use strong, unique secrets
- Rotate secrets regularly
- Use RLS on all Supabase tables
- Validate all user inputs
- Use rate limiting on public APIs
- Log security events
- Use HTTPS in production
- Keep dependencies updated

### ❌ DON'T:
- Commit `.env.local` to git
- Hardcode API keys in source code
- Expose service role key to client
- Trust user input without validation
- Return detailed errors to users
- Use the same secrets in dev and prod
- Disable security features "temporarily"

## 🔍 Verifying Security

### Check for Exposed Secrets
```bash
# Search for potential leaked keys
git grep -i "supabase.*key\|api.*key\|secret"

# Check git history for leaked secrets
git log -p | grep -i "api.*key\|secret.*key"
```

### Test Rate Limiting
```bash
# Should succeed for first 50 requests, then return 429
for i in {1..60}; do
  curl -X POST https://your-domain.com/api/track-application \
    -H "Content-Type: application/json" \
    -d '{"jobId":"test"}'
  echo " - Request $i"
done
```

### Test Cron Authentication
```bash
# Should fail without token
curl https://your-domain.com/api/cleanup-expired-jobs

# Should succeed with token
curl https://your-domain.com/api/cleanup-expired-jobs \
  -H "Authorization: Bearer your_cron_secret"
```

## 📋 Security Checklist

- [x] Environment variables properly configured
- [x] `.gitignore` updated to exclude sensitive files
- [x] `.env.example` created without real values
- [x] Admin client created for server-side operations
- [x] API routes protected with rate limiting
- [x] Origin validation implemented
- [x] Cron endpoints secured with secrets
- [x] Error messages sanitized
- [ ] Supabase RLS policies configured
- [ ] Production secrets generated and stored securely
- [ ] Vercel environment variables configured
- [ ] Security testing completed
- [ ] Monitoring and alerting setup

## 🚨 What to Do If Credentials Are Leaked

1. **Immediately rotate all affected credentials**
   - Generate new Supabase keys
   - Generate new CRON_SECRET
   - Update in Vercel and `.env.local`

2. **Revoke the old credentials** in Supabase Dashboard

3. **Review access logs** for unauthorized usage

4. **Update git history** to remove secrets:
   ```bash
   # Use BFG Repo Cleaner or git-filter-repo
   ```

5. **Monitor for unusual activity**

## 📞 Support

For security concerns, contact your team lead immediately.
Never discuss security issues in public channels.
