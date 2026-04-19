"use client"

import { useState, useEffect } from "react"
import { useRouter } from 'next/navigation'
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BookOpen, FileText, GraduationCap, Star, UserCheck, Clock, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Resource {
  id: string
  title: string
  category: 'WRITTEN_EXAM' | 'INTERVIEW_PREP'
  content_type: 'TEXT' | 'PDF_URL'
  text_content?: string
  file_url?: string
  institution: string
  featured: boolean
  estimated_reading_time?: number
  view_count?: number
  created_at: string
  updated_at: string
}

export default function ExamsPage() {
  const router = useRouter()
  const [resources, setResources] = useState<Resource[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchResources()
  }, [])

  const fetchResources = async () => {
    try {
      const response = await fetch('/api/exam-resources-simple')
      const data = await response.json()
      setResources(data.resources || [])
    } catch (error) {
      console.error('Error fetching resources:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'WRITTEN_EXAM':
        return <GraduationCap className="h-8 w-8 text-blue-600" />
      case 'INTERVIEW_PREP':
        return <UserCheck className="h-8 w-8 text-orange-600" />
      default:
        return <BookOpen className="h-8 w-8 text-gray-600" />
    }
  }

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'WRITTEN_EXAM':
        return <Badge className="bg-blue-100 text-blue-800">Written Exam</Badge>
      case 'INTERVIEW_PREP':
        return <Badge className="bg-orange-100 text-orange-800">Interview Prep</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">General</Badge>
    }
  }

  const handleViewResource = (resource: Resource) => {
    router.push(`/prep/${resource.id}`)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading exam resources...</p>
          </div>
        </div>
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

          {/* Resources Grid - Horizontal Layout */}
          <div className="flex flex-row gap-4 overflow-x-auto pb-4 mb-16 min-h-96">
            {resources.map((resource) => (
              <Card key={resource.id} className="hover:shadow-md transition-all duration-200 group flex-shrink-0 w-80">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {getCategoryIcon(resource.category)}
                      <div className="min-w-0 flex-1">
                        <CardTitle className="text-sm font-semibold text-gray-900 truncate">
                          {resource.title}
                        </CardTitle>
                        <p className="text-xs text-gray-600 truncate">{resource.institution}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      {getCategoryBadge(resource.category)}
                      {resource.featured && (
                        <Badge className="bg-yellow-100 text-yellow-800 text-xs">Featured</Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      {resource.estimated_reading_time && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{resource.estimated_reading_time} min</span>
                        </div>
                      )}
                      {resource.view_count && (
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          <span>{resource.view_count}</span>
                        </div>
                      )}
                    
                    {resource.text_content && (
                      <div className="text-xs text-gray-700 line-clamp-2">
                        <div dangerouslySetInnerHTML={{ 
                          __html: resource.text_content.length > 80 
                            ? resource.text_content.substring(0, 80) + '...' 
                            : resource.text_content 
                        }} />
                      </div>
                    )}
                    
                    {!resource.text_content && (
                      <p className="text-xs text-gray-500">Click to View this {resource.category.toLowerCase().replace('_', ' ')} resource</p>
                    )}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="mt-6 pt-4 border-t">
                    <Button 
                      className="w-full"
                      size="lg"
                      onClick={() => handleViewResource(resource)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Resource
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {resources.length === 0 && (
            <div className="text-center py-16">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Exam Resources Available
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Exam preparation resources will be available soon. Check back later for study materials and interview guides.
              </p>
            </div>
          )}

          {/* Features Section */}
          <div className="bg-blue-50 rounded-3xl p-8 mb-16">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-blue-900 mb-6 text-center">
                Why Choose Our Resources?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div className="space-y-4">
                  <BookOpen className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-blue-900">Comprehensive Coverage</h3>
                  <p className="text-gray-600">
                    Written exams and interview prep for major institutions
                  </p>
                </div>
                <div className="space-y-4">
                  <GraduationCap className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-blue-900">Expert-Verified Content</h3>
                  <p className="text-gray-600">
                    All resources reviewed by industry professionals
                  </p>
                </div>
                <div className="space-y-4">
                  <Star className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-blue-900">Regular Updates</h3>
                  <p className="text-gray-600">
                    New materials added frequently
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
