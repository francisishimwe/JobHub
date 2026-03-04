"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { JOB_CATEGORIES } from "@/lib/constants/categories"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Building2, FileText } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { RichTextEditor } from "@/components/rich-text-editor"

interface EmployerAddJobFormProps {
  onSuccess?: () => void
  employerData?: {
    companyName: string
    email: string
    plan: any
    status: string
  }
}

export function EmployerAddJobForm({ onSuccess, employerData }: EmployerAddJobFormProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedDocument, setSelectedDocument] = useState<File | null>(null)

  const [formData, setFormData] = useState({
    job_title: "",
    company_name: employerData?.companyName || "",
    logo_url: "",
    offer_type: "Job",
    category: "",
    location: "",
    location_type: "",
    description: "",
    external_link: "",
    deadline: "",
    experience_level: "",
    contract_type: "",
    attachment_url: "",
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
        setFormData({ ...formData, logo_url: data.url })
        console.log('Logo uploaded successfully:', data.url)
      } else {
        throw new Error('Failed to upload logo')
      }
    } catch (error) {
      console.error('Error uploading logo:', error)
      alert('Failed to upload logo. Please try again.')
    }
  }

  // Handle document upload
  const handleDocumentChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
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
        setFormData({ ...formData, attachment_url: data.url })
        console.log('Document uploaded successfully:', data.url)
      } else {
        throw new Error('Failed to upload document')
      }
    } catch (error) {
      console.error('Error uploading document:', error)
      alert('Failed to upload document. Please try again.')
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
      // Use the same API as admin for consistency
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.job_title.trim() || null,
          company_name: formData.company_name.trim() || null,
          logo_url: formData.logo_url || null,
          opportunity_type: formData.offer_type || null,
          category: formData.category || null,
          location: formData.location || null,
          location_type: formData.location_type || null,
          description: formData.description || null,
          application_link: formData.external_link || null,
          deadline: formData.deadline || null,
          experience_level: formData.experience_level || null,
          job_type: formData.contract_type || null,
          attachment_url: formData.attachment_url || null,
          plan_id: 1,
          employerName: formData.company_name.trim() || employerData?.companyName || user?.email,
        })
      })

      if (response.ok) {
        const result = await response.json()
        console.log('✅ Job created successfully:', result)
        
        // Show success message
        alert('Job posted successfully! Your job will be visible on the home page.')
        
        // Reset form
        setFormData({
          job_title: "",
          company_name: employerData?.companyName || "",
          logo_url: "",
          offer_type: "Job",
          category: "",
          location: "",
          location_type: "",
          description: "",
          external_link: "",
          deadline: "",
          experience_level: "",
          contract_type: "",
          attachment_url: "",
        })
        setImagePreview("")
        setSelectedFile(null)
        setSelectedDocument(null)
        
        if (onSuccess) {
          onSuccess()
        }
      } else {
        const errorData = await response.json().catch(() => ({}))
        console.error('Failed to create job:', errorData)
        alert('Failed to post job: ' + (errorData.error || 'Unknown error'))
      }
    } catch (error) {
      console.error('Error posting job:', error)
      alert('Failed to post job. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-sm">
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
                placeholder="e.g. Rwanda Tech Solutions"
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

            {/* Location Type */}
            <div className="space-y-2">
              <Label htmlFor="location_type">Location Type (Optional)</Label>
              <Input
                id="location_type"
                placeholder="e.g., Remote, On-site, Hybrid"
                value={formData.location_type}
                onChange={(e) => setFormData({ ...formData, location_type: e.target.value })}
                className="h-11 text-base"
              />
            </div>

            {/* Deadline */}
            <div className="space-y-2">
              <Label htmlFor="deadline">Deadline Date (Optional)</Label>
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
