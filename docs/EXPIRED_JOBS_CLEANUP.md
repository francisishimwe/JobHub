# Automatic Expired Jobs Cleanup

This system automatically removes job opportunities that have passed their deadline.

## How It Works

### 1. **Client-Side Filtering**
- When jobs are fetched from the database, expired jobs are automatically filtered out
- Jobs without a deadline never expire
- Jobs are considered expired if their deadline is before today

### 2. **Automatic Database Cleanup**
- Runs when the application loads
- Runs periodically every hour
- Deletes expired jobs from the database permanently

### 3. **Manual Cleanup (Optional)**
You can manually trigger cleanup by calling the API endpoint:

```bash
# GET or POST request
curl -X POST http://localhost:3000/api/cleanup-expired-jobs
```

Or visit in browser:
```
http://localhost:3000/api/cleanup-expired-jobs
```

## Files Involved

- **`app/api/cleanup-expired-jobs/route.ts`** - API endpoint for deleting expired jobs
- **`lib/cleanup-jobs.ts`** - Utility functions for filtering and cleanup
- **`lib/job-context.tsx`** - Integrated automatic cleanup on app load and hourly

## Setting Up Automated Cleanup (Optional)

For production, you can set up a cron job to call the cleanup endpoint regularly:

### Option 1: Using Vercel Cron Jobs
Add to `vercel.json`:
```json
{
  "crons": [{
    "path": "/api/cleanup-expired-jobs",
    "schedule": "0 */6 * * *"
  }]
}
```

### Option 2: Using External Cron Service
Use services like:
- **cron-job.org**
- **EasyCron**
- **GitHub Actions**

Configure them to call: `https://your-domain.com/api/cleanup-expired-jobs`

### Option 3: Add Authentication (Recommended for Production)
Protect the endpoint by uncommenting the auth check in `route.ts`:

1. Add to `.env.local`:
```
CRON_SECRET=your-secret-key-here
```

2. Uncomment the auth check in the route file
3. Include the secret in your cron job header:
```bash
Authorization: Bearer your-secret-key-here
```

## Testing

To test the cleanup:
1. Create a job with a past deadline
2. Visit `http://localhost:3000/api/cleanup-expired-jobs`
3. Check the response - it should show the deleted job
4. Verify the job is no longer visible in the app

## Benefits

- ✅ Keeps database clean
- ✅ Improves performance
- ✅ Better user experience (no outdated opportunities)
- ✅ Automatic - no manual intervention needed
- ✅ Multiple layers (client filter + database cleanup)
