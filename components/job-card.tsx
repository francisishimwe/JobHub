"use client"



import { memo } from "react"

import { useRouter } from "next/navigation"

import Image from "next/image"

import { MapPin, UserCheck, BadgeCheck, Share2, Clock, ExternalLink, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CVBuilder } from "@/components/cv-builder"
import { EmailApplicationForm } from "@/components/email-application-form"
import { useState } from "react"

import { useCompanies } from "@/lib/company-context"

import type { Job } from "@/lib/types"



interface JobCardProps {

  job: Job

}



const JobCardComponent = ({ job }: JobCardProps) => {

  const router = useRouter()

  const { getCompanyById } = useCompanies()

  const company = job.companyId ? getCompanyById(job.companyId) : null

  const [showCVBuilder, setShowCVBuilder] = useState(false)
  const [showEmailApplication, setShowEmailApplication] = useState(false)



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


  const handleApplyNow = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // Check if this is an email application
    if (job.application_method?.toLowerCase() === 'email') {
      // Email application - open Email Application Form
      setShowEmailApplication(true)
    } else if (job.planId === 4 || job.priority === 'Top') {
      // Short-listing tier - open CV Builder
      setShowCVBuilder(true)
    } else {
      // Featured/Featured+ tiers - redirect to external URL
      const applicationUrl = job.application_link || job.applicationLink || `mailto:info@rwandajobhub.rw?subject=Application for ${job.title}&body=I am interested in applying for ${job.title} position at ${displayCompany.name}.`
      window.open(applicationUrl, '_blank')
    }
  }

  // Define the handleTitleClick function
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



  // Use company data from job if available, otherwise use fallback info
  const displayCompany = {
    name: job.companyName || job.company?.name || "RwandaJobHub Partner",
    logo: job.companyLogo || job.company?.logo || "/full logo.jpg"
  }


  // Get border color based on job type and priority
  const getJobTypeBorderColor = () => {
    // Check if this is a Tier 4 (Short-listing) job with priority 'Top'
    if (job.priority === 'Top' || job.agencyVerified) {
      return 'border-l-[#ff7b00] border-l-4' // Thick orange border for Tier 4
    }

    const jobType = job.jobType?.toLowerCase() || job.opportunityType?.toLowerCase() || ''

    // Admin jobs (non-agency) get clean, standard look
    if (!job.agencyVerified) {
      if (jobType.includes('job') || jobType.includes('full') || jobType.includes('permanent')) return 'border-l-[#1E40AF]' // Clean Navy for Jobs
      if (jobType.includes('tender') || jobType.includes('bid')) return 'border-l-[#F59E0B]' // Clean Gold for Tenders
      if (jobType.includes('intern') || jobType.includes('trainee')) return 'border-l-[#10B981]' // Clean Emerald for Internships
      if (jobType.includes('part') || jobType.includes('contract')) return 'border-l-green-500'
      if (jobType.includes('volunteer') || jobType.includes('unpaid')) return 'border-l-purple-500'
      return 'border-l-[#1E40AF]' // Default Navy
    }

    // Employer jobs (agency verified) - enhanced look
    if (jobType.includes('job') || jobType.includes('full') || jobType.includes('permanent')) return 'border-l-[#0F172A]' // Navy for Jobs
    if (jobType.includes('tender') || jobType.includes('bid')) return 'border-l-[#F59E0B]' // Gold for Tenders
    if (jobType.includes('intern') || jobType.includes('trainee')) return 'border-l-[#10B981]' // Emerald for Internships
    if (jobType.includes('part') || jobType.includes('contract')) return 'border-l-green-500'
    if (jobType.includes('volunteer') || jobType.includes('unpaid')) return 'border-l-purple-500'
    return 'border-l-[#0F172A]' // Default Navy
  }

  return (
    <div className="block">
      <div className={`rounded-2xl border bg-card pt-6 p-4 md:p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:-translate-y-2 active:scale-105 border-l-4 ${getJobTypeBorderColor()} lg:hover:shadow-2xl`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 lg:gap-4">
          <div className="flex gap-3 md:gap-4 flex-1 min-w-0">
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
            {/* Job Title and Company on same row as Logo */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col gap-y-1 mb-2">
                <h3 
                  className="text-lg md:text-xl font-bold leading-tight transition-all duration-200 cursor-pointer hover:text-blue-700 hover:underline lg:hover:text-blue-800" 
                  style={{ color: '#1E40AF' }}
                  onClick={handleTitleClick}
                >
                  {job.title}
                </h3>
                {displayCompany.name && (
                  <span className="flex items-center gap-1 font-semibold text-slate-800 text-sm md:text-base">
                    {displayCompany.name}
                    {(job.isVerified ?? job.is_verified) && (
                      <BadgeCheck className="h-4 w-4 text-blue-600 transition-colors hover:text-blue-700" aria-label="Verified company" />
                    )}
                    {(job.agencyVerified ?? job.agency_verified) && (
                      <BadgeCheck className="h-4 w-4 text-blue-500 transition-colors hover:text-blue-600" aria-label="Agency verified" />
                    )}
                  </span>
                )}
              </div>

              <div className="mb-2 flex flex-wrap items-center gap-2 md:gap-3 text-xs md:text-sm text-muted-foreground">
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
                {job.jobType && <Badge variant="secondary" className="text-xs transition-colors hover:bg-slate-200">{job.jobType}</Badge>}
                {job.experienceLevel && <Badge variant="secondary" className="text-xs transition-colors hover:bg-slate-200">{job.experienceLevel}</Badge>}
                {job.opportunityType && <Badge variant="secondary" className="text-xs transition-colors hover:bg-slate-200">{job.opportunityType}</Badge>}
              </div>
            </div>
          </div>

          <div className="flex flex-row md:flex-col gap-2 shrink-0 self-end md:self-start">
            {/* Apply Now Button - Only show for Email applications or short-listing tier */}
            {(job.application_method?.toLowerCase() === 'email' || job.planId === 4 || job.priority === 'Top') && (
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white flex-1 md:flex-initial text-xs md:text-sm font-medium transition-all duration-200 hover:scale-105 hover:shadow-lg lg:hover:shadow-xl whitespace-nowrap"
                onClick={handleApplyNow}
              >
                Apply Now
              </Button>
            )}
            <Button
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white flex-1 md:flex-initial text-xs md:text-sm font-medium transition-all duration-200 hover:scale-105 hover:shadow-lg lg:hover:shadow-xl whitespace-nowrap"
              onClick={handleViewDetails}
            >
              View Details
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={shareToWhatsApp}
              className="gap-1 flex-1 md:flex-initial text-xs md:text-sm transition-all duration-200 hover:scale-105 hover:bg-green-50 hover:border-green-300 hover:text-green-700 lg:hover:shadow-md"
            >
              <Share2 className="h-3 w-3" />
              <span className="hidden sm:inline">Share</span>
            </Button>
          </div>
        </div>
      </div>
      
      {/* CV Builder Dialog */}
      <CVBuilder
        jobId={job.id}
        jobTitle={job.title}
        isOpen={showCVBuilder}
        onClose={() => setShowCVBuilder(false)}
        onSuccess={() => {
          setShowCVBuilder(false)
          alert('Application submitted successfully!')
        }}
      />

      {/* Email Application Modal */}
      {showEmailApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">Apply for {job.title}</h2>
              <button
                onClick={() => setShowEmailApplication(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-4">
              <EmailApplicationForm
                jobId={job.id}
                jobTitle={job.title}
                primaryEmail={job.primaryEmail || job.primary_email || ''}
                ccEmails={job.ccEmails || job.cc_emails || ''}
                onSuccess={() => {
                  setShowEmailApplication(false)
                  alert('Application submitted successfully!')
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )

}



// Export memoized version to prevent unnecessary re-renders

export const JobCard = memo(JobCardComponent)

