'use client'

import { useEffect } from 'react'
import { MonetagAd } from './monetag-ads'

interface AdInjectorProps {
  children: React.ReactNode
}

export function AdInjector({ children }: AdInjectorProps) {
  useEffect(() => {
    // Only inject on allowed pages
    const allowedPages = ['/testimonials', '/about', '/help']
    
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname
      const isAllowedPage = allowedPages.some(page => currentPath.includes(page))
      
      if (isAllowedPage) {
        // Inject scripts at the bottom of body after page loads
        const injectScript = (html: string) => {
          const script = document.createElement('div')
          script.innerHTML = html
          document.body.appendChild(script)
        }

        // Zone 10694086 - In-Page Push
        injectScript(
          `(function(s){s.dataset.zone='10694086',s.src='https://nap5k.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script'))</script>`
        )

        // Zone 10694087 - Vignette Banner  
        injectScript(
          `(function(s){s.dataset.zone='10694087',s.src='https://gizokraijaw.net/vignette.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script'))</script>`
        )

        // Zone 10694066 - Push Notifications
        injectScript(
          `<script src="https://5gvci.com/act/files/tag.min.js?z=10694066" data-cfasync="false" async></script>`
        )
      }
    }
  }, [])

  return <>{children}</>
}
