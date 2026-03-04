"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { JOB_CATEGORIES } from "@/lib/constants/categories"
import { RichTextEditor } from "@/components/rich-text-editor"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, Building2, FileText } from "lucide-react"

interface EmployerEditJobDialogProps {
  job: any
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  employerEmail: string
}

export function EmployerEditJobDialog({ job, open, onOpenChange, onSuccess, employerEmail }: EmployerEditJobDialogProps) {
  const [loading, setLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedDocument, setSelectedDocument] = useState<File | null>(null)

  const [formData, setFormData] = useState({
    job_title: job.title || "",
    company_name: job.companyName || job.company_name || "",
    logo_url: job.companyLogo || job.logo_url || "",
    offer_type: job.opportunityType || job.offer_type || "Job",
    category: job.category || "",
    location: job.location || "",
    description: job.description || "",
    external_link: job.applicationLink || job.external_link || "",
    deadline: job.deadline || job.expiryDate || "",
    experience_level: job.experienceLevel || job.experience_level || "",
    contract_type: job.jobType || job.contract_type || "",
    attachment_url: job.attachmentUrl || job.attachment_url || "",
    locationType: job.locationType || "",
    jobType: job.jobType || "",
    opportunityType: job.opportunityType || "",
    experienceLevel: job.experienceLevel || "",
    applicationLink: job.applicationLink || "",
    applicationMethod: "link", // Always use external link
    primaryEmail: "",
    ccEmails: "",
  })

  useEffect(() => {
    if (open) {
      setFormData({
        job_title: job.title || "",
        company_name: job.companyName || job.company_name || "",
        logo_url: job.companyLogo || job.logo_url || "",
        offer_type: job.opportunityType || job.offer_type || "Job",
        category: job.category || "",
        location: job.location || "",
        description: job.description || "",
        external_link: job.applicationLink || job.external_link || "",
        deadline: job.deadline || job.expiryDate || "",
        experience_level: job.experienceLevel || job.experience_level || "",
        contract_type: job.jobType || job.contract_type || "",
        attachment_url: job.attachmentUrl || job.attachment_url || "",
        locationType: job.locationType || "",
        jobType: job.jobType || "",
        opportunityType: job.opportunityType || "",
        experienceLevel: job.experienceLevel || "",
        applicationLink: job.applicationLink || "",
        applicationMethod: "link", // Always use external link
        primaryEmail: "",
        ccEmails: "",
      })
      setImagePreview(job.companyLogo || job.logo_url || "")
    }
  }, [open, job])

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
        setFormData({ ...formData, logo_url: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedDocument(file)
      // In a real app, you would upload this to a service
      // For now, we'll just store the file name
      setFormData({ ...formData, attachment_url: file.name })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Validation for required fields (matching Admin form)
    if (!formData.job_title.trim()) {
      alert("Please enter job title")
      setLoading(false)
      return
    }

    if (!formData.company_name.trim()) {
      alert("Please enter company name")
      setLoading(false)
      return
    }

    if (!formData.logo_url || formData.logo_url?.trim() === "") {
      alert("Company logo is required")
      setLoading(false)
      return
    }

    try {
      // Convert form data to match API format
      const apiData = {
        title: formData.job_title,
        description: formData.description,
        location: formData.location,
        location_type: formData.locationType,
        job_type: formData.jobType || formData.contract_type,
        opportunity_type: formData.opportunityType || formData.offer_type,
        experience_level: formData.experienceLevel || formData.experience_level,
        deadline: formData.deadline || null,
        application_link: formData.external_link || formData.applicationLink,
        application_method: "link", // Always use external link
        primary_email: null,
        cc_emails: null,
        category: formData.category,
        attachment_url: formData.attachment_url,
        logo_url: formData.logo_url,
        company_name: formData.company_name,
      }
      
      const response = await fetch('/api/employer/jobs', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId: job.id,
          jobData: apiData,
          employerEmail: employerEmail
        })
      })

      if (response.ok) {
        const result = await response.json()
        console.log('✓ Job updated:', result)
        alert("Job updated successfully!")
        onSuccess()
        onOpenChange(false)
      } else {
        const errorData = await response.json().catch(() => ({}))
        console.error('Failed to update job:', errorData)
        alert("Failed to update job: " + (errorData.error || 'Unknown error'))
      }
    } catch (error) {
      console.error("Error updating job:", error)
      alert("Failed to update job. Check console for details.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Job</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Job Title */}
              <div className="space-y-2">
                <Label htmlFor="job_title">Job Title *</Label>
                <Input
                  id="job_title"
                  required
                  value={formData.job_title}
                  onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
                  placeholder="e.g. Senior Software Engineer"
                  className="h-11 text-base"
                />
              </div>

              {/* Company Name */}
              <div className="space-y-2">
                <Label htmlFor="company_name">Company Name *</Label>
                <Input
                  id="company_name"
                  required
                  value={formData.company_name}
                  onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                  placeholder="e.g. Tech Company"
                  className="h-11 text-base"
                />
              </div>

              {/* Contract Type */}
              <div className="space-y-2">
                <Label htmlFor="contract_type">Contract Type</Label>
                <Select
                  value={formData.contract_type}
                  onValueChange={(value: string) => setFormData({ ...formData, contract_type: value })}
                >
                  <SelectTrigger className="h-11 text-base">
                    <SelectValue placeholder="Select contract type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="Temporary">Temporary</SelectItem>
                    <SelectItem value="Internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Offer Type */}
              <div className="space-y-2">
                <Label htmlFor="offer_type">Offer Type</Label>
                <Select
                  value={formData.offer_type}
                  onValueChange={(value: string) => setFormData({ ...formData, offer_type: value })}
                >
                  <SelectTrigger className="h-11 text-base">
                    <SelectValue placeholder="Select offer type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="Job">Job</SelectItem>
                    <SelectItem value="Tender">Tender</SelectItem>
                    <SelectItem value="Blog">Blog</SelectItem>
                    <SelectItem value="Internship">Internship</SelectItem>
                    <SelectItem value="Scholarship">Scholarship</SelectItem>
                    <SelectItem value="Education">Education</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Company Logo */}
              <div className="space-y-2">
                <Label>Company Logo *</Label>
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    {imagePreview ? (
                      <AvatarImage src={imagePreview} alt="Company logo" />
                    ) : (
                      <AvatarFallback>
                        <Building2 className="h-8 w-8" />
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="hidden"
                      id="logo-upload"
                      required
                    />
                    <Label
                      htmlFor="logo-upload"
                      className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      <Plus className="h-4 w-4" />
                      {imagePreview ? 'Change Logo' : 'Upload Logo'}
                    </Label>
                  </div>
                </div>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value: string) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger className="h-11 text-base">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-white max-h-60">
                    {JOB_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. Kigali, Rwanda"
                  className="h-11 text-base"
                />
              </div>

              {/* Location Type */}
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

              {/* Deadline */}
              <div className="space-y-2">
                <Label htmlFor="deadline">Deadline Date</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="h-11 text-base"
                />
              </div>

              {/* External Link */}
              <div className="space-y-2">
                <Label htmlFor="external_link">External Link (Optional)</Label>
                <Input
                  id="external_link"
                  type="url"
                  value={formData.external_link}
                  onChange={(e) => setFormData({ ...formData, external_link: e.target.value })}
                  placeholder="https://example.com/apply"
                  className="h-11 text-base"
                />
              </div>

              {/* Document Upload */}
              <div className="space-y-2">
                <Label htmlFor="document">Document Upload</Label>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={handleDocumentChange}
                      className="hidden"
                      id="document-upload"
                    />
                    <Label
                      htmlFor="document-upload"
                      className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      <FileText className="h-4 w-4" />
                      {selectedDocument ? selectedDocument.name : 'Upload PDF Document'}
                    </Label>
                    {formData.attachment_url && (
                      <p className="text-sm text-green-600 mt-2">
                        ✓ Document uploaded successfully
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Experience Level */}
              <div className="space-y-2">
                <Label htmlFor="experience_level">Experience Level</Label>
                <Input
                  id="experience_level"
                  value={formData.experience_level}
                  onChange={(e) => setFormData({ ...formData, experience_level: e.target.value })}
                  placeholder="e.g. 3 YEARS"
                  className="h-11 text-base"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <RichTextEditor
              value={formData.description}
              onChange={(value) => setFormData({ ...formData, description: value })}
            />
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
