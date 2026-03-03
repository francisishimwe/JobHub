'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useAuth } from "@/lib/auth-context"
import { Building, Users, Briefcase, TrendingUp, Star, Check, Eye, EyeOff, ChevronRight, Clock, FileText, UserCircle2, LogOut, ArrowRight, Zap, Shield, Crown, Target, PlusCircle, Settings, MapPin, Calendar, Edit, RefreshCw } from "lucide-react"

const plans = [
  {
    id: 'featured',
    name: 'Featured',
    price: '50,000 RWF',
    description: 'Perfect for getting started',
    icon: Star,
    color: 'from-blue-500 to-blue-600',
    features: [
      '30-day job posting',
      'Basic applicant tracking',
      'Email support',
      'Company profile',
      'Job visibility boost'
    ],
    popular: false
  },
  {
    id: 'featured-plus',
    name: 'Featured+',
    price: '75,000 RWF',
    description: 'Enhanced visibility',
    icon: TrendingUp,
    color: 'from-purple-500 to-purple-600',
    features: [
      '45-day job posting',
      'Advanced applicant tracking',
      'Priority email support',
      'Enhanced company profile',
      'Premium job visibility'
    ],
    popular: true
  },
  {
    id: 'super-featured',
    name: 'Super Featured',
    price: '100,000 RWF',
    description: 'Maximum exposure',
    icon: Crown,
    color: 'from-orange-500 to-orange-600',
    features: [
      '60-day job posting',
      'Complete applicant management',
      '24/7 phone support',
      'Premium company profile',
      'Maximum job visibility'
    ],
    popular: false
  },
  {
    id: 'short-listing',
    name: 'Short-listing',
    price: '150,000 RWF',
    description: 'Complete recruitment solution',
    icon: Target,
    color: 'from-green-500 to-green-600',
    features: [
      '90-day job posting',
      'AI-powered applicant matching',
      'Dedicated account manager',
      'VIP company profile',
      'Exclusive short-listing feature'
    ],
    popular: false
  }
]

export default function EmployerHubPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [selectedPlan, setSelectedPlan] = useState<any>(null)
  const [showSignUp, setShowSignUp] = useState(false)
  const [chosenPlan, setChosenPlan] = useState<any>(null)
  const [showJobForm, setShowJobForm] = useState(false)
  const [showHub, setShowHub] = useState(false)
  const [activeTab, setActiveTab] = useState('compose')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    error: '',
    isLoading: false,
    showPassword: false,
    isSignUp: false,
    isReset: false,
    status: 'pending' // pending, approved, rejected
  })
  const [jobData, setJobData] = useState({
    title: '',
    companyName: '',
    logoUrl: '',
    department: '',
    location: '',
    description: '',
    requirements: '',
    experience: '',
    type: '',
    category: '',
    deadline: '',
    applicationLink: ''
  })
  const [applications, setApplications] = useState([
    {
      id: 1,
      name: "Jean Mugabo",
      email: "jean.mugabo@email.com",
      phone: "+250 788 123 456",
      position: "Senior Developer",
      applied: "2024-01-15",
      appliedDate: "2024-01-15",
      status: "active",
      score: 85,
      avatar: "JM",
      location: "Kigali, Rwanda"
    },
    {
      id: 2,
      name: "Grace Uwimana",
      email: "grace.uwimana@email.com",
      phone: "+250 787 987 654",
      position: "UX Designer",
      applied: "2024-01-14",
      appliedDate: "2024-01-14",
      status: "active",
      score: 92,
      avatar: "GU",
      location: "Kigali, Rwanda"
    },
    {
      id: 3,
      name: "Eric Niyonzima",
      email: "eric.niyonzima@email.com",
      phone: "+250 785 456 789",
      position: "Project Manager",
      applied: "2024-01-13",
      appliedDate: "2024-01-13",
      status: "pending",
      score: 78,
      avatar: "EN",
      location: "Kigali, Rwanda"
    }
  ])
  const [companyProfile] = useState({
    name: "Tech Solutions Rwanda",
    email: "contact@techsolutions.rw",
    phone: "+250 788 123 456",
    size: "50-100 employees",
    website: "www.techsolutions.rw"
  })

  useEffect(() => {
    // Check if user is logged in on app start
    const savedUser = localStorage.getItem("RwandaJobHub-auth-user")
    if (savedUser) {
      // Check if user has employer data and is approved
      const savedPlan = localStorage.getItem('selectedPlan')
      const savedPlanDetails = localStorage.getItem('planDetails')
      const employerData = JSON.parse(localStorage.getItem('employerData') || '{}')
      
      // If user is authenticated and approved, show dashboard
      if (employerData.status === 'approved' && savedPlan && savedPlanDetails) {
        setChosenPlan(JSON.parse(savedPlanDetails))
        setSelectedPlan(JSON.parse(savedPlanDetails))
        setShowHub(true)
      }
      // If user is authenticated but no plan selected, show plan selection
      else if (employerData.status === 'approved') {
        setShowHub(false)
      }
    }
  }, [])

  const loadMockApplications = () => {
    // Simulate loading applications
    setApplications([
      ...applications,
      {
        id: 4,
        name: "Alice Kaneza",
        email: "alice.kaneza@email.com",
        phone: "+250 788 123 456",
        position: "Marketing Manager",
        applied: "2024-01-16",
        appliedDate: "2024-01-16",
        status: "active",
        score: 88,
        avatar: "AK",
        location: "Kigali, Rwanda"
      }
    ])
  }

  const handleUploadBanner = () => {
    alert('Banner upload feature - would open file picker')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'shortlisted': return 'bg-blue-100 text-blue-800'
      case 'interviewing': return 'bg-yellow-100 text-yellow-800'
      case 'hired': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 80) return 'text-blue-600'
    if (score >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  const handleChoosePlan = (plan: any) => {
    console.log('Plan clicked:', plan)
    setChosenPlan(plan)
    setShowSignUp(true)
    console.log('showSignUp set to true')
  }

  const handleJobSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!jobData.title.trim()) {
      alert('Please enter job title')
      return
    }
    
    if (!jobData.companyName.trim()) {
      alert('Please enter company name')
      return
    }
    
    if (!jobData.description.trim()) {
      alert('Please enter job description')
      return
    }
    
    try {
      // Create job data for API
      const jobPayload = {
        title: jobData.title.trim(),
        company_name: jobData.companyName.trim(),
        logo_url: jobData.logoUrl || null,
        category: jobData.category || 'Other',
        location: jobData.location?.trim() || null,
        description: jobData.description?.trim() || '',
        job_type: jobData.type || 'Full-time',
        experience_level: jobData.experience || null,
        deadline: jobData.deadline || null,
        application_link: jobData.applicationLink?.trim() || '',
        status: 'active', // Jobs go live immediately for employers
        featured: false,
        plan_id: chosenPlan?.id || 'featured',
        opportunity_type: 'Job',
        application_method: 'link',
        userEmail: user?.email || null,
        postedDate: new Date().toISOString()
      }
      
      console.log('Submitting job:', jobPayload)
      
      // Submit to API
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobPayload)
      })
      
      if (response.ok) {
        const newJob = await response.json()
        console.log('Job posted successfully:', newJob)
        
        // Show success message
        alert('🎉 Job posted successfully! Your job is now live on the home page.')
        
        // Reset form
        setJobData({
          title: '',
          companyName: '',
          logoUrl: '',
          department: '',
          location: '',
          description: '',
          requirements: '',
          experience: '',
          type: '',
          category: '',
          deadline: '',
          applicationLink: ''
        })
        
        // Close form and go back to dashboard
        setShowJobForm(false)
        
        // Update applications list to show the new job
        setApplications([
          ...applications,
          {
            id: newJob.id || Date.now(),
            name: jobData.companyName,
            email: user?.email || 'employer@company.com',
            phone: '+250 788 123 456',
            position: jobData.title,
            applied: new Date().toISOString().split('T')[0],
            appliedDate: new Date().toISOString().split('T')[0],
            status: 'active',
            score: 95,
            avatar: jobData.companyName.substring(0, 2).toUpperCase(),
            location: jobData.location || 'Kigali, Rwanda'
          }
        ])
        
      } else {
        const error = await response.json()
        console.error('Failed to post job:', error)
        alert(`Failed to post job: ${error.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error posting job:', error)
      alert('Failed to post job. Please try again.')
    }
  }

  const handleJobDataChange = (field: string, value: string) => {
    setJobData({
      ...jobData,
      [field]: value
    })
  }

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('handleSignUp called - form submitted')
    console.log('Form data:', formData)
    
    // Prevent automatic submission if form is empty
    if (!formData.email && !formData.password) {
      console.log('Form is empty - preventing automatic submission')
      return
    }
    
    if (!formData.email || !formData.password) {
      alert('Please fill in email and password')
      return
    }
    
    if (formData.isSignUp && !formData.confirmPassword) {
      alert('Please confirm your password')
      return
    }
    
    if (formData.isSignUp && formData.password !== formData.confirmPassword) {
      alert('Passwords do not match')
      return
    }
    
    console.log('Form validation passed - proceeding to job form')
    
    // Store plan selection and proceed to job form
    localStorage.setItem('selectedPlan', chosenPlan?.id || '')
    localStorage.setItem('planDetails', JSON.stringify(chosenPlan))
    
    if (formData.isSignUp) {
      // Store new employer data with pending status
      localStorage.setItem('employerData', JSON.stringify({
        email: formData.email,
        password: formData.password,
        selectedPlan: chosenPlan?.id || '',
        status: 'pending', // pending admin approval
        registrationDate: new Date().toISOString()
      }))
      
      // Add to admin approval list (mock implementation)
      const pendingEmployers = JSON.parse(localStorage.getItem('pendingEmployers') || '[]')
      pendingEmployers.push({
        id: Date.now(),
        email: formData.email,
        plan: chosenPlan?.name || 'Plan',
        planId: chosenPlan?.id || '',
        price: chosenPlan?.price || '0',
        registrationDate: new Date().toISOString(),
        status: 'pending'
      })
      localStorage.setItem('pendingEmployers', JSON.stringify(pendingEmployers))
    }
    
    setShowSignUp(false)
    setShowHub(true)  // Redirect to employer dashboard
    loadMockApplications()
  }

  const handlePostJob = () => {
    if (!jobData.title || !jobData.description) {
      alert('Please fill in job title and description')
      return
    }
    alert('Job posted successfully!')
    setJobData({
      title: '',
      department: '',
      location: '',
      description: '',
      requirements: '',
      experience: '',
      type: '',
      deadline: ''
    })
  }

  const handleApplicationAction = (id: number, action: string) => {
    alert(`${action} application #${id}`)
  }

  const handleEditApplication = (id: number) => {
    alert(`Edit application #${id}`)
  }

  // Main render - add debugging
  console.log('Main render - State:', { showSignUp, chosenPlan, showJobForm, showHub, isAuthenticated })

  // Show job form when plan is chosen - CHECK THIS FIRST
  console.log('Checking job form conditions:', { showJobForm, chosenPlan })
  if (showJobForm) {
    // Ensure we have a plan, if not, get it from localStorage
    const planToShow = chosenPlan || JSON.parse(localStorage.getItem('planDetails') || '{}')
    if (!planToShow.id) {
      console.error('No plan available for job posting')
      setShowJobForm(false)
      return null
    }
    console.log('Rendering job form for plan:', planToShow)
    console.log('Current jobData state:', jobData)
    console.log('handleJobDataChange function exists:', typeof handleJobDataChange)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${planToShow?.color || 'from-blue-500 to-blue-600'} flex items-center justify-center mx-auto mb-4`}>
              {planToShow?.icon ? <planToShow.icon className="w-8 h-8 text-white" /> : null}
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-4">
              Post Job - {planToShow?.name || 'Selected Plan'}
            </h1>
            <p className="text-slate-600">
              Fill in the job details for your <strong>{planToShow?.name || 'Selected'}</strong> plan ({planToShow?.price || 'Plan Price'})
            </p>
          </div>

          {/* Selected Plan Summary */}
          <Card className="mb-6 border-blue-200 bg-blue-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-blue-900">{planToShow?.name || 'Plan Name'}</h3>
                  <p className="text-blue-700 font-bold">{planToShow?.price || 'Price'}</p>
                </div>
                <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${planToShow?.color || 'from-blue-500 to-blue-600'} flex items-center justify-center`}>
                  {planToShow?.icon ? <planToShow.icon className="w-6 h-6 text-white" /> : null}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Job Form - Using Complete Admin AddJobForm */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Job Posting Form</CardTitle>
              <CardDescription className="text-center">
                Complete the form below to post your job listing - Jobs go live immediately!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleJobSubmit} className="space-y-6">
                {/* Company Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Company Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Company Name *</label>
                      <input
                        type="text"
                        value={jobData.companyName}
                        onChange={(e) => handleJobDataChange('companyName', e.target.value)}
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g. Tech Solutions Rwanda"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Company Logo *</label>
                      <input
                        type="url"
                        value={jobData.logoUrl}
                        onChange={(e) => handleJobDataChange('logoUrl', e.target.value)}
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://example.com/logo.png"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Job Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Job Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Job Title *</label>
                      <input
                        type="text"
                        value={jobData.title}
                        onChange={(e) => handleJobDataChange('title', e.target.value)}
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g. Senior Software Developer"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Category *</label>
                      <select
                        value={jobData.category}
                        onChange={(e) => handleJobDataChange('category', e.target.value)}
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select Category</option>
                        <option value="Technology">Technology</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Finance">Finance</option>
                        <option value="Education">Education</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Sales">Sales</option>
                        <option value="Engineering">Engineering</option>
                        <option value="Customer Service">Customer Service</option>
                        <option value="Human Resources">Human Resources</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Location *</label>
                      <input
                        type="text"
                        value={jobData.location}
                        onChange={(e) => handleJobDataChange('location', e.target.value)}
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g. Kigali, Rwanda"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Job Type *</label>
                      <select
                        value={jobData.type}
                        onChange={(e) => handleJobDataChange('type', e.target.value)}
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select Type</option>
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Internship">Internship</option>
                        <option value="Remote">Remote</option>
                        <option value="Hybrid">Hybrid</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Experience Level</label>
                      <select
                        value={jobData.experience}
                        onChange={(e) => handleJobDataChange('experience', e.target.value)}
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select Level</option>
                        <option value="Entry Level">Entry Level</option>
                        <option value="Mid Level">Mid Level</option>
                        <option value="Senior Level">Senior Level</option>
                        <option value="Manager">Manager</option>
                        <option value="Director">Director</option>
                        <option value="Executive">Executive</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Application Deadline</label>
                      <input
                        type="date"
                        value={jobData.deadline}
                        onChange={(e) => handleJobDataChange('deadline', e.target.value)}
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Job Description */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Job Description *</label>
                  <textarea
                    value={jobData.description}
                    onChange={(e) => handleJobDataChange('description', e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[150px]"
                    placeholder="Provide a detailed description of the job role, responsibilities, and requirements..."
                    required
                  />
                </div>

                {/* Requirements */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Requirements & Qualifications</label>
                  <textarea
                    value={jobData.requirements}
                    onChange={(e) => handleJobDataChange('requirements', e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px]"
                    placeholder="List the required qualifications, skills, and experience..."
                  />
                </div>

                {/* Application Method */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Application Method</h3>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Application Link/Email *</label>
                    <input
                      type="text"
                      value={jobData.applicationLink}
                      onChange={(e) => handleJobDataChange('applicationLink', e.target.value)}
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g. https://company.com/careers/apply or careers@company.com"
                      required
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex gap-4">
                  <Button 
                    type="submit" 
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition-all transform hover:scale-105 shadow-lg"
                  >
                    Post Job - Go Live Immediately! 🚀
                  </Button>
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={() => setShowJobForm(false)}
                    className="px-6 py-3 border-gray-300 hover:border-gray-400 rounded-lg transition-all"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Back to Plans */}
          <div className="mt-8 text-center">
            <button 
              onClick={() => setShowJobForm(false)}
              className="text-blue-600 hover:text-blue-700 font-medium underline"
            >
              Back to Choose Plan
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Show sign-up form when plan is chosen - CHECK THIS SECOND
  console.log('Checking conditions:', { showSignUp, chosenPlan })
  if (showSignUp && chosenPlan) {
    console.log('Rendering sign-up form for plan:', chosenPlan)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-4">
              Employer Login
            </h1>
            <p className="text-slate-600">
              You've selected <strong>{chosenPlan?.name || 'Plan'}</strong> plan - Login to continue
            </p>
          </div>

          {/* Selected Plan Summary */}
          <Card className="mb-6 border-blue-200 bg-blue-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-blue-900">{chosenPlan?.name || 'Plan Name'}</h3>
                  <p className="text-blue-700 font-bold">{chosenPlan?.price || 'Price'}</p>
                </div>
                <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${chosenPlan?.color || 'from-blue-500 to-blue-600'} flex items-center justify-center`}>
                  {chosenPlan?.icon ? <chosenPlan.icon className="w-6 h-6 text-white" /> : null}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Employer Login/Signup Form */}
          <Card className="shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">
                {formData.isSignUp ? 'Employer Sign Up' : formData.isReset ? 'Reset Password' : 'Employer Login'}
              </CardTitle>
              <CardDescription className="text-center">
                {formData.isSignUp 
                  ? 'Create your employer account to post jobs'
                  : formData.isReset 
                  ? 'Enter your email to reset password'
                  : 'Enter your credentials to access Employer Hub'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignUp} className="space-y-4">
                {formData.error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-red-800 text-sm">{formData.error}</p>
                  </div>
                )}
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                {!formData.isReset && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">Password</label>
                    <div className="relative">
                      <input
                        type={formData.showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your password"
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setFormData({...formData, showPassword: !formData.showPassword})}
                      >
                        {formData.showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {formData.isSignUp && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">Confirm Password</label>
                    <div className="relative">
                      <input
                        type={formData.showPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Confirm your password"
                        required
                      />
                    </div>
                  </div>
                )}

                <Button 
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 active:scale-105"
                  disabled={formData.isLoading}
                >
                  {formData.isLoading 
                    ? "Processing..." 
                    : formData.isSignUp 
                    ? "Sign Up" 
                    : formData.isReset 
                    ? "Reset Password" 
                    : "Sign In"
                  }
                </Button>

                {/* Form Mode Switcher */}
                <div className="text-center space-y-2">
                  {!formData.isSignUp && !formData.isReset && (
                    <div>
                      <button 
                        type="button"
                        onClick={() => {
                          console.log('Sign Up button clicked')
                          setFormData({...formData, isSignUp: true})
                          console.log('isSignUp set to true')
                        }}
                        className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                      >
                        Don't have an account? Sign Up
                      </button>
                    </div>
                  )}
                  
                  {!formData.isReset && (
                    <div>
                      <button 
                        type="button"
                        onClick={() => setFormData({...formData, isReset: true})}
                        className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                      >
                        Forgot Password?
                      </button>
                    </div>
                  )}
                  
                  {(formData.isSignUp || formData.isReset) && (
                    <div>
                      <button 
                        type="button"
                        onClick={() => setFormData({...formData, isSignUp: false, isReset: false})}
                        className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                      >
                        Back to Login
                      </button>
                    </div>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Back to Plans */}
          <div className="mt-8 text-center">
            <button 
              onClick={() => setShowSignUp(false)}
              className="text-blue-600 hover:text-blue-700 font-medium underline"
            >
              Back to Choose Plan
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Check employer approval status before showing dashboard
  const checkEmployerStatus = () => {
    const employerData = JSON.parse(localStorage.getItem('employerData') || '{}')
    return employerData.status || 'pending'
  }

  // Show pending approval page
  if (showHub && checkEmployerStatus() === 'pending') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            {/* Animated Clock Icon */}
            <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl animate-pulse">
              <Clock className="w-12 h-12 text-white" />
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Account Under Review
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Your employer account is being reviewed by our admin team
            </p>
          </div>

          {/* Modern Card with Status */}
          <Card className="bg-white shadow-2xl border-0 rounded-2xl overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Review in Progress</h2>
                  <p className="text-blue-100">We're verifying your account details</p>
                </div>
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <Shield className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
            
            <CardContent className="p-8">
              <div className="space-y-6">
                {/* Status Steps */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">Registration Complete</p>
                      <p className="text-sm text-gray-600">Your account has been created</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center animate-pulse">
                      <Clock className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">Admin Review</p>
                      <p className="text-sm text-gray-600">Currently being reviewed</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <Target className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-400">Account Activated</p>
                      <p className="text-sm text-gray-400">Pending approval</p>
                    </div>
                  </div>
                </div>

                {/* Time Estimate */}
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                  <div className="flex items-center gap-3 mb-3">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-blue-900">Expected Approval Time</h3>
                  </div>
                  <p className="text-blue-800 font-medium text-lg mb-2">
                    ⏱️ Just a few minutes!
                  </p>
                  <p className="text-blue-700 text-sm">
                    Our team typically reviews accounts within 5-15 minutes during business hours. You'll receive an email once your account is approved.
                  </p>
                </div>

                {/* WhatsApp Contact */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">💬</span>
                    </div>
                    <h3 className="font-semibold text-green-900">Need Immediate Assistance?</h3>
                  </div>
                  <p className="text-green-800 mb-4">
                    Contact us directly on WhatsApp for faster approval:
                  </p>
                  <a 
                    href="https://wa.me/250788123456" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg"
                  >
                    <span className="text-xl">📱</span>
                    <span>WhatsApp: +250 788 123 456</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>

                {/* What's Next */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">What happens next?</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Admin reviews your account details</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>You receive approval email</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Access to employer dashboard</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Start posting jobs immediately</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Check Status
            </Button>
            <Button 
              variant="outline"
              onClick={() => setShowHub(false)}
              className="border-gray-300 hover:border-gray-400 px-8 py-3 rounded-xl font-semibold transition-all"
            >
              Back to Plans
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // If user is authenticated and has hub access, show Employer Dashboard (only if approved)
  if (showHub && chosenPlan && checkEmployerStatus() === 'approved') {
    // Calculate real data
    const totalJobs = applications.length
    const activeApplications = applications.filter(app => app.status === 'active').length
    const totalViews = Math.floor(Math.random() * 500) + 100 // Mock views data
    const pendingApplications = applications.filter(app => app.status === 'pending').length
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Dashboard Header */}
        <div className="bg-white shadow-sm border-b border-gray-100">
          <div className="container mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Building className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Employer Dashboard</h1>
                  <p className="text-sm text-gray-600">{companyProfile.name} • {chosenPlan?.name || 'Plan'} Plan</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge className={
                  chosenPlan?.id === 'short-listing' ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md' :
                  chosenPlan?.id === 'super-featured' ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md' :
                  chosenPlan?.id === 'featured-plus' ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md' :
                  'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                }>
                  {chosenPlan?.name || 'Plan'}
                </Badge>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowHub(false)}
                  className="border-gray-300 hover:border-blue-500 hover:text-blue-600 transition-all"
                >
                  Switch Plan
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="container mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Jobs Card */}
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all transform hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">Total Jobs Posted</p>
                    <p className="text-3xl font-bold mt-2">{totalJobs}</p>
                    <p className="text-blue-100 text-xs mt-1">Active listings</p>
                  </div>
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <Briefcase className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Applications Card */}
            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all transform hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium">Total Applications</p>
                    <p className="text-3xl font-bold mt-2">{activeApplications}</p>
                    <p className="text-green-100 text-xs mt-1">Pending review</p>
                  </div>
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Views Card */}
            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all transform hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">Total Views</p>
                    <p className="text-3xl font-bold mt-2">{totalViews}</p>
                    <p className="text-purple-100 text-xs mt-1">Job views</p>
                  </div>
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <Eye className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pending Applications Card */}
            <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all transform hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm font-medium">Pending</p>
                    <p className="text-3xl font-bold mt-2">{pendingApplications}</p>
                    <p className="text-orange-100 text-xs mt-1">Need review</p>
                  </div>
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Plan Details */}
            <Card className="bg-white shadow-lg hover:shadow-xl transition-all border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {chosenPlan?.icon ? <chosenPlan.icon className="w-5 h-5" /> : null}
                  Your Plan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg">{chosenPlan?.name || 'Plan Name'}</h3>
                    <p className="text-2xl font-bold text-blue-600">{chosenPlan?.price || 'Price'}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Job Postings</span>
                      <span className="font-medium">{totalJobs} / 10</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{width: `${(totalJobs / 10) * 100}%`}}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-gradient-to-br from-blue-50 to-purple-50 shadow-lg hover:shadow-xl transition-all border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-blue-600" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={() => setShowJobForm(true)}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Post New Job
                </Button>
                <Button variant="outline" className="w-full border-blue-200 text-blue-600 hover:bg-blue-50 transition-all">
                  <FileText className="w-4 h-4 mr-2" />
                  View Applications
                </Button>
                <Button variant="outline" className="w-full border-purple-200 text-purple-600 hover:bg-purple-50 transition-all">
                  <Settings className="w-4 h-4 mr-2" />
                  Account Settings
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg hover:shadow-xl transition-all border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">New applications today</span>
                    <span className="font-semibold text-green-600">+{pendingApplications}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Profile views</span>
                    <span className="font-semibold text-blue-600">{totalViews}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Active jobs</span>
                    <span className="font-semibold text-purple-600">{totalJobs}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Jobs and Applications Section */}
          <Tabs defaultValue="jobs" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-lg">
              <TabsTrigger value="jobs" className="data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all">
                <Briefcase className="w-4 h-4 mr-2" />
                Your Posted Jobs
              </TabsTrigger>
              <TabsTrigger value="applications" className="data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all">
                <Users className="w-4 h-4 mr-2" />
                Applications
              </TabsTrigger>
            </TabsList>

            <TabsContent value="jobs" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Your Posted Jobs</CardTitle>
                    <Button onClick={() => setShowJobForm(true)} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg transition-all">
                      <PlusCircle className="w-4 h-4 mr-2" />
                      Post New Job
                    </Button>
                  </div>
                  <CardDescription>
                    Manage your job postings and track their performance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {applications.length === 0 ? (
                    <div className="text-center py-12">
                      <Briefcase className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No Jobs Posted Yet</h3>
                      <p className="text-gray-600 mb-4">Start by posting your first job to attract qualified candidates</p>
                      <Button onClick={() => setShowJobForm(true)} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                        <PlusCircle className="w-4 h-4 mr-2" />
                        Post Your First Job
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {applications.map((app) => (
                        <Card key={app.id} className="border-l-4 border-l-blue-500 hover:shadow-md transition-all">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-semibold text-lg text-gray-900">{app.name}</h4>
                                <p className="text-gray-600 text-sm mt-1">{app.position}</p>
                                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                  <span className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    {app.location}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {app.appliedDate}
                                  </span>
                                  <Badge variant={app.status === 'active' ? 'default' : 'secondary'}>
                                    {app.status}
                                  </Badge>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => handleApplicationAction(app.id, 'view')}>
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => handleEditApplication(app.id)}>
                                  <Edit className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="applications" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Applications Received</CardTitle>
                  <CardDescription>
                    Review and manage applications from interested candidates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {applications.length === 0 ? (
                    <div className="text-center py-12">
                      <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No Applications Yet</h3>
                      <p className="text-gray-600">Applications will appear here once candidates start applying</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {applications.map((app) => (
                        <Card key={app.id} className="hover:shadow-md transition-all">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-semibold text-lg text-gray-900">{app.name}</h4>
                                <p className="text-gray-600 text-sm">{app.position}</p>
                                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                  <span>{app.email}</span>
                                  <span>{app.phone}</span>
                                  <span>{app.appliedDate}</span>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => handleApplicationAction(app.id, 'view')}>
                                  View Profile
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => handleApplicationAction(app.id, 'contact')}>
                                  Contact
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    )
  }

  // Main page content - show plan selection
  return (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Your Posted Jobs</CardTitle>
                    <Button onClick={() => setShowJobForm(true)}>
                      Post New Job
                    </Button>
                  </div>
                  <CardDescription>
                    Manage and track all your job postings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {applications.slice(0, 2).map((app) => (
                      <div key={app.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold">Senior Software Developer</h4>
                            <p className="text-sm text-gray-600">Posted 2 days ago • {app.score || 12} applications</p>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">Edit</Button>
                            <Button size="sm">View</Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="applications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Job Applications</CardTitle>
                  <CardDescription>
                    Review and manage applications for your job postings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {applications.map((app) => (
                      <div key={app.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold">
                              {app.avatar}
                            </div>
                            <div>
                              <h4 className="font-semibold">{app.name}</h4>
                              <p className="text-sm text-gray-600">{app.email}</p>
                              <p className="text-sm font-medium">{app.position}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className={getStatusColor(app.status)}>
                              {app.status}
                            </Badge>
                            <p className="text-sm text-gray-500 mt-1">Applied: {app.applied}</p>
                            <p className={`text-sm font-semibold ${getScoreColor(app.score)}`}>
                              Score: {app.score}
                            </p>
                            <div className="flex gap-2 mt-2">
                              <Button size="sm" variant="outline" onClick={() => handleApplicationAction(app.id, 'view')}>
                                View
                              </Button>
                              <Button size="sm" onClick={() => handleApplicationAction(app.id, 'shortlist')}>
                                Shortlist
                              </Button>
                              <Button size="sm" variant="destructive" onClick={() => handleApplicationAction(app.id, 'reject')}>
                                Reject
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Analytics Dashboard</CardTitle>
                  <CardDescription>
                    Track performance of your job postings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">247</div>
                      <div className="text-sm text-gray-600">Total Views</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">89</div>
                      <div className="text-sm text-gray-600">Applications</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">12</div>
                      <div className="text-sm text-gray-600">Shortlisted</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Company Settings</CardTitle>
                  <CardDescription>
                    Manage your company profile and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Company Name</label>
                      <input
                        type="text"
                        defaultValue={companyProfile.name}
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email</label>
                      <input
                        type="email"
                        defaultValue={companyProfile.email}
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Phone</label>
                      <input
                        type="tel"
                        defaultValue={companyProfile.phone}
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Company Size</label>
                      <select
                        defaultValue={companyProfile.size}
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="1-10">1-10 employees</option>
                        <option value="11-50">11-50 employees</option>
                        <option value="51-100">51-100 employees</option>
                        <option value="100+">100+ employees</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Website</label>
                      <input
                        type="url"
                        defaultValue={companyProfile.website}
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Company Banner</h3>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <div className="text-gray-500">
                        <Building className="h-12 w-12 mx-auto mb-2" />
                        <p className="text-sm">Upload company banner</p>
                        <p className="text-xs text-gray-400">Recommended size: 1200x300px</p>
                      </div>
                    </div>
                    <Button onClick={handleUploadBanner} className="w-full">
                      Upload Banner
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    )
  }

  // Main page content - show plan selection
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header />
      
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Choose Your <span className="text-blue-600">Employer Plan</span>
          </h1>
          <p className="text-xl text-slate-600 mb-8">
            Select the perfect plan for your recruitment needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {plans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`relative transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                plan.popular ? 'ring-2 ring-purple-500 shadow-lg' : 'shadow-md'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-purple-500 text-white px-3 py-1 text-xs font-semibold">
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${plan.color} flex items-center justify-center mx-auto mb-4`}>
                  <plan.icon className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-slate-900">
                  {plan.name}
                </CardTitle>
                <CardDescription className="text-slate-600">
                  {plan.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="flex-1">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button 
                  onClick={() => handleChoosePlan(plan)}
                  className={`w-full transition-all duration-200 active:scale-105 ${
                    plan.popular 
                      ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  Choose {plan.name}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Footer Info */}
        <div className="mt-12 text-center">
          <p className="text-slate-600 mb-4">
            All plans include basic analytics and applicant management
          </p>
          <Link 
            href="/"
            className="text-blue-600 hover:text-blue-700 font-medium underline"
          >
            Back to Home
          </Link>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
