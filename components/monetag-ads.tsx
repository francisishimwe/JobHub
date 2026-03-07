"use client"

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function MonetagAds() {
  const pathname = usePathname()

  useEffect(() => {
    // Only run on client side
    if (typeof window !== 'undefined') {
      // Check if current page should show ads
      const shouldShowAds = shouldShowMonetagAds(pathname)
      
      if (shouldShowAds) {
        // Load Monetag ad scripts
        loadMonetagAds()
      }
    }
  }, [pathname])

  // Function to determine if ads should be shown on current page
  const shouldShowMonetagAds = (path: string | null): boolean => {
    if (!path) return false
    
    // Pages that SHOULD show ads
    const adAllowedPages = [
      '/blog',
      '/blogs', 
      '/scholarship',
      '/scholarships',
      '/internship',
      '/internships',
      '/education',
      '/help',
      '/about',
      '/about-us',
      '/contact',
      '/contact-us'
    ]
    
    // Pages that should NOT show ads (Safety Zone)
    const adBlockedPages = [
      '/', // Home page - Job Listings
      '/jobs',
      '/tenders',
      '/dashboard',
      '/employer-dashboard',
      '/employers',
      '/post-job',
      '/post-advert'
    ]
    
    // Check if current path is in blocked pages (Safety Zone)
    const isBlockedPage = adBlockedPages.some(blockedPath => 
      path === blockedPath || path.startsWith(blockedPath + '/')
    )
    
    // Check if current path is in allowed pages
    const isAllowedPage = adAllowedPages.some(allowedPath => 
      path === allowedPath || path.startsWith(allowedPath + '/')
    )
    
    // Only show ads on allowed pages and NOT on blocked pages
    return isAllowedPage && !isBlockedPage
  }

  // Function to load Monetag ad scripts
  const loadMonetagAds = () => {
    try {
      // 1. In-Page Push (Zone 10694086)
      const inPagePushScript = document.createElement('script')
      inPagePushScript.text = `(function(s){s.dataset.zone='10694086',s.src='https://nap5k.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))`
      document.body.appendChild(inPagePushScript)

      // 2. Vignette Banner (Zone 10694087)
      const vignetteScript = document.createElement('script')
      vignetteScript.text = `(function(s){s.dataset.zone='10694087',s.src='https://gizokraijaw.net/vignette.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))`
      document.body.appendChild(vignetteScript)

      // 3. Push Notifications (Zone 10694066)
      const pushNotificationScript = document.createElement('script')
      pushNotificationScript.src = 'https://5gvci.com/act/files/tag.min.js?z=10694066'
      pushNotificationScript.setAttribute('data-cfasync', 'false')
      pushNotificationScript.async = true
      document.body.appendChild(pushNotificationScript)

      console.log('✅ Monetag ads loaded successfully')
      
    } catch (error) {
      console.error('❌ Error loading Monetag ads:', error)
    }
  }

  // This component doesn't render anything visible
  return null
}
