"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { createClient } from '@/lib/supabase/client' 
import { Job } from '@/lib/types'

interface JobContextType {
  jobs: Job[]
  filteredJobs: Job[]
  filters: any
  setFilters: (filters: any) => void
  isLoading: boolean
  hasMore: boolean
  loadMore: () => void
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
      const supabase = createClient()
      
      const { data, count, error } = await supabase
        .from('jobs')
        .select('id, title, company_id, location, job_type, opportunity_type, created_at, deadline, featured, description', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(pageNumber * JOBS_PER_PAGE, (pageNumber + 1) * JOBS_PER_PAGE - 1)

      if (error) throw error

      if (data) {
        const formattedJobs: Job[] = data.map((j: any) => ({
          id: j.id,
          title: j.title,
          company_id: j.company_id,     // Fixed: Match Supabase image_a0c792.png
          location: j.location,
          job_type: j.job_type,         // Fixed: Match Supabase image_a06677.png
          opportunity_type: j.opportunity_type,
          deadline: j.deadline,
          featured: j.featured,
          created_at: j.created_at,     // Fixed: Use created_at instead of postedDate
          description: j.description || "", 
          applicants: 0
        }))

        setJobs(prev => isNewSearch ? formattedJobs : [...prev, ...formattedJobs])
        setFilteredJobs(prev => isNewSearch ? formattedJobs : [...prev, ...formattedJobs])
        
        if (count !== null && (pageNumber + 1) * JOBS_PER_PAGE >= count) {
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

  return (
    <JobContext.Provider value={{ 
      jobs, 
      filteredJobs, 
      filters, 
      setFilters, 
      isLoading, 
      hasMore, 
      loadMore 
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