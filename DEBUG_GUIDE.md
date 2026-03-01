# Data Flow & Debugging Guide

## How the Mapping Works

```
Database (PostgreSQL - snake_case)
     ↓
API Response: /api/jobs
{
  "id": "123",
  "title": "Senior Developer",
  "company_id": "abc",
  "job_type": "Full-time",
  "opportunity_type": "development",
  "created_at": "2024-01-29",
  ...
}
     ↓
mapDatabaseJobToUIJob() Function (lib/utils.ts)
     ↓
Job Object with BOTH formats:
{
  id: "123",
  title: "Senior Developer",
  
  // snake_case (from DB)
  company_id: "abc",
  job_type: "Full-time",
  opportunity_type: "development",
  created_at: "2024-01-29",
  
  // camelCase (for UI)
  companyId: "abc",
  jobType: "Full-time",
  opportunityType: "development",
  postedDate: "2024-01-29",
  ...
}
     ↓
setJobs(formattedJobs) in JobContext
     ↓
Live Filtering (filters jobs using camelCase properties)
     ↓
setFilteredJobs() stores filtered results
     ↓
JobList Component displays filteredJobs
```

---

## Browser Console Debug Output

When working correctly, you should see:

```
✓ API Response: 15 jobs received (page 0)
✓ Formatted: 15 jobs mapped to UI format
📊 JobList: 15 total jobs, 15 filtered
Sample job: { id: "...", title: "...", companyId: "...", jobType: "...", ... }
```

---

## Key Integration Points

### 1. API Response Handler (lib/job-context.tsx)
- Calls `/api/jobs` endpoint
- Receives snake_case data
- Maps each job with `mapDatabaseJobToUIJob()`
- Stores in `jobs` state

### 2. Live Filter Logic (lib/job-context.tsx)
- Reads from `jobs` array (mapped data)
- Uses camelCase properties: `j.opportunityType`, `j.jobType`
- Updates `filteredJobs` state

### 3. Component Display (components/job-list.tsx)
- Reads from `filteredJobs` 
- Uses camelCase: `job.jobType`, `job.companyId`
- Falls back to snake_case if needed: `job.job_type`

---

## Critical Files

| File | Purpose | Key Change |
|------|---------|-----------|
| [lib/utils.ts](../lib/utils.ts) | Mapping function | Added `mapDatabaseJobToUIJob()` |
| [lib/job-context.tsx](../lib/job-context.tsx) | Data fetching & filtering | Uses mapping function + fixed filter logic |
| [lib/types.ts](../lib/types.ts) | Type definitions | Includes both snake_case and camelCase |
| [components/job-list.tsx](../components/job-list.tsx) | UI display | Uses `filteredJobs` with debug logging |

---

## Common Issues & Fixes

### ❌ "No jobs found" message appears
**Check:**
1. Is API returning data? `✓ API Response` in console?
2. Is mapping working? `✓ Formatted` in console?
3. Is filtering broken? Check filter counts in `📊 JobList` log

**Fix:**
```typescript
// In browser DevTools Console:
// Check raw jobs
console.log(store.jobs)  // See all jobs
console.log(store.filteredJobs)  // See filtered jobs
console.log(store.filters)  // See active filters
```

### ❌ Filters not working
**Cause:** Filter logic checking wrong property name
**Fix:** Ensure filter uses camelCase
```typescript
// ✅ CORRECT
j.opportunityType || j.opportunity_type

// ❌ WRONG
j.opportunity_type  // This alone won't find mapped data
```

### ❌ Company names not showing
**Cause:** `companyId` mapped but company lookup fails
**Fix:** Check if `useCompanies().getCompanyById()` returns correct data
```typescript
// In JobList
console.log(getCompanyById(job.companyId))  // Should return company object
```

### ❌ Dates showing as "Invalid Date"
**Cause:** `postedDate` or `created_at` not being parsed
**Fix:** Check `formatDate()` function handles null/undefined
```typescript
const formatDate = (date: any) => {
  if (!date) return "N/A"  // ✅ Handle null
  return new Date(date).toLocaleDateString(...)
}
```

---

## Testing Checklist

- [ ] **API Data Exists**
  ```sql
  SELECT COUNT(*) FROM jobs WHERE status='published' AND approved=true;
  ```

- [ ] **Mapping Works**
  - Check console for `✓ API Response` and `✓ Formatted` messages
  - Verify count matches

- [ ] **Filtering Works**  
  - Test search filter (updates count)
  - Test location filter (updates count)
  - Test opportunity type filter (updates count)

- [ ] **Display Works**
  - Jobs appear in table
  - Company names display
  - Dates show correctly
  - Badges show job types

- [ ] **Operations Work**
  - Can edit a job
  - Can delete a job
  - Can add a new job

---

## Performance Note

- Mapping happens once per API fetch (not on every render)
- Filter logic is optimized with `useEffect` dependency array
- `setFilteredJobs` is called only when `jobs` or `filters` change
- No unnecessary re-renders

---

## Future Improvements

1. **Move mapping to API layer** - Map on server before returning
2. **Use TypeScript types** - Replace `any` with proper types in fetch
3. **Cache mapped jobs** - Avoid remapping on every fetch
4. **Add error boundaries** - Gracefully handle mapping failures
