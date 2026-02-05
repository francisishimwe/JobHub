"use client"



import { memo } from "react"

import { useRouter } from "next/navigation"

import Image from "next/image"

import { MapPin, UserCheck, BadgeCheck, Share2, Clock } from "lucide-react"

import { Button } from "@/components/ui/button"

import { Badge } from "@/components/ui/badge"

import { useCompanies } from "@/lib/company-context"

import type { Job } from "@/lib/types"



interface JobCardProps {

  job: Job

}



const JobCardComponent = ({ job }: JobCardProps) => {

  const router = useRouter()

  const { getCompanyById } = useCompanies()

  const company = job.companyId ? getCompanyById(job.companyId) : null



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



    const message = `${job.title} at ${displayCompany.name || 'Unknown Company'}



Location: ${job.location}

Opportunity type: ${job.opportunityType}



Read more and Apply now: ${job.applicationLink || `https://rwandajobhub.rw/jobs/${job.id}`}



Join our WhatsApp group:

https://chat.whatsapp.com/Ky7m3B0M5Gd3saO58Rb1tI



Follow our WhatsApp channel:

https://whatsapp.com/channel/0029Vb6oMYMCXC3SLBiRsT1r`

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`

    window.open(whatsappUrl, '_blank')

  }



  const handleViewDetails = (e: React.MouseEvent) => {

    e.preventDefault()



    // Track view interaction

    trackInteraction('view')



    // Navigate to job details page in the same window

    router.push(`/jobs/${job.id}`)

  }



  const handleTitleClick = (e: React.MouseEvent) => {

    e.preventDefault()

    e.stopPropagation()



    // Track view interaction

    trackInteraction('view')



    // Navigate to job details page in the same window

    router.push(`/jobs/${job.id}`)

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



  // Use company data if available, otherwise use fallback info

  const displayCompany = company || {

    name: "RwandaJobHub Partner",

    logo: "/full logo.jpg"

  }



  // Get border color based on job type

  const getJobTypeBorderColor = () => {

    const jobType = job.jobType?.toLowerCase() || job.opportunityType?.toLowerCase() || ''

    
    if (jobType.includes('job') || jobType.includes('full') || jobType.includes('permanent')) return 'border-l-[#0F172A]' // Navy for Jobs
    if (jobType.includes('tender') || jobType.includes('bid')) return 'border-l-[#F59E0B]' // Gold for Tenders
    if (jobType.includes('intern') || jobType.includes('trainee')) return 'border-l-[#10B981]' // Emerald for Internships
    if (jobType.includes('part') || jobType.includes('contract')) return 'border-l-green-500'
    if (jobType.includes('volunteer') || jobType.includes('unpaid')) return 'border-l-purple-500'
    
    return 'border-l-[#0F172A]' // Default Navy
  }



  return (

    <div className="block">

      <div className={`rounded-2xl border bg-card p-4 lg:p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1 border-l-4 ${getJobTypeBorderColor()} lg:hover:shadow-2xl`}>

        {/* Mobile: Vertical Layout */}
        <div className="flex flex-col gap-4 lg:hidden">
          <div className="flex gap-4">
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-muted transition-transform duration-300 hover:scale-110">
              <Image
                src={displayCompany.logo || "/placeholder.svg"}
                alt={`${displayCompany.name || 'Company'} logo`}
                fill
                className="object-cover"
                loading="lazy"
                quality={75}
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 
                className="mb-2 text-lg font-bold leading-tight transition-all duration-200 cursor-pointer hover:text-blue-700 hover:underline" 
                style={{ color: '#1E40AF' }}
                onClick={handleTitleClick}
              >
                {job.title}
              </h3>
              <div className="mb-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                {displayCompany.name && (
                  <span className="flex items-center gap-1 font-semibold text-slate-800">
                    {displayCompany.name}
                    {(job.isVerified ?? job.is_verified) && (
                      <BadgeCheck className="h-4 w-4 text-blue-600 transition-colors hover:text-blue-700" aria-label="Verified company" />
                    )}
                  </span>
                )}
                {job.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    <span>{job.location}</span>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {job.jobType && <Badge variant="secondary" className="text-xs transition-colors hover:bg-slate-200">{job.jobType}</Badge>}
                {job.experienceLevel && <Badge variant="secondary" className="text-xs transition-colors hover:bg-slate-200">{job.experienceLevel}</Badge>}
                {job.opportunityType && <Badge variant="secondary" className="text-xs transition-colors hover:bg-slate-200">{job.opportunityType}</Badge>}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <UserCheck className="h-4 w-4" />
              <span>{job.applicants} applicants</span>
            </div>
            {daysRemaining !== null && (
              <div className={`flex items-center gap-1 ${daysRemaining <= 3 ? 'text-red-600 font-bold' : daysRemaining <= 7 ? 'text-orange-600 font-semibold' : 'font-medium'}`}>
                <Clock className="h-3 w-3" />
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
          <div className="flex gap-2">
            <Button
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white flex-1 text-sm font-medium transition-all duration-200 hover:scale-105 hover:shadow-lg"
              onClick={handleViewDetails}
            >
              View Details
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={shareToWhatsApp}
              className="gap-1 flex-1 text-sm transition-all duration-200 hover:scale-105 hover:bg-green-50 hover:border-green-300 hover:text-green-700"
            >
              <Share2 className="h-3 w-3" />
              <span>Share</span>
            </Button>
          </div>
        </div>

        {/* Desktop: Horizontal Layout */}
        <div className="hidden lg:flex lg:flex-row lg:items-center lg:justify-between lg:gap-4">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-muted transition-transform duration-300 hover:scale-110">
              <Image
                src={displayCompany.logo || "/placeholder.svg"}
                alt={`${displayCompany.name || 'Company'} logo`}
                fill
                className="object-cover"
                loading="lazy"
                quality={75}
              />
            </div>
            <div className="flex-1 min-w-0 text-left">
              <h3 
                className="mb-1 text-xl font-bold leading-tight transition-all duration-200 cursor-pointer hover:text-blue-700 hover:underline whitespace-normal" 
                style={{ color: '#1E40AF' }}
                onClick={handleTitleClick}
              >
                {job.title}
              </h3>
              <div className="mb-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                {displayCompany.name && (
                  <span className="flex items-center gap-1 font-semibold text-slate-800">
                    {displayCompany.name}
                    {(job.isVerified ?? job.is_verified) && (
                      <BadgeCheck className="h-4 w-4 text-blue-600 transition-colors hover:text-blue-700" aria-label="Verified company" />
                    )}
                  </span>
                )}
                {job.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{job.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <UserCheck className="h-4 w-4" />
                  <span>{job.applicants} applicants</span>
                </div>
                {daysRemaining !== null && (
                  <div className={`flex items-center gap-1 ${daysRemaining <= 3 ? 'text-red-600 font-bold' : daysRemaining <= 7 ? 'text-orange-600 font-semibold' : 'font-medium'}`}>
                    <Clock className="h-4 w-4" />
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
              <div className="flex flex-wrap gap-2">
                {job.jobType && <Badge variant="secondary" className="text-xs transition-colors hover:bg-slate-200">{job.jobType}</Badge>}
                {job.experienceLevel && <Badge variant="secondary" className="text-xs transition-colors hover:bg-slate-200">{job.experienceLevel}</Badge>}
                {job.opportunityType && <Badge variant="secondary" className="text-xs transition-colors hover:bg-slate-200">{job.opportunityType}</Badge>}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 shrink-0">
            <Button
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 text-sm font-medium transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-xl whitespace-nowrap"
              onClick={handleViewDetails}
            >
              View Details
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={shareToWhatsApp}
              className="gap-1 px-6 py-2 text-sm transition-all duration-200 hover:scale-105 hover:bg-green-50 hover:border-green-300 hover:text-green-700 hover:shadow-md whitespace-nowrap"
            >
              <Share2 className="h-3 w-3" />
              <span>Share</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )

}



// Export memoized version to prevent unnecessary re-renders

export const JobCard = memo(JobCardComponent)

