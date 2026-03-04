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
    category: '',
    opportunityTypes: [] as string[],
  })

  const JOBS_PER_PAGE = 15

  const fetchJobs = async (pageNumber: number, isNewSearch: boolean = false) => {
    setIsLoading(true)
    try {
      console.log("🔄 Starting job fetch...")
      const response = await fetch(`/api/jobs?page=${pageNumber}&limit=${JOBS_PER_PAGE}`)
      if (!response.ok) throw new Error('Failed to fetch jobs')

      const data = await response.json()
      console.log(`✓ API Response: ${data.jobs?.length} jobs received (page ${pageNumber})`, data)

      if (data.jobs && Array.isArray(data.jobs)) {
        // Filter out any null/undefined jobs before mapping
        const validJobs = data.jobs.filter((job: any) => job != null)
        console.log(`✓ Filtered to ${validJobs.length} valid jobs`)
        
        // Use mapping function to convert snake_case to camelCase
        const formattedJobs: Job[] = validJobs.map((job: any, index: number) => {
          try {
            console.log(`🔍 Mapping job ${index}:`, { id: job.id, title: job.title, category: job.category })
            const mappedJob = mapDatabaseJobToUIJob(job);
            console.log(`🔍 Mapped job ${index}:`, { id: mappedJob.id, title: mappedJob.title, category: mappedJob.category })
            console.log(`🔍 Full mapped job ${index}:`, mappedJob)
            // Additional validation to ensure we have required fields
            if (!mappedJob || !mappedJob.id) {
              console.warn(`⚠️ Job at index ${index} failed mapping:`, job);
              return null;
            }
            return mappedJob;
          } catch (error) {
            console.error(`❌ Error mapping job at index ${index}:`, error, job);
            return null;
          }
        }).filter((job: Job | null): job is Job => job !== null && job.id !== '');
        
        console.log(`✓ Formatted: ${formattedJobs.length} jobs mapped to UI format`)
        console.log(`🔍 Formatted jobs details:`, formattedJobs.map(job => ({ id: job.id, title: job.title, category: job.category })))
        
        setJobs(prev => {
          console.log('🔄 About to set jobs:', formattedJobs.length, 'jobs')
          console.log('🔄 Current jobs before set:', prev.length)
          const result = isNewSearch ? formattedJobs : [...prev, ...formattedJobs]
          console.log('🔄 Final jobs after set:', result.length)
          return result
        })
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
    console.log("🚀 JobProvider: Initial load starting...")
    fetchJobs(0, true)
  }, [])

  // Live Filtering Logic
  useEffect(() => {
    console.log('🔍 Filtering jobs:', {
      totalJobs: jobs.length,
      filters: filters,
      sampleJob: jobs[0] ? {
        id: jobs[0].id,
        title: jobs[0].title,
        category: jobs[0].category,
        opportunityType: jobs[0].opportunityType
      } : null
    })
    
    // Log all job categories for debugging
    console.log('📋 All job categories:', jobs.map(job => ({ id: job.id, title: job.title, category: job.category })))
    
    let filtered = [...jobs]
    
    // IMPORTANT: Don't filter if no filters are set
    const hasActiveFilters = filters.search || filters.location || filters.category || (filters.opportunityTypes && filters.opportunityTypes.length > 0)
    
    if (!hasActiveFilters) {
      console.log('🔄 No active filters - showing all jobs')
      setFilteredJobs(jobs)
      return
    }
    
    if (filters.search) {
      const s = filters.search.toLowerCase()
      filtered = filtered.filter(job => job.title.toLowerCase().includes(s) || job.description?.toLowerCase().includes(s))
      console.log('🔍 After search filter:', filtered.length)
    }
    if (filters.location) {
      const l = filters.location.toLowerCase()
      filtered = filtered.filter(job => job.location.toLowerCase().includes(l))
      console.log('🔍 After location filter:', filtered.length)
    }
    if (filters.category) {
      const c = filters.category.toLowerCase()
      console.log('🔍 Filtering by category:', c)
      console.log('🔍 Available categories in jobs:', [...new Set(jobs.map(job => job.category))])
      filtered = filtered.filter(job => {
        const category = (job.category || '').toLowerCase()
        const matches = category === c || category.includes(c)
        console.log(`🔍 Job "${job.title}" category "${category}" matches "${c}":`, matches)
        return matches
      })
      console.log('🔍 After category filter:', filtered.length)
    }
    if (filters.opportunityTypes?.length > 0) {
      filtered = filtered.filter(job => {
        const opportunityType = (job.opportunityType || job.opportunity_type || '').toLowerCase()
        return filters.opportunityTypes.some(filterType => {
          const filter = filterType.toLowerCase()
          // More flexible matching for different naming conventions
          if (filter === 'job') return opportunityType.includes('job') || opportunityType.includes('full') || opportunityType.includes('permanent')
          if (filter === 'tender') return opportunityType.includes('tender') || opportunityType.includes('bid')
          if (filter === 'internship') return opportunityType.includes('intern') || opportunityType.includes('trainee')
          if (filter === 'scholarship') return opportunityType.includes('scholarship')
          if (filter === 'education') return opportunityType.includes('education') || opportunityType.includes('course')
          if (filter === 'blog') return opportunityType.includes('blog') || opportunityType.includes('article')
          return opportunityType.includes(filter)
        })
      })
      console.log('🔍 After opportunity types filter:', filtered.length)
    } else {
      // When no opportunity types are selected (Featured is clicked), show ALL active items
      // across Jobs, Tenders, Internships, Scholarships, Education, Blogs (no extra filter).
    }
    console.log('🔍 Final filtered jobs count:', filtered.length)
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
    console.log('🚀 addJob called with data:', jobData)
    console.log('🔍 jobData keys:', Object.keys(jobData))
    console.log('🔍 jobData.company_id:', jobData.company_id)
    
    try {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobData),
      })
      
      console.log('📡 Response status:', response.status)
      console.log('📡 Response ok:', response.ok)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('❌ API Error response:', errorData)
        const errorMessage = errorData.error || `Failed to create job (${response.status})`
        throw new Error(errorMessage)
      }
      
      const data = await response.json()
      console.log('✅ API Success response:', data)
      
      // Handle new response format: { success: true, job: {...}, message: ..., database: ... }
      // Handle old response format: { id, title, ... } (for backward compatibility)
      if (data.success && data.job) {
        console.log('✅ Job created with new format:', data.job)
        
        // Show success message if in simulation mode
        if (!data.database) {
          console.log('⚠️ Job created in simulation mode:', data.message)
        }
      } else {
        // Fallback to old format for backward compatibility
        console.log('✅ Job created with old format:', data)
      }
      
      // Re-fetch page 0 to show the newest job immediately
      console.log('🔄 Refreshing job list...')
      fetchJobs(0, true)
    } catch (error) {
      console.error('❌ addJob error:', error)
      console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack available')
      throw error
    }
  }

  const updateJob = async (jobId: string, jobData: any) => {
    const response = await fetch(`/api/jobs/${jobId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(jobData),
    })
    if (!response.ok) throw new Error('Failed to update job')
    // Update the job in local state
    setJobs(prev => prev.map(job => job.id === jobId ? { ...job, ...jobData } : job))
  }

  const deleteJob = async (jobId: string) => {
    const response = await fetch(`/api/jobs/${jobId}`, { method: 'DELETE' })
    if (!response.ok) throw new Error('Delete failed')
    setJobs(prev => prev.filter(job => job.id !== jobId))
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