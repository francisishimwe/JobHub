'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Briefcase, 
  FileText, 
  Users, 
  Calendar, 
  Lock, 
  CreditCard, 
  BarChart3, 
  Building, 
  Shield, 
  Plus,
  Eye,
  Download,
  Star,
  Clock,
  MapPin,
  TrendingUp,
  Settings,
  LogOut,
  UserPlus,
  Bell,
  Search,
  Filter
} from 'lucide-react'

export default function EmployerDashboard() {
  const { user, isAuthenticated, logout } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('jobs')
  const [jobs, setJobs] = useState([])
  const [candidates, setCandidates] = useState([])
  const [billing, setBilling] = useState([])
  const [analytics, setAnalytics] = useState({})
  const [companyProfile, setCompanyProfile] = useState({})
  const [teamMembers, setTeamMembers] = useState([])

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/dashboard')
      return
    }

    // Load employer data
    const savedEmployerData = localStorage.getItem('employerData')
    if (savedEmployerData) {
      const employer = JSON.parse(savedEmployerData)
      setCompanyProfile({
        name: employer.company || '',
        email: employer.email || '',
        logo: '/api/placeholder-logo',
        banner: '/api/placeholder-banner'
      })
    }

    // Load mock data for demonstration
    loadMockData()
  }, [isAuthenticated, router])

  const loadMockData = () => {
    // Mock job postings
    setJobs([
      {
        id: 1,
        title: 'Assistant Tea Maker',
        department: 'Production',
        location: 'Kigali',
        postedDate: '2024-03-01',
        expiryDate: '2024-03-31',
        views: 245,
        applicants: 18,
        status: 'active',
        planType: 'featured'
      },
      {
        id: 2,
        title: 'Senior Accountant',
        department: 'Finance',
        location: 'Kigali',
        postedDate: '2024-03-05',
        expiryDate: '2024-04-05',
        views: 189,
        applicants: 12,
        status: 'active',
        planType: 'featured-plus'
      },
      {
        id: 3,
        title: 'Marketing Manager',
        department: 'Marketing',
        location: 'Kigali',
        postedDate: '2024-03-10',
        expiryDate: '2024-04-10',
        views: 156,
        applicants: 8,
        status: 'active',
        planType: 'super-featured'
      }
    ])

    // Mock candidates
    setCandidates([
      {
        id: 1,
        name: 'Jean Mugisha',
        position: 'Assistant Tea Maker',
        score: 92,
        status: 'shortlisted',
        email: 'jean.m@email.com',
        phone: '+250788123456',
        experience: '3 years',
        education: 'Bachelor\'s Degree',
        appliedDate: '2024-03-02'
      },
      {
        id: 2,
        name: 'Grace Uwimana',
        position: 'Assistant Tea Maker',
        score: 88,
        status: 'interviewing',
        email: 'grace.u@email.com',
        phone: '+250787654321',
        experience: '2 years',
        education: 'Diploma',
        appliedDate: '2024-03-03'
      },
      {
        id: 3,
        name: 'Eric Niyonzima',
        position: 'Senior Accountant',
        score: 95,
        status: 'hired',
        email: 'eric.n@email.com',
        phone: '+250786543210',
        experience: '5 years',
        education: 'Master\'s Degree',
        appliedDate: '2024-03-06'
      }
    ])

    // Mock billing history
    setBilling([
      {
        id: 1,
        plan: 'Featured',
        amount: '50,000 RWF',
        date: '2024-03-01',
        status: 'paid',
        autoRenew: true,
        invoice: 'INV-2024-001'
      },
      {
        id: 2,
        plan: 'Featured+',
        amount: '75,000 RWF',
        date: '2024-02-01',
        status: 'paid',
        autoRenew: false,
        invoice: 'INV-2024-002'
      }
    ])

    // Mock analytics
    setAnalytics({
      totalViews: 590,
      totalClicks: 89,
      totalApplications: 38,
      conversionRate: 6.4,
      topLocations: [
        { city: 'Kigali', count: 28 },
        { city: 'Musanze', count: 6 },
        { city: 'Rubavu', count: 4 }
      ],
      jobPerformance: [
        { job: 'Assistant Tea Maker', views: 245, applications: 18 },
        { job: 'Senior Accountant', views: 189, applications: 12 },
        { job: 'Marketing Manager', views: 156, applications: 8 }
      ]
    })

    // Mock team members
    setTeamMembers([
      {
        id: 1,
        name: 'Sarah Mukamana',
        email: 'sarah@company.com',
        role: 'HR Manager',
        permissions: ['view_applications', 'schedule_interviews'],
        lastActive: '2024-03-15 14:30'
      },
      {
        id: 2,
        name: 'Paul Niyonzima',
        email: 'paul@company.com',
        role: 'Recruiter',
        permissions: ['view_applications'],
        lastActive: '2024-03-15 11:20'
      }
    ])
  }

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const calculateDaysRemaining = (expiryDate) => {
    const today = new Date()
    const expiry = new Date(expiryDate)
    const diffTime = expiry.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 0
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'shortlisted': return 'bg-blue-100 text-blue-800'
      case 'interviewing': return 'bg-yellow-100 text-yellow-800'
      case 'hired': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 80) return 'text-blue-600'
    if (score >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  if (!isAuthenticated) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex">
        {/* Sidebar Navigation */}
        <div className="w-64 bg-white shadow-lg min-h-screen">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-8">
              <Building className="h-8 w-8 text-blue-600" />
              <div>
                <h2 className="font-bold text-lg">Employer Portal</h2>
                <p className="text-xs text-gray-500">{companyProfile.name || 'Company Name'}</p>
              </div>
            </div>

            <nav className="space-y-2">
              <Button
                variant={activeTab === 'jobs' ? 'default' : 'ghost'}
                className="w-full justify-start gap-3"
                onClick={() => setActiveTab('jobs')}
              >
                <Briefcase className="h-4 w-4" />
                Job Management
              </Button>
              
              <Button
                variant={activeTab === 'candidates' ? 'default' : 'ghost'}
                className="w-full justify-start gap-3"
                onClick={() => setActiveTab('candidates')}
              >
                <Users className="h-4 w-4" />
                Candidate Pipeline
              </Button>
              
              <Button
                variant={activeTab === 'interviews' ? 'default' : 'ghost'}
                className="w-full justify-start gap-3"
                onClick={() => setActiveTab('interviews')}
              >
                <Calendar className="h-4 w-4" />
                Interview Scheduler
              </Button>
              
              <Button
                variant={activeTab === 'billing' ? 'default' : 'ghost'}
                className="w-full justify-start gap-3"
                onClick={() => setActiveTab('billing')}
              >
                <CreditCard className="h-4 w-4" />
                Billing & Plans
              </Button>
              
              <Button
                variant={activeTab === 'analytics' ? 'default' : 'ghost'}
                className="w-full justify-start gap-3"
                onClick={() => setActiveTab('analytics')}
              >
                <BarChart3 className="h-4 w-4" />
                Analytics
              </Button>
              
              <Button
                variant={activeTab === 'branding' ? 'default' : 'ghost'}
                className="w-full justify-start gap-3"
                onClick={() => setActiveTab('branding')}
              >
                <Shield className="h-4 w-4" />
                Brand Profile
              </Button>
              
              <Button
                variant={activeTab === 'team' ? 'default' : 'ghost'}
                className="w-full justify-start gap-3"
                onClick={() => setActiveTab('team')}
              >
                <UserPlus className="h-4 w-4" />
                Team Permissions
              </Button>
            </nav>

            <div className="mt-8 pt-8 border-t">
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-red-600"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              {activeTab === 'jobs' && 'Job Management'}
              {activeTab === 'candidates' && 'Candidate Pipeline'}
              {activeTab === 'interviews' && 'Interview Scheduler'}
              {activeTab === 'billing' && 'Billing & Plans'}
              {activeTab === 'analytics' && 'Analytics Dashboard'}
              {activeTab === 'branding' && 'Brand Profile'}
              {activeTab === 'team' && 'Team Permissions'}
            </h1>
            <p className="text-gray-600">
              {activeTab === 'jobs' && 'Manage your active job postings and track performance'}
              {activeTab === 'candidates' && 'Review and manage your applicant pipeline'}
              {activeTab === 'interviews' && 'Schedule and manage candidate interviews'}
              {activeTab === 'billing' && 'View billing history and manage your subscription'}
              {activeTab === 'analytics' && 'Track job performance and applicant insights'}
              {activeTab === 'branding' && 'Customize your company profile and branding'}
              {activeTab === 'team' && 'Manage team member access and permissions'}
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            {/* Job Management Tab */}
            <TabsContent value="jobs" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Live Job Tracker</h2>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Post New Job
                </Button>
              </div>

              <div className="grid gap-4">
                {jobs.map(job => (
                  <Card key={job.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                          <p className="text-gray-600">{job.department} • {job.location}</p>
                        </div>
                        <Badge className={
                          job.planType === 'super-featured' ? 'bg-orange-100 text-orange-800' :
                          job.planType === 'featured-plus' ? 'bg-purple-100 text-purple-800' :
                          'bg-blue-100 text-blue-800'
                        }>
                          {job.planType.replace('-', ' ').toUpperCase()}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="flex items-center gap-2">
                          <Eye className="h-4 w-4 text-gray-500" />
                          <div>
                            <p className="text-sm text-gray-500">Views</p>
                            <p className="font-semibold">{job.views}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-gray-500" />
                          <div>
                            <p className="text-sm text-gray-500">Applicants</p>
                            <p className="font-semibold">{job.applicants}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <div>
                            <p className="text-sm text-gray-500">Days Left</p>
                            <p className="font-semibold text-orange-600">{calculateDaysRemaining(job.expiryDate)}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-gray-500" />
                          <div>
                            <p className="text-sm text-gray-500">Conversion</p>
                            <p className="font-semibold">{((job.applicants / job.views) * 100).toFixed(1)}%</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <Button variant="outline" size="sm">View Details</Button>
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="outline" size="sm">Pause</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Tender Portal Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Tender Portal
                  </CardTitle>
                  <CardDescription>Manage tender documents and track downloads</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No active tenders at the moment</p>
                    <Button className="mt-4">Create New Tender</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Candidate Pipeline Tab */}
            <TabsContent value="candidates" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Applicant Scoring</h2>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Filter className="h-4 w-4" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Search className="h-4 w-4" />
                    Search
                  </Button>
                </div>
              </div>

              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="text-left p-4 font-medium">Candidate</th>
                          <th className="text-left p-4 font-medium">Position</th>
                          <th className="text-left p-4 font-medium">Match Score</th>
                          <th className="text-left p-4 font-medium">Experience</th>
                          <th className="text-left p-4 font-medium">Applied</th>
                          <th className="text-left p-4 font-medium">Status</th>
                          <th className="text-left p-4 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {candidates.map(candidate => (
                          <tr key={candidate.id} className="border-b hover:bg-gray-50">
                            <td className="p-4">
                              <div>
                                <p className="font-medium">{candidate.name}</p>
                                <p className="text-sm text-gray-500">
                                  {candidate.status === 'shortlisted' ? 'Contact visible' : 
                                   <span className="flex items-center gap-1 text-orange-600">
                                     <Lock className="h-3 w-3" /> Contact locked
                                   </span>}
                                </p>
                              </div>
                            </td>
                            <td className="p-4">{candidate.position}</td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <span className={`font-bold ${getScoreColor(candidate.score)}`}>
                                  {candidate.score}%
                                </span>
                                <Progress value={candidate.score} className="w-16" />
                              </div>
                            </td>
                            <td className="p-4">{candidate.experience}</td>
                            <td className="p-4">{candidate.appliedDate}</td>
                            <td className="p-4">
                              <Badge className={getStatusColor(candidate.status)}>
                                {candidate.status}
                              </Badge>
                            </td>
                            <td className="p-4">
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm">View CV</Button>
                                {candidate.status === 'shortlisted' && (
                                  <Button variant="outline" size="sm">Contact</Button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Interview Scheduler Tab */}
            <TabsContent value="interviews" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Interview Scheduler</h2>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Schedule Interview
                </Button>
              </div>

              <Card>
                <CardContent className="py-8">
                  <div className="text-center text-gray-500">
                    <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No interviews scheduled</p>
                    <p className="text-sm">Schedule interviews with shortlisted candidates</p>
                    <Button className="mt-4">Schedule First Interview</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Billing & Plans Tab */}
            <TabsContent value="billing" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Current Plan</CardTitle>
                    <CardDescription>Your active subscription</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold">Featured+</span>
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>75,000 RWF / month</p>
                        <p>Renews: April 1, 2024</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Auto-renew</span>
                        <Button variant="outline" size="sm">Disable</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Usage Stats</CardTitle>
                    <CardDescription>This month's activity</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>Job Credits</span>
                        <span className="font-semibold">3 / 10</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Featured Listings</span>
                        <span className="font-semibold">2 / 5</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Profile Views</span>
                        <span className="font-semibold">1,245</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Billing History</CardTitle>
                  <CardDescription>Previous payments and receipts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {billing.map(payment => (
                      <div key={payment.id} className="flex justify-between items-center p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">{payment.plan} Plan</p>
                          <p className="text-sm text-gray-500">{payment.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{payment.amount}</p>
                          <p className="text-sm text-gray-500">{payment.invoice}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2">
                      <Eye className="h-8 w-8 text-blue-600" />
                      <div>
                        <p className="text-2xl font-bold">{analytics.totalViews}</p>
                        <p className="text-sm text-gray-500">Total Views</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2">
                      <Users className="h-8 w-8 text-green-600" />
                      <div>
                        <p className="text-2xl font-bold">{analytics.totalApplications}</p>
                        <p className="text-sm text-gray-500">Applications</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-8 w-8 text-purple-600" />
                      <div>
                        <p className="text-2xl font-bold">{analytics.conversionRate}%</p>
                        <p className="text-sm text-gray-500">Conversion Rate</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-8 w-8 text-orange-600" />
                      <div>
                        <p className="text-2xl font-bold">{analytics.topLocations?.length || 0}</p>
                        <p className="text-sm text-gray-500">Locations</p>
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
                      {analytics.jobPerformance?.map((job, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">{job.job}</span>
                            <span className="text-sm text-gray-500">{job.applications} apps</span>
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
                    <CardTitle>Top Locations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analytics.topLocations?.map((location, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            <span>{location.city}</span>
                          </div>
                          <Badge variant="outline">{location.count} applicants</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Brand Profile Tab */}
            <TabsContent value="branding" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Company Logo</CardTitle>
                    <CardDescription>Upload your company logo</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Building className="h-8 w-8 text-gray-400" />
                      </div>
                      <Button variant="outline">Upload New Logo</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Company Banner</CardTitle>
                    <CardDescription>Add a banner for your profile</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Shield className="h-12 w-12 text-gray-400" />
                      </div>
                      <Button variant="outline">Upload New Banner</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Company Information</CardTitle>
                  <CardDescription>Update your company details</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Company Name</label>
                      <input 
                        type="text" 
                        className="w-full p-2 border rounded-lg"
                        value={companyProfile.name || ''}
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <input 
                        type="email" 
                        className="w-full p-2 border rounded-lg"
                        value={companyProfile.email || ''}
                        readOnly
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Team Permissions Tab */}
            <TabsContent value="team" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Team Members</h2>
                <Button className="gap-2">
                  <UserPlus className="h-4 w-4" />
                  Add Team Member
                </Button>
              </div>

              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="text-left p-4 font-medium">Name</th>
                          <th className="text-left p-4 font-medium">Email</th>
                          <th className="text-left p-4 font-medium">Role</th>
                          <th className="text-left p-4 font-medium">Permissions</th>
                          <th className="text-left p-4 font-medium">Last Active</th>
                          <th className="text-left p-4 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {teamMembers.map(member => (
                          <tr key={member.id} className="border-b hover:bg-gray-50">
                            <td className="p-4 font-medium">{member.name}</td>
                            <td className="p-4">{member.email}</td>
                            <td className="p-4">{member.role}</td>
                            <td className="p-4">
                              <div className="flex gap-1">
                                {member.permissions.map((perm, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {perm.replace('_', ' ')}
                                  </Badge>
                                ))}
                              </div>
                            </td>
                            <td className="p-4 text-sm text-gray-500">{member.lastActive}</td>
                            <td className="p-4">
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm">Edit</Button>
                                <Button variant="outline" size="sm" className="text-red-600">Remove</Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
    </div>
  )
}
