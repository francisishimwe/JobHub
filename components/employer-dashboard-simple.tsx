"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Briefcase, 
  Users, 
  BarChart3, 
  Eye, 
  TrendingUp, 
  MapPin, 
  Plus,
  Edit,
  Trash2,
  LogOut,
  Building,
  Calendar,
  Clock,
  FileText,
  UserCheck,
  Search
} from "lucide-react"
import { EmployerEditJobDialog } from "@/components/employer-edit-job-dialog"
import { mapDatabaseJobToUIJob } from "@/lib/utils"
import type { Job } from "@/lib/types"

interface EmployerData {
  companyName: string
  email: string
  plan: any
  status: string
  createdAt: string
}

interface Applicant {
  id: string
  application_id?: string
  full_name?: string
  name?: string
  email: string
  phone: string
  job_title?: string
  position?: string
  application_date?: string
  appliedDate?: string
  application_status?: string
  status?: string
  match_score?: number
  score?: number
  experience?: string
  education?: string
  field_of_study?: string
  skills?: string
  portfolio_url?: string
  linkedin_url?: string
  github_url?: string
  additional_info?: string
}

export function EmployerDashboardSimple({ employerData }: { employerData: EmployerData }) {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("jobs")
  const [jobs, setJobs] = useState<Job[]>([])
  const [applicants, setApplicants] = useState<Applicant[]>([])
  const [analytics, setAnalytics] = useState<any>({})
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)

  useEffect(() => {
    if (employerData?.email) {
      loadRealData()
    }
  }, [employerData])

  const loadRealData = async () => {
    try {
      console.log('🔄 Loading real employer data for:', employerData.email)
      
      // Load all data in parallel for better performance
      const [jobsResponse, applicantsResponse, analyticsResponse] = await Promise.all([
        fetch(`/api/employer/jobs?email=${encodeURIComponent(employerData.email)}`),
        fetch(`/api/employer/applicants?email=${encodeURIComponent(employerData.email)}`),
        fetch(`/api/employer/analytics?email=${encodeURIComponent(employerData.email)}`)
      ])
      
      // Process jobs data
      if (jobsResponse.ok) {
        const jobsData = await jobsResponse.json()
        console.log('✓ Loaded jobs:', jobsData.jobs?.length || 0)
        console.log('🔍 Sample job data from API:', jobsData.jobs?.[0])
        // Map database jobs to UI format
        const mappedJobs = (jobsData.jobs || []).map((job: any) => {
          console.log('🔍 Mapping job:', { id: job.id, company_logo: job.company_logo, company_name: job.company_name })
          const mapped = mapDatabaseJobToUIJob(job)
          console.log('🔍 Mapped job:', { id: mapped.id, companyLogo: mapped.companyLogo, companyName: mapped.companyName })
          return mapped
        })
        setJobs(mappedJobs)
      }

      // Process applicants data
      if (applicantsResponse.ok) {
        const applicantsData = await applicantsResponse.json()
        console.log('✓ Loaded applicants:', applicantsData.applicants?.length || 0)
        setApplicants(applicantsData.applicants || [])
      }

      // Process analytics data
      if (analyticsResponse.ok) {
        const analyticsData = await analyticsResponse.json()
        console.log('✓ Loaded analytics:', analyticsData.analytics)
        setAnalytics(analyticsData.analytics || {})
      }

    } catch (error) {
      console.error('❌ Error loading real data:', error)
      // Fallback to mock data if API fails
      loadMockData()
    }
  }

  const loadMockData = () => {
    console.log('🔄 Loading mock data as fallback')
    // Mock jobs data
    setJobs([
      {
        id: "1",
        title: "Senior Software Engineer",
        location: "Kigali, Rwanda",
        postedDate: new Date("2024-03-01"),
        deadline: "2024-03-31",
        applicants: 18,
        status: "active",
        companyLogo: "/placeholder.svg",
        companyName: "Tech Company"
      },
      {
        id: "2", 
        title: "Marketing Manager",
        location: "Kigali, Rwanda",
        postedDate: new Date("2024-03-05"),
        deadline: "2024-04-05",
        applicants: 12,
        status: "active",
        companyLogo: "/placeholder.svg",
        companyName: "Marketing Co"
      }
    ])

    // Mock applicants data
    setApplicants([
      {
        id: "1",
        name: "Jean Mugisha",
        email: "jean.m@email.com",
        phone: "+250788123456",
        position: "Senior Software Engineer",
        appliedDate: "2024-03-02",
        status: "shortlisted",
        score: 92,
        experience: "3 years",
        education: "Bachelor's Degree"
      },
      {
        id: "2",
        name: "Grace Uwimana", 
        email: "grace.u@email.com",
        phone: "+250787654321",
        position: "Senior Software Engineer",
        appliedDate: "2024-03-03",
        status: "interviewing",
        score: 88,
        experience: "2 years",
        education: "Diploma"
      }
    ])

    // Mock analytics data
    setAnalytics({
      totalJobs: 2,
      totalApplications: 30,
      totalViews: 434,
      avgViewsPerJob: 217,
      shortlistedApplications: 8,
      hiredApplications: 2,
      conversionRate: 6.9,
      jobPerformance: [
        { jobTitle: "Senior Software Engineer", views: 245, applicants: 18, shortlisted: 5, hired: 1 },
        { jobTitle: "Marketing Manager", views: 189, applicants: 12, shortlisted: 3, hired: 1 }
      ],
      applicationTrends: [
        { month: "2024-03", applications: 15, jobsWithApplications: 2 },
        { month: "2024-02", applications: 8, jobsWithApplications: 1 }
      ],
      topLocations: [
        { name: "Kigali", count: 25 },
        { name: "Musanze", count: 3 },
        { name: "Rubavu", count: 2 }
      ],
      statusDistribution: [
        { status: "applied", count: 15, percentage: 50 },
        { status: "shortlisted", count: 8, percentage: 26.7 },
        { status: "interviewing", count: 5, percentage: 16.7 },
        { status: "hired", count: 2, percentage: 6.6 }
      ]
    })
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const calculateDaysRemaining = (expiryDate: string) => {
    const today = new Date()
    const expiry = new Date(expiryDate)
    const diffTime = expiry.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 0
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "shortlisted": return "bg-blue-100 text-blue-800"
      case "interviewing": return "bg-yellow-100 text-yellow-800"
      case "hired": return "bg-green-100 text-green-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 80) return "text-blue-600"
    if (score >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  const handleAddJob = () => {
    // Store employer data in localStorage for the add job form
    if (typeof window !== 'undefined' && employerData) {
      localStorage.setItem('currentEmployerData', JSON.stringify(employerData))
    }
    router.push("/employer-dashboard/add-job")
  }

  const handleEditJob = (job: Job) => {
    setSelectedJob(job)
    setEditDialogOpen(true)
  }

  const handleEditSuccess = () => {
    loadRealData()
  }

  const handleDeleteJob = async (jobId: string) => {
    if (confirm("Are you sure you want to delete this job posting?")) {
      try {
        const response = await fetch(`/api/employer/jobs?jobId=${jobId}&email=${encodeURIComponent(employerData.email)}`, {
          method: 'DELETE'
        })

        if (response.ok) {
          const result = await response.json()
          console.log('✓ Job deleted:', result)
          // Refresh jobs data
          loadRealData()
          alert("Job deleted successfully!")
        } else {
          alert("Failed to delete job")
        }
      } catch (error) {
        console.error('❌ Error deleting job:', error)
        alert("Error deleting job")
      }
    }
  }

  const handleUpdateApplicationStatus = async (applicationId: string, newStatus: string) => {
    try {
      const response = await fetch('/api/employer/applicants', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId,
          status: newStatus,
          employerEmail: employerData.email
        })
      })

      if (response.ok) {
        const result = await response.json()
        console.log('✓ Application status updated:', result)
        // Refresh applicants data
        loadRealData()
      } else {
        alert("Failed to update application status")
      }
    } catch (error) {
      console.error('❌ Error updating application status:', error)
      alert("Error updating application status")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Building className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Employer Dashboard</h1>
                <p className="text-sm text-gray-500">{employerData.companyName}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{employerData.email}</p>
                <p className="text-xs text-gray-500">Plan: {employerData.plan?.name || 'Basic'}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <TabsList>
              <TabsTrigger value="jobs" className="gap-2">
                <Briefcase className="h-4 w-4" />
                Jobs
              </TabsTrigger>
              <TabsTrigger value="analytics" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                Analytics
              </TabsTrigger>
            </TabsList>

            {activeTab === "jobs" && (
              <Button
                onClick={handleAddJob}
                className="gap-2 bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
                Add New Job
              </Button>
            )}
          </div>

          {/* Jobs Tab */}
          <TabsContent value="jobs" className="space-y-6">
            <div className="grid gap-4">
              {jobs.map(job => {
                console.log('🎨 Rendering job:', { 
                  id: job.id, 
                  title: job.title,
                  companyLogo: job.companyLogo,
                  companyName: job.companyName,
                  hasLogo: !!job.companyLogo
                })
                return (
                <Card key={job.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-start gap-3">
                        {job.companyLogo && (
                          <img 
                            src={job.companyLogo} 
                            alt={job.companyName || 'Company'}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        )}
                        {!job.companyLogo && (
                          <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                            No Logo
                          </div>
                        )}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                          <p className="text-gray-600 flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {job.location}
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        {job.status ? job.status.charAt(0).toUpperCase() + job.status.slice(1) : 'Active'}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500">Location</p>
                          <p className="font-semibold">{job.location}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500">Expires</p>
                          <p className="font-semibold text-orange-600">{job.deadline || 'No deadline'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditJob(job)}>
                        <Edit className="h-4 w-4 mr-1" />
                        Update
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDeleteJob(job.id)} className="text-red-600 border-red-200 hover:bg-red-50">
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                )
              })}
            </div>

            {/* Applicants Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Recent Applicants
                </CardTitle>
                <CardDescription>
                  Track candidates who have applied to your job postings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {applicants.map(applicant => (
                    <div key={applicant.application_id || applicant.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-semibold">
                              {applicant.full_name?.split(' ').map((n: string) => n[0]).join('') || applicant.name?.split(' ').map((n: string) => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">{applicant.full_name || applicant.name}</p>
                            <p className="text-sm text-gray-600">{applicant.job_title || applicant.position}</p>
                          </div>
                          <Badge className={getStatusColor(applicant.application_status || applicant.status || 'applied')}>
                            {applicant.application_status || applicant.status || 'applied'}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Score:</span>
                            <span className={`ml-1 font-bold ${getScoreColor(applicant.match_score || applicant.score || 0)}`}>
                              {applicant.match_score || applicant.score || 0}%
                            </span>
                          </div>
                          <div>
                            <span className="font-medium">Email:</span>
                            <span className="ml-1">{applicant.email}</span>
                          </div>
                          <div>
                            <span className="font-medium">Phone:</span>
                            <span className="ml-1">{applicant.phone || 'N/A'}</span>
                          </div>
                          <div>
                            <span className="font-medium">Applied:</span>
                            <span className="ml-1">{applicant.application_date || applicant.appliedDate ? new Date(applicant.application_date || applicant.appliedDate || '').toLocaleDateString() : 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 ml-4">
                        <Button variant="outline" size="sm">
                          View Profile
                        </Button>
                        <select 
                          className="px-2 py-1 text-sm border rounded"
                          value={applicant.application_status || applicant.status}
                          onChange={(e) => handleUpdateApplicationStatus(applicant.application_id || applicant.id, e.target.value)}
                        >
                          <option value="applied">Applied</option>
                          <option value="shortlisted">Shortlist</option>
                          <option value="interviewing">Interview</option>
                          <option value="hired">Hire</option>
                          <option value="rejected">Reject</option>
                        </select>
                        {(applicant.application_status === "shortlisted" || applicant.status === "shortlisted") && (
                          <Button variant="outline" size="sm">
                            Contact
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <Briefcase className="h-8 w-8 text-blue-600" />
                    <div>
                      <p className="text-2xl font-bold">{analytics.totalJobs || 0}</p>
                      <p className="text-sm text-gray-500">Total Jobs</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <Users className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="text-2xl font-bold">{analytics.totalApplications || 0}</p>
                      <p className="text-sm text-gray-500">Applications</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <Eye className="h-8 w-8 text-purple-600" />
                    <div>
                      <p className="text-2xl font-bold">{analytics.totalViews || 0}</p>
                      <p className="text-sm text-gray-500">Total Views</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-8 w-8 text-orange-600" />
                    <div>
                      <p className="text-2xl font-bold">{analytics.conversionRate || 0}%</p>
                      <p className="text-sm text-gray-500">Conversion Rate</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Job Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.jobPerformance?.map((job: any, index: number) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">{job.jobTitle}</span>
                          <span className="text-sm text-gray-500">{job.applicants} apps</span>
                        </div>
                        <div className="flex gap-2">
                          <div className="flex-1">
                            <p className="text-xs text-gray-500">Views: {job.views}</p>
                            <Progress value={(job.views / 300) * 100} className="h-2" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Application Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.statusDistribution?.map((status: any, index: number) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-sm font-medium capitalize">{status.status}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">{status.count}</span>
                          <Badge variant="outline">{status.percentage}%</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Employer Edit Job Dialog */}
      {selectedJob && (
        <EmployerEditJobDialog
          job={selectedJob}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          onSuccess={handleEditSuccess}
          employerEmail={employerData.email}
        />
      )}
    </div>
  )
}
