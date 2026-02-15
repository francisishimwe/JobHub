"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useJobs } from "@/lib/job-context"
import { useCompanies } from "@/lib/company-context"
import { useAuth } from "@/lib/auth-context"
import { JOB_CATEGORIES } from "@/lib/constants/categories"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Plus, Building2, FileText } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { RichTextEditor } from "@/components/rich-text-editor"

interface AddJobFormProps {
  onSuccess?: () => void
}

export function AddJobForm({ onSuccess }: AddJobFormProps) {
  const { addJob } = useJobs()
  const { companies, addCompany } = useCompanies()
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedDocument, setSelectedDocument] = useState<File | null>(null)

  const [formData, setFormData] = useState({
    job_title: "",
    company_name: "",
    logo_url: "",
    offer_type: "Job",
    category: "",
    location: "",
    description: "",
    external_link: "",
    deadline: "",
    experience_level: "",
    education_level: "",
    // System fields
    plan_id: 1,
    attachment_url: "",
    company_id: "", // Add company_id field for edit scenarios
  })

  // Handle logo upload
  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB')
      return
    }

    setSelectedFile(file)
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Upload to server
    const uploadFormData = new FormData()
    uploadFormData.append('file', file)
    
    try {
      const response = await fetch('/api/upload/logo', {
        method: 'POST',
        body: uploadFormData
      })
      
      if (response.ok) {
        const data = await response.json()
        console.log("Logo upload successful:", data)
        setFormData(prev => ({ ...prev, logo_url: data.url }))
      } else {
        console.error('Logo upload failed:', response.status, response.statusText)
        alert('Logo upload failed. Please try again.')
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Logo upload failed. Please try again.')
    }
  }

  // Handle document upload
  const handleDocumentChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type (PDF only)
    if (file.type !== 'application/pdf') {
      alert('Please select a PDF file')
      return
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      alert('PDF size should be less than 10MB')
      return
    }

    setSelectedDocument(file)

    // Upload to server
    const uploadFormData = new FormData()
    uploadFormData.append('file', file)
    
    try {
      const response = await fetch('/api/upload/document', {
        method: 'POST',
        body: uploadFormData
      })
      
      if (response.ok) {
        const data = await response.json()
        setFormData(prev => ({ ...prev, attachment_url: data.url }))
      } else {
        console.error('Document upload failed')
      }
    } catch (error) {
      console.error('Upload error:', error)
    }
  }

  // Simple HTML sanitization to prevent SQL issues
  const sanitizeHTML = (html: string | null): string | null => {
    if (!html) return null
    
    // Remove potentially problematic HTML attributes and content
    return html
      .replace(/class="[^"]*"/g, '') // Remove class attributes
      .replace(/style="[^"]*"/g, '') // Remove style attributes
      .replace(/data-[^=]*="[^"]*"/g, '') // Remove data attributes
      .replace(/on\w+="[^"]*"/g, '') // Remove event handlers
      .replace(/javascript:/gi, '') // Remove javascript: URLs
      .replace(/<script[^>]*>.*?<\/script>/gi, '') // Remove script tags
      .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '') // Remove iframe tags
      .replace(/<object[^>]*>.*?<\/object>/gi, '') // Remove object tags
      .replace(/<embed[^>]*>/gi, '') // Remove embed tags
      .trim()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Validation
    console.log("Form validation check:", {
      job_title: formData.job_title,
      company_name: formData.company_name,
      logo_url: formData.logo_url,
      logo_url_length: formData.logo_url?.length
    })

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
      console.error("Logo validation failed:", formData.logo_url)
      alert("Company logo is required")
      setLoading(false)
      return
    }

    try {
      // Check if we already have a company_id from existing companies or job data
      let companyId = null
      
      // First, try to find existing company by name
      const existingCompany = companies.find(c => 
        c.name.toLowerCase() === formData.company_name.trim().toLowerCase()
      );
      
      if (existingCompany) {
        companyId = existingCompany.id;
        console.log('Found existing company:', companyId);
      } else {
        // Check if this is an edit scenario with existing company_id
        // This shouldn't happen with AddJobForm, but let's handle it gracefully
        if (formData.company_id && typeof formData.company_id === 'string' && formData.company_id.length > 10) {
          companyId = formData.company_id;
          console.log('Using existing company_id from form data:', companyId);
        } else {
          // Create new company only if no existing one found
          try {
            const createCompanyResponse = await fetch('/api/companies', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                name: formData.company_name,
                logo: formData.logo_url || null
              })
            })
            
            if (createCompanyResponse.ok) {
              const newCompanyData = await createCompanyResponse.json()
              console.log('Company API response:', newCompanyData)
              // Handle both response formats: { company: { id: ... } } or { id: ... }
              companyId = newCompanyData.company?.id || newCompanyData.id
              console.log('Created new companyId:', companyId)
            } else {
              const errorData = await createCompanyResponse.json().catch(() => ({}))
              console.error('Company creation failed:', errorData)
              alert('Failed to create company: ' + (errorData.error || 'Unknown error'))
              setLoading(false)
              return
            }
          } catch (companyError) {
            console.error('Error handling company:', companyError)
            alert('Failed to create company. Please try again.')
            setLoading(false)
            return
          }
        }
      }

      // Validate we have a companyId
      if (!companyId) {
        console.error('❌ No companyId obtained after company lookup/creation')
        console.error('🔍 Debug info:', { 
          existingCompany: companies.find(c => c.name.toLowerCase() === formData.company_name.trim().toLowerCase()),
          formDataCompanyId: formData.company_id,
          companiesLength: companies.length,
          companyName: formData.company_name.trim()
        })
        alert('Failed to create or find company. Please try again.')
        setLoading(false)
        return
      }

      // Additional validation for companyId format
      if (typeof companyId !== 'string' || companyId.trim() === '') {
        console.error('❌ Invalid companyId format:', { companyId, type: typeof companyId })
        alert('Invalid company ID format. Please try again.')
        setLoading(false)
        return
      }

      // Prepare job data
      console.log('🔍 Preparing job data with companyId:', companyId)
      const jobData = {
        title: formData.job_title.trim(),
        company_id: companyId,
        employerName: formData.company_name.trim(),
        companyLogo: formData.logo_url || null,
        description: sanitizeHTML(formData.description?.trim() || null),
        location: formData.location?.trim() || null,
        job_type: null,
        opportunity_type: formData.offer_type,
        deadline: formData.deadline || null,
        application_link: formData.external_link?.trim() || null,
        attachment_url: formData.attachment_url?.trim() || null,
        featured: false,
        plan_id: formData.plan_id,
        application_method: "link",
        primary_email: null,
        cc_emails: null,
        experience_level: formData.experience_level || null,
        education_level: formData.education_level || null,
        category: formData.category || null,
        contact_name: null,
        contact_phone: null,
        status: 'active', // Set default status as active
        userEmail: user?.email || null,
      }

      // Log the data for debugging
      console.log("🔍 Job data being sent:", {
        title: jobData.title,
        description: jobData.description,
        description_length: jobData.description?.length,
        opportunity_type: jobData.opportunity_type,
        application_method: jobData.application_method,
        company_id: jobData.company_id,
        company_id_type: typeof jobData.company_id
      })

      console.log("Final job data for submission:", jobData)

      try {
        await addJob(jobData)
        console.log("Job submitted successfully!")
        
        // Reset form
        setFormData({
          job_title: "",
          company_name: "",
          logo_url: "",
          offer_type: "Job",
          category: "",
          location: "",
          description: "",
          external_link: "",
          deadline: "",
          experience_level: "",
          education_level: "",
          plan_id: 1,
          attachment_url: "",
          company_id: "", // Reset company_id
        })
        setImagePreview("")
        setSelectedFile(null)
        setSelectedDocument(null)

        setLoading(false)
        onSuccess?.()
      } catch (jobError) {
        console.error('Error submitting job:', jobError)
        console.error('Error details:', {
          message: jobError instanceof Error ? jobError.message : 'Unknown error',
          stack: jobError instanceof Error ? jobError.stack : undefined,
          jobData: jobData
        })
        alert('Failed to submit job: ' + (jobError instanceof Error ? jobError.message : 'Unknown error'))
        setLoading(false)
      }
    } catch (error) {
      console.error('Error submitting job:', error)
      alert('Failed to submit job. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Add New Job</h1>
          <p className="text-muted-foreground">
            Fill in the details below to post a new job listing
          </p>
        </div>

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
              <Label htmlFor="category">Category (Optional)</Label>
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
              <Label htmlFor="location">Location (Optional)</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Kigali, Rwanda"
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
              <Label htmlFor="document">Document Upload (Optional)</Label>
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
              <Label htmlFor="experience_level">Experience Level (Optional)</Label>
              <Select
                value={formData.experience_level}
                onValueChange={(value: string) => setFormData({ ...formData, experience_level: value })}
              >
                <SelectTrigger className="h-11 text-base">
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="Entry Level">Entry Level</SelectItem>
                  <SelectItem value="Mid Level">Mid Level</SelectItem>
                  <SelectItem value="Senior Level">Senior Level</SelectItem>
                  <SelectItem value="Manager">Manager</SelectItem>
                  <SelectItem value="Director">Director</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Job Description - Full Width */}
        <div className="space-y-2">
          <Label htmlFor="description">Job Description (Optional)</Label>
          <RichTextEditor
            value={formData.description}
            onChange={(value) => setFormData({ ...formData, description: value })}
            placeholder="Describe job responsibilities, requirements, and qualifications..."
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={loading}
            className="px-8 bg-blue-600 hover:bg-blue-700 text-white font-bold"
          >
            {loading ? "Posting Job..." : "Post Job"}
          </Button>
        </div>
      </form>
    </div>
  )
}
