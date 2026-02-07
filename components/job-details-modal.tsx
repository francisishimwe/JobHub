"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, DollarSign, Briefcase, Clock, CheckCircle2, ExternalLink } from "lucide-react"
import Image from "next/image"
import type { Job } from "@/lib/types"
import { EmailApplicationForm } from "@/components/email-application-form"
import { InternalApplicationModal } from "@/components/internal-application-modal"

interface JobDetailsModalProps {
  job: Job | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function JobDetailsModal({ job, open, onOpenChange }: JobDetailsModalProps) {
  const [showApplicationForm, setShowApplicationForm] = useState(false)
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false)
  
  if (!job) return null

  const handleApply = () => {
    if (job.applicationMethod === 'email' || job.application_method === 'email') {
      setIsApplyModalOpen(true)
    } else if (job.applicationLink) {
      window.open(job.applicationLink, "_blank", "noopener,noreferrer")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-4">
            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
              <Image
                src={job.companyLogo || job.company?.logo || "/placeholder.svg"}
                alt={`${job.company?.name || 'Company'} logo`}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-2xl">{job.title}</DialogTitle>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{job.company?.name || 'Unknown Company'}</span>

              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Job Overview */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>
                {job.location} • {job.locationType}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Briefcase className="h-4 w-4 text-muted-foreground" />
              <span>{job.jobType}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{job.experienceLevel}</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="mb-2 text-sm font-semibold">Description</h3>
            <div 
              className="prose prose-sm max-w-none text-slate-700 font-normal leading-relaxed text-sm
                [&_p]:mb-2 [&_p]:leading-relaxed [&_p]:break-words [&_p]:overflow-wrap-break-word [&_p]:whitespace-pre-wrap
                [&_ul]:list-disc [&_ul]:ml-4 [&_ul]:mb-2 [&_ul]:space-y-1 [&_ul]:break-words
                [&_ol]:list-decimal [&_ol]:ml-4 [&_ol]:mb-2 [&_ol]:space-y-1 [&_ol]:break-words
                [&_li]:mb-1 [&_li]:leading-relaxed [&_li]:break-words [&_li]:overflow-wrap-break-word
                [&_strong]:font-semibold [&_strong]:text-gray-900 [&_strong]:break-words
                [&_b]:font-semibold [&_b]:text-gray-900 [&_b]:break-words
                [&_h1]:text-base [&_h1]:font-semibold [&_h1]:text-gray-900 [&_h1]:mb-2 [&_h1]:break-words
                [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-gray-900 [&_h2]:mb-2 [&_h2]:break-words
                [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-gray-900 [&_h3]:mb-2 [&_h3]:break-words
                [&_h4]:text-base [&_h4]:font-semibold [&_h4]:text-gray-900 [&_h4]:mb-2 [&_h4]:break-words
                [&_h5]:text-base [&_h5]:font-semibold [&_h5]:text-gray-900 [&_h5]:mb-2 [&_h5]:break-words
                [&_h6]:text-base [&_h6]:font-semibold [&_h6]:text-gray-900 [&_h6]:mb-2 [&_h6]:break-words
                [&_a]:text-blue-600 [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-blue-800 [&_a]:break-all
                [&_blockquote]:border-l-2 [&_blockquote]:border-gray-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:leading-relaxed [&_blockquote]:break-words
                [&_code]:bg-gray-100 [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:font-mono [&_code]:text-xs break-all
                [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded [&_img]:my-2
                [&_table]:w-full [&_table]:border-collapse [&_table]:my-2 [&_table]:overflow-hidden break-words
                [&_td]:border [&_td]:border-gray-200 [&_td]:p-2 [&_td]:align-top break-words [&_td]:whitespace-pre-wrap
                [&_th]:border [&_th]:border-gray-200 [&_th]:p-2 [&_th]:bg-gray-50 [&_th]:font-semibold [&_th]:text-left [&_th]:break-words
              "
              dangerouslySetInnerHTML={{ __html: job.description || '' }}
            />
          </div>

          {/* Stats */}
          <div className="rounded-lg bg-muted p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total Applicants</span>
              <span className="font-semibold">{job.applicants}</span>
            </div>
          </div>

          {/* Apply Button */}
          <div className="flex gap-3 border-t pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1 h-14 sm:h-12">
              Close
            </Button>
            {(job.applicationLink || (job.applicationMethod === 'email' || job.application_method === 'email')) &&
              job.opportunityType !== "Tender" &&
              job.opportunityType !== "Blog" &&
              job.opportunityType !== "Scholarship" &&
              job.opportunityType !== "Education" &&
              job.opportunityType !== "Announcement" && (
                <Button onClick={handleApply} className="flex-1 bg-foreground text-background hover:bg-foreground/90 h-14 sm:h-12">
                  Apply Now
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              )}
          </div>
          
          {/* Internal Application Modal */}
          <InternalApplicationModal
            open={isApplyModalOpen}
            onOpenChange={setIsApplyModalOpen}
            jobId={job.id}
            jobTitle={job.title}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
