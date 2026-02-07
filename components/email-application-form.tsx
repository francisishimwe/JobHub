"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle, Mail, Upload, X, FileText } from "lucide-react"

interface EmailApplicationFormProps {
  jobId: string
  jobTitle: string
  primaryEmail: string
  ccEmails?: string
  onSuccess: () => void
}

export function EmailApplicationForm({ 
  jobId, 
  jobTitle, 
  primaryEmail, 
  ccEmails, 
  onSuccess 
}: EmailApplicationFormProps) {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    field_of_study: ""
  })
  const [coverLetter, setCoverLetter] = useState<File | null>(null)
  const [otherDocuments, setOtherDocuments] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    // Validate form
    if (!formData.full_name.trim()) {
      setError("Please enter your full name")
      setIsSubmitting(false)
      return
    }

    if (!formData.email.trim()) {
      setError("Please enter your email address")
      setIsSubmitting(false)
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email.trim())) {
      setError("Please enter a valid email address")
      setIsSubmitting(false)
      return
    }

    if (!formData.phone.trim()) {
      setError("Please enter your phone number")
      setIsSubmitting(false)
      return
    }

    if (!formData.field_of_study.trim()) {
      setError("Please enter your field of study")
      setIsSubmitting(false)
      return
    }

    try {
      // Create FormData for file upload
      const submissionData = new FormData()
      submissionData.append('jobId', jobId)
      submissionData.append('jobTitle', jobTitle)
      submissionData.append('primaryEmail', primaryEmail)
      submissionData.append('ccEmails', JSON.stringify(ccEmails ? ccEmails.split(',').map(email => email.trim()) : []))
      submissionData.append('applicant', JSON.stringify({
        full_name: formData.full_name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        field_of_study: formData.field_of_study.trim()
      }))
      
      // Add files if they exist
      if (coverLetter) {
        submissionData.append('coverLetter', coverLetter)
      }
      
      otherDocuments.forEach((doc, index) => {
        submissionData.append(`otherDocument_${index}`, doc)
      })

      const response = await fetch('/api/apply-by-email', {
        method: 'POST',
        body: submissionData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit application')
      }

      setIsSubmitted(true)
      setTimeout(() => {
        onSuccess()
      }, 3000)
    } catch (error) {
      console.error('Application submission error:', error)
      setError(error instanceof Error ? error.message : 'Failed to submit application. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-green-800 mb-2">Application sent!</h3>
        <p className="text-green-700 mb-4">
          For help, contact 0783074056
        </p>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
      <h3 className="text-lg font-semibold mb-4">Apply via Email</h3>
      
      {error && (
        <Alert className="mb-4 border-red-200 bg-red-50">
          <AlertDescription className="text-red-700">
            {error}
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="full_name">Full Name *</Label>
          <Input
            id="full_name"
            type="text"
            required
            value={formData.full_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            placeholder="Enter your full name"
            className="h-11"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="your.email@example.com"
            className="h-11"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            type="tel"
            required
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+250 7XX XXX XXX"
            className="h-11"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="field_of_study">Field of Study *</Label>
          <Select value={formData.field_of_study} onValueChange={(value) => setFormData({ ...formData, field_of_study: value })}>
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Select your field of study" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Computer Science">Computer Science</SelectItem>
              <SelectItem value="Information Technology">Information Technology</SelectItem>
              <SelectItem value="Software Engineering">Software Engineering</SelectItem>
              <SelectItem value="Business Administration">Business Administration</SelectItem>
              <SelectItem value="Finance">Finance</SelectItem>
              <SelectItem value="Accounting">Accounting</SelectItem>
              <SelectItem value="Marketing">Marketing</SelectItem>
              <SelectItem value="Human Resources">Human Resources</SelectItem>
              <SelectItem value="Engineering">Engineering</SelectItem>
              <SelectItem value="Medicine">Medicine</SelectItem>
              <SelectItem value="Nursing">Nursing</SelectItem>
              <SelectItem value="Education">Education</SelectItem>
              <SelectItem value="Law">Law</SelectItem>
              <SelectItem value="Agriculture">Agriculture</SelectItem>
              <SelectItem value="Tourism">Tourism</SelectItem>
              <SelectItem value="Journalism">Journalism</SelectItem>
              <SelectItem value="Psychology">Psychology</SelectItem>
              <SelectItem value="Sociology">Sociology</SelectItem>
              <SelectItem value="Economics">Economics</SelectItem>
              <SelectItem value="Statistics">Statistics</SelectItem>
              <SelectItem value="Mathematics">Mathematics</SelectItem>
              <SelectItem value="Physics">Physics</SelectItem>
              <SelectItem value="Chemistry">Chemistry</SelectItem>
              <SelectItem value="Biology">Biology</SelectItem>
              <SelectItem value="Environmental Science">Environmental Science</SelectItem>
              <SelectItem value="Public Health">Public Health</SelectItem>
              <SelectItem value="Social Work">Social Work</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Job Title Display (Non-editable) */}
        <div className="space-y-2">
          <Label>Position Applied For</Label>
          <Input
            value={jobTitle}
            disabled
            className="h-11 bg-gray-100 text-gray-900 font-medium"
          />
        </div>

        {/* Cover Letter Upload */}
        <div className="space-y-2">
          <Label>Upload Cover Letter (PDF/DOCX)</Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
            {coverLetter ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-gray-700">{coverLetter.name}</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setCoverLetter(null)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="text-center">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <label htmlFor="coverLetter" className="cursor-pointer">
                  <span className="text-sm text-blue-600 hover:text-blue-800">Choose file</span>
                  <input
                    id="coverLetter"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        if (file.size > 5 * 1024 * 1024) {
                          setError("File size must be less than 5MB")
                          return
                        }
                        setCoverLetter(file)
                      }
                    }}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-gray-500 mt-1">PDF or DOCX, max 5MB</p>
              </div>
            )}
          </div>
        </div>

        {/* Other Documents Upload */}
        <div className="space-y-2">
          <Label>Upload Additional Documents (Optional)</Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
            {otherDocuments.length > 0 && (
              <div className="space-y-2 mb-3">
                {otherDocuments.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-600" />
                      <span className="text-sm text-gray-700">{doc.name}</span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setOtherDocuments(prev => prev.filter((_, i) => i !== index))}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            <div className="text-center">
              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <label htmlFor="otherDocuments" className="cursor-pointer">
                <span className="text-sm text-blue-600 hover:text-blue-800">Add document</span>
                <input
                  id="otherDocuments"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files || [])
                    const validFiles = files.filter(file => {
                      if (file.size > 5 * 1024 * 1024) {
                        setError(`${file.name} is too large (max 5MB)`)
                        return false
                      }
                      return true
                    })
                    setOtherDocuments(prev => [...prev, ...validFiles])
                  }}
                  className="hidden"
                />
              </label>
              <p className="text-xs text-gray-500 mt-1">PDF or DOCX, max 5MB each</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-700">
            <strong>Note:</strong> Your application will be sent directly to the employer via email. 
            Your email and field of study will be saved to enable future job alerts.
          </p>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 font-semibold"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Submitting Application...
            </>
          ) : (
            "Submit Application"
          )}
        </Button>
      </form>
    </div>
  )
}
