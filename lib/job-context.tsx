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
  deleteJob: (jobId: string) => Promise<void>
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
      const response = await fetch(`/api/jobs?page=${pageNumber}&limit=${JOBS_PER_PAGE}`)
      if (!response.ok) throw new Error('Failed to fetch jobs')

      const data = await response.json()

      if (data.jobs && Array.isArray(data.jobs)) {
        const formattedJobs: Job[] = data.jobs.map((j: any) => ({
          ...j,
          // Bridge the gap between Database (snake_case) and UI (camelCase)
          companyId: j.company_id,
          jobType: j.job_type,
          opportunityType: j.opportunity_type,
          postedDate: j.created_at,
          // Safety: If company_id is null (common in your JSON), provide a fallback
          company: j.company || { name: "RwandaJobHub Partner", logo: "/full logo.jpg" },
          applicants: j.applicants || 0
        }))

        setJobs(prev => isNewSearch ? formattedJobs : [...prev, ...formattedJobs])
        setHasMore(data.hasMore)
      }
    } catch (err) {
      console.error("Critical: Error fetching jobs:", err)
    } finally {
      setIsLoading(false)
    }
  }

  // Initial Load
  useEffect(() => {
    fetchJobs(0, true)
  }, [])

  // Live Filtering Logic
  useEffect(() => {
    let filtered = [...jobs]
    if (filters.search) {
      const s = filters.search.toLowerCase()
      filtered = filtered.filter(j => j.title.toLowerCase().includes(s) || j.description?.toLowerCase().includes(s))
    }
    if (filters.location) {
      const l = filters.location.toLowerCase()
      filtered = filtered.filter(j => j.location.toLowerCase().includes(l))
    }
    if (filters.opportunityTypes?.length > 0) {
      filtered = filtered.filter(j => filters.opportunityTypes.includes(j.opportunity_type))
    }
    setFilteredJobs(filtered)
  }, [jobs, filters])

  const loadMore = () => {
    if (!isLoading && hasMore) {
      const nextPage = page + 1
      setPage(nextPage)
      fetchJobs(nextPage, false)
    }
  }

  const setFilters = (newFilters: any) => setFiltersState(prev => ({ ...prev, ...newFilters }))

  const addJob = async (jobData: any) => {
    const response = await fetch('/api/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(jobData),
    })
    if (!response.ok) throw new Error('Failed to create job')
    const data = await response.json()
    // Re-fetch page 0 to show the newest job immediately
    fetchJobs(0, true)
  }

  const deleteJob = async (jobId: string) => {
    const response = await fetch(`/api/jobs/${jobId}`, { method: 'DELETE' })
    if (!response.ok) throw new Error('Delete failed')
    setJobs(prev => prev.filter(j => j.id !== jobId))
  }

  return (
    <JobContext.Provider value={{ jobs, filteredJobs, filters, setFilters, isLoading, hasMore, loadMore, addJob, deleteJob }}>
      {children}
    </JobContext.Provider>
  )
}

export const useJobs = () => {
  const context = useContext(JobContext)
  if (!context) throw new Error('useJobs must be used within JobProvider')
  return context
}