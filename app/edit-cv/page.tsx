"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { CVBuilder } from "@/components/cv-builder"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

function EditCVContent() {
  const searchParams = useSearchParams()
  const jobId = searchParams.get("jobId")
  const jobTitle = searchParams.get("jobTitle") || "Job Position"

  if (!jobId) {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Job ID is required. Please access this page from a job listing.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <CVBuilder 
        jobId={jobId} 
        jobTitle={jobTitle} 
        isOpen={true} 
        onClose={() => window.history.back()} 
      />
    </div>
  )
}

export default function EditCVPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    }>
      <EditCVContent />
    </Suspense>
  )
}
