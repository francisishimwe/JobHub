'use client'

import { useEffect, useRef } from 'react'

interface TargetedMonetagAdProps {
  className?: string
}

export function TargetedMonetagAds({ className = "" }: TargetedMonetagAdProps) {
  const adContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Only load on allowed pages: About Us, Contact Us, Help
    const allowedPages = ['/about', '/contact', '/help']
    const currentPath = window.location.pathname
    const isAllowedPage = allowedPages.some(page => currentPath.includes(page))
    
    if (!isAllowedPage || !adContainerRef.current) {
      return
    }

    // Load scripts at the bottom of body after content is visible
    const loadScripts = () => {
      const container = adContainerRef.current
      if (!container) return

      // Clear existing scripts
      container.innerHTML = ''

      // In-Page Push (Zone 10694086)
      const inPagePushScript = document.createElement('script')
      inPagePushScript.text = `(function(s){s.dataset.zone='10694086',s.src='https://nap5k.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))`
      container.appendChild(inPagePushScript)

      // Vignette Banner (Zone 10694087)
      const vignetteScript = document.createElement('script')
      vignetteScript.text = `(function(s){s.dataset.zone='10694087',s.src='https://gizokraijaw.net/vignette.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))`
      container.appendChild(vignetteScript)

      // Push Notifications (Zone 10694066)
      const pushNotificationScript = document.createElement('script')
      pushNotificationScript.src = "https://5gvci.com/act/files/tag.min.js?z=10694066"
      pushNotificationScript.setAttribute('data-cfasync', 'false')
      pushNotificationScript.async = true
      container.appendChild(pushNotificationScript)
    }

    // Delay loading to ensure content is visible first
    const timer = setTimeout(loadScripts, 1000)

    return () => {
      clearTimeout(timer)
      if (adContainerRef.current) {
        adContainerRef.current.innerHTML = ''
      }
    }
  }, [])

  // Don't render anything on ad-free zones
  if (typeof window !== 'undefined') {
    const currentPath = window.location.pathname
    const allowedPages = ['/about', '/contact', '/help']
    const isAllowedPage = allowedPages.some(page => currentPath.includes(page))
    
    if (!isAllowedPage) {
      return null
    }
  }

  return (
    <div 
      ref={adContainerRef} 
      className={`targeted-monetag-ads ${className}`}
      style={{ display: 'none' }} // Scripts are injected, no visible content needed
    />
  )
}
