"use client"

import type React from "react"
import { useState } from "react"
import { useJobs } from "@/lib/job-context"
import { useCompanies } from "@/lib/company-context"
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
  const [loading, setLoading] = useState(false)
  const [showAddCompany, setShowAddCompany] = useState(false)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [companySearch, setCompanySearch] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [newCompany, setNewCompany] = useState({
    name: "",
    logo: "",
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const [formData, setFormData] = useState({
    title: "",
    company_id: "",
    description: "",
    location: "",
    job_type: "",
    opportunity_type: "Job",
    category: "",
    deadline: "",
    application_link: "",
    attachment_url: "",
  })

  // Filter companies based on search
  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(companySearch.toLowerCase())
  )

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setImagePreview(result)
        setNewCompany({ ...newCompany, logo: result })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setImagePreview("")
    setNewCompany({ ...newCompany, logo: "" })
  }

  const handleAddCompany = async () => {
    if (!newCompany.name.trim()) {
      alert("Please enter a company name")
      return
    }

    try {
      await addCompany({
        name: newCompany.name,
        logo: newCompany.logo || "/placeholder.svg?height=40&width=40",
      })

      setNewCompany({ name: "", logo: "" })
      setImagePreview("")
      setShowAddCompany(false)
      alert("Company added successfully! Please select it from the dropdown.")
    } catch (error) {
      console.error("Error adding company:", error)
      alert("Failed to add company. Please try again.")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Validate required fields
    if (!formData.title?.trim()) {
      alert("Please enter a job title")
      setLoading(false)
      return
    }

    if (!formData.company_id) {
      alert("Please select a company")
      setLoading(false)
      return
    }

    if (!formData.opportunity_type) {
      alert("Please select an opportunity type")
      setLoading(false)
      return
    }

    try {
      console.log("Form data being submitted:", formData)

      // Clean up empty strings to null for optional fields
      const cleanedData = {
        title: formData.title.trim(),
        company_id: formData.company_id,
        description: formData.description?.trim() || null,
        location: formData.location?.trim() || null,
        job_type: formData.job_type || null,
        opportunity_type: formData.opportunity_type,
        category: formData.category?.trim() || null,
        deadline: formData.deadline || null,
        application_link: formData.application_link?.trim() || null,
        attachment_url: formData.attachment_url?.trim() || null,
      }

      console.log("Cleaned data being sent to addJob:", cleanedData)

      await addJob(cleanedData)

      setFormData({
        title: "",
        company_id: "",
        description: "",
        location: "",
        job_type: "",
        opportunity_type: "Job",
        category: "",
        deadline: "",
        application_link: "",
        attachment_url: "",
      })
      setCompanySearch("")
      setSelectedFile(null)

      alert("Job added successfully!")
      onSuccess?.()
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
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="title">Job Title *</Label>
            <Input
              id="title"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Senior Product Designer"
              className="h-11 text-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">Company *</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="relative">
                <Input
                  id="company-search"
                  placeholder="Enter company name"
                  value={companySearch}
                  onChange={(e) => {
                    setCompanySearch(e.target.value)
                    setShowSuggestions(true)
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  className="h-11 text-base"
                />
                {showSuggestions && companySearch && filteredCompanies.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-sm max-h-60 overflow-auto">
                    {filteredCompanies.map((company) => (
                      <button
                        key={company.id}
                        type="button"
                        onClick={() => {
                          setCompanySearch(company.name)
                          setFormData({ ...formData, company_id: company.id })
                          setShowSuggestions(false)
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-blue-50 flex items-center gap-2 border-b last:border-b-0"
                      >
                        {company.logo && (
                          <img src={company.logo} alt="" className="h-6 w-6 rounded object-cover" />
                        )}
                        <span>{company.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <Button
                type="button"
                className="h-11 gap-2 text-black hover:opacity-90"
                style={{ backgroundColor: '#76c893' }}
                onClick={() => setShowAddCompany(true)}
              >
                <Plus className="h-4 w-4" />
                Add New Company
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <RichTextEditor
              value={formData.description}
              onChange={(value) => setFormData({ ...formData, description: value })}
              placeholder="Describe the job responsibilities, requirements, and qualifications..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location (Optional)</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g. Remote, Kigali, Rwanda"
              className="h-11 text-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="application_link">Application Link (Optional)</Label>
            <Input
              id="application_link"
              type="url"
              value={formData.application_link}
              onChange={(e) => setFormData({ ...formData, application_link: e.target.value })}
              placeholder="https://example.com/apply"
              className="h-11 text-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="attachment">Attach Document (Optional)</Label>
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  id="attachment"
                  type="file"
                  accept=".pdf,.doc,.docx,.xls,.xlsx"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (!file) return
                    const allowedTypes = [
                      'application/pdf',
                      'application/msword',
                      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                      'application/vnd.ms-excel',
                      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                    ]
                    if (!allowedTypes.includes(file.type)) {
                      alert("Please upload a PDF, DOC, DOCX, XLS, or XLSX file")
                      return
                    }
                    if (file.size > 10 * 1024 * 1024) {
                      alert("File size must be less than 10MB")
                      return
                    }
                    setSelectedFile(file)
                    setFormData({ ...formData, attachment_url: file.name })
                  }}
                  className="h-11 text-base"
                />
              </div>
              {selectedFile && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setSelectedFile(null)
                    setFormData({ ...formData, attachment_url: "" })
                  }}
                  className="gap-2"
                >
                  <X className="h-4 w-4" />
                  Clear
                </Button>
              )}
            </div>
            {selectedFile && (
              <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 p-2 rounded">
                <FileText className="h-4 w-4" />
                <span>{selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)</span>
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Supported formats: PDF, DOC, DOCX, XLS, XLSX (Max 10MB)
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="opportunity_type">Opportunity Type *</Label>
              <Select
                value={formData.opportunity_type}
                onValueChange={(value: string) => setFormData({ ...formData, opportunity_type: value })}
              >
                <SelectTrigger className="h-11 text-base">
                  <SelectValue placeholder="Select opportunity type" />
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
              <Label htmlFor="job_type">Job Type (Optional)</Label>
              <Select
                value={formData.job_type}
                onValueChange={(value: string) => setFormData({ ...formData, job_type: value })}
              >
                <SelectTrigger className="h-11 text-base">
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="Full-time">Full-time</SelectItem>
                  <SelectItem value="Part-time">Part-time</SelectItem>
                  <SelectItem value="Contract">Contract</SelectItem>
                  <SelectItem value="Temporary">Temporary</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="deadline">Deadline (Optional)</Label>
              <Input
                id="deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className="h-11 text-base"
              />
            </div>
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
                <SelectItem value="Agronomy">Agronomy</SelectItem>
                <SelectItem value="Administration">Administration</SelectItem>
                <SelectItem value="Agriculture">Agriculture</SelectItem>
                <SelectItem value="Procurement">Procurement</SelectItem>
                <SelectItem value="Animal science">Animal science</SelectItem>
                <SelectItem value="Auditing">Auditing</SelectItem>
                <SelectItem value="Banking">Banking</SelectItem>
                <SelectItem value="Business">Business</SelectItem>
                <SelectItem value="Catering">Catering</SelectItem>
                <SelectItem value="Civil engineering">Civil engineering</SelectItem>
                <SelectItem value="Communications">Communications</SelectItem>
                <SelectItem value="Computer and IT">Computer and IT</SelectItem>
                <SelectItem value="Consultancy">Consultancy</SelectItem>
                <SelectItem value="Law">Law</SelectItem>
                <SelectItem value="Education">Education</SelectItem>
                <SelectItem value="Electrical engineering">Electrical engineering</SelectItem>
                <SelectItem value="Engineering">Engineering</SelectItem>
                <SelectItem value="Environmental">Environmental</SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
                <SelectItem value="Food Sciences">Food Sciences</SelectItem>
                <SelectItem value="Geology">Geology</SelectItem>
                <SelectItem value="Management">Management</SelectItem>
                <SelectItem value="Hospitality">Hospitality</SelectItem>
                <SelectItem value="Hotel">Hotel</SelectItem>
                <SelectItem value="Human resource">Human resource</SelectItem>
                <SelectItem value="Journalism">Journalism</SelectItem>
                <SelectItem value="Logistics">Logistics</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
                <SelectItem value="Marketing and sales">Marketing and sales</SelectItem>
                <SelectItem value="Mechanical engineering">Mechanical engineering</SelectItem>
                <SelectItem value="Medicine">Medicine</SelectItem>
                <SelectItem value="Mining">Mining</SelectItem>
                <SelectItem value="Pharmacy">Pharmacy</SelectItem>
                <SelectItem value="Project management">Project management</SelectItem>
                <SelectItem value="Psychology">Psychology</SelectItem>
                <SelectItem value="Public Health">Public Health</SelectItem>
                <SelectItem value="Research">Research</SelectItem>
                <SelectItem value="Statistics">Statistics</SelectItem>
                <SelectItem value="Telecommunications">Telecommunications</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onSuccess} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading} className="text-black hover:opacity-90" style={{ backgroundColor: '#76c893' }}>
            {loading ? "Adding Job..." : "Add Job"}
          </Button>
        </div>
      </form>

      {/* Add Company Dialog */}
      <Dialog open={showAddCompany} onOpenChange={setShowAddCompany}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Company</DialogTitle>
          </DialogHeader>
          <div className="space-y-5">
            {/* Image Upload Section */}
            <div className="space-y-3">
              <Label>Company Logo</Label>
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={imagePreview || newCompany.logo} alt="Company logo" />
                  <AvatarFallback>
                    <Building2 className="h-10 w-10 text-muted-foreground" />
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-2">
                  {!imagePreview ? (
                    <div>
                      <Input
                        id="logo-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      <Label
                        htmlFor="logo-upload"
                        className="flex items-center justify-center gap-2 px-4 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md cursor-pointer transition-colors"
                      >
                        <Upload className="h-4 w-4" />
                        Upload Image
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">
                        PNG, JPG or GIF (max. 2MB)
                      </p>
                    </div>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleRemoveImage}
                      className="gap-2"
                    >
                      <X className="h-4 w-4" />
                      Remove Image
                    </Button>
                  )}
                </div>
              </div>

              {/* Or use URL */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or use URL</span>
                </div>
              </div>

              <Input
                id="company-logo-url"
                value={newCompany.logo}
                onChange={(e) => {
                  setNewCompany({ ...newCompany, logo: e.target.value })
                  setImagePreview(e.target.value)
                }}
                placeholder="https://example.com/logo.png"
              />
            </div>

            {/* Company Name */}
            <div className="space-y-2">
              <Label htmlFor="company-name">Company Name *</Label>
              <Input
                id="company-name"
                required
                value={newCompany.name}
                onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
                placeholder="e.g. Acme Corporation"
                className="h-11 text-base"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowAddCompany(false)
                  setNewCompany({ name: "", logo: "" })
                  setImagePreview("")
                }}
              >
                Cancel
              </Button>
              <Button type="button" onClick={handleAddCompany} className="text-black hover:opacity-90" style={{ backgroundColor: '#76c893' }}>
                Add Company
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
