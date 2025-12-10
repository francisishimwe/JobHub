"use client"

import { memo } from "react"
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

const JobCardComponent = ({ job }: JobCardProps) => {
  const { getCompanyById } = useCompanies()
  const company = getCompanyById(job.companyId)

  const trackInteraction = async (type: 'view' | 'share') => {
    try {
      await fetch('/api/track-application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId: job.id }),
      })
    } catch (error) {
      console.error('Error tracking interaction:', error)
    }
  }

  const shareToWhatsApp = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // Track share interaction
    await trackInteraction('share')

    const message = `${job.title} at ${company?.name || 'Unknown Company'}

Location: ${job.location}
Opportunity type: ${job.opportunityType}

Read more and Apply now: ${job.applicationLink}

Join our WhatsApp group:
https://chat.whatsapp.com/Ky7m3B0M5Gd3saO58Rb1tI

Follow our WhatsApp channel:
https://whatsapp.com/channel/0029Vb6oMYMCXC3SLBiRsT1r`
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  const handleViewDetails = async (e: React.MouseEvent) => {
    e.preventDefault()

    // Track view interaction
    await trackInteraction('view')

    window.open(`/jobs/${job.id}`, '_blank')
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

  // Don't show jobs without companies (company is required)
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
                loading="lazy"
                quality={75}
              />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="mb-2 text-base md:text-lg font-bold leading-tight transition-colors" style={{ color: '#1E40AF' }}>
                {job.title}
              </h3>

              <div className="mb-2 flex flex-wrap items-center gap-2 md:gap-3 text-xs md:text-sm text-muted-foreground">
                {company.name && (
                  <span className="font-semibold text-gray-600">{company.name}</span>
                )}

                {job.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3 md:h-4 md:w-4" />
                    <span>{job.location}</span>
                  </div>
                )}
                <div className="hidden sm:flex items-center gap-1">
                  <UserCheck className="h-4 w-4" />
                  <span>{job.applicants} applicants</span>
                </div>
                {daysRemaining !== null && (
                  <div className={`flex items-center gap-1 ${daysRemaining <= 3 ? 'text-red-600 font-bold' : daysRemaining <= 7 ? 'text-orange-600 font-semibold' : 'font-medium'}`}>
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
                {job.jobType && <Badge variant="secondary" className="text-xs">{job.jobType}</Badge>}
                {job.experienceLevel && <Badge variant="secondary" className="text-xs">{job.experienceLevel}</Badge>}
                {job.opportunityType && <Badge variant="secondary" className="text-xs">{job.opportunityType}</Badge>}
              </div>
            </div>
          </div>

          <div className="flex flex-row md:flex-col gap-2 shrink-0 self-end md:self-start">
            <Button
              size="sm"
              className="text-black hover:opacity-90 flex-1 md:flex-initial text-xs md:text-sm"
              style={{ backgroundColor: '#76c893' }}
              onClick={handleViewDetails}
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

// Export memoized version to prevent unnecessary re-renders
export const JobCard = memo(JobCardComponent)
