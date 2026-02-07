"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { 
  User, 
  Mail, 
  Phone, 
  BookOpen, 
  Briefcase, 
  Download, 
  CheckCircle, 
  XCircle,
  Star,
  MessageSquare,
  FileText
} from "lucide-react"
import jsPDF from 'jspdf'

interface CVProfile {
  id: string
  full_name: string
  email: string
  phone?: string
  field_of_study: string
  experience?: string
  skills: string
  education?: string
  portfolio_url?: string
  linkedin_url?: string
  github_url?: string
  additional_info?: string
  is_shortlisted: boolean
  created_at: string
  job_applications?: Array<{
    status: string
    match_score: number
    application_date: string
  }>
}

interface ApplicantReviewProps {
  jobId: string
  jobTitle: string
  jobCategory?: string
  isOpen: boolean
  onClose: () => void
}

export function ApplicantReview({ jobId, jobTitle, jobCategory, isOpen, onClose }: ApplicantReviewProps) {
  const [applicants, setApplicants] = useState<CVProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedApplicants, setSelectedApplicants] = useState<string[]>([])
  const [processing, setProcessing] = useState<string | null>(null)
  const [showReportDialog, setShowReportDialog] = useState(false)
  const [generatingReport, setGeneratingReport] = useState(false)

  useEffect(() => {
    if (isOpen && jobId) {
      fetchApplicants()
    }
  }, [isOpen, jobId])

  const fetchApplicants = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/cv-profiles?jobId=${jobId}`)
      if (!response.ok) throw new Error('Failed to fetch applicants')
      
      const data = await response.json()
      setApplicants(data.cvProfiles || [])
    } catch (error) {
      console.error('Error fetching applicants:', error)
      setApplicants([])
    } finally {
      setLoading(false)
    }
  }

  const calculateMatchScore = (applicant: CVProfile): number => {
    let score = 0
    
    // Field of Study matching (40 points)
    if (jobCategory && applicant.field_of_study.toLowerCase().includes(jobCategory.toLowerCase())) {
      score += 40
    } else if (jobCategory && applicant.field_of_study.toLowerCase().includes(jobCategory.split(' ')[0].toLowerCase())) {
      score += 20
    }

    // Skills matching (30 points)
    const jobKeywords = jobCategory ? jobCategory.toLowerCase().split(' ') : []
    const applicantSkills = applicant.skills.toLowerCase().split(',').map(s => s.trim())
    
    const matchingSkills = applicantSkills.filter(skill => 
      jobKeywords.some(keyword => skill.includes(keyword))
    )
    score += Math.min(30, matchingSkills.length * 10)

    // Experience relevance (20 points)
    if (applicant.experience) {
      const experienceText = applicant.experience.toLowerCase()
      if (jobKeywords.some(keyword => experienceText.includes(keyword))) {
        score += 20
      }
    }

    // Education relevance (10 points)
    if (applicant.education) {
      const educationText = applicant.education.toLowerCase()
      if (jobKeywords.some(keyword => educationText.includes(keyword))) {
        score += 10
      }
    }

    return Math.min(100, score)
  }

  const handleShortlist = async (applicantId: string) => {
    setProcessing(applicantId)
    try {
      const response = await fetch(`/api/cv-profiles/${applicantId}/shortlist`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      })
      
      if (!response.ok) throw new Error('Failed to shortlist applicant')
      
      // Update local state
      setApplicants(prev => 
        prev.map(applicant => 
          applicant.id === applicantId 
            ? { ...applicant, is_shortlisted: true }
            : applicant
        )
      )

      // Send notification (in a real implementation, this would send SMS/WhatsApp)
      const applicant = applicants.find(a => a.id === applicantId)
      if (applicant) {
        console.log(`Notification sent to ${applicant.full_name}: Congratulations! You've been short-listed for ${jobTitle}. WhatsApp 0783074056 to confirm.`)
      }
    } catch (error) {
      console.error('Error shortlisting applicant:', error)
      alert('Failed to shortlist applicant. Please try again.')
    } finally {
      setProcessing(null)
    }
  }

  const handleReject = async (applicantId: string) => {
    setProcessing(applicantId)
    try {
      const response = await fetch(`/api/cv-profiles/${applicantId}/reject`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      })
      
      if (!response.ok) throw new Error('Failed to reject applicant')
      
      // Update local state
      setApplicants(prev => prev.filter(applicant => applicant.id !== applicantId))
    } catch (error) {
      console.error('Error rejecting applicant:', error)
      alert('Failed to reject applicant. Please try again.')
    } finally {
      setProcessing(null)
    }
  }

  const generateEmployerReport = async () => {
    setGeneratingReport(true)
    try {
      const selectedApplicantData = applicants.filter(a => selectedApplicants.includes(a.id))
      
      const doc = new jsPDF()
      
      // Add header
      doc.setFontSize(20)
      doc.text('Short-listed Candidates Report', 105, 20, { align: 'center' })
      
      doc.setFontSize(12)
      doc.text(`Job: ${jobTitle}`, 20, 35)
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 45)
      doc.text(`Total Candidates: ${selectedApplicantData.length}`, 20, 55)
      
      let yPosition = 75
      
      selectedApplicantData.forEach((applicant, index) => {
        if (yPosition > 250) {
          doc.addPage()
          yPosition = 20
        }
        
        doc.setFontSize(14)
        doc.text(`${index + 1}. ${applicant.full_name}`, 20, yPosition)
        yPosition += 10
        
        doc.setFontSize(10)
        doc.text(`Email: ${applicant.email}`, 25, yPosition)
        yPosition += 7
        doc.text(`Phone: ${applicant.phone || 'Not provided'}`, 25, yPosition)
        yPosition += 7
        doc.text(`Field of Study: ${applicant.field_of_study}`, 25, yPosition)
        yPosition += 7
        
        // Add skills (truncate if too long)
        const skillsText = applicant.skills.length > 80 
          ? applicant.skills.substring(0, 80) + '...' 
          : applicant.skills
        doc.text(`Skills: ${skillsText}`, 25, yPosition)
        yPosition += 15
      })
      
      // Add footer
      doc.setFontSize(10)
      doc.text('Contact RwandaJobHub: WhatsApp 0783074056', 105, 280, { align: 'center' })
      
      // Save the PDF
      doc.save(`${jobTitle.replace(/\s+/g, '_')}_Shortlist_Report.pdf`)
      
      setShowReportDialog(false)
      setSelectedApplicants([])
    } catch (error) {
      console.error('Error generating report:', error)
      alert('Failed to generate report. Please try again.')
    } finally {
      setGeneratingReport(false)
    }
  }

  const getMatchScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800'
    if (score >= 60) return 'bg-yellow-100 text-yellow-800'
    return 'bg-gray-100 text-gray-800'
  }

  const getMatchScoreIcon = (score: number) => {
    if (score >= 80) return <Star className="h-3 w-3 text-green-600" />
    if (score >= 60) return <Star className="h-3 w-3 text-yellow-600" />
    return <Star className="h-3 w-3 text-gray-400" />
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
        <span className="ml-3">Loading applicants...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Applicants for {jobTitle}</h3>
          <p className="text-sm text-gray-600">{applicants.length} total applicants</p>
        </div>
        <div className="flex gap-2">
          {selectedApplicants.length > 0 && (
            <Button
              variant="outline"
              onClick={() => setShowReportDialog(true)}
              className="gap-2"
            >
              <FileText className="h-4 w-4" />
              Generate Report ({selectedApplicants.length})
            </Button>
          )}
        </div>
      </div>

      {applicants.length === 0 ? (
        <div className="text-center py-12">
          <User className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Applicants Yet</h3>
          <p className="text-gray-600">Candidates will appear here once they start applying.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {applicants.map((applicant) => {
            const matchScore = calculateMatchScore(applicant)
            const isSelected = selectedApplicants.includes(applicant.id)
            
            return (
              <Card key={applicant.id} className={`transition-all ${isSelected ? 'ring-2 ring-blue-500' : ''}`}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedApplicants(prev => [...prev, applicant.id])
                        } else {
                          setSelectedApplicants(prev => prev.filter(id => id !== applicant.id))
                        }
                      }}
                      className="mt-1"
                    />
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-lg font-semibold">{applicant.full_name}</h4>
                            <Badge className={getMatchScoreColor(matchScore)}>
                              {getMatchScoreIcon(matchScore)}
                              {matchScore}% Match
                            </Badge>
                            {applicant.is_shortlisted && (
                              <Badge className="bg-green-100 text-green-800">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Short-listed
                              </Badge>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-gray-400" />
                              <span>{applicant.email}</span>
                            </div>
                            {applicant.phone && (
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-gray-400" />
                                <span>{applicant.phone}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-2">
                              <BookOpen className="h-4 w-4 text-gray-400" />
                              <span>{applicant.field_of_study}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(`mailto:${applicant.email}`, '_blank')}
                          >
                            <Mail className="h-4 w-4 mr-1" />
                            Contact
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => window.open(`https://wa.me/0783074056?text=Hi RwandaJobHub, I'm interested in ${applicant.full_name} for the ${jobTitle} position.`, '_blank')}
                            className="gap-1"
                          >
                            <MessageSquare className="h-4 w-4" />
                            WhatsApp
                          </Button>
                        </div>
                      </div>
                      
                      {applicant.skills && (
                        <div className="mb-3">
                          <h5 className="font-medium text-sm mb-2">Skills:</h5>
                          <div className="flex flex-wrap gap-2">
                            {applicant.skills.split(',').slice(0, 5).map((skill, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {skill.trim()}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {applicant.experience && (
                        <div className="mb-3">
                          <h5 className="font-medium text-sm mb-2">Experience:</h5>
                          <p className="text-sm text-gray-600 line-clamp-2">{applicant.experience}</p>
                        </div>
                      )}
                      
                      <div className="flex justify-end gap-2 pt-3 border-t">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReject(applicant.id)}
                          disabled={processing === applicant.id || applicant.is_shortlisted}
                          className="text-red-600 hover:text-red-700"
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleShortlist(applicant.id)}
                          disabled={processing === applicant.id || applicant.is_shortlisted}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          {processing === applicant.id ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-1" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Short-list
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Generate Report Dialog */}
      <AlertDialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Generate Employer Report</AlertDialogTitle>
            <AlertDialogDescription>
              Generate a PDF report containing the short-listed candidates for {jobTitle}. 
              This report will include candidate names, contact information, and skills.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-end gap-3">
            <AlertDialogCancel disabled={generatingReport}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={generateEmployerReport}
              disabled={generatingReport || selectedApplicants.length === 0}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {generatingReport ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Generate Report
                </>
              )}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
