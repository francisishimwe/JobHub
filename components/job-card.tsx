"use client"

import Image from "next/image"
import Link from "next/link"
import { MapPin, UserCheck, BadgeCheck, Share2, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCompanies } from "@/lib/company-context"
import type { Job } from "@/lib/types"

interface JobCardProps {
  job: Job
}

export function JobCard({ job }: JobCardProps) {
  const { getCompanyById } = useCompanies()
  const company = getCompanyById(job.companyId)

  const shareToWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const jobUrl = `${window.location.origin}/jobs/${job.id}`
    const message = `Check out this job opportunity: ${job.title} at ${company?.name || 'Unknown Company'}. Apply now: ${jobUrl}`
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  // Calculate days remaining
  const getDaysRemaining = () => {
    if (!job.deadline) return null
    const deadline = new Date(job.deadline)
    const today = new Date()
    const diffTime = deadline.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const daysRemaining = getDaysRemaining()

  if (!company) return null

  return (
    <Link href={`/jobs/${job.id}`} className="block">
      <div className="rounded-lg border bg-card p-4 md:p-6 shadow-sm transition-shadow hover:shadow-md">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 md:gap-4">
          <div className="flex gap-3 md:gap-4 flex-1 min-w-0">
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-muted">
              <Image
                src={company.logo || "/placeholder.svg"}
                alt={`${company.name} logo`}
                fill
                className="object-cover"
              />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="mb-2 text-base md:text-lg font-semibold leading-tight text-card-foreground hover:text-primary transition-colors">
                {job.title}
              </h3>

              <div className="mb-2 flex flex-wrap items-center gap-2 md:gap-3 text-xs md:text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{company.name}</span>
                
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3 md:h-4 md:w-4" />
                  <span>{job.location}</span>
                </div>
                <div className="hidden sm:flex items-center gap-1">
                  <UserCheck className="h-4 w-4" />
                  <span>{job.applicants} applicants</span>
                </div>
                {daysRemaining !== null && (
                  <div className={`flex items-center gap-1 ${daysRemaining <= 3 ? 'text-red-600 font-semibold' : daysRemaining <= 7 ? 'text-orange-600' : ''}`}>
                    <Clock className="h-3 w-3 md:h-4 md:w-4" />
                    <span>
                      {daysRemaining > 0 
                        ? `${daysRemaining} day${daysRemaining !== 1 ? 's' : ''} left`
                        : daysRemaining === 0 
                        ? 'Last day!' 
                        : 'Expired'}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-1.5 md:gap-2">
                <Badge variant="secondary" className="text-xs">{job.jobType}</Badge>
                <Badge variant="secondary" className="text-xs">{job.experienceLevel}</Badge>
                <Badge variant="secondary" className="text-xs">{job.opportunityType}</Badge>
              </div>
            </div>
          </div>

          <div className="flex flex-row md:flex-col gap-2 shrink-0 self-end md:self-start">
            <Button
              size="sm"
              className="text-black hover:opacity-90 flex-1 md:flex-initial text-xs md:text-sm"
              style={{ backgroundColor: '#76c893' }}
              onClick={(e) => {
                e.preventDefault()
                window.open(`/jobs/${job.id}`, '_blank')
              }}
            >
              View Details
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={shareToWhatsApp}
              className="gap-1 flex-1 md:flex-initial text-xs md:text-sm"
            >
              <Share2 className="h-3 w-3" />
              <span className="hidden sm:inline">Share</span>
            </Button>
          </div>
        </div>
      </div>
    </Link>
  )
}
