"use client"

import Link from "next/link"
import Image from "next/image"
import { MapPin, Briefcase } from "lucide-react"
import { Job } from "@/lib/types"
import { useCompanies } from "@/lib/company-context"
import { Badge } from "@/components/ui/badge"

interface SimilarJobsProps {
  jobs?: Job[]
  currentJobId: string
  className?: string
}

export function SimilarJobs({ jobs = [], currentJobId, className = "" }: SimilarJobsProps) {
  const { getCompanyById } = useCompanies()

  // Filter out current job and limit to 3
  const filteredJobs = jobs
    .filter(job => job.id !== currentJobId)
    .slice(0, 3)

  if (filteredJobs.length === 0) {
    return null
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <h3 className="text-sm font-semibold text-gray-900">Similar Jobs</h3>
      <div className="space-y-2">
        {filteredJobs.map((job) => {
          const company = getCompanyById(job.companyId)
          return (
            <Link
              key={job.id}
              href={`/jobs/${job.id}`}
              className="block p-2 rounded border hover:border-green-200 hover:bg-green-50/30 transition-colors"
            >
              <div className="flex gap-3">
                {/* Company Logo */}
                <div className="relative w-10 h-10 shrink-0 overflow-hidden rounded-md bg-muted">
                  {company?.logo ? (
                    <Image
                      src={company.logo}
                      alt={company.name}
                      fill
                      className="object-cover"
                      priority
                      quality={60}
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-muted">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                </div>

                {/* Job Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-medium text-green-700 mb-1 break-words">
                    {job.title}
                  </h4>
                  <p className="text-xs text-gray-600 mb-1">
                    {company?.name || "Company"}
                  </p>
                  <div className="flex items-center gap-2">
                    {job.location && (
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <MapPin className="h-3 w-3" />
                        <span className="break-words">{job.location.split(',')[0]}</span>
                      </div>
                    )}
                    <Badge variant="secondary" className="text-xs px-1.5 py-0.5 bg-green-100 text-green-700 border-green-200">
                      Job
                    </Badge>
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
