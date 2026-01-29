# Job Data Mapping Solution: snake_case → camelCase

## Problem
The API returns job data in **snake_case** (database format), but the React components expect **camelCase** (JavaScript convention). This mismatch caused the JobList to show "No jobs found" even when data was available.

## Solution Overview
Created a centralized mapping function `mapDatabaseJobToUIJob()` that transforms database objects to UI objects, then integrated it throughout the data pipeline.

---

## Files Modified

### 1. **lib/utils.ts** - NEW MAPPING FUNCTION
```typescript
export function mapDatabaseJobToUIJob(dbJob: any): Job {
  return {
    id: dbJob.id,
    title: dbJob.title || '',
    location: dbJob.location || '',
    description: dbJob.description || undefined,
    
    // Database format (snake_case) - kept for backwards compatibility
    company_id: dbJob.company_id || null,
    job_type: dbJob.job_type || '',
    opportunity_type: dbJob.opportunity_type || '',
    created_at: dbJob.created_at || '',
    // ... other snake_case fields
    
    // UI format (camelCase) - for components to use
    companyId: dbJob.company_id || null,
    jobType: dbJob.job_type || '',
    opportunityType: dbJob.opportunity_type || '',
    postedDate: dbJob.created_at || '',
    
    // Relational data with safe fallbacks
    company: dbJob.company || { 
      name: "RwandaJobHub Partner", 
      logo: "/full logo.jpg" 
    },
    applicants: dbJob.applicants || 0,
  }
}
```

**Key Benefits:**
- ✅ Single source of truth for transformations
- ✅ Safe defaults prevent undefined errors
- ✅ Maintains backwards compatibility (both formats available)
- ✅ Reusable across all API responses

---

### 2. **lib/job-context.tsx** - UPDATED FETCH LOGIC
```typescript
const fetchJobs = async (pageNumber: number, isNewSearch: boolean = false) => {
  setIsLoading(true)
  try {
    const response = await fetch(`/api/jobs?page=${pageNumber}&limit=${JOBS_PER_PAGE}`)
    if (!response.ok) throw new Error('Failed to fetch jobs')

    const data = await response.json()
    console.log(`✓ API Response: ${data.jobs?.length} jobs received (page ${pageNumber})`)

    if (data.jobs && Array.isArray(data.jobs)) {
      // Use the mapping function to convert snake_case to camelCase
      const formattedJobs: Job[] = data.jobs.map(mapDatabaseJobToUIJob)
      
      console.log(`✓ Formatted: ${formattedJobs.length} jobs mapped to UI format`)
      setJobs(prev => isNewSearch ? formattedJobs : [...prev, ...formattedJobs])
      setHasMore(data.hasMore)
    }
  } catch (err) {
    console.error("❌ Error fetching jobs:", err)
  } finally {
    setIsLoading(false)
  }
}
```

**Key Changes:**
- Uses `mapDatabaseJobToUIJob()` for consistent transformations
- Added debug logging to track data flow
- Proper error handling with fallback values

---

### 3. **lib/job-context.tsx** - FIXED FILTER LOGIC
```typescript
// Live Filtering Logic
useEffect(() => {
  let filtered = [...jobs]
  if (filters.search) {
    const s = filters.search.toLowerCase()
    filtered = filtered.filter(j => 
      j.title.toLowerCase().includes(s) || 
      j.description?.toLowerCase().includes(s)
    )
  }
  if (filters.location) {
    const l = filters.location.toLowerCase()
    filtered = filtered.filter(j => j.location.toLowerCase().includes(l))
  }
  if (filters.opportunityTypes?.length > 0) {
    // ✅ FIXED: Now uses mapped camelCase property
    filtered = filtered.filter(j => 
      filters.opportunityTypes.includes(j.opportunityType || j.opportunity_type || '')
    )
  }
  setFilteredJobs(filtered)
}, [jobs, filters])
```

**What Was Fixed:**
- Changed from `j.opportunity_type` to `j.opportunityType` (uses mapped field)
- Added fallback to `j.opportunity_type` for safety
- Prevents filter mismatches

---

### 4. **components/job-list.tsx** - ADDED DEBUGGING
```typescript
// Debug: Log job data
useEffect(() => {
  if (jobs.length > 0) {
    console.log(`📊 JobList: ${jobs.length} total jobs, ${filteredJobs.length} filtered`)
    console.log('Sample job:', jobs[0])
  } else if (!isLoading) {
    console.warn('⚠ No jobs available')
  }
}, [jobs, filteredJobs, isLoading])
```

**Benefits:**
- Helps diagnose data flow issues
- Shows real-time job counts
- Displays sample data structure

---

## Data Flow Diagram

```
API Response (snake_case)
    ↓
fetch('/api/jobs')
    ↓
data.jobs array
    ↓
mapDatabaseJobToUIJob() [lib/utils.ts]
    ↓
Job[] with both snake_case AND camelCase properties
    ↓
setJobs(formattedJobs)
    ↓
Live Filtering (useEffect with setFilteredJobs)
    ↓
JobList Component displays filteredJobs
```

---

## Property Mapping Reference

| Database (API) | UI Component | Used In |
|---|---|---|
| `company_id` | `companyId` | useCompanies lookup |
| `job_type` | `jobType` | Badge display |
| `opportunity_type` | `opportunityType` | Filters |
| `created_at` | `postedDate` | Date formatting |
| `created_at` | `created_at` | Fallback display |

---

## Testing Checklist

- [ ] Check browser console for `✓ API Response` message
- [ ] Verify `✓ Formatted` message shows correct count
- [ ] Check `📊 JobList` debug log shows jobs loading
- [ ] Verify jobs display in table (not "No jobs found")
- [ ] Test filters work with mapped properties
- [ ] Test job edit/delete still works
- [ ] Check that company names display correctly

---

## Troubleshooting

### Issue: Still showing "No jobs found"
1. Check API response in Network tab
2. Verify jobs exist in database with `status='published' AND approved=true`
3. Check browser console for error logs
4. Verify `filteredJobs.length > 0` in React DevTools

### Issue: Filters not working
1. Ensure `opportunityType` is mapped correctly
2. Check that filter values match database values
3. Verify filtering logic in context is updated

### Issue: Dates not showing
1. Verify `postedDate` or `created_at` has valid ISO string
2. Check `formatDate()` function in JobList handles nulls
