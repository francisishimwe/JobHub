"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, X, Clock, Play, BookOpen } from "lucide-react"

interface Question {
  id: string
  question_text: string
  options: string[]
  correct_answer: string
  time_limit: number
}

interface ExamResult {
  question_id: string
  user_answer: string
  is_correct: boolean
  correct_answer: string
}

export function StudentExamPortal() {
  const router = useRouter()
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [timeLeft, setTimeLeft] = useState(1200)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [results, setResults] = useState<ExamResult[]>([])
  const [showResults, setShowResults] = useState(false)
  const [currentExam, setCurrentExam] = useState<number | null>(null)
  const [showExamDashboard, setShowExamDashboard] = useState(true)

  useEffect(() => {
    fetchQuestions()
  }, [])

  useEffect(() => {
    if (timeLeft > 0 && !isSubmitted && currentExam !== null) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer)
            handleSubmit()
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [timeLeft, isSubmitted, currentExam])

  const fetchQuestions = async () => {
    try {
      const response = await fetch("/api/road-rules-questions")
      const data = await response.json()
      if (data.success) {
        setQuestions(data.questions)
      }
    } catch (err) {
      console.error("Failed to fetch road rules questions:", err)
    }
  }

  const startExam = (examNumber: number) => {
    setCurrentExam(examNumber)
    setShowExamDashboard(false)
    setTimeLeft(1200) // 20 minutes for each exam
    setCurrentQuestion(0)
    setAnswers({})
    setIsSubmitted(false)
    setResults([])
    setShowResults(false)
  }

  const handleAnswer = (answer: string) => {
    if (!questions[currentQuestion]) return
    setAnswers(prev => ({
      ...prev,
      [questions[currentQuestion].id]: answer
    }))
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    } else {
      handleSubmit()
    }
  }

  const handleSubmit = async () => {
    if (isSubmitted) return
    
    setIsSubmitted(true)
    
    try {
      const response = await fetch("/api/submit-exam", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ answers }),
      })

      const data = await response.json()
      if (data.success) {
        setResults(data.results)
        setShowResults(true)
      }
    } catch (err) {
      console.error("Failed to submit exam:", err)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getScore = () => {
    const correct = results.filter(r => r.is_correct).length
    return `${correct} / ${results.length}`
  }

  // Exam Dashboard View
  if (showExamDashboard) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-6xl mx-auto">
          <Card className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-slate-900 mb-4">
                Nukora aya masuzumabumenyi yose, nta kabuza uzatsinda ikizamini cya provisoire.
              </h1>
              <p className="text-lg text-slate-600">
                Kanda kuri isuzumabumenyi uri kwihangira kugirango utangire.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {[...Array(10)].map((_, index) => (
                <Card 
                  key={index + 1}
                  className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer transition-all duration-200 transform hover:scale-105 border-0"
                  onClick={() => startExam(index + 1)}
                >
                  <div className="p-6 text-center">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 text-white opacity-90" />
                    <h3 className="text-xl font-bold mb-2">
                      Isuzumabumenyi rya {index + 1}
                    </h3>
                    <p className="text-blue-100 text-sm">
                      20 min • 10 ibibazo
                    </p>
                    <div className="mt-4 flex items-center justify-center">
                      <Play className="h-5 w-5 mr-2" />
                      <span className="font-semibold">Tangira</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Button 
                onClick={() => router.push("/road-rules")}
                variant="outline"
                className="px-6 py-3"
              >
                Subira kuri Iga Amategeko
              </Button>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  // Results View
  if (showResults) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="p-8">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-slate-900 mb-4">
                Isuzumabumenyi Yose Byanze!
              </h1>
              <div className="text-lg text-slate-600 mb-6">
                <p className="mb-2">Wowe muri {getScore()}</p>
                <p className="text-2xl font-bold text-green-600">
                  {results.filter(r => r.is_correct).length} / {results.length}
                </p>
              </div>

              <div className="space-y-4">
                {results.map((result, index) => {
                  const question = questions.find(q => q.id === result.question_id)
                  return (
                    <div key={result.question_id} className="border rounded-lg p-4">
                      <div className="flex items-start gap-3 mb-3">
                        <Badge variant={result.is_correct ? "default" : "destructive"} className="text-sm">
                          {index + 1}
                        </Badge>
                        <p className="flex-1 font-medium">{question?.question_text}</p>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-2">
                        {question?.options.map((option, optIndex) => (
                          <div
                            key={optIndex}
                            className={`p-2 rounded border ${
                              option === result.correct_answer
                                ? "bg-green-50 border-green-300 text-green-800"
                                : option === result.user_answer && !result.is_correct
                                ? "bg-red-50 border-red-300 text-red-800"
                                : "bg-slate-50 border-slate-200"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              {option === result.correct_answer && (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              )}
                              {option === result.user_answer && !result.is_correct && (
                                <X className="h-4 w-4 text-red-600" />
                              )}
                              <span>{option}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {!result.is_correct && (
                        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                          <p className="text-sm text-yellow-800">
                            <strong>Igisubizo cy'ukuri:</strong> {result.correct_answer}
                          </p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              <div className="text-center mt-6 space-y-3">
                <Button 
                  onClick={() => setShowExamDashboard(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white mr-3"
                >
                  Subira kuri Dashboard
                </Button>
                <Button 
                  onClick={() => router.push("/road-rules")}
                  variant="outline"
                >
                  Subira kuri Iga Amategeko
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  // Exam Taking View
  const question = questions[currentQuestion]
  if (!question) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto">
        <Card className="p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Isuzumabumenyi rya {currentExam}
            </h1>
            <p className="text-slate-600">
              Nukura aya masuzumabumenyi yose, nta kabuza uzatsinda ikizamini cya provisoire.
            </p>
          </div>

          <div className="text-center mb-6">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${
              timeLeft <= 60 ? "bg-red-100 border-red-300" : "bg-blue-100 border-blue-300"
            }`}>
              <Clock className="h-6 w-6" />
              <span className={`text-lg font-bold ${timeLeft <= 60 ? "text-red-600" : "text-blue-600"}`}>
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              {question.question_text}
            </h2>

            <div className="space-y-3">
              {question.options.map((option, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className={`w-full text-left justify-start h-auto p-4 ${
                    answers[question.id] === option
                      ? "bg-blue-50 border-blue-300"
                      : "bg-white border-slate-200"
                  }`}
                  onClick={() => handleAnswer(option)}
                >
                  <span>{option}</span>
                </Button>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
              disabled={currentQuestion === 0}
            >
              Ibanjir
            </Button>
            
            <Button
              onClick={handleSubmit}
              className="bg-green-600 hover:bg-green-700 text-white"
              disabled={isSubmitted}
            >
              {isSubmitted ? "Byanzwe..." : "Ohereza Ikizamini"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
