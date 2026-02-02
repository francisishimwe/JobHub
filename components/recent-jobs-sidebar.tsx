"use client"

import { useJobs } from "@/lib/job-context"
import { useCompanies } from "@/lib/company-context"
import { AdContainer } from "@/components/ad-container"
import Link from "next/link"
import Image from "next/image"
import { Clock, MapPin, Briefcase } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface RecentJobsSidebarProps {
  currentJobId?: string
}

export function RecentJobsSidebar({ currentJobId }: RecentJobsSidebarProps) {
  const { jobs } = useJobs()
  const { getCompanyById } = useCompanies()

  // Get 5 most recent jobs excluding current job
  const recentJobs = jobs
    .filter(job => job.id !== currentJobId)
    .sort((a, b) => b.postedDate.getTime() - a.postedDate.getTime())
    .slice(0, 5)

  if (recentJobs.length === 0) return null

  return (
    <div className="bg-card rounded-lg border shadow-sm p-4">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Clock className="h-5 w-5" />
        Recent Jobs
      </h3>
      <div className="space-y-3">
        {recentJobs.map((job) => {
          const company = getCompanyById(job.companyId)
          
          return (
            <Link 
              key={job.id} 
              href={`/jobs/${job.id}`}
              className="block group"
            >
              <div className="p-3 rounded-lg border hover:border-black/20 hover:bg-muted/50 transition-all">
                <div className="flex gap-3">
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-muted">
                    {company?.logo ? (
                      <Image
                        src={company.logo}
                        alt={company.name}
                        fill
                        className="object-cover"
                        loading="lazy"
                        quality={60}
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-muted">
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                      {job.title}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {company?.name}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className="text-xs">
                        {job.opportunityType}
                      </Badge>
                      {job.location && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span className="truncate">{job.location.split(',')[0]}</span>
                        </div>
                      )}
                    </div>
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
