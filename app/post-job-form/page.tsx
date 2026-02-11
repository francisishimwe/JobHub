"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle, Upload, X, FileText, ArrowLeft, ArrowRight, Building2 } from "lucide-react"
import { RichTextEditor } from "@/components/rich-text-editor"
import { JOB_CATEGORIES } from "@/lib/constants/categories"

const planDetails = {
  featured: { name: "Featured", color: "bg-blue-500" },
  "featured-plus": { name: "Featured+", color: "bg-purple-500" },
  "super-featured": { name: "Super Featured", color: "bg-orange-500" },
  "short-listing": { name: "Short-listing", color: "bg-green-500" }
}

export default function PostJobFormPage() {
  const router = useRouter()
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [companyLogoFile, setCompanyLogoFile] = useState<File | null>(null)
  const [companyLogoPreview, setCompanyLogoPreview] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")

  const [formData, setFormData] = useState({
    // Step 1: Employer Info
    employerName: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    countryCode: "+250", // Rwanda default
    companyLogo: "",
    
    // Step 2: Job Details
    jobTitle: "",
    offerType: "",
    contractType: "",
    category: "",
    description: "",
    
    // Step 3: Application & Logistics
    applicationMethod: "",
    applicationLink: "",
    applicationEmail: "",
    deadline: "",
    deadlineTime: "",
    positions: "",
    experienceLevel: "",
    educationLevel: "",
    attachmentUrl: ""
  })

  useEffect(() => {
    const storedPlan = localStorage.getItem('selectedPlan')
    if (storedPlan) {
      setSelectedPlan(storedPlan)
    } else {
      router.push('/select-plan')
    }
  }, [router])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]
    
    if (!allowedTypes.includes(file.type)) {
      alert("Please upload a PDF or DOC file")
      return
    }
    
    if (file.size > 2 * 1024 * 1024) {
      alert("File size must be less than 2MB")
      return
    }
    
    setSelectedFile(file)
    setFormData(prev => ({ ...prev, attachmentUrl: file.name }))
  }

  const handleCompanyLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    console.log("📤 Starting logo upload:", file.name, file.size)

    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      alert("Please upload an image file (PNG, JPG)")
      return
    }
    
    // Check file size (1MB limit)
    if (file.size > 1 * 1024 * 1024) {
      alert("Company logo must be less than 1MB")
      return
    }
    
    setCompanyLogoFile(file)
    
    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      const result = reader.result as string
      setCompanyLogoPreview(result)
      console.log("🖼️ Logo preview set")
    }
    reader.readAsDataURL(file)

    // Upload to Vercel Blob
    try {
      const formData = new FormData()
      formData.append('file', file)

      console.log("🌐 Uploading to /api/upload/logo...")
      const response = await fetch('/api/upload/logo', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to upload logo')
      }

      const data = await response.json()
      console.log("✅ Logo uploaded successfully:", data.url)
      setFormData(prev => ({ ...prev, companyLogo: data.url }))
    } catch (error) {
      console.error('❌ Error uploading logo:', error)
      alert('Failed to upload logo. Please try again.')
      // Fallback to base64 for preview
      console.log("🔄 Using base64 fallback")
      setFormData(prev => ({ ...prev, companyLogo: reader.result as string }))
    }
  }

  const handleRemoveCompanyLogo = () => {
    setCompanyLogoFile(null)
    setCompanyLogoPreview("")
    setFormData(prev => ({ ...prev, companyLogo: "" }))
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    setFormData(prev => ({ ...prev, attachmentUrl: "" }))
  }

  const validateStep = (step: number): boolean => {
    console.log(`🔍 Validating step ${step}:`, {
      employerName: formData.employerName,
      contactName: formData.contactName,
      contactEmail: formData.contactEmail,
      contactPhone: formData.contactPhone,
      companyLogo: formData.companyLogo ? "✅ Set" : "❌ Empty",
      companyLogoPreview: companyLogoPreview ? "✅ Set" : "❌ Empty"
    })
    
    switch (step) {
      case 1:
        return !!(formData.employerName && formData.contactName && formData.contactEmail && formData.contactPhone && formData.companyLogo)
      case 2:
        return !!(formData.jobTitle && formData.offerType && formData.contractType && formData.category && formData.description)
      case 3:
        if (formData.applicationMethod === "email" && !formData.applicationEmail) return false
        if (formData.applicationMethod === "link" && !formData.applicationLink) return false
        return true
      default:
        return false
    }
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3))
    } else {
      alert("Please fill in all required fields")
    }
  }

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedPlan || !validateStep(3)) return

    setIsSubmitting(true)
    setSubmitStatus("idle")

    try {
      // Prepare form data with employer-specific fields
      const submissionData = {
        // Job details
        title: formData.jobTitle,
        opportunity_type: formData.offerType,
        jobType: formData.contractType,
        description: formData.description,
        location: "Kigali, Rwanda", // Default or could be added to form
        
        // Employer specific fields
        employerName: formData.employerName,
        contactName: formData.contactName,
        contactEmail: formData.contactEmail,
        contactPhone: `${formData.countryCode} ${formData.contactPhone}`,
        companyLogo: formData.companyLogo,
        
        // Application & logistics
        applicationMethod: formData.applicationMethod,
        applicationEmail: formData.applicationEmail,
        applicationLink: formData.applicationLink,
        deadline: formData.deadline,
        deadlineTime: formData.deadlineTime,
        positions: formData.positions,
        experienceLevel: formData.experienceLevel,
        educationLevel: formData.educationLevel,
        attachmentUrl: formData.attachmentUrl,
        
        // Plan information
        planId: selectedPlan === "featured" ? 1 : 
                selectedPlan === "featured-plus" ? 2 :
                selectedPlan === "super-featured" ? 3 : 4,
      }

      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData)
      })

      if (response.ok) {
        setSubmitStatus("success")
        localStorage.removeItem('selectedPlan')
        router.push('/job-submission-success')
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to post job')
      }
    } catch (error) {
      console.error('Error submitting job:', error)
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!selectedPlan) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">No Plan Selected</h2>
            <p className="text-slate-600 mb-4">Please select a plan first.</p>
            <Button onClick={() => router.push('/select-plan')}>
              Select a Plan
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const steps = [
    { number: 1, title: "Employer Info" },
    { number: 2, title: "Job Details" },
    { number: 3, title: "Application & Logistics" }
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Plan Selection Banner */}
        <Card className="mb-8 border-2 border-slate-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-4 h-4 rounded-full ${planDetails[selectedPlan as keyof typeof planDetails].color}`} />
                <div>
                  <h3 className="font-semibold text-lg">
                    Selected Plan: {planDetails[selectedPlan as keyof typeof planDetails].name}
                  </h3>
                  {selectedPlan === "short-listing" && (
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                        Priority: Top
                      </Badge>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        Agency Verified
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
              <Button 
                variant="outline" 
                onClick={() => router.push('/select-plan')}
                className="active:scale-105 transition-all"
              >
                Change Plan
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Progress Steps */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                  currentStep >= step.number 
                    ? 'bg-blue-600 border-blue-600 text-white' 
                    : 'border-slate-300 text-slate-500'
                }`}>
                  {step.number}
                </div>
                <div className="ml-3">
                  <div className={`text-sm font-medium ${
                    currentStep >= step.number ? 'text-blue-600' : 'text-slate-500'
                  }`}>
                    {step.title}
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-4 transition-all ${
                    currentStep > step.number ? 'bg-blue-600' : 'bg-slate-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Post Your Job - Step {currentStep}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Step 1: Employer Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-slate-900">Employer Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="employerName">
                        Employer Name <span className="text-[#ff7b00]">*</span>
                      </Label>
                      <Input
                        id="employerName"
                        value={formData.employerName}
                        onChange={(e) => handleInputChange('employerName', e.target.value)}
                        placeholder="e.g. Tech Corp Rwanda"
                        required
                        className="active:scale-105 transition-all"
                      />
                    </div>

                    {/* Company Logo Upload */}
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="companyLogo">
                        Company Logo
                      </Label>
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                          {companyLogoPreview ? (
                            <img 
                              src={companyLogoPreview} 
                              alt="Company logo preview" 
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <Building2 className="h-8 w-8 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1 space-y-2">
                          {!companyLogoPreview ? (
                            <div>
                              <Input
                                id="companyLogo"
                                type="file"
                                accept="image/png,image/jpeg,image/jpg"
                                onChange={handleCompanyLogoChange}
                                className="hidden"
                              />
                              <Label
                                htmlFor="companyLogo"
                                className="flex items-center justify-center gap-2 px-4 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md cursor-pointer transition-colors active:scale-105"
                              >
                                <Upload className="h-4 w-4" />
                                Upload Logo
                              </Label>
                              <p className="text-xs text-muted-foreground">
                                PNG, JPG (max. 1MB)
                              </p>
                            </div>
                          ) : (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={handleRemoveCompanyLogo}
                              className="gap-2 active:scale-105 transition-all"
                            >
                              <X className="h-4 w-4" />
                              Remove Logo
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contactName">
                        Contact Name <span className="text-[#ff7b00]">*</span>
                      </Label>
                      <Input
                        id="contactName"
                        value={formData.contactName}
                        onChange={(e) => handleInputChange('contactName', e.target.value)}
                        placeholder="e.g. John Doe"
                        required
                        className="active:scale-105 transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contactEmail">
                        Contact Email <span className="text-[#ff7b00]">*</span>
                      </Label>
                      <Input
                        id="contactEmail"
                        type="email"
                        value={formData.contactEmail}
                        onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                        placeholder="e.g. john@techcorp.rw"
                        required
                        className="active:scale-105 transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contactPhone">
                        Contact Phone <span className="text-[#ff7b00]">*</span>
                      </Label>
                      <div className="flex gap-2">
                        <Select value={formData.countryCode} onValueChange={(value) => handleInputChange('countryCode', value)}>
                          <SelectTrigger className="w-32 active:scale-105 transition-all">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="+250">🇷🇼 +250</SelectItem>
                            <SelectItem value="+1">🇺🇸 +1</SelectItem>
                            <SelectItem value="+44">🇬🇧 +44</SelectItem>
                            <SelectItem value="+254">🇰🇪 +254</SelectItem>
                            <SelectItem value="+256">🇺🇬 +256</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input
                          id="contactPhone"
                          value={formData.contactPhone}
                          onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                          placeholder="788123456"
                          required
                          className="flex-1 active:scale-105 transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Job Details */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-slate-900">Job Details</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="jobTitle">
                        Job Title <span className="text-[#ff7b00]">*</span>
                      </Label>
                      <Input
                        id="jobTitle"
                        value={formData.jobTitle}
                        onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                        placeholder="e.g. Senior Software Engineer"
                        required
                        className="active:scale-105 transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="offerType">
                        Offer Type <span className="text-[#ff7b00]">*</span>
                      </Label>
                      <Select value={formData.offerType} onValueChange={(value) => handleInputChange('offerType', value)}>
                        <SelectTrigger className="active:scale-105 transition-all">
                          <SelectValue placeholder="Select offer type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="job">Job</SelectItem>
                          <SelectItem value="tender">Tender</SelectItem>
                          <SelectItem value="internship">Internship</SelectItem>
                          <SelectItem value="volunteer">Volunteer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contractType">
                        Contract Type <span className="text-[#ff7b00]">*</span>
                      </Label>
                      <Select value={formData.contractType} onValueChange={(value) => handleInputChange('contractType', value)}>
                        <SelectTrigger className="active:scale-105 transition-all">
                          <SelectValue placeholder="Select contract type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="full-time">Full-time</SelectItem>
                          <SelectItem value="part-time">Part-time</SelectItem>
                          <SelectItem value="contract">Contract</SelectItem>
                          <SelectItem value="temporary">Temporary</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">
                        Category <span className="text-[#ff7b00]">*</span>
                      </Label>
                      <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                        <SelectTrigger className="active:scale-105 transition-all">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60">
                          {JOB_CATEGORIES.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">
                      Full Description <span className="text-[#ff7b00]">*</span>
                    </Label>
                    <RichTextEditor
                      value={formData.description}
                      onChange={(value) => handleInputChange('description', value)}
                      placeholder="Describe the job responsibilities, requirements, and qualifications..."
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Application & Logistics */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-slate-900">Application & Logistics</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="applicationMethod">
                        How to Apply <span className="text-[#ff7b00]">*</span>
                      </Label>
                      <Select value={formData.applicationMethod} onValueChange={(value) => handleInputChange('applicationMethod', value)}>
                        <SelectTrigger className="active:scale-105 transition-all">
                          <SelectValue placeholder="Select application method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="email">By Email</SelectItem>
                          <SelectItem value="link">External Link</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {formData.applicationMethod === "email" && (
                      <div className="space-y-2">
                        <Label htmlFor="applicationEmail">
                          Application Email <span className="text-[#ff7b00]">*</span>
                        </Label>
                        <Input
                          id="applicationEmail"
                          type="email"
                          value={formData.applicationEmail}
                          onChange={(e) => handleInputChange('applicationEmail', e.target.value)}
                          placeholder="e.g. careers@company.rw"
                          required={formData.applicationMethod === "email"}
                          className="active:scale-105 transition-all"
                        />
                      </div>
                    )}

                    {formData.applicationMethod === "link" && (
                      <div className="space-y-2">
                        <Label htmlFor="applicationLink">
                          Application Link <span className="text-[#ff7b00]">*</span>
                        </Label>
                        <Input
                          id="applicationLink"
                          type="url"
                          value={formData.applicationLink}
                          onChange={(e) => handleInputChange('applicationLink', e.target.value)}
                          placeholder="https://..."
                          required={formData.applicationMethod === "link"}
                          className="active:scale-105 transition-all"
                        />
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="deadline">
                        Application Deadline <span className="text-[#ff7b00]">*</span>
                      </Label>
                      <Input
                        id="deadline"
                        type="date"
                        value={formData.deadline}
                        onChange={(e) => handleInputChange('deadline', e.target.value)}
                        required
                        className="active:scale-105 transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="deadlineTime">
                        Deadline Time
                      </Label>
                      <Input
                        id="deadlineTime"
                        type="time"
                        value={formData.deadlineTime}
                        onChange={(e) => handleInputChange('deadlineTime', e.target.value)}
                        className="active:scale-105 transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="positions">
                        Number of Positions <span className="text-[#ff7b00]">*</span>
                      </Label>
                      <Input
                        id="positions"
                        type="number"
                        min="1"
                        value={formData.positions}
                        onChange={(e) => handleInputChange('positions', e.target.value)}
                        placeholder="e.g. 2"
                        required
                        className="active:scale-105 transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="experienceLevel">
                        Desired Experience Level <span className="text-[#ff7b00]">*</span>
                      </Label>
                      <Select value={formData.experienceLevel} onValueChange={(value) => handleInputChange('experienceLevel', value)}>
                        <SelectTrigger className="active:scale-105 transition-all">
                          <SelectValue placeholder="Select experience level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="entry">Entry Level (0-2 years)</SelectItem>
                          <SelectItem value="mid">Mid Level (3-5 years)</SelectItem>
                          <SelectItem value="senior">Senior Level (6-10 years)</SelectItem>
                          <SelectItem value="executive">Executive (10+ years)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="educationLevel">
                        Education Level <span className="text-[#ff7b00]">*</span>
                      </Label>
                      <Select value={formData.educationLevel} onValueChange={(value) => handleInputChange('educationLevel', value)}>
                        <SelectTrigger className="active:scale-105 transition-all">
                          <SelectValue placeholder="Select education level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high-school">High School</SelectItem>
                          <SelectItem value="diploma">Diploma/Certificate</SelectItem>
                          <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                          <SelectItem value="master">Master's Degree</SelectItem>
                          <SelectItem value="phd">PhD/Doctorate</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* File Attachments */}
                  <div className="space-y-2">
                    <Label htmlFor="attachment">
                      File Attachments
                    </Label>
                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-6">
                      <div className="text-center">
                        <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                        <div className="space-y-2">
                          <p className="text-sm text-slate-600">
                            Upload PDF or DOC files (Max 2MB)
                          </p>
                          <Input
                            id="attachment"
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileChange}
                            className="max-w-xs mx-auto active:scale-105 transition-all"
                          />
                        </div>
                      </div>
                      
                      {selectedFile && (
                        <div className="mt-4 flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-blue-600" />
                            <span className="text-sm text-blue-800">{selectedFile.name}</span>
                            <span className="text-xs text-blue-600">
                              ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                            </span>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleRemoveFile}
                            className="active:scale-105 transition-all"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Status */}
              {submitStatus === "success" && (
                <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-green-800">Job posted successfully! Redirecting...</span>
                </div>
              )}

              {submitStatus === "error" && (
                <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <span className="text-red-800">Error posting job. Please try again.</span>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  disabled={currentStep === 1}
                  className="active:scale-105 transition-all"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>

                {currentStep < 3 ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="active:scale-105 transition-all"
                  >
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="active:scale-105 transition-all"
                  >
                    {isSubmitting ? "Posting..." : "Submit Job"}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}
