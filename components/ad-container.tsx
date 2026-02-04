"use client"

import React from "react"

interface AdContainerProps {
  slot?: string
  className?: string
}

export function AdContainer({ slot = "sidebar", className = "" }: AdContainerProps) {
  return (
    <div 
      className={`bg-gray-50 rounded-xl p-4 min-h-[300px] ${className}`}
    >
      <div className="text-center space-y-2">
        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
          Advertisement
        </p>
        <p className="text-sm text-gray-500">
          Contact us to place your <br /> brand here
        </p>
      </div>
    </div>
  )
}