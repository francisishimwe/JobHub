"use client"

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export function InfolinksAds() {
  const pathname = usePathname()
  const [isClient, setIsClient] = useState(false)

  // Ensure this only runs on client side
  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    // Only run on client side and when component is mounted
    if (!isClient || typeof window === 'undefined') {
      return
    }

    // Check if we're on pages where ads should be disabled
    const isDashboard = pathname?.includes('/dashboard') || pathname?.includes('/employer-dashboard')
    const isScholarship = pathname?.includes('/scholarship') || pathname?.includes('/scholarships')
    const isInternship = pathname?.includes('/internship') || pathname?.includes('/internships')
    const isNotFound = pathname?.includes('/_not-found') || pathname === '/404'
    
    // Check URL parameters for scholarship/internship filters
    const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null
    const hasScholarshipFilter = urlParams?.has('opportunityType') && urlParams?.get('opportunityType')?.toLowerCase().includes('scholarship')
    const hasInternshipFilter = urlParams?.has('opportunityType') && urlParams?.get('opportunityType')?.toLowerCase().includes('internship')
    
    // Check if current page shows scholarship/internship content by examining the page content
    const pageContent = document.body.textContent || document.body.innerText || ''
    const hasScholarshipContent = pageContent.toLowerCase().includes('scholarship')
    const hasInternshipContent = pageContent.toLowerCase().includes('internship')
    
    // Don't load ads on dashboard, scholarship, internship, or not-found pages
    if (!isDashboard && 
        !isScholarship && 
        !isInternship && 
        !isNotFound &&
        !hasScholarshipFilter && 
        !hasInternshipFilter &&
        !hasScholarshipContent &&
        !hasInternshipContent) {
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
  }, [pathname, isClient])

  return null // This component doesn't render anything
}
