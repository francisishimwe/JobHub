"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Star, Crown, Zap } from "lucide-react"

const plans = [
  {
    id: 1,
    name: "Featured",
    price: "Free",
    description: "Perfect for getting started",
    features: [
      "Basic job listing",
      "30-day visibility",
      "Standard placement",
      "Up to 100 applicants"
    ],
    icon: Star,
    color: "from-blue-500 to-blue-600",
    popular: false
  },
  {
    id: 2,
    name: "Featured+",
    price: "$29",
    description: "Enhanced visibility for your job",
    features: [
      "Enhanced job listing",
      "60-day visibility",
      "Priority placement",
      "Up to 500 applicants",
      "Company branding"
    ],
    icon: Crown,
    color: "from-purple-500 to-purple-600",
    popular: false
  },
  {
    id: 3,
    name: "Super Featured",
    price: "$59",
    description: "Maximum exposure for top talent",
    features: [
      "Premium job listing",
      "90-day visibility",
      "Top placement",
      "Unlimited applicants",
      "Company branding",
      "Social media promotion"
    ],
    icon: Zap,
    color: "from-amber-500 to-amber-600",
    popular: true
  },
  {
    id: 4,
    name: "Short-listing",
    price: "$99",
    description: "Exclusive agency verification",
    features: [
      "Exclusive listing",
      "Unlimited visibility",
      "Top priority placement",
      "Unlimited applicants",
      "Premium branding",
      "Social media promotion",
      "Agency verified badge",
      "Priority: Top tagging"
    ],
    icon: Crown,
    color: "from-orange-500 to-orange-600",
    popular: false
  }
]

export default function SelectPlanPage() {
  const router = useRouter()
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null)

  const handleSelectPlan = (planId: number) => {
    setSelectedPlan(planId)
    // Store the selected plan in localStorage
    localStorage.setItem('selectedPlan', planId.toString())
    // Redirect to post job form
    router.push('/post-job-form')
  }

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
                    {plan.price !== "Free" && (
                      <span className="text-slate-600">/month</span>
                    )}
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
                    onClick={() => handleSelectPlan(plan.id)}
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
