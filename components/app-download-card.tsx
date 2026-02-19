"use client"

import React from "react"
import Link from "next/link"
import Image from "next/image"

interface AppDownloadCardProps {
  className?: string
}

export function AppDownloadCard({ className = "" }: AppDownloadCardProps) {
  const playStoreUrl = "https://play.google.com/store/apps/details?id=com.rwandajobhub.app"

  return (
    <div className={`bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-300 ${className}`}>
      <div className="text-center space-y-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Search & Apply on the Go
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Get the RwandaJobHub mobile app and never miss a job opportunity. 
            Apply instantly, track applications, and receive job alerts on your phone.
          </p>
        </div>
        
        <div className="pt-2">
          <Link 
            href={playStoreUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block hover:opacity-90 transition-opacity duration-200"
            aria-label="Download RwandaJobHub app on Google Play Store"
          >
            <Image
              src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
              alt="Get it on Google Play"
              width={200}
              height={60}
              className="h-auto w-full max-w-[200px]"
              priority={false}
            />
          </Link>
        </div>
      </div>
    </div>
  )
}
