"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Clock, Building2, Calendar, Briefcase, Phone, Mail } from "lucide-react"

interface PendingJob {
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
  created_at: string
}

export function PendingApprovals() {
  const [pendingJobs, setPendingJobs] = useState<PendingJob[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<string | null>(null)

  useEffect(() => {
    fetchPendingJobs()
  }, [])

  const fetchPendingJobs = async () => {
    try {
      const response = await fetch('/api/jobs/pending')
      if (!response.ok) throw new Error('Failed to fetch pending jobs')
      
      const data = await response.json()
      setPendingJobs(data.jobs || [])
    } catch (error) {
      console.error('Error fetching pending jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApproveJob = async (jobId: string) => {
    setProcessing(jobId)
    try {
      const response = await fetch(`/api/jobs/${jobId}/approve`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      })
      
      if (!response.ok) throw new Error('Failed to approve job')
      
      // Remove the approved job from the list
      setPendingJobs(prev => prev.filter(job => job.id !== jobId))
    } catch (error) {
      console.error('Error approving job:', error)
      alert('Failed to approve job. Please try again.')
    } finally {
      setProcessing(null)
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

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (pendingJobs.length === 0) {
    return (
      <div className="text-center py-12">
        <CheckCircle2 className="mx-auto h-12 w-12 text-green-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Pending Approvals</h3>
        <p className="text-gray-600">All jobs have been reviewed and approved.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-6">
        <Clock className="h-5 w-5 text-orange-500" />
        <h2 className="text-xl font-semibold text-gray-900">Pending Approvals</h2>
        <Badge variant="secondary">{pendingJobs.length} jobs</Badge>
      </div>

      {pendingJobs.map((job) => (
        <Card key={job.id} className="border-l-4 border-l-orange-500">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <CardTitle className="text-lg">{job.title}</CardTitle>
                  {getPlanBadge(job.plan_id)}
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Building2 className="h-4 w-4" />
                    <span>{job.company_name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Briefcase className="h-4 w-4" />
                    <span>{job.opportunity_type}</span>
                  </div>
                  {job.job_type && (
                    <div className="flex items-center gap-1">
                      <span className="text-gray-500">•</span>
                      <span>{job.job_type}</span>
                    </div>
                  )}
                  {job.location && (
                    <div className="flex items-center gap-1">
                      <span className="text-gray-500">•</span>
                      <span>{job.location}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Submitted</p>
                <p className="text-sm font-medium">{formatDate(job.created_at)}</p>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Employer Contact Info */}
            {(job.employer_name || job.employer_email || job.employer_phone) && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Employer Contact Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
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

            {/* Job Description Preview */}
            {job.description && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Job Description</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-700 line-clamp-3">
                    {job.description}
                  </p>
                </div>
              </div>
            )}

            {/* Deadline Info */}
            {job.deadline && (
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(`/job/${job.id}`, '_blank')}
              >
                View Details
              </Button>
              <Button
                onClick={() => handleApproveJob(job.id)}
                disabled={processing === job.id}
                className="bg-green-600 hover:bg-green-700 text-white transition-all hover:scale-105"
              >
                {processing === job.id ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Publish Now
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
