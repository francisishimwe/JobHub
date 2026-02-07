"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle, Mail } from "lucide-react"

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
      const response = await fetch('/api/apply-by-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobId,
          jobTitle,
          primaryEmail,
          ccEmails: ccEmails ? ccEmails.split(',').map(email => email.trim()) : [],
          applicant: {
            full_name: formData.full_name.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim(),
            field_of_study: formData.field_of_study.trim()
          }
        }),
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
        <h3 className="text-lg font-semibold text-green-800 mb-2">Application Submitted Successfully!</h3>
        <p className="text-green-700 mb-4">
          Your application for {jobTitle} has been sent to the employer.
        </p>
        <p className="text-sm text-green-600 mb-4">
          Need support? Contact us directly on WhatsApp:
        </p>
        <Button
          asChild
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <a
            href="https://wa.me/250783074056"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2"
          >
            <Mail className="h-4 w-4" />
            Contact on WhatsApp
          </a>
        </Button>
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
          <Input
            id="field_of_study"
            type="text"
            required
            value={formData.field_of_study}
            onChange={(e) => setFormData({ ...formData, field_of_study: e.target.value })}
            placeholder="e.g. Computer Science, Business Administration"
            className="h-11"
          />
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
