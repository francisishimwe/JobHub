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
import { Building, Users, Briefcase, TrendingUp, Star, Check, Eye, EyeOff, ChevronRight, Clock, FileText, UserCircle2, LogOut, ArrowRight, Zap, Shield, Crown, Target, PlusCircle, Settings, MapPin, Calendar, Edit, RefreshCw, CheckCircle, MessageSquare } from "lucide-react"

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
      'Premium applicant tracking',
      '24/7 phone support',
      'Featured company profile',
      'Top job placement'
    ],
    popular: false
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: '250,000 RWF',
    description: 'Unlimited posting',
    icon: Shield,
    color: 'from-green-500 to-green-600',
    features: [
      'Unlimited job postings',
      'Advanced analytics',
      'Dedicated account manager',
      'Custom branding',
      'Priority placement'
    ],
    popular: false
  }
]

export default function EmployerHubPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [selectedPlan, setSelectedPlan] = useState<any>(null)
  const [showSignUp, setShowSignUp] = useState(false)
  const [showJobForm, setShowJobForm] = useState(false)
  const [chosenPlan, setChosenPlan] = useState<any>(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [applications, setApplications] = useState([
    {
      id: 1,
      name: "Jean Mugabo",
      email: "jean.mugabo@email.com",
      phone: "+250 788 123 456",
      position: "Senior Developer",
      applied: "2024-01-15",
      appliedDate: "2024-01-15",
      status: 'active',
      score: 95,
      avatar: "JM",
      location: "Kigali, Rwanda"
    },
    {
      id: 2,
      name: "Grace Uwimana",
      email: "grace.uwimana@email.com",
      phone: "+250 788 987 654",
      position: "Marketing Manager",
      applied: "2024-01-14",
      appliedDate: "2024-01-14",
      status: 'pending',
      score: 88,
      avatar: "GU",
      location: "Kigali, Rwanda"
    }
  ])
  
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

  const [formData, setFormData] = useState({
    companyName: '',
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

  useEffect(() => {
    if (isAuthenticated && user) {
      const storedEmployer = localStorage.getItem('employer')
      if (storedEmployer) {
        const employer = JSON.parse(storedEmployer)
        if (employer.status === 'approved') {
          setSelectedPlan(employer.plan)
          setShowJobForm(false)
        } else if (employer.status === 'pending') {
          // Show waiting page
        }
      }
    }
  }, [isAuthenticated, user])

  const handleChoosePlan = (plan: any) => {
    setChosenPlan(plan)
    setShowSignUp(true)
  }

  const handleJobSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!jobData.title.trim() || !jobData.companyName.trim() || !jobData.description.trim()) {
      alert('Please fill in all required fields')
      return
    }
    
    try {
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
        status: 'active',
        featured: false,
        plan_id: chosenPlan?.id || 'featured',
        opportunity_type: 'Job',
        application_method: 'link',
        userEmail: user?.email || null,
        postedDate: new Date().toISOString()
      }
      
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobPayload)
      })
      
      if (response.ok) {
        alert('🎉 Job posted successfully! Your job is now live on the home page.')
        setJobData({
          title: '', companyName: '', logoUrl: '', department: '', location: '',
          description: '', requirements: '', experience: '', type: '', category: '', deadline: '', applicationLink: ''
        })
        setShowJobForm(false)
      } else {
        alert('Failed to post job. Please try again.')
      }
    } catch (error) {
      alert('Failed to post job. Please try again.')
    }
  }

  const handleJobDataChange = (field: string, value: string) => {
    setJobData({ ...jobData, [field]: value })
  }

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormData({...formData, isLoading: true, error: ''})

    try {
      if (formData.isReset) {
        // Handle password reset
        if (!formData.email) {
          setFormData({...formData, error: 'Email is required for password reset', isLoading: false})
          return
        }
        
        // Simulate password reset
        await new Promise(resolve => setTimeout(resolve, 2000))
        alert('Password reset link sent to your email!')
        setFormData({...formData, isReset: false, isLoading: false})
        return
      }

      if (formData.isSignUp) {
        // Handle sign up
        if (!formData.companyName || !formData.email || !formData.password) {
          setFormData({...formData, error: 'Please fill in all required fields', isLoading: false})
          return
        }

        if (formData.password !== formData.confirmPassword) {
          setFormData({...formData, error: 'Passwords do not match', isLoading: false})
          return
        }

        // Simulate sign up
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        // Store employer data in localStorage
        const employerData = {
          companyName: formData.companyName,
          email: formData.email,
          plan: chosenPlan,
          status: 'pending',
          createdAt: new Date().toISOString()
        }
        
        localStorage.setItem('employer', JSON.stringify(employerData))
        
        alert('Account created successfully! Please wait for approval.')
        setFormData({...formData, isLoading: false, isSignUp: false})
        return
      }

      // Handle sign in
      if (!formData.email || !formData.password) {
        setFormData({...formData, error: 'Email and password are required', isLoading: false})
        return
      }

      // Simulate sign in
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Check if employer exists and is approved
      const storedEmployer = localStorage.getItem('employer')
      if (storedEmployer) {
        const employer = JSON.parse(storedEmployer)
        if (employer.email === formData.email) {
          if (employer.status === 'pending') {
            setFormData({...formData, error: 'Your account is still pending approval', isLoading: false})
            return
          }
          if (employer.status === 'approved') {
            setSelectedPlan(employer.plan)
            setShowSignUp(false)
            setFormData({...formData, isLoading: false})
            return
          }
          if (employer.status === 'rejected') {
            setFormData({...formData, error: 'Your account has been rejected', isLoading: false})
            return
          }
        }
      }
      
      setFormData({...formData, error: 'Invalid email or password', isLoading: false})
      
    } catch (error) {
      setFormData({...formData, error: 'Authentication failed. Please try again.', isLoading: false})
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  // Show waiting page for pending approval
  if (isAuthenticated && user) {
    const storedEmployer = localStorage.getItem('employer')
    if (storedEmployer) {
      const employer = JSON.parse(storedEmployer)
      if (employer.status === 'pending') {
        return (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full">
              <Card className="shadow-xl border-0">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Clock className="w-8 h-8 text-white animate-pulse" />
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-4">Account Under Review</h1>
                  <p className="text-gray-600 mb-6">
                    Your employer account is being reviewed by our team. This usually takes just a few minutes, not days!
                  </p>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Account submitted for review</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Clock className="w-4 h-4 text-blue-500" />
                      <span>Typically approved within minutes</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Shield className="w-4 h-4 text-purple-500" />
                      <span>Manual verification for quality</span>
                    </div>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <p className="text-sm text-blue-800 mb-2">
                      <strong>Need immediate assistance?</strong>
                    </p>
                    <p className="text-sm text-blue-700">
                      Contact us directly on WhatsApp:
                    </p>
                    <a 
                      href="https://wa.me/250788123456" 
                      className="inline-flex items-center gap-2 text-green-600 font-semibold hover:text-green-700 mt-2"
                    >
                      <MessageSquare className="w-4 h-4" />
                      +250 788 123 456
                    </a>
                  </div>
                  <div className="space-y-2">
                    <Button 
                      onClick={() => {
                        const storedEmployer = localStorage.getItem('employer')
                        if (storedEmployer) {
                          const employer = JSON.parse(storedEmployer)
                          employer.status = 'approved'
                          localStorage.setItem('employer', JSON.stringify(employer))
                          window.location.reload()
                        }
                      }} 
                      className="w-full bg-green-600 hover:bg-green-700 mb-2"
                    >
                      🚀 Approve Account (Testing)
                    </Button>
                    <Button 
                      onClick={() => window.location.reload()} 
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      Check Status
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => router.push('/')}
                      className="w-full"
                    >
                      Back to Home
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )
      }
    }
  }

  // Show job posting form
  if (showJobForm && chosenPlan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Post a Job - {chosenPlan.name}
            </h1>
            <p className="text-slate-600">
              Fill in the job details for your <strong>{chosenPlan.name}</strong> plan ({chosenPlan.price})
            </p>
          </div>

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

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Job Posting Form</CardTitle>
              <CardDescription className="text-center">
                Complete the form below to post your job listing - Jobs go live immediately!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleJobSubmit} className="space-y-6">
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

                <div className="space-y-2">
                  <label className="text-sm font-medium">Requirements & Qualifications</label>
                  <textarea
                    value={jobData.requirements}
                    onChange={(e) => handleJobDataChange('requirements', e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px]"
                    placeholder="List the required qualifications, skills, and experience..."
                  />
                </div>

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

  // Show login/sign-up form when plan is chosen
  if (showSignUp && chosenPlan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              {formData.isSignUp ? 'Create Employer Account' : 'Sign In to Employer Hub'}
            </h1>
            <p className="text-slate-600">
              {formData.isSignUp 
                ? `Sign up to post jobs with your ${chosenPlan.name} plan`
                : 'Access your employer dashboard and manage job postings'
              }
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>
                {formData.isSignUp ? 'Employer Registration' : 'Employer Sign In'}
              </CardTitle>
              <CardDescription>
                {formData.isSignUp 
                  ? 'Create your account to start posting jobs'
                  : 'Welcome back! Please sign in to your account'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAuth} className="space-y-4">
                {formData.isSignUp && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">Company Name</label>
                    <input
                      type="text"
                      value={formData.companyName || ''}
                      onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your company name"
                      required
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Email Address</label>
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

                {!formData.isSignUp && !formData.isReset && (
                  <div className="flex items-center justify-between">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="mr-2"
                      />
                      <span className="text-sm text-slate-600">Remember me</span>
                    </label>
                  </div>
                )}

                {formData.error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {formData.error}
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
                        {formData.isSignUp ? 'Already have an account? Sign In' : 'Back to Sign In'}
                      </button>
                    </div>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="mt-6 text-center">
            <button 
              onClick={() => setShowSignUp(false)}
              className="text-blue-600 hover:text-blue-700 font-medium underline"
            >
              Back to Plans
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Show employer dashboard if authenticated and approved
  if (isAuthenticated && user && selectedPlan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Header />
        
        <div className="container mx-auto px-6 py-12">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Employer Dashboard</h1>
            <p className="text-slate-600">Manage your job postings and track applications</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Briefcase className="w-8 h-8 text-blue-600" />
                  <span className="text-2xl font-bold text-slate-900">12</span>
                </div>
                <p className="text-sm text-slate-600">Active Jobs</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Users className="w-8 h-8 text-green-600" />
                  <span className="text-2xl font-bold text-slate-900">89</span>
                </div>
                <p className="text-sm text-slate-600">Total Applications</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Eye className="w-8 h-8 text-purple-600" />
                  <span className="text-2xl font-bold text-slate-900">1,247</span>
                </div>
                <p className="text-sm text-slate-600">Job Views</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <TrendingUp className="w-8 h-8 text-orange-600" />
                  <span className="text-2xl font-bold text-slate-900">4.8</span>
                </div>
                <p className="text-sm text-slate-600">Avg. Rating</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Recent Applications</CardTitle>
                    <Button variant="outline" size="sm">
                      View All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {applications.slice(0, 3).map((app) => (
                      <div key={app.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-semibold">{app.avatar}</span>
                          </div>
                          <div>
                            <p className="font-medium">{app.name}</p>
                            <p className="text-sm text-gray-600">{app.position}</p>
                            <p className="text-sm text-gray-500">{app.location}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">{app.appliedDate}</p>
                          <Badge className={getStatusColor(app.status)}>
                            {app.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
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
            </div>
          </div>
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
