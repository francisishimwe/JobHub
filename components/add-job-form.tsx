"use client"

import type React from "react"
import { useState } from "react"
import { useJobs } from "@/lib/job-context"
import { useCompanies } from "@/lib/company-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { experienceLevels, jobTypes } from "@/lib/mock-data"
import { Plus, Building2, Upload, X } from "lucide-react"
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

  const [formData, setFormData] = useState({
    title: "",
    companyId: "",
    description: "",
    location: "",
    locationType: "",
    jobType: "",
    opportunityType: "Job",
    experienceLevel: "",
    deadline: "",
    applicationLink: "",
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

    if (!formData.description?.trim()) {
      alert("Please enter a job description")
      setLoading(false)
      return
    }

    if (!formData.location?.trim()) {
      alert("Please enter a job location")
      setLoading(false)
      return
    }

    if (!formData.opportunityType) {
      alert("Please select an opportunity type")
      setLoading(false)
      return
    }

    try {
      console.log("Form data being submitted:", formData)

      // Clean up empty strings to null for optional fields
      const cleanedData = {
        title: formData.title.trim(),
        companyId: formData.companyId || null,
        description: formData.description.trim(), // Required field
        location: formData.location.trim(), // Required field
        locationType: formData.locationType || null,
        jobType: formData.jobType || null,
        opportunityType: formData.opportunityType,
        experienceLevel: formData.experienceLevel || null,
        deadline: formData.deadline || null,
        applicationLink: formData.applicationLink?.trim() || null,
        featured: false,
      }

      console.log("Cleaned data being sent to addJob:", cleanedData)

      await addJob(cleanedData as any)

      setFormData({
        title: "",
        companyId: "",
        description: "",
        location: "",
        locationType: "",
        jobType: "",
        opportunityType: "Job",
        experienceLevel: "",
        deadline: "",
        applicationLink: "",
      })

      alert("Job added successfully!")
      onSuccess?.()
    } catch (error) {
      console.error("Error adding job:", error)
      alert("Failed to add job. Check console for details.")
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
            <Label htmlFor="company">Company (Optional)</Label>
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
                  <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                    {filteredCompanies.map((company) => (
                      <button
                        key={company.id}
                        type="button"
                        onClick={() => {
                          setCompanySearch(company.name)
                          setFormData({ ...formData, companyId: company.id })
                          setShowSuggestions(false)
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2"
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
            <Label htmlFor="description">Description *</Label>
            <RichTextEditor
              value={formData.description}
              onChange={(value) => setFormData({ ...formData, description: value })}
              placeholder="Describe the job responsibilities, requirements, and qualifications..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Remote, New York, USA"
                className="h-11 text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="locationType">Location Type (Optional)</Label>
              <Input
                id="locationType"
                value={formData.locationType}
                onChange={(e) => setFormData({ ...formData, locationType: e.target.value })}
                placeholder="e.g. Remote, On-site, Hybrid"
                className="h-11 text-base"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="opportunityType">Opportunity Type *</Label>
              <Select
                value={formData.opportunityType}
                onValueChange={(value: string) => setFormData({ ...formData, opportunityType: value })}
              >
                <SelectTrigger className="h-11 text-base">
                  <SelectValue placeholder="Select opportunity type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Job">Job</SelectItem>
                  <SelectItem value="Internship">Internship</SelectItem>
                  <SelectItem value="Scholarship">Scholarship</SelectItem>
                  <SelectItem value="Education">Education</SelectItem>
                  <SelectItem value="Tender">Tender</SelectItem>
                  <SelectItem value="Blog">Blog</SelectItem>
                  <SelectItem value="Announcement">Announcement</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="jobType">Job Type (Optional)</Label>
              <Input
                id="jobType"
                value={formData.jobType}
                onChange={(e) => setFormData({ ...formData, jobType: e.target.value })}
                placeholder="e.g. Full-time, Part-time, Contract"
                className="h-11 text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="experienceLevel">Experience Level (Optional)</Label>
              <Input
                id="experienceLevel"
                value={formData.experienceLevel}
                onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
                placeholder="e.g. Entry level, Intermediate, Expert"
                className="h-11 text-base"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="applicationLink">Application Link (Optional)</Label>
              <Input
                id="applicationLink"
                type="url"
                value={formData.applicationLink}
                onChange={(e) => setFormData({ ...formData, applicationLink: e.target.value })}
                placeholder="https://example.com/apply"
                className="h-11 text-base"
              />
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
