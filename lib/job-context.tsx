"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "./supabase"
import type { Job, JobFilters } from "./types"
import { filterExpiredJobs, cleanupExpiredJobs } from "./cleanup-jobs"

interface JobContextType {
  jobs: Job[]
  isLoading: boolean
  addJob: (job: Omit<Job, "id" | "postedDate" | "applicants">) => Promise<void>
  updateJob: (id: string, job: Partial<Job>) => Promise<void>
  deleteJob: (id: string) => Promise<void>
  trackApplyClick: (jobId: string) => Promise<void>
  filters: JobFilters
  setFilters: (filters: Partial<JobFilters>) => void
  filteredJobs: Job[]
}

const JobContext = createContext<JobContextType | undefined>(undefined)

// Fetch jobs function
const fetchJobs = async (): Promise<Job[]> => {
  const { data, error } = await supabase
    .from("jobs")
    .select("*")

  if (error) {
    console.error("Supabase error fetching jobs:", error)
    throw error
  }

  if (!data) {
    console.log("No jobs data returned from Supabase")
    return []
  }

  console.log("Fetched jobs count:", data.length)

  const jobs = data.map((job) => ({
    id: job.id,
    title: job.title,
    companyId: job.company_id,
    description: job.description,
    location: job.location,
    locationType: job.location_type,
    jobType: job.job_type,
    opportunityType: job.opportunity_type,
    experienceLevel: job.experience_level,
    category: job.category,
    deadline: job.deadline,
    applicants: job.applicants || 0,
    postedDate: new Date(job.created_at || job.posted_date),
    featured: job.featured || false,
    applicationLink: job.application_link,
    attachmentUrl: job.attachment_url,
  }))

  // Filter out expired jobs
  const activeJobs = filterExpiredJobs(jobs)

  console.log(`Active jobs: ${activeJobs.length} (filtered ${jobs.length - activeJobs.length} expired)`)

  // Sort by posted date in JavaScript
  return activeJobs.sort((a, b) => b.postedDate.getTime() - a.postedDate.getTime())
}

export function JobProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const [filters, setFiltersState] = useState<JobFilters>({
    search: "",
    location: "",
    experienceLevels: [],
    jobTypes: [],
    opportunityTypes: [],
  })

  // Use React Query for jobs with caching
  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ['jobs'],
    queryFn: fetchJobs,
    staleTime: 0, // Always fetch fresh data
    gcTime: 30 * 1000, // 30 seconds cache only
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  })

  // Set up real-time subscription
  useEffect(() => {
    const subscription = supabase
      .channel('jobs_changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'jobs' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['jobs'] })
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [queryClient])

  // Automatic cleanup of expired jobs - runs once when provider mounts
  useEffect(() => {
    const runCleanup = async () => {
      try {
        const result = await cleanupExpiredJobs()
        if (result.deletedCount > 0) {
          console.log(`Auto-cleanup: ${result.message}`)
          // Refresh jobs list after cleanup
          queryClient.invalidateQueries({ queryKey: ['jobs'] })
        }
      } catch (error) {
        console.error("Auto-cleanup failed:", error)
      }
    }

    // Run cleanup on mount
    runCleanup()

    // Set up periodic cleanup (every hour)
    const cleanupInterval = setInterval(runCleanup, 60 * 60 * 1000)

    return () => {
      clearInterval(cleanupInterval)
    }
  }, [queryClient])

  const addJob = async (job: Omit<Job, "id" | "postedDate" | "applicants">) => {
    const insertData = {
      title: job.title,
      company_id: job.companyId,
      description: job.description,
      location: job.location,
      location_type: job.locationType,
      job_type: job.jobType,
      opportunity_type: job.opportunityType,
      experience_level: job.experienceLevel,
      category: job.category || null,
      deadline: job.deadline || null,
      featured: job.featured || false,
      application_link: job.applicationLink,
      attachment_url: job.attachmentUrl || null,
    }

    const { error } = await supabase
      .from("jobs")
      .insert([insertData])

    if (error) {
      console.error("Supabase error adding job:", error)
      throw error
    }

    // Invalidate and refetch
    queryClient.invalidateQueries({ queryKey: ['jobs'] })
  }

  const updateJob = async (id: string, updatedJob: Partial<Job>) => {
    const updateData: any = {}
    if (updatedJob.title !== undefined) updateData.title = updatedJob.title
    if (updatedJob.companyId !== undefined) updateData.company_id = updatedJob.companyId
    if (updatedJob.description !== undefined) updateData.description = updatedJob.description
    if (updatedJob.location !== undefined) updateData.location = updatedJob.location
    if (updatedJob.locationType !== undefined) updateData.location_type = updatedJob.locationType
    if (updatedJob.jobType !== undefined) updateData.job_type = updatedJob.jobType
    if (updatedJob.opportunityType !== undefined) updateData.opportunity_type = updatedJob.opportunityType
    if (updatedJob.experienceLevel !== undefined) updateData.experience_level = updatedJob.experienceLevel
    if (updatedJob.category !== undefined) updateData.category = updatedJob.category
    if (updatedJob.deadline !== undefined) updateData.deadline = updatedJob.deadline
    if (updatedJob.featured !== undefined) updateData.featured = updatedJob.featured
    if (updatedJob.applicationLink !== undefined) updateData.application_link = updatedJob.applicationLink
    if (updatedJob.attachmentUrl !== undefined) updateData.attachment_url = updatedJob.attachmentUrl

    const { error } = await supabase.from("jobs").update(updateData).eq("id", id)

    if (error) throw error

    queryClient.invalidateQueries({ queryKey: ['jobs'] })
  }

  const deleteJob = async (id: string) => {
    const { error } = await supabase.from("jobs").delete().eq("id", id)

    if (error) throw error

    queryClient.invalidateQueries({ queryKey: ['jobs'] })
  }

  const trackApplyClick = async (jobId: string) => {
    const job = jobs.find(j => j.id === jobId)
    if (!job) return

    const newApplicantCount = (job.applicants || 0) + 1

    const { error } = await supabase
      .from("jobs")
      .update({ applicants: newApplicantCount })
      .eq("id", jobId)

    if (error) {
      console.error("Error tracking apply click:", error)
      throw error
    }

    queryClient.invalidateQueries({ queryKey: ['jobs'] })
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
        isLoading,
        addJob,
        updateJob,
        deleteJob,
        trackApplyClick,
        filters,
        setFilters,
        filteredJobs,
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
