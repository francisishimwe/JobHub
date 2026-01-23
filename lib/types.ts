// This file defines the "rules" for what a Job looks like in your project.
// Adding 'created_at' here is what removes those 4 red errors.

export interface Job {
  id: string;
  title: string;
  company_id: string;      
  location: string;
  description: string;
  created_at: string;      
  job_type: string;        
  opportunity_type: string;
  deadline?: string;
  featured: boolean;
  applicants?: number;
}

export interface Company {
  id: string;
  name: string;
  logo_url: string;
  website?: string;
}