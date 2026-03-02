"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Star, Crown, Zap, User, Mail, Phone, Building, Lock, ArrowRight, Briefcase, Upload, Users, MessageSquare, Settings, Eye, EyeOff, Calendar, Filter, Search, TrendingUp, MapPin, BarChart3 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/lib/auth-context"
import { AddJobForm } from "@/components/add-job-form"
import { LoginForm } from "@/components/login-form"

const plans = [
  {
    id: "featured",
    name: "Featured",
    price: "50,000 RWF",
    description: "Perfect for getting started",
    features: [
      "Basic job listing",
      "30-day visibility",
      "Company logo display",
      "Email applications",
      "Basic analytics"
    ],
    icon: Star,
    color: "from-green-500 to-green-600",
    popular: false
  },
  {
    id: "featured-plus",
    name: "Featured+",
    price: "75,000 RWF",
    description: "Enhanced visibility for your job",
    features: [
      "Enhanced job listing",
      "30-day visibility",
      "Priority placement",
      "Company logo & banner",
      "Email & link applications",
      "Advanced analytics",
      "Social media promotion"
    ],
    icon: Crown,
    color: "from-purple-500 to-purple-600",
    popular: true
  },
  {
    id: "super-featured",
    name: "Super Featured",
    price: "100,000 RWF",
    description: "Maximum exposure for top talent",
    features: [
      "Premium job listing",
      "45-day visibility",
      "Top placement guarantee",
      "Featured on homepage",
      "Company branding",
      "Multiple application methods",
      "Premium analytics",
      "WhatsApp promotion",
      "Dedicated support"
    ],
    icon: Zap,
    color: "from-orange-500 to-orange-600",
    popular: false
  },
  {
    id: "short-listing",
    name: "Short-listing",
    price: "150,000 RWF",
    description: "Full-service recruitment",
    features: [
      "All Super Featured benefits",
      "60-day visibility",
      "Candidate pre-screening",
      "Short-listing service",
      "Interview coordination",
      "Priority candidate matching",
      "Dedicated account manager",
      "Unlimited edits",
      "Money-back guarantee"
    ],
    icon: Crown,
    color: "from-green-500 to-green-600",
    popular: false
  }
]

export default function EmployerHubPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [selectedPlan, setSelectedPlan] = useState<any>(null)
  const [showSignUp, setShowSignUp] = useState(false)
  const [chosenPlan, setChosenPlan] = useState<any>(null)
  const [showHub, setShowHub] = useState(false)
  const [activeTab, setActiveTab] = useState('compose')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    error: '',
    isLoading: false,
    showPassword: false
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
  const [companyProfile, setCompanyProfile] = useState({
    logo: '',
    banner: '',
    name: '',
    description: ''
  })
  const [applications, setApplications] = useState([])
  const [whatsappEnabled, setWhatsappEnabled] = useState(false)

  useEffect(() => {
    // Check if user is already authenticated
    if (isAuthenticated) {
      const savedEmployerData = localStorage.getItem('employerData')
      if (savedEmployerData) {
        const employer = JSON.parse(savedEmployerData)
        setCompanyProfile({
          logo: employer.logo || '/api/placeholder-logo',
          banner: employer.banner || '/api/placeholder-banner',
          name: employer.company || '',
          description: employer.description || ''
        })
        setShowHub(true)
        loadMockApplications()
      }
    }
  }, [isAuthenticated])

  const loadMockApplications = () => {
    setApplications([
      {
        id: 1,
        name: 'Jean Mugisha',
        position: 'Assistant Tea Maker',
        score: 92,
        status: 'shortlisted',
        email: 'jean.m@email.com',
        appliedDate: '2024-03-02',
        experience: '3 years'
      },
      {
        id: 2,
        name: 'Grace Uwimana',
        position: 'Marketing Manager',
        score: 88,
        status: 'interviewing',
        email: 'grace.u@email.com',
        appliedDate: '2024-03-03',
        experience: '2 years'
      }
    ])
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleJobDataChange = (field: string, value: string) => {
    setJobData({
      ...jobData,
      [field]: value
    })
  }

  const handleChoosePlan = (plan: any) => {
    setChosenPlan(plan)
    setShowSignUp(true)
  }

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.email || !formData.password) {
      alert('Please fill in email and password')
      return
    }
    
    // Store plan selection and redirect to job form
    localStorage.setItem('selectedPlan', chosenPlan.id)
    localStorage.setItem('planDetails', JSON.stringify(chosenPlan))
    
    setShowSignUp(false)
    setShowHub(true)
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

  const handleUploadLogo = () => {
    alert('Logo upload feature - would open file picker')
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

  // If user is authenticated and has hub access, show Employer Hub
  if (showHub && isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Hub Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Building className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Employer Hub</h1>
                  <p className="text-sm text-gray-600">{companyProfile.name} • {chosenPlan?.name} Plan</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={
                  chosenPlan?.id === 'short-listing' ? 'bg-green-100 text-green-800' :
                  chosenPlan?.id === 'super-featured' ? 'bg-orange-100 text-orange-800' :
                  chosenPlan?.id === 'featured-plus' ? 'bg-purple-100 text-purple-800' :
                  'bg-blue-100 text-blue-800'
                }>
                  {chosenPlan?.name} Plan
                </Badge>
                <Link href="/">
                  <Button variant="outline" size="sm">Back to Home</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Hub Content */}
        <div className="container mx-auto px-6 py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="compose" className="gap-2">
                <Briefcase className="h-4 w-4" />
                Job Composer
              </TabsTrigger>
              <TabsTrigger value="branding" className="gap-2">
                <Upload className="h-4 w-4" />
                Branding Tools
              </TabsTrigger>
              <TabsTrigger value="candidates" className="gap-2">
                <Users className="h-4 w-4" />
                Candidate Manager
              </TabsTrigger>
              <TabsTrigger value="settings" className="gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </TabsTrigger>
            </TabsList>

            {/* Job Composer Tab */}
            <TabsContent value="compose" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    Job Composer
                  </CardTitle>
                  <CardDescription>Create and post new job listings using the comprehensive admin job form</CardDescription>
                </CardHeader>
                <CardContent>
                  <AddJobForm onSuccess={() => {
                    alert('Job posted successfully! Your job will be reviewed and published.')
                    setActiveTab('candidates')
                  }} />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Branding Tools Tab */}
            <TabsContent value="branding" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Company Logo</CardTitle>
                    <CardDescription>Upload your company logo (Featured+ and above)</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                      {companyProfile.logo ? (
                        <img src={companyProfile.logo} alt="Company Logo" className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <Building className="h-12 w-12 text-gray-400" />
                      )}
                    </div>
                    <Button onClick={handleUploadLogo} variant="outline" className="w-full">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Logo
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Company Banner</CardTitle>
                    <CardDescription>Add a banner for enhanced visibility</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                      {companyProfile.banner ? (
                        <img src={companyProfile.banner} alt="Company Banner" className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <Upload className="h-12 w-12 text-gray-400" />
                      )}
                    </div>
                    <Button onClick={handleUploadBanner} variant="outline" className="w-full">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Banner
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Candidate Manager Tab */}
            <TabsContent value="candidates" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Candidate Manager
                    </div>
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
                  </CardTitle>
                  <CardDescription>Manage and track all job applications</CardDescription>
                </CardHeader>
                <CardContent>
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
                        {applications.map(candidate => (
                          <tr key={candidate.id} className="border-b hover:bg-gray-50">
                            <td className="p-4">
                              <div>
                                <p className="font-medium">{candidate.name}</p>
                                <p className="text-sm text-gray-500">{candidate.email}</p>
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

                  {/* Short-listing Features for 150k plan */}
                  {chosenPlan?.id === 'short-listing' && (
                    <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-2">Short-listing Features Unlocked</h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        <Button variant="outline" className="gap-2">
                          <Filter className="h-4 w-4" />
                          Pre-screening
                        </Button>
                        <Button variant="outline" className="gap-2">
                          <Calendar className="h-4 w-4" />
                          Interview Coordination
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>WhatsApp Promotion</CardTitle>
                    <CardDescription>Social media promotion (Super Featured users)</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">WhatsApp Promotion</p>
                        <p className="text-sm text-gray-500">Promote your jobs on WhatsApp</p>
                      </div>
                      <Button
                        variant={whatsappEnabled ? "default" : "outline"}
                        onClick={() => setWhatsappEnabled(!whatsappEnabled)}
                        disabled={chosenPlan?.id !== 'super-featured' && chosenPlan?.id !== 'short-listing'}
                      >
                        {whatsappEnabled ? 'Enabled' : 'Enable'}
                      </Button>
                    </div>
                    {chosenPlan?.id !== 'super-featured' && chosenPlan?.id !== 'short-listing' && (
                      <p className="text-sm text-orange-600">Upgrade to Super Featured or Short-listing plan to enable WhatsApp promotion</p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                    <CardDescription>Manage your account preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Company Name</label>
                      <input
                        type="text"
                        className="w-full p-3 border border-gray-300 rounded-lg"
                        value={companyProfile.name}
                        readOnly
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <input
                        type="email"
                        className="w-full p-3 border border-gray-300 rounded-lg"
                        value={formData.email}
                        readOnly
                      />
                    </div>
                    <Button variant="outline" className="w-full">
                      <Settings className="h-4 w-4 mr-2" />
                      Advanced Settings
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    )
  }

  // Show plan selection for new users
  if (!showHub) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              Choose Your Posting Plan
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Select the perfect plan to reach top talent and fill your position faster
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan) => {
              const Icon = plan.icon
              return (
                <Card 
                  key={plan.id} 
                  className={`relative transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                    plan.popular ? 'border-2 border-purple-500 shadow-lg' : 'border border-slate-200'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        MOST POPULAR
                      </span>
                    </div>
                  )}
                  
                  <CardHeader className="text-center pb-4">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${plan.color} flex items-center justify-center`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold text-slate-900">
                      {plan.name}
                    </CardTitle>
                    <CardDescription className="text-slate-600">
                      {plan.description}
                    </CardDescription>
                    <div className="mt-4">
                      <span className="text-3xl font-bold text-slate-900">
                        {plan.price}
                      </span>
                    </div>
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
              )
            })}
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
      </div>
    )
  }

  // Show sign-up form when plan is chosen
  if (showSignUp && chosenPlan) {
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

          {/* Login Form - Same as Admin Form */}
          <Card className="shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">Employer Login</CardTitle>
              <p className="text-sm text-muted-foreground text-center">
                Enter your credentials to access the Employer Hub
              </p>
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

                <Button 
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 active:scale-105"
                  disabled={formData.isLoading}
                >
                  {formData.isLoading ? "Signing in..." : "Sign In"}
                </Button>
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

  // Fallback
  return <div>Loading...</div>
}
