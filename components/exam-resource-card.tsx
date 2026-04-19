"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Clock, Eye, BookOpen, FileText } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface ExamResource {
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

interface ExamResourceCardProps {
  resource: ExamResource
  compact?: boolean
}

export function ExamResourceCard({ resource, compact = false }: ExamResourceCardProps) {
  const router = useRouter()

  const getCategoryIcon = () => {
    switch (resource.category) {
      case 'WRITTEN_EXAM':
        return <BookOpen className="h-5 w-5 text-blue-600" />
      case 'INTERVIEW_PREP':
        return <FileText className="h-5 w-5 text-orange-600" />
      default:
        return <BookOpen className="h-5 w-5 text-gray-600" />
    }
  }

  const getCategoryBadge = () => {
    switch (resource.category) {
      case 'WRITTEN_EXAM':
        return <Badge className="bg-blue-100 text-blue-800 text-xs">Written Exam</Badge>
      case 'INTERVIEW_PREP':
        return <Badge className="bg-orange-100 text-orange-800 text-xs">Interview Prep</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800 text-xs">General</Badge>
    }
  }

  const handleViewResource = () => {
    router.push(`/prep/${resource.id}`)
  }

  if (compact) {
    return (
      <Card className="hover:shadow-md transition-all duration-200 cursor-pointer group" onClick={handleViewResource}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {getCategoryIcon()}
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-gray-900 text-sm truncate group-hover:text-blue-600 transition-colors">
                  {resource.title}
                </h3>
                <p className="text-xs text-gray-600 truncate">{resource.institution}</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1 flex-shrink-0">
              {getCategoryBadge()}
              {resource.featured && (
                <Badge className="bg-yellow-100 text-yellow-800 text-xs">Featured</Badge>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
            {resource.estimated_reading_time && (
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{resource.estimated_reading_time} min</span>
              </div>
            )}
            {resource.view_count && (
              <div className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                <span>{resource.view_count} views</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="hover:shadow-lg transition-all duration-300 group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 flex-1">
            {getCategoryIcon()}
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg line-clamp-2 group-hover:text-blue-600 transition-colors">
                {resource.title}
              </CardTitle>
              <p className="text-sm text-gray-600">{resource.institution}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            {getCategoryBadge()}
            {resource.featured && (
              <Badge className="bg-yellow-100 text-yellow-800">Featured</Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex items-center gap-4 text-sm text-gray-500">
            {resource.estimated_reading_time && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{resource.estimated_reading_time} min read</span>
              </div>
            )}
            {resource.view_count && (
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{resource.view_count} views</span>
              </div>
            )}
          </div>
          
          {resource.text_content && (
            <div className="text-sm text-gray-700 line-clamp-3">
              <div dangerouslySetInnerHTML={{ 
                __html: resource.text_content.length > 150 
                  ? resource.text_content.substring(0, 150) + '...' 
                  : resource.text_content 
              }} />
            </div>
          )}
          
          <Button 
            className="w-full mt-4"
            onClick={handleViewResource}
          >
            <Eye className="h-4 w-4 mr-2" />
            View Resource
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
