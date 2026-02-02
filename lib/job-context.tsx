"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Job } from '@/lib/types'
import { mapDatabaseJobToUIJob } from '@/lib/utils'

interface JobContextType {
  jobs: Job[]
  filteredJobs: Job[]
  filters: any
  setFilters: (filters: any) => void
  isLoading: boolean
  hasMore: boolean
  loadMore: () => void
  addJob: (jobData: any) => Promise<void>
  updateJob: (jobId: string, jobData: any) => Promise<void>
  deleteJob: (jobId: string) => Promise<void>
  featuredCount: number
}

const JobContext = createContext<JobContextType | undefined>(undefined)

export function JobProvider({ children }: { children: ReactNode }) {
  const [jobs, setJobs] = useState<Job[]>([])
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [featuredCount, setFeaturedCount] = useState(0)
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
      console.log(`✓ API Response: ${data.jobs?.length} jobs received (page ${pageNumber})`)

      if (data.jobs && Array.isArray(data.jobs)) {
        // Use the mapping function to convert snake_case to camelCase
        const formattedJobs: Job[] = data.jobs.map(mapDatabaseJobToUIJob)

        console.log(`✓ Formatted: ${formattedJobs.length} jobs mapped to UI format`)
        setJobs(prev => isNewSearch ? formattedJobs : [...prev, ...formattedJobs])
        setHasMore(data.hasMore)
        if (isNewSearch) {
          // Prefer the canonical featuredCount (server-synced); featuredGroupCount is legacy.
          if (data.featuredCount !== undefined) {
            setFeaturedCount(Number(data.featuredCount) || 0)
          } else if (data.featuredGroupCount !== undefined) {
            setFeaturedCount(Number(data.featuredGroupCount) || 0)
          }
        }
      } else {
        console.warn('⚠ No jobs array in API response:', data)
        setJobs(isNewSearch ? [] : jobs)
      }
    } catch (err) {
      console.error("❌ Error fetching jobs:", err)
      setJobs(isNewSearch ? [] : jobs)
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
      filtered = filtered.filter(j => filters.opportunityTypes.includes(j.opportunityType || j.opportunity_type || ''))
    } else {
      // When no opportunity types are selected (Featured is clicked):
      // - If there are active featured items, show only featured.
      // - If there are truly 0 featured items, fall back to showing recent jobs (avoid empty screen).
      if (featuredCount > 0) {
        filtered = filtered.filter(j => j.featured)
      }
    }
    setFilteredJobs(filtered)
  }, [jobs, filters, featuredCount])

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

  const updateJob = async (jobId: string, jobData: any) => {
    const response = await fetch(`/api/jobs/${jobId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(jobData),
    })
    if (!response.ok) throw new Error('Failed to update job')
    // Update the job in the local state
    setJobs(prev => prev.map(j => j.id === jobId ? { ...j, ...jobData } : j))
  }

  const deleteJob = async (jobId: string) => {
    const response = await fetch(`/api/jobs/${jobId}`, { method: 'DELETE' })
    if (!response.ok) throw new Error('Delete failed')
    setJobs(prev => prev.filter(j => j.id !== jobId))
  }

  return (
    <JobContext.Provider value={{ jobs, filteredJobs, filters, setFilters, isLoading, hasMore, loadMore, addJob, updateJob, deleteJob, featuredCount }}>
      {children}
    </JobContext.Provider>
  )
}

export const useJobs = () => {
  const context = useContext(JobContext)
  if (!context) throw new Error('useJobs must be used within JobProvider')
  return context
}