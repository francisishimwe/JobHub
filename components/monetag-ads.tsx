'use client'

interface MonetagAdProps {
  zone: string
  className?: string
}

export function MonetagAd({ zone, className = "" }: MonetagAdProps) {
  // Only render on allowed pages
  const allowedPages = ['/testimonials', '/about', '/help']
  
  if (typeof window !== 'undefined') {
    const currentPath = window.location.pathname
    const isAllowedPage = allowedPages.some(page => currentPath.includes(page))
    
    if (!isAllowedPage) {
      return null // Don't render on ad-free zones
    }
  }

  // Zone mapping
  const zoneConfigs = {
    '10694086': {
      script: `(function(s){s.dataset.zone='10694086',s.src='https://nap5k.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script'))</script>`
    },
    '10694087': {
      script: `(function(s){s.dataset.zone='10694087',s.src='https://gizokraijaw.net/vignette.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script'))</script>`
    },
    '10694066': {
      script: `<script src="https://5gvci.com/act/files/tag.min.js?z=10694066" data-cfasync="false" async></script>`
    }
  }

  const config = zoneConfigs[zone as keyof typeof zoneConfigs]
  
  if (!config) {
    console.warn(`Unknown Monetag zone: ${zone}`)
    return null
  }

  return (
    <div className={className} data-zone={zone}>
      <div
        dangerouslySetInnerHTML={{ __html: config.script }}
      />
    </div>
  )
}
