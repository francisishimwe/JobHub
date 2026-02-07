"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save } from "lucide-react"
import { RichTextEditor } from "@/components/rich-text-editor"

interface JobDetails {
  id: string
  title: string
  company_name: string
  company_logo?: string
  location?: string
  opportunity_type: string
  job_type?: string
  deadline?: string
  plan_id?: number
  employer_name?: string
  employer_email?: string
  employer_phone?: string
  description?: string
  application_link?: string
  application_method?: string
  primary_email?: string
  cc_emails?: string
  attachment_url?: string
  created_at: string
}

export default function AdminEditJobPage() {
  const { isAuthenticated } = useAuth()
  const params = useParams()
  const router = useRouter()
  const jobId = params.id as string

  const [job, setJob] = useState<JobDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    job_type: "",
    opportunity_type: "",
    deadline: "",
    application_link: "",
    application_method: "link",
    primary_email: "",
    cc_emails: "",
    plan_id: 1,
  })

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/dashboard")
      return
    }
    fetchJobDetails()
  }, [jobId, isAuthenticated])

  const fetchJobDetails = async () => {
    try {
      const response = await fetch(`/api/jobs/${jobId}`)
      if (!response.ok) {
        if (response.status === 404) {
          router.push("/dashboard")
          return
        }
        throw new Error('Failed to fetch job details')
      }
      
      const data = await response.json()
      setJob(data.job)
      setFormData({
        title: data.job.title || "",
        description: data.job.description || "",
        location: data.job.location || "",
        job_type: data.job.job_type || "",
        opportunity_type: data.job.opportunity_type || "",
        deadline: data.job.deadline || "",
        application_link: data.job.application_link || "",
        application_method: data.job.application_method || "link",
        primary_email: data.job.primary_email || "",
        cc_emails: data.job.cc_emails || "",
        plan_id: data.job.plan_id || 1,
      })
    } catch (error) {
      console.error('Error fetching job details:', error)
      router.push("/dashboard")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch(`/api/jobs/${jobId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (!response.ok) throw new Error('Failed to update job')
      
      alert('Job updated successfully!')
      router.push(`/dashboard/jobs/${jobId}`)
    } catch (error) {
      console.error('Error updating job:', error)
      alert('Failed to update job. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (!isAuthenticated || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Job Not Found</h2>
            <Button onClick={() => router.push("/dashboard")}>Back to Dashboard</Button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Button
            variant="outline"
            onClick={() => router.push(`/dashboard/jobs/${jobId}`)}
            className="mb-6 gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Job Details
          </Button>

          {/* Edit Form */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Job</h1>
            
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
                  <Label htmlFor="description">Description</Label>
                  <RichTextEditor
                    value={formData.description}
                    onChange={(value) => setFormData({ ...formData, description: value })}
                    placeholder="Describe the job responsibilities, requirements, and qualifications..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Remote, Kigali, Rwanda"
                    className="h-11 text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="application_link">Application Link</Label>
                  <Input
                    id="application_link"
                    type="url"
                    value={formData.application_link}
                    onChange={(e) => setFormData({ ...formData, application_link: e.target.value })}
                    placeholder="https://example.com/apply"
                    className="h-11 text-base"
                    disabled={formData.application_method === "email"}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="application_method">Application Method</Label>
                  <Select
                    value={formData.application_method}
                    onValueChange={(value: string) => setFormData({ ...formData, application_method: value })}
                  >
                    <SelectTrigger className="h-11 text-base">
                      <SelectValue placeholder="Select application method" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="link">External Link</SelectItem>
                      <SelectItem value="email">Email Application</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.application_method === "email" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="primary_email">Primary Email</Label>
                      <Input
                        id="primary_email"
                        type="email"
                        value={formData.primary_email}
                        onChange={(e) => setFormData({ ...formData, primary_email: e.target.value })}
                        placeholder="employer@company.com"
                        className="h-11 text-base"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cc_emails">CC Emails</Label>
                      <Input
                        id="cc_emails"
                        value={formData.cc_emails}
                        onChange={(e) => setFormData({ ...formData, cc_emails: e.target.value })}
                        placeholder="hr@company.com, manager@company.com"
                        className="h-11 text-base"
                      />
                      <p className="text-xs text-muted-foreground">
                        Enter multiple email addresses separated by commas
                      </p>
                    </div>
                  </>
                )}

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
                    <Label htmlFor="job_type">Job Type</Label>
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
                    <Label htmlFor="deadline">Deadline</Label>
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
                  <Label htmlFor="plan_id">Plan Tier</Label>
                  <Select
                    value={formData.plan_id.toString()}
                    onValueChange={(value: string) => setFormData({ ...formData, plan_id: parseInt(value) })}
                  >
                    <SelectTrigger className="h-11 text-base">
                      <SelectValue placeholder="Select plan tier" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="1">Tier 1 - Basic (50,000 RWF)</SelectItem>
                      <SelectItem value="2">Tier 2 - Featured+ (75,000 RWF)</SelectItem>
                      <SelectItem value="3">Tier 3 - Super Featured (100,000 RWF)</SelectItem>
                      <SelectItem value="4">Tier 4 - Short-listing (150,000 RWF)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => router.push(`/dashboard/jobs/${jobId}`)}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={saving}
                  className="text-black hover:opacity-90" 
                  style={{ backgroundColor: '#76c893' }}
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-black border-t-transparent mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
