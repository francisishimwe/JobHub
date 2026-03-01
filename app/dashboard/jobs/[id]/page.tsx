"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Building2, Briefcase, Calendar, Mail, Phone, Edit, Trash2, CheckCircle2 } from "lucide-react"

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
  attachment_url?: string
  created_at: string
  status?: string
}

export default function AdminJobDetailsPage() {
  const { isAuthenticated } = useAuth()
  const params = useParams()
  const router = useRouter()
  const jobId = params.id as string

  const [job, setJob] = useState<JobDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)

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
    } catch (error) {
      console.error('Error fetching job details:', error)
      router.push("/dashboard")
    } finally {
      setLoading(false)
    }
  }

  const handleApproveJob = async () => {
    setProcessing(true)
    try {
      const response = await fetch(`/api/jobs/${jobId}/approve`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      })
      
      if (!response.ok) throw new Error('Failed to approve job')
      
      alert('Job approved successfully!')
      router.push('/dashboard')
    } catch (error) {
      console.error('Error approving job:', error)
      alert('Failed to approve job. Please try again.')
    } finally {
      setProcessing(false)
    }
  }

  const handleDeleteJob = async () => {
    if (!confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
      return
    }

    setProcessing(true)
    try {
      const response = await fetch(`/api/jobs/${jobId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      })
      
      if (!response.ok) throw new Error('Failed to delete job')
      
      alert('Job deleted successfully!')
      router.push('/dashboard')
    } catch (error) {
      console.error('Error deleting job:', error)
      alert('Failed to delete job. Please try again.')
    } finally {
      setProcessing(false)
    }
  }

  const getPlanBadge = (planId?: number) => {
    switch (planId) {
      case 4:
        return <Badge className="bg-purple-100 text-purple-800">Tier 4 - Short-listing</Badge>
      case 3:
        return <Badge className="bg-blue-100 text-blue-800">Tier 3 - Super Featured</Badge>
      case 2:
        return <Badge className="bg-green-100 text-green-800">Tier 2 - Featured+</Badge>
      case 1:
      default:
        return <Badge className="bg-gray-100 text-gray-800">Tier 1 - Basic</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
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
            onClick={() => router.push("/dashboard")}
            className="mb-6 gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>

          {/* Job Details Card */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CardTitle className="text-2xl">{job.title}</CardTitle>
                    {getPlanBadge(job.plan_id)}
                  </div>
                  <div className="flex items-center gap-4 text-gray-600">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      <span>{job.company_name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5" />
                      <span>{job.opportunity_type}</span>
                    </div>
                    {job.job_type && (
                      <span className="text-gray-500">• {job.job_type}</span>
                    )}
                    {job.location && (
                      <span className="text-gray-500">• {job.location}</span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Submitted</p>
                  <p className="text-sm font-medium">{formatDate(job.created_at)}</p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Employer Contact Information */}
              {(job.employer_name || job.employer_email || job.employer_phone) && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Employer Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {job.employer_name && (
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-700">{job.employer_name}</span>
                      </div>
                    )}
                    {job.employer_email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-700">{job.employer_email}</span>
                      </div>
                    )}
                    {job.employer_phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-700">{job.employer_phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Job Description */}
              {job.description && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Job Description</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div 
                      className="text-gray-700 prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: job.description }}
                    />
                  </div>
                </div>
              )}

              {/* Additional Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {job.deadline && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
                  </div>
                )}
                {job.application_link && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Application Link:</p>
                    <a 
                      href={job.application_link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm break-all"
                    >
                      {job.application_link}
                    </a>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={() => router.push(`/dashboard/edit-job/${jobId}`)}
                  className="gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  onClick={handleDeleteJob}
                  disabled={processing}
                  className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
                <Button
                  onClick={handleApproveJob}
                  disabled={processing}
                  className="bg-green-600 hover:bg-green-700 text-white gap-2"
                >
                  {processing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      Approve & Publish
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  )
}
