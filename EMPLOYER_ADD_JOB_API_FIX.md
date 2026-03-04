# Employer Add Job API Field Mapping Fix

## 🐛 **Problem Identified**
The Employer Add Job form was failing with a 400 Bad Request error:
```
Failed to create job: {error: 'Missing required fields: title, opportunity_type'}
```

## 🔍 **Root Cause**
The API endpoint `/api/jobs` expects specific field names:
- ✅ **Expected**: `title` 
- ✅ **Expected**: `opportunity_type`
- ❌ **Sending**: `job_title`
- ❌ **Sending**: `offer_type`

## 🛠️ **Solution Applied**

### **Fixed Field Mapping**
Updated the API call in `components/employer-add-job-form.tsx`:

#### **Before (Incorrect):**
```typescript
body: JSON.stringify({
  job_title: formData.job_title.trim() || null,        // ❌ Wrong field name
  company_name: formData.company_name.trim() || null,
  logo_url: formData.logo_url || null,
  offer_type: formData.offer_type || null,             // ❌ Wrong field name
  category: formData.category || null,
  location: formData.location || null,
  location_type: formData.location_type || null,
  description: formData.description || null,
  external_link: formData.external_link || null,       // ❌ Wrong field name
  deadline: formData.deadline || null,
  experience_level: formData.experience_level || null,
  contract_type: formData.contract_type || null,       // ❌ Wrong field name
  attachment_url: formData.attachment_url || null,
  plan_id: 1,
  employer_email: employerData?.email || user?.email,
})
```

#### **After (Correct):**
```typescript
body: JSON.stringify({
  title: formData.job_title.trim() || null,             // ✅ Correct field name
  company_name: formData.company_name.trim() || null,
  logo_url: formData.logo_url || null,
  opportunity_type: formData.offer_type || null,        // ✅ Correct field name
  category: formData.category || null,
  location: formData.location || null,
  location_type: formData.location_type || null,
  description: formData.description || null,
  application_link: formData.external_link || null,      // ✅ Correct field name
  deadline: formData.deadline || null,
  experience_level: formData.experience_level || null,
  job_type: formData.contract_type || null,             // ✅ Correct field name
  attachment_url: formData.attachment_url || null,
  plan_id: 1,
  employer_email: employerData?.email || user?.email,
})
```

### **Field Mapping Corrections**
| Form Field | Before (API) | After (API) | Status |
|------------|---------------|--------------|---------|
| `job_title` | `job_title` | `title` | ✅ Fixed |
| `offer_type` | `offer_type` | `opportunity_type` | ✅ Fixed |
| `external_link` | `external_link` | `application_link` | ✅ Fixed |
| `contract_type` | `contract_type` | `job_type` | ✅ Fixed |

## 🎯 **API Requirements**

### **Required Fields (per API validation):**
```typescript
// From app/api/jobs/route.ts line 195-200
if (!body.title || !body.opportunity_type) {
  return NextResponse.json(
    { error: 'Missing required fields: title, opportunity_type' },
    { status: 400 }
  )
}
```

### **Database Schema Fields:**
The API expects these field names to match the database schema:
- `title` (jobs table)
- `opportunity_type` (jobs table)
- `job_type` (jobs table)
- `application_link` (jobs table)

## ✅ **Verification**

### **Employer Edit Job Form**
- ✅ **Already correct** - Uses proper field mapping
- ✅ **Different API** - Uses `/api/employer/jobs` PUT endpoint
- ✅ **No changes needed** - Field mapping was already correct

### **Employer Add Job Form**
- ✅ **Fixed** - Now uses correct field names
- ✅ **API compatibility** - Matches Admin Add Job form
- ✅ **Error resolved** - 400 Bad Request should be fixed

## 🚀 **Expected Result**

After this fix:
- ✅ **No more 400 errors** - Field mapping is correct
- ✅ **Job creation works** - Employer can post jobs successfully
- ✅ **API consistency** - Same field names as database schema
- ✅ **Admin compatibility** - Same API as Admin Add Job form

## 📋 **Testing Checklist**

1. **Test Employer Add Job** - Verify job creation works
2. **Test Employer Edit Job** - Verify job editing still works
3. **Verify API response** - Check for success messages
4. **Check database** - Confirm jobs are saved correctly
5. **Test Admin forms** - Ensure Admin forms still work

**The Employer Add Job form API field mapping issue has been resolved!** 🎉
