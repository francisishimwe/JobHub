"use client"

import React from "react"

interface AdContainerProps {
  slot?: string
  className?: string
}

export function AdContainer({ slot = "sidebar", className = "" }: AdContainerProps) {
  return (
    <div 
      className={`bg-[#f8fafc] rounded-2xl p-4 min-h-[300px] relative ${className}`}
    >
      {/* Featured Badge */}
      <div className="absolute top-3 left-3">
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
          {slot === "sidebar" ? "Featured" : "Partner"}
        </span>
      </div>
      
      <div className="text-center space-y-2 mt-8">
        <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
          Advertisement
        </p>
        <p className="text-sm text-slate-500">
          Contact us to place your <br /> brand here
        </p>
      </div>
    </div>
  )
}