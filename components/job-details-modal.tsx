"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, DollarSign, Briefcase, Clock, CheckCircle2, ExternalLink } from "lucide-react"
import Image from "next/image"
import type { Job } from "@/lib/types"

interface JobDetailsModalProps {
  job: Job | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function JobDetailsModal({ job, open, onOpenChange }: JobDetailsModalProps) {
  if (!job) return null

  const handleApply = () => {
    if (job.applicationLink) {
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
                src={job.companyLogo || "/placeholder.svg"}
                alt={`${job.company} logo`}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-2xl">{job.title}</DialogTitle>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{job.company}</span>
                
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
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">{job.description}</p>
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
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Close
            </Button>
            {job.applicationLink && 
             job.opportunityType !== "Tender" && 
             job.opportunityType !== "Blog" && 
             job.opportunityType !== "Scholarship" && 
             job.opportunityType !== "Education" && 
             job.opportunityType !== "Announcement" && (
              <Button onClick={handleApply} className="flex-1 bg-foreground text-background hover:bg-foreground/90">
                Apply Now
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
