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
import { Building, Users, Briefcase, TrendingUp, Star, Check, Eye, EyeOff, ChevronRight, Clock, FileText, UserCircle2, LogOut, ArrowRight, Zap, Shield, Crown, Target } from "lucide-react"

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
    department: '',
    location: '',
    description: '',
    requirements: '',
    experience: '',
    type: '',
    deadline: ''
  })
  const [applications, setApplications] = useState([
    {
      id: 1,
      name: "Jean Mugabo",
      email: "jean.mugabo@email.com",
      position: "Senior Developer",
      applied: "2024-01-15",
      status: "shortlisted",
      score: 85,
      avatar: "JM"
    },
    {
      id: 2,
      name: "Grace Uwimana",
      email: "grace.uwimana@email.com",
      position: "UX Designer",
      applied: "2024-01-14",
      status: "interviewing",
      score: 92,
      avatar: "GU"
    },
    {
      id: 3,
      name: "Eric Niyonzima",
      email: "eric.niyonzima@email.com",
      position: "Project Manager",
      applied: "2024-01-13",
      status: "hired",
      score: 78,
      avatar: "EN"
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
    const savedPlan = localStorage.getItem('selectedPlan')
    const savedPlanDetails = localStorage.getItem('planDetails')
    const employerData = JSON.parse(localStorage.getItem('employerData') || '{}')
    
    if (savedPlan && savedPlanDetails && employerData.status === 'approved') {
      setChosenPlan(JSON.parse(savedPlanDetails))
      setSelectedPlan(JSON.parse(savedPlanDetails))
      setShowHub(true)
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
        position: "Marketing Manager",
        applied: "2024-01-16",
        status: "shortlisted",
        score: 88,
        avatar: "AK"
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
    localStorage.setItem('selectedPlan', chosenPlan.id)
    localStorage.setItem('planDetails', JSON.stringify(chosenPlan))
    
    if (formData.isSignUp) {
      // Store new employer data with pending status
      localStorage.setItem('employerData', JSON.stringify({
        email: formData.email,
        password: formData.password,
        selectedPlan: chosenPlan.id,
        status: 'pending', // pending admin approval
        registrationDate: new Date().toISOString()
      }))
      
      // Add to admin approval list (mock implementation)
      const pendingEmployers = JSON.parse(localStorage.getItem('pendingEmployers') || '[]')
      pendingEmployers.push({
        id: Date.now(),
        email: formData.email,
        plan: chosenPlan.name,
        planId: chosenPlan.id,
        price: chosenPlan.price,
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
  if (showJobForm && chosenPlan) {
    console.log('Rendering job form for plan:', chosenPlan)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${chosenPlan.color} flex items-center justify-center mx-auto mb-4`}>
              <chosenPlan.icon className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-4">
              Post Job - {chosenPlan.name} Plan
            </h1>
            <p className="text-slate-600">
              Fill in the job details for your <strong>{chosenPlan.name}</strong> plan ({chosenPlan.price})
            </p>
          </div>

          {/* Selected Plan Summary */}
          <Card className="mb-6 border-blue-200 bg-blue-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-blue-900">{chosenPlan.name}</h3>
                  <p className="text-blue-700 font-bold">{chosenPlan.price}</p>
                </div>
                <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${chosenPlan.color} flex items-center justify-center`}>
                  <chosenPlan.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Job Form - Using Admin AddJobForm */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Job Posting Form</CardTitle>
              <CardDescription className="text-center">
                Complete the form below to post your job listing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Job Title</label>
                    <input
                      type="text"
                      value={jobData.title}
                      onChange={(e) => handleJobDataChange('title', e.target.value)}
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g. Senior Software Developer"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Department</label>
                    <input
                      type="text"
                      value={jobData.department}
                      onChange={(e) => handleJobDataChange('department', e.target.value)}
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g. Engineering"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Location</label>
                    <input
                      type="text"
                      value={jobData.location}
                      onChange={(e) => handleJobDataChange('location', e.target.value)}
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g. Kigali, Rwanda"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Experience Level</label>
                    <select
                      value={jobData.experience}
                      onChange={(e) => handleJobDataChange('experience', e.target.value)}
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select experience</option>
                      <option value="entry">Entry Level</option>
                      <option value="mid">Mid Level</option>
                      <option value="senior">Senior Level</option>
                      <option value="executive">Executive Level</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Job Description</label>
                  <textarea
                    value={jobData.description}
                    onChange={(e) => handleJobDataChange('description', e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-lg h-32 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe the role, responsibilities, and requirements..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Requirements</label>
                  <textarea
                    value={jobData.requirements}
                    onChange={(e) => handleJobDataChange('requirements', e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-lg h-24 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="List the key qualifications and skills required..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Job Type</label>
                  <select
                    value={jobData.type}
                    onChange={(e) => handleJobDataChange('type', e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select job type</option>
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                    <option value="remote">Remote</option>
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
                <Button onClick={handlePostJob} className="w-full bg-blue-600 hover:bg-blue-700">
                  Post Job
                </Button>
              </div>
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
              You've selected <strong>{chosenPlan.name}</strong> plan - Login to continue
            </p>
          </div>

          {/* Selected Plan Summary */}
          <Card className="mb-6 border-blue-200 bg-blue-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-blue-900">{chosenPlan.name}</h3>
                  <p className="text-blue-700 font-bold">{chosenPlan.price}</p>
                </div>
                <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${chosenPlan.color} flex items-center justify-center`}>
                  <chosenPlan.icon className="w-6 h-6 text-white" />
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
        <div className="max-w-md mx-auto text-center">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock className="w-10 h-10 text-orange-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-4">
            Account Under Review
          </h1>
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <p className="text-slate-600 mb-4">
              Your employer account is currently pending approval by our admin team.
            </p>
            <div className="space-y-3 text-left">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm">Registration submitted successfully</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                <span className="text-sm">Admin review in progress</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                <span className="text-sm">You'll receive an email upon approval</span>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <p className="text-sm text-slate-500">
              Expected approval time: 1-2 business days
            </p>
            <Button 
              onClick={() => setShowHub(false)}
              variant="outline"
              className="w-full"
            >
              Back to Plan Selection
            </Button>
          </div>
        </div>
      </div>
    )
  }
  // If user is authenticated and has hub access, show Employer Dashboard (only if approved)
  if (showHub && chosenPlan && checkEmployerStatus() === 'approved') {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Dashboard Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Building className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Employer Dashboard</h1>
                  <p className="text-sm text-gray-600">{companyProfile.name} • {chosenPlan.name} Plan</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={
                  chosenPlan.id === 'short-listing' ? 'bg-green-100 text-green-800' :
                  chosenPlan.id === 'super-featured' ? 'bg-orange-100 text-orange-800' :
                  chosenPlan.id === 'featured-plus' ? 'bg-purple-100 text-purple-800' :
                  'bg-blue-100 text-blue-800'
                }>
                  {chosenPlan.name}
                </Badge>
                <Button variant="outline" size="sm" onClick={() => setShowHub(false)}>
                  Switch Plan
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Plan Overview Card */}
        <div className="container mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Plan Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <chosenPlan.icon className="w-5 h-5" />
                  Your Plan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg">{chosenPlan.name}</h3>
                    <p className="text-2xl font-bold text-blue-600">{chosenPlan.price}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Job Postings</span>
                      <span className="font-medium">5 / 10</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{width: '50%'}}></div>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    Upgrade Plan
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button 
                    onClick={() => setShowJobForm(true)}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    Post New Job
                  </Button>
                  <Button variant="outline" className="w-full">
                    View Applications
                  </Button>
                  <Button variant="outline" className="w-full">
                    Edit Profile
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>3 new applications today</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Job "Senior Developer" posted</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Profile updated 2 days ago</span>
                  </div>
                  <Button variant="ghost" className="w-full text-sm">
                    View All Activity
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Dashboard Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="jobs">Posted Jobs</TabsTrigger>
              <TabsTrigger value="applications">Applications</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="jobs" className="space-y-6">
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
