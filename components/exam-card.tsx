"use client"

import { Exam } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Clock, Users, Star, Building2, Download, Play } from "lucide-react"
import Link from "next/link"

interface ExamCardProps {
  exam: Exam
  onTakeExam?: (examId: string) => void
  onDownloadPDF?: (pdfUrl: string) => void
  className?: string
}

export function ExamCard({ exam, onTakeExam, onDownloadPDF, className = "" }: ExamCardProps) {
  const getCategoryColor = (category: string) => {
    switch (category?.toLowerCase()) {
      case "past paper":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "mock test":
        return "bg-green-100 text-green-800 border-green-200"
      case "practice test":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "assessment":
        return "bg-orange-100 text-orange-800 border-orange-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case "beginner":
        return "bg-green-50 text-green-700 border-green-200"
      case "intermediate":
        return "bg-yellow-50 text-yellow-700 border-yellow-200"
      case "advanced":
        return "bg-red-50 text-red-700 border-red-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  const formatDuration = (duration?: string, durationMinutes?: number) => {
    if (durationMinutes) {
      return `${durationMinutes} minutes`
    }
    if (duration) {
      return duration
    }
    return "Not specified"
  }

  const handleTakeExam = () => {
    if (onTakeExam) {
      onTakeExam(exam.id)
    }
  }

  const handleDownloadPDF = () => {
    if (onDownloadPDF && exam.pdf_url) {
      onDownloadPDF(exam.pdf_url)
    } else if (exam.pdf_url) {
      window.open(exam.pdf_url, '_blank')
    }
  }

  return (
    <Card className={`h-full flex flex-col hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-white ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg text-gray-900 mb-2 leading-tight line-clamp-2">
              {exam.title}
            </h3>
            <div className="flex flex-wrap items-center gap-2">
              <Badge className={`text-xs font-medium ${getCategoryColor(exam.category || 'General')}`}>
                {exam.category || 'General'}
              </Badge>
              {exam.difficulty_level && (
                <Badge variant="outline" className={`text-xs ${getDifficultyColor(exam.difficulty_level)}`}>
                  {exam.difficulty_level}
                </Badge>
              )}
            </div>
          </div>
        </div>
        
        {exam.institution && (
          <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
            <Building2 className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{exam.institution}</span>
          </div>
        )}
      </CardHeader>

      <CardContent className="flex-1 pb-3">
        {exam.description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-3 leading-relaxed">
            {exam.description}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{formatDuration(exam.duration, exam.duration_minutes)}</span>
          </div>
          
          {exam.total_questions && exam.total_questions > 0 && (
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{exam.total_questions} questions</span>
            </div>
          )}
          
          {exam.participants && exam.participants > 0 && (
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{exam.participants} taken</span>
            </div>
          )}
          
          {exam.rating && exam.rating > 0 && (
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>{exam.rating.toFixed(1)}</span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-3 border-t">
        <div className="flex flex-col sm:flex-row gap-2 w-full">
          {exam.exam_type === 'PDF Download' && exam.pdf_url ? (
            <Button
              onClick={handleDownloadPDF}
              className="flex-1 gap-2 bg-blue-600 hover:bg-blue-700 text-white"
              size="sm"
            >
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
          ) : (
            <Button
              onClick={handleTakeExam}
              className="flex-1 gap-2 bg-green-600 hover:bg-green-700 text-white"
              size="sm"
              asChild
            >
              <Link href={`/exams/${exam.id}/take`}>
                <Play className="h-4 w-4" />
                Take Exam
              </Link>
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
