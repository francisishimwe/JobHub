"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { BookOpen, Lock } from "lucide-react"

interface AssessmentData {
  assessment_number: number
  question_count: number
}

export default function AssessmentSelectionPage() {
  const router = useRouter()
  const [assessments, setAssessments] = useState<AssessmentData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [userStatus, setUserStatus] = useState<string | null>(null)

  useEffect(() => {
    checkAuthAndFetchAssessments()
  }, [])

  const checkAuthAndFetchAssessments = async () => {
    try {
      // Check if user is authenticated and approved
      const authResponse = await fetch("/api/auth/check")
      const authData = await authResponse.json()

      if (!authData.success || !authData.isApproved) {
        router.push('/membership-signup')
        return
      }

      setUserStatus(authData.status)

      // Fetch assessment data
      const response = await fetch("/api/road-rules-questions")
      const data = await response.json()

      if (data.success) {
        // Group questions by assessment number
        const assessmentMap = new Map<number, number>()
        
        if (data.questions && Array.isArray(data.questions)) {
          data.questions.forEach((question: any) => {
            const num = question.assessment_number
            assessmentMap.set(num, (assessmentMap.get(num) || 0) + 1)
          })
        }

        // Create assessment data for all 10 assessments
        const assessmentData: AssessmentData[] = Array.from({ length: 10 }, (_, i) => ({
          assessment_number: i + 1,
          question_count: assessmentMap.get(i + 1) || 0
        }))

        setAssessments(assessmentData)
      } else {
        setError(data.message || "Ikibazo kubona isuzuma")
      }
    } catch (err) {
      console.error("Fetch assessments error:", err)
      setError("Ikibazo gikomeye serivisi")
    } finally {
      setLoading(false)
    }
  }

  const handleAssessmentClick = (assessmentNumber: number) => {
    router.push(`/isuzumabumenyi/${assessmentNumber}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Tegereza...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-full mb-4">
            <BookOpen className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Hitamo Isuzuma ry'Amategeko
          </h1>
          <p className="text-slate-600 text-lg">
            Hitamo isuzuma ushaka gukora kugirango ugerageze ubumenyi bwawe ku mategeko y'umuhanda
          </p>
        </div>

        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Assessment Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {assessments.map((assessment) => (
            <Card
              key={assessment.assessment_number}
              onClick={() => handleAssessmentClick(assessment.assessment_number)}
              className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white p-6 transition-all duration-200 hover:scale-105 hover:shadow-lg"
            >
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">
                  {assessment.assessment_number}
                </div>
                <div className="text-lg font-semibold mb-3">
                  Isuzuma {assessment.assessment_number}
                </div>
                <div className="text-sm opacity-90">
                  {assessment.question_count} ibibazo
                </div>
                {assessment.question_count === 0 && (
                  <div className="mt-2 text-xs opacity-75">
                    <Lock className="h-3 w-3 inline mr-1" />
                    Nta bibazo
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center text-gray-600">
          <p className="text-sm">
            Kanda kuri isuzuma ushakiye kugirango utangire isuzumabumenyi
          </p>
        </div>
      </div>
    </div>
  )
}
