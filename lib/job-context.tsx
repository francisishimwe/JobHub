"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { supabase } from "./supabase"
import type { Job, JobFilters } from "./types"

interface JobContextType {
  jobs: Job[]
  addJob: (job: Omit<Job, "id" | "postedDate" | "applicants">) => Promise<void>
  updateJob: (id: string, job: Partial<Job>) => Promise<void>
  deleteJob: (id: string) => Promise<void>
  filters: JobFilters
  setFilters: (filters: Partial<JobFilters>) => void
  filteredJobs: Job[]
  loading: boolean
}

const JobContext = createContext<JobContextType | undefined>(undefined)

export function JobProvider({ children }: { children: ReactNode }) {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFiltersState] = useState<JobFilters>({
    search: "",
    location: "",
    experienceLevels: [],
    jobTypes: [],
    opportunityTypes: [],
  })

  // Fetch jobs from Supabase
  useEffect(() => {
    fetchJobs()
    
    // Set up real-time subscription for job changes
    const subscription = supabase
      .channel('jobs_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'jobs' },
        () => {
          fetchJobs()
        }
      )
      .subscribe()
    
    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .order("posted_date", { ascending: false })

      if (error) throw error

      const formattedJobs: Job[] = (data || []).map((job) => ({
        id: job.id,
        title: job.title,
        companyId: job.company_id,
        description: job.description,
        location: job.location,
        locationType: job.location_type,
        jobType: job.job_type,
        opportunityType: job.opportunity_type,
        experienceLevel: job.experience_level,
        deadline: job.deadline,
        applicants: job.applicants || 0,
        postedDate: new Date(job.posted_date),
        featured: job.featured || false,
        applicationLink: job.application_link,
      }))

      setJobs(formattedJobs)
    } catch (error) {
      console.error("Error fetching jobs:", error)
    } finally {
      setLoading(false)
    }
  }

  const addJob = async (job: Omit<Job, "id" | "postedDate" | "applicants">) => {
    try {
      const { data, error } = await supabase
        .from("jobs")
        .insert([
          {
            title: job.title,
            company_id: job.companyId,
            description: job.description,
            location: job.location,
            location_type: job.locationType,
            job_type: job.jobType,
            opportunity_type: job.opportunityType,
            experience_level: job.experienceLevel,
            deadline: job.deadline,
            featured: job.featured || false,
            application_link: job.applicationLink,
          },
        ])
        .select()
        .single()

      if (error) throw error

      const newJob: Job = {
        id: data.id,
        title: data.title,
        companyId: data.company_id,
        description: data.description,
        location: data.location,
        locationType: data.location_type,
        jobType: data.job_type,
        opportunityType: data.opportunity_type,
        experienceLevel: data.experience_level,
        deadline: data.deadline,
        applicants: data.applicants || 0,
        postedDate: new Date(data.posted_date),
        featured: data.featured || false,
        applicationLink: data.application_link,
      }

      setJobs([newJob, ...jobs])
    } catch (error) {
      console.error("Error adding job:", error)
      throw error
    }
  }

  const updateJob = async (id: string, updatedJob: Partial<Job>) => {
    try {
      const updateData: any = {}
      if (updatedJob.title !== undefined) updateData.title = updatedJob.title
      if (updatedJob.companyId !== undefined) updateData.company_id = updatedJob.companyId
      if (updatedJob.description !== undefined) updateData.description = updatedJob.description
      if (updatedJob.location !== undefined) updateData.location = updatedJob.location
      if (updatedJob.locationType !== undefined) updateData.location_type = updatedJob.locationType
      if (updatedJob.jobType !== undefined) updateData.job_type = updatedJob.jobType
      if (updatedJob.opportunityType !== undefined) updateData.opportunity_type = updatedJob.opportunityType
      if (updatedJob.experienceLevel !== undefined) updateData.experience_level = updatedJob.experienceLevel
      if (updatedJob.deadline !== undefined) updateData.deadline = updatedJob.deadline
      if (updatedJob.featured !== undefined) updateData.featured = updatedJob.featured
      if (updatedJob.applicationLink !== undefined) updateData.application_link = updatedJob.applicationLink

      const { error } = await supabase.from("jobs").update(updateData).eq("id", id)

      if (error) throw error

      setJobs(jobs.map((job) => (job.id === id ? { ...job, ...updatedJob } : job)))
    } catch (error) {
      console.error("Error updating job:", error)
      throw error
    }
  }

  const deleteJob = async (id: string) => {
    try {
      const { error } = await supabase.from("jobs").delete().eq("id", id)

      if (error) throw error

      setJobs(jobs.filter((job) => job.id !== id))
    } catch (error) {
      console.error("Error deleting job:", error)
      throw error
    }
  }

  const setFilters = (newFilters: Partial<JobFilters>) => {
    setFiltersState({ ...filters, ...newFilters })
  }

  // Filter jobs based on current filters
  const filteredJobs = jobs.filter((job) => {
    // Search filter
    if (
      filters.search &&
      !job.title.toLowerCase().includes(filters.search.toLowerCase()) &&
      !job.description.toLowerCase().includes(filters.search.toLowerCase())
    ) {
      return false
    }

    // Location filter
    if (filters.location && !job.location.toLowerCase().includes(filters.location.toLowerCase())) {
      return false
    }

    // Experience level filter
    if (filters.experienceLevels.length > 0 && !filters.experienceLevels.includes(job.experienceLevel)) {
      return false
    }

    // Job type filter
    if (filters.jobTypes.length > 0 && !filters.jobTypes.includes(job.jobType)) {
      return false
    }

    // Opportunity type filter
    if (filters.opportunityTypes.length > 0 && !filters.opportunityTypes.includes(job.opportunityType)) {
      return false
    }

    return true
  })

  return (
    <JobContext.Provider
      value={{
        jobs,
        addJob,
        updateJob,
        deleteJob,
        filters,
        setFilters,
        filteredJobs,
        loading,
      }}
    >
      {children}
    </JobContext.Provider>
  )
}

export function useJobs() {
  const context = useContext(JobContext)
  if (context === undefined) {
    throw new Error("useJobs must be used within a JobProvider")
  }
  return context
}
