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

          {/* Resources Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {resources.map((resource) => (
              <Card key={resource.id} className="hover:shadow-lg transition-all duration-300 group">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {getCategoryIcon(resource.category)}
                      <div>
                        <CardTitle className="text-xl font-semibold text-gray-900">
                          {resource.title}
                        </CardTitle>
                        <p className="text-sm text-gray-600 mt-1">
                          {resource.institution}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {getCategoryBadge(resource.category)}
                      {resource.featured && (
                        <Badge className="bg-yellow-100 text-yellow-800">
                          <Star className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-4">
                    {/* Content Type Indicator */}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      {resource.content_type === 'TEXT' ? (
                        <>
                          <FileText className="h-4 w-4" />
                          <span>Text Content</span>
                        </>
                      ) : (
                        <>
                          <BookOpen className="h-4 w-4" />
                          <span>PDF Document</span>
                        </>
                      )}
                    </div>

                    {/* Reading Time */}
                    {resource.estimated_reading_time && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>{resource.estimated_reading_time} min read</span>
                      </div>
                    )}

                    {/* View Count */}
                    {resource.view_count && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Eye className="h-4 w-4" />
                        <span>{resource.view_count} views</span>
                      </div>
                    )}

                    {/* Description */}
                    <div className="text-gray-700 line-clamp-3">
                      {resource.text_content ? (
                        <div 
                          dangerouslySetInnerHTML={{ 
                            __html: resource.text_content.length > 150 
                              ? resource.text_content.substring(0, 150) + '...' 
                              : resource.text_content 
                          }} 
                        />
                      ) : (
                        <p>Click to View this {resource.category.toLowerCase().replace('_', ' ')} resource</p>
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
