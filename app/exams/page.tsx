"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { FileText, MessagesSquare, GraduationCap, Star, UserCheck } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Resource {
  id: string
  title: string
  description: string
  category: string
  icon: string
  icon_color: string
  button_text: string
  button_color: string
  button_link: string
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export default function ExamsPage() {
  const [resources, setResources] = useState<Resource[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchResources()
  }, [])

  const fetchResources = async () => {
    try {
      const response = await fetch('/api/resources')
      const data = await response.json()
      setResources(data.resources || [])
    } catch (error) {
      console.error('Error fetching resources:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getIconComponent = (iconName: string, color: string) => {
    const iconClass = `h-16 w-16 ${color === 'blue' ? 'text-blue-600' : 'text-orange-600'}`
    
    switch (iconName) {
      case 'FileText':
        return <FileText className={iconClass} />
      case 'MessagesSquare':
        return <MessagesSquare className={iconClass} />
      default:
        return <FileText className={iconClass} />
    }
  }

  const getButtonClass = (color: string) => {
    const baseClass = "w-full px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:shadow-xl transform hover:scale-105"
    return color === 'blue' 
      ? `${baseClass} bg-blue-600 hover:bg-blue-700 text-white`
      : `${baseClass} bg-orange-600 hover:bg-orange-700 text-white`
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading resources...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Exam Preparation Resources
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Access comprehensive study materials, interview preparation guides, and past exam solutions to advance your career in Rwanda
            </p>
          </div>

          {/* Resources Cards - 2 Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {resources.map((resource) => (
              <div 
                key={resource.id}
                className="bg-white rounded-3xl border border-slate-100 p-10 hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center group"
              >
                {/* Icon */}
                <div className="mb-8 p-6 bg-slate-50 rounded-2xl group-hover:bg-slate-100 transition-colors duration-300">
                  {getIconComponent(resource.icon, resource.icon_color)}
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold text-gray-900 mb-6 leading-tight">
                  {resource.title}
                </h2>

                {/* Description */}
                <p className="text-gray-600 text-lg leading-relaxed mb-8 flex-1">
                  {resource.description}
                </p>

                {/* Button */}
                <Button 
                  className={getButtonClass(resource.button_color)}
                  size="lg"
                  asChild
                >
                  <a href={resource.button_link}>
                    {resource.button_text}
                  </a>
                </Button>
              </div>
            ))}
          </div>

          {/* Features Section */}
          <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-3xl p-12">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Why Choose Our Resources?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-white rounded-full p-6 w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-lg">
                  <GraduationCap className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Expert Content</h3>
                <p className="text-gray-600 text-base leading-relaxed">
                  Curated by industry professionals with deep knowledge of Rwandan job markets
                </p>
              </div>
              <div className="text-center">
                <div className="bg-white rounded-full p-6 w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-lg">
                  <Star className="h-10 w-10 text-yellow-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Proven Results</h3>
                <p className="text-gray-600 text-base leading-relaxed">
                  Thousands of successful candidates who landed their dream jobs using our materials
                </p>
              </div>
              <div className="text-center">
                <div className="bg-white rounded-full p-6 w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-lg">
                  <UserCheck className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Career Growth</h3>
                <p className="text-gray-600 text-base leading-relaxed">
                  Comprehensive preparation that gives you confidence to excel in interviews and exams
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}