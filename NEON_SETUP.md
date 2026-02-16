# Neon Database Setup Guide

## Quick Setup

1. **Create Neon Account**
   - Go to [https://neon.tech](https://neon.tech)
   - Sign up for a free account

2. **Create Database**
   - Click "New Project"
   - Choose your region (closest to your users)
   - Name your project (e.g., "jobhub-db")
   - Click "Create Project"

3. **Get Connection String**
   - From your Neon dashboard, go to your project
   - Click on "Connection Details"
   - Copy the "Connection string" (it looks like: `postgresql://username:password@hostname/dbname?sslmode=require`)

4. **Configure Environment Variables**
   
   **Option A: Vercel (Recommended for Production)**
   ```bash
   # In Vercel dashboard → Project → Settings → Environment Variables
   DATABASE_URL=your_connection_string_here
   ```

   **Option B: Local Development**
   ```bash
   # Create .env.local file (this file is already in .gitignore)
   DATABASE_URL=your_connection_string_here
   ```

5. **Restart Your Application**
   - If running locally: Stop and restart `npm run dev`
   - If on Vercel: Redeploy your application

## Environment Variables Supported

The application supports multiple environment variable names for flexibility:
- `DATABASE_URL` (preferred)
- `NEON_DATABASE_URL` 
- `POSTGRES_URL`

## Troubleshooting

### Error: "Database connection string not found"
- Make sure you've set one of the environment variables above
- Check that your `.env.local` file is in the project root
- Verify Vercel environment variables are properly configured

### Error: "fetch failed" or connection issues
- Verify your connection string is correct
- Check if your Neon database is running
- Ensure SSL is enabled (most Neon connections require `sslmode=require`)

### Testing the Connection
You can test your database connection by visiting:
```
https://your-domain.com/api/cv-profiles
```
If you get a proper JSON response (not an error), your connection is working.

## Database Schema

The application will automatically create the necessary tables:
- `cv_profiles` - Stores CV submissions
- `job_applications` - Links CVs to job postings

## Security Notes

- Never commit your `.env.local` file to version control
- Use different database credentials for development and production
- Regularly rotate your database passwords
- Enable connection pooling in Neon for better performance
