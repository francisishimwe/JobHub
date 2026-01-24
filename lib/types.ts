// Neon database schema types

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
  category?: string;
  status: string;
  approved: boolean;
  featured?: boolean;
  attachment_url?: string;
  applicants?: number;
}

export interface Company {
  id: string;
  name: string;
  logo_url: string;
  website?: string;
}