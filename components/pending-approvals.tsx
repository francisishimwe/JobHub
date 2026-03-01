"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { CheckCircle2, Clock, Building2, Calendar, Briefcase, Phone, Mail, Trash2, Edit, Eye, Users } from "lucide-react"
import { ApplicantReview } from "@/components/applicant-review"

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
  tier?: string
  candidate_pre_screening?: boolean
  priority_candidate_matching?: boolean
  matched_candidates_count?: number
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
  const [jobToDelete, setJobToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [selectedJob, setSelectedJob] = useState<PendingJob | null>(null)
  const [matchedCandidates, setMatchedCandidates] = useState<any[]>([])
  const [showCandidatesDialog, setShowCandidatesDialog] = useState(false)
  const [loadingCandidates, setLoadingCandidates] = useState(false)
  const [showApplicantReview, setShowApplicantReview] = useState(false)
  const [selectedJobForReview, setSelectedJobForReview] = useState<PendingJob | null>(null)

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

  const handleDeleteJob = async (jobId: string) => {
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/jobs/${jobId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      })
      
      if (!response.ok) throw new Error('Failed to delete job')
      
      // Remove the deleted job from the list
      setPendingJobs(prev => prev.filter(job => job.id !== jobId))
      setJobToDelete(null)
    } catch (error) {
      console.error('Error deleting job:', error)
      alert('Failed to delete job. Please try again.')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleViewMatchedCandidates = async (job: PendingJob) => {
    setSelectedJob(job)
    setShowCandidatesDialog(true)
    setLoadingCandidates(true)
    
    try {
      // Extract job field for matching
      const jobTitle = job.title.toLowerCase()
      const jobDescription = (job.description || '').toLowerCase()
      
      // Define skill/field mappings for matching
      const fieldMappings: { [key: string]: string[] } = {
        'technology': ['software', 'developer', 'programming', 'it', 'computer science', 'web', 'app', 'data', 'cybersecurity'],
        'business': ['business', 'management', 'marketing', 'sales', 'finance', 'accounting', 'hr', 'administration'],
        'healthcare': ['medical', 'nursing', 'healthcare', 'doctor', 'pharmacy', 'hospital'],
        'education': ['teaching', 'education', 'teacher', 'academic', 'university', 'school'],
        'engineering': ['engineering', 'civil', 'mechanical', 'electrical', 'construction'],
        'agriculture': ['agriculture', 'farming', 'agronomy', 'veterinary'],
        'hospitality': ['hotel', 'tourism', 'restaurant', 'hospitality', 'service'],
        'media': ['journalism', 'media', 'communication', 'design', 'creative', 'art']
      }

      // Determine job field
      let jobField = 'general'
      for (const [field, keywords] of Object.entries(fieldMappings)) {
        if (keywords.some(keyword => jobTitle.includes(keyword) || jobDescription.includes(keyword))) {
          jobField = field
          break
        }
      }

      // Fetch matching CVs
      const response = await fetch(`/api/cv-profiles?fieldOfStudy=${jobField}&limit=5`)
      if (!response.ok) throw new Error('Failed to fetch matched candidates')
      
      const data = await response.json()
      setMatchedCandidates(data.data || [])
    } catch (error) {
      console.error('Error fetching matched candidates:', error)
      setMatchedCandidates([])
    } finally {
      setLoadingCandidates(false)
    }
  }

  const getPlanBadge = (tier?: string, planId?: number) => {
    // Use tier if available, otherwise fall back to planId
    const tierValue = tier || (planId === 4 ? 'short-listing' : planId === 3 ? 'super-featured' : planId === 2 ? 'featured-plus' : 'basic')
    
    switch (tierValue) {
      case 'short-listing':
        return <Badge className="bg-green-100 text-green-800">Short-listing (150k)</Badge>
      case 'super-featured':
        return <Badge className="bg-orange-100 text-orange-800">Super Featured (100k)</Badge>
      case 'featured-plus':
        return <Badge className="bg-purple-100 text-purple-800">Featured+ (75k)</Badge>
      case 'featured':
        return <Badge className="bg-blue-100 text-blue-800">Featured (50k)</Badge>
      case 'basic':
      default:
        return <Badge className="bg-gray-100 text-gray-800">Basic</Badge>
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
                  {/* Company Logo */}
                  <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 border border-gray-200">
                    {job.company_logo ? (
                      <img
                        src={job.company_logo}
                        alt={`${job.company_name} logo`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-gray-200">
                        <Building2 className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-lg">{job.title}</CardTitle>
                      {getPlanBadge(job.tier, job.plan_id)}
                      {job.matched_candidates_count !== undefined && job.matched_candidates_count > 0 && (
                        <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                          {job.matched_candidates_count} Matched Candidates
                        </Badge>
                      )}
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
                  <div 
                    className="prose prose-sm max-w-none text-slate-700 font-normal leading-relaxed text-sm
                      [&_p]:mb-2 [&_p]:leading-relaxed [&_p]:break-words [&_p]:overflow-wrap-break-word [&_p]:whitespace-pre-wrap
                      [&_ul]:list-disc [&_ul]:ml-4 [&_ul]:mb-2 [&_ul]:space-y-1 [&_ul]:break-words
                      [&_ol]:list-decimal [&_ol]:ml-4 [&_ol]:mb-2 [&_ol]:space-y-1 [&_ol]:break-words
                      [&_li]:mb-1 [&_li]:leading-relaxed [&_li]:break-words [&_li]:overflow-wrap-break-word
                      [&_strong]:font-semibold [&_strong]:text-gray-900 [&_strong]:break-words
                      [&_b]:font-semibold [&_b]:text-gray-900 [&_b]:break-words
                      [&_h1]:text-base [&_h1]:font-semibold [&_h1]:text-gray-900 [&_h1]:mb-2 [&_h1]:break-words
                      [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-gray-900 [&_h2]:mb-2 [&_h2]:break-words
                      [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-gray-900 [&_h3]:mb-2 [&_h3]:break-words
                      [&_h4]:text-base [&_h4]:font-semibold [&_h4]:text-gray-900 [&_h4]:mb-2 [&_h4]:break-words
                      [&_h5]:text-base [&_h5]:font-semibold [&_h5]:text-gray-900 [&_h5]:mb-2 [&_h5]:break-words
                      [&_h6]:text-base [&_h6]:font-semibold [&_h6]:text-gray-900 [&_h6]:mb-2 [&_h6]:break-words
                      [&_a]:text-blue-600 [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-blue-800 [&_a]:break-all
                      [&_blockquote]:border-l-2 [&_blockquote]:border-gray-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:leading-relaxed [&_blockquote]:break-words
                      [&_code]:bg-gray-100 [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:font-mono [&_code]:text-xs break-all
                      [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded [&_img]:my-2
                      [&_table]:w-full [&_table]:border-collapse [&_table]:my-2 [&_table]:overflow-hidden break-words
                      [&_td]:border [&_td]:border-gray-200 [&_td]:p-2 [&_td]:align-top break-words [&_td]:whitespace-pre-wrap
                      [&_th]:border [&_th]:border-gray-200 [&_th]:p-2 [&_th]:bg-gray-50 [&_th]:font-semibold [&_th]:text-left [&_th]:break-words
                    "
                    dangerouslySetInnerHTML={{ __html: job.description }}
                  />
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
                onClick={() => window.open(`/dashboard/jobs/${job.id}`, '_blank')}
                className="active:scale-105 transition-all"
              >
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(`/dashboard/edit-job/${job.id}`, '_blank')}
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 active:scale-105 transition-all"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              {(job.tier === 'short-listing' || job.candidate_pre_screening) && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewMatchedCandidates(job)}
                    className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 active:scale-105 transition-all"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Shortlist
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedJobForReview(job)
                      setShowApplicantReview(true)
                    }}
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 active:scale-105 transition-all"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Review Applicants
                  </Button>
                </>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setJobToDelete(job.id)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 active:scale-105 transition-all"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
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
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!jobToDelete} onOpenChange={(open) => !open && setJobToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Job Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this job post? This action cannot be undone and will permanently remove the job listing.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-end gap-3">
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => jobToDelete && handleDeleteJob(jobToDelete)}
              disabled={isDeleting}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Matched Candidates Dialog */}
      <AlertDialog open={showCandidatesDialog} onOpenChange={(open) => !open && setShowCandidatesDialog(false)}>
        <AlertDialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <AlertDialogHeader>
            <AlertDialogTitle>Matched Candidates for {selectedJob?.title}</AlertDialogTitle>
            <AlertDialogDescription>
              Top 5 candidates matching the job requirements based on field of study and skills.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="mt-4">
            {loadingCandidates ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
                <span className="ml-3">Finding matched candidates...</span>
              </div>
            ) : matchedCandidates.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No matching candidates found for this position.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {matchedCandidates.map((candidate, index) => (
                  <Card key={candidate.id} className="border-l-4 border-l-green-500">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold text-lg">
                              {candidate.first_name} {candidate.last_name}
                            </h4>
                            <Badge variant="secondary">#{index + 1}</Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium">Email:</span> {candidate.email}
                            </div>
                            <div>
                              <span className="font-medium">Phone:</span> {candidate.phone || 'Not provided'}
                            </div>
                            <div>
                              <span className="font-medium">Experience Level:</span> {candidate.experience_level || 'Not specified'}
                            </div>
                            <div>
                              <span className="font-medium">Years of Experience:</span> {candidate.experience_years || 'Not specified'}
                            </div>
                          </div>

                          {candidate.education && candidate.education.length > 0 && (
                            <div className="mt-3">
                              <h5 className="font-medium text-sm mb-2">Education:</h5>
                              <div className="space-y-1">
                                {candidate.education.slice(0, 2).map((edu: any, eduIndex: number) => (
                                  <div key={eduIndex} className="text-sm text-gray-600">
                                    • {edu.degree} in {edu.fieldOfStudy} from {edu.institution}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {candidate.skills && candidate.skills.length > 0 && (
                            <div className="mt-3">
                              <h5 className="font-medium text-sm mb-2">Skills:</h5>
                              <div className="flex flex-wrap gap-2">
                                {candidate.skills.slice(0, 5).map((skill: string, skillIndex: number) => (
                                  <Badge key={skillIndex} variant="outline" className="text-xs">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex flex-col gap-2">
                          <Button
                            size="sm"
                            onClick={() => window.open(`mailto:${candidate.email}`, '_blank')}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            Contact Candidate
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex justify-end mt-6">
            <AlertDialogCancel disabled={loadingCandidates}>
              Close
            </AlertDialogCancel>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Applicant Review Dialog */}
      {selectedJobForReview && (
        <AlertDialog open={showApplicantReview} onOpenChange={(open) => !open && setShowApplicantReview(false)}>
          <AlertDialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <AlertDialogHeader>
              <AlertDialogTitle>Review Applicants for {selectedJobForReview.title}</AlertDialogTitle>
              <AlertDialogDescription>
                Review and manage applications for this position. Short-list qualified candidates and generate reports for employers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            
            <div className="mt-4">
              <ApplicantReview
                jobId={selectedJobForReview.id}
                jobTitle={selectedJobForReview.title}
                jobCategory={selectedJobForReview.job_type}
                isOpen={showApplicantReview}
                onClose={() => setShowApplicantReview(false)}
              />
            </div>
            
            <div className="flex justify-end mt-6">
              <AlertDialogCancel>
                Close
              </AlertDialogCancel>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  )
}
