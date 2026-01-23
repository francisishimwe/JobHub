"use client"

import React from "react"

interface AdContainerProps {
  slot?: string
  className?: string
}

export function AdContainer({ slot = "sidebar", className = "" }: AdContainerProps) {
  return (
    <div 
      className={`bg-muted/30 border-2 border-dashed border-muted flex items-center justify-center rounded-xl p-4 min-h-[300px] ${className}`}
    >
      <div className="text-center space-y-2">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Advertisement
        </p>
        <p className="text-sm text-muted-foreground/60">
          Contact us to place your <br /> brand here
        </p>
      </div>
    </div>
  )
}