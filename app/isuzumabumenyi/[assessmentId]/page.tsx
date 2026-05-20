"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Clock, CheckCircle, XCircle } from "lucide-react"

interface RoadRulesQuestion {
  id: string
  assessment_number: number
  question_text: string
  options: string[]
  correct_answer: string
  time_limit: number
  created_at: string
}

interface UserAnswer {
  questionId: string
  selectedOption: string
  isCorrect: boolean
}

export default function AssessmentDetailPage() {
  const router = useRouter()
  const params = useParams()
  const assessmentId = parseInt(params.assessmentId as string)
  
  const [questions, setQuestions] = useState<RoadRulesQuestion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([])
  const [showResults, setShowResults] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState<number>(0)
  const [quizStarted, setQuizStarted] = useState(false)

  useEffect(() => {
    checkAuthAndFetchQuestions()
  }, [assessmentId])

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null
    if (quizStarted && timeRemaining > 0 && !showResults) {
      timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleSubmit()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => {
      if (timer) clearInterval(timer)
    }
  }, [quizStarted, timeRemaining, showResults])

  const checkAuthAndFetchQuestions = async () => {
    try {
      // Check if user is authenticated and approved
      const authResponse = await fetch("/api/auth/check")
      const authData = await authResponse.json()

      if (!authData.success || !authData.isApproved) {
        router.push('/membership-signup')
        return
      }

      // Fetch questions for this specific assessment
      const response = await fetch(`/api/road-rules-questions?assessment_number=${assessmentId}`)
      const data = await response.json()

      if (data.success) {
        const filteredQuestions = data.questions?.filter(
          (q: RoadRulesQuestion) => q.assessment_number === assessmentId
        ) || []
        
        setQuestions(filteredQuestions)
        
        // Calculate total time (5 minutes per question)
        const totalTime = filteredQuestions.length * 300
        setTimeRemaining(totalTime)
      } else {
        setError(data.message || "Ikibazo kubona ibibazo")
      }
    } catch (err) {
      console.error("Fetch questions error:", err)
      setError("Ikibazo gikomeye serivisi")
    } finally {
      setLoading(false)
    }
  }

  const handleStartQuiz = () => {
    setQuizStarted(true)
  }

  const handleAnswerSelect = (questionId: string, selectedOption: string, correctAnswer: string) => {
    setUserAnswers(prev => {
      const existing = prev.find(a => a.questionId === questionId)
      if (existing) {
        return prev.map(a => 
          a.questionId === questionId 
            ? { ...a, selectedOption, isCorrect: selectedOption === correctAnswer }
            : a
        )
      }
      return [...prev, { questionId, selectedOption, isCorrect: selectedOption === correctAnswer }]
    })
  }

  const handleSubmit = () => {
    setShowResults(true)
    setQuizStarted(false)
  }

  const handleBackToSelection = () => {
    router.push('/isuzumabumenyi')
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const correctAnswers = userAnswers.filter(a => a.isCorrect).length
  const totalQuestions = questions.length
  const score = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0

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

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Button
            onClick={handleBackToSelection}
            variant="outline"
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Subira kuri Isuzuma
          </Button>
          
          <Card className="p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Nta bibazo biri muri Isuzuma {assessmentId}
            </h2>
            <p className="text-gray-600 mb-6">
              Iyi isuzuma iraguka ibibazo bishya. Subira nyuma mukanya.
            </p>
            <Button onClick={handleBackToSelection}>
              Subira kuri Isuzuma
            </Button>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <Button
            onClick={handleBackToSelection}
            variant="outline"
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Subira kuri Isuzuma
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Isuzuma {assessmentId}
              </h1>
              <p className="text-slate-600">
                {totalQuestions} ibibazo • {formatTime(timeRemaining)}
              </p>
            </div>
            
            {quizStarted && !showResults && (
              <Badge variant="outline" className="text-lg px-4 py-2">
                <Clock className="h-4 w-4 mr-2" />
                {formatTime(timeRemaining)}
              </Badge>
            )}
          </div>
        </div>

        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {!quizStarted && !showResults && (
          <Card className="p-8 text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Tangira Isuzuma {assessmentId}
            </h2>
            <p className="text-gray-600 mb-6">
              Iyi isuzuma ira {totalQuestions} ibibazo. Uraze igihe: {formatTime(timeRemaining)}.
            </p>
            <Button
              onClick={handleStartQuiz}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
              size="lg"
            >
              Tangira Isuzuma
            </Button>
          </Card>
        )}

        {showResults && (
          <Card className="p-8 text-center mb-6 bg-gradient-to-r from-blue-50 to-indigo-50">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Igisubizo cyawe
            </h2>
            <div className="text-6xl font-bold text-blue-600 mb-4">
              {score}%
            </div>
            <p className="text-gray-600 mb-6">
              Wahisanye {correctAnswers} kuri {totalQuestions} ibibazo neza
            </p>
            <div className="flex justify-center gap-4">
              <Button
                onClick={handleBackToSelection}
                variant="outline"
              >
                Subira kuri Isuzuma
              </Button>
              <Button
                onClick={() => {
                  setShowResults(false)
                  setQuizStarted(false)
                  setUserAnswers([])
                  setTimeRemaining(questions.length * 300)
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Subirira Isuzuma
              </Button>
            </div>
          </Card>
        )}

        {quizStarted && (
          <div className="space-y-6">
            {questions.map((question, index) => {
              const userAnswer = userAnswers.find(a => a.questionId === question.id)
              const optionLabels = ['A', 'B', 'C', 'D']
              
              return (
                <Card key={question.id} className="p-6">
                  <div className="mb-4">
                    <Badge variant="outline" className="mb-2">
                      Ikibazo {index + 1}
                    </Badge>
                    <h3 className="text-lg font-medium text-gray-900">
                      {question.question_text}
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {question.options.map((option, optionIndex) => {
                      const isSelected = userAnswer?.selectedOption === option
                      const isCorrect = option === question.correct_answer
                      const showResult = showResults
                      
                      let buttonClass = "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                      
                      if (showResult) {
                        if (isCorrect) {
                          buttonClass = "border-green-500 bg-green-50 text-green-800"
                        } else if (isSelected && !isCorrect) {
                          buttonClass = "border-red-500 bg-red-50 text-red-800"
                        }
                      } else if (isSelected) {
                        buttonClass = "border-blue-500 bg-blue-50 text-blue-800"
                      }

                      return (
                        <button
                          key={optionIndex}
                          onClick={() => !showResults && handleAnswerSelect(question.id, option, question.correct_answer)}
                          disabled={showResults}
                          className={`w-full text-left p-4 rounded-lg border-2 transition-all ${buttonClass}`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-lg">
                              {optionLabels[optionIndex]}
                            </span>
                            <span>{option}</span>
                            {showResult && isCorrect && (
                              <CheckCircle className="h-5 w-5 text-green-600 ml-auto" />
                            )}
                            {showResult && isSelected && !isCorrect && (
                              <XCircle className="h-5 w-5 text-red-600 ml-auto" />
                            )}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </Card>
              )
            })}

            {!showResults && (
              <div className="flex justify-center gap-4">
                <Button
                  onClick={handleSubmit}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
                  size="lg"
                  disabled={userAnswers.length !== questions.length}
                >
                  Ohereza Igisubizo
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
