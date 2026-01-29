export interface Job {
  id: string;
  title: string;
  location: string;
  description?: string;
  
  // Database format (snake_case)
  company_id: string | null;
  job_type: string;
  opportunity_type: string;
  created_at: string;
  deadline: string;
  status: string;
  approved: boolean;
  featured: boolean;
  attachment_url?: string | null;

  // Component format (camelCase) - mapped in your Provider
  companyId?: string | null;
  jobType?: string;
  opportunityType?: string;
  postedDate?: Date;
  applicationLink?: string;
  experienceLevel?: string;
  
  // Relational data
  company?: {
    name: string;
    logo: string;
  };
  applicants?: number;
}

// If you need the Filter type as well:
export interface JobFilters {
  search: string;
  location: string;
  opportunityTypes: string[];
}