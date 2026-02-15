import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Job } from '@/lib/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Maps database job objects (snake_case) to UI job objects (camelCase)
 * This bridges the gap between the PostgreSQL database format and React component usage
 */
export function mapDatabaseJobToUIJob(dbJob: any): Job {
  // Add null/undefined check at the beginning
  if (!dbJob) {
    console.error('❌ mapDatabaseJobToUIJob received null/undefined data')
    return {} as Job
  }

  console.log('🔍 Mapping job data:', { id: dbJob.id, title: dbJob.title })
  
  try {
    return {
      id: dbJob.id || '',
      title: dbJob.title || '',
      location: dbJob.location || '',
      description: dbJob.description || undefined,
      
      // Database format fields (kept for backwards compatibility)
      company_id: dbJob.company_id || null,
      company_logo: dbJob.company_logo || null,
      company_name: dbJob.company_name || null,
      job_type: dbJob.job_type || '',
      opportunity_type: dbJob.opportunity_type || '',
      created_at: dbJob.created_at || '',
      deadline: dbJob.deadline || '',
      status: dbJob.status || 'draft',
      approved: dbJob.approved ?? false,
      featured: dbJob.featured ?? false,
      attachment_url: dbJob.attachment_url || undefined,
      location_type: dbJob.location_type || undefined,
      experience_level: dbJob.experience_level || undefined,
      application_link: dbJob.application_link || undefined,
      application_method: dbJob.application_method || 'email',
      primary_email: dbJob.primary_email || undefined,
      cc_emails: dbJob.cc_emails || undefined,
      applicants: dbJob.applicants || 0,
      is_verified: dbJob.is_verified ?? false,

      // Component format fields (camelCase - for component usage)
      companyId: dbJob.company_id || null,
      companyLogo: dbJob.company_logo || "/full logo.jpg",
      companyName: dbJob.company_name || "RwandaJobHub Partner",
      jobType: dbJob.job_type || '',
      opportunityType: dbJob.opportunity_type || '',
      postedDate: dbJob.created_at ? new Date(dbJob.created_at) : new Date(Date.now()),
      applicationLink: dbJob.application_link || '',
      applicationMethod: dbJob.application_method || 'email',
      primaryEmail: dbJob.primary_email || undefined,
      ccEmails: dbJob.cc_emails || undefined,
      experienceLevel: dbJob.experience_level || undefined,
      locationType: dbJob.location_type || undefined,
      attachmentUrl: dbJob.attachment_url || undefined,
      isVerified: dbJob.is_verified ?? false,
      
      // Relational data with safe fallbacks - only use if dbJob.company exists
      company: dbJob.company && typeof dbJob.company === 'object' ? dbJob.company : { 
        name: dbJob.company_name || "RwandaJobHub Partner", 
        logo: dbJob.company_logo || "/full logo.jpg" 
      },
    }
  } catch (error) {
    console.error('❌ Error mapping job data:', error, dbJob)
    return {} as Job
  }
}