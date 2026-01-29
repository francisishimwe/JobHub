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
  return {
    id: dbJob.id,
    title: dbJob.title || '',
    location: dbJob.location || '',
    description: dbJob.description || undefined,
    
    // Database format fields (kept for backwards compatibility)
    company_id: dbJob.company_id || null,
    job_type: dbJob.job_type || '',
    opportunity_type: dbJob.opportunity_type || '',
    created_at: dbJob.created_at || '',
    deadline: dbJob.deadline || '',
    status: dbJob.status || 'draft',
    approved: dbJob.approved ?? false,
    featured: dbJob.featured ?? false,
    attachment_url: dbJob.attachment_url || undefined,

    // Component format fields (camelCase - for component usage)
    companyId: dbJob.company_id || null,
    jobType: dbJob.job_type || '',
    opportunityType: dbJob.opportunity_type || '',
    postedDate: dbJob.created_at ? new Date(dbJob.created_at) : new Date(Date.now()),
    applicationLink: dbJob.application_link || '',
    experienceLevel: dbJob.experience_level || undefined,
    
    // Relational data with safe fallbacks
    company: dbJob.company || { 
      name: "RwandaJobHub Partner", 
      logo: "/full logo.jpg" 
    },
    applicants: dbJob.applicants || 0,
  }
}