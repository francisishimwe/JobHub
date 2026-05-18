"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { BookOpen, Lock, AlertCircle, CheckCircle, ArrowLeft } from "lucide-react"

interface Question {
  id: string
  assessment_number: number
  question_text: string
  options: string[]
  correct_answer: string
}

export default function RoadRulesAssessmentsPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [hasAccess, setHasAccess] = useState(false)
  const [questions, setQuestions] = useState<Question[]>([])
  const [selectedAssessment, setSelectedAssessment] = useState<number | null>(null)
  const [assessmentQuestions, setAssessmentQuestions] = useState<Question[]>([])

  useEffect(() => {
    checkAccessAndFetchQuestions()
  }, [user])

  const checkAccessAndFetchQuestions = async () => {
    try {
      setLoading(true)
      
      // Check if user is authenticated
      if (!isAuthenticated) {
        setHasAccess(false)
        setLoading(false)
        return
      }

      // Fetch user's quiz access status from database
      const userData = user as any
      const phoneNumber = userData?.phone_number || userData?.email
      
      if (!phoneNumber) {
        setHasAccess(false)
        setLoading(false)
        return
      }

      // Fetch quiz access status from database
      const accessResponse = await fetch(`/api/user-quiz-access?phone_number=${encodeURIComponent(phoneNumber)}`)
      const accessData = await accessResponse.json()
      
      if (!accessData.success || !accessData.user) {
        setHasAccess(false)
        setLoading(false)
        return
      }

      const dbUser = accessData.user
      const hasQuizAccess = dbUser.quiz_access === true
      const quizAccessExpiry = dbUser.quiz_access_expiry
      
      if (!hasQuizAccess) {
        setHasAccess(false)
        setLoading(false)
        return
      }

      // Check if access is still valid
      if (quizAccessExpiry && new Date(quizAccessExpiry) < new Date()) {
        setHasAccess(false)
        setLoading(false)
        return
      }

      // User has access, fetch questions
      const response = await fetch("/api/road-rules-questions")
      const data = await response.json()
      
      if (data.success) {
        setQuestions(data.questions || [])
        setHasAccess(true)
      } else {
        setError(data.message || "Ikibazo gikomeye serivisi")
      }
    } catch (err) {
      console.error("Fetch error:", err)
      setError("Ikibazo gikomeye serivisi")
    } finally {
      setLoading(false)
    }
  }

  const handleSelectAssessment = (assessmentNumber: number) => {
    const assessmentQuestions = questions.filter(q => q.assessment_number === assessmentNumber)
    setAssessmentQuestions(assessmentQuestions)
    setSelectedAssessment(assessmentNumber)
  }

  const handleBackToAssessments = () => {
    setSelectedAssessment(null)
    setAssessmentQuestions([])
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <Card className="bg-white border border-red-50 p-8">
            <div className="text-center">
              <Lock className="h-16 w-16 mx-auto mb-4 text-red-600" />
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Isuzumabumenyi Bihariwe
              </h2>
              <Alert className="mb-6 border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  Banza ufungure konti cyangwa wishyure ngo ukore isuzumabumenyi
                </AlertDescription>
              </Alert>
              <Alert className="mb-6 border-blue-200 bg-blue-50">
                <AlertDescription className="text-blue-800">
                  <div className="space-y-2 text-sm">
                    <p className="font-semibold">
                      Kugira ngo ukore ibizamini, usabwa kwishyura 1000 Rwf kuri 0783074056 (ISHIMWE FRANCIS).
                    </p>
                    <p>
                      Mugihe umaze kwishyura, umuhamagare Admin kugira ngo aguhe uburenganzira.
                    </p>
                  </div>
                </AlertDescription>
              </Alert>
              <div className="space-y-4">
                <Button
                  onClick={() => router.push("/membership-signup")}
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                >
                  Fungura Konti
                </Button>
                <Button
                  onClick={() => router.push("/road-rules")}
                  variant="outline"
                  className="w-full"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Subira Iburyo
                </Button>
              </div>
            </div>
          </Card>
        </div>
        <Footer />
      </div>
    )
  }

  if (selectedAssessment !== null) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <Button
            onClick={handleBackToAssessments}
            variant="outline"
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Subira ku Isuzuma
          </Button>

          <Card className="bg-white border border-blue-50 p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              Isuzuma {selectedAssessment}
            </h2>

            {assessmentQuestions.length === 0 ? (
              <Alert className="border-yellow-200 bg-yellow-50">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800">
                  Nta bibazo biri muri iyi isuzuma. Admin yongeremo ibibazo.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-6">
                {assessmentQuestions.map((question, index) => (
                  <Card key={question.id} className="p-6 bg-slate-50">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">
                      {index + 1}. {question.question_text}
                    </h3>
                    <div className="space-y-2">
                      {question.options.map((option, optIndex) => (
                        <div
                          key={optIndex}
                          className="p-3 border rounded-lg hover:bg-white transition-colors cursor-pointer"
                        >
                          <span className="font-medium mr-2">
                            {String.fromCharCode(65 + optIndex)}.
                          </span>
                          {option}
                        </div>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </Card>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Isuzuma z'Amategeko y'Umuhanda
          </h1>
          <p className="text-slate-600">
            Hitamo isuzuma ukwishyure gutangira.
          </p>
        </div>

        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
            const questionCount = questions.filter(q => q.assessment_number === num).length
            return (
              <Card
                key={num}
                className="p-6 bg-white border border-blue-50 hover:border-blue-200 transition-colors cursor-pointer"
                onClick={() => handleSelectAssessment(num)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-1">
                      Isuzuma {num}
                    </h3>
                    <p className="text-sm text-slate-600">
                      {questionCount} {questionCount === 1 ? 'ikibazo' : 'ibibazo'}
                    </p>
                  </div>
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </Card>
            )
          })}
        </div>

        {questions.length === 0 && (
          <Alert className="mt-6 border-yellow-200 bg-yellow-50">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              Nta isuzuma ziri muri bubiko. Admin yongeremo ibibazo mbere yo gutangira.
            </AlertDescription>
          </Alert>
        )}
      </div>
      <Footer />
    </div>
  )
}
