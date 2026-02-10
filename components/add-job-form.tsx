"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useJobs } from "@/lib/job-context"
import { useCompanies } from "@/lib/company-context"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Plus, Building2, Upload, X, FileText } from "lucide-react"
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
  const [currentStep, setCurrentStep] = useState(1)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const [formData, setFormData] = useState({
    // Step 1: Employer Info
    employer_name: "",
    logo_url: "",
    contact_name: "",
    primary_email: "",
    contact_phone: "",
    // Step 2: Job Details
    title: "",
    offer_type: "Job",
    category: "",
    description: "",
    // Step 3: Application & Logistics
    application_method: "email",
    application_link: "",
    deadline: "",
    experience_level: "",
    education_level: "",
    // System fields
    plan_id: 1,
    location: "",
    attachment_url: "",
    cc_emails: "",
  })

  // Handle logo upload for employer
  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      alert("Please upload an image file (PNG, JPG)")
      return
    }
    
    // Check file size (2MB limit)
    if (file.size > 2 * 1024 * 1024) {
      alert("Logo must be less than 2MB")
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      const result = reader.result as string
      setImagePreview(result)
    }
    reader.readAsDataURL(file)

    // Upload to Vercel Blob
    try {
      const uploadFormData = new FormData()
      uploadFormData.append('file', file)

      const response = await fetch('/api/upload/logo', {
        method: 'POST',
        body: uploadFormData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to upload logo')
      }

      const data = await response.json()
      setFormData({ ...formData, logo_url: data.url })
    } catch (error) {
      console.error('Error uploading logo:', error)
      alert('Failed to upload logo. Please try again.')
    }
  }

  const handleRemoveLogo = () => {
    setImagePreview("")
    setFormData({ ...formData, logo_url: "" })
  }

  // Navigation functions
  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  // Validate current step
  const validateStep = () => {
    switch (currentStep) {
      case 1:
        if (!formData.employer_name.trim()) {
          alert("Please enter employer name")
          return false
        }
        if (!formData.logo_url) {
          alert("Company logo is required")
          return false
        }
        if (!formData.contact_name.trim()) {
          alert("Please enter contact name")
          return false
        }
        // Contact email is only required if application method is email
        if (formData.application_method === "email" && !formData.primary_email.trim()) {
          alert("Contact email is required when using Email Application method")
          return false
        }
        if (formData.primary_email.trim()) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          if (!emailRegex.test(formData.primary_email.trim())) {
            alert("Please enter a valid contact email")
            return false
          }
        }
        if (!formData.contact_phone.trim()) {
          alert("Please enter contact phone")
          return false
        }
        return true
      case 2:
        if (!formData.title.trim()) {
          alert("Please enter job title")
          return false
        }
        if (!formData.offer_type) {
          alert("Please select offer type")
          return false
        }
        return true
      case 3:
        if (!formData.application_method) {
          alert("Please select application method")
          return false
        }
        if (formData.application_method === 'link' && !formData.application_link.trim()) {
          alert("Please enter application link")
          return false
        }
        // Final check: if email method selected, ensure contact email is provided
        if (formData.application_method === "email" && !formData.primary_email.trim()) {
          alert("Contact email is required for Email Application method. Please go back to Step 1 and add it.")
          return false
        }
        return true
      default:
        return true
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Final validation of all steps
    if (!validateStep()) {
      setLoading(false)
      return
    }

    try {
      console.log("Admin form submitting data:", formData)

      // Create or find company from employer info
      let companyId = null
      try {
        // For Admin form, we'll create the company directly
        const createCompanyResponse = await fetch('/api/companies', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.employer_name,
            logo: formData.logo_url || null
          })
        })
        
        if (createCompanyResponse.ok) {
          const newCompanyData = await createCompanyResponse.json()
          companyId = newCompanyData.company.id
        }
      } catch (companyError) {
        console.error('Error handling company:', companyError)
      }

      // Prepare job data with snake_case fields for database
      const jobData = {
        title: formData.title.trim(),
        company_id: companyId,
        employerName: formData.employer_name.trim(),
        companyLogo: formData.logo_url || null,
        description: formData.description?.trim() || null,
        location: formData.location?.trim() || null,
        job_type: null, // Not used in new structure
        opportunity_type: formData.offer_type,
        deadline: formData.deadline || null,
        application_link: formData.application_method === "link" ? formData.application_link?.trim() || null : null,
        attachment_url: formData.attachment_url?.trim() || null,
        featured: false,
        plan_id: formData.plan_id,
        application_method: formData.application_method,
        primary_email: formData.primary_email?.trim() || null,
        cc_emails: formData.cc_emails?.trim() || null,
        experience_level: formData.experience_level || null,
        education_level: formData.education_level || null,
        category: formData.category || null,
        contact_name: formData.contact_name?.trim() || null,
        contact_phone: formData.contact_phone?.trim() || null,
        // Pass user email for Admin identification
        userEmail: user?.email || null,
      }

      console.log("Final job data for submission:", jobData)

      await addJob(jobData)

      // Reset form
      setFormData({
        employer_name: "",
        logo_url: "",
        contact_name: "",
        primary_email: "",
        contact_phone: "",
        title: "",
        offer_type: "Job",
        category: "",
        description: "",
        application_method: "email",
        application_link: "",
        deadline: "",
        experience_level: "",
        education_level: "",
        plan_id: 1,
        location: "",
        attachment_url: "",
        cc_emails: "",
      })
      setImagePreview("")
      setSelectedFile(null)
      setCurrentStep(1)

      // Admin Direct-Post: Redirect to Home page instead of success page
      if (user?.email === "admin@RwandaJobHub.com") {
        router.push("/")
      } else {
        // Employer redirect to success page
        router.push("/job-submission-success")
      }
    } catch (error) {
      console.error("Error adding job:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to add job. Please try again."
      alert(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= step
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step}
              </div>
              {step < 3 && (
                <div
                  className={`flex-1 h-1 mx-4 ${
                    currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-600">
          <span>Employer Info</span>
          <span>Job Details</span>
          <span>Application & Logistics</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Employer Info */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Employer Information</h2>
            
            <div className="space-y-2">
              <Label htmlFor="employer_name">Employer Name *</Label>
              <Input
                id="employer_name"
                required
                value={formData.employer_name}
                onChange={(e) => setFormData({ ...formData, employer_name: e.target.value })}
                placeholder="e.g. Acme Corporation"
                className="h-11 text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact_name">Contact Name *</Label>
              <Input
                id="contact_name"
                required
                value={formData.contact_name}
                onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                placeholder="e.g. John Doe"
                className="h-11 text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="primary_email">
                Contact Email {formData.application_method === "email" ? "*" : "(Optional)"}
              </Label>
              <Input
                id="primary_email"
                type="email"
                required={formData.application_method === "email"}
                value={formData.primary_email}
                onChange={(e) => setFormData({ ...formData, primary_email: e.target.value })}
                placeholder="employer@company.com"
                className="h-11 text-base"
              />
              {formData.application_method === "email" && (
                <p className="text-xs text-blue-600">
                  Required for Email Application method
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact_phone">Contact Phone *</Label>
              <Input
                id="contact_phone"
                type="tel"
                required
                value={formData.contact_phone}
                onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                placeholder="+250 7XX XXX XXX"
                className="h-11 text-base"
              />
            </div>

            {/* Logo Upload */}
            <div className="space-y-2">
              <Label>Company Logo *</Label>
              <div className="flex items-center gap-4">
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Company logo preview"
                      className="h-20 w-20 rounded-lg object-cover border"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleRemoveLogo}
                      className="absolute -top-2 -right-2 h-6 w-6 p-0 bg-red-500 text-white hover:bg-red-600"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <div className="h-20 w-20 rounded-lg border-2 border-dashed border-red-300 flex items-center justify-center">
                    <Building2 className="h-8 w-8 text-red-400" />
                  </div>
                )}
                <div>
                  <Input
                    id="logo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="hidden"
                  />
                  <Label
                    htmlFor="logo-upload"
                    className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Logo
                  </Label>
                  <p className="text-xs text-red-500 mt-1">Company logo is required (PNG, JPG, max 2MB)</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Job Details */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Job Details</h2>
            
            <div className="space-y-2">
              <Label htmlFor="title">Job Title *</Label>
              <Input
                id="title"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Senior Software Engineer"
                className="h-11 text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="offer_type">Offer Type *</Label>
              <Select
                value={formData.offer_type}
                onValueChange={(value: string) => setFormData({ ...formData, offer_type: value })}
              >
                <SelectTrigger className="h-11 text-base">
                  <SelectValue placeholder="Select offer type" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="Job">Job</SelectItem>
                  <SelectItem value="Internship">Internship</SelectItem>
                  <SelectItem value="Scholarship">Scholarship</SelectItem>
                  <SelectItem value="Education">Education</SelectItem>
                  <SelectItem value="Tender">Tender</SelectItem>
                  <SelectItem value="Blog">Blog</SelectItem>
                </SelectContent>
              </Select>
            </div>

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
                  <SelectItem value="Academic">Academic</SelectItem>
                  <SelectItem value="Accounting">Accounting</SelectItem>
                  <SelectItem value="Administration">Administration</SelectItem>
                  <SelectItem value="Agriculture">Agriculture</SelectItem>
                  <SelectItem value="Banking">Banking</SelectItem>
                  <SelectItem value="Business">Business</SelectItem>
                  <SelectItem value="Computer and IT">Computer and IT</SelectItem>
                  <SelectItem value="Engineering">Engineering</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="Human resource">Human resource</SelectItem>
                  <SelectItem value="Management">Management</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Medicine">Medicine</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Job Description (Optional)</Label>
              <RichTextEditor
                value={formData.description}
                onChange={(value) => setFormData({ ...formData, description: value })}
                placeholder="Describe the job responsibilities, requirements, and qualifications..."
              />
            </div>
          </div>
        )}

        {/* Step 3: Application & Logistics */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Application & Logistics</h2>
            
            <div className="space-y-2">
              <Label htmlFor="application_method">Application Method *</Label>
              <Select
                value={formData.application_method}
                onValueChange={(value: string) => setFormData({ ...formData, application_method: value })}
              >
                <SelectTrigger className="h-11 text-base">
                  <SelectValue placeholder="Select application method" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="email">Email Application</SelectItem>
                  <SelectItem value="link">External Link</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.application_method === "email" && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-700">
                  <strong>Note:</strong> Applications will be sent to: <span className="font-mono">{formData.primary_email || "No email provided"}</span>
                </p>
                {!formData.primary_email && (
                  <p className="text-sm text-red-600 mt-2">
                    ⚠️ Contact email is required in Step 1 for Email Application method. Please go back and add it.
                  </p>
                )}
              </div>
            )}

            {formData.application_method === "link" && (
              <div className="space-y-2">
                <Label htmlFor="application_link">Application Link *</Label>
                <Input
                  id="application_link"
                  type="url"
                  required
                  value={formData.application_link}
                  onChange={(e) => setFormData({ ...formData, application_link: e.target.value })}
                  placeholder="https://example.com/apply"
                  className="h-11 text-base"
                />
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2">
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
                    <SelectItem value="Executive">Executive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="education_level">Education Level (Optional)</Label>
                <Select
                  value={formData.education_level}
                  onValueChange={(value: string) => setFormData({ ...formData, education_level: value })}
                >
                  <SelectTrigger className="h-11 text-base">
                    <SelectValue placeholder="Select education level" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="High School">High School</SelectItem>
                    <SelectItem value="Diploma">Diploma</SelectItem>
                    <SelectItem value="Bachelor">Bachelor</SelectItem>
                    <SelectItem value="Master">Master</SelectItem>
                    <SelectItem value="PhD">PhD</SelectItem>
                  </SelectContent>
                </Select>
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
              <Label htmlFor="location">Location (Optional)</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Kigali, Rwanda"
                className="h-11 text-base"
              />
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={currentStep === 1 ? onSuccess : prevStep}
            disabled={loading}
            className="px-6"
          >
            {currentStep === 1 ? 'Cancel' : 'Previous'}
          </Button>

          <div className="flex gap-3">
            {currentStep < 3 ? (
              <Button
                type="button"
                onClick={() => {
                  if (validateStep()) nextStep()
                }}
                disabled={loading}
                className="px-6 bg-blue-600 hover:bg-blue-700 text-white"
              >
                Next Step
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={loading}
                className="px-6 bg-green-600 hover:bg-green-700 text-white"
              >
                {loading ? "Creating Job..." : "Create Job"}
              </Button>
            )}
          </div>
        </div>
      </form>
    </>
  )
}
