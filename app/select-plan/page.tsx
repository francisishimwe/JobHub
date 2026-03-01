"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Star, Crown, Zap, User, Mail, Phone, Building, Lock, ArrowRight } from "lucide-react"

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
    color: "from-blue-500 to-blue-600",
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

export default function SelectPlanPage() {
  const router = useRouter()
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [showSignUp, setShowSignUp] = useState(false)
  const [chosenPlan, setChosenPlan] = useState<any>(null)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    password: '',
    confirmPassword: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleChoosePlan = (plan: any) => {
    setChosenPlan(plan)
    setShowSignUp(true)
  }

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.company || !formData.password) {
      alert('Please fill in all required fields')
      return
    }
    
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match')
      return
    }
    
    // Store employer data and selected plan
    localStorage.setItem('employerData', JSON.stringify(formData))
    localStorage.setItem('selectedPlan', chosenPlan.id)
    
    // Redirect to post job form
    router.push('/post-job-form')
  }

  // If plan chosen, show sign-up form
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
              Create Employer Account
            </h1>
            <p className="text-slate-600">
              You've selected <strong>{chosenPlan.name}</strong> plan - Sign up to continue
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

          {/* Sign Up Form */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">Employer Registration</CardTitle>
              <CardDescription>
                Fill in your details to complete your {chosenPlan.name} plan registration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      First Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="John"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Last Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="john@company.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+250 788 123 456"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Company Name *
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Acme Corporation"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <Button 
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 active:scale-105"
                >
                  Complete Registration
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </form>
            </CardContent>
            <CardFooter className="text-center">
              <p className="text-sm text-slate-600">
                Already have an account?{' '}
                <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                  Sign in
                </Link>
              </p>
            </CardFooter>
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

  // Show plan selection first
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
