"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Job } from '@/lib/types'

interface JobContextType {
  jobs: Job[]
  filteredJobs: Job[]
  filters: any
  setFilters: (filters: any) => void
  isLoading: boolean
  hasMore: boolean
  loadMore: () => void
  addJob: (jobData: any) => Promise<void>
}

const JobContext = createContext<JobContextType | undefined>(undefined)

export function JobProvider({ children }: { children: ReactNode }) {
  const [jobs, setJobs] = useState<Job[]>([])
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [filters, setFiltersState] = useState({
    search: '',
    location: '',
    opportunityTypes: [] as string[],
  })

  const JOBS_PER_PAGE = 15

  const fetchJobs = async (pageNumber: number, isNewSearch: boolean = false) => {
    setIsLoading(true)
    try {
      const response = await fetch(
        `/api/jobs?page=${pageNumber}&limit=${JOBS_PER_PAGE}`
      )

      if (!response.ok) {
        throw new Error('Failed to fetch jobs')
      }

      const data = await response.json()

      if (data.jobs && Array.isArray(data.jobs)) {
        const formattedJobs: Job[] = data.jobs.map((j: any) => ({
          id: j.id,
          title: j.title,
          company_id: j.company_id,
          location: j.location || '',
          job_type: j.job_type || '',
          opportunity_type: j.opportunity_type,
          deadline: j.deadline,
          category: j.category,
          description: j.description || '',
          created_at: j.created_at,
          status: j.status,
          approved: j.approved,
          featured: j.featured || false,
          attachment_url: j.attachment_url,
          applicants: 0
        }))

        setJobs(prev => isNewSearch ? formattedJobs : [...prev, ...formattedJobs])
        setFilteredJobs(prev => isNewSearch ? formattedJobs : [...prev, ...formattedJobs])

        if (!data.hasMore) {
          setHasMore(false)
        } else {
          setHasMore(true)
        }
      }
    } catch (err) {
      console.error("Error fetching jobs:", err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchJobs(0, true)
  }, [])

  const loadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchJobs(nextPage)
  }

  const setFilters = (newFilters: any) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }))
  }

  const addJob = async (jobData: any) => {
    try {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create job')
      }

      const data = await response.json()

      if (data && data.id) {
        const newJob: Job = {
          id: data.id,
          title: data.title,
          company_id: data.company_id,
          location: data.location || '',
          job_type: data.job_type || '',
          opportunity_type: data.opportunity_type,
          deadline: data.deadline,
          category: data.category,
          description: data.description || '',
          created_at: data.created_at,
          status: data.status,
          approved: data.approved,
          featured: data.featured || false,
          attachment_url: data.attachment_url,
          applicants: 0
        }
        setJobs(prev => [newJob, ...prev])
        setFilteredJobs(prev => [newJob, ...prev])
      }
    } catch (error) {
      console.error("Error adding job:", error)
      throw error
    }
  }

  return (
    <JobContext.Provider value={{
      jobs,
      filteredJobs,
      filters,
      setFilters,
      isLoading,
      hasMore,
      loadMore,
      addJob
    }}>
      {children}
    </JobContext.Provider>
  )
}

export function useJobs() {
  const context = useContext(JobContext)
  if (context === undefined) {
    throw new Error('useJobs must be used within a JobProvider')
  }
  return context
}
