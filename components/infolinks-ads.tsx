"use client"

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useJobs } from '@/lib/job-context'

export function InfolinksAds() {
  const pathname = usePathname()
  const { filters } = useJobs()

  useEffect(() => {
    // Only run on client side
    if (typeof window !== 'undefined') {
      // Check if we're on pages where ads should be disabled
      const isDashboard = pathname?.includes('/dashboard') || pathname?.includes('/employer-dashboard')
      const isScholarship = pathname?.includes('/scholarship') || pathname?.includes('/scholarships')
      const isInternship = pathname?.includes('/internship') || pathname?.includes('/internships')
      
      // Check URL parameters for scholarship/internship filters
      const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null
      const hasScholarshipFilter = urlParams?.has('opportunityType') && urlParams?.get('opportunityType')?.toLowerCase().includes('scholarship')
      const hasInternshipFilter = urlParams?.has('opportunityType') && urlParams?.get('opportunityType')?.toLowerCase().includes('internship')
      
      // Check current filter state from job context
      const hasScholarshipFilterState = filters.opportunityTypes?.some((type: string) => 
        typeof type === 'string' && type.toLowerCase().includes('scholarship')
      )
      const hasInternshipFilterState = filters.opportunityTypes?.some((type: string) => 
        typeof type === 'string' && type.toLowerCase().includes('internship')
      )
      
      // Don't load ads on dashboard, scholarship, or internship pages
      if (!isDashboard && 
          !isScholarship && 
          !isInternship && 
          !hasScholarshipFilter && 
          !hasInternshipFilter &&
          !hasScholarshipFilterState &&
          !hasInternshipFilterState) {
        // Add Infolinks script
        const script1 = document.createElement('script')
        script1.type = 'text/javascript'
        script1.text = `
          var infolinks_pid = 3443818;
          var infolinks_wsid = 0;
        `
        
        const script2 = document.createElement('script')
        script2.type = 'text/javascript'
        script2.src = 'https://resources.infolinks.com/js/infolinks_main.js'
        script2.async = true
        
        // Append scripts to body
        document.body.appendChild(script1)
        document.body.appendChild(script2)
        
        // Cleanup function
        return () => {
          try {
            document.body.removeChild(script1)
            document.body.removeChild(script2)
          } catch (error) {
            // Ignore cleanup errors
          }
        }
      }
    }
  }, [pathname, filters])

  return null // This component doesn't render anything
}
