"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle } from "lucide-react"

const planDetails = {
  1: { name: "Featured", color: "bg-blue-500" },
  2: { name: "Featured+", color: "bg-purple-500" },
  3: { name: "Super Featured", color: "bg-amber-500" },
  4: { name: "Short-listing", color: "bg-orange-500" }
}

export default function PostJobFormPage() {
  const router = useRouter()
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    jobType: "",
    opportunityType: "",
    experienceLevel: "",
    description: "",
    applicationLink: "",
    deadline: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")

  useEffect(() => {
    // Get selected plan from localStorage
    const storedPlan = localStorage.getItem('selectedPlan')
    if (storedPlan) {
      setSelectedPlan(parseInt(storedPlan))
    } else {
      // Redirect to select plan if no plan selected
      router.push('/select-plan')
    }
  }, [router])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedPlan) return

    setIsSubmitting(true)
    setSubmitStatus("idle")

    try {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          planId: selectedPlan
        })
      })

      if (response.ok) {
        setSubmitStatus("success")
        // Clear localStorage
        localStorage.removeItem('selectedPlan')
        // Redirect after 2 seconds
        setTimeout(() => {
          router.push('/')
        }, 2000)
      } else {
        setSubmitStatus("error")
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
                  {selectedPlan === 4 && (
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

        {/* Job Form */}
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Post Your Job
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Job Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Job Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="e.g. Senior Software Engineer"
                    required
                    className="active:scale-105 transition-all"
                  />
                </div>

                {/* Company */}
                <div className="space-y-2">
                  <Label htmlFor="company">Company Name *</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    placeholder="e.g. Tech Corp Rwanda"
                    required
                    className="active:scale-105 transition-all"
                  />
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="e.g. Kigali, Rwanda"
                    required
                    className="active:scale-105 transition-all"
                  />
                </div>

                {/* Job Type */}
                <div className="space-y-2">
                  <Label htmlFor="jobType">Job Type *</Label>
                  <Select value={formData.jobType} onValueChange={(value) => handleInputChange('jobType', value)}>
                    <SelectTrigger className="active:scale-105 transition-all">
                      <SelectValue placeholder="Select job type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Full-time">Full-time</SelectItem>
                      <SelectItem value="Part-time">Part-time</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                      <SelectItem value="Internship">Internship</SelectItem>
                      <SelectItem value="Volunteer">Volunteer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Opportunity Type */}
                <div className="space-y-2">
                  <Label htmlFor="opportunityType">Opportunity Type *</Label>
                  <Select value={formData.opportunityType} onValueChange={(value) => handleInputChange('opportunityType', value)}>
                    <SelectTrigger className="active:scale-105 transition-all">
                      <SelectValue placeholder="Select opportunity type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Job">Job</SelectItem>
                      <SelectItem value="Tender">Tender</SelectItem>
                      <SelectItem value="Internship">Internship</SelectItem>
                      <SelectItem value="Volunteer">Volunteer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Experience Level */}
                <div className="space-y-2">
                  <Label htmlFor="experienceLevel">Experience Level</Label>
                  <Select value={formData.experienceLevel} onValueChange={(value) => handleInputChange('experienceLevel', value)}>
                    <SelectTrigger className="active:scale-105 transition-all">
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Entry Level">Entry Level</SelectItem>
                      <SelectItem value="Mid Level">Mid Level</SelectItem>
                      <SelectItem value="Senior Level">Senior Level</SelectItem>
                      <SelectItem value="Executive">Executive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Application Deadline */}
                <div className="space-y-2">
                  <Label htmlFor="deadline">Application Deadline</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => handleInputChange('deadline', e.target.value)}
                    className="active:scale-105 transition-all"
                  />
                </div>

                {/* Application Link */}
                <div className="space-y-2">
                  <Label htmlFor="applicationLink">Application Link</Label>
                  <Input
                    id="applicationLink"
                    value={formData.applicationLink}
                    onChange={(e) => handleInputChange('applicationLink', e.target.value)}
                    placeholder="https://..."
                    className="active:scale-105 transition-all"
                  />
                </div>
              </div>

              {/* Job Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Job Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe the role, responsibilities, requirements..."
                  rows={6}
                  required
                  className="active:scale-105 transition-all"
                />
              </div>

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

              {/* Submit Button */}
              <div className="flex justify-center">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full transition-all active:scale-105"
                >
                  {isSubmitting ? "Posting..." : "Post Job"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}
