"use client"

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function InfolinksAds() {
  const pathname = usePathname()

  useEffect(() => {
    // Only run on client side
    if (typeof window !== 'undefined') {
      // Check if we're on Employer Dashboard or Admin Dashboard
      const isDashboard = pathname?.includes('/dashboard') || pathname?.includes('/employer-dashboard')
      
      // Don't load on dashboard pages to avoid interference
      if (!isDashboard) {
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
  }, [pathname])

  return null // This component doesn't render anything
}
