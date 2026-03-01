"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useJobs } from "@/lib/job-context"
import { useCompanies } from "@/lib/company-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { experienceLevels, jobTypes } from "@/lib/mock-data"
import { RichTextEditor } from "@/components/rich-text-editor"
import type { Job } from "@/lib/types"

interface EditJobDialogProps {
  job: Job
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditJobDialog({ job, open, onOpenChange }: EditJobDialogProps) {
  const { updateJob } = useJobs()
  const { companies } = useCompanies()
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    title: job.title || "",
    companyId: job.companyId || "",
    description: job.description || "",
    location: job.location || "",
    locationType: job.locationType || "",
    jobType: job.jobType || "",
    opportunityType: job.opportunityType || "",
    experienceLevel: job.experienceLevel || "",
    deadline: job.deadline || "",
    applicationLink: job.applicationLink || "",
    applicationMethod: job.applicationMethod || "link",
    primaryEmail: job.primaryEmail || "",
    ccEmails: job.ccEmails || "",
  })

  useEffect(() => {
    if (open) {
      setFormData({
        title: job.title || "",
        companyId: job.companyId || "",
        description: job.description || "",
        location: job.location || "",
        locationType: job.locationType || "",
        jobType: job.jobType || "",
        opportunityType: job.opportunityType || "",
        experienceLevel: job.experienceLevel || "",
        deadline: job.deadline || "",
        applicationLink: job.applicationLink || "",
        applicationMethod: job.applicationMethod || "link",
        primaryEmail: job.primaryEmail || "",
        ccEmails: job.ccEmails || "",
      })
    }
  }, [open, job])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validate email application method
      if (formData.applicationMethod === "email") {
        if (!formData.primaryEmail?.trim()) {
          alert("Please enter a primary email address")
          setLoading(false)
          return
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(formData.primaryEmail.trim())) {
          alert("Please enter a valid primary email address")
          setLoading(false)
          return
        }
        
        // Validate CC emails if provided
        if (formData.ccEmails?.trim()) {
          const ccEmails = formData.ccEmails.split(',').map(email => email.trim())
          for (const ccEmail of ccEmails) {
            if (!emailRegex.test(ccEmail)) {
              alert(`Invalid CC email address: ${ccEmail}`)
              setLoading(false)
              return
            }
          }
        }
      }

      // Convert camelCase to snake_case for API
      const apiData = {
        title: formData.title,
        company_id: formData.companyId,
        description: formData.description,
        location: formData.location,
        location_type: formData.locationType,
        job_type: formData.jobType,
        opportunity_type: formData.opportunityType,
        experience_level: formData.experienceLevel,
        deadline: formData.deadline || null,
        application_link: formData.applicationLink,
        application_method: formData.applicationMethod.includes('Email') ? 'email' : 'link',
        primary_email: formData.applicationMethod === "email" ? formData.primaryEmail?.trim() || null : null,
        cc_emails: formData.applicationMethod === "email" ? formData.ccEmails?.trim() || null : null,
      }
      
      await updateJob(job.id, apiData)
      alert("Job updated successfully!")
      onOpenChange(false)
    } catch (error) {
      console.error("Error updating job:", error)
      alert("Failed to update job. Check console for details.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Job</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="title">Job Title *</Label>
              <Input
                id="title"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="h-11 text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Company *</Label>
              <Select
                value={formData.companyId}
                onValueChange={(value) => setFormData({ ...formData, companyId: value })}
              >
                <SelectTrigger className="h-11 text-base">
                  <SelectValue placeholder="Select a company" />
                </SelectTrigger>
                <SelectContent>
                  {companies.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <RichTextEditor
                value={formData.description}
                onChange={(value) => setFormData({ ...formData, description: value })}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="e.g., Kigali, Rwanda"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="h-11 text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="locationType">Location Type</Label>
                <Input
                  id="locationType"
                  placeholder="e.g., Remote, On-site, Hybrid"
                  value={formData.locationType}
                  onChange={(e) => setFormData({ ...formData, locationType: e.target.value })}
                  className="h-11 text-base"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="opportunityType">Opportunity Type *</Label>
                <Select
                  value={formData.opportunityType}
                  onValueChange={(value: any) => setFormData({ ...formData, opportunityType: value })}
                >
                  <SelectTrigger className="h-11 text-base">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Job">Job</SelectItem>
                    <SelectItem value="Internship">Internship</SelectItem>
                    <SelectItem value="Scholarship">Scholarship</SelectItem>
                    <SelectItem value="Education">Education</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="jobType">Job Type</Label>
                <Input
                  id="jobType"
                  placeholder="e.g., Full-time, Part-time, Contract"
                  value={formData.jobType}
                  onChange={(e) => setFormData({ ...formData, jobType: e.target.value })}
                  className="h-11 text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="experienceLevel">Experience</Label>
                <Input
                  id="experienceLevel"
                  placeholder="e.g., Entry Level, Mid-level, Senior"
                  value={formData.experienceLevel}
                  onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
                  className="h-11 text-base"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="deadline">Application Deadline (Optional)</Label>
              <Input
                id="deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className="h-11 text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="applicationLink">Application Link</Label>
              <Input
                id="applicationLink"
                type="url"
                placeholder="https://example.com/apply"
                value={formData.applicationLink}
                onChange={(e) => setFormData({ ...formData, applicationLink: e.target.value })}
                className="h-11 text-base"
                disabled={formData.applicationMethod === "email"}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="applicationMethod">Application Method *</Label>
              <Select
                value={formData.applicationMethod}
                onValueChange={(value: string) => setFormData({ ...formData, applicationMethod: value })}
              >
                <SelectTrigger className="h-11 text-base">
                  <SelectValue placeholder="Select application method" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="link">External Link</SelectItem>
                  <SelectItem value="email">Email Application</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.applicationMethod === "email" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="primaryEmail">Primary Email *</Label>
                  <Input
                    id="primaryEmail"
                    type="email"
                    required={formData.applicationMethod === "email"}
                    value={formData.primaryEmail}
                    onChange={(e) => setFormData({ ...formData, primaryEmail: e.target.value })}
                    placeholder="employer@company.com"
                    className="h-11 text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ccEmails">CC Emails (Optional)</Label>
                  <Input
                    id="ccEmails"
                    value={formData.ccEmails}
                    onChange={(e) => setFormData({ ...formData, ccEmails: e.target.value })}
                    placeholder="hr@company.com, manager@company.com"
                    className="h-11 text-base"
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter multiple email addresses separated by commas
                  </p>
                </div>
              </>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="text-black" style={{ backgroundColor: '#76c893' }}>
              {loading ? "Updating..." : "Update Job"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
