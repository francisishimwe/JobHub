# 🔍 SEO & Google Search Appearance Guide

This guide explains how your website (RwandaJobHub) appears in Google search results and how to optimize it.

## 📊 Current Google Search Appearance

### **Homepage (www.rwandajobhub.rw)**

When someone searches for "RwandaJobHub" on Google, they will see:

```
🔵 RwandaJobHub                                     [📷 Favicon Image]
🟢 https://www.rwandajobhub.rw
   Job opportunities in Rwanda
```

**Breakdown:**
- **Title (Blue)**: "RwandaJobHub"
- **URL (Green)**: "https://www.rwandajobhub.rw"
- **Description (Gray)**: "Job opportunities in Rwanda"
- **Image**: favicon.jpg (appears as a small icon)

---

### **Job Detail Pages (/jobs/[id])**

When a specific job is shared or indexed, Google shows:

```
🔵 [Company Name] is hiring [Job Title]            [📷 Company Logo]
🟢 https://www.rwandajobhub.rw/jobs/[id]
   [Job description excerpt - first 160 characters]
   
   Location: [Location] • Type: [Opportunity Type] • Deadline: [Date]
```

**Example:**
```
🔵 UNICEF is hiring Senior Software Engineer        [📷 UNICEF Logo]
🟢 https://www.rwandajobhub.rw/jobs/abc123
   We are seeking an experienced Senior Software Engineer to join our digital 
   transformation team. The ideal candidate will have expertise in...
   
   Location: Kigali • Type: Job • Deadline: Dec 15, 2025
```

---

## 🎯 What Controls Each Element?

### **1. Page Title (Blue Clickable Text)**

**File**: `app/layout.tsx` (line 23)
```typescript
title: "RwandaJobHub"
```

**For Job Pages**: `app/jobs/[id]/page.tsx` (line 77-79)
```typescript
title: {
  absolute: `${companyName} - ${job.title}`
}
```

### **2. Meta Description (Gray Text)**

**File**: `app/layout.tsx` (line 24)
```typescript
description: "Job opportunities in Rwanda"
```

**For Job Pages**: Auto-generated from job description (first 160 chars)

### **3. Image/Logo**

**Homepage**: Uses `favicon.jpg` from `/public/favicon.jpg`

**Job Pages**: Uses company logo if available, otherwise falls back to favicon.jpg

**File**: `app/jobs/[id]/page.tsx` (lines 70-74)
```typescript
const companyLogo = company?.logo
const defaultFavicon = `${siteUrl}/favicon.jpg`
const faviconUrl = companyLogo || defaultFavicon
const ogImageUrl = companyLogo || defaultFavicon
```

---

## 🚀 Current SEO Configuration

### **Homepage Metadata** (`app/layout.tsx`)

```typescript
export const metadata: Metadata = {
  title: "RwandaJobHub",
  description: "Job opportunities in Rwanda",
  icons: {
    icon: '/favicon.jpg',
    shortcut: '/favicon.jpg',
    apple: '/favicon.jpg',
  },
  openGraph: {
    title: "Apply job at RwandaJobHub",
    description: "Explore incredible opportunities in rwanda from internships, jobs, and exams.",
    url: "https://www.rwandajobhub.rw",
    images: ['/favicon.jpg'],
  },
}
```

### **Job Page Metadata** (`app/jobs/[id]/page.tsx`)

```typescript
return {
  title: {
    absolute: pageTitle  // "Company Name - Job Title"
  },
  description: cleanDescription,  // First 160 chars of job description
  openGraph: {
    title: { absolute: ogTitle },  // "Company is hiring Job Title"
    description: cleanDescription,
    url: jobUrl,
    siteName: 'RwandaJobHub',
    images: [{ url: ogImageUrl }],  // Company logo or favicon
  },
  twitter: {
    card: 'summary_large_image',
    title: ogTitle,
    description: cleanDescription,
    images: [ogImageUrl],
  },
}
```

---

## ✨ Recommendations to Improve SEO

### **1. Enhance Homepage Description**

**Current**: "Job opportunities in Rwanda"

**Recommended**:
```typescript
description: "Find jobs, internships, scholarships, tenders, and education opportunities in Rwanda. Browse 1000+ verified positions from top companies. Your career starts at RwandaJobHub."
```

### **2. Add More Open Graph Data**

```typescript
openGraph: {
  title: "RwandaJobHub - Find Your Dream Job in Rwanda",
  description: "Browse verified jobs, internships, scholarships & more from Rwanda's top employers",
  url: "https://www.rwandajobhub.rw",
  siteName: "RwandaJobHub",
  type: "website",
  locale: "en_RW",
  images: [{
    url: '/og-image.jpg',  // Create a better Open Graph image (1200x630px)
    width: 1200,
    height: 630,
    alt: 'RwandaJobHub - Job Opportunities in Rwanda',
  }],
}
```

### **3. Add Structured Data (JSON-LD)**

Add this to job pages to show rich snippets in Google:

```typescript
const jobStructuredData = {
  "@context": "https://schema.org",
  "@type": "JobPosting",
  "title": job.title,
  "description": cleanDescription,
  "datePosted": job.postedDate,
  "validThrough": job.deadline,
  "employmentType": job.jobType,
  "hiringOrganization": {
    "@type": "Organization",
    "name": company.name,
    "logo": company.logo
  },
  "jobLocation": {
    "@type": "Place",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "RW",
      "addressLocality": job.location
    }
  }
}

// Add to page:
<script type="application/ld+json">
  {JSON.stringify(jobStructuredData)}
</script>
```

---

## 🧪 How to Test Your SEO

### **1. Google Rich Results Test**
URL: https://search.google.com/test/rich-results

Paste your URL to see how Google will display it.

### **2. Open Graph Preview**
URL: https://www.opengraph.xyz/

See how your links appear when shared on social media.

### **3. Facebook Debugger**
URL: https://developers.facebook.com/tools/debug/

Test how links appear on Facebook/WhatsApp.

### **4. Twitter Card Validator**
URL: https://cards-dev.twitter.com/validator

Test Twitter/X card appearance.

### **5. Google Search Console**
URL: https://search.google.com/search-console

Monitor how Google indexes your site and track search performance.

---

## 📝 Checklist for Each Page Type

### ✅ **Homepage**
- [x] Title tag (< 60 characters)
- [x] Meta description (< 160 characters)
- [x] Favicon
- [x] Open Graph image
- [ ] Twitter card metadata
- [ ] Canonical URL
- [ ] Robots meta tag

### ✅ **Job Pages**
- [x] Dynamic title with job and company
- [x] Meta description from job content
- [x] Company logo as OG image
- [x] Open Graph metadata
- [x] Twitter card
- [ ] JSON-LD structured data
- [ ] Breadcrumb schema

---

## 🎨 Create a Better OG Image

Create an image at `/public/og-image.jpg` with:
- **Dimensions**: 1200 x 630 pixels
- **Content**: Your logo + tagline + call-to-action
- **Format**: JPG or PNG
- **File size**: < 1MB

**Example Content**:
```
┌─────────────────────────────────────┐
│  [Logo]  RwandaJobHub               │
│                                     │
│  Find Your Dream Job in Rwanda     │
│                                     │
│  ✓ 1000+ Verified Jobs             │
│  ✓ Top Companies                   │
│  ✓ Daily Updates                   │
│                                     │
│  www.rwandajobhub.rw               │
└─────────────────────────────────────┘
```

---

## 🔄 Next Steps

1. **Update homepage description** in `app/layout.tsx`
2. **Create professional OG image** (1200x630px)
3. **Add JSON-LD structured data** to job pages
4. **Submit sitemap** to Google Search Console
5. **Test with Google Rich Results Test**
6. **Monitor performance** in Google Search Console

---

## 📚 Resources

- [Next.js Metadata Docs](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [Google Search Central](https://developers.google.com/search)
- [Open Graph Protocol](https://ogp.me/)
- [Schema.org JobPosting](https://schema.org/JobPosting)
