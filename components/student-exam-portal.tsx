"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, X, Clock, Play } from "lucide-react"

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
}

export function StudentExamPortal() {
  const router = useRouter()
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [timeLeft, setTimeLeft] = useState(1200) // 20 minutes in seconds
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [results, setResults] = useState<ExamResult[]>([])
  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    fetchQuestions()
  }, [])

  useEffect(() => {
    if (timeLeft > 0 && !isSubmitted) {
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
  }, [timeLeft, isSubmitted])

  const fetchQuestions = async () => {
    try {
      const response = await fetch("/api/exam-questions")
      const data = await response.json()
      
      if (data.success) {
        setQuestions(data.questions)
      }
    } catch (err) {
      console.error("Failed to fetch questions:", err)
    }
  }

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }))
  }

  const handleSubmit = async () => {
    setIsSubmitted(true)
    setTimeLeft(0)

    try {
      const response = await fetch("/api/submit-exam", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          answers
        }),
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
                            className={`p-3 rounded border text-sm ${
                              result.user_answer === option
                                ? result.is_correct
                                  ? "bg-green-100 border-green-300 text-green-800"
                                  : "bg-red-100 border-red-300 text-red-800"
                                : "bg-slate-100 border-slate-300"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                                result.is_correct && result.user_answer === option
                                  ? "bg-green-600 text-white border-green-700"
                                  : "bg-red-600 text-white border-red-700"
                              }`}>
                                {String.fromCharCode(65 + optIndex)}
                              </div>
                              <span>{option}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {!result.is_correct && (
                        <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <p className="text-sm text-blue-800 font-medium">
                            <strong>Igikorwa:</strong> {result.correct_answer}
                          </p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              <div className="text-center">
                <Button 
                  onClick={() => router.push("/road-rules")}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Subira kuri Iga Amategeko
                </Button>
              </div>
            </Card>
          </div>
        </div>
    )
  }

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
            <h1 className="text-3xl font-bold text-slate-900 mb-4">
              Nukura aya masuzumabumenyi yose, nta kabuza uzatsinda ikizamini cya provisoire.
            </h1>
          </div>

          {/* Timer */}
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

          {/* Progress */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-slate-600">Ikibamino {currentQuestion + 1} / {questions.length}</span>
              <div className="flex gap-1">
                {questions.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index < currentQuestion ? "bg-blue-600" : "bg-slate-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Question */}
          <div className="mb-6">
            <Card className="p-6">
              <div className="flex items-start gap-3 mb-4">
                <Badge variant="default" className="text-sm">
                  {currentQuestion + 1}
                </Badge>
                <h2 className="text-xl font-semibold flex-1">{question.question_text}</h2>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {question.options.map((option, index) => (
                  <Button
                    key={index}
                    variant={answers[question.id] === option ? "default" : "outline"}
                    className={`p-4 text-left justify-start h-auto min-h-[60px] ${
                      answers[question.id] === option
                        ? "bg-blue-600 text-white border-blue-700"
                        : "bg-white text-slate-900 border-slate-300 hover:bg-slate-50"
                    }`}
                    onClick={() => handleAnswer(question.id, option)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                        answers[question.id] === option
                          ? "bg-blue-600 text-white border-blue-700"
                          : "bg-slate-300 text-slate-700"
                      }`}>
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span>{option}</span>
                    </div>
                  </Button>
                ))}
              </div>
            </Card>
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
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
