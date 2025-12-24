"use client"

import { useEffect, useRef } from "react"

interface AdContainerProps {
  className?: string
  id?: string
}

export function AdContainer({ className = "", id }: AdContainerProps) {
  const adRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Trigger ad refresh if needed
    if (typeof window !== 'undefined' && adRef.current) {
      // RichAds will automatically detect and fill this container
      const event = new CustomEvent('richads-refresh')
      window.dispatchEvent(event)
    }
  }, [])

  return (
    <div 
      ref={adRef}
      id={id}
      className={`richads-container my-6 ${className}`}
      data-ad-slot="auto"
    >
      {/* Ad will be inserted here by RichAds script */}
      <div className="min-h-[100px] bg-muted/30 rounded-lg flex items-center justify-center text-xs text-muted-foreground">
        Advertisement
      </div>
    </div>
  )
}
